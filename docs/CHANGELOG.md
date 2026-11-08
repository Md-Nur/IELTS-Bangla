# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-09

### Added
- **Authentication & Stateless Session Layer:**
  - Implemented session issuance and verification using `jose` HS256 JWTs (`lib/auth/session.ts`) supporting both Bearer tokens and HTTP-only `ib_session` cookies.
  - Implemented password hashing using `bcryptjs`.
  - Implemented role-based and active-status guards in `lib/auth/guards.ts` (`getCurrentUser`, `requireAuth`, `requireRole`).
  - Implemented `/api/auth/register` (strictly enforcing `Role.STUDENT`), `/api/auth/login`, and `/api/auth/logout`.
  - Authored test suite `app/api/auth/__tests__/authRoutes.test.ts` (6 tests passing).
- **Prisma Client Singleton:**
  - Configured global singleton in `lib/prisma.ts` for connection pooling across serverless invocations.
- **Reading Exam Attempt Service (`lib/services/examAttemptService.ts`):**
  - `startExamAttempt`: Fetches database-authoritative time (`SELECT NOW()`), resolves active published test version, enforces single active attempt per student, resumes existing active attempts (`isResumed: true`), and catches concurrent insert collisions via the PostgreSQL partial unique index `idx_unique_active_attempt_per_test`.
  - `getExamContent`: Validates student ownership (IDOR prevention), verifies attempt is active (`IN_PROGRESS`) and unexpired, returns continuous 1..40 questions across 3 sections, and strictly excludes accepted answers, explanations, and scoring configurations from student payloads.
  - Defined explicit typed DTOs: `StartAttemptResponseDTO`, `ExamContentResponseDTO`, `SectionDTO`, `QuestionGroupDTO`, `QuestionDTO`, `SavedAnswerDTO`.
  - Authored integration test suite `lib/services/__tests__/examAttemptService.test.ts` (9 tests passing).
- **Student-Facing CD-IELTS Examination Interface (`/exam/[attemptId]`):**
  - Built full desktop dual split-screen layout with independently scrollable passage viewer (`ExamPassagePane`) and question workspace (`ExamQuestionsPane`).
  - Built mobile-responsive layout featuring single-column toggle (`[Passage | Questions]`) and touch-friendly controls.
  - Implemented prominent countdown timer (`useCountdownTimer`) ticking against server-authoritative `expiresAt` with warning (10m) and urgent (5m) alert styling.
  - Built interactive renderers for all 7 IELTS question types: `TrueFalseNotGiven`, `YesNoNotGiven`, `MultipleChoice`, `TextCompletion` (with real-time word limit validation), `MatchingHeadings` (Roman numerals i–ix dropdown with List of Headings reference card), and `SummaryCompletion` (letter A–H dropdown with word list reference card).
  - Implemented 1..40 Question Palette (`ExamPalette` & `ExamBottomBar`) with answered, unanswered, flagged for review, and active focus states.
  - Implemented examination overview modal (`ExamReviewModal`), exit confirmation dialog (`ExamExitModal`), and browser `beforeunload` prevention.
  - Implemented lifecycle screens: `ExamLoadingState`, `ExamErrorState` with retry action, and `ExamExpiredState`.
  - Built client state hook (`useExamState`) managing answer map, navigation, and structured callbacks for autosave integration.
  - Updated landing page (`app/page.tsx`) with test catalog card and automatic session/attempt startup flow.
  - Authored comprehensive test suite in `components/exam/__tests__/examInterface.test.ts` (6 tests passing).
- **Reliable Answer Autosaving (`PUT /api/exam/[attemptId]/answers`):**
  - Implemented `saveStudentAnswer` in `lib/services/examAttemptService.ts` utilizing transaction-scoped `SELECT ... FOR UPDATE` row locking on `TestAttempt` to serialize writes and eliminate races with attempt finalization.
  - Server-authoritative expiration enforcement reading `SELECT NOW()` directly from the PostgreSQL engine.
  - Validates question belongs to the attempt's published test version (`QUESTION_NOT_IN_VERSION` check) and enforces payload limits via Zod.
  - Idempotent upsert into `StudentAnswer` with composite foreign key verification.
  - Absolute answer-key containment: `isCorrect` and `scoreAwarded` are explicitly not computed, and no accepted answers or evaluation data are exposed in API responses.
  - Built frontend `useExamAutosave` hook with debounced text inputs (600ms), immediate discrete updates (50ms), monotonic version checking to ignore out-of-order responses, exponential retry backoff (1s, 2s, 4s), automatic re-sync on `online` event, and `beforeunload` warning when unsaved changes exist.
  - Integrated visual autosave status indicators (`Saving...`, `Saved`, `Offline / Retrying`) in `ExamHeader`.
  - Authored comprehensive test suite `app/api/exam/__tests__/examAutosave.test.ts` covering 11 concurrency, security, expiration, and idempotency test cases.
- **Secure Exam Finalization & Reading Scoring (`POST /api/exam/[attemptId]/finalize`):**
  - Implemented `finalizeAndScoreAttempt` in `lib/services/examAttemptService.ts` executing row lock (`SELECT FOR UPDATE`), authoritative clock checks (`SELECT NOW() as db_now`), answer evaluation, and `EvaluationResult` persistence inside a single atomic transaction.
  - Server-authoritative deadline evaluation: on-time manual submissions transition to `SUBMITTED`; expired attempts transition to `TIMED_OUT`; premature timeout requests are rejected with `400 DEADLINE_NOT_PASSED`.
  - Integrated pure deterministic reading scoring engine: evaluates answers against published version answer key, computes raw score (0..40), and maps to exact IELTS Reading Band (0.0..9.0) using version-specific `bandConversionTable`.
  - Question-level auditability: updates all 40 `StudentAnswer` rows with `isCorrect` and `scoreAwarded` (treating unanswered questions as zero).
  - Persists immutable `EvaluationResult` record with `scoringVersion: "reading_v1.0.0"`, configuration snapshot, passage-level section breakdown, and question-level audit data.
  - Idempotency & Concurrency: handles repeated finalization and concurrent requests safely, returning committed evaluation snapshots without duplicate records or re-scoring.
  - Attempt closure enforcement: finalized attempts cannot be reopened or edited by autosave.
  - Authored test suite `app/api/exam/__tests__/examFinalize.test.ts` (13 tests passing covering 40/40 golden score, empty attempts, accepted alternatives, rejected alternatives, word limit violations, premature timeout rejection, expiration transitions, idempotency, concurrency, and rollback guarantees).

## [Unreleased] - 2026-11-08

### Added
- **Testing Infrastructure:**
  - Installed and configured `vitest@5.1.0` with `@/*` path alias support in `vitest.config.mts`.
  - Added `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`.
- **Pure Scoring & Evaluation Engine:**
  - Implemented `lib/scoring/normalize.ts` (whitespace, case, quote/bracket trimming, Roman numeral normalization, boolean and choice token canonicalization).
  - Implemented `lib/scoring/wordLimit.ts` (IELTS-compliant word counting treating hyphenated compounds as single words, with limit enforcement).
  - Implemented `lib/scoring/band.ts` (exact raw-to-band lookup matching `Mock_01_Answer_Key.pdf` page 3).
  - Implemented `lib/scoring/reading.ts` (single answer and full attempt evaluation returning per-question breakdown and section accuracy).
- **Mock Test 01 Structured Seed Data:**
  - Authored `prisma/seeds/mock01Data.ts` containing the full 3-passage, 8-group, 40-question content, accepted answer alternatives, word limits, and paragraph citations from `resource/Mock_01_Test.pdf` and `resource/Mock_01_Answer_Key.pdf`.
  - Authored `lib/scoring/__tests__/mock01SeedValidation.test.ts` verifying structural integrity, word limit compliance, continuous 1..40 numbering, band conversion table completeness, and golden score simulations (40/40 = Band 9.0; empty = 0.0).
- **Draft-to-Published Publishing Service:**
  - Implemented `lib/services/testPublishing.ts` with validation of draft question continuity, accepted answer non-emptiness, and atomic deep-copy across the published composite foreign key hierarchy inside a database transaction.
  - Authored unit test suite in `lib/services/__tests__/testPublishing.test.ts` (5 tests).
- **Mock Test 01 Seeded & Published to Dedicated Neon Database (`ielts_bangla`):**
  - Executed idempotent seed inserting root `Test` (`Academic Reading · Mock Test 01`, slug: `academic-reading-mock-01`), 3 draft sections, 8 draft question groups, 40 draft questions, and 54 draft accepted answers.
  - Published immutable `PublishedTestVersion` Version 1 (`cmw86bndp005wlqu6v8yuiwsx`) via `publishDraftTestVersion`.
  - Executed post-seed verification against live Neon cluster: verified 100% question numbering continuity (1..40), accepted answer precision (e.g. Q9 `air-filled` and `air filled`, Q21 `overflows`, Q22 `islands`, Q37-40 options only `A`, `C`, `D`, `E`), and live immutability trigger blocks against `UPDATE` and `DELETE`.
- **Mock Test 01 Content Verification Report:**
  - Published `docs/MOCK_01_VERIFICATION.md` detailing all 40 questions, accepted answers, alternative variants, word limits, and paragraph rationales for founder review.
- **Initial Neon Database Migration Successfully Applied (`20261108000000_init_reading_schema`):**
  - Safeguard discovery: Pre-migration inspection revealed that the default connection string targeted `/cognivex`, which contained 24 existing tables from another application. To eliminate all collision risks and ensure 100% data safety, created an isolated, dedicated database `ielts_bangla` on the Neon cluster.
  - Executed `prisma migrate deploy` against `ielts_bangla` (exit code: 0).
  - Verified 14 application tables and `_prisma_migrations`.
  - Verified 6 custom PostgreSQL enums (`Role`, `ModuleType`, `TestCategory`, `QuestionType`, `AttemptStatus`, `TestStatus`).
  - Verified 15 foreign key constraints including composite version-locked foreign keys.
  - Verified partial unique index `idx_unique_active_attempt_per_test` on `TestAttempt("userId", "testId") WHERE status = 'IN_PROGRESS'`.
  - Verified all 10 triggers (5 row-level immutability triggers and 5 statement-level TRUNCATE triggers).
  - Verified zero schema drift (`prisma migrate diff` reports `No difference detected`).
  - Verified clean table state: 0 rows in all tables (no seed data inserted).
