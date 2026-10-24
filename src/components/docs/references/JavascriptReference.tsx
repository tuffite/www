import { useState } from 'react';
import { ChevronDown, Code2, Search } from 'lucide-react';
import { useUiTranslation, type Locale } from '@/i18n';
import { CodeBlock } from '@/components/docs/CodeBlock';
import reference from '@/reference.generated.json';

export function JavascriptReference({ locale }: { locale: Locale }) {
  const { t } = useUiTranslation(locale);
  const [filter, setFilter] = useState('');
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('mojom.filterPlaceholder')}
          aria-label={t('mojom.filterLabel')}
        />
      </label>
      {reference.modules
        .filter((m) => `${m.name} ${m.source}`.toLowerCase().includes(filter.toLowerCase()))
        .map((module) => (
          <details className="api-module" key={module.name} id={`module-${module.name}`}>
            <summary>
              <Code2 size={16} />
              <span>{module.file}</span>
              <small>{t('mojom.methods', { count: module.methods.length })}</small>
              <ChevronDown size={15} />
            </summary>
            <div className="api-module-body">
              {module.methods.map((method) => (
                <div className="method" key={method.name}>
                  <code>
                    {method.route}: {method.signature}
                  </code>
                </div>
              ))}
              <CodeBlock code={module.source} language="mojom" locale={locale} />
            </div>
          </details>
        ))}
    </div>
  );
}
