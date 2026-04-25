import { test, expect, type Page, type Route } from '@playwright/test';

const FRONTEND_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.E2E_API_URL || 'http://localhost:8000';

test.use({ baseURL: FRONTEND_URL });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
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

async function mockCartForAuthUser(page: Page) {
  await page.route(`${API_URL}/cart/`, async (route) => {
    const authHeader = route.request().headers()['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      await fulfillJson(route, 200, { items: [] });
      return;
    }
    await fulfillJson(route, 401, { detail: 'Not authenticated' });
  });
}

async function registerViaUi(page: Page, email: string, password: string) {
  await page.goto('/register');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
}

async function loginViaUi(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('input[name="username"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('Authentication E2E flows', () => {
  test('e2e_register_new_user', async ({ page }) => {
    const email = uniqueEmail('register-success');

    await page.route(`${API_URL}/auth/register`, async (route) => {
      await fulfillJson(route, 201, { id: 101, email });
    });

    await registerViaUi(page, email, 'Password123!');

    await expect(page.locator('.success')).toHaveText('Account created! Redirecting to login...');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('e2e_register_duplicate_email', async ({ page }) => {
    await page.route(`${API_URL}/auth/register`, async (route) => {
      await fulfillJson(route, 409, { detail: 'An account with this email already exists' });
    });

    await registerViaUi(page, 'existing@test.com', 'Password123!');

    await expect(page.locator('.error')).toHaveText('An account with this email already exists');
    await expect(page).toHaveURL(/\/register$/);
  });

  test('e2e_register_invalid_email', async ({ page }) => {
    await page.goto('/register');
    await page.locator('input[name="email"]').fill('notanemail');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.getByRole('button', { name: 'Register' }).click();

    const validationMessage = await page.locator('input[name="email"]').evaluate(
      (el) => (el as HTMLInputElement).validationMessage,
    );

    expect(validationMessage.length).toBeGreaterThan(0);
    await expect(page).toHaveURL(/\/register$/);
  });

  test('e2e_login_success', async ({ page }) => {
    await page.route(`${API_URL}/auth/login`, async (route) => {
      await fulfillJson(route, 200, { access_token: 'mock-token', token_type: 'bearer' });
    });
    await mockCartForAuthUser(page);

    await loginViaUi(page, 'valid@test.com', 'Password123!');

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.locator('a[href="/cart"]')).toBeVisible();
  });

  test('e2e_login_wrong_password', async ({ page }) => {
    await page.route(`${API_URL}/auth/login`, async (route) => {
      await fulfillJson(route, 401, { detail: 'Invalid email or password' });
    });

    await loginViaUi(page, 'valid@test.com', 'WrongPassword123!');

    await expect(page.locator('.error')).toHaveText('Invalid email or password');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('e2e_login_nonexistent_user', async ({ page }) => {
    await page.route(`${API_URL}/auth/login`, async (route) => {
      await fulfillJson(route, 401, { detail: 'Invalid email or password' });
    });

    await loginViaUi(page, uniqueEmail('missing-user'), 'Password123!');

    await expect(page.locator('.error')).toHaveText('Invalid email or password');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('e2e_logout', async ({ page }) => {
    await page.route(`${API_URL}/auth/login`, async (route) => {
      await fulfillJson(route, 200, { access_token: 'mock-token', token_type: 'bearer' });
    });
    await mockCartForAuthUser(page);

    await loginViaUi(page, 'logout@test.com', 'Password123!');
    await expect(page).toHaveURL(/\/products$/);

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(`${FRONTEND_URL}/`);
    await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(0);
    await expect(page.locator('a[href="/login"].navbar-icon-btn')).toBeVisible();
  });

  test('e2e_redirect_unauthenticated', async ({ page }) => {
    await page.goto('/cart');

    await expect(page).toHaveURL(/\/login$/);
  });
});