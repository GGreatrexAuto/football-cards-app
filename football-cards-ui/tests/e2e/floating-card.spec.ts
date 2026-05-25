import { expect, test } from './base/test-base';
import { clearBrowserStorage } from './base/helpers/test-helpers';

test.describe('Floating card preview', () => {
  test.beforeEach(async ({ page, testBase }) => {
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@smoke card preview stays visible after scrolling to bottom of form', async ({
    page,
  }) => {
    // Wait for the form to fully load before scrolling
    await page.waitForSelector('input[aria-label="Player Name"]');

    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // The preview column must still be within the viewport (sticky behaviour)
    const previewColumn = page.getByTestId('card-preview-column');
    await expect(previewColumn).toBeInViewport();
  });

  test('card preview reflects changes made while scrolled down', async ({
    page,
  }) => {
    await page.waitForSelector('input[aria-label="Player Name"]');

    // Scroll past where the preview would normally disappear
    await page.evaluate(() => window.scrollTo(0, 600));

    // Update the player name while scrolled
    const nameInput = page.getByLabel(/player name/i);
    await nameInput.fill('Scrolled Player');

    // Preview column should still be in the viewport and show the new name
    const previewColumn = page.getByTestId('card-preview-column');
    await expect(previewColumn).toBeInViewport();
    await expect(page.getByText('Scrolled Player').first()).toBeVisible();
  });
});
