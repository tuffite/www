import { useEffect, useRef, useState } from 'react';
import { articlePath, parseRoute, t } from './content';
import { NavigationContext } from './navigation';
import { Header } from './components/docs/Header';
import { Sidebar } from './components/docs/Sidebar';
import { ArticlePage } from './components/docs/ArticlePage';
import { TableOfContents } from './components/docs/TableOfContents';
import { SearchDialog } from './components/docs/SearchDialog';

export function App({ initialPath }: { initialPath?: string }) {
  const [path, setPath] = useState(
    initialPath ??
      (typeof window === 'undefined' ? '/en/guides/introduction/' : window.location.pathname),
  );
  const { locale, article } = parseRoute(path);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const pop = () => {
      setPath(window.location.pathname);
      setMenuOpen(false);
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('popstate', pop);
    window.addEventListener('keydown', shortcut);
    return () => {
      window.removeEventListener('popstate', pop);
      window.removeEventListener('keydown', shortcut);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    document.title = `${article.title[locale]} | Tuffite`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', article.description[locale]);
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [article, locale]);
  function navigate(next: string) {
    window.history.pushState({}, '', next);
    setPath(next.split('#')[0]);
    setMenuOpen(false);
    setSearchOpen(false);
    if (next.includes('#'))
      requestAnimationFrame(() =>
        document.getElementById(next.split('#')[1])?.scrollIntoView({ behavior: 'smooth' }),
      );
    else {
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    }
  }
  function toggleTheme() {
    const value = !dark;
    setDark(value);
    document.documentElement.classList.toggle('dark', value);
    try {
      localStorage.setItem('tuffite-theme', value ? 'dark' : 'light');
    } catch {
      /* Theme still works without storage. */
    }
  }
  return (
    <NavigationContext.Provider value={navigate}>
      <a className="skip-link" href="#main-content">
        {t('Skip to content', '跳转到正文')[locale]}
      </a>
      <Header
        article={article}
        locale={locale}
        dark={dark}
        menuOpen={menuOpen}
        onSearch={() => setSearchOpen(true)}
        onLanguage={() => navigate(articlePath(article, locale === 'en' ? 'zh' : 'en'))}
        onTheme={toggleTheme}
        onMenu={() => setMenuOpen(!menuOpen)}
      />
      <div className="workspace">
        {menuOpen && (
          <button
            className="sidebar-scrim"
            aria-label={t('Close navigation', '关闭导航')[locale]}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <Sidebar article={article} locale={locale} menuOpen={menuOpen} />
        <ArticlePage article={article} locale={locale} main={main} />
        <TableOfContents article={article} locale={locale} />
      </div>
      <SearchDialog
        locale={locale}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        navigate={navigate}
      />
    </NavigationContext.Provider>
  );
}
