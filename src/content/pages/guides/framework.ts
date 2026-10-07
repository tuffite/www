import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/framework',
  group: 'framework',
  title: t('Framework contributor setup', 'Framework 贡献者环境'),
  description: t(
    'Work inside Chromium without losing repository boundaries.',
    '在 Chromium 内工作，同时保持仓库边界清晰。',
  ),
  sections: [
    {
      id: 'checkout',
      title: t('Prepare the full workspace', '准备完整工作区'),
      code: 'git clone https://github.com/tuffite/workspace.git\ncd workspace\nmise trust\nmise run setup\nmise run framework -- build --framework\nmise run dev',
      language: 'shell',
      paragraphs: [
        t(
          'The outer root owns .gclient, Mise, and pinned Depot Tools. src/tuffite is the separate Framework repository; src is the Chromium parent repository. Inspect Git status in all repositories before changing native integration.',
          '外层根目录管理 .gclient、Mise 和固定版本 Depot Tools。src/tuffite 是独立 Framework 仓库；src 是 Chromium 父仓库。修改原生集成前，分别检查所有仓库的 Git 状态。',
        ),
      ],
    },
    {
      id: 'tools',
      title: t('Daily contributor commands', '日常贡献者命令'),
      code: 'cd src/tuffite\npython3 x.py build --run\npython3 x.py compdb\npython3 x.py test --suite framework\ncargo spo status --all',
      language: 'shell',
      paragraphs: [
        t(
          'x.py owns native build, packaging, tests, and dependency rolls. spo owns Git-backed patch authoring and recovery. tuff is the application CLI. Run native tasks with the outer Mise environment active.',
          'x.py 管理原生构建、打包、测试和依赖 roll；spo 管理基于 Git 的补丁创作及恢复；tuff 是应用 CLI。运行原生任务时保持外层 Mise 环境激活。',
        ),
      ],
    },
    {
      id: 'layout',
      title: t('Source ownership', '源码归属'),
      code: 'src/tuffite/\n├── framework/          # Native implementation and public ABI\n├── components/         # Reusable components and integration\n├── crates/             # Rust SDK, ABI, runtime, macros, spo\n├── packages/tuffite/    # JavaScript runtime and Vite plugin\n├── playground/         # Integration fixture\n├── patches/chromium/   # Ordered Chromium mailboxes\n└── DEPS                # The sole Chromium revision declaration',
      language: 'text',
    },
  ],
};

export default article;
