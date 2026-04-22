# PhD Master Workspace

科研 · 自律 · 成长的博士生一站式工作台（支持 PWA + WebDAV 备份同步）

基于小红书 @不是黑子是癫子 的 2.0 工作台优化版本，新增 WebDAV 同步能力。

## 功能特点

- 纯前端页面，开箱即用
- 数据本地持久化（`localStorage`）
- 支持 WebDAV 备份/恢复（坚果云、Nextcloud 等）
- 支持安装为桌面应用（PWA）

![](D:\CodeLab\Phd-pwa\imgs\1.jpg)

![](D:\CodeLab\Phd-pwa\imgs\2.jpg)

## 环境要求

- 浏览器：Chrome / Edge（推荐最新版本）
- 若需 WebDAV 同步：需要 Node.js（用于本地代理）

## 安装 Node.js（WebDAV 必需）

如果你只想本地离线使用，可跳过本节。  
如果你需要 WebDAV 同步，请先安装 Node.js。

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装 **LTS** 版本
3. 安装后打开终端执行：

```bash
node -v
npm -v
```

看到版本号即安装成功。

## 快速开始

### 方式 A：直接打开 HTML（最简单）

双击 `博士工作台2.0.html` 即可：

- ✅ 本地记录、统计、导入导出可用
- ❌ WebDAV 同步不可用（浏览器跨域限制）
- ❌ PWA 安装体验受限

### 方式 B：本地代理启动（推荐）

适合需要 WebDAV 同步和稳定 PWA 体验的场景。

#### 一键启动（Windows）

- 双击 `start-local.bat` 启动
- 双击 `stop-local.bat` 停止

#### 手动启动

```bash
cd phd-pwa
npm install
node proxy.js
```

打开：`http://localhost:9876`

## WebDAV 同步配置

### 前置条件

1. 已通过代理启动（访问地址为 `http://localhost:9876`）
2. 已有 WebDAV 账号（如坚果云应用密码）

### 坚果云端准备

1. 登录 [坚果云](https://www.jianguoyun.com)
2. 进入账户安全设置 -> 第三方应用管理
3. 添加应用，获取应用密码（不是登录密码）
4. 记录 WebDAV 地址（通常是 `https://dav.jianguoyun.com/dav/`）

### 工作台端填写

进入“数据管理 -> WebDAV 同步策略”，填写：

- 服务器地址：`http://localhost:9876/dav/`
- 账号：坚果云邮箱
- 密码：坚果云应用密码
- 同步路径：`phd-workspace/`（默认即可）

> 代理模式下，系统会自动把外部 WebDAV 地址改写为 `http://localhost:9876/dav/`，避免 CORS 问题。

## 数据存储与清理

应用数据默认存储在浏览器本地：

- 业务数据：`phd_master_workspace_merged_v1`
- WebDAV 配置：`phd_webdav_prefs`
- WebDAV 日志：`phd_webdav_log`

建议：

- 定期导出 JSON 备份
- 定期执行 WebDAV 上传

## 常见问题

### WebDAV 报错 `Failed to fetch` / CORS

按顺序检查：

1. 代理是否已启动（`node proxy.js` 或 `start-local.bat`）
2. 页面是否从 `http://localhost:9876` 打开
3. 服务器地址是否为 `http://localhost:9876/dav/`

### 修改了 HTML 但页面没变化

通常是 Service Worker 缓存。可尝试：

- `Ctrl + F5` 强制刷新
- DevTools 清缓存并重新加载

### 换电脑如何迁移数据

- 方案 1：旧设备导出 JSON -> 新设备导入
- 方案 2：旧设备 WebDAV 上传 -> 新设备 WebDAV 下载恢复

## 项目结构

```text
phd-pwa/
├── 博士工作台2.0.html
├── manifest.json
├── sw.js
├── proxy.js
├── start-local.bat
├── stop-local.bat
├── package.json
└── icons/
```

## 技术栈

- 前端：HTML + CSS + JavaScript（无框架）
- 图表：Chart.js
- 样式：Tailwind CSS（CDN）
- 存储：Browser localStorage
- 同步：Node.js + http-proxy + WebDAV
- PWA：manifest + Service Worker
