import { expect, test, type Page } from '@playwright/test';

type UserRole = 'admin' | 'supplier' | 'store';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

const mockLoginSuccess = async (
  page: Page,
  options: {
    role: UserRole;
    username: string;
    name: string;
    availableRoles?: { role: string; name: string }[];
  }
) => {
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
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: {
            id: 1,
            username: options.username,
            role: options.role,
            name: options.name,
          },
          availableRoles: options.availableRoles,
        },
      }),
    });
  });
};

const mockLoginFailure = async (page: Page, message: string) => {
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
        code: 400,
        message,
        data: null,
      }),
    });
  });
};

test.describe('用户认证流程', () => {
  test('页面正确加载', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('供应链订货系统', { exact: true }).first()).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('管理员登录成功', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'admin', username: 'admin', name: '管理员A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('button', { name: /管理员A/ })).toBeVisible();
  });

  test('供应商登录成功', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'supplier', username: 'supplier001', name: '供应商A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'supplier001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/supplier');
  });

  test('门店登录成功', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'store', username: 'store001', name: '门店A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'store001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/store');
  });

  test('登录失败 - 用户名或密码错误', async ({ page }) => {
    await mockLoginFailure(page, '用户名或密码错误');
    await page.goto('/login');
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.getByText('用户名或密码错误').first()).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('登录失败 - 空用户名', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page.getByText('请输入用户名')).toBeVisible();
  });

  test('登录失败 - 空密码', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.click('button[type="submit"]');
    await expect(page.getByText('请输入密码')).toBeVisible();
  });

  test('登录后保存令牌', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'admin', username: 'admin', name: '管理员A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/admin');
    const token = await page.evaluate(() => window.localStorage.getItem('token'));
    const refreshToken = await page.evaluate(() =>
      window.localStorage.getItem('refreshToken')
    );
    expect(token).toBeTruthy();
    expect(refreshToken).toBeTruthy();
  });

  test('登出功能', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'admin', username: 'admin', name: '管理员A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');

    await page.getByRole('button', { name: /管理员A/ }).click();
    await page.getByRole('menuitem', { name: '退出登录' }).click();
    await expect(page).toHaveURL('/login');
  });
});

test.describe('登录状态保持', () => {
  test('刷新后仍保持登录', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'admin', username: 'admin', name: '管理员A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');

    await page.reload();
    await expect(page).toHaveURL('/admin');
  });
});

test.describe('权限访问控制', () => {
  test('未登录用户访问管理后台首页', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: '数据看板' })).toBeVisible();
  });

  test('门店用户访问管理员页面', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'store', username: 'store001', name: '门店A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'store001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/store');

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: '数据看板' })).toBeVisible();
  });

  test('供应商用户访问管理员页面', async ({ page }) => {
    await mockLoginSuccess(page, { role: 'supplier', username: 'supplier001', name: '供应商A' });
    await page.goto('/login');
    await page.fill('input[name="username"]', 'supplier001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/supplier');

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: '数据看板' })).toBeVisible();
  });
});
