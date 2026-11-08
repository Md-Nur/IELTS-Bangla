# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-08

### Added
- **Final Pre-Migration Review & Verification:**
  - Implemented and verified single active attempt policy at the database engine level via PostgreSQL partial unique index: `idx_unique_active_attempt_per_test ON "TestAttempt" ("userId", "testId") WHERE status = 'IN_PROGRESS'`.
  - Audited indexes and removed 4 redundant B-tree indexes (`DraftSection.testId`, `PublishedTestVersion.testId`, `PublishedSection.testVersionId`, `StudentAnswer.attemptId`) already covered by existing multi-column unique constraints.
  - Consolidated User account status to a single authoritative `isActive` field.
  - Implemented row-level locking (`SELECT ... FOR UPDATE` with `NOW() as db_now`) for finalization and autosave, closing deadline race conditions.
  - Specified statement-level triggers preventing `TRUNCATE` operations on all published snapshot tables.
  - Formally executed an automated 10-test verification suite on an isolated disposable PostgreSQL 17 test cluster:
    1. Updating published question: rejected by trigger (P0001).
    2. Deleting published question: rejected by trigger (P0001).
    3. Updating published version title: rejected by trigger (P0001).
    4. Archiving published version (`isArchived: false -> true`): succeeded.
    5. Reversing archived version (`isArchived: true -> false`): rejected by trigger (P0001).
    6. Truncating published table: rejected by statement trigger (P0001).
    7. Single active attempt constraint: concurrent second attempt rejected by partial unique index (23505).
    8. Premature timeout: rejected under row lock without mutation.
    9. Late manual submission: transitioned strictly to `TIMED_OUT`.
  - Confirmed: Neon database was untouched, no migrations were executed against production.
