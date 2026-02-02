import { expect, test, type Page } from '@playwright/test';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

test.describe('供应商端核心流程', () => {
  const loginAsSupplier = async (page: Page) => {
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
            accessToken: 'supplier-access-token',
            refreshToken: 'supplier-refresh-token',
            user: {
              id: 2,
              username: 'supplier001',
              role: 'supplier',
              name: '供应商A',
            },
          },
        }),
      });
    });
  };

  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
    await page.goto('/login');
    await page.fill('input[name="username"]', 'supplier001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/supplier');
  });

  test('查看供应商数据概览', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '订单概览' })).toBeVisible();
    await expect(page.getByText('待处理订单').first()).toBeVisible();
  });

  test('物料价格管理页面可访问', async ({ page }) => {
    await page.goto('/supplier/materials');
    await expect(page.getByRole('heading', { name: '物料价格管理' })).toBeVisible();
    await expect(page.getByText('物料名称')).toBeVisible();
  });

  test('库存管理页面可访问', async ({ page }) => {
    await page.goto('/supplier/materials/stock');
    await expect(page.getByRole('heading', { name: '库存管理' })).toBeVisible();
    await expect(page.getByText('有货物料')).toBeVisible();
  });

  test('配送设置页面可访问', async ({ page }) => {
    await page.goto('/supplier/delivery');
    await expect(page.getByRole('heading', { name: '配送设置' })).toBeVisible();
    await expect(page.getByText('起送价设置')).toBeVisible();
  });

  test('市场行情页面可访问', async ({ page }) => {
    await page.goto('/supplier/market');
    await expect(page.getByRole('heading', { name: '市场行情' })).toBeVisible();
    await expect(page.getByText('价格最低')).toBeVisible();
  });
});
