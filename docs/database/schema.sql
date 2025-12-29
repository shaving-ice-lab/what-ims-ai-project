-- ============================================================
-- IMS (Inventory Management System) 数据库架构
-- 供应链订货系统 - MySQL 8.0
-- 创建时间: 2024
-- ============================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `what-ims-db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `what-ims-db`;

-- ============================================================
-- 1. 用户表 (ims_users)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'sub_admin', 'supplier', 'store') NOT NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(100) NULL,
  avatar VARCHAR(500) NULL,
  last_login_at DATETIME NULL,
  last_login_ip VARCHAR(50) NULL,
  login_fail_count INT DEFAULT 0,
  locked_until DATETIME NULL,
  status TINYINT(1) DEFAULT 1 COMMENT '1: 启用, 0: 禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_username (username),
  UNIQUE INDEX uk_phone (phone),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. 管理员表 (ims_admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_admins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(50) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0 COMMENT '1: 主管理员, 0: 子管理员',
  permissions JSON COMMENT '权限列表',
  created_by BIGINT UNSIGNED NULL,
  remark VARCHAR(200) NULL,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_user_id (user_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES ims_users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES ims_admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. 门店表 (ims_stores)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_stores (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  store_no VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(500) NULL,
  province VARCHAR(50) NULL,
  city VARCHAR(50) NULL,
  district VARCHAR(50) NULL,
  address VARCHAR(200) NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  markup_enabled TINYINT(1) DEFAULT 1,
  wechat_webhook_url VARCHAR(500) NULL,
  webhook_enabled TINYINT(1) DEFAULT 0,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_user_id (user_id),
  UNIQUE INDEX uk_store_no (store_no),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES ims_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. 供应商表 (ims_suppliers)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_suppliers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  supplier_no VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NULL,
  logo VARCHAR(500) NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  delivery_days JSON COMMENT '配送日 [1,2,3,4,5]',
  delivery_mode ENUM('self_delivery', 'express_delivery') DEFAULT 'self_delivery',
  management_mode ENUM('self', 'managed', 'webhook', 'api') DEFAULT 'self',
  has_backend TINYINT(1) DEFAULT 1,
  wechat_webhook_url VARCHAR(500) NULL,
  webhook_enabled TINYINT(1) DEFAULT 0,
  webhook_events JSON COMMENT 'Webhook事件列表',
  webhook_retry_times INT DEFAULT 3,
  webhook_retry_interval INT DEFAULT 60,
  webhook_timeout INT DEFAULT 30,
  api_endpoint VARCHAR(500) NULL,
  api_secret_key VARCHAR(100) NULL,
  markup_enabled TINYINT(1) DEFAULT 1,
  remark TEXT NULL,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_user_id (user_id),
  UNIQUE INDEX uk_supplier_no (supplier_no),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES ims_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. 配送区域表 (ims_delivery_areas)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_delivery_areas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  supplier_id BIGINT UNSIGNED NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NULL COMMENT 'NULL表示整个城市',
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (supplier_id) REFERENCES ims_suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. 分类表 (ims_categories)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(500) NULL,
  sort_order INT DEFAULT 0,
  parent_id BIGINT UNSIGNED NULL,
  level TINYINT DEFAULT 1,
  path VARCHAR(200) NULL COMMENT '路径如: 1/2/3',
  markup_enabled TINYINT(1) DEFAULT 1,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_parent_id (parent_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (parent_id) REFERENCES ims_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. 物料表 (ims_materials)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_no VARCHAR(20) NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  alias VARCHAR(100) NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  keywords VARCHAR(200) NULL,
  sort_order INT DEFAULT 0,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_material_no (material_no),
  INDEX idx_category_id (category_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (category_id) REFERENCES ims_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. 物料SKU表 (ims_material_skus)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_material_skus (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku_no VARCHAR(30) NOT NULL,
  material_id BIGINT UNSIGNED NOT NULL,
  brand VARCHAR(50) NOT NULL,
  spec VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  weight DECIMAL(10, 3) NULL,
  barcode VARCHAR(50) NULL,
  image_url VARCHAR(500) NULL,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_sku_no (sku_no),
  INDEX idx_material_id (material_id),
  INDEX idx_barcode (barcode),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (material_id) REFERENCES ims_materials(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. 供应商物料表 (ims_supplier_materials)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_supplier_materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  supplier_id BIGINT UNSIGNED NOT NULL,
  material_sku_id BIGINT UNSIGNED NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) NULL,
  min_quantity INT DEFAULT 1,
  step_quantity INT DEFAULT 1,
  stock_status ENUM('in_stock', 'out_of_stock') DEFAULT 'in_stock',
  audit_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reject_reason VARCHAR(200) NULL,
  is_recommended TINYINT(1) DEFAULT 0,
  sales_count INT DEFAULT 0,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_material_sku_id (material_sku_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (supplier_id) REFERENCES ims_suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (material_sku_id) REFERENCES ims_material_skus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. 订单表 (ims_orders)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL,
  store_id BIGINT UNSIGNED NOT NULL,
  supplier_id BIGINT UNSIGNED NOT NULL,
  goods_amount DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  supplier_amount DECIMAL(10, 2) NULL,
  markup_total DECIMAL(10, 2) DEFAULT 0,
  item_count INT DEFAULT 0,
  status ENUM('pending_payment', 'pending_confirm', 'confirmed', 'delivering', 'completed', 'cancelled') DEFAULT 'pending_payment',
  payment_status ENUM('unpaid', 'paid', 'refunded', 'partial_refund') DEFAULT 'unpaid',
  payment_method ENUM('wechat', 'alipay') NULL,
  payment_time DATETIME NULL,
  payment_no VARCHAR(50) NULL,
  order_source ENUM('app', 'web', 'h5') DEFAULT 'app',
  delivery_province VARCHAR(50) NULL,
  delivery_city VARCHAR(50) NULL,
  delivery_district VARCHAR(50) NULL,
  delivery_address VARCHAR(200) NULL,
  delivery_contact VARCHAR(50) NULL,
  delivery_phone VARCHAR(20) NULL,
  expected_delivery_date DATE NULL,
  actual_delivery_time DATETIME NULL,
  remark VARCHAR(500) NULL,
  supplier_remark VARCHAR(500) NULL,
  cancel_reason VARCHAR(200) NULL,
  cancelled_by ENUM('store', 'supplier', 'admin', 'system') NULL,
  cancelled_by_id BIGINT UNSIGNED NULL,
  cancelled_at DATETIME NULL,
  restored_at DATETIME NULL,
  confirmed_at DATETIME NULL,
  delivering_at DATETIME NULL,
  completed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_order_no (order_no),
  INDEX idx_store_id (store_id),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (store_id) REFERENCES ims_stores(id) ON DELETE RESTRICT,
  FOREIGN KEY (supplier_id) REFERENCES ims_suppliers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. 订单项表 (ims_order_items)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  material_sku_id BIGINT UNSIGNED NULL,
  material_name VARCHAR(100) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  spec VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  image_url VARCHAR(500) NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  markup_amount DECIMAL(10, 2) DEFAULT 0,
  final_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (order_id) REFERENCES ims_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. 支付记录表 (ims_payment_records)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_payment_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  order_no VARCHAR(30) NOT NULL,
  payment_no VARCHAR(50) NOT NULL,
  payment_method ENUM('wechat', 'alipay') NOT NULL,
  goods_amount DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'success', 'failed', 'refunded', 'partial_refund') DEFAULT 'pending',
  qrcode_url VARCHAR(500) NULL,
  qrcode_expire_time DATETIME NULL,
  trade_no VARCHAR(100) NULL,
  pay_time DATETIME NULL,
  callback_data JSON NULL,
  refund_no VARCHAR(50) NULL,
  refund_amount DECIMAL(10, 2) NULL,
  refund_time DATETIME NULL,
  refund_reason VARCHAR(200) NULL,
  error_msg VARCHAR(500) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_payment_no (payment_no),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_trade_no (trade_no),
  INDEX idx_created_at (created_at),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (order_id) REFERENCES ims_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. 加价规则表 (ims_price_markups)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_price_markups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NULL,
  store_id BIGINT UNSIGNED NULL,
  supplier_id BIGINT UNSIGNED NULL,
  category_id BIGINT UNSIGNED NULL,
  material_id BIGINT UNSIGNED NULL,
  markup_type ENUM('fixed', 'percent') NOT NULL,
  markup_value DECIMAL(10, 4) NOT NULL,
  min_markup DECIMAL(10, 2) NULL,
  max_markup DECIMAL(10, 2) NULL,
  priority INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  start_time DATETIME NULL,
  end_time DATETIME NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_store_id (store_id),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_active_priority (is_active, priority),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (store_id) REFERENCES ims_stores(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES ims_suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES ims_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES ims_materials(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. 订单状态日志表 (ims_order_status_logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_order_status_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(30) NULL,
  to_status VARCHAR(30) NOT NULL,
  operator_type ENUM('store', 'supplier', 'admin', 'system') NULL,
  operator_id BIGINT UNSIGNED NULL,
  remark VARCHAR(200) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (order_id) REFERENCES ims_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. 订单取消申请表 (ims_order_cancel_requests)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_order_cancel_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  store_id BIGINT UNSIGNED NOT NULL,
  reason VARCHAR(500) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_id BIGINT UNSIGNED NULL,
  admin_remark VARCHAR(500) NULL,
  supplier_contacted TINYINT(1) DEFAULT 0,
  supplier_response VARCHAR(500) NULL,
  processed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (order_id) REFERENCES ims_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES ims_stores(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES ims_admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. 登录日志表 (ims_login_logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_login_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  username VARCHAR(50) NOT NULL,
  status ENUM('success', 'failed', 'locked') NOT NULL,
  ip_address VARCHAR(50) NOT NULL,
  user_agent VARCHAR(500) NULL,
  device_type VARCHAR(50) NULL,
  browser VARCHAR(50) NULL,
  os VARCHAR(50) NULL,
  location VARCHAR(100) NULL,
  fail_reason VARCHAR(200) NULL,
  login_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_username (username),
  INDEX idx_login_at (login_at),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES ims_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. 操作日志表 (ims_operation_logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_operation_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  user_type ENUM('admin', 'supplier', 'store') NULL,
  user_name VARCHAR(50) NULL,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NULL,
  target_id BIGINT UNSIGNED NULL,
  description VARCHAR(500) NULL,
  before_data JSON NULL,
  after_data JSON NULL,
  diff_data JSON NULL,
  ip_address VARCHAR(50) NULL,
  user_agent VARCHAR(500) NULL,
  request_url VARCHAR(500) NULL,
  request_method VARCHAR(10) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_user (user_id, user_type),
  INDEX idx_module_action (module, action),
  INDEX idx_target (target_type, target_id),
  INDEX idx_created_at (created_at),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. 系统配置表 (ims_system_configs)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_system_configs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL,
  config_value TEXT NULL,
  config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description VARCHAR(500) NULL,
  is_sensitive TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_config_key (config_key),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. Webhook日志表 (ims_webhook_logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_webhook_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  target_type ENUM('store', 'supplier') NOT NULL,
  target_id BIGINT UNSIGNED NOT NULL,
  event_type ENUM('order.created', 'order.confirmed', 'order.delivering', 'order.completed', 'order.cancelled', 'order.restored') NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  webhook_url VARCHAR(500) NOT NULL,
  request_headers JSON NULL,
  request_body JSON NULL,
  response_code INT NULL,
  response_body TEXT NULL,
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  max_retry_count INT DEFAULT 3,
  next_retry_at DATETIME NULL,
  error_msg VARCHAR(500) NULL,
  duration_ms INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_target (target_type, target_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_next_retry (status, next_retry_at),
  INDEX idx_created_at (created_at),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (order_id) REFERENCES ims_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. 微信绑定表 (ims_wechat_bindings)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_wechat_bindings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) NOT NULL,
  unionid VARCHAR(100) NULL,
  user_id BIGINT UNSIGNED NULL,
  role ENUM('admin', 'sub_admin', 'supplier', 'store') NULL,
  bindable_id BIGINT UNSIGNED NULL,
  bindable_type VARCHAR(20) NULL,
  nickname VARCHAR(100) NULL,
  avatar VARCHAR(500) NULL,
  bind_time DATETIME NULL,
  status TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE INDEX uk_openid (openid),
  INDEX idx_user_id (user_id),
  INDEX idx_bindable (bindable_id, bindable_type),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (user_id) REFERENCES ims_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 21. 媒体图片表 (ims_media_images)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_media_images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  brand VARCHAR(50) NULL,
  name VARCHAR(100) NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  file_size INT NULL,
  width INT NULL,
  height INT NULL,
  tags JSON NULL,
  sku_codes JSON NULL,
  match_keywords VARCHAR(500) NULL,
  usage_count INT DEFAULT 0,
  status TINYINT(1) DEFAULT 1,
  uploaded_by BIGINT UNSIGNED NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_category_brand (category_id, brand),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (category_id) REFERENCES ims_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 22. 图片匹配规则表 (ims_image_match_rules)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_image_match_rules (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NULL,
  rule_type ENUM('name', 'brand', 'sku', 'keyword') NOT NULL,
  match_pattern VARCHAR(200) NULL,
  similarity_threshold DECIMAL(3, 2) DEFAULT 0.80,
  priority INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_active_priority (is_active, priority),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 23. 供应商设置审核表 (ims_supplier_setting_audits)
-- ============================================================
CREATE TABLE IF NOT EXISTS ims_supplier_setting_audits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  supplier_id BIGINT UNSIGNED NOT NULL,
  change_type ENUM('min_order', 'delivery_days', 'delivery_area') NOT NULL,
  old_value JSON NULL,
  new_value JSON NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  submit_time DATETIME NOT NULL,
  audit_time DATETIME NULL,
  auditor_id BIGINT UNSIGNED NULL,
  reject_reason VARCHAR(500) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_status (status),
  INDEX idx_submit_time (submit_time),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (supplier_id) REFERENCES ims_suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (auditor_id) REFERENCES ims_admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
