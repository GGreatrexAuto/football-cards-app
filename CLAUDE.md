# Football Cards — Claude Code Context

## Project Overview

Web app for creating Ultimate-team-style football trading cards with customisable player stats, designs, and local browser storage.

- **Backend**: FastAPI (Python 3.10+), async/await, Pydantic
- **Frontend**: React 19 + TypeScript (strict mode), Material-UI v7, Axios
- **Data**: Browser localStorage (MVP — no backend DB)
- **External API**: Football-Data.org (clubs, nations, leagues, positions)
- **Current phase**: Phase 4 — Hardening, Features, Performance & DevOps. See [PHASE_4_TODO.md](PHASE_4_TODO.md) for the active backlog.

## Project Structure

```
football-cards/
├── app/                        # FastAPI backend (see app/CLAUDE.md)
│   ├── main.py
│   ├── api/endpoints/proxy.py
│   ├── api/models.py
│   ├── services/
│   └── core/config.py
├── football-cards-ui/          # React + TypeScript frontend (see football-cards-ui/CLAUDE.md)
│   ├── src/
│   └── tests/e2e/              # Playwright (see football-cards-ui/tests/e2e/CLAUDE.md)
├── tests/                      # Backend tests (see tests/CLAUDE.md)
│   ├── unit/
│   ├── contract/
│   ├── integration/
│   └── performance/            # see tests/performance/CLAUDE.md
│       ├── backend/            # pytest-benchmark endpoint benchmarks
│       └── ui/                 # Lighthouse CI config (lighthouserc.yml)
├── scripts/                    # Developer convenience scripts
│   ├── start.sh                # Start both servers (bash)
│   └── start.ps1               # Start both servers (PowerShell)
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI pipeline (lint → build/unit → contract/e2e/perf)
│   │   └── security.yml        # CodeQL + Semgrep (push to main + weekly)
│   ├── dependabot.yml          # Automated dependency updates (npm + pip, weekly)
│   └── instructions/           # AI coding assistant context files
├── .yamllint.yml               # YAML linting config (extends default, max 120)
├── requirements-dev.txt        # Dev-only extras (pytest-cov, coverage)
└── docs/plans/                 # Architecture & requirements docs
```

## API Contract

- **Base URL**: `http://localhost:8000/api/v1`
- **Endpoints**: `GET /clubs`, `GET /nations`, `GET /leagues`, `GET /positions`
- **CORS**: configured for `localhost:3000` (React dev server)
- Frontend state managed via React Context API; cards persisted to `localStorage`
- **External API**: Football-Data.org v4 — set `FOOTBALL_DATA_API_KEY` in `.env` (copy `.env.example`). Without a key the backend returns built-in mock data automatically.
- **`CardState`** includes `statsStyle: 'adrenaline' | 'matchAtk'` (Task 31). Adrenaline = DEF/CTRL/ATT (average of 3); Match Atk = SPD/TAC/PWR/SHT/SKL/PAS (weighted average, PWR and SHT count double). Legacy cards without `statsStyle` default to `'adrenaline'` on load.

## Quick Start

```bash
# Start both servers at once
bash scripts/start.sh        # Bash (Git Bash / WSL)
.\scripts\start.ps1          # PowerShell (opens separate windows)

# Or individually — backend (from repo root, .venv activated):
# Optional: copy .env.example → .env and set FOOTBALL_DATA_API_KEY for live data
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (separate terminal)
cd football-cards-ui
npm start          # http://localhost:3000
```

## Running Tests

```bash
# Backend — run in order
pytest tests/unit/             # unit tests
pytest tests/contract/         # Schemathesis API contract tests
behave tests/integration       # BDD integration tests
pytest tests/ --cov=app        # full suite with coverage

# Backend performance benchmarks (run separately — starts a real uvicorn server on port 8001)
pytest tests/performance/backend/ -v
pytest tests/performance/backend/ --benchmark-autosave                                                         # save/update baseline
pytest tests/performance/backend/ --benchmark-autosave --benchmark-compare --benchmark-compare-fail=mean:+20%  # CI regression check

# Frontend
cd football-cards-ui
npm test                       # Jest component tests (watch mode)
npm test -- --watchAll=false   # single run (CI)
npm run test:coverage          # single run + coverage report (≥80% enforced)
npm run test:e2e               # Playwright E2E (requires both servers running)
```

## Shared Conventions

### Commits
Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`. Keep commits atomic.

### Python (backend)
- **Formatter**: Black (line-length 88) + isort (black profile)
- **Linter**: Pylint — fix all warnings before commit
- **Types**: PEP 484 type hints on all public functions
- **Docstrings**: Google-style on public functions
- Run before committing: `black . && isort . && pylint app/ tests/ && flake8 app/ tests/`

### TypeScript/React (frontend)
- **Strict mode ON** — no `any` types, everything explicitly typed
- **Linter/formatter**: ESLint (+ `eslint-plugin-jsx-a11y`) + Prettier (single quotes, trailing commas); covers `src/` and `tests/e2e/`
- Run before committing: `npm run lint && npm run format`

### Testing
- Test pyramid: Unit → Contract → Integration → E2E
- Minimum **80% coverage** globally
- Add `data-testid` and `aria-label` attributes to interactive elements for Playwright selectors

### Accessibility
Every new UI feature must satisfy these requirements before merging:

- **Interactive elements**: every button, input, select, and toggle must have an `aria-label` or an associated `<label>` element
- **Required fields**: add `aria-required="true"`; when validation fails, set `aria-invalid="true"` and link to the error message via `aria-describedby`
- **Notifications**: error/success Snackbars must have `role="alert"` so screen readers announce them immediately
- **Loading states**: async loading regions must have `role="status"` and `aria-live="polite"`
- **Grouped inputs**: related inputs (e.g. stats sliders) must be wrapped in `<fieldset>` with a `<legend>`
- **Images**: meaningful images need descriptive `alt` text; decorative images use `alt=""`
- **Component tests**: every new `*.test.tsx` file must include at least one `expect(await axe(container)).toHaveNoViolations()` assertion using jest-axe
- **Focus management**: dialogs must trap focus on open and restore it to the trigger element on close

See `.github/instructions/ui-testing.instructions.md` for jest-axe patterns and ARIA assertion examples.

## Key Docs
- Requirements: [docs/plans/REQUIREMENTS.md](docs/plans/REQUIREMENTS.md)
- Architecture: [docs/plans/ARCHITECTURAL_PLAN.md](docs/plans/ARCHITECTURAL_PLAN.md)
- Test plan: [docs/plans/testplan.md](docs/plans/testplan.md)
