import { test, expect } from '@playwright/test';

// ─── Test 1 ───────────────────────────────────────────────────────────────────
test('e2e_landing_loads_best_sellers', async ({ page }) => {
  await page.goto('/');

  // Wait for the best sellers grid — this implicitly waits for the API response
  const grid = page.locator('.best-sellers-grid');
  await expect(grid).toBeVisible();

  // At least one product card must exist
  const cards = page.locator('.bs-card');
  await expect(cards.first()).toBeVisible();

  // The first card must have a non-empty product name
  const firstName = await cards.first().locator('h3').innerText();
  expect(firstName.trim().length).toBeGreaterThan(0);

  // The first card must display a price in LKR format
  const firstPrice = await cards.first().locator('.current-price').innerText();
  expect(firstPrice).toContain('LKR');
});
