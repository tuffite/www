import { useState } from 'react';
import { ChevronDown, Code2, ExternalLink, Search } from 'lucide-react';
import { t, type Locale } from '@/content';
import { CodeBlock } from '@/components/docs/CodeBlock';
import reference from '@/reference.generated.json';

export function JavascriptPackageReference({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={
            t('Filter exports, types, or member names…', '筛选导出、类型或成员名称…')[locale]
          }
          aria-label={t('Filter JavaScript package exports', '筛选 JavaScript 包导出')[locale]}
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
                {t('View source', '查看源码')[locale]} <ExternalLink size={12} />
              </a>
            </div>
          </details>
        ))}
    </div>
  );
}
