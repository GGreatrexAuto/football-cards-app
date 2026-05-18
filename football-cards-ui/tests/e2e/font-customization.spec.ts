import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage } from './base/helpers/test-helpers';

test.describe('Font Customisation', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@smoke selecting a font updates the card preview', async ({ page }) => {
    await page.waitForSelector(
      '[data-testid="font-selector-player-name-font"]',
    );

    await page.click(
      '[data-testid="font-selector-player-name-font"] [role="combobox"]',
    );
    await page.click('[data-testid="font-option-montserrat"]');

    await expect(page.locator('[data-testid="player-name-text"]')).toHaveCSS(
      'font-family',
      /Montserrat/,
    );
  });

  test('font selection persists after saving and reloading a card', async ({
    page,
  }) => {
    await page.waitForSelector(
      '[data-testid="font-selector-player-name-font"]',
    );

    await page.click(
      '[data-testid="font-selector-player-name-font"] [role="combobox"]',
    );
    await page.click('[data-testid="font-option-poppins"]');

    await cardCreator.fillCardForm({
      name: 'Font Test Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });

    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    await page.click('text=My Cards');
    await expect(page.locator('text=Font Test Player')).toBeVisible();
    await page.click('button:has-text("Edit")');

    await page.waitForSelector(
      '[data-testid="font-selector-player-name-font"]',
    );
    const fontText = await page
      .locator(
        '[data-testid="font-selector-player-name-font"] [role="combobox"]',
      )
      .textContent();
    expect(fontText).toContain('Poppins');
  });
});
