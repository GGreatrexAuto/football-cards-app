# Repository-Level Gemini Configuration

This file is for project-specific instructions and preferences for the Gemini CLI.

## Project Overview

*   **Name**: Football Cards App
*   **Description**: A web application for creating Ultimate team football/soccer style trading cards. See `REQUIREMENTS.md` for detailed functional requirements.
*   **Primary Language**: 
        - Python backend
        - React (TypeScript)

## Key Libraries & Frameworks

*   **Backend**: FastAPI
*   **Database**: None for MVP (using browser Local Storage).
*   **Frontend**: React, Material-UI

## Architectural Patterns

*   **Structure**: The project follows a standard Model-View-Controller (MVC) pattern.
*   **API**: The backend exposes a RESTful API for the frontend to consume.
*   **Frontend**: The frontend will be a single-page application (SPA) built with React, consuming the backend's RESTful API.
*   **Code Style**: Adhere to the existing code style. Use `black`, `flake8`, `pylint` and `isort` for formatting.

## Testing Strategy
All tests have an appropriate place on the test pyramid, tests should be shifted left wherever possible.

*   **Unit Tests**: Use `pytest` for unit tests. Test files are located in the `tests/unit` directory and should mirror the structure of the application code.
*   **Contract Tests**: API contracts should be tested using schemathesis `tests/contract`
*   **Integration Tests**: Integration tests are written with `behave` and are located in `tests/integration`.
*   **E2E Tests**: Front end app tests should implement `playwright` and are located in `football-cards-ui/tests/e2e` 
*   **Coverage Target**: Minimum 80% globally
*   **CI/CD**: To be decided, but we would be looking for a low cost / free option

## Project Structure

```
football-cards/
├── app/                    # Backend (FastAPI)
├── football-cards-ui/      # Frontend (React + TypeScript)
│   ├── tests/
│   │   └── e2e/
├── tests/                  # Test files
│   ├── unit/
│   ├── contract/
│   └── integration/
├── docs/                   # Documentation
│   └── plans/
├── README.md               # Project overview & quick start
├── GEMINI.md               # This file
├── PHASE_3_FRONTEND_TODO.md # Frontend task checklist
├── requirements.txt        # Python dependencies
└── pyproject.toml          # Python config (black, isort, pytest)
```

## Frontend Code Conventions

### TypeScript
- **Strict Mode**: Enabled in `tsconfig.json` - all type checking features on
- **No `any` types**: Use explicit types or generics instead
- **File naming**: `.tsx` for React components, `.ts` for utilities
- **Type definitions**: Use interfaces for object shapes, types for unions/primitives

### React Components
- **Naming**: PascalCase for components (e.g., `CardForm.tsx`)
- **Structure**: One component per file (unless composing small related components)
- **Props interface**: Define `interface ComponentProps { ... }` before component
- **Exports**: Use named exports for components and utilities
- **Hooks**: Custom hooks start with `use` prefix (e.g., `useCard()`)

### File Organization
- **Components**: `src/components/[ComponentName]/[ComponentName].tsx` or `src/components/[ComponentName].tsx`
- **Tests**: Adjacent to source file: `ComponentName.test.tsx`
- **Services**: `src/services/[service].ts` (api.ts, storage.ts)
- **Context**: `src/context/[ContextName].tsx`
- **Types**: `src/types/[TypeName].ts` or inline in component file
- **Styles**: Scoped CSS alongside components or in `src/styles/`

### State Management
- **Global state**: Use React Context API (CardContext) for shared card state
- **Local state**: Use `useState` for component-specific state
- **Derived state**: Use computed properties or `useMemo` to avoid recalculations
- **Pattern**: Context + Custom Hook (`useCard()`) for clean consuming

### Material-UI Usage
- **Components**: Import from `@mui/material`
- **Icons**: Import from `@mui/icons-material`
- **Styling**: Use `sx` prop for component-level styles or emotion/styled
- **Theme**: Centralized in `src/theme.ts` - customize there, not inline

## Backend Code Conventions

### Python Code Style
- **Formatter**: Use `black` (line length: 88) - run before commit
- **Import sorting**: Use `isort` with black profile
- **Linting**: Use `flake8` and `pylint` - fix all warnings
- **Type hints**: Use PEP 484 type hints on all function signatures
- **Docstrings**: Use Google-style docstrings for public functions

### FastAPI Structure
- **Endpoints**: Define in `app/api/endpoints/` with clear route grouping
- **Models**: Pydantic models in `app/api/models.py` for request/response schemas
- **Services**: Business logic in `app/services/`
- **Config**: Environment & app config in `app/core/config.py`

### File Naming
- **Files**: snake_case (e.g., `football_api.py`)
- **Classes**: PascalCase (e.g., `FootballAPI`, `CardModel`)
- **Functions**: snake_case (e.g., `get_clubs()`)
- **Constants**: UPPER_SNAKE_CASE

## Git Workflow

### Branching
- **Main branch**: Always stable, deployable state
- **Branch naming**: `feature/name`, `bugfix/name`, `hotfix/name`
- **Example**: `feature/add-card-export`, `bugfix/fix-stats-calculation`

### Commits
- **Message format**: Use conventional commits
  - `feat: add card export functionality`
  - `fix: correct rating calculation formula`
  - `docs: update setup instructions`
  - `test: add E2E tests for card creation`
  - `refactor: extract stat validation logic`
- **Frequency**: Commit logically related changes together, not too granular
- **Before committing**: Run tests, linting, and type checks locally

### PRs & Code Review
- **PR template**: Describe what changed and why
- **Tests**: All new code must have tests
- **Coverage**: Don't decrease overall coverage
- **Linting**: Code must pass all linters before merging
- **Review**: At least one approval before merging

## Environment Setup

### Required Versions
- **Node.js**: v16+
- **Python**: v3.10+
- **npm**: v8+

### Environment Variables
- **Backend**: Copy `.env.example` → `.env` and fill in values:
  - `FOOTBALL_DATA_API_KEY` — free key from https://www.football-data.org/client/register
  - `FOOTBALL_DATA_API_URL` — defaults to `https://api.football-data.org/v4` (no change needed)
  - `FOOTBALL_DATA_COMPETITIONS` — comma-separated competition codes, e.g. `PL,PD,BL1,SA,FL1`
  - Without a key the backend automatically serves built-in mock data — the app works without one.
- **Frontend**: Create `.env.local` for development
  - `REACT_APP_API_URL`: Backend URL (default: http://localhost:8000)

### Development Commands
```bash
# Backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload  # Start server
pytest tests/                      # Run all tests
black app tests                    # Format code
flake8 app tests                   # Lint code
isort app tests                    # Sort imports

# Frontend
npm start                          # Dev server
npm test                           # Unit tests
npm run test:e2e                   # E2E tests
npm run lint                       # ESLint
npm run format                     # Prettier
```

## API Conventions

### Endpoint Design
- **Base URL**: `http://localhost:8000/api/v1`
- **Routes**: `/api/v1/clubs`, `/api/v1/nations`, `/api/v1/leagues`, `/api/v1/positions`
- **Methods**: GET for fetching, POST for creating, PUT for updates, DELETE for removal
- **Status codes**: 200 (success), 201 (created), 400 (bad request), 404 (not found), 500 (error)

### Response Format
```json
{
  "status": "success|error",
  "data": {},
  "error": null  // Null if successful
}
```

### Request/Response Validation
- Backend: Use Pydantic models for automatic validation
- Frontend: Validate input before sending, handle errors gracefully

## Documentation Standards

### Code Comments
- Add comments for *why*, not *what* (code shows what)
- Document complex algorithms or non-obvious logic
- Use JSDoc for TypeScript functions, Google-style for Python

### README Files
- Each major directory should have a README
- Include setup, key files, and how to use
- Keep in sync with actual code structure

### Keep Docs Updated
- Update docs when changing architecture or APIs
- Document breaking changes
- Add examples for new patterns

## Common Tasks

### Adding a New Component
1. Create `src/components/ComponentName.tsx`
2. Define `ComponentProps` interface
3. Implement component with TypeScript types
4. Create `ComponentName.test.tsx` with tests
5. Export from component file or index
6. Use in parent component

### Adding a New API Endpoint
1. Define Pydantic model in `app/api/models.py`
2. Create route in `app/api/endpoints/[route].py`
3. Implement service logic in `app/services/`
4. Add tests in `tests/contract/` and `tests/unit/`
5. Document in API_CONTRACT.md

### Running Tests
```bash
# All tests
npm test                    # Frontend
pytest tests/               # Backend

# Specific test file
npm test CardForm.test.tsx
pytest tests/unit/test_football_api.py

# With coverage
npm run test:coverage
pytest tests/ --cov=app
```

### Debugging
- **Frontend**: Chrome DevTools, React DevTools extension
- **Backend**: VS Code debugger, `print()` statements, logging
- **Storage**: Browser console: `localStorage.getItem('saved_cards')`

## Known Issues & Troubleshooting

### Frontend
- **API not responding**: Ensure backend is running on port 8000
- **Storage full**: Clear localStorage if card saving fails
- **Images not loading**: Check CORS and image URL validity

### Backend
- **Port in use**: Change port in config or kill process on 8000
- **Import errors**: Ensure virtual environment is activated and packages installed

## Phase Status
- **Phase 1**: Planning & Requirements ✅
- **Phase 2**: Backend Implementation ✅ (live Football-Data.org integration with mock fallback)
- **Phase 3**: Frontend Implementation ⏳ (80% complete)
- **Phase 4**: Testing & Deployment ⏳

See `PHASE_3_FRONTEND_TODO.md` for frontend task details.

## Useful Links

- **Project README**: `README.md`
- **Requirements**: `docs/plans/REQUIREMENTS.md`
- **P3 plan**: `PHASE_3_FRONTEND_TODO.md`
- **Architecture**: `docs/plans/ARCHITECTURAL_PLAN.md`
- **Frontend Guide**: `football-cards-ui/README.md`
- **Test Plan**: `docs/plans/testplan.md`