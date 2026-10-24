---
title: 'Dependency rolls & recovery'
description: 'Reconcile a pinned baseline while preserving branches and work.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="roll"></span>

## Roll after dependency or branch changes

Framework `DEPS` is the only Chromium revision declaration. Roll preserves the current Framework branch and reconciles dependencies and the checked-in patch series. It never implicitly upgrades Chromium. Use `--patches local` to export your local committed stack before syncing. For patch iteration with unchanged dependencies and a prepared toolchain, `--skip-hooks` avoids rerunning `gclient` hooks; it also works with `--continue` before hooks finish.

```sh
python3 x.py roll --dry-run
python3 x.py roll
python3 x.py roll --dirty stash
python3 x.py roll --chromium-revision <full-sha>
```

<span id="recover"></span>

## Resume the recorded operation

Git conflicts and WIP restoration are separate recoverable phases. Preserve journals and exact stash objects. Resolve and inspect WIP restoration before using `--wip-restored`. Never remove journals or hard-reset past an interrupted operation.

```sh
python3 x.py roll --continue
python3 x.py roll --abort
cargo spo continue chromium
cargo spo abort chromium
```

<span id="baseline"></span>

## Private refs are derived state

`refs/spo/upstream` records the applied baseline locally. It is not cloned metadata or a second revision pin. A fresh checkout reconstructs associations and applies the committed mailboxes. Use an explicitly known upstream SHA if baseline recovery cannot prove the stack.
