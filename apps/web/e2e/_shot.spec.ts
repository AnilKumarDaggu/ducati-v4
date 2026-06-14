import { test, expect } from '@playwright/test';

test('before', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/esplora');
  await expect(page.getByTestId('asset-status')).toHaveText('asset: loaded', { timeout: 20000 });
  await page.getByTestId('mode-enginetest').click();
  await page.waitForTimeout(1600);
  await page.getByTestId('engine-run').click();
  await page.getByTestId('rpm-6000').click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'before-enginetest.png' });
});
