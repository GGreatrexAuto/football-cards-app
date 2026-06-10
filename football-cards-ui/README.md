# Football Cards UI - Frontend

React + TypeScript frontend for the Football Cards application. Create, customize, save, and print football player trading cards.

## 📖 Quick Links

- **Project README**: See [../README.md](../README.md)
- **Frontend Tasks**: See [../PHASE_3_FRONTEND_TODO.md](../PHASE_3_FRONTEND_TODO.md)
- **Project Requirements**: See [../docs/plans/REQUIREMENTS.md](../docs/plans/REQUIREMENTS.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ and npm
- Backend running on `http://localhost:8000` (optional for basic UI testing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at `http://localhost:3000`

---

## 📋 Available Scripts

### Development

```bash
npm start
```

Runs the app in development mode with hot reload.
Open http://localhost:3000 to view it.

### Testing

```bash
# Unit and component tests (watch mode)
npm test

# Run all tests once
npm test -- --watchAll=false

# Generate coverage report
npm run test:coverage

# E2E tests with Playwright
npm run test:e2e

# E2E tests with UI
npm run test:e2e -- --ui
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Building

```bash
# Build for production
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

---

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── CardCreator.tsx      # Main container (form + preview)
│   ├── CardForm.tsx         # Form for card creation
│   ├── CardPreview.tsx      # Card preview display
│   ├── CardGallery.tsx      # Saved cards gallery
│   └── PrintableCard.tsx    # Print-optimized card view
│
├── context/                 # State management
│   └── CardContext.tsx      # Global card state
│
├── services/                # API & storage
│   ├── api.ts               # Football API client (axios)
│   └── storage.ts           # Local Storage management
│
├── styles/                  # Styling
│   ├── print.css            # Print media queries
│   └── [component].css      # Component styles
│
├── types/                   # TypeScript definitions
│   └── Card.ts              # Card data model
│
├── hooks/                   # Custom React hooks
│   └── [hooks here]
│
├── __mocks__/               # Test mocks
│   └── axios.ts
│
├── App.tsx                  # Root component
├── index.tsx                # Entry point
└── theme.ts                 # Material-UI theme config
```

---

## 🎨 Component Architecture

### CardCreator (Container)
Main component that orchestrates the card creation flow.
- Layout: CardForm (left) + CardPreview (right)
- Manages navigation between create/edit/view modes
- Handles save/print/gallery actions

### CardForm (Presentational)
Form component with input fields:
- Text: Player name
- Dropdowns: Club, nationality, league, position, foot
- Inputs: Defence, Control, Attack stats
- Buttons: Randomize stats, upload photo, select background, save card

### CardPreview (Presentational)
Displays the card with:
- Player photo
- Player name & attributes (club, nation, league, position)
- Stats with rating (auto-calculated)
- Selected background image
- Material-UI Card styling

### CardGallery (Presentational)
Grid display of saved cards:
- Shows card thumbnail, name, and action buttons (edit/delete)
- Empty state when no cards saved
- Loading state while fetching from storage

---

## 🔌 API Integration

The frontend communicates with the backend via axios:

```typescript
// api.ts provides these methods:
getClubs()
getNationalities()
getLeagues()
getPositions()
```

Backend runs on http://localhost:8000. Configure in src/services/api.ts:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

Set via .env.local:
```
REACT_APP_API_URL=http://your-backend-url:8000
```

---

## 💾 Local Storage

Cards are saved in browser Local Storage under the key `saved_cards`:

```typescript
// Card structure
{
  id: "unique-uuid",
  playerName: "Cristiano Ronaldo",
  club: "Al Nassr",
  nationality: "Portugal",
  league: "Saudi Pro League",
  position: "Forward",
  preferredFoot: "Left",
  stats: { defence: 35, control: 90, attack: 95, rating: 73 },
  photo: "data:image/png;base64,..." or "https://url.com/img.png",
  background: "background-1",
  createdAt: "2026-04-26T10:30:00Z",
  updatedAt: "2026-04-26T10:30:00Z"
}
```

**Note**: Data persists across browser sessions but is limited to ~5-10MB per domain.

---

## 🎨 Styling & Theme

Material-UI theme configured in src/theme.ts:

- **Primary**: #1976D2 (blue)
- **Secondary**: #FFC107 (amber)
- **Background**: #F5F5F5 (light gray)
- **Font**: Roboto

Responsive breakpoints follow Material-UI defaults (xs, sm, md, lg, xl).

Print styling in src/styles/print.css optimizes card dimensions and hides UI elements during printing.

---

## 🧪 Testing

### Unit Tests

Located in component files with .test.tsx suffix. 264 tests across 18 suites; ≥90% statement coverage.

CardForm tests are split across 5 parallel files for faster CI runs:
- `CardForm.test.tsx` — core form, dropdowns, background selection
- `CardForm.visual.test.tsx` — stock photos, frame type, crop focus, text customisation
- `CardForm.selections.test.tsx` — nationality flag display, card border
- `CardForm.interactions.test.tsx` — per-stat randomise, reset buttons, card type toggle
- `CardForm.a11y.test.tsx` — form semantics accessibility, alt text, stats style selector

Other test files: `CardPreview.test.tsx`, `CardGallery.test.tsx`, `CardCreator.test.tsx`, `CardCreatorFlow.test.tsx`, `PrintableCard.test.tsx`, `PrintFormatter.test.tsx`, `FontSelector.test.tsx`, `accessibility.test.tsx`, `CardContext.test.tsx`, `api.test.ts`, `storage.test.ts`, `flags.test.ts`

**Run with:** `npm test`  
**Coverage report:** `npm run test:coverage`

### E2E Tests

Located in tests/e2e/:
- card-creation.spec.ts - Full card creation journey
- Additional scenarios: gallery navigation, print, error handling

**Run with:** `npm run test:e2e`

**Target coverage**: 80%+ globally

### Lighthouse (Performance Audit)

Lighthouse CI audits the production build in CI (job: **Performance Tests - Frontend - Lighthouse CI**, after the E2E tests) and fails the pipeline below these category scores: performance ≥ 70 (baseline 72–74; raise to 80 after bundle code-splitting, Task 23.3), accessibility ≥ 90, best-practices ≥ 85. Config lives in `../tests/performance/ui/lighthouserc.yml`; full HTML report URLs are printed in the CI job log (temporary public storage, valid ~7 days).

**Run locally** — audit the production build (dev-server scores are not representative):

```bash
npm run build
npx serve -s dist --listen 3000        # terminal 1 — serve the build
uvicorn app.main:app --port 8000       # terminal 2 — backend (repo root)
npm run lighthouse                     # terminal 3 — collect + assert + upload
```

To collect reports only (no assertions; reports written to `.lighthouseci/`):

```bash
npx lhci collect --url=http://localhost:3000
npx lhci open                          # open the report in a browser
```

See `../tests/performance/CLAUDE.md` for thresholds and threshold-change guidance.

---

## ✅ TypeScript Strict Mode

TypeScript is configured in strict mode (tsconfig.json):

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 📱 Responsive Design

Mobile-first approach using Material-UI's sx prop and breakpoints:

```typescript
sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },  // Stack on mobile, row on desktop
  gap: 2,
}}
```

Tested on:
- Mobile (320px - 640px)
- Tablet (640px - 1024px)
- Desktop (1024px+)

---

## 🔐 Security

- **Input Validation**: Player names, image URLs checked for dangerous content
- **XSS Prevention**: React's JSX auto-escaping; no dangerouslySetInnerHTML
- **File Validation**: Image uploads checked for type and size
- **URL Validation**: Only http/https protocols allowed

See src/components/CardForm.tsx for validation examples.

---

## 🐛 Debugging

### React DevTools
React DevTools browser extension helps inspect components, props, and state.

### Performance Profiling
React DevTools includes a Profiler tab to analyze component render times.

### Local Storage Debug
In browser console:
```javascript
// View all saved cards
JSON.parse(localStorage.getItem('saved_cards'))

// Clear all cards
localStorage.removeItem('saved_cards')
```

---

## 🚀 Deployment

### Build

```bash
npm run build
```

Creates an optimized production build in the build/ folder.

### Hosting Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Docker**: Create Dockerfile for containerized deployment
- **CDN**: Cloudflare, AWS CloudFront for static asset distribution

### Environment Variables

Create .env.production.local for production:
```
REACT_APP_API_URL=https://your-api.com
```

---

## 📚 Resources

- React Documentation
- TypeScript Handbook
- Material-UI Documentation
- React Testing Library Docs
- Playwright Documentation

---

## 🤝 Contributing

Before submitting changes:

1. Run `npm test` and ensure all tests pass
2. Run `npm run lint` and fix any issues
3. Run `npm run format` to auto-format code
4. Update tests for new features
5. Update this README if you add new scripts or structure

---

## 📋 Current Status

**Phase 4: Hardening, Features, Performance & DevOps**

- ✅ Project scaffolding & setup
- ✅ UI components & state management
- ✅ Unit, integration, contract & E2E tests (≥90% coverage)
- ✅ Alternate stats styles (Adrenaline / Match Atk)
- ✅ Print formatter (multi-card A4 layout)
- ⏳ CI pipeline (GitHub Actions)
- ⏳ CD pipeline & hosting
- ⏳ Performance optimisation

See ../PHASE_4_TODO.md for detailed task status.

---

**Last Updated**: June 8, 2026
## Build toolchain

This project uses **Vite v8** as the build tool and dev server, **Jest v30** as the test runner.

### Available scripts

| Script | Description |
|---|---|
| `npm start` | Dev server at `http://localhost:3000` (HMR enabled) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Jest — run all tests once |
| `npm run test:watch` | Jest — watch mode |
| `npm run test:coverage` | Jest — single run + coverage report (≥80% enforced) |
| `npm run test:e2e` | Playwright E2E (requires both servers running) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | TypeScript — type-check only, no emit |
| `npm run bundlesize` | size-limit bundle size check |
| `npm run lighthouse` | Lighthouse CI audit (requires both servers running) |
