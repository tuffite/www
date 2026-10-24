import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useUiTranslation, type Locale } from '@/i18n';
import reference from '@/reference.generated.json';

export function RustReference({ locale }: { locale: Locale }) {
  const { t } = useUiTranslation(locale);
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('rust.filterPlaceholder')}
          aria-label={t('rust.filterLabel')}
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
        {t('rust.rustdocNote')}{' '}
        <a href="/api/rust/tuffite/">
          Rustdoc <ExternalLink size={12} />
        </a>{' '}
        · <a href={`/${locale}/references/explorer/`}>{t('rust.explorerLink')}</a>
      </p>
    </div>
  );
}
