# Football Cards Application 🏆

A web application for creating Ultimate team football/soccer style trading cards with player stats, customizable designs, and local browser storage.

## 📋 Quick Links

- **Project Overview**: See [GEMINI.md](GEMINI.md)
- **Requirements**: See [docs/plans/REQUIREMENTS.md](docs/plans/REQUIREMENTS.md)
- **Architecture**: See [docs/plans/ARCHITECTURAL_PLAN.md](docs/plans/ARCHITECTURAL_PLAN.md)
- **Frontend Development**: See [football-cards-ui/README.md](football-cards-ui/README.md)
- **Frontend Tasks**: See [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+) and npm
- **Python** (v3.10+) and pip/conda
- **Git**

### First-time setup

```bash
# Create virtual environment and install dependencies
python -m venv .venv
source .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1

pip install -r requirements.txt

cd football-cards-ui && npm install && cd ..

# Configure Football-Data.org API key (optional — falls back to mock data without it)
cp .env.example .env   # then set FOOTBALL_DATA_API_KEY to your free key
                       # Register at https://www.football-data.org/client/register
```

### Starting both servers

```bash
# Bash (Git Bash / WSL)
bash scripts/start.sh

# PowerShell
.\scripts\start.ps1
```

Both scripts start the backend (`http://localhost:8000`) and frontend (`http://localhost:3000`).  
The bash script runs both in the same terminal — Ctrl+C stops both cleanly.  
The PowerShell script opens each server in its own terminal window.

### Starting servers individually

```bash
# Backend
source .venv/Scripts/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd football-cards-ui && npm start
```

---

## 📁 Project Structure

```
football-cards/
├── app/                          # Backend (FastAPI)
│   ├── main.py                   # Server entry point
│   ├── api/
│   │   ├── endpoints/            # API routes
│   │   ├── models.py             # Pydantic models
│   │   └── proxy.py              # Football API proxy
│   ├── core/
│   │   └── config.py             # Configuration
│   └── services/
│       └── football_api.py       # Football API integration
│
├── football-cards-ui/            # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── context/              # State management (CardContext)
│   │   ├── services/             # API & storage services
│   │   ├── styles/               # CSS and themes
│   │   └── types/                # TypeScript definitions
│   ├── package.json
│   └── README.md                 # Frontend-specific docs
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests (BDD)
│   ├── contract/                 # API contract tests
│   └── performance/
│       └── backend/              # pytest-benchmark endpoint benchmarks
│
├── docs/                         # Documentation
│   └── plans/                    # Project plans
│       ├── REQUIREMENTS.md
│       ├── ARCHITECTURAL_PLAN.md
│       ├── backend-plan.md
│       ├── frontend-plan.md
│       ├── testplan.md
│       └── WIREFRAMES.md
│
├── scripts/                      # Developer convenience scripts
│   ├── start.sh                  # Start both servers (bash)
│   └── start.ps1                 # Start both servers (PowerShell)
│
├── GEMINI.md                     # Project configuration & conventions
├── PHASE_3_FRONTEND_TODO.md      # Frontend implementation tasks
├── pyproject.toml                # Python config (black, isort, pytest)
└── requirements.txt              # Python dependencies
```

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- FastAPI (REST API)
- Python 3.10+
- External: Football-Data.org API (clubs, nations, leagues)

**Frontend:**
- React 19 + TypeScript
- Material-UI (component library)
- Local Storage (data persistence)
- Playwright (E2E testing)

### Key Features

1. **Card Creation**: Form-based UI to create player cards with stats
2. **Font Customization**: Per-field font selection for player name, club, nationality, and stats (8 Google Fonts)
3. **State Management**: React Context API for card state
4. **Data Persistence**: Browser Local Storage (no database for MVP)
5. **Print Support**: Browser print-to-PDF functionality with selected fonts applied
6. **Responsive Design**: Mobile-friendly UI with Material-UI

---

## 📚 Development Workflow

### Running Tests

```bash
# Backend tests (run in order)
pytest tests/unit/              # unit tests
pytest tests/contract/          # API contract tests
behave tests/integration        # BDD integration tests
pytest tests/ --cov=app         # full suite + coverage

# Backend performance benchmarks (run separately — starts a real server on port 8001)
pytest tests/performance/backend/ -v
pytest tests/performance/backend/ --benchmark-autosave                                                         # save/update baseline
pytest tests/performance/backend/ --benchmark-autosave --benchmark-compare --benchmark-compare-fail=mean:+20%  # CI regression check

# Frontend tests (unit/component)
cd football-cards-ui
npm test

# Frontend E2E tests
npm run test:e2e

# Coverage reports
npm run test:coverage
```

### Code Standards

- **Backend**: Use `black`, `flake8`, `pylint`, `isort`
- **Frontend**: Use ESLint, Prettier, TypeScript strict mode
- **Documentation**: Keep docs in sync with code changes

### Git Workflow

1. Branch from `main`
2. Make changes
3. Run tests locally
4. Commit with meaningful messages
5. Submit PR for review

---

## 📖 Documentation Map

| Document | Purpose | Audience |
|----------|---------|----------|
| [GEMINI.md](GEMINI.md) | Project overview, arch patterns, conventions | All |
| [docs/plans/REQUIREMENTS.md](docs/plans/REQUIREMENTS.md) | Functional requirements & acceptance criteria | All |
| [docs/plans/ARCHITECTURAL_PLAN.md](docs/plans/ARCHITECTURAL_PLAN.md) | High-level architecture & design decisions | Developers |
| [docs/plans/backend-plan.md](docs/plans/backend-plan.md) | Backend implementation plan | Backend devs |
| [docs/plans/frontend-plan.md](docs/plans/frontend-plan.md) | Frontend implementation plan | Frontend devs |
| [docs/plans/testplan.md](docs/plans/testplan.md) | Testing strategy & coverage targets | QA/Devs |
| [football-cards-ui/README.md](football-cards-ui/README.md) | Frontend setup & development guide | Frontend devs |
| [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md) | Frontend task checklist | Frontend devs |

---

## 🔌 API Integration

### Backend Endpoints

The backend proxies data from the free **Football-Data.org API**:

- `GET /api/v1/clubs` - List all clubs (aggregated from configured competitions)
- `GET /api/v1/nations` - List all nationalities (from Football-Data.org areas)
- `GET /api/v1/leagues` - List all leagues/competitions

When `FOOTBALL_DATA_API_KEY` is not set, all endpoints return built-in mock data so the app works out of the box without an API key.

### Frontend API Service

See [football-cards-ui/src/services/api.ts](football-cards-ui/src/services/api.ts) for the axios-based client.

---

## 💾 Local Storage Schema

Saved cards are stored in browser Local Storage under key `football-cards`:

```typescript
interface Card {
  cardId: string;                // UUID
  playerName: string;
  club: string;
  nationality: string;
  league: string;
  position: string;
  preferredFoot: "Left" | "Right" | "Both";
  defence: number;               // 0-100
  control: number;               // 0-100
  attack: number;                // 0-100
  rating: number;                // Average of defence/control/attack (read-only)
  playerPhoto: string | null;    // Data URL or image URL
  cardBackground: string | null; // Selected background URL
  textFonts: {
    playerName: string;          // Font for player name (default: "Playfair Display")
    clubText: string;            // Font for club/league/position (default: "Roboto")
    countryText: string;         // Font for nationality (default: "Roboto")
    statsText: string;           // Font for stat values and labels (default: "Roboto")
  };
}
```

Cards without `textFonts` (saved before font customization was introduced) are transparently upgraded to use the defaults on load.

---

## 🧪 Testing Strategy

**Test Pyramid:**
- ✅ **Unit Tests**: Component, hook, service logic (264 Jest tests, 18 test suites; ≥90% coverage)
- ✅ **Integration Tests**: Component workflows, BDD scenarios
- ✅ **E2E Tests**: Full user journeys (Playwright — Chromium + WebKit)
- ✅ **Contract Tests**: API request/response validation (Schemathesis)
- ✅ **Performance Tests**: Backend benchmarks (pytest-benchmark)

Target coverage: **80%+ globally** (achieved: ~90% statements)

---

## 📦 Dependencies

### Core Dependencies (Frontend)

```
react@19.2.4
react-dom@19.2.4
@mui/material@7.3.9
axios@1.13.6
typescript@5.x
```

See [football-cards-ui/package.json](football-cards-ui/package.json) for complete list.

### Core Dependencies (Backend)

```
fastapi
uvicorn
httpx
pydantic-settings
```

See [requirements.txt](requirements.txt) for complete list.

---

## 🚧 Current Phase: Phase 4 — Hardening, Features, Performance & DevOps

**Status**: In progress

- ✅ Project scaffolding & setup
- ✅ UI components & state management
- ✅ Unit, integration, contract & E2E tests (≥90% coverage)
- ✅ Alternate stats styles (Adrenaline / Match Atk)
- ✅ Print formatter (multi-card A4 layout)
- ✅ Alternative card form layout & section headings
- ⏳ CI pipeline (GitHub Actions)
- ⏳ CD pipeline & hosting (Vercel/Render)
- ⏳ Performance optimisation (lazy loading, bundle analysis)

See [PHASE_4_TODO.md](PHASE_4_TODO.md) for detailed task breakdown.

---

## 🔐 Security Considerations

- Input validation: Player names, image URLs
- XSS prevention: React's JSX auto-escaping
- File upload validation: Image types only
- No sensitive data stored in Local Storage
- CORS handled by backend

See [football-cards-ui/src/components/CardForm.tsx](football-cards-ui/src/components/CardForm.tsx) for validation examples.

---

## 📋 Code Quality Checklist

- [x] TypeScript strict mode enabled
- [x] 80%+ test coverage achieved (≥90% statements, ≥86% branches)
- [ ] All linting warnings resolved
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Performance optimized
- [ ] Browser compatibility verified

---

## 🤝 Contributing

1. Read [GEMINI.md](GEMINI.md) for coding standards
2. Check [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md) for tasks
3. Write tests for new features
4. Follow code style (ESLint, Prettier, black)
5. Update documentation

---

## 📅 Phases Overview

- **Phase 1**: Project planning & requirements (✅ Complete)
- **Phase 2**: Backend implementation (✅ Complete — live Football-Data.org integration with mock fallback)
- **Phase 3**: Frontend implementation (✅ Complete)
- **Phase 4**: Hardening, features, performance & DevOps (⏳ In progress — see [PHASE_4_TODO.md](PHASE_4_TODO.md))

---

## ❓ FAQ

**Q: Do I need a backend to run the frontend?**  
A: No, the frontend can run standalone. It will fail gracefully if the backend is unavailable.

**Q: Where is my data stored?**  
A: Cards are saved in browser Local Storage. They persist across browser sessions but are local to that browser/device.

**Q: Can I export my cards?**  
A: Currently, you can print cards to PDF. Full export is a future feature.

**Q: How do I reset all my saved cards?**  
A: Open browser DevTools → Application → Local Storage → Delete `saved_cards` key.

---

## 📞 Support

For issues, questions, or contributions, refer to the project documentation or contact the development team.

---

**Last Updated**: June 1, 2026
