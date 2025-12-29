import { expect, test } from '@playwright/test';

test.describe('管理员端核心流程', () => {
  test.beforeEach(async ({ page }) => {
    // 登录管理员账号
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.selectOption('select[name="role"]', 'admin');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('查看数据概览', async ({ page }) => {
    await expect(page.locator('.stats-card')).toHaveCount(4);
    await expect(page.locator('text=今日订单')).toBeVisible();
    await expect(page.locator('text=订单金额')).toBeVisible();
  });

  test('管理门店', async ({ page }) => {
    await page.goto('/admin/stores');
    await expect(page.locator('h1')).toContainText('门店管理');

    // 搜索门店
    await page.fill('input[placeholder*="搜索"]', '朝阳');
    await expect(page.locator('.store-table tbody tr')).toHaveCount.above(0);

    // 查看门店详情
    await page.locator('.store-table tbody tr').first().click();
    await expect(page.locator('.store-detail')).toBeVisible();
  });

  test('管理供应商', async ({ page }) => {
    await page.goto('/admin/suppliers');
    await expect(page.locator('h1')).toContainText('供应商管理');

    // 筛选供应商状态
    await page.selectOption('select[name="status"]', 'active');
    await expect(page.locator('.supplier-table tbody tr')).toBeVisible();
  });

  test('查看订单监控', async ({ page }) => {
    await page.goto('/admin/orders');
    await expect(page.locator('h1')).toContainText('订单监控');

    // 筛选订单状态
    await page.click('text=待确认');
    await expect(page.locator('.order-list')).toBeVisible();

    // 查看订单详情
    await page.locator('.order-card').first().click();
    await expect(page.locator('.order-detail-modal')).toBeVisible();
  });

  test('设置加价规则', async ({ page }) => {
    await page.goto('/admin/settings/markup');
    await expect(page.locator('h1')).toContainText('加价设置');

    // 修改默认加价比例
    await page.fill('input[name="defaultMarkupRate"]', '15');
    await page.click('button:has-text("保存")');

    // 验证保存成功
    await expect(page.locator('.success-message')).toContainText('保存成功');
  });
});
