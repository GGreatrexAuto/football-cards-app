import { test, expect } from '@playwright/test';

test.describe('Card Creation Journey', () => {
  test('Full Card Creation & Save', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Enter player name
    await page.fill('input[aria-label="Player Name"]', 'Test Player');

    // Select club from dropdown
    await page.click('[aria-label="Club"]');
    await page.click('text=Arsenal'); // Assuming Arsenal is available

    // Select nationality from dropdown
    await page.click('[aria-label="Nationality"]');
    await page.click('text=England'); // Assuming England is available

    // Select league from dropdown
    await page.click('[aria-label="League"]');
    await page.click('text=Premier League'); // Assuming Premier League is available

    // Select position from dropdown
    await page.click('[aria-label="Position"]');
    await page.click('text=Forward');

    // Click randomize stats button
    await page.click('button:has-text("🎲 Randomize Stats")');

    // Verify stats populated with random values
    const defenceValue = await page.inputValue('input[aria-label="Defence"]');
    const controlValue = await page.inputValue('input[aria-label="Control"]');
    const attackValue = await page.inputValue('input[aria-label="Attack"]');

    expect(parseInt(defenceValue)).toBeGreaterThanOrEqual(0);
    expect(parseInt(defenceValue)).toBeLessThanOrEqual(100);
    expect(parseInt(controlValue)).toBeGreaterThanOrEqual(0);
    expect(parseInt(controlValue)).toBeLessThanOrEqual(100);
    expect(parseInt(attackValue)).toBeGreaterThanOrEqual(0);
    expect(parseInt(attackValue)).toBeLessThanOrEqual(100);

    // Select a stock photo (click the first stock photo card)
    await page.click('.MuiCard-root').first(); // Assuming stock photos are first cards

    // Select card background (click the first background card)
    await page.click('text=Classic Green').click(); // Click the background card

    // Click Save button
    await page.click('button:has-text("Save Card")');

    // Verify success message
    await expect(page.locator('text=Card saved successfully')).toBeVisible();

    // Verify card appears in preview (assuming preview persists or check gallery)
    // Since form resets, perhaps check that the form is reset
    await expect(page.locator('input[aria-label="Player Name"]')).toHaveValue(
      '',
    );
  });
});
