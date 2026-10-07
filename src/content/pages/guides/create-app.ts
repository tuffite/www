import { t, type Article } from '../../types';
import { appExample } from '../../examples';

const article: Article = {
  slug: 'guides/create-app',
  group: 'application',
  title: t('Create a Rust application', '创建 Rust 应用'),
  description: t(
    'From an empty folder to a typed desktop application.',
    '从空目录开始，构建类型安全的桌面应用。',
  ),
  sections: [
    {
      id: 'scaffold',
      title: t('Scaffold the project', '初始化项目'),
      code: 'tuff init my-app\ncd my-app\ntuff check\ntuff build --release',
      language: 'shell',
      paragraphs: [
        t(
          'Install the CLI as described in Quick start. tuff init creates Cargo.toml, build.rs, src/lib.rs, shell_api.d.ts, tuffite.json, a small HTML frontend, and generated bindings. The directory must be empty. The generated project depends on the matching published tuffite SDK.',
          '按快速开始安装 CLI。tuff init 生成 Cargo.toml、build.rs、src/lib.rs、shell_api.d.ts、tuffite.json、简单 HTML 前端及生成绑定。目标目录必须为空。生成的项目依赖匹配版本的已发布 tuffite SDK。',
        ),
      ],
    },
    {
      id: 'sdk',
      title: t('Use the published SDK', '使用已发布的 SDK'),
      code: '[dependencies]\ntuffite = { version = "0.1.0", default-features = false }\n\n[build-dependencies]\ntuffite = { version = "0.1.0", default-features = false, features = ["build"] }',
      language: 'toml',
      paragraphs: [
        t(
          'The application uses the Rust library; build.rs enables the build helpers for runtime resolution and binding generation. Keep the SDK version aligned with the CLI that created the project. A compatible Framework Distribution is resolved automatically during native builds.',
          '应用使用 Rust 库；build.rs 启用构建辅助功能，用于解析运行时和生成绑定。SDK 版本需与创建项目的 CLI 保持一致。原生构建会自动解析兼容的 Framework Distribution。',
        ),
      ],
    },
    {
      id: 'application',
      title: t('Implement the application lifecycle', '实现应用生命周期'),
      code: appExample,
      language: 'rust',
      paragraphs: [
        t(
          'Browser::new receives BrowserContext only in the browser process. #[tuffite::browser] marks the implementation; #[tuffite::main] exports the ABI entry table and app::Builder registers commands explicitly. Handler types are checked against the generated endpoint declarations at compile time.',
          'Browser::new 仅在 browser 进程接收 BrowserContext。#[tuffite::browser] 标记实现；#[tuffite::main] 导出 ABI 入口表，app::Builder 显式注册命令处理器。编译时会根据生成的端点声明检查处理器类型。',
        ),
      ],
    },
  ],
};

export default article;
