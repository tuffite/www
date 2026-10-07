import { useState } from 'react';
import { ChevronDown, Code2, Search } from 'lucide-react';
import { t, type Locale } from '@/content';
import { CodeBlock } from '@/components/docs/CodeBlock';
import reference from '@/reference.generated.json';

export function JavascriptReference({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('Filter modules or method names…', '筛选模块或方法名…')[locale]}
          aria-label={t('Filter JavaScript API', '筛选 JavaScript API')[locale]}
        />
      </label>
      {reference.modules
        .filter((m) => `${m.name} ${m.source}`.toLowerCase().includes(filter.toLowerCase()))
        .map((module) => (
          <details className="api-module" key={module.name} id={`module-${module.name}`}>
            <summary>
              <Code2 size={16} />
              <span>tuffite.{module.name}</span>
              <small>
                {module.methods.length} {t('methods', '个方法')[locale]}
              </small>
              <ChevronDown size={15} />
            </summary>
            <div className="api-module-body">
              {module.methods.map((method) => (
                <div className="method" key={method.name}>
                  <code>{method.signature}</code>
                </div>
              ))}
              <CodeBlock code={module.source} language="typescript" locale={locale} />
            </div>
          </details>
        ))}
    </div>
  );
}
