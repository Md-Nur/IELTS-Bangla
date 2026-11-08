-- ====================================================================
-- INITIAL MIGRATION: IELTS Bangla (Reading MVP)
-- Normalized Draft & Immutable Published Schema
-- Composite Foreign Keys, Partial Unique Indexes, Immutability Triggers
-- ====================================================================

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('READING', 'LISTENING', 'WRITING', 'SPEAKING');

-- CreateEnum
CREATE TYPE "TestCategory" AS ENUM ('ACADEMIC', 'GENERAL_TRAINING');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE_NOT_GIVEN', 'YES_NO_NOT_GIVEN', 'SENTENCE_COMPLETION', 'NOTE_COMPLETION', 'SUMMARY_COMPLETION', 'MATCHING_HEADINGS', 'MATCHING_INFORMATION', 'MATCHING_FEATURES', 'SHORT_ANSWER');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'TIMED_OUT', 'ABANDONED');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "emailVerified" TIMESTAMP(3),
    "phone" TEXT,
    "targetBand" DOUBLE PRECISION,
    "examDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Test (Draft Container)
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "module" "ModuleType" NOT NULL DEFAULT 'READING',
    "category" "TestCategory" NOT NULL DEFAULT 'ACADEMIC',
    "status" "TestStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "totalQuestions" INTEGER NOT NULL DEFAULT 40,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DraftSection
CREATE TABLE "DraftSection" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "passageText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DraftQuestionGroup
CREATE TABLE "DraftQuestionGroup" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "wordLimit" INTEGER,
    "contextOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftQuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DraftQuestion
CREATE TABLE "DraftQuestion" (
    "id" TEXT NOT NULL,
    "questionGroupId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "options" JSONB,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DraftAcceptedAnswer
CREATE TABLE "DraftAcceptedAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "acceptedText" TEXT NOT NULL,
    "isCaseSensitive" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftAcceptedAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PublishedTestVersion (Immutable Snapshot)
CREATE TABLE "PublishedTestVersion" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "totalQuestions" INTEGER NOT NULL DEFAULT 40,
    "bandConversionTable" JSONB NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedTestVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PublishedSection
CREATE TABLE "PublishedSection" (
    "id" TEXT NOT NULL,
    "testVersionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "passageText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PublishedQuestionGroup
CREATE TABLE "PublishedQuestionGroup" (
    "id" TEXT NOT NULL,
    "testVersionId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "wordLimit" INTEGER,
    "contextOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedQuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PublishedQuestion
CREATE TABLE "PublishedQuestion" (
    "id" TEXT NOT NULL,
    "testVersionId" TEXT NOT NULL,
    "questionGroupId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "options" JSONB,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PublishedAcceptedAnswer
CREATE TABLE "PublishedAcceptedAnswer" (
    "id" TEXT NOT NULL,
    "testVersionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "acceptedText" TEXT NOT NULL,
    "isCaseSensitive" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedAcceptedAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TestAttempt
CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "testVersionId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "rawScore" INTEGER,
    "estimatedBand" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable: StudentAnswer
CREATE TABLE "StudentAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "testVersionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerText" TEXT,
    "isFlaggedForReview" BOOLEAN NOT NULL DEFAULT false,
    "isCorrect" BOOLEAN,
    "scoreAwarded" INTEGER,
    "lastSavedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EvaluationResult
CREATE TABLE "EvaluationResult" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 40,
    "totalAttempted" INTEGER NOT NULL DEFAULT 0,
    "totalCorrect" INTEGER NOT NULL DEFAULT 0,
    "totalIncorrect" INTEGER NOT NULL DEFAULT 0,
    "rawScore" INTEGER NOT NULL DEFAULT 0,
    "estimatedBand" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "scoringVersion" TEXT NOT NULL DEFAULT 'reading_v1.0.0',
    "scoringConfig" JSONB NOT NULL,
    "sectionBreakdown" JSONB NOT NULL,
    "questionBreakdown" JSONB NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationResult_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- INDEXES & UNIQUE CONSTRAINTS
-- ====================================================================

-- User
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Test
CREATE UNIQUE INDEX "Test_slug_key" ON "Test"("slug");
CREATE INDEX "Test_module_category_status_idx" ON "Test"("module", "category", "status");

-- DraftSection
CREATE UNIQUE INDEX "DraftSection_testId_orderIndex_key" ON "DraftSection"("testId", "orderIndex");

-- DraftQuestionGroup
CREATE INDEX "DraftQuestionGroup_sectionId_orderIndex_idx" ON "DraftQuestionGroup"("sectionId", "orderIndex");

-- DraftQuestion
CREATE INDEX "DraftQuestion_questionGroupId_questionNumber_idx" ON "DraftQuestion"("questionGroupId", "questionNumber");

-- DraftAcceptedAnswer
CREATE INDEX "DraftAcceptedAnswer_questionId_idx" ON "DraftAcceptedAnswer"("questionId");

-- PublishedTestVersion
CREATE UNIQUE INDEX "PublishedTestVersion_testId_versionNumber_key" ON "PublishedTestVersion"("testId", "versionNumber");

-- PublishedSection (Composite unique for FK target)
CREATE UNIQUE INDEX "PublishedSection_testVersionId_id_key" ON "PublishedSection"("testVersionId", "id");
CREATE UNIQUE INDEX "PublishedSection_testVersionId_orderIndex_key" ON "PublishedSection"("testVersionId", "orderIndex");

-- PublishedQuestionGroup (Composite unique for FK target)
CREATE UNIQUE INDEX "PublishedQuestionGroup_testVersionId_id_key" ON "PublishedQuestionGroup"("testVersionId", "id");
CREATE INDEX "PublishedQuestionGroup_testVersionId_sectionId_orderIndex_idx" ON "PublishedQuestionGroup"("testVersionId", "sectionId", "orderIndex");

-- PublishedQuestion (Composite unique for FK target & Numbering uniqueness)
CREATE UNIQUE INDEX "PublishedQuestion_testVersionId_id_key" ON "PublishedQuestion"("testVersionId", "id");
CREATE UNIQUE INDEX "PublishedQuestion_testVersionId_questionNumber_key" ON "PublishedQuestion"("testVersionId", "questionNumber");
CREATE INDEX "PublishedQuestion_testVersionId_questionGroupId_idx" ON "PublishedQuestion"("testVersionId", "questionGroupId");

-- PublishedAcceptedAnswer
CREATE INDEX "PublishedAcceptedAnswer_testVersionId_questionId_idx" ON "PublishedAcceptedAnswer"("testVersionId", "questionId");

-- TestAttempt
CREATE UNIQUE INDEX "TestAttempt_id_testVersionId_key" ON "TestAttempt"("id", "testVersionId");
CREATE INDEX "TestAttempt_userId_testId_status_idx" ON "TestAttempt"("userId", "testId", "status");
CREATE INDEX "TestAttempt_testVersionId_idx" ON "TestAttempt"("testVersionId");

-- StudentAnswer
CREATE UNIQUE INDEX "StudentAnswer_attemptId_questionId_key" ON "StudentAnswer"("attemptId", "questionId");
CREATE INDEX "StudentAnswer_questionId_idx" ON "StudentAnswer"("questionId");

-- EvaluationResult
CREATE UNIQUE INDEX "EvaluationResult_attemptId_key" ON "EvaluationResult"("attemptId");

-- ====================================================================
-- FOREIGN KEY CONSTRAINTS
-- ====================================================================

-- Draft Hierarchy
ALTER TABLE "DraftSection" ADD CONSTRAINT "DraftSection_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DraftQuestionGroup" ADD CONSTRAINT "DraftQuestionGroup_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "DraftSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DraftQuestion" ADD CONSTRAINT "DraftQuestion_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "DraftQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DraftAcceptedAnswer" ADD CONSTRAINT "DraftAcceptedAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "DraftQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Published Hierarchy (Composite FKs locked to testVersionId, onDelete: RESTRICT)
ALTER TABLE "PublishedTestVersion" ADD CONSTRAINT "PublishedTestVersion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublishedSection" ADD CONSTRAINT "PublishedSection_testVersionId_fkey" FOREIGN KEY ("testVersionId") REFERENCES "PublishedTestVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublishedQuestionGroup" ADD CONSTRAINT "PublishedQuestionGroup_testVersionId_sectionId_fkey" FOREIGN KEY ("testVersionId", "sectionId") REFERENCES "PublishedSection"("testVersionId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublishedQuestion" ADD CONSTRAINT "PublishedQuestion_testVersionId_questionGroupId_fkey" FOREIGN KEY ("testVersionId", "questionGroupId") REFERENCES "PublishedQuestionGroup"("testVersionId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublishedAcceptedAnswer" ADD CONSTRAINT "PublishedAcceptedAnswer_testVersionId_questionId_fkey" FOREIGN KEY ("testVersionId", "questionId") REFERENCES "PublishedQuestion"("testVersionId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Attempt & Answer Constraints
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testVersionId_fkey" FOREIGN KEY ("testVersionId") REFERENCES "PublishedTestVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_attemptId_testVersionId_fkey" FOREIGN KEY ("attemptId", "testVersionId") REFERENCES "TestAttempt"("id", "testVersionId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_testVersionId_questionId_fkey" FOREIGN KEY ("testVersionId", "questionId") REFERENCES "PublishedQuestion"("testVersionId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ====================================================================
-- PARTIAL UNIQUE INDEX: Single Active Attempt per User per Logical Test
-- ====================================================================

CREATE UNIQUE INDEX "idx_unique_active_attempt_per_test"
ON "TestAttempt" ("userId", "testId")
WHERE status = 'IN_PROGRESS';

-- ====================================================================
-- IMMUTABILITY TRIGGERS: PublishedTestVersion
-- ====================================================================

CREATE OR REPLACE FUNCTION protect_published_test_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Immutable snapshot violation: Deleting a PublishedTestVersion is strictly prohibited.';
  ELSIF TG_OP = 'UPDATE' THEN
    -- Allow ONLY updating isArchived from false to true
    IF (OLD."isArchived" = false AND NEW."isArchived" = true) AND
       (OLD."id" = NEW."id" AND
        OLD."testId" = NEW."testId" AND
        OLD."versionNumber" = NEW."versionNumber" AND
        OLD."title" = NEW."title" AND
        OLD."durationMinutes" = NEW."durationMinutes" AND
        OLD."totalQuestions" = NEW."totalQuestions" AND
        OLD."bandConversionTable" = NEW."bandConversionTable" AND
        OLD."publishedAt" = NEW."publishedAt") THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'Immutable snapshot violation: Modifying PublishedTestVersion content or reversing archive state is strictly prohibited.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_published_test_version
BEFORE UPDATE OR DELETE ON "PublishedTestVersion"
FOR EACH ROW EXECUTE FUNCTION protect_published_test_version();

-- ====================================================================
-- IMMUTABILITY TRIGGERS: Published Child Tables
-- ====================================================================

CREATE OR REPLACE FUNCTION protect_published_child_record()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Immutable snapshot violation: Deleting records from % is strictly prohibited.', TG_TABLE_NAME;
  ELSIF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Immutable snapshot violation: Updating records in % is strictly prohibited.', TG_TABLE_NAME;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_published_section
BEFORE UPDATE OR DELETE ON "PublishedSection"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

CREATE TRIGGER trg_protect_published_question_group
BEFORE UPDATE OR DELETE ON "PublishedQuestionGroup"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

CREATE TRIGGER trg_protect_published_question
BEFORE UPDATE OR DELETE ON "PublishedQuestion"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

CREATE TRIGGER trg_protect_published_accepted_answer
BEFORE UPDATE OR DELETE ON "PublishedAcceptedAnswer"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

-- ====================================================================
-- STATEMENT-LEVEL TRIGGERS: Prevent TRUNCATE on Published Tables
-- ====================================================================

CREATE OR REPLACE FUNCTION prevent_published_truncate()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Immutable snapshot violation: TRUNCATE on % is strictly prohibited.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_truncate_published_version
BEFORE TRUNCATE ON "PublishedTestVersion"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_section
BEFORE TRUNCATE ON "PublishedSection"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_group
BEFORE TRUNCATE ON "PublishedQuestionGroup"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_question
BEFORE TRUNCATE ON "PublishedQuestion"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_answer
BEFORE TRUNCATE ON "PublishedAcceptedAnswer"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();
