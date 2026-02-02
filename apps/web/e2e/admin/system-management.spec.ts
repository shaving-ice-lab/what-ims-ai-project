import { expect, test, type Page } from '@playwright/test';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

test.describe('管理员端核心流程', () => {
  const loginAsAdmin = async (page: Page) => {
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
            accessToken: 'admin-access-token',
            refreshToken: 'admin-refresh-token',
            user: {
              id: 1,
              username: 'admin',
              role: 'admin',
              name: '管理员A',
            },
          },
        }),
      });
    });
  };

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('查看数据概览', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '数据看板' })).toBeVisible();
    await expect(page.getByText('总门店数')).toBeVisible();
    await expect(page.getByText('今日订单数')).toBeVisible();
    await expect(page.getByText('今日交易额')).toBeVisible();
  });

  test('管理员管理列表可访问', async ({ page }) => {
    await page.goto('/admin/admins');
    await expect(page.getByRole('heading', { name: '管理员管理' })).toBeVisible();
    await expect(page.getByText('管理员列表')).toBeVisible();
  });

  test('价格预警页面可访问', async ({ page }) => {
    await page.goto('/admin/market/alerts');
    await expect(page.getByRole('heading', { name: '价格预警管理' })).toBeVisible();
    await expect(page.getByText('预警规则')).toBeVisible();
  });

  test('配送设置审核页面可访问', async ({ page }) => {
    await page.goto('/admin/delivery-audit');
    await expect(page.getByRole('heading', { name: '配送设置审核' })).toBeVisible();
    await expect(page.getByText('审核记录')).toBeVisible();
  });
});
