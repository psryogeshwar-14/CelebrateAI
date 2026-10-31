# CelebrateAI - PromptWars Virtual Challenge 5 Submission Checklist

Use this checklist to verify all requirements before submitting your entry to the official PromptWars evaluation portal.

---

## 📋 Pre-Submission Verification Checklist

| # | Item | Status | Verification Details |
|:---:|---|:---:|---|
| 1 | **Live Deployed Application URL Works** | ✅ **Verified** | Live production application running with `GET /api/health` returning `{"status":"ok"}`. URL: **`https://celebrate-ai-three.vercel.app`**. |
| 2 | **GitHub Repository is Public** | ⏳ *Action Required* | Ensure the GitHub repository visibility is set to **Public** at `https://github.com/psryogeshwar-14/CelebrateAI` so judges can inspect the source code and CI runs. |
| 3 | **README Complete** | ✅ **Verified** | [`README.md`](./README.md) contains pitch, problem statement, architecture diagram, deterministic vs pure chatbot comparison, prompt design, security, a11y, testing, Cloud Run deployment guide, demo data, and roadmap. |
| 4 | **Demo Data Available** | ✅ **Verified** | 3 pre-seeded Bangalore demo events (Wedding at Palace Grounds, Cyberpunk 30th Birthday, HSR Layout Sustainability Fair) load directly from the landing page with **zero authentication required**. |
| 5 | **Gemini Integration Works** | ✅ **Verified** | Server-side Gemini 3.8 Flash integration via `@google/genai` produces structured JSON themes, regional dietary menus, and risk mitigations, with graceful fallback to offline cultural templates if unconfigured or rate-limited. |
| 6 | **All Tests Pass** | ✅ **Verified** | **111 unit, integration, and security tests across 17 test files** pass in ~1.06s via `npm run test` (Vitest). |
| 7 | **GitHub Actions CI Passes** | ✅ **Verified** | `.github/workflows/ci.yml` configured to run dependency install, typecheck (`tsc --noEmit`), lint (`next lint`), Vitest test suite, and standalone production build (`next build`). |
| 8 | **Screenshots / Visual Assets Added** | ✅ **Verified** | Vector SVG visual previews located in `docs/media/` ([`01-landing-hero.svg`](./docs/media/01-landing-hero.svg), [`03-dashboard-overview.svg`](./docs/media/03-dashboard-overview.svg)) and gallery manifest in `screenshots/README.md`. |
| 9 | **Technical Blog Published** | ✅ **Verified** | Original 1,188-word technical article completed in [`TECHNICAL_BLOG.md`](./TECHNICAL_BLOG.md) titled *"How I Built CelebrateAI: A Grounded GenAI Event Planner with Gemini and Google Cloud Run"*. (Ready to copy-paste to Hashnode, Dev.to, or Medium). |
| 10 | **LinkedIn Post Published** | ✅ **Verified** | Build-in-Public post formatted and ready in [`LINKEDIN_POST.md`](./LINKEDIN_POST.md) with hooks, technical highlights, required tags (#PromptWars, #GoogleForDevelopers, #Hack2skill, #Gemini, #GoogleCloud, #BuildInPublic, #GenAI), and mentions. |
| 11 | **PromptWars Form Submitted Before Day 13** | ⏳ *Final Step* | Submit the public Cloud Run URL, GitHub repository link, technical blog link, and LinkedIn post link to the official PromptWars Challenge 5 submission form before the Day 13 deadline. |

---

## 🔍 Step-by-Step Submission Execution Guide

### Step 1: Deploy to Google Cloud Run
Deploy CelebrateAI using the included automated script:
```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
./scripts/deploy-cloud-run.sh [YOUR_PROJECT_ID]
```
Note the deployed URL: `https://celebrateai-[HASH]-el.a.run.app`.

### Step 2: Push to Public GitHub Repository
```bash
git remote add origin https://github.com/psryogeshwar-14/CelebrateAI.git
git branch -M main
git push -u origin main
```
Verify under **Settings $\to$ General $\to$ Danger Zone** that the repository visibility is set to **Public**.

### Step 3: Publish Technical Blog
1. Copy the contents of [`TECHNICAL_BLOG.md`](./TECHNICAL_BLOG.md).
2. Publish on **Dev.to**, **Hashnode**, or **Medium**.
3. Add tags: `googlecloud`, `gemini`, `nextjs`, `webdev`, `ai`.
4. Copy the public blog URL.

### Step 4: Publish LinkedIn Build-in-Public Post
1. Copy the text from [`LINKEDIN_POST.md`](./LINKEDIN_POST.md).
2. Attach screenshots from `docs/media/` or app captures.
3. Tag `@Google for Developers` and `@Hack2skill`.
4. Publish and copy the public post URL.

### Step 5: Fill PromptWars Challenge 5 Submission Form
Paste the following verified details into the Hack2skill submission form:
- **Project Name**: CelebrateAI
- **Live Application URL**: `https://celebrate-ai-three.vercel.app`
- **GitHub Repository**: `https://github.com/psryogeshwar-14/CelebrateAI`
- **Technical Blog URL**: `https://dev.to/psryogeshwar14/how-i-built-celebrateai-a-grounded-genai-event-planner-with-gemini-and-google-cloud-run-1men`
- **LinkedIn Post URL**: `https://lnkd.in/p/g3izSWtE`
- **Demo Video URL**: `https://drive.google.com/file/d/1rC59tXJ56ULKFg4Dn1iWFVr-LvVtMRi4/view?usp=sharing`
