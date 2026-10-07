import { ArrowRight, ChevronRight, Code2, FileJson2, Terminal } from 'lucide-react';
import { articles, articlePath, groupNames, t, type Article, type Locale } from '@/content';
import { NavigationLink as Link } from '@/navigation';

export function Sidebar({
  article,
  locale,
  menuOpen,
}: {
  article: Article;
  locale: Locale;
  menuOpen: boolean;
}) {
  return (
    <aside
      className={`sidebar ${menuOpen ? 'is-open' : ''}`}
      aria-label={t('Documentation navigation', '文档导航')[locale]}
    >
      <div className="sidebar-top">
        <span className="sidebar-eyebrow">{t('DOCUMENTATION', '开发者文档')[locale]}</span>
        <span className="status-dot" />
      </div>
      {(['start', 'application', 'framework', 'reference'] as const).map((group) => (
        <div className="nav-group" key={group}>
          <div className="nav-group-title">{groupNames[group][locale]}</div>
          {articles
            .filter((a) => a.group === group)
            .map((a) => (
              <Link
                key={a.slug}
                to={articlePath(a, locale)}
                aria-current={a === article ? 'page' : undefined}
                className={`nav-item ${a === article ? 'active' : ''}`}
              >
                {a.group === 'reference' ? (
                  a.kind === 'configuration' ? (
                    <FileJson2 size={14} />
                  ) : a.kind === 'cli' ? (
                    <Terminal size={14} />
                  ) : (
                    <Code2 size={14} />
                  )
                ) : (
                  <span className="nav-bullet" />
                )}
                <span>{a.title[locale]}</span>
                {a === article && <ChevronRight size={13} />}
              </Link>
            ))}
        </div>
      ))}
      <div className="sidebar-footer">
        <span>
          {t('Built with Rust. Powered by Chromium.', '以 Rust 构建，由 Chromium 驱动。')[locale]}
        </span>
        <a href="https://tuffite.org">
          tuffite.org <ArrowRight size={13} />
        </a>
      </div>
    </aside>
  );
}
