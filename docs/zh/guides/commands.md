---
title: '从前端调用 Rust'
description: '声明一次，生成绑定，注册类型化处理器。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="declare"></span>

## 声明接口契约

保存为 `shell_api.mojom`，并在 `build.mojomSources` 中列出。module 声明命名空间，接口和方法定义 `myapp.Commands.Ping` 等规范权限名。每个方法都需要显式序号。`tuff dev`、`tuff build` 和 `tuff package` 生成 Rust 及 JavaScript/TypeScript 绑定。TypeScript 声明是输出，不再作为契约输入。

```mojom
module myapp;

interface Commands {
  Ping@0(string message) => (string result);
};
```

<span id="handle"></span>

## 注册处理器

在 `mod shell_api` 中包含 `OUT_DIR/bindings.rs`，实现生成的 `Commands` trait，并通过 `#[tuffite::browser(interfaces(shell_api::Commands))]` 注册。Rust 编译器检查方法参数和返回值。构建脚本通过 `build::Builder` 组合 `framework::Resolver` 和 `shell_api::Generator`。

```rust
#[tuffite::browser(interfaces(shell_api::Commands))]
impl tuffite::Browser for App {
    fn new(_context: tuffite::BrowserContext) -> tuffite::ApplicationResult<Self> {
        Ok(Self)
    }
}

impl shell_api::Commands for App {
    fn ping(&self, message: String) -> Result<String, tuffite::CommandError> {
        Ok(format!("Hello, {message}"))
    }
}

// Export with #[tuffite::main(browser = App)] and app::Builder::new().
```

<span id="invoke"></span>

## 调用生成门面

生成客户端通过 ES 模块导出，导入时不会在 `window` 上安装业务方法。在匹配前端 origin 的 capability 中允许 `myapp.Commands.Ping`，或 myapp.* 等合适的模式。生成客户端处理类型化 Mojom 编解码和应用传输。

```javascript
import { commands } from './generated/index.js';
const answer = await commands.ping('Tuffite');
```
