import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/quick-start',
  group: 'start',
  title: t('Quick start', '快速开始'),
  description: t(
    'Install the CLI. Create an application. Launch your native package.',
    '安装 CLI，创建应用，启动原生应用包。',
  ),
  sections: [
    {
      id: 'prerequisites',
      title: t('Prepare your machine', '准备开发环境'),
      paragraphs: [
        t(
          'Install the current stable Rust toolchain with Cargo and your platform C/C++ linker: Xcode Command Line Tools on macOS, Visual Studio Build Tools with C++ support on Windows, or a C/C++ toolchain on Linux. Use a platform supported by the published Framework Distribution. The minimal HTML application needs no JavaScript package manager.',
          '安装当前稳定版 Rust 工具链（含 Cargo）以及平台 C/C++ 链接工具：macOS 使用 Xcode Command Line Tools，Windows 使用带 C++ 支持的 Visual Studio Build Tools，Linux 使用 C/C++ 工具链。目标平台需要有已发布的 Framework Distribution。最小 HTML 应用不需要 JavaScript 包管理器。',
        ),
      ],
    },
    {
      id: 'install',
      title: t('Use the source CLI', '使用源码 CLI'),
      code: 'git clone https://github.com/tuffite/workspace.git\ncd workspace\nmise trust\nmise run setup\nmise run tuff -- --help',
      language: 'shell',
      paragraphs: [
        t(
          'Tuffite is an experimental source release. The public registries currently reserve the name at 0.0.0; they do not yet provide this 0.1.0 SDK and CLI. Use the prepared workspace and run mise run tuff -- <arguments> from its root.',
          'Tuffite 目前是实验性源码版本。公共注册表中的 0.0.0 仅用于占位，尚未提供当前 0.1.0 SDK 和 CLI。请准备源码工作区，并从其根目录运行 mise run tuff -- <参数>。',
        ),
      ],
      note: t(
        'Build and run Playground with mise run dev to try the current version. Creating standalone applications from the published SDK will become available after matching crates and Framework Distributions are released; the examples below describe that future workflow.',
        '运行 mise run dev 构建并启动 Playground，体验当前版本。匹配的 crates 和 Framework Distribution 发布后，才能使用已发布 SDK 创建独立应用；下方示例描述届时的流程。',
      ),
    },
    {
      id: 'create',
      title: t('Create and package your application', '创建并打包应用'),
      code: 'tuff init my-app\ncd my-app\ntuff check\ntuff package --name my-app',
      language: 'shell',
      paragraphs: [
        t(
          'tuff init creates a Rust application with a minimal HTML frontend and typed bindings. Packaging compiles the application and resolves a compatible prebuilt Chromium runtime, downloading it into a versioned cache when needed. Subsequent builds reuse the cache.',
          'tuff init 创建带最小 HTML 前端和类型化绑定的 Rust 应用。打包时编译应用并解析兼容的预构建 Chromium 运行时，需要时下载到版本化缓存。后续构建复用缓存。',
        ),
      ],
    },
    {
      id: 'launch',
      title: t('Launch the native application', '启动原生应用'),
      code: '# macOS / Linux\n./dist/my-app/run-tuffite.sh\n\n# Windows\n.\\dist\\my-app\\run-tuffite.cmd',
      language: 'shell',
      paragraphs: [
        t(
          'The package contains your application library, native launcher, Chromium runtime, and frontend assets. For a frontend development server, configure build.devPackage, build.devUrl, and build.beforeDevCommand before using tuff dev. Choose your own frontend tools.',
          '应用包包含应用库、原生启动器、Chromium 运行时和前端资源。如需前端开发服务器，先配置 build.devPackage、build.devUrl 和 build.beforeDevCommand，再使用 tuff dev。前端工具由你自行选择。',
        ),
      ],
    },
  ],
};

export default article;
