# 供应链订货系统 - 开发文档

> 本文档为项目开发的详细TodoList，涵盖所有功能模块的开发任务

## 文档说明

### 任务状态
- [ ] 待开始
- [X] 已完成
- [~] 进行中

## 目录

1. [项目初始化与基础架构](#1-项目初始化与基础架构)
   - 1.1 [技术选型与环境搭建](#11-技术选型与环境搭建)
   - 1.2 [项目结构初始化](#12-项目结构初始化)
   - 1.3 [共享模块开发](#13-共享模块开发)
   - 1.4 [Ant Design 组件库集成](#14-ant-design-组件库集成)
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

- [X] 🔴 **选择技术栈**
  - [X] 移动端APP框架选型：Taro + React
    - 考量因素：跨平台能力、开发效率、团队技术栈、性能要求
    - **推荐**：Taro（基于React，可同时输出H5/小程序/APP，与Web端技术栈统一）
  - [X] Web前端框架选型：Next.js 16 + React + Ant Design
    - 考量因素：组件丰富度、文档完整性、社区活跃度、SSR能力
    - **推荐**：Next.js 16 + React + Ant Design（成熟的企业级组件库，功能完整，生态丰富）
  - [X] 后端框架选型：Golang (Echo)
    - 考量因素：开发效率、运维成本、团队熟悉度、生态系统、高并发性能
    - **选定**：Echo（高性能、中间件丰富、路由灵活、自动TLS支持）
  - [X] 数据库选型：MySQL 8.0
    - 考量因素：数据一致性、JSON支持、全文搜索能力
    - **选定**：MySQL 8.0（成熟稳定，运维成本低）
  - [X] 缓存选型：Redis 7.x
    - 用途：会话管理、接口缓存、限流计数、消息队列
  - [X] 文件存储选型：阿里云OSS / 腾讯云COS / MinIO（私有化）
    - 考量因素：成本、CDN集成、私有化需求
  - [X] 编写《技术选型报告》文档

- [X] 🔴 **开发环境配置**
  - [X] 配置Go 1.21+ 开发环境（后端）
  - [X] 配置Node.js 18+ LTS开发环境（前端）
  - [X] 配置pnpm 8.x 包管理工具（monorepo支持更好）
  - [X] 配置ESLint + Prettier代码规范（前端）
    - ESLint规则：@typescript-eslint/recommended
  - [X] 配置golangci-lint代码规范（后端）
    - Prettier配置：统一缩进、分号、引号规则
  - [X] 配置Git工作流
    - 分支策略：main/develop/feature/hotfix
    - commit规范：Conventional Commits（feat/fix/docs/style/refactor）
    - 配置husky + lint-staged 提交前检查
    - 配置commitlint 提交信息校验
  - [X] 配置TypeScript 5.x 严格模式
  - [X] 配置VSCode推荐插件列表（.vscode/extensions.json）
  - [X] 配置EditorConfig统一编辑器设置
  - [X] 编写《开发环境搭建指南》文档

### 1.2 项目结构初始化

- [X] 🔴 **Monorepo结构搭建**
  - [X] 初始化pnpm-workspace.yaml

  ```yaml
    packages:
      - 'apps/*'
      - 'packages/*'
  ```
  - [X] 配置turbo.json构建配置
    - 定义build/dev/lint/test管道
    - 配置缓存策略
    - 配置依赖关系
  - [X] 创建apps目录结构
    ```
    apps/
    ├── web/            # 统一Web后台（管理员/供应商/门店）
    ├── backend/        # 后端API服务（Go）
    └── mobile/         # 移动端APP（Taro）
    ```
  - [X] 创建packages目录结构
    ```
    packages/
    ├── utils/          # 共享工具函数
    ├── constants/      # 共享常量
    ├── ui/             # 共享UI组件
    └── api-client/     # API客户端封装
    ```
  - [X] 配置根目录package.json scripts
  - [X] 配置.npmrc（registry、hoist设置）

- [X] 🔴 **Web前端项目初始化**
  - [X] 创建统一Web后台项目（web）
    - 使用Next.js 16 + React + TypeScript模板
    - 集成Ant Design组件库（所有UI组件必须使用Ant Design实现）
    - 项目支持管理员、供应商、门店三种角色
    - 通过用户权限动态显示不同功能模块和界面
  - [~] 配置React Router路由系统
    - 路由懒加载配置
    - 路由守卫配置（基于用户角色和权限）
    - 路由元信息定义（权限、标题）
    - 动态路由生成（根据用户角色）
    - 多角色动态界面切换（管理员/供应商/门店使用同一套代码）
    - 根据用户角色显示不同功能模块
  - [X] 配置Redux Toolkit状态管理
    - 用户状态模块（角色、权限）
    - 购物车状态模块
    - 系统配置状态模块
    - 持久化配置（redux-persist）
  - [X] 配置axios HTTP请求封装
    - 请求/响应拦截器
    - 统一错误处理
    - Token自动刷新
    - 请求重试机制
    - 接口loading状态管理
  - [X] 配置Ant Design组件库
    - **重要**：所有Web前端项目必须统一使用Ant Design组件库实现UI界面
    - 禁止混用其他UI框架（如Element Plus、shadcn/ui等）
    - 所有自定义组件必须基于Ant Design进行封装扩展
    - 配置Ant Design主题定制
  - [X] 配置环境变量（.env.development/.env.production）
  - [X] 配置代理解决开发环境跨域

- [X] 🔴 **后端项目初始化**

  - [X] 创建Golang项目（backend）

  ```bash
  go mod init github.com/project/backend
  ```
  - [X] 选择Web框架（Echo）
  - [X] 配置GORM数据库连接
    - 数据源配置
    - 实体自动加载
    - 迁移文件管理
    - 连接池配置（min: 5, max: 20）
  - [X] 配置Redis连接（go-redis）
    - 连接池配置
    - 集群模式支持（可选）
    - 缓存模块封装
  - [X] 配置日志系统（zap/logrus）
    - 日志级别配置
    - 日志格式化（JSON格式）
    - 日志文件轮转
    - 请求日志中间件
  - [X] 配置Viper环境变量管理
    - 配置文件加载（YAML/JSON）
    - 环境变量覆盖
    - 多环境配置
  - [X] 配置Swagger API文档（swaggo/echo-swagger）
    - API分组（按模块）
    - 请求/响应示例
    - 认证配置
  - [X] 配置全局异常处理中间件（Echo内置）
  - [X] 配置请求验证（Echo内置Validator + go-playground/validator）
  - [X] 配置响应统一格式中间件
  - [X] 配置跨域中间件（echo.middleware.CORS）
  - [X] 配置安全头中间件（echo.middleware.Secure）
  - [X] 配置速率限制中间件（echo.middleware.RateLimiter）

- [X] 🔴 **移动端项目初始化**
  - [X] 创建Taro项目（React + TypeScript）
    ```bash
    npm init @tarojs/app mobile
    # 选择React + TypeScript模板
    ```
  - [X] 配置多端编译
    - H5端配置
    - React Native端配置（APP）
    - 微信小程序配置（可选）
  - [X] 配置路由系统
    - app.config.ts配置
    - TabBar配置（区分用户角色）
    - 页面路径配置
    - 权限路由守卫
    - 多角色动态TabBar生成
      - 门店用户TabBar：首页/行情/购物车/订单/我的
      - 供应商TabBar：首页/订单/价格/我的
      - 管理员TabBar：首页/订单/门店/供应商/我的
  - [X] 配置Redux Toolkit状态管理
    - 用户状态模块（角色、权限）
    - 购物车状态模块
    - 系统配置状态模块
  - [X] 配置Taro.request请求封装
    - 统一请求头
    - Token管理
    - 错误处理
    - loading状态
  - [X] 配置Taro UI组件库
  - [X] 配置自定义导航栏组件
  - [X] 配置应用图标和启动图
  - [X] 配置app.config.ts应用配置
  - [X] **重要**：APP内通过用户角色权限动态显示不同功能模块
    - 门店用户：显示订货、购物车、订单等功能
    - 供应商用户：显示订单管理、物料价格等功能
    - 管理员用户：显示数据监控、系统管理等功能
  - [X] **角色识别与UI切换机制**
    - 登录后获取用户角色信息
    - 单角色用户：直接进入对应界面
    - 多角色用户：显示角色选择页面
    - 角色切换后刷新TabBar和功能模块
    - 保存当前选中角色到本地存储

### 1.3 共享模块开发

- [X] 🔴 **后端类型定义（Go结构体）**
  - [X] 定义基础类型（在backend项目内）
    ```typescript
    // 分页请求/响应
    interface PaginationQuery { page: number; pageSize: number; }
    interface PaginatedResponse<T> { items: T[]; total: number; page: number; pageSize: number; }
    // API响应包装
    interface ApiResponse<T> { code: number; message: string; data: T; timestamp: number; }
    ```
  - [X] 定义用户相关类型
    - User（基础用户信息）
    - Admin（管理员，含权限列表）
    - Store（门店，含地址信息）
    - Supplier（供应商，含配送设置）
    - UserRole枚举（admin/sub_admin/supplier/store）
    - LoginRequest/LoginResponse
    - TokenPayload（JWT载荷）
  - [X] 定义订单相关类型
    - Order（订单主表）
    - OrderItem（订单明细）
    - OrderStatus枚举（pending_payment/pending_confirm/confirmed/delivering/completed/cancelled）
    - PaymentStatus枚举（unpaid/paid/refunded）
    - OrderCancelRequest（取消申请）
    - CreateOrderRequest/UpdateOrderRequest
  - [X] 定义物料相关类型
    - Category（分类，支持树形结构）
    - Material（物料基础信息）
    - MaterialSku（物料SKU）
    - SupplierMaterial（供应商物料报价）
    - StockStatus枚举（in_stock/out_of_stock）
  - [X] 定义配置相关类型
    - SystemConfig（系统配置）
    - PriceMarkup（加价规则）
    - MarkupType枚举（fixed/percent）
    - DeliveryArea（配送区域）
    - DeliveryMode枚举（self_delivery/express_delivery）
  - [X] 定义Webhook相关类型
    - WebhookEvent枚举
    - WebhookPayload
    - WebhookLog
  - [X] 编写类型单元测试

- [X] 🔴 **共享工具包（@project/utils）**
  > **说明**：前后端分别实现，前端使用TypeScript，后端使用Go
  - [X] 日期处理工具函数（基于dayjs）
    - formatDate(date, format) - 格式化日期
    - parseDate(dateStr) - 解析日期字符串
    - getDateRange(type: 'today'|'week'|'month') - 获取日期范围
    - isDeliveryDay(date, deliveryDays[]) - 判断是否配送日
    - getNextDeliveryDate(deliveryDays[]) - 获取下一个配送日
  - [X] 金额计算工具函数（基于decimal.js，避免浮点精度问题）
    - add(a, b) - 精确加法
    - subtract(a, b) - 精确减法
    - multiply(a, b) - 精确乘法
    - divide(a, b) - 精确除法
    - formatMoney(amount, options) - 金额格式化（¥1,234.56）
    - calculateMarkup(price, rule) - 计算加价
    - calculateServiceFee(amount, rate) - 计算服务费
  - [X] 字符串处理工具函数
    - maskPhone(phone) - 手机号脱敏（138****8888）
    - maskIdCard(idCard) - 身份证脱敏
    - truncate(str, length) - 字符串截断
    - generateOrderNo() - 生成订单编号（时间戳+随机数）
    - generateRandomCode(length) - 生成随机码
  - [X] 验证工具函数
    - isValidPhone(phone) - 手机号验证
    - isValidEmail(email) - 邮箱验证
    - isValidPassword(password) - 密码强度验证
    - isValidIdCard(idCard) - 身份证验证
  - [X] 加密工具函数
    - hashPassword(password) - 密码哈希（PBKDF2）
    - verifyPassword(password, hash) - 密码验证
    - generateHmacSignature(payload, secret) - HMAC签名
    - encrypt/decrypt(data, key) - AES-256-GCM加解密
  - [X] 其他工具函数
    - sleep(ms) - 延时函数
    - retry(fn, times, delay) - 重试函数
    - debounce/throttle - 防抖/节流
    - deepClone(obj) - 深拷贝
    - omit/pick(obj, keys) - 对象属性操作
    - [X] 编写工具函数单元测试（覆盖率>90%）

- [X] 🔴 **共享常量包（@project/constants）**
  - [X] 订单状态常量
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
  - [X] 用户角色常量
  - [X] 权限模块常量（含权限码和描述）
  - [X] 配送模式常量
  - [X] 支付方式常量
  - [X] 审核状态常量
  - [X] 错误码常量（统一错误码定义）
  - [X] 正则表达式常量（手机、邮箱等）
  - [X] 系统配置键常量

### 1.4 Ant Design 组件库集成

> **重要说明**：所有Web前端开发必须使用Ant Design组件库实现UI界面

- [X] 🔴 **Ant Design 环境配置**
  - [X] 安装Ant Design核心依赖
    ```bash
    # 安装Ant Design
    pnpm add antd
    # 安装图标库
    pnpm add @ant-design/icons
    # 安装样式处理相关
    pnpm add @ant-design/cssinjs
    ```
  - [X] 配置Ant Design主题
    - 配置ConfigProvider
    - 设置主题token
    - 自定义主题色彩
  - [X] 配置国际化
    - 引入中文语言包
    - 配置日期组件locale
  - [X] 配置按需加载（优化打包体积）
  - [X] 创建全局样式文件（assets/css/antd-custom.css）

- [X] 🔴 **Ant Design 组件使用规范**
  - [X] 所有UI组件必须使用Ant Design提供的组件
    - Button（按钮）
    - Input（输入框）
    - Select（选择器）
    - Table（表格）
    - Modal（对话框）
    - Form（表单）
  - [X] 组件样式定制通过ConfigProvider和自定义CSS实现
  - [X] 禁止使用其他UI框架的组件，避免样式冲突
  - [X] 特殊业务组件基于Ant Design组件进行封装扩展

- [X] 🟠 **Ant Design 常用组件集成**
  - [X] 集成基础组件
    - Button（按钮）
    - Input（输入框）
    - InputNumber（数字输入框）
    - Select（选择器）
    - Checkbox（复选框）
    - Radio（单选框）
    - Switch（开关）
    - DatePicker（日期选择器）
  - [X] 集成导航组件
    - Menu（导航菜单）
    - Breadcrumb（面包屑）
    - Tabs（标签页）
    - Pagination（分页）
    - Steps（步骤条）
  - [X] 集成反馈组件
    - Alert（提示框）
    - Modal（对话框）
    - Message（全局提示）
    - Notification（通知框）
    - Popconfirm（确认框）
    - Drawer（抽屉）
  - [X] 集成数据展示组件
    - Table（表格）
    - Card（卡片）
    - Badge（徽章）
    - Avatar（头像）
    - Progress（进度条）
    - List（列表）
    - Tree（树形控件）
  - [X] 集成表单组件
    - Form（表单）
    - Form.Item（表单项）
    - Upload（上传）
    - Transfer（穿梭框）
    - Cascader（级联选择）

- [X] 🟡 **Ant Design 主题定制**
  - [X] 配置主题算法（紧凑/默认）
  - [X] 自定义品牌主色
  - [X] 配置组件默认样式
  - [X] 创建主题切换功能（亮色/暗色）

### 1.5 基础组件开发

- [X] 🟠 **共享UI组件库（@project/ui）**
  > **注意**：所有共享组件必须基于Ant Design进行封装扩展
  - [X] 统一按钮组件（SButton）
    - 基于Ant Design的Button组件封装
    - Props：type/size/loading/disabled/icon
    - 支持主题色配置
    - 防重复点击（内置debounce）
  - [X] 表单组件增强
    - SInput（基于Ant Design Input，支持前后缀、清空、字数统计）
    - SSelect（基于Ant Design Select，支持远程搜索、多选、分组）
    - SDatePicker（基于Ant Design DatePicker，支持范围选择、快捷选项）
    - SNumberInput（基于Ant Design InputNumber，支持步进、千分位显示）
    - SForm（基于Ant Design Form，统一表单校验、提交状态管理）
  - [X] 表格组件（STable）
    - 基于Ant Design Table组件封装
    - 列配置化
    - 内置分页
    - 排序支持
    - 行选择
    - 自定义单元格渲染
    - 表头固定
    - 列宽调整
    - 数据导出
  - [X] 弹窗组件
    - SModal（基于Ant Design Modal，支持拖拽、全屏）
    - SDrawer（基于Ant Design Drawer，支持多层级）
    - SConfirm（基于Ant Design Modal.confirm，确认对话框）
  - [X] 消息提示组件
    - SToast（基于Ant Design message，轻提示）
    - SNotification（基于Ant Design notification，通知）
    - SMessage（基于Ant Design Alert，全局消息）
  - [X] 加载状态组件
    - SLoading（基于Ant Design Spin，全局/局部loading）
    - SSkeleton（基于Ant Design Skeleton，骨架屏）
    - SSpinner（基于Ant Design Spin，加载动画）
  - [X] 空状态组件（SEmpty）
    - 基于Ant Design Empty组件
    - 支持自定义图标和文案
    - 内置常见空状态（无数据、无搜索结果、网络错误）
  - [X] 图片上传组件（SImageUpload）
    - 基于Ant Design Upload组件
    - 支持裁剪
    - 支持压缩
    - 支持多图上传
    - 图片预览
    - 上传进度显示
    - 格式/大小限制
  - [X] 文件上传组件（SFileUpload）
    - 基于Ant Design Upload组件
    - 支持拖拽上传
    - 文件类型限制
    - 文件大小限制
    - 上传进度显示
  - [ ] 编写组件文档（Storybook）
  - [ ] 编写组件单元测试

- [X] 🟠 **业务组件**
  - [X] 订单状态标签组件（OrderStatusTag）
    - 不同状态不同颜色
    - 支持显示状态图标
    - 支持点击查看状态流转
  - [X] 价格显示组件（PriceDisplay）
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
  - [X] 数据统计卡片组件（StatCard）
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
  - [X] 搜索筛选栏组件（SearchBar）
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
> **ORM**：GORM  
> **验收标准**：所有表结构创建完成，数据库迁移可正常执行，索引优化到位

### 2.1 用户与认证模块

- [X] 🔴 **用户表（User）**
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
  - [X] 编写GORM Model
  - [X] 编写数据库迁移
  - [ ] 编写Seed数据（默认管理员）

- [X] 🔴 **管理员表（Admin）**
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
  - [X] 编写GORM Model（含User关联）
  - [X] 编写数据库迁移

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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

### 2.2 门店模块

- [X] 🔴 **门店表（Store）**
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

### 2.3 供应商模块

- [X] 🔴 **供应商表（Supplier）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] user_id - BIGINT, 关联用户ID, FK(User.id)
  - [ ] supplier_no - VARCHAR(20), 供应商编号, UNIQUE
  - [ ] name - VARCHAR(100), 供应商真实名称, NOT NULL
  - [ ] display_name - VARCHAR(100), 门店端显示名称（默认等于name，管理员可修改）
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

- [X] 🔴 **配送区域表（DeliveryArea）**
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

### 2.4 物料模块

- [X] 🔴 **物料分类表（Category）**
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
  - [ ] 编写GORM Model（自关联）
  - [ ] 编写数据库迁移
  - [ ] 编写Seed数据（默认分类）

- [X] 🔴 **物料表（Material）**
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

- [X] 🔴 **物料SKU表（MaterialSku）**
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

- [X] 🔴 **供应商物料表（SupplierMaterial）**
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

### 2.5 订单模块

> **订单状态流转说明**
> ```
> 正常流程：
> [待付款 unpaid] --支付成功--> [待确认 pending_confirm] --供应商确认--> [已确认 confirmed] --开始配送--> [配送中 delivering] --确认收货--> [已完成 completed]
> 
> 取消流程：
> [待确认 pending_confirm] --1小时内门店自主取消--> [已取消 cancelled]
> [待确认 pending_confirm] --超1小时申请取消-->管理员审批--> [已取消 cancelled]
> [已确认 confirmed] --管理员取消--> [已取消 cancelled]
> 
> 恢复流程：
> [已取消 cancelled] --供应商拒绝取消/管理员恢复--> [待付款 unpaid] --门店重新付款--> [待确认 pending_confirm]
> ```

| 状态码 | 状态名称 | 说明 | 可执行操作 |
|--------|----------|------|------------|
| unpaid | 待付款 | 订单恢复后等待门店重新付款 | 支付、取消 |
| pending_confirm | 待确认 | 门店已付款，等待供应商确认 | 确认、取消(1h内)、申请取消 |
| confirmed | 已确认 | 供应商已确认订单 | 开始配送、管理员取消 |
| delivering | 配送中 | 订单正在配送 | 完成 |
| completed | 已完成 | 订单已完成 | 无 |
| cancelled | 已取消 | 订单已取消 | 恢复(管理员) |

- [X] 🔴 **订单表（Order）**
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
  - [ ] 编写GORM Model（含关联）
  - [ ] 编写数据库迁移

- [X] 🔴 **订单明细表（OrderItem）**
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

### 2.6 支付模块

- [X] 🔴 **支付记录表（PaymentRecord）**
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
  - [X] 编写GORM Model
  - [ ] 编写数据库迁移

### 2.7 加价模块

- [X] 🔴 **加价规则表（PriceMarkup）**
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

- [X] 🔴 **系统配置表（SystemConfig）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] config_key - VARCHAR(100), 配置键, UNIQUE, NOT NULL
  - [ ] config_value - TEXT, 配置值
  - [ ] config_type - ENUM('string','number','boolean','json'), 配置类型
  - [ ] description - VARCHAR(500), 配置说明
  - [ ] is_sensitive - TINYINT(1), 是否敏感配置, DEFAULT 0
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - uk_config_key (config_key) - 唯一键
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移
  - [ ] 初始化默认配置
    - order_cancel_threshold: 1小时（自主取消时间阈值）
    - payment_timeout: 15分钟（支付超时时间）
    - service_fee_rate: 0.003（服务费费率）
    - webhook_retry_times: 3（Webhook重试次数）
    - webhook_retry_interval: 5（重试间隔分钟）
- [X] 🟠 **Webhook推送日志表（WebhookLog）**
  - [ ] id - BIGINT, 主键, 自增
  - [ ] target_type - ENUM('store','supplier'), 推送目标类型
  - [ ] target_id - BIGINT, 门店ID或供应商ID
  - [ ] event_type - ENUM('order.created','order.confirmed','order.delivering','order.completed','order.cancelled','order.restored'), 事件类型
  - [ ] order_id - BIGINT, 关联订单ID, FK(Order.id)
  - [ ] webhook_url - VARCHAR(500), 推送地址
  - [ ] request_headers - JSON, 请求头
  - [ ] request_body - JSON, 请求内容
  - [ ] response_code - INT, HTTP响应状态码
  - [ ] response_body - TEXT, 响应内容
  - [ ] status - ENUM('pending','success','failed'), 推送状态, DEFAULT 'pending'
  - [ ] retry_count - INT, 已重试次数, DEFAULT 0
  - [ ] max_retry_count - INT, 最大重试次数, DEFAULT 3
  - [ ] next_retry_at - DATETIME, 下次重试时间
  - [ ] error_msg - VARCHAR(500), 错误信息
  - [ ] duration_ms - INT, 请求耗时(毫秒)
  - [ ] created_at - DATETIME
  - [ ] updated_at - DATETIME
  - [ ] **索引设计**
    - idx_target (target_type, target_id) - 目标查询
    - idx_order_id (order_id) - 订单推送记录
    - idx_status (status) - 待重试列表
    - idx_next_retry (status, next_retry_at) - 待重试任务查询
    - idx_created_at (created_at) - 日志清理
  - [X] 编写GORM Model
  - [ ] 编写数据库迁移

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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移
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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

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
  - [ ] 编写GORM Model
  - [ ] 编写数据库迁移

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

- [X] **登录功能**
  - [X] 实现账号密码登录接口 `POST /api/auth/login`
    - 请求：`{ username, password }`
    - 响应：`{ accessToken, refreshToken, expiresIn, user }`
  - [ ] 实现手机号+验证码登录接口（可选）`POST /api/auth/login/sms`
  - [X] 实现密码加密存储（PBKDF2）
  - [X] 实现JWT Token生成
    - accessToken有效期：2小时
    - refreshToken有效期：7天
    - Payload：`{ userId, role, sessionId }`
  - [X] 实现Token刷新机制 `POST /api/auth/refresh`
    - 使用refreshToken换取新accessToken
    - refreshToken单次使用，刷新后失效
  - [ ] 实现登录状态记忆
    - “记住我”选项：refreshToken延长至30天
  - [X] 实现登录失败次数限制
    - 连续5次失败后锁定账号15分钟
    - Redis记录失败次数，Key: `login_fail:{username}`
  - [X] 实现账号锁定机制
    - 锁定期间返回剩余解锁时间
    - 管理员可手动解锁
  - [ ] 实现登录日志记录
  - [ ] 实现登录日志记录
    - 记录登录时间、IP、设备信息
  - [ ] 编写登录接口单元测试
  - [ ] 编写登录流程集成测试

- [X] 🔴 **多角色身份识别**
  - [X] 实现登录时查询用户关联的所有角色
    - 查询User表获取基础角色
    - 如果是管理员角色，查询Admin表
    - 如果是供应商角色，查询Supplier表获取供应商信息
    - 如果是门店角色，查询Store表获取门店信息
    - 一个用户可能同时拥有多个角色（如既是管理员又是供应商）
  - [X] 单角色用户处理
    - Token直接包含角色信息
    - 前端自动跳转对应界面
    - 无需显示角色选择页
  - [X] 多角色用户处理
    - 返回角色列表及对应的业务信息
    - 前端显示角色选择页面
    - 角色卡片显示（角色名称、关联业务名称）
  - [X] 实现角色选择接口 `POST /api/auth/select-role`
    - 请求：`{ role, roleId }`
      - role: 'admin'/'supplier'/'store'
      - roleId: adminId/supplierId/storeId
    - 响应：新Token（包含选定角色信息）
    - Token载荷更新为当前选中的角色
  - [X] 实现角色切换功能
    - 设置页提供角色切换入口
    - 切换时调用select-role接口
    - 更新本地存储的Token
    - 刷新界面和功能模块
  - [X] Token中存储当前角色信息
    ```typescript
    interface TokenPayload {
      userId: number;
      currentRole: 'admin' | 'supplier' | 'store';
      roleId?: number; // supplierId或storeId
      sessionId: string;
    }
    ```

- [X] 🔴 **登出功能**
  - [X] 实现登出接口 `POST /api/auth/logout`
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

- [X] 🔴 **管理员权限体系**
  - [X] 实现主管理员创建（系统初始化时，Seed脚本）
    - 默认账号：admin / 初始密码（首次登录强制修改）
  - [X] 实现子管理员创建接口 `POST /api/admin/admins`
    - 仅主管理员可操作
    - 请求：`{ username, password, name, permissions[] }`
  - [X] 实现权限分配接口 `PUT /api/admin/admins/:id/permissions`
  - [X] 实现权限查询接口 `GET /api/admin/admins/:id/permissions`
  - [X] 实现管理员列表接口 `GET /api/admin/admins`
  - [X] 实现管理员禁用/启用 `PUT /api/admin/admins/:id/status`

- [X] 🔴 **权限模块定义**
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
  - [X] 编写权限常量文件
  - [X] 编写权限描述映射

- [X] 🔴 **权限校验中间件**
  - [X] 实现API权限校验中间件（Echo）
    ```go
    // 使用中间件
    e.GET("/orders", 
      GetOrders,
      AuthMiddleware, 
      RequirePermission("order"))
    ```
  - [X] 实现基于角色的访问控制
    - 管理员：根据permissions数组校验
    - 供应商：只能访问供应商相关接口
    - 门店：只能访问门店相关接口
  - [ ] 实现前端路由权限守卫
    - React Router权限守卫
    - 根据用户权限动态生成路由
  - [ ] 实现菜单权限控制
    - 根据权限动态生成侧边栏菜单
  - [X] 实现按钮级权限控制
    - 权限组件：`<PermissionButton permission="order:delete">删除</PermissionButton>`
  - [ ] 实现敏感操作二次确认
    - 删除、批量操作需二次确认
    - 敏感配置修改需输入密码

### 3.3 安全措施

- [X] 🔴 **接口安全**
  - [X] 实现请求签名验证（供应商API对接时使用）
    - HMAC-SHA256签名
    - 签名内容：timestamp + nonce + body
    - 签名放在Header：X-Signature, X-Timestamp, X-Nonce
  - [X] 实现接口频率限制（使用Echo RateLimiter中间件）
    - 普通接口：100次/分钟
    - 登录接口：10次/分钟
    - 验证码接口：1次/分钟
  - [X] 实现SQL注入防护
    - 使用GORM参数化查询
    - 禁止拼接SQL
  - [X] 实现XSS防护
    - 输入过滤（使用go-playground/validator）
    - 输出转义
  - [X] 实现CSRF防护
    - SameSite Cookie属性
    - 双重Cookie验证（可选）

- [X] 🟠 **数据安全**
  - [X] 敏感数据加密存储
    - API密钥使用AES加密存储
    - 支付配置加密存储
  - [X] 敏感数据脱敏展示
    - 手机号：138****8888
    - 身份证：110***********1234
    - API密钥：只显示前4位后4位
  - [X] 实现操作日志记录
    - 使用AOP切面自动记录
    - 记录操作前后数据变化
  - [X] 实现审计日志
    - 敏感操作单独记录
    - 支持导出审计报告

### 3.4 业务模块API实现

- [X] 🔴 **供应商管理模块API**
  - [X] 供应商CRUD接口 (`/admin/suppliers`)
  - [X] 供应商列表查询（分页、搜索、筛选）
  - [X] 供应商详情/编辑
  - [X] Webhook配置接口
  - [X] API配置接口
  - [X] 重新生成API密钥接口
  - [X] 启用/禁用供应商
  - [X] 配送区域管理接口
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **门店管理模块API**
  - [X] 门店CRUD接口 (`/admin/stores`)
  - [X] 门店列表查询（分页、搜索、筛选）
  - [X] 门店详情/编辑
  - [X] 加价开关设置接口
  - [X] 启用/禁用门店
  - [X] 按区域查询门店
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **订单管理模块API**
  - [X] 订单CRUD接口 (`/admin/orders`, `/supplier/orders`, `/store/orders`)
  - [X] 订单列表查询（分页、搜索、筛选）
  - [X] 订单详情
  - [X] 订单状态变更（确认、配送、完成、取消）
  - [X] 订单状态日志查询
  - [X] 订单统计接口
  - [X] 管理员/供应商/门店三端Handler
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **物料管理模块API**
  - [X] 分类CRUD接口 (`/admin/categories`)
  - [X] 分类树形结构查询
  - [X] 物料CRUD接口 (`/admin/materials`)
  - [X] 物料列表查询（分页、搜索、筛选）
  - [X] 物料详情
  - [X] 物料状态更新接口
  - [X] 供应商端/门店端物料查询接口
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **物料SKU管理模块API**
  - [X] SKU CRUD接口 (`/admin/material-skus`)
  - [X] SKU列表查询（分页、搜索、筛选）
  - [X] 按物料ID查询SKU列表
  - [X] 按条码查询SKU
  - [X] 获取所有品牌列表
  - [X] SKU状态更新接口
  - [X] 供应商端/门店端SKU查询接口
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **供应商物料报价模块API**
  - [X] 供应商物料报价CRUD接口 (`/admin/supplier-materials`, `/supplier/materials`)
  - [X] 报价列表查询（分页、搜索、筛选）
  - [X] 按供应商查询报价列表
  - [X] 按物料SKU查询报价列表（含最低价排序）
  - [X] 库存状态更新接口
  - [X] 审核接口（管理员）
  - [ ] 批量调价接口
  - [ ] 价格对比统计接口
  - [X] 门店端报价查询接口
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **加价规则管理模块API**
  - [X] 加价规则CRUD接口 (`/admin/price-markups`)
  - [X] 规则列表查询（分页、搜索、筛选）
  - [X] 获取生效中的规则列表
  - [X] 规则状态更新接口
  - [X] 加价计算接口（支持门店/供应商/分类/物料多维度匹配）
  - [X] 门店端加价计算接口
  - [X] Model、Service、Handler、Router文件

- [X] 🔴 **购物车管理模块API**
  - [X] 添加商品到购物车 (`POST /cart/add`)
  - [X] 更新购物车商品数量 (`PUT /cart/update`)
  - [X] 删除购物车商品 (`DELETE /cart/remove`)
  - [X] 获取购物车列表 (`GET /cart`)
  - [X] 获取指定供应商购物车 (`GET /cart/supplier/:supplierId`)
  - [X] 清空购物车 (`DELETE /cart/clear`)
  - [X] 获取购物车商品数量 (`GET /cart/count`)
  - [X] 刷新购物车商品价格 (`POST /cart/refresh-prices`)
  - [X] Redis存储实现（按门店+供应商分组）
  - [X] Model、Service、Handler、Router文件

---

## 4. 门店端功能

### 4.1 门店Web后台

#### 4.1.1 数据看板

- [X] **首页数据看板**
  - [X] 本月订货金额统计卡片
  - [X] 本月订单数统计卡片
  - [X] 待收货订单统计卡片
  - [X] 可用供应商数量统计卡片
  - [X] 订货趋势图（近30天）
  - [X] 供应商订货占比饼图
  - [X] 常购物料TOP10列表
  - [X] 各分类订货金额排行

#### 4.1.2 在线订货

- [X] **物料浏览**
  - [X] 按分类浏览物料列表
  - [X] 物料搜索功能（名称/编号）
  - [X] 物料筛选（供应商、分类）
  - [X] 分类Tab切换
  - [X] 物料卡片展示（图片、名称、品牌、规格、价格起）

- [X] **物料详情与选购**
  - [X] 物料详情弹窗/页面
  - [X] 品牌选择（多品牌时）
  - [X] 规格选择（多规格时）
  - [X] 供应商报价对比列表
  - [X] 显示供应商名称、单价、起送价、起订量、配送日
  - [X] 数量选择器（+/-按钮）
  - [X] 起订量校验提示
  - [X] 加入购物车按钮
  - [X] 加入购物车成功提示

- [X] **购物车**
  - [X] 按供应商分组展示商品
  - [X] 每组显示：供应商名称、起送价、当前小计
  - [X] 已达起送价标识（绿色边框）
  - [X] 未达起送价警告（红色边框+提示）
  - [X] 商品数量修改
  - [X] 商品删除
  - [X] 清空购物车
  - [X] 底部结算栏：可结算金额、结算按钮
  - [X] 结算按钮只结算已达起送价的供应商

- [X] **分批结算机制**
  > **结算规则**：只有达到起送价的供应商商品才能结算，未达起送价的保留在购物车
  - [X] 结算前检查逻辑
    - 遍历购物车中所有供应商分组
    - 计算每组商品小计金额
    - 对比供应商起送价（min_order_amount）
    - 标记可结算/不可结算状态
  - [X] 可结算供应商处理
    - 已达起送价的供应商：显示"可结算"标识
    - 商品移出购物车，进入结算流程
  - [X] 不可结算供应商处理
    - 未达起送价的供应商：显示"差¥XX起送"提示
    - 商品保留在购物车，等待继续凑单
    - 提示用户继续选购该供应商商品
  - [X] 结算时一次生成多个订单
    - 每个供应商生成独立订单
    - 每个订单有独立订单号
    - 支付时合并计算总金额

- [X] **结算下单**
  - [X] 结算确认页面
  - [X] 显示收货地址（仅展示，不可修改）
  - [X] 按供应商分组显示订单预览
  - [X] 每组显示：商品列表、小计、预计送达日期
  - [X] 备注输入框（每个供应商可单独备注）
  - [X] 订单金额汇总
  - [X] 服务费计算显示（3‰）
  - [X] 提交订单按钮
  - [X] 按供应商拆分生成多个订单

- [X] **在线支付**
  - [X] 支付方式选择（微信/支付宝）
  - [X] 生成支付二维码
  - [X] 二维码有效期倒计时（15分钟）
  - [X] 支付状态轮询
  - [X] 支付成功跳转
  - [X] 支付超时提示
  - [X] 刷新二维码功能
  - [X] 切换支付方式

#### 4.1.3 订单管理

- [X] **订单列表**
  - [X] 订单列表页面
  - [X] 订单状态筛选（全部/待付款/待确认/配送中/已完成/已取消）
  - [X] 日期范围筛选
  - [X] 供应商筛选
  - [X] 订单搜索（订单号）
  - [X] 订单卡片展示（供应商、金额、状态、时间、商品数）
  - [X] 分页加载

- [X] **订单详情**
  - [X] 订单详情页面
  - [X] 订单基本信息（订单号、下单时间、状态）
  - [X] 收货信息
  - [X] 商品明细列表
  - [X] 金额明细（商品金额、服务费、实付金额）
  - [X] 订单状态时间线

- [X] **订单操作**
  - [X] 待付款订单：显示支付二维码，重新支付
  - [X] 再来一单：复制订单商品到购物车
  - [X] 取消订单（1小时内自主取消）
  - [ ] 提交取消申请（超过1小时）
  - [ ] 取消申请状态跟踪

- [ ] **订单取消流程（详细）**
  > **取消规则**：下单后1小时内可自主取消，超过1小时需提交申请等待管理员审批
  - [ ] 门店自主取消（≤1小时）
    - 检查下单时间是否在1小时内
    - 直接更新订单状态为"已取消"（cancelled）
    - 自动发起退款（如已支付）
    - 推送Webhook取消通知给供应商
    - 推送取消通知给门店管理群
  - [ ] 门店申请取消（>1小时）
    - 填写取消原因
    - 创建取消申请记录（OrderCancelRequest）
    - 状态设为"待审批"（pending）
    - 通知管理员有新的取消申请
    - 门店端显示申请状态跟踪
  - [ ] 取消申请审批流程
    - 管理员查看待审批列表
    - 联系供应商确认是否可取消
    - 审批通过：订单状态改为"已取消"，发起退款
    - 审批拒绝：通知门店原因，订单保持原状态
  - [ ] 订单恢复流程（供应商拒绝取消时）
    - 管理员点击"恢复订单"按钮
    - 填写恢复原因（如：供应商已备货无法取消）
    - 订单状态改为"待付款"（unpaid）
    - 通知门店订单已恢复，需重新付款
    - 推送Webhook恢复通知给供应商
    - 门店重新支付后，订单状态变为"待确认"

- [ ] **订单导出**
  - [ ] 导出订单明细Excel
  - [ ] 导出筛选条件配置

#### 4.1.5 市场行情

- [X] **价格对比页面**
  - [X] 市场行情页面布局
  - [X] 按分类筛选
  - [X] 按产品搜索
  - [X] 产品价格对比卡片
    - 产品名称、品牌、规格
    - 供应商数量
    - 价格区间（最低价-最高价）
  - [X] 各供应商报价列表（排序：价格从低到高）
    - 供应商显示名称（display_name）
    - 单价（含加价）
    - 起送价
    - 配送时间
    - 库存状态
  - [X] 最低价标识（绿色高亮）
  - [X] 直接加入购物车按钮
  - [X] 快速对比功能（选择2-3个供应商对比）

#### 4.1.5 统计分析

- [X] **按时间统计**
  - [X] 日/周/月订货金额趋势图
  - [X] 订单数量趋势图
  - [X] 时间范围选择器
  - [X] 数据表格展示
  - [X] 导出报表

- [X] **按分类统计**
  - [X] 各分类订货金额占比图
  - [X] 各分类订货金额排行
  - [X] 分类明细表格
  - [X] 导出报表

- [X] **按供应商统计**
  - [X] 各供应商订货金额占比图
  - [X] 各供应商订货金额排行
  - [X] 供应商明细表格
  - [X] 导出报表

#### 4.1.6 账户设置

- [X] **门店信息**
  - [X] 门店信息展示
  - [X] 联系人信息
  - [X] 门店地址

- [X] **收货地址**
  - [X] 收货地址展示（由管理员维护，门店只读）

---

## 5. 供应商端功能

### 5.1 供应商Web后台

#### 5.1.1 订单概览

- [X] **首页数据看板**
  - [X] 待处理订单数量统计（红色高亮）
  - [X] 今日订单数统计
  - [X] 今日销售额统计
  - [X] 本月销售额统计
  - [X] 待处理订单列表（快捷操作）
  - [X] 每个订单显示：门店名称、金额、商品数、期望配送时间
  - [X] 快捷确认订单按钮
  - [X] 快捷开始配送按钮
  - [X] 查看详情按钮
  - [X] 打印送货单按钮

#### 5.1.2 市场行情

- [X] **价格对比概览**
  - [X] 市场行情说明提示（"以下为您的产品在市场中的价格竞争力分析"）
  - [X] 数据统计卡片
    - 在售产品总数
    - 价格最低产品数量（绿色）
    - 价格偏高产品数量（橙色）
    - 价格持平产品数量
    - 平均价格优势率

- [X] **产品价格列表**
  - [X] 分类筛选
  - [X] 价格状态筛选（最低/偏高）
  - [X] 产品列表表格
  - [X] 显示：产品名称、品牌、规格、您的报价、市场最低价、价差
  - [X] 价格最低标识（绿色背景）
  - [X] 价格偏高标识（红色背景）
  - [X] 快捷调价按钮
  - [X] 价格调整建议区域
  - [X] 建议降价产品列表
  - [X] 价格优势产品列表
  - [X] 数据更新时间显示
  - [X] 刷新数据按钮

#### 5.1.3 订单管理

- [X] **订单列表**
  - [X] 订单列表页面
  - [X] 订单状态筛选（全部/待确认/已确认/配送中/已完成）
  - [X] 门店筛选
  - [X] 日期筛选
  - [X] 订单搜索（订单号）
  - [X] 订单表格展示
  - [X] 显示：订单编号、门店、商品数、金额、期望配送、状态
  - [X] 分页功能
  - [X] 导出Excel按钮

- [X] **订单详情**
  - [X] 订单详情弹窗/页面
  - [X] 订单基本信息
  - [X] 门店收货信息
  - [X] 商品明细列表（显示供应商原价）
  - [X] 订单金额汇总

- [X] **订单操作**
  - [X] 确认订单按钮
  - [X] 标记配送中按钮
  - [X] 标记已完成按钮
  - [X] 打印送货单按钮

#### 5.1.4 送货单打印

- [X] **打印功能**
  - [X] 订单选择列表（复选框）
  - [X] 按日期筛选订单
  - [X] 批量选择功能
  - [X] 打印预览区域
  - [X] 送货单模板（使用管理员配置的模板）
  - [X] 送货单内容：订单信息、商品明细、收货信息、签收栏
  - [X] 批量打印按钮
  - [X] 单张打印按钮

#### 5.1.5 物料价格管理

- [X] **价格设置**
  - [X] 物料价格列表
  - [X] 物料搜索
  - [X] 分类筛选
  - [X] 显示：物料名称、品牌、规格、当前价格、库存状态
  - [X] 编辑价格弹窗
  - [X] 设置最小起订量
  - [X] 批量修改价格

- [X] **库存管理**
  - [X] 库存状态列表
  - [X] 设置有货/缺货状态
  - [X] 批量设置库存状态

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

- [X] **配送日/起送价设置**
  - [X] 起送价设置输入框
  - [X] 配送日选择（周一到周日多选）
  - [X] 配送日逻辑说明（如：周一三五配送，系统自动计算预计送达日期）
  - [X] 保存设置（提交审核）
  - [X] 审核状态显示
  - [X] 待审核提示
  - [X] 审核驳回原因显示

- [X] **配送模式管理**
  > **配送模式说明**：供应商自配送（self_delivery）或快递配送（express_delivery）
  - [X] 配送模式选择
    - 自配送（self_delivery）：供应商使用自己的车辆/人员配送，无需上传运单
    - 快递配送（express_delivery）：使用第三方快递公司配送，需要上传快递运单号
  - [X] 默认模式设置（默认为自配送）
  - [X] 模式切换需管理员审核

- [X] **配送区域管理**
  - [X] 配送区域列表
  - [X] 添加配送区域（省市区选择）
  - [X] 删除配送区域
  - [X] 批量导入配送区域
  - [X] 保存设置（提交审核）
  - [X] 区域匹配逻辑
    - 精确匹配：省+市+区完全一致
    - 市级匹配：省+市一致，区为空表示全市配送
    - 省级匹配：省一致，市和区为空表示全省配送

- [X] **运单管理（快递配送模式）**
  - [X] 运单列表
  - [X] 上传运单号
  - [X] 运单号关联订单
  - [X] 快递公司选择
  - [ ] 物流状态追踪（可选，对接快递100等API）

#### 5.1.7 账户信息

- [X] **供应商信息**
  - [X] 供应商信息展示
  - [X] 联系人信息
  - [X] 当前配送设置展示

---

## 6. 管理员端功能

### 6.1 管理员Web后台

#### 6.1.1 数据看板

- [X] **首页数据看板**
  - [X] 今日订单数统计卡片
  - [X] 今日订货金额统计卡片
  - [X] 本月订单数统计卡片
  - [X] 本月加价收入统计卡片（绿色高亮）
  - [X] 订货趋势图（近30天）
  - [X] 供应商订单排行TOP5
  - [X] 门店订货排行TOP5
  - [X] 订单状态分布统计

#### 6.1.2 订单管理

- [X] **订单列表**
  - [X] 订单列表页面
  - [X] 多维度筛选：状态、门店、供应商、日期
  - [X] 订单搜索（订单号）
  - [X] 订单表格展示
  - [X] 显示：订单编号、门店、供应商、商品数、订单金额、加价收入、状态、下单时间
  - [X] 加价收入列（绿色显示有加价，灰色显示无加价）
  - [X] 分页功能
  - [X] 导出Excel按钮

- [X] **订单详情**
  - [X] 订单详情页面
  - [X] 显示完整订单信息
  - [X] 显示原价、加价、最终价格
  - [X] 订单状态时间线
  - [X] 订单操作日志

- [X] **取消申请审批**
  - [X] 待审批取消申请列表
  - [X] 显示：订单信息、门店信息、取消原因、申请时间
  - [X] 批准取消按钮
  - [X] 拒绝取消按钮（需填写原因）
  - [X] 联系供应商确认提示

- [X] **订单恢复**
  - [X] 已取消订单列表
  - [X] 恢复订单按钮
  - [X] 恢复原因填写
  - [X] 恢复后状态变为"待付款"
  - [X] 通知门店重新付款

- [X] **管理员直接取消**
  - [X] 任意状态订单可取消
  - [X] 取消原因填写
  - [X] 确认取消弹窗

#### 6.1.3 市场行情

- [X] **全局价格监控**
  - [X] 市场行情仪表盘
    - 今日价格变动统计
    - 价格异常预警数
    - 独家供应产品数
    - 新增产品数
  - [X] 区域筛选（按省市区）
  - [X] 分类筛选
  - [X] 产品搜索
  - [X] 数据统计卡片
    - 在售产品总数
    - 活跃供应商数量
    - 价格异常数量（价差超过15%）
    - 独家供应产品数量
    - 平均加价率

- [X] **产品价格对比表**
  - [X] 产品列表表格
  - [X] 显示列：
    - 产品名称、品牌、规格
    - 供应商数量
    - 最低价（原价）
    - 最高价（原价）
    - 价差率（(最高-最低)/最低×100%）
    - 平均加价率
  - [X] 各供应商报价详情展开
    - 供应商真实名称（name）
    - 原价
    - 加价金额
    - 最终价格
    - 配送区域
  - [X] 最低价标识（绿色背景）
  - [X] 价格偏高预警标识（价差>15%，红色背景）
  - [X] 独家供应标识（仅1个供应商）
  - [X] 导出Excel按钮

- [X] **价格预警管理**
  - [X] 价格异常预警列表
    - 产品信息
    - 价差率
    - 涉及供应商
    - 建议处理措施
  - [X] 独家供应产品列表
    - 产品信息
    - 独家供应商
    - 风险提示（供应中断风险）
  - [X] 价格趋势分析
    - 近30天价格走势图
    - 价格波动预警

#### 6.1.4 数据汇总报表

- [X] **按门店汇总**
  - [X] 门店列表表格
  - [X] 显示：门店名称、订货金额、订单数、常购物料
  - [X] 门店详情钻取
  - [X] 时间范围筛选
  - [X] 导出报表

- [X] **按供应商汇总**
  - [X] 供应商列表表格
  - [X] 显示：供应商名称、销售金额、订单数、热销物料
  - [X] 供应商详情钻取
  - [X] 时间范围筛选
  - [X] 导出报表

- [X] **按物料汇总**
  - [X] 物料列表表格
  - [X] 显示：物料名称、销量、销售额、采购门店数
  - [X] 分类筛选
  - [X] 时间范围筛选
  - [X] 导出报表

- [X] **对比分析**
  - [X] 同比/环比分析
  - [X] 门店订货排名变化
  - [X] 供应商销售排名变化
  - [X] 图表可视化

#### 6.1.5 供应商管理

- [X] **供应商列表**
  - [X] 供应商列表页面
  - [X] 供应商搜索
  - [X] 状态筛选（启用/禁用）
  - [X] 管理模式筛选
  - [X] 显示：名称、联系人、管理模式、加价开关、状态

- [X] **供应商详情/编辑**
  - [X] 供应商信息编辑
  - [X] 真实名称（name）展示（不可修改）
  - [X] 显示名称（display_name）管理
    > **显示名称说明**：用于门店端展示，可隐藏真实供应商名称
    - 默认等于真实名称（name）
    - 管理员可自定义修改display_name
    - 门店APP/门店Web后台显示display_name
    - 供应商后台/管理员后台显示真实名称name
    - 修改display_name不影响供应商真实名称
  - [X] 联系信息编辑
  - [X] 启用/禁用供应商

- [X] **对接配置**
  - [X] 管理模式设置（自主管理/平台代管/Webhook/API对接）
  - [X] Webhook URL配置
  - [X] Webhook开关
  - [ ] 推送事件选择（新订单/状态变更/取消/恢复）
  - [X] 测试推送按钮
  - [X] API接口地址配置
  - [X] API密钥生成/重置
  - [ ] 重试策略配置

- [X] **创建供应商**
  - [X] 供应商信息表单
  - [X] 关联用户账号
  - [X] 初始配置设置

#### 6.1.6 供应商代管

- [X] **代管供应商列表**
  - [X] 筛选管理模式为"平台代管"的供应商
  - [X] 快捷进入代管操作

- [X] **代管物料价格**
  - [X] 代为设置物料价格
  - [X] 代为设置起订量
  - [X] Excel批量导入价格

- [X] **代管配送设置**
  - [X] 代为设置起送价
  - [X] 代为设置配送日
  - [X] 代为设置配送区域

- [X] **代管订单处理**
  - [X] 代为确认订单
  - [X] 代为更新订单状态
  - [X] 代管操作日志记录

#### 6.1.7 配送设置审核

- [X] **待审核列表**
  - [X] 待审核的配送设置变更列表
  - [X] 显示：供应商名称、变更类型、原值、新值、提交时间
  - [X] 审核数量Badge提示

- [X] **审核操作**
  - [X] 查看变更详情
  - [X] 审核通过按钮
  - [X] 审核驳回按钮（需填写原因）
  - [X] 审核历史记录

#### 6.1.8 产品审核

- [X] **待审核产品列表**
  - [X] 供应商导入的待审核产品列表
  - [X] 显示：产品信息、供应商、提交时间
  - [X] 审核数量Badge提示
  - [X] 状态筛选（待审核/已通过/已驳回）
  - [X] 供应商筛选
  - [X] 时间范围筛选

- [X] **审核内容**
  - [X] 品牌信息核实
    - 品牌名称是否正确
    - 是否为新品牌（需额外确认）
    - 品牌授权检查（可选）
  - [X] 规格信息核实
    - 规格描述是否准确
    - 单位是否正确
    - 包装规格是否合理
  - [X] 价格合理性检查
    - 与历史价格对比（波动超过20%预警）
    - 与同品牌同规格对比
    - 与市场均价对比
    - 价格异常原因说明
  - [X] 图片匹配检查
    - 自动匹配结果确认
    - 图片质量检查
    - 手动调整图片
    - 无图片时的处理
  - [X] 产品信息完整性检查
    - 必填字段检查
    - 信息一致性检查
    - 重复产品检测

- [X] **审核操作**
  - [X] 审核通过按钮
  - [X] 审核驳回按钮（需填写原因）
  - [X] 批量审核功能
  - [X] 审核历史记录
  - [X] 审核意见保存
  - [X] 修改后重新提交

- [X] **审核流程**
  - [X] 供应商提交产品 → 进入待审核状态
  - [X] 管理员审核 → 通过/驳回
  - [X] 驳回 → 供应商修改 → 重新提交
  - [X] 通过 → 产品上架 → 门店可见

#### 6.1.9 加价管理

- [X] **加价开关与概览**
  - [X] 全局总开关（关闭=所有加价停止）
  - [X] 供应商级开关列表
    - 列表显示所有供应商及其加价开关状态
    - 批量开启/关闭
    - 加价收入统计
  - [X] 门店级开关列表
    - 列表显示所有门店及其加价开关状态
    - 批量开启/关闭（新店扶持期可关闭）
    - 加价收入统计
  - [X] 分类级开关列表
    - 列表显示所有分类及其加价开关状态
    - 批量开启/关闭（低毛利品类可关闭）
  - [X] 加价收入统计概览
    - 今日加价收入
    - 本月加价收入
    - 加价率统计

- [X] **加价规则列表**
  - [X] 规则列表表格
  - [X] 显示：规则名称、门店、供应商、商品、加价方式、加价值、优先级、状态
  - [X] 规则搜索/筛选
  - [X] 启用/禁用规则
  - [X] 编辑规则
  - [X] 删除规则

- [X] **新建加价规则**
  - [X] 规则名称输入
  - [X] 门店选择（可选，空=全部门店）
  - [X] 供应商选择（可选，空=全部供应商）
  - [X] 物料选择（可选，空=全部物料）
  - [X] 加价方式选择（固定金额/百分比）
  - [X] 加价值输入
  - [X] 规则启用开关
  - [X] 优先级自动计算说明

- [X] **Excel批量导入规则**
  - [X] 下载导入模板
  - [X] 上传Excel文件
  - [X] 导入预览
  - [X] 确认导入
  - [X] 导入结果

- [X] **加价模拟计算**
  - [X] 选择门店
  - [X] 选择供应商
  - [X] 选择商品
  - [X] 输入原价
  - [X] 显示匹配的规则
    - 规则名称
    - 规则优先级
    - 加价方式和值
    - 应用原因（精确匹配/部分匹配/通用规则）
  - [X] 显示计算后的最终价格
  - [X] 显示加价金额
  - [X] 显示加价率

- [X] **加价计算逻辑实现**
  - [X] 检查全局总开关
    - 关闭：返回原价
    - 开启：继续
  - [X] 检查供应商级开关
    - 该供应商开关关闭：返回原价
    - 开启：继续
  - [X] 检查门店级开关
    - 该门店开关关闭：返回原价
    - 开启：继续
  - [X] 检查分类级开关
    - 该商品分类开关关闭：返回原价
    - 开启：继续
  - [X] 查找匹配的加价规则（按优先级排序）
    > **优先级数值说明**：数值越大优先级越高，自动根据匹配维度计算
    - 优先级7：门店+供应商+商品（三维精确匹配，最高优先级）
    - 优先级6：门店+供应商（二维匹配）
    - 优先级5：门店+商品（二维匹配）
    - 优先级4：供应商+商品（二维匹配）
    - 优先级3：仅门店（单维匹配）
    - 优先级2：仅供应商（单维匹配）
    - 优先级1：仅商品（单维匹配）
  - [X] 取优先级最高的已启用规则
    - 如果加价值为0，表示不加价（可用于特殊豁免）
    - 如果无匹配规则，不加价
  - [X] 计算最终价格
    - 百分比加价：最终价格 = 原价 × (1 + 加价百分比)
    - 固定金额加价：最终价格 = 原价 + 固定加价
    - 可选：设置最低/最高加价金额限制
  - [X] 价格展示规则
    - 门店端：显示最终价格（门店无感知加价）
    - 供应商端：显示原价（不含加价，按原价结算）
    - 管理员端：显示原价、加价金额、最终价格、加价率

- [X] **加价收入统计**
  - [X] 加价收入趋势图
  - [X] 按门店加价收入统计
  - [X] 按供应商加价收入统计
  - [X] 按商品加价收入统计
  - [X] 时间范围筛选
  - [X] 导出报表

#### 6.1.10 门店管理

- [X] **门店列表**
  - [X] 门店列表页面
  - [X] 门店搜索
  - [X] 状态筛选
  - [X] 区域筛选
  - [X] 显示：名称、联系人、地址、加价开关、状态

- [X] **门店详情/编辑**
  - [X] 门店信息编辑
  - [X] 收货地址维护
  - [X] 联系信息编辑
  - [X] 加价开关设置
  - [X] Webhook配置
  - [X] 启用/禁用门店

- [X] **创建门店**
  - [X] 门店信息表单
  - [X] 关联用户账号
  - [X] 收货地址设置
  - [X] 初始配置

#### 6.1.11 物料管理

- [X] **分类管理**
  - [X] 分类列表（树形结构）
  - [X] 添加分类
  - [X] 编辑分类
  - [X] 删除分类
  - [X] 分类排序
  - [X] 分类加价开关

- [X] **物料列表**
  - [X] 物料列表页面
  - [X] 物料搜索
  - [X] 分类筛选
  - [X] 显示：名称、分类、SKU数量、状态

- [X] **物料详情/编辑**
  - [X] 物料基本信息编辑
  - [X] 物料图片上传
  - [X] SKU管理（品牌、规格）
  - [X] 关联供应商查看

- [X] **批量导入/导出**
  - [X] 下载导入模板
  - [X] 批量导入物料
  - [X] 导出物料列表

#### 6.1.12 素材库管理

- [X] **图片素材库**
  - [X] 图片列表（网格展示）
  - [X] 按分类筛选（粮油、肉禽蛋、蔬菜、调味品等）
  - [X] 按品牌筛选（金龙鱼、鲁花、五得利等）
  - [X] 图片搜索（名称、标签、SKU）
  - [X] 批量上传图片（支持拖拽）
  - [X] 图片标签管理（关键词、SKU编码、品牌）
  - [X] 图片信息编辑（名称、分类、品牌、规格）
  - [X] 图片使用统计（使用次数、关联产品数）
  - [X] 图片删除（检查关联产品）

- [X] **图片匹配机制**
  - [X] 自动匹配开关
  - [X] 匹配规则配置
    - 名称相似度阈值设置（默认80%）
    - 品牌精确匹配设置（同品牌优先）
    - 规格匹配设置（同规格优先）
    - SKU编码匹配（精确匹配）
    - 关键词匹配（包含关键词）
  - [X] 匹配优先级设置
    - SKU精确匹配 > 品牌+名称 > 名称相似度
  - [X] 手动匹配入口
  - [X] 批量匹配功能
  - [X] 匹配结果预览
  - [X] 匹配历史记录

- [X] **注意事项**
  - [X] 同一物料可能存在多个品牌
  - [X] 同品牌同物料可能有多种规格
  - [X] 不同供应商可能使用不同包装规格

#### 6.1.13 管理员管理（仅主管理员）

- [X] **管理员列表**
  - [X] 管理员列表页面
  - [X] 显示：姓名、账号、角色类型、权限、创建时间、状态
  - [X] 主管理员标识

- [X] **创建子管理员**
  - [X] 基本信息填写
  - [X] 账号密码设置
  - [X] 权限分配（多选）
  - [X] 敏感权限不可分配给子管理员

- [X] **编辑子管理员**
  - [X] 信息编辑
  - [X] 权限调整
  - [X] 重置密码
  - [X] 启用/禁用

#### 6.1.14 系统设置

- [X] **API配置（仅主管理员）**
  - [X] 供应商API对接配置
  - [X] API密钥管理
  - [X] 推送地址配置

- [X] **支付配置（仅主管理员）**
  - [X] 微信支付配置
  - [X] 支付宝支付配置
  - [X] 支付参数加密存储

- [X] **送货单模板配置**
  - [X] 模板列表
  - [X] 创建模板
  - [X] 模板编辑器
  - [X] 模板预览
  - [X] 为供应商分配模板

- [X] **系统参数配置（仅主管理员）**
  > **配置项存储在SystemConfig表，config_key为键名**
  - [X] 订单相关配置
    - order_cancel_threshold: 门店自主取消时限（默认1小时=3600秒）
    - order_cancel_request_timeout: 取消申请超时提醒（默认24小时）
  - [X] 支付相关配置
    - payment_timeout: 支付超时时间（默认15分钟=900秒）
    - payment_polling_interval: 支付状态轮询间隔（默认3秒）
    - unpaid_order_cancel_timeout: 未支付订单自动取消时间（默认30分钟）
  - [X] 费率相关配置
    - service_fee_rate: 支付手续费费率（默认0.003，即3‰）
    - service_fee_enabled: 手续费转嫁开关（默认开启）
  - [X] Webhook相关配置
    - webhook_retry_times: Webhook推送重试次数（默认3次）
    - webhook_retry_interval: 重试间隔基数（默认5分钟）
    - webhook_timeout: 推送超时时间（默认10秒）
  - [X] 加价相关配置
    - markup_global_enabled: 全局加价总开关（默认开启）
  - [X] 其他系统参数
    - cart_expire_days: 购物车过期时间（默认30天）
    - order_no_prefix: 订单编号前缀（默认"PO"）

- [X] **操作日志**
  - [X] 操作日志列表
  - [X] 日志筛选（用户、模块、时间）
  - [X] 日志详情查看
  - [X] 日志导出

---

## 7. 移动端APP

### 7.1 APP通用功能

#### 7.1.1 登录模块

- [X] **登录页面**
  - [X] APP启动页/引导页
  - [X] 登录表单（账号/密码）
  - [X] 手机号+验证码登录（可选）
  - [X] 记住登录状态
  - [X] 登录按钮
  - [X] 演示账号快捷登录（开发测试用）

- [X] **角色选择**
  - [X] 多角色用户显示角色选择页
  - [X] 角色卡片展示（门店/供应商/管理员）
  - [X] 点击角色进入对应界面
  - [X] 角色切换功能（设置页）

#### 7.1.2 版本更新

- [X] **版本检测**
  - [X] 启动时检查版本
  - [X] 版本对比逻辑
  - [X] 更新提示弹窗

- [X] **更新机制**
  - [X] 热更新支持（JS/资源文件）
  - [X] 强制更新提示
  - [X] 下载新版本APK
  - [X] 安装引导

### 7.2 门店端APP

#### 7.2.1 首页

- [X] **首页布局**
  - [X] 顶部导航栏（供应链订货）
  - [X] 搜索栏（搜索物料名称）
  - [X] 分类入口（粮油、肉禽蛋、蔬菜、调味品、包材等）
  - [X] 热门物料列表

- [X] **物料卡片**
  - [X] 物料图片
  - [X] 物料名称
  - [X] 品牌/规格数量提示
  - [X] 起步价显示
  - [X] 点击进入详情

#### 7.2.2 物料详情与选购

- [X] **物料详情页**
  - [X] 物料图片展示
  - [X] 物料名称
  - [X] 品牌选择器（多品牌时）
  - [X] 规格选择器（多规格时）
  - [X] 供应商报价列表
  - [X] 每个供应商显示：名称、单价、起送价、起订量、配送日
  - [X] 最低价标识
  - [X] 选择供应商
  - [X] 数量选择器
  - [X] 起订量校验
  - [X] 加入购物车按钮

#### 7.2.3 购物车

- [X] **购物车页面**
  - [X] 底部Tab切换
  - [X] 购物车Badge数量显示
  - [X] 按供应商分组展示
  - [X] 每组显示：供应商名称、起送价、当前小计
  - [X] 已达起送价组：绿色边框+可结算标识
  - [X] 未达起送价组：红色边框+差额提示
  - [X] 商品项：图片、名称、规格、单价、数量
  - [X] 数量修改
  - [X] 删除商品
  - [X] 底部结算栏

- [X] **结算功能**
  - [X] 可结算金额显示
  - [X] 结算按钮（只结算达起送价的）
  - [X] 跳转结算页

#### 7.2.4 结算下单

- [X] **结算页面**
  - [X] 收货地址展示（不可修改）
  - [X] 按供应商分组订单预览
  - [X] 商品明细
  - [X] 预计送达日期
  - [X] 备注输入
  - [X] 订单金额汇总
  - [X] 服务费显示
  - [X] 提交订单按钮

- [X] **支付流程**
  - [X] 调起微信/支付宝支付
  - [X] 支付结果处理
  - [X] 支付成功跳转订单详情
  - [X] 支付失败提示

#### 7.2.5 订单管理

- [X] **订单列表页**
  - [X] 底部Tab切换
  - [X] 顶部状态Tab（全部/待确认/配送中/已完成）
  - [X] 订单卡片列表
  - [X] 订单卡片：供应商名称、状态、商品数、金额、服务费
  - [X] 下拉刷新
  - [X] 上拉加载更多

- [X] **订单详情页**
  - [X] 订单状态显示
  - [X] 订单基本信息
  - [X] 收货信息
  - [X] 商品明细
  - [X] 金额明细
  - [X] 订单操作按钮

- [X] **订单操作**
  - [X] 再来一单（复制到购物车）
  - [X] 取消订单（1小时内）
  - [X] 提交取消申请（超1小时）
  - [X] 待付款订单重新支付

#### 7.2.6 市场行情

- [X] **行情页面**
  - [X] 底部Tab切换
  - [X] 提示说明
  - [X] 产品价格对比卡片列表
  - [X] 每个产品显示各供应商报价
  - [X] 最低价标识
  - [X] 快捷加入购物车

#### 7.2.7 我的

- [X] **个人中心页面**
  - [X] 门店信息头部
  - [X] 数据统计（本月订单、本月消费、供应商数）
  - [X] 功能入口列表
  - [X] 收货地址
  - [X] 常购清单
  - [X] 订货统计
  - [X] 设置
  - [X] 退出登录

### 7.3 供应商端APP

#### 7.3.1 首页（订单概览）

- [X] **首页数据**
  - [X] 数据统计Banner
  - [X] 今日订单金额
  - [X] 待处理/进行中/已完成订单数
  - [X] 待处理订单列表
  - [X] 快捷操作按钮（确认/配送/详情）

#### 7.3.2 订单管理

- [X] **订单列表**
  - [X] 顶部状态Tab（待处理/进行中/已完成）
  - [X] 订单卡片列表
  - [X] 订单卡片：门店名称、金额、商品数、配送时间、状态
  - [X] 下拉刷新
  - [X] 上拉加载更多

- [X] **订单详情**
  - [X] 订单详情页面
  - [X] 门店收货信息
  - [X] 商品明细（显示供应商原价）
  - [X] 订单金额

- [X] **订单操作**
  - [X] 确认订单按钮
  - [X] 开始配送按钮
  - [X] 完成订单按钮

#### 7.3.3 物料价格

- [X] **价格管理页面**
  - [X] 物料价格列表
  - [X] 搜索物料
  - [X] 编辑价格
  - [X] 设置库存状态

#### 7.3.4 我的

- [X] **个人中心**
  - [X] 供应商信息头部
  - [X] 今日统计数据
  - [X] 功能入口
  - [X] 配送设置查看
  - [X] 设置
  - [X] 退出登录

### 7.4 管理员端APP

#### 7.4.1 首页（数据概览）

- [X] **首页数据**
  - [X] 数据统计Banner
  - [X] 今日订单数/金额
  - [X] 待处理订单数
  - [X] 快速操作入口
  - [X] 异常订单提醒

#### 7.4.2 订单监控

- [X] **订单列表**
  - [X] 全平台订单列表
  - [X] 多维度筛选
  - [X] 订单卡片展示
  - [X] 订单详情查看

#### 7.4.3 快捷查询

- [X] **查询功能**
  - [X] 门店信息查询
  - [X] 供应商信息查询
  - [X] 订单状态查询

#### 7.4.4 我的

- [X] **个人中心**
  - [X] 管理员信息
  - [X] 关键指标展示
  - [X] 设置
  - [X] 退出登录

### 7.5 APP消息推送

- [X] **推送功能**
  - [X] 集成推送SDK（个推/极光/uni-push）
  - [X] 新订单通知推送
  - [X] 订单状态变更推送
  - [X] 推送点击跳转对应页面
  - [X] 推送开关设置

---

## 8. 通知与集成

### 8.1 企业微信Webhook推送

> **说明**：支持多群推送机制，一个订单可推送到门店管理群和多个供应商群

#### 8.1.1 推送配置

- [X] **门店Webhook配置**
  - [X] 门店Webhook URL存储
  - [X] Webhook启用/禁用开关
  - [X] 测试推送功能
  - [X] 推送状态检查

- [X] **供应商Webhook配置**
  - [X] 供应商Webhook URL存储
  - [X] Webhook启用/禁用开关
  - [X] 推送事件配置（新订单/状态变更/取消/恢复）
  - [X] 测试推送功能

#### 8.1.2 推送消息模板

- [X] **新订单通知 - 门店群版本**
  - [X] 订单提交成功标题
  - [X] 门店名称、订单时间
  - [X] 订单汇总（按供应商分组）
  - [X] 订单总额、服务费、实付金额
  - [X] 预计送达日期

- [X] **新订单通知 - 供应商群版本**
  - [X] 新订单通知标题
  - [X] 订单编号、下单门店、下单时间
  - [X] 订单金额、期望配送时间
  - [X] 商品明细列表
  - [X] 收货地址、联系电话、备注
  - [X] 消息格式示例：
    ```
    【新订单通知】📦
    订单编号：PO20241227001
    下单门店：城东旗舰店
    下单时间：2024-12-27 10:30:00
    订单金额：¥1,280.00
    期望配送：下周一 (12/30)
    
    商品明细：
    1. 面粉（金龙鱼 25kg/袋）x 10袋 - ¥78.00/袋
    2. 黄油（安佳 500g/块）x 10块 - ¥50.00/块
    
    收货地址：XX市XX区XX路XX号
    联系电话：138****8888
    备注：请在上午10点前送达
    
    请及时处理！
    ```

- [X] **订单确认通知**
  - [X] 订单已确认标题
  - [X] 供应商名称、订单编号
  - [X] 确认时间、预计送达
  - [X] 商品明细

- [X] **订单取消通知 - 门店群版本**
  - [X] 订单取消通知标题
  - [X] 取消订单信息
  - [X] 取消原因、取消方式
  - [X] 退款说明

- [X] **订单取消通知 - 供应商群版本**
  - [X] 订单取消通知标题
  - [X] 订单编号、门店名称
  - [X] 取消时间、取消原因
  - [X] 原订单商品明细

- [X] **订单恢复通知**
  - [X] 订单恢复通知标题
  - [X] 订单编号、门店名称
  - [X] 恢复时间、恢复原因
  - [X] 当前状态、商品明细

#### 8.1.3 推送服务实现

- [X] **推送服务**
  - [X] Webhook推送服务类（WebhookService）
  - [X] 消息格式化处理（根据事件类型和目标类型格式化）
  - [X] Markdown格式消息构建
  - [X] HTTP请求发送（POST请求到Webhook URL）
  - [X] 响应结果处理
  - [X] 推送日志记录
  - [X] 多群推送支持（一个订单推送到多个群）
  - [X] 推送任务队列（使用Redis队列）

- [X] **失败重试机制**
  - [X] 推送失败检测
  - [X] 自动重试（最多3次，间隔5分钟）
  - [X] 重试次数记录
  - [X] 指数退避策略（第1次5分钟，第2次15分钟，第3次30分钟）
  - [X] 连续失败告警（推送到管理员群）
  - [X] 定时任务扫描重试队列

- [X] **推送日志**
  - [X] 推送日志记录（WebhookLog表）
  - [X] 日志查询接口（GET /admin/webhook-logs）
  - [X] 日志清理策略（保畆30天）
  - [X] 推送统计接口（成功率、平均耗时等）

### 8.2 供应商API对接

#### 8.2.1 订单推送接口（系统→供应商）

- [X] **推送服务**
  - [X] 订单创建事件推送
  - [X] 订单取消事件推送
  - [X] 订单恢复事件推送
  - [X] 请求签名生成（HMAC-SHA256）
  - [X] 请求头设置（Content-Type, X-Signature, X-Timestamp, X-Nonce）
  - [X] 异步推送队列（避免阻塞主流程）
  - [X] 推送结果记录

- [X] **推送数据格式**
  - [X] event字段（order.created/order.cancelled/order.restored）
  - [X] order对象（订单信息、门店信息、商品明细）
  - [X] JSON序列化
  - [X] 数据加密选项（可选AES加密敏感数据）

#### 8.2.2 订单状态回调接口（供应商→系统）

- [X] **回调接口**
  - [X] POST /api/v1/supplier/orders/{order_no}/status
  - [X] 请求验证（Bearer Token）
  - [X] 状态更新处理（confirmed/delivering/completed）
  - [X] 响应返回
  - [X] 幂等性保证（防止重复回调）
  - [X] 回调日志记录

- [X] **签名验证**
  - [X] 供应商密钥管理
  - [X] 签名验证逻辑（HMAC-SHA256）
  - [X] 时间戳验证（防重放攻击，5分钟内有效）
  - [X] Nonce验证（防重放）
  - [X] 验证失败处理
  - [X] IP白名单（可选）

#### 8.2.3 供应商API配置管理

- [X] **配置管理接口**
  - [X] POST /admin/suppliers/{id}/api-config - 配置API对接
  - [X] PUT /admin/suppliers/{id}/api-config - 更新API配置
  - [X] POST /admin/suppliers/{id}/regenerate-key - 重新生成密钥
  - [X] POST /admin/suppliers/{id}/test-push - 测试推送

- [X] **配置字段**
  - [X] API端点URL
  - [X] 密钥（加密存储）
  - [X] 推送事件选择
  - [X] 重试策略配置
  - [X] 超时时间设置

### 8.3 短信通知（可选扩展）

- [X] **短信服务集成**
  - [X] 短信服务商选择（阿里云/腾讯云）
  - [X] 短信模板配置
  - [X] 短信发送接口
  - [X] 发送记录

- [X] **短信场景**
  - [X] 验证码短信
  - [X] 订单通知短信
  - [X] 异常提醒短信

---

## 9. 支付系统

### 9.1 支付接入（利楚扫呗聚合支付）

> **说明**：系统使用利楚扫呗聚合支付接口，支持微信、支付宝等多种支付方式
> **接口文档**：https://help.lcsw.cn/xrmpic/tisnldchblgxohfl/rinsc3

- [X] **支付配置管理**
  - [X] 商户号（merchant_no）配置存储
  - [X] 终端号（terminal_id）配置存储
  - [X] 签名令牌（access_token）加密存储
  - [X] 支付回调地址（notify_url）配置
  - [X] 支付参数管理界面（仅主管理员）

- [X] **核心支付接口对接**
  - [X] APP支付下单接口（service_id=015）
    - 请求参数封装（pay_ver, pay_type, merchant_no等）
    - 返回支付SDK所需参数
    - 支持微信/支付宝APP支付
  - [X] 聚合码支付接口（service_id=016）
    - 生成支付二维码URL（qr_url）
    - 二维码有效期设置（默认15分钟）
    - 支持repeated_trace防重复
  - [X] 支付查询接口（service_id=020）
    - 轮询支付状态
    - 查询间隔配置（默认3秒）
  - [X] 退款申请接口（service_id=030）
    - 全额退款
    - 部分退款支持
  - [X] 退款查询接口（service_id=031）
    - 退款状态确认
  - [X] 关闭订单接口（service_id=041）
    - 超时未支付订单关闭

- [X] **签名算法实现**
  - [X] MD5签名算法封装
  - [X] 参数字典排序
  - [X] 签名串拼接（a=value1&b=value2&...&access_token=xxx）
  - [X] 签名验证（回调验签）

- [X] **微信支付**
  - [X] 微信支付商户号配置
  - [X] API密钥配置
  - [X] 证书文件配置
  - [X] Native支付接入（Web端扫码）
  - [X] APP支付接入（移动端）
  - [X] 支付结果通知接口

- [X] **支付宝支付**
  - [X] 支付宝应用配置
  - [X] 公钥/私钥配置
  - [X] 当面付接入（Web端扫码）
  - [X] APP支付接入
  - [X] 支付结果通知接口

### 9.2 支付流程

- [X] **创建支付**
  - [X] 生成支付订单
  - [X] 计算支付金额（商品金额+服务费）
  - [X] 生成支付流水号（terminal_trace格式）
  - [X] 调用支付接口
  - [X] 返回支付信息（二维码URL/支付参数）

- [X] **支付手续费计算**
  > **手续费规则**：手续费率3‰（千分之三），由门店承担
  - [X] 手续费计算公式：手续费 = 订单金额 × 0.003
  - [X] 手续费精度处理（四舍五入到分）
  - [X] 金额展示规则
    - 结算页：显示商品金额、手续费、实付金额
    - 订单详情：显示商品金额、手续费明细
    - 供应商端：只显示商品金额（不含手续费，手续费归平台）
  - [X] 线下支付不收取手续费
  - [X] 手续费转嫁开关（系统配置）

- [X] **支付二维码（Web端）**
  - [X] 调用聚合码接口（service_id=016）生成二维码
  - [X] 获取qr_url并转换为二维码图片
  - [X] 二维码有效期设置（timeout_express=900秒）
  - [X] 二维码展示组件
  - [X] 支付状态轮询（调用service_id=020，间隔3秒）
  - [X] 二维码刷新功能（重新调用016接口）
  - [X] 支付方式切换（微信↔支付宝）

- [X] **APP支付**
  - [X] 调用APP下单接口（service_id=015）
  - [X] 获取支付SDK所需参数
  - [X] 调起微信/支付宝支付SDK
  - [X] 支付结果处理
  - [X] 支付回调

### 9.3 支付回调处理

- [X] **回调接口**
  - [X] 统一回调地址（notify_url）接收
  - [X] 回调参数解析
    - return_code/result_code状态判断
    - out_trade_no（扫呗订单号）
    - channel_trade_no（微信/支付宝订单号）
    - total_fee/receipt_fee金额验证
  - [X] key_sign签名验证（MD5）
  - [X] 防重复处理（幂等性保证）
  - [X] 返回成功响应：`{"return_code":"01","return_msg":"success"}`

- [X] **订单状态更新**
  - [X] 支付成功：更新订单状态为“待确认”（pending_confirm）
  - [X] 更新支付状态为“已支付”（paid）
  - [X] 记录支付信息
    - 支付时间（end_time）
    - 扫呗交易号（out_trade_no）
    - 第三方交易号（channel_trade_no）
    - 用户openid（user_id）
  - [X] 触发订单通知推送（Webhook/API）

### 9.4 退款处理

- [X] **退款接口**
  - [X] 微信退款接口调用
  - [X] 支付宝退款接口调用
  - [X] 退款金额计算（含服务费）
  - [X] 退款流水记录

- [X] **退款场景**
  - [X] 订单取消退款
  - [X] 部分退款（可选）
  - [X] 退款状态跟踪

### 9.5 对账与统计

- [X] **支付记录**
  - [X] 支付记录列表
  - [X] 支付状态查询
  - [X] 支付明细导出

- [X] **对账功能**
  - [X] 每日对账报表
  - [X] 异常交易检测
  - [X] 对账差异处理

---

## 10. 部署与运维

### 10.1 服务器部署

- [X] **服务器环境准备**
  - [X] 服务器选型（阿里云/腾讯云）
  - [X] 操作系统配置（Linux）
  - [X] Node.js/Java/Python环境安装
  - [X] Nginx配置
  - [X] SSL证书配置

- [X] **数据库部署**
  - [X] MySQL/PostgreSQL安装配置
  - [X] 数据库创建
  - [X] 用户权限配置
  - [X] 数据库备份策略

- [X] **Redis部署**
  - [X] Redis安装配置
  - [X] 持久化配置
  - [X] 密码设置

- [X] **文件存储**
  - [X] OSS/COS配置
  - [X] 存储桶创建
  - [X] 访问权限配置
  - [X] CDN配置（可选）

### 10.2 应用部署

- [X] **后端部署**
  - [X] 代码部署
  - [X] 环境变量配置
  - [X] PM2进程管理（Node.js）
  - [X] 应用启动脚本
  - [X] 健康检查接口

- [X] **前端部署**
  - [X] 前端构建
  - [X] 静态资源部署
  - [X] Nginx配置
  - [X] Gzip压缩
  - [X] 缓存策略

- [X] **移动端发布**
  - [X] Android APK构建
  - [X] APK签名
  - [X] 下载页面搭建
  - [X] 二维码生成
  - [X] 版本管理

### 10.3 CI/CD自动化

- [X] **持续集成**
  - [X] Git仓库配置
  - [X] GitHub Actions/GitLab CI配置
  - [X] 自动化测试
  - [X] 代码质量检查

- [X] **持续部署**
  - [X] 自动化部署脚本
  - [X] 部署触发条件
  - [X] 回滚机制
  - [X] 部署通知

### 10.4 监控与告警

- [X] **应用监控**
  - [X] 应用性能监控（APM）
  - [X] 错误日志收集
  - [X] API响应时间监控
  - [X] 接口调用统计

- [X] **服务器监控**
  - [X] CPU/内存/磁盘监控
  - [X] 网络流量监控
  - [X] 进程监控

- [X] **告警配置**
  - [X] 告警规则设置
  - [X] 告警通知（邮件/短信/企微）
  - [X] 告警级别划分

### 10.5 安全防护

- [X] **网络安全**
  - [X] 防火墙配置
  - [X] DDoS防护
  - [X] WAF配置

- [X] **数据安全**
  - [X] 数据库定期备份
  - [X] 备份加密存储
  - [X] 异地备份

- [X] **应用安全**
  - [X] HTTPS强制
  - [X] 敏感信息加密
  - [X] 安全漏洞扫描

### 10.6 日志管理

- [X] **日志收集**
  - [X] 应用日志收集
  - [X] 访问日志收集
  - [X] 错误日志收集

- [X] **日志存储**
  - [X] 日志文件轮转
  - [X] 日志压缩存储
  - [X] 日志保留策略

- [X] **日志分析**
  - [X] 日志查询工具
  - [X] 日志可视化（ELK/Grafana）

---

## 11. 测试计划

> **说明**：测试工作贯穿整个开发周期
> **负责人**：测试工程师/全体开发  
> **验收标准**：核心功能测试覆盖率>80%，无P0/P1级Bug

### 11.1 单元测试

- [X] 🔴 **后端单元测试**
  - [X] Service层测试
    - 用户认证Service测试
    - 订单Service测试（创建、取消、状态流转）
    - 加价计算Service测试
    - 支付Service测试
  - [X] 工具函数测试
    - 金额计算函数测试（边界值、精度）
    - 日期处理函数测试
    - 加密函数测试
  - [X] 测试框架：Jest
  - [X] 目标覆盖率：>80%
  - [X] 配置测试覆盖率报告

- [X] 🟠 **前端单元测试**
  - [X] 组件测试（Vue Test Utils）
    - 表单组件测试
    - 业务组件测试
  - [X] Store测试（Pinia）
  - [X] 工具函数测试
  - [X] 测试框架：Vitest
  - [X] 目标覆盖率：>60%

### 11.2 接口测试

- [X] 🔴 **API接口测试**
  - [X] 编写Postman/Insomnia测试集合
  - [X] 认证接口测试
    - 登录成功/失败场景
    - Token刷新测试
    - 权限校验测试
  - [X] 订单接口测试
    - 创建订单（正常/异常场景）
    - 订单状态流转测试
    - 取消订单测试
  - [X] 支付接口测试
    - 支付创建测试
    - 回调处理测试（Mock）
  - [X] 导出API测试文档

### 11.3 集成测试

- [X] 🟠 **业务流程集成测试**
  - [X] 完整订货流程测试
    - 浏览物料→加入购物车→结算→支付→订单确认→配送→完成
  - [X] 订单取消流程测试
    - 1小时内自主取消
    - 超时取消申请→审批
  - [X] 加价规则测试
    - 多规则优先级匹配
    - 各级开关控制
  - [X] Webhook推送测试
    - 推送成功场景
    - 推送失败重试

### 11.4 E2E测试

- [X] 🟡 **端到端自动化测试**
  - [X] 测试框架选择：Playwright / Cypress
  - [X] 门店端核心流程测试
    - 登录→订货→支付→查看订单
  - [X] 供应商端核心流程测试
    - 登录→查看订单→确认→配送
  - [X] 管理员端核心流程测试
    - 登录→订单管理→数据报表
  - [X] 配置CI自动运行E2E测试

### 11.5 性能测试

- [X] 🟡 **压力测试**
  - [X] 测试工具：k6 / JMeter
  - [X] 接口压测场景
    - 物料列表查询（100并发）
    - 订单创建（50并发）
    - 订单列表查询（100并发）
  - [X] 目标指标
    - 平均响应时间 < 200ms
    - P99响应时间 < 1s
    - 错误率 < 0.1%
  - [X] 输出压测报告

### 11.6 安全测试

- [X] 🟠 **安全漏洞扫描**
  - [X] SQL注入测试
  - [X] XSS攻击测试
  - [X] CSRF测试
  - [X] 越权访问测试
  - [X] 敏感信息泄露检查
  - [X] 使用工具：OWASP ZAP / Burp Suite

---

## 12. 性能优化

> **负责人**：后端开发/前端开发  
> **执行时机**：开发中期及上线前

### 12.1 后端性能优化

- [X] 🟠 **数据库优化**
  - [X] SQL慢查询分析与优化
  - [X] 索引优化（根据实际查询场景）
  - [X] 查询结果分页优化（避免深分页）
  - [X] 大表分区策略（订单表按月分区）
  - [X] 读写分离配置（如需）

- [X] 🟠 **缓存优化**
  - [X] 热点数据缓存
    - 物料分类列表缓存（TTL: 1小时）
    - 供应商配送区域缓存
    - 系统配置缓存
  - [X] 查询结果缓存
    - 物料列表查询缓存
    - 门店可用供应商列表缓存
  - [X] 缓存更新策略
    - 数据变更时主动失效
    - 定时刷新兔底

- [X] 🟡 **接口优化**
  - [X] N+1查询问题排查与修复
  - [X] 批量接口优化
  - [X] 响应数据精简（按需返回字段）
  - [X] 接口合并（减少请求次数）

### 12.2 前端性能优化

- [X] 🟠 **加载性能优化**
  - [X] 路由懒加载
  - [X] 组件懒加载
  - [X] 图片懒加载
  - [X] 代码分割（Code Splitting）
  - [X] Tree Shaking配置
  - [X] 第三方库按需引入

- [X] 🟠 **渲染性能优化**
  - [X] 虚拟列表（长列表优化）
  - [X] 防抖/节流处理
  - [X] 避免不必要的重渲染
  - [X] 大数据表格分页加载

- [X] 🟡 **资源优化**
  - [X] 图片压缩与WebP格式
  - [X] 静态资源CDN部署
  - [X] Gzip/Brotli压缩
  - [X] HTTP缓存策略配置
  - [X] 预加载关键资源

### 12.3 移动端性能优化

- [X] 🟠 **APP性能优化**
  - [X] 启动速度优化
  - [X] 页面切换流畅度
  - [X] 图片加载优化
  - [X] 内存占用优化
  - [X] 包体积优化

---

## 13. 扩展功能（后续迭代）

> **优先级**：P3  
> **执行时机**：核心功能稳定后

### 13.1 用户体验增强

- [X] 🟢 **物料收藏功能**
  - [X] 收藏/取消收藏接口
  - [X] 收藏列表页面
  - [X] 快捷加入购物车

- [X] 🟢 **常购清单功能**
  - [X] 基于历史订单自动生成
  - [X] 手动创建清单
  - [X] 一键复购

- [X] 🟢 **供应商评价功能**
  - [X] 订单完成后评价
  - [X] 评分+文字评价
  - [X] 评价展示

- [X] 🟢 **价格变动通知**
  - [X] 关注物料价格变动
  - [X] 价格下降通知
  - [X] 推送/站内信通知

### 13.2 业务功能扩展

- [X] 🟢 **对账单生成**
  - [X] 按月生成对账单
  - [X] 对账单PDF导出
  - [X] 对账单确认流程

- [X] 🟢 **更多数据分析报表**
  - [X] 采购成本分析
  - [X] 供应商质量分析
  - [X] 价格趋势分析

- [X] 🟢 **多门店管理（连锁）**
  - [X] 门店分组管理
  - [X] 总部统一采购
  - [X] 分店数据汇总

### 13.3 多端扩展

- [X] 🟢 **iOS版本发布**
  - [X] iOS适配测试
  - [X] App Store上架准备
  - [X] 审核资料准备

- [X] 🟢 **小程序版本**
  - [X] 微信小程序适配
  - [X] 小程序审核上架

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

- [X] **Week 1**
  - [X] 技术选型确认
  - [X] 开发环境搭建
  - [X] Monorepo项目初始化
  - [X] 数据库设计评审

- [X] **Week 2**
  - [X] 数据库表创建与迁移
  - [X] 共享包开发（types/utils/constants）
  - [X] 基础组件开发启动
  - [X] API文档框架搭建

- [X] **M1交付物**
  - [X] 可运行的项目骨架
  - [X] 数据库迁移脚本
  - [X] 开发环境文档

### M2: 核心功能开发-后端（第3-5周）

- [X] **Week 3**
  - [X] 用户认证模块完成
  - [X] 权限管理模块完成
  - [X] 门店/供应商基础CRUD

- [X] **Week 4**
  - [X] 物料管理模块完成
  - [X] 购物车功能完成
  - [X] 订单创建功能完成

- [X] **Week 5**
  - [X] 订单状态管理完成
  - [X] 支付接口对接
  - [X] Webhook推送功能完成

- [X] **M2交付物**
  - [X] 完整的后端API
  - [X] API文档（Swagger）
  - [X] 单元测试报告

### M3: 核心功能开发-前端（第6-8周）

- [X] **Week 6**
  - [X] 门店端Web：登录、首页、物料浏览
  - [X] 供应商端Web：登录、首页
  - [X] 管理员端Web：登录、首页

- [X] **Week 7**
  - [X] 门店端Web：购物车、结算、订单管理
  - [X] 供应商端Web：订单管理、物料价格管理
  - [X] 管理员端Web：订单管理、供应商管理

- [X] **Week 8**
  - [X] 门店端Web：统计分析、账户设置
  - [X] 供应商端Web：配送设置、统计
  - [X] 管理员端Web：加价管理、系统设置

- [X] **M3交付物**
  - [X] 三端Web后台可用版本
  - [X] 前端组件文档

### M4: 移动端开发（第9-10周）

- [X] **Week 9**
  - [X] 门店端APP：首页、物料浏览、购物车
  - [X] 供应商端APP：首页、订单列表

- [X] **Week 10**
  - [X] 门店端APP：订单管理、支付、我的
  - [X] 供应商端APP：订单操作、物料价格、我的

- [X] **M4交付物**
  - [X] 门店端APP（Android）
  - [X] 供应商端APP（Android）

### M5: 集成与联调（第11周-第12周中）

- [X] **Week 11**
  - [X] 前后端联调
  - [X] 支付流程联调
  - [X] Webhook推送联调
  - [X] Bug修复

- [X] **Week 12前半**
  - [X] 全流程走通测试
  - [X] 边界场景测试
  - [X] Bug修复

- [X] **M5交付物**
  - [X] 联调通过的完整系统
  - [X] Bug修复记录

### M6: 测试与优化（第12周中-第13周）

- [X] **Week 12后半**
  - [X] 功能测试执行
  - [X] 接口测试执行
  - [X] 安全测试

- [X] **Week 13**
  - [X] 性能测试与优化
  - [X] E2E测试
  - [X] 最终Bug修复

- [X] **M6交付物**
  - [X] 测试报告
  - [X] 性能测试报告
  - [X] 优化后的系统

### M7: 部署上线（第14周）

- [X] **Week 14**
  - [X] 生产环境准备
  - [X] 数据初始化
  - [X] 灰度发布
  - [X] 正式上线
  - [X] 上线监控

- [X] **M7交付物**
  - [X] 生产环境部署
  - [X] 运维文档
  - [X] 用户使用手册

---

## 15. 附录

### A. 技术规范文档清单

- [X] 《技术选型报告》
- [X] 《开发环境搭建指南》
- [X] 《代码规范文档》
- [X] 《Git工作流规范》
- [X] 《API设计规范》
- [X] 《数据库设计文档》

### B. 接口文档

- [X] Swagger/OpenAPI文档
- [X] Postman Collection

### C. 部署文档

- [X] 《服务器部署手册》
- [X] 《CI/CD配置文档》
- [X] 《监控告警配置文档》

### D. 用户文档

- [X] 《门店端使用手册》
- [X] 《供应商端使用手册》
- [X] 《管理员端使用手册》

---

> **文档说明**：本开发文档根据供应链系统设计文档和原型文件生成，涵盖了系统开发的所有主要功能点。开发过程中请根据实际情况调整任务优先级和实现细节。
>
> **版本历史**：
> - v1.0 - 初始版本
> - v1.1 - 添加详细技术规格、测试计划、性能优化、项目里程碑
> - v1.2 - 增加Ant Design组件库集成要求，所有Web前端开发必须使用Ant Design实现
> - v1.3 - 根据供应链系统设计文档完善以下内容：
>   - 支付系统：添加利楚扫呗聚合支付接口对接详细任务（service_id=015/016/020/030/031/041）
>   - 支付流程：补充支付手续费计算规则（3‰费率、金额展示规则）
>   - 订单管理：添加详细的订单取消流程（自主取消/申请取消/审批/恢复）
>   - 配送设置：添加配送模式管理（自配送/快递配送）和区域匹配逻辑
>   - 供应商管理：补充显示名称（display_name）管理详细说明
> - v1.4 - 继续丰富开发任务详情：
>   - 订单模块：添加订单状态流转图和状态码说明表
>   - 购物车：补充分批结算机制详细逻辑（起送价检查、可结算/不可结算处理）
>   - 加价规则：补充优先级数值说明（1-7级，从单维匹配到三维精确匹配）
>   - Webhook推送：添加消息格式示例（新订单通知Markdown模板）
>   - 系统配置：补充配置项详细说明（config_key和默认值）
>   - 支付回调：补充利楚扫呗回调参数解析和响应格式
