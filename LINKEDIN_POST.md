# LinkedIn Build-in-Public Post

*(Copy and paste the text below directly into LinkedIn. Tag `@Google for Developers` and `@Hack2skill` where indicated.)*

---

Ever tried asking ChatGPT to plan a 300-person wedding with a ₹20 Lakh budget?

You usually get an inspiring mood board... followed by budget line items that secretly add up to ₹24 Lakhs, vendor deadlines set in the past, and zero contingency for rain. 😅

Event planning isn't just a creative brainstorming task—it's a zero-sum mathematical problem governed by strict chronological dependencies.

For PromptWars Virtual Challenge 5, I built **CelebrateAI**: a celebration planner that pairs a deterministic mathematical engine with Google Gemini 3.8 Flash, deployed to Google Cloud Run.

Here is the core architectural principle: **Never let an LLM do arithmetic or date calculations.**

Instead, CelebrateAI enforces a strict separation of concerns:

🔢 **The Deterministic Core (Pure TypeScript)**:
• **Hamilton-Hare Largest Remainder Method**: Every rupee adds up exactly to 100% of your budget.
• **Mandatory Contingency**: Guaranteed $\ge 10\%$ reserve (automatically bumped to $12\%$ for outdoor celebrations).
• **Reverse Chronological Timeline**: Back-schedules 21 milestones backwards from the event date, compressing lead times and flagging overdue items if planning on short notice.
• **Feasibility Conflict Engine**: Catches 6 operational risks (e.g., catering allocations below city cost baselines).

✨ **Grounded Google Gemini 3.8 Flash**:
The computed mathematical plan is locked in XML and passed as immutable context. Gemini never invents numbers or dates. Instead, it focuses purely on creative personalization:
• 3 culturally tailored theme concepts with 4-color palettes
• Regional banquet menus honoring dietary needs (Jain, Halal, Vegan, etc.)
• Operational risk mitigation protocols
• Grounded "Ask CelebrateAI" assistant that answers host questions with mathematical fact citations

🛡️ **Production Hardening**:
• Prompt injection defense via isolated untrusted tag boundaries
• Next.js Edge Middleware with 512 KB payload limits & strict CSP
• Google Secret Manager with zero secret leakage in logs
• 111 unit, integration, and security tests across 17 test files (100% passing)
• WCAG 2.1 AA accessible with screen-reader data table alternatives

📸 *Swipe through the screenshots below to see the interactive dashboard, tonal amber budget donut chart, Gantt timeline, and grounded assistant in action!*

🔗 **Try the live app**: https://celebrateai-placeholder-el.a.run.app
⭐ **GitHub Repository**: https://github.com/psryogeshwar-14/CelebrateAI
📝 **Read the full technical deep dive**: https://github.com/psryogeshwar-14/CelebrateAI/blob/main/TECHNICAL_BLOG.md

Huge shoutout to Google for Developers (@Google for Developers) and Hack2skill (@Hack2skill) for hosting this challenge!

#PromptWars #GoogleForDevelopers #Hack2skill #Gemini #GoogleCloud #BuildInPublic #GenAI #NextJS #TypeScript #CloudRun
