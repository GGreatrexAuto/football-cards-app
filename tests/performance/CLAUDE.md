# Performance Tests — Claude Code Context

Applies to all test code under `tests/performance/` — backend endpoint benchmarks
(`backend/`) and the frontend Lighthouse audit config (`ui/`).
For the Playwright Web Vitals spec (LCP/FCP/CLS thresholds) see
`football-cards-ui/tests/e2e/performance.spec.ts`, documented in
`football-cards-ui/tests/e2e/CLAUDE.md`.

Performance tests run **separately** from the main suite — none are collected by
`pytest tests/`.

---

## Backend Benchmarks (`backend/unit_benchmark/`)

pytest-benchmark tests that start a **real uvicorn server** (port 8001) and measure actual HTTP latency. Always run against mock data (no `FOOTBALL_DATA_API_KEY` required). Run **separately** from the main test suite — they are not included in `pytest tests/`.

- Marker: `@pytest.mark.performance`
- Fixture: session-scoped `live_server` patches `football_api.settings` to force mock data, starts uvicorn in a background thread, and polls `/api/v1/health` before yielding
- Assertion: `benchmark.stats['mean'] < 0.05` (50 ms floor; actual mean ~1–2 ms with mock data)
- Baseline: stored in `.benchmarks/` (committed to repo)

```bash
pytest tests/performance/backend/unit_benchmark/ -v                                    # run benchmarks
pytest tests/performance/backend/unit_benchmark/ --benchmark-autosave                  # save/update baseline
# CI regression check — fail if mean regresses > 20%:
pytest tests/performance/backend/unit_benchmark/ --benchmark-autosave --benchmark-compare --benchmark-compare-fail=mean:+20%
```

CI runs these in the `Performance Tests - Backend - Pytest` job.

---

## Backend Load Tests (`backend/load/`)

Locust load tests that hit the four main API endpoints concurrently. Run against mock data (no `FOOTBALL_DATA_API_KEY` required). Run **separately** from the main test suite.

- Entry point: `tests/performance/backend/load/locustfile.py`
- Task set: `CardApiUser` — weighted GET requests to `/api/v1/clubs`, `/nations`, `/leagues`, `/positions`
- Pass criteria: p95 < 50 ms, error rate < 1%

```bash
# Full flow (starts backend, runs test, cleans up):
bash scripts/load-test.sh          # Bash
.\scripts\load-test.ps1            # PowerShell

# Manual run (backend must already be running on :8000 in mock mode):
locust --headless -u 50 -r 5 --run-time 120s \
    --host http://localhost:8000 \
    -f tests/performance/backend/load/locustfile.py

# Interactive web UI:
locust --host http://localhost:8000 -f tests/performance/backend/load/locustfile.py
# Then open http://localhost:8089
```

CI runs these in the `Performance Tests - Backend - Locust` job.

---

## Frontend Lighthouse Audit (`ui/`)

`ui/lighthouserc.yml` is the Lighthouse CI (`@lhci/cli`) config. It asserts
**category scores** (0–1 scale in the config) at **error** level:

| Category | Minimum score |
|---|---|
| Performance | ≥ 70 (baseline 72–74; raise to 80 after Task 23.3 bundle splitting) |
| Accessibility | ≥ 90 (baseline 95) |
| Best Practices | ≥ 85 (baseline 100) |

- Lighthouse runs **3 times**; LHCI's default *optimistic* aggregation compares the
  best run against each threshold, absorbing runner variance
- Reports upload to `temporary-public-storage` — public URLs (valid ~7 days) are
  printed at the end of the run / in the CI job log
- `@lhci/cli` is a dev dependency of `football-cards-ui/` (the only `node_modules`
  in the repo); the `npm run lighthouse` script points at this config via `--config`

CI runs the audit in the `Performance Tests - Frontend - Lighthouse CI` job (after
`E2E Tests`): it downloads the `react-build` artefact, starts the FastAPI backend on
:8000 (mock data) and `npx serve` on :3000, then runs `npm run lighthouse` — the
backend must be live so failed API calls don't log console errors against the Best
Practices score.

### Running locally

Always audit the **production build** — dev-server (`npm start`) scores are not
representative:

```bash
cd football-cards-ui && npm run build
npx serve -s dist --listen 3000        # terminal 1 — serve the build
uvicorn app.main:app --port 8000       # terminal 2 — backend (repo root, .venv)
npm run lighthouse                     # terminal 3 — collect + assert + upload
```

Collect-only mode (no assertions, no upload; reports written to
`football-cards-ui/.lighthouseci/`, which is gitignored):

```bash
npx lhci collect --url=http://localhost:3000
npx lhci open                          # open the report in a browser
```

The pre-commit hook has an optional Lighthouse stage, disabled by default
(`RUN_LIGHTHOUSE=true git commit ...` to enable) — it audits the dev server via
`scripts/ensure-servers.sh`, so expect lower performance scores than CI.

### Changing thresholds

Edit `ui/lighthouserc.yml`. Keep assertions at **error** level; if a category
flakes on CI runners, lower only that category's `minScore` rather than
downgrading to `warn`.
