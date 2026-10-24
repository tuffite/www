---
title: '构建与分发'
description: '解析匹配的原生运行时，然后打包应用。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="resolve"></span>

## 解析 Framework

- `TUFFITE_FRAMEWORK_DIST` 选择已解压的精确 Distribution，具有最高优先级。显式路径不会回退。
- `TUFFITE_FRAMEWORK_DIR` 启用与目标平台和 profile 匹配的兼容本地 release 输出。
- 没有本地产物时，解析器检查版本化缓存，并在允许下载时获取匹配版本。

```sh
tuff doctor
tuff framework verify /path/to/distribution
tuff package --name my-app
```

<span id="identity"></span>

## 保持 SDK 与运行时兼容

Distribution 包含 `tuffite-framework.json`、平台库、启动器及 Chromium 资源。解析过程检查 Framework 版本、目标、ABI 兼容性、安全路径和文件哈希。使用与 SDK 发布版本匹配的 Distribution。

<span id="resources"></span>

## 打包显式资源

`bundle.resources` 包含应用资源。`app.assets` 定义前端请求如何访问打包文件。打包前先运行前端生产构建。签名、安装器和发布版本是组装应用包之外的独立步骤。
