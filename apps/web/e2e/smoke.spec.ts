import { expect, test } from '@playwright/test';

test('boots, loads the Ducati model, and selects a part', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /panigale v4/i }).first()).toBeVisible();

  // A renderer must initialize (ADR-012 chain; WebGL2 preferred for the hero).
  await expect(page.getByTestId('renderer-backend')).toHaveText(/renderer: (webgl2|webgpu)/, {
    timeout: 15_000,
  });

  // The real 17 MB GLB streams in, then the navigator populates from its parts.
  await expect(page.getByTestId('asset-status')).toHaveText('asset: loaded', { timeout: 30_000 });
  // The navigator buckets parts into material groups; the first group is open by
  // default, so a part button is reachable inside its list.
  const firstPart = page.locator('aside[aria-label="Component navigator"] ul button').first();
  await expect(firstPart).toBeVisible({ timeout: 10_000 });

  // Selecting a native part populates the card and drives the URL.
  await firstPart.click();
  await expect(page.getByTestId('selected-component')).not.toBeEmpty();
  await expect(page).toHaveURL(/\/esplora\/.+/);

  // View-mode presets (DTEA-ADR-010): each engages; selection survives the swap.
  for (const mode of ['officina', 'tecnico', 'xray', 'studio'] as const) {
    await page.getByTestId(`mode-${mode}`).click();
    await expect(page.getByTestId(`mode-${mode}`)).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(page.getByTestId('selected-component')).not.toBeEmpty();

  // V1.5 drill-down: isolate the selected part, then exit.
  const isolate = page.getByTestId('isolate-toggle');
  await expect(isolate).toHaveText(/Isola/);
  await isolate.click();
  await expect(isolate).toHaveText(/Esci/);
  await isolate.click();
  await expect(isolate).toHaveText(/Isola/);

  // Engine Test (flagship): enter the 5th mode and start the procedural V4.
  await page.getByTestId('mode-enginetest').click();
  const run = page.getByTestId('engine-run');
  await expect(run).toBeVisible();
  await run.click();
  await expect(run).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('rpm-9000').click();
  await expect(run).toHaveAttribute('aria-pressed', 'true');
});

test('deep link: view-mode recovery + BOM-mapped catalog card', async ({ page }) => {
  await page.goto('/esplora?vista=tecnico');
  await expect(page.getByTestId('asset-status')).toHaveText('asset: loaded', { timeout: 30_000 });
  await expect(page.getByTestId('mode-tecnico')).toHaveAttribute('aria-pressed', 'true');

  // A BOM-mapped id (in the catalog) renders the rich card even though it is not
  // a node in the Panigale model — the placard reads the catalog by id.
  await page.goto('/esplora/ENG_VALVETRAIN_INTAKE-VALVE-1');
  await expect(page.getByTestId('selected-component')).toHaveText('ENG_VALVETRAIN_INTAKE-VALVE-1', {
    timeout: 30_000,
  });
});
