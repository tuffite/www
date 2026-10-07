import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/playground',
  group: 'framework',
  title: t('Develop Playground', '开发 Playground'),
  description: t(
    'The in-repository example for Rust applications and Framework integration.',
    '仓库内的 Rust 应用与 Framework 集成示例。',
  ),
  sections: [
    {
      id: 'setup',
      title: t('Start from the outer clone', '从外层克隆开始'),
      code: 'mise run setup\nmise run dev',
      language: 'shell',
      paragraphs: [
        t(
          'Playground lives in src/tuffite/playground and uses the adjacent SDK through Cargo path dependencies. The development command builds and packages local Framework sources, refreshes the native application, and launches its web frontend with Vite HMR.',
          'Playground 位于 src/tuffite/playground，通过 Cargo path 依赖使用相邻 SDK。开发命令构建并打包本地 Framework 源码、刷新原生应用，并以 Vite HMR 启动 Web 前端。',
        ),
      ],
    },
    {
      id: 'commands',
      title: t('Check typed commands', '检查类型化命令'),
      code: 'mise run tuff -- check playground/tuffite.json\nmise run tuff -- generate playground/tuffite.json --check',
      language: 'shell',
      paragraphs: [
        t(
          'shell_api.d.ts declares the playground namespace. Its generated facade exposes window.playground.commands.doSomething(message), checkUtilitySession(), and checkJavascriptExtension(). Keep declaration changes and regenerated Rust/JavaScript bindings together.',
          'shell_api.d.ts 声明 playground 命名空间。生成门面提供 window.playground.commands.doSomething(message)、checkUtilitySession() 和 checkJavascriptExtension()。修改声明时同步更新 Rust/JavaScript 生成绑定。',
        ),
      ],
    },
    {
      id: 'native',
      title: t('Work on the native runtime', '开发原生运行时'),
      code: 'mise run framework -- test --suite framework\nmise run framework -- test --suite smoke\nmise run tuff -- package --manifest playground/tuffite.json',
      language: 'shell',
      paragraphs: [
        t(
          'Use Playground to exercise native changes, Explorer integration, utility sessions, and generated ShellAPI bindings. Framework builds supply an explicit local Distribution; package Playground when you need a standalone application fixture.',
          '使用 Playground 验证原生修改、Explorer 集成、utility 会话和生成的 ShellAPI 绑定。Framework 构建提供明确的本地 Distribution；需要独立应用示例时打包 Playground。',
        ),
      ],
    },
  ],
};

export default article;
