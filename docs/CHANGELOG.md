# Changelog — IELTS Bangla

All notable changes, architectural decisions, and milestones for this project will be documented in this file.

## [Unreleased] - 2026-11-08

### Added
- Complete project context analysis in `docs/PROJECT_CONTEXT.md` (synchronized from root).
- Comprehensive resource analysis in `docs/RESOURCE_ANALYSIS.md` detailing all assets in `resource/`, question structures, licensing considerations, and discovery of `Mock_01_Test.pdf`.
- Database architecture and normalized Prisma schema specification in `docs/DATABASE.md` supporting immutable test versions, atomic autosave, server-side scoring, and band conversion tables.
- Master development roadmap and 12-milestone engineering plan in `docs/IMPLEMENTATION_PLAN.md`.
- Living API contract specification in `docs/API.md`.
- Initial environment verification confirming reachability of AWS Neon PostgreSQL instance on port 5432.
- Verified Next.js 16.4.5, React 19, and Tailwind CSS v4 baseline build and linting.
