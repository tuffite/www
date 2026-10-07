import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/patch-boundaries',
  group: 'framework',
  title: t('Chromium patch boundaries', 'Chromium 补丁边界'),
  description: t(
    'Keep downstream changes narrow, guarded, and replayable.',
    '让下游修改保持小范围、条件保护和可重放。',
  ),
  sections: [
    {
      id: 'guards',
      title: t('Guard Chromium-owned additions', '保护 Chromium 归属的新增代码'),
      code: 'if (tuffite_in_chromium) {\n  sources += tuffite_explorer_sources\n}\n\n// C++\n#if BUILDFLAG(TUFFITE_IN_CHROMIUM)\n// Narrow integration change.\n#endif',
      language: 'text',
      paragraphs: [
        t(
          'Prefer Framework-owned implementation under src/tuffite. In Chromium files, use tuffite_in_chromium in GN and BUILDFLAG(TUFFITE_IN_CHROMIUM) in C++. When syntax requires an unconditional change, enclose the smallest practical region with matching TUFFITE_BEGIN / TUFFITE_END comments.',
          '优先把 Framework 实现放在 src/tuffite 中。在 Chromium 文件中，GN 使用 tuffite_in_chromium，C++ 使用 BUILDFLAG(TUFFITE_IN_CHROMIUM)。语法要求无条件修改时，用成对的 TUFFITE_BEGIN / TUFFITE_END 注释包围最小必要区域。',
        ),
      ],
    },
    {
      id: 'gn',
      title: t('Import component integration lists', '导入组件集成列表'),
      paragraphs: [
        t(
          'Do not list Framework source files or target labels directly in Chromium-owned BUILD.gn. Define tuffite_-prefixed variables in the owning integration directory’s tuffite_in_chromium.gni and import that file directly. Source labels must be absolute, such as //tuffite/components/...; imported relative strings resolve from the consuming target.',
          '不要在 Chromium 归属的 BUILD.gn 中直接列出 Framework 源文件或 target。应在所属集成目录的 tuffite_in_chromium.gni 中定义 tuffite_ 前缀变量，并直接导入。源码标签必须使用 //tuffite/components/... 等绝对形式；导入的相对字符串会从消费 target 的目录解析。',
        ),
      ],
    },
    {
      id: 'export',
      title: t('Export deliberately selected changes', '导出明确选择的修改'),
      code: 'cargo spo new chromium --message "area: change" --paths path/to/file --export\ncargo spo export --all --verify-apply\ncargo spo check --all --strict',
      language: 'shell',
      paragraphs: [
        t(
          'Framework files are committed in their own repository. Chromium edits become Chromium commits and are exported to patches/chromium. Never include tuffite/ files in a Chromium patch commit. Export reads committed HEAD and does not commit your working changes.',
          'Framework 文件在自己的仓库中提交。Chromium 修改成为 Chromium 提交，并导出到 patches/chromium。Chromium 补丁提交不得包含 tuffite/ 文件。export 读取已提交的 HEAD，不会提交工作区修改。',
        ),
      ],
    },
  ],
};

export default article;
