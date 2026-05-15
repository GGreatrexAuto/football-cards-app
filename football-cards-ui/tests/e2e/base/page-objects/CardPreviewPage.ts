import { Page, Locator } from '@playwright/test';
import { TestBase } from '../test-base';

/**
 * Page Object for card preview
 */
export class CardPreviewPage extends TestBase {
  // Preview elements
  private readonly previewContainer: Locator;
  private readonly cardCanvas: Locator;
  private readonly playerName: Locator;
  private readonly playerStats: Locator;
  private readonly playerPhoto: Locator;
  private readonly cardBackground: Locator;

  // Action buttons
  private readonly printButton: Locator;
  private readonly editButton: Locator;
  private readonly saveButton: Locator;
  private readonly shareButton: Locator;

  constructor(page: Page) {
    super(page);

    this.previewContainer = this.page.locator(
      '[data-testid="card-preview"], .card-preview',
    );
    this.cardCanvas = this.page.locator(
      '[data-testid="card-canvas"], .card-canvas, canvas',
    );
    this.playerName = this.page.locator(
      '[data-testid="preview-player-name"], .preview-name',
    );
    this.playerStats = this.page.locator(
      '[data-testid="preview-stats"], .preview-stats',
    );
    this.playerPhoto = this.page.locator(
      '[data-testid="preview-photo"], .preview-photo img',
    );
    this.cardBackground = this.page.locator(
      '[data-testid="preview-background"], .preview-background',
    );

    this.printButton = this.page.locator(
      '[data-testid="print-card"], button:has-text("Print")',
    );
    this.editButton = this.page.locator(
      '[data-testid="edit-card"], button:has-text("Edit")',
    );
    this.saveButton = this.page.locator(
      '[data-testid="save-card"], button:has-text("Save")',
    );
    this.shareButton = this.page.locator(
      '[data-testid="share-card"], button:has-text("Share")',
    );
  }

  /**
   * Check if preview is visible
   */
  async isPreviewVisible(): Promise<boolean> {
    return await this.previewContainer.isVisible();
  }

  /**
   * Get displayed player name
   */
  async getPlayerName(): Promise<string | null> {
    return await this.playerName.textContent();
  }

  /**
   * Get displayed stats
   */
  async getPlayerStats(): Promise<{
    defence: number;
    control: number;
    attack: number;
  } | null> {
    const statsText = await this.playerStats.textContent();
    if (!statsText) return null;

    // Parse stats from text (assuming format like "DEF: 85 | CON: 78 | ATT: 92")
    const defenceMatch = statsText.match(/DEF:\s*(\d+)/i);
    const controlMatch = statsText.match(/CON:\s*(\d+)/i);
    const attackMatch = statsText.match(/ATT:\s*(\d+)/i);

    return {
      defence: defenceMatch ? parseInt(defenceMatch[1]) : 0,
      control: controlMatch ? parseInt(controlMatch[1]) : 0,
      attack: attackMatch ? parseInt(attackMatch[1]) : 0,
    };
  }

  /**
   * Check if player photo is displayed
   */
  async isPhotoVisible(): Promise<boolean> {
    return await this.playerPhoto.isVisible();
  }

  /**
   * Get photo source URL
   */
  async getPhotoSrc(): Promise<string | null> {
    return await this.playerPhoto.getAttribute('src');
  }

  /**
   * Check if card background is applied
   */
  async hasBackground(): Promise<boolean> {
    return await this.cardBackground.isVisible();
  }

  /**
   * Get background style/class
   */
  async getBackgroundClass(): Promise<string | null> {
    return await this.cardBackground.getAttribute('class');
  }

  /**
   * Click print button
   */
  async clickPrint(): Promise<void> {
    await this.printButton.click();
  }

  /**
   * Click edit button
   */
  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  /**
   * Click save button
   */
  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  /**
   * Click share button
   */
  async clickShare(): Promise<void> {
    await this.shareButton.click();
  }

  /**
   * Take screenshot of the card preview
   */
  async takeCardScreenshot(filename: string = 'card-preview'): Promise<void> {
    await this.previewContainer.screenshot({
      path: `test-results/screenshots/${filename}.png`,
    });
  }

  /**
   * Wait for preview to load
   */
  async waitForPreviewLoad(): Promise<void> {
    await this.previewContainer.waitFor({ state: 'visible' });
    await this.playerName.waitFor({ state: 'visible' });
  }

  /**
   * Verify card data matches expected values
   */
  async verifyCardData(expected: {
    name: string;
    stats?: { defence: number; control: number; attack: number };
    hasPhoto?: boolean;
    hasBackground?: boolean;
  }): Promise<void> {
    const actualName = await this.getPlayerName();
    if (actualName !== expected.name) {
      throw new Error(
        `Expected player name "${expected.name}", got "${actualName}"`,
      );
    }

    if (expected.stats) {
      const actualStats = await this.getPlayerStats();
      if (!actualStats) {
        throw new Error('Stats not found in preview');
      }

      if (
        actualStats.defence !== expected.stats.defence ||
        actualStats.control !== expected.stats.control ||
        actualStats.attack !== expected.stats.attack
      ) {
        throw new Error(
          `Expected stats ${JSON.stringify(expected.stats)}, got ${JSON.stringify(actualStats)}`,
        );
      }
    }

    if (expected.hasPhoto !== undefined) {
      const photoVisible = await this.isPhotoVisible();
      if (photoVisible !== expected.hasPhoto) {
        throw new Error(
          `Expected photo visibility: ${expected.hasPhoto}, got: ${photoVisible}`,
        );
      }
    }

    if (expected.hasBackground !== undefined) {
      const hasBackground = await this.hasBackground();
      if (hasBackground !== expected.hasBackground) {
        throw new Error(
          `Expected background: ${expected.hasBackground}, got: ${hasBackground}`,
        );
      }
    }
  }
}
