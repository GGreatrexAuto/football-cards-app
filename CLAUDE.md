# Football Cards — Claude Code Context

## Project Overview

Web app for creating Ultimate-team-style football trading cards with customisable player stats, designs, and local browser storage.

- **Backend**: FastAPI (Python 3.10+), async/await, Pydantic
- **Frontend**: React 19 + TypeScript (strict mode), Material-UI v7, Axios
- **Data**: Browser localStorage (MVP — no backend DB)
- **External API**: Football-Data.org (clubs, nations, leagues, positions)
- **Current phase**: Phase 3 — Frontend (~80% complete). See [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md) for the active backlog.

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
│   └── integration/
└── docs/plans/                 # Architecture & requirements docs
```

## API Contract

- **Base URL**: `http://localhost:8000/api/v1`
- **Endpoints**: `GET /clubs`, `GET /nations`, `GET /leagues`
- **CORS**: configured for `localhost:3000` (React dev server)
- Frontend state managed via React Context API; cards persisted to `localStorage`
- **External API**: Football-Data.org v4 — set `FOOTBALL_DATA_API_KEY` in `.env` (copy `.env.example`). Without a key the backend returns built-in mock data automatically.

## Quick Start

```bash
# Backend (from repo root, .venv activated)
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

# Frontend
cd football-cards-ui
npm test                       # Jest component tests (watch mode)
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
- Run before committing: `black . && isort . && pylint app/`

### TypeScript/React (frontend)
- **Strict mode ON** — no `any` types, everything explicitly typed
- **Linter/formatter**: ESLint + Prettier (single quotes, trailing commas)
- Run before committing: `npm run lint && npm run format`

### Testing
- Test pyramid: Unit → Contract → Integration → E2E
- Minimum **80% coverage** globally
- Add `data-testid` and `aria-label` attributes to interactive elements for Playwright selectors

## Key Docs
- Requirements: [docs/plans/REQUIREMENTS.md](docs/plans/REQUIREMENTS.md)
- Architecture: [docs/plans/ARCHITECTURAL_PLAN.md](docs/plans/ARCHITECTURAL_PLAN.md)
- Test plan: [docs/plans/testplan.md](docs/plans/testplan.md)
