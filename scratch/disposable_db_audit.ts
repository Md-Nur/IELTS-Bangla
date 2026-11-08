/**
 * Integration Test for Disposable PostgreSQL Database
 * Audits Requirements 2 & 3:
 * - Seed Idempotency & Invariant Verification
 * - Safe Failure on Invalid Source Data
 * - Publishing Transaction Validation (Discontinuous numbering, Missing answer keys, Rollback on failure)
 * - Immutability Enforcement (Database Triggers)
 */

import { PrismaClient } from "@prisma/client";
import { publishDraftTestVersion } from "../lib/services/testPublishing";
import { mock01TestData } from "../prisma/seeds/mock01Data";

const DISPOSABLE_DB_URL = "postgresql://postgres@localhost:5433/ielts_disposable_audit";

// Safety check: NEVER connect to Neon
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("neon.tech")) {
  console.error("CRITICAL ERROR: Refusing to run tests against Neon database!");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: DISPOSABLE_DB_URL },
  },
});

async function runAudit() {
  console.log("==================================================================");
  console.log("RUNNING DISPOSABLE POSTGRESQL INTEGRATION AUDIT");
  console.log(`Target: ${DISPOSABLE_DB_URL}`);
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? "-> " + detail : ""}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // REQUIREMENT 2: SEED INTEGRATION & IDEMPOTENCY
  // -------------------------------------------------------------
  console.log("--- 1. Seed Integration & Invariant Verification (Post 2 Seed Executions) ---");

  // 1.1 Test record count
  const testRecords = await prisma.test.findMany({
    where: { slug: mock01TestData.slug },
    include: {
      draftSections: {
        include: {
          groups: {
            include: {
              questions: {
                include: {
                  acceptedAnswers: true,
                },
              },
            },
          },
        },
      },
      publishedVersions: {
        include: {
          sections: {
            include: {
              groups: {
                include: {
                  questions: {
                    include: {
                      acceptedAnswers: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  assert(testRecords.length === 1, "R2.1: Exactly 1 Test record exists (No duplicate Test)");
  const test = testRecords[0];

  // 1.2 Draft hierarchy counts
  const draftSections = test.draftSections;
  assert(draftSections.length === 3, "R2.2: Exactly 3 DraftSection records exist (Passages 1, 2, 3)");

  const draftGroups = draftSections.flatMap((s) => s.groups);
  assert(draftGroups.length === 8, "R2.3: Exactly 8 DraftQuestionGroup records exist");

  const draftQuestions = draftGroups.flatMap((g) => g.questions);
  assert(draftQuestions.length === 40, "R2.4: Exactly 40 DraftQuestion records exist (Q1 to Q40)");

  const draftAnswers = draftQuestions.flatMap((q) => q.acceptedAnswers);
  assert(draftAnswers.length === 64, `R2.5: Exactly 64 DraftAcceptedAnswer records exist (found ${draftAnswers.length})`);

  // 1.3 Published Version 1 counts
  const publishedVersions = test.publishedVersions;
  assert(publishedVersions.length === 1, "R2.6: Exactly 1 PublishedTestVersion exists (Version 1)");
  const pubV1 = publishedVersions[0];
  assert(pubV1.versionNumber === 1, "R2.7: Published version number is exactly 1");

  const pubSections = pubV1.sections;
  assert(pubSections.length === 3, "R2.8: Exactly 3 PublishedSection records exist");

  const pubGroups = pubSections.flatMap((s) => s.groups);
  assert(pubGroups.length === 8, "R2.9: Exactly 8 PublishedQuestionGroup records exist");

  const pubQuestions = pubGroups.flatMap((g) => g.questions);
  assert(pubQuestions.length === 40, "R2.10: Exactly 40 PublishedQuestion records exist");

  const pubAnswers = pubQuestions.flatMap((q) => q.acceptedAnswers);
  assert(pubAnswers.length === 64, `R2.11: Exactly 64 PublishedAcceptedAnswer records exist (found ${pubAnswers.length})`);

  // 1.4 Equality check between draft and published content
  assert(draftQuestions.length === pubQuestions.length, "R2.12: Draft question count matches published question count");
  assert(draftAnswers.length === pubAnswers.length, "R2.13: Draft answer count matches published answer count");

  // 1.5 Verify continuous question numbering in published records
  const pubQNumbers = pubQuestions.map((q) => q.questionNumber).sort((a, b) => a - b);
  const isContinuous = pubQNumbers.every((num, idx) => num === idx + 1);
  assert(isContinuous && pubQNumbers[0] === 1 && pubQNumbers[39] === 40, "R2.14: Published questions are continuously numbered 1..40");

  // 1.6 Verify seed fails safely on invalid source data (atomic rollback)
  console.log("\n--- 2. Safe Failure on Invalid Source Data (Atomic Rollback) ---");
  const preTestCount = await prisma.test.count();
  const preDraftQCount = await prisma.draftQuestion.count();

  try {
    await prisma.$transaction(async (tx) => {
      // Create invalid test
      const badTest = await tx.test.create({
        data: {
          title: "Invalid Test",
          slug: "invalid-test-rollback",
          module: "READING",
          category: "ACADEMIC",
          durationMinutes: 60,
          totalQuestions: 2,
        },
      });

      const badSec = await tx.draftSection.create({
        data: {
          testId: badTest.id,
          orderIndex: 1,
          title: "Bad Section",
          passageText: "Bad passage text.",
        },
      });

      const badGrp = await tx.draftQuestionGroup.create({
        data: {
          sectionId: badSec.id,
          orderIndex: 1,
          instruction: "Answer",
          questionType: "MULTIPLE_CHOICE",
        },
      });

      // Insert question 1 and question 3 (skipping 2 to make it invalid)
      await tx.draftQuestion.create({
        data: {
          questionGroupId: badGrp.id,
          questionNumber: 1,
          prompt: "Q1",
        },
      });
      await tx.draftQuestion.create({
        data: {
          questionGroupId: badGrp.id,
          questionNumber: 3, // gap!
          prompt: "Q3",
        },
      });

      // Attempt to publish - this MUST throw TestPublishingValidationError
      await publishDraftTestVersion(tx, {
        testId: badTest.id,
        targetVersionNumber: 1,
      });
    });
    assert(false, "R2.15: Transaction should have thrown error on invalid data");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    assert(
      errorMsg.includes("Invalid question numbering: expected question number 2"),
      "R2.15: Fails safely with validation error on invalid question numbering",
      errorMsg
    );
  }

  // Verify rollback: count of tests and questions should remain unchanged
  const postTestCount = await prisma.test.count();
  const postDraftQCount = await prisma.draftQuestion.count();
  assert(
    preTestCount === postTestCount && preDraftQCount === postDraftQCount,
    "R2.16: Atomic rollback confirmed: no orphaned draft or test records persisted"
  );

  // -------------------------------------------------------------
  // REQUIREMENT 3: PUBLISHING TRANSACTION TESTING
  // -------------------------------------------------------------
  console.log("\n--- 3. Publishing Service Validation & Transaction Testing ---");

  // 3.1 Test missing answer keys prevention
  try {
    await prisma.$transaction(async (tx) => {
      const missingAnsTest = await tx.test.create({
        data: {
          title: "Missing Answer Key Test",
          slug: "missing-ans-test",
          module: "READING",
          category: "ACADEMIC",
          durationMinutes: 60,
          totalQuestions: 1,
        },
      });

      const sec = await tx.draftSection.create({
        data: {
          testId: missingAnsTest.id,
          orderIndex: 1,
          title: "Section",
          passageText: "Passage",
        },
      });

      const grp = await tx.draftQuestionGroup.create({
        data: {
          sectionId: sec.id,
          orderIndex: 1,
          instruction: "Answer",
          questionType: "MULTIPLE_CHOICE",
        },
      });

      await tx.draftQuestion.create({
        data: {
          questionGroupId: grp.id,
          questionNumber: 1,
          prompt: "Question without answer key",
        },
      });

      await publishDraftTestVersion(tx, {
        testId: missingAnsTest.id,
        targetVersionNumber: 1,
      });
    });
    assert(false, "R3.1: Should throw error when answer key is missing");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    assert(
      errorMsg.includes("Question 1 has no accepted answers"),
      "R3.1: Missing answer key prevents publishing",
      errorMsg
    );
  }

  // 3.2 Test empty accepted answer string prevention
  try {
    await prisma.$transaction(async (tx) => {
      const emptyAnsTest = await tx.test.create({
        data: {
          title: "Empty Answer Test",
          slug: "empty-ans-test",
          module: "READING",
          category: "ACADEMIC",
          durationMinutes: 60,
          totalQuestions: 1,
        },
      });

      const sec = await tx.draftSection.create({
        data: {
          testId: emptyAnsTest.id,
          orderIndex: 1,
          title: "Section",
          passageText: "Passage",
        },
      });

      const grp = await tx.draftQuestionGroup.create({
        data: {
          sectionId: sec.id,
          orderIndex: 1,
          instruction: "Answer",
          questionType: "MULTIPLE_CHOICE",
        },
      });

      const q = await tx.draftQuestion.create({
        data: {
          questionGroupId: grp.id,
          questionNumber: 1,
          prompt: "Question with whitespace answer",
        },
      });

      await tx.draftAcceptedAnswer.create({
        data: {
          questionId: q.id,
          acceptedText: "   ",
          orderIndex: 0,
        },
      });

      await publishDraftTestVersion(tx, {
        testId: emptyAnsTest.id,
        targetVersionNumber: 1,
      });
    });
    assert(false, "R3.2: Should throw error when accepted answer is empty");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    assert(
      errorMsg.includes("Question 1 has an empty accepted answer"),
      "R3.2: Empty accepted answer text prevents publishing",
      errorMsg
    );
  }

  // 3.3 Verify no partial published snapshot left behind on failure for Mock 01
  const totalPubVersions = await prisma.publishedTestVersion.count({
    where: { testId: test.id },
  });
  const totalPubQuestions = await prisma.publishedQuestion.count({
    where: { testVersionId: pubV1.id },
  });
  assert(totalPubVersions === 1, "R3.3: Total published versions for Mock 01 in DB remains exactly 1");
  assert(totalPubQuestions === 40, "R3.4: Total published questions for Mock 01 in DB remains exactly 40");

  // 3.4 Valid draft publishes successfully into a distinct version
  // We will create a small valid second test and publish it to test full real path
  let validTestId = "";
  let publishedV1Id = "";
  try {
    await prisma.$transaction(async (tx) => {
      const validTest = await tx.test.create({
        data: {
          title: "Valid Published Test",
          slug: `valid-published-test-${Date.now()}`,
          module: "READING",
          category: "ACADEMIC",
          durationMinutes: 60,
          totalQuestions: 2,
        },
      });
      validTestId = validTest.id;

      const sec = await tx.draftSection.create({
        data: {
          testId: validTest.id,
          orderIndex: 1,
          title: "Passage 1",
          passageText: "Valid text",
        },
      });

      const grp = await tx.draftQuestionGroup.create({
        data: {
          sectionId: sec.id,
          orderIndex: 1,
          instruction: "Answer questions",
          questionType: "MULTIPLE_CHOICE",
        },
      });

      const q1 = await tx.draftQuestion.create({
        data: { questionGroupId: grp.id, questionNumber: 1, prompt: "Prompt 1" },
      });
      await tx.draftAcceptedAnswer.create({
        data: { questionId: q1.id, acceptedText: "A", orderIndex: 0 },
      });

      const q2 = await tx.draftQuestion.create({
        data: { questionGroupId: grp.id, questionNumber: 2, prompt: "Prompt 2" },
      });
      await tx.draftAcceptedAnswer.create({
        data: { questionId: q2.id, acceptedText: "B", orderIndex: 0 },
      });

      const result = await publishDraftTestVersion(tx, {
        testId: validTest.id,
        targetVersionNumber: 1,
      });

      publishedV1Id = result.publishedVersionId;
    });

    assert(Boolean(publishedV1Id), "R3.5: Valid draft publishes successfully via publishDraftTestVersion");
  } catch (err: unknown) {
    assert(false, "R3.5: Valid draft publication failed", String(err));
  }

  // 3.5 Prevent publishing duplicate version number
  try {
    await prisma.$transaction(async (tx) => {
      await publishDraftTestVersion(tx, {
        testId: validTestId,
        targetVersionNumber: 1, // already exists!
      });
    });
    assert(false, "R3.6: Should reject publishing existing version number");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    assert(
      errorMsg.includes("already exists for test"),
      "R3.6: Duplicate targetVersionNumber correctly rejected",
      errorMsg
    );
  }

  // 3.6 Immutability verification: Database triggers prevent update and delete of published records
  console.log("\n--- 4. Published Records Immutability Enforcement ---");
  const samplePubQ = await prisma.publishedQuestion.findFirst({
    where: { testVersionId: pubV1.id },
  });

  if (!samplePubQ) {
    assert(false, "Sample published question not found");
  } else {
    // Attempt UPDATE on published question
    try {
      await prisma.publishedQuestion.update({
        where: { id: samplePubQ.id },
        data: { prompt: "Modified Prompt" },
      });
      assert(false, "R3.7: Database trigger should prevent UPDATE on publishedQuestion");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      assert(
        errorMsg.includes("Immutable snapshot violation") && errorMsg.includes("Updating records in PublishedQuestion is strictly prohibited"),
        "R3.7: PostgreSQL trigger prevents UPDATE on published records",
        errorMsg
      );
    }

    // Attempt DELETE on published question
    try {
      await prisma.publishedQuestion.delete({
        where: { id: samplePubQ.id },
      });
      assert(false, "R3.8: Database trigger should prevent DELETE on publishedQuestion");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      assert(
        errorMsg.includes("Immutable snapshot violation") && errorMsg.includes("Deleting records from PublishedQuestion is strictly prohibited"),
        "R3.8: PostgreSQL trigger prevents DELETE on published records",
        errorMsg
      );
    }
  }

  // -------------------------------------------------------------
  // CLEANUP TEMPORARY VALID TEST
  // -------------------------------------------------------------
  if (validTestId) {
    // Note: cannot delete published records directly due to triggers, but test can be archived or cascade deleted if trigger permits test-level deletion or left in test db
    // Since this is a disposable DB, we verify clean state.
  }

  console.log("\n==================================================================");
  console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit()
  .catch((err) => {
    console.error("Fatal error during audit execution:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
