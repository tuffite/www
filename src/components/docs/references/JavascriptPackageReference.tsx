import { useState } from 'react';
import { ChevronDown, Code2, ExternalLink, Search } from 'lucide-react';
import { useUiTranslation, type Locale } from '@/i18n';
import { CodeBlock } from '@/components/docs/CodeBlock';
import reference from '@/reference.generated.json';

export function JavascriptPackageReference({ locale }: { locale: Locale }) {
  const { t } = useUiTranslation(locale);
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t('javascript.filterPlaceholder')}
          aria-label={t('javascript.filterLabel')}
        />
      </label>
      {reference.javascriptExports
        .filter((value) =>
          `${value.name} ${value.source}`.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((value) => (
          <details className="api-module" key={value.name} open={filter.length > 0}>
            <summary>
              <Code2 size={16} />
              <span>{value.name}</span>
              <ChevronDown size={15} />
            </summary>
            <div className="api-module-body">
              <CodeBlock code={value.source} language="typescript" locale={locale} />
              <a
                href={`https://github.com/tuffite/tuffite/blob/main/packages/tuffite/${value.file}`}
              >
                {t('common.viewSource')} <ExternalLink size={12} />
              </a>
            </div>
          </details>
        ))}
    </div>
  );
}
