---
title: '开发 Playground'
description: '仓库内的 Rust 应用与 Framework 集成示例。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="setup"></span>

## 从外层克隆开始

Playground 位于 `src/tuffite/playground`，通过 Cargo path 依赖使用相邻 SDK。开发命令构建并打包本地 Framework 源码、刷新原生应用，并以 Vite HMR 启动 Web 前端。

```sh
mise run setup
mise run dev
```

<span id="commands"></span>

## 检查类型化命令

`shell_api.mojom` 声明 `module playground`，并导入 `mojom_data.mojom`。从 `generated/index.js` 导入 `commands`，调用 `doSomething(message)`、`checkUtilitySession()`、`checkJavascriptExtension()` 和 `echoMojom(value)`。Rust 实现生成的接口 trait。修改 Mojom 契约时同步更新生成的 JavaScript/TypeScript 绑定。

```sh
mise run tuff -- check --manifest playground/tuffite.json
mise run tuff -- build --manifest playground/tuffite.json
```

<span id="native"></span>

## 开发原生运行时

使用 Playground 验证原生修改、Explorer 集成、utility 会话和生成的 ShellAPI 绑定。Framework 构建提供明确的本地 Distribution；需要独立应用示例时打包 Playground。

```sh
mise run framework -- test --suite framework
mise run framework -- test --suite smoke
mise run tuff -- package --manifest playground/tuffite.json
```
