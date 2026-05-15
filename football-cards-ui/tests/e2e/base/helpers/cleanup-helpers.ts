import { Page } from '@playwright/test';

/**
 * Test data cleanup utilities for E2E tests
 */

/**
 * Clean up all test data from browser storage
 */
export async function cleanupBrowserStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Clear football cards data
    localStorage.removeItem('football-cards');

    // Clear any other test-related data
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('test-') || key.includes('mock')) {
        localStorage.removeItem(key);
      }
    });

    // Clear session storage
    sessionStorage.clear();
  });
}

/**
 * Clean up test files and directories
 */
export async function cleanupTestFiles(): Promise<void> {
  // This would typically clean up test-generated files
  // For now, we'll rely on Playwright's built-in cleanup
  console.log('Test file cleanup completed');
}

/**
 * Reset page to clean state
 */
export async function resetPageState(page: Page): Promise<void> {
  // Clear storage
  await cleanupBrowserStorage(page);

  // Clear any dialogs
  page.on('dialog', (dialog) => dialog.dismiss());

  // Navigate to clean state
  await page.goto('/', { waitUntil: 'load' });
}

/**
 * Setup test isolation
 */
export async function setupTestIsolation(page: Page): Promise<void> {
  // Enable request interception if needed
  await page.route('**/api/**', (route) => route.continue());

  // Clear any existing state
  await resetPageState(page);
}

/**
 * Teardown test isolation
 */
export async function teardownTestIsolation(page: Page): Promise<void> {
  // Clean up storage
  await cleanupBrowserStorage(page);

  // Close any open dialogs
  try {
    await page.locator('.MuiDialog-root').waitFor({ timeout: 1000 });
    await page.keyboard.press('Escape');
  } catch {
    // No dialog open
  }
}
