import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/project-structure',
  group: 'application',
  title: t('Project structure', '项目结构'),
  description: t(
    'Keep application code, generated contracts, and native output easy to find.',
    '清晰组织应用代码、生成契约和原生产物。',
  ),
  sections: [
    {
      id: 'files',
      title: t('The application workspace', '应用工作区'),
      code: 'my-app/\n├── Cargo.toml          # Rust library and SDK dependencies\n├── build.rs            # Distribution + ShellAPI build helpers\n├── tuffite.json        # Application, security, build, bundle\n├── shell_api.d.ts      # Typed application endpoint declarations\n├── src/lib.rs          # Application and handlers\n├── generated/          # Checked-in JavaScript/TypeScript bindings\n└── ui/                 # Web frontend',
      language: 'text',
      paragraphs: [
        t(
          'Use crate-type = ["cdylib"] for the application library. build.rs combines tuffite::build::framework::Resolver and tuffite::build::shell_api::Generator through tuffite::build::Builder. Do not hand-edit generated bindings.',
          '应用库使用 crate-type = ["cdylib"]。build.rs 通过 tuffite::build::Builder 组合 tuffite::build::framework::Resolver 和 tuffite::build::shell_api::Generator。不要手工修改生成绑定。',
        ),
      ],
    },
    {
      id: 'ownership',
      title: t('Keep source and outputs separate', '分离源码与产物'),
      paragraphs: [
        t(
          'Commit the manifest, declaration files, and generated JavaScript/TypeScript contracts. Cargo output, native packages, Vite output, downloaded Distributions, and local machine settings belong in ignored paths. Keep the application in its own repository.',
          '提交配置文件、声明文件和生成的 JavaScript/TypeScript 契约。Cargo 输出、原生包、Vite 输出、下载的 Distribution 和本机设置放在忽略路径中。将应用放在自己的仓库中。',
        ),
      ],
    },
  ],
};

export default article;
