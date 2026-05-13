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
- **Current Backlog / Todo List**: See [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md)

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
├── tests/                  # Test pyramid
│   ├── unit/              # pytest
│   ├── integration/       # Behave + TestClient
│   ├── contract/          # API contract tests
│   └── e2e/               # Playwright
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
- `GET /clubs` → Returns `Club[]` (id, name, league_id)
- `GET /nations` → Returns `Nation[]` (id, name)
- `GET /leagues` → Returns `League[]` (id, name)
- `GET /positions` → Returns `string[]`

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

### Testing Standards
- **Test Pyramid**: Unit → Contract → Integration → E2E
- **Minimum 80% code coverage** for backend
- **Contract tests**: All API endpoints validated against OpenAPI schema (Schemathesis)
- **Adjacent test files**: e.g., `Component.tsx` → `Component.test.tsx`
- **Property-based testing**: Contract tests auto-generate edge cases

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
pytest tests/contract/         # API contract tests (schema validation)
```bash
pytest tests/unit              # Unit tests
behave tests/integration       # BDD integration tests
npm test                       # Component & e2e (from football-cards-ui/)
```

---

## 📚 Reference Links

- **Detailed Conventions**: [GEMINI.md](GEMINI.md)
- **Requirements**: [docs/plans/REQUIREMENTS.md](docs/plans/REQUIREMENTS.md)
- **Architecture**: [docs/plans/ARCHITECTURAL_PLAN.md](docs/plans/ARCHITECTURAL_PLAN.md)
- **Frontend README**: [football-cards-ui/README.md](football-cards-ui/README.md)
- **Frontend Tasks**: [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md)

---

## 🔍 When Working in This Repo

- Check the appropriate **subdirectory instructions** when editing code (see `.github/instructions/`)
- Run formatters before committing: `black .`, `isort .`, `npm run lint`
- Add tests alongside new features
- Keep PRs focused on single features
