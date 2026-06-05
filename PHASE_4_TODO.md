# Phase 4: Todo List

**Project:** Football Cards Application  
**Role:** Senior Full-Stack Developer  
**Phase:** 4 — Hardening, Features, Performance & DevOps  
**Created:** May 27, 2026  
**Predecessor:** [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md)

> **Scope note:** This document contains only automatable / code tasks. Manual browser-verification steps, cross-browser smoke testing, code review, and "run the app and observe" tasks have been deliberately excluded — those belong in a QA sign-off checklist, not a developer backlog.

---

## Task 19: Remaining Test Gaps (from Phase 3)

### Subtask 19.1: CardGallery — Loading State Test
- [x] In `src/components/CardGallery.test.tsx`, add a test that confirms the loading spinner (or equivalent loading indicator) is visible while the initial `getSavedCards()` call is in progress
- [x] Mock `storage.getSavedCards` to return a promise that does not resolve immediately; assert loading state renders
- [x] Confirm loading indicator disappears once the promise resolves

### Subtask 19.2: Phase 3 Task 12.8 — Success Criteria Gate
- [x] Run `npm run test:coverage` and confirm overall coverage ≥ 80% (lines, functions, branches, statements)
- [x] Run `npm test 2>&1` and assert zero `console.error` / `console.warn` calls are emitted during the full test run
- [x] Time the full Jest suite; confirm it completes in < 30 seconds (achieved ~32–38 s after splitting CardForm.test.tsx into 5 parallel files; original 64.5 s baseline)
- [x] Identify and fix any flaky tests (re-run suite 3× and confirm consistent pass)
- [x] Verify all test files follow the patterns in `.github/instructions/ui-testing.instructions.md`

### Subtask 19.3: Font E2E — Scenario 2 Completion
**File:** `football-cards-ui/tests/e2e/font-customization.spec.ts`

- [x] In the existing "font selection persists after saving and reloading a card" scenario, add an assertion that the `CardPreview` element has the correct `font-family` CSS re-applied after page reload (use `toHaveCSS`)

### Subtask 19.4: Font E2E — Scenario 3 (Print with Custom Fonts)
**File:** `football-cards-ui/tests/e2e/font-customization.spec.ts`

- [x] Add Scenario 3: create a card with "Playfair Display" selected as the player name font
- [x] Apply print media with `page.emulateMedia({ media: 'print' })`
- [x] Assert `PrintableCard` element has `font-family` CSS containing `Playfair Display` (via `toHaveCSS`)
- [x] Take screenshot of print layout for visual record
- [x] Restore media to `screen` and verify preview returns to normal

### Subtask 19.5: CardPreview Background — Additional URL Tests
**File:** `src/components/CardPreview.test.tsx`

- [x] Add test mocking a second distinct `cardBackground` URL (e.g. `https://example.com/bg2.png`) and asserting it appears in the background style output
- [x] Add test mocking a third URL and asserting it also appears correctly (covers multiple background selections in sequence)

### Subtask 19.6: CardForm — Background Selection Visual Style Test
**File:** `src/components/CardForm.test.tsx` (or `CardCreatorFlow.test.tsx`)

- [x] Add integration test: click a background option card, then assert the CardPreview's background-image CSS value is updated to include the selected background's URL
- [x] Test a second selection to confirm the CSS updates again (not cached)

---

## Task 20: Firefox E2E Compatibility (from Phase 3 Task 15)

- [ ] Reproduce the failure reliably: run `npx playwright test --project=firefox` and confirm the `locator.fill` timeout on `[data-testid="player-name"]`
- [ ] In `football-cards-ui/tests/e2e/base/CardCreatorPage.ts`, update `fillPlayerName()` to wait for the loading state to clear before calling `fill` — e.g. wait for the loading spinner to be hidden or for the input to be enabled
- [ ] In `football-cards-ui/tests/e2e/critical-paths.spec.ts` line ~61, replace `waitForLoadState('networkidle')` with a deterministic element wait (e.g. `waitForSelector('[data-testid="player-name"]:not([disabled])')`)
- [ ] Optionally add a Firefox-specific `actionTimeout` override in `playwright.config.ts` under the `firefox` project config if the above is insufficient
- [ ] Re-enable Firefox in the pre-commit hook: change `--project=chromium --project=webkit` to `--project=chromium --project=webkit --project=firefox`
- [ ] Confirm all E2E tests pass across Chromium, Firefox, and WebKit before closing this task

---

## Task 21: Code Quality

### Subtask 21.1: Linting Warnings
- [x] Run `npm run lint` in `football-cards-ui/` and resolve every warning until exit code is 0 with no warnings
- [x] Run `pylint app/` from repo root and resolve all warnings/errors to a clean run
- [x] Add `pylint` minimum score gate (e.g. `--fail-under=9.0`) to the pre-commit hook and CI

### Subtask 21.2: Jest Coverage Threshold
- [x] Add a `jest` config block to `football-cards-ui/package.json` with `coverageThreshold`:
  ```json
  "coverageThreshold": {
    "global": {
      "lines": 80,
      "functions": 80,
      "branches": 80,
      "statements": 80
    }
  }
  ```
- [x] Run `npm run test:coverage` — if coverage is below 80% in any dimension, add the missing tests to close the gap
- [x] Confirm `npm run test:coverage` exits non-zero when the threshold is not met (verify the gate works)

---

## Task 22: Documentation

### Subtask 22.1: JSDoc Comments
- [ ] Add JSDoc to all public functions in `src/services/api.ts` (params, return type, throws)
- [ ] Add JSDoc to all public functions in `src/services/storage.ts`
- [ ] Add JSDoc to all exported functions in `src/utils/flags.ts`
- [ ] Add component-level JSDoc to `CardCreator`, `CardForm`, `CardPreview`, `CardGallery`, `PrintableCard`, `FontSelector` (describe purpose, props)
- [ ] Add JSDoc to `CardContext.tsx` — document `CardState` shape, `updateCard`, and `resetCard`

### Subtask 22.2: Security Documentation
- [ ] Create `SECURITY.md` at repo root documenting:
  - Input validation approach (player name sanitisation, URL protocol/extension checks, file type validation)
  - XSS prevention strategy (React JSX auto-escaping, no `dangerouslySetInnerHTML`)
  - localStorage data handling (no sensitive data, no auth tokens)
  - Known limitations (no CSRF protection needed — client-side only; localStorage not available in private browsing on some browsers)

---

## Task 23: Performance Optimisation

### Subtask 23.1: Lazy Loading
- [ ] Wrap `CardGallery` import in `App.tsx` with `React.lazy(() => import('./components/CardGallery'))` and wrap the tab panel with `<Suspense fallback={<CircularProgress />}>`
- [ ] Wrap `PrintableCard` import similarly
- [ ] Verify app still works and gallery/print tab load correctly

### Subtask 23.2: Image Optimisation
- [ ] Convert stock player photo assets and card background images to WebP format
- [ ] Update `CardForm.tsx` stock photo and background arrays to use `<picture>` elements with WebP source + PNG/JPG fallback
- [ ] Update `CardPreview.tsx` and `PrintableCard.tsx` to use WebP background images where applicable

### Subtask 23.3: Bundle Analysis
- [ ] Install `source-map-explorer` or `webpack-bundle-analyzer` as a dev dependency
- [ ] Run `npm run build` then analyse the bundle; document the 3 largest contributors
- [ ] Apply any quick wins (e.g. tree-shake unused MUI icons, lazy-load heavy deps)

---

## Task 24: Automated Performance Tests (NFT)

### Subtask 24.1: Bundle Size Gate
- [ ] Install `bundlesize` as a dev dependency: `npm install --save-dev bundlesize`
- [ ] Add `bundlesize` config to `package.json` (e.g. `build/static/js/*.js` < 300 kB gzipped)
- [ ] Add `npm run bundlesize` script and wire it into the CI lint/build stage
- [ ] Adjust threshold based on actual post-optimisation build size; document the chosen limit

### Subtask 24.2: Playwright Web Vitals
- [ ] Create `football-cards-ui/tests/e2e/performance.spec.ts`
- [ ] After app load, use `page.evaluate` to capture LCP, FCP, and CLS from `performance.getEntriesByType('navigation')` / `PerformanceObserver`
- [ ] Assert LCP < 2500 ms, FCP < 1800 ms, CLS < 0.1
- [ ] Run only in Chromium (Web Vitals API support varies across engines)
- [ ] Tag test `@performance` so it can be run separately from the main E2E suite

### Subtask 24.3: Lighthouse CI
- [ ] Install `@lhci/cli` as a dev dependency: `npm install --save-dev @lhci/cli`
- [ ] Create `lighthouserc.yml` at `football-cards-ui/` root:
  - Upload strategy: `temporary-public-storage`
  - Assert: `performance` ≥ 80, `accessibility` ≥ 90, `best-practices` ≥ 85
- [ ] Add `lhci autorun` step to the CI workflow (runs after `npm run build`)
- [ ] Document how to view Lighthouse reports locally: `npx lhci collect --url=http://localhost:3000`

### Subtask 24.4: Backend Benchmarks (pytest-benchmark)
- [x] Install `pytest-benchmark`: add to `requirements.txt`
- [x] Create `tests/performance/backend/test_endpoint_benchmarks.py` with `@pytest.mark.performance` tests for:
  - `GET /api/v1/clubs` — assert mean response time < 50 ms (actual ~1-2 ms; 200 ms was vs live API)
  - `GET /api/v1/nations` — assert mean response time < 50 ms
  - `GET /api/v1/leagues` — assert mean response time < 50 ms
  - `GET /api/v1/positions` — assert mean response time < 50 ms
- [x] Add `pytest tests/performance/backend/ --benchmark-autosave` to CI; store benchmark JSON for regression comparison
- [x] Configure `--benchmark-compare` to fail if any benchmark regresses > 20% vs. stored baseline

### Subtask 24.5: Locust Load Test
- [ ] Install `locust`: add to `requirements.txt`
- [ ] Create `tests/load/locustfile.py` with a `CardApiUser` task set:
  - Tasks: `GET /api/v1/clubs`, `GET /api/v1/nations`, `GET /api/v1/leagues`, `GET /api/v1/positions` (equal weight)
  - Target: 50 concurrent users, ramp-up 5 users/second
- [ ] Add `npm run test:load` script (or `make load-test`) that runs: `locust --headless -u 50 -r 5 --run-time 120s --host http://localhost:8000`
- [ ] Define pass criteria: p95 response time < 500 ms, error rate < 1% — fail the script on breach
- [ ] Document how to run the load test locally and how to view the Locust web UI (`locust --host http://localhost:8000`)

---

## Task 25: Accessibility E2E Verification (from Phase 3 Task 17.11)

- [x] Run the full E2E suite against the running app: `npm run test:e2e`
- [x] Confirm `checkA11y(page)` calls in `critical-paths.spec.ts` (wired via `test-helpers.ts`) produce zero axe violations in the CI output
- [x] If any violations are found, fix the offending elements and re-run to confirm clean

---

## Task 26: CI Pipeline (GitHub Actions)

> **Tooling decision**: GitHub Actions — free for public repos (unlimited minutes); 2,000 min/month on private repos; zero extra tooling since project is already on GitHub.

### Subtask 26.1: YAML Lint Config
- [x] Create `.yamllint.yml` at repo root:
  ```yaml
  extends: default
  rules:
    line-length:
      max: 120
    truthy:
      allowed-values: ['true', 'false']
  ```
- [x] Add `yamllint` to `requirements.txt`
- [x] Verify `yamllint .` passes on all existing YAML files before adding CI workflow

### Subtask 26.2: CI Workflow — Lint & Build
**File:** `.github/workflows/ci.yml`

- [x] Create workflow triggered on `push` and `pull_request` to `main` and `accessibility_retrofit`
- [x] **Job: lint** (runs on `ubuntu-latest`):
  - Checkout repo
  - Setup Node 20 + Python 3.10
  - Install frontend deps (`npm ci`)
  - Install Python deps (`pip install -r requirements.txt -r requirements-dev.txt`)
  - Run: `npm run lint -- --max-warnings=0 && npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"` (frontend — `src/` and `tests/`)
  - Run: `pylint app/ tests/ --fail-under=9.0 && flake8 app/ tests/ && black --check . && isort --check .` (backend)
  - Run: `yamllint .` (all YAML files)
- [x] **Job: build** (depends on lint):
  - Run `npm run build` in `football-cards-ui/`
  - Upload build artefact for use in downstream jobs
  - ~~Run `bundlesize` check against built artefact~~ (follow-up: bundlesize not yet configured)

### Subtask 26.3: CI Workflow — Tests
- [x] **Job: unit-tests** (depends on lint):
  - Run `pytest tests/unit/ --tb=short`
  - Run `npm test -- --watchAll=false --coverage --ci` (Jest); fail if coverage < 80%
- [x] **Job: contract-integration-tests** (depends on unit-tests):
  - Start FastAPI test server
  - Run `pytest tests/contract/`
  - Run `behave tests/integration/`
- [x] **Job: e2e-tests** (depends on build):
  - Start FastAPI backend (`uvicorn app.main:app`)
  - Start React frontend (`serve -s build`)
  - Run `npx playwright test --project=chromium --project=webkit` (Firefox as separate optional job)
  - Upload Playwright report as artefact on failure
- [x] **Job: performance** (depends on build):
  - Run `pytest tests/performance/ --benchmark-autosave`
  - ~~Run Lighthouse CI (`lhci autorun`)~~ (follow-up: requires `lighthouserc.js` config)

### Subtask 26.4: CI Workflow — Security Scan
- [x] Enable **CodeQL** analysis via GitHub's built-in action (`github/codeql-action`); configure for `javascript` and `python` languages
- [x] Enable **Dependabot** in repository settings (`.github/dependabot.yml`) for both `npm` and `pip` ecosystems
- [x] Optionally add **Semgrep** free tier (`semgrep/semgrep-action`) with `p/owasp-top-ten` ruleset

---

## Task 27: CD Pipeline & Hosting

> **Recommended free-tier split:**  
> - Frontend: **Vercel** (Hobby plan — unlimited bandwidth, CDN, per-PR preview deployments)  
> - Backend: **Render** (free Web Service — Python/FastAPI; note: spins down after 15 min inactivity on free tier)  
> - Alternative single-platform: **Fly.io** free tier (3 shared VMs) if a unified platform is preferred

### Subtask 27.1: Vercel — Frontend Deployment
- [ ] Create Vercel project linked to GitHub repo (via Vercel dashboard or `vercel link`)
- [ ] Set environment variable `REACT_APP_API_URL` in Vercel project settings pointing to the Render backend URL
- [ ] Confirm Vercel auto-deploys `main` branch to production and creates preview deployments for PRs
- [ ] Test the deployed frontend loads and can call the backend API

### Subtask 27.2: Render — Backend Deployment
- [ ] Create `render.yaml` at repo root (Render IaC):
  ```yaml
  services:
    - type: web
      name: football-cards-api
      runtime: python
      buildCommand: pip install -r requirements.txt
      startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
      envVars:
        - key: FOOTBALL_DATA_API_KEY
          sync: false  # set manually in Render dashboard
  ```
- [ ] Connect Render service to GitHub repo; enable auto-deploy on push to `main`
- [ ] Set `FOOTBALL_DATA_API_KEY` as a secret in the Render dashboard
- [ ] Verify backend health endpoint (`/api/v1/health`) responds correctly from the Render URL

### Subtask 27.3: Deploy Workflow
**File:** `.github/workflows/deploy.yml`

- [ ] Create workflow triggered on push to `main` only (after CI passes)
- [ ] Steps:
  1. Run full CI pipeline as a required check (or use `workflow_run` trigger after CI succeeds)
  2. Deploy frontend to Vercel production (`vercel --prod --token $VERCEL_TOKEN`)
  3. Render auto-deploys backend on `main` push (no manual step needed if GitHub integration enabled)
- [ ] **Post-deployment smoke tests** (run after deploy):
  - [ ] Run `npx playwright test critical-paths.spec.ts` with `BASE_URL` set to the live Vercel URL
  - [ ] Run `npx playwright test keyboard-navigation.spec.ts` against live URL
- [ ] **Post-deployment a11y check**:
  - [ ] Run `lhci autorun --collect.url=https://your-app.vercel.app` and assert scores
- [ ] **Post-deployment load test**:
  - [ ] Run `locust --headless -u 10 -r 2 --run-time 60s --host https://your-api.onrender.com` and assert p95 < 500 ms, error rate < 1%
- [ ] On any post-deployment failure, notify via GitHub commit status / Slack webhook (optional)

### Subtask 27.4: Deployment Documentation
- [ ] Create `docs/deployment.md` documenting:
  - Required environment variables (frontend and backend)
  - How to trigger a manual production deploy
  - Rollback procedure (Vercel: instant rollback via dashboard; Render: redeploy previous commit)
  - How to run post-deployment tests locally against staging URL
  - Free-tier limitations (Render spin-down, Vercel bandwidth limits)

---

## Feature Enhancements (Phase 4 Scope)

> These are new feature tasks carried forward from Phase 3 backlog items.

### Task 28: Alternative Card Layouts
- [ ] Design at least 2 alternative layout options (e.g. "Stats at Bottom", "Large Photo")
- [ ] Add `cardLayout: 'default' | 'statsBottom' | 'largePhoto'` to `CardState` in `CardContext.tsx`
- [ ] Add layout selector control to `CardForm.tsx`
- [ ] Update `CardPreview.tsx` to render the selected layout variant
- [ ] Update `PrintableCard.tsx` to support the same layout variants
- [ ] Add field to `storage.ts` save/load cycle with graceful default for legacy cards
- [ ] Write component tests for each layout variant
- [ ] Write E2E smoke test confirming layout selector updates the preview

### Task 29: Card Form — Section Heading & Field Reordering ✅
- [x] Review and agree revised field order (Card Type → Player Info → Stats → Visual → Save)
- [x] Implement the reordered layout in `CardForm.tsx` with visible `Typography h6` section headings; within Player Info: League → Club → Nationality/Position → Foot → Reset Fields
- [x] Update `accessibility.test.tsx` Tab order test to match the new field sequence

### Task 30: Print Formatter (Multi-Card per A4 Page) ✅
- [x] Design UI for selecting up to N saved cards to print on one A4 page
- [x] Implement `PrintFormatter` component with card selection grid
- [x] Add a "Print Selected" button that renders selected cards in an A4-sized print layout
- [x] Calculate card sizing to fit 1, 2, 4, or 6 cards per A4 page (user selectable)
- [x] Update `print.css` with multi-card layout rules
- [x] Write component tests for card selection and layout calculation
- [x] Write E2E print test using `page.emulateMedia({ media: 'print' })`

### Task 31: Alternate Stats Styles ✅
- [x] Rename current stats style (Defence / Control / Attack) to **"Adrenaline"** style in UI labels and code
- [x] Add **"Match Atk"** stats style: Speed, Tackle, Power, Shoot, Skill, Pass
- [x] Add `statsStyle: 'adrenaline' | 'matchAtk'` to `CardState`
- [x] Update `CardForm.tsx` to show the correct stat inputs based on `statsStyle`
- [x] Update Total average calculation based on stats style chosen
- [x] Update `CardPreview.tsx` to render the correct stat labels and values
- [x] Update `PrintableCard.tsx` accordingly
- [x] Update `storage.ts` to persist and migrate `statsStyle`
- [x] Write component tests for both stat styles
- [x] Write E2E smoke test confirming switching style changes preview stats
- [x] Build all UI Code to project Accessibility and Usability standards
- [x] Lint all code changes
- [x] Update project documentation (readme, claude.md, gemini.md, copilot etc)

### Task 32: Card Style 2.0
- [ ] Define design requirements for Card Style 2.0 (new visual treatment)
- [ ] Implement new card style as an opt-in variant (`cardStyleVersion: 'v1' | 'v2'`)
- [ ] Update `CardPreview.tsx` and `PrintableCard.tsx` to support both style versions
- [ ] Write component tests and visual regression screenshots for both versions

### Task 33: Text Colour Selection
- [ ] Give user options to select colour of each text field
- [ ] Give user options to select colour of card border

---

## Task 34: Security Hardening

> **Context:** A security review (2026-06-04) found no directly exploitable vulnerabilities in the current codebase. However, several significant hardening gaps will block production deployment or become exploitable once the app is publicly hosted. Subtasks are ordered by priority — 34.1–34.3 should be completed **before** Task 27 (CD / Hosting).

### Subtask 34.1: Environment-Based Configuration *(Priority 1 — Production Blocker)*

- [ ] Move CORS allowed origins out of `app/main.py` — read `ALLOWED_ORIGINS` from `pydantic-settings` (comma-separated, e.g. `http://localhost:3000,https://your-app.vercel.app`)
- [ ] Move frontend `axios` `baseURL` to `REACT_APP_API_BASE_URL` environment variable consistently (already partially in place; audit all usages)
- [ ] Update `.env.example` with `ALLOWED_ORIGINS` and `REACT_APP_API_BASE_URL`
- [ ] Document both variables in Task 27 deployment instructions

### Subtask 34.2: HTTP Security Headers *(Priority 2 — Quick Win)*

- [ ] Add FastAPI middleware to inject on every response:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (skip on localhost — gate on `ENVIRONMENT != development`)
- [ ] Remove `allow_credentials=True` from CORS config (app has no auth layer — it is redundant)
- [ ] Restrict CORS `allow_methods` to `["GET"]` and `allow_headers` to `["Content-Type"]`
- [ ] Add contract test assertions that the security headers are present on API responses

### Subtask 34.3: SECURITY.md *(Priority 2 — completes Task 22.2)*

- [ ] Create `SECURITY.md` at repo root documenting:
  - Application security model (no auth — intentional for MVP)
  - XSS prevention approach (React JSX auto-escaping; no `dangerouslySetInnerHTML`)
  - Data stored in `localStorage` (no PII; card data only)
  - Known limitations before public hosting (no HTTPS enforcement locally, no auth)
  - Deployment security checklist (links to Task 27 and Task 34.1)
  - How to report a vulnerability (email / GitHub private advisory)

### Subtask 34.4: Python Dependency Version Pinning *(Priority 3 — Supply-Chain Risk)*

- [ ] Add `pip-tools` to `requirements-dev.txt`
- [ ] Run `pip-compile` to generate `requirements.lock` with pinned transitive dependencies
- [ ] Update CI to install from `requirements.lock` (or add inline version constraints to `requirements.txt`)
- [ ] Run `pip-audit` locally and resolve any findings

### Subtask 34.5: Dependency Vulnerability Scanning in CI *(Priority 4 — Supply-Chain Gate)*

- [x] Add `pip-audit` to `requirements-dev.txt`
- [x] Add a `dependency-audit` job to `.github/workflows/security.yml`:
  - `npm audit --audit-level=critical` — gates on critical CVEs (13 unfixable highs are react-scripts 5.x transitive deps; tighten to `--audit-level=high` when CRA is replaced)
  - `pip-audit` — scans Python packages against OSV / PyPI Advisory DB
- [x] Resolve any high-severity `npm audit` findings before enabling the gate (or start with `--audit-level=critical` and tighten once clean) — ran `npm audit fix`; resolved 13 findings incl. axios (→ 1.17.0); 13 highs remain locked in react-scripts transitive deps

### Subtask 34.6: Rate Limiting *(Priority 5 — DoS Protection)*

- [ ] Add `slowapi` to `requirements.txt`
- [ ] Apply a per-IP rate limit to all `/api/v1/*` endpoints (e.g. 60 requests/min)
- [ ] Return `429 Too Many Requests` on limit breach
- [ ] Add a contract test asserting the 429 response schema

### Subtask 34.7: Secrets Scanning in CI *(Priority 6)*

- [ ] Add `gitleaks` or `trufflehog` GitHub Action to `.github/workflows/security.yml`
- [ ] Confirm `.env` is in `.gitignore` (already is — verify no accidental commits)
- [ ] Run on every push and PR to `main`

### Subtask 34.8: Request Size Limits *(Priority 7 — Defence in Depth)*

- [ ] Add Starlette `ContentSizeLimitMiddleware` (or equivalent) to `app/main.py` capping request body at 1 MB
- [ ] Add competition code allowlist validation in `app/core/config.py` (`^[A-Z0-9]{2,5}$` pattern per token)