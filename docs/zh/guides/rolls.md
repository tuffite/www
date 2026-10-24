---
title: '依赖 Roll 与恢复'
description: '在保留分支和工作内容的前提下协调固定基线。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="roll"></span>

## 依赖或分支变化后执行 Roll

Framework `DEPS` 是唯一 Chromium 版本声明。Roll 保留当前 Framework 分支，协调依赖和已提交补丁序列，不会隐式升级 Chromium。使用 `--patches local` 可以先导出本地已提交补丁栈，再同步。依赖未变且工具链已就绪的补丁迭代，可用 `--skip-hooks` 跳过重复 hooks；hooks 完成前也可与 `--continue` 一起使用。

```sh
python3 x.py roll --dry-run
python3 x.py roll
python3 x.py roll --dirty stash
python3 x.py roll --chromium-revision <full-sha>
```

<span id="recover"></span>

## 恢复已记录的操作

Git 冲突和 WIP 恢复是两个可恢复阶段。保留 journal 和精确 stash 对象。在使用 `--wip-restored` 前，先解决并检查 WIP 恢复。不要删除 journal，也不要用 hard reset 越过中断操作。

```sh
python3 x.py roll --continue
python3 x.py roll --abort
cargo spo continue chromium
cargo spo abort chromium
```

<span id="baseline"></span>

## 私有 ref 是派生状态

`refs/spo/upstream` 在本地记录已应用基线。它不是可克隆元数据，也不是第二份版本 pin。首次检出会重建关联并应用已提交的 mailbox。如果基线恢复无法证明补丁栈，使用明确已知的 upstream SHA。
