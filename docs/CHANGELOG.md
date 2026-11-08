# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-08

### Added
- **Revised Database Architecture & Immutability Specification (`docs/DATABASE.md`):**
  - Fully separated editable draft test models (`Test`, `DraftSection`, `DraftQuestionGroup`, `DraftQuestion`, `DraftAcceptedAnswer`) from immutable published test models (`PublishedTestVersion`, `PublishedSection`, `PublishedQuestionGroup`, `PublishedQuestion`, `PublishedAcceptedAnswer`).
  - Implemented multi-level composite foreign key relationships (`[testVersionId, id]`) across the published hierarchy, ensuring relational prevention of cross-version question corruption.
  - Linked `StudentAnswer` via composite foreign keys to both `TestAttempt[id, testVersionId]` and `PublishedQuestion[testVersionId, id]`, making cross-version question referencing mathematically and relationally impossible.
  - Enforced continuous, unique question numbering across test versions via `@@unique([testVersionId, questionNumber])`.
  - Defined PostgreSQL trigger strategy and relational `onDelete: Restrict` for immutable snapshot protection.
  - Designed single transaction-safe finalization service supporting both manual `SUBMITTED` and automated `TIMED_OUT` states with concurrency mutex, authoritative server timing, and idempotent result return.
  - Resolved exact Academic Reading band conversion table directly from `resource/Mock_01_Answer_Key.pdf`.
- **Revised API Contracts (`docs/API.md`):**
  - Detailed `/submit` and `/timeout` contracts with shared idempotency and state transitions.
  - Documented complete `EvaluationResult` audit schema (`scoringVersion`, `scoringConfig`, `sectionBreakdown`, `questionBreakdown`).
- **Revised Implementation Plan (`docs/IMPLEMENTATION_PLAN.md`):**
  - Re-ordered milestones to prioritize a working Reading MVP first (Foundation -> DB & Prisma -> Minimal Auth -> Minimal Publishing Service -> Reading Exam Engine -> Scoring Engine -> Results Review) before broad admin dashboards.
- **Prisma Schema Specification (`prisma/schema.prisma`):**
  - Cleaned up redundant indexes on unique fields.
  - Made `User.passwordHash` nullable for clean OAuth extensibility.
  - Replaced boolean `Test.isPublished` with `TestStatus` enum and version-based publication state.
  - Made `StudentAnswer.scoreAwarded` and `isCorrect` nullable without default.
