---
title: 'Quick start'
description: 'Install the CLI. Create an application. Launch your native package.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="prerequisites"></span>

## Prepare your machine

Install the current stable Rust toolchain with Cargo and your platform C/C++ linker: Xcode Command Line Tools on `macOS`, Visual Studio Build Tools with C++ support on Windows, or a C/C++ toolchain on Linux. Use a platform supported by the published Framework Distribution. The minimal HTML application needs no JavaScript package manager.

<span id="install"></span>

## Use the source CLI

Tuffite is an experimental source release. The public registries currently reserve the name at 0.0.0; they do not yet provide this 0.1.0 SDK and CLI. Use the prepared workspace and run `mise run tuff -- <arguments>` from its root.

```sh
git clone https://github.com/tuffite/workspace.git
cd workspace
mise trust
mise run setup
mise run tuff -- --help
```

:::note
Build and run Playground with `mise run dev` to try the current version. Creating standalone applications from the published SDK will become available after matching crates and Framework Distributions are released; the examples below describe that future workflow.
:::

<span id="create"></span>

## Create and package your application

`tuff init` creates a Rust application with a minimal HTML frontend and typed bindings. Packaging compiles the application and resolves a compatible prebuilt Chromium runtime, downloading it into a versioned cache when needed. Subsequent builds reuse the cache.

```sh
tuff init my-app
cd my-app
tuff check
tuff package --name my-app
```

<span id="launch"></span>

## Launch the native application

The package contains your application library, native launcher, Chromium runtime, and frontend assets. For a frontend development server, configure `build.devPackage`, `build.devUrl`, and `build.beforeDevCommand` before using `tuff dev`. Choose your own frontend tools.

```sh
# macOS / Linux
./dist/my-app/run-tuffite.sh

# Windows
.\dist\my-app\run-tuffite.cmd
```
