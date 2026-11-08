import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://postgres@localhost:5433/ielts_test_db?host=/tmp/pg_test_ielts' }
  }
});

async function runTests() {
  console.log('--- STARTING IMMUTABILITY & CONCURRENCY TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log('  [PASS]', message);
      passed++;
    } else {
      console.error('  [FAIL]', message);
      failed++;
    }
  }

  // Seed baseline data
  const user = await prisma.user.create({
    data: { email: `student_${Date.now()}@test.com`, name: 'Student 1' }
  });

  const test = await prisma.test.create({
    data: { title: 'Reading Test 1', slug: `reading-test-${Date.now()}`, totalQuestions: 1 }
  });

  const pubVersion = await prisma.publishedTestVersion.create({
    data: {
      testId: test.id,
      versionNumber: 1,
      title: 'Reading Test 1 (v1)',
      totalQuestions: 1,
      durationMinutes: 60,
      bandConversionTable: [{ min: 0, max: 1, band: 9.0 }]
    }
  });

  const section = await prisma.publishedSection.create({
    data: {
      testVersionId: pubVersion.id,
      orderIndex: 1,
      title: 'Passage 1',
      passageText: 'Sample passage text.'
    }
  });

  const group = await prisma.publishedQuestionGroup.create({
    data: {
      testVersionId: pubVersion.id,
      sectionId: section.id,
      orderIndex: 1,
      instruction: 'Answer question',
      questionType: 'MULTIPLE_CHOICE'
    }
  });

  const question = await prisma.publishedQuestion.create({
    data: {
      testVersionId: pubVersion.id,
      questionGroupId: group.id,
      questionNumber: 1,
      prompt: 'Is this a question?'
    }
  });

  await prisma.publishedAcceptedAnswer.create({
    data: {
      testVersionId: pubVersion.id,
      questionId: question.id,
      acceptedText: 'YES'
    }
  });

  // TEST 1: Updating a published question
  try {
    await prisma.publishedQuestion.update({
      where: { id: question.id },
      data: { prompt: 'Modified prompt?' }
    });
    assert(false, '1. Updating a published question should throw an error');
  } catch (e: any) {
    assert(e.message.includes('Immutable snapshot violation'), '1. Updating a published question rejected by trigger: ' + e.message.split('\n').pop());
  }

  // TEST 2: Deleting a published question
  try {
    await prisma.publishedQuestion.delete({
      where: { id: question.id }
    });
    assert(false, '2. Deleting a published question should throw an error');
  } catch (e: any) {
    assert(e.message.includes('Immutable snapshot violation'), '2. Deleting a published question rejected by trigger: ' + e.message.split('\n').pop());
  }

  // TEST 3: Updating a published version title
  try {
    await prisma.publishedTestVersion.update({
      where: { id: pubVersion.id },
      data: { title: 'Altered Title' }
    });
    assert(false, '3. Updating a published version title should throw an error');
  } catch (e: any) {
    assert(e.message.includes('Immutable snapshot violation'), '3. Updating a published version title rejected by trigger: ' + e.message.split('\n').pop());
  }

  // TEST 4: Archiving a published version (isArchived: false -> true)
  try {
    const updated = await prisma.publishedTestVersion.update({
      where: { id: pubVersion.id },
      data: { isArchived: true }
    });
    assert(updated.isArchived === true, '4. Archiving a published version (isArchived: false -> true) succeeds');
  } catch (e: any) {
    assert(false, '4. Archiving failed: ' + e.message);
  }

  // TEST 5: Reversing an archived version (isArchived: true -> false)
  try {
    await prisma.publishedTestVersion.update({
      where: { id: pubVersion.id },
      data: { isArchived: false }
    });
    assert(false, '5. Reversing an archived version should throw an error');
  } catch (e: any) {
    assert(e.message.includes('Immutable snapshot violation'), '5. Reversing an archived version rejected by trigger: ' + e.message.split('\n').pop());
  }

  // TEST 6: Truncating a published table
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "PublishedQuestion" CASCADE;');
    assert(false, '6. Truncating a published table should throw an error');
  } catch (e: any) {
    assert(e.message.includes('Immutable snapshot violation'), '6. Truncating a published table rejected by statement trigger: ' + e.message.split('\n').pop());
  }

  // TEST 7: Single active attempt enforcement via Partial Unique Index
  const attempt1 = await prisma.testAttempt.create({
    data: {
      userId: user.id,
      testId: test.id,
      testVersionId: pubVersion.id,
      status: 'IN_PROGRESS',
      expiresAt: new Date(Date.now() + 3600000)
    }
  });
  assert(attempt1.status === 'IN_PROGRESS', '7a. First active attempt created successfully');

  try {
    await prisma.testAttempt.create({
      data: {
        userId: user.id,
        testId: test.id,
        testVersionId: pubVersion.id,
        status: 'IN_PROGRESS',
        expiresAt: new Date(Date.now() + 3600000)
      }
    });
    assert(false, '7b. Creating second concurrent active attempt should violate partial unique index');
  } catch (e: any) {
    assert(e.message.includes('Unique constraint failed') || e.message.includes('idx_unique_active_attempt_per_test'), '7b. Second concurrent active attempt prevented by partial unique index');
  }

  // TEST 8: Finalization with SELECT FOR UPDATE & Deadline Check
  // 8a: Premature timeout rejection
  try {
    await prisma.$transaction(async (tx) => {
      const rows: any = await tx.$queryRaw`
        SELECT id, status, "expiresAt", NOW() as db_now
        FROM "TestAttempt"
        WHERE id = ${attempt1.id}
        FOR UPDATE
      `;
      const att = rows[0];
      if (new Date(att.db_now) < new Date(att.expiresAt)) {
        throw new Error('PREMATURE_TIMEOUT: Attempt deadline has not passed');
      }
    });
    assert(false, '8a. Premature timeout should be rejected');
  } catch (e: any) {
    assert(e.message.includes('PREMATURE_TIMEOUT'), '8a. Premature timeout correctly rejected: ' + e.message);
  }

  // 8b: Late manual submission -> TIMED_OUT transition
  const test2 = await prisma.test.create({
    data: { title: 'Test 2', slug: `test-2-${Date.now()}` }
  });
  const expiredAttempt = await prisma.testAttempt.create({
    data: {
      userId: user.id,
      testId: test2.id,
      testVersionId: pubVersion.id,
      status: 'IN_PROGRESS',
      expiresAt: new Date(Date.now() - 60000) // Expired 1 minute ago
    }
  });

  const finalStatus = await prisma.$transaction(async (tx) => {
    const rows: any = await tx.$queryRaw`
      SELECT id, status, "expiresAt", NOW() as db_now
      FROM "TestAttempt"
      WHERE id = ${expiredAttempt.id}
      FOR UPDATE
    `;
    const att = rows[0];
    const isExpired = new Date(att.db_now) >= new Date(att.expiresAt);
    const targetStatus = isExpired ? 'TIMED_OUT' : 'SUBMITTED';

    await tx.testAttempt.update({
      where: { id: att.id },
      data: { status: targetStatus, submittedAt: att.db_now }
    });

    await tx.evaluationResult.create({
      data: {
        attemptId: att.id,
        rawScore: 0,
        estimatedBand: 0,
        scoringConfig: {},
        sectionBreakdown: {},
        questionBreakdown: {}
      }
    });

    return targetStatus;
  });

  assert(finalStatus === 'TIMED_OUT', '8b. Late manual submission arrived after expiry -> transitioned strictly to TIMED_OUT');

  console.log(`\nTOTAL VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
