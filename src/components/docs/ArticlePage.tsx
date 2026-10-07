import { type RefObject } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, ExternalLink } from 'lucide-react';
import { articles, articlePath, articleSourcePath, t, type Article, type Locale } from '@/content';
import { ui } from '@/strings';
import { NavigationLink as Link } from '@/navigation';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Introduction } from './Introduction';
import { ConfigurationReference } from './references/ConfigurationReference';
import { JavascriptReference } from './references/JavascriptReference';
import { JavascriptPackageReference } from './references/JavascriptPackageReference';
import { ExplorerReference } from './references/ExplorerReference';
import { RustReference } from './references/RustReference';

export function ArticlePage({
  article,
  locale,
  main,
}: {
  article: Article;
  locale: Locale;
  main: RefObject<HTMLElement | null>;
}) {
  const index = articles.indexOf(article);
  const previous = articles[index - 1];
  const next = articles[index + 1];
  return (
    <main id="main-content" tabIndex={-1} ref={main} className="main">
      <div className="breadcrumbs">
        <BookOpen size={14} />
        <span>{article.group === 'reference' ? ui.references[locale] : ui.guides[locale]}</span>
        <ChevronRight size={12} />
        <span>{article.title[locale]}</span>
      </div>
      <article>
        <div className="article-eyebrow">
          {article.group === 'reference'
            ? t('THE CONTRACT, IN DETAIL', '契约与细节')[locale]
            : article.group === 'framework'
              ? t('FOR FRAMEWORK CONTRIBUTORS', '面向 Framework 贡献者')[locale]
              : t('A FOUNDATION FOR YOUR NEXT APP', '为下一个应用打下基础')[locale]}
        </div>
        <h1>{article.title[locale]}</h1>
        <p className="article-description">{article.description[locale]}</p>
        <p className="release-status">
          {
            t(
              'Experimental source release. Production hardening and published SDK packages are still in progress.',
              '实验性源码版本。生产安全加固与 SDK 发布仍在进行中。',
            )[locale]
          }
        </p>
        {article === articles[0] && <Introduction locale={locale} />}
        {article.sections.map((section) => (
          <section id={section.id} key={section.id} className="doc-section">
            <h2>
              <a href={`#${section.id}`}>
                {section.title[locale]}
                <span className="heading-anchor">#</span>
              </a>
            </h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p[locale]}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((b, i) => (
                  <li key={i}>{b[locale]}</li>
                ))}
              </ul>
            )}
            {section.code && (
              <CodeBlock code={section.code} language={section.language} locale={locale} />
            )}{' '}
            {section.note && (
              <div className="callout">
                <div className="callout-mark">i</div>
                <p>{section.note[locale]}</p>
              </div>
            )}
            {article.kind === 'configuration' && section.id === 'fields' && (
              <ConfigurationReference locale={locale} />
            )}{' '}
            {article.kind === 'javascript' && section.id === 'package-exports' && (
              <JavascriptPackageReference locale={locale} />
            )}{' '}
            {article.kind === 'javascript' && section.id === 'modules' && (
              <JavascriptReference locale={locale} />
            )}{' '}
            {article.kind === 'explorer' && section.id === 'interfaces' && (
              <ExplorerReference locale={locale} />
            )}{' '}
            {article.kind === 'rust' && section.id === 'symbols' && (
              <RustReference locale={locale} />
            )}
          </section>
        ))}
      </article>
      <div className="article-meta">
        <span>
          {
            t('Tuffite documentation · English & 简体中文', 'Tuffite 文档 · English 与简体中文')[
              locale
            ]
          }
        </span>
        <a
          href={`https://github.com/tuffite/www/edit/main/${articleSourcePath(article)}`}
          target="_blank"
          rel="noreferrer"
        >
          {ui.edit[locale]} <ExternalLink size={12} />
        </a>
      </div>
      <div className="pagination">
        {previous ? (
          <Link to={articlePath(previous, locale)} className="pagination-card">
            <span>
              <ArrowLeft size={13} />
              {ui.previous[locale]}
            </span>
            <strong>{previous.title[locale]}</strong>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link to={articlePath(next, locale)} className="pagination-card next">
            <span>
              {ui.next[locale]}
              <ArrowRight size={13} />
            </span>
            <strong>{next.title[locale]}</strong>
          </Link>
        )}
      </div>
      <footer className="main-footer">
        <span>
          © {new Date().getUTCFullYear()} Tuffite {t('contributors', '贡献者')[locale]}
        </span>
        <span>
          <a href="/LICENSE.txt">MIT OR Apache-2.0</a> ·{' '}
          <a href="/THIRD_PARTY_NOTICES.txt">{t('Source notices', '源码声明')[locale]}</a> ·{' '}
          <a href="/THIRD_PARTY_LICENSES.md">{t('Dependency licenses', '依赖许可证')[locale]}</a>
        </span>
      </footer>
    </main>
  );
}
