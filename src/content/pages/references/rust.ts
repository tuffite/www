import { t, type Article } from '../../types';

const article: Article = {
  slug: 'references/rust',
  group: 'reference',
  kind: 'rust',
  title: t('Rust API', 'Rust API'),
  description: t(
    'The public tuffite facade, application lifecycle, and build helpers.',
    'tuffite 公共门面、应用生命周期和构建辅助 API。',
  ),
  sections: [
    {
      id: 'core',
      title: t('Application entry points', '应用入口'),
      bullets: [
        t(
          'Browser — implement new(BrowserContext) to construct browser process state.',
          'Browser：实现 new(BrowserContext) 创建 browser 进程状态。',
        ),
        t(
          'app::Builder<B> — register browser commands and prepare process startup.',
          'app::Builder<B>：注册 browser 命令并处理进程启动准备。',
        ),
        t(
          'BrowserContext — access configuration bytes, events, executor, native ShellAPI, named Rust and V8 utilities.',
          'BrowserContext：访问配置字节、事件、执行器、原生 ShellAPI、具名 Rust 和 V8 utility。',
        ),
        t(
          '#[tuffite::main(browser = App, utilities(Indexer, Parser))], #[tuffite::browser], #[tuffite::utility(name = "parser")] — explicitly assemble process definitions.',
          '#[tuffite::main(browser = App, utilities(Indexer, Parser))]、#[tuffite::browser]、#[tuffite::utility(name = "parser")]：显式组合进程定义。',
        ),
      ],
    },
    {
      id: 'features',
      title: t('Feature flags & build helpers', 'Feature 开关与构建辅助'),
      code: '[dependencies]\ntuffite = { version = "0.1.0", default-features = false }\n\n[build-dependencies]\ntuffite = { version = "0.1.0", default-features = false, features = ["build"] }',
      language: 'toml',
      paragraphs: [
        t(
          'build enables Distribution resolution, ShellAPI code generation, and application build helpers. cli is enabled by default and adds the tuff binary. async enables ChromiumTask integration. Applications set default-features = false to avoid CLI dependencies. build::framework::Resolver, build::shell_api::Generator, and build::Builder belong to the build API; the runtime Builder is a different type.',
          'build 启用 Distribution 解析、ShellAPI 代码生成和应用构建辅助。cli 默认启用，提供 tuff 二进制；async 启用 ChromiumTask 集成。应用设置 default-features = false 避免引入 CLI 依赖。build::framework::Resolver、build::shell_api::Generator 和 build::Builder 属于构建 API，运行时 Builder 是另一种类型。',
        ),
      ],
    },
    {
      id: 'symbols',
      title: t('Public runtime symbols', '公共运行时符号'),
      paragraphs: [
        t(
          'This index is generated from the SDK facade during site builds. Detailed Rust signatures and doc examples can be generated with bun run docs:rust and served at /api/rust/tuffite/.',
          '此索引在站点构建时从 SDK 门面生成。执行 bun run docs:rust 可以生成详细 Rust 签名与文档示例，并在 /api/rust/tuffite/ 提供访问。',
        ),
      ],
    },
  ],
};

export default article;
