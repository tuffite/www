---
title: '窗口与 Explorer'
description: '管理原生窗口，嵌入独立浏览器表面。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="windows"></span>

## 原生窗口控制

初始窗口由 `app.windows` 声明。生成的 `window` 门面支持创建、聚焦、最小化、最大化、边界、标题、全屏和关闭。窗口 ID 是 `int64` 值，在 JavaScript 中表示为 `bigint`；可空的当前窗口目标参数使用 `null`。

```javascript
import { window as nativeWindow } from 'tuffite';
const current = await nativeWindow.current();
await nativeWindow.setTitle('My application', current.id);
const windows = await nativeWindow.list();
```

<span id="explorer"></span>

## 嵌入 Explorer 表面

Explorer 是 Tuffite 集成在 Blink/Content 中的浏览器元素。它的策略控制创建、JavaScript 执行、分区和生命周期。为可信应用 origin 授予对应 explorer 能力。Playground 包含转移、历史、嵌套表面和隔离示例。

```json
{
  "identifier": "browser-ui",
  "origins": ["myapp://main"],
  "explorer": { "create": true, "executeJavaScript": false },
  "shellApi": ["tuffite.Window.*"]
}
```
