import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/testing',
  group: 'framework',
  title: t('Test & package the Framework', '测试与打包 Framework'),
  description: t(
    'Validate the layer you changed, then build a distributable runtime.',
    '验证修改涉及的层次，再构建可分发运行时。',
  ),
  sections: [
    {
      id: 'suites',
      title: t('Choose the validation suite', '选择验证套件'),
      code: 'python3 x.py test --suite framework\npython3 x.py test --suite native\npython3 x.py test --suite smoke\npython3 x.py test --suite explorer',
      language: 'shell',
      bullets: [
        t(
          'framework: generated bindings, browser codec tests, Python tests, Rust tests, formatting, and Clippy.',
          'framework：生成绑定、浏览器编解码器测试、Python 测试、Rust 测试、格式检查和 Clippy。',
        ),
        t('native: compile and run native unit tests.', 'native：编译并运行原生单元测试。'),
        t(
          'smoke / explorer: package Playground and exercise native integration through CDP.',
          'smoke / explorer：打包 Playground，通过 CDP 验证原生集成。',
        ),
      ],
    },
    {
      id: 'package',
      title: t('Package a local Distribution', '打包本地 Distribution'),
      code: 'python3 x.py package --profile release --target-cpu x64\ncargo run --package tuffite --bin tuff -- package --manifest playground/tuffite.json',
      language: 'shell',
      paragraphs: [
        t(
          'Packaging builds incrementally by default. --skip-build explicitly packages existing output. Framework application builds receive a local Distribution with automatic download disabled, so C++ edits cannot silently run against a remote runtime.',
          '打包默认进行增量构建。--skip-build 显式打包已有输出。Framework 应用构建使用明确的本地 Distribution 并禁用自动下载，避免 C++ 修改运行在远程运行时上而不被察觉。',
        ),
      ],
    },
  ],
};

export default article;
