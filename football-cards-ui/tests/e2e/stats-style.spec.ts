import { expect, test } from './base/test-base';
import { clearBrowserStorage, checkA11y } from './base/helpers/test-helpers';

test.describe('Stats Style', () => {
  test.beforeEach(async ({ page, testBase }) => {
    await clearBrowserStorage(page);
    await testBase.gotoApp();
  });

  test('@smoke switching to Match Atk style updates card preview labels', async ({
    page,
  }) => {
    // Default (Adrenaline) — preview shows DEF / CTRL / ATT
    const preview = page.locator('[data-testid="card-preview"]');
    await expect(preview.getByTestId('stat-label-def')).toBeVisible();
    await expect(preview.getByTestId('stat-label-ctrl')).toBeVisible();
    await expect(preview.getByTestId('stat-label-att')).toBeVisible();

    // Switch to Match Atk
    await page.getByRole('button', { name: /Match Atk style/i }).click();

    // Preview now shows SPD / TAC / PWR / SHT / SKL / PAS
    await expect(preview.getByTestId('stat-label-spd')).toBeVisible();
    await expect(preview.getByTestId('stat-label-tac')).toBeVisible();
    await expect(preview.getByTestId('stat-label-pwr')).toBeVisible();
    await expect(preview.getByTestId('stat-label-sht')).toBeVisible();
    await expect(preview.getByTestId('stat-label-skl')).toBeVisible();
    await expect(preview.getByTestId('stat-label-pas')).toBeVisible();

    // Adrenaline labels no longer visible
    await expect(preview.getByTestId('stat-label-def')).not.toBeVisible();
    await expect(preview.getByTestId('stat-label-ctrl')).not.toBeVisible();
    await expect(preview.getByTestId('stat-label-att')).not.toBeVisible();
  });

  test('switching back to Adrenaline restores original preview labels', async ({
    page,
  }) => {
    const preview = page.locator('[data-testid="card-preview"]');

    // Switch to Match Atk then back to Adrenaline
    await page.getByRole('button', { name: /Match Atk style/i }).click();
    await expect(preview.getByTestId('stat-label-spd')).toBeVisible();

    await page.getByRole('button', { name: /Adrenaline style/i }).click();

    await expect(preview.getByTestId('stat-label-def')).toBeVisible();
    await expect(preview.getByTestId('stat-label-ctrl')).toBeVisible();
    await expect(preview.getByTestId('stat-label-att')).toBeVisible();
    await expect(preview.getByTestId('stat-label-spd')).not.toBeVisible();
  });

  test('Match Atk form inputs are shown when style is matchAtk', async ({
    page,
  }) => {
    // Adrenaline inputs visible by default
    await expect(page.getByTestId('defence-input')).toBeVisible();

    // Switch to Match Atk
    await page.getByRole('button', { name: /Match Atk style/i }).click();

    await expect(page.getByTestId('speed-input')).toBeVisible();
    await expect(page.getByTestId('tackle-input')).toBeVisible();
    await expect(page.getByTestId('power-input')).toBeVisible();
    await expect(page.getByTestId('shoot-input')).toBeVisible();
    await expect(page.getByTestId('skill-input')).toBeVisible();
    await expect(page.getByTestId('pass-input')).toBeVisible();
    await expect(page.getByTestId('defence-input')).not.toBeVisible();
  });

  test('Match Atk stats are saved and reloaded correctly', async ({ page }) => {
    // Switch to Match Atk and fill a player name
    await page.getByRole('button', { name: /Match Atk style/i }).click();
    await page.getByTestId('speed-input').fill('88');
    await page.getByTestId('tackle-input').fill('72');
    await page.getByTestId('power-input').fill('80');
    await page.getByTestId('shoot-input').fill('91');
    await page.getByTestId('skill-input').fill('68');
    await page.getByTestId('pass-input').fill('75');

    await page.fill('input[aria-label="Player Name"]', 'Speedy Player');
    await page.getByRole('button', { name: /Save Card/i }).click();

    // Verify localStorage persists statsStyle
    const cards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('football-cards') || '[]'),
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].statsStyle).toBe('matchAtk');
    expect(cards[0].speed).toBe(88);
    expect(cards[0].shoot).toBe(91);
  });

  test('has no accessibility violations in Match Atk mode', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /Match Atk style/i }).click();
    await expect(page.getByTestId('speed-input')).toBeVisible();
    await checkA11y(page);
  });
});
