---
title: '快速开始'
description: '安装 CLI，创建应用，启动原生应用包。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="prerequisites"></span>

## 准备开发环境

安装当前稳定版 Rust 工具链（含 Cargo）以及平台 C/C++ 链接工具：`macOS` 使用 Xcode Command Line Tools，Windows 使用带 C++ 支持的 Visual Studio Build Tools，Linux 使用 C/C++ 工具链。目标平台需要有已发布的 Framework Distribution。最小 HTML 应用不需要 JavaScript 包管理器。

<span id="install"></span>

## 使用源码 CLI

Tuffite 目前是实验性源码版本。公共注册表中的 0.0.0 仅用于占位，尚未提供当前 0.1.0 SDK 和 CLI。请准备源码工作区，并从其根目录运行 `mise run tuff -- <参数>`。

```sh
git clone https://github.com/tuffite/workspace.git
cd workspace
mise trust
mise run setup
mise run tuff -- --help
```

:::note[注意]
运行 `mise run dev` 构建并启动 Playground，体验当前版本。匹配的 crates 和 Framework Distribution 发布后，才能使用已发布 SDK 创建独立应用；下方示例描述届时的流程。
:::

<span id="create"></span>

## 创建并打包应用

`tuff init` 创建带最小 HTML 前端和类型化绑定的 Rust 应用。打包时编译应用并解析兼容的预构建 Chromium 运行时，需要时下载到版本化缓存。后续构建复用缓存。

```sh
tuff init my-app
cd my-app
tuff check
tuff package --name my-app
```

<span id="launch"></span>

## 启动原生应用

应用包包含应用库、原生启动器、Chromium 运行时和前端资源。如需前端开发服务器，先配置 `build.devPackage`、`build.devUrl` 和 `build.beforeDevCommand`，再使用 `tuff dev`。前端工具由你自行选择。

```sh
# macOS / Linux
./dist/my-app/run-tuffite.sh

# Windows
.\dist\my-app\run-tuffite.cmd
```
