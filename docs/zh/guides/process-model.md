---
title: 'Browser 与 Utility 进程'
description: '声明进程角色，按需加载 Rust 或 V8 服务。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="entry"></span>

## 统一入口，显式声明

main 工厂在每个已加载库中组装一次元数据，不创建 `Browser` 或 `Utility` 实例。`before_startup` 在 Chromium `ContentMain` 前运行，覆盖 `Browser`、`Utility`、`Renderer`、`Gpu` 和 `Other` 角色；此时 OS 进程已存在。`process_kind()` 只读，`argv()`/`argv_mut()` 提供参数读取和编辑；必须保留可执行文件和 Chromium 进程类型。

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

## 由 `Browser` 启动服务

在 Rust `Utility` 实现上添加 `#[tuffite::utility(name = "indexer")]`，实现 `new()` 和 `invoke()`。V8 定义在 `utility::V8` 的 impl 上使用相同属性。`BrowserContext::utilities().sessions().create(name, ...)` 打开 Rust 会话；`utilities().create_v8(name, on_closed, on_created)` 打开 V8。注册后延迟启动：首次请求才启动该服务名对应的受监管 utility 进程，后续会话复用健康进程。Rust `Utility::new` 在子进程执行，每个 V8 会话拥有独立 isolate。

<span id="v8"></span>

## 按需解析 V8 资源

`V8::new(V8Context)` 按注册名称在 `Browser` runtime 内延迟创建并复用 Rust provider。`entry(&self)` 和 `resolve(&self, url)` 可使用实例状态；上下文提供服务配置、应用 manifest、executor、类型化共享状态和停止信号。`BrowserContext::set_state(Arc<T>)` 与 `V8Context::state::<T>()` 在 `Browser` 内共享状态。Rust `Utility::new(UtilityContext)` 在子进程执行，仅通过 Mojo/ABI 2.5 收到自己的 `app.utilities.<name>.configuration`（最大 64 KiB）。session init 与 JS isolate 状态独立，Rust 对象不跨 IPC。

`Utility` 通过 Mojo 请求入口及发现的静态依赖。`Browser` 的 worker runtime 使用规范化 URL 调用 `resolve(url)`。相对入口补成 `<应用 scheme>://<name>.utility/path.mjs`，也支持完整 HTTPS/file 入口与导入。所有请求先经过应用 resolver：`Some(source)` 覆盖资源，`None` 回退 `app.assets`，`Err` 直接失败。resolve 默认返回 `None`；HTTPS/file 资源须由 resolver 提供源码，并由它实现网络和文件访问策略。内嵌、文件读取和动态生成源码统一使用 `ModuleSource`；返回的 name 必须等于请求 URL。每个模块在会话内编译并缓存一次，再同步链接，支持共享依赖和循环依赖。新会话重新解析资源；V8 不获得文件系统访问能力。

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

:::note[注意]
服务启动配置要求 ABI 2.5；resolver 从 ABI 2.4 提供。启动限制为 30 秒、64 个模块、单模块 512 KiB、总量 1 MiB。拒绝凭据、未支持的 scheme、裸模块导入、import attributes 和动态 `import()`；资源错误或 panic 导致创建失败。resolver 可在受监管 worker 中执行阻塞操作，browser 关闭时会等待它结束。
:::

<span id="assets"></span>

## 打包资源回退

把此路由加入 `app.assets`，并把 `utilities/parser` 加入 `bundle.resources`。resolve 返回 `None` 时，原生层复用前端加载器的 Origin/路径匹配和打包资源根目录；模块读取在 native worker 执行，并遵守模块大小限制。仅使用 assets 的 V8 定义只需实现 `entry()`。没有匹配路由或文件时创建失败。

```json
{
  "origins": ["myapp://parser.utility"],
  "paths": ["/*"],
  "directory": "utilities/parser"
}
```

<span id="abi"></span>

## 安全 API 与 ABI 边界

安全 Rust API 提供 `Browser`、`utility::Utility` 和 `utility::V8`；`app::Builder` 组合定义，不提供安全层 `Application` trait。`#[tuffite::main]` 导出 `tuffite_get_application`，因为 ABI `Application` 是不可变的聚合回调表。`Host.query_extension(Browser)` 返回 `BrowserHost`，其 `shell_api` 和 utility 子表独立版本化。`Utility` 会话通过 Mojo 跨进程通信；ABI 原始指针和句柄仅在所在进程有效。
