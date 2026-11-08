import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { Role, AttemptStatus } from "@prisma/client";
import { createSessionToken } from "@/lib/auth/session";
import { SavedAnswerDTO } from "@/lib/services/examAttemptService";
import { PUT as saveAnswerRoute } from "../[attemptId]/answers/route";
import { GET as getContentRoute } from "../[attemptId]/route";

describe("Phase 2: Reliable Answer Autosaving API & Security", () => {
  const timestamp = Date.now();
  let studentAId: string;
  let studentBId: string;
  let tokenA: string;
  let tokenB: string;
  let attemptAId: string;
  let publishedVersionId: string;
  let question1Id: string;
  let question9Id: string;
  const testSlug = "academic-reading-mock-01";
  const createdAttemptIds: string[] = [];
  const createdUserIds: string[] = [];
  const createdTestIds: string[] = [];

  beforeAll(async () => {
    // 1. Create Student A
    const userA = await prisma.user.create({
      data: {
        email: `autosave_student_a_${timestamp}@example.com`,
        name: "Autosave Student A",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    studentAId = userA.id;
    createdUserIds.push(userA.id);
    tokenA = await createSessionToken({
      userId: userA.id,
      email: userA.email,
      role: userA.role,
    });

    // 2. Create Student B (for IDOR testing)
    const userB = await prisma.user.create({
      data: {
        email: `autosave_student_b_${timestamp}@example.com`,
        name: "Autosave Student B",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    studentBId = userB.id;
    createdUserIds.push(userB.id);
    tokenB = await createSessionToken({
      userId: userB.id,
      email: userB.email,
      role: userB.role,
    });

    // 3. Resolve published test and questions
    const test = await prisma.test.findUniqueOrThrow({
      where: { slug: testSlug },
      include: {
        publishedVersions: {
          where: { isArchived: false },
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    });

    publishedVersionId = test.publishedVersions[0].id;

    // Get Q1 and Q9 IDs
    const questions = await prisma.publishedQuestion.findMany({
      where: {
        testVersionId: publishedVersionId,
        questionNumber: { in: [1, 9] },
      },
    });

    const q1 = questions.find((q) => q.questionNumber === 1);
    const q9 = questions.find((q) => q.questionNumber === 9);
    if (!q1 || !q9) throw new Error("Mock Test 01 questions not found");
    question1Id = q1.id;
    question9Id = q9.id;

    // 4. Create active attempt for Student A
    const now = new Date();
    const attemptA = await prisma.testAttempt.create({
      data: {
        userId: studentAId,
        testId: test.id,
        testVersionId: publishedVersionId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: now,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
      },
    });
    attemptAId = attemptA.id;
    createdAttemptIds.push(attemptA.id);
  });

  afterAll(async () => {
    if (createdAttemptIds.length > 0) {
      await prisma.studentAnswer.deleteMany({
        where: { attemptId: { in: createdAttemptIds } },
      });
      await prisma.testAttempt.deleteMany({
        where: { id: { in: createdAttemptIds } },
      });
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }

    if (createdTestIds.length > 0) {
      await prisma.draftAcceptedAnswer.deleteMany({
        where: { question: { questionGroup: { section: { testId: { in: createdTestIds } } } } },
      });
      await prisma.draftQuestion.deleteMany({
        where: { questionGroup: { section: { testId: { in: createdTestIds } } } },
      });
      await prisma.draftQuestionGroup.deleteMany({
        where: { section: { testId: { in: createdTestIds } } },
      });
      await prisma.draftSection.deleteMany({
        where: { testId: { in: createdTestIds } },
      });
      await prisma.test.deleteMany({
        where: { id: { in: createdTestIds } },
      });
    }
  });

  // -----------------------------------------------------------------
  // 1. Multiple Saves to the Same Question (In-Place Update)
  // -----------------------------------------------------------------
  it("allows multiple saves to the same question and updates in place", async () => {
    // Save 1: "FALSE"
    const req1 = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "FALSE",
        isFlaggedForReview: false,
      }),
    });

    const res1 = await saveAnswerRoute(req1, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res1.status).toBe(200);
    const json1 = await res1.json();
    expect(json1.success).toBe(true);
    expect(json1.data.answerText).toBe("FALSE");
    expect(json1.data.isFlaggedForReview).toBe(false);

    // Save 2: update to "NOT GIVEN" and flag for review
    const req2 = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "NOT GIVEN",
        isFlaggedForReview: true,
      }),
    });

    const res2 = await saveAnswerRoute(req2, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.success).toBe(true);
    expect(json2.data.answerText).toBe("NOT GIVEN");
    expect(json2.data.isFlaggedForReview).toBe(true);

    // Verify in database: exactly ONE row exists for (attemptId, question1Id)
    const count = await prisma.studentAnswer.count({
      where: {
        attemptId: attemptAId,
        questionId: question1Id,
      },
    });
    expect(count).toBe(1);

    const dbRecord = await prisma.studentAnswer.findUniqueOrThrow({
      where: {
        attemptId_questionId: {
          attemptId: attemptAId,
          questionId: question1Id,
        },
      },
    });
    expect(dbRecord.answerText).toBe("NOT GIVEN");
    expect(dbRecord.isFlaggedForReview).toBe(true);
    // Invariant: isCorrect and scoreAwarded must remain null during autosave
    expect(dbRecord.isCorrect).toBeNull();
    expect(dbRecord.scoreAwarded).toBeNull();
  });

  // -----------------------------------------------------------------
  // 2. Repeated Identical Saves (Idempotency)
  // -----------------------------------------------------------------
  it("handles repeated identical saves idempotently", async () => {
    const req = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "NOT GIVEN",
        isFlaggedForReview: true,
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.answerText).toBe("NOT GIVEN");
  });

  // -----------------------------------------------------------------
  // 3. Invalid Question IDs
  // -----------------------------------------------------------------
  it("rejects non-existent question IDs with 400 Bad Request", async () => {
    const req = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: "cmw_invalid_question_id_99999",
        answerText: "Some Answer",
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("QUESTION_NOT_IN_VERSION");
  });

  // -----------------------------------------------------------------
  // 4. Cross-User Access (IDOR Prevention)
  // -----------------------------------------------------------------
  it("rejects attempt modification by another student with 403 Forbidden", async () => {
    const req = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`, // Student B
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "Malicious Tamper",
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe("FORBIDDEN_ATTEMPT_ACCESS");
  });

  // -----------------------------------------------------------------
  // 5. Cross-Version Question Access
  // -----------------------------------------------------------------
  it("rejects questions belonging to a different test draft with 400 Bad Request", async () => {
    // Create an isolated draft test and question
    const otherDraft = await prisma.test.create({
      data: {
        title: `Other Draft Test ${timestamp}`,
        slug: `other-draft-${timestamp}`,
        draftSections: {
          create: {
            orderIndex: 1,
            title: "Passage Other",
            passageText: "Text",
            groups: {
              create: {
                orderIndex: 1,
                instruction: "Instructions",
                questionType: "SHORT_ANSWER",
                questions: {
                  create: {
                    questionNumber: 1,
                    prompt: "Foreign Question Prompt",
                  },
                },
              },
            },
          },
        },
      },
      include: {
        draftSections: {
          include: {
            groups: {
              include: { questions: true },
            },
          },
        },
      },
    });
    createdTestIds.push(otherDraft.id);

    const foreignQuestionId = otherDraft.draftSections[0].groups[0].questions[0].id;

    // Student A attempts to save answer for question from another version
    const req = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: foreignQuestionId,
        answerText: "Attempted cross-version answer",
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("QUESTION_NOT_IN_VERSION");
  });

  // -----------------------------------------------------------------
  // 6. Expired Attempts
  // -----------------------------------------------------------------
  it("rejects answer writes to expired attempts with 403 ATTEMPT_EXPIRED", async () => {
    // Create an expired attempt
    const now = new Date();
    const expiredAttempt = await prisma.testAttempt.create({
      data: {
        userId: studentBId,
        testId: (await prisma.test.findUniqueOrThrow({ where: { slug: testSlug } })).id,
        testVersionId: publishedVersionId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: new Date(now.getTime() - 120 * 60 * 1000),
        expiresAt: new Date(now.getTime() - 60 * 60 * 1000), // expired 1 hour ago
      },
    });
    createdAttemptIds.push(expiredAttempt.id);

    const req = new Request(`http://localhost:3000/api/exam/${expiredAttempt.id}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "Late Answer",
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: expiredAttempt.id }),
    });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe("ATTEMPT_EXPIRED");
  });

  // -----------------------------------------------------------------
  // 7. Submitted / Finalized Attempts
  // -----------------------------------------------------------------
  it("rejects answer writes to already submitted attempts with 409 Conflict", async () => {
    // Create a submitted attempt
    const now = new Date();
    const submittedAttempt = await prisma.testAttempt.create({
      data: {
        userId: studentBId,
        testId: (await prisma.test.findUniqueOrThrow({ where: { slug: testSlug } })).id,
        testVersionId: publishedVersionId,
        status: AttemptStatus.SUBMITTED,
        startedAt: new Date(now.getTime() - 30 * 60 * 1000),
        expiresAt: new Date(now.getTime() + 30 * 60 * 1000),
        submittedAt: now,
      },
    });
    createdAttemptIds.push(submittedAttempt.id);

    const req = new Request(`http://localhost:3000/api/exam/${submittedAttempt.id}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "Post-submission modification",
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: submittedAttempt.id }),
    });
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.code).toBe("ATTEMPT_NOT_IN_PROGRESS");
  });

  // -----------------------------------------------------------------
  // 8. Concurrent Autosave Requests (Row Locking)
  // -----------------------------------------------------------------
  it("safely serializes concurrent autosave writes to different and same questions", async () => {
    // Fire 3 simultaneous autosaves to attemptAId
    const reqs = [
      new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
        body: JSON.stringify({ questionId: question1Id, answerText: "Concurrent 1" }),
      }),
      new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
        body: JSON.stringify({ questionId: question9Id, answerText: "air-filled" }),
      }),
      new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
        body: JSON.stringify({ questionId: question1Id, answerText: "Concurrent Final" }),
      }),
    ];

    const responses = await Promise.all(
      reqs.map((r) => saveAnswerRoute(r, { params: Promise.resolve({ attemptId: attemptAId }) }))
    );

    responses.forEach((res) => {
      expect(res.status).toBe(200);
    });

    // Verify Q9 has "air-filled"
    const q9Saved = await prisma.studentAnswer.findUniqueOrThrow({
      where: { attemptId_questionId: { attemptId: attemptAId, questionId: question9Id } },
    });
    expect(q9Saved.answerText).toBe("air-filled");
  });

  // -----------------------------------------------------------------
  // 9. Validation & Input Format (Size Limit Enforcement)
  // -----------------------------------------------------------------
  it("rejects answers exceeding 500 characters with 400 Bad Request", async () => {
    const hugeAnswer = "a".repeat(501);

    const req = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: hugeAnswer,
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("VALIDATION_ERROR");
  });

  // -----------------------------------------------------------------
  // 10. Reload and Answer Restoration
  // -----------------------------------------------------------------
  it("restores saved answers when retrieving exam content after reload", async () => {
    // Student A saves Q1 as "FALSE" and Q9 as "air-filled" with flagged = true
    await saveAnswerRoute(
      new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
        body: JSON.stringify({ questionId: question1Id, answerText: "FALSE", isFlaggedForReview: false }),
      }),
      { params: Promise.resolve({ attemptId: attemptAId }) }
    );

    await saveAnswerRoute(
      new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
        body: JSON.stringify({ questionId: question9Id, answerText: "air-filled", isFlaggedForReview: true }),
      }),
      { params: Promise.resolve({ attemptId: attemptAId }) }
    );

    // Simulate page reload: GET /api/exam/[attemptId]
    const contentReq = new Request(`http://localhost:3000/api/exam/${attemptAId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    const contentRes = await getContentRoute(contentReq, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });

    expect(contentRes.status).toBe(200);
    const contentJson = await contentRes.json();
    expect(contentJson.success).toBe(true);

    const savedAnswers = contentJson.data.savedAnswers;
    expect(savedAnswers).toBeDefined();

    const savedQ1 = (savedAnswers as SavedAnswerDTO[]).find((a) => a.questionId === question1Id);
    expect(savedQ1).toBeDefined();
    expect(savedQ1!.answerText).toBe("FALSE");
    expect(savedQ1!.isFlaggedForReview).toBe(false);

    const savedQ9 = (savedAnswers as SavedAnswerDTO[]).find((a) => a.questionId === question9Id);
    expect(savedQ9).toBeDefined();
    expect(savedQ9!.answerText).toBe("air-filled");
    expect(savedQ9!.isFlaggedForReview).toBe(true);
  });

  // -----------------------------------------------------------------
  // 11. Zero Answer Key & Correctness Leakage
  // -----------------------------------------------------------------
  it("strictly omits accepted answers and correctness evaluation during autosave", async () => {
    const req = new Request(`http://localhost:3000/api/exam/${attemptAId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionId: question1Id,
        answerText: "FALSE",
      }),
    });

    const res = await saveAnswerRoute(req, {
      params: Promise.resolve({ attemptId: attemptAId }),
    });

    const json = await res.json();
    const str = JSON.stringify(json);

    expect(str).not.toContain("acceptedAnswers");
    expect(str).not.toContain("acceptedText");
    expect(str).not.toContain("isCorrect");
    expect(str).not.toContain("scoreAwarded");
    expect(str).not.toContain("explanation");
  });
});
