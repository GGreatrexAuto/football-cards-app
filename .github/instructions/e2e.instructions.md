---
name: e2e-playwright
description: "Use when: writing end-to-end tests in football-cards-ui/tests/e2e/ - Playwright test syntax, selectors, user workflows, assertions. IMPORTANT: E2E tests require real backend running"
applyTo: "football-cards-ui/tests/e2e/**"
---

# E2E Tests (Playwright) Context

## 📍 Scope
This applies to end-to-end tests in `football-cards-ui/tests/e2e/` using Playwright test framework.

---

## ⚠️ CRITICAL: E2E Tests Require Real Backend

**E2E tests are INTEGRATION tests** - they test the real interaction between frontend and backend.

### Before Running E2E Tests
1. **Backend must be running**:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Frontend must be running**:
   ```bash
   cd football-cards-ui
   npm start  # Runs on localhost:3000
   ```
3. **No service mocking** - all API calls are REAL
4. **Browser storage is REAL** - data persists across test runs

### Contrast with UI Tests
- **UI Tests** (`.test.tsx`): Use React Testing Library, mock all services, run without backend
- **E2E Tests** (`.spec.ts`): Use Playwright, REAL backend calls, test integration

For UI testing guidance, see [`.github/instructions/ui-testing.instructions.md`](./../ui-testing.instructions.md)

---

## BDD

E2E tests at this level use **Behavior-Driven Development (BDD)** principles to define features and scenarios in a human-readable format. This promotes collaboration between developers, testers, and non-technical stakeholders.

## 🎭 Playwright Overview

Playwright is a browser automation framework for **E2E testing**:
- Simulates real user interactions
- Tests full workflows across frontend and backend (both REAL)
- Supports multiple browsers (Chromium, Firefox, WebKit)
- Fast, reliable, cross-platform

### Directory Structure
```
football-cards-ui/tests/e2e/
├── card-creation.spec.ts    # E2E test file (.spec.ts)
└── [more .spec.ts files]
```

### File Naming
- Files end with `.spec.ts` (Playwright convention)
- Use descriptive names: `card-creation.spec.ts`, `card-gallery.spec.ts`

---

## 📝 Playwright Test Structure

### Basic Test File Template

**File: `football-cards-ui/tests/e2e/card-creation.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Card Creation Journey', () => {
  test('Full Card Creation & Save', async ({ page }) => {
    // 1. NAVIGATE
    await page.goto('/');

    // 2. INTERACT (fill forms, click buttons)
    await page.fill('input[aria-label="Player Name"]', 'Test Player');
    await page.click('[aria-label="Club"]');
    await page.click('text=Arsenal');

    // 3. ASSERT (verify outcomes)
    await expect(page.locator('text=Card saved successfully')).toBeVisible();
  });
});
```

### Test Structure Pattern
```typescript
test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Setup
    await page.goto('/');

    // Act
    await page.fill(selector, value);
    await page.click(selector);

    // Assert
    await expect(locator).toBeVisible();
  });
});
```

---

## 🔍 Selectors & Locators

### Selector Types
```typescript
// CSS selector
await page.click('button.submit-btn');

// XPath
await page.click('//button[@class="submit-btn"]');

// Text content
await page.click('text=Save Card');
await page.click('button:has-text("Save Card")');

// Role-based (best for accessibility)
await page.click('role=button[name="Save Card"]');

// aria-label (accessibility attribute)
await page.fill('input[aria-label="Player Name"]', 'Test');

// Test IDs (recommended for stable tests)
await page.click('data-testid=save-button');
```

### Best Practices for Selectors
1. **Prefer accessibility attributes**: `aria-label`, `role`, `aria-disabled`
2. **Use test IDs**: Add `data-testid` to critical elements
3. **Avoid brittle selectors**: Don't rely on class names or exact HTML structure
4. **Use `text=` for buttons/links**: Simple and readable

### Locators
Locators are reusable references:

```typescript
const playerNameInput = page.locator('input[aria-label="Player Name"]');
const saveButton = page.locator('button:has-text("Save Card")');

await playerNameInput.fill('Test Player');
await saveButton.click();
await expect(saveButton).toBeEnabled();
```

---

## 🖱️ User Interactions

### Common Actions
```typescript
// Navigation
await page.goto('/');
await page.goto('http://localhost:3000/cards/gallery');

// Form interactions
await page.fill('input[name="playerName"]', 'John Doe');
await page.check('input[type="checkbox"]');
await page.uncheck('input[type="checkbox"]');

// Dropdown/Select
await page.click('[aria-label="Club"]');  // Open dropdown
await page.click('text=Arsenal');         // Select option

// Clicks & Focus
await page.click('button');
await page.dblClick('button');
await page.click('button', { button: 'right' });  // Right-click

// Typing
await page.type('input[id="search"]', 'Test');
await page.press('input', 'Enter');

// Hover
await page.hover('button');

// Wait for navigation
await page.click('a[href="/gallery"]');
await page.waitForURL('**/gallery');
```

---

## ✅ Assertions

### Common Assertions
```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Value/Text
await expect(locator).toHaveValue('expected');
await expect(locator).toContainText('text');
await expect(locator).toHaveText('exact text');

// State
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();

// Count/Existence
await expect(locator).toHaveCount(3);
await expect(page.locator('button')).toHaveCount(5);

// URL/Page
await expect(page).toHaveURL('http://localhost:3000/gallery');
await expect(page).toHaveTitle('Football Cards');
```

### Error Messages in Assertions
```typescript
// Add custom error message
await expect(locator, 'Card should be saved').toBeVisible();
```

---

## ⏳ Waiting & Async Operations

### Automatic Waiting
Playwright automatically waits for elements:
```typescript
// Playwright waits up to 30s for element to appear
await page.click('button:has-text("Save")');
```

### Explicit Waits
```typescript
// Wait for specific element
await page.waitForSelector('button:has-text("Success")');

// Wait for function/condition
await page.waitForFunction(() => {
  return document.querySelectorAll('li').length > 3;
});

// Wait for navigation
await page.waitForURL('**/gallery');

// Wait for loading to finish
await page.waitForLoadState('networkidle');
```

### Handle Async Operations
```typescript
// Ensure element updates after async call
await page.click('button:has-text("Randomize Stats")');
const defenceValue = await page.inputValue('input[aria-label="Defence"]');
expect(parseInt(defenceValue)).toBeGreaterThanOrEqual(0);

// Use waitFor with check function
await expect(page.locator('.success-message')).toBeVisible({
  timeout: 5000,
});
```

---

## 🧪 Complete E2E Test Example

**File: `football-cards-ui/tests/e2e/card-creation.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Card Creation Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Run before each test
    await page.goto('http://localhost:3000');
  });

  test('Full Card Creation & Save', async ({ page }) => {
    // ===== FORM FILLING =====
    // Enter player name
    await page.fill('input[aria-label="Player Name"]', 'Test Player');

    // Select club from dropdown
    await page.click('[aria-label="Club"]');
    await page.click('text=Arsenal');

    // Select nationality
    await page.click('[aria-label="Nationality"]');
    await page.click('text=England');

    // Select league
    await page.click('[aria-label="League"]');
    await page.click('text=Premier League');

    // Select position
    await page.click('[aria-label="Position"]');
    await page.click('text=Forward');

    // ===== RANDOMIZE STATS =====
    await page.click('button:has-text("🎲 Randomize Stats")');

    // Verify stats are populated
    const defenceValue = await page.inputValue('input[aria-label="Defence"]');
    const controlValue = await page.inputValue('input[aria-label="Control"]');
    const attackValue = await page.inputValue('input[aria-label="Attack"]');

    expect(parseInt(defenceValue)).toBeGreaterThanOrEqual(0);
    expect(parseInt(defenceValue)).toBeLessThanOrEqual(100);
    expect(parseInt(controlValue)).toBeGreaterThanOrEqual(0);
    expect(parseInt(controlValue)).toBeLessThanOrEqual(100);
    expect(parseInt(attackValue)).toBeGreaterThanOrEqual(0);
    expect(parseInt(attackValue)).toBeLessThanOrEqual(100);

    // ===== SELECT PHOTO & BACKGROUND =====
    // Select stock photo
    const stockPhotos = page.locator('.stock-photo-card');
    await stockPhotos.first().click();

    // Select background
    await page.click('text=Classic Green');

    // ===== SAVE & VERIFY =====
    await page.click('button:has-text("Save Card")');

    // Verify success message
    await expect(
      page.locator('text=Card saved successfully'),
    ).toBeVisible();

    // Verify form resets
    const playerInput = page.locator('input[aria-label="Player Name"]');
    await expect(playerInput).toHaveValue('');
  });

  test('Display Card Preview While Creating', async ({ page }) => {
    // Fill form
    await page.fill('input[aria-label="Player Name"]', 'John Doe');

    // Verify preview updates in real-time
    const previewName = page.locator('.card-preview-name');
    await expect(previewName).toContainText('John Doe');
  });

  test('Show Validation Errors for Empty Fields', async ({ page }) => {
    // Try to save without filling form
    await page.click('button:has-text("Save Card")');

    // Expect validation error
    const errorMessage = page.locator('text=Player name is required');
    await expect(errorMessage).toBeVisible();
  });

  test('Load API Data and Populate Dropdowns', async ({ page }) => {
    // Wait for dropdown to populate from API
    await page.click('[aria-label="Club"]');
    await expect(page.locator('text=Arsenal')).toBeVisible();

    // Verify multiple options available
    const options = page.locator('[role="option"]');
    expect(await options.count()).toBeGreaterThan(0);
  });
});
```

---

## 🌐 Testing with Backend

### Full Integration Testing
```typescript
test('Create Card, Save, and Load from Gallery', async ({ page }) => {
  // Frontend: Create and save card
  await page.goto('http://localhost:3000');
  await page.fill('input[aria-label="Player Name"]', 'Test Player');
  await page.click('button:has-text("Save Card")');

  // Verify in local storage (via browser context)
  const storageData = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('football-cards') || '[]');
  });
  expect(storageData).toHaveLength(1);
  expect(storageData[0].playerName).toBe('Test Player');
});
```

### API & Frontend Interaction
```typescript
test('Backend API Returns Expected Data', async ({ page }) => {
  // Navigate and interact with UI
  await page.goto('http://localhost:3000');

  // Verify API call via Network tab
  const response = await page.waitForResponse(
    response => response.url().includes('/api/v1/clubs'),
  );
  expect(response.status()).toBe(200);

  const clubsData = await response.json();
  expect(clubsData).toBeInstanceOf(Array);
  expect(clubsData[0]).toHaveProperty('id');
  expect(clubsData[0]).toHaveProperty('name');
});
```

---

## ✅ Running E2E Tests

### Prerequisites
- Backend running: `uvicorn app.main:app --reload`
- Frontend running: `npm start`

### Run All E2E Tests
```bash
npm test  # From football-cards-ui/ directory
```

### Run Specific Test File
```bash
npm test -- card-creation.spec.ts
```

### Run with Headed Browser (see it happening)
```bash
npm test -- --headed
```

### Run in Debug Mode
```bash
npm test -- --debug
```

### Run Specific Test
```bash
npm test -- --grep "Full Card Creation"
```

---

## 📋 Quick Checklist

When writing an E2E test:
- [ ] Test file ends with `.spec.ts`
- [ ] Use accessibility selectors (`aria-label`, `role`) when possible
- [ ] Add custom `data-testid` attributes to critical elements
- [ ] Test real user workflows (not implementation details)
- [ ] Handle async operations with `waitFor` or `waitForSelector`
- [ ] Verify both UI state and expected outcomes
- [ ] Add descriptive test names
- [ ] Test error scenarios and edge cases
- [ ] Ensure backend and frontend are running
- [ ] Use `test.beforeEach` for common setup
- [ ] Keep tests isolated and independent
