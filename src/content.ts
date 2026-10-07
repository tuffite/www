import { t, type Article, type Locale } from './content/types';
import introduction from './content/pages/guides/introduction';
import quickStart from './content/pages/guides/quick-start';
import createApp from './content/pages/guides/create-app';
import projectStructure from './content/pages/guides/project-structure';
import commands from './content/pages/guides/commands';
import security from './content/pages/guides/security';
import windows from './content/pages/guides/windows';
import processModel from './content/pages/guides/process-model';
import distribution from './content/pages/guides/distribution';
import framework from './content/pages/guides/framework';
import patchBoundaries from './content/pages/guides/patch-boundaries';
import rolls from './content/pages/guides/rolls';
import testing from './content/pages/guides/testing';
import playground from './content/pages/guides/playground';
import explorer from './content/pages/references/explorer';
import rust from './content/pages/references/rust';
import javascript from './content/pages/references/javascript';
import configuration from './content/pages/references/configuration';
import cli from './content/pages/references/cli';

export { t, type Locale, type Text, type Section, type Article } from './content/types';
export { appExample } from './content/examples';

export const groupNames = {
  start: t('Start here', '从这里开始'),
  application: t('Build an application', '应用开发指南'),
  framework: t('Contribute to the framework', 'Framework 贡献指南'),
  reference: t('References', '参考文档'),
};

export const articles: Article[] = [
  introduction,
  quickStart,
  createApp,
  projectStructure,
  commands,
  security,
  windows,
  processModel,
  distribution,
  framework,
  patchBoundaries,
  rolls,
  testing,
  playground,
  explorer,
  rust,
  javascript,
  configuration,
  cli,
];

export function parseRoute(path: string): { locale: Locale; article: Article } {
  const pieces = path.split(/[?#]/)[0].split('/').filter(Boolean);
  const locale: Locale = pieces[0] === 'zh' ? 'zh' : 'en';
  const slug = pieces.slice(1).join('/');
  return { locale, article: articles.find((a) => a.slug === slug) ?? articles[0] };
}

export function articlePath(article: Article, locale: Locale) {
  return `/${locale}/${article.slug}/`;
}

export function articleSourcePath(article: Article) {
  return `src/content/pages/${article.slug}.ts`;
}
