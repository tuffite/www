---
title: 'Test & package the Framework'
description: 'Validate the layer you changed, then build a distributable runtime.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="suites"></span>

## Choose the validation suite

- `framework`: generated bindings, browser codec tests, Python tests, Rust tests, formatting, and Clippy.
- `native`: compile and run native unit tests.
- `smoke` / `explorer`: package Playground and exercise native integration through CDP.

```sh
python3 x.py test --suite framework
python3 x.py test --suite native
python3 x.py test --suite smoke
python3 x.py test --suite explorer
```

<span id="package"></span>

## Package a local Distribution

Packaging builds incrementally by default. `--skip-build` explicitly packages existing output. Framework application builds receive a local Distribution with automatic download disabled, so C++ edits cannot silently run against a remote runtime.

```sh
python3 x.py package --profile release --target-cpu x64
cargo run --package tuffite --bin tuff -- package --manifest playground/tuffite.json
```
