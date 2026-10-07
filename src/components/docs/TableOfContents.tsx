import { ArrowRight } from 'lucide-react';
import { articles, articlePath, t, type Article, type Locale } from '@/content';
import { ui } from '@/strings';
import { NavigationLink as Link } from '@/navigation';

export function TableOfContents({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <aside className="toc" aria-label={ui.onPage[locale]}>
      <div className="toc-title">{ui.onPage[locale]}</div>
      {article.sections.map((s, i) => (
        <a key={s.id} className={i === 0 ? 'toc-first' : ''} href={`#${s.id}`}>
          {s.title[locale]}
        </a>
      ))}
      <div className="toc-extra">
        <span>{t('Something to build?', '准备开始构建？')[locale]}</span>
        <Link
          to={articlePath(
            articles.find((a) => a.slug === 'guides/quick-start')!,
            locale,
          )}
        >
          {t('Start with Tuffite', '从 Tuffite 开始')[locale]} <ArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
