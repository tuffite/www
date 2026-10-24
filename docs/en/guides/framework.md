---
title: 'Framework contributor setup'
description: 'Work inside Chromium without losing repository boundaries.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="checkout"></span>

## Prepare the full workspace

The outer root owns `.gclient`, Mise, and pinned Depot Tools. `src/tuffite` is the separate Framework repository; `src` is the Chromium parent repository. Inspect Git status in all repositories before changing native integration.

```sh
git clone https://github.com/tuffite/workspace.git
cd workspace
mise trust
mise run setup
mise run framework -- build --framework
mise run dev
```

<span id="tools"></span>

## Daily contributor commands

`x.py` owns native build, packaging, tests, and dependency rolls. `spo` owns Git-backed patch authoring and recovery. `tuff` is the application CLI. Run native tasks with the outer Mise environment active.

```sh
cd src/tuffite
python3 x.py build --run
python3 x.py compdb
python3 x.py test --suite framework
cargo spo status --all
```

<span id="layout"></span>

## Source ownership

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
