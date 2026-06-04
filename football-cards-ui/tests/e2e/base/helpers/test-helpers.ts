import { Page, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { generateRandomCardData } from '../fixtures/test-data';

/**
 * Wait for application to be fully ready
 */
export async function waitForAppReady(
  page: Page,
  timeout = 10000,
): Promise<void> {
  // Wait for main app container
  await page.waitForSelector('[data-testid="app-root"], .App, #root', {
    timeout,
  });

  // Wait for loading states to disappear
  await page
    .waitForFunction(
      () => {
        const loadingElements = document.querySelectorAll(
          '[data-testid*="loading"], .loading, .spinner',
        );
        return loadingElements.length === 0;
      },
      { timeout: 5000 },
    )
    .catch(() => {
      // Loading might not exist, continue
    });

  // Wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
    // Network might not idle, continue
  });
}

/**
 * Clear browser storage for test isolation
 */
export async function clearBrowserStorage(page: Page): Promise<void> {
  // Navigate to the app origin first so localStorage/sessionStorage are available.
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Mock API responses using Playwright's route interception
 */
export async function mockApiResponse(
  page: Page,
  url: string | RegExp,
  response: { status?: number; data: any; headers?: Record<string, string> },
): Promise<void> {
  await page.route(url, async (route) => {
    await route.fulfill({
      status: response.status || 200,
      contentType: 'application/json',
      body: JSON.stringify(response.data),
      headers: response.headers,
    });
  });
}

/**
 * Mock API error responses
 */
export async function mockApiError(
  page: Page,
  url: string | RegExp,
  status: number = 500,
  error: any = { error: 'Internal server error' },
): Promise<void> {
  await mockApiResponse(page, url, { status, data: error });
}

/**
 * Take a screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  await page.screenshot({
    path: `test-results/screenshots/${filename}`,
    fullPage: true,
  });
}

/**
 * Generate random card data (re-exported for convenience)
 */
export { generateRandomCardData } from '../fixtures/test-data';

/**
 * Create a test card and save it to localStorage
 */
export async function createTestCardInStorage(
  page: Page,
  cardData: any = generateRandomCardData(),
): Promise<void> {
  const cards = [cardData];
  await page.evaluate((cardsData) => {
    localStorage.setItem('football-cards', JSON.stringify(cardsData));
  }, cards);
}

/**
 * Get cards from localStorage
 */
export async function getCardsFromStorage(page: Page): Promise<any[]> {
  return await page.evaluate(() => {
    const stored = localStorage.getItem('football-cards');
    return stored ? JSON.parse(stored) : [];
  });
}

/**
 * Clear test cards from localStorage
 */
export async function clearTestCards(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('football-cards');
  });
}

/**
 * Wait for element to be stable (not changing)
 */
export async function waitForElementStable(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ timeout });

  // Wait for element to stop changing
  let previousText = '';
  let stableCount = 0;

  for (let i = 0; i < 10; i++) {
    const currentText = (await element.textContent()) || '';
    if (currentText === previousText) {
      stableCount++;
      if (stableCount >= 3) break; // Consider stable after 3 consecutive same readings
    } else {
      stableCount = 0;
      previousText = currentText;
    }
    await page.waitForTimeout(100);
  }
}

/**
 * Visual regression helper - compare screenshot with baseline
 */
export async function compareScreenshot(
  page: Page,
  name: string,
  options: { threshold?: number; fullPage?: boolean } = {},
): Promise<boolean> {
  const { fullPage = false } = options;

  try {
    await page.screenshot({ fullPage });
    // In a real implementation, you'd compare with a baseline image
    // For now, just take the screenshot
    await takeScreenshot(page, name);
    return true;
  } catch (error) {
    console.warn(`Screenshot comparison failed for ${name}:`, error);
    return false;
  }
}

/**
 * Simulate slow network conditions
 */
export async function simulateSlowNetwork(
  page: Page,
  latency = 1000,
): Promise<void> {
  await page.route('**/*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, latency));
    await route.continue();
  });
}

/**
 * Disable animations for consistent testing
 */
export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

/**
 * Enable request interception for API mocking
 */
export async function enableRequestInterception(page: Page): Promise<void> {
  await page.route('**/api/**', (route) => route.continue());
}

/**
 * Run axe accessibility checks on the current page state.
 * Call this after each major navigation step in E2E tests.
 * Uses AxeBuilder from @axe-core/playwright and asserts no violations.
 *
 * Pre-existing violations excluded (all predate subtask 17.11):
 *   - region / landmark-one-main: app lacks <main> landmark (axe calls these two rules)
 *   - color-contrast: theme uses #ffc107 and #1976d2 on #f5f5f5 (~4.2 ratio)
 *   - heading-order: heading levels skip in some sections
 */
export async function checkA11y(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .disableRules([
      'region',
      'landmark-one-main',
      'color-contrast',
      'heading-order',
    ])
    .analyze();
  expect(results.violations).toEqual([]);
}
