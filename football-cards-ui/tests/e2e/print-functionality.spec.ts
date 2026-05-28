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

test.describe('PrintFormatter — Multi-Card', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('shows empty state when no cards saved', async ({ page }) => {
    await page.getByRole('tab', { name: /print cards/i }).click();
    await expect(page.getByText(/no saved cards to print/i)).toBeVisible();
  });

  test('shows card selection grid after saving a card', async ({ page }) => {
    await cardCreator.fillCardForm({
      name: 'Formatter Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();

    await page.getByRole('tab', { name: /print cards/i }).click();
    await expect(page.getByText('Formatter Player')).toBeVisible();
  });

  test('selecting a card enables the Print Selected button', async ({
    page,
  }) => {
    await cardCreator.fillCardForm({
      name: 'Formatter Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();

    await page.getByRole('tab', { name: /print cards/i }).click();
    await page.waitForLoadState('networkidle');

    const printBtn = page.getByTestId('print-selected-button');
    await expect(printBtn).toBeDisabled();

    // Select the card via its aria-label checkbox
    const checkbox = page
      .getByRole('checkbox', { name: /select formatter player/i })
      .first();
    await checkbox.click();
    await expect(printBtn).not.toBeDisabled();
  });

  test('A4 sheet is visible under print media after selecting a card', async ({
    page,
  }) => {
    await cardCreator.fillCardForm({
      name: 'Formatter Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();

    await page.getByRole('tab', { name: /print cards/i }).click();
    await page.waitForLoadState('networkidle');

    const checkbox = page
      .getByRole('checkbox', { name: /select formatter player/i })
      .first();
    await checkbox.click();

    // Add print-formatter class to body to simulate what the Print handler does,
    // then apply print media — the A4 sheet should become visible
    await page.evaluate(() => document.body.classList.add('print-formatter'));
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('.print-a4-sheet').first()).toBeVisible();
    await expect(page.locator('.print-formatter-output')).toBeVisible();

    await page.screenshot({
      path: 'test-results/screenshots/print-formatter-layout.png',
      fullPage: true,
    });

    // Restore
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() =>
      document.body.classList.remove('print-formatter'),
    );
  });

  test('layout selector renders all options (1, 2, 4, 6)', async ({ page }) => {
    await cardCreator.fillCardForm({
      name: 'Formatter Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();

    await page.getByRole('tab', { name: /print cards/i }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('layout-option-1')).toBeVisible();
    await expect(page.getByTestId('layout-option-2')).toBeVisible();
    await expect(page.getByTestId('layout-option-4')).toBeVisible();
    await expect(page.getByTestId('layout-option-6')).toBeVisible();
  });
});
