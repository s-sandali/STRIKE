import { test, expect, type Page, type Route } from '@playwright/test';

const FRONTEND_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.E2E_API_URL || 'http://localhost:8000';

test.use({ baseURL: FRONTEND_URL });

test.beforeEach(async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  // Clear storage only once per test (before login), not on every navigation
  await page.addInitScript(() => {
    if (!(window as any).__storageCleared) {
      localStorage.clear();
      sessionStorage.clear();
      (window as any).__storageCleared = true;
    }
  });
  await page.context().clearCookies();
});

function uniqueEmail(prefix: string) {
  return `${prefix}+${Date.now()}${Math.floor(Math.random() * 1000)}@test.com`;
}

async function fulfillJson(route: Route, status: number, payload: unknown) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  });
}

// Global Mocks for Products
const mockProduct = {
  id: 1,
  name: 'Test Sneaker',
  price: '5000.00',
  image_url: 'https://via.placeholder.com/150',
  description: 'A great test sneaker.',
  available_sizes: 'S, M, L',
  rating: 4.5,
  reviews_count: 10,
};

async function setupBaseMocks(page: Page) {
  await page.route(`${API_URL}/products/`, async (route) => {
    await fulfillJson(route, 200, [mockProduct]);
  });
  await page.route(`${API_URL}/products/1`, async (route) => {
    await fulfillJson(route, 200, mockProduct);
  });
}

async function loginViaUi(page: Page, email: string) {
  await page.route(`${API_URL}/auth/login`, async (route) => {
    await fulfillJson(route, 200, { access_token: 'mock-token', token_type: 'bearer' });
  });

  await page.goto('/login');
  await page.locator('input[name="username"]').fill(email);
  await page.locator('input[name="password"]').fill('Password123!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/products$/);
}

test.describe('Cart E2E flows', () => {
  test.beforeEach(async ({ page }) => {
    await setupBaseMocks(page);
  });

  test('e2e_add_to_cart_authenticated', async ({ page }) => {
    const email = uniqueEmail('cart-add');
    let cartItems: any[] = [];

    await page.route(`${API_URL}/cart/`, async (route) => {
      await fulfillJson(route, 200, { items: cartItems });
    });

    await loginViaUi(page, email);

    // Mock add to cart success
    await page.route(`${API_URL}/cart/items`, async (route) => {
      cartItems = [{ id: 101, product: mockProduct, quantity: 1 }];
      await fulfillJson(route, 200, { id: 101, product_id: 1, quantity: 1 });
    });

    await page.goto('/products/1');
    await page.locator('.add-to-cart-btn').click();

    await expect(page.locator('text=Added to cart!')).toBeVisible();
    await expect(page.locator('.cart-badge')).toHaveText('1');
  });

  test('e2e_add_to_cart_unauthenticated', async ({ page }) => {
    await page.goto('/products/1');
    await page.locator('.add-to-cart-btn').click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('e2e_cart_page_shows_items', async ({ page }) => {
    const email = uniqueEmail('cart-shows');

    await page.route(`${API_URL}/cart/`, async (route) => {
      await fulfillJson(route, 200, {
        items: [{ id: 101, product: mockProduct, quantity: 1 }],
      });
    });

    await loginViaUi(page, email);
    await page.goto('/cart');

    await expect(page.locator('.cart-item-name')).toHaveText('Test Sneaker');
  });

  test('e2e_cart_shows_correct_price', async ({ page }) => {
    const email = uniqueEmail('cart-price');

    await page.route(`${API_URL}/cart/`, async (route) => {
      await fulfillJson(route, 200, {
        items: [{ id: 101, product: mockProduct, quantity: 1 }],
      });
    });

    await loginViaUi(page, email);
    await page.goto('/cart');

    await expect(page.locator('.cart-item-price')).toHaveText('LKR 5,000.00');
  });

  test('e2e_cart_remove_item', async ({ page }) => {
    const email = uniqueEmail('cart-remove');
    let hasItem = true;

    await page.route(`${API_URL}/cart/`, async (route) => {
      if (hasItem) {
        await fulfillJson(route, 200, {
          items: [{ id: 101, product: mockProduct, quantity: 1 }],
        });
      } else {
        await fulfillJson(route, 200, { items: [] });
      }
    });

    // Mock delete success
    await page.route(`${API_URL}/cart/items/*`, async (route) => {
      hasItem = false; // Next time cart is fetched, it will be empty
      await fulfillJson(route, 204, null);
    });

    await loginViaUi(page, email);
    await page.goto('/cart');

    await page.locator('button.remove-btn').click();

    await expect(page.locator('text=Your shopping cart is currently empty.')).toBeVisible();
  });

  test('e2e_cart_empty_state', async ({ page }) => {
    const email = uniqueEmail('cart-empty');

    await page.route(`${API_URL}/cart/`, async (route) => {
      await fulfillJson(route, 200, { items: [] });
    });

    await loginViaUi(page, email);
    await page.goto('/cart');

    await expect(page.locator('text=Your shopping cart is currently empty.')).toBeVisible();
  });

  test('e2e_checkout_success', async ({ page }) => {
    const email = uniqueEmail('cart-checkout');

    await page.route(`${API_URL}/cart/`, async (route) => {
      await fulfillJson(route, 200, {
        items: [{ id: 101, product: mockProduct, quantity: 1 }],
      });
    });

    await page.route(`${API_URL}/checkout/`, async (route) => {
      await fulfillJson(route, 200, { detail: 'Order placed successfully' });
    });

    await loginViaUi(page, email);
    await page.goto('/cart');

    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    await expect(page.locator('text=Order Placed Successfully!')).toBeVisible();
  });

  test('e2e_cart_badge_updates', async ({ page }) => {
    const email = uniqueEmail('cart-badge');
    let cartItems: any[] = [];

    await page.route(`${API_URL}/cart/`, async (route) => {
      await fulfillJson(route, 200, { items: cartItems });
    });

    await loginViaUi(page, email);

    // Initial badge shouldn't be there
    await expect(page.locator('.cart-badge')).toHaveCount(0);

    // Mock add to cart success
    await page.route(`${API_URL}/cart/items`, async (route) => {
      cartItems = [
        { id: 101, product: mockProduct, quantity: 1 },
        { id: 102, product: mockProduct, quantity: 1 },
      ];
      await fulfillJson(route, 200, { id: 101, product_id: 1, quantity: 1 });
    });

    await page.goto('/products/1');
    await page.locator('.add-to-cart-btn').click();

    await expect(page.locator('.cart-badge')).toHaveText('2');
  });
});
