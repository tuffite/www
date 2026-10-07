import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/introduction',
  group: 'start',
  title: t('What is Tuffite?', '什么是 Tuffite？'),
  description: t(
    'A familiar web frontend. A typed Rust backend. Your own Chromium runtime.',
    '熟悉的 Web 前端，类型安全的 Rust 后端，属于你的 Chromium 运行时。',
  ),
  sections: [
    {
      id: 'overview',
      title: t('Build with the tools you know', '使用熟悉的工具构建'),
      paragraphs: [
        t(
          'Tuffite is a desktop application framework that compiles its native implementation inside Chromium. Your frontend renders with Chromium, while your application logic lives in a Rust library. Typed ShellAPI bindings connect the two.',
          'Tuffite 是一个在 Chromium 内编译原生实现的桌面应用框架。前端由 Chromium 渲染，业务逻辑位于 Rust 库中，两者通过类型化的 ShellAPI 绑定连接。',
        ),
        t(
          'The library is tuffite. The CLI is tuff. The application manifest is tuffite.json. Playground demonstrates the complete stack with a Rust backend, typed commands, and a web frontend.',
          'Rust 库名为 tuffite，CLI 为 tuff，应用配置文件为 tuffite.json。Playground 通过 Rust 后端、类型化命令和 Web 前端演示完整技术栈。',
        ),
      ],
    },
    {
      id: 'architecture',
      title: t('One application, three layers', '一个应用，三个层次'),
      bullets: [
        t(
          'Web frontend — bring React, another frontend framework, or plain HTML. Generated JavaScript exposes typed native calls.',
          'Web 前端：使用 React、其他前端框架或原生 HTML。生成的 JavaScript 提供类型化原生调用。',
        ),
        t(
          'Rust application — implement Browser, register explicit command handlers, and build a cdylib.',
          'Rust 应用：实现 Browser，显式注册命令处理器，并构建 cdylib。',
        ),
        t(
          'Native Framework — Chromium owns the browser, renderer, and utility processes; the versioned C ABI connects your Rust library.',
          '原生 Framework：Chromium 管理浏览器、渲染器和工具进程，版本化的 C ABI 连接 Rust 库。',
        ),
      ],
      note: t(
        'Tuffite packages its own Chromium runtime. Plan for a larger native Distribution than a framework that uses a system WebView.',
        'Tuffite 打包自己的 Chromium 运行时。与使用系统 WebView 的框架相比，需要预留更大的原生 Distribution 体积。',
      ),
    },
    {
      id: 'choose-path',
      title: t('Choose your path', '选择开发路径'),
      paragraphs: [
        t(
          'Application developers work with tuff, generated bindings, and a compatible Framework Distribution. Framework contributors additionally work with the Chromium checkout, x.py, and the spo patch stack. Install the CLI to build your own application; clone the outer workspace when contributing to the Framework.',
          '应用开发者使用 tuff、生成绑定和兼容的 Framework Distribution。Framework 贡献者还需要 Chromium 工作区、x.py 和 spo 补丁栈。开发自己的应用时安装 CLI；贡献 Framework 时再克隆外层工作区。',
        ),
      ],
    },
  ],
};

export default article;
