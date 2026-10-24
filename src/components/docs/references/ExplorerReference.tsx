import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useUiTranslation, type Locale } from '@/i18n';
import { CodeBlock } from '@/components/docs/CodeBlock';
import reference from '@/reference.generated.json';

export function ExplorerReference({ locale }: { locale: Locale }) {
  const { t } = useUiTranslation(locale);
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t('explorer.filterPlaceholder')}
          aria-label={t('explorer.filterLabel')}
        />
      </label>
      {reference.explorer
        .filter((value) => value.source.toLowerCase().includes(filter.toLowerCase()))
        .map((value) => (
          <div className="api-module" key={value.name}>
            <div className="api-module-body">
              <h3>{value.name}</h3>
              <CodeBlock code={value.source} language="webidl" locale={locale} />
              <a
                href={`https://github.com/tuffite/tuffite/blob/main/components/explorer/renderer/blink/${value.file}`}
              >
                {t('common.viewSource')} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}
