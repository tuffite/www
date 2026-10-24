---
title: '项目结构'
description: '清晰组织应用代码、生成契约和原生产物。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="files"></span>

## 应用工作区

应用库使用 `crate-type = ["cdylib"]`。`build.rs` 通过 `tuffite::build::Builder` 组合 `tuffite::build::framework::Resolver` 和 `tuffite::build::shell_api::Generator`。不要手工修改生成绑定。

```text
my-app/
├── Cargo.toml          # Rust library and SDK dependencies
├── build.rs            # Distribution + ShellAPI build helpers
├── tuffite.json        # Application, security, build, bundle
├── shell_api.mojom      # Typed Mojom application contracts
├── src/lib.rs          # Application and handlers
├── generated/          # Checked-in JavaScript/TypeScript bindings
└── ui/                 # Web frontend
```

<span id="ownership"></span>

## 分离源码与产物

提交配置文件、声明文件和生成的 JavaScript/TypeScript 契约。Cargo 输出、原生包、Vite 输出、下载的 Distribution 和本机设置放在忽略路径中。将应用放在自己的仓库中。
