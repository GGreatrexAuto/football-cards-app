import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage } from './base/helpers/test-helpers';

// NOTE: Form validation, randomize-stat range, and form reset are covered
// at component level in CardForm.test.tsx and CardContext.test.tsx.
// This spec tests only what a real browser + real backend can prove.

test.describe('Card Creation Journey', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@smoke should create a card and persist it in localStorage', async ({
    page,
  }) => {
    await cardCreator.fillCardForm({
      name: 'Test Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });

    await cardCreator.randomizeStats();
    await cardCreator.selectBackground('Classic Green');
    await cardCreator.saveCard();

    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();
    const successMessage = await cardCreator.getSuccessMessage();
    expect(successMessage).toContain('Card saved successfully');

    // Navigate away and back to verify real localStorage persistence
    await page.click('text=My Cards');
    await page.waitForLoadState('networkidle');

    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].playerName).toBe('Test Player');
  });
});
