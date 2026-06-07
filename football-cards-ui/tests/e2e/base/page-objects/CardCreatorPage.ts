import { Page, Locator, expect } from '@playwright/test';
import { TestBase } from '../test-base';

/**
 * Page Object for card creation form
 */
export class CardCreatorPage extends TestBase {
  // Form elements
  private readonly playerNameInput: Locator;
  private readonly clubSelect: Locator;
  private readonly nationalitySelect: Locator;
  private readonly leagueSelect: Locator;
  private readonly positionSelect: Locator;

  // Stats inputs
  private readonly defenceInput: Locator;
  private readonly controlInput: Locator;
  private readonly attackInput: Locator;
  private readonly randomizeStatsButton: Locator;

  // Media elements
  private readonly photoUpload: Locator;
  private readonly stockPhotos: Locator;
  private readonly backgroundSelect: Locator;

  // Action buttons
  private readonly saveButton: Locator;
  private readonly resetButton: Locator;

  // Messages
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Form inputs
    this.playerNameInput = this.page.locator(
      'input[data-testid="player-name"], input[aria-label="Player Name"]',
    );
    this.clubSelect = this.page.locator(
      '[data-testid="club-select"], [aria-label="Club"]',
    );
    this.nationalitySelect = this.page.locator(
      '[data-testid="nationality-select"], [aria-label="Nationality"]',
    );
    this.leagueSelect = this.page.locator(
      '[data-testid="league-select"], [aria-label="League"]',
    );
    this.positionSelect = this.page.locator(
      '[data-testid="position-select"], [aria-label="Position"]',
    );

    // Stats
    this.defenceInput = this.page.locator(
      'input[data-testid="defence-input"], input[aria-label="Defence"]',
    );
    this.controlInput = this.page.locator(
      'input[data-testid="control-input"], input[aria-label="Control"]',
    );
    this.attackInput = this.page.locator(
      'input[data-testid="attack-input"], input[aria-label="Attack"]',
    );
    this.randomizeStatsButton = this.page.locator(
      '[data-testid="randomize-stats"], button:has-text("Randomize Stats")',
    );

    // Media
    this.photoUpload = this.page.locator(
      '[data-testid="photo-upload"], input[type="file"]',
    );
    this.stockPhotos = this.page.locator('[data-testid^="stock-photo-stock"]');
    this.backgroundSelect = this.page.locator(
      '[data-testid="background-select"]',
    );

    // Actions
    this.saveButton = this.page.locator(
      '[data-testid="save-card"], button:has-text("Save")',
    );
    this.resetButton = this.page.locator(
      '[data-testid="reset-form"], button:has-text("Reset")',
    );

    // Messages
    this.successMessage = this.page.locator(
      '[data-testid="success-message"], .success, .MuiAlert-standardSuccess',
    );
    this.errorMessage = this.page.locator(
      '[data-testid="error-message"], .error, .MuiAlert-standardError',
    );
  }

  /**
   * Fill player name
   */
  async fillPlayerName(name: string): Promise<void> {
    await expect(this.playerNameInput).toBeEnabled({ timeout: 20000 });
    await this.playerNameInput.fill(name);
  }

  /**
   * Select club from dropdown
   */
  async selectClub(clubName: string): Promise<void> {
    await this.clubSelect.click();
    await this.page.locator(`[role="option"]:has-text("${clubName}")`).click();
  }

  /**
   * Select nationality from dropdown
   */
  async selectNationality(nationality: string): Promise<void> {
    await this.nationalitySelect.click();
    await this.page
      .locator(`[role="option"]:has-text("${nationality}")`)
      .click();
  }

  /**
   * Select league from dropdown
   */
  async selectLeague(league: string): Promise<void> {
    await this.leagueSelect.click();
    await this.page.locator(`[role="option"]:has-text("${league}")`).click();
  }

  /**
   * Select position from dropdown
   */
  async selectPosition(position: string): Promise<void> {
    await this.positionSelect.click();
    await this.page.locator(`[role="option"]:has-text("${position}")`).click();
  }

  /**
   * Click randomize stats button
   */
  async randomizeStats(): Promise<void> {
    await this.randomizeStatsButton.click();
  }

  /**
   * Get current stat values
   */
  async getStats(): Promise<{
    defence: number;
    control: number;
    attack: number;
  }> {
    const defence = parseInt((await this.defenceInput.inputValue()) || '0');
    const control = parseInt((await this.controlInput.inputValue()) || '0');
    const attack = parseInt((await this.attackInput.inputValue()) || '0');
    return { defence, control, attack };
  }

  /**
   * Select stock photo by index
   */
  async selectStockPhoto(index: number = 0): Promise<void> {
    await this.stockPhotos.nth(index).click();
  }

  /**
   * Select background
   */
  async selectBackground(backgroundName: string): Promise<void> {
    await this.page
      .locator(
        `[data-testid="background-${backgroundName.toLowerCase().replace(' ', '-')}"]`,
      )
      .click();
  }

  /**
   * Click save button
   */
  async saveCard(): Promise<void> {
    await this.saveButton.click();
  }

  /**
   * Click reset button
   */
  async resetForm(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string | null> {
    return await this.successMessage.textContent();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  /**
   * Wait for the card form's API data to finish loading.
   * Resolves immediately if the spinner was never rendered (already loaded).
   */
  async waitForFormReady(): Promise<void> {
    await this.page
      .waitForSelector('[data-testid="form-loading"]', {
        state: 'hidden',
        timeout: 15000,
      })
      .catch(() => {
        // Spinner was never present — form was already ready
      });
  }

  /**
   * Select card type (Club or National Team)
   */
  async selectCardType(type: 'club' | 'national'): Promise<void> {
    const label = type === 'club' ? 'Club card' : 'National team card';
    await this.page.click(`[aria-label="${label}"]`);
  }

  /**
   * Fill complete card form with data
   */
  async fillCardForm(data: {
    name: string;
    nationality: string;
    position: string;
    cardType?: 'club' | 'national';
    club?: string;
    league?: string;
    randomizeStats?: boolean;
    background?: string;
  }): Promise<void> {
    await this.waitForFormReady();

    if (data.cardType) {
      await this.selectCardType(data.cardType);
    }

    await this.fillPlayerName(data.name);

    if (data.cardType !== 'national') {
      if (data.club) await this.selectClub(data.club);
      if (data.league) await this.selectLeague(data.league);
    }

    await this.selectNationality(data.nationality);
    await this.selectPosition(data.position);

    if (data.randomizeStats !== false) {
      await this.randomizeStats();
    }

    if (data.background) {
      await this.selectBackground(data.background);
    }
  }
}
