import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage } from './base/helpers/test-helpers';

test.describe('Image Frame Type & Crop Focus', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
    await page.waitForSelector('[data-testid="image-frame-type-selector"]');
  });

  test('@smoke Full Body frame type and Top crop focus render correct CSS in real browser', async ({
    page,
  }) => {
    // Select a stock photo so the <img> preview element is rendered
    await page.click('[data-testid="stock-photo-stock1"]');
    await page.waitForSelector('[data-testid="player-photo"]');

    // Select Full Body frame type
    await page.click(
      '[data-testid="image-frame-type-selector"] [aria-label="Full Body"]',
    );

    // Select Top crop focus (default, but explicit)
    await page.click(
      '[data-testid="image-crop-focus-selector"] [aria-label="Top"]',
    );

    // Verify CSS via computed styles in the real browser
    const photoLocator = page.locator('[data-testid="player-photo"]');
    await expect(photoLocator).toHaveCSS('aspect-ratio', '2 / 3');
    await expect(photoLocator).toHaveCSS('object-position', '50% 0%');

    await page.screenshot({ path: 'tests/e2e/screenshots/full-body-top.png' });
  });

  test('Head & Shoulders frame type with Bottom crop focus persists after save and edit', async ({
    page,
  }) => {
    // Select a stock photo
    await page.click('[data-testid="stock-photo-stock1"]');
    await page.waitForSelector('[data-testid="player-photo"]');

    // Select Head & Shoulders frame type
    await page.click(
      '[data-testid="image-frame-type-selector"] [aria-label="Head & Shoulders"]',
    );

    // Select Bottom crop focus
    await page.click(
      '[data-testid="image-crop-focus-selector"] [aria-label="Bottom"]',
    );

    // Fill required fields and save
    await cardCreator.fillCardForm({
      name: 'Frame Test Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
      randomizeStats: false,
    });

    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Navigate to My Cards and edit
    await page.click('text=My Cards');
    await expect(page.locator('text=Frame Test Player')).toBeVisible();
    await page.click('button:has-text("Edit")');

    // Verify the frame type and crop focus are restored
    await page.waitForSelector('[data-testid="image-frame-type-selector"]');

    const frameTypeSelector = page.locator(
      '[data-testid="image-frame-type-selector"] [aria-label="Head & Shoulders"]',
    );
    await expect(frameTypeSelector).toHaveAttribute('aria-pressed', 'true');

    const cropFocusSelector = page.locator(
      '[data-testid="image-crop-focus-selector"] [aria-label="Bottom"]',
    );
    await expect(cropFocusSelector).toHaveAttribute('aria-pressed', 'true');
  });
});
