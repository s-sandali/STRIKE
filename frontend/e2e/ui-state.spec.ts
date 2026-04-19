import { test, expect } from '@playwright/test';

// ─── Test 21 ──────────────────────────────────────────────────────────────────
test('e2e_loading_state_products', async ({ page }) => {
  // Intercept the products API call and hold it for 2 seconds
  await page.route('**/products/', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.continue();
  });

  // Navigate — the page renders immediately but data hasn't arrived yet
  await page.goto('/products');

  // "Loading..." must be visible before the delayed response arrives
  await expect(page.getByText('Loading...')).toBeVisible();

  // After the delay resolves, the grid must replace the loading state
  await expect(page.locator('.shop-grid')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Loading...')).not.toBeVisible();
});
