---
title: 'tuff CLI'
description: 'Create, validate, develop, and package Tuffite applications.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="commands"></span>

## `Application` commands

`Application` commands search the current directory and its parents for the nearest `tuffite.json`; `--manifest` overrides discovery. Default package output is the project `dist` directory. `dev`, `build`, and `package` automatically generate bindings and resolve or download the Framework. `dev` reuses the selected Distribution across source rebuilds; `--force-download-framework` refreshes it once at startup. Use `--help` on a subcommand for its exact flags. `-v` increases logging detail and works globally. In the source workspace, `mise run tuff -- <arguments>` runs the current CLI without a global install.

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

## Development package options

`--prepare-only` refreshes the native package without launching. `--devtools-port` overrides the loopback CDP port. `--force-download-framework` explicitly bypasses local/cache selection for a new managed download. Keep exact local paths in environment or ignored machine configuration.

```sh
tuff dev --prepare-only
tuff dev --devtools-port 9234
tuff dev --force-download-framework
```
