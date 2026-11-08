# IELTS Bangla - Master Project Context

**Document type:** Living project specification  
**Project:** IELTS Bangla  
**Status:** Initial development  
**Founders:** Nur and Mozammel  
**Technical lead:** Nur  
**Last updated:** Initial version

---

# 1. Project Overview

IELTS Bangla is an online IELTS preparation and mock-test platform initially targeting Bangladeshi students.

The primary objective is to provide students with realistic IELTS mock examinations, reliable automated scoring, useful feedback, and performance tracking.

The platform will initially be free to attract users and validate the product. Subscription-based monetization will be introduced later.

## Product vision

Build a reliable, accessible, and affordable IELTS preparation platform that helps students understand their current proficiency, identify weaknesses, and improve their IELTS performance.

## Target audience

- Bangladeshi IELTS Academic candidates.
- University students preparing for IELTS.
- Students planning higher education abroad.
- Individuals who need affordable IELTS practice.

## Product principles

1. Accuracy over unnecessary features.
2. Good examination experience.
3. Simple and accessible interface.
4. Reliable scoring.
5. Maintainable and modular architecture.
6. Low infrastructure cost.
7. Mobile-responsive design.
8. Security and student data privacy.

---

# 2. Product Development Strategy

Development must follow this sequence:

## Phase 1: Reading

Priority: Highest.

Features:
- Reading test bank.
- Reading passages.
- Question groups.
- Multiple-choice questions.
- True / False / Not Given.
- Sentence completion.
- Short-answer questions.
- Question navigation.
- Countdown timer.
- Answer autosave.
- Test submission.
- Automatic scoring.
- Estimated band calculation.
- Detailed answer review.
- Student performance dashboard.

## Phase 2: Listening

Features:
- Audio-based examinations.
- Audio playback controls.
- Listening question bank.
- Multiple-choice questions.
- Form completion.
- Sentence completion.
- Matching questions.
- Answer autosave.
- Timed test sessions.
- Automatic scoring.
- Results and explanations.

## Phase 3: Writing

Features:
- Writing Task 1.
- Writing Task 2.
- Essay editor.
- Word counter.
- Time management.
- AI-based evaluation.
- Criterion-level scores.
- Detailed feedback.
- Improvement suggestions.

Writing evaluation must use the applicable IELTS assessment criteria and band descriptors.

## Phase 4: Speaking

Features:
- Speaking Part 1.
- Speaking Part 2.
- Speaking Part 3.
- Browser-based audio recording.
- Audio storage.
- Speech transcription.
- Fluency analysis.
- Vocabulary analysis.
- Grammar analysis.
- Pronunciation analysis using audio evidence.
- AI-assisted estimated band scores.
- Detailed feedback.

A transcript alone must not be used to evaluate pronunciation.

---

# 3. Initial Business Model

Initial model: Free access.

Future model: Freemium / subscription.

Do not implement payment integration during the initial MVP.

Design the application so that subscription plans, usage limits, and premium features can be introduced later without major architectural changes.

Keep the basic Reading and Listening experience accessible to free users.

---

# 4. Technology Stack

The project should use the following technologies where compatible with the existing repository.

## Core

- Next.js App Router.
- TypeScript.
- React.
- PostgreSQL.
- Prisma ORM.
- Tailwind CSS.
- Zod.

## Authentication

Evaluate Auth.js or another appropriate established authentication solution.

Use secure session management and server-side authorization.

Do not implement custom cryptography or insecure authentication mechanisms.

## Infrastructure

- Neon PostgreSQL for the database.
- Vercel or another suitable platform for deployment.
- GitHub for version control.

## Future integrations

- LLM API for Writing evaluation.
- Speech-to-text API for Speaking.
- Audio object storage for Speaking recordings.
- Background jobs for asynchronous evaluation.
- Analytics and error monitoring.

Do not introduce paid services without documenting the cost and obtaining approval.

Do not assume that free API credits or free hosting tiers are unlimited.

---

# 5. Resource Directory

The project contains a `resource/` directory.

It contains reference materials supplied by the co-founder.

Before designing the complete product:

1. Inspect all files inside `resource/`.
2. Identify the purpose of each file.
3. Read and extract useful information.
4. Identify IELTS question types, assessment criteria, examination structures, sample questions, and other relevant information.
5. Distinguish reference material from material that can legally be used in a commercial product.
6. Identify missing information.
7. Summarise the findings in `docs/RESOURCE_ANALYSIS.md`.
8. Use the resources to inform product requirements and content architecture.

Do not blindly copy external materials into the product.

Respect copyright and licensing restrictions. Prefer original questions and properly licensed content.

Do not assume the contents of a resource without inspecting it.

---

# 6. Architecture Principles

Use a modular monolith initially.

Avoid unnecessary microservices and distributed infrastructure.

Separate business logic, database operations, validation, UI components, and external integrations.

Recommended conceptual structure:

- Authentication module.
- User module.
- Test management module.
- Question bank module.
- Test attempt module.
- Answer submission module.
- Scoring module.
- Evaluation module.
- Results module.
- Admin module.

Keep scoring logic independent of frontend components.

Keep AI providers behind an abstraction layer so they can be changed later.

Use server-side validation and authorization.

Never expose answer keys to students before submission.

Never expose secrets or API keys to client-side code.

---

# 7. Reading Evaluation Rules

Reading and Listening must initially use deterministic answer-key-based evaluation.

The scoring system must support:

- Multiple accepted answers.
- Case-insensitive matching where appropriate.
- Whitespace normalization.
- Punctuation rules where appropriate.
- Configurable word limits.
- Question-specific scoring rules.
- Unanswered questions.
- Multiple-answer questions.
- Question-level explanations.
- Test-specific score conversion.

Do not use a universal band conversion table without considering the relevant test version and calibration.

Display mock-test results as estimated IELTS bands.

Keep raw scores and band conversion rules separate.

Store the scoring configuration or version used for every evaluation.

---

# 8. AI Evaluation Rules

Writing and Speaking will use AI-based evaluation in later phases.

Do not train a custom language model during the MVP.

Use provider-independent evaluation interfaces.

AI evaluation must:

- Follow relevant IELTS assessment criteria.
- Return structured output.
- Include criterion-level scores.
- Provide evidence-based feedback.
- Avoid inventing mistakes.
- Identify uncertainty and incomplete submissions.
- Be versioned and reproducible.
- Be tested against independently human-scored benchmark data.

Do not advertise AI-generated scores as official IELTS scores.

Do not send student data to external APIs without appropriate disclosure and consent.

Since the initial budget is almost zero, do not activate paid API integrations until explicitly approved.

---

# 9. Database Design Principles

Use Prisma and PostgreSQL.

Database design should support:

- Users.
- Roles and permissions.
- Tests.
- Published test versions.
- Test sections.
- Passages.
- Audio resources.
- Question groups.
- Questions.
- Accepted answers.
- Test attempts.
- Student answers.
- Evaluations.
- Evaluation jobs.
- Speaking recordings.
- Rubric versions.
- Performance analytics.

Important rules:

1. Published tests should be immutable.
2. Each attempt must reference a specific published test version.
3. Answer keys must remain server-side.
4. Student answers must be associated with the correct attempt and question.
5. Duplicate submissions must not produce duplicate results.
6. Database relations must use appropriate constraints.
7. Use transactions for operations requiring atomicity.
8. Store timestamps consistently.
9. Add indexes for frequently queried fields.
10. Never store credentials or secrets in the database unnecessarily.

Do not overengineer the initial schema. Add models when required by actual features.

---

# 10. Examination Experience

The examination interface is a core product feature.

Priorities:

- Clean layout.
- Readable typography.
- Clear question navigation.
- Visible countdown timer.
- Reliable autosave.
- Clear submission confirmation.
- Automatic submission at the deadline.
- Correct unanswered-question handling.
- Responsive interface.
- Accessible controls.

The server must be authoritative for examination timing and submission state.

Do not rely solely on client-side timers.

Do not allow students to modify a submitted attempt.

Handle network interruptions and failed autosave operations.

---

# 11. User Roles

Initial roles:

## Student

- Register and log in.
- Browse available tests.
- Start examinations.
- Save answers.
- Submit tests.
- View results.
- Review previous attempts.
- Track performance.

## Administrator

- Manage tests.
- Manage passages and questions.
- Publish and unpublish tests.
- Manage explanations.
- Review test content.
- View platform statistics.

Enforce role-based authorization on the server.

---

# 12. UI/UX Direction

The interface should feel like a professional educational SaaS product.

Design principles:

- Modern and minimal.
- Clear visual hierarchy.
- Consistent spacing.
- Accessible typography.
- Responsive layouts.
- Intuitive navigation.
- Minimal unnecessary animations.
- Clear examination interface.
- Consistent component design.

Avoid excessive gradients, unnecessary decorative elements, and clutter.

Use reusable components and a consistent design system.

Do not sacrifice usability for visual effects.

---

# 13. Development Rules for AI Coding Agents

The AI coding agent must follow these rules throughout development.

1. Read this document before starting any development task.
2. Inspect the existing repository before modifying files.
3. Inspect relevant resources before making content-related assumptions.
4. Understand existing code before replacing it.
5. Do not overwrite working features without justification.
6. Do not create duplicate components or services.
7. Do not install unnecessary dependencies.
8. Follow established project conventions.
9. Use TypeScript properly; avoid unnecessary `any`.
10. Validate external inputs using Zod.
11. Implement authorization on the server.
12. Never expose secrets or answer keys.
13. Write tests for important business logic.
14. Run relevant tests after implementation.
15. Run linting and type checking.
16. Report failures honestly.
17. Do not mark unverified features as complete.
18. Do not silently change architectural decisions.
19. Ask for approval before introducing paid infrastructure or major dependencies.
20. Preserve compatibility with existing functionality.

---

# 14. Living Documentation Policy

This document is the canonical source of project context.

The AI coding agent must maintain it as development progresses.

After every significant implementation or architectural change:

1. Update the project status.
2. Update completed features.
3. Update pending features.
4. Document important architectural decisions.
5. Document database changes.
6. Document new dependencies.
7. Document changed API contracts.
8. Document known bugs and technical limitations.
9. Update the development roadmap.
10. Update the last modified date.

Do not rewrite the entire document unnecessarily.

Preserve useful historical decisions.

If a requirement changes:

- Record the old requirement.
- Record the new requirement.
- Explain why the change was made.
- Explain the affected modules.
- Explain migration or compatibility implications.
- Update all relevant documentation.

Create an Architecture Decision Record when a major technical decision changes.

Store major decisions in `docs/decisions/`.

If the codebase and documentation disagree, investigate the actual implementation and reconcile the documentation. Do not assume either source is automatically correct.

---

# 15. Current Project Status

## Completed

- Next.js project created using `create-next-app` (Next.js 16.4.5, React 19, Tailwind CSS v4).
- Project directory verified: `ielts-bangla`.
- Package manager verified: `bun@1.2.18`.
- Resource directory analyzed completely (`docs/RESOURCE_ANALYSIS.md`).
- Neon PostgreSQL connection endpoint (`ep-holy-glitter-a1vqn8z1-pooler.ap-southeast-1.aws.neon.tech`) verified reachable over TLS.
- Database architecture designed and revised (`docs/DATABASE.md`, `prisma/schema.prisma`):
  - Strict separation of editable drafts from immutable published test snapshots.
  - Multi-level composite foreign keys enforcing version isolation for sections, question groups, questions, accepted answers, and student answers.
  - Question numbering uniqueness enforced across published test versions (`@@unique([testVersionId, questionNumber])`).
  - Transaction-safe, idempotent finalization service designed for both manual submission (`SUBMITTED`) and timeout expiration (`TIMED_OUT`).
  - Scoring reproducibility guaranteed via `scoringVersion` and `scoringConfig` JSON snapshots.
  - Redundant indexes removed; `User.passwordHash` nullable for future OAuth; `StudentAnswer.scoreAwarded` nullability aligned.
  - Exact band conversion table resolved directly from `resource/Mock_01_Answer_Key.pdf`.
- Master implementation plan updated and prioritized for Reading MVP (`docs/IMPLEMENTATION_PLAN.md`).
- API specification updated (`docs/API.md`).

## In Progress / Immediate Next Milestones

- Pre-Migration Architectural Approval.
- M1: Project Foundation & Tooling (Vitest test runner setup, base design tokens).
- M2: Database & Prisma Configuration (Prisma migration against Neon, seed Mock Test 01).
- M3: Minimal Authentication (Credentials login/register, session cookie, role guard).
- M4: Minimal Test Management & Publishing Service.
- M5 & M6: Reading Examination Engine & Deterministic Scoring Engine.

---

# 16. Definition of Done

A feature is complete only when:

- Its requirements are implemented.
- Its UI works.
- Its server-side logic works.
- Database operations are correct.
- Authorization is enforced.
- Input validation is implemented.
- Important edge cases are handled.
- Relevant automated tests pass.
- TypeScript checks pass.
- Lint checks pass.
- Documentation is updated.

A visually complete interface is not sufficient evidence that a feature works.

---

# 17. Current Development Philosophy

Build the smallest reliable version first.

Prioritise Reading before Listening, Writing, and Speaking.

Prioritise correctness before adding more features.

Use AI coding assistance to accelerate implementation, but verify all generated code.

Keep infrastructure simple and costs low.

Maintain this document as the project evolves.

**The ultimate objective is not merely to build an IELTS mock-test website. It is to build a reliable IELTS preparation platform that students can trust.**