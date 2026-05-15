import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage } from './base/helpers/test-helpers';

// NOTE: Print behaviour is not simulatable in React Testing Library. This spec is
// genuinely E2E — only a real browser can verify @media print CSS rules.

test.describe('Print Functionality', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('card content is visible and form is hidden under print media', async ({
    page,
  }) => {
    // Create a card so there is something to print
    await cardCreator.fillCardForm({
      name: 'Print Test Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.selectBackground('Classic Green');
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Navigate to Print Preview tab — PrintableCard is only mounted on this tab
    await page.getByRole('tab', { name: /print preview/i }).click();
    await page.waitForLoadState('networkidle');

    // Apply print media to trigger @media print CSS rules
    await page.emulateMedia({ media: 'print' });

    // PrintableCard should be visible under print CSS
    const printableCard = page.locator('.printable-card');
    await expect(printableCard).toBeVisible();

    // Navigation tabs use visibility:hidden under @media print — verify they are hidden
    const tabs = page.getByRole('tab', { name: /create card/i });
    await expect(tabs).toBeHidden();

    // Capture print layout for visual verification
    await page.screenshot({
      path: 'test-results/screenshots/print-layout.png',
      fullPage: true,
    });

    // Restore screen media — navigation should become visible again
    await page.emulateMedia({ media: 'screen' });
    await expect(tabs).toBeVisible();
  });
});
