# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-08

### Added
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
