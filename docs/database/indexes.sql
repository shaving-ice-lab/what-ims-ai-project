-- ============================================================
-- Performance Indexes for IMS Database
-- Run after initial schema creation
-- ============================================================

-- ============================================================
-- Orders Table Indexes
-- ============================================================
-- Index for store queries (门店订单查询)
ALTER TABLE ims_orders ADD INDEX idx_store_id (store_id);
-- Index for supplier queries (供应商订单查询)
ALTER TABLE ims_orders ADD INDEX idx_supplier_id (supplier_id);
-- Composite index for store-supplier queries
ALTER TABLE ims_orders ADD INDEX idx_store_supplier (store_id, supplier_id);
-- Index for status and date queries (订单状态+时间查询)
ALTER TABLE ims_orders ADD INDEX idx_status_created (status, created_at);
-- Unique index for order number lookup (订单号唯一索引)
ALTER TABLE ims_orders ADD UNIQUE INDEX idx_order_no (order_no);
-- Index for payment status queries (支付状态查询)
ALTER TABLE ims_orders ADD INDEX idx_payment_status (payment_status);
-- Index for recent orders query (最近订单查询)
ALTER TABLE ims_orders ADD INDEX idx_created_at (created_at DESC);
-- Index for expected delivery date queries (预计送达日期)
ALTER TABLE ims_orders ADD INDEX idx_expected_date (expected_date);

-- ============================================================
-- Order Items Table Indexes
-- ============================================================
-- Index for order detail queries (订单明细查询)
ALTER TABLE ims_order_items ADD INDEX idx_order_id (order_id);
-- Composite index for order-material queries
ALTER TABLE ims_order_items ADD INDEX idx_order_material (order_id, material_sku_id);
-- Index for material statistics (物料统计)
ALTER TABLE ims_order_items ADD INDEX idx_material_sku_id (material_sku_id);

-- ============================================================
-- Supplier Materials Table Indexes
-- ============================================================
-- Index for supplier's materials list (供应商物料列表)
ALTER TABLE ims_supplier_materials ADD INDEX idx_supplier_id (supplier_id);
-- Index for material lookup (物料查询)
ALTER TABLE ims_supplier_materials ADD INDEX idx_material_id (material_id);
-- Composite index for supplier-material queries
ALTER TABLE ims_supplier_materials ADD INDEX idx_supplier_material (supplier_id, material_id);
-- Index for supplier's available materials (供应商可用物料)
ALTER TABLE ims_supplier_materials ADD INDEX idx_supplier_status (supplier_id, status);

-- ============================================================
-- Price Markups Table Indexes
-- ============================================================
-- Index for priority-based rule matching (优先级排序规则匹配)
ALTER TABLE ims_price_markups ADD INDEX idx_priority_enabled (priority DESC, is_enabled);
-- Composite index for store-supplier markup queries
ALTER TABLE ims_price_markups ADD INDEX idx_store_supplier (store_id, supplier_id);
-- Index for category-based markups
ALTER TABLE ims_price_markups ADD INDEX idx_category_id (category_id);

-- ============================================================
-- Materials Table Indexes
-- ============================================================
-- Index for category queries (分类物料查询)
ALTER TABLE ims_materials ADD INDEX idx_category_id (category_id);
-- Prefix index for name search (名称搜索)
ALTER TABLE ims_materials ADD INDEX idx_name_search (name(50));
-- Index for status filter (状态筛选)
ALTER TABLE ims_materials ADD INDEX idx_status (status);

-- ============================================================
-- Material SKUs Table Indexes
-- ============================================================
-- Index for material's SKU list (物料SKU列表)
ALTER TABLE ims_material_skus ADD INDEX idx_material_id (material_id);
-- Unique index for SKU code lookup (SKU编码唯一索引)
ALTER TABLE ims_material_skus ADD UNIQUE INDEX idx_sku_code (sku_code);
-- Index for brand search (品牌搜索)
ALTER TABLE ims_material_skus ADD INDEX idx_brand (brand(30));

-- ============================================================
-- Operation Logs Table Indexes
-- ============================================================
-- Composite index for user activity queries (用户操作记录)
ALTER TABLE ims_operation_logs ADD INDEX idx_user_created (user_id, created_at DESC);
-- Composite index for module-action queries (模块操作查询)
ALTER TABLE ims_operation_logs ADD INDEX idx_module_action (module, action);
-- Index for date range queries (日期范围查询)
ALTER TABLE ims_operation_logs ADD INDEX idx_created_at (created_at DESC);

-- ============================================================
-- Payment Records Table Indexes
-- ============================================================
-- Index for order payment lookup (订单支付查询)
ALTER TABLE payment_records ADD INDEX idx_order_id (order_id);
-- Composite index for status and date queries (状态+时间查询)
ALTER TABLE payment_records ADD INDEX idx_status_created (status, created_at);
-- Unique index for payment number (支付流水号唯一索引)
ALTER TABLE payment_records ADD UNIQUE INDEX idx_payment_no (payment_no);
-- Index for third-party trade number (第三方交易号)
ALTER TABLE payment_records ADD INDEX idx_trade_no (trade_no);

-- ============================================================
-- Users Table Indexes
-- ============================================================
-- Unique index for username (用户名唯一索引)
ALTER TABLE ims_users ADD UNIQUE INDEX idx_username (username);
-- Index for phone lookup (手机号查询)
ALTER TABLE ims_users ADD INDEX idx_phone (phone);
-- Index for role-based queries (角色查询)
ALTER TABLE ims_users ADD INDEX idx_role (role);

-- ============================================================
-- Stores Table Indexes
-- ============================================================
-- Index for status filter (状态筛选)
ALTER TABLE ims_stores ADD INDEX idx_status (status);
-- Index for area-based queries (区域查询)
ALTER TABLE ims_stores ADD INDEX idx_area (area(30));

-- ============================================================
-- Suppliers Table Indexes
-- ============================================================
-- Index for status filter (状态筛选)
ALTER TABLE ims_suppliers ADD INDEX idx_status (status);

-- ============================================================
-- Categories Table Indexes
-- ============================================================
-- Index for parent category queries (父分类查询)
ALTER TABLE ims_categories ADD INDEX idx_parent_id (parent_id);
-- Index for sort order (排序)
ALTER TABLE ims_categories ADD INDEX idx_sort_order (sort_order);

-- ============================================================
-- Login Logs Table Indexes
-- ============================================================
-- Composite index for user login history (用户登录历史)
ALTER TABLE ims_login_logs ADD INDEX idx_user_login (user_id, login_time DESC);
-- Index for IP-based queries (IP查询)
ALTER TABLE ims_login_logs ADD INDEX idx_ip (ip);
-- Index for date range queries
ALTER TABLE ims_login_logs ADD INDEX idx_login_time (login_time DESC);

-- ============================================================
-- Delivery Areas Table Indexes
-- ============================================================
-- Index for supplier delivery areas (供应商配送区域)
ALTER TABLE ims_delivery_areas ADD INDEX idx_supplier_id (supplier_id);

-- ============================================================
-- Order Cancel Requests Table Indexes
-- ============================================================
-- Index for order cancel requests (订单取消申请)
ALTER TABLE ims_order_cancel_requests ADD INDEX idx_order_id (order_id);
-- Index for status filter
ALTER TABLE ims_order_cancel_requests ADD INDEX idx_status (status);
