import { t, type Article } from '../../types';

const article: Article = {
  slug: 'guides/rolls',
  group: 'framework',
  title: t('Dependency rolls & recovery', '依赖 Roll 与恢复'),
  description: t(
    'Reconcile a pinned baseline while preserving branches and work.',
    '在保留分支和工作内容的前提下协调固定基线。',
  ),
  sections: [
    {
      id: 'roll',
      title: t('Roll after dependency or branch changes', '依赖或分支变化后执行 Roll'),
      code: 'python3 x.py roll --dry-run\npython3 x.py roll\npython3 x.py roll --dirty stash\npython3 x.py roll --chromium-revision <full-sha>',
      language: 'shell',
      paragraphs: [
        t(
          'Framework DEPS is the only Chromium revision declaration. Roll preserves the current Framework branch and reconciles dependencies and the checked-in patch series. It never implicitly upgrades Chromium. Use --patches local to export your local committed stack before syncing. For patch iteration with unchanged dependencies and a prepared toolchain, --skip-hooks avoids rerunning gclient hooks; it also works with --continue before hooks finish.',
          'Framework DEPS 是唯一 Chromium 版本声明。Roll 保留当前 Framework 分支，协调依赖和已提交补丁序列，不会隐式升级 Chromium。使用 --patches local 可以先导出本地已提交补丁栈，再同步。依赖未变且工具链已就绪的补丁迭代，可用 --skip-hooks 跳过重复 hooks；hooks 完成前也可与 --continue 一起使用。',
        ),
      ],
    },
    {
      id: 'recover',
      title: t('Resume the recorded operation', '恢复已记录的操作'),
      code: 'python3 x.py roll --continue\npython3 x.py roll --abort\ncargo spo continue chromium\ncargo spo abort chromium',
      language: 'shell',
      paragraphs: [
        t(
          'Git conflicts and WIP restoration are separate recoverable phases. Preserve journals and exact stash objects. Resolve and inspect WIP restoration before using --wip-restored. Never remove journals or hard-reset past an interrupted operation.',
          'Git 冲突和 WIP 恢复是两个可恢复阶段。保留 journal 和精确 stash 对象。在使用 --wip-restored 前，先解决并检查 WIP 恢复。不要删除 journal，也不要用 hard reset 越过中断操作。',
        ),
      ],
    },
    {
      id: 'baseline',
      title: t('Private refs are derived state', '私有 ref 是派生状态'),
      paragraphs: [
        t(
          'refs/spo/upstream records the applied baseline locally. It is not cloned metadata or a second revision pin. A fresh checkout reconstructs associations and applies the committed mailboxes. Use an explicitly known upstream SHA if baseline recovery cannot prove the stack.',
          'refs/spo/upstream 在本地记录已应用基线。它不是可克隆元数据，也不是第二份版本 pin。首次检出会重建关联并应用已提交的 mailbox。如果基线恢复无法证明补丁栈，使用明确已知的 upstream SHA。',
        ),
      ],
    },
  ],
};

export default article;
