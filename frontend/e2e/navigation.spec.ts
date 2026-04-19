import { test, expect } from '@playwright/test';

// ─── Test 15 ──────────────────────────────────────────────────────────────────
test('e2e_navbar_links_work', async ({ page }) => {
  await page.goto('/');

  // Click the "Shop" link in the navbar
  await page.locator('.navbar-links a').click();

  // URL must update to /products
  await expect(page).toHaveURL('/products');

  // Products page must render
  await expect(page.locator('.shop-page-wrapper')).toBeVisible();
});
