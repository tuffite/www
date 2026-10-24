---
title: '创建 Rust 应用'
description: '从空目录开始，构建类型安全的桌面应用。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="scaffold"></span>

## 初始化项目

按快速开始安装 CLI。`tuff init` 生成 `Cargo.toml`、`build.rs`、`src/lib.rs`、`shell_api.mojom`、`tuffite.json`、简单 HTML 前端及生成绑定。目标目录必须为空。生成的项目依赖匹配版本的已发布 `tuffite` SDK。

```sh
tuff init my-app
cd my-app
tuff check
tuff build --release
```

<span id="sdk"></span>

## 使用已发布的 SDK

应用使用 Rust 库；`build.rs` 启用构建辅助功能，用于解析运行时和生成绑定。SDK 版本需与创建项目的 CLI 保持一致。原生构建会自动解析兼容的 Framework Distribution。

```toml
[dependencies]
tuffite = { version = "0.1.0", default-features = false }

[build-dependencies]
tuffite = { version = "0.1.0", default-features = false, features = ["build"] }
```

<span id="application"></span>

## 实现应用生命周期

`Browser::new` 仅在 browser 进程接收 `BrowserContext`。`#[tuffite::browser]` 标记实现；`#[tuffite::main]` 导出 ABI 入口表，`app::Builder` 显式注册命令处理器。编译时会根据生成的端点声明检查处理器类型。

```rust
use tuffite::{BrowserContext, Browser, ApplicationResult, CommandError};

mod shell_api {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

struct App;
#[tuffite::browser(interfaces(shell_api::Commands))]
impl Browser for App {
    fn new(_context: BrowserContext) -> ApplicationResult<Self> { Ok(Self) }
}

#[tuffite::main(browser = App)]
fn main() -> tuffite::app::Builder<App> {
    tuffite::app::Builder::new()
}

impl shell_api::Commands for App {
    fn ping(&self, message: String) -> Result<String, CommandError> {
        Ok(message)
    }
}
```
