---
title: 'tuff CLI'
description: '创建、验证、开发和打包 Tuffite 应用。'
---

:::caution[实验性源码版本]
生产安全加固与 SDK 发布仍在进行中。
:::

<span id="commands"></span>

## 应用命令

应用命令从当前目录向上查找最近的 `tuffite.json`，`--manifest` 可覆盖查找结果；默认打包输出到项目 `dist` 目录。`dev`、`build` 和 `package` 自动生成绑定并解析或下载 Framework。`dev` 在源码重建时复用已选 Distribution；`--force-download-framework` 只在启动时刷新一次。使用子命令 `--help` 查看精确参数。`-v` 增加日志细节，可在全局使用。在源码工作区中，`mise run tuff -- <参数>` 运行当前 CLI，无需全局安装。

```sh
tuff init <empty-directory>
tuff check [tuffite.json]
tuff build [tuffite.json] --release
tuff doctor [tuffite.json]
tuff dev
tuff package --format app
tuff framework --help
```

<span id="development"></span>

## 开发包选项

`--prepare-only` 刷新原生包但不启动。`--devtools-port` 覆盖回环 CDP 端口。`--force-download-framework` 显式跳过本地和缓存选择，进行新的托管下载。将精确本地路径保存在环境变量或忽略的本机配置中。

```sh
tuff dev --prepare-only
tuff dev --devtools-port 9234
tuff dev --force-download-framework
```
