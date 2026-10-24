import { useState } from 'react';
import { Code2, ExternalLink, Search } from 'lucide-react';
import { useUiTranslation, type Locale, type TranslationKey } from '@/i18n';
import reference from '@/reference.generated.json';

type Schema = {
  type?: string | string[];
  $ref?: string;
  const?: unknown;
  enum?: unknown[];
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  anyOf?: Schema[];
  oneOf?: Schema[];
  default?: unknown;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  additionalProperties?: boolean | Schema;
  description?: string;
};
const schema = reference.schema as Schema & { $defs: Record<string, Schema> };
function typeLabel(field: Schema): string {
  if (field.$ref) return field.$ref.replace('#/$defs/', '');
  if (field.const !== undefined) return JSON.stringify(field.const);
  if (field.enum) return field.enum.map((v) => JSON.stringify(v)).join(' | ');
  if (field.anyOf || field.oneOf) return (field.anyOf ?? field.oneOf)!.map(typeLabel).join(' | ');
  if (field.type === 'array') return `${typeLabel(field.items ?? {})}[]`;
  return Array.isArray(field.type) ? field.type.join(' | ') : (field.type ?? 'value');
}

const fieldDescriptions: Record<string, TranslationKey> = {
  'root.productName': 'configuration.fields.root.productName',
  'root.$schema': 'configuration.fields.root.$schema',
  'root.app': 'configuration.fields.root.app',
  'root.build': 'configuration.fields.root.build',
  'root.bundle': 'configuration.fields.root.bundle',
  'app.identifier': 'configuration.fields.app.identifier',
  'app.security': 'configuration.fields.app.security',
  'app.windows': 'configuration.fields.app.windows',
  'build.mojomSources': 'configuration.fields.build.mojomSources',
  'app.assets': 'configuration.fields.app.assets',
  'app.network': 'configuration.fields.app.network',
  'build.devPackage': 'configuration.fields.build.devPackage',
  'build.devUrl': 'configuration.fields.build.devUrl',
  'build.beforeDevCommand': 'configuration.fields.build.beforeDevCommand',
  'build.devtoolsPort': 'configuration.fields.build.devtoolsPort',
  'bundle.resources': 'configuration.fields.bundle.resources',
  'security.csp': 'configuration.fields.security.csp',
  'security.capabilities': 'configuration.fields.security.capabilities',
  'window.label': 'configuration.fields.window.label',
  'window.url': 'configuration.fields.window.url',
  'window.width': 'configuration.fields.window.width',
  'window.height': 'configuration.fields.window.height',
};

export function ConfigurationReference({ locale }: { locale: Locale }) {
  const { t } = useUiTranslation(locale);
  const [filter, setFilter] = useState('');
  const groups: [string, Schema][] = [];
  function collect(name: string, value: Schema) {
    if (value.properties) {
      groups.push([name, value]);
      for (const [field, child] of Object.entries(value.properties)) {
        if (child.properties || child.anyOf || child.oneOf) collect(`${name}.${field}`, child);
        if (child.items?.properties) collect(`${name}.${field}[]`, child.items);
      }
    }
    for (const [index, variant] of (value.anyOf ?? value.oneOf ?? []).entries())
      collect(`${name}.variant${index + 1}`, variant);
  }
  collect('root', schema);
  for (const [name, value] of Object.entries(schema.$defs)) collect(name, value);
  return (
    <div className="reference-browser">
      <label className="filter-input">
        <Search size={16} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('configuration.filterPlaceholder')}
          aria-label={t('configuration.filterLabel')}
        />
      </label>
      <div className="reference-heading">
        <span>{t('configuration.schema')}</span>
        <a href="/schema/v2/tuffite.schema.json" target="_blank" rel="noreferrer">
          schema/v2 <ExternalLink size={12} />
        </a>
      </div>
      {groups.map(([name, def]) => {
        const fields = Object.entries(def.properties ?? {}).filter(([field]) =>
          `${name}.${field} ${typeLabel(def.properties![field])}`
            .toLowerCase()
            .includes(filter.toLowerCase()),
        );
        if (!fields.length) return null;
        return (
          <div className="schema-group" key={name} id={`type-${name}`}>
            <div className="schema-title">
              <Code2 size={15} />
              <h3>{name}</h3>
              <span>{t('configuration.object')}</span>
              {def.additionalProperties === false && (
                <span className="schema-strict">{t('configuration.strict')}</span>
              )}
            </div>
            {fields.map(([field, value]) => (
              <div className="schema-field" key={field}>
                <div>
                  <code>{field}</code>
                  {def.required?.includes(field) && (
                    <span className="required">{t('configuration.required')}</span>
                  )}
                </div>
                <span className="field-type">{typeLabel(value)}</span>
                {fieldDescriptions[`${name}.${field}`] && (
                  <p>{t(fieldDescriptions[`${name}.${field}`])}</p>
                )}
                {value.description && <p>{value.description}</p>}
                {value.default !== undefined && (
                  <p>
                    {t('configuration.default')}: <code>{JSON.stringify(value.default)}</code>
                  </p>
                )}
                {value.pattern && (
                  <p>
                    {t('configuration.pattern')}: <code>{value.pattern}</code>
                  </p>
                )}
                {value.minimum !== undefined && (
                  <p>
                    min: {value.minimum}
                    {value.maximum !== undefined ? ` · max: ${value.maximum}` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      })}
      {!groups.some(([name, def]) =>
        Object.entries(def.properties ?? {}).some(([field, value]) =>
          `${name}.${field} ${typeLabel(value)}`.toLowerCase().includes(filter.toLowerCase()),
        ),
      ) && <p>{t('configuration.noResults')}</p>}
    </div>
  );
}
