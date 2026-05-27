import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage, checkA11y } from './base/helpers/test-helpers';

// These 3 tests cover what component-level tests with mocked services cannot prove:
// 1. Real backend API responses populate dropdowns
// 2. Real localStorage survives a browser page reload
// 3. No console.error calls during a real browser journey

test.describe('Critical Paths — Real Browser + Real Backend', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('real backend API data populates all dropdowns', async ({ page }) => {
    // Wait for the form to finish loading API data
    await page.waitForLoadState('networkidle');
    await checkA11y(page);

    // Each dropdown must have at least one real option from the backend
    const clubOptions = page.locator('[aria-label="Club"]');
    await clubOptions.click();
    const clubItems = page.locator('[role="option"]');
    await expect(clubItems.first()).toBeVisible();
    const clubCount = await clubItems.count();
    expect(clubCount).toBeGreaterThan(0);
    await page.keyboard.press('Escape');

    const nationalityOptions = page.locator('[aria-label="Nationality"]');
    await nationalityOptions.click();
    const nationalityItems = page.locator('[role="option"]');
    await expect(nationalityItems.first()).toBeVisible();
    expect(await nationalityItems.count()).toBeGreaterThan(0);
    await page.keyboard.press('Escape');

    const leagueOptions = page.locator('[aria-label="League"]');
    await leagueOptions.click();
    const leagueItems = page.locator('[role="option"]');
    await expect(leagueItems.first()).toBeVisible();
    expect(await leagueItems.count()).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
  });

  test('saved card survives a full page reload', async ({ page }) => {
    // Create and save a card
    await cardCreator.fillCardForm({
      name: 'Reload Test Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Fully reload the browser — this re-initialises JS, context, and re-reads localStorage
    await page.reload();
    await page.waitForLoadState('networkidle');
    await checkA11y(page);

    // Navigate to My Cards and confirm the card is still there
    await page.getByRole('tab', { name: /my cards/i }).click();
    await page.waitForLoadState('networkidle');
    await checkA11y(page);

    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].playerName).toBe('Reload Test Player');
  });

  test('no console errors during the full create-and-view journey', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Complete the full journey: load → fill form → save → navigate to gallery
    await page.waitForLoadState('networkidle');
    await checkA11y(page);

    await cardCreator.fillCardForm({
      name: 'Console Check Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    await page.getByRole('tab', { name: /my cards/i }).click();
    await page.waitForLoadState('networkidle');
    await checkA11y(page);

    expect(consoleErrors).toHaveLength(0);
  });
});
