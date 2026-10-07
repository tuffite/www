import { t, type Article } from '../../types';

const article: Article = {
  slug: 'references/cli',
  group: 'reference',
  kind: 'cli',
  title: t('tuff CLI', 'tuff CLI'),
  description: t(
    'Create, validate, develop, and package Tuffite applications.',
    '创建、验证、开发和打包 Tuffite 应用。',
  ),
  sections: [
    {
      id: 'commands',
      title: t('Application commands', '应用命令'),
      code: 'tuff init <empty-directory>\ntuff check [tuffite.json]\ntuff build [tuffite.json] --release\ntuff doctor [tuffite.json]\ntuff dev\ntuff package --format app\ntuff framework --help',
      language: 'shell',
      paragraphs: [
        t(
          'Application commands search the current directory and its parents for the nearest tuffite.json; --manifest overrides discovery. Default package output is the project dist directory. dev, build, and package automatically generate bindings and resolve or download the Framework. dev reuses the selected Distribution across source rebuilds; --force-download-framework refreshes it once at startup. Use --help on a subcommand for its exact flags. -v increases logging detail and works globally. In the source workspace, mise run tuff -- <arguments> runs the current CLI without a global install.',
          '应用命令从当前目录向上查找最近的 tuffite.json，--manifest 可覆盖查找结果；默认打包输出到项目 dist 目录。dev、build 和 package 自动生成绑定并解析或下载 Framework。dev 在源码重建时复用已选 Distribution；--force-download-framework 只在启动时刷新一次。使用子命令 --help 查看精确参数。-v 增加日志细节，可在全局使用。在源码工作区中，mise run tuff -- <参数> 运行当前 CLI，无需全局安装。',
        ),
      ],
    },
    {
      id: 'development',
      title: t('Development package options', '开发包选项'),
      code: 'tuff dev --prepare-only\ntuff dev --devtools-port 9234\ntuff dev --force-download-framework',
      language: 'shell',
      paragraphs: [
        t(
          '--prepare-only refreshes the native package without launching. --devtools-port overrides the loopback CDP port. --force-download-framework explicitly bypasses local/cache selection for a new managed download. Keep exact local paths in environment or ignored machine configuration.',
          '--prepare-only 刷新原生包但不启动。--devtools-port 覆盖回环 CDP 端口。--force-download-framework 显式跳过本地和缓存选择，进行新的托管下载。将精确本地路径保存在环境变量或忽略的本机配置中。',
        ),
      ],
    },
  ],
};

export default article;
