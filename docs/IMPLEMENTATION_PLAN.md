# Implementation Plan — IELTS Bangla

**Document type:** Master Engineering Roadmap & Milestone Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Technical Lead  
**Status:** Phase 1 (Reading MVP) — Testing, Content Extraction & Seed Staged  
**Last updated:** 2026-11-08  

---

## 1. Roadmap Strategy & MVP Focus

The primary directive is shipping a working, robust, verifiable **Reading MVP** before expanding into secondary features or administrative dashboards. Development progresses through tightly-scoped, independently testable milestones.

```mermaid
flowchart TD
    M1["M1: Foundation, Testing & Scoring Engine (COMPLETED)"] --> M2["M2: Neon DB Migration (COMPLETED) & Seed Preparation (COMPLETED)"]
    M2 --> M3["M3: Mock 01 Founder Review & Seed Neon Execution"]
    M3 --> M4["M4: Minimal Authentication & Session System"]
    M4 --> M5["M5: Reading API Endpoints (Start, Autosave, Finalize)"]
    M5 --> M6["M6: Reading Examination Engine UI (Split-Pane, Timer, Nav)"]
    M6 --> M7["M7: Results & Detailed Answer Review Page"]
    M7 --> M8["M8: Production Hardening & Deployment"]
```

---

## 2. Milestone Breakdown

### Milestone 1: Foundation, Testing Harness & Pure Scoring Engine (COMPLETED)
- **Status:** COMPLETED
- **Achievements:**
  - Configured `vitest@5.1.0` with `@/*` path mapping in `vitest.config.mts`.
  - Added `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`.
  - Implemented pure scoring engine: `lib/scoring/normalize.ts`, `lib/scoring/wordLimit.ts`, `lib/scoring/band.ts`, and `lib/scoring/reading.ts`.
  - Comprehensive unit test suite in `lib/scoring/__tests__/scoring.test.ts` (15 tests passing).

---

### Milestone 2: Database Migration & Mock Test 01 Seed (MIGRATION COMPLETE, SEED PREPARED)
- **Status:** MIGRATION COMPLETE, SEED STAGED & VERIFIED
- **Achievements:**
  - Initial migration applied to dedicated `ielts_bangla` Neon database (`20261108000000_init_reading_schema`).
  - Immutability and TRUNCATE triggers, partial unique active-attempt index verified.
  - Complete Mock Test 01 content extracted from `resource/Mock_01_Test.pdf` & `resource/Mock_01_Answer_Key.pdf` into `prisma/seeds/mock01Data.ts`.
  - Comprehensive validation test suite authored in `lib/scoring/__tests__/mock01SeedValidation.test.ts` (9 tests passing).
  - Draft-to-published publishing service implemented in `lib/services/testPublishing.ts` with unit test suite in `lib/services/__tests__/testPublishing.test.ts` (5 tests passing).
  - Idempotent seed script authored in `prisma/seed.ts`.
  - Content Verification Report published in `docs/MOCK_01_VERIFICATION.md`.
  - Database safeguarded: 0 rows inserted into Neon awaiting founder sign-off.
- **Acceptance Criteria:**
  - Migration runs against Neon PostgreSQL without data loss.
  - Triggers are active and verified: attempting to UPDATE or DELETE a published section/question/answer fails with PostgreSQL exception.
  - Seeder populates Mock Test 01 (3 passages, 40 questions, answers, rationales, and exact band conversion table).
- **Testing Requirements:** Integration test verifying relational queries across the version-locked hierarchy and verifying trigger immutability enforcement.

---

### Milestone 3: Minimal Authentication & Server-Side Roles (COMPLETED)
- **Status:** COMPLETED
- **Achievements:**
  - Password hashing implemented with `bcryptjs`.
  - Stateless tamper-proof session tokens signed and verified via `jose` (`lib/auth/session.ts`).
  - Strict student role enforcement on registration: `/api/auth/register` assigns `Role.STUDENT`.
  - Login endpoint `/api/auth/login` checks credentials and `User.isActive`.
  - Logout endpoint `/api/auth/logout` clears HTTP-only session cookies.
  - Server-side authentication guards implemented (`lib/auth/guards.ts`): `getCurrentUser()`, `requireAuth()`, `requireRole()`.
  - Comprehensive unit test suite in `app/api/auth/__tests__/authRoutes.test.ts` (6 tests passing).

---

### Milestone 4: Publishing Service with Integrity Validation (COMPLETED)
- **Status:** COMPLETED
- **Achievements:**
  - Implemented `lib/services/testPublishing.ts` with deep copy, question continuity, and accepted answer completeness validation.
  - Unit test suite passing in `lib/services/__tests__/testPublishing.test.ts` (5 tests passing).
  - Published Mock Test 01 Version 1 on Neon (`cmw86bndp005wlqu6v8yuiwsx`).

---

### Milestone 5: Reading Examination Engine (Student Experience) (COMPLETED)
- **Status:** COMPLETED
- **Achievements:**
  - **Phase 1 Backend APIs:**
    - Implemented `lib/services/examAttemptService.ts` (`startExamAttempt`, `getExamContent`).
    - Next.js 16 App Router API endpoints `POST /api/exam/start` and `GET /api/exam/[attemptId]`.
    - Integration test suites `lib/services/__tests__/examAttemptService.test.ts` (9 tests) and `app/api/exam/__tests__/examRoutes.test.ts` (8 tests).
  - **Phase 2 CD-IELTS Examination Interface:**
    - Desktop dual split-screen layout with independently scrollable passage pane (`ExamPassagePane`) and question pane (`ExamQuestionsPane`).
    - Responsive mobile layout with toggleable `[Passage | Questions]` views and touch-friendly controls.
    - Top navigation bar (`ExamHeader`) with IELTS Bangla branding, passage range tabs (Q1–13, Q14–26, Q27–40), and leave test confirmation dialog (`ExamExitModal`).
    - Authoritative countdown timer (`useCountdownTimer`) ticking against server `expiresAt` with warning (10m) and urgent (5m) visual alerts.
    - Complete support for all 7 IELTS question types:
      - `TrueFalseNotGiven` (radio pills)
      - `YesNoNotGiven` (radio pills)
      - `MultipleChoice` (options A–D)
      - `TextCompletion` (inline word counter with IELTS hyphenation rules)
      - `MatchingHeadings` (Roman numerals i–ix dropdown with List of Headings reference card)
      - `SummaryCompletion` (letter A–H dropdown with word list reference card)
    - Full 1 to 40 question navigator palette (`ExamPalette` & `ExamBottomBar`) with answered, unanswered, flagged for review, and current focus states.
    - Examination overview and progress modal (`ExamReviewModal`).
    - Lifecycle states: `ExamLoadingState`, `ExamErrorState` with retry, and `ExamExpiredState`.
    - Window `beforeunload` leave protection.
    - State management hook (`useExamState`) structured for clean autosave hook integration.
    - Comprehensive test suite `components/exam/__tests__/examInterface.test.ts` (6 tests passing).

---

### Milestone 6: Deterministic Scoring Engine & Timeout Handling
- **Objectives:** Deliver 100% deterministic, test-calibrated server-side scoring and transaction-safe finalization.
- **Tasks:**
  - Pure scoring engine `lib/scoring/reading.ts`:
    - Normalized string matching: case-insensitive, trimmed whitespace, normalized punctuation.
    - Explicit alternative answer support (e.g. `x / y` or `[x, y]`).
    - Strict word count limit enforcement (reject answers exceeding limit).
    - Roman numeral normalization (`i` vs `I`).
  - Shared finalization service `lib/services/attemptFinalizer.ts`:
    - Handles both manual submission (`SUBMITTED`) and timeout expiration (`TIMED_OUT`).
    - If manual submission arrives after deadline (`now > expiresAt`), automatically routes through timeout finalization.
    - Single transaction executes status transition, answer scoring, and `EvaluationResult` insertion.
    - Rollback ensures attempt is never left in dangling finalized state without evaluation.
    - Mutex pattern prevents concurrent duplicate scoring.
    - Calculates estimated IELTS band using version-specific `bandConversionTable`.
- **Deliverables:**
  - `lib/scoring/reading.ts`
  - `lib/services/attemptFinalizer.ts`
  - Golden test suite matching `Mock_01_Answer_Key.pdf`.
- **Acceptance Criteria:**
  - All 40 questions of Mock Test 01 score 100% with golden answers.
  - Edge cases (whitespace, capitalization, accepted variants) score accurately.
  - Exceeding word limit awards 0 marks.
  - Late manual submission transitions to `TIMED_OUT` and scores saved answers.
- **Testing Requirements:** Exhaustive unit test suite covering 20+ scoring edge cases.

---

### Milestone 7: Results & Detailed Answer Review
- **Objectives:** Present students with clear diagnostic feedback, band visualization, and question rationales.
- **Tasks:**
  - Result overview page `/results/[attemptId]`:
    - Prominent estimated IELTS Band badge.
    - Raw score summary (X / 40) and accuracy percentage.
    - Passage-by-passage performance breakdown.
    - Authoritative time spent.
  - Detailed Answer Review UI:
    - Side-by-side view: Passage, Student Answer, Correct Answer(s), and Explanation ("Where to find it / why").
    - Visual indicators (Green check, Red cross, Grey dash for unanswered).
- **Deliverables:**
  - `/results/[attemptId]/page.tsx`
  - Review components.
- **Acceptance Criteria:**
  - Answer keys and rationales are visible only after finalization.
  - Students cannot view other students' attempts.

---

### Milestone 8: Admin Authoring UI Enhancements
- **Objectives:** Build user-friendly admin interfaces to create and edit tests without direct database manipulation.
- **Tasks:**
  - Draft test builder UI (edit passages, groups, questions, and accepted answers).
  - Draft preview mode.
  - Version publishing trigger with validation reporting.

---

### Milestones 9–12: Future Phases
- **M9:** Listening Module (Audio streaming, playback limits, timed sections).
- **M10:** Writing Module & AI Evaluation (Task 1 & 2 editors, IELTS 4-criteria LLM rubrics).
- **M11:** Speaking Module & AI Evaluation (Browser audio recording, speech-to-text, acoustic pronunciation analysis).
- **M12:** Production Hardening, Security Audit & Deployment.
