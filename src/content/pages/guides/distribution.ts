import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/distribution',
  group: 'application',
  title: t('Build & distribute', '构建与分发'),
  description: t(
    'Resolve a matching native runtime, then package your application.',
    '解析匹配的原生运行时，然后打包应用。',
  ),
  sections: [
    {
      id: 'resolve',
      title: t('Resolve the Framework', '解析 Framework'),
      bullets: [
        t(
          'TUFFITE_FRAMEWORK_DIST selects an exact extracted Distribution and takes precedence. Explicit paths never fall back.',
          'TUFFITE_FRAMEWORK_DIST 选择已解压的精确 Distribution，具有最高优先级。显式路径不会回退。',
        ),
        t(
          'TUFFITE_FRAMEWORK_DIR enables compatible local release output for the requested target and profile.',
          'TUFFITE_FRAMEWORK_DIR 启用与目标平台和 profile 匹配的兼容本地 release 输出。',
        ),
        t(
          'Without local output, the resolver checks its versioned cache, then downloads a matching release when enabled.',
          '没有本地产物时，解析器检查版本化缓存，并在允许下载时获取匹配版本。',
        ),
      ],
      code: 'tuff doctor\ntuff framework verify /path/to/distribution\ntuff package --name my-app',
      language: 'shell',
    },
    {
      id: 'identity',
      title: t('Keep SDK and runtime compatible', '保持 SDK 与运行时兼容'),
      paragraphs: [
        t(
          'The Distribution contains tuffite-framework.json, platform libraries, launchers, and Chromium resources. Resolution checks Framework version, target, ABI compatibility, safe paths, and file hashes. Use a Distribution matching your SDK release.',
          'Distribution 包含 tuffite-framework.json、平台库、启动器及 Chromium 资源。解析过程检查 Framework 版本、目标、ABI 兼容性、安全路径和文件哈希。使用与 SDK 发布版本匹配的 Distribution。',
        ),
      ],
    },
    {
      id: 'resources',
      title: t('Bundle explicit resources', '打包显式资源'),
      paragraphs: [
        t(
          'bundle.resources includes application resources. app.assets defines how frontend requests reach packaged files. Run the frontend production build before packaging. Signing, installers, and release publishing remain separate steps from assembling the application package.',
          'bundle.resources 包含应用资源。app.assets 定义前端请求如何访问打包文件。打包前先运行前端生产构建。签名、安装器和发布版本是组装应用包之外的独立步骤。',
        ),
      ],
    },
  ],
};

export default article;
