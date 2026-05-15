import { expect, test } from './base/test-base';
import { CardCreatorPage } from './base/page-objects/CardCreatorPage';
import { SAMPLE_PLAYERS } from './base/fixtures/test-data';
import { clearBrowserStorage } from './base/helpers/test-helpers';

test.describe('Card Creation Journey', () => {
  let cardCreator: CardCreatorPage;

  test.beforeEach(async ({ page, testBase }) => {
    cardCreator = new CardCreatorPage(page);
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@smoke should create a card successfully', async () => {
    await cardCreator.fillCardForm({
      name: 'Test Player',
      club: 'Arsenal',
      nationality: 'England',
      league: 'Premier League',
      position: 'Forward',
    });

    await cardCreator.randomizeStats();
    const stats = await cardCreator.getStats();

    expect(stats.defence).toBeGreaterThanOrEqual(0);
    expect(stats.defence).toBeLessThanOrEqual(100);
    expect(stats.control).toBeGreaterThanOrEqual(0);
    expect(stats.control).toBeLessThanOrEqual(100);
    expect(stats.attack).toBeGreaterThanOrEqual(0);
    expect(stats.attack).toBeLessThanOrEqual(100);

    await cardCreator.selectBackground('Classic Green');
    await cardCreator.saveCard();

    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();
    const successMessage = await cardCreator.getSuccessMessage();
    expect(successMessage).toContain('Card saved successfully');
  });

  test('should handle form validation errors', async () => {
    await cardCreator.saveCard();
    expect(await cardCreator.isErrorMessageVisible()).toBeTruthy();
  });

  test('should randomize stats correctly', async () => {
    await cardCreator.randomizeStats();
    const stats1 = await cardCreator.getStats();

    await cardCreator.randomizeStats();
    const stats2 = await cardCreator.getStats();

    const statsChanged =
      stats1.defence !== stats2.defence ||
      stats1.control !== stats2.control ||
      stats1.attack !== stats2.attack;

    expect(statsChanged).toBeTruthy();
  });

  test('should create card with predefined player data', async () => {
    await cardCreator.fillCardForm(SAMPLE_PLAYERS.CRISTIANO_RONALDO);
    await cardCreator.selectBackground('Classic Green');
    await cardCreator.saveCard();
    expect(await cardCreator.isSuccessMessageVisible()).toBeTruthy();
  });

  test('should clear form on reset', async () => {
    await cardCreator.fillCardForm(SAMPLE_PLAYERS.TEST_PLAYER);
    await cardCreator.resetForm();

    const nameValue = await cardCreator.playerNameInput.inputValue();
    expect(nameValue).toBe('');
  });
});
