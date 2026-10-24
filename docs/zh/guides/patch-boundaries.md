---
title: 'Chromium 补丁边界'
description: '让下游修改保持小范围、条件保护和可重放。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="guards"></span>

## 保护 Chromium 归属的新增代码

优先把 Framework 实现放在 `src/tuffite` 中。在 Chromium 文件中，GN 使用 `tuffite_in_chromium`，C++ 使用 `BUILDFLAG(TUFFITE_IN_CHROMIUM)`。语法要求无条件修改时，用成对的 `TUFFITE_BEGIN` / `TUFFITE_END` 注释包围最小必要区域。

```text
if (tuffite_in_chromium) {
  sources += tuffite_explorer_sources
}

// C++
#if BUILDFLAG(TUFFITE_IN_CHROMIUM)
// Narrow integration change.
#endif
```

<span id="gn"></span>

## 导入组件集成列表

不要在 Chromium 归属的 `BUILD.gn` 中直接列出 Framework 源文件或 target。应在所属集成目录的 `tuffite_in_chromium.gni` 中定义 `tuffite_` 前缀变量，并直接导入。源码标签必须使用 `//tuffite/components/...` 等绝对形式；导入的相对字符串会从消费 target 的目录解析。

<span id="export"></span>

## 导出明确选择的修改

Framework 文件在自己的仓库中提交。Chromium 修改成为 Chromium 提交，并导出到 `patches/chromium`。Chromium 补丁提交不得包含 `tuffite/` 文件。export 读取已提交的 `HEAD`，不会提交工作区修改。

```sh
cargo spo new chromium --message "area: change" --paths path/to/file --export
cargo spo export --all --verify-apply
cargo spo check --all --strict
```
