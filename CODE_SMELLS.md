# CelebrateAI Static Code Quality Audit & Code Smells Report

**Audit Date**: November 2026  
**Target Code Quality Score**: 97+ / 100 (Baseline: 89 / 100)  
**Methodology**: Static AST analysis, cyclomatic and cognitive complexity analysis, file/component line counts, dependency coupling, and strict architectural boundary verification.

---

## 1. Prioritized Static Audit Table

| Priority | Issue | File(s) | Why it hurts Code Quality | Exact refactor | Risk | Verification |
|---|---|---|---|---|---|---|
| **P0** | **File Bloat (1,151 lines)** | `src/lib/data/seeds.ts` | Massive monolith holding 3 entire demo events (wedding, birthday, community) in a single file; slows IDE indexing, violates single responsibility. | Split into `seeds/wedding.seed.ts`, `seeds/birthday.seed.ts`, `seeds/community.seed.ts` and re-export via `seeds/index.ts`. Keep `seeds.ts` as a thin backward-compatible barrel (< 25 lines). | Low | `npm run test` (120 tests verify seed integrity and demo loading). |
| **P0** | **File Bloat & Embedded Fallback Templates (462 lines)** | `src/lib/ai/validate.ts` | 200+ lines of static fallback dictionaries and text sanitizers pollute validation logic, exceeding the 250-line limit. | Extract static fallback dictionaries to `src/lib/ai/offline-fallbacks.ts`. Extract text sanitization to `src/lib/ai/sanitize.ts`. Keep `validate.ts` focused purely on Zod validation (< 150 lines). | Low | `src/lib/ai/validate.test.ts` passes with 100% assertions. |
| **P0** | **File Bloat & Static Data in Service (422 lines)** | `src/server/services/server-event.service.ts` | 130 lines of baseline rules (`BUDGET_ALLOCATION_RULES`, `VENDOR_DEFAULTS`, `TIMELINE_TEMPLATE_RULES`) are embedded in the service class. High cyclomatic complexity. | Extract static configuration to `src/server/services/server-rules.ts`. Decompose generation helpers (`generateServerBudgetItems`, `generateServerTimelineTasks`, `generateServerVendors`) into focused pure functions (< 30 lines each). | Low | `src/lib/services/event.service.test.ts` & integration tests verify server event generation. |
| **P0** | **Monolithic Recommendation Service (381 lines)** | `src/features/ai/services/recommendation.service.ts` | Over 200 lines of offline fallback generation logic are bundled with response normalization, exceeding the 250-line threshold. | Extract offline fallback generation into `src/features/ai/services/offline-fallbacks.ts`. RecommendationService retains only `validateAndMerge` and data clamping (< 140 lines). | Low | `src/features/ai/services/gemini.service.test.ts` verifies valid output, malformed JSON, and timeout fallbacks. |
| **P0** | **Complex Engine Budget Math (300 lines)** | `src/lib/engine/budget.ts` | `calculateBudget` is ~190 lines long with cyclomatic complexity 14. Embeds `WEDDING_BASELINE`, `BIRTHDAY_BASELINE`, `COMMUNITY_BASELINE`. | Extract baseline rules to `src/lib/engine/budget-rules.ts`. Split `calculateBudget` into pure sub-helpers: `computeCategoryWeights()`, `calculateCateringFeasibility()`, `evaluateBudgetHealth()` (<= 25 lines each). | Low | `src/lib/engine/budget.test.ts` (8 suites) verifies 100% penny-perfect Hamilton-Hare allocation. |
| **P0** | **Embedded Vendor Blueprints (291 lines)** | `src/lib/engine/vendors.ts` | 160 lines of vendor blueprints (`WEDDING_VENDORS`, `BIRTHDAY_VENDORS`, `COMMUNITY_VENDORS`) embedded inside engine calculation logic. | Extract blueprints into `src/lib/engine/vendor-rules.ts`. Keep calculation and Google Maps URL generation in `vendors.ts` (< 120 lines). | Low | `src/lib/engine/vendors.test.ts` verifies vendor lead-time back-scheduling. |
| **P0** | **Embedded Milestone Rules (285 lines)** | `src/lib/engine/timeline.ts` | 110 lines of `BASE_MILESTONES` embedded inside timeline back-scheduling algorithms. | Extract milestone definitions into `src/lib/engine/timeline-rules.ts`. Extract compression and date formatting helpers (< 25 lines each). | Low | `src/lib/engine/timeline.test.ts` verifies milestone ordering before event date. |
| **P1** | **Mixed Concerns in Gemini Service (276 lines)** | `src/features/ai/services/gemini.service.ts` | Manages prompt orchestration, rate limiting state, in-memory caching, error mapping, and assistant interaction in a single file > 250 lines. | Extract sliding-window rate limiter and cache storage into `src/features/ai/services/ai-cache.ts`. Keep `gemini.service.ts` strictly for AI orchestration (< 150 lines). | Low | `gemini.service.test.ts` and `gemini-client.test.ts` pass all 14 tests. |
| **P1** | **Monolithic React Context (265 lines)** | `src/lib/context/celebrate-context.tsx` | Manages theme state, local storage persistence, demo event loading, override state, and replanning actions in one 265-line file. | Extract theme toggle and persistence into `useThemeState.ts` hook. Extract context types to `celebrate-context.types.ts`. Context provider reduced to < 120 lines. | Low | React component mounting and user journey tests pass. |
| **P1** | **Component Bloat & Mixed Export Concerns (260 lines)** | `src/features/events/components/ExportFeature.tsx` | Generates WhatsApp markdown, ICS calendar files, CSV strings, and renders modal UI all in one component (> 150 lines). | Extract formatting logic into `src/features/events/utils/export-formatters.ts` (`formatWhatsAppSummary`, `formatMarkdownPlan`, `formatCalendarIcs`). UI component reduced to < 110 lines. | Low | `challenge-user-journey.test.ts` verifies export functionality. |
| **P1** | **Database Types Exceeding Limit (261 lines)** | `src/lib/types/database.types.ts` | Combines Supabase JSON helpers, domain enums, and database table row interfaces in 261 lines. | Extract enums (`EventTypeEnum`, `BudgetCategoryEnum`, `TaskStatusEnum`, etc.) into `src/lib/types/database-enums.ts` and re-export. | Low | `npm run typecheck` guarantees 100% type safety. |
| **P1** | **Validation Schemas Exceeding Limit (258 lines)** | `src/lib/validations/schemas.ts` | Mixes event input schemas, idea content schemas, and partial update schemas in 258 lines. | Extract idea schemas (`themeIdeaSchema`, `menuIdeaSchema`, `riskIdeaSchema`, etc.) into `src/lib/validations/idea-schemas.ts` and re-export. | Low | `src/lib/validations/schemas.test.ts` (16 assertions) verifies schema validation. |
| **P1** | **Navbar Monolith (231 lines)** | `src/components/layout/Navbar.tsx` | Contains desktop nav, mobile slide-out drawer, theme toggler, and demo switcher in 231 lines (exceeds 150-line component limit). | Extract `NavMobileMenu.tsx`, `ThemeToggle.tsx`, and `NavDemoSelector.tsx`. Keep `Navbar.tsx` < 100 lines. | Low | Accessibility smoke tests verify keyboard navigation and ARIA landmarks. |
| **P1** | **Chat Component Monolith (223 lines)** | `src/components/dashboard/AskCelebrateAIChat.tsx` | Embeds message bubbles, auto-scroll ref handling, quick suggestion chips, and API submission in 223 lines. | Extract `ChatMessageBubble.tsx` and `ChatSuggestions.tsx`. Container reduced to < 110 lines. | Low | Component tests and user journey tests verify chat interaction. |
| **P1** | **Event Wizard Step 1 Monolith (222 lines)** | `src/features/events/components/WizardStep1Basics.tsx` | Combines event type selector cards, city auto-complete, title input, and date picker in 222 lines. | Extract `EventTypeSelector.tsx` and `EventDateCityInputs.tsx`. Main step reduced to < 95 lines. | Low | Event wizard journey tests verify state transitions. |
| **P1** | **Dashboard Feature Monolith (220 lines)** | `src/features/events/components/DashboardFeature.tsx` | Orchestrates header metrics, tab switching, export actions, and grid layout in 220 lines. | Extract `DashboardHeader.tsx` and `DashboardTabNav.tsx`. Main feature reduced to < 110 lines. | Low | End-to-end integration test passes. |
| **P2** | **Timeline Gantt View Monolith (205 lines)** | `src/components/dashboard/TimelineGanttView.tsx` | Embeds phase grouping, milestone filtering, progress calculations, and milestone rows in 205 lines. | Extract `GanttMilestoneRow.tsx` and `GanttPhaseGroup.tsx`. Main component reduced to < 110 lines. | Low | Timeline tests pass. |
| **P2** | **Vendor Progress Card Monolith (201 lines)** | `src/components/dashboard/VendorProgressCard.tsx` | Embeds booking countdowns, status badges, Google Maps links, and action buttons in 201 lines. | Extract `VendorProgressItem.tsx` (< 80 lines). Main component reduced to < 95 lines. | Low | Unit tests verify vendor status changes and budgeting. |
| **P2** | **Event Wizard Monolith (191 lines)** | `src/features/events/components/EventWizard.tsx` | Manages multi-step progress bar, transition animations, and step switching in 191 lines. | Extract `WizardStepIndicator.tsx` and `WizardNavButtons.tsx`. Main component reduced to < 90 lines. | Low | Wizard step transition tests pass. |
| **P2** | **Budget Donut Chart Monolith (186 lines)** | `src/components/dashboard/BudgetDonutChart.tsx` | SVG polar calculations, path generation, legend lists, and contingency callouts in 186 lines. | Extract `DonutChartSvg.tsx` and `BudgetLegendList.tsx`. Main component reduced to < 90 lines. | Low | Accessibility tests verify chart text alternatives and table fallback. |
| **P2** | **Wizard Steps 2 & 3 (> 160 lines)** | `WizardStep2Scale.tsx`, `WizardStep3Style.tsx` | Exceed 150-line component limit due to embedded sliders, preset buttons, and checkbox grids. | Extract `BudgetPresetButtons.tsx`, `GuestCountInput.tsx`, and `DietaryAccessibilityOptions.tsx`. | Low | Wizard form tests pass. |
| **P2** | **Milestone Modal Monolith (162 lines)** | `src/features/timeline/components/CreateMilestoneModal.tsx` | Form fields and modal orchestration in 162 lines. | Extract `MilestoneFormFields.tsx`. Modal component reduced to < 90 lines. | Low | Milestone creation tests pass. |
| **P2** | **KPI Cards Monolith (159 lines)** | `src/components/dashboard/KpiCards.tsx` | 4 complex KPI card layouts in 159 lines. | Extract `SingleKpiCard.tsx`. Main component reduced to < 75 lines. | Low | Accessibility tests pass. |
| **P2** | **Business Logic in API Route Handlers (> 160 lines)** | `src/app/api/plan/route.ts`, `src/app/api/replan/route.ts` | Route handlers declare inline Zod schemas and orchestrate multi-step validation and auditing directly in `POST` functions (> 120 lines). | Extract schemas to `src/features/events/schemas/plan-request.schema.ts` and delegate planning workflow cleanly (< 35 lines per route function). | Low | `src/app/api/plan/route.test.ts` passes all 4 integration tests. |

---

## 2. Top 20 Highest-Impact Code-Quality Fixes

1. **Split `seeds.ts` into Dedicated Seed Modules**: Decompose 1,151 lines into modular seed files per event type (`wedding`, `birthday`, `community`) to eliminate the single largest file bloat in the project.
2. **Modularize Offline Fallback AI Templates**: Extract over 200 lines of static JSON fallback structures out of `validate.ts` and `recommendation.service.ts` into isolated, type-safe fallback dictionaries.
3. **Decouple Baseline Rules from Deterministic Planning Engines**: Move `WEDDING_BASELINE`, `BIRTHDAY_BASELINE`, and `COMMUNITY_BASELINE` out of `budget.ts`, `vendors.ts`, and `timeline.ts` into dedicated `*-rules.ts` modules.
4. **Decompose `calculateBudget` into Pure Functions**: Break the 190-line function into single-responsibility sub-helpers (`computeCategoryWeights`, `calculateCateringFeasibility`, `evaluateBudgetHealth`), reducing cyclomatic complexity from 14 to <= 6.
5. **Decompose `calculateTimeline` and Milestone Scheduling**: Break the 130-line timeline engine function into `compressMilestones` and `scheduleMilestones`, each <= 25 lines with complexity <= 5.
6. **Decompose `generateVendorRecommendations`**: Separate lead-time calculation, category budget estimation, and Google Maps search URL generation into pure helpers <= 25 lines.
7. **Extract AI Cache & Sliding-Window Rate Limiter**: Separate stateful IP rate limiting and 10-minute caching out of `GeminiService` into an isolated, unit-tested `AICacheService`.
8. **Modularize CelebrateAI Context Provider**: Separate theme detection/persistence and local storage overrides into dedicated custom hooks (`useThemeState`), dropping `celebrate-context.tsx` below 120 lines.
9. **Extract Export Formatters from `ExportFeature.tsx`**: Separate WhatsApp string generation, ICS iCalendar file creation, and Markdown rendering into `export-formatters.ts`, leaving `ExportFeature.tsx` as a clean presentation container (< 100 lines).
10. **Modularize Database Enums**: Separate PostgreSQL table enums into `database-enums.ts`, ensuring `database.types.ts` is strictly under 200 lines.
11. **Modularize Validation Schemas**: Separate idea content schemas from core event schemas into `idea-schemas.ts`, ensuring all validation files remain <= 150 lines.
12. **Decompose `Navbar.tsx`**: Extract `NavMobileMenu.tsx`, `ThemeToggle.tsx`, and `NavDemoSelector.tsx`, reducing `Navbar.tsx` from 231 to < 95 lines.
13. **Decompose `AskCelebrateAIChat.tsx`**: Extract `ChatMessageBubble.tsx` and `ChatSuggestions.tsx`, reducing the chat component from 223 to < 100 lines.
14. **Decompose `WizardStep1Basics.tsx`**: Extract `EventTypeSelector.tsx` and `EventDateCityInputs.tsx`, reducing the component from 222 to < 90 lines.
15. **Decompose `DashboardFeature.tsx`**: Extract `DashboardHeader.tsx` and `DashboardTabNav.tsx`, reducing the component from 220 to < 110 lines.
16. **Decompose `TimelineGanttView.tsx`**: Extract `GanttMilestoneRow.tsx`, reducing the component from 205 to < 105 lines.
17. **Decompose `VendorProgressCard.tsx`**: Extract `VendorProgressItem.tsx`, reducing the component from 201 to < 90 lines.
18. **Decompose `EventWizard.tsx`**: Extract `WizardStepIndicator.tsx` and `WizardNavButtons.tsx`, reducing the component from 191 to < 90 lines.
19. **Decompose `BudgetDonutChart.tsx`**: Extract `DonutChartSvg.tsx` and `BudgetLegendList.tsx`, reducing the component from 186 to < 95 lines.
20. **Thin API Route Handlers (`plan/route.ts` & `replan/route.ts`)**: Extract route input schemas and auditing helpers so route handlers remain thin composition shims <= 40 lines.

---

## 3. Proposed Target Folder Structure

```
src/
├── app/                                 # Thin routing, layouts, loading, error boundaries only
│   ├── api/
│   │   ├── assistant/route.ts           # Thin route (< 40 lines)
│   │   ├── health/route.ts              # Thin health check (< 20 lines)
│   │   ├── plan/route.ts                # Thin route (< 40 lines)
│   │   └── replan/route.ts              # Thin route (< 40 lines)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                          # Shared UI & layout components (< 120 lines each)
│   ├── dashboard/
│   │   ├── AskCelebrateAIChat.tsx       # Thin orchestrator (< 100 lines)
│   │   ├── ChatMessageBubble.tsx        # Extracted message bubble (< 60 lines)
│   │   ├── ChatSuggestions.tsx          # Extracted suggestion chips (< 45 lines)
│   │   ├── BudgetDonutChart.tsx         # Thin orchestrator (< 90 lines)
│   │   ├── DonutChartSvg.tsx            # Extracted SVG renderer (< 80 lines)
│   │   ├── BudgetLegendList.tsx         # Extracted legend (< 60 lines)
│   │   ├── TimelineGanttView.tsx        # Thin orchestrator (< 105 lines)
│   │   ├── GanttMilestoneRow.tsx        # Extracted row (< 85 lines)
│   │   ├── VendorProgressCard.tsx       # Thin orchestrator (< 90 lines)
│   │   ├── VendorProgressItem.tsx       # Extracted item (< 80 lines)
│   │   ├── KpiCards.tsx                 # Thin orchestrator (< 75 lines)
│   │   ├── SingleKpiCard.tsx            # Extracted card (< 50 lines)
│   │   ├── EditSpendModal.tsx           # Standard modal (< 110 lines)
│   │   ├── EditVendorModal.tsx          # Standard modal (< 120 lines)
│   │   └── ReplanModal.tsx              # Standard modal (< 125 lines)
│   └── layout/
│       ├── Navbar.tsx                   # Thin orchestrator (< 95 lines)
│       ├── NavMobileMenu.tsx            # Extracted mobile sheet (< 75 lines)
│       ├── NavDemoSelector.tsx          # Extracted demo pill switcher (< 55 lines)
│       ├── ThemeToggle.tsx              # Extracted theme button (< 35 lines)
│       └── EventSubNav.tsx              # Secondary subnav (< 130 lines)
├── features/
│   ├── ai/
│   │   ├── adapters/gemini-client.ts    # Single HTTP adapter (< 170 lines)
│   │   ├── components/                  # Thin UI components (< 130 lines)
│   │   ├── prompts/                     # Versioned prompt constants (< 120 lines)
│   │   ├── schemas/                     # Strict schemas (< 150 lines)
│   │   ├── services/
│   │   │   ├── ai-cache.ts              # Extracted rate limit & cache (< 80 lines)
│   │   │   ├── offline-fallbacks.ts     # Extracted offline fallback templates (< 220 lines)
│   │   │   ├── gemini.service.ts        # AI orchestration (< 150 lines)
│   │   │   └── recommendation.service.ts# Schema validation & merging (< 140 lines)
│   │   └── types/index.ts
│   ├── budget/
│   │   ├── components/                  # All <= 100 lines
│   │   └── index.ts
│   ├── events/
│   │   ├── components/
│   │   │   ├── DashboardFeature.tsx     # Thin orchestrator (< 110 lines)
│   │   │   ├── DashboardHeader.tsx      # Extracted header (< 75 lines)
│   │   │   ├── EventWizard.tsx          # Thin orchestrator (< 90 lines)
│   │   │   ├── WizardStepIndicator.tsx  # Extracted step bar (< 60 lines)
│   │   │   ├── WizardNavButtons.tsx     # Extracted button controls (< 50 lines)
│   │   │   ├── WizardStep1Basics.tsx    # Thin orchestrator (< 90 lines)
│   │   │   ├── EventTypeSelector.tsx    # Extracted type selector (< 60 lines)
│   │   │   ├── EventDateCityInputs.tsx  # Extracted inputs (< 70 lines)
│   │   │   ├── WizardStep2Scale.tsx     # Thin orchestrator (< 95 lines)
│   │   │   ├── BudgetPresetButtons.tsx  # Extracted presets (< 55 lines)
│   │   │   ├── WizardStep3Style.tsx     # Thin orchestrator (< 95 lines)
│   │   │   ├── DietaryAccessibilityOptions.tsx # Extracted checkboxes (< 65 lines)
│   │   │   └── ExportFeature.tsx        # Thin orchestrator (< 95 lines)
│   │   ├── utils/
│   │   │   └── export-formatters.ts     # WhatsApp, ICS, Markdown generators (< 160 lines)
│   │   └── index.ts
│   ├── timeline/
│   │   ├── components/
│   │   │   ├── CreateMilestoneModal.tsx # Thin modal (< 90 lines)
│   │   │   ├── MilestoneFormFields.tsx  # Extracted form controls (< 75 lines)
│   │   │   └── MilestoneCard.tsx        # Card (< 130 lines)
│   │   └── index.ts
│   └── vendors/
│       ├── components/                  # All <= 140 lines
│       └── index.ts
├── lib/
│   ├── ai/
│   │   ├── offline-fallbacks.ts         # Extracted legacy fallbacks (< 220 lines)
│   │   ├── sanitize.ts                  # Extracted sanitization (< 30 lines)
│   │   └── validate.ts                  # Zod validation (< 140 lines)
│   ├── context/
│   │   ├── celebrate-context.tsx        # Thin context provider (< 120 lines)
│   │   ├── celebrate-context.types.ts   # Context type contracts (< 40 lines)
│   │   └── useThemeState.ts             # Extracted theme hook (< 40 lines)
│   ├── data/
│   │   ├── seeds/
│   │   │   ├── wedding.seed.ts          # Palace Grounds wedding bundle (< 240 lines)
│   │   │   ├── birthday.seed.ts         # Jungle Safari birthday bundle (< 220 lines)
│   │   │   ├── community.seed.ts        # Green Eco Mela bundle (< 220 lines)
│   │   │   └── index.ts                 # Clean barrel (< 30 lines)
│   │   └── seeds.ts                     # Backward-compatible re-export (< 20 lines)
│   ├── engine/
│   │   ├── budget-rules.ts              # Extracted baseline rules (< 90 lines)
│   │   ├── budget.ts                    # Pure budget math (< 140 lines)
│   │   ├── vendor-rules.ts              # Extracted blueprints (< 160 lines)
│   │   ├── vendors.ts                   # Pure vendor scheduling (< 110 lines)
│   │   ├── timeline-rules.ts            # Extracted milestone definitions (< 120 lines)
│   │   ├── timeline.ts                  # Pure timeline scheduling (< 130 lines)
│   │   ├── feasibility.ts               # Feasibility rules (< 200 lines)
│   │   ├── city-tiers.ts                # City cost multipliers (< 90 lines)
│   │   └── types.ts                     # Engine types (< 180 lines)
│   ├── types/
│   │   ├── database-enums.ts            # Extracted enums (< 45 lines)
│   │   └── database.types.ts            # Table definitions (< 220 lines)
│   └── validations/
│       ├── idea-schemas.ts              # Extracted idea schemas (< 100 lines)
│       └── schemas.ts                   # Core validation schemas (< 150 lines)
├── server/
│   ├── repositories/                    # Isolated Supabase CRUD (< 120 lines each)
│   └── services/
│       ├── server-rules.ts              # Extracted server rules (< 140 lines)
│       └── server-event.service.ts      # Server orchestration (< 160 lines)
└── shared/
    ├── config/constants.ts              # System constants (< 120 lines)
    ├── lib/logger.ts                    # Logger (< 80 lines)
    └── ui/Modal.tsx                     # Accessible modal primitive (< 90 lines)
```

---

## 4. Refactor Sequence & Non-Regression Safeguards

1. **Phase 1: Domain Engines & Data Separation (Zero UI Touch)**
   - Extract `budget-rules.ts`, `vendor-rules.ts`, and `timeline-rules.ts`.
   - Refactor `calculateBudget`, `calculateTimeline`, and `generateVendorRecommendations` into pure sub-helpers <= 25 lines each.
   - Decompose `seeds.ts` into modular event bundles under `src/lib/data/seeds/`.
   - **Verification**: Run `npm run test` to verify all 120 mathematical, deterministic, and seed tests pass without change.

2. **Phase 2: AI Layer & Validation Decoupling**
   - Extract `src/lib/ai/offline-fallbacks.ts` and `src/features/ai/services/offline-fallbacks.ts`.
   - Extract `src/features/ai/services/ai-cache.ts` for rate limiting and cache management.
   - Extract `idea-schemas.ts` and `database-enums.ts`.
   - **Verification**: Run `src/features/ai/services/gemini.service.test.ts` and `src/lib/ai/validate.test.ts`.

3. **Phase 3: Server Services & Context Refactoring**
   - Extract `server-rules.ts` from `server-event.service.ts`.
   - Extract `useThemeState.ts` and `celebrate-context.types.ts` from `celebrate-context.tsx`.
   - Extract route validation helpers from `api/plan/route.ts` and `api/replan/route.ts`.
   - **Verification**: Run `src/lib/services/event.service.test.ts` and API route integration tests.

4. **Phase 4: Component Decomposition (< 150 lines per component)**
   - Decompose `ExportFeature.tsx` $\to$ extract `export-formatters.ts`.
   - Decompose `Navbar.tsx` $\to$ extract `NavMobileMenu.tsx`, `ThemeToggle.tsx`.
   - Decompose `AskCelebrateAIChat.tsx` $\to$ extract `ChatMessageBubble.tsx`, `ChatSuggestions.tsx`.
   - Decompose `EventWizard.tsx` & steps $\to$ extract `WizardStepIndicator.tsx`, `EventTypeSelector.tsx`, etc.
   - Decompose `DashboardFeature.tsx`, `TimelineGanttView.tsx`, `VendorProgressCard.tsx`, `BudgetDonutChart.tsx`, `KpiCards.tsx`.
   - **Verification**: Run `src/test/a11y-smoke.test.ts` and `src/test/challenge-user-journey.test.ts`.

5. **Phase 5: Quality Tooling Enforcement & Final Verification**
   - Update `.eslintrc.json` with strict rules (`complexity: 8`, `max-lines: 250`, `max-lines-per-function: 40`, `max-depth: 3`).
   - Run `npm run lint`, `npm run typecheck`, `npm run test -- --coverage`, `npm run build`.

---

## 5. Tests Needed to Protect Behavior

| Test Suite | Location | Targeted Invariant |
|---|---|---|
| **Budget Mathematical Determinism** | `src/lib/engine/budget.test.ts` | 100% exact penny allocation, 10% contingency floor, Hamilton-Hare largest remainder integrity. |
| **Vendor Deadlines & Scheduling** | `src/lib/engine/vendors.test.ts` | All vendor booking deadlines precede event date; normal lead-time compression. |
| **Timeline Milestone Precedence** | `src/lib/engine/timeline.test.ts` | All milestone dates precede event date; dependency chains strictly satisfied. |
| **Gemini Integration & Fallback** | `src/features/ai/services/gemini.service.test.ts` | Valid JSON parse, malformed JSON fallback, schema-valid fallback, timeout handling, 10-minute cache, 503 retry. |
| **Security Hardening** | `src/lib/security/security-hardening.test.ts` | Prompt injection protection, strict Zod property stripping, rate limiting (10/min), safe error envelopes. |
| **Accessibility Compliance** | `src/test/a11y-smoke.test.ts` | Modal focus trapping, ARIA roles, input labels, visible focus rings, chart text fallbacks. |
| **End-to-End User Journey** | `src/test/challenge-user-journey.test.ts` | Full creation flow: Wedding -> Replan -> Vendor Override -> Export. |

---

## 6. Estimated Effect on Code Quality Score

| Metric | Before Refactor | After Refactor (Target) | Status |
|---|---|---|---|
| **Files > 250 lines** | 12 files | **0 files** | 100% Compliant |
| **Components > 150 lines** | 14 components | **0 components** | 100% Compliant |
| **Functions > 30 lines (excl. blanks/comments)** | 59 functions | **0 functions** | 100% Compliant |
| **Cyclomatic Complexity per function** | Up to 14 | **<= 8** | 100% Compliant |
| **Cognitive Complexity per function** | Up to 16 | **<= 10** | 100% Compliant |
| **Maximum Nesting Depth** | Up to 4 | **<= 3** | 100% Compliant |
| **TypeScript Strictness (`any`, unsafe casts)** | 0 `any` | **0 `any`** | Strict Preserved |
| **Dead Code / Rogue Console Logs** | 0 rogue logs | **0 rogue logs** | Clean |
| **Code Quality Score Estimate** | **89 / 100** | **98 / 100** | **Target Achieved (+9 pts)** |
