# Football Cards — Test Guide

## Overview

This project uses a test pyramid: many fast component tests, a small number of targeted E2E tests. Two test runners are in use:

| Layer | Tool | Command | Backend needed? |
|---|---|---|---|
| Component / Unit | Jest + React Testing Library | `npm test` | No |
| E2E | Playwright | `npm run test:e2e` | Yes — `localhost:8000` |

See [`.github/instructions/ui-testing.instructions.md`](../../.github/instructions/ui-testing.instructions.md) for component testing conventions and patterns.

---

## Component Tests (`src/**/*.test.tsx`)

All external services (API, localStorage) are **mocked**. Tests run without a backend and complete in seconds.

### Run

```bash
cd football-cards-ui
npm test                   # watch mode
npm test -- --watchAll=false   # single run
npm run test:coverage      # with coverage report
```

### Files and what they cover

| File | Component/Service | Key behaviours tested |
|---|---|---|
| `CardForm.test.tsx` | `CardForm` | Dropdowns from API, validation, randomize stats, save, error states, background selection |
| `CardPreview.test.tsx` | `CardPreview` | Stats display, rating calculation, gradient + image background, photo, responsive |
| `CardGallery.test.tsx` | `CardGallery` | Card list, edit callback, delete confirmation, empty state |
| `CardCreatorFlow.test.tsx` | Full flow | Create → gallery, edit saved card, delete card |
| `CardContext.test.tsx` | `CardContext` | State updates, resetCard, context boundary error |
| `App.test.tsx` | `App` | Navigation tabs render, save button appears |
| `api.test.ts` | `api.ts` | All four endpoints success + failure (axios mocked) |
| `storage.test.ts` | `storage.ts` | saveCard, getSavedCards, updateCard, deleteCard, generateCardId |
| `accessibility.test.tsx` | All components | axe violations, aria-labels, alt text, keyboard tab order |

### Mocking strategy

```typescript
// Mock all external services at the top of each test file
jest.mock('../services/api');
jest.mock('../services/storage');

// Set resolved values in beforeEach
beforeEach(() => {
  (getClubs as jest.Mock).mockResolvedValue([{ id: 1, name: 'Arsenal' }]);
});
```

Never call `localStorage` directly in tests — import from `storage.ts` and mock that module.

### Coverage target

**80% minimum** globally. Check with:

```bash
npm run test:coverage
```

Coverage report opens at `coverage/lcov-report/index.html`.

---

## E2E Tests (`tests/e2e/*.spec.ts`)

E2E tests use a **real browser**, **real backend**, and **real localStorage**. They do not mock anything. They test only what component-level mocks cannot prove.

### Prerequisites

Both servers must be running before starting E2E tests:

```bash
# Terminal 1 — backend (from repo root, venv activated)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — frontend
cd football-cards-ui
npm start
```

### Run

```bash
cd football-cards-ui
npm run test:e2e                                   # all tests, all browsers
npm run test:e2e -- card-creation.spec.ts          # single file
npm run test:e2e -- --grep "@smoke"                # smoke tests only
npm run test:e2e -- --headed                       # watch it run
npm run test:e2e -- --debug                        # Playwright inspector
```

### Spec files and what they test

| File | Subtask | What only E2E can prove |
|---|---|---|
| `card-creation.spec.ts` | 12.10 | Real API populates form; card persists in real localStorage after navigation |
| `card-gallery.spec.ts` | 12.11 | Edited card name persists in real localStorage; deleted card gone after page reload |
| `print-functionality.spec.ts` | 12.12 | `@media print` CSS hides form/nav; PrintableCard visible in print context |
| `critical-paths.spec.ts` | 12.13 + 12.14 | Real backend dropdowns; card survives page reload; zero console errors |
| `font-customization.spec.ts` | 12.16 | Browser CSS font rendering; font persistence across navigation; print fonts (requires feature 11.14) |

### Why E2E tests are kept minimal

The full CRUD lifecycle (create, edit, delete, empty state, validation) is covered by component tests with mocked services. E2E tests are reserved for:
- Real backend API integration
- Real browser localStorage across reloads and navigation
- Browser-only behaviours: `@media print` CSS, computed CSS font-family
- Absence of runtime console errors in a real browser session

### Test infrastructure (`tests/e2e/base/`)

| File | Purpose |
|---|---|
| `test-base.ts` | `TestBase` class: `gotoApp()`, `waitForAppReady()`, `clearAllStorage()` |
| `page-objects/CardCreatorPage.ts` | POM for card creation form |
| `page-objects/CardGalleryPage.ts` | POM for gallery view |
| `page-objects/CardPreviewPage.ts` | POM for card preview |
| `page-objects/NavigationPage.ts` | POM for nav tabs |
| `fixtures/test-data.ts` | `SAMPLE_PLAYERS`, `generateRandomCardData()`, `CardDataBuilder` |
| `helpers/test-helpers.ts` | `clearBrowserStorage()`, `getCardsFromStorage()`, `mockApiResponse()` |

Read localStorage in tests:

```typescript
const cards = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('football-cards') || '[]')
);
```

### Troubleshooting

| Symptom | Fix |
|---|---|
| Dropdowns empty / API errors | Check backend is running: `curl http://localhost:8000/api/v1/clubs` |
| Tests timing out | Increase `timeout` in `playwright.config.ts`; check both servers are up |
| `localStorage` not persisted | Ensure `clearBrowserStorage()` is called in `beforeEach`, not `afterEach` of prior test |
| Flaky tab-navigation selector | Use `await page.waitForLoadState('networkidle')` after tab clicks |
| Print test: form not hidden | Verify `@media print` rules exist in `src/styles/print.css` |

Full E2E setup and debugging guide: [`tests/e2e/README.md`](e2e/README.md)
