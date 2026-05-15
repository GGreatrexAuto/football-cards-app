import { Page, Locator } from '@playwright/test';
import { TestBase } from '../test-base';

/**
 * Page Object for card gallery view
 */
export class CardGalleryPage extends TestBase {
  // Gallery elements
  private readonly galleryContainer: Locator;
  private readonly cardItems: Locator;
  private readonly emptyState: Locator;
  private readonly loadingIndicator: Locator;

  // Card actions
  private readonly editButtons: Locator;
  private readonly deleteButtons: Locator;
  private readonly viewButtons: Locator;

  // Filters and search
  private readonly searchInput: Locator;
  private readonly filterButtons: Locator;

  constructor(page: Page) {
    super(page);

    this.galleryContainer = this.page.locator(
      '[data-testid="card-gallery"], .gallery, .card-list',
    );
    this.cardItems = this.page.locator(
      '[data-testid="card-item"], .card-item, .MuiCard-root',
    );
    this.emptyState = this.page.locator(
      '[data-testid="empty-gallery"], .empty-state',
    );
    this.loadingIndicator = this.page.locator(
      '[data-testid="gallery-loading"], .loading',
    );

    this.editButtons = this.page.locator(
      '[data-testid="edit-card"], button:has-text("Edit")',
    );
    this.deleteButtons = this.page.locator(
      '[data-testid="delete-card"], button:has-text("Delete")',
    );
    this.viewButtons = this.page.locator(
      '[data-testid="view-card"], button:has-text("View")',
    );

    this.searchInput = this.page.locator(
      '[data-testid="gallery-search"], input[placeholder*="search"]',
    );
    this.filterButtons = this.page.locator(
      '[data-testid="gallery-filter"], .filter-button',
    );
  }

  /**
   * Check if gallery is visible
   */
  async isGalleryVisible(): Promise<boolean> {
    return await this.galleryContainer.isVisible();
  }

  /**
   * Get number of cards in gallery
   */
  async getCardCount(): Promise<number> {
    return await this.cardItems.count();
  }

  /**
   * Check if gallery is empty
   */
  async isGalleryEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  /**
   * Check if gallery is loading
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible();
  }

  /**
   * Get card by index
   */
  getCardByIndex(index: number): Locator {
    return this.cardItems.nth(index);
  }

  /**
   * Get card by player name
   */
  async getCardByName(playerName: string): Promise<Locator | null> {
    const cards = this.cardItems;
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const name = await card
        .locator('[data-testid="card-player-name"], .player-name')
        .textContent();
      if (name?.includes(playerName)) {
        return card;
      }
    }

    return null;
  }

  /**
   * Click edit button for card at index
   */
  async editCardByIndex(index: number): Promise<void> {
    await this.editButtons.nth(index).click();
  }

  /**
   * Click edit button for card with specific player name
   */
  async editCardByName(playerName: string): Promise<void> {
    const card = await this.getCardByName(playerName);
    if (card) {
      await card.locator('[data-testid="edit-card"]').click();
    } else {
      throw new Error(`Card with player name "${playerName}" not found`);
    }
  }

  /**
   * Click delete button for card at index
   */
  async deleteCardByIndex(index: number): Promise<void> {
    await this.deleteButtons.nth(index).click();
  }

  /**
   * Click delete button for card with specific player name
   */
  async deleteCardByName(playerName: string): Promise<void> {
    const card = await this.getCardByName(playerName);
    if (card) {
      await card.locator('[data-testid="delete-card"]').click();
    } else {
      throw new Error(`Card with player name "${playerName}" not found`);
    }
  }

  /**
   * Click view button for card at index
   */
  async viewCardByIndex(index: number): Promise<void> {
    await this.viewButtons.nth(index).click();
  }

  /**
   * Search for cards
   */
  async searchCards(query: string): Promise<void> {
    await this.searchInput.fill(query);
    // Wait for search results to update
    await this.page.waitForTimeout(500);
  }

  /**
   * Clear search
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get all card player names
   */
  async getAllCardNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.cardItems.count();

    for (let i = 0; i < count; i++) {
      const name = await this.cardItems
        .nth(i)
        .locator('[data-testid="card-player-name"], .player-name')
        .textContent();
      if (name) {
        names.push(name.trim());
      }
    }

    return names;
  }

  /**
   * Wait for gallery to load
   */
  async waitForGalleryLoad(): Promise<void> {
    await this.galleryContainer.waitFor({ state: 'visible' });
    await this.loadingIndicator
      .waitFor({ state: 'hidden', timeout: 10000 })
      .catch(() => {
        // Loading indicator might not exist
      });
  }
}
