# 供应链订货系统 - 开发文档

> 本文档为项目开发的详细TodoList，涵盖所有功能模块的开发任务

## 文档说明

### 任务优先级标识
- 🔴 **P0 - 核心功能**：系统运行必需，必须首先完成
- 🟠 **P1 - 重要功能**：主要业务流程，第二优先级
- 🟡 **P2 - 标准功能**：完整功能所需，第三优先级
- 🟢 **P3 - 增强功能**：提升体验，可后续迭代

### 任务状态
- [ ] 待开始
- [ ] 已完成
- [~] 进行中

## 目录

1. [项目初始化与基础架构](#1-项目初始化与基础架构)
   - 1.1 [技术选型与环境搭建](#11-技术选型与环境搭建)
   - 1.2 [项目结构初始化](#12-项目结构初始化)
   - 1.3 [共享模块开发](#13-共享模块开发)
   - 1.4 [shadcn/ui 组件库集成](#14-shadcnui-组件库集成)
   - 1.5 [基础组件开发](#15-基础组件开发)
2. [数据库模型](#2-数据库模型)
3. [认证与权限系统](#3-认证与权限系统)
4. [门店端功能](#4-门店端功能)
5. [供应商端功能](#5-供应商端功能)
6. [管理员端功能](#6-管理员端功能)
7. [移动端APP](#7-移动端app)
8. [通知与集成](#8-通知与集成)
9. [支付系统](#9-支付系统)
10. [部署与运维](#10-部署与运维)
11. [测试计划](#11-测试计划)
12. [性能优化](#12-性能优化)
13. [扩展功能](#13-扩展功能)
14. [项目里程碑](#14-项目里程碑)

---

## 1. 项目初始化与基础架构

> **负责人**：技术负责人/架构师

### 1.1 技术选型与环境搭建

- [ ] 🔴 **选择技术栈**
  - [ ] 移动端APP框架选型：uni-app（推荐）/ React Native / Flutter
    - 考量因素：跨平台能力、开发效率、团队技术栈、性能要求
    - **推荐**：uni-app（基于Vue，可同时输出H5/小程序/APP）
  - [ ] Web前端框架选型：Next.js 16 + React + shadcn/ui
    - 考量因素：组件丰富度、文档完整性、社区活跃度、SSR能力
    - **推荐**：Next.js 16 + React + shadcn/ui（现代化组件库，基于TailwindCSS，完整的全栈框架）
  - [ ] 后端框架选型：Node.js (Nest.js) / Java (Spring Boot) / Python (FastAPI)
    - 考量因素：开发效率、运维成本、团队熟悉度、生态系统
    - **推荐**：Nest.js（TypeScript全栈，类型安全）
  - [ ] 数据库选型：MySQL 8.0 / PostgreSQL 15
    - 考量因素：数据一致性、JSON支持、全文搜索能力
    - **推荐**：MySQL 8.0（成熟稳定，运维成本低）
  - [ ] 缓存选型：Redis 7.x
    - 用途：会话管理、接口缓存、限流计数、消息队列
  - [ ] 文件存储选型：阿里云OSS / 腾讯云COS / MinIO（私有化）
    - 考量因素：成本、CDN集成、私有化需求
  - [ ] 编写《技术选型报告》文档

- [ ] 🔴 **开发环境配置**
  - [ ] 配置Node.js 18+ LTS开发环境
  - [ ] 配置pnpm 8.x 包管理工具（monorepo支持更好）
  - [ ] 配置ESLint + Prettier代码规范
    - ESLint规则：@typescript-eslint/recommended
    - Prettier配置：统一缩进、分号、引号规则
  - [ ] 配置Git工作流
    - 分支策略：main/develop/feature/hotfix
    - commit规范：Conventional Commits（feat/fix/docs/style/refactor）
    - 配置husky + lint-staged 提交前检查
    - 配置commitlint 提交信息校验
  - [ ] 配置TypeScript 5.x 严格模式
  - [ ] 配置VSCode推荐插件列表（.vscode/extensions.json）
  - [ ] 配置EditorConfig统一编辑器设置
  - [ ] 编写《开发环境搭建指南》文档

### 1.2 项目结构初始化

- [ ] 🔴 **Monorepo结构搭建**
  - [ ] 初始化pnpm-workspace.yaml

  ```yaml
    packages:
      - 'apps/*'
      - 'packages/*'
  ```
  - [ ] 配置turbo.json构建配置
    - 定义build/dev/lint/test管道
    - 配置缓存策略
    - 配置依赖关系
  - [ ] 创建apps目录结构
    ```
    apps/
    ├── admin-web/      # 管理员后台
    ├── supplier-web/   # 供应商后台
    ├── store-web/      # 门店后台
    ├── api-server/     # 后端API服务
    └── mobile-app/     # 移动端APP
    ```
  - [ ] 创建packages目录结构
    ```
    packages/
    ├── types/          # 共享类型定义
    ├── utils/          # 共享工具函数
    ├── constants/      # 共享常量
    ├── ui/             # 共享UI组件
    └── api-client/     # API客户端封装
    ```
  - [ ] 配置根目录package.json scripts
  - [ ] 配置.npmrc（registry、hoist设置）

- [ ] 🔴 **Web前端项目初始化**
  - [ ] 创建管理员后台项目（admin-web）
    - 使用Next.js 16 + React + TypeScript模板
    - 集成shadcn/ui组件库（所有UI组件必须使用shadcn/ui实现）
  - [ ] 创建供应商后台项目（supplier-web）
    - 使用Next.js 16 + React + TypeScript模板
    - 集成shadcn/ui组件库（所有UI组件必须使用shadcn/ui实现）
  - [ ] 创建门店后台项目（store-web）
    - 使用Next.js 16 + React + TypeScript模板
    - 集成shadcn/ui组件库（所有UI组件必须使用shadcn/ui实现）
  - [ ] 配置Vue Router路由系统
    - 路由懒加载配置
    - 路由守卫配置
    - 路由元信息定义（权限、标题）
  - [ ] 配置Pinia状态管理
    - 用户状态模块
    - 购物车状态模块
    - 系统配置状态模块
    - 持久化插件配置（pinia-plugin-persistedstate）
  - [ ] 配置axios HTTP请求封装
    - 请求/响应拦截器
    - 统一错误处理
    - Token自动刷新
    - 请求重试机制
    - 接口loading状态管理
  - [ ] 配置shadcn/ui组件库
    - **重要**：所有Web前端项目必须统一使用shadcn/ui组件库实现UI界面
    - 禁止混用其他UI框架（如Element Plus、Ant Design等）
    - 所有自定义组件必须基于shadcn/ui进行封装扩展
  - [ ] 配置环境变量（.env.development/.env.production）
  - [ ] 配置代理解决开发环境跨域

- [ ] 🔴 **后端项目初始化**

  - [ ] 创建Nest.js项目（api-server）

  ```bash
  nest new api-server --strict
  ```
  - [ ] 配置TypeORM数据库连接
    - 数据源配置
    - 实体自动加载
    - 迁移文件管理
    - 连接池配置（min: 5, max: 20）
  - [ ] 配置Redis连接（ioredis）
    - 连接池配置
    - 集群模式支持（可选）
    - 缓存模块封装
  - [ ] 配置Winston日志系统（待完善）
    - 日志级别配置
    - 日志格式化
    - 日志文件轮转
    - 请求日志中间件
  - [ ] 配置@nestjs/config环境变量管理
    - 配置校验（Joi Schema）
    - 多环境配置
  - [ ] 配置Swagger API文档
    - API分组（按模块）
    - 请求/响应示例
    - 认证配置
  - [ ] 配置全局异常过滤器
  - [ ] 配置请求验证管道（class-validator）
  - [ ] 配置响应转换拦截器
  - [ ] 配置跨域（CORS）
  - [ ] 配置Helmet安全头
  - [ ] 配置速率限制（@nestjs/throttler）

- [ ] 🔴 **移动端项目初始化**
  - [ ] 创建uni-app项目（Vue3 + TypeScript）
    ```bash
    npx degit dcloudio/uni-preset-vue#vite-ts mobile-app
    ```
  - [ ] 配置多端编译
    - H5端配置
    - Android端配置
    - 微信小程序配置（可选）
  - [ ] 配置页面路由（pages.json）
    - TabBar配置
    - 页面路径配置
    - 页面样式配置
  - [ ] 配置Pinia全局状态管理
  - [ ] 配置uni.request请求封装
    - 统一请求头
    - Token管理
    - 错误处理
    - loading状态
  - [ ] 配置uni-ui组件库
  - [ ] 配置自定义导航栏组件
  - [ ] 配置应用图标和启动图
  - [ ] 配置manifest.json应用配置

### 1.3 共享模块开发

- [ ] 🔴 **共享类型定义包（@project/types）**
  - [ ] 定义基础类型
    ```typescript
    // 分页请求/响应
    interface PaginationQuery { page: number; pageSize: number; }
    interface PaginatedResponse<T> { items: T[]; total: number; page: number; pageSize: number; }
    // API响应包装
    interface ApiResponse<T> { code: number; message: string; data: T; timestamp: number; }
    ```
  - [ ] 定义用户相关类型
    - User（基础用户信息）
    - Admin（管理员，含权限列表）
    - Store（门店，含地址信息）
    - Supplier（供应商，含配送设置）
    - UserRole枚举（admin/sub_admin/supplier/store）
    - LoginRequest/LoginResponse
    - TokenPayload（JWT载荷）
  - [ ] 定义订单相关类型
    - Order（订单主表）
    - OrderItem（订单明细）
    - OrderStatus枚举（pending_payment/pending_confirm/confirmed/delivering/completed/cancelled）
    - PaymentStatus枚举（unpaid/paid/refunded）
    - OrderCancelRequest（取消申请）
    - CreateOrderRequest/UpdateOrderRequest
  - [ ] 定义物料相关类型
    - Category（分类，支持树形结构）
    - Material（物料基础信息）
    - MaterialSku（物料SKU）
    - SupplierMaterial（供应商物料报价）
    - StockStatus枚举（in_stock/out_of_stock）
  - [ ] 定义配置相关类型
    - SystemConfig（系统配置）
    - PriceMarkup（加价规则）
    - MarkupType枚举（fixed/percent）
    - DeliveryArea（配送区域）
    - DeliveryMode枚举（self_delivery/express_delivery）
  - [ ] 定义Webhook相关类型
    - WebhookEvent枚举
    - WebhookPayload
    - WebhookLog
  - [ ] 编写类型单元测试

- [ ] 🔴 **共享工具包（@project/utils）**
  - [ ] 日期处理工具函数（基于dayjs）
    - formatDate(date, format) - 格式化日期
    - parseDate(dateStr) - 解析日期字符串
    - getDateRange(type: 'today'|'week'|'month') - 获取日期范围
    - isDeliveryDay(date, deliveryDays[]) - 判断是否配送日
    - getNextDeliveryDate(deliveryDays[]) - 获取下一个配送日
  - [ ] 金额计算工具函数（基于decimal.js，避免浮点精度问题）
    - add(a, b) - 精确加法
    - subtract(a, b) - 精确减法
    - multiply(a, b) - 精确乘法
    - divide(a, b) - 精确除法
    - formatMoney(amount, options) - 金额格式化（¥1,234.56）
    - calculateMarkup(price, rule) - 计算加价
    - calculateServiceFee(amount, rate) - 计算服务费
  - [ ] 字符串处理工具函数
    - maskPhone(phone) - 手机号脱敏（138****8888）
    - maskIdCard(idCard) - 身份证脱敏
    - truncate(str, length) - 字符串截断
    - generateOrderNo() - 生成订单编号（时间戳+随机数）
    - generateRandomCode(length) - 生成随机码
  - [ ] 验证工具函数
    - isValidPhone(phone) - 手机号验证
    - isValidEmail(email) - 邮箱验证
    - isValidPassword(password) - 密码强度验证
    - isValidIdCard(idCard) - 身份证验证
  - [ ] 加密工具函数
    - hashPassword(password) - 密码哈希（PBKDF2）
    - verifyPassword(password, hash) - 密码验证
    - generateHmacSignature(payload, secret) - HMAC签名
    - encrypt/decrypt(data, key) - AES-256-GCM加解密
  - [ ] 其他工具函数
    - sleep(ms) - 延时函数
    - retry(fn, times, delay) - 重试函数
    - debounce/throttle - 防抖/节流
    - deepClone(obj) - 深拷贝
    - omit/pick(obj, keys) - 对象属性操作
  - [ ] 编写工具函数单元测试（覆盖率>90%）

- [ ] 🔴 **共享常量包（@project/constants）**
  - [ ] 订单状态常量
    ```typescript
    export const ORDER_STATUS = {
      PENDING_PAYMENT: 'pending_payment',
      PENDING_CONFIRM: 'pending_confirm',
      CONFIRMED: 'confirmed',
      DELIVERING: 'delivering',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    } as const;
    export const ORDER_STATUS_TEXT = {
      [ORDER_STATUS.PENDING_PAYMENT]: '待付款',
      // ...
    };
    ```
  - [ ] 用户角色常量
  - [ ] 权限模块常量（含权限码和描述）
  - [ ] 配送模式常量
  - [ ] 支付方式常量
  - [ ] 审核状态常量
  - [ ] 错误码常量（统一错误码定义）
  - [ ] 正则表达式常量（手机、邮箱等）
  - [ ] 系统配置键常量

### 1.4 shadcn/ui 组件库集成

> **重要说明**：所有Web前端开发必须使用shadcn/ui组件库实现UI界面

- [ ] 🔴 **shadcn/ui 环境配置**
  - [ ] 安装shadcn/ui核心依赖
    ```bash
    # 安装TailwindCSS（shadcn/ui依赖）
    pnpm add -D tailwindcss postcss autoprefixer
    # 安装shadcn/ui
    pnpm add shadcn-ui-vue
    # 安装必需的依赖
    pnpm add @radix-ui/vue-icons lucide-vue-next class-variance-authority clsx tailwind-merge
    ```
  - [ ] 配置tailwind.config.js
    - 添加shadcn/ui的content路径
    - 配置主题色彩和CSS变量
  - [ ] 配置components.json
    - 设置组件路径和样式配置
    - 配置TypeScript路径别名
  - [ ] 创建全局CSS变量文件（assets/css/variables.css）
  - [ ] 配置shadcn/ui的Vue插件

- [ ] 🔴 **shadcn/ui 组件使用规范**
  - [ ] 所有UI组件必须优先使用shadcn/ui提供的组件
    - Button替代el-button
    - Input替代el-input
    - Select替代el-select
    - Table替代el-table
    - Dialog替代el-dialog
    - Form替代el-form
  - [ ] 组件样式定制通过CSS变量和TailwindCSS类实现
  - [ ] 禁止使用其他UI框架的组件，避免样式冲突
  - [ ] 特殊业务组件基于shadcn/ui组件进行封装扩展

- [ ] 🟠 **shadcn/ui 常用组件集成**
  - [ ] 集成基础组件
    - Button（按钮）
    - Input（输入框）
    - Label（标签）
    - Select（选择器）
    - Checkbox（复选框）
    - Radio（单选框）
    - Switch（开关）
    - Textarea（文本域）
  - [ ] 集成导航组件
    - Navigation Menu（导航菜单）
    - Breadcrumb（面包屑）
    - Tabs（标签页）
    - Pagination（分页）
  - [ ] 集成反馈组件
    - Alert（提示框）
    - Dialog（对话框）
    - Toast（消息提示）
    - Sheet（侧边栏）
    - Popover（弹出框）
  - [ ] 集成数据展示组件
    - Table（表格）
    - Card（卡片）
    - Badge（徽章）
    - Avatar（头像）
    - Progress（进度条）
  - [ ] 集成表单组件
    - Form（表单）
    - FormItem（表单项）
    - FormLabel（表单标签）
    - FormControl（表单控件）
    - FormMessage（表单消息）

- [ ] 🟡 **shadcn/ui 主题定制**
  - [ ] 配置亮色/暗色主题切换
  - [ ] 自定义品牌色彩变量
  - [ ] 配置组件默认样式
  - [ ] 创建主题切换组件

### 1.5 基础组件开发

- [ ] 🟠 **共享UI组件库（@project/ui）**
  > **注意**：所有共享组件必须基于shadcn/ui进行封装扩展
  - [ ] 统一按钮组件（SButton）
    - 基于shadcn/ui的Button组件封装
    - Props：type/size/loading/disabled/icon
    - 支持主题色配置
    - 防重复点击（内置debounce）
  - [ ] 表单组件增强
    - SInput（基于shadcn/ui Input，支持前后缀、清空、字数统计）
    - SSelect（基于shadcn/ui Select，支持远程搜索、多选、分组）
    - SDatePicker（基于shadcn/ui DatePicker，支持范围选择、快捷选项）
    - SNumberInput（基于shadcn/ui NumberInput，支持步进、千分位显示）
    - SForm（基于shadcn/ui Form，统一表单校验、提交状态管理）
  - [ ] 表格组件（STable）
    - 基于shadcn/ui Table组件封装
    - 列配置化
    - 内置分页
    - 排序支持
    - 行选择
    - 自定义单元格渲染
    - 表头固定
    - 列宽调整
    - 数据导出
  - [ ] 弹窗组件
    - SModal（基于shadcn/ui Dialog，支持拖拽、全屏）
    - SDrawer（基于shadcn/ui Sheet，支持多层级）
    - SConfirm（基于shadcn/ui AlertDialog，确认对话框）
  - [ ] 消息提示组件
    - SToast（基于shadcn/ui Toast，轻提示）
    - SNotification（基于shadcn/ui Notification，通知）
    - SMessage（基于shadcn/ui Alert，全局消息）
  - [ ] 加载状态组件
    - SLoading（基于shadcn/ui Loading，全局/局部loading）
    - SSkeleton（基于shadcn/ui Skeleton，骨架屏）
    - SSpinner（基于shadcn/ui Spinner，加载动画）
  - [ ] 空状态组件（SEmpty）
    - 基于shadcn/ui Empty组件
    - 支持自定义图标和文案
    - 内置常见空状态（无数据、无搜索结果、网络错误）
  - [ ] 图片上传组件（SImageUpload）
    - 基于shadcn/ui Upload组件
    - 支持裁剪
    - 支持压缩
    - 支持多图上传
    - 图片预览
    - 上传进度显示
    - 格式/大小限制
  - [ ] 文件上传组件（SFileUpload）
    - 基于shadcn/ui Upload组件
    - 支持拖拽上传
    - 文件类型限制
    - 文件大小限制
    - 上传进度显示
  - [ ] 编写组件文档（Storybook）
  - [ ] 编写组件单元测试

- [ ] 🟠 **业务组件**
  - [ ] 订单状态标签组件（OrderStatusTag）
    - 不同状态不同颜色
    - 支持显示状态图标
    - 支持点击查看状态流转
  - [ ] 价格显示组件（PriceDisplay）
    - 显示原价/现价
    - 加价金额高亮显示
    - 加价标识（如🔺）
    - 支持划线价
  - [ ] 供应商选择组件（SupplierSelect）
    - 下拉选择
    - 支持搜索
    - 显示供应商状态
    - 支持多选
  - [ ] 门店选择组件（StoreSelect）
    - 下拉选择
    - 支持按区域筛选
    - 支持搜索
  - [ ] 物料选择组件（MaterialSelect）
    - 弹窗选择器
    - 分类树筛选
    - 物料搜索
    - 已选物料列表
    - 支持多选
  - [ ] 配送区域选择组件（AreaSelect）
    - 省市区三级联动
    - 支持多选
    - 数据懒加载
    - 已选区域列表展示
  - [ ] 数据统计卡片组件（StatCard）
    - 数值动画效果
    - 趋势指示（上升/下降）
    - 图标支持
    - 点击跳转
  - [ ] 图表组件封装
    - 基于ECharts 5.x
    - LineChart（折线图）
    - BarChart（柱状图）
    - PieChart（饼图）
    - 响应式适配
    - 主题配置
    - 数据为空占位
  - [ ] 搜索筛选栏组件（SearchBar）
    - 动态表单项配置
    - 展开/收起
    - 重置功能
    - 搜索防抖
  - [ ] 订单卡片组件（OrderCard）
    - 统一订单展示样式
    - 操作按钮插槽
  - [ ] 物料卡片组件（MaterialCard）
    - 图片展示
    - 名称/规格/价格
    - 加入购物车交互

---

## 2. 数据库模型

> **负责人**：后端开发  
> **数据库**：MySQL 8.0  
> **ORM**：TypeORM  
> **验收标准**：所有表结构创建完成，迁移文件可正常执行，索引优化到位

### 2.1 用户与认证模块

- [ ] 🔴 **用户表（User）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] username - VARCHAR(50), 用户名, UNIQUE, NOT NULL
  - [ ] password_hash - VARCHAR(255), 密码哈希(bcrypt), NOT NULL
  - [ ] role - ENUM('admin','sub_admin','supplier','store'), 角色类型, NOT NULL
  - [ ] phone - VARCHAR(20), 手机号, UNIQUE
  - [ ] email - VARCHAR(100), 邮箱（可选）
  - [ ] avatar - VARCHAR(500), 头像URL
  - [ ] last_login_at - DATETIME, 最后登录时间
  - [ ] last_login_ip - VARCHAR(50), 最后登录IP
  - [ ] login_fail_count - INT, 登录失败次数, DEFAULT 0
  - [ ] locked_until - DATETIME, 锁定截止时间
  - [ ] status - TINYINT(1), 状态(1启用/0禁用), DEFAULT 1
  - [ ] created_at - DATETIME, 创建时间, DEFAULT CURRENT_TIMESTAMP
  - [ ] updated_at - DATETIME, 更新时间, ON UPDATE CURRENT_TIMESTAMP
  - [ ] **索引设计**
    - idx_username (username) - 登录查询
    - idx_phone (phone) - 手机号登录
    - idx_role_status (role, status) - 按角色查询启用用户
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件
  - [ ] 编写Seed数据（默认管理员）

- [ ] 🔴 **管理员表（Admin）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] user_id - BIGINT, 关联用户ID, UNIQUE, FK(User.id)
  - [ ] name - VARCHAR(50), 管理员姓名, NOT NULL
  - [ ] is_primary - TINYINT(1), 是否主管理员, DEFAULT 0
  - [ ] permissions - JSON, 权限数组, 如["order","report","supplier"]
  - [ ] created_by - BIGINT, 创建人ID, FK(Admin.id)
  - [ ] remark - VARCHAR(200), 备注
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_user_id (user_id) - 用户关联查询
    - idx_is_primary (is_primary) - 主管理员查询
  - [ ] 编写TypeORM Entity（含User关联）
  - [ ] 编写迁移文件

- [ ] 🟡 **微信绑定表（WechatBinding）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] openid - VARCHAR(100), 微信OpenID, NOT NULL
  - [ ] unionid - VARCHAR(100), 微信UnionID
  - [ ] user_id - BIGINT, 关联用户ID, FK(User.id)
  - [ ] role - ENUM, 绑定角色
  - [ ] bindable_id - BIGINT, 关联业务ID（门店/供应商ID）
  - [ ] bindable_type - VARCHAR(20), 关联类型（store/supplier）
  - [ ] nickname - VARCHAR(100), 微信昵称
  - [ ] avatar - VARCHAR(500), 微信头像
  - [ ] bindtime - DATETIME, 绑定时间
  - [ ] status - TINYINT(1), 状态
  - [ ] **索引设计**
    - uk_openid (openid) - 唯一索引
    - idx_user_id (user_id)
    - idx_bindable (bindable_type, bindable_id)
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.2 门店模块

- [ ] 🔴 **门店表（Store）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] user_id - BIGINT, 关联用户ID, UNIQUE, FK(User.id)
  - [ ] store_no - VARCHAR(20), 门店编号, UNIQUE
  - [ ] name - VARCHAR(100), 门店名称, NOT NULL
  - [ ] logo - VARCHAR(500), 门店Logo
  - [ ] province - VARCHAR(50), 省
  - [ ] city - VARCHAR(50), 市
  - [ ] district - VARCHAR(50), 区/县
  - [ ] address - VARCHAR(200), 详细地址
  - [ ] latitude - DECIMAL(10,7), 纬度（可选，用于距离计算）
  - [ ] longitude - DECIMAL(10,7), 经度
  - [ ] contact_name - VARCHAR(50), 联系人姓名, NOT NULL
  - [ ] contact_phone - VARCHAR(20), 联系电话, NOT NULL
  - [ ] markup_enabled - TINYINT(1), 加价开关, DEFAULT 1
  - [ ] wechat_webhook_url - VARCHAR(500), 企业微信群Webhook地址
  - [ ] webhook_enabled - TINYINT(1), Webhook开关, DEFAULT 0
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_user_id (user_id)
    - idx_area (province, city, district) - 区域查询
    - idx_status (status)
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.3 供应商模块

- [ ] 🔴 **供应商表（Supplier）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] user_id - BIGINT, 关联用户ID, FK(User.id)
  - [ ] supplier_no - VARCHAR(20), 供应商编号, UNIQUE
  - [ ] name - VARCHAR(100), 供应商真实名称, NOT NULL
  - [ ] display_name - VARCHAR(100), 门店端显示名称
  - [ ] logo - VARCHAR(500), 供应商Logo
  - [ ] contact_name - VARCHAR(50), 联系人姓名, NOT NULL
  - [ ] contact_phone - VARCHAR(20), 联系电话, NOT NULL
  - [ ] min_order_amount - DECIMAL(10,2), 起送价, DEFAULT 0
  - [ ] delivery_days - JSON, 配送日数组, 如[1,3,5]代表周一三五
  - [ ] delivery_mode - ENUM('self_delivery','express_delivery'), 配送模式
  - [ ] management_mode - ENUM('self','managed','webhook','api'), 管理模式
  - [ ] has_backend - TINYINT(1), 是否有后台, DEFAULT 1
  - [ ] wechat_webhook_url - VARCHAR(500), 企业微信群Webhook地址
  - [ ] webhook_enabled - TINYINT(1), Webhook开关, DEFAULT 0
  - [ ] webhook_events - JSON, 推送事件配置, 如["new_order","cancelled"]
  - [ ] api_endpoint - VARCHAR(500), API对接地址
  - [ ] api_secret_key - VARCHAR(100), API密钥（加密存储）
  - [ ] markup_enabled - TINYINT(1), 加价开关, DEFAULT 1
  - [ ] remark - TEXT, 备注
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_user_id (user_id)
    - idx_management_mode (management_mode)
    - idx_status (status)
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🔴 **配送区域表（DeliveryArea）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] supplier_id - BIGINT, 供应商ID, FK(Supplier.id), NOT NULL
  - [ ] province - VARCHAR(50), 省, NOT NULL
  - [ ] city - VARCHAR(50), 市, NOT NULL
  - [ ] district - VARCHAR(50), 区/县（可为空表示全市配送）
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_supplier_id (supplier_id)
    - idx_area (province, city, district) - 区域匹配查询
    - uk_supplier_area (supplier_id, province, city, district) - 防重复
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🟠 **供应商配送设置审核表（SupplierSettingAudit）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] supplier_id - BIGINT, 供应商ID, FK(Supplier.id), NOT NULL
  - [ ] change_type - ENUM('min_order','delivery_days','delivery_area'), 变更类型
  - [ ] old_value - JSON, 原值
  - [ ] new_value - JSON, 新值
  - [ ] status - ENUM('pending','approved','rejected'), 审核状态, DEFAULT 'pending'
  - [ ] submit_time - DATETIME, 提交时间
  - [ ] audit_time - DATETIME, 审核时间
  - [ ] auditor_id - BIGINT, 审核人ID, FK(Admin.id)
  - [ ] reject_reason - VARCHAR(500), 驳回原因
  - [ ] **索引设计**
    - idx_supplier_id (supplier_id)
    - idx_status (status) - 待审核列表
    - idx_submit_time (submit_time)
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.4 物料模块

- [ ] 🔴 **物料分类表（Category）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] name - VARCHAR(50), 分类名称, NOT NULL
  - [ ] icon - VARCHAR(500), 分类图标URL
  - [ ] sort_order - INT, 排序值, DEFAULT 0
  - [ ] parent_id - BIGINT, 父分类ID, FK(Category.id), NULL表示顶级分类
  - [ ] level - TINYINT, 层级(1/2/3), 便于查询
  - [ ] path - VARCHAR(200), 路径(如1/2/3), 便于查询所有子分类
  - [ ] markup_enabled - TINYINT(1), 加价开关, DEFAULT 1
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_parent_id (parent_id)
    - idx_sort (sort_order)
    - idx_path (path) - 子分类查询
  - [ ] 编写TypeORM Entity（自关联）
  - [ ] 编写迁移文件
  - [ ] 编写Seed数据（默认分类）

- [ ] 🔴 **物料表（Material）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] material_no - VARCHAR(20), 物料编号, UNIQUE
  - [ ] category_id - BIGINT, 分类ID, FK(Category.id), NOT NULL
  - [ ] name - VARCHAR(100), 物料通用名称, NOT NULL
  - [ ] alias - VARCHAR(100), 物料别名（用于搜索）
  - [ ] description - TEXT, 物料描述
  - [ ] image_url - VARCHAR(500), 默认图片
  - [ ] keywords - VARCHAR(200), 搜索关键词
  - [ ] sort_order - INT, 排序值, DEFAULT 0
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_category_id (category_id)
    - idx_name (name) - 名称搜索
    - FULLTEXT idx_search (name, alias, keywords) - 全文搜索
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🔴 **物料SKU表（MaterialSku）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] sku_no - VARCHAR(30), SKU编号, UNIQUE
  - [ ] material_id - BIGINT, 物料ID, FK(Material.id), NOT NULL
  - [ ] brand - VARCHAR(50), 品牌, NOT NULL
  - [ ] spec - VARCHAR(100), 规格, NOT NULL
  - [ ] unit - VARCHAR(20), 销售单位, NOT NULL
  - [ ] weight - DECIMAL(10,3), 重量(kg)
  - [ ] barcode - VARCHAR(50), 条形码
  - [ ] image_url - VARCHAR(500), SKU专属图片
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_material_id (material_id)
    - idx_brand (brand) - 品牌筛选
    - idx_barcode (barcode) - 条码查询
    - uk_material_brand_spec (material_id, brand, spec) - 防重复SKU
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🔴 **供应商物料表（SupplierMaterial）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] supplier_id - BIGINT, 供应商ID, FK(Supplier.id), NOT NULL
  - [ ] material_sku_id - BIGINT, 关联SKU ID, FK(MaterialSku.id), NOT NULL
  - [ ] price - DECIMAL(10,2), 供应商报价, NOT NULL
  - [ ] original_price - DECIMAL(10,2), 原价（用于显示划线价）
  - [ ] min_quantity - INT, 最小起订量, DEFAULT 1
  - [ ] step_quantity - INT, 步进数量, DEFAULT 1
  - [ ] stock_status - ENUM('in_stock','out_of_stock'), 库存状态, DEFAULT 'in_stock'
  - [ ] audit_status - ENUM('pending','approved','rejected'), 审核状态
  - [ ] reject_reason - VARCHAR(200), 审核驳回原因
  - [ ] is_recommended - TINYINT(1), 是否推荐, DEFAULT 0
  - [ ] sales_count - INT, 销量统计, DEFAULT 0
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - uk_supplier_sku (supplier_id, material_sku_id) - 唯一约束
    - idx_material_sku_id (material_sku_id) - 物料查供应商
    - idx_price (price) - 价格排序
    - idx_stock_status (stock_status)
    - idx_audit_status (audit_status) - 待审核列表
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.5 订单模块

- [ ] 🔴 **订单表（Order）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] order_no - VARCHAR(30), 订单编号, UNIQUE, NOT NULL, 格式:yyyyMMddHHmmss+6位随机
  - [ ] store_id - BIGINT, 门店ID, FK(Store.id), NOT NULL
  - [ ] supplier_id - BIGINT, 供应商ID, FK(Supplier.id), NOT NULL
  - [ ] goods_amount - DECIMAL(10,2), 商品金额（含加价）, NOT NULL
  - [ ] service_fee - DECIMAL(10,2), 支付手续费(3‰), DEFAULT 0
  - [ ] total_amount - DECIMAL(10,2), 门店实付总额, NOT NULL
  - [ ] supplier_amount - DECIMAL(10,2), 供应商结算金额（原价总额）
  - [ ] markup_total - DECIMAL(10,2), 加价总额, DEFAULT 0
  - [ ] item_count - INT, 商品种类数
  - [ ] status - ENUM('pending_payment','pending_confirm','confirmed','delivering','completed','cancelled'), 订单状态
  - [ ] payment_status - ENUM('unpaid','paid','refunded'), 支付状态, DEFAULT 'unpaid'
  - [ ] payment_method - ENUM('wechat','alipay'), 支付方式
  - [ ] payment_time - DATETIME, 实际支付时间
  - [ ] payment_no - VARCHAR(50), 支付流水号
  - [ ] order_source - ENUM('app','web','h5'), 订单来源
  - [ ] delivery_province - VARCHAR(50), 配送省
  - [ ] delivery_city - VARCHAR(50), 配送市
  - [ ] delivery_district - VARCHAR(50), 配送区
  - [ ] delivery_address - VARCHAR(200), 配送详细地址
  - [ ] delivery_contact - VARCHAR(50), 配送联系人
  - [ ] delivery_phone - VARCHAR(20), 配送电话
  - [ ] expected_delivery_date - DATE, 期望配送日期
  - [ ] actual_delivery_time - DATETIME, 实际送达时间
  - [ ] remark - VARCHAR(500), 门店备注
  - [ ] supplier_remark - VARCHAR(500), 供应商备注
  - [ ] cancel_reason - VARCHAR(200), 取消原因
  - [ ] cancelled_by - ENUM('store','supplier','admin','system'), 取消人类型
  - [ ] cancelled_by_id - BIGINT, 取消人ID
  - [ ] cancelled_at - DATETIME, 取消时间
  - [ ] restored_at - DATETIME, 恢复时间
  - [ ] confirmed_at - DATETIME, 确认时间
  - [ ] delivering_at - DATETIME, 开始配送时间
  - [ ] completed_at - DATETIME, 完成时间
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - uk_order_no (order_no) - 订单号查询
    - idx_store_id (store_id) - 门店订单列表
    - idx_supplier_id (supplier_id) - 供应商订单列表
    - idx_status (status) - 状态筛选
    - idx_payment_status (payment_status) - 支付状态
    - idx_created_at (created_at) - 时间排序
    - idx_store_status_created (store_id, status, created_at) - 门店订单复合查询
    - idx_supplier_status_created (supplier_id, status, created_at) - 供应商订单复合查询
  - [ ] 编写TypeORM Entity（含关联）
  - [ ] 编写迁移文件

- [ ] 🔴 **订单明细表（OrderItem）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] order_id - BIGINT, 订单ID, FK(Order.id), NOT NULL
  - [ ] material_sku_id - BIGINT, 物料SKU ID, FK(MaterialSku.id)
  - [ ] material_name - VARCHAR(100), 物料名称（冗余，防止物料名称变更）
  - [ ] brand - VARCHAR(50), 品牌（冗余）
  - [ ] spec - VARCHAR(100), 规格（冗余）
  - [ ] unit - VARCHAR(20), 单位（冗余）
  - [ ] image_url - VARCHAR(500), 商品图片（冗余）
  - [ ] quantity - INT, 数量, NOT NULL
  - [ ] unit_price - DECIMAL(10,2), 供应商原价, NOT NULL
  - [ ] markup_amount - DECIMAL(10,2), 单品加价金额, DEFAULT 0
  - [ ] final_price - DECIMAL(10,2), 门店支付单价, NOT NULL
  - [ ] subtotal - DECIMAL(10,2), 小计（final_price * quantity）, NOT NULL
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_order_id (order_id) - 订单明细查询
    - idx_material_sku_id (material_sku_id) - 物料销售统计
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🟠 **订单取消申请表（OrderCancelRequest）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] order_id - BIGINT, 订单ID, FK(Order.id), NOT NULL
  - [ ] store_id - BIGINT, 门店ID, FK(Store.id), NOT NULL
  - [ ] reason - VARCHAR(500), 取消原因, NOT NULL
  - [ ] status - ENUM('pending','approved','rejected'), 申请状态, DEFAULT 'pending'
  - [ ] admin_id - BIGINT, 处理管理员ID, FK(Admin.id)
  - [ ] admin_remark - VARCHAR(500), 管理员处理备注
  - [ ] supplier_contacted - TINYINT(1), 是否已联系供应商, DEFAULT 0
  - [ ] supplier_response - VARCHAR(500), 供应商反馈
  - [ ] created_at - DATETIME, 申请时间
  - [ ] processed_at - DATETIME, 处理时间
  - [ ] **索引设计**
    - idx_order_id (order_id)
    - idx_status (status) - 待处理列表
    - idx_created_at (created_at)
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🟡 **订单状态变更日志表（OrderStatusLog）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] order_id - BIGINT, 订单ID, FK(Order.id), NOT NULL
  - [ ] from_status - VARCHAR(30), 原状态
  - [ ] to_status - VARCHAR(30), 新状态, NOT NULL
  - [ ] operator_type - ENUM('store','supplier','admin','system'), 操作人类型
  - [ ] operator_id - BIGINT, 操作人ID
  - [ ] remark - VARCHAR(200), 备注
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_order_id (order_id) - 订单状态历史查询
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.6 支付模块

- [ ] 🔴 **支付记录表（PaymentRecord）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] order_id - BIGINT, 订单ID, FK(Order.id), NOT NULL
  - [ ] order_no - VARCHAR(30), 订单编号, NOT NULL
  - [ ] payment_no - VARCHAR(50), 支付流水号, UNIQUE, NOT NULL
  - [ ] payment_method - ENUM('wechat','alipay'), 支付方式, NOT NULL
  - [ ] goods_amount - DECIMAL(10,2), 商品金额, NOT NULL
  - [ ] service_fee - DECIMAL(10,2), 手续费, DEFAULT 0
  - [ ] amount - DECIMAL(10,2), 实付金额, NOT NULL
  - [ ] status - ENUM('pending','success','failed','refunded','partial_refund'), 支付状态, DEFAULT 'pending'
  - [ ] qrcode_url - VARCHAR(500), 支付二维码URL
  - [ ] qrcode_expire_time - DATETIME, 二维码过期时间
  - [ ] trade_no - VARCHAR(100), 第三方交易号（微信/支付宝）
  - [ ] pay_time - DATETIME, 实际支付时间
  - [ ] callback_data - JSON, 支付回调原始数据（用于对账）
  - [ ] refund_no - VARCHAR(50), 退款流水号
  - [ ] refund_amount - DECIMAL(10,2), 退款金额
  - [ ] refund_time - DATETIME, 退款时间
  - [ ] refund_reason - VARCHAR(200), 退款原因
  - [ ] error_msg - VARCHAR(500), 错误信息
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - uk_payment_no (payment_no) - 支付流水号查询
    - idx_order_id (order_id) - 订单支付记录
    - idx_trade_no (trade_no) - 回调查询
    - idx_status (status)
    - idx_created_at (created_at) - 对账查询
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.7 加价模块

- [ ] 🔴 **加价规则表（PriceMarkup）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] name - VARCHAR(100), 规则名称, NOT NULL
  - [ ] description - VARCHAR(500), 规则说明
  - [ ] store_id - BIGINT, 门店ID, FK(Store.id), NULL表示全部门店
  - [ ] supplier_id - BIGINT, 供应商ID, FK(Supplier.id), NULL表示全部供应商
  - [ ] category_id - BIGINT, 分类ID, FK(Category.id), NULL表示全部分类
  - [ ] material_id - BIGINT, 物料ID, FK(Material.id), NULL表示全部物料
  - [ ] markup_type - ENUM('fixed','percent'), 加价方式, NOT NULL
  - [ ] markup_value - DECIMAL(10,4), 加价值（固定金额或百分比如0.05表示5%）, NOT NULL
  - [ ] min_markup - DECIMAL(10,2), 最低加价金额（百分比时）
  - [ ] max_markup - DECIMAL(10,2), 最高加价金额（百分比时）
  - [ ] priority - INT, 优先级, DEFAULT 0, 数值越大优先级越高
  - [ ] is_active - TINYINT(1), 是否启用, DEFAULT 1
  - [ ] start_time - DATETIME, 生效开始时间（可选）
  - [ ] end_time - DATETIME, 生效结束时间（可选）
  - [ ] created_by - BIGINT, 创建人ID
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_active_priority (is_active, priority DESC) - 规则匹配
    - idx_store_id (store_id)
    - idx_supplier_id (supplier_id)
  - [ ] **加价规则匹配逻辑**：按优先级从高到低匹配，找到第一个匹配的规则

- [ ] 🔴 **系统配置表（SystemConfig）**
- [ ] 🟠 **Webhook推送日志表（WebhookLog）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] target_type - ENUM('store','supplier'), 推送目标类型
  - [ ] target_id - BIGINT, 门店ID或供应商ID
  - [ ] event_type - ENUM('order_created','order_confirmed','order_delivering','order_completed','order_cancelled','order_restored'), 事件类型
  - [ ] order_id - BIGINT, 关联订单ID, FK(Order.id)
  - [ ] webhook_url - VARCHAR(500), 推送地址
  - [ ] request_headers - JSON, 请求头
  - [ ] request_body - JSON, 请求内容
  - [ ] response_code - INT, HTTP响应状态码
  - [ ] response_body - TEXT, 响应内容
  - [ ] status - ENUM('pending','success','failed'), 推送状态, DEFAULT 'pending'
  - [ ] retry_count - INT, 已重试次数, DEFAULT 0
  - [ ] next_retry_at - DATETIME, 下次重试时间
  - [ ] error_msg - VARCHAR(500), 错误信息
  - [ ] duration_ms - INT, 请求耗时(毫秒)
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_target (target_type, target_id) - 目标查询
    - idx_order_id (order_id) - 订单推送记录
    - idx_status (status) - 待重试列表
    - idx_created_at (created_at) - 日志清理
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🟡 **操作日志表（OperationLog）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] user_id - BIGINT, 操作用户ID
  - [ ] user_type - ENUM('admin','supplier','store'), 用户类型
  - [ ] user_name - VARCHAR(50), 用户名称（冗余，便于查看）
  - [ ] module - VARCHAR(50), 模块名称, NOT NULL
  - [ ] action - VARCHAR(50), 操作类型(create/update/delete/export等), NOT NULL
  - [ ] target_type - VARCHAR(50), 目标类型(order/store/supplier等)
  - [ ] target_id - BIGINT, 目标ID
  - [ ] description - VARCHAR(500), 操作描述
  - [ ] before_data - JSON, 操作前数据
  - [ ] after_data - JSON, 操作后数据
  - [ ] diff_data - JSON, 变更差异（可选，便于查看）
  - [ ] ip_address - VARCHAR(50), IP地址
  - [ ] user_agent - VARCHAR(500), 浏览器UA
  - [ ] request_url - VARCHAR(500), 请求URL
  - [ ] request_method - VARCHAR(10), 请求方法
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_user (user_type, user_id) - 用户操作记录
    - idx_module_action (module, action) - 模块操作统计
    - idx_target (target_type, target_id) - 目标操作历史
    - idx_created_at (created_at) - 时间查询
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件
  - [ ] **日志保留策略**：保疐90天，定期清理

### 2.9 素材库模块

- [ ] 🟡 **素材图片表（MediaImage）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] category_id - BIGINT, 分类ID, FK(Category.id)
  - [ ] brand - VARCHAR(50), 品牌
  - [ ] name - VARCHAR(100), 图片名称
  - [ ] url - VARCHAR(500), 图片URL, NOT NULL
  - [ ] thumbnail_url - VARCHAR(500), 缩略图URL
  - [ ] file_size - INT, 文件大小(字节)
  - [ ] width - INT, 图片宽度
  - [ ] height - INT, 图片高度
  - [ ] tags - JSON, 标签数组, 如["有机","进口"]
  - [ ] sku_codes - JSON, 关联SKU编码数组
  - [ ] match_keywords - VARCHAR(500), 匹配关键词
  - [ ] usage_count - INT, 使用次数, DEFAULT 0
  - [ ] status - TINYINT(1), 状态, DEFAULT 1
  - [ ] uploaded_by - BIGINT, 上传人ID
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_category_brand (category_id, brand)
    - FULLTEXT idx_search (name, match_keywords) - 搜索
    - idx_tags (tags) - JSON索引
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

- [ ] 🟡 **图片匹配规则表（ImageMatchRule）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] name - VARCHAR(100), 规则名称
  - [ ] rule_type - ENUM('name','brand','sku','keyword'), 规则类型
  - [ ] match_pattern - VARCHAR(200), 匹配模式（正则或关键词）
  - [ ] similarity_threshold - DECIMAL(3,2), 相似度阈值(0-1), DEFAULT 0.8
  - [ ] priority - INT, 优先级, DEFAULT 0
  - [ ] is_active - TINYINT(1), 是否启用, DEFAULT 1
  - [ ] created_at - DATETIME
  - [ ] **索引设计**
    - idx_active_priority (is_active, priority DESC)
  - [ ] 编写TypeORM Entity
  - [ ] 编写迁移文件

### 2.10 购物车模块（Redis存储）

- [ ] 🔴 **购物车数据结构设计**
  - [ ] Redis Key设计：`cart:{store_id}:{supplier_id}`
  - [ ] 数据结构：Hash
    - field: `{material_sku_id}`
    - value: JSON `{quantity, addedAt, price, ...}`
  - [ ] 过期时间：30天
  - [ ] **购物车操作接口**
    - addToCart(storeId, supplierId, skuId, quantity)
    - updateQuantity(storeId, supplierId, skuId, quantity)
    - removeItem(storeId, supplierId, skuId)
    - getCart(storeId) - 获取门店所有供应商购物车
    - clearCart(storeId, supplierId) - 清空指定供应商购物车
    - getCartCount(storeId) - 获取购物车商品总数
  - [ ] 编写购物车Service
  - [ ] 编写单元测试

---

## 3. 认证与权限系统

> **负责人**：全栈开发团队  
> **验收标准**：登录流程完整、权限控制准确、安全防护到位

### 3.1 用户认证

- [ ] **登录功能**
  - [ ] 实现账号密码登录接口 `POST /api/auth/login`
    - 请求：`{ username, password }`
    - 响应：`{ accessToken, refreshToken, expiresIn, user }`
  - [ ] 实现手机号+验证码登录接口（可选）`POST /api/auth/login/sms`
  - [ ] 实现密码加密存储（PBKDF2）
  - [ ] 实现JWT Token生成
    - accessToken有效期：2小时
    - refreshToken有效期：7天
    - Payload：`{ userId, role, sessionId }`
  - [ ] 实现Token刷新机制 `POST /api/auth/refresh`
    - 使用refreshToken换取新accessToken
    - refreshToken单次使用，刷新后失效
  - [ ] 实现登录状态记忆
    - “记住我”选项：refreshToken延长至30天
  - [ ] 实现登录失败次数限制
    - 连续5次失败后锁定账号15分钟
    - Redis记录失败次数，Key: `login_fail:{username}`
  - [ ] 实现账号锁定机制
    - 锁定期间返回剩余解锁时间
    - 管理员可手动解锁
  - [ ] 实现登录日志记录
  - [ ] 实现登录日志记录
    - 记录登录时间、IP、设备信息
  - [ ] 编写登录接口单元测试
  - [ ] 编写登录流程集成测试

- [ ] 🔴 **多角色身份识别**
  - [ ] 实现登录时查询用户关联的所有角色
    - 一个用户可能同时是管理员和供应商
  - [ ] 单角色用户：Token直接包含角色信息，前端跳转对应界面
  - [ ] 多角色用户：返回角色列表，前端显示角色选择页面
  - [ ] 实现角色选择接口 `POST /api/auth/select-role`
    - 请求：`{ role, roleId }`（如选择供应商角色需传supplierId）
    - 响应：新Token（包含选定角色信息）
  - [ ] 实现角色切换功能（无需重新登录）
  - [ ] Token中存储当前角色信息
    ```typescript
    interface TokenPayload {
      userId: number;
      currentRole: 'admin' | 'supplier' | 'store';
      roleId?: number; // supplierId或storeId
      sessionId: string;
    }
    ```

- [ ] 🔴 **登出功能**
  - [ ] 实现登出接口 `POST /api/auth/logout`
  - [ ] 将Token加入黑名单（Redis存储，Key: `token_blacklist:{sessionId}`）
  - [ ] 黑名单过期时间与Token有效期一致
  - [ ] 清除用户Session相关缓存
  - [ ] 前端清除本地存储的Token和用户信息

- [ ] 🟢 **微信登录（可选扩展）**
  - [ ] 实现微信OAuth授权流程
    - 获取授权链接 `GET /api/auth/wechat/authorize`
    - 处理回调 `GET /api/auth/wechat/callback`
  - [ ] 实现微信账号绑定 `POST /api/auth/wechat/bindto`
  - [ ] 实现微信账号解绑 `POST /api/auth/wechat/unbind`
  - [ ] 已绑定用户微信扫码直接登录

### 3.2 权限管理

- [ ] 🔴 **管理员权限体系**
  - [ ] 实现主管理员创建（系统初始化时，Seed脚本）
    - 默认账号：admin / 初始密码（首次登录强制修改）
  - [ ] 实现子管理员创建接口 `POST /api/admin/admins`
    - 仅主管理员可操作
    - 请求：`{ username, password, name, permissions[] }`
  - [ ] 实现权限分配接口 `PUT /api/admin/admins/:id/permissions`
  - [ ] 实现权限查询接口 `GET /api/admin/admins/:id/permissions`
  - [ ] 实现管理员列表接口 `GET /api/admin/admins`
  - [ ] 实现管理员禁用/启用 `PUT /api/admin/admins/:id/status`

- [ ] 🔴 **权限模块定义**
  ```typescript
  export const PERMISSIONS = {
    // 普通权限（可分配给子管理员）
    ORDER: 'order',              // 订单管理
    REPORT: 'report',            // 数据报表
    SUPPLIER: 'supplier',        // 供应商管理
    STORE: 'store',              // 门店管理
    MATERIAL: 'material',        // 物料管理
    MEDIA: 'media',              // 素材库
    PRODUCT_AUDIT: 'product_audit',     // 产品审核
    MARKUP: 'markup',            // 加价管理
    DELIVERY_AUDIT: 'delivery_audit',   // 配送设置审核
    WEBHOOK: 'webhook',          // Webhook配置
    
    // 敏感权限（仅主管理员）
    PAYMENT_CONFIG: 'payment_config',   // 支付配置
    API_CONFIG: 'api_config',           // API配置
    SYSTEM_CONFIG: 'system_config',     // 系统设置
    ADMIN_MANAGE: 'admin_manage',       // 管理员管理
  } as const;
  
  export const SENSITIVE_PERMISSIONS = [
    'payment_config', 'api_config', 'system_config', 'admin_manage'
  ];
  ```
  - [ ] 编写权限常量文件
  - [ ] 编写权限描述映射

- [ ] 🔴 **权限校验中间件**
  - [ ] 实现API权限校验Guard（Nest.js）
    ```typescript
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('order')
    @Get('orders')
    async getOrders() {}
    ```
  - [ ] 实现基于角色的访问控制
    - 管理员：根据permissions数组校验
    - 供应商：只能访问供应商相关接口
    - 门店：只能访问门店相关接口
  - [ ] 实现前端路由权限守卫
    - Vue Router beforeEach钩子
    - 根据用户权限动态生成路由
  - [ ] 实现菜单权限控制
    - 根据权限动态生成侧边栏菜单
  - [ ] 实现按钮级权限控制
    - v-permission指令：`<button v-permission="'order:delete'">删除</button>`
  - [ ] 实现敏感操作二次确认
    - 删除、批量操作需二次确认
    - 敏感配置修改需输入密码

### 3.3 安全措施

- [ ] 🔴 **接口安全**
  - [ ] 实现请求签名验证（供应商API对接时使用）
    - HMAC-SHA256签名
    - 签名内容：timestamp + nonce + body
    - 签名放在Header：X-Signature, X-Timestamp, X-Nonce
  - [ ] 实现接口频率限制（@nestjs/throttler）
    - 普通接口：100次/分钟
    - 登录接口：10次/分钟
    - 验证码接口：1次/分钟
  - [ ] 实现SQL注入防护
    - 使用TypeORM参数化查询
    - 禁止拼接SQL
  - [ ] 实现XSS防护
    - 输入过滤（class-validator + class-transformer）
    - 输出转义
  - [ ] 实现CSRF防护
    - SameSite Cookie属性
    - 双重Cookie验证（可选）

- [ ] 🟠 **数据安全**
  - [ ] 敏感数据加密存储
    - API密钥使用AES加密存储
    - 支付配置加密存储
  - [ ] 敏感数据脱敏展示
    - 手机号：138****8888
    - 身份证：110***********1234
    - API密钥：只显示前4位后4位
  - [ ] 实现操作日志记录
    - 使用AOP切面自动记录
    - 记录操作前后数据变化
  - [ ] 实现审计日志
    - 敏感操作单独记录
    - 支持导出审计报告

### 3.4 业务模块API实现

- [ ] 🔴 **供应商管理模块API**
  - [ ] 供应商CRUD接口 (`/admin/suppliers`)
  - [ ] 供应商列表查询（分页、搜索、筛选）
  - [ ] 供应商详情/编辑
  - [ ] Webhook配置接口
  - [ ] API配置接口
  - [ ] 重新生成API密钥接口
  - [ ] 启用/禁用供应商
  - [ ] 配送区域管理接口
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **门店管理模块API**
  - [ ] 门店CRUD接口 (`/admin/stores`)
  - [ ] 门店列表查询（分页、搜索、筛选）
  - [ ] 门店详情/编辑
  - [ ] 加价开关设置接口
  - [ ] 启用/禁用门店
  - [ ] 按区域查询门店
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **订单管理模块API**
  - [ ] 订单CRUD接口 (`/admin/orders`, `/supplier/orders`, `/store/orders`)
  - [ ] 订单列表查询（分页、搜索、筛选）
  - [ ] 订单详情
  - [ ] 订单状态变更（确认、配送、完成、取消）
  - [ ] 订单状态日志查询
  - [ ] 订单统计接口
  - [ ] 管理员/供应商/门店三端Controller
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **物料管理模块API**
  - [ ] 分类CRUD接口 (`/admin/categories`)
  - [ ] 分类树形结构查询
  - [ ] 物料CRUD接口 (`/admin/materials`)
  - [ ] 物料列表查询（分页、搜索、筛选）
  - [ ] 物料详情
  - [ ] 物料状态更新接口
  - [ ] 供应商端/门店端物料查询接口
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **物料SKU管理模块API**
  - [ ] SKU CRUD接口 (`/admin/material-skus`)
  - [ ] SKU列表查询（分页、搜索、筛选）
  - [ ] 按物料ID查询SKU列表
  - [ ] 按条码查询SKU
  - [ ] 获取所有品牌列表
  - [ ] SKU状态更新接口
  - [ ] 供应商端/门店端SKU查询接口
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **供应商物料报价模块API**
  - [ ] 供应商物料报价CRUD接口 (`/admin/supplier-materials`, `/supplier/materials`)
  - [ ] 报价列表查询（分页、搜索、筛选）
  - [ ] 按供应商查询报价列表
  - [ ] 按物料SKU查询报价列表（含最低价排序）
  - [ ] 库存状态更新接口
  - [ ] 审核接口（管理员）
  - [ ] 批量调价接口
  - [ ] 价格对比统计接口
  - [ ] 门店端报价查询接口
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **加价规则管理模块API**
  - [ ] 加价规则CRUD接口 (`/admin/price-markups`)
  - [ ] 规则列表查询（分页、搜索、筛选）
  - [ ] 获取生效中的规则列表
  - [ ] 规则状态更新接口
  - [ ] 加价计算接口（支持门店/供应商/分类/物料多维度匹配）
  - [ ] 门店端加价计算接口
  - [ ] DTO、Service、Controller、Module文件

- [ ] 🔴 **购物车管理模块API**
  - [ ] 添加商品到购物车 (`POST /cart/add`)
  - [ ] 更新购物车商品数量 (`PUT /cart/update`)
  - [ ] 删除购物车商品 (`DELETE /cart/remove`)
  - [ ] 获取购物车列表 (`GET /cart`)
  - [ ] 获取指定供应商购物车 (`GET /cart/supplier/:supplierId`)
  - [ ] 清空购物车 (`DELETE /cart/clear`)
  - [ ] 获取购物车商品数量 (`GET /cart/count`)
  - [ ] 刷新购物车商品价格 (`POST /cart/refresh-prices`)
  - [ ] Redis存储实现（按门店+供应商分组）
  - [ ] DTO、Service、Controller、Module文件

---

## 4. 门店端功能

### 4.1 门店Web后台

#### 4.1.1 数据看板

- [ ] **首页数据看板**
  - [ ] 本月订货金额统计卡片
  - [ ] 本月订单数统计卡片
  - [ ] 待收货订单统计卡片
  - [ ] 可用供应商数量统计卡片
  - [ ] 订货趋势图（近30天）
  - [ ] 供应商订货占比饼图
  - [ ] 常购物料TOP10列表
  - [ ] 各分类订货金额排行

#### 4.1.2 在线订货

- [ ] **物料浏览**
  - [ ] 按分类浏览物料列表
  - [ ] 物料搜索功能（名称/编号）
  - [ ] 物料筛选（供应商、分类）
  - [ ] 分类Tab切换
  - [ ] 物料卡片展示（图片、名称、品牌、规格、价格起）

- [ ] **物料详情与选购**
  - [ ] 物料详情弹窗/页面
  - [ ] 品牌选择（多品牌时）
  - [ ] 规格选择（多规格时）
  - [ ] 供应商报价对比列表
  - [ ] 显示供应商名称、单价、起送价、起订量、配送日
  - [ ] 数量选择器（+/-按钮）
  - [ ] 起订量校验提示
  - [ ] 加入购物车按钮
  - [ ] 加入购物车成功提示

- [ ] **购物车**
  - [ ] 按供应商分组展示商品
  - [ ] 每组显示：供应商名称、起送价、当前小计
  - [ ] 已达起送价标识（绿色边框）
  - [ ] 未达起送价警告（红色边框+提示）
  - [ ] 商品数量修改
  - [ ] 商品删除
  - [ ] 清空购物车
  - [ ] 底部结算栏：可结算金额、结算按钮
  - [ ] 结算按钮只结算已达起送价的供应商

- [ ] **结算下单**
  - [ ] 结算确认页面
  - [ ] 显示收货地址（仅展示，不可修改）
  - [ ] 按供应商分组显示订单预览
  - [ ] 每组显示：商品列表、小计、预计送达日期
  - [ ] 备注输入框（每个供应商可单独备注）
  - [ ] 订单金额汇总
  - [ ] 服务费计算显示（3‰）
  - [ ] 提交订单按钮
  - [ ] 按供应商拆分生成多个订单

- [ ] **在线支付**
  - [ ] 支付方式选择（微信/支付宝）
  - [ ] 生成支付二维码
  - [ ] 二维码有效期倒计时（15分钟）
  - [ ] 支付状态轮询
  - [ ] 支付成功跳转
  - [ ] 支付超时提示
  - [ ] 刷新二维码功能
  - [ ] 切换支付方式

#### 4.1.3 订单管理

- [ ] **订单列表**
  - [ ] 订单列表页面
  - [ ] 订单状态筛选（全部/待付款/待确认/配送中/已完成/已取消）
  - [ ] 日期范围筛选
  - [ ] 供应商筛选
  - [ ] 订单搜索（订单号）
  - [ ] 订单卡片展示（供应商、金额、状态、时间、商品数）
  - [ ] 分页加载

- [ ] **订单详情**
  - [ ] 订单详情页面
  - [ ] 订单基本信息（订单号、下单时间、状态）
  - [ ] 收货信息
  - [ ] 商品明细列表
  - [ ] 金额明细（商品金额、服务费、实付金额）
  - [ ] 订单状态时间线

- [ ] **订单操作**
  - [ ] 待付款订单：显示支付二维码，重新支付
  - [ ] 再来一单：复制订单商品到购物车
  - [ ] 取消订单（1小时内自主取消）
  - [ ] 提交取消申请（超过1小时）
  - [ ] 取消申请状态跟踪

- [ ] **订单导出**
  - [ ] 导出订单明细Excel
  - [ ] 导出筛选条件配置

#### 4.1.4 市场行情

- [ ] **价格对比页面**
  - [ ] 市场行情页面布局
  - [ ] 按分类筛选
  - [ ] 按产品搜索
  - [ ] 产品价格对比卡片
  - [ ] 各供应商报价列表（排序：价格从低到高）
  - [ ] 最低价标识
  - [ ] 直接加入购物车按钮

#### 4.1.5 统计分析

- [ ] **按时间统计**
  - [ ] 日/周/月订货金额趋势图
  - [ ] 订单数量趋势图
  - [ ] 时间范围选择器
  - [ ] 数据表格展示
  - [ ] 导出报表

- [ ] **按分类统计**
  - [ ] 各分类订货金额占比图
  - [ ] 各分类订货金额排行
  - [ ] 分类明细表格
  - [ ] 导出报表

- [ ] **按供应商统计**
  - [ ] 各供应商订货金额占比图
  - [ ] 各供应商订货金额排行
  - [ ] 供应商明细表格
  - [ ] 导出报表

#### 4.1.6 账户设置

- [ ] **门店信息**
  - [ ] 门店信息展示
  - [ ] 联系人信息
  - [ ] 门店地址

- [ ] **收货地址**
  - [ ] 收货地址展示（由管理员维护，门店只读）

---

## 5. 供应商端功能

### 5.1 供应商Web后台

#### 5.1.1 订单概览

- [ ] **首页数据看板**
  - [ ] 待处理订单数量统计（红色高亮）
  - [ ] 今日订单数统计
  - [ ] 今日销售额统计
  - [ ] 本月销售额统计
  - [ ] 待处理订单列表（快捷操作）
  - [ ] 每个订单显示：门店名称、金额、商品数、期望配送时间
  - [ ] 快捷确认订单按钮
  - [ ] 快捷开始配送按钮
  - [ ] 查看详情按钮
  - [ ] 打印送货单按钮

#### 5.1.2 市场行情

- [ ] **价格对比页面**
  - [ ] 市场行情说明提示
  - [ ] 在售产品数量统计
  - [ ] 价格最低产品数量统计（绿色）
  - [ ] 价格偏高产品数量统计（橙色）
  - [ ] 价格持平产品数量统计

- [ ] **产品价格列表**
  - [ ] 分类筛选
  - [ ] 价格状态筛选（最低/偏高）
  - [ ] 产品列表表格
  - [ ] 显示：产品名称、品牌、规格、您的报价、市场最低价、价差
  - [ ] 价格最低标识（绿色背景）
  - [ ] 价格偏高标识（红色背景）
  - [ ] 快捷调价按钮
  - [ ] 价格调整建议区域
  - [ ] 建议降价产品列表
  - [ ] 价格优势产品列表
  - [ ] 数据更新时间显示
  - [ ] 刷新数据按钮

#### 5.1.3 订单管理

- [ ] **订单列表**
  - [ ] 订单列表页面
  - [ ] 订单状态筛选（全部/待确认/已确认/配送中/已完成）
  - [ ] 门店筛选
  - [ ] 日期筛选
  - [ ] 订单搜索（订单号）
  - [ ] 订单表格展示
  - [ ] 显示：订单编号、门店、商品数、金额、期望配送、状态
  - [ ] 分页功能
  - [ ] 导出Excel按钮

- [ ] **订单详情**
  - [ ] 订单详情弹窗/页面
  - [ ] 订单基本信息
  - [ ] 门店收货信息
  - [ ] 商品明细列表（显示供应商原价）
  - [ ] 订单金额汇总

- [ ] **订单操作**
  - [ ] 确认订单按钮
  - [ ] 标记配送中按钮
  - [ ] 标记已完成按钮
  - [ ] 打印送货单按钮

#### 5.1.4 送货单打印

- [ ] **打印功能**
  - [ ] 订单选择列表（复选框）
  - [ ] 按日期筛选订单
  - [ ] 批量选择功能
  - [ ] 打印预览区域
  - [ ] 送货单模板（使用管理员配置的模板）
  - [ ] 送货单内容：订单信息、商品明细、收货信息、签收栏
  - [ ] 批量打印按钮
  - [ ] 单张打印按钮

#### 5.1.5 物料价格管理

- [ ] **价格设置**
  - [ ] 物料价格列表
  - [ ] 物料搜索
  - [ ] 分类筛选
  - [ ] 显示：物料名称、品牌、规格、当前价格、库存状态
  - [ ] 编辑价格弹窗
  - [ ] 设置最小起订量
  - [ ] 批量修改价格

- [ ] **库存管理**
  - [ ] 库存状态列表
  - [ ] 设置有货/缺货状态
  - [ ] 批量设置库存状态

- [ ] **Excel导入**
  - [ ] 下载导入模板
  - [ ] 上传Excel文件
  - [ ] 导入预览
  - [ ] 数据校验
  - [ ] 确认导入
  - [ ] 导入结果展示
  - [ ] 导入历史记录
  - [ ] 错误日志查看

#### 5.1.6 配送设置

- [ ] **配送日/起送价设置**
  - [ ] 起送价设置输入框
  - [ ] 配送日选择（周一到周日多选）
  - [ ] 保存设置（提交审核）
  - [ ] 审核状态显示
  - [ ] 待审核提示
  - [ ] 审核驳回原因显示

- [ ] **配送区域管理**
  - [ ] 配送区域列表
  - [ ] 添加配送区域（省市区选择）
  - [ ] 删除配送区域
  - [ ] 批量导入配送区域
  - [ ] 保存设置（提交审核）

- [ ] **运单管理（快递配送模式）**
  - [ ] 运单列表
  - [ ] 上传运单号
  - [ ] 运单号关联订单
  - [ ] 物流状态追踪（可选）

#### 5.1.7 账户信息

- [ ] **供应商信息**
  - [ ] 供应商信息展示
  - [ ] 联系人信息
  - [ ] 当前配送设置展示

---

## 6. 管理员端功能

### 6.1 管理员Web后台

#### 6.1.1 数据看板

- [ ] **首页数据看板**
  - [ ] 今日订单数统计卡片
  - [ ] 今日订货金额统计卡片
  - [ ] 本月订单数统计卡片
  - [ ] 本月加价收入统计卡片（绿色高亮）
  - [ ] 订货趋势图（近30天）
  - [ ] 供应商订单排行TOP5
  - [ ] 门店订货排行TOP5
  - [ ] 订单状态分布统计

#### 6.1.2 订单管理

- [ ] **订单列表**
  - [ ] 订单列表页面
  - [ ] 多维度筛选：状态、门店、供应商、日期
  - [ ] 订单搜索（订单号）
  - [ ] 订单表格展示
  - [ ] 显示：订单编号、门店、供应商、商品数、订单金额、加价收入、状态、下单时间
  - [ ] 加价收入列（绿色显示有加价，灰色显示无加价）
  - [ ] 分页功能
  - [ ] 导出Excel按钮

- [ ] **订单详情**
  - [ ] 订单详情页面
  - [ ] 显示完整订单信息
  - [ ] 显示原价、加价、最终价格
  - [ ] 订单状态时间线
  - [ ] 订单操作日志

- [ ] **取消申请审批**
  - [ ] 待审批取消申请列表
  - [ ] 显示：订单信息、门店信息、取消原因、申请时间
  - [ ] 批准取消按钮
  - [ ] 拒绝取消按钮（需填写原因）
  - [ ] 联系供应商确认提示

- [ ] **订单恢复**
  - [ ] 已取消订单列表
  - [ ] 恢复订单按钮
  - [ ] 恢复原因填写
  - [ ] 恢复后状态变为"待付款"
  - [ ] 通知门店重新付款

- [ ] **管理员直接取消**
  - [ ] 任意状态订单可取消
  - [ ] 取消原因填写
  - [ ] 确认取消弹窗

#### 6.1.3 市场行情

- [ ] **全局价格对比**
  - [ ] 区域筛选
  - [ ] 分类筛选
  - [ ] 产品搜索
  - [ ] 在售产品数量统计
  - [ ] 活跃供应商数量统计
  - [ ] 价格异常数量统计（价差超过15%）
  - [ ] 独家供应产品数量统计

- [ ] **产品价格对比表**
  - [ ] 产品列表表格
  - [ ] 显示：产品名称、品牌、规格、供应商数、最低价、最高价、价差
  - [ ] 各供应商报价详情展开
  - [ ] 最低价标识
  - [ ] 价格偏高预警标识
  - [ ] 导出Excel按钮

- [ ] **价格预警**
  - [ ] 价格异常预警列表
  - [ ] 独家供应产品列表

#### 6.1.4 数据汇总报表

- [ ] **按门店汇总**
  - [ ] 门店列表表格
  - [ ] 显示：门店名称、订货金额、订单数、常购物料
  - [ ] 门店详情钻取
  - [ ] 时间范围筛选
  - [ ] 导出报表

- [ ] **按供应商汇总**
  - [ ] 供应商列表表格
  - [ ] 显示：供应商名称、销售金额、订单数、热销物料
  - [ ] 供应商详情钻取
  - [ ] 时间范围筛选
  - [ ] 导出报表

- [ ] **按物料汇总**
  - [ ] 物料列表表格
  - [ ] 显示：物料名称、销量、销售额、采购门店数
  - [ ] 分类筛选
  - [ ] 时间范围筛选
  - [ ] 导出报表

- [ ] **对比分析**
  - [ ] 同比/环比分析
  - [ ] 门店订货排名变化
  - [ ] 供应商销售排名变化
  - [ ] 图表可视化

#### 6.1.5 供应商管理

- [ ] **供应商列表**
  - [ ] 供应商列表页面
  - [ ] 供应商搜索
  - [ ] 状态筛选（启用/禁用）
  - [ ] 管理模式筛选
  - [ ] 显示：名称、联系人、管理模式、加价开关、状态

- [ ] **供应商详情/编辑**
  - [ ] 供应商信息编辑
  - [ ] 显示名称设置（门店端展示名称）
  - [ ] 联系信息编辑
  - [ ] 启用/禁用供应商

- [ ] **对接配置**
  - [ ] 管理模式设置（自主管理/平台代管/Webhook/API对接）
  - [ ] Webhook URL配置
  - [ ] Webhook开关
  - [ ] 推送事件选择（新订单/状态变更/取消/恢复）
  - [ ] 测试推送按钮
  - [ ] API接口地址配置
  - [ ] API密钥生成/重置
  - [ ] 重试策略配置

- [ ] **创建供应商**
  - [ ] 供应商信息表单
  - [ ] 关联用户账号
  - [ ] 初始配置设置

#### 6.1.6 供应商代管

- [ ] **代管供应商列表**
  - [ ] 筛选管理模式为"平台代管"的供应商
  - [ ] 快捷进入代管操作

- [ ] **代管物料价格**
  - [ ] 代为设置物料价格
  - [ ] 代为设置起订量
  - [ ] Excel批量导入价格

- [ ] **代管配送设置**
  - [ ] 代为设置起送价
  - [ ] 代为设置配送日
  - [ ] 代为设置配送区域

- [ ] **代管订单处理**
  - [ ] 代为确认订单
  - [ ] 代为更新订单状态
  - [ ] 代管操作日志记录

#### 6.1.7 配送设置审核

- [ ] **待审核列表**
  - [ ] 待审核的配送设置变更列表
  - [ ] 显示：供应商名称、变更类型、原值、新值、提交时间
  - [ ] 审核数量Badge提示

- [ ] **审核操作**
  - [ ] 查看变更详情
  - [ ] 审核通过按钮
  - [ ] 审核驳回按钮（需填写原因）
  - [ ] 审核历史记录

#### 6.1.8 产品审核

- [ ] **待审核产品列表**
  - [ ] 供应商导入的待审核产品列表
  - [ ] 显示：产品信息、供应商、提交时间
  - [ ] 审核数量Badge提示

- [ ] **审核内容**
  - [ ] 品牌信息核实
  - [ ] 规格信息核实
  - [ ] 价格合理性检查（与历史价格对比）
  - [ ] 图片匹配检查
  - [ ] 产品信息完整性检查

- [ ] **审核操作**
  - [ ] 审核通过按钮
  - [ ] 审核驳回按钮（需填写原因）
  - [ ] 批量审核功能
  - [ ] 审核历史记录

#### 6.1.9 加价管理

- [ ] **加价开关与概览**
  - [ ] 全局总开关
  - [ ] 供应商级开关列表
  - [ ] 门店级开关列表
  - [ ] 分类级开关列表
  - [ ] 加价收入统计概览

- [ ] **加价规则列表**
  - [ ] 规则列表表格
  - [ ] 显示：规则名称、门店、供应商、商品、加价方式、加价值、优先级、状态
  - [ ] 规则搜索/筛选
  - [ ] 启用/禁用规则
  - [ ] 编辑规则
  - [ ] 删除规则

- [ ] **新建加价规则**
  - [ ] 规则名称输入
  - [ ] 门店选择（可选，空=全部门店）
  - [ ] 供应商选择（可选，空=全部供应商）
  - [ ] 物料选择（可选，空=全部物料）
  - [ ] 加价方式选择（固定金额/百分比）
  - [ ] 加价值输入
  - [ ] 规则启用开关
  - [ ] 优先级自动计算说明

- [ ] **Excel批量导入规则**
  - [ ] 下载导入模板
  - [ ] 上传Excel文件
  - [ ] 导入预览
  - [ ] 确认导入
  - [ ] 导入结果

- [ ] **加价模拟计算**
  - [ ] 选择门店
  - [ ] 选择供应商
  - [ ] 选择商品
  - [ ] 输入原价
  - [ ] 显示匹配的规则
  - [ ] 显示计算后的最终价格

- [ ] **加价收入统计**
  - [ ] 加价收入趋势图
  - [ ] 按门店加价收入统计
  - [ ] 按供应商加价收入统计
  - [ ] 按商品加价收入统计
  - [ ] 时间范围筛选
  - [ ] 导出报表

#### 6.1.10 门店管理

- [ ] **门店列表**
  - [ ] 门店列表页面
  - [ ] 门店搜索
  - [ ] 状态筛选
  - [ ] 区域筛选
  - [ ] 显示：名称、联系人、地址、加价开关、状态

- [ ] **门店详情/编辑**
  - [ ] 门店信息编辑
  - [ ] 收货地址维护
  - [ ] 联系信息编辑
  - [ ] 加价开关设置
  - [ ] Webhook配置
  - [ ] 启用/禁用门店

- [ ] **创建门店**
  - [ ] 门店信息表单
  - [ ] 关联用户账号
  - [ ] 收货地址设置
  - [ ] 初始配置

#### 6.1.11 物料管理

- [ ] **分类管理**
  - [ ] 分类列表（树形结构）
  - [ ] 添加分类
  - [ ] 编辑分类
  - [ ] 删除分类
  - [ ] 分类排序
  - [ ] 分类加价开关

- [ ] **物料列表**
  - [ ] 物料列表页面
  - [ ] 物料搜索
  - [ ] 分类筛选
  - [ ] 显示：名称、分类、SKU数量、状态

- [ ] **物料详情/编辑**
  - [ ] 物料基本信息编辑
  - [ ] 物料图片上传
  - [ ] SKU管理（品牌、规格）
  - [ ] 关联供应商查看

- [ ] **批量导入/导出**
  - [ ] 下载导入模板
  - [ ] 批量导入物料
  - [ ] 导出物料列表

#### 6.1.12 素材库管理

- [ ] **图片素材库**
  - [ ] 图片列表（网格展示）
  - [ ] 按分类筛选
  - [ ] 按品牌筛选
  - [ ] 图片搜索
  - [ ] 批量上传图片
  - [ ] 图片标签管理

- [ ] **图片匹配机制**
  - [ ] 自动匹配开关
  - [ ] 匹配规则配置
  - [ ] 名称相似度阈值设置
  - [ ] 品牌精确匹配设置
  - [ ] 规格匹配设置
  - [ ] 手动匹配入口

#### 6.1.13 管理员管理（仅主管理员）

- [ ] **管理员列表**
  - [ ] 管理员列表页面
  - [ ] 显示：姓名、账号、角色类型、权限、创建时间、状态
  - [ ] 主管理员标识

- [ ] **创建子管理员**
  - [ ] 基本信息填写
  - [ ] 账号密码设置
  - [ ] 权限分配（多选）
  - [ ] 敏感权限不可分配给子管理员

- [ ] **编辑子管理员**
  - [ ] 信息编辑
  - [ ] 权限调整
  - [ ] 重置密码
  - [ ] 启用/禁用

#### 6.1.14 系统设置

- [ ] **API配置（仅主管理员）**
  - [ ] 供应商API对接配置
  - [ ] API密钥管理
  - [ ] 推送地址配置

- [ ] **支付配置（仅主管理员）**
  - [ ] 微信支付配置
  - [ ] 支付宝支付配置
  - [ ] 支付参数加密存储

- [ ] **送货单模板配置**
  - [ ] 模板列表
  - [ ] 创建模板
  - [ ] 模板编辑器
  - [ ] 模板预览
  - [ ] 为供应商分配模板

- [ ] **系统参数配置（仅主管理员）**
  - [ ] 订单取消时间阈值配置
  - [ ] 支付超时时间配置
  - [ ] 服务费费率配置
  - [ ] 其他系统参数

- [ ] **操作日志**
  - [ ] 操作日志列表
  - [ ] 日志筛选（用户、模块、时间）
  - [ ] 日志详情查看
  - [ ] 日志导出

---

## 7. 移动端APP

### 7.1 APP通用功能

#### 7.1.1 登录模块

- [ ] **登录页面**
  - [ ] APP启动页/引导页
  - [ ] 登录表单（账号/密码）
  - [ ] 手机号+验证码登录（可选）
  - [ ] 记住登录状态
  - [ ] 登录按钮
  - [ ] 演示账号快捷登录（开发测试用）

- [ ] **角色选择**
  - [ ] 多角色用户显示角色选择页
  - [ ] 角色卡片展示（门店/供应商/管理员）
  - [ ] 点击角色进入对应界面
  - [ ] 角色切换功能（设置页）

#### 7.1.2 版本更新

- [ ] **版本检测**
  - [ ] 启动时检查版本
  - [ ] 版本对比逻辑
  - [ ] 更新提示弹窗

- [ ] **更新机制**
  - [ ] 热更新支持（JS/资源文件）
  - [ ] 强制更新提示
  - [ ] 下载新版本APK
  - [ ] 安装引导

### 7.2 门店端APP

#### 7.2.1 首页

- [ ] **首页布局**
  - [ ] 顶部导航栏（供应链订货）
  - [ ] 搜索栏（搜索物料名称）
  - [ ] 分类入口（粮油、肉禽蛋、蔬菜、调味品、包材等）
  - [ ] 热门物料列表

- [ ] **物料卡片**
  - [ ] 物料图片
  - [ ] 物料名称
  - [ ] 品牌/规格数量提示
  - [ ] 起步价显示
  - [ ] 点击进入详情

#### 7.2.2 物料详情与选购

- [ ] **物料详情页**
  - [ ] 物料图片展示
  - [ ] 物料名称
  - [ ] 品牌选择器（多品牌时）
  - [ ] 规格选择器（多规格时）
  - [ ] 供应商报价列表
  - [ ] 每个供应商显示：名称、单价、起送价、起订量、配送日
  - [ ] 最低价标识
  - [ ] 选择供应商
  - [ ] 数量选择器
  - [ ] 起订量校验
  - [ ] 加入购物车按钮

#### 7.2.3 购物车

- [ ] **购物车页面**
  - [ ] 底部Tab切换
  - [ ] 购物车Badge数量显示
  - [ ] 按供应商分组展示
  - [ ] 每组显示：供应商名称、起送价、当前小计
  - [ ] 已达起送价组：绿色边框+可结算标识
  - [ ] 未达起送价组：红色边框+差额提示
  - [ ] 商品项：图片、名称、规格、单价、数量
  - [ ] 数量修改
  - [ ] 删除商品
  - [ ] 底部结算栏

- [ ] **结算功能**
  - [ ] 可结算金额显示
  - [ ] 结算按钮（只结算达起送价的）
  - [ ] 跳转结算页

#### 7.2.4 结算下单

- [ ] **结算页面**
  - [ ] 收货地址展示（不可修改）
  - [ ] 按供应商分组订单预览
  - [ ] 商品明细
  - [ ] 预计送达日期
  - [ ] 备注输入
  - [ ] 订单金额汇总
  - [ ] 服务费显示
  - [ ] 提交订单按钮

- [ ] **支付流程**
  - [ ] 调起微信/支付宝支付
  - [ ] 支付结果处理
  - [ ] 支付成功跳转订单详情
  - [ ] 支付失败提示

#### 7.2.5 订单管理

- [ ] **订单列表页**
  - [ ] 底部Tab切换
  - [ ] 顶部状态Tab（全部/待确认/配送中/已完成）
  - [ ] 订单卡片列表
  - [ ] 订单卡片：供应商名称、状态、商品数、金额、服务费
  - [ ] 下拉刷新
  - [ ] 上拉加载更多

- [ ] **订单详情页**
  - [ ] 订单状态显示
  - [ ] 订单基本信息
  - [ ] 收货信息
  - [ ] 商品明细
  - [ ] 金额明细
  - [ ] 订单操作按钮

- [ ] **订单操作**
  - [ ] 再来一单（复制到购物车）
  - [ ] 取消订单（1小时内）
  - [ ] 提交取消申请（超1小时）
  - [ ] 待付款订单重新支付

#### 7.2.6 市场行情

- [ ] **行情页面**
  - [ ] 底部Tab切换
  - [ ] 提示说明
  - [ ] 产品价格对比卡片列表
  - [ ] 每个产品显示各供应商报价
  - [ ] 最低价标识
  - [ ] 快捷加入购物车

#### 7.2.7 我的

- [ ] **个人中心页面**
  - [ ] 门店信息头部
  - [ ] 数据统计（本月订单、本月消费、供应商数）
  - [ ] 功能入口列表
  - [ ] 收货地址
  - [ ] 常购清单
  - [ ] 订货统计
  - [ ] 设置
  - [ ] 退出登录

### 7.3 供应商端APP

#### 7.3.1 首页（订单概览）

- [ ] **首页数据**
  - [ ] 数据统计Banner
  - [ ] 今日订单金额
  - [ ] 待处理/进行中/已完成订单数
  - [ ] 待处理订单列表
  - [ ] 快捷操作按钮（确认/配送/详情）

#### 7.3.2 订单管理

- [ ] **订单列表**
  - [ ] 顶部状态Tab（待处理/进行中/已完成）
  - [ ] 订单卡片列表
  - [ ] 订单卡片：门店名称、金额、商品数、配送时间、状态
  - [ ] 下拉刷新
  - [ ] 上拉加载更多

- [ ] **订单详情**
  - [ ] 订单详情页面
  - [ ] 门店收货信息
  - [ ] 商品明细（显示供应商原价）
  - [ ] 订单金额

- [ ] **订单操作**
  - [ ] 确认订单按钮
  - [ ] 开始配送按钮
  - [ ] 完成订单按钮

#### 7.3.3 物料价格

- [ ] **价格管理页面**
  - [ ] 物料价格列表
  - [ ] 搜索物料
  - [ ] 编辑价格
  - [ ] 设置库存状态

#### 7.3.4 我的

- [ ] **个人中心**
  - [ ] 供应商信息头部
  - [ ] 今日统计数据
  - [ ] 功能入口
  - [ ] 配送设置查看
  - [ ] 设置
  - [ ] 退出登录

### 7.4 管理员端APP

#### 7.4.1 首页（数据概览）

- [ ] **首页数据**
  - [ ] 数据统计Banner
  - [ ] 今日订单数/金额
  - [ ] 待处理订单数
  - [ ] 快速操作入口
  - [ ] 异常订单提醒

#### 7.4.2 订单监控

- [ ] **订单列表**
  - [ ] 全平台订单列表
  - [ ] 多维度筛选
  - [ ] 订单卡片展示
  - [ ] 订单详情查看

#### 7.4.3 快捷查询

- [ ] **查询功能**
  - [ ] 门店信息查询
  - [ ] 供应商信息查询
  - [ ] 订单状态查询

#### 7.4.4 我的

- [ ] **个人中心**
  - [ ] 管理员信息
  - [ ] 关键指标展示
  - [ ] 设置
  - [ ] 退出登录

### 7.5 APP消息推送

- [ ] **推送功能**
  - [ ] 集成推送SDK（个推/极光/uni-push）
  - [ ] 新订单通知推送
  - [ ] 订单状态变更推送
  - [ ] 推送点击跳转对应页面
  - [ ] 推送开关设置

---

## 8. 通知与集成

### 8.1 企业微信Webhook推送

#### 8.1.1 推送配置

- [ ] **门店Webhook配置**
  - [ ] 门店Webhook URL存储
  - [ ] Webhook启用/禁用开关
  - [ ] 测试推送功能
  - [ ] 推送状态检查

- [ ] **供应商Webhook配置**
  - [ ] 供应商Webhook URL存储
  - [ ] Webhook启用/禁用开关
  - [ ] 推送事件配置（新订单/状态变更/取消/恢复）
  - [ ] 测试推送功能

#### 8.1.2 推送消息模板

- [ ] **新订单通知 - 门店群版本**
  - [ ] 订单提交成功标题
  - [ ] 门店名称、订单时间
  - [ ] 订单汇总（按供应商分组）
  - [ ] 订单总额、服务费、实付金额
  - [ ] 预计送达日期

- [ ] **新订单通知 - 供应商群版本**
  - [ ] 新订单通知标题
  - [ ] 订单编号、下单门店、下单时间
  - [ ] 订单金额、期望配送时间
  - [ ] 商品明细列表
  - [ ] 收货地址、联系电话、备注

- [ ] **订单确认通知**
  - [ ] 订单已确认标题
  - [ ] 供应商名称、订单编号
  - [ ] 确认时间、预计送达
  - [ ] 商品明细

- [ ] **订单取消通知 - 门店群版本**
  - [ ] 订单取消通知标题
  - [ ] 取消订单信息
  - [ ] 取消原因、取消方式
  - [ ] 退款说明

- [ ] **订单取消通知 - 供应商群版本**
  - [ ] 订单取消通知标题
  - [ ] 订单编号、门店名称
  - [ ] 取消时间、取消原因
  - [ ] 原订单商品明细

- [ ] **订单恢复通知**
  - [ ] 订单恢复通知标题
  - [ ] 订单编号、门店名称
  - [ ] 恢复时间、恢复原因
  - [ ] 当前状态、商品明细

#### 8.1.3 推送服务实现

- [ ] **推送服务**
  - [ ] Webhook推送服务类
  - [ ] 消息格式化处理
  - [ ] HTTP请求发送
  - [ ] 响应结果处理
  - [ ] 推送日志记录

- [ ] **失败重试机制**
  - [ ] 推送失败检测
  - [ ] 自动重试（最多3次，间隔5分钟）
  - [ ] 重试次数记录
  - [ ] 连续失败告警

- [ ] **推送日志**
  - [ ] 推送日志记录
  - [ ] 日志查询接口
  - [ ] 日志清理策略

### 8.2 供应商API对接

#### 8.2.1 订单推送接口（系统→供应商）

- [ ] **推送服务**
  - [ ] 订单创建事件推送
  - [ ] 订单取消事件推送
  - [ ] 订单恢复事件推送
  - [ ] 请求签名生成（HMAC-SHA256）
  - [ ] 请求头设置（Content-Type, X-Signature, X-Timestamp）

- [ ] **推送数据格式**
  - [ ] event字段（order.created/order.cancelled/order.restored）
  - [ ] order对象（订单信息、门店信息、商品明细）
  - [ ] JSON序列化

#### 8.2.2 订单状态回调接口（供应商→系统）

- [ ] **回调接口**
  - [ ] POST /api/v1/supplier/orders/{order_no}/status
  - [ ] 请求验证（Bearer Token）
  - [ ] 状态更新处理（confirmed/delivering/completed）
  - [ ] 响应返回

- [ ] **签名验证**
  - [ ] 供应商密钥管理
  - [ ] 签名验证逻辑
  - [ ] 验证失败处理

### 8.3 短信通知（可选扩展）

- [ ] **短信服务集成**
  - [ ] 短信服务商选择（阿里云/腾讯云）
  - [ ] 短信模板配置
  - [ ] 短信发送接口
  - [ ] 发送记录

- [ ] **短信场景**
  - [ ] 验证码短信
  - [ ] 订单通知短信
  - [ ] 异常提醒短信

---

## 9. 支付系统

### 9.1 支付接入

- [ ] **微信支付**
  - [ ] 微信支付商户号配置
  - [ ] API密钥配置
  - [ ] 证书文件配置
  - [ ] Native支付接入（Web端扫码）
  - [ ] APP支付接入（移动端）
  - [ ] 支付结果通知接口

- [ ] **支付宝支付**
  - [ ] 支付宝应用配置
  - [ ] 公钥/私钥配置
  - [ ] 当面付接入（Web端扫码）
  - [ ] APP支付接入
  - [ ] 支付结果通知接口

### 9.2 支付流程

- [ ] **创建支付**
  - [ ] 生成支付订单
  - [ ] 计算支付金额（商品金额+服务费）
  - [ ] 生成支付流水号
  - [ ] 调用支付接口
  - [ ] 返回支付信息（二维码URL/支付参数）

- [ ] **支付二维码（Web端）**
  - [ ] 生成支付二维码
  - [ ] 二维码有效期设置（15分钟）
  - [ ] 二维码展示
  - [ ] 支付状态轮询
  - [ ] 二维码刷新功能
  - [ ] 支付方式切换

- [ ] **APP支付**
  - [ ] 调起支付SDK
  - [ ] 支付参数传递
  - [ ] 支付结果处理
  - [ ] 支付回调

### 9.3 支付回调处理

- [ ] **回调接口**
  - [ ] 微信支付回调接口
  - [ ] 支付宝支付回调接口
  - [ ] 签名验证
  - [ ] 防重复处理

- [ ] **订单状态更新**
  - [ ] 支付成功：更新订单状态为"待确认"
  - [ ] 记录支付信息（支付时间、交易号）
  - [ ] 触发订单通知推送

### 9.4 退款处理

- [ ] **退款接口**
  - [ ] 微信退款接口调用
  - [ ] 支付宝退款接口调用
  - [ ] 退款金额计算（含服务费）
  - [ ] 退款流水记录

- [ ] **退款场景**
  - [ ] 订单取消退款
  - [ ] 部分退款（可选）
  - [ ] 退款状态跟踪

### 9.5 对账与统计

- [ ] **支付记录**
  - [ ] 支付记录列表
  - [ ] 支付状态查询
  - [ ] 支付明细导出

- [ ] **对账功能**
  - [ ] 每日对账报表
  - [ ] 异常交易检测
  - [ ] 对账差异处理

---

## 10. 部署与运维

### 10.1 服务器部署

- [ ] **服务器环境准备**
  - [ ] 服务器选型（阿里云/腾讯云）
  - [ ] 操作系统配置（Linux）
  - [ ] Node.js/Java/Python环境安装
  - [ ] Nginx配置
  - [ ] SSL证书配置

- [ ] **数据库部署**
  - [ ] MySQL/PostgreSQL安装配置
  - [ ] 数据库创建
  - [ ] 用户权限配置
  - [ ] 数据库备份策略

- [ ] **Redis部署**
  - [ ] Redis安装配置
  - [ ] 持久化配置
  - [ ] 密码设置

- [ ] **文件存储**
  - [ ] OSS/COS配置
  - [ ] 存储桶创建
  - [ ] 访问权限配置
  - [ ] CDN配置（可选）

### 10.2 应用部署

- [ ] **后端部署**
  - [ ] 代码部署
  - [ ] 环境变量配置
  - [ ] PM2进程管理（Node.js）
  - [ ] 应用启动脚本
  - [ ] 健康检查接口

- [ ] **前端部署**
  - [ ] 前端构建
  - [ ] 静态资源部署
  - [ ] Nginx配置
  - [ ] Gzip压缩
  - [ ] 缓存策略

- [ ] **移动端发布**
  - [ ] Android APK构建
  - [ ] APK签名
  - [ ] 下载页面搭建
  - [ ] 二维码生成
  - [ ] 版本管理

### 10.3 CI/CD自动化

- [ ] **持续集成**
  - [ ] Git仓库配置
  - [ ] GitHub Actions/GitLab CI配置
  - [ ] 自动化测试
  - [ ] 代码质量检查

- [ ] **持续部署**
  - [ ] 自动化部署脚本
  - [ ] 部署触发条件
  - [ ] 回滚机制
  - [ ] 部署通知

### 10.4 监控与告警

- [ ] **应用监控**
  - [ ] 应用性能监控（APM）
  - [ ] 错误日志收集
  - [ ] API响应时间监控
  - [ ] 接口调用统计

- [ ] **服务器监控**
  - [ ] CPU/内存/磁盘监控
  - [ ] 网络流量监控
  - [ ] 进程监控

- [ ] **告警配置**
  - [ ] 告警规则设置
  - [ ] 告警通知（邮件/短信/企微）
  - [ ] 告警级别划分

### 10.5 安全防护

- [ ] **网络安全**
  - [ ] 防火墙配置
  - [ ] DDoS防护
  - [ ] WAF配置

- [ ] **数据安全**
  - [ ] 数据库定期备份
  - [ ] 备份加密存储
  - [ ] 异地备份

- [ ] **应用安全**
  - [ ] HTTPS强制
  - [ ] 敏感信息加密
  - [ ] 安全漏洞扫描

### 10.6 日志管理

- [ ] **日志收集**
  - [ ] 应用日志收集
  - [ ] 访问日志收集
  - [ ] 错误日志收集

- [ ] **日志存储**
  - [ ] 日志文件轮转
  - [ ] 日志压缩存储
  - [ ] 日志保留策略

- [ ] **日志分析**
  - [ ] 日志查询工具
  - [ ] 日志可视化（ELK/Grafana）

---

## 11. 测试计划

> **说明**：测试工作贯穿整个开发周期
> **负责人**：测试工程师/全体开发  
> **验收标准**：核心功能测试覆盖率>80%，无P0/P1级Bug

### 11.1 单元测试

- [ ] 🔴 **后端单元测试**
  - [ ] Service层测试
    - 用户认证Service测试
    - 订单Service测试（创建、取消、状态流转）
    - 加价计算Service测试
    - 支付Service测试
  - [ ] 工具函数测试
    - 金额计算函数测试（边界值、精度）
    - 日期处理函数测试
    - 加密函数测试
  - [ ] 测试框架：Jest
  - [ ] 目标覆盖率：>80%
  - [ ] 配置测试覆盖率报告

- [ ] 🟠 **前端单元测试**
  - [ ] 组件测试（Vue Test Utils）
    - 表单组件测试
    - 业务组件测试
  - [ ] Store测试（Pinia）
  - [ ] 工具函数测试
  - [ ] 测试框架：Vitest
  - [ ] 目标覆盖率：>60%

### 11.2 接口测试

- [ ] 🔴 **API接口测试**
  - [ ] 编写Postman/Insomnia测试集合
  - [ ] 认证接口测试
    - 登录成功/失败场景
    - Token刷新测试
    - 权限校验测试
  - [ ] 订单接口测试
    - 创建订单（正常/异常场景）
    - 订单状态流转测试
    - 取消订单测试
  - [ ] 支付接口测试
    - 支付创建测试
    - 回调处理测试（Mock）
  - [ ] 导出API测试文档

### 11.3 集成测试

- [ ] 🟠 **业务流程集成测试**
  - [ ] 完整订货流程测试
    - 浏览物料→加入购物车→结算→支付→订单确认→配送→完成
  - [ ] 订单取消流程测试
    - 1小时内自主取消
    - 超时取消申请→审批
  - [ ] 加价规则测试
    - 多规则优先级匹配
    - 各级开关控制
  - [ ] Webhook推送测试
    - 推送成功场景
    - 推送失败重试

### 11.4 E2E测试

- [ ] 🟡 **端到端自动化测试**
  - [ ] 测试框架选择：Playwright / Cypress
  - [ ] 门店端核心流程测试
    - 登录→订货→支付→查看订单
  - [ ] 供应商端核心流程测试
    - 登录→查看订单→确认→配送
  - [ ] 管理员端核心流程测试
    - 登录→订单管理→数据报表
  - [ ] 配置CI自动运行E2E测试

### 11.5 性能测试

- [ ] 🟡 **压力测试**
  - [ ] 测试工具：k6 / JMeter
  - [ ] 接口压测场景
    - 物料列表查询（100并发）
    - 订单创建（50并发）
    - 订单列表查询（100并发）
  - [ ] 目标指标
    - 平均响应时间 < 200ms
    - P99响应时间 < 1s
    - 错误率 < 0.1%
  - [ ] 输出压测报告

### 11.6 安全测试

- [ ] 🟠 **安全漏洞扫描**
  - [ ] SQL注入测试
  - [ ] XSS攻击测试
  - [ ] CSRF测试
  - [ ] 越权访问测试
  - [ ] 敏感信息泄露检查
  - [ ] 使用工具：OWASP ZAP / Burp Suite

---

## 12. 性能优化

> **负责人**：后端开发/前端开发  
> **执行时机**：开发中期及上线前

### 12.1 后端性能优化

- [ ] 🟠 **数据库优化**
  - [ ] SQL慢查询分析与优化
  - [ ] 索引优化（根据实际查询场景）
  - [ ] 查询结果分页优化（避免深分页）
  - [ ] 大表分区策略（订单表按月分区）
  - [ ] 读写分离配置（如需）

- [ ] 🟠 **缓存优化**
  - [ ] 热点数据缓存
    - 物料分类列表缓存（TTL: 1小时）
    - 供应商配送区域缓存
    - 系统配置缓存
  - [ ] 查询结果缓存
    - 物料列表查询缓存
    - 门店可用供应商列表缓存
  - [ ] 缓存更新策略
    - 数据变更时主动失效
    - 定时刷新兜底

- [ ] 🟡 **接口优化**
  - [ ] N+1查询问题排查与修复
  - [ ] 批量接口优化
  - [ ] 响应数据精简（按需返回字段）
  - [ ] 接口合并（减少请求次数）

### 12.2 前端性能优化

- [ ] 🟠 **加载性能优化**
  - [ ] 路由懒加载
  - [ ] 组件懒加载
  - [ ] 图片懒加载
  - [ ] 代码分割（Code Splitting）
  - [ ] Tree Shaking配置
  - [ ] 第三方库按需引入

- [ ] 🟠 **渲染性能优化**
  - [ ] 虚拟列表（长列表优化）
  - [ ] 防抖/节流处理
  - [ ] 避免不必要的重渲染
  - [ ] 大数据表格分页加载

- [ ] 🟡 **资源优化**
  - [ ] 图片压缩与WebP格式
  - [ ] 静态资源CDN部署
  - [ ] Gzip/Brotli压缩
  - [ ] HTTP缓存策略配置
  - [ ] 预加载关键资源

### 12.3 移动端性能优化

- [ ] 🟠 **APP性能优化**
  - [ ] 启动速度优化
  - [ ] 页面切换流畅度
  - [ ] 图片加载优化
  - [ ] 内存占用优化
  - [ ] 包体积优化

---

## 13. 扩展功能（后续迭代）

> **优先级**：P3  
> **执行时机**：核心功能稳定后

### 13.1 用户体验增强

- [ ] 🟢 **物料收藏功能**
  - [ ] 收藏/取消收藏接口
  - [ ] 收藏列表页面
  - [ ] 快捷加入购物车

- [ ] 🟢 **常购清单功能**
  - [ ] 基于历史订单自动生成
  - [ ] 手动创建清单
  - [ ] 一键复购

- [ ] 🟢 **供应商评价功能**
  - [ ] 订单完成后评价
  - [ ] 评分+文字评价
  - [ ] 评价展示

- [ ] 🟢 **价格变动通知**
  - [ ] 关注物料价格变动
  - [ ] 价格下降通知
  - [ ] 推送/站内信通知

### 13.2 业务功能扩展

- [ ] 🟢 **对账单生成**
  - [ ] 按月生成对账单
  - [ ] 对账单PDF导出
  - [ ] 对账单确认流程

- [ ] 🟢 **更多数据分析报表**
  - [ ] 采购成本分析
  - [ ] 供应商质量分析
  - [ ] 价格趋势分析

- [ ] 🟢 **多门店管理（连锁）**
  - [ ] 门店分组管理
  - [ ] 总部统一采购
  - [ ] 分店数据汇总

### 13.3 多端扩展

- [ ] 🟢 **iOS版本发布**
  - [ ] iOS适配测试
  - [ ] App Store上架准备
  - [ ] 审核资料准备

- [ ] 🟢 **小程序版本**
  - [ ] 微信小程序适配
  - [ ] 小程序审核上架

---

## 14. 项目里程碑

### 里程碑总览

| 阶段 | 里程碑 | 预计工期 | 主要产出 |
|------|--------|----------|----------|
| M1 | 项目启动与基础架构 | 2周 | 开发环境、项目骨架、数据库设计 |
| M2 | 核心功能开发-后端 | 3周 | 认证系统、订单系统、支付系统API |
| M3 | 核心功能开发-前端 | 3周 | 三端Web后台基础功能 |
| M4 | 移动端开发 | 2周 | 门店端/供应商端APP |
| M5 | 集成与联调 | 1.5周 | 全流程联调、Bug修复 |
| M6 | 测试与优化 | 1.5周 | 测试用例执行、性能优化 |
| M7 | 部署上线 | 1周 | 生产环境部署、上线发布 |

### M1: 项目启动与基础架构（第1-2周）

- [ ] **Week 1**
  - [ ] 技术选型确认
  - [ ] 开发环境搭建
  - [ ] Monorepo项目初始化
  - [ ] 数据库设计评审

- [ ] **Week 2**
  - [ ] 数据库表创建与迁移
  - [ ] 共享包开发（types/utils/constants）
  - [ ] 基础组件开发启动
  - [ ] API文档框架搭建

- [ ] **M1交付物**
  - [ ] 可运行的项目骨架
  - [ ] 数据库迁移脚本
  - [ ] 开发环境文档

### M2: 核心功能开发-后端（第3-5周）

- [ ] **Week 3**
  - [ ] 用户认证模块完成
  - [ ] 权限管理模块完成
  - [ ] 门店/供应商基础CRUD

- [ ] **Week 4**
  - [ ] 物料管理模块完成
  - [ ] 购物车功能完成
  - [ ] 订单创建功能完成

- [ ] **Week 5**
  - [ ] 订单状态管理完成
  - [ ] 支付接口对接
  - [ ] Webhook推送功能完成

- [ ] **M2交付物**
  - [ ] 完整的后端API
  - [ ] API文档（Swagger）
  - [ ] 单元测试报告

### M3: 核心功能开发-前端（第6-8周）

- [ ] **Week 6**
  - [ ] 门店端Web：登录、首页、物料浏览
  - [ ] 供应商端Web：登录、首页
  - [ ] 管理员端Web：登录、首页

- [ ] **Week 7**
  - [ ] 门店端Web：购物车、结算、订单管理
  - [ ] 供应商端Web：订单管理、物料价格管理
  - [ ] 管理员端Web：订单管理、供应商管理

- [ ] **Week 8**
  - [ ] 门店端Web：统计分析、账户设置
  - [ ] 供应商端Web：配送设置、统计
  - [ ] 管理员端Web：加价管理、系统设置

- [ ] **M3交付物**
  - [ ] 三端Web后台可用版本
  - [ ] 前端组件文档

### M4: 移动端开发（第9-10周）

- [ ] **Week 9**
  - [ ] 门店端APP：首页、物料浏览、购物车
  - [ ] 供应商端APP：首页、订单列表

- [ ] **Week 10**
  - [ ] 门店端APP：订单管理、支付、我的
  - [ ] 供应商端APP：订单操作、物料价格、我的

- [ ] **M4交付物**
  - [ ] 门店端APP（Android）
  - [ ] 供应商端APP（Android）

### M5: 集成与联调（第11周-第12周中）

- [ ] **Week 11**
  - [ ] 前后端联调
  - [ ] 支付流程联调
  - [ ] Webhook推送联调
  - [ ] Bug修复

- [ ] **Week 12前半**
  - [ ] 全流程走通测试
  - [ ] 边界场景测试
  - [ ] Bug修复

- [ ] **M5交付物**
  - [ ] 联调通过的完整系统
  - [ ] Bug修复记录

### M6: 测试与优化（第12周中-第13周）

- [ ] **Week 12后半**
  - [ ] 功能测试执行
  - [ ] 接口测试执行
  - [ ] 安全测试

- [ ] **Week 13**
  - [ ] 性能测试与优化
  - [ ] E2E测试
  - [ ] 最终Bug修复

- [ ] **M6交付物**
  - [ ] 测试报告
  - [ ] 性能测试报告
  - [ ] 优化后的系统

### M7: 部署上线（第14周）

- [ ] **Week 14**
  - [ ] 生产环境准备
  - [ ] 数据初始化
  - [ ] 灰度发布
  - [ ] 正式上线
  - [ ] 上线监控

- [ ] **M7交付物**
  - [ ] 生产环境部署
  - [ ] 运维文档
  - [ ] 用户使用手册

---

## 15. 附录

### A. 技术规范文档清单

- [ ] 《技术选型报告》
- [ ] 《开发环境搭建指南》
- [ ] 《代码规范文档》
- [ ] 《Git工作流规范》
- [ ] 《API设计规范》
- [ ] 《数据库设计文档》

### B. 接口文档

- [ ] Swagger/OpenAPI文档
- [ ] Postman Collection

### C. 部署文档

- [ ] 《服务器部署手册》
- [ ] 《CI/CD配置文档》
- [ ] 《监控告警配置文档》

### D. 用户文档

- [ ] 《门店端使用手册》
- [ ] 《供应商端使用手册》
- [ ] 《管理员端使用手册》

---

> **文档说明**：本开发文档根据供应链系统设计文档和原型文件生成，涵盖了系统开发的所有主要功能点。开发过程中请根据实际情况调整任务优先级和实现细节。
>
> **版本历史**：
> - v1.0 - 初始版本
> - v1.1 - 添加详细技术规格、测试计划、性能优化、项目里程碑
> - v1.2 - 增加shadcn/ui组件库集成要求，所有Web前端开发必须使用shadcn/ui实现
