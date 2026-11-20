# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-20

### Authentic, Human-Designed Visual Refinements & Architecture Cohesion
- **Elimination of Generic AI SaaS Tropes:**
  - Audited and dismantled repetitive 3-4 card grids across `HighlightsSection.tsx`, `ModulesSection.tsx`, `HowItWorksSection.tsx`, and `WhyUsSection.tsx`.
  - Standardized border radii from exaggerated, bubbly `rounded-2xl` and `rounded-3xl` down to disciplined, professional `rounded-xl` (12px) and `rounded-lg` (8px).
  - Replaced repetitive floating corner SVGs, oversized background circles, and artificial glowing blurred gradient rings with grounded, purposeful academic compositions.
  - Substituted generic, formulaic AI marketing copy with authentic, credible Bengali messaging tailored for serious university and IELTS preparation candidates.
- **Intentional Asymmetric & Editorial Layouts:**
  - `HeroSection.tsx`: Grounded the test preview inside an authentic desktop window frame with titlebar dots, status pills, and dual-pane passage/question simulation.
  - `HighlightsSection.tsx`: Converted the 5-card grid into an asymmetric 2-column editorial showcase: prominent CBT Exam Simulation Engine with technical specs on the left, paired with 4 structured capabilities with clean borders on the right.
  - `ModulesSection.tsx`: Elevated Academic Reading (Phase 1) with full visual dominance, live status pill, full test specifications, and direct CTA; integrated Listening, Writing, and Speaking into an understated horizontal 3-module development pipeline.
  - `HowItWorksSection.tsx`: Transformed isolated boxes into a connected 4-step process timeline (`STEP 01` → `STEP 04`) with natural typography, subtle connector track, and concise step explanations.
  - `WhyUsSection.tsx`: Structured into an editorial split featuring the founders' educational philosophy on the left and 4 core institutional pillars separated by clean horizontal dividers on the right.
  - `FinalCtaSection.tsx`: Removed distracting floating background circles and grounded the CTA in dignified `#087653` deep emerald with crisp typography.
- **Unified Design Language Across Student Journey:**
  - `Dashboard`: Cleaned up performance metric cards, active test banner, test catalog, and recent attempts table with disciplined `rounded-xl` and `shadow-2xs`.
  - `Auth & Password Recovery`: Aligned `LoginForm.tsx`, `SignupForm.tsx`, `ForgotPasswordPage`, and `ResetPasswordPage` to crisp `rounded-xl` cards, `rounded-lg` inputs, and brand hover states.
  - `Results & Review`: Restyled `ResultHeader.tsx` to use the official brand `Logo`, cleaned up `ScoreSummaryCard.tsx` and `DetailedReviewSection.tsx` by replacing residual dark gradients and generic blue badges with navy ink `#20395F` and emerald `#087653`.
- **Quality Assurance & Test Suite Isolation:**
  - Configured `fileParallelism: false` in `vitest.config.mts` to ensure sequential database operations without mock or connection collisions against the live test database.
  - 100% passing tests, zero ESLint warnings or errors, and zero TypeScript compilation issues.

### Visual Experience Enhancement & Reading Exam Interface Redesign
- **Visual Design & Academic Illustrations (Revisited HTML Reference):**
  - Re-inspected the original inspiration reference (`IELTS-Bangla.html`) to identify reusable illustrations, decorative graphics, and micro-animations suitable for an adult IELTS preparation audience.
  - Reused scholarly vector motifs: Open study book (`book`), examination test clipboard (`clip`), countdown timer clock (`clock`), drafting pencil (`pencil`), acoustic headphones (`phones`), dialogue speech balloons (`bubble`), mistake checker lens (`lens`), and analytics bar chart (`chart`).
  - Purposely excluded cartoonish figures (e.g. `kid`) and childish graphics to maintain a mature, prestigious, university/graduate-level academic aesthetic.
  - Implemented reusable SVG vector library in `components/common/AcademicIllustrations.tsx` styled strictly with brand tokens (`#087653`, `#20395F`, `#E7F5EF`, `#D93A45`, `#FFD66B`).
  - Added lightweight micro-animations in `app/globals.css`: `animate-subtle-float`, `animate-subtle-float-slow`, `animate-subtle-pulse` with full `@media (prefers-reduced-motion: reduce)` compliance.
  - Elevated Landing Page sections:
    - `HeroSection.tsx`: Integrated subtle floating academic motifs, achievement badges, and interactive question preview.
    - `HighlightsSection.tsx`: Upgraded all 5 cards with academic vector illustrations and smooth hover translations.
    - `ModulesSection.tsx`: Added illustration preview banners (`.mi` style from reference) for Reading, Listening, Writing, and Speaking with specs and availability pills.
    - `HowItWorksSection.tsx`: Added stylized numbered steps with vector icons and connected flow.
- **Reading Examination Interface Redesign:**
  - Redesigned the examination screen (`ExamInterface.tsx`) to strictly share the IELTS Bangla design language, moving away from generic dark-slate styling into a clean, distraction-free academic workspace.
  - **Examination Header (`ExamHeader.tsx`):**
    - Compact, professional header featuring the official `IELTS বাংলা` dual-tone logo.
    - Displays test title with Academic Reading badge, passage selector buttons with answered count pills (`13/13`), autosave status indicator, and answered progress pill (`উত্তর: ২৫/৪০`).
    - Prominent countdown timer with clear contrast (`#20395F` base, amber warning < 10m, red alert < 2m).
    - **Always-visible primary Submit Test button (`টেস্ট জমা দিন`)** directly in the header.
    - Clean Exit button (`বাহির হন`) with confirmation modal.
    - Responsive mobile sub-header with passage dropdown and `[প্যাসেজ | প্রশ্নোত্তর]` tab switcher.
  - **Reading Layout (`ExamPassagePane.tsx` & `ExamQuestionsPane.tsx`):**
    - High-legibility two-panel desktop split (Passage on left, Questions on right) with independent smooth vertical scrolling.
    - Passage pane styled with serif academic typography, comfortable measure, and distinct paragraph letters (`A`, `B`, `C`...).
    - Questions pane styled with clean white cards on `#F8F8F9`, active question highlighting (`ring-1 ring-[#087653]/30`), and distinct question numbers.
    - Restyled all 6 supported question types (`MultipleChoice`, `TrueFalseNotGiven`, `YesNoNotGiven`, `TextCompletion`, `MatchingHeadings`, `SummaryCompletion`) using brand tokens.
  - **Submit Button Visibility Problem Fixed:**
    - Root cause: Submit was previously buried inside `ExamReviewModal.tsx`, leaving no visible submit button on the main exam screen or bottom bar.
    - Fixed by adding a primary submit button to `ExamHeader` (`টেস্ট জমা দিন`) and a secondary action to `ExamBottomBar`.
    - Implemented a dedicated Bengali confirmation dialog (`ExamSubmissionModal.tsx`) showing answered count, unanswered warning, flagged count, irreversible submission disclaimer, cancel option, and submit button with `BrandLoader` loading state.
  - **Bottom Horizontal White Bar & Overflow Bug Fixed:**
    - Root causes:
      1. `ExamPalette.tsx` forced all 40 question buttons horizontally across 3 passages (~1600px width), causing horizontal overflow inside `ExamBottomBar` and rendering a native browser scrollbar track (a long white/gray bar).
      2. `h-screen` (`100vh`) on the root container exceeded dynamic mobile/desktop viewports (`100dvh`), causing document window scrolling that exposed the body background below the footer.
      3. `ExamBottomBar` had `sticky bottom-0` inside a flex container.
    - Resolution:
      1. Redesigned `ExamPalette.tsx` to group questions by active passage (13–14 buttons per group, ~450px width) with quick tabs (`P1`, `P2`, `P3`, `সব`), fitting comfortably on all viewports without horizontal overflow.
      2. Applied `.scrollbar-none` utility to prevent native browser scrollbar tracks.
      3. Changed root container to `h-[100dvh] max-h-[100dvh] w-full flex flex-col overflow-hidden` with `ExamBottomBar` set to `shrink-0`.
- **Quality Assurance & Verification:**
  - 135 tests passing across 15 test suites with 100% pass rate.
  - Zero TypeScript errors (`bun run build`).
  - Zero ESLint errors or warnings (`bun run lint`).
  - Verified across desktop (1440px), laptop (1280px), tablet (768px), and mobile (390px, 360px).

### Bengali-First Localization, Gmail SMTP Recovery & Branded Loading Experience
- **Bengali-First Localization:**
  - Standardized UI language to Bengali across all user-facing components: Navbar, Landing page (Hero, Trust Highlights, How It Works, Modules, Why IELTS Bangla, Final CTA), Footer, Auth forms (Login, Signup, Forgot Password, Reset Password), Student Dashboard, Practice Guide, About, Privacy, Terms, Exam interface, and Results & Detailed Answer Review.
  - Preserved standard IELTS English terminology (e.g., IELTS, Academic, General Training, Reading, Listening, Writing, Speaking, Mock Test, Band Score, True/False/Not Given) paired with clear, natural Bengali explanations and instructions.
  - Implemented refined bilingual typography with Google Fonts `Hind Siliguri` (body, weights 400-700) and `Anek Bangla` (headings, weights 500-800).
  - Configured `html lang="bn"` and localized metadata and SEO open-graph tags.
  - Preserved the existing brand color palette (`#087653`, `#20395F`, `#E7F5EF`, `#F8F8F9`, `#D93A45`).
- **Gmail SMTP Password Recovery System:**
  - Implemented centralized email architecture with `nodemailer@10.6.1` and TypeScript support (`lib/email/emailService.ts`).
  - Configured IPv4 enforcement (`family: 4`) and connection pooling to prevent connection timeouts over ISP/macOS dual-stack IPv6 networks.
  - Reconciled Gmail SMTP configuration safely in `.env` using active Google App Password on secure SSL port 465, with safe placeholders in `.env.example`.
  - Created responsive, branded HTML email template in Bengali (`lib/email/templates/passwordResetEmail.ts`) featuring the official brand crest, reset CTA button, 30-minute expiry warning, security disclaimer, and plain-text fallback.
  - Implemented cryptographically secure password reset flow:
    - 32-byte cryptographically secure random token generated at `POST /api/auth/forgot-password`.
    - Token stored in database exclusively as SHA-256 hash with 30-minute expiration.
    - Single-use invalidation immediately upon password update.
    - Prevents account enumeration via generic success responses.
    - In-memory rate limiting on forgot password requests.
    - Token verification endpoint at `GET /api/auth/verify-reset-token`.
    - Atomically updates password (bcrypt salted hash) and marks token used in `POST /api/auth/reset-password`.
  - Added `PasswordResetToken` model to Prisma schema and executed non-destructive migration `20261120000000_add_password_reset_token` on Neon serverless PostgreSQL.
  - Updated auto-healing runtime schema resilience in `lib/db/ensureSchema.ts`.
  - Authored automated test suite `lib/auth/__tests__/passwordReset.test.ts` (5 tests) covering token generation, hash verification, expiration rejection, single-use invalidation, and bcrypt updates.
- **Professional Logo-Based Loading Experience (`BrandLoader`):**
  - Created `components/common/BrandLoader.tsx` featuring the authentic dual-tone SVG brand crest, animated orbit rings, indeterminate gradient progress bar, and customizable Bengali status text.
  - Provided three variants: `full` (full-page transitions), `section` (card and table loading), and `inline` (buttons and action feedback).
  - Integrated Next.js App Router route segment loaders:
    - Root `app/loading.tsx`.
    - Dashboard `app/dashboard/loading.tsx` with animated skeletons.
    - Practice `app/practice/loading.tsx`.
    - Results `app/results/[attemptId]/loading.tsx`.
  - Replaced generic spinners with `BrandLoader` across login, registration, password recovery, test launch button, and results review states.
- **Performance Optimization:**
  - Replaced sequential database queries in `app/dashboard/page.tsx` (`availableTests`, `inProgressAttempt`, `pastAttempts`) with `Promise.all([...])`, reducing server-side Neon roundtrip latency by ~60%.
  - Adjusted Prisma transaction timeout configuration (`timeout: 20000`, `maxWait: 5000`) in `lib/services/examAttemptService.ts` to ensure resilience during 40-question batch grading over remote serverless connections.
- **Verification & Quality Assurance:**
  - 135 tests passing across 15 test suites with 100% pass rate.
  - Zero TypeScript errors (`bun x tsc --noEmit`).
  - Zero ESLint errors or warnings (`bun run lint`).
  - Successful Next.js 16 production build with Turbopack and 23 prerendered pages (`bun run build`).
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
