---
title: '测试与打包 Framework'
description: '验证修改涉及的层次，再构建可分发运行时。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="suites"></span>

## 选择验证套件

- `framework`：生成绑定、浏览器编解码器测试、Python 测试、Rust 测试、格式检查和 Clippy。
- `native`：编译并运行原生单元测试。
- `smoke` / `explorer`：打包 Playground，通过 CDP 验证原生集成。

```sh
python3 x.py test --suite framework
python3 x.py test --suite native
python3 x.py test --suite smoke
python3 x.py test --suite explorer
```

<span id="package"></span>

## 打包本地 Distribution

打包默认进行增量构建。`--skip-build` 显式打包已有输出。Framework 应用构建使用明确的本地 Distribution 并禁用自动下载，避免 C++ 修改运行在远程运行时上而不被察觉。

```sh
python3 x.py package --profile release --target-cpu x64
cargo run --package tuffite --bin tuff -- package --manifest playground/tuffite.json
```
