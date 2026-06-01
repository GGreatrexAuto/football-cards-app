---
name: football-cards-root
description: "Football Cards App - root-level context for GitHub Copilot with project overview, architecture, shared conventions"
---

# Football Cards App - GitHub Copilot Context

## 🎯 Project Overview

**Football Cards**: A web application for creating Ultimate team football/soccer style trading cards with customizable player stats, designs, and local browser storage.

- **Primary Languages**: Python (backend), TypeScript/React (frontend)
- **Backend**: FastAPI, async/await patterns
- **Frontend**: React 18+, TypeScript (strict mode), Material-UI
- **Database**: Browser Local Storage (MVP - no backend DB)
- **Key Docs**: See [GEMINI.md](GEMINI.md) for detailed conventions
- **Current Backlog / Todo List**: See [PHASE_4_TODO.md](PHASE_4_TODO.md)

---

## 🏗️ Architecture Overview

### Tech Stack
- **Backend**: FastAPI (Python 3.10+), Pydantic ORM models
- **Frontend**: React with TypeScript, Material-UI, Axios for API calls
- **Testing**: pytest (unit), Schemathesis (contract), behave (integration BDD), Playwright (e2e), Jest (component)
- **Code Quality**: Black, isort, Pylint, ESLint

### Project Structure
```
football-cards/
├── app/                    # FastAPI backend
├── football-cards-ui/      # React + TypeScript frontend
│   ├── tests/
│   │   └── e2e/           # Playwright
├── tests/                  # Test pyramid
│   ├── unit/              # pytest
│   ├── integration/       # Behave + TestClient
│   ├── contract/          # API contract tests
├── docs/plans/            # Architecture & requirements
└── .github/
    └── instructions/      # Context files per directory
```

---

## 🔄 API Contract & Data Flow

### RESTful API Pattern
- **Prefix**: `/api/v1`
- **Backend**: Exposes endpoints via FastAPI routers
- **Frontend**: Consumes via Axios (baseURL: `http://localhost:8000/api/v1`)
- **CORS**: Configured for localhost:3000 (React dev server)

### Common Endpoints
- `GET /clubs` → Returns `Club[]` (id, name, league_id) — aggregated from Football-Data.org competitions
- `GET /nations` → Returns `Nation[]` (id, name) — sourced from Football-Data.org areas
- `GET /leagues` → Returns `League[]` (id, name) — sourced from Football-Data.org competitions
- `GET /positions` → Returns `Position[]` (code, name) — static list (GK, DEF, MID, FWD); no external API

All endpoints fall back to built-in mock data when `FOOTBALL_DATA_API_KEY` is not set or the external API is unreachable.

### Frontend Storage
- Player cards stored in Browser Local Storage (serialized JSON)
- No backend persistence in MVP
- State managed via React Context API + custom hooks

---

## 📋 Shared Conventions

### Code Style & Formatting
- **Python**: Black (line-length: 88), isort (black profile), Pylint
- **TypeScript/React**: ESLint, strict mode enabled, no `any` types
- **General**: Type hints on all public functions/components

### Git & Commits
- Use semantic commit messages
- Keep commits atomic and focused
- Reference issue numbers when applicable

### Documentation
- Keep GEMINI.md in sync with actual patterns
- Update README.md when changing quick-start steps
- Add docstrings to public functions (Google-style for Python)

### Environment / API Key
- Backend reads `FOOTBALL_DATA_API_KEY` from `.env` (copy `.env.example` to get started)
- No key → mock data returned automatically; the app works without a key
- Configured competitions are in `FOOTBALL_DATA_COMPETITIONS` (comma-separated codes, e.g. `PL,PD,BL1,SA,FL1`)

### Testing Standards
- **Test Pyramid**: Unit → Contract → Integration → E2E
- **Minimum 80% code coverage** for backend
- **Contract tests**: All API endpoints validated against OpenAPI schema (Schemathesis)
- **Adjacent test files**: e.g., `Component.tsx` → `Component.test.tsx`
- **Property-based testing**: Contract tests auto-generate edge cases
- **E2E Testability**: Add `data-testid` and `aria-label` attributes to interactive elements (inputs, buttons, selects) for reliable Playwright selectors
- **E2E Imports**: Import `{ expect, test }` from `./base/test-base` in E2E spec files for consistent test utilities

### Accessibility Standards
- **Every new interactive element** (button, input, select, toggle) must have `aria-label` or an associated `<label>`
- **Required fields**: `aria-required="true"`; on validation failure set `aria-invalid="true"` and `aria-describedby` pointing to the error element
- **Notifications**: error/success alerts use `role="alert"`; loading regions use `role="status"` and `aria-live="polite"`
- **Grouped inputs**: wrap related inputs in `<fieldset>` with `<legend>` (e.g. stat sliders)
- **Images**: descriptive `alt` text on meaningful images; `alt=""` on decorative images
- **Focus management**: dialogs trap focus on open; restore focus to the trigger element on close
- **Component tests**: every new `*.test.tsx` must include `expect(await axe(container)).toHaveNoViolations()` (jest-axe)
- **E2E accessibility**: run `checkA11y(page)` from `@axe-core/playwright` at key navigation points in E2E specs

---

## 🚀 Quick Start Commands

**Backend**:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend**:
```bash
cd football-cards-ui
npm start  # Runs on localhost:3000
```

**Tests**:
```bash
pytest tests/contract/         # API contract tests (schema validation)
pytest tests/unit              # Unit tests
behave tests/integration       # BDD integration tests
cd football-cards-ui && npm run test:e2e  # E2E tests
```

---

## 📚 Reference Links

- **Detailed Conventions**: [GEMINI.md](GEMINI.md)
- **Requirements**: [docs/plans/REQUIREMENTS.md](docs/plans/REQUIREMENTS.md)
- **Architecture**: [docs/plans/ARCHITECTURAL_PLAN.md](docs/plans/ARCHITECTURAL_PLAN.md)
- **Frontend README**: [football-cards-ui/README.md](football-cards-ui/README.md)
- **Frontend Tasks**: [PHASE_4_TODO.md](PHASE_4_TODO.md)

---

## 🔍 When Working in This Repo

- Check the appropriate **subdirectory instructions** when editing code (see `.github/instructions/`)
- Run formatters before committing: `black .`, `isort .`, `npm run lint`
- Add tests alongside new features
- Keep PRs focused on single features
- Keep PHASE_4_TODO.md updated with new tasks and progress
- New UI components: verify accessibility requirements (ARIA attributes, jest-axe check, keyboard navigability) before marking tasks complete
