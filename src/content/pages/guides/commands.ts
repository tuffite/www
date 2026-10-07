import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/commands',
  group: 'application',
  title: t('Call Rust from the frontend', '从前端调用 Rust'),
  description: t(
    'Declare once. Generate bindings. Register a typed handler.',
    '声明一次，生成绑定，注册类型化处理器。',
  ),
  sections: [
    {
      id: 'declare',
      title: t('Declare the contract', '声明接口契约'),
      code: 'export namespace myapp {\n  export namespace commands {\n    export function ping(message: string): Promise<string>;\n  }\n}',
      language: 'typescript',
      paragraphs: [
        t(
          'List the declaration in build.shellApi.definitions and set build.shellApi.namespace to myapp. tuff dev regenerates bindings as the contract changes; tuff build and tuff package also generate them automatically. The generator derives binary codecs and command identities from the typed declaration.',
          '在 build.shellApi.definitions 中列出声明文件，并将 build.shellApi.namespace 设置为 myapp。tuff dev 随契约变更重新生成绑定；tuff build 和 tuff package 也会自动生成。生成器根据类型声明推导二进制编解码器和命令标识。',
        ),
      ],
    },
    {
      id: 'handle',
      title: t('Register the handler', '注册处理器'),
      code: '#[tuffite::command(shell_api::commands::Ping)]\nfn ping(_app: &mut App, message: String) -> Result<String, tuffite::CommandError> {\n    Ok(format!("Hello, {message}"))\n}\n\n// Register explicitly in the exported Builder:\n// .commands(tuffite::generate_handler![ping])',
      language: 'rust',
      paragraphs: [
        t(
          'The Rust handler accepts generated endpoint argument types. generate_handler! checks that handlers belong to the same application and builds the dispatch registry. Duplicate registration or mismatched endpoint shapes fail validation.',
          'Rust 处理器接受生成端点的参数类型。generate_handler! 检查处理器属于同一个应用，并创建分发注册表。重复注册或端点类型不匹配会导致验证失败。',
        ),
      ],
    },
    {
      id: 'invoke',
      title: t('Invoke the generated facade', '调用生成门面'),
      code: "import './generated/index.js';\nconst answer = await window.myapp.commands.ping('Tuffite');",
      language: 'javascript',
      paragraphs: [
        t(
          'The application facade uses the bundled framework transport. Permit the canonical method or a suitable pattern such as myapp.* in a capability matching the frontend origin. Import the generated module before accessing the facade.',
          '应用门面使用打包的框架传输层。在匹配前端 origin 的 capability 中允许规范方法名，或 myapp.* 等合适的模式。访问门面前先导入生成模块。',
        ),
      ],
    },
  ],
};

export default article;
