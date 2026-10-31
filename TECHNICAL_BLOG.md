# How I Built CelebrateAI: A Grounded GenAI Event Planner with Gemini and Google Cloud Run

Planning a major celebration—whether a 350-guest wedding at Palace Grounds, a milestone 30th birthday on an Indiranagar rooftop, or a 600-person community festival—should be a joyous milestone. Instead, for millions of organizers and families, it quickly turns into an operational headache of unbalanced spreadsheets, missed booking deadlines, and uncoordinated vendor quotes.

When planners turn to generic AI chatbots for assistance, the experience often creates more anxiety than relief. In this technical deep-dive, I explore how I built **CelebrateAI** for PromptWars Virtual Challenge 5: an event planning system engineered around a strict separation of concerns between a mathematical deterministic engine and Google Gemini 3.8 Flash, deployed to Google Cloud Run in `asia-south1`.

---

## 1. The Problem

Event planning is governed by unforgiving real-world constraints:
- **Zero-Sum Budgets**: If your total budget is ₹25,00,000, your category expenses plus contingency must sum to exactly ₹25,00,000. Not ₹24,85,000, and never ₹27,50,000.
- **Reverse Chronological Dependencies**: Events cannot be planned forward from today; they must be back-scheduled from the event date. Venues must be secured months in advance, menu tastings must precede invitations, and guest counts must lock before banquet preparations.
- **High-Stakes Feasibility**: If per-guest catering drops below wholesale ingredient thresholds or an outdoor celebration lacks weather contingency reserves, the event faces real operational disruption.

---

## 2. Why Generic AI Planners Fail

When prompting a standard Large Language Model with:
> *"Plan my sister's wedding for 350 guests in Bengaluru with a budget of ₹20,00,000,"*

The LLM returns an attractive itinerary. However, under technical inspection, three fatal flaws emerge:

1. **Hallucinated Arithmetic**: LLMs generate text token-by-token based on probability rather than math. Category allocations routinely sum to 115%–130% of the target budget.
2. **Calendar Amnesia**: Models struggle with date arithmetic. They propose vendor booking deadlines that fall in the past or fail to compress lead times when an event is less than 30 days away.
3. **Decoupled Advice**: Because generic models invent their own numbers, creative ideas are divorced from fiscal reality—such as recommending luxury floral decor on an entry-level budget.

---

## 3. The CelebrateAI Architecture

To solve this, CelebrateAI enforces an uncompromising architectural boundary:

```
[User Event Brief] 
       │
       ▼
[Deterministic Planning Engine (Pure TypeScript)]
  • Exact Hamilton-Hare Budget Allocation (Sums exactly to Total)
  • Guaranteed >= 10% Contingency Buffer (12% for Outdoor)
  • 21 Back-Scheduled Milestones with "Do Now" Overdue Tagging
  • City-Tiered Vendor Deadlines & Feasibility Conflict Rules
       │
       ▼
[Locked <computed_plan> Context]
       │
       ▼
[Google Gemini 3.8 Flash via @google/genai SDK]
  • 3 Personalized Themes with 4-Color Palettes
  • Regional Dietary-Compliant Banquet Menus
  • Operational Risk Mitigation Matrix
  • Grounded Conversational Q&A Assistant
       │
       ▼
[Zod Strict Validation & Runtime Merge]
       │
       ▼
[Interactive Dashboard, Gantt Timeline, and Export Suite]
```

Mathematics, calendar schedules, and budget allocations are computed 100% deterministically in pure TypeScript. Gemini receives these computed facts as an immutable context block, focusing exclusively on creative personalization.

---

## 4. The Deterministic Planning Engine

Located in `src/lib/engine/`, the engine contains pure, tested algorithms:

- **Hamilton-Hare Largest Remainder Method (`budget.ts`)**: Allocates baseline budget shares, applies integer floor operations, and distributes remaining rupees strictly by largest fraction. Every category receives a positive integer, summing exactly to total budget.
- **Contingency Protection**: Guarantees $\ge 10\%$ contingency (automatically raised to $12\%$ for outdoor events).
- **Reverse Timeline Engine (`timeline.ts`)**: Calculates milestone due dates relative to the event date. For short-notice events ($< 30$ days), lead times compress proportionally and overdue milestones are marked `"Do Now"`.
- **Feasibility Conflict Detector (`feasibility.ts`)**: Evaluates six operational rules, such as flagging if per-guest catering allocation falls below the city cost tier baseline.

---

## 5. Grounded Gemini Prompts

Gemini 3.8 Flash (`src/lib/ai/`) receives the deterministic plan inside an immutable XML block:

```xml
<computed_plan>
  <event_type>wedding</event_type>
  <city>Bengaluru (Tier 1)</city>
  <event_date>2026-12-15</event_date>
  <total_budget>₹25,00,000</total_budget>
  <budget_categories>
    <category name="venue" planned="₹7,00,000" />
    <category name="catering" planned="₹6,25,000" per_guest="₹1,785" />
    <category name="contingency" planned="₹2,50,000" />
  </budget_categories>
  <dietary_constraints>Pure Vegetarian, Jain Available</dietary_constraints>
</computed_plan>
```

The system instruction explicitly directs the model:
> *"These computed numbers, dates, and deadlines are fixed facts. Do not invent, alter, or calculate new budget totals or dates. Use them solely to generate personalized themes, regional menus, and operational risk advice."*

---

## 6. Structured Output and Validation

Rather than parsing markdown with regex, CelebrateAI uses `@google/genai`'s native `responseMimeType: "application/json"` and strict `responseSchema`.

Every payload returned by Gemini is verified through Zod schemas (`src/lib/ai/schema.ts`):
- Themes must contain 4 valid hex colors and actionable decor concepts.
- Menu sections must honor requested dietary tags (e.g., Jain, Vegan, Halal).
- Savings tips return relative percentages; rupee savings (`planned_amount * percentage / 100`) are calculated deterministically on the server to prevent math errors.

If Gemini is unreachable or rate-limited, the system falls back to culturally accurate offline templates, ensuring zero user disruption.

---

## 7. Security and Prompt-Injection Defence

CelebrateAI implements multi-layered enterprise safeguards:
1. **Prompt Injection Quarantine**: Untrusted user inputs are sanitized and isolated inside `<untrusted_user_text>` tags with explicit model instructions to ignore embedded directives.
2. **Edge Request Limiting**: Middleware rejects incoming payloads $> 512\text{ KB}$ with `413 Payload Too Large`.
3. **Sliding-Window Rate Limiting**: In-memory rate limiting caps AI generation to 10 requests per minute per IP.
4. **Header Hardening**: Enforces strict CSP, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, and masked audit logging (`192.168.1.xxx`).
5. **Zero Secret Leakage**: `GEMINI_API_KEY` and Supabase keys reside exclusively in server-side runtimes.

---

## 8. Testing Strategy

The project maintains **111 automated tests across 17 test files** in Vitest:
- Engine tests verify the Hamilton-Hare allocator, timeline compression, and feasibility rules.
- Mocked Gemini tests verify prompt injection isolation, malformed JSON recovery, and rate limiting.
- Integration tests execute the full lifecycle: brief submission $\to$ deterministic plan $\to$ AI enrichment $\to$ replanning $\to$ export.
- Accessibility tests verify ARIA progressbars and screen-reader alternatives.

---

## 9. Accessibility (a11y)

CelebrateAI adheres to **WCAG 2.1 AA** standards:
- The SVG budget donut chart is paired with a hidden, screen-reader-accessible HTML data table.
- Wizard steps declare proper `role="progressbar"` with `aria-valuenow`.
- Warm neutral surfaces (`#fafaf9`) paired with saffron-gold accents (`#d97706`) guarantee contrast $> 4.5:1$.
- Touch targets strictly meet the $\ge 44\times 44\text{ px}$ threshold.

---

## 10. Deployment to Google Cloud Run

The application is deployed to **Google Cloud Run** in `asia-south1` (Mumbai):
- **Container Architecture**: Multi-stage `Dockerfile` based on `node:20-alpine` with `tini` for graceful `SIGTERM` signal propagation.
- **Security**: Runs under an unprivileged `nextjs:nodejs` user (UID 1001).
- **Zero-Secret Logging**: Credentials are provisioned via Google Secret Manager and mounted as environment variables without printing in logs.
- **Efficiency**: Auto-scales from 0 to 3 instances with 512Mi memory and 1 vCPU.

---

## 11. What I Learned

Building CelebrateAI reinforced a vital engineering principle: **LLMs should be treated as creative reasoning engines, not calculation engines.** 

By constraining generative models to what they do best—synthesis, cultural nuance, and domain empathy—and anchoring them to deterministic mathematical code, you eliminate hallucinations, protect users from costly budget blunders, and build software people can trust with their life celebrations.

---

## 12. Live Demo & Links

- **Live Application**: [https://celebrateai-placeholder-el.a.run.app](https://celebrateai-placeholder-el.a.run.app)
- **GitHub Repository**: [https://github.com/your-username/celebrate-ai](https://github.com/your-username/celebrate-ai)
- **Health Endpoint**: [https://celebrateai-placeholder-el.a.run.app/api/health](https://celebrateai-placeholder-el.a.run.app/api/health)
