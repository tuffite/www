import { useState } from 'react';
import { ArrowRight, BookOpen, Code2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { articles, articlePath, t, type Locale } from '@/content';
import { ui } from '@/strings';
import reference from '@/reference.generated.json';

export function SearchDialog({
  locale,
  searchOpen,
  setSearchOpen,
  navigate,
}: {
  locale: Locale;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  navigate: (path: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const results = articles.filter((a) =>
    [
      a.title[locale],
      a.description[locale],
      a.slug,
      ...a.sections.flatMap((s) => [
        s.title[locale],
        ...(s.paragraphs ?? []).map((p) => p[locale]),
        s.code ?? '',
      ]),
      a.kind === 'javascript'
        ? reference.modules.map((m) => m.source).join(' ')
        : a.kind === 'configuration'
          ? JSON.stringify(reference.schema)
          : a.kind === 'rust'
            ? reference.rustSymbols.join(' ')
            : '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent closeLabel={t('Close', '关闭')[locale]}>
        <DialogTitle className="sr-only">{ui.search[locale]}</DialogTitle>
        <DialogDescription className="sr-only">
          {
            t(
              'Search guides and references. Choose a result to open the page.',
              '搜索指南和参考，选择结果打开页面。',
            )[locale]
          }
        </DialogDescription>
        <label className="dialog-search">
          <Search size={19} />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ui.search[locale]}
            aria-label={ui.search[locale]}
          />
        </label>
        <div className="search-results">
          {results.length ? (
            results.map((result) => (
              <button
                key={result.slug}
                className="search-result"
                onClick={() => navigate(articlePath(result, locale))}
              >
                <span className="search-result-icon">
                  {result.group === 'reference' ? <Code2 size={17} /> : <BookOpen size={17} />}
                </span>
                <span>
                  <strong>{result.title[locale]}</strong>
                  <small>{result.description[locale]}</small>
                </span>
                <ArrowRight size={15} />
              </button>
            ))
          ) : (
            <p className="search-empty">{ui.none[locale]}</p>
          )}
        </div>
        <div className="search-footer">
          <span>{t('Guides & references', '指南与参考')[locale]}</span>
          <span>Esc {t('to close', '关闭')[locale]}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
