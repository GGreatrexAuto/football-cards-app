# E2E Tests (Playwright) — Claude Code Context

Applies to Playwright tests under `football-cards-ui/tests/e2e/`.

## Critical Prerequisite

E2E tests are **real integration tests** — no mocking.

```bash
# Terminal 1 — backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — frontend
cd football-cards-ui && npm start

# Terminal 3 — run tests
cd football-cards-ui && npm run test:e2e
```

Both servers must be running. All API calls and localStorage operations are real.

## File Naming

Test files end with `.spec.ts`. Use descriptive names: `card-creation.spec.ts`, `card-gallery.spec.ts`.

## Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Card Creation Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('saves a card with all fields filled', async ({ page }) => {
    // 1. Act
    await page.fill('input[aria-label="Player Name"]', 'Test Player');
    await page.click('[aria-label="Club"]');
    await page.click('text=Arsenal');
    await page.click('button:has-text("Save Card")');

    // 2. Assert
    await expect(page.locator('text=Card saved successfully')).toBeVisible();
  });
});
```

## Selector Priority

Use in this order — avoid brittle class/structure selectors:

1. `input[aria-label="Player Name"]` — aria-label (best)
2. `role=button[name="Save Card"]` — role + accessible name
3. `text=Arsenal` / `button:has-text("Save Card")` — visible text
4. `data-testid=save-button` — testid (add to component when needed)

When adding new interactive elements to components, always add `aria-label` and/or `data-testid`.

## Common Actions

```typescript
// Navigation
await page.goto('/');
await page.waitForURL('**/gallery');

// Form
await page.fill('input[aria-label="Player Name"]', 'John Doe');
await page.click('[aria-label="Club"]');   // open MUI dropdown
await page.click('text=Arsenal');          // select option

// Assert
await expect(page.locator('text=Card saved')).toBeVisible();
await expect(page.locator('input[aria-label="Player Name"]')).toHaveValue('');
await expect(page.locator('[role="option"]')).toHaveCount(5);
```

## Async Handling

Playwright auto-waits up to 30s for elements. Use explicit waits when needed:

```typescript
await page.waitForSelector('button:has-text("Success")');
await page.waitForURL('**/gallery');
await page.waitForLoadState('networkidle');
```

## Reading localStorage in Tests

```typescript
const cards = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('football-cards') || '[]')
);
expect(cards).toHaveLength(1);
```

## Running Tests

```bash
# From football-cards-ui/
npm run test:e2e                          # all browsers
npm run test:e2e -- card-creation.spec.ts # specific file
npm run test:e2e -- --headed              # watch it run
npm run test:e2e -- --debug               # Playwright inspector
npm run test:e2e -- --grep "saves a card" # specific test
```

## Checklist for New E2E Tests

- [ ] File ends with `.spec.ts`
- [ ] Uses `test.beforeEach` for `page.goto('/')`
- [ ] Selectors use `aria-label` or `role` — not class names
- [ ] Async operations use `await expect(...).toBeVisible()` (not arbitrary sleeps)
- [ ] Tests are independent — don't rely on order or shared state
- [ ] Both servers confirmed running before test run
