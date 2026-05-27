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

    // Verify the CardPreview element actually renders with the persisted font-family CSS
    await expect(page.locator('[data-testid="player-name-text"]')).toHaveCSS(
      'font-family',
      /Poppins/,
    );
  });

  test('print mode renders card with custom player-name font applied', async ({
    page,
  }) => {
    // Wait for font selector and explicitly choose Playfair Display
    await page.waitForSelector(
      '[data-testid="font-selector-player-name-font"]',
    );
    await page.click(
      '[data-testid="font-selector-player-name-font"] [role="combobox"]',
    );
    await page.click('[data-testid="font-option-playfair-display"]');

    await cardCreator.fillCardForm({
      name: 'Print Font Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Navigate to Print Preview tab — PrintableCard only renders when this tab is active
    await page.click('text=Print Preview');
    await expect(page.locator('[data-testid="printable-card"]')).toBeVisible();

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    // Assert the PrintableCard player name element has the correct font-family
    await expect(
      page
        .locator('[data-testid="printable-card"]')
        .locator('[data-testid="player-name-text"]'),
    ).toHaveCSS('font-family', /Playfair Display/);

    // Take screenshot of the print layout for visual record
    await page.screenshot({ path: 'test-results/print-font-playfair.png' });

    // Restore to screen media and verify the card is still visible normally
    await page.emulateMedia({ media: 'screen' });
    await expect(page.locator('[data-testid="printable-card"]')).toBeVisible();
  });
});
