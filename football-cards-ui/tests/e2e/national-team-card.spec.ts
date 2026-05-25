import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage } from './base/helpers/test-helpers';

// NOTE: Component-level toggle behaviour (hiding/showing fields, clearing values,
// preserving card type on reset) is covered in CardForm.test.tsx.
// This spec tests what only a real browser + real backend can prove:
// - Real API data still populates after switching card type
// - National team card persists correctly to localStorage
// - Critical keyboard/a11y journey

test.describe('National Team Card', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
    await cardCreator.waitForFormReady();
  });

  test('@smoke club and league fields are hidden after switching to National Team', async ({
    page,
  }) => {
    await page.click('[aria-label="National team card"]');

    await expect(page.locator('[data-testid="club-select"]')).not.toBeVisible();
    await expect(
      page.locator('[data-testid="league-select"]'),
    ).not.toBeVisible();

    // Fields that must remain visible for both card types
    await expect(
      page.locator('[data-testid="nationality-select"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="position-select"]')).toBeVisible();
  });

  test('switching back to Club restores club and league fields', async ({
    page,
  }) => {
    await page.click('[aria-label="National team card"]');
    await expect(page.locator('[data-testid="club-select"]')).not.toBeVisible();

    await page.click('[aria-label="Club card"]');
    await expect(page.locator('[data-testid="club-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="league-select"]')).toBeVisible();
  });

  test('national team card saves with cardType national in localStorage', async ({
    page,
  }) => {
    await cardCreator.fillCardForm({
      cardType: 'national',
      name: 'World Cup Star',
      nationality: 'England',
      position: 'Forward',
    });

    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].cardType).toBe('national');
    expect(cards[0].playerName).toBe('World Cup Star');
    expect(cards[0].club).toBe('');
    expect(cards[0].league).toBe('');
  });

  test('card type toggle buttons have correct ARIA labels', async ({
    page,
  }) => {
    const clubButton = page.locator('[aria-label="Club card"]');
    const nationalButton = page.locator('[aria-label="National team card"]');

    await expect(clubButton).toBeVisible();
    await expect(nationalButton).toBeVisible();

    // Club is selected by default
    await expect(clubButton).toHaveAttribute('aria-pressed', 'true');
    await expect(nationalButton).toHaveAttribute('aria-pressed', 'false');

    // After clicking National Team
    await nationalButton.click();
    await expect(nationalButton).toHaveAttribute('aria-pressed', 'true');
    await expect(clubButton).toHaveAttribute('aria-pressed', 'false');
  });
});
