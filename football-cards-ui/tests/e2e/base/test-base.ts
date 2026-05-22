import { test as baseTest, Page } from '@playwright/test';

/**
 * Base test class with common setup and utilities
 */
export class TestBase {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the application and wait for it to be ready
   */
  async gotoApp() {
    await this.page.goto('/');
    await this.waitForAppReady();
  }

  /**
   * Wait for the application to be fully loaded and ready for interaction
   */
  async waitForAppReady() {
    // Wait for the main app container to be visible
    await this.page.waitForSelector('[data-testid="app-root"], .App, #root', {
      timeout: 10000,
    });

    // Wait for the form loading spinner to disappear if present
    await this.page
      .waitForSelector('[data-testid="form-loading"]', {
        state: 'hidden',
        timeout: 15000,
      })
      .catch(() => {
        // Spinner was never present — form loaded instantly or page has no form
      });
  }

  /**
   * Clear all local storage data
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
  }

  /**
   * Clear all session storage data
   */
  async clearSessionStorage() {
    await this.page.evaluate(() => {
      sessionStorage.clear();
    });
  }

  /**
   * Clear all storage (local and session)
   */
  async clearAllStorage() {
    await this.clearLocalStorage();
    await this.clearSessionStorage();
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
    });
  }

  /**
   * Wait for a specific element to be visible and stable
   */
  async waitForElement(selector: string, options?: { timeout?: number }) {
    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout: options?.timeout || 10000,
    });
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}

/**
 * Extended test fixture that includes our TestBase
 */
export const test = baseTest.extend<{
  testBase: TestBase;
}>({
  testBase: async ({ page }, use) => {
    const testBase = new TestBase(page);
    await use(testBase);
  },
});

export { expect } from '@playwright/test';
