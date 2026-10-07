import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { t, type Locale } from '@/content';
import { CodeBlock } from '@/components/docs/CodeBlock';
import reference from '@/reference.generated.json';

export function ExplorerReference({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={
            t('Filter Explorer interfaces or members…', '筛选 Explorer 接口或成员…')[locale]
          }
          aria-label={t('Filter Explorer API', '筛选 Explorer API')[locale]}
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
                {t('View source', '查看源码')[locale]} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}
