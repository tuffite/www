---
title: 'Create a Rust application'
description: 'From an empty folder to a typed desktop application.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="scaffold"></span>

## Scaffold the project

Install the CLI as described in Quick start. `tuff init` creates `Cargo.toml`, `build.rs`, `src/lib.rs`, `shell_api.mojom`, `tuffite.json`, a small HTML frontend, and generated bindings. The directory must be empty. The generated project depends on the matching published `tuffite` SDK.

```sh
tuff init my-app
cd my-app
tuff check
tuff build --release
```

<span id="sdk"></span>

## Use the published SDK

The application uses the Rust library; `build.rs` enables the build helpers for runtime resolution and binding generation. Keep the SDK version aligned with the CLI that created the project. A compatible Framework Distribution is resolved automatically during native builds.

```toml
[dependencies]
tuffite = { version = "0.1.0", default-features = false }

[build-dependencies]
tuffite = { version = "0.1.0", default-features = false, features = ["build"] }
```

<span id="application"></span>

## Implement the application lifecycle

`Browser::new` receives `BrowserContext` only in the browser process. `#[tuffite::browser]` marks the implementation; `#[tuffite::main]` exports the ABI entry table and `app::Builder` registers commands explicitly. Handler types are checked against the generated endpoint declarations at compile time.

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
