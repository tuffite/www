import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://tuffite.org',
  trailingSlash: 'always',
  redirects: {
    '/': '/en/guides/introduction/',
    '/en/': '/en/guides/introduction/',
    '/zh/': '/zh/guides/introduction/',
  },
  integrations: [
    react(),
    starlight({
      title: 'Tuffite',
      description: 'Build desktop applications with Rust and Chromium.',
      logo: { src: './public/icons/mark.svg' },
      favicon: '/favicon.svg',
      // The content collection lives at the repository root instead of src/content/docs.
      markdown: { processedDirs: ['./docs'] },
      expressiveCode: {
        shiki: { langAlias: { mojom: 'cpp' } },
        getBlockLocale: ({ file }) => {
          const path = (file.path ?? file.url?.pathname ?? '').replaceAll('\\', '/');
          return path.includes('/docs/zh/') || path.startsWith('/zh/') ? 'zh-CN' : 'en';
        },
      },
      defaultLocale: 'en',
      locales: { en: { label: 'English', lang: 'en' }, zh: { label: '简体中文', lang: 'zh-CN' } },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/tuffite/tuffite' }],
      editLink: { baseUrl: 'https://github.com/tuffite/www/edit/main/' },
      customCss: ['./src/styles.css'],
      components: { Footer: './src/components/Footer.astro' },
      head: [
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        },
        { tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
      ],
      sidebar: [
        {
          label: 'Start here',
          translations: {
            'zh-CN': '从这里开始',
          },
          items: ['guides/introduction', 'guides/quick-start'],
        },
        {
          label: 'Build an application',
          translations: {
            'zh-CN': '应用开发指南',
          },
          items: [
            'guides/create-app',
            'guides/project-structure',
            'guides/commands',
            'guides/security',
            'guides/isolated-worlds',
            'guides/windows',
            'guides/process-model',
            'guides/distribution',
          ],
        },
        {
          label: 'Contribute to the framework',
          translations: {
            'zh-CN': 'Framework 贡献指南',
          },
          items: [
            'guides/framework',
            'guides/patch-boundaries',
            'guides/rolls',
            'guides/testing',
            'guides/playground',
          ],
        },
        {
          label: 'References',
          translations: {
            'zh-CN': '参考文档',
          },
          items: [
            'references/explorer',
            'references/rust',
            'references/javascript',
            'references/configuration',
            'references/cli',
          ],
        },
      ],
    }),
  ],
  vite: { build: { license: { fileName: 'THIRD_PARTY_LICENSES.md' } } },
});
