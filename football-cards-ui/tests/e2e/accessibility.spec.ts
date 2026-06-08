import { test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import {
  clearBrowserStorage,
  checkA11y,
  createTestCardInStorage,
} from './base/helpers/test-helpers';

test.describe('Accessibility — axe scan across all major app states', () => {
  test.beforeEach(async ({ page, testBase }) => {
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@a11y card creator form — initial empty state', async ({ page }) => {
    const creator = new CardCreatorPage(page);
    await creator.waitForFormReady();
    await checkA11y(page);
  });

  test('@a11y card creator form — all fields populated', async ({ page }) => {
    const creator = new CardCreatorPage(page);
    await creator.fillCardForm({
      name: 'Test Player',
      nationality: 'England',
      position: 'Forward',
      club: 'Arsenal',
      league: 'Premier League',
    });
    await checkA11y(page);
  });

  test('@a11y card gallery — with at least one saved card', async ({
    page,
    testBase,
  }) => {
    test.slow();
    await createTestCardInStorage(page);
    await page.reload();
    await testBase.waitForAppReady();
    await page.getByRole('tab', { name: /my cards/i }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await checkA11y(page);
  });

  test('@a11y print preview tab', async ({ page }) => {
    await page.getByRole('tab', { name: /print preview/i }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await checkA11y(page);
  });

  test('@a11y print formatter (multi-card) tab — with saved card', async ({
    page,
    testBase,
  }) => {
    test.slow();
    await createTestCardInStorage(page);
    await page.reload();
    await testBase.waitForAppReady();
    await page.getByRole('tab', { name: /print cards/i }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await checkA11y(page);
  });
});
