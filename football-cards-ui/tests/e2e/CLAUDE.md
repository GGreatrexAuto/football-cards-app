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
    await page.click('[data-testid="club-select"] [role="combobox"]');
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
await page.click('[data-testid="club-select"] [role="combobox"]');   // open MUI dropdown
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

## Accessibility in E2E Tests

E2E tests are the right place to verify accessibility that can only be proven in a real browser: axe violations under real DOM, and keyboard-only user journeys.

**Canonical axe spec**: `accessibility.spec.ts` covers all five major app states with a dedicated axe scan each. This is the regression gate for new violations — do not remove or weaken these tests. Run it in isolation with:
```bash
npx playwright test accessibility.spec.ts --project=chromium
npx playwright test --grep "@a11y"   # tag-filtered run (all browsers)
```

**`@a11y` tag convention**: Prefix the test title with `@a11y` to opt the test into the `--grep "@a11y"` filter. This mirrors the `@smoke` convention already used in `card-creation.spec.ts`.

**axe-playwright** (`@axe-core/playwright`) is installed as a dev dependency. Always import `checkA11y` from the shared helper — do not construct `AxeBuilder` directly in tests:

```typescript
import { checkA11y } from './base/helpers/test-helpers';

// After the page has settled, run axe
await creator.waitForFormReady();
await checkA11y(page);
```

The helper already disables the 4 pre-existing violations (`region`, `landmark-one-main`, `color-contrast`, `heading-order`) so tests only fail on *new* regressions.

**Keyboard-only test pattern** — use `page.keyboard` instead of `page.click`/`page.fill` to simulate a mouse-free journey:

```typescript
await page.keyboard.press('Tab');           // move focus
await page.keyboard.type('Player Name');    // type into focused input
await page.keyboard.press('Enter');         // activate focused button/dropdown
await page.keyboard.press('ArrowDown');     // navigate dropdown options
await page.keyboard.press('Space');         // toggle a button
```

## Performance Tests

`performance.spec.ts` captures Core Web Vitals on the initial app load and asserts they meet budget thresholds:

| Metric | Threshold | Baseline (10-run max) |
|--------|-----------|----------------------|
| LCP (Largest Contentful Paint) | < 1600 ms | 1224 ms |
| FCP (First Contentful Paint) | < 1600 ms | 1224 ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.0000 |

Thresholds are set at ~25% above the worst observed value from 10 serial local runs against the dev server.

These tests are **Chromium-only** — the `largest-contentful-paint` and `layout-shift` PerformanceObserver entry types are only available in Chromium. On Firefox and WebKit the tests are automatically skipped (not failed).

```bash
# Run performance tests (both servers must be running)
npx playwright test --grep "@performance" --project=chromium

# Run multiple times to observe variance before tightening thresholds
npx playwright test performance.spec.ts --project=chromium --repeat-each=5
```

**`@performance` tag convention**: Prefix the test title (or `describe` block) with `@performance` to opt it into the `--grep "@performance"` filter. This mirrors the `@smoke` and `@a11y` conventions.

Performance tests are **excluded from the main CI E2E job** (`--grep-invert "@performance"`) to avoid flaky timing assertions on shared CI runners. Run them locally or on-demand to calibrate thresholds.

**Threshold calibration**: After any significant frontend change, run the test several times and confirm the highest observed values still sit comfortably below the thresholds. If thresholds need updating, set them to ~20% above the highest measured value.

---

## Checklist for New E2E Tests

- [ ] File ends with `.spec.ts`
- [ ] Uses `test.beforeEach` for `page.goto('/')`
- [ ] Selectors use `aria-label` or `role` — not class names
- [ ] Async operations use `await expect(...).toBeVisible()` (not arbitrary sleeps)
- [ ] Tests are independent — don't rely on order or shared state
- [ ] Both servers confirmed running before test run
- [ ] **A11y**: call `checkA11y(page)` after the page settles in critical-path tests
- [ ] **A11y**: new user journeys — consider a keyboard-only variant or assert `role="alert"` on success/error feedback
