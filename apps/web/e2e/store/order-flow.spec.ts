import { expect, test, type Page } from '@playwright/test';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

test.describe('门店端核心流程', () => {
  const loginAsStore = async (page: Page) => {
    await page.route('**/auth/login', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }

      await route.fulfill({
        status: 200,
        headers: corsHeaders,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 0,
          message: 'ok',
          data: {
            accessToken: 'store-access-token',
            refreshToken: 'store-refresh-token',
            user: {
              id: 3,
              username: 'store001',
              role: 'store',
              name: '门店A',
            },
          },
        }),
      });
    });
  };

  test.beforeEach(async ({ page }) => {
    await loginAsStore(page);
    await page.goto('/login');
    await page.fill('input[name="username"]', 'store001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/store');
  });

  test('门店数据看板可访问', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '门店数据看板' })).toBeVisible();
    await expect(page.getByText('常购物料TOP10')).toBeVisible();
  });

  test('账户信息页面可访问', async ({ page }) => {
    await page.goto('/store/account');
    await expect(page.getByRole('heading', { name: '账户信息' })).toBeVisible();
    await expect(page.getByText('门店基本信息')).toBeVisible();
  });
});
