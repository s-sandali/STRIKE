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

// ─── Test 22 ──────────────────────────────────────────────────────────────────
test('e2e_error_state_products', async ({ page }) => {
  // Abort the products API call — simulates a network failure or backend being down
  await page.route('**/products/', route => route.abort());

  await page.goto('/products');

  // Loading state must clear — the fetch settled (with an error)
  await expect(page.getByText('Loading...')).not.toBeVisible();

  // Products.jsx has no dedicated error UI: on failure products stays [],
  // so the empty-results message appears instead of a grid.
  // NOTE: this documents a known gap — the app cannot distinguish between
  // "no matching products" and "API unreachable".
  await expect(page.locator('.no-products-msg')).toBeVisible();
  await expect(page.locator('.shop-grid')).not.toBeVisible();
});

// ─── Test 23 ──────────────────────────────────────────────────────────────────
test('e2e_feedback_disappears', async ({ page, request }) => {
  const email = 'feedbacktest@example.com';
  const password = 'FeedTest123!';

  // Ensure the test user exists
  await request.post('http://localhost:8000/auth/register', {
    data: { email, password },
  });

  // Log in through the UI
  await page.goto('/login');
  await page.locator('input[name="username"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL('/products');

  // Navigate into the first product
  await page.locator('.shop-card').first().click();
  await expect(page.locator('.add-to-cart-btn')).toBeVisible();

  // Add to cart — feedback message appears immediately
  await page.locator('.add-to-cart-btn').click();
  await expect(page.getByText('Added to cart!')).toBeVisible();

  // After 3000ms the component clears feedback — wait just past that
  await page.waitForTimeout(3500);
  await expect(page.getByText('Added to cart!')).not.toBeVisible();
});

// ─── Test 24 ──────────────────────────────────────────────────────────────────
test('e2e_responsive_grid', async ({ page }) => {
  // Set viewport to iPhone SE dimensions before navigating
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/products');
  await expect(page.locator('.shop-grid')).toBeVisible();

  const cards = page.locator('.shop-card');
  await expect(cards.first()).toBeVisible();

  // Get screen coordinates of the first two cards
  const box0 = await cards.nth(0).boundingBox();
  const box1 = await cards.nth(1).boundingBox();

  // Both must have resolved to real elements with a position
  expect(box0).not.toBeNull();
  expect(box1).not.toBeNull();

  // Single-column layout: cards share the same x (left edge) and stack vertically
  expect(box0!.x).toBeCloseTo(box1!.x, 0);
  expect(box1!.y).toBeGreaterThan(box0!.y);
});
