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
- [x] Create `src/utils/` directory for shared utilities (e.g. `flags.ts`)
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
  - [x] Nationality code (Football-Data.org code, e.g. "ENG" — used to derive flag URL)
  - [x] Nationality display mode (`'text' | 'flag' | 'both'`)
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
  - [x] Image frame type (`'face' | 'headAndShoulders' | 'fullBody'`)
  - [x] Image crop focus (`'top' | 'centre' | 'bottom'`)
  - [x] Card border shape (`'none' | 'shield' | 'rectangle' | 'triangle' | 'explosion'`)
  - [x] Card border colour (hex string)

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
- [x] Ability to change font of text e.g name, club, nationality (see plan D:\Gareth's Docs\Gareths Code\Python\football-cards\docs\plans\font-customization-plan.md)
- [x] Add override to create a unique club e.g mytown united
- [x] Sort clubs list alphabetically
- [x] Change player stock photos (currently any image) to those of human faces
- [x] Add player image frame type + crop focus controls (face/head & shoulders/full-body × top/centre/bottom)
- [ ] Add option to choose alternative card layouts e.g all stats at bottom, all at top, bigger photo frame etc
- [x] Add ability to add and change internal card border e.g cards always rectangular, but could have a border of shield, rectangle, triangle, explosion etc within rectangular card
- [ ] Update create card form, section headings reordering of fields
- [x] Make Club selection dynamic based on selected league
- [x] Add randomise stat button for each stat
- [x] Add 2 buttons reset Card Background & Player photo to revert to original values
- [x] Add reset all changes button
- [x] Add reset fields button (clears player details + stats, keeps photo/background/visual settings)
- [x] Ability to choose either club or national team card
- [x] Nationality should optionally provide flag image, instead of or in addition to text (see Task 18)
- [x]  Floating card, e.g when scrolling down page so that you can see effects of options you choose rather than changin an attribute and then having to scroll back up
- [ ] Print formatter - UI functionality to add upto x saved cards to be printed on one page of A4 paper.
- [ ] Alternate stats styles e.g Match Atk style (Speed, Tackle, Power, Shoot, Skill, Pass) and set existing stat style as Adrenaline (Total will be common for both)
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
- [x] Test card type toggle shows/hides club and league sections
- [x] Test switching to national team clears club and league values
- [x] Test reset fields preserves card type selection
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

#### E2E Tests — National Team Card (`national-team-card.spec.ts`)
- [x] Switching to National Team hides club and league fields (smoke)
- [x] Switching back to Club restores club and league fields
- [x] Saved national team card has `cardType: 'national'` in localStorage
- [x] Card type toggle buttons have correct ARIA labels (`aria-pressed` state)

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
- [x] **`CardForm.test.tsx`** — test font selector dropdowns update card context state
- [x] **`CardPreview.test.tsx`** — test preview applies correct `font-family` CSS when font context changes
- [x] **`CardContext.test.tsx`** — test `resetCard()` reverts font fields to defaults
- [x] **`storage.test.ts`** — test font selections are saved and loaded from localStorage correctly

**E2E Tests** — `football-cards-ui/tests/e2e/font-customization.spec.ts` ✅ created:

**⚠️ Requires: Backend running at localhost:8000 + Font customization feature (11.14) implemented**

- [x] **Scenario 1: @smoke — Font renders visually in the browser**
  - [x] Navigate to CREATE CARD
  - [x] Select "Montserrat" for player name font
  - [x] Verify preview element has correct `font-family` CSS applied (via `toHaveCSS`)

- [x] **Scenario 2: Custom fonts persist across navigation**
  - [x] Select "Poppins" for player name font, fill form fields and save
  - [x] Navigate to MY CARDS gallery
  - [x] Click Edit on the saved card
  - [x] Verify font selector shows the previously selected font (real localStorage)
  - [ ] Verify preview CSS re-applies the font on reload

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
  - [x] Document the API versioning scheme in API_CONTRACT.md
  - [x] Add note about baseURL configuration in frontend README
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
- [x] Ensure all TypeScript strict mode enabled (`"strict": true` confirmed in `tsconfig.json`)
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

## Task 17: Usability & Accessibility Improvements

> **Context:** Gap analysis (May 2026) identified ~45% a11y test coverage. The app has solid foundations (jest-axe installed, role-based queries, ARIA labels on interactive elements) but has meaningful gaps in form semantics, error messaging, focus management, and keyboard navigation. This task covers both implementation fixes and the tests that verify them.

### Subtask 17.1: Form Semantics — Implementation

These are missing ARIA attributes on existing components; tests in 17.2 verify them.

- [x] Add `aria-required="true"` to Player Name input in `CardForm.tsx` (it is required but this is not declared to assistive tech)
- [x] Add `aria-invalid="true"` to Player Name input when validation error is active
- [x] Add `aria-describedby` to Player Name input pointing to the error message element; give the error element a stable `id`
- [x] Add `aria-invalid` to stat inputs (Defence, Control, Attack) when value is out of range
- [x] Wrap the stats section (Defence, Control, Attack) in a `<fieldset>` with `<legend>Player Stats</legend>` for semantic grouping
- [x] Ensure the success/error Snackbar has `role="alert"` and `aria-live="assertive"` so screen readers announce it automatically
- [x] Add an `aria-live="polite"` status region that announces when form data is loading (e.g. "Loading form options…" while API calls are in progress)
- [x] Improve custom-club / custom-league inputs: when the "Other" text field appears, ensure it has an explicit `aria-label` (e.g. `aria-label="Custom club name"`)

### Subtask 17.2: Form Semantics — Tests (`CardForm.test.tsx`)

- [x] Test that Player Name input has `aria-required="true"`
- [x] Test that Player Name input has `aria-invalid="true"` when save is attempted without a name
- [x] Test that Player Name input has `aria-invalid="false"` (or attribute removed) after the error is cleared
- [x] Test that Player Name has `aria-describedby` matching the `id` of the visible error message element
- [x] Test that stats inputs show `aria-invalid="true"` when value exceeds 0–100 range
- [x] Test that the stats section is wrapped in a `fieldset` with a `<legend>` containing "Player Stats"
- [x] Test that error Snackbar has `role="alert"` or `aria-live` attribute
- [x] Test that custom club/nationality input has an accessible label when it appears

### Subtask 17.3: Focus Management — Implementation

- [x] In the delete confirmation dialog (`CardGallery.tsx`), move focus into the dialog when it opens (MUI Dialog does this by default — verify it is not overridden)
- [x] Ensure focus returns to the **Delete button** for the deleted card's row (or to the "Create New" button if the gallery is now empty) after the dialog closes
- [x] In `App.tsx` tab navigation, ensure hidden tab panels are excluded from the tab order (`tabIndex={-1}` or `aria-hidden="true"` while not active)

### Subtask 17.4: Focus Management — Tests

- [x] In `CardGallery.test.tsx`: test that focus moves into the delete confirmation dialog when opened (check `document.activeElement` is inside the dialog)
- [x] In `CardGallery.test.tsx`: test that focus returns to a gallery element (or "Create New") after confirming deletion
- [x] In `App.test.tsx` or `accessibility.test.tsx`: test that inactive tab panels are not reachable by Tab when hidden

### Subtask 17.5: Tab Order & Keyboard Navigation Tests (`accessibility.test.tsx`)

- [x] Add explicit Tab-order test for CardForm: Tab through Player Name → Club → League → Nationality → Position → Preferred Foot → Defence → Control → Attack → Randomize → Save; assert each element receives focus in that sequence
- [x] Test that Escape key closes the delete confirmation dialog without deleting the card
- [x] Test that pressing Space or Enter on a stock photo button triggers selection (assert `aria-pressed` toggles)
- [x] Test that pressing Space or Enter on an image frame type / crop focus toggle activates it
- [x] Test that arrow keys cycle focus within the ToggleButtonGroup for frame type and crop focus (MUI behaviour — verify it works)

### Subtask 17.6: Image & Media Alt Text Improvements — Implementation

- [x] Improve stock photo `alt` text in `CardForm.tsx` from generic "Player Portrait 1" to descriptive strings (e.g. "Portrait of a male footballer, short dark hair, looking forward")
- [x] Improve background option `alt` text to include a brief description of what the image shows (e.g. "Classic Green: green grass football pitch", "Stadium Blue: blue sky over a stadium")
- [x] Update the player photo `alt` text format in `CardPreview.tsx` to use human-readable labels instead of internal field values (e.g. "Player photo, head & shoulders, positioned at bottom" not "Player headAndShoulders photo, cropped from bottom")
- [x] Mark any purely decorative images (e.g. background textures not selected by the user) with `alt=""` (decorative SVG overlay uses `aria-hidden="true"`; all `<img>` elements have descriptive alt text)

### Subtask 17.7: Image & Media Alt Text — Tests

- [x] In `CardForm.test.tsx`: test each stock photo button has a descriptive `aria-label` / `alt` that does not just say "Portrait 1"
- [x] In `CardForm.test.tsx`: test each background option has an `alt` containing a human-readable description
- [x] In `CardPreview.test.tsx`: test that player photo `alt` text uses human-readable labels ("head & shoulders") rather than raw field values ("headAndShoulders")

### Subtask 17.8: Loading State Accessibility — Tests

- [x] Test that a `role="status"` or `aria-live="polite"` region exists in CardForm and contains the text "Loading…" (or equivalent) while API calls are in flight
- [x] Test that the region is empty (or removed) once data has loaded
- [x] Test that when an API error occurs, a region with `role="alert"` announces the error text

### Subtask 17.9: Gallery List Semantics — Implementation & Tests

- [x] Verify (or update) the card grid in `CardGallery.tsx` to use `role="list"` on the container and `role="listitem"` on each card; MUI Grid does not add these by default
- [x] Ensure the empty-state message uses a heading element (`<Typography variant="h6">`) so screen readers announce the absence of cards as a heading
- [x] In `CardGallery.test.tsx`: test `role="list"` on the grid container and `role="listitem"` on each card item
- [x] In `CardGallery.test.tsx`: test the empty-state element has a heading role (e.g. `getByRole('heading', { name: /no saved cards/i })`)

### Subtask 17.10: Keyboard-Only E2E Test

**File**: `football-cards-ui/tests/e2e/keyboard-navigation.spec.ts` (new)

> This is the only gap that cannot be caught at component level — confirming that the entire create-and-save journey is completable without a mouse in a real browser.

- [x] Navigate to CREATE CARD using keyboard only (no mouse)
- [x] Tab to Player Name, type a name, Tab to each dropdown, open with Enter/Space, select an option with Arrow + Enter, Tab through remaining fields
- [x] Tab to "Randomize Stats" button and activate with Enter
- [x] Tab to the Save button and activate with Enter
- [x] Assert success message appears and has `role="alert"`
- [x] Tab to MY CARDS navigation and press Enter
- [x] Assert the saved card appears in the gallery — all without a single mouse interaction

### Subtask 17.11: axe-playwright for E2E Accessibility Checks

- [x] Install `@axe-core/playwright` (`npm install --save-dev @axe-core/playwright`)
- [x] Add a reusable helper `checkA11y(page)` in `test-helpers.ts` that wraps `checkA11y` from axe-playwright
- [x] Call `checkA11y(page)` in `critical-paths.spec.ts` after the app loads and after each major navigation step
- [ ] Confirm no new axe violations are introduced when running E2E against the real browser

### Subtask 17.12: Missing Component Tests

- [x] Create `CardCreator.test.tsx` — test that Save, Print, and "Load from Gallery" buttons all have accessible names (`getByRole('button', { name: /save/i })` etc.) and that emoji-only visual content is supplemented with text labels or `aria-label`
- [x] Create `PrintableCard.test.tsx` — test that the printable layout includes the player name, rating, and stats as text nodes (not just images), and that the component passes axe violation checks

---

## New Tasks

### Task 13: Add Positions Endpoint
- [x] Implement `/api/v1/positions` endpoint in backend
- [x] Add positions data (GK, DEF, MID, FWD)
- [x] Update frontend to use dynamic positions from API instead of hardcoded
- [x] Test positions dropdown loads from API

### Task 14: Fix Mocking Bugs for Clubs, Leagues, and Nations
- [x] Replace mock data in `football_api.py` with real external API calls
- [x] Implement proper error handling for external API failures
- [x] Add fallback to mock data if external API is unavailable
- [x] Update tests to handle both real and mock scenarios

### Task 15: Fix Firefox E2E Compatibility
Firefox E2E tests are currently excluded from the pre-commit hook because they time out waiting for the form to become editable. Root cause: the loading spinner that shows while API data loads (`getClubs`, `getNationalities`, `getLeagues`, `getPositions`) takes longer to clear in Firefox than in Chromium/WebKit.

- [ ] Reproduce the failure reliably: run `npx playwright test --project=firefox` locally and confirm the `locator.fill` timeout on `player-name`
- [ ] In `CardCreatorPage.ts` `fillPlayerName()`, add an explicit wait for the loading state to clear before attempting `fill` — e.g. wait for the loading spinner to be hidden or for the submit button to be enabled
- [ ] Alternatively, increase the per-action timeout in `playwright.config.ts` for Firefox only (use `projects` config with a Firefox-specific `actionTimeout`)
- [ ] Investigate the `networkidle` timeout in `critical-paths.spec.ts:61` — replace `waitForLoadState('networkidle')` with a more deterministic wait (e.g. wait for a visible element after reload)
- [ ] Re-enable Firefox in the pre-commit hook (`--project=chromium --project=webkit --project=firefox`) once all tests pass
- [ ] Confirm all 21 E2E tests pass across Chromium, Firefox, and WebKit before closing this task

### Task 16: Player Image Frame Type & Crop Focus

Allow the user to control how the player photo is framed on the card via two independent selectors:
- **Frame type** — shape and aspect ratio (Face, Head & Shoulders, Full Body)
- **Crop focus** — where the image is anchored within that frame (Top, Centre, Bottom)

This combination handles any uploaded photo regardless of its content (e.g. full-body photo + Face frame + Top focus shows just the player's head).

#### Subtask 16.1: Implementation

- [x] Extend the `Card` interface in `src/types/` with:
  - `imageFrameType: 'face' | 'headAndShoulders' | 'fullBody'` (default `'face'`)
  - `imageCropFocus: 'top' | 'centre' | 'bottom'` (default `'top'`)
- [x] Add both fields (with defaults) to `CardContext` initial state and `updateCard()` in `src/context/CardContext.tsx`
- [x] Add both fields to the `saveCard` / `updateCard` / `getSavedCards` round-trip in `src/services/storage.ts`; missing fields in legacy saved cards should default gracefully
- [x] Add a **Frame type** selector to `src/components/CardForm.tsx`:
  - MUI `ToggleButtonGroup` (single-select) with options: Face, Head & Shoulders, Full Body
  - `aria-label="Player image frame type"` on the group; each button has a descriptive label
  - `data-testid="image-frame-type-selector"`
- [x] Add a **Crop focus** selector to `src/components/CardForm.tsx`:
  - MUI `ToggleButtonGroup` (single-select) with options: Top, Centre, Bottom
  - `aria-label="Image crop focus"` on the group
  - `data-testid="image-crop-focus-selector"`
- [x] Update `src/components/CardPreview.tsx` image styles per frame type:
  - `face` → `aspect-ratio: 1/1`, `border-radius: 50%`, `object-fit: cover`
  - `headAndShoulders` → `aspect-ratio: 3/4`, `border-radius: 8px`, `object-fit: cover`
  - `fullBody` → `aspect-ratio: 2/3`, `border-radius: 8px`, `object-fit: cover`
- [x] Map `imageCropFocus` to CSS `object-position` in `CardPreview.tsx`:
  - `top` → `object-position: top`
  - `centre` → `object-position: center`
  - `bottom` → `object-position: bottom`
- [x] Update the `alt` attribute on the preview image to describe the active combination (e.g. "Player face photo, cropped from top")

#### Subtask 16.2: Tests & Accessibility

**Component / unit tests** (extend existing test files):

- [x] `CardContext.test.tsx`:
  - `imageFrameType` defaults to `'face'` and `imageCropFocus` defaults to `'top'`
  - `updateCard({ imageFrameType: 'fullBody' })` propagates to consumers
  - `updateCard({ imageCropFocus: 'bottom' })` propagates to consumers
- [x] `CardForm.test.tsx`:
  - Frame type selector renders with three options (Face, Head & Shoulders, Full Body)
  - Crop focus selector renders with three options (Top, Centre, Bottom)
  - Selecting each frame type calls `updateCard` with the correct `imageFrameType` value
  - Selecting each crop focus calls `updateCard` with the correct `imageCropFocus` value
  - Both selectors have correct `aria-label` and are keyboard-navigable (Tab + Space/Enter)
- [x] `CardPreview.test.tsx`:
  - Renders `border-radius: 50%` when `imageFrameType` is `'face'`
  - Does not render `border-radius: 50%` for `'headAndShoulders'` or `'fullBody'`
  - Applies `object-position: top` / `center` / `bottom` per `imageCropFocus` value
  - `alt` text reflects the active frame type + crop focus combination
- [x] `storage.test.ts`:
  - Both fields are saved and restored correctly
  - Cards saved without these fields (legacy data) default to `'face'` / `'top'` on load
- [x] `accessibility.test.tsx` (extend existing):
  - `CardForm` with both selectors passes `toHaveNoViolations()`
  - All toggle button options have accessible names
  - Tab order passes through both selector groups in logical document order

**E2E tests** — `football-cards-ui/tests/e2e/image-frame-type.spec.ts` (new):

> Test pyramid note: state management and CSS value logic are covered in component tests above. E2E tests focus only on what a real browser must prove: that CSS is actually applied and that selections persist in real localStorage.

- [x] **Scenario 1: Frame type CSS renders in real browser**
  - Select "Full Body" frame type + "Top" crop focus on CREATE CARD
  - Verify preview image has `aspect-ratio` containing `2/3` and `object-position: top` (via `page.evaluate`)
  - Take screenshot for visual verification
- [x] **Scenario 2: Selections persist across navigation**
  - Choose "Head & Shoulders" + "Bottom", save card, navigate to MY CARDS, click Edit
  - Verify frame type shows "Head & Shoulders" and crop focus shows "Bottom" (real localStorage)

---

### Task 18: Nationality Flag Display

Allow the card to optionally show the player's nationality as a flag image, plain text, or both — chosen per card. The flag is sourced from [flagcdn.com](https://flagcdn.com) and resolved via a lookup table that maps Football-Data.org country codes to their corresponding ISO / subdivision codes.

#### Subtask 18.1: Backend — Expose `country_code`

- [x] Add `country_code: str | None = None` to the `Nation` Pydantic model in `app/api/models.py`
- [x] Include `country_code` (from Football-Data.org `countryCode` field) in the `/api/v1/nations` response in `app/services/football_api.py`
- [x] Add `country_code` values (FIFA codes) to mock nations in `app/services/test_data.py`
- [x] Update `docs/API_CONTRACT.md` nations section to document the new field
- [x] Update `tests/unit/test_football_api.py` to assert `country_code` is returned

#### Subtask 18.2: Frontend — Flag URL Utility

- [x] Create `src/utils/flags.ts` with `getFlagUrl(countryCode: string | undefined): string | null`
- [x] Lookup table maps ~80 Football-Data.org codes to `flagcdn.com` path segments
- [x] UK constituent nations map to subdivision codes: ENG → `gb-eng`, SCO → `gb-sct`, WAL → `gb-wls`, NIR → `gb-nir`
- [x] Returns `null` for unknown or empty codes (flag silently absent)
- [x] Flag URL format: `https://flagcdn.com/w40/{code}.png`
- [x] Create `src/utils/flags.test.ts` with 9 unit tests (known codes, case-insensitive, unknown/undefined → null)

#### Subtask 18.3: Frontend — State & API

- [x] Add `country_code?: string` to `Nationality` interface in `src/services/api.ts` (snake_case, matching backend convention)
- [x] Export `NationalityDisplay = 'text' | 'flag' | 'both'` type from `src/context/CardContext.tsx`
- [x] Add `nationalityCode: string` and `nationalityDisplay: NationalityDisplay` to `CardState` (defaults: `''` and `'text'`)

#### Subtask 18.4: Frontend — CardForm

- [x] Nationality `Select` `onChange` now stores both `nationality` (name) and `nationalityCode` (from `country_code`)
- [x] If a nationality with no known flag is chosen while display mode is `'flag'` or `'both'`, auto-reset `nationalityDisplay` to `'text'`
- [x] Add a **Text / Flag / Both** `ToggleButtonGroup` below the nationality select; only shown when a nationality is selected
- [x] Flag and Both buttons are disabled (with tooltip) when the selected nationality has no resolvable flag URL
- [x] Toggle wrapped in `<fieldset>` / `<legend>` for semantic grouping; each button has a descriptive `aria-label`
- [x] `data-testid="nationality-display-selector"` on the group

#### Subtask 18.5: Frontend — Card Rendering

- [x] Update `src/components/CardPreview.tsx` to render flag image (`width: 24px`) and/or nationality text based on `nationalityDisplay`
- [x] Update `src/components/PrintableCard.tsx` with the same logic (`width: 18px` for the smaller print format)
- [x] Graceful fallback: if `getFlagUrl` returns `null` at render time, always show text regardless of display mode
- [x] Flag `<img>` has descriptive `alt` text (`"{nationality} flag"`) and `data-testid="nationality-flag"`

#### Subtask 18.6: Tests

- [x] `src/utils/flags.test.ts` — 9 unit tests for the utility
- [x] `src/components/CardPreview.test.tsx` — 7 new tests in `describe('nationality flag display')`:
  text-only, flag-only, both, fallback for unknown code, alt text, jest-axe for flag-only and both modes
- [x] `src/components/CardForm.test.tsx` — 6 new tests in `describe('Nationality flag display mode')`:
  toggle hidden before selection, toggle appears after selection, correct `aria-label` on each button, Flag mode hides text, Both mode shows both, Flag/Both disabled when no flag available, jest-axe with toggle visible
- [x] `src/services/storage.test.ts` — fixture updated to include `nationalityCode` and `nationalityDisplay`

> **Note:** The `country_code` field uses snake_case (matching backend convention and the existing `league_id`/`league_name` fields) — the frontend `Nationality` interface must match exactly, not use camelCase `countryCode`.

---

## Notes

- **Phase 2 (Backend)** should be completed before heavy frontend development - ensure API endpoints are ready for integration
- **Design System:** Leverage Material-UI theming to maintain consistency across all components
- **State Management:** Keep CardContext lightweight; consider Redux/Zustand if complexity increases beyond MVP scope
- **Testing:** Aim for pyramid approach - many unit tests, fewer integration tests, minimal E2E tests
- **Accessibility:** Material-UI components have built-in a11y support; verify all custom components follow WCAG guidelines
- **Browser Storage:** Document localStorage limitations (size, cross-tab sync, data persistence in private browsing)
