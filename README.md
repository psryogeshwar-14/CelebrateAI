# CelebrateAI 🎉
**GenAI-Powered Celebration & Event Planner for PromptWars Virtual Challenge 5**

> **“Plan every celebration with clarity, not chaos.”**  
> CelebrateAI turns your event brief into a budget that adds up, a timeline that works backwards from the big day, and a vendor checklist you can actually follow.

[![CI Status](https://github.com/your-username/celebrate-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/celebrate-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](./LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-3.8--Flash-blue)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Tests-110%20passed-brightgreen)](https://vitest.dev/)

---

## Architecture & System Overview

CelebrateAI enforces an uncompromising **separation between mathematical fact and GenAI creative recommendations**:

```mermaid
flowchart TD
    User([User / Event Planner]) -->|Inputs Brief| Wizard[Planner Wizard: /plan]
    Wizard -->|POST /api/plan| EdgeGuard[Edge Middleware: Size Limit, CSRF, CSP]
    EdgeGuard --> RateLimit[Sliding Window Rate Limiter: 10 req/min]
    RateLimit --> ZodStrict[Zod Strict Validation & HTML Sanitization]
    ZodStrict --> Audit[Structured Audit Logger]

    subgraph Deterministic Core Pure TypeScript
        ZodStrict --> Engine[Deterministic Planning Engine]
        Engine --> Allocator[Hamilton-Hare Budget Allocator: budget.ts]
        Engine --> Scheduler[Back-Scheduled Milestones: timeline.ts]
        Engine --> VendorRules[Vendor Engine & City Cost Bands: vendors.ts]
        Engine --> Feasibility[6-Rule Conflict Detector: feasibility.ts]
    end

    Engine -->|Locked <computed_plan> Context| Prompts[Prompt Injection Defense]
    Prompts --> Cache[10-Minute In-Memory Cache]
    Cache -->|Cache Miss| Gemini[Gemini 3.8 Flash via @google/genai]
    Gemini -->|Structured JSON Output| Validator[Zod Output Validator & Savings Calculator]
    Gemini -.->|API Failure / Throttling| Fallback[Culturally-Accurate Offline Fallbacks]
    Validator --> Audit
    Fallback --> Audit

    Validator --> Dashboard[Interactive Dashboard: /dashboard]
    Dashboard --> BudgetPage[Budget Manager: /budget]
    Dashboard --> TimelinePage[Timeline & Gantt: /timeline]
    Dashboard --> VendorPage[Vendor Checklist: /vendors]
    Dashboard --> IdeasPage[Themes & Menus: /ideas]
    Dashboard --> AssistantPage[Grounded Chat: /assistant]
    Dashboard --> ExportPage[Export & ICS: /export]
```

### The Core Architectural Rule:
- **Deterministic Planning Engine**: Budget allocations, category percentages, contingency reserves ($\ge 10\%$, $\ge 12\%$ for outdoor), back-scheduled milestone dates, vendor booking deadlines, and feasibility warnings are 100% computed via pure TypeScript algorithms.
- **Gemini 3.8 Flash**: Never invents budget totals, dates, or calculations. Receives a compact, locked `<computed_plan>` XML context and strictly generates 3 personalized themes (with 4-color palettes), regional dietary menus, risk mitigation protocols, and answers to grounded assistant questions.
- **Prompt Injection Defense**: User text is sanitized and wrapped within `<untrusted_user_text>` tags with explicit model instructions to ignore instructions inside those tags.

For deep-dive documentation, see:
- 📖 [**ARCHITECTURE.md**](./ARCHITECTURE.md): Complete component and security architecture specifications.
- 💬 [**PROMPTS.md**](./PROMPTS.md): Engineering rationales for all Gemini prompt templates and schemas.
- 📝 [**CHANGELOG.md**](./CHANGELOG.md): Detailed release notes and version history.

---

## 9 Core Application Pages

| # | Route | Page Title | Key Capabilities |
|---|---|---|---|
| 1 | `/` | **Landing Page** | Value proposition hero, live Bengaluru demo cards (Wedding, Birthday, Community), feature grid, and CTAs. |
| 2 | `/plan` | **Planner Wizard** | 3-step accessible form with progress bar, guest stepper, INR budget formatter, city chip selectors, and multi-select constraint tags. |
| 3 | `/dashboard` | **Celebration Command Center** | Real-time countdown timer, 5 KPI badges, tonal amber budget donut chart, Gantt view, and quick replanning. |
| 4 | `/budget` | **Budget & Expense Manager** | Planned vs actual spend tracking, category breakdown table, inline/modal spend editor, contingency buffer status, and server-calculated rupee savings tips. |
| 5 | `/timeline` | **Milestone Timeline & Gantt** | 21 back-scheduled milestones with status filters (`All`, `Todo`, `Do Now (Overdue)`, `Completed`), owner filters (`Host`, `Family`, `Vendor`, `Planner`), and custom milestone creator. |
| 6 | `/vendors` | **Vendor Checklist** | Vendor cards, booking deadlines, quote vs budget band comparisons, status workflow (`Shortlisted` $\to$ `Quoted` $\to$ `Booked`), verification interview checklists, and 1-click Google Maps search. |
| 7 | `/ideas` | **AI Ideas, Menus & Run Sheet** | 3 personalized theme concepts with 4-color copyable swatches, regional banquet menus with dietary tags, risk mitigation matrix, and print-ready event-day run sheet. |
| 8 | `/assistant` | **Grounded Assistant** | Grounded chat interface with immutable mathematical context sidebar, prompt chips, and citation links. |
| 9 | `/export` | **Export & Share** | Printable one-sheet executive brief (`@media print`), `.ics` calendar sync download, and copyable WhatsApp family text summary. |

---

## Production Security & Hardening

1. **Zero Secret Leakage**:
   - `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-side only; client bundles receive only public anonymous keys.
2. **Next.js Edge Middleware** (`src/middleware.ts`):
   - **Request Body Size Limit**: Rejects incoming payloads $> 512\text{ KB}$ (`413 Payload Too Large`) to protect against buffer exhaustion attacks.
   - **CSRF / Origin Protection**: Verifies origin and blocks cross-origin state-changing mutations (`sec-fetch-site: cross-site`).
   - **Production Security Headers**: Strict Content Security Policy (CSP), HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
3. **Zod Strict Validation**:
   - Every input schema enforces `.strict()` to reject unauthorized or injected parameter tampering.
4. **Structured Audit Logging** (`src/lib/logging/audit.ts`):
   - Logs plan generation, replanning, and assistant chats in structured single-line JSON format for Google Cloud Logging / Datadog.
   - Automatically masks client IP addresses (`192.168.1.xxx`) for GDPR and privacy compliance.
5. **Generic Error Responses**:
   - Internal error handlers catch 500 exceptions and return sanitized messages, preventing stack traces or database connection strings from leaking to clients.

---

## Bengaluru Demo Events Included

CelebrateAI comes pre-seeded with 3 realistic scenarios ready to explore:
1. **Wedding**: *Ananya & Vikram's Heritage Kannada Wedding* (Palace Grounds, 350 guests, ₹25,00,000, Udupi plantain leaf feast, Hoysala mandap, live Nadaswaram).
2. **Birthday**: *Rohan's 30th Cyberpunk Rooftop Bash* (Indiranagar 100 Ft Rd, 50 guests, ₹1,50,000, craft microbrewery kegs, retro arcade tournament, neon photobooth).
3. **Community Event**: *HSR Layout Sustainability & Green Habitat Fair* (Sector 2 BBMP Park, 600 guests, ₹3,50,000, zero-plastic millet fair, solar sound stage, 600 native sapling gifts).

---

## Local Development Setup

### 1. Prerequisites
- Node.js 20+
- npm 10+
- Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))
- Supabase Project (optional for local in-memory exploration; required for live DB persistence)

### 2. Installation
```bash
git clone https://github.com/your-username/celebrate-ai.git
cd celebrate-ai
npm ci
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
# Gemini API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

CelebrateAI includes a comprehensive test suite of **110 unit, integration, and security tests across 16 test files** using Vitest:

```bash
# Run all tests
npm run test

# Run tests with code coverage
npm run test:coverage

# Static TypeScript typecheck
npx tsc --noEmit

# Code quality lint check
npm run lint
```

### Test Suite Breakdown
- `src/lib/engine/budget.test.ts`: Hamilton-Hare exact allocation, positive integer guarantees, $\ge 10\%$ contingency.
- `src/lib/engine/timeline.test.ts`: 21 back-scheduled milestones, short-notice compression (<30d), overdue "Do now" tagging.
- `src/lib/engine/vendors.test.ts`: Booking deadlines, budget ranges, and Google Maps query links.
- `src/lib/engine/feasibility.test.ts`: Detection of all 6 operational conflict types.
- `src/lib/ai/gemini-mocked.test.ts`: Malformed Gemini output rejection, prompt injection defense, rate limiting, and grounded assistant responses.
- `src/lib/security/security-hardening.test.ts`: Zod strict schema rejection, 512 KB payload size enforcement, and audit log IP anonymization.
- `src/lib/supabase/auth-rls.test.ts`: Supabase service-role key protection and Row-Level Security policy verification.
- `src/test/integration.test.ts`: Full end-to-end plan generation, replanning, milestone completion, and export data flow.
- `src/test/a11y-smoke.test.ts`: Screen-reader table alternatives for charts, semantic labels, and focus indicators.

---

## Google Cloud Run Deployment

CelebrateAI is packaged with an optimized multi-stage `Dockerfile` producing a standalone Node.js production image.

### 1. Authenticate with Google Cloud
```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### 2. Enable Required APIs
```bash
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com
```

### 3. Build Container via Google Cloud Build
```bash
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/celebrate-ai:latest
```

### 4. Deploy to Google Cloud Run
```bash
gcloud run deploy celebrate-ai \
    --image gcr.io/[YOUR_PROJECT_ID]/celebrate-ai:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=[YOUR_KEY],NEXT_PUBLIC_SUPABASE_URL=[YOUR_URL],NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_KEY]"
```

---

## License

Built for **PromptWars Virtual Challenge 5**. Distributed under the [MIT License](./LICENSE).
