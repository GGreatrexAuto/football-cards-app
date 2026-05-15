import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { clearBrowserStorage } from './base/helpers/test-helpers';

// NOTE: Gallery CRUD UI logic (display, edit callback, delete confirmation dialog, empty state)
// is fully covered at component level in CardGallery.test.tsx and CardCreatorFlow.test.tsx
// with mocked storage. These tests focus only on what mocks cannot prove: real localStorage
// persistence across actual browser navigation.

test.describe('Card Gallery — Real Persistence Journeys', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('edited card name persists in localStorage after navigating away', async ({
    page,
  }) => {
    // Create and save a card
    await cardCreator.fillCardForm({
      name: 'Original Name',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Navigate to My Cards and open the edit form
    await page.getByRole('tab', { name: /my cards/i }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Modify the player name and save
    await cardCreator.fillPlayerName('Updated Name');
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Navigate away then verify real localStorage reflects the update
    await page.getByRole('tab', { name: /my cards/i }).click();
    await page.waitForLoadState('networkidle');

    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].playerName).toBe('Updated Name');
  });

  test('deleted card is gone from localStorage after page reload', async ({
    page,
  }) => {
    // Create and save a card
    await cardCreator.fillCardForm({
      name: 'Card To Delete',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();

    // Navigate to gallery and delete the card
    await page.getByRole('tab', { name: /my cards/i }).click();
    await page.waitForLoadState('networkidle');
    await page
      .getByRole('button', { name: /delete/i })
      .first()
      .click();

    // Confirm the deletion dialog
    await page
      .getByRole('button', { name: /confirm|delete/i })
      .last()
      .click();

    // Reload to re-initialise the app from scratch
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Real localStorage must be empty after reload
    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(0);
  });
});
