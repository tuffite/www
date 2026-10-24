---
title: 'Develop Playground'
description: 'The in-repository example for Rust applications and Framework integration.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="setup"></span>

## Start from the outer clone

Playground lives in `src/tuffite/playground` and uses the adjacent SDK through Cargo path dependencies. The development command builds and packages local Framework sources, refreshes the native application, and launches its web frontend with Vite HMR.

```sh
mise run setup
mise run dev
```

<span id="commands"></span>

## Check typed commands

`shell_api.mojom` declares `module playground` and imports `mojom_data.mojom`. Import `commands` from `generated/index.js` to call `doSomething(message)`, `checkUtilitySession()`, `checkJavascriptExtension()`, and `echoMojom(value)`. Rust implements generated interface traits. Keep Mojom contracts and regenerated JavaScript/TypeScript bindings together.

```sh
mise run tuff -- check --manifest playground/tuffite.json
mise run tuff -- build --manifest playground/tuffite.json
```

<span id="native"></span>

## Work on the native runtime

Use Playground to exercise native changes, Explorer integration, utility sessions, and generated ShellAPI bindings. Framework builds supply an explicit local Distribution; package Playground when you need a standalone application fixture.

```sh
mise run framework -- test --suite framework
mise run framework -- test --suite smoke
mise run tuff -- package --manifest playground/tuffite.json
```
