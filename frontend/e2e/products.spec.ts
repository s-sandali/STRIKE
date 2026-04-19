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
