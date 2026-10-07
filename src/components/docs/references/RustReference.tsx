import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { articles, articlePath, t, type Locale } from '@/content';
import reference from '@/reference.generated.json';

export function RustReference({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('Filter public Rust symbols…', '筛选 Rust 公共符号…')[locale]}
          aria-label={t('Filter Rust API', '筛选 Rust API')[locale]}
        />
      </label>
      <div className="symbol-grid">
        {reference.rustSymbols
          .filter((s) => s.toLowerCase().includes(filter.toLowerCase()))
          .map((symbol) => (
            <code key={symbol}>{symbol}</code>
          ))}
      </div>
      <p className="small-note">
        {
          t(
            'Full signatures, trait implementations, and examples are available in the generated Rustdoc.',
            '完整签名、trait 实现和示例可在生成的 Rustdoc 中查看。',
          )[locale]
        }{' '}
        <a href="/api/rust/tuffite/">
          Rustdoc <ExternalLink size={12} />
        </a>{' '}
        ·{' '}
        <a
          href={articlePath(
            articles.find((article) => article.kind === 'explorer')!,
            locale,
          )}
        >
          {t('Explorer DOM API', 'Explorer DOM API')[locale]}
        </a>
      </p>
    </div>
  );
}
