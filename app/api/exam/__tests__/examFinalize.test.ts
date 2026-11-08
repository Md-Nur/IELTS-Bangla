import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { Role, AttemptStatus } from "@prisma/client";
import { createSessionToken } from "@/lib/auth/session";
import { finalizeAndScoreAttempt } from "@/lib/services/examAttemptService";
import { POST as finalizeRoute } from "../[attemptId]/finalize/route";
import { PUT as saveAnswerRoute } from "../[attemptId]/answers/route";
import { GET as getContentRoute } from "../[attemptId]/route";
import { NextRequest } from "next/server";
import { mock01TestData } from "@/prisma/seeds/mock01Data";

describe("Phase 3: Secure Exam Finalization & Reading Scoring", () => {
  const timestamp = Date.now();
  let tokenA: string;
  let testId: string;
  let publishedVersionId: string;
  const testSlug = "academic-reading-mock-01";

  const createdAttemptIds: string[] = [];
  const createdUserIds: string[] = [];

  // Map of questionNumber -> PublishedQuestion
  const questionsByNumber = new Map<number, { id: string; questionNumber: number }>();

  // Official golden answers populated directly from validated Mock Test 01 seed data
  const goldenAnswers: Record<number, string> = {};
  for (const sec of mock01TestData.sections) {
    for (const grp of sec.groups) {
      for (const q of grp.questions) {
        const primary = q.acceptedAnswers.find((a) => a.isPrimary)!.acceptedText;
        goldenAnswers[q.questionNumber] = primary;
      }
    }
  }

  beforeAll(async () => {
    // 1. Create Default Student A for generic tests
    const userA = await prisma.user.create({
      data: {
        email: `finalize_default_${timestamp}@example.com`,
        name: "Finalize Default Student",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(userA.id);
    tokenA = await createSessionToken({
      userId: userA.id,
      email: userA.email,
      role: userA.role,
    });

    // 2. Resolve published test and questions
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

    testId = test.id;
    publishedVersionId = test.publishedVersions[0].id;

    // Load all 40 published questions for this test version
    const publishedQuestions = await prisma.publishedQuestion.findMany({
      where: { testVersionId: publishedVersionId },
      select: { id: true, questionNumber: true },
      orderBy: { questionNumber: "asc" },
    });

    for (const q of publishedQuestions) {
      questionsByNumber.set(q.questionNumber, q);
    }
  });

  afterAll(async () => {
    if (createdAttemptIds.length > 0) {
      // Must delete evaluationResult first due to onDelete: Restrict
      await prisma.evaluationResult.deleteMany({
        where: { attemptId: { in: createdAttemptIds } },
      });
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
  });

  // Helper to create an isolated student with token
  async function createStudent(label: string) {
    const user = await prisma.user.create({
      data: {
        email: `${label}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@example.com`,
        name: `Student ${label}`,
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(user.id);
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return { user, token };
  }

  // Helper to create an attempt
  async function createTestAttempt(userId: string, isExpired: boolean = false) {
    const now = new Date();
    const startedAt = isExpired
      ? new Date(now.getTime() - 120 * 60 * 1000)
      : now;
    const expiresAt = isExpired
      ? new Date(now.getTime() - 60 * 60 * 1000)
      : new Date(now.getTime() + 60 * 60 * 1000);

    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        testVersionId: publishedVersionId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt,
        expiresAt,
      },
    });

    createdAttemptIds.push(attempt.id);
    return attempt;
  }

  // -----------------------------------------------------------------
  // 1. Authentication & Parameter Validation
  // -----------------------------------------------------------------
  it("rejects unauthenticated requests with 401 Unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/exam/attempt_123/finalize", {
      method: "POST",
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: "attempt_123" }),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("rejects non-existent attempt ID with 404 Not Found", async () => {
    const req = new NextRequest("http://localhost:3000/api/exam/non_existent_cuid/finalize", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: "non_existent_cuid" }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.code).toBe("ATTEMPT_NOT_FOUND");
  });

  // -----------------------------------------------------------------
  // 2. IDOR / Cross-User Protection
  // -----------------------------------------------------------------
  it("rejects attempt finalization by another student with 403 Forbidden", async () => {
    const { user: student1 } = await createStudent("idor_a");
    const { token: student2Token } = await createStudent("idor_b");
    const attemptA = await createTestAttempt(student1.id);

    // Student 2 attempts to finalize Student 1's attempt
    const req = new NextRequest(`http://localhost:3000/api/exam/${attemptA.id}/finalize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student2Token}` },
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: attemptA.id }),
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN_ATTEMPT_ACCESS");
  });

  // -----------------------------------------------------------------
  // 3. Perfect 40/40 Score Across All 7 IELTS Question Types
  // -----------------------------------------------------------------
  it("scores 40/40 and Band 9.0 when all golden answers are saved", async () => {
    const { user: student, token } = await createStudent("perfect");
    const attempt = await createTestAttempt(student.id);

    // Save golden answers for all 40 questions
    const answersData = Object.entries(goldenAnswers).map(([qNum, text]) => {
      const q = questionsByNumber.get(Number(qNum))!;
      return {
        attemptId: attempt.id,
        testVersionId: publishedVersionId,
        questionId: q.id,
        answerText: text,
        isFlaggedForReview: false,
      };
    });

    await prisma.studentAnswer.createMany({ data: answersData });

    // Finalize attempt
    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: "MANUAL" }),
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    const data = body.data;
    expect(data.attemptId).toBe(attempt.id);
    expect(data.status).toBe("SUBMITTED");
    expect(data.rawScore).toBe(40);
    expect(data.estimatedBand).toBe(9.0);
    expect(data.totalQuestions).toBe(40);
    expect(data.totalAttempted).toBe(40);
    expect(data.totalCorrect).toBe(40);
    expect(data.totalIncorrect).toBe(0);
    expect(data.scoringVersion).toBe("reading_v1.0.0");
    expect(data.redirectUrl).toBe(`/results/${attempt.id}`);

    // Verify section breakdown
    expect(data.sectionBreakdown.passage1.correct).toBe(13);
    expect(data.sectionBreakdown.passage1.totalQuestions).toBe(13);
    expect(data.sectionBreakdown.passage2.correct).toBe(13);
    expect(data.sectionBreakdown.passage2.totalQuestions).toBe(13);
    expect(data.sectionBreakdown.passage3.correct).toBe(14);
    expect(data.sectionBreakdown.passage3.totalQuestions).toBe(14);

    // Verify TestAttempt table was updated in database
    const updatedAttempt = await prisma.testAttempt.findUniqueOrThrow({
      where: { id: attempt.id },
    });
    expect(updatedAttempt.status).toBe(AttemptStatus.SUBMITTED);
    expect(updatedAttempt.rawScore).toBe(40);
    expect(updatedAttempt.estimatedBand).toBe(9.0);
    expect(updatedAttempt.submittedAt).not.toBeNull();

    // Verify EvaluationResult was created in database
    const evalResult = await prisma.evaluationResult.findUniqueOrThrow({
      where: { attemptId: attempt.id },
    });
    expect(evalResult.rawScore).toBe(40);
    expect(evalResult.estimatedBand).toBe(9.0);
    expect(evalResult.totalQuestions).toBe(40);
    expect(evalResult.totalCorrect).toBe(40);
    expect(evalResult.scoringVersion).toBe("reading_v1.0.0");

    // Verify each StudentAnswer row has isCorrect = true and scoreAwarded = 1
    const studentAnswers = await prisma.studentAnswer.findMany({
      where: { attemptId: attempt.id },
    });
    expect(studentAnswers.length).toBe(40);
    for (const ans of studentAnswers) {
      expect(ans.isCorrect).toBe(true);
      expect(ans.scoreAwarded).toBe(1);
    }
  });

  // -----------------------------------------------------------------
  // 4. Missing Answers (Treat Unanswered Questions as Zero)
  // -----------------------------------------------------------------
  it("treats unanswered questions as zero and persists complete evaluation", async () => {
    const { user: student, token } = await createStudent("empty");
    const attempt = await createTestAttempt(student.id);

    // No answers saved at all
    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const data = body.data;

    expect(data.status).toBe("SUBMITTED");
    expect(data.rawScore).toBe(0);
    expect(data.estimatedBand).toBe(0.0);
    expect(data.totalQuestions).toBe(40);
    expect(data.totalAttempted).toBe(0);
    expect(data.totalCorrect).toBe(0);
    expect(data.totalIncorrect).toBe(40);

    // Verify that all 40 questions now exist in StudentAnswer table with score 0
    const studentAnswers = await prisma.studentAnswer.findMany({
      where: { attemptId: attempt.id },
    });
    expect(studentAnswers.length).toBe(40);
    for (const ans of studentAnswers) {
      expect(ans.isCorrect).toBe(false);
      expect(ans.scoreAwarded).toBe(0);
      expect(ans.answerText).toBeNull();
    }
  });

  // -----------------------------------------------------------------
  // 5. Accepted Alternatives, Letter Formatting, & Case-Insensitivity
  // -----------------------------------------------------------------
  it("correctly scores accepted alternatives, letter formatting, and case variations", async () => {
    const { user: student, token } = await createStudent("alternatives");
    const attempt = await createTestAttempt(student.id);

    // Mix of accepted alternative formats
    const customAnswers: Array<{ qNum: number; text: string }> = [
      { qNum: 1, text: "false" }, // lowercase
      { qNum: 2, text: "True" },
      { qNum: 3, text: "not given" },
      { qNum: 9, text: "air filled" }, // Spaced alternative to "air-filled"
      { qNum: 14, text: "II" }, // Uppercase Roman numeral for "ii"
      { qNum: 24, text: "b" }, // Lowercase option letter
      { qNum: 25, text: "(B)" }, // Parenthesized option letter
      { qNum: 26, text: "C." }, // Dotted option letter
      { qNum: 27, text: "yes" }, // Lowercase YES
      { qNum: 28, text: "No" }, // Titlecase NO
      { qNum: 37, text: "a" }, // Lowercase Summary Completion letter
      { qNum: 38, text: "(C)" }, // Parenthesized Summary Completion letter
      { qNum: 39, text: "D." }, // Dotted Summary Completion letter
      { qNum: 40, text: "e" }, // Lowercase Summary Completion letter
    ];

    const answersData = customAnswers.map((item) => {
      const q = questionsByNumber.get(item.qNum)!;
      return {
        attemptId: attempt.id,
        testVersionId: publishedVersionId,
        questionId: q.id,
        answerText: item.text,
        isFlaggedForReview: false,
      };
    });

    await prisma.studentAnswer.createMany({ data: answersData });

    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const data = body.data;

    expect(data.rawScore).toBe(14); // All 14 custom answers score correct
    expect(data.totalAttempted).toBe(14);
    expect(data.totalCorrect).toBe(14);
  });

  // -----------------------------------------------------------------
  // 6. Rejected Alternatives, Non-Letters, and Word Limit Violations
  // -----------------------------------------------------------------
  it("strictly rejects unapproved alternatives, word names for letters, and word limit violations", async () => {
    const { user: student, token } = await createStudent("rejected");
    const attempt = await createTestAttempt(student.id);

    const invalidAnswers: Array<{ qNum: number; text: string }> = [
      // Q21: 'overflow' (singular) instead of accepted 'overflows'
      { qNum: 21, text: "overflow" },
      // Q22: 'isolated islands' instead of accepted 'islands'
      { qNum: 22, text: "isolated islands" },
      // Q37: word 'predator' instead of letter 'A'
      { qNum: 37, text: "predator" },
      // Q38: letter+word 'C triggers' instead of letter 'C'
      { qNum: 38, text: "C triggers" },
      // Q39: word 'skill' instead of letter 'D'
      { qNum: 39, text: "skill" },
      // Q40: word 'unproductive' instead of letter 'E'
      { qNum: 40, text: "unproductive" },
      // Q8: Word limit is 2; 3 words provided
      { qNum: 8, text: "very light wood" },
    ];

    const answersData = invalidAnswers.map((item) => {
      const q = questionsByNumber.get(item.qNum)!;
      return {
        attemptId: attempt.id,
        testVersionId: publishedVersionId,
        questionId: q.id,
        answerText: item.text,
        isFlaggedForReview: false,
      };
    });

    await prisma.studentAnswer.createMany({ data: answersData });

    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const data = body.data;

    // All 7 should be rejected and score 0
    expect(data.rawScore).toBe(0);
    expect(data.totalAttempted).toBe(7);
    expect(data.totalCorrect).toBe(0);

    // Verify wordLimitExceeded was flagged on Q8
    const q8Result = data.questionBreakdown.find((q: { questionNumber: number }) => q.questionNumber === 8);
    expect(q8Result.isCorrect).toBe(false);
    expect(q8Result.wordLimitExceeded).toBe(true);
  });

  // -----------------------------------------------------------------
  // 7. Deadline Races & Expiration Handling
  // -----------------------------------------------------------------
  it("rejects premature timeout request when deadline has not passed", async () => {
    const { user: student, token } = await createStudent("premature");
    const attempt = await createTestAttempt(student.id); // Not expired

    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: "TIMEOUT" }),
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("DEADLINE_NOT_PASSED");

    // Verify attempt remains IN_PROGRESS
    const checkAttempt = await prisma.testAttempt.findUniqueOrThrow({
      where: { id: attempt.id },
    });
    expect(checkAttempt.status).toBe(AttemptStatus.IN_PROGRESS);
  });

  it("automatically transitions to TIMED_OUT when finalized after expiration", async () => {
    const { user: student, token } = await createStudent("late");
    const expiredAttempt = await createTestAttempt(student.id, true); // Expired!

    const req = new NextRequest(`http://localhost:3000/api/exam/${expiredAttempt.id}/finalize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: "MANUAL" }), // Even with MANUAL, server clock enforces TIMED_OUT
    });

    const res = await finalizeRoute(req, {
      params: Promise.resolve({ attemptId: expiredAttempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("TIMED_OUT");

    const checkAttempt = await prisma.testAttempt.findUniqueOrThrow({
      where: { id: expiredAttempt.id },
    });
    expect(checkAttempt.status).toBe(AttemptStatus.TIMED_OUT);
  });

  // -----------------------------------------------------------------
  // 8. Idempotency & Repeated Finalization Requests
  // -----------------------------------------------------------------
  it("returns identical committed result on repeated finalization without creating duplicate evaluations", async () => {
    const { user: student, token } = await createStudent("idempotent");
    const attempt = await createTestAttempt(student.id);

    // Save one answer
    const q1 = questionsByNumber.get(1)!;
    await prisma.studentAnswer.create({
      data: {
        attemptId: attempt.id,
        testVersionId: publishedVersionId,
        questionId: q1.id,
        answerText: "FALSE",
      },
    });

    // Request 1: First finalization
    const req1 = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res1 = await finalizeRoute(req1, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });
    expect(res1.status).toBe(200);
    const body1 = await res1.json();

    // Request 2: Repeated finalization
    const req2 = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/finalize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res2 = await finalizeRoute(req2, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });
    expect(res2.status).toBe(200);
    const body2 = await res2.json();

    // Responses should be identical
    expect(body2.data.rawScore).toBe(body1.data.rawScore);
    expect(body2.data.estimatedBand).toBe(body1.data.estimatedBand);
    expect(body2.data.submittedAt).toBe(body1.data.submittedAt);
    expect(body2.data.status).toBe(body1.data.status);

    // Ensure only 1 EvaluationResult exists in database
    const evals = await prisma.evaluationResult.findMany({
      where: { attemptId: attempt.id },
    });
    expect(evals.length).toBe(1);
  });

  // -----------------------------------------------------------------
  // 9. Concurrent Finalization Requests
  // -----------------------------------------------------------------
  it("safely serializes concurrent finalization requests and returns the same result", async () => {
    const { user: student } = await createStudent("concurrent");
    const attempt = await createTestAttempt(student.id);

    const [res1, res2] = await Promise.all([
      finalizeAndScoreAttempt({ userId: student.id, attemptId: attempt.id }),
      finalizeAndScoreAttempt({ userId: student.id, attemptId: attempt.id }),
    ]);

    expect(res1.status).toBe(AttemptStatus.SUBMITTED);
    expect(res2.status).toBe(AttemptStatus.SUBMITTED);
    expect(res1.rawScore).toBe(res2.rawScore);
    expect(res1.estimatedBand).toBe(res2.estimatedBand);

    // Verify only 1 EvaluationResult was persisted
    const evals = await prisma.evaluationResult.findMany({
      where: { attemptId: attempt.id },
    });
    expect(evals.length).toBe(1);
  });

  // -----------------------------------------------------------------
  // 10. Post-Finalization Immutability (Attempt Never Reopened)
  // -----------------------------------------------------------------
  it("prevents answers from being modified or content retrieved once attempt is finalized", async () => {
    const { user: student, token } = await createStudent("reopen");
    const attempt = await createTestAttempt(student.id);

    // Finalize
    await finalizeAndScoreAttempt({ userId: student.id, attemptId: attempt.id });

    // Attempt to autosave an answer on the submitted attempt
    const q1 = questionsByNumber.get(1)!;
    const saveReq = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/answers`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: q1.id,
        answerText: "TRUE",
        isFlaggedForReview: false,
      }),
    });

    const saveRes = await saveAnswerRoute(saveReq, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(saveRes.status).toBe(409);
    const saveBody = await saveRes.json();
    expect(saveBody.code).toBe("ATTEMPT_NOT_IN_PROGRESS");

    // Attempt to retrieve content for in-progress exam
    const contentReq = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const contentRes = await getContentRoute(contentReq, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(contentRes.status).toBe(409);
    const contentBody = await contentRes.json();
    expect(contentBody.code).toBe("ATTEMPT_NOT_IN_PROGRESS");
  });

  // -----------------------------------------------------------------
  // 11. Transaction Rollback Behavior
  // -----------------------------------------------------------------
  it("rolls back all changes if an error occurs during finalization", async () => {
    const { user: student } = await createStudent("rollback");
    const attempt = await createTestAttempt(student.id);

    // Verify attempt starts as IN_PROGRESS
    expect(attempt.status).toBe(AttemptStatus.IN_PROGRESS);

    // Simulate transaction failure by forcing an invalid attempt ID or constraint failure
    // We test that finalizeAndScoreAttempt rolls back if a non-existent or conflicting mutation occurs
    await expect(
      finalizeAndScoreAttempt({
        userId: "non_existent_user_id",
        attemptId: attempt.id,
      })
    ).rejects.toThrow();

    // Verify database state was NOT changed
    const attemptAfter = await prisma.testAttempt.findUniqueOrThrow({
      where: { id: attempt.id },
    });
    expect(attemptAfter.status).toBe(AttemptStatus.IN_PROGRESS);
    expect(attemptAfter.submittedAt).toBeNull();
    expect(attemptAfter.rawScore).toBeNull();

    const evalAfter = await prisma.evaluationResult.findUnique({
      where: { attemptId: attempt.id },
    });
    expect(evalAfter).toBeNull();
  });
});
