import { AttemptStatus, QuestionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
