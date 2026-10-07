import { useState } from 'react';
import { Code2, ExternalLink, Search } from 'lucide-react';
import { t, type Locale, type Text } from '@/content';
import { ui } from '@/strings';
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

const fieldDescriptions: Record<string, Text> = {
  'root.productName': t(
    'Application display and bundle name; defaults to the Cargo package name.',
    '应用显示名称与 bundle 名称，默认使用 Cargo 包名。',
  ),
  'root.$schema': t(
    'JSON Schema URL used by editor validation.',
    '编辑器验证所用的 JSON Schema 地址。',
  ),
  'root.app': t(
    'Application identity, security, windows, native API, and assets.',
    '应用标识、安全、窗口、原生 API 和资源。',
  ),
  'root.build': t(
    'Code generation, development package, web server, and debugging settings.',
    '代码生成、开发包、Web 服务器和调试设置。',
  ),
  'root.bundle': t('Resources included in the application package.', '应用包包含的资源。'),
  'app.identifier': t(
    'Application identifier, conventionally in reverse-domain form.',
    '应用标识，通常使用反向域名形式。',
  ),
  'app.security': t(
    'Content security policy and origin-scoped capabilities.',
    '内容安全策略和按 origin 限定的能力。',
  ),
  'app.windows': t('Initial native window configurations.', '初始原生窗口配置。'),
  'build.shellApi': t(
    'Namespace and declaration files for typed code generation.',
    '类型化代码生成的命名空间与声明文件。',
  ),
  'app.assets': t(
    'Explicit mappings from request origins/paths to resource files.',
    '请求 origin / 路径到资源文件的显式映射。',
  ),
  'app.network': t('Application network policy.', '应用网络策略。'),
  'build.devPackage': t(
    'Directory of the refreshed native development package.',
    '刷新后的原生开发包目录。',
  ),
  'build.devUrl': t(
    'Loopback frontend URL used by the authenticated dev override.',
    '经过认证的开发覆盖所使用的回环前端地址。',
  ),
  'build.beforeDevCommand': t(
    'Command started before the native development window.',
    '在原生开发窗口前启动的命令。',
  ),
  'build.devtoolsPort': t(
    'Loopback Chrome DevTools Protocol port.',
    '回环 Chrome DevTools Protocol 端口。',
  ),
  'bundle.resources': t(
    'Application files and directories to include in the package.',
    '需要包含在应用包中的文件和目录。',
  ),
  'security.csp': t('Frontend Content-Security-Policy.', '前端 Content-Security-Policy。'),
  'security.capabilities': t(
    'Native permissions for explicitly matched origins.',
    '针对明确匹配 origin 的原生权限。',
  ),
  'window.label': t('Application-visible window label.', '应用可见的窗口标签。'),
  'window.url': t('Initial page URL for the native window.', '原生窗口的初始页面 URL。'),
  'window.width': t('Initial window width.', '初始窗口宽度。'),
  'window.height': t('Initial window height.', '初始窗口高度。'),
};

export function ConfigurationReference({ locale }: { locale: Locale }) {
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
          placeholder={t('Filter fields and configuration types…', '筛选字段与配置类型…')[locale]}
          aria-label={t('Filter configuration fields', '筛选配置字段')[locale]}
        />
      </label>
      <div className="reference-heading">
        <span>{t('Canonical JSON Schema', '权威 JSON Schema')[locale]}</span>
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
              <span>{t('object', '对象')[locale]}</span>
              {def.additionalProperties === false && (
                <span className="schema-strict">
                  {t('No unknown fields', '不接受未知字段')[locale]}
                </span>
              )}
            </div>
            {fields.map(([field, value]) => (
              <div className="schema-field" key={field}>
                <div>
                  <code>{field}</code>
                  {def.required?.includes(field) && (
                    <span className="required">{t('required', '必填')[locale]}</span>
                  )}
                </div>
                <span className="field-type">{typeLabel(value)}</span>
                {fieldDescriptions[`${name}.${field}`] && (
                  <p>{fieldDescriptions[`${name}.${field}`][locale]}</p>
                )}
                {value.description && <p>{value.description}</p>}
                {value.default !== undefined && (
                  <p>
                    {t('Default', '默认值')[locale]}: <code>{JSON.stringify(value.default)}</code>
                  </p>
                )}
                {value.pattern && (
                  <p>
                    {t('Pattern', '格式')[locale]}: <code>{value.pattern}</code>
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
      ) && <p>{ui.none[locale]}</p>}
    </div>
  );
}
