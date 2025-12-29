import { expect, test } from '@playwright/test';

test.describe('供应商端核心流程', () => {
  test.beforeEach(async ({ page }) => {
    // 登录供应商账号
    await page.goto('/login');
    await page.fill('input[name="username"]', 'supplier001');
    await page.fill('input[name="password"]', '123456');
    await page.selectOption('select[name="role"]', 'supplier');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/supplier/dashboard');
  });

  test('查看待处理订单列表', async ({ page }) => {
    // 进入订单管理
    await page.goto('/supplier/orders');
    await expect(page.locator('h1')).toContainText('订单管理');

    // 筛选待处理订单
    await page.click('text=待处理');
    await expect(page.locator('.order-list')).toBeVisible();
  });

  test('确认订单', async ({ page }) => {
    await page.goto('/supplier/orders?status=pending');

    // 选择第一个待处理订单
    const firstOrder = page.locator('.order-card').first();
    await firstOrder.click();

    // 确认订单
    await page.click('button:has-text("确认订单")');
    await expect(page.locator('.ant-modal')).toBeVisible();
    await page.click('.ant-modal button:has-text("确定")');

    // 验证状态更新
    await expect(page.locator('.order-status')).toContainText('已确认');
  });

  test('开始配送', async ({ page }) => {
    await page.goto('/supplier/orders?status=confirmed');

    // 选择已确认订单
    const firstOrder = page.locator('.order-card').first();
    await firstOrder.click();

    // 开始配送
    await page.click('button:has-text("开始配送")');
    await page.click('.ant-modal button:has-text("确定")');

    // 验证状态更新
    await expect(page.locator('.order-status')).toContainText('配送中');
  });

  test('管理物料价格', async ({ page }) => {
    // 进入价格管理
    await page.goto('/supplier/materials');
    await expect(page.locator('h1')).toContainText('价格管理');

    // 搜索物料
    await page.fill('input[placeholder*="搜索"]', '大米');
    await expect(page.locator('.material-list')).toBeVisible();

    // 修改价格
    await page.locator('.material-card').first().locator('.edit-price-btn').click();
    await page.fill('input[name="price"]', '25.50');
    await page.click('button:has-text("保存")');

    // 验证价格更新
    await expect(page.locator('.success-message')).toContainText('价格更新成功');
  });
});
