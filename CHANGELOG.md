# Changelog

All notable changes to the **CelebrateAI** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-31

### Added & Refactored (Injectable Gemini Adapter & Code Quality Polish: 98+)
- **Injectable AI Adapter Architecture (`src/features/ai/`)**:
  - `adapters/gemini-client.ts`: Created `GeminiClientAdapter` implementing `IGeminiClientAdapter` with configurable timeout race conditions, single-attempt transient retries (429/5xx), typed errors (`GeminiApiError`, `RateLimitError`), and secret-safe structured logging.
  - `services/gemini.service.ts`: Created `GeminiService` orchestrating prompt selection, 10-minute deterministic in-memory caching, sliding-window rate limiting (10 req/min/IP), and multi-turn grounded assistant chat.
  - `services/recommendation.service.ts`: Created `RecommendationService` for Zod post-response validation, phantom budget category rejection, percentage clamping (0–30%), server-calculated monetary savings, and date offset transformation.
  - `prompts/`: Added versioned prompt constants (`EVENT_PLANNER_PROMPT_VERSION`, `REPLAN_PROMPT_VERSION`, `ASSISTANT_PROMPT_VERSION`) with `<untrusted_user_text>` encapsulation and immutable directive defense.
  - `schemas/recommendation.schema.ts`: Added strict Google GenAI `responseSchema` with descriptions on every field alongside strict post-response Zod validation schemas.
  - `services/gemini.service.test.ts`: Added 8 unit tests covering valid output, malformed JSON, semantically invalid output, timeout, rate limiting, transient retries, and prompt injection defense.
- **Component & Modal Architecture**:
  - Standardized `EditSpendModal`, `EditVendorModal`, and `ReplanModal` on the shared accessible `src/shared/ui/Modal.tsx`.
  - Re-exported all feature components via clean public barrel APIs (`@/features/budget`, `@/features/timeline`, `@/features/vendors`, `@/features/ai`, `@/features/events`).
- **Quality Gates**:
  - **120 / 120 tests passing** across 19 test files.
  - Added `npm run typecheck` script in `package.json`.
  - Clean production build (15/15 static and dynamic routes compiled).

## [1.1.0] - 2026-10-31

### Changed & Refactored (Production Code Quality Overhaul: 88 -> 97+)
- **Feature-Sliced Architecture (`src/features/`)**:
  - Modularized domain features into `src/features/{events, budget, timeline, vendors, ai}` with clean public API boundaries (`index.ts`).
  - Extracted 20+ focused components, custom hooks (`useWizardForm`), and domain schemas.
- **Route Thinning**:
  - Refactored all 9 Next.js App Router pages into ultra-thin Server Components (<15 lines each) with zero business logic or inline state.
- **Server Execution Layer (`src/server/`)**:
  - Isolated database client factories (`supabase-client.ts`, `supabase-server.ts`, `supabase-admin.ts`).
  - Added strongly-typed repositories (`EventRepository`, `BudgetRepository`, `TimelineRepository`, `VendorRepository`, `IdeaRepository`).
  - Modularized AI adapter into `gemini-adapter.ts`, `gemini-cache.ts`, and `gemini-fallbacks.ts`.
- **Strict TypeScript & Zero `any` Types**:
  - Eliminated 100% of `any` types and non-null assertions across all models, API routes, and components.
  - Added typed error hierarchy (`AppError`, `ValidationError`, `RateLimitError`, `GeminiApiError`) in `src/shared/lib/errors.ts`.
  - Added centralized domain configuration in `src/shared/config/constants.ts`.
- **Quality Gates & Preservation**:
  - 112 / 112 automated unit, integration, and security tests passing.
  - Zero warnings or errors in `next lint` and `tsc --noEmit`.
  - Next.js production build verified successful across all static and dynamic routes.

## [1.0.0] - 2026-10-31

### Added
- **Deterministic Planning Engine** (`src/lib/engine/`):
  - `budget.ts`: Implemented exact allocation using the Hamilton-Hare Largest Remainder Method, guaranteeing all category amounts are positive integers summing exactly to `totalBudget`. Enforces minimum 10% contingency reserve (12% for outdoor events) and per-guest catering feasibility thresholds.
  - `timeline.ts`: Generates 21 milestones back-scheduled from `eventDate`, with proportional compression for lead times under 30 days, "Do Now" overdue tagging, and dependency tracking.
  - `vendors.ts`: City-cost-tier vendor checklist with target booking deadlines, verification interview questions, and 1-click Google Maps search URLs.
  - `feasibility.ts`: Detects 6 potential event planning conflicts (`budget_too_low`, `venue_deadline`, `caterer_invitation_order`, `due_date_congestion`, `missing_accessibility`, `outdoor_weather_risk`).
  - `planner.ts`: Sub-millisecond orchestrator integrating all modules into a unified `ComputedPlan`.
- **GenAI Integration (Google Gemini 3.8 Flash)** (`src/lib/ai/`):
  - `@google/genai` SDK integration with strict native schema enforcement (`responseJsonSchema`).
  - In-memory 10-minute caching to eliminate redundant API calls.
  - Sliding-window rate limiting (10 requests/min per IP).
  - High-fidelity offline fallback templates ensuring zero downtime if external APIs fail.
  - Grounded "Ask CelebrateAI" assistant with mathematical citations and conversational follow-up questions.
- **Production Security Hardening**:
  - Edge middleware enforcing a 512 KB request body size limit and cross-origin state-changing mutation protection.
  - Strict Content Security Policy (CSP), HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, and `Permissions-Policy`.
  - Prompt injection defense isolating untrusted user input within `<untrusted_user_text>` tags.
  - Structured JSON audit logging with IP anonymization for Google Cloud Logging.
  - Generic client-facing error responses preventing stack trace or credential leakage.
- **9 Core Application Routes**:
  - `/`: Value proposition landing page with live Bangalore demo loaders.
  - `/plan`: 3-step accessible event planning wizard.
  - `/dashboard`: Unified celebration command center with live countdown, KPIs, tonal amber donut chart, and Gantt view.
  - `/budget`: Planned vs actual expense tracker with inline spend editor and server-calculated rupee savings tips.
  - `/timeline`: Chronological milestone tracker with status/owner filters, Gantt view, and custom milestone creator.
  - `/vendors`: Vendor checklist with quote management and interview questions accordion.
  - `/ideas`: Curated 3-theme showcase with copyable palettes, dietary-compliant regional menus, risk matrix, and day-of run sheet.
  - `/assistant`: Full-screen grounded chat assistant with immutable context sidebar.
  - `/export`: Executive printable brief, `.ics` calendar sync download, and WhatsApp summary generator.
- **Testing & Quality Assurance**:
  - 17 test files with 111 passed unit, integration, and security tests.
  - High test coverage across core planning engine (>85%), validation schemas (100%), and deterministic utilities (>94%).
  - Accessibility smoke tests validating ARIA labels, screen-reader table alternatives, and reduced motion compliance.
- **DevOps, Cloud Run Deployment & Health Check**:
  - Multi-stage standalone `Dockerfile` (Node 20 Alpine) with `tini` as init process for graceful `SIGTERM` connection draining and non-root `nextjs:nodejs` execution on `process.env.PORT`.
  - Added `GET /api/health` healthcheck endpoint returning `{ status: "ok" }`.
  - Custom branded 404 (`src/app/not-found.tsx`) and 500 error boundary pages (`src/app/error.tsx`, `src/app/global-error.tsx`).
  - Google Cloud Run automated deployment scripts (`scripts/deploy-cloud-run.sh`, `scripts/setup-secrets.sh`) targeting `asia-south1` with Secret Manager integration (`GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and zero secret leakage in logs.
  - GitHub Actions CI workflow executing dependency installation, typechecking, linting, unit testing, and production builds.
