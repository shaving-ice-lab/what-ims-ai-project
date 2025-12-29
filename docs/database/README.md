# IMS 数据库文件

供应链订货系统 (IMS) 数据库架构和测试数据。

## 文件说明

| 文件 | 描述 |
|------|------|
| `schema.sql` | 数据库表结构定义，包含23个核心表 |
| `mock_data.sql` | 测试/Mock数据，包含各类示例数据 |

## 数据库要求

- **MySQL 8.0+**
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci

## 快速开始

### 1. 创建数据库并导入表结构

```bash
mysql -u root -p < schema.sql
```

### 2. 导入Mock数据（可选，用于开发测试）

```bash
mysql -u root -p `what-ims-db` < mock_data.sql
```

### 3. 一次性执行（推荐）

```bash
mysql -u root -p -e "source schema.sql; source mock_data.sql;"
```

## 表结构概览

### 核心业务表

| 表名 | 描述 |
|------|------|
| `ims_users` | 用户表 - 统一用户认证 |
| `ims_admins` | 管理员表 |
| `ims_stores` | 门店表 |
| `ims_suppliers` | 供应商表 |
| `ims_orders` | 订单表 |
| `ims_order_items` | 订单明细表 |

### 商品相关表

| 表名 | 描述 |
|------|------|
| `ims_categories` | 分类表（支持多级） |
| `ims_materials` | 物料/商品表 |
| `ims_material_skus` | 物料SKU表 |
| `ims_supplier_materials` | 供应商物料关联表 |

### 支付与加价表

| 表名 | 描述 |
|------|------|
| `ims_payment_records` | 支付记录表 |
| `ims_price_markups` | 加价规则表 |

### 配置与日志表

| 表名 | 描述 |
|------|------|
| `ims_system_configs` | 系统配置表 |
| `ims_login_logs` | 登录日志表 |
| `ims_operation_logs` | 操作日志表 |
| `ims_order_status_logs` | 订单状态变更日志 |
| `ims_webhook_logs` | Webhook推送日志 |

### 其他表

| 表名 | 描述 |
|------|------|
| `ims_delivery_areas` | 供应商配送区域 |
| `ims_wechat_bindings` | 微信绑定关系 |
| `ims_media_images` | 媒体图片库 |
| `ims_image_match_rules` | 图片匹配规则 |
| `ims_order_cancel_requests` | 订单取消申请 |
| `ims_supplier_setting_audits` | 供应商设置审核 |

## Mock数据账户

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| `admin` | password123 | 主管理员 | 拥有全部权限 |
| `subadmin1` | password123 | 子管理员 | 部分运营权限 |
| `supplier1` | password123 | 供应商 | 鲜果源供应商 |
| `supplier2` | password123 | 供应商 | 优菜配送 |
| `store1` | password123 | 门店 | 南山旗舰店 |
| `store2` | password123 | 门店 | 福田中心店 |
| `store3` | password123 | 门店 | 天河分店 |

> ⚠️ **注意**: Mock数据中的密码为 `password123` 的 bcrypt 哈希值，仅用于开发测试。

## 数据关系图

```
users (1) ──── (1) admins
      │
      ├─── (1) stores ──── (*) orders
      │                         │
      └─── (1) suppliers ───────┤
                  │             │
                  │      order_items
                  │             │
           supplier_materials ──┘
                  │
           material_skus
                  │
             materials
                  │
            categories
```

## 注意事项

1. **外键约束**: 导入顺序很重要，`schema.sql` 已按正确顺序创建表
2. **软删除**: 所有主表都支持软删除 (`deleted_at` 字段)
3. **时区**: 建议数据库时区设置为 `Asia/Shanghai`
4. **生产环境**: 切勿在生产环境使用 Mock 数据
