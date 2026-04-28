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

Located in component files with .test.tsx suffix:
- CardForm.test.tsx
- CardPreview.test.tsx
- CardGallery.test.tsx
- CardContext.test.tsx
- api.test.ts
- storage.test.ts

**Run with:** `npm test`

### E2E Tests

Located in tests/e2e/:
- card-creation.spec.ts - Full card creation journey
- Additional scenarios: gallery navigation, print, error handling

**Run with:** `npm run test:e2e`

**Target coverage**: 80%+ globally

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

**Phase 3: Frontend Implementation**

- ✅ Project scaffolding & setup
- ✅ UI components & state management
- ✅ Unit & integration tests
- ⏳ E2E tests (Playwright)
- ⏳ Cross-cutting concerns (code quality, perf, a11y)
- ⏳ Deployment readiness

See ../PHASE_3_FRONTEND_TODO.md for detailed task status.

---

**Last Updated**: April 26, 2026
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
