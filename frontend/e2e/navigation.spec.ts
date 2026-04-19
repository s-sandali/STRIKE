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

// ─── Test 16 ──────────────────────────────────────────────────────────────────
test('e2e_navbar_cart_icon', async ({ page }) => {
  await page.goto('/');

  // Click the cart icon button in the navbar
  await page.locator('.navbar-cart-btn').click();

  // Cart.jsx redirects unauthenticated users to /login — this is correct behaviour.
  // The icon navigates to /cart, and /cart enforces auth by redirecting immediately.
  await expect(page).toHaveURL('/login');
  await expect(page.locator('.form-container')).toBeVisible();
});
