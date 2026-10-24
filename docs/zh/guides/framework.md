---
title: 'Framework 贡献者环境'
description: '在 Chromium 内工作，同时保持仓库边界清晰。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="checkout"></span>

## 准备完整工作区

外层根目录管理 `.gclient`、Mise 和固定版本 Depot Tools。`src/tuffite` 是独立 Framework 仓库；`src` 是 Chromium 父仓库。修改原生集成前，分别检查所有仓库的 Git 状态。

```sh
git clone https://github.com/tuffite/workspace.git
cd workspace
mise trust
mise run setup
mise run framework -- build --framework
mise run dev
```

<span id="tools"></span>

## 日常贡献者命令

`x.py` 管理原生构建、打包、测试和依赖 roll；`spo` 管理基于 Git 的补丁创作及恢复；`tuff` 是应用 CLI。运行原生任务时保持外层 Mise 环境激活。

```sh
cd src/tuffite
python3 x.py build --run
python3 x.py compdb
python3 x.py test --suite framework
cargo spo status --all
```

<span id="layout"></span>

## 源码归属

```text
src/tuffite/
├── framework/          # Native implementation and public ABI
├── components/         # Reusable components and integration
├── crates/             # Rust SDK, ABI, runtime, macros, spo
├── packages/tuffite/    # JavaScript runtime and Vite plugin
├── playground/         # Integration fixture
├── patches/chromium/   # Ordered Chromium mailboxes
└── DEPS                # The sole Chromium revision declaration
```
