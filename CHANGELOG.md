# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-20

### Redesign: Professional IELTS Preparation Platform & Runtime Architecture
- **Demo Student Account Decoupling:**
  - Completely eliminated the runtime dependency on the demo student account (`student@ieltsbangla.com`).
  - Removed automatic demo student registration and authentication retry loops from application startup.
  - Resolved `Unable to initialize demo student account` error permanently.
  - Isolated demo seeding into a developer-only script `scripts/seedDemoUser.ts` (`bun run seed:demo`), strictly decoupled from production runtime.
- **Professional Public Landing Page (`/`):**
  - Transformed `/` from a test launcher into a modern, trustworthy IELTS preparation landing page inspired by `IELTS-Bangla.html`.
  - Built responsive Navbar with SVG brand crest and Bengali typography ("Anek Bangla" & "Hind Siliguri").
  - Built Hero section featuring value propositions, test card previews, and "Start Practising" primary CTA.
  - Built Trust Highlights section communicating 5 core platform capabilities (IELTS Academic Practice, Realistic Mock Tests, Timed Environment, Performance Tracking, Structured Answer Review) without fabricated statistics.
  - Built IELTS Modules section showcasing Academic Reading as available and clearly marking Listening, Writing, and Speaking as "Coming Soon".
  - Built How It Works (4-step workflow), Why IELTS Bangla (value pillars), and Final Call to Action sections.
  - Built comprehensive Footer with platform information, links, modules, contact details, and legal pages.
- **Authentication Pages (`/login` and `/signup`):**
  - Created `/login` with email, password, show/hide visibility toggle, remember-me support, forgot-password handling, and integration with `POST /api/auth/login`.
  - Created `/signup` with full name, email, password, confirm password, client-side validation, password visibility toggle, and integration with `POST /api/auth/register`.
  - Protected against duplicate registration with 409 Conflict handling.
  - Immediate transition into student dashboard upon successful registration/login with secure session cookies.
- **Student Dashboard (`/dashboard`):**
  - Replaced immediate test launching with a dedicated student portal.
  - Displays personalized greeting, in-progress attempt warning with resume action, real performance metrics (completed tests, best band, average band), available mock tests catalog, and historical attempts table.
  - Real database records only; clean empty states for new students with zero test history.
- **Route Protection & Next.js 16 Proxy Architecture:**
  - Implemented `proxy.ts` (Next.js 16 edge proxy convention) to guard student routes (`/dashboard`, `/exam/*`, `/results/*`, `/admin/*`).
  - Unauthenticated users are redirected to `/login?redirect=...`.
  - Authenticated users visiting `/login` or `/signup` are automatically redirected to `/dashboard`.
  - Students attempting to access `/admin` are redirected to `/dashboard`.
- **Supporting Public Pages:**
  - Created `/practice` with full breakdown of Academic Reading structure, question types, and band score table.
  - Created `/about` detailing the mission, founders (Nur & Mozammel), and educational principles.
  - Created `/privacy` and `/terms` for compliance and student data privacy.
- **Quality Assurance & Test Suite:**
  - Authored `lib/auth/__tests__/routeProtection.test.ts` (8 tests) verifying all proxy access control rules.
  - Authored `app/__tests__/endToEndFlow.test.ts` (8 tests) verifying the entire candidate journey from public landing to test finalization and result review.
  - Total test suite now runs 124 tests across 13 files with 100% pass rate.
  - Build verified cleanly with Next.js 16 Turbopack and zero ESLint warnings.

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
- **Orchestrated Seed Script:**
  - Authored `prisma/seed.ts` to idempotently seed draft tables and publish Version 1. Guarded against execution until founder approval.
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
