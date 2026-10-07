import { renderToString } from 'react-dom/server';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { App } from '../src/App';
import { articles, articlePath, type Locale } from '../src/content';
const dist = resolve(import.meta.dir, '../dist');
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const escape = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const urls: string[] = [];
for (const locale of ['en', 'zh'] as Locale[])
  for (const article of articles) {
    const path = articlePath(article, locale);
    const metadata = `<link rel="canonical" href="https://tuffite.org${path}"/><link rel="alternate" hreflang="en" href="https://tuffite.org${articlePath(article, 'en')}"/><link rel="alternate" hreflang="zh-CN" href="https://tuffite.org${articlePath(article, 'zh')}"/><meta property="og:title" content="${escape(article.title[locale])} | Tuffite"/><meta property="og:description" content="${escape(article.description[locale])}"/><meta property="og:url" content="https://tuffite.org${path}"/>`;
    const html = template
      .replace('<html lang="en">', `<html lang="${locale === 'zh' ? 'zh-CN' : 'en'}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escape(article.title[locale])} | Tuffite</title>`)
      .replace(
        /<meta name="description"[^>]*>/,
        `<meta name="description" content="${escape(article.description[locale])}"/>`,
      )
      .replace('</head>', metadata + '</head>')
      .replace(
        '<div id="root"></div>',
        `<div id="root">${renderToString(createElement(App, { initialPath: path }))}</div>`,
      );
    const output = resolve(dist, path.slice(1));
    await mkdir(output, { recursive: true });
    await writeFile(resolve(output, 'index.html'), html);
    if (article === articles[0]) {
      await mkdir(resolve(dist, locale), { recursive: true });
      await writeFile(resolve(dist, locale, 'index.html'), html);
      if (locale === 'en') await writeFile(resolve(dist, 'index.html'), html);
    }
    urls.push(`https://tuffite.org${path}`);
  }
await writeFile(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`,
);
await writeFile(
  resolve(dist, 'robots.txt'),
  'User-agent: *\nAllow: /\nSitemap: https://tuffite.org/sitemap.xml\n',
);
console.log(`Prerendered ${urls.length} bilingual documentation pages`);
