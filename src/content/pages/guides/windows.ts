import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/windows',
  group: 'application',
  title: t('Windows & Explorer', '窗口与 Explorer'),
  description: t(
    'Manage native windows and embed independent browser surfaces.',
    '管理原生窗口，嵌入独立浏览器表面。',
  ),
  sections: [
    {
      id: 'windows',
      title: t('Native window control', '原生窗口控制'),
      code: "import '/tuffite-shell-api.js';\nconst current = await window.tuffite.window.current();\nawait window.tuffite.window.setTitle('My application', current.id);\nconst windows = await window.tuffite.window.list();",
      language: 'javascript',
      paragraphs: [
        t(
          'Initial windows are declared in app.windows. The generated window facade supports create, focus, minimize, maximize, bounds, title, fullscreen, and close. WindowId is an opaque browser-process identifier represented as bigint in JavaScript.',
          '初始窗口由 app.windows 声明。生成的 window 门面支持创建、聚焦、最小化、最大化、边界、标题、全屏和关闭。WindowId 是浏览器进程的不透明标识，在 JavaScript 中表示为 bigint。',
        ),
      ],
    },
    {
      id: 'explorer',
      title: t('Embed an Explorer surface', '嵌入 Explorer 表面'),
      paragraphs: [
        t(
          'Explorer is Tuffite’s integrated Blink/Content browser element. Its policy controls creation, JavaScript execution, partitioning, and lifecycle. Grant the relevant explorer capability for trusted application origins. Playground contains transfer, history, nested surface, and isolation examples.',
          'Explorer 是 Tuffite 集成在 Blink/Content 中的浏览器元素。它的策略控制创建、JavaScript 执行、分区和生命周期。为可信应用 origin 授予对应 explorer 能力。Playground 包含转移、历史、嵌套表面和隔离示例。',
        ),
      ],
      code: '{\n  "identifier": "browser-ui",\n  "origins": ["myapp://main"],\n  "explorer": { "create": true, "executeJavaScript": false },\n  "shellApi": ["tuffite.window.*"]\n}',
      language: 'json',
    },
  ],
};

export default article;
