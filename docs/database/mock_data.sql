-- ============================================================
-- IMS (Inventory Management System) Mock数据
-- 供应链订货系统 - 测试数据
-- ============================================================

USE `what-ims-db`;

-- ============================================================
-- 1. 用户数据
-- 密码均为: password123 (bcrypt加密后)
-- ============================================================
INSERT INTO ims_users (id, username, password_hash, role, phone, email, status) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'admin', '13800138000', 'admin@ims.com', 1),
(2, 'subadmin1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'sub_admin', '13800138001', 'subadmin1@ims.com', 1),
(3, 'supplier1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'supplier', '13900139001', 'supplier1@ims.com', 1),
(4, 'supplier2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'supplier', '13900139002', 'supplier2@ims.com', 1),
(5, 'store1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'store', '13700137001', 'store1@ims.com', 1),
(6, 'store2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'store', '13700137002', 'store2@ims.com', 1),
(7, 'store3', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IZAOm5.g8BLlELfLEWjUQGKPpLjNHO', 'store', '13700137003', 'store3@ims.com', 1);

-- ============================================================
-- 2. 管理员数据
-- ============================================================
INSERT INTO ims_admins (id, user_id, name, is_primary, permissions, status) VALUES
(1, 1, '系统管理员', 1, '["order","report","supplier","store","material","media","product_audit","markup","delivery_audit","webhook","payment_config","api_config","system_config","admin_manage"]', 1),
(2, 2, '运营管理员', 0, '["order","report","supplier","store","material","product_audit"]', 1);

-- ============================================================
-- 3. 供应商数据
-- ============================================================
INSERT INTO ims_suppliers (id, user_id, supplier_no, name, display_name, contact_name, contact_phone, min_order_amount, delivery_days, delivery_mode, management_mode, status) VALUES
(1, 3, 'SUP20241201001', '鲜果源供应商', '鲜果源', '张经理', '13900139001', 100.00, '[1,2,3,4,5]', 'self_delivery', 'self', 1),
(2, 4, 'SUP20241201002', '优质蔬菜配送中心', '优菜配送', '李经理', '13900139002', 50.00, '[1,3,5]', 'self_delivery', 'managed', 1);

-- ============================================================
-- 4. 配送区域数据
-- ============================================================
INSERT INTO ims_delivery_areas (supplier_id, province, city, district, status) VALUES
(1, '广东省', '深圳市', NULL, 1),
(1, '广东省', '广州市', '天河区', 1),
(1, '广东省', '广州市', '越秀区', 1),
(2, '广东省', '深圳市', '南山区', 1),
(2, '广东省', '深圳市', '福田区', 1);

-- ============================================================
-- 5. 门店数据
-- ============================================================
INSERT INTO ims_stores (id, user_id, store_no, name, province, city, district, address, contact_name, contact_phone, latitude, longitude, status) VALUES
(1, 5, 'S20241201001', '南山旗舰店', '广东省', '深圳市', '南山区', '科技园南路88号', '王店长', '13700137001', 22.5431000, 113.9519000, 1),
(2, 6, 'S20241201002', '福田中心店', '广东省', '深圳市', '福田区', '深南大道1001号', '陈店长', '13700137002', 22.5411000, 114.0579000, 1),
(3, 7, 'S20241201003', '天河分店', '广东省', '广州市', '天河区', '天河路385号', '刘店长', '13700137003', 23.1291000, 113.3219000, 1);

-- ============================================================
-- 6. 分类数据
-- ============================================================
INSERT INTO ims_categories (id, name, icon, sort_order, parent_id, level, path, status) VALUES
(1, '水果', '/icons/fruit.png', 1, NULL, 1, '', 1),
(2, '蔬菜', '/icons/vegetable.png', 2, NULL, 1, '', 1),
(3, '肉类', '/icons/meat.png', 3, NULL, 1, '', 1),
(4, '海鲜', '/icons/seafood.png', 4, NULL, 1, '', 1),
(5, '调味品', '/icons/seasoning.png', 5, NULL, 1, '', 1),
(6, '热带水果', NULL, 1, 1, 2, '1', 1),
(7, '时令水果', NULL, 2, 1, 2, '1', 1),
(8, '叶菜类', NULL, 1, 2, 2, '2', 1),
(9, '根茎类', NULL, 2, 2, 2, '2', 1),
(10, '猪肉', NULL, 1, 3, 2, '3', 1),
(11, '牛肉', NULL, 2, 3, 2, '3', 1);

-- ============================================================
-- 7. 物料数据
-- ============================================================
INSERT INTO ims_materials (id, material_no, category_id, name, alias, description, keywords, sort_order, status) VALUES
(1, 'MAT20241201001', 6, '芒果', '金煌芒', '新鲜热带芒果，香甜可口', '芒果,水果,热带', 1, 1),
(2, 'MAT20241201002', 6, '榴莲', '猫山王', '马来西亚进口猫山王榴莲', '榴莲,热带,进口', 2, 1),
(3, 'MAT20241201003', 7, '苹果', '红富士', '山东红富士苹果，脆甜多汁', '苹果,水果,红富士', 1, 1),
(4, 'MAT20241201004', 7, '橙子', '赣南脐橙', '江西赣南脐橙，酸甜可口', '橙子,脐橙,水果', 2, 1),
(5, 'MAT20241201005', 8, '菠菜', NULL, '新鲜菠菜，营养丰富', '菠菜,叶菜,蔬菜', 1, 1),
(6, 'MAT20241201006', 8, '生菜', '罗马生菜', '有机罗马生菜', '生菜,叶菜,有机', 2, 1),
(7, 'MAT20241201007', 9, '土豆', '荷兰土豆', '荷兰进口土豆', '土豆,根茎,蔬菜', 1, 1),
(8, 'MAT20241201008', 9, '胡萝卜', NULL, '新鲜胡萝卜', '胡萝卜,根茎,蔬菜', 2, 1),
(9, 'MAT20241201009', 10, '五花肉', NULL, '精选五花肉', '五花肉,猪肉,肉类', 1, 1),
(10, 'MAT20241201010', 11, '牛腩', NULL, '精选牛腩肉', '牛腩,牛肉,肉类', 1, 1);

-- ============================================================
-- 8. 物料SKU数据
-- ============================================================
INSERT INTO ims_material_skus (id, sku_no, material_id, brand, spec, unit, weight, status) VALUES
(1, 'SKU20241201000001', 1, '果然美', '500g/盒', '盒', 0.500, 1),
(2, 'SKU20241201000002', 1, '果然美', '1kg/箱', '箱', 1.000, 1),
(3, 'SKU20241201000003', 2, '马来西亚', '2kg/个', '个', 2.000, 1),
(4, 'SKU20241201000004', 3, '红富士', '5kg/箱', '箱', 5.000, 1),
(5, 'SKU20241201000005', 3, '红富士', '10kg/箱', '箱', 10.000, 1),
(6, 'SKU20241201000006', 4, '赣南', '5kg/箱', '箱', 5.000, 1),
(7, 'SKU20241201000007', 5, '本地', '250g/把', '把', 0.250, 1),
(8, 'SKU20241201000008', 6, '有机农场', '300g/盒', '盒', 0.300, 1),
(9, 'SKU20241201000009', 7, '荷兰', '2.5kg/袋', '袋', 2.500, 1),
(10, 'SKU20241201000010', 8, '本地', '500g/袋', '袋', 0.500, 1),
(11, 'SKU20241201000011', 9, '黑土猪', '500g/份', '份', 0.500, 1),
(12, 'SKU20241201000012', 10, '安格斯', '500g/份', '份', 0.500, 1);

-- ============================================================
-- 9. 供应商物料数据
-- ============================================================
INSERT INTO ims_supplier_materials (id, supplier_id, material_sku_id, price, original_price, min_quantity, step_quantity, stock_status, audit_status, is_recommended, sales_count, status) VALUES
(1, 1, 1, 15.80, 18.00, 1, 1, 'in_stock', 'approved', 1, 150, 1),
(2, 1, 2, 28.00, 32.00, 1, 1, 'in_stock', 'approved', 0, 80, 1),
(3, 1, 3, 168.00, 188.00, 1, 1, 'in_stock', 'approved', 1, 45, 1),
(4, 1, 4, 35.00, 40.00, 1, 1, 'in_stock', 'approved', 1, 200, 1),
(5, 1, 5, 65.00, 75.00, 1, 1, 'in_stock', 'approved', 0, 120, 1),
(6, 1, 6, 42.00, 48.00, 1, 1, 'in_stock', 'approved', 0, 95, 1),
(7, 2, 7, 3.50, 4.00, 2, 1, 'in_stock', 'approved', 1, 300, 1),
(8, 2, 8, 8.80, 10.00, 1, 1, 'in_stock', 'approved', 0, 180, 1),
(9, 2, 9, 12.50, 15.00, 2, 1, 'in_stock', 'approved', 1, 220, 1),
(10, 2, 10, 4.50, 5.00, 2, 1, 'in_stock', 'approved', 0, 250, 1),
(11, 1, 11, 32.00, 38.00, 1, 1, 'in_stock', 'approved', 1, 85, 1),
(12, 1, 12, 68.00, 78.00, 1, 1, 'in_stock', 'approved', 1, 60, 1);

-- ============================================================
-- 10. 订单数据
-- ============================================================
INSERT INTO ims_orders (id, order_no, store_id, supplier_id, goods_amount, service_fee, total_amount, supplier_amount, markup_total, item_count, status, payment_status, payment_method, payment_time, order_source, delivery_province, delivery_city, delivery_district, delivery_address, delivery_contact, delivery_phone, expected_delivery_date, confirmed_at, created_at) VALUES
(1, 'ORD20241201000001', 1, 1, 256.80, 0.77, 257.57, 243.00, 13.80, 3, 'completed', 'paid', 'wechat', '2024-12-01 10:30:00', 'app', '广东省', '深圳市', '南山区', '科技园南路88号', '王店长', '13700137001', '2024-12-02', '2024-12-01 11:00:00', '2024-12-01 10:00:00'),
(2, 'ORD20241201000002', 2, 1, 168.00, 0.50, 168.50, 158.00, 10.00, 1, 'delivering', 'paid', 'wechat', '2024-12-01 14:30:00', 'app', '广东省', '深圳市', '福田区', '深南大道1001号', '陈店长', '13700137002', '2024-12-02', '2024-12-01 15:00:00', '2024-12-01 14:00:00'),
(3, 'ORD20241201000003', 1, 2, 45.50, 0.14, 45.64, 42.00, 3.50, 4, 'confirmed', 'paid', 'alipay', '2024-12-01 16:30:00', 'app', '广东省', '深圳市', '南山区', '科技园南路88号', '王店长', '13700137001', '2024-12-03', '2024-12-01 17:00:00', '2024-12-01 16:00:00'),
(4, 'ORD20241201000004', 3, 1, 135.00, 0.41, 135.41, 128.00, 7.00, 2, 'pending_confirm', 'paid', 'wechat', '2024-12-01 18:30:00', 'h5', '广东省', '广州市', '天河区', '天河路385号', '刘店长', '13700137003', '2024-12-03', NULL, '2024-12-01 18:00:00'),
(5, 'ORD20241201000005', 2, 2, 28.00, 0.08, 28.08, 26.00, 2.00, 2, 'pending_payment', 'unpaid', NULL, NULL, 'app', '广东省', '深圳市', '福田区', '深南大道1001号', '陈店长', '13700137002', '2024-12-04', NULL, '2024-12-01 19:00:00');

-- ============================================================
-- 11. 订单项数据
-- ============================================================
INSERT INTO ims_order_items (order_id, material_sku_id, material_name, brand, spec, unit, quantity, unit_price, markup_amount, final_price, subtotal) VALUES
(1, 1, '芒果', '果然美', '500g/盒', '盒', 5, 15.80, 0.50, 16.30, 81.50),
(1, 4, '苹果', '红富士', '5kg/箱', '箱', 2, 35.00, 2.00, 37.00, 74.00),
(1, 6, '橙子', '赣南', '5kg/箱', '箱', 2, 42.00, 2.65, 44.65, 89.30),
(2, 3, '榴莲', '马来西亚', '2kg/个', '个', 1, 168.00, 10.00, 178.00, 178.00),
(3, 7, '菠菜', '本地', '250g/把', '把', 5, 3.50, 0.30, 3.80, 19.00),
(3, 8, '生菜', '有机农场', '300g/盒', '盒', 2, 8.80, 0.70, 9.50, 19.00),
(3, 10, '胡萝卜', '本地', '500g/袋', '袋', 2, 4.50, 0.40, 4.90, 9.80),
(4, 1, '芒果', '果然美', '500g/盒', '盒', 3, 15.80, 0.50, 16.30, 48.90),
(4, 2, '芒果', '果然美', '1kg/箱', '箱', 2, 28.00, 2.00, 30.00, 60.00),
(5, 9, '土豆', '荷兰', '2.5kg/袋', '袋', 2, 12.50, 1.00, 13.50, 27.00);

-- ============================================================
-- 12. 订单状态日志数据
-- ============================================================
INSERT INTO ims_order_status_logs (order_id, from_status, to_status, operator_type, remark, created_at) VALUES
(1, NULL, 'pending_payment', 'store', '订单创建', '2024-12-01 10:00:00'),
(1, 'pending_payment', 'pending_confirm', 'system', '支付成功', '2024-12-01 10:30:00'),
(1, 'pending_confirm', 'confirmed', 'supplier', '供应商确认订单', '2024-12-01 11:00:00'),
(1, 'confirmed', 'delivering', 'supplier', '开始配送', '2024-12-02 08:00:00'),
(1, 'delivering', 'completed', 'store', '确认收货', '2024-12-02 10:30:00'),
(2, NULL, 'pending_payment', 'store', '订单创建', '2024-12-01 14:00:00'),
(2, 'pending_payment', 'pending_confirm', 'system', '支付成功', '2024-12-01 14:30:00'),
(2, 'pending_confirm', 'confirmed', 'supplier', '供应商确认订单', '2024-12-01 15:00:00'),
(2, 'confirmed', 'delivering', 'supplier', '开始配送', '2024-12-02 08:30:00'),
(3, NULL, 'pending_payment', 'store', '订单创建', '2024-12-01 16:00:00'),
(3, 'pending_payment', 'pending_confirm', 'system', '支付成功', '2024-12-01 16:30:00'),
(3, 'pending_confirm', 'confirmed', 'supplier', '供应商确认订单', '2024-12-01 17:00:00'),
(4, NULL, 'pending_payment', 'store', '订单创建', '2024-12-01 18:00:00'),
(4, 'pending_payment', 'pending_confirm', 'system', '支付成功', '2024-12-01 18:30:00'),
(5, NULL, 'pending_payment', 'store', '订单创建', '2024-12-01 19:00:00');

-- ============================================================
-- 13. 支付记录数据
-- ============================================================
INSERT INTO ims_payment_records (order_id, order_no, payment_no, payment_method, goods_amount, service_fee, amount, status, trade_no, pay_time, created_at) VALUES
(1, 'ORD20241201000001', 'PAY20241201100001', 'wechat', 256.80, 0.77, 257.57, 'success', 'WX4200001234567890', '2024-12-01 10:30:00', '2024-12-01 10:00:00'),
(2, 'ORD20241201000002', 'PAY20241201140001', 'wechat', 168.00, 0.50, 168.50, 'success', 'WX4200001234567891', '2024-12-01 14:30:00', '2024-12-01 14:00:00'),
(3, 'ORD20241201000003', 'PAY20241201160001', 'alipay', 45.50, 0.14, 45.64, 'success', 'ALI2024120116001', '2024-12-01 16:30:00', '2024-12-01 16:00:00'),
(4, 'ORD20241201000004', 'PAY20241201180001', 'wechat', 135.00, 0.41, 135.41, 'success', 'WX4200001234567892', '2024-12-01 18:30:00', '2024-12-01 18:00:00'),
(5, 'ORD20241201000005', 'PAY20241201190001', 'wechat', 28.00, 0.08, 28.08, 'pending', NULL, NULL, '2024-12-01 19:00:00');

-- ============================================================
-- 14. 加价规则数据
-- ============================================================
INSERT INTO ims_price_markups (name, description, store_id, supplier_id, category_id, material_id, markup_type, markup_value, min_markup, max_markup, priority, is_active, created_by) VALUES
('全局加价5%', '所有商品默认加价5%', NULL, NULL, NULL, NULL, 'percent', 0.0500, 0.50, 50.00, 0, 1, 1),
('水果类加价8%', '水果分类商品加价8%', NULL, NULL, 1, NULL, 'percent', 0.0800, 1.00, 100.00, 10, 1, 1),
('南山店特惠', '南山旗舰店加价3%', 1, NULL, NULL, NULL, 'percent', 0.0300, 0.30, 30.00, 5, 1, 1),
('榴莲固定加价', '榴莲固定加价10元', NULL, NULL, NULL, 2, 'fixed', 10.0000, NULL, NULL, 20, 1, 1);

-- ============================================================
-- 15. 系统配置数据
-- ============================================================
INSERT INTO ims_system_configs (config_key, config_value, config_type, description, is_sensitive) VALUES
('order_cancel_threshold', '60', 'number', '订单自主取消时间阈值（分钟）', 0),
('payment_timeout', '15', 'number', '支付超时时间（分钟）', 0),
('service_fee_rate', '0.003', 'number', '服务费费率', 0),
('webhook_retry_times', '3', 'number', 'Webhook最大重试次数', 0),
('webhook_retry_interval', '5', 'number', 'Webhook重试间隔（分钟）', 0),
('wechat_app_id', 'wx1234567890abcdef', 'string', '微信小程序AppID', 1),
('wechat_mch_id', '1234567890', 'string', '微信支付商户号', 1),
('alipay_app_id', '2021001234567890', 'string', '支付宝AppID', 1);

-- ============================================================
-- 16. 登录日志数据
-- ============================================================
INSERT INTO ims_login_logs (user_id, username, status, ip_address, user_agent, device_type, browser, os, location, login_at) VALUES
(1, 'admin', 'success', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0', 'desktop', 'Chrome', 'Windows 10', '广东省深圳市', '2024-12-01 09:00:00'),
(3, 'supplier1', 'success', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0', 'desktop', 'Chrome', 'Windows 10', '广东省深圳市', '2024-12-01 09:30:00'),
(5, 'store1', 'success', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/605.1', 'mobile', 'Safari', 'iOS 17', '广东省深圳市', '2024-12-01 10:00:00'),
(NULL, 'unknown_user', 'failed', '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0', 'desktop', 'Chrome', 'Windows 10', '广东省广州市', '2024-12-01 11:00:00'),
(6, 'store2', 'success', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) Safari/605.1', 'mobile', 'Safari', 'iOS 16', '广东省深圳市', '2024-12-01 14:00:00');

-- ============================================================
-- 17. 操作日志数据
-- ============================================================
INSERT INTO ims_operation_logs (user_id, user_type, user_name, module, action, target_type, target_id, description, ip_address, request_method, created_at) VALUES
(1, 'admin', '系统管理员', 'supplier', 'create', 'supplier', 1, '创建供应商: 鲜果源供应商', '192.168.1.100', 'POST', '2024-12-01 09:10:00'),
(1, 'admin', '系统管理员', 'store', 'create', 'store', 1, '创建门店: 南山旗舰店', '192.168.1.100', 'POST', '2024-12-01 09:15:00'),
(1, 'admin', '系统管理员', 'material', 'create', 'material', 1, '创建物料: 芒果', '192.168.1.100', 'POST', '2024-12-01 09:20:00'),
(3, 'supplier', '鲜果源供应商', 'order', 'confirm', 'order', 1, '确认订单: ORD20241201000001', '192.168.1.101', 'PUT', '2024-12-01 11:00:00'),
(5, 'store', '南山旗舰店', 'order', 'complete', 'order', 1, '完成订单: ORD20241201000001', '192.168.1.102', 'PUT', '2024-12-02 10:30:00');

-- ============================================================
-- 18. 媒体图片数据
-- ============================================================
INSERT INTO ims_media_images (category_id, brand, name, url, thumbnail_url, file_size, width, height, tags, usage_count, uploaded_by) VALUES
(6, '果然美', '芒果主图', 'https://cdn.ims.com/images/mango_main.jpg', 'https://cdn.ims.com/images/mango_main_thumb.jpg', 102400, 800, 800, '["水果","芒果","热带"]', 15, 1),
(6, '马来西亚', '榴莲主图', 'https://cdn.ims.com/images/durian_main.jpg', 'https://cdn.ims.com/images/durian_main_thumb.jpg', 153600, 800, 800, '["水果","榴莲","进口"]', 8, 1),
(7, '红富士', '苹果主图', 'https://cdn.ims.com/images/apple_main.jpg', 'https://cdn.ims.com/images/apple_main_thumb.jpg', 89600, 800, 800, '["水果","苹果","红富士"]', 25, 1),
(8, '本地', '菠菜主图', 'https://cdn.ims.com/images/spinach_main.jpg', 'https://cdn.ims.com/images/spinach_main_thumb.jpg', 76800, 800, 800, '["蔬菜","叶菜","菠菜"]', 12, 1);

-- ============================================================
-- 19. 图片匹配规则数据
-- ============================================================
INSERT INTO ims_image_match_rules (name, rule_type, match_pattern, similarity_threshold, priority, is_active) VALUES
('品牌精确匹配', 'brand', NULL, 1.00, 10, 1),
('SKU编码匹配', 'sku', NULL, 1.00, 20, 1),
('名称相似匹配', 'name', NULL, 0.85, 5, 1),
('关键词匹配', 'keyword', NULL, 0.80, 1, 1);

-- ============================================================
-- 完成
-- ============================================================
SELECT '✅ Mock数据导入完成!' AS message;
SELECT CONCAT('用户数: ', COUNT(*)) AS info FROM ims_users;
SELECT CONCAT('供应商数: ', COUNT(*)) AS info FROM ims_suppliers;
SELECT CONCAT('门店数: ', COUNT(*)) AS info FROM ims_stores;
SELECT CONCAT('物料数: ', COUNT(*)) AS info FROM ims_materials;
SELECT CONCAT('订单数: ', COUNT(*)) AS info FROM ims_orders;
