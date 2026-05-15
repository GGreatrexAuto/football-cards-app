# Phase 3: Frontend Implementation - Todo List

**Project:** Football Cards Application  
**Role:** Senior Frontend Developer  
**Phase:** 3 (Frontend Implementation) - Tasks 10-12  
**Created:** March 22, 2026

**📋 Testing Strategy Update (May 15, 2026):**  
See [`docs/plans/TESTING_STRATEGY.md`](docs/plans/TESTING_STRATEGY.md) for comprehensive guide on UI/Component tests vs E2E tests.

**Key Testing Points:**
- **UI Tests**: Use React Testing Library with ALL services mocked → Fast feedback, comprehensive coverage
- **E2E Tests**: Use Playwright with REAL backend running → Minimal tests, critical paths only
- **New Instructions**: See [`.github/instructions/ui-testing.instructions.md`](.github/instructions/ui-testing.instructions.md) for component testing best practices

---

## Task 10: Project Scaffolding & Setup

### Subtask 10.1: Initialize React Project with TypeScript
- [x] Run `npx create-react-app football-cards-ui --template typescript`
- [x] Verify successful creation and directory structure
- [x] Initialize git repository for frontend project
- [x] Create `.gitignore` for React/Node.js projects

### Subtask 10.2: Install Core Dependencies
- [x] Install `react` and `react-dom` (via create-react-app)
- [x] Install `@mui/material` for Material Design components
- [x] Install `@emotion/react` and `@emotion/styled` (Material-UI peer dependencies)
- [x] Install `axios` for API communication
- [x] Verify all dependencies installed successfully

### Subtask 10.3: Install Development Dependencies
- [x] Install `@types/react` and `@types/react-dom`
- [x] Install `eslint` and TypeScript ESLint support
- [x] Install `prettier` for code formatting
- [x] Install `react-testing-library` and `jest` for testing
- [x] Install `@playwright/test` for E2E testing

### Subtask 10.4: Configure Linting and Formatting
- [x] Create `.eslintrc.json` configuration file
- [x] Create `.prettierrc` configuration file
- [x] Configure ESLint to work with TypeScript and React
- [x] Add linting script to `package.json` (`npm run lint`)
- [x] Add formatting script to `package.json` (`npm run format`)
- [x] Test linting and formatting on sample files

### Subtask 10.5: Setup Project Structure
- [x] Create `src/components/` directory
- [x] Create `src/services/` directory
- [x] Create `src/context/` directory
- [x] Create `src/styles/` directory
- [x] Create `src/types/` directory for TypeScript type definitions
- [x] Create `src/hooks/` directory for custom React hooks
- [x] Create `public/assets/` directory for images and backgrounds

---

## Task 11: Build UI Components & State Management

### Subtask 11.1: Create Material-UI Theme Configuration
- [x] Create `src/theme.ts` with custom Material-UI theme
- [x] Configure primary color (`#1976D2`)
- [x] Configure secondary color (`#FFC107`)
- [x] Configure background color (`#F5F5F5`)
- [x] Set Roboto font as default typography
- [x] Configure heading and body text styles
- [x] Create theme provider wrapper

### Subtask 11.2: Implement Context & State Management
- [x] Create `src/context/CardContext.tsx` for global card state
- [x] Define TypeScript interfaces for Card data structure
- [x] Implement `CardProvider` component
- [x] Create custom `useCard()` hook for consuming card context
- [x] Add state properties:
  - [x] Player name
  - [x] Club (dropdown)
  - [x] Nationality (dropdown)
  - [x] League (dropdown)
  - [x] Position (dropdown)
  - [x] Preferred foot (dropdown)
  - [x] Defence stat
  - [x] Control stat
  - [x] Attack stat
  - [x] Rating (calculated)
  - [x] Player photo
  - [x] Card background
  - [x] Card ID (for saved cards)

### Subtask 11.3: Create API Service
- [x] Create `src/services/api.ts` module
- [x] Configure axios instance with backend URL
- [x] Implement `getClubs()` function
- [x] Implement `getNationalities()` function
- [x] Implement `getLeagues()` function
- [x] Implement `getPositions()` function (if available from API)
- [x] Implement error handling for API calls
- [x] Add TypeScript interfaces for API responses

### Subtask 11.4: Create Local Storage Service
- [x] Create `src/services/storage.ts` module
- [x] Implement `saveCard(cardData)` function
- [x] Implement `getSavedCards()` function
- [x] Implement `updateCard(cardId, cardData)` function
- [x] Implement `deleteCard(cardId)` function
- [x] Implement `generateCardId()` helper function
- [x] Add TypeScript interfaces for storage operations

### Subtask 11.5: Build CardForm Component
- [x] Create `src/components/CardForm.tsx` component
- [x] Build player name text field (Material-UI TextField)
- [x] Build club dropdown (Material-UI Select)
  - [x] Populate from API service
  - [x] Add loading state
  - [x] Add error handling
- [x] Build nationality dropdown
  - [x] Populate from API service
- [x] Build league dropdown
  - [x] Populate from API service
- [x] Build position dropdown
  - [x] Populate from API service
- [x] Build preferred foot dropdown (hardcoded: Left/Right/Both)
- [x] Build defence stat input field
- [x] Build control stat input field
- [x] Build attack stat input field
- [x] Build "Randomize Stats" button with icon
  - [x] Generate random values (0-100) for DEF, CTRL, ATT
  - [x] Update card state on click
- [x] Build file upload input for player photo
  - [x] Validate file type (image only)
  - [x] Convert to data URL for storage
- [x] Build URL input for player photo
  - [x] Validate URL format
- [x] Build default stock images selector
- [x] Build card background selector
  - [x] Display grid of background images
  - [x] Allow selection
- [x] Build Save button with Material-UI Button component
- [x] Add form validation

### Subtask 11.6: Build CardPreview Component
- [x] Create `src/components/CardPreview.tsx` component
- [x] Style card using Material-UI Card and CardContent
- [x] Display player photo prominently
- [x] Display player name (bold, h5 variant)
- [x] Display stats section:
  - [x] Defence stat with label
  - [x] Control stat with label
  - [x] Attack stat with label
  - [x] Rating stat (auto-calculated, read-only)
- [x] Apply gradient background (primary to secondary color)
- [x] Implement responsive styling
- [x] Add shadow and elevation for card effect
- [x] Display selected background image
- [x] Display club, country, league, and position information

### Subtask 11.7: Build CardCreator Container
- [x] Create `src/components/CardCreator.tsx` component
- [x] Layout: CardForm on left, CardPreview on right (flexbox)
- [x] Integrate CardForm component
- [x] Integrate CardPreview component
- [x] Connect to CardContext for state management
- [x] Add "Save Card" button that calls storage service
- [x] Add "Load from Gallery" button to open CardGallery
- [x] Add "Print" button that triggers PrintableCard
- [x] Add success/error notifications

### Subtask 11.8: Build CardGallery Component
- [x] Create `src/components/CardGallery.tsx` component
- [x] Fetch saved cards from storage service on component mount
- [x] Display cards in a grid layout
- [x] Each gallery item shows:
  - [x] Player name
  - [x] Card preview thumbnail
  - [x] Edit button
  - [x] Delete button
- [x] Implement "Edit" functionality to load card back into CardCreator
- [x] Implement "Delete" functionality with confirmation
- [x] Add empty state message when no cards saved
- [x] Add loading state while fetching cards
- [x] Add "Create New" button to start fresh card

### Subtask 11.9: Build PrintableCard Component
- [x] Create `src/components/PrintableCard.tsx` component
- [x] Duplicate CardPreview styling for printing
- [x] Ensure proper card dimensions (~3.5 x 2.5 inches)
- [x] Create print CSS media query styles
- [x] Hide all UI except PrintableCard when printing
- [x] Test print layout in browser print preview

### Subtask 11.10: Build App Root Component
- [x] Create `src/App.tsx` root component
- [x] Wrap with CardProvider context
- [x] Wrap with Material-UI ThemeProvider
- [x] Implement routing/navigation between views:
  - [x] CardCreator (main view)
  - [x] CardGallery (secondary view)
- [x] Add navigation header/tabs
- [x] Add application title and branding
- [x] Style main layout container

### Subtask 11.11: Create Print Styling
- [x] Create `src/styles/print.css`
- [x] Add `@media print` rules
- [x] Set page size and margins for card printing
- [x] Hide CardForm and navigation during print
- [x] Ensure card displays at correct physical size
- [x] Test print output

### Subtask 11.12: Implement Responsive Design
- [x] Test component layout on mobile devices
- [x] Adjust CardForm layout for small screens (stack vertically)
- [x] Adjust CardPreview size for responsiveness
- [x] Test card gallery grid on mobile
- [x] Add mobile-friendly navigation
- [x] Ensure touch-friendly button sizes

### Subtask 11.13: Security - Input Validation & Sanitization
- [x] Validate player name input (no dangerous characters)
- [x] Validate image URL format
  - [x] Check protocol (only http/https)
  - [x] Check file extension
- [x] Validate file uploads for image types
- [x] Rely on React's JSX auto-escaping for XSS prevention
- [x] Avoid `dangerouslySetInnerHTML` usage
- [x] Document security approach

### Subtask 11.14: Enhancements
- [ ] Ability to change font of text e.g name, club, nationality (see plan D:\Gareth's Docs\Gareths Code\Python\football-cards\docs\plans\font-customization-plan.md)
- [ ] Add override to create a unique club e.g mytown united
- [ ] Change player stock photos to those of human players
- [ ] Add option to choose alternative card layouts e.g all stats at bottom, all at top, bigger photo frame etc
- [ ] Add ability to edit shape of cards e.g shield
- [ ] Update create card form, section headings reordering of fields
- [ ] Make Club selection dynamic based on selected league
- [ ] Add randomise stat button for each stat
- [ ] Add 2 buttons reset Card Background & Player photo to revert to original values
- [ ] Add reset all changes button
- [ ] Ability to choose either club or national team card
- [ ] Card style 2.0
---

## Task 12: Write Frontend Tests

### Subtask 12.1: Setup Testing Infrastructure
- [x] Configure Jest for React/TypeScript testing (via CRA)
- [x] Configure React Testing Library
- [x] Configure Playwright for E2E testing
- [x] Create test configuration files
- [x] Add test scripts to `package.json`:
  - [x] `npm run test` (unit/component tests)
  - [x] `npm run test:e2e` (E2E tests)
  - [x] `npm run test:coverage` (coverage reports)

### Subtask 12.2: Unit Tests - CardForm Component
- [x] Test text input updates state correctly
- [x] Test dropdown selection updates state
- [x] Test randomize button generates valid random stats
- [x] Test manual stat input validates numeric values
- [x] Test file upload validation (image types only)
- [x] Test URL input validation
- [x] Mock API service for dropdown population
- [x] Test that form displays loading state during API calls
- [x] Test error handling for failed API calls
- [x] Aim for 80%+ code coverage

### Subtask 12.3: Unit Tests - CardPreview Component
- [x] Test rating calculation (average of DEF, CTRL, ATT)
- [x] Test that rating updates when stats change
- [x] Test that player name displays correctly
- [x] Test that stats display with correct values
- [x] Test that card background applies correctly
- [x] Test that player photo displays
- [x] Test responsive styling on different screen sizes
- [x] Aim for 80%+ code coverage

### Subtask 12.4: Unit Tests - CardGallery Component
- [x] Mock storage service
- [x] Test that saved cards load on mount
- [x] Test that cards display in gallery grid
- [x] Test delete card functionality
- [x] Test edit card functionality
- [x] Test empty state message appears when no cards
- [ ] Test loading state displays correctly
- [x] Test "Create New" button navigation
- [x] Aim for 80%+ code coverage

### Subtask 12.5: Unit Tests - CardContext & Hooks
- [x] Test useCard() hook returns card state
- [x] Test useCard() hook updateCard function
- [x] Test card state updates propagate to consumers
- [x] Test context initialization
- [x] Aim for 90%+ code coverage

### Subtask 12.6: Unit Tests - Services
- [x] Test API service `getClubs()` function
- [x] Test API service error handling
- [x] Test storage service `saveCard()` function
- [x] Test storage service `getSavedCards()` function
- [x] Test storage service `updateCard()` function
- [x] Test storage service `deleteCard()` function
- [x] Mock axios for API tests
- [x] Mock localStorage for storage tests
- [x] Aim for 95%+ code coverage

### Subtask 12.7: Integration Tests - CardCreator Flow
- [x] Test filling out entire form with valid data
- [x] Test saving a card and retrieving it
- [x] Test editing an existing card
- [x] Test deleting a card
- [x] Test updating card background
- [x] Test updating player photo
- [x] Use React Testing Library for component integration
- [x] Aim for 90%+ coverage of user flows
- [x] Update precommit hook to run integration tests .git/hooks/pre-commit

### Subtask 12.8: Comprehensive UI/Component Test Coverage (React Testing Library + Jest)

**Purpose**: Ensure all React components are thoroughly tested with mocked services for fast, focused feedback

**All tests should:**
- Use React Testing Library (not enzyme or implementation details)
- Mock all external services (API, storage, axios)
- Include positive case, negative case, and edge cases
- Aim for 80%+ coverage per component
- Test user-facing behavior, not implementation details

#### CardForm Component Tests
- [x] Renders without errors
- [x] Displays loading spinner while API calls in progress
- [x] Populates dropdowns from mocked API responses
- [x] Updates player name field on user input
- [x] Updates stat values on user input (defense, control, attack)
- [x] Randomize button sets stats in 0-100 range
- [x] Shows validation errors for invalid URL format
- [x] Shows validation error when saving without player name
- [x] Shows validation error when saving without required fields
- [x] Calls storage.saveCard() with correct data when valid
- [x] Shows success message after save
- [x] Handles API errors gracefully with error message
- [x] Updates context state on successful save
- [x] Test with disabled form state
- [x] Test loading state during save

#### CardPreview Component Tests
- [x] Renders without errors
- [x] Displays player name correctly
- [x] Displays stats correctly
- [x] Calculates rating as average of defense/control/attack
- [x] Updates when card context changes
- [x] Applies selected background correctly
- [x] Displays player photo when provided
- [x] Handles missing photo gracefully
- [x] Responsive layout on mobile
- [x] Updates rating in real-time as stats change
- [x] Test styling with different card backgrounds

#### CardGallery Component Tests
- [x] Renders without errors
- [x] Shows loading spinner while fetching cards
- [x] Displays empty state when no cards saved
- [x] Displays grid of cards when cards exist
- [x] Edit button loads card into CardForm
- [x] Delete button removes card with confirmation
- [x] Calls storage.getSavedCards() on mount
- [x] Calls storage.deleteCard() on delete
- [x] Handles API/storage errors gracefully
- [x] Refreshes gallery after delete
- [x] Refreshes gallery after save
- [x] "Create New" button resets form and navigates

#### CardCreator Component Tests
- [x] Renders CardForm on left and CardPreview on right
- [x] Save button triggers card save
- [x] Load/Gallery button navigates to gallery
- [x] Print button triggers print
- [x] Shows success notification after save
- [x] Shows error notification on save failure
- [x] Layout responsive on mobile

#### CardContext Tests
- [x] useCard() hook returns current card state
- [x] useCard() hook provides updateCard function
- [x] updateCard updates specific card fields
- [x] State updates propagate to all consumers
- [x] Context initialization with default values
- [x] Card ID is generated on creation
- [x] Multiple consumers receive updated state

#### App Component Tests
- [x] Renders main layout without errors
- [x] CardProvider wrapper is applied
- [x] ThemeProvider wrapper is applied
- [x] Navigation between views works (CardCreator ↔ CardGallery)
- [x] Page title displays correctly
- [x] Responsive layout on mobile

#### API Service Tests
- [x] Mock axios correctly
- [x] getClubs() returns clubs array
- [x] getNationalities() returns nations array
- [x] getLeagues() returns leagues array
- [x] getPositions() returns positions array
- [x] Error handling returns meaningful errors
- [x] API base URL is configured

#### Storage Service Tests
- [x] saveCard() stores card data correctly
- [x] getSavedCards() retrieves all saved cards
- [x] updateCard() updates existing card
- [x] deleteCard() removes card
- [x] generateCardId() creates unique IDs
- [x] Cards persist in localStorage
- [x] Error handling for quota exceeded
- [x] Graceful handling of corrupted data

**Coverage Target**: Minimum 80% for all components, 90% for critical paths

**Success Criteria**:
- [ ] All subtasks above are complete
- [ ] Coverage report shows 80%+ overall
- [ ] No console errors/warnings during tests
- [ ] Tests run in < 30 seconds total
- [ ] Tests are deterministic (no flaky tests)
- [ ] All test files follow patterns in `ui-testing.instructions.md`

---

### Subtask 12.9: E2E Tests - Framework Already In Place ✅

**Status**: Framework infrastructure COMPLETE (per `e2e-test-framework-plan.md`)

The E2E testing framework has already been established with:

✅ **Playwright Configuration** (DONE)
- `playwright.config.ts` configured with Chromium, Firefox, WebKit
- Base URL: `http://localhost:3000`
- Video recording & screenshots on failure enabled
- Parallel execution (2 workers)
- HTML reporter configured

✅ **Base Test Infrastructure** (DONE)
- `football-cards-ui/tests/e2e/base/test-base.ts` - base test class
- Page Object Models: `CardCreatorPage.ts`, `CardGalleryPage.ts`, `CardPreviewPage.ts`, `NavigationPage.ts`
- Fixtures: `test-data.ts`, `api-mock-data.ts`
- Helpers: `test-helpers.ts`, `cleanup-helpers.ts`

✅ **Test Data Management** (DONE)
- Sample card data fixtures created
- Test data builders for variations
- Cleanup utilities available

✅ **Environment Configuration** (DONE)
- `.env.test` configured
- Backend API URL configured for localhost:8000

✅ **Test Utilities** (DONE)
- `waitForAppReady()` - app initialization
- `clearBrowserStorage()` - test isolation
- `generateRandomCardData()` - test data generation
- Screenshots/videos on failure

**What Remains**: Write actual E2E test scenarios (Subtasks 12.10-12.13, 12.16)

---

### Subtask 12.10: E2E Tests - Full Card Creation Journey (Playwright)

**⚠️ Requires: Backend running at localhost:8000 + Framework already in place**

**File**: `football-cards-ui/tests/e2e/card-creation.spec.ts`

> **Test Pyramid Note**: Form validation, randomize stats, and reset form are already covered in `CardForm.test.tsx` and `CardContext.test.tsx`. The 3 duplicate E2E tests (`should handle form validation errors`, `should randomize stats correctly`, `should clear form on reset`) must be **removed** from this file — they add no E2E value. The smoke test is legitimately E2E (uses real backend dropdowns).

**Action required on existing spec:**
- [x] `@smoke should create a card successfully` — keep (legitimately E2E via real API)
- [x] `should create card with predefined player data` — consolidate into smoke test
- [x] **Remove** `should handle form validation errors` (covered: `CardForm.test.tsx` test 5)
- [x] **Remove** `should randomize stats correctly` (covered: `CardForm.test.tsx` test 3)
- [x] **Remove** `should clear form on reset` (covered: `CardContext.test.tsx` test 3)

**Enhancement to smoke test (the genuine E2E gap):**
- [x] After saving card, navigate away (go to MY CARDS tab)
- [x] **Verify card persists in REAL localStorage** (read localStorage and assert playerName)

**Key Assertions**:
- Success message contains "Card saved successfully"
- Card is visible in gallery after navigating away and returning — real localStorage, not mocked

---

### Subtask 12.11: E2E Tests - Card Gallery & Loading (Playwright)

**⚠️ Requires: Backend running at localhost:8000 + Subtask 12.10 tests passing**

**File**: `football-cards-ui/tests/e2e/card-gallery.spec.ts` (new)

> **Test Pyramid Note**: Gallery CRUD UI logic (display, edit callback, delete confirmation dialog, empty state) is fully covered in `CardGallery.test.tsx` (5 tests) and `CardCreatorFlow.test.tsx` (3 tests) with mocked storage. E2E tests here focus exclusively on what those mocks cannot prove: **real localStorage persistence across actual page navigation**.

Use established framework:
- **Page Objects**: `CardGalleryPage`, `CardCreatorPage`, `NavigationPage`
- **Helpers**: `clearBrowserStorage()`, `gotoApp()`
- **Base**: Extend `test` from `./base/test-base`

**Scenario 1: Edit card and verify persistence across navigation**
- [x] Create and save a card via the real form
- [x] Navigate to MY CARDS gallery
- [x] Click "Edit" on the card
- [x] Modify player name in the form
- [x] Save modified card
- [x] **Verify modified name is shown — real localStorage updated**

**Scenario 2: Delete card and verify persistence after page reload**
- [x] Create and save a card
- [x] Navigate to gallery
- [x] Click "Delete" and confirm
- [x] Reload the page (`page.reload()`)
- [x] **Verify gallery is empty — deletion persisted in real localStorage**

**Key Assertions**:
- Edits survive navigation (real localStorage, not mocked)
- Deletes survive page reload (real localStorage, not mocked)

---

### Subtask 12.12: E2E Tests - Print Functionality (Playwright)

**⚠️ Requires: Backend running at localhost:8000 + Subtask 12.10 tests passing**

**File**: `football-cards-ui/tests/e2e/print-functionality.spec.ts` (new)

> **Test Pyramid Note**: Print behaviour is not simulatable in React Testing Library. This is genuinely E2E — only a real browser can verify `@media print` CSS rules and the print dialog.

Use established framework:
- **Page Objects**: `CardCreatorPage`, `CardPreviewPage`
- **Base**: Extend `test` from `./base/test-base`

**Scenario: Card layout is correct in print context**
- [x] Create a card with player name, stats, and background
- [x] Use Playwright's `page.emulateMedia({ media: 'print' })` to apply print CSS
- [x] Verify `PrintableCard` component is visible
- [x] Verify form fields (CardForm) are hidden (`display: none` via `@media print`)
- [x] Verify navigation header is hidden in print context
- [x] Take screenshot of print layout for visual verification
- [x] Restore media to `screen` and verify app returns to normal

**Key Assertions**:
- Card content visible under print media
- CardForm and navigation hidden under print media
- No JavaScript errors triggered by the print action

---

### Subtask 12.13: E2E Tests - Critical Paths & Integration (Playwright)

**⚠️ Requires: Backend running at localhost:8000**

**File**: `football-cards-ui/tests/e2e/critical-paths.spec.ts` (new)

> **Test Pyramid Note**: The full create→save→gallery→edit→delete cycle is already covered in `CardCreatorFlow.test.tsx` with mocked services. These E2E tests focus only on what mocks cannot prove: real backend API responses, real localStorage across browser reloads, and absence of runtime errors in the real browser.

Use established framework:
- **Page Objects**: `CardCreatorPage`, `CardGalleryPage`, `NavigationPage`
- **Base**: Extend `test` from `./base/test-base`

**Scenario 1: Real API data populates dropdowns**
- [x] Navigate to CREATE CARD
- [x] Verify Club dropdown populates with items (count > 0)
- [x] Verify Nationality dropdown populates with items
- [x] Verify League dropdown populates with items

**Scenario 2: Card survives full page reload**
- [x] Create and save a card
- [x] Call `page.reload()` to fully re-initialise the app
- [x] Navigate to MY CARDS gallery
- [x] **Verify saved card is still present — real localStorage survived reload**

**Scenario 3: No console errors across critical journey**
- [x] Attach `page.on('console')` listener before starting
- [x] Complete full journey: load app → fill form → save → navigate to gallery
- [x] **Assert zero `console.error` calls throughout**

**Key Points**:
- Only 3 lean tests — no edge cases (those belong in component tests)
- Each test proves something that mocked tests cannot


---

### Subtask 12.14: Accessibility Testing

> **Test Pyramid Note**: Accessibility assertions belong at component level (fast, no server needed). Performance E2E testing (throttled network, CPU throttling, timing baselines) is **out of scope for this plan**. Console error checking is covered in Subtask 12.13 Scenario 3.

**Component Tests** (React Testing Library + axe-core — new `accessibility.test.tsx`):
- [x] Install `jest-axe` and add `toHaveNoViolations` to `setupTests.ts`
- [x] Test `CardForm` renders with no axe violations
- [x] Test `CardPreview` renders with no axe violations
- [x] Test `CardGallery` renders with no axe violations
- [x] Verify all form inputs have `aria-label` or associated `<label>`
- [x] Verify all action buttons have accessible names
- [x] Verify all `<img>` elements have `alt` text
- [x] Test keyboard Tab order through CardForm fields (using `userEvent.tab()`)
- [x] Verify color contrast — covered by axe `color-contrast` rule in axe violations check

---

### Subtask 12.15: Test Documentation

- [x] Create `football-cards-ui/tests/README.md` with:
  - [x] How to run component tests (`npm test`) and E2E tests (`npm run test:e2e`)
  - [x] Backend startup requirement for E2E
  - [x] Mocking strategy documentation
- [x] Document test data fixtures location
- [x] Document expected coverage targets (80%+ UI, critical paths E2E)
- [x] Create troubleshooting guide for common test failures
- [x] Link to `ui-testing.instructions.md` in instructions folder

---

### Subtask 12.16: Font Customization — Tests

> **Test Pyramid Note**: Font state management (selection updates context, reset reverts to defaults, save/load from localStorage) belongs at component level. E2E tests cover only what a real browser must prove: actual CSS font rendering and persistence across real navigation.

**Component Tests** (extend existing files):
- [ ] **`CardForm.test.tsx`** — test font selector dropdowns update card context state
- [ ] **`CardPreview.test.tsx`** — test preview applies correct `font-family` CSS when font context changes
- [ ] **`CardContext.test.tsx`** — test `resetCard()` reverts font fields to defaults
- [ ] **`storage.test.ts`** — test font selections are saved and loaded from localStorage correctly

**E2E Tests** — `football-cards-ui/tests/e2e/font-customization.spec.ts` (new):

**⚠️ Requires: Backend running at localhost:8000 + Font customization feature (11.14) implemented**

- [ ] **Scenario 1: Fonts render visually in the browser**
  - [ ] Navigate to CREATE CARD, enter player name
  - [ ] Select "Playfair Display" for player name font
  - [ ] Select "Montserrat" for club text font
  - [ ] Verify preview element has correct `font-family` CSS applied (via `evaluate`)
  - [ ] Take screenshot for visual verification

- [ ] **Scenario 2: Custom fonts persist across navigation**
  - [ ] Create card with custom fonts and save
  - [ ] Navigate to MY CARDS gallery
  - [ ] Click Edit on the saved card
  - [ ] Verify font selectors show the previously selected fonts (real localStorage)
  - [ ] Verify preview renders with correct fonts

- [ ] **Scenario 3: Print with custom fonts**
  - [ ] Create card with "Playfair Display" player name font
  - [ ] Apply print media with `page.emulateMedia({ media: 'print' })`
  - [ ] Verify `PrintableCard` element has correct `font-family` CSS applied
  - [ ] Take screenshot of print layout

---

## Cross-Cutting Concerns

### Code Quality

#### Bug #1: Create Card Form "Failed to Fetch Data" Error
**Issue**: CardForm component displays "Failed to fetch data" error instead of loading dropdowns for clubs, nationalities, and leagues.

**Root Cause**: API endpoint mismatch - frontend calls `/api/clubs` but backend routes are registered at `/api/v1/clubs` prefix.

**Resolution Subtasks**:
- [x] **Step 1: Fix API Service Configuration**
  - [x] Update `src/services/api.ts` baseURL from `http://localhost:8000/api` to `http://localhost:8000/api/v1`
  - [x] Test locally that API calls now resolve correctly
  - [x] Verify backend is running on port 8000

- [x] **Step 2: Improve Error Handling & Diagnostics**
  - [x] Update CardForm error catch block to log detailed error information
  - [x] Display error details to user for debugging (instead of generic "Failed to fetch data")
  - [x] Add error logging to browser console with full error stack
  - [ ] Consider adding fallback data or retry mechanism

- [x] **Step 3: Write Unit Tests for API Service**
  - [x] Create `src/services/api.test.ts` (if not already complete)
  - [x] Test getClubs() with mocked axios
  - [x] Test getNationalities() with mocked axios
  - [x] Test getLeagues() with mocked axios
  - [x] Test error handling for failed requests
  - [x] Mock axios to return 503 and verify error handling
  - [x] Achieve 95%+ code coverage for api.ts

- [x] **Step 4: Write Integration Tests for CardForm Data Loading**
  - [x] Update `src/components/CardForm.test.tsx` with integration tests
  - [x] Test that CardForm successfully fetches and displays clubs on mount
  - [x] Test that CardForm successfully fetches and displays nationalities on mount
  - [x] Test that CardForm successfully fetches and displays leagues on mount
  - [x] Test error state when API calls fail
  - [x] Test loading state during API fetch
  - [x] Mock API service using jest.mock()
  - [x] Verify dropdown menus populate correctly after data loads

- [x] **Step 5: Verify Full Flow**
  - [x] Start backend server
  - [x] Start frontend dev server
  - [x] Verify CREATE CARD tab loads without error
  - [x] Verify all three dropdown menus (Club, Nationality, League) populate correctly
  - [ ] Test selecting values from each dropdown
  - [x] Test that error message is displayed correctly with diagnostic info

- [x] **Step 6: Documentation & Prevention**
  - [ ] Document the API versioning scheme in API_CONTRACT.md
  - [ ] Add note about baseURL configuration in frontend README
  - [ ] Document common "Failed to fetch" debugging steps
  - [ ] Add this endpoint mismatch to known issues/lessons learned

#### Bug #2: Create Card Form Changing Background Colour in UI does not update preview

**Issue**: When user selects a background image in the Card Background section, the preview card doesn't visually show the selected background image. Only the default gradient appears.

**Root Cause**: The linear gradient in `CardPreview.tsx` is **opaque** (using full rgb() colors) and is layered on top of the background image URL. The gradient completely covers the background image, making it invisible.

Current CSS:
```css
backgroundImage: linear-gradient(135deg, rgb(25, 118, 210) 0%, rgb(255, 193, 7) 100%), url("https://...")
```
The gradient (first background) is on top and blocks the image (second background).

**Resolution Subtasks**:
- [x] **Step 1: Fix CardPreview Background Gradient Opacity**
  - [x] Update `src/components/CardPreview.tsx` cardStyle object
  - [x] Change gradient colors from `rgb()` to `rgba()` with ~0.7 opacity
  - [x] New gradient: `linear-gradient(135deg, rgba(25, 118, 210, 0.7) 0%, rgba(255, 193, 7, 0.7) 100%)`
  - [x] This makes gradient semi-transparent so background image shows through

- [x] **Step 2: Test Background Selection in Browser**
  - [x] Select "Stadium Blue" background - verify blue sky image is visible
  - [x] Select "Classic Green" background - verify green image is visible
  - [ ] Select "Champions Gold" background - verify gold image is visible
  - [x] Verify gradient overlay still looks good with transparency
  - [ ] Test with different player photos to ensure good contrast

- [x] **Step 3: Write Unit Tests for CardPreview Background**
  - [x] Test that background gradient includes rgba values (semi-transparent)
  - [x] Test that cardBackground prop is applied to background style
  - [x] Test that gradient + image combination renders correctly
  - [ ] Mock different cardBackground URLs and verify they appear in output
  - [x] Test that without cardBackground, only gradient appears

- [x] **Step 4: Write Integration Test for Background Selection Flow**
  - [x] Create test that selects background option and checks preview updates
  - [x] Verify clicking background card updates card state
  - [x] Verify preview card background style includes the selected image URL
  - [x] Test multiple background selections in sequence
  - [ ] Verify visual styling reflects the selection

- [ ] **Step 5: Verify Full Flow**
  - [ ] Reload frontend app
  - [ ] Create a new card
  - [ ] Select "Stadium Blue" background - should see blue sky showing through gradient
  - [ ] Switch to "Champions Gold" - should see stadium image showing through gradient
  - [ ] Switch back to gradient-only (deselect) - gradient fills entire card
  - [ ] Save card and verify background persists
  - [ ] Load saved card and verify background appears in preview  

#### Other Code Quality Items
- [ ] Ensure all TypeScript strict mode enabled
- [ ] Resolve all linting warnings
- [ ] Achieve minimum 80% test coverage globally
- [ ] Perform code review before merging to main branch

### Documentation
- [ ] Document component APIs and props
- [ ] Create JSDoc comments for functions
- [ ] Document state management (CardContext)
- [ ] Create README with setup and development instructions
- [ ] Document security considerations and data handling

### Performance Optimization
- [ ] Implement lazy loading for CardGallery
- [ ] Optimize image loading (use WebP with fallbacks)
- [ ] Minimize initial bundle size
- [ ] Profile React component render times
- [ ] Implement code splitting for routes (if routing added)

### Browser Compatibility
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Test on Mobile browsers (latest)
- [ ] Verify localStorage support
- [ ] Test print functionality across browsers

### Shift left
- [x] Configure linters
- [x] Add linters to precommit hook
- [x] Add unit tests to precommit hook
- [x] Update precommit hook to summarise failing tools/test stages
- [x] Update precommit hook to clearly seperate each stage visually in both script and logs to console

---

## Deployment Readiness

- [ ] Build production bundle (`npm run build`)
- [ ] Test production build locally
- [ ] Optimize static assets
- [ ] Create deployment documentation
- [ ] Setup CI/CD pipeline for automated builds and tests (Phase 4)
- [ ] Plan hosting strategy (static hosting, CDN, etc.)

---

## New Tasks

### Task 13: Add Positions Endpoint
- [ ] Implement `/api/v1/positions` endpoint in backend
- [ ] Add positions data (GK, DEF, MID, FWD)
- [ ] Update frontend to use dynamic positions from API instead of hardcoded
- [ ] Test positions dropdown loads from API

### Task 14: Fix Mocking Bugs for Clubs, Leagues, and Nations
- [ ] Replace mock data in `football_api.py` with real external API calls
- [ ] Implement proper error handling for external API failures
- [ ] Add fallback to mock data if external API is unavailable
- [ ] Update tests to handle both real and mock scenarios

---

## Notes

- **Phase 2 (Backend)** should be completed before heavy frontend development - ensure API endpoints are ready for integration
- **Design System:** Leverage Material-UI theming to maintain consistency across all components
- **State Management:** Keep CardContext lightweight; consider Redux/Zustand if complexity increases beyond MVP scope
- **Testing:** Aim for pyramid approach - many unit tests, fewer integration tests, minimal E2E tests
- **Accessibility:** Material-UI components have built-in a11y support; verify all custom components follow WCAG guidelines
- **Browser Storage:** Document localStorage limitations (size, cross-tab sync, data persistence in private browsing)
