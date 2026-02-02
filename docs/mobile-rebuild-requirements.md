# 移动端现有开发内容与需求梳理

## 背景

- 原移动端位于 `apps/mobile`，已删除，准备更换框架重建。
- 本文用于保留现有功能范围与需求要点，供后续重建对齐。

## 技术与结构（旧项目）

- Taro 3.6.23 + React 18 + TypeScript
- Redux Toolkit + redux-persist（Taro Storage adapter）
- UI：taro-ui + 自定义样式（SCSS）
- 网络：`utils/request.ts` 封装，默认 `http://localhost:8080/api`
- 推送/通知：微信订阅消息模板 + 通知跳转工具
- 版本更新：模拟版本检测 + 更新弹窗 + 下载逻辑
- 多角色：admin / sub_admin / supplier / store

## 角色与权限

- 多角色用户进入选择角色页面，单角色直接进入主页
- 角色切换后按角色配置跳转首个入口
- 基于当前角色做权限判断

## 主要业务流程（门店端）

- 物料浏览：分类/搜索/列表/详情（供应商报价）
- 行情对比：同物料多供应商报价、最低价提示、加入购物车
- 购物车：按供应商分组、起送价校验、数量增减、删除
- 结算：按供应商拆单、备注、服务费、提交后跳支付
- 支付：微信/支付宝模拟支付
- 订单：列表、筛选、详情、取消、再来一单
- 我的：账号信息、月度统计、入口（地址/常购/统计/设置）

## 供应商端

- 首页：今日统计、待处理订单、快速操作（确认/配送/详情）
- 订单：待处理/进行中/已完成分组列表
- 订单详情：状态流转（确认→配送→完成）、联系门店
- 价格管理：物料列表、改价、库存切换
- 我的：供应商信息、今日统计、配送设置

## 管理端

- 首页：今日数据概览、异常预警（取消/支付超时/配送延迟）
- 订单管理：搜索、状态筛选、详情查看
- 门店管理：搜索、状态、月订单统计
- 供应商管理：搜索、状态、起送价、月订单统计
- 快捷查询：门店/供应商/订单混合搜索
- 个人中心：权限列表、关键指标、设置/关于/退出

## 页面清单（旧项目）

- 已注册到配置的页面：
  - 门店端：`pages/index`, `pages/login`, `pages/select-role`, `pages/market`, `pages/cart`, `pages/order`, `pages/mine`
  - 供应商端：`pages/supplier/index`, `pages/supplier/orders`, `pages/supplier/orders/detail`, `pages/supplier/price`, `pages/supplier/profile`
  - 管理端：`pages/admin/index`, `pages/admin/orders`, `pages/admin/stores`, `pages/admin/suppliers`, `pages/admin/search`, `pages/admin/profile`
- 已实现但未注册（需要纳入新框架路由）：
  - `pages/materials`, `pages/materials/detail`, `pages/checkout`, `pages/payment`, `pages/order/detail`
- 菜单引用但未实现：
  - 地址管理、常购清单、订货统计、设置等

## 关键数据模型（来自旧实现）

- 用户：`id, username, phone, avatar, roles[]`
- 订单：`orderNo, supplier/store, status, items, amount, serviceFee, createTime`
- 物料：`name, brand, spec, minPrice, category`
- 供应商报价：`price, minOrderAmount, minQuantity, deliveryDays`
- 购物车项：`materialSkuId, supplierId, price, quantity, minQuantity, stepQuantity`

## 需求与重建要点

- 登录与身份：真实登录接口、token/refreshToken、记住登录、角色拉取与切换
- 路由与导航：按角色生成 TabBar / 主页入口
- 物料与行情：搜索、分类、品牌/规格、最低价展示、按供应商比较
- 购物车：按供应商拆单、起送价/起订量、阶梯数量、结算服务费规则
- 订单生命周期：创建→确认→配送→完成→取消/退款
- 供应商功能：价格维护、库存、配送设置、订单处理
- 管理功能：门店/供应商管理、异常预警、订单审查
- 通知/推送：订阅消息模板配置、通知跳转策略
- 版本更新：版本检测 API、强更/非强更策略
- 数据接入：页面当前为 mock，需要对接后端接口
