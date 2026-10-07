import { t, type Article } from '../../types';

const article: Article = {
  slug: 'references/configuration',
  group: 'reference',
  kind: 'configuration',
  title: t('tuffite.json', 'tuffite.json'),
  description: t(
    'A searchable configuration reference generated from the canonical schema.',
    '基于权威 schema 生成、可搜索的配置参考。',
  ),
  sections: [
    {
      id: 'manifest',
      title: t('The application manifest', '应用配置文件'),
      code: '{\n  "$schema": "https://tuffite.org/schema/v2/tuffite.schema.json",\n  "productName": "My App",\n  "app": {\n    "identifier": "org.example.myapp",\n    "security": { "capabilities": [] },\n    "assets": []\n  },\n  "build": {\n    "shellApi": { "namespace": "myapp", "definitions": ["shell_api.d.ts"] }\n  }\n}',
      language: 'json',
      paragraphs: [
        t(
          'The root requires app and build. app defines identifier, security, and assets; build.shellApi defines code generation. productName and bundle are optional. Source and packaged application manifests have no schemaVersion. Unknown properties are rejected where additionalProperties is false. Validate with tuff check; type correctness alone does not guarantee route or permission semantics.',
          '根对象要求 app 和 build。app 定义 identifier、security 和 assets，build.shellApi 定义代码生成。productName 与 bundle 可选。源配置和打包后的应用 manifest 都没有 schemaVersion。additionalProperties 为 false 时拒绝未知属性。使用 tuff check 验证；类型正确并不代表路由和权限语义正确。',
        ),
      ],
    },
    {
      id: 'fields',
      title: t('Explore configuration types', '浏览配置类型'),
      paragraphs: [
        t(
          'Fields, required markers, enums, unions, and references below come directly from schemas/tuffite.schema.json. Filter by field or type name. A missing default means the schema does not declare one.',
          '下面的字段、必填标记、枚举、联合类型和引用直接来自 schemas/tuffite.schema.json。可以按字段或类型名称筛选。没有显示默认值，表示 schema 未声明默认值。',
        ),
      ],
    },
  ],
};

export default article;
