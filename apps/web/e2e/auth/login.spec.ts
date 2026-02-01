import { expect, test } from '@playwright/test';

test.describe('用户认证流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('页面正确加载', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/登录|Login/i);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('管理员登录成功', async ({ page }) => {
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // 验证登录成功并跳转到管理员仪表盘
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('.user-info, .avatar')).toBeVisible();
  });

  test('供应商登录成功', async ({ page }) => {
    await page.fill('input[name="username"]', 'supplier001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // 验证登录成功并跳转到供应商仪表盘
    await expect(page).toHaveURL(/\/supplier\/dashboard/);
  });

  test('门店登录成功', async ({ page }) => {
    await page.fill('input[name="username"]', 'store001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // 验证登录成功并跳转到门店仪表盘
    await expect(page).toHaveURL(/\/store\/dashboard/);
  });

  test('登录失败 - 用户名或密码错误', async ({ page }) => {
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // 验证显示错误提示
    await expect(page.locator('.ant-message-error, .error-message')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('登录失败 - 空用户名', async ({ page }) => {
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // 验证显示验证错误
    await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
  });

  test('登录失败 - 空密码', async ({ page }) => {
    await page.fill('input[name="username"]', 'admin');
    await page.click('button[type="submit"]');

    // 验证显示验证错误
    await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
  });

  test('记住我功能', async ({ page }) => {
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.check('input[name="remember"]');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 验证token已存储
    const localStorage = await page.evaluate(() => window.localStorage.getItem('token'));
    expect(localStorage).toBeTruthy();
  });

  test('登出功能', async ({ page }) => {
    // 先登录
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 点击登出
    await page.click('.user-menu, .avatar');
    await page.click('text=退出登录');

    // 验证跳转到登录页
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Token刷新机制', () => {
  test('Token过期后自动刷新', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 模拟token过期场景
    await page.evaluate(() => {
      const token = window.localStorage.getItem('token');
      if (token) {
        // 设置一个即将过期的token时间
        window.localStorage.setItem('tokenExpiry', String(Date.now() - 1000));
      }
    });

    // 刷新页面，应该自动刷新token
    await page.reload();

    // 验证仍然处于登录状态
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});

test.describe('权限访问控制', () => {
  test('未登录用户访问受保护页面被重定向', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('门店用户无法访问管理员页面', async ({ page }) => {
    // 以门店身份登录
    await page.goto('/login');
    await page.fill('input[name="username"]', 'store001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/store\/dashboard/);

    // 尝试访问管理员页面
    await page.goto('/admin/dashboard');

    // 应该被重定向或显示无权限
    await expect(page).not.toHaveURL('/admin/dashboard');
  });

  test('供应商用户无法访问管理员页面', async ({ page }) => {
    // 以供应商身份登录
    await page.goto('/login');
    await page.fill('input[name="username"]', 'supplier001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/supplier\/dashboard/);

    // 尝试访问管理员页面
    await page.goto('/admin/dashboard');

    // 应该被重定向或显示无权限
    await expect(page).not.toHaveURL('/admin/dashboard');
  });
});
