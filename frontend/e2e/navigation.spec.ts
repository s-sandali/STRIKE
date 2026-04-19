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

// ─── Test 17 ──────────────────────────────────────────────────────────────────
test('e2e_navbar_logo_home', async ({ page }) => {
  // Start on an inner page to make the navigation meaningful
  await page.goto('/products');
  await expect(page.locator('.shop-page-wrapper')).toBeVisible();

  // Click the brand logo
  await page.locator('.navbar-brand').click();

  // Must return to the landing page
  await expect(page).toHaveURL('/');
  await expect(page.locator('.new-hero-title')).toBeVisible();
});

// ─── Test 18 ──────────────────────────────────────────────────────────────────
test('e2e_navbar_unauthenticated', async ({ page }) => {
  await page.goto('/');

  // Logout button must not exist — no authenticated user
  await expect(page.locator('.logout-btn')).not.toBeVisible();

  // Login icon link must be present — invites the user to log in
  // Scoped by href to avoid matching the cart button which shares the same class
  await expect(page.locator('a.navbar-icon-btn[href="/login"]')).toBeVisible();
});
