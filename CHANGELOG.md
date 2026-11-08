# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-08

### Added
- **Final Architecture Corrections & Schema Hardening:**
  - `Test.currentPublishedVersionNumber` removed in favor of direct active published version queries, eliminating state desynchronization.
  - `TestStatus` simplified strictly to `ACTIVE` and `ARCHIVED`. An unpublished test container is represented by `status = ACTIVE` with zero published versions.
  - Account and examination historical preservation enforced via `onDelete: Restrict` on `TestAttempt` to `User`, `EvaluationResult` to `TestAttempt`, and `StudentAnswer` to `TestAttempt`. Added `User.isDeactivated` for soft deactivation without deleting exam history.
  - Complete migration-level PostgreSQL immutability trigger declarations specified for `"PublishedTestVersion"`, `"PublishedSection"`, `"PublishedQuestionGroup"`, `"PublishedQuestion"`, and `"PublishedAcceptedAnswer"`, allowing version creation and archive toggling (`isArchived: false -> true`) while rejecting 100% of deletes and child updates.
  - Row-level locking strategy (`SELECT FOR UPDATE`) defined for student autosave, preventing race conditions between concurrent answer updates and attempt finalization.
  - Strict deadline enforcement: manual submissions arriving after `expiresAt` automatically route through timeout finalization (`TIMED_OUT`). Premature timeout requests are rejected.
  - Undocumented grace periods completely removed.
  - Comprehensive draft publishing validation rules defined (exact question count, continuous 1..N numbering, structural completeness, option validation, and complete band table coverage).
  - Validated Prisma schema syntax and generated Prisma Client (v6.19.3) cleanly supporting all composite relationships.
