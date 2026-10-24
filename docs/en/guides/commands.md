---
title: 'Call Rust from the frontend'
description: 'Declare once. Generate bindings. Register a typed handler.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="declare"></span>

## Declare the contract

Save this as `shell_api.mojom` and list it in `build.mojomSources`. The module declares the namespace; interfaces and methods define canonical permission names such as `myapp.Commands.Ping`. Every method needs an explicit ordinal. `tuff dev`, `tuff build`, and `tuff package` generate Rust and JavaScript/TypeScript bindings. TypeScript declarations are outputs, not contract inputs.

```mojom
module myapp;

interface Commands {
  Ping@0(string message) => (string result);
};
```

<span id="handle"></span>

## Register the handler

Include `OUT_DIR/bindings.rs` in `mod shell_api`, implement the generated `Commands` trait, and register it with `#[tuffite::browser(interfaces(shell_api::Commands))]`. The Rust compiler checks method arguments and results. The build script combines `framework::Resolver` and `shell_api::Generator` through `build::Builder`.

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

## Invoke the generated facade

Generated clients are ES module exports; importing them installs no business methods on `window`. Permit `myapp.Commands.Ping` or a suitable pattern such as myapp.* in a capability matching the frontend origin. The generated client handles the typed Mojom codec and application transport.

```javascript
import { commands } from './generated/index.js';
const answer = await commands.ping('Tuffite');
```
