import { t, type Article } from '../../types';

const article: Article = {
  slug: 'references/explorer',
  group: 'reference',
  kind: 'explorer',
  title: t('Explorer API', 'Explorer API'),
  description: t(
    'Embed, navigate, message, and transfer isolated browser surfaces.',
    '嵌入、导航、通信和转移隔离的浏览器表面。',
  ),
  sections: [
    {
      id: 'element',
      title: t('Element and permissions', '元素与权限'),
      code: '<explorer id="browser" src="https://example.com/" navigation="emit" dialogs="emit"></explorer>',
      language: 'html',
      paragraphs: [
        t(
          'Explorer is a native DOM element, HTMLExplorerElement, rather than a Rust method or a tuffite.explorer ShellAPI namespace. The Framework must enable TuffiteExplorer. Grant explorer.create to the owning document origin in app.security.capabilities; isolated script execution additionally requires explorer.executeJavaScript. Guest documents need their own grants for native calls or nested Explorers.',
          'Explorer 是原生 DOM 元素 HTMLExplorerElement，而非 Rust 方法或 tuffite.explorer ShellAPI 命名空间。Framework 需要启用 TuffiteExplorer。在 app.security.capabilities 中为所属文档 origin 授予 explorer.create；隔离脚本执行还需要 explorer.executeJavaScript。嵌入页面执行原生调用或创建嵌套 Explorer 时需要自己的授权。',
        ),
      ],
    },
    {
      id: 'attributes',
      title: t('Properties and creation policy', '属性与创建策略'),
      bullets: [
        t(
          'src requests navigation; load(url) explicitly starts a page. contextMenuEnabled toggles the native menu and defaults to false.',
          'src 请求导航；load(url) 显式启动页面。contextMenuEnabled 切换原生菜单，默认为 false。',
        ),
        t(
          'navigation="emit" intercepts renderer current-tab navigation; "allow" navigates inside the surface. dialogs="emit" forwards dialogs; "suppress" rejects them.',
          'navigation="emit" 拦截渲染器当前页导航；"allow" 在表面内导航。dialogs="emit" 转发对话框；"suppress" 拒绝它们。',
        ),
        t(
          'partition, navigation, and dialogs are frozen when a page is created. Recreate the element to change that policy. deferred delays initial creation; load() can start a deferred element.',
          'partition、navigation 和 dialogs 在页面创建时固定。修改策略需重建元素。deferred 延迟初次创建；load() 可启动延迟创建的元素。',
        ),
      ],
    },
    {
      id: 'navigation',
      title: t('Navigation and isolated execution', '导航与隔离执行'),
      code: "const explorer = document.querySelector('#browser');\nexplorer.load('https://example.com/account');\nawait explorer.back();\nawait explorer.forward();\nawait explorer.go(-2);\nawait explorer.reload({ bypassCache: true });\nawait explorer.stop();\nconst state = await explorer.getNavigationState();\nconst result = await explorer.executeJavaScript('document.title', {\n  world: 'isolated', expectedDocumentId: state.documentId,\n});",
      language: 'javascript',
      paragraphs: [
        t(
          'back(), forward(), go(), reload(), and stop() resolve to whether the browser accepted the operation. getNavigationState() exposes URL, title, history, loading state, documentId, rendererProcess, and storagePartition diagnostics. executeJavaScript() runs in an isolated world, limits source to 1 MiB, and requires a JSON-serializable result. expectedDocumentId rejects execution after a document changes.',
          'back()、forward()、go()、reload() 和 stop() 返回浏览器是否接受操作。getNavigationState() 提供 URL、标题、历史、加载状态、documentId、rendererProcess 和 storagePartition 诊断。executeJavaScript() 在隔离世界运行，源码上限为 1 MiB，结果须能序列化为 JSON。expectedDocumentId 可拒绝文档变化后的执行。',
        ),
      ],
    },
    {
      id: 'events',
      title: t('Events and dialogs', '事件与对话框'),
      bullets: [
        t(
          'error: creation or attachment failed. loadstart, loadstop, loadcommit: navigation state. loaderror also provides errorCode and errorDescription.',
          'error：创建或挂接失败。loadstart、loadstop、loadcommit：导航状态。loaderror 还提供 errorCode 和 errorDescription。',
        ),
        t(
          'navigation, open, popup, and newwindow carry {url, disposition, userGesture, from} in event.detail. They describe intercepted navigation, ordinary window.open(), popups, and other new-window requests respectively.',
          'navigation、open、popup 和 newwindow 在 event.detail 中携带 {url, disposition, userGesture, from}，分别表示拦截导航、普通 window.open()、弹出窗口及其他新窗口请求。',
        ),
        t(
          'Request events and dialog bubble across Explorer boundaries to window.tuffite. stopPropagation() stops both local bubbling and cross-surface forwarding.',
          '请求事件和 dialog 跨 Explorer 边界冒泡至 window.tuffite。stopPropagation() 同时停止本地冒泡和跨表面转发。',
        ),
        t(
          'dialog detail is an ExplorerDialog with type, message, defaultValue, isReload, from, accept(promptText), and dismiss(). A controller answers once; stale or repeated responses return false. Answering does not stop propagation.',
          'dialog 的 detail 是 ExplorerDialog，包含 type、message、defaultValue、isReload、from、accept(promptText) 和 dismiss()。控制器只能应答一次；失效或重复应答返回 false。应答不会停止事件传播。',
        ),
        t(
          'detached and attached report ownership changes; ExplorerTransfer emits statechange.',
          'detached 与 attached 报告归属变更；ExplorerTransfer 发出 statechange。',
        ),
      ],
    },
    {
      id: 'messaging',
      title: t('Explorer-tree messaging', 'Explorer 树通信'),
      code: "await explorer.postMessage({ type: 'refresh' });\nawait window.tuffite.postMessage({ type: 'ready' }, { to: 'parent' });\nwindow.tuffite.addEventListener('message', ({ detail }) => {\n  console.log(detail.data, detail.from);\n});",
      language: 'javascript',
      paragraphs: [
        t(
          'element.postMessage(data) targets its direct child. window.tuffite.postMessage(data, {to}) accepts parent, top (the default), or a browser-issued ref from event.detail.from. Messages are JSON; browser ownership and tree membership checks apply. Promise<boolean> indicates acceptance and delivery/queueing, not an application reply. ShellAPI invoke and channel events use a separate binary transport.',
          'element.postMessage(data) 发给直接子页面。window.tuffite.postMessage(data, {to}) 接受 parent、top（默认）或 event.detail.from 中浏览器签发的引用。消息使用 JSON，浏览器检查归属和树成员关系。Promise<boolean> 表示接受并投递或入队，不表示应用应答。ShellAPI invoke 和 channel 事件使用独立二进制传输。',
        ),
      ],
    },
    {
      id: 'storage',
      title: t('Storage partitions', '存储分区'),
      bullets: [
        t(
          'Omitting partition shares the immediate parent’s exact storage backend, including an in-memory backend; "shared" is not a valid attribute value.',
          '省略 partition 共享直接父页面的实际存储后端，包括内存后端；"shared" 不是有效属性值。',
        ),
        t(
          'persist:name creates a named disk-backed partition; memory:name creates a named in-memory partition.',
          'persist:name 使用命名磁盘分区；memory:name 使用命名内存分区。',
        ),
        t(
          'inherit+persist:name and inherit+memory:name seed parent cookies and localStorage only when both destination stores are empty. This is a snapshot, not live synchronization; other storage types are not copied.',
          'inherit+persist:name 和 inherit+memory:name 仅在目标 cookies 与 localStorage 均为空时复制父页面数据。这是快照，不是实时同步；不复制其他存储类型。',
        ),
        t(
          'Every Explorer retains its own renderer isolation domain, including when storage is shared. Ordinary origin rules continue to apply.',
          '每个 Explorer 保持独立渲染器隔离域，即使共享存储也是如此。常规 origin 规则仍然适用。',
        ),
      ],
    },
    {
      id: 'transfer',
      title: t('Transfer a live page', '转移运行中的页面'),
      code: "const target = document.createElement('explorer');\ntarget.deferred = true;\ntarget.navigation = source.navigation;\ntarget.dialogs = source.dialogs;\nif (source.partition) target.partition = source.partition;\ncontainer.append(target);\nconst transfer = await source.detach();\ntry {\n  await target.attach(transfer.token);\n  source.remove();\n} catch (error) {\n  await source.attach(transfer.token);\n  throw error;\n}",
      language: 'javascript',
      paragraphs: [
        t(
          'Prepare a connected receiver without src or an existing page. detach() returns an ExplorerTransfer with a one-use token and pending, attaching, transferred, or closed state. Successful attach() consumes the token. Call close() for abandoned transfers; closing while attaching rejects. Source document navigation or teardown releases pending pages. An ordinary same-document moveBefore() preserves the existing page without a transfer.',
          '准备已连接且无 src、无现有页面的接收元素。detach() 返回 ExplorerTransfer，具有一次性 token 和 pending、attaching、transferred、closed 状态。成功 attach() 会消耗 token。废弃转移需调用 close()；attaching 时关闭会拒绝。源文档导航或销毁释放待转移页面。普通同文档 moveBefore() 保留现有页面，无需转移。',
        ),
      ],
    },
    {
      id: 'interfaces',
      title: t('Canonical WebIDL interfaces', '权威 WebIDL 接口'),
      paragraphs: [
        t(
          'These declarations are generated directly from the Framework’s Explorer WebIDL, including helper option dictionaries. Use the Playground Capability Lab to exercise navigation, messaging, storage, dialogs, and transfers.',
          '以下声明直接从 Framework 的 Explorer WebIDL 生成，包含辅助选项字典。可在 Playground Capability Lab 中验证导航、通信、存储、对话框和转移。',
        ),
      ],
    },
  ],
};

export default article;
