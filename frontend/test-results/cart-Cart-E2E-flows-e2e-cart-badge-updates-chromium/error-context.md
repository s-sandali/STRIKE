# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart E2E flows >> e2e_cart_badge_updates
- Location: e2e\cart.spec.ts:191:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.cart-badge')
Expected: "2"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for locator('.cart-badge')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e4]:
      - link "STRIKER" [ref=e5] [cursor=pointer]:
        - /url: /
      - link "Shop" [ref=e7] [cursor=pointer]:
        - /url: /products
      - generic [ref=e8]:
        - link [ref=e9] [cursor=pointer]:
          - /url: /cart
          - img [ref=e10]
        - link [ref=e14] [cursor=pointer]:
          - /url: /login
          - img [ref=e15]
  - main [ref=e18]:
    - generic [ref=e20]:
      - heading "Login" [level=2] [ref=e21]
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: Email
          - textbox "you@example.com" [ref=e25]
        - generic [ref=e26]:
          - generic [ref=e27]: Password
          - textbox "••••••••" [ref=e28]
        - button "Login" [ref=e29] [cursor=pointer]
      - paragraph [ref=e30]:
        - text: Don't have an account?
        - link "Register" [ref=e31] [cursor=pointer]:
          - /url: /register
```

# Test source

```ts
  116 | 
  117 |     await page.route(`${API_URL}/cart/`, async (route) => {
  118 |       await fulfillJson(route, 200, {
  119 |         items: [{ id: 101, product: mockProduct, quantity: 1 }],
  120 |       });
  121 |     });
  122 | 
  123 |     await loginViaUi(page, email);
  124 |     await page.goto('/cart');
  125 | 
  126 |     await expect(page.locator('.cart-item-price')).toHaveText('LKR 5,000.00');
  127 |   });
  128 | 
  129 |   test('e2e_cart_remove_item', async ({ page }) => {
  130 |     const email = uniqueEmail('cart-remove');
  131 |     let hasItem = true;
  132 | 
  133 |     await page.route(`${API_URL}/cart/`, async (route) => {
  134 |       if (hasItem) {
  135 |         await fulfillJson(route, 200, {
  136 |           items: [{ id: 101, product: mockProduct, quantity: 1 }],
  137 |         });
  138 |       } else {
  139 |         await fulfillJson(route, 200, { items: [] });
  140 |       }
  141 |     });
  142 | 
  143 |     // Mock delete success
  144 |     await page.route(`${API_URL}/cart/items/*`, async (route) => {
  145 |       hasItem = false; // Next time cart is fetched, it will be empty
  146 |       await fulfillJson(route, 204, null);
  147 |     });
  148 | 
  149 |     await loginViaUi(page, email);
  150 |     await page.goto('/cart');
  151 | 
  152 |     await page.locator('button.remove-btn').click();
  153 | 
  154 |     await expect(page.locator('text=Your shopping cart is currently empty.')).toBeVisible();
  155 |   });
  156 | 
  157 |   test('e2e_cart_empty_state', async ({ page }) => {
  158 |     const email = uniqueEmail('cart-empty');
  159 | 
  160 |     await page.route(`${API_URL}/cart/`, async (route) => {
  161 |       await fulfillJson(route, 200, { items: [] });
  162 |     });
  163 | 
  164 |     await loginViaUi(page, email);
  165 |     await page.goto('/cart');
  166 | 
  167 |     await expect(page.locator('text=Your shopping cart is currently empty.')).toBeVisible();
  168 |   });
  169 | 
  170 |   test('e2e_checkout_success', async ({ page }) => {
  171 |     const email = uniqueEmail('cart-checkout');
  172 | 
  173 |     await page.route(`${API_URL}/cart/`, async (route) => {
  174 |       await fulfillJson(route, 200, {
  175 |         items: [{ id: 101, product: mockProduct, quantity: 1 }],
  176 |       });
  177 |     });
  178 | 
  179 |     await page.route(`${API_URL}/checkout/`, async (route) => {
  180 |       await fulfillJson(route, 200, { detail: 'Order placed successfully' });
  181 |     });
  182 | 
  183 |     await loginViaUi(page, email);
  184 |     await page.goto('/cart');
  185 | 
  186 |     await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  187 | 
  188 |     await expect(page.locator('text=Order Placed Successfully!')).toBeVisible();
  189 |   });
  190 | 
  191 |   test('e2e_cart_badge_updates', async ({ page }) => {
  192 |     const email = uniqueEmail('cart-badge');
  193 |     let cartItems: any[] = [];
  194 | 
  195 |     await page.route(`${API_URL}/cart/`, async (route) => {
  196 |       await fulfillJson(route, 200, { items: cartItems });
  197 |     });
  198 | 
  199 |     await loginViaUi(page, email);
  200 | 
  201 |     // Initial badge shouldn't be there
  202 |     await expect(page.locator('.cart-badge')).toHaveCount(0);
  203 | 
  204 |     // Mock add to cart success
  205 |     await page.route(`${API_URL}/cart/items`, async (route) => {
  206 |       cartItems = [
  207 |         { id: 101, product: mockProduct, quantity: 1 },
  208 |         { id: 102, product: mockProduct, quantity: 1 },
  209 |       ];
  210 |       await fulfillJson(route, 200, { id: 101, product_id: 1, quantity: 1 });
  211 |     });
  212 | 
  213 |     await page.goto('/products/1');
  214 |     await page.locator('.add-to-cart-btn').click();
  215 | 
> 216 |     await expect(page.locator('.cart-badge')).toHaveText('2');
      |                                               ^ Error: expect(locator).toHaveText(expected) failed
  217 |   });
  218 | });
  219 | 
```