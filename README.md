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

### Frontend Setup

```bash
cd football-cards-ui
npm install
npm start
```

Frontend runs at `http://localhost:3000`

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python app/main.py
```

Backend API runs at `http://localhost:8000`

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
│   └── e2e/                      # End-to-end tests (Playwright)
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
2. **State Management**: React Context API for card state
3. **Data Persistence**: Browser Local Storage (no database for MVP)
4. **Print Support**: Browser print-to-PDF functionality
5. **Responsive Design**: Mobile-friendly UI with Material-UI

---

## 📚 Development Workflow

### Running Tests

```bash
# Backend tests
pytest tests/

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

- `GET /api/clubs` - List all clubs
- `GET /api/nations` - List all nationalities
- `GET /api/leagues` - List all leagues
- `GET /api/positions` - List all positions (if available)

### Frontend API Service

See [football-cards-ui/src/services/api.ts](football-cards-ui/src/services/api.ts) for the axios-based client.

---

## 💾 Local Storage Schema

Saved cards are stored in browser Local Storage under key `saved_cards`:

```typescript
interface Card {
  id: string;                    // UUID
  playerName: string;
  club: string;
  nationality: string;
  league: string;
  position: string;
  preferredFoot: "Left" | "Right" | "Both";
  stats: {
    defence: number;             // 0-100
    control: number;             // 0-100
    attack: number;              // 0-100
    rating: number;              // Average of above (read-only)
  };
  photo: string;                 // Data URL or image URL
  background: string;            // Selected background ID
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

---

## 🧪 Testing Strategy

**Test Pyramid:**
- ✅ **Unit Tests**: Component, hook, service logic
- ✅ **Integration Tests**: Component workflows, BDD scenarios
- ⏳ **E2E Tests**: Full user journeys (Playwright) — In Progress
- ⏳ **Contract Tests**: API request/response validation — In Progress

Target coverage: **80%+ globally**

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
requests
```

See [requirements.txt](requirements.txt) for complete list.

---

## 🚧 Current Phase: Phase 3 - Frontend Implementation

**Status**: ~80% complete

- ✅ Project scaffolding & setup
- ✅ UI components & state management  
- ✅ Basic unit/integration tests
- ⏳ E2E tests with Playwright
- ⏳ Cross-cutting concerns (code quality, docs, perf)
- ⏳ Deployment readiness

See [PHASE_3_FRONTEND_TODO.md](PHASE_3_FRONTEND_TODO.md) for detailed task breakdown.

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

- [ ] TypeScript strict mode enabled
- [ ] All linting warnings resolved
- [ ] 80%+ test coverage achieved
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
- **Phase 2**: Backend implementation (🔲 Not started)
- **Phase 3**: Frontend implementation (🔲 In progress)
- **Phase 4**: Testing, optimization, deployment (🔲 Not started)

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

**Last Updated**: April 26, 2026
