# Phase 3: Frontend Implementation - Todo List

**Project:** Football Cards Application  
**Role:** Senior Frontend Developer  
**Phase:** 3 (Frontend Implementation) - Tasks 10-12  
**Created:** March 22, 2026

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
- [ ] Test that card background applies correctly
- [x] Test that player photo displays
- [ ] Test responsive styling on different screen sizes
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
- [ ] Test updating card background
- [ ] Test updating player photo
- [x] Use React Testing Library for component integration
- [x] Aim for 90%+ coverage of user flows

### Subtask 12.8: E2E Tests - Full Card Creation Journey (Playwright)
- [ ] **Scenario 1: Full Card Creation & Save**
  - [ ] Navigate to app
  - [ ] Enter player name
  - [ ] Select club from dropdown
  - [ ] Select nationality from dropdown
  - [ ] Select league from dropdown
  - [ ] Select position from dropdown
  - [ ] Click randomize stats button
  - [ ] Verify stats populated with random values
  - [ ] Upload player photo
  - [ ] Select card background
  - [ ] Click Save button
  - [ ] Verify success message
  - [ ] Verify card appears in preview

### Subtask 12.9: E2E Tests - Card Gallery & Loading (Playwright)
- [ ] **Scenario 2: View & Load Saved Card**
  - [ ] Create and save a test card (from Scenario 1)
  - [ ] Navigate to "My Cards" gallery
  - [ ] Verify card displays in gallery
  - [ ] Click Edit button on card
  - [ ] Verify card data loads back into form
  - [ ] Modify one field (e.g., name)
  - [ ] Save card again
  - [ ] Verify changes persisted

### Subtask 12.10: E2E Tests - Print Functionality (Playwright)
- [ ] **Scenario 3: Print a Card**
  - [ ] Create and save a test card
  - [ ] Click Print button
  - [ ] Verify print dialog opens (intercept window.print)
  - [ ] Take screenshot of print preview
  - [ ] Verify card dimensions are correct
  - [ ] Verify only card is visible (form hidden)

### Subtask 12.11: E2E Tests - Edge Cases & Error Handling (Playwright)
- [ ] Test with very long player names
- [ ] Test with special characters in player name
- [ ] Test with missing/invalid image URLs
- [ ] Test with network errors during API calls
- [ ] Test with localStorage full (quota exceeded)
- [ ] Test deleting card from gallery
- [ ] Test rapid clicking of buttons

### Subtask 12.12: Performance & Accessibility Testing
- [ ] Verify component render performance (no unnecessary rerenders)
- [ ] Test keyboard navigation through form fields
- [ ] Test tab order is logical
- [ ] Add ARIA labels to form inputs
- [ ] Add alt text to images
- [ ] Test with screen reader (e.g., NVDA)
- [ ] Verify color contrast meets WCAG standards
- [ ] Test application on slow network (Playwright throttling)

### Subtask 12.13: Test Documentation
- [ ] Document test setup and how to run tests
- [ ] Document mocking strategy for external services
- [ ] Create test data fixtures
- [ ] Document expected test coverage targets
- [ ] Create README with testing best practices

---

## Cross-Cutting Concerns

### Code Quality
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
- [ ] Verify localStorage support
- [ ] Test print functionality across browsers

---

## Deployment Readiness

- [ ] Build production bundle (`npm run build`)
- [ ] Test production build locally
- [ ] Optimize static assets
- [ ] Create deployment documentation
- [ ] Setup CI/CD pipeline for automated builds and tests (Phase 4)
- [ ] Plan hosting strategy (static hosting, CDN, etc.)

---

## Notes

- **Phase 2 (Backend)** should be completed before heavy frontend development - ensure API endpoints are ready for integration
- **Design System:** Leverage Material-UI theming to maintain consistency across all components
- **State Management:** Keep CardContext lightweight; consider Redux/Zustand if complexity increases beyond MVP scope
- **Testing:** Aim for pyramid approach - many unit tests, fewer integration tests, minimal E2E tests
- **Accessibility:** Material-UI components have built-in a11y support; verify all custom components follow WCAG guidelines
- **Browser Storage:** Document localStorage limitations (size, cross-tab sync, data persistence in private browsing)
