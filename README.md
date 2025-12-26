# What IMS AI Project

这是一个使用 Turborepo 构建的 monorepo 项目。

## 项目结构

```text
.
├── apps/          # 应用程序目录
├── packages/      # 共享包目录
├── turbo.json     # Turborepo 配置
└── pnpm-workspace.yaml
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 添加新应用

在 `apps/` 目录下创建新的应用程序。

## 添加共享包

在 `packages/` 目录下创建可复用的共享包。
