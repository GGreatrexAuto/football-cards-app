# E2E Testing Guide

This directory contains end-to-end tests for the Football Cards application using Playwright.

## 🏗️ Test Framework Structure

```
tests/e2e/
├── base/                          # Shared test infrastructure
│   ├── fixtures/                  # Test data and API mocks
│   │   ├── api-mock-data.ts       # Mock API responses
│   │   └── test-data.ts           # Sample test data
│   ├── helpers/                   # Utility functions
│   │   ├── cleanup-helpers.ts     # Test cleanup utilities
│   │   └── test-helpers.ts        # General test helpers
│   ├── page-objects/              # Page Object Models
│   │   ├── CardCreatorPage.ts     # Card creation page
│   │   ├── CardGalleryPage.ts     # Gallery view page
│   │   ├── CardPreviewPage.ts     # Card preview page
│   │   └── NavigationPage.ts      # Navigation page
│   └── test-base.ts               # Base test class
├── global-setup.ts                # Global test setup
├── global-teardown.ts             # Global test teardown
└── *.spec.ts                      # Test files
```

## 🚀 Running Tests

### Prerequisites

1. **Backend API**: Ensure the FastAPI backend is running on `http://localhost:8000` before starting E2E tests. Playwright only launches the frontend app.
2. **Frontend**: The React app will be started automatically by Playwright.
3. **Dependencies**: Install Playwright browsers if not already installed:
   ```bash
   cd football-cards-ui
   npx playwright install
   ```

### Run All Tests

```bash
cd football-cards-ui
npm run test:e2e
```

### Run Specific Tests

```bash
# Run tests in a specific file
npx playwright test card-creation.spec.ts

# Run tests with a specific tag
npx playwright test --grep "@smoke"

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in a specific browser
npx playwright test --project=chromium
```

### Debug Tests

```bash
# Run tests in debug mode
npx playwright test --debug

# Run a specific test in debug mode
npx playwright test card-creation.spec.ts --debug
```

## 📊 Test Reports

After running tests, reports are generated in:

- **HTML Report**: `football-cards-ui/playwright-report/index.html`
- **JSON Results**: `football-cards-ui/test-results.json`
- **Screenshots**: `football-cards-ui/test-results/screenshots/` (on failure)
- **Videos**: `football-cards-ui/test-results/videos/` (on failure)
- **Traces**: `football-cards-ui/test-results/` (for debugging)

## 🏷️ Test Tags

Use tags to organize and filter tests:

- `@smoke` - Critical path tests
- `@regression` - Regression tests
- `@slow` - Tests that take longer than 30 seconds

Example:
```typescript
test.describe('Card Creation', () => {
  test('@smoke should create a basic card', async ({ testBase }) => {
    // Test implementation
  });
});
```

## 📝 Writing Tests

### Test Structure

```typescript
import { test } from '../base/test-base';
import { CardCreatorPage } from '../base/page-objects/CardCreatorPage';
import { SAMPLE_PLAYERS } from '../base/fixtures/test-data';

test.describe('Card Creation', () => {
  test('should create a card successfully', async ({ page, testBase }) => {
    // Arrange
    const cardCreator = new CardCreatorPage(page);
    await testBase.gotoApp();

    // Act
    await cardCreator.fillCardForm(SAMPLE_PLAYERS.TEST_PLAYER);
    await cardCreator.saveCard();

    // Assert
    await expect(cardCreator.isSuccessMessageVisible()).toBeTruthy();
  });
});
```

### Page Objects

Use the provided Page Object Models for consistent element interaction:

- `NavigationPage` - App navigation
- `CardCreatorPage` - Card creation form
- `CardGalleryPage` - Card gallery view
- `CardPreviewPage` - Card preview

### Test Data

Use predefined test data from fixtures:

```typescript
import { SAMPLE_PLAYERS, generateRandomCardData } from '../base/fixtures/test-data';

// Use predefined data
const player = SAMPLE_PLAYERS.CRISTIANO_RONALDO;

// Generate random data
const randomPlayer = generateRandomCardData();
```

### Helpers

Common test utilities:

```typescript
import {
  waitForAppReady,
  clearBrowserStorage,
  mockApiResponse
} from '../base/helpers/test-helpers';

// Wait for app readiness
await waitForAppReady(page);

// Clear storage between tests
await clearBrowserStorage(page);

// Mock API responses
await mockApiResponse(page, '/api/v1/clubs', { data: mockClubs });
```

## 🔧 Configuration

### Environment Variables

Create a `.env.test` file in `football-cards-ui/` for test-specific configuration:

```env
# Backend API
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1

# Playwright settings
PLAYWRIGHT_BASE_URL=http://localhost:3000
PLAYWRIGHT_RETRIES=0
PLAYWRIGHT_WORKERS=2

# Browser settings
BROWSER_HEADLESS=true
BROWSER_SLOW_MO=0
```

### Playwright Config

The main configuration is in `football-cards-ui/playwright.config.ts`. Key settings:

- **Browsers**: Chromium, Firefox, WebKit
- **Timeouts**: 30s test timeout, 10s expect timeout
- **Retries**: 2 on CI, 0 locally
- **Parallel**: 2 workers locally, 1 on CI
- **Reports**: HTML, JSON, JUnit

## 🐛 Debugging

### Common Issues

1. **Tests timing out**: Increase timeouts in `playwright.config.ts`
2. **Elements not found**: Check data-testid attributes in components
3. **API calls failing**: Ensure backend is running or use mocks
4. **Flaky tests**: Add proper waits and retries

### Debugging Tools

1. **Traces**: Enable with `trace: 'on-first-retry'` in config
2. **Screenshots**: Automatic on failure
3. **Videos**: Enable with `video: 'retain-on-failure'`
4. **Debug mode**: `npx playwright test --debug`

### Visual Debugging

```typescript
// Take screenshot for debugging
await page.screenshot({ path: 'debug-screenshot.png' });

// Pause execution for manual inspection
await page.pause();
```

## 📈 Best Practices

### Test Isolation

- Each test should be independent
- Clear storage between tests
- Use unique test data
- Avoid test interdependencies

### Page Objects

- Encapsulate element selectors
- Provide fluent APIs
- Handle common interactions
- Keep selectors maintainable

### Assertions

- Use descriptive assertion messages
- Prefer `toBeVisible()` over manual checks
- Wait for elements before asserting
- Use appropriate expect matchers

### Performance

- Keep tests focused and fast
- Use `test.skip()` for broken tests
- Parallel execution for speed
- Tag slow tests appropriately

## 🔄 CI/CD Integration

For CI pipelines, set these environment variables:

```env
CI=true
PLAYWRIGHT_RETRIES=2
PLAYWRIGHT_WORKERS=1
BROWSER_HEADLESS=true
```

The configuration automatically adjusts for CI environments with more retries and sequential execution.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Page Object Model Pattern](https://playwright.dev/docs/test-pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Debugging Tests](https://playwright.dev/docs/debug)