---
title: 'Windows & Explorer'
description: 'Manage native windows and embed independent browser surfaces.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="windows"></span>

## Native window control

Initial windows are declared in `app.windows`. The generated `window` facade supports create, focus, minimize, maximize, bounds, title, fullscreen, and close. Window IDs are `int64` values represented as `bigint` in JavaScript; pass `null` for a nullable current-window target.

```javascript
import { window as nativeWindow } from 'tuffite';
const current = await nativeWindow.current();
await nativeWindow.setTitle('My application', current.id);
const windows = await nativeWindow.list();
```

<span id="explorer"></span>

## Embed an Explorer surface

Explorer is Tuffite’s integrated Blink/Content browser element. Its policy controls creation, JavaScript execution, partitioning, and lifecycle. Grant the relevant explorer capability for trusted application origins. Playground contains transfer, history, nested surface, and isolation examples.

```json
{
  "identifier": "browser-ui",
  "origins": ["myapp://main"],
  "explorer": { "create": true, "executeJavaScript": false },
  "shellApi": ["tuffite.Window.*"]
}
```
