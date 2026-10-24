---
title: '能力与安全'
description: '为每个前端授予它真正需要的原生能力。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="origins"></span>

## 能力按 origin 匹配

在 `app.security.capabilities` 下添加能力条目。每个条目列出允许的 origin 和 ShellAPI 方法。方法选择器 * 覆盖这些 origin 的全部已注册方法；文件、URL 和窗口 scope 仍然生效。Playground 使用 `tuffite.Fs.*` 和 `tuffite.Window.*` 分组，并将 resource 读取与可写目录分开声明。命名空间组的 scope 只作用于消费资源的方法。使用范围明确的方法权限与显式文件系统 scope。配置 schema 验证结构，`tuff check` 还会验证语义约束。

```json
{
  "identifier": "main-window",
  "origins": ["myapp://main"],
  "shellApi": ["myapp.Commands.Ping", "tuffite.Window.Current"]
}
```

<span id="csp"></span>

## 配置 CSP 与资源路由

`app.security.csp` 控制前端内容安全策略。`app.assets` 将明确的 origin 和请求路径映射到打包文件。资源路由和原生权限是独立契约：注册文件不会授予原生能力。

<span id="development"></span>

## 经过认证的开发模式

`tuff dev` 刷新原生开发包并启动回环 Web 服务。每次运行的 token 和就绪探测会验证渲染器覆盖。兼容 Framework 需要编译开发模式功能。不要将开发服务器或 CDP 端口公开暴露。
