import { expect, test } from '@playwright/test';

test.describe('门店端核心流程', () => {
  test.beforeEach(async ({ page }) => {
    // 登录门店账号
    await page.goto('/login');
    await page.fill('input[name="username"]', 'store001');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/store/dashboard');
  });

  test('浏览物料并添加到购物车', async ({ page }) => {
    // 进入商城页面
    await page.goto('/store/market');
    await expect(page.locator('h1')).toContainText('商城');

    // 选择分类
    await page.click('text=粮油');
    await expect(page.locator('.material-list')).toBeVisible();

    // 添加物料到购物车
    const firstMaterial = page.locator('.material-card').first();
    await firstMaterial.click();
    await page.fill('input[name="quantity"]', '2');
    await page.click('button:has-text("加入购物车")');

    // 验证购物车数量更新
    await expect(page.locator('.cart-badge')).toContainText('1');
  });

  test('从购物车创建订单', async ({ page }) => {
    // 进入购物车
    await page.goto('/store/cart');
    await expect(page.locator('h1')).toContainText('购物车');

    // 选择商品并提交订单
    await page.click('input[type="checkbox"]');
    await page.click('button:has-text("去结算")');

    // 确认订单
    await expect(page).toHaveURL(/\/store\/order\/confirm/);
    await page.fill('textarea[name="remark"]', '测试订单备注');
    await page.click('button:has-text("提交订单")');

    // 验证订单创建成功
    await expect(page.locator('.success-message')).toContainText('订单创建成功');
  });

  test('查看订单详情', async ({ page }) => {
    // 进入订单列表
    await page.goto('/store/orders');
    await expect(page.locator('h1')).toContainText('我的订单');

    // 点击第一个订单
    await page.locator('.order-card').first().click();

    // 验证订单详情页面
    await expect(page.locator('.order-detail')).toBeVisible();
    await expect(page.locator('.order-no')).toBeVisible();
    await expect(page.locator('.order-status')).toBeVisible();
  });
});
