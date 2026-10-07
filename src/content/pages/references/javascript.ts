import { t, type Article } from '../../types';

const article: Article = {
  slug: 'references/javascript',
  group: 'reference',
  kind: 'javascript',
  title: t('JavaScript & ShellAPI', 'JavaScript 与 ShellAPI'),
  description: t(
    'Native facades and declaration contracts, straight from source.',
    '直接源自代码的原生门面与声明契约。',
  ),
  sections: [
    {
      id: 'usage',
      title: t('Use the generated native facade', '使用生成的原生门面'),
      code: "import '/tuffite-shell-api.js';\nconst windows = await window.tuffite.window.list();",
      language: 'javascript',
      paragraphs: [
        t(
          'Native methods return promises and require a matching origin capability. The following contracts are generated from the Framework’s checked-in TypeScript declarations. bigint values, opaque handles, and binary payloads retain their declared codec semantics.',
          '原生方法返回 Promise，并要求匹配 origin 的能力授权。下面的契约从 Framework 已提交的 TypeScript 声明中生成。bigint、不透明句柄和二进制载荷保持声明的编解码语义。',
        ),
      ],
    },
    {
      id: 'bridge',
      title: t('The window.tuffite bridge', 'window.tuffite 桥接对象'),
      paragraphs: [
        t(
          'The native runtime exposes window.tuffite in eligible application and Explorer main documents. Its NativeBridge contract includes invoke(), postMessage(), addEventListener(), and removeEventListener(). Generated modules extend this same object with native facades such as tuffite.window. A normal browser tab does not provide the native bridge.',
          '原生运行时在符合条件的应用和 Explorer 主文档中提供 window.tuffite。NativeBridge 契约包含 invoke()、postMessage()、addEventListener() 和 removeEventListener()。生成模块在同一对象上扩展 tuffite.window 等原生门面。普通浏览器标签页不提供原生桥接对象。',
        ),
      ],
    },
    {
      id: 'listeners',
      title: t('Subscribe and unsubscribe to events', '订阅与移除事件监听'),
      code: "const onChannel = (event) => {\n  const { channel, data } = event.detail; // data: Uint8Array\n  if (channel === 'app:changed') {\n    console.log(channel, data);\n  }\n};\nwindow.tuffite.addEventListener('channel', onChannel);\n\n// During component cleanup, use the same listener reference.\nwindow.tuffite.removeEventListener('channel', onChannel);",
      language: 'javascript',
      paragraphs: [
        t(
          'Listeners use the EventTarget API. addEventListener(type, listener, options?) accepts a capture boolean or AddEventListenerOptions, including once and signal. removeEventListener(type, listener, options?) must use the same function and matching capture value. In React, subscribe in an effect and remove the listener in its cleanup.',
          '监听使用 EventTarget API。addEventListener(type, listener, options?) 接受 capture 布尔值或 AddEventListenerOptions，包括 once 和 signal。removeEventListener(type, listener, options?) 须使用相同函数和匹配的 capture 值。在 React 中可在 effect 内订阅，并在清理函数中移除监听。',
        ),
      ],
      bullets: [
        t(
          'channel — native application events, with {channel, data: Uint8Array}. Decode data using your application event contract; it is not automatically JSON.',
          'channel：原生应用事件，detail 为 {channel, data: Uint8Array}。按应用事件契约解码 data，不会自动转换成 JSON。',
        ),
        t(
          'message — Explorer-tree JSON messages, with {data, from}. A business channel named message is still received through the channel event type.',
          'message：Explorer 树的 JSON 消息，detail 为 {data, from}。名为 message 的业务 channel 仍通过 channel 事件类型接收。',
        ),
        t(
          'navigation, open, popup, newwindow — bubbled Explorer requests with {url, disposition, userGesture, from}. dialog — an ExplorerDialogController with accept() and dismiss(). See Explorer API for propagation and ownership rules.',
          'navigation、open、popup、newwindow：冒泡的 Explorer 请求，detail 为 {url, disposition, userGesture, from}。dialog：带 accept() 和 dismiss() 的 ExplorerDialogController。传播和归属规则参见 Explorer API。',
        ),
      ],
    },
    {
      id: 'messages',
      title: t('Send Explorer messages', '发送 Explorer 消息'),
      code: "await window.tuffite.postMessage({ type: 'ready' }, { to: 'parent' });\nconst onMessage = ({ detail: { data, from } }) => {\n  console.log(data, from);\n};\nwindow.tuffite.addEventListener('message', onMessage);\n// Later:\nwindow.tuffite.removeEventListener('message', onMessage);",
      language: 'javascript',
      paragraphs: [
        t(
          'postMessage(data, {to}?) returns Promise<boolean>. The default target is top; parent and browser-issued surface refs are also accepted. Data must be JSON-serializable. The browser validates routing and ownership. A true result reports acceptance and delivery or queueing, not a response from the recipient.',
          'postMessage(data, {to}?) 返回 Promise<boolean>。默认目标为 top，也接受 parent 和浏览器签发的表面引用。data 须能序列化为 JSON。浏览器验证路由和归属。true 表示接受并投递或入队，不表示接收方应答。',
        ),
      ],
    },
    {
      id: 'invoke',
      title: t('Low-level binary invocation', '底层二进制调用'),
      code: 'const response = await window.tuffite.invoke(route, binaryPayload);\n// binaryPayload and response are Uint8Array.',
      language: 'javascript',
      paragraphs: [
        t(
          'invoke(channel, payload) returns Promise<Uint8Array> and requires the route’s native permission. It does not route through the Explorer tree or accept a to option. Use generated typed facades for normal application calls; they handle command identities, codecs, schema fingerprints, and protocol validation.',
          'invoke(channel, payload) 返回 Promise<Uint8Array>，并要求对应路由的原生权限。它不经过 Explorer 树，不接受 to 选项。普通应用调用应使用生成的类型化门面，它们处理命令标识、编解码器、schema 指纹和协议验证。',
        ),
      ],
    },
    {
      id: 'runtime',
      title: t('Runtime helpers and errors', '运行时辅助与错误'),
      paragraphs: [
        t(
          'tuffite/runtime exports TuffiteError, invokeBinary(), createCommandApi(), createTypedCommandApi(), and createFrameworkApi(), plus codec and bridge types. These helpers serve generated bindings and tooling. TuffiteError provides code and optional requestId/cause. The package is served as /tuffite-runtime.js in native application packages.',
          'tuffite/runtime 导出 TuffiteError、invokeBinary()、createCommandApi()、createTypedCommandApi() 和 createFrameworkApi()，以及 codec 和桥接类型。这些辅助接口服务于生成绑定和工具。TuffiteError 提供 code 以及可选 requestId/cause。原生应用包以 /tuffite-runtime.js 提供运行时模块。',
        ),
      ],
    },
    {
      id: 'package-exports',
      title: t('JavaScript package exports', 'JavaScript 包导出'),
      paragraphs: [
        t(
          'The complete declarations below are generated from every types entry in the JavaScript package exports. This includes NativeBridge event overloads, runtime helpers, Explorer types, and the development-only Vite plugin. Filter by export path, type, or member name.',
          '下面的完整声明从 JavaScript 包 exports 中的每个 types 入口生成，包含 NativeBridge 事件重载、运行时辅助、Explorer 类型和仅用于开发的 Vite 插件。可按导出路径、类型或成员名称筛选。',
        ),
      ],
    },
    {
      id: 'modules',
      title: t('Framework modules', 'Framework 模块'),
      paragraphs: [
        t(
          'Expand a module to inspect its complete source declaration, including argument and return models.',
          '展开模块可以查看完整源码声明，包括参数和返回值模型。',
        ),
      ],
    },
  ],
};

export default article;
