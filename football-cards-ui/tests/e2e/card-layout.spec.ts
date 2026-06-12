import { expect, test } from './base/test-base';
import { clearBrowserStorage } from './base/helpers/test-helpers';

test.describe('Card Layout', () => {
  test.beforeEach(async ({ page, testBase }) => {
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@smoke selecting Stats Bottom layout moves stats below the rating badge in the preview', async ({
    page,
  }) => {
    const preview = page.locator('[data-testid="card-preview"]');

    // Default layout: stats-section precedes rating-section
    const statsSectionDefault = preview.locator('[data-testid="stats-section"]');
    const ratingSectionDefault = preview.locator('[data-testid="rating-section"]');
    await expect(statsSectionDefault).toBeVisible();
    await expect(ratingSectionDefault).toBeVisible();

    const defaultOrder = await preview.evaluate((el) => {
      const stats = el.querySelector('[data-testid="stats-section"]');
      const rating = el.querySelector('[data-testid="rating-section"]');
      if (!stats || !rating) return null;
      return !!(
        rating.compareDocumentPosition(stats) & Node.DOCUMENT_POSITION_PRECEDING
      );
    });
    expect(defaultOrder).toBe(true);

    // Switch to Stats Bottom layout
    await page.getByRole('button', { name: /Stats bottom layout/i }).click();

    // stats-section should now follow rating-section
    const statsBottomOrder = await preview.evaluate((el) => {
      const stats = el.querySelector('[data-testid="stats-section"]');
      const rating = el.querySelector('[data-testid="rating-section"]');
      if (!stats || !rating) return null;
      return !!(
        rating.compareDocumentPosition(stats) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
    expect(statsBottomOrder).toBe(true);
  });

  test('@smoke selecting Large Photo layout renders a wider photo than default', async ({
    page,
  }) => {
    const preview = page.locator('[data-testid="card-preview"]');

    // Set a player photo so the <img> renders (not the Avatar fallback)
    await page.getByRole('button', { name: /Portrait of a male/i }).click();

    const defaultMaxWidth = await preview.evaluate((el) => {
      const img = el.querySelector('[data-testid="player-photo"]') as HTMLImageElement | null;
      return img ? img.style.maxWidth : null;
    });

    // Switch to Large Photo
    await page.getByRole('button', { name: /Large photo layout/i }).click();

    const largeMaxWidth = await preview.evaluate((el) => {
      const img = el.querySelector('[data-testid="player-photo"]') as HTMLImageElement | null;
      return img ? img.style.maxWidth : null;
    });

    expect(defaultMaxWidth).toBe('120px');
    expect(largeMaxWidth).toBe('180px');
  });

  test('cardLayout is persisted to localStorage when the card is saved', async ({
    page,
  }) => {
    // Select Stats Bottom layout then save
    await page.getByRole('button', { name: /Stats bottom layout/i }).click();
    await page.fill('input[aria-label="Player Name"]', 'Layout Persist Test');
    await page.getByRole('button', { name: /Save Card/i }).click();

    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardLayout).toBe('statsBottom');
  });
});
