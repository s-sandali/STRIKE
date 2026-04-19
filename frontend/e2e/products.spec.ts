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

// ─── Test 2 ───────────────────────────────────────────────────────────────────
test('e2e_landing_promo_carousel_auto', async ({ page }) => {
  await page.goto('/');

  // Target only the active slide's title (all 3 slides are always in the DOM)
  const activeTitle = page.locator('.promo-carousel-slide.active .promo-carousel-title');
  await expect(activeTitle).toBeVisible();
  const titleBefore = await activeTitle.innerText();

  // Wait slightly longer than the 4000ms auto-rotation interval
  await page.waitForTimeout(4500);

  // The active slide should have rotated — title must be different
  const titleAfter = await activeTitle.innerText();
  expect(titleAfter).not.toBe(titleBefore);
});

// ─── Test 3 ───────────────────────────────────────────────────────────────────
test('e2e_landing_promo_carousel_manual', async ({ page }) => {
  await page.goto('/');

  const dots = page.locator('.promo-indicator-dot');
  await expect(dots.first()).toBeVisible();

  // Click the 3rd dot (index 2) — slide 0 is active on load so this is a real change
  await dots.nth(2).click();

  // The 3rd dot must now carry the active class
  await expect(dots.nth(2)).toHaveClass(/active/);

  // And the active slide title must match slide 3: "10% OFF!"
  const activeTitle = page.locator('.promo-carousel-slide.active .promo-carousel-title');
  await expect(activeTitle).toHaveText('10% OFF!');
});

// ─── Test 4 ───────────────────────────────────────────────────────────────────
test('e2e_landing_reviews_carousel', async ({ page }) => {
  await page.goto('/');

  const scrollContainer = page.locator('.reviews-scroll-container');
  await expect(scrollContainer).toBeVisible();

  // Read scrollLeft before clicking — runs real JS inside the browser
  const scrollBefore = await scrollContainer.evaluate(el => el.scrollLeft);

  // Click the right arrow (nth(1) = right, nth(0) = left)
  const rightArrow = page.locator('.nav-btn').nth(1);
  await rightArrow.click();

  // Give the smooth scroll animation time to settle
  await page.waitForTimeout(400);

  // scrollLeft must have increased — content scrolled to the right
  const scrollAfter = await scrollContainer.evaluate(el => el.scrollLeft);
  expect(scrollAfter).toBeGreaterThan(scrollBefore);
});

// ─── Test 5 ───────────────────────────────────────────────────────────────────
test('e2e_products_page_loads', async ({ page }) => {
  await page.goto('/products');

  // Page wrapper must be present
  await expect(page.locator('.shop-page-wrapper')).toBeVisible();

  // Default header shows when no filter is active
  await expect(page.locator('.shop-header h1')).toHaveText('Explore Our Shop');

  // Wait for the API response — grid appears once products are fetched
  const grid = page.locator('.shop-grid');
  await expect(grid).toBeVisible();

  // At least one product card must have loaded
  await expect(page.locator('.shop-card').first()).toBeVisible();
});

// ─── Test 6 ───────────────────────────────────────────────────────────────────
test('e2e_products_filter_category', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.shop-grid')).toBeVisible();

  // Scope to the first sidebar group (categories) to avoid matching price list
  const categoryGroup = page.locator('.sidebar-group').first();
  await categoryGroup.locator('li', { hasText: 'Heels' }).click();

  // Header updates to the selected category name
  await expect(page.locator('.shop-header h1')).toHaveText('Heels');

  // The clicked item must have the active class
  await expect(categoryGroup.locator('li.active')).toHaveText(/Heels/);

  // Grid must still be present (results exist or empty message shown)
  const gridVisible = await page.locator('.shop-grid').isVisible();
  const emptyVisible = await page.locator('.no-products-msg').isVisible();
  expect(gridVisible || emptyVisible).toBe(true);
});

// ─── Test 7 ───────────────────────────────────────────────────────────────────
test('e2e_products_filter_price', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.shop-grid')).toBeVisible();

  // Scope to the second sidebar group (price ranges)
  const priceGroup = page.locator('.sidebar-group').nth(1);
  await priceGroup.locator('li', { hasText: 'LKR 0 - LKR 10,000' }).click();

  // The clicked price range must now be active
  await expect(priceGroup.locator('li.active')).toContainText('LKR 0 - LKR 10,000');

  // Filter must produce either results or the empty message — not a blank page
  const gridVisible = await page.locator('.shop-grid').isVisible();
  const emptyVisible = await page.locator('.no-products-msg').isVisible();
  expect(gridVisible || emptyVisible).toBe(true);
});

// ─── Test 8 ───────────────────────────────────────────────────────────────────
test('e2e_products_filter_combined', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.shop-grid')).toBeVisible();

  const categoryGroup = page.locator('.sidebar-group').first();
  const priceGroup = page.locator('.sidebar-group').nth(1);

  // Apply category filter first
  await categoryGroup.locator('li', { hasText: 'Heels' }).click();
  await expect(page.locator('.shop-header h1')).toHaveText('Heels');

  // Then apply price filter on top
  await priceGroup.locator('li', { hasText: 'LKR 15,001 - LKR 20,000' }).click();

  // Both filters must show as active simultaneously
  await expect(categoryGroup.locator('li.active')).toContainText('Heels');
  await expect(priceGroup.locator('li.active')).toContainText('LKR 15,001 - LKR 20,000');

  // Grid must respond — either matching products or the empty state
  const gridVisible = await page.locator('.shop-grid').isVisible();
  const emptyVisible = await page.locator('.no-products-msg').isVisible();
  expect(gridVisible || emptyVisible).toBe(true);
});

// ─── Test 9 ───────────────────────────────────────────────────────────────────
test('e2e_products_filter_reset', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.shop-grid')).toBeVisible();

  const categoryGroup = page.locator('.sidebar-group').first();

  // Apply a filter first so there is something to reset
  await categoryGroup.locator('li', { hasText: 'Heels' }).click();
  await expect(page.locator('.shop-header h1')).toHaveText('Heels');

  // Click "All Products" to reset
  await categoryGroup.locator('li', { hasText: 'All Products' }).click();

  // Header must revert to the default title
  await expect(page.locator('.shop-header h1')).toHaveText('Explore Our Shop');

  // Full grid must be back — more than one card visible
  const cards = page.locator('.shop-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(1);
});
