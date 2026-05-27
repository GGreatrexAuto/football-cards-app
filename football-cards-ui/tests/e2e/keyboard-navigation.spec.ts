import { expect, test } from './base/test-base';
import { clearBrowserStorage } from './base/helpers/test-helpers';

// This test proves the full create-and-save journey is completable without a
// mouse. No page.click() or page.fill() are used — only page.keyboard and
// locator.press().
//
// locator.press(key) focuses the element and dispatches the key directly to
// it, guaranteeing delivery regardless of which element currently owns global
// focus. This is the correct Playwright pattern for keyboard accessibility
// testing.
//
// MUI Select renders a div[role="combobox"] with a stable HTML id (e.g.
// id="club-select"). We target those IDs directly so that the selector
// uniquely resolves to one element even when other comboboxes are present on
// the page (e.g. font-picker comboboxes in the design panel).
//
// MUI Select keyboard interaction (per ARIA authoring spec):
//   ArrowDown — opens the listbox and moves to the first option
//   Enter      — selects the focused option and closes the listbox

test.describe('Keyboard-Only Journey — Create and View a Card', () => {
  test.beforeEach(async ({ page, testBase }) => {
    await clearBrowserStorage(page);
    await testBase.gotoApp();
    await page
      .waitForSelector('[data-testid="form-loading"]', {
        state: 'hidden',
        timeout: 15000,
      })
      .catch(() => {});
    await page.waitForLoadState('networkidle');
  });

  test('complete create-and-save journey using keyboard only', async ({
    page,
  }) => {
    // --- Player Name ---
    await page.getByRole('textbox', { name: /player name/i }).focus();
    await page.keyboard.type('Keyboard Test Player');

    // --- Club ---
    // Use the stable HTML id on the MUI Select combobox div to avoid ambiguity
    // with other comboboxes (e.g. font-picker selects) on the same page.
    await page.locator('#club-select').press('ArrowDown');
    await expect(page.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('Enter');

    // --- League ---
    await page.locator('#league-select').press('ArrowDown');
    await expect(page.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('Enter');

    // --- Nationality ---
    await page.locator('#nationality-select').press('ArrowDown');
    await expect(page.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('Enter');

    // --- Position ---
    await page.locator('#position-select').press('ArrowDown');
    await expect(page.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('Enter');

    // --- Randomize Stats ---
    await page.getByRole('button', { name: /randomize stats/i }).press('Enter');

    // --- Save Card ---
    await page.getByRole('button', { name: /save card/i }).press('Enter');

    // Success Snackbar must carry role="alert" so screen readers announce it
    await expect(page.getByRole('alert')).toBeVisible();

    // --- Navigate to MY CARDS via keyboard ---
    // MUI Tabs uses manual-activation by default (no selectionFollowsFocus prop).
    // ArrowRight/ArrowLeft move focus between tabs; Enter/Space then activates the
    // focused tab and reveals its panel. Two keyboard operations are therefore needed:
    //   1. ArrowRight  — moves focus from Create Card → My Cards
    //   2. keyboard.press('Enter') — activates the focused My Cards tab
    await page.getByRole('tab', { name: /create card/i }).press('ArrowRight');
    await page.keyboard.press('Enter');

    // Assert the saved card appears in the gallery without any mouse interaction
    await expect(page.getByText('Keyboard Test Player')).toBeVisible();
  });
});
