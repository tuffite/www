---
title: 'Browser & utility processes'
description: 'Declare process roles and load Rust or V8 services on demand.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="entry"></span>

## One entry, explicit definitions

The main factory assembles metadata once per loaded library, without constructing `Browser` or `Utility` state. `before_startup` runs before Chromium `ContentMain` for `Browser`, `Utility`, `Renderer`, `Gpu` and `Other` roles. The OS process already exists. `process_kind()` is read-only; `argv()`/`argv_mut()` expose owned arguments. The hook must preserve the executable and Chromium process type.

```rust
#[tuffite::main(browser = App, utilities(Indexer, Parser))]
fn main() -> tuffite::app::Builder<App> {
    tuffite::app::Builder::new()
        .before_startup(|launch| {
            if launch.process_kind() == tuffite::app::ProcessKind::Browser {
                launch.argv_mut().retain(|arg| arg != "--business-debug");
            }
            Ok(())
        })
}
```

<span id="services"></span>

## Start services from `Browser`

Mark a Rust `Utility` implementation with `#[tuffite::utility(name = "indexer")]`; implement `new()` and `invoke()`. A V8 definition uses the same attribute on an impl of `utility::V8`. `BrowserContext::utilities().sessions().create(name, ...)` opens a Rust session; `utilities().create_v8(name, on_closed, on_created)` opens V8. Registration is deferred: the first request launches a supervised utility process for that service name; later sessions reuse a healthy process. Rust `Utility::new` runs in the child, while each V8 session owns an isolate.

<span id="v8"></span>

## Resolve V8 resources on demand

`V8::new(V8Context)` lazily creates one `Browser`-side Rust provider per registered name and `Browser` runtime. `entry(&self)` and `resolve(&self, url)` use instance state. The context provides service configuration, the app manifest, executor, typed state and a stopping signal. `BrowserContext::set_state(Arc<T>)` shares state with `V8Context::state::<T>()` within `Browser`. Rust `Utility::new(UtilityContext)` runs in the child and receives only its own serialized `app.utilities.<name>.configuration` over Mojo/ABI 2.5 (64 KiB maximum). Session init and JS isolate state remain independent; Rust objects never cross IPC.

`Utility` requests the entry and discovered static dependencies over Mojo. The `Browser` worker runtime calls `resolve(url)` with canonical URLs. Relative entry paths become `<app-scheme>://<name>.utility/path.mjs`; absolute HTTPS/file entries and imports are also supported. All requests first go through your resolver: `Some(source)` overrides, `None` falls back to `app.assets`, and `Err` fails without fallback. The default resolve returns `None`. HTTPS/file resources require a resolver response; it implements network and filesystem policy. Embedded, file-loaded and generated sources share `ModuleSource`; the returned name must equal the requested URL. Modules are compiled and cached once per session before synchronous linking, including shared and cyclic dependencies. New sessions resolve fresh sources. No filesystem access is granted to V8.

```rust
use tuffite::utility::v8::{Error, ModuleSource};

struct Parser;
#[tuffite::utility(name = "parser")]
impl tuffite::utility::V8 for Parser {
    fn new(context: tuffite::utility::V8Context) -> tuffite::ApplicationResult<Self> {
        let _name = context.name();
        Ok(Self)
    }

    fn entry(&self) -> &'static str { "entry.mjs" }

    fn resolve(&self, url: &str) -> Result<Option<ModuleSource>, Error> {
        let source = match url {
            "myapp://parser.utility/entry.mjs" => include_str!("entry.mjs").to_owned(),
            "myapp://parser.utility/helpers.mjs" => std::fs::read_to_string("helpers.mjs")?,
            _ => return Ok(None),
        };
        Ok(Some(ModuleSource::new(url.to_owned(), source)))
    }
}
```

:::note
ABI 2.5 is required for service startup configuration; the resolver was introduced in ABI 2.4. Startup is limited to 30 seconds, 64 modules, 512 KiB per source and 1 MiB total. Credentials, unsupported schemes, bare imports, import attributes and dynamic `import()` are rejected; resource errors or panic fail creation. The resolver can perform blocking work on a supervised worker; browser shutdown waits for it to finish.
:::

<span id="assets"></span>

## Packaged resource fallback

Add this route to `app.assets` and `utilities/parser` to `bundle.resources`. When resolve returns `None`, native uses the same Origin/path matching and packaged root as the frontend loader. Module reads run on a native worker and obey the module size limit. An assets-only V8 definition only needs `entry()`. A missing route or file fails creation.

```json
{
  "origins": ["myapp://parser.utility"],
  "paths": ["/*"],
  "directory": "utilities/parser"
}
```

<span id="abi"></span>

## Safe API and ABI boundary

Safe Rust exposes `Browser`, `utility::Utility` and `utility::V8`. `app::Builder` joins their definitions; there is no safe `Application` trait. `#[tuffite::main]` exports `tuffite_get_application` because ABI `Application` is the immutable aggregate callback table. `Host.query_extension(Browser)` returns `BrowserHost` with independently versioned `shell_api` and utility child tables. `Utility` sessions use Mojo across processes; raw ABI pointers and handles remain process-local.
