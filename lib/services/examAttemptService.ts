import { AttemptStatus, QuestionType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  evaluateReadingAttempt,
  QuestionScoringInput,
  StudentAnswerInput,
  QuestionScoreResult,
  SectionScoreSummary,
} from "@/lib/scoring/reading";
import { BandConversionRange } from "@/lib/scoring/band";

// ====================================================================
// Custom Service Errors
// ====================================================================

export class ExamNotFoundError extends Error {
  code: string;
  constructor(message: string = "Test or attempt not found", code: string = "NOT_FOUND") {
    super(message);
    this.name = "ExamNotFoundError";
    this.code = code;
  }
}

export class ExamForbiddenError extends Error {
  code: string;
  constructor(message: string = "Access denied to this attempt", code: string = "FORBIDDEN") {
    super(message);
    this.name = "ExamForbiddenError";
    this.code = code;
  }
}

export class ExamConflictError extends Error {
  code: string;
  constructor(message: string = "Attempt conflict", code: string = "CONFLICT") {
    super(message);
    this.name = "ExamConflictError";
    this.code = code;
  }
}

export class ExamExpiredError extends Error {
  code: string;
  constructor(message: string = "Attempt deadline has expired", code: string = "ATTEMPT_EXPIRED") {
    super(message);
    this.name = "ExamExpiredError";
    this.code = code;
  }
}

export class UnpublishedTestError extends Error {
  code: string;
  constructor(message: string = "No published version available for this test", code: string = "UNPUBLISHED_TEST") {
    super(message);
    this.name = "UnpublishedTestError";
    this.code = code;
  }
}

export class ExamQuestionMismatchError extends Error {
  code: string;
  constructor(
    message: string = "Question not found in the published test version associated with this attempt",
    code: string = "QUESTION_NOT_IN_VERSION"
  ) {
    super(message);
    this.name = "ExamQuestionMismatchError";
    this.code = code;
  }
}

export class ExamDeadlineNotPassedError extends Error {
  code: string;
  constructor(message: string = "Attempt deadline has not passed yet", code: string = "DEADLINE_NOT_PASSED") {
    super(message);
    this.name = "ExamDeadlineNotPassedError";
    this.code = code;
  }
}

// ====================================================================
// Explicit Response DTOs
// ====================================================================

export interface StartAttemptResponseDTO {
  attemptId: string;
  testId: string;
  testSlug: string;
  testTitle: string;
  testVersionId: string;
  versionNumber: number;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  totalQuestions: number;
  serverTime: string;
  remainingSeconds: number;
  isResumed: boolean;
}

export interface QuestionDTO {
  id: string;
  questionNumber: number;
  prompt: string;
  options: unknown | null;
}

export interface QuestionGroupDTO {
  id: string;
  orderIndex: number;
  instruction: string;
  questionType: QuestionType;
  wordLimit: number | null;
  contextOptions: unknown | null;
  questions: QuestionDTO[];
}

export interface SectionDTO {
  id: string;
  orderIndex: number;
  title: string;
  passageText: string;
  questionGroups: QuestionGroupDTO[];
}

export interface SavedAnswerDTO {
  questionId: string;
  answerText: string | null;
  isFlaggedForReview: boolean;
  lastSavedAt: string;
}

export interface ExamContentResponseDTO {
  attempt: {
    id: string;
    testId: string;
    testSlug: string;
    testTitle: string;
    testVersionId: string;
    versionNumber: number;
    status: AttemptStatus;
    startedAt: string;
    expiresAt: string;
    durationMinutes: number;
    totalQuestions: number;
    serverTime: string;
    remainingSeconds: number;
  };
  sections: SectionDTO[];
  savedAnswers: SavedAnswerDTO[];
}

// ====================================================================
// Exam Attempt Service Functions
// ====================================================================

export interface StartAttemptOptions {
  userId: string;
  testSlug?: string;
  testId?: string;
}

/**
 * Starts or resumes a test attempt against an active, published test version.
 * - Enforces database-authoritative timing.
 * - Enforces single active attempt per student per test.
 * - Handles concurrent start requests safely via partial unique index.
 */
export async function startExamAttempt(options: StartAttemptOptions): Promise<StartAttemptResponseDTO> {
  const { userId, testSlug, testId } = options;

  if (!testSlug && !testId) {
    throw new ExamNotFoundError("Either testSlug or testId must be provided");
  }

  // 1. Fetch database-authoritative time
  const timeQuery = await prisma.$queryRaw<Array<{ db_now: Date }>>`SELECT NOW() as db_now`;
  const dbNow = timeQuery[0]?.db_now ? new Date(timeQuery[0].db_now) : new Date();

  // 2. Resolve Test
  const test = await prisma.test.findFirst({
    where: {
      OR: [
        ...(testSlug ? [{ slug: testSlug }] : []),
        ...(testId ? [{ id: testId }] : []),
      ],
      status: "ACTIVE",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      durationMinutes: true,
      totalQuestions: true,
    },
  });

  if (!test) {
    throw new ExamNotFoundError("Test not found or is currently inactive", "TEST_NOT_FOUND");
  }

  // 3. Resolve active published test version (Never create an attempt against an unpublished version)
  const publishedVersion = await prisma.publishedTestVersion.findFirst({
    where: {
      testId: test.id,
      isArchived: false,
    },
    orderBy: { versionNumber: "desc" },
    select: {
      id: true,
      versionNumber: true,
      title: true,
      durationMinutes: true,
      totalQuestions: true,
    },
  });

  if (!publishedVersion) {
    throw new UnpublishedTestError("No active published version available for this test", "UNPUBLISHED_TEST");
  }

  // 4. Check if student already has an active IN_PROGRESS attempt for this test
  const existingAttempt = await prisma.testAttempt.findFirst({
    where: {
      userId,
      testId: test.id,
      status: AttemptStatus.IN_PROGRESS,
    },
    include: {
      testVersion: {
        select: {
          id: true,
          versionNumber: true,
          title: true,
          durationMinutes: true,
          totalQuestions: true,
        },
      },
      test: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
  });

  if (existingAttempt) {
    const remainingMs = existingAttempt.expiresAt.getTime() - dbNow.getTime();
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

    return {
      attemptId: existingAttempt.id,
      testId: existingAttempt.test.id,
      testSlug: existingAttempt.test.slug,
      testTitle: existingAttempt.test.title,
      testVersionId: existingAttempt.testVersion.id,
      versionNumber: existingAttempt.testVersion.versionNumber,
      status: existingAttempt.status,
      startedAt: existingAttempt.startedAt.toISOString(),
      expiresAt: existingAttempt.expiresAt.toISOString(),
      durationMinutes: existingAttempt.testVersion.durationMinutes,
      totalQuestions: existingAttempt.testVersion.totalQuestions,
      serverTime: dbNow.toISOString(),
      remainingSeconds,
      isResumed: true,
    };
  }

  // 5. Create new attempt using database-authoritative timestamps
  const startedAt = dbNow;
  const durationMinutes = publishedVersion.durationMinutes;
  const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

  try {
    const newAttempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId: test.id,
        testVersionId: publishedVersion.id,
        status: AttemptStatus.IN_PROGRESS,
        startedAt,
        expiresAt,
      },
      include: {
        testVersion: {
          select: {
            id: true,
            versionNumber: true,
            title: true,
            durationMinutes: true,
            totalQuestions: true,
          },
        },
        test: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    const remainingSeconds = Math.max(0, Math.floor((newAttempt.expiresAt.getTime() - dbNow.getTime()) / 1000));

    return {
      attemptId: newAttempt.id,
      testId: newAttempt.test.id,
      testSlug: newAttempt.test.slug,
      testTitle: newAttempt.test.title,
      testVersionId: newAttempt.testVersion.id,
      versionNumber: newAttempt.testVersion.versionNumber,
      status: newAttempt.status,
      startedAt: newAttempt.startedAt.toISOString(),
      expiresAt: newAttempt.expiresAt.toISOString(),
      durationMinutes: newAttempt.testVersion.durationMinutes,
      totalQuestions: newAttempt.testVersion.totalQuestions,
      serverTime: dbNow.toISOString(),
      remainingSeconds,
      isResumed: false,
    };
  } catch (error: unknown) {
    // Check for PostgreSQL unique constraint violation on idx_unique_active_attempt_per_test
    const isUniqueViolation =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";

    if (isUniqueViolation) {
      // Another concurrent request created an active attempt in the same millisecond; return it safely
      const concurrentAttempt = await prisma.testAttempt.findFirst({
        where: {
          userId,
          testId: test.id,
          status: AttemptStatus.IN_PROGRESS,
        },
        include: {
          testVersion: {
            select: {
              id: true,
              versionNumber: true,
              title: true,
              durationMinutes: true,
              totalQuestions: true,
            },
          },
          test: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
      });

      if (concurrentAttempt) {
        const remainingMs = concurrentAttempt.expiresAt.getTime() - dbNow.getTime();
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

        return {
          attemptId: concurrentAttempt.id,
          testId: concurrentAttempt.test.id,
          testSlug: concurrentAttempt.test.slug,
          testTitle: concurrentAttempt.test.title,
          testVersionId: concurrentAttempt.testVersion.id,
          versionNumber: concurrentAttempt.testVersion.versionNumber,
          status: concurrentAttempt.status,
          startedAt: concurrentAttempt.startedAt.toISOString(),
          expiresAt: concurrentAttempt.expiresAt.toISOString(),
          durationMinutes: concurrentAttempt.testVersion.durationMinutes,
          totalQuestions: concurrentAttempt.testVersion.totalQuestions,
          serverTime: dbNow.toISOString(),
          remainingSeconds,
          isResumed: true,
        };
      }
    }

    throw error;
  }
}

export interface GetExamContentOptions {
  userId: string;
  attemptId: string;
}

/**
 * Retrieves full published exam content and saved answers for an active attempt.
 * - Verifies student authentication and attempt ownership (prevents IDOR).
 * - Verifies attempt is still IN_PROGRESS and not expired.
 * - Computes authoritative remaining time against database clock.
 * - Strictly omits accepted answers, rationales, and evaluation data.
 */
export async function getExamContent(options: GetExamContentOptions): Promise<ExamContentResponseDTO> {
  const { userId, attemptId } = options;

  // 1. Fetch database-authoritative time
  const timeQuery = await prisma.$queryRaw<Array<{ db_now: Date }>>`SELECT NOW() as db_now`;
  const dbNow = timeQuery[0]?.db_now ? new Date(timeQuery[0].db_now) : new Date();

  // 2. Fetch Attempt with Test and PublishedVersion metadata
  const attempt = await prisma.testAttempt.findUnique({
    where: { id: attemptId },
    include: {
      test: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      testVersion: {
        select: {
          id: true,
          versionNumber: true,
          title: true,
          durationMinutes: true,
          totalQuestions: true,
        },
      },
    },
  });

  if (!attempt) {
    throw new ExamNotFoundError("Test attempt not found", "ATTEMPT_NOT_FOUND");
  }

  // 3. IDOR Protection: Verify student ownership
  if (attempt.userId !== userId) {
    throw new ExamForbiddenError("You do not have permission to access this examination attempt", "FORBIDDEN_ATTEMPT_ACCESS");
  }

  // 4. Verify attempt is still IN_PROGRESS
  if (attempt.status !== AttemptStatus.IN_PROGRESS) {
    throw new ExamConflictError(
      `Attempt is no longer in progress (status: ${attempt.status})`,
      "ATTEMPT_NOT_IN_PROGRESS"
    );
  }

  // 5. Verify attempt deadline has not expired according to database-authoritative time
  if (dbNow >= attempt.expiresAt) {
    throw new ExamExpiredError(
      "The allocated time for this examination attempt has expired",
      "ATTEMPT_EXPIRED"
    );
  }

  // 6. Fetch published sections, question groups, and questions
  // SECURITY INVARIANT: NEVER select acceptedAnswers, explanation, or bandConversionTable!
  const publishedSections = await prisma.publishedSection.findMany({
    where: { testVersionId: attempt.testVersionId },
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      orderIndex: true,
      title: true,
      passageText: true,
      groups: {
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          orderIndex: true,
          instruction: true,
          questionType: true,
          wordLimit: true,
          contextOptions: true,
          questions: {
            orderBy: { questionNumber: "asc" },
            select: {
              id: true,
              questionNumber: true,
              prompt: true,
              options: true,
              // Strictly excluding acceptedAnswers and explanation
            },
          },
        },
      },
    },
  });

  // 7. Fetch student's previously saved answers if any exist
  const savedAnswers = await prisma.studentAnswer.findMany({
    where: { attemptId: attempt.id },
    orderBy: { questionId: "asc" },
    select: {
      questionId: true,
      answerText: true,
      isFlaggedForReview: true,
      lastSavedAt: true,
    },
  });

  // 8. Transform into explicit DTOs
  const remainingMs = attempt.expiresAt.getTime() - dbNow.getTime();
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

  const sectionsDTO: SectionDTO[] = publishedSections.map((sec) => ({
    id: sec.id,
    orderIndex: sec.orderIndex,
    title: sec.title,
    passageText: sec.passageText,
    questionGroups: sec.groups.map((grp) => ({
      id: grp.id,
      orderIndex: grp.orderIndex,
      instruction: grp.instruction,
      questionType: grp.questionType,
      wordLimit: grp.wordLimit,
      contextOptions: grp.contextOptions ?? null,
      questions: grp.questions.map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        prompt: q.prompt,
        options: q.options ?? null,
      })),
    })),
  }));

  const savedAnswersDTO: SavedAnswerDTO[] = savedAnswers.map((ans) => ({
    questionId: ans.questionId,
    answerText: ans.answerText,
    isFlaggedForReview: ans.isFlaggedForReview,
    lastSavedAt: ans.lastSavedAt.toISOString(),
  }));

  return {
    attempt: {
      id: attempt.id,
      testId: attempt.test.id,
      testSlug: attempt.test.slug,
      testTitle: attempt.test.title,
      testVersionId: attempt.testVersion.id,
      versionNumber: attempt.testVersion.versionNumber,
      status: attempt.status,
      startedAt: attempt.startedAt.toISOString(),
      expiresAt: attempt.expiresAt.toISOString(),
      durationMinutes: attempt.testVersion.durationMinutes,
      totalQuestions: attempt.testVersion.totalQuestions,
      serverTime: dbNow.toISOString(),
      remainingSeconds,
    },
    sections: sectionsDTO,
    savedAnswers: savedAnswersDTO,
  };
}

export interface SaveAnswerOptions {
  userId: string;
  attemptId: string;
  questionId: string;
  answerText?: string | null;
  isFlaggedForReview?: boolean;
}

export interface SaveAnswerResponseDTO {
  questionId: string;
  answerText: string | null;
  isFlaggedForReview: boolean;
  lastSavedAt: string;
}

/**
 * Autosaves a student's answer for a specific question within an active attempt.
 * - Authenticates attempt ownership (IDOR prevention).
 * - Acquires row-level pessimistic lock (SELECT FOR UPDATE) on TestAttempt.
 * - Verifies attempt is IN_PROGRESS and deadline has not expired using database time.
 * - Verifies question belongs to the attempt's published test version.
 * - Idempotently upserts StudentAnswer without calculating correctness or exposing answer keys.
 */
export async function saveStudentAnswer(options: SaveAnswerOptions): Promise<SaveAnswerResponseDTO> {
  const { userId, attemptId, questionId, answerText, isFlaggedForReview } = options;

  return await prisma.$transaction(async (tx) => {
    // 1. Acquire row lock on TestAttempt (SELECT FOR UPDATE) and query server-authoritative time
    const attempts = await tx.$queryRaw<Array<{
      id: string;
      userId: string;
      status: AttemptStatus;
      expiresAt: Date;
      testVersionId: string;
      db_now: Date;
    }>>`
      SELECT id, "userId", status, "expiresAt", "testVersionId", NOW() as db_now
      FROM "TestAttempt"
      WHERE id = ${attemptId}
      FOR UPDATE
    `;

    if (!attempts.length) {
      throw new ExamNotFoundError("Test attempt not found", "ATTEMPT_NOT_FOUND");
    }

    const attempt = attempts[0];
    const dbNow = new Date(attempt.db_now);

    // 2. IDOR Protection: Verify attempt ownership
    if (attempt.userId !== userId) {
      throw new ExamForbiddenError(
        "You do not have permission to modify this examination attempt",
        "FORBIDDEN_ATTEMPT_ACCESS"
      );
    }

    // 3. Verify attempt is still IN_PROGRESS
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new ExamConflictError(
        `Cannot save answer: attempt is no longer in progress (status: ${attempt.status})`,
        "ATTEMPT_NOT_IN_PROGRESS"
      );
    }

    // 4. Verify deadline has not passed (database-authoritative time)
    if (dbNow >= new Date(attempt.expiresAt)) {
      throw new ExamExpiredError(
        "Cannot save answer: attempt deadline has expired",
        "ATTEMPT_EXPIRED"
      );
    }

    // 5. Verify that the question exists and belongs to the attempt's published test version
    const question = await tx.publishedQuestion.findFirst({
      where: {
        id: questionId,
        testVersionId: attempt.testVersionId,
      },
      select: { id: true, questionNumber: true },
    });

    if (!question) {
      throw new ExamQuestionMismatchError(
        "Question not found in the published test version associated with this attempt",
        "QUESTION_NOT_IN_VERSION"
      );
    }

    // 6. Idempotent upsert of StudentAnswer with version-locked composite foreign keys
    // NOTE: isCorrect and scoreAwarded are strictly NOT set or evaluated during autosave
    const saved = await tx.studentAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId: attempt.id,
          questionId,
        },
      },
      update: {
        answerText: answerText !== undefined && answerText !== null ? answerText : null,
        isFlaggedForReview: Boolean(isFlaggedForReview),
        lastSavedAt: dbNow,
      },
      create: {
        attemptId: attempt.id,
        testVersionId: attempt.testVersionId,
        questionId,
        answerText: answerText !== undefined && answerText !== null ? answerText : null,
        isFlaggedForReview: Boolean(isFlaggedForReview),
        lastSavedAt: dbNow,
      },
      select: {
        questionId: true,
        answerText: true,
        isFlaggedForReview: true,
        lastSavedAt: true,
      },
    });

    return {
      questionId: saved.questionId,
      answerText: saved.answerText,
      isFlaggedForReview: saved.isFlaggedForReview,
      lastSavedAt: saved.lastSavedAt.toISOString(),
    };
  });
}

export interface FinalizeAttemptOptions {
  userId: string;
  attemptId: string;
  reason?: "MANUAL" | "TIMEOUT";
}

export interface FinalizeAttemptResponseDTO {
  attemptId: string;
  testId: string;
  testSlug: string;
  testTitle: string;
  testVersionId: string;
  versionNumber: number;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  rawScore: number;
  estimatedBand: number;
  scoringVersion: string;
  sectionBreakdown: Record<string, SectionScoreSummary>;
  questionBreakdown: QuestionScoreResult[];
  redirectUrl: string;
}

/**
 * Securely finalizes a test attempt, evaluates answers against the published answer key,
 * calculates raw score and band, and persists the evaluation result atomically within one transaction.
 *
 * Transaction Guarantees:
 * 1. Acquires pessimistic row lock (SELECT FOR UPDATE) on TestAttempt.
 * 2. Uses database-authoritative current time.
 * 3. Enforces attempt ownership (IDOR prevention).
 * 4. Idempotently returns committed result if already submitted or timed out.
 * 5. Rejects premature timeout requests (reason === 'TIMEOUT' but !isExpired).
 * 6. Sets status to SUBMITTED (manual on-time) or TIMED_OUT (deadline passed).
 * 7. Evaluates all questions using pure deterministic scoring engine.
 * 8. Upserts correctness and score on StudentAnswer records.
 * 9. Persists immutable EvaluationResult with question and section breakdowns.
 * 10. Atomically commits all mutations; rolls back completely on any failure.
 */
export async function finalizeAndScoreAttempt(
  options: FinalizeAttemptOptions
): Promise<FinalizeAttemptResponseDTO> {
  const { userId, attemptId, reason = "MANUAL" } = options;

  return await prisma.$transaction(async (tx) => {
    // 1. Lock the TestAttempt row using SELECT FOR UPDATE and read database-authoritative current time
    const attempts = await tx.$queryRaw<Array<{
      id: string;
      userId: string;
      testId: string;
      testVersionId: string;
      status: AttemptStatus;
      startedAt: Date;
      expiresAt: Date;
      submittedAt: Date | null;
      timeSpentSeconds: number;
      rawScore: number | null;
      estimatedBand: number | null;
      db_now: Date;
    }>>`
      SELECT 
        id, "userId", "testId", "testVersionId", status, "startedAt", "expiresAt", "submittedAt", "timeSpentSeconds", "rawScore", "estimatedBand",
        NOW() as db_now
      FROM "TestAttempt"
      WHERE id = ${attemptId}
      FOR UPDATE
    `;

    if (!attempts.length) {
      throw new ExamNotFoundError("Test attempt not found", "ATTEMPT_NOT_FOUND");
    }

    const attempt = attempts[0];
    const dbNow = new Date(attempt.db_now);

    // 2. Verify attempt ownership (IDOR prevention)
    if (attempt.userId !== userId) {
      throw new ExamForbiddenError(
        "You do not have permission to finalize this examination attempt",
        "FORBIDDEN_ATTEMPT_ACCESS"
      );
    }

    // Fetch test metadata for response DTO
    const testMeta = await tx.test.findUnique({
      where: { id: attempt.testId },
      select: { slug: true, title: true },
    });
    const versionMeta = await tx.publishedTestVersion.findUnique({
      where: { id: attempt.testVersionId },
      select: { versionNumber: true, bandConversionTable: true, durationMinutes: true, totalQuestions: true },
    });

    if (!testMeta || !versionMeta) {
      throw new ExamNotFoundError("Test or test version metadata not found", "TEST_NOT_FOUND");
    }

    // 3. Idempotency Check: If attempt is already SUBMITTED or TIMED_OUT, return existing committed EvaluationResult
    if (attempt.status === AttemptStatus.SUBMITTED || attempt.status === AttemptStatus.TIMED_OUT) {
      const existingEvaluation = await tx.evaluationResult.findUnique({
        where: { attemptId: attempt.id },
      });

      if (existingEvaluation) {
        return {
          attemptId: attempt.id,
          testId: attempt.testId,
          testSlug: testMeta.slug,
          testTitle: testMeta.title,
          testVersionId: attempt.testVersionId,
          versionNumber: versionMeta.versionNumber,
          status: attempt.status,
          startedAt: attempt.startedAt.toISOString(),
          expiresAt: attempt.expiresAt.toISOString(),
          submittedAt: (attempt.submittedAt ?? existingEvaluation.evaluatedAt).toISOString(),
          timeSpentSeconds: attempt.timeSpentSeconds,
          totalQuestions: existingEvaluation.totalQuestions,
          totalAttempted: existingEvaluation.totalAttempted,
          totalCorrect: existingEvaluation.totalCorrect,
          totalIncorrect: existingEvaluation.totalIncorrect,
          rawScore: existingEvaluation.rawScore,
          estimatedBand: existingEvaluation.estimatedBand,
          scoringVersion: existingEvaluation.scoringVersion,
          sectionBreakdown: existingEvaluation.sectionBreakdown as unknown as Record<string, SectionScoreSummary>,
          questionBreakdown: existingEvaluation.questionBreakdown as unknown as QuestionScoreResult[],
          redirectUrl: `/results/${attempt.id}`,
        };
      }
      throw new ExamConflictError("Attempt has been finalized but evaluation result is missing", "EVALUATION_MISSING");
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new ExamConflictError(
        `Attempt is in status ${attempt.status} and cannot be finalized`,
        "ATTEMPT_NOT_IN_PROGRESS"
      );
    }

    // 4. Evaluate deadline & determine final status
    const isExpired = dbNow.getTime() >= new Date(attempt.expiresAt).getTime();

    if (reason === "TIMEOUT" && !isExpired) {
      throw new ExamDeadlineNotPassedError(
        "Attempt deadline has not passed yet",
        "DEADLINE_NOT_PASSED"
      );
    }

    const finalStatus: AttemptStatus = isExpired ? AttemptStatus.TIMED_OUT : AttemptStatus.SUBMITTED;

    // Calculate authoritative time spent
    const startedTime = new Date(attempt.startedAt).getTime();
    const expiresTime = new Date(attempt.expiresAt).getTime();
    const nowTime = dbNow.getTime();
    const maxDurationMs = expiresTime - startedTime;
    const actualTimeSpentMs = isExpired ? maxDurationMs : Math.min(nowTime - startedTime, maxDurationMs);
    const timeSpentSeconds = Math.max(0, Math.floor(actualTimeSpentMs / 1000));

    // 5. Load all saved answers for this attempt
    const savedAnswers = await tx.studentAnswer.findMany({
      where: { attemptId: attempt.id },
    });
    const existingQuestionIds = new Set(savedAnswers.map((a) => a.questionId));

    // 6. Load published sections, groups, questions, and accepted answers
    const publishedSections = await tx.publishedSection.findMany({
      where: { testVersionId: attempt.testVersionId },
      orderBy: { orderIndex: "asc" },
      include: {
        groups: {
          orderBy: { orderIndex: "asc" },
          include: {
            questions: {
              orderBy: { questionNumber: "asc" },
              include: {
                acceptedAnswers: {
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
        },
      },
    });

    const questionsInput: QuestionScoringInput[] = [];
    for (const sec of publishedSections) {
      for (const grp of sec.groups) {
        for (const q of grp.questions) {
          questionsInput.push({
            questionId: q.id,
            questionNumber: q.questionNumber,
            questionType: grp.questionType,
            wordLimit: grp.wordLimit,
            sectionIndex: sec.orderIndex,
            explanation: q.explanation,
            acceptedAnswers: q.acceptedAnswers.map((a) => ({
              acceptedText: a.acceptedText,
              isCaseSensitive: a.isCaseSensitive,
            })),
          });
        }
      }
    }

    const studentAnswersInput: StudentAnswerInput[] = savedAnswers.map((sa) => ({
      questionId: sa.questionId,
      answerText: sa.answerText,
    }));

    // 7. Evaluate answers using pure deterministic scoring engine
    const summary = evaluateReadingAttempt(
      questionsInput,
      studentAnswersInput,
      versionMeta.bandConversionTable as unknown as BandConversionRange[]
    );

    // 8. Persist question-level evaluation on StudentAnswer
    const missingAnswers = summary.questionBreakdown
      .filter((q) => !existingQuestionIds.has(q.questionId))
      .map((q) => ({
        attemptId: attempt.id,
        testVersionId: attempt.testVersionId,
        questionId: q.questionId,
        answerText: null,
        isFlaggedForReview: false,
        isCorrect: q.isCorrect,
        scoreAwarded: q.scoreAwarded,
        lastSavedAt: dbNow,
      }));

    if (missingAnswers.length > 0) {
      await tx.studentAnswer.createMany({
        data: missingAnswers,
      });
    }

    // Update existing student answers with correctness and score
    await Promise.all(
      summary.questionBreakdown
        .filter((q) => existingQuestionIds.has(q.questionId))
        .map((q) =>
          tx.studentAnswer.update({
            where: {
              attemptId_questionId: {
                attemptId: attempt.id,
                questionId: q.questionId,
              },
            },
            data: {
              isCorrect: q.isCorrect,
              scoreAwarded: q.scoreAwarded,
            },
          })
        )
    );

    // 9. Update TestAttempt status, score, and timestamps
    await tx.testAttempt.update({
      where: { id: attempt.id },
      data: {
        status: finalStatus,
        submittedAt: dbNow,
        timeSpentSeconds,
        rawScore: summary.rawScore,
        estimatedBand: summary.estimatedBand,
      },
    });

    // 10. Create EvaluationResult snapshot
    const scoringConfig = {
      version: "reading_v1.0.0",
      scoringEngine: "deterministic_exact_match",
      bandConversionTable: versionMeta.bandConversionTable,
      durationMinutes: versionMeta.durationMinutes,
      rules: {
        wordLimitStrict: true,
        caseSensitiveDefault: false,
        hyphenatedAsSingleWord: true,
      },
    };

    const evaluation = await tx.evaluationResult.create({
      data: {
        attemptId: attempt.id,
        totalQuestions: summary.totalQuestions,
        totalAttempted: summary.totalAttempted,
        totalCorrect: summary.totalCorrect,
        totalIncorrect: summary.totalIncorrect,
        rawScore: summary.rawScore,
        estimatedBand: summary.estimatedBand,
        scoringVersion: "reading_v1.0.0",
        scoringConfig: scoringConfig as unknown as Prisma.InputJsonValue,
        sectionBreakdown: summary.sectionBreakdown as unknown as Prisma.InputJsonValue,
        questionBreakdown: summary.questionBreakdown as unknown as Prisma.InputJsonValue,
        evaluatedAt: dbNow,
      },
    });

    return {
      attemptId: attempt.id,
      testId: attempt.testId,
      testSlug: testMeta.slug,
      testTitle: testMeta.title,
      testVersionId: attempt.testVersionId,
      versionNumber: versionMeta.versionNumber,
      status: finalStatus,
      startedAt: attempt.startedAt.toISOString(),
      expiresAt: attempt.expiresAt.toISOString(),
      submittedAt: dbNow.toISOString(),
      timeSpentSeconds,
      totalQuestions: evaluation.totalQuestions,
      totalAttempted: evaluation.totalAttempted,
      totalCorrect: evaluation.totalCorrect,
      totalIncorrect: evaluation.totalIncorrect,
      rawScore: evaluation.rawScore,
      estimatedBand: evaluation.estimatedBand,
      scoringVersion: evaluation.scoringVersion,
      sectionBreakdown: summary.sectionBreakdown,
      questionBreakdown: summary.questionBreakdown,
      redirectUrl: `/results/${attempt.id}`,
    };
  });
}

export interface QuestionReviewDTO {
  questionId: string;
  questionNumber: number;
  prompt: string;
  questionType: string;
  studentAnswer: string | null;
  acceptedAnswers: string[];
  primaryAcceptedAnswer: string;
  isCorrect: boolean;
  scoreAwarded: number;
  wordLimitExceeded: boolean;
  explanation: string | null;
}

export interface SectionReviewDTO {
  sectionIndex: number;
  title: string;
  passageText: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  accuracyPercentage: number;
  questions: QuestionReviewDTO[];
}

export interface ExamResultResponseDTO {
  attemptId: string;
  testId: string;
  testSlug: string;
  testTitle: string;
  testVersionId: string;
  versionNumber: number;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string;
  completionDate: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  rawScore: number;
  estimatedBand: number;
  scoringVersion: string;
  bandDisclaimer: string;
  sectionBreakdown: Record<string, SectionScoreSummary>;
  sections: SectionReviewDTO[];
}

export interface GetExamResultOptions {
  userId: string;
  attemptId: string;
}

/**
 * Retrieves the comprehensive examination result and question-by-question review
 * for a finalized (SUBMITTED or TIMED_OUT) attempt.
 *
 * Security & Integrity Guarantees:
 * - Scoped strictly to the attempt owner (IDOR prevention).
 * - Only accessible after attempt has been finalized (SUBMITTED or TIMED_OUT).
 * - Uses server-authoritative EvaluationResult matching the stored scoringVersion.
 * - Never calculates or alters scores on the client.
 */
export async function getExamResult(options: GetExamResultOptions): Promise<ExamResultResponseDTO> {
  const { userId, attemptId } = options;

  // 1. Fetch Attempt with Test, Version, and Evaluation metadata
  const attempt = await prisma.testAttempt.findUnique({
    where: { id: attemptId },
    include: {
      test: {
        select: {
          id: true,
          slug: true,
          title: true,
          durationMinutes: true,
          totalQuestions: true,
        },
      },
      testVersion: {
        select: {
          id: true,
          versionNumber: true,
          bandConversionTable: true,
        },
      },
      evaluation: true,
    },
  });

  if (!attempt) {
    throw new ExamNotFoundError("Test attempt not found", "ATTEMPT_NOT_FOUND");
  }

  // 2. IDOR Protection: Scoped strictly to attempt owner
  if (attempt.userId !== userId) {
    throw new ExamForbiddenError(
      "You do not have permission to view this examination result",
      "FORBIDDEN_ATTEMPT_ACCESS"
    );
  }

  // 3. Status Check: Must be finalized (SUBMITTED or TIMED_OUT)
  if (attempt.status === AttemptStatus.IN_PROGRESS) {
    throw new ExamConflictError(
      "Examination results are not available while attempt is in progress",
      "ATTEMPT_STILL_IN_PROGRESS"
    );
  }

  if (attempt.status === AttemptStatus.ABANDONED) {
    throw new ExamConflictError(
      "This examination attempt was abandoned and cannot be evaluated",
      "ATTEMPT_ABANDONED"
    );
  }

  if (!attempt.evaluation) {
    throw new ExamConflictError(
      "Evaluation result has not been generated for this attempt",
      "EVALUATION_NOT_FOUND"
    );
  }

  // 4. Fetch published sections, groups, and questions to construct the detailed passage-by-passage review
  const publishedSections = await prisma.publishedSection.findMany({
    where: { testVersionId: attempt.testVersionId },
    orderBy: { orderIndex: "asc" },
    include: {
      groups: {
        orderBy: { orderIndex: "asc" },
        include: {
          questions: {
            orderBy: { questionNumber: "asc" },
            include: {
              acceptedAnswers: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
      },
    },
  });

  // Map stored question evaluations from EvaluationResult.questionBreakdown
  const evalQuestions = (attempt.evaluation.questionBreakdown as unknown as QuestionScoreResult[]) || [];
  const evalMap = new Map<number, QuestionScoreResult>();
  for (const item of evalQuestions) {
    evalMap.set(item.questionNumber, item);
  }

  // 5. Structure sections with question reviews
  const sectionsDTO: SectionReviewDTO[] = publishedSections.map((sec) => {
    const questionsInSec: QuestionReviewDTO[] = [];
    let secAttempted = 0;
    let secCorrect = 0;

    for (const grp of sec.groups) {
      for (const q of grp.questions) {
        const evalItem = evalMap.get(q.questionNumber);
        const studentAns = evalItem?.studentAnswer ?? null;
        const isCorrect = evalItem?.isCorrect ?? false;
        const scoreAwarded = evalItem?.scoreAwarded ?? 0;
        const wordLimitExceeded = evalItem?.wordLimitExceeded ?? false;
        const explanation = q.explanation ?? evalItem?.explanation ?? null;

        if (studentAns !== null && studentAns.trim().length > 0) {
          secAttempted++;
        }
        if (isCorrect) {
          secCorrect++;
        }

        const acceptedList = q.acceptedAnswers.map((a) => a.acceptedText);
        const primaryAnswer = q.acceptedAnswers.find((a) => a.orderIndex === 0)?.acceptedText || acceptedList[0] || "";

        questionsInSec.push({
          questionId: q.id,
          questionNumber: q.questionNumber,
          prompt: q.prompt,
          questionType: grp.questionType,
          studentAnswer: studentAns,
          acceptedAnswers: acceptedList,
          primaryAcceptedAnswer: primaryAnswer,
          isCorrect,
          scoreAwarded,
          wordLimitExceeded,
          explanation,
        });
      }
    }

    questionsInSec.sort((a, b) => a.questionNumber - b.questionNumber);

    const totalInSec = questionsInSec.length;
    const accuracy = totalInSec > 0 ? Math.round((secCorrect / totalInSec) * 100) : 0;

    return {
      sectionIndex: sec.orderIndex,
      title: sec.title,
      passageText: sec.passageText,
      totalQuestions: totalInSec,
      attempted: secAttempted,
      correct: secCorrect,
      accuracyPercentage: accuracy,
      questions: questionsInSec,
    };
  });

  const submittedAtDate = attempt.submittedAt ?? attempt.evaluation.evaluatedAt;

  return {
    attemptId: attempt.id,
    testId: attempt.test.id,
    testSlug: attempt.test.slug,
    testTitle: attempt.test.title,
    testVersionId: attempt.testVersionId,
    versionNumber: attempt.testVersion.versionNumber,
    status: attempt.status,
    startedAt: attempt.startedAt.toISOString(),
    expiresAt: attempt.expiresAt.toISOString(),
    submittedAt: submittedAtDate.toISOString(),
    completionDate: submittedAtDate.toISOString(),
    timeSpentSeconds: attempt.timeSpentSeconds,
    totalQuestions: attempt.evaluation.totalQuestions,
    totalAttempted: attempt.evaluation.totalAttempted,
    totalCorrect: attempt.evaluation.totalCorrect,
    totalIncorrect: attempt.evaluation.totalIncorrect,
    rawScore: attempt.evaluation.rawScore,
    estimatedBand: attempt.evaluation.estimatedBand,
    scoringVersion: attempt.evaluation.scoringVersion,
    bandDisclaimer:
      "Estimated IELTS Academic Reading band calculated using the platform's published conversion table for Mock Test 01.",
    sectionBreakdown: attempt.evaluation.sectionBreakdown as unknown as Record<string, SectionScoreSummary>,
    sections: sectionsDTO,
  };
}
