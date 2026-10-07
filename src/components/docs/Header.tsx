import { GitFork, Globe2, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { articles, articlePath, t, type Article, type Locale } from '@/content';
import { ui } from '@/strings';
import { NavigationLink as Link } from '@/navigation';

export function Header({
  article,
  locale,
  dark,
  menuOpen,
  onSearch,
  onLanguage,
  onTheme,
  onMenu,
}: {
  article: Article;
  locale: Locale;
  dark: boolean;
  menuOpen: boolean;
  onSearch: () => void;
  onLanguage: () => void;
  onTheme: () => void;
  onMenu: () => void;
}) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to={articlePath(articles[0], locale)}>
          <img src="/favicon.svg" alt="" width="30" height="30" />
          <span>tuffite</span>
          <span className="version">0.1</span>
        </Link>
        <nav className="top-navigation" aria-label={t('Main navigation', '主导航')[locale]}>
          <Link
            to={articlePath(articles[0], locale)}
            className={article.group !== 'reference' ? 'selected' : ''}
          >
            {ui.guides[locale]}
          </Link>
          <Link
            to={articlePath(
              articles.find((a) => a.kind === 'rust')!,
              locale,
            )}
            className={article.group === 'reference' ? 'selected' : ''}
          >
            {ui.references[locale]}
          </Link>
        </nav>
        <button className="search-trigger" onClick={onSearch}>
          <Search size={16} />
          <span>{ui.search[locale]}</span>
          <kbd>⌘ K</kbd>
        </button>
        <div className="top-actions">
          <Button
            variant="ghost"
            size="icon"
            aria-label={ui.search[locale]}
            className="mobile-search"
            onClick={onSearch}
          >
            <Search size={18} />
          </Button>
          <Button variant="ghost" size="sm" aria-label={ui.language[locale]} onClick={onLanguage}>
            <Globe2 size={16} />
            <span>{locale === 'en' ? '中文' : 'EN'}</span>
          </Button>
          <span className="action-divider" />
          <Button variant="ghost" size="icon" aria-label={ui.theme[locale]} onClick={onTheme}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <a
            className="github-link"
            href="https://github.com/tuffite/tuffite"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <GitFork size={19} />
          </a>
          <Button
            variant="ghost"
            size="icon"
            aria-label={ui.menu[locale]}
            aria-expanded={menuOpen}
            className="mobile-menu"
            onClick={onMenu}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
