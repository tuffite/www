---
title: Isolated UI worlds
description: 通过独立 JavaScript realm 和作用域注册表承载扩展 Web Components。
---

`tuffite.isolated` 在 Blink isolated world 中运行扩展 UI。每个 world 有独立的
JavaScript 全局对象、DOM wrapper 和 custom-element registry，同时共享宿主的
DOM、布局、renderer 线程与进程。适合承载已安装且受信任的 onboarding、消息块、
settings 和文件编辑器代码。扩展身份与 UI 传输类型应分别定义：生成的 interactive
HTML 可以作为独立的 iframe contribution，由 main world 直接挂载，不创建 isolated world。

## 原生注册扩展脚本

应用负责校验扩展包，读取自包含的 classic-script bundle，再注册不可变的 source
快照。在 `Browser::new` 保留 host，在 `Browser::initialize` 或后续异步操作中注册：

```rust
let host = context.isolated();
// 稍后，在 initialize 或其他异步操作中执行：
host.register(
    tuffite::isolated::WorldDefinition::new("io.example.extension", source)
        .allow_origin("example://main"),
    |result| {
        let registration = result.expect("UI 注册失败");
        // 保留 registration，供 replace / unregister 使用。
        // 回调成功后，才向 UI 开放对应 contribution。
    },
)?;
```

`Host::is_available()` 检测原生支持。注册走独立的
`TUFFITE_CAPABILITY_ISOLATED` ABI capability，不依赖 ShellAPI 隐藏路径；旧版
Framework 返回 `Unavailable`。renderer 没有注册入口，安装扩展也不需要修改
`tuffite.json`。`app.isolatedWorlds` 仍可作为应用内置组件的启动注册简写。

UI 需要打包成自包含的 classic script，例如 Bun 的 `format: "iife"`。
Framework 不解析扩展模块图，也不加载 ESM imports。将依赖库与 CSS 打进快照，
在挂载的 shadow tree 内安装样式。后台 Utility 入口与 UI 入口分别打包。

## 定义与挂载组件

扩展脚本使用分配给当前 world 的 registry：

```javascript
class SetupCard extends HTMLElement {
  set state(value) {
    this.textContent = value.label;
  }
  connectedCallback() {
    this.addEventListener('click', async () => {
      await tuffite.isolated.context(this).request('setup.start', { provider: 'example' });
    });
  }
}
tuffite.isolated.customElements.define('setup-card', SetupCard);
```

主 world 控制挂载和授权：

```javascript
const world = await tuffite.isolated.createWorld({ name: 'io.example.extension' });
const view = await world.mount(container, {
  tag: 'setup-card',
  properties: { state: { label: '连接账户' } },
  async onRequest({ method, params, signal }) {
    if (method !== 'setup.start') throw new Error('不支持的请求');
    // 将扩展身份、允许的操作绑定到本次挂载，校验 params。
    return startSetup(params, signal);
  },
});
await view.update({ state: { label: '已连接' } });
await view.dispose();
await world.dispose();
```

宿主的 `IsolatedWorldHandle` 继承 `EventTarget`，提供 `name`、`mount`、`dispose`。
world 内的 `tuffite.isolated` 提供 `name`、`customElements`、`signal`、
`context(element)`；context 提供 `signal` 与 `request(method, params, {signal})`。
API 直接挂在 `globalThis.tuffite`，不需要 import SDK 模块。

每次 mount 创建使用当前 world registry 的 closed shadow tree。不同 world 可定义
相同标签，构造函数、生命周期回调、property setter 都在所属 realm 执行。
注册组件使用 `tuffite.isolated.customElements`，不要使用页面的
`window.customElements`。

`update` 是顶层 property patch。属性、请求参数和响应只接受 JSON，不接受函数、
DOM 节点、typed array、Promise、`undefined`。嵌套最多 64 层，编码后最多
256 Ki UTF-16 code units。文件字节转换成普通数组后分块传输；通过显式 request
接口调用宿主，不通过跨 world DOM event detail 或 element expando 传函数。

## Onboarding、消息与编辑器

Onboarding 的表单结构和交互由扩展 UI 自己实现；宿主只提供公开状态和有界的 setup
操作。输入的凭据先留在表单内，
提交时交给已授权的原生 setup 操作；不向扩展返回已保存的凭据。消息块接收 JSON
数据、streaming 和语言，只开放当前 contribution 的 action 与 compose。文件编辑器
分块接收文件并导出，最终保存的路径和授权由宿主选定。

每个 UI surface 单独创建 world，便于管理资源。需要复用 world 时，由应用显式管理
多个 view 的共同生命周期。dispose view 会取消 context 与待处理请求；dispose world
先撤销全部 view，再执行清理。不支持取消的原生操作需要应用另外协调。

`replace(&registration, definition, callback)` 校验相同名称与精确 generation；
`unregister(&registration, callback)` 禁止后续加载。两者都不会终止已执行的 world。
禁用、更新、卸载扩展时，应用应销毁已挂载 handle 并撤销应用权限；unregister 前
已接受的异步加载仍可能完成。注册仅保存在当前 BrowserContext 内存中，启动时从安装
清单重建。

## 能力边界与资源预算

World 隔离全局对象、原型、JS expando 与标签注册表，提供显式 JSON 通信边界；
但不会限制扩展访问共享 DOM、占满 CPU 或导致 renderer 崩溃。CSP 会限制部分脚本和
网络操作，但不构成通用的扩展权限沙箱。
Closed shadow root 提供封装，不构成安全边界。不能据此安全运行恶意扩展或模型生成
脚本。生成的 interactive HTML 使用受限 iframe；后台特权操作使用 Utility 或进程隔离。
World 自带限制性 CSP；应用可以提供限定于当前挂载的宿主 iframe 能力来承接生成 HTML，
保留 world 原有的策略。

浏览器检查实际 primary main frame、浏览器持有的 App 或 Explorer 策略，以及 world
对 committed origin 的授权后才提供 source。子框架和未授权 origin 仍被拒绝。managed world
中不提供 ShellAPI。扩展包信任、安装、manifest 和权限策略由应用负责；不要从请求
参数读取扩展身份或据此开放任意宿主方法。

当前预算为每份 source 8 MiB、每个 BrowserContext 合计 32 MiB、最多 32 个注册项，
包含 manifest 内置项。这限制的是脚本存储、传输和解析成本，不是执行时内存或 CPU。
动态注册允许 1–32 个精确 origin，不接受通配符。名称以 ASCII 字母开头，最多
128 个字母、数字、`_`、`-`、`.`。通过认证的开发入口继承打包入口 origin 的授权。
