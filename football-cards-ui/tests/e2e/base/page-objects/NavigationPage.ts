import { Page, Locator } from '@playwright/test';
import { TestBase } from '../test-base';

/**
 * Page Object for application navigation
 */
export class NavigationPage extends TestBase {
  // Navigation elements
  private readonly navContainer: Locator;
  private readonly homeLink: Locator;
  private readonly myCardsLink: Locator;
  private readonly createCardLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navContainer = this.page.locator(
      '[data-testid="navigation"], nav, header',
    );
    this.homeLink = this.page.locator(
      '[data-testid="nav-home"], a:has-text("Home")',
    );
    this.myCardsLink = this.page.locator(
      '[data-testid="nav-my-cards"], a:has-text("My Cards")',
    );
    this.createCardLink = this.page.locator(
      '[data-testid="nav-create-card"], a:has-text("Create Card")',
    );
  }

  /**
   * Navigate to the home page
   */
  async goToHome(): Promise<void> {
    await this.homeLink.click();
    await this.waitForAppReady();
  }

  /**
   * Navigate to My Cards gallery
   */
  async goToMyCards(): Promise<void> {
    await this.myCardsLink.click();
    await this.waitForAppReady();
  }

  /**
   * Navigate to Create Card page
   */
  async goToCreateCard(): Promise<void> {
    await this.createCardLink.click();
    await this.waitForAppReady();
  }

  /**
   * Check if navigation is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.navContainer.isVisible();
  }

  /**
   * Get current active navigation item
   */
  async getActiveNavItem(): Promise<string | null> {
    const activeItem = this.navContainer.locator(
      '[aria-current="page"], .active, .selected',
    );
    return await activeItem.textContent();
  }
}
