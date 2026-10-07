import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/security',
  group: 'application',
  title: t('Capabilities & security', '能力与安全'),
  description: t(
    'Grant each frontend the native operations it actually needs.',
    '为每个前端授予它真正需要的原生能力。',
  ),
  sections: [
    {
      id: 'origins',
      title: t('Capabilities match origins', '能力按 origin 匹配'),
      code: '{\n  "identifier": "main-window",\n  "origins": ["myapp://main"],\n  "shellApi": ["myapp.commands.ping", "tuffite.window.current"]\n}',
      language: 'json',
      paragraphs: [
        t(
          'Add capability entries under app.security.capabilities. Each entry names the allowed origins and ShellAPI methods. The method selector * includes all registered methods for those origins; filesystem, URL, and window scopes still apply. Playground groups tuffite.fs.* and tuffite.window.* while keeping resource reads separate from writable directories. Namespace group scopes apply only to methods that consume resources. Use narrow method permissions and explicit filesystem scopes. The manifest schema validates the shape; tuff check also validates semantic restrictions.',
          '在 app.security.capabilities 下添加能力条目。每个条目列出允许的 origin 和 ShellAPI 方法。方法选择器 * 覆盖这些 origin 的全部已注册方法；文件、URL 和窗口 scope 仍然生效。Playground 使用 tuffite.fs.* 和 tuffite.window.* 分组，并将 resource 读取与可写目录分开声明。命名空间组的 scope 只作用于消费资源的方法。使用范围明确的方法权限与显式文件系统 scope。配置 schema 验证结构，tuff check 还会验证语义约束。',
        ),
      ],
    },
    {
      id: 'csp',
      title: t('Configure CSP and asset routes', '配置 CSP 与资源路由'),
      paragraphs: [
        t(
          'app.security.csp controls the frontend content security policy. app.assets maps explicit origins and request paths to packaged files. Asset routes and native permissions are separate contracts: registering a file does not grant a native capability.',
          'app.security.csp 控制前端内容安全策略。app.assets 将明确的 origin 和请求路径映射到打包文件。资源路由和原生权限是独立契约：注册文件不会授予原生能力。',
        ),
      ],
    },
    {
      id: 'development',
      title: t('Authenticated development mode', '经过认证的开发模式'),
      paragraphs: [
        t(
          'tuff dev refreshes a native development package and launches a loopback web server. A per-run token and readiness probe authenticate the renderer override. A compatible Framework must include the development-mode feature. Do not expose the development server or CDP port publicly.',
          'tuff dev 刷新原生开发包并启动回环 Web 服务。每次运行的 token 和就绪探测会验证渲染器覆盖。兼容 Framework 需要编译开发模式功能。不要将开发服务器或 CDP 端口公开暴露。',
        ),
      ],
    },
  ],
};

export default article;
