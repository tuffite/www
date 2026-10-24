---
title: 'Project structure'
description: 'Keep application code, generated contracts, and native output easy to find.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="files"></span>

## The application workspace

Use `crate-type = ["cdylib"]` for the application library. `build.rs` combines `tuffite::build::framework::Resolver` and `tuffite::build::shell_api::Generator` through `tuffite::build::Builder`. Do not hand-edit generated bindings.

```text
my-app/
├── Cargo.toml          # Rust library and SDK dependencies
├── build.rs            # Distribution + ShellAPI build helpers
├── tuffite.json        # Application, security, build, bundle
├── shell_api.mojom      # Typed Mojom application contracts
├── src/lib.rs          # Application and handlers
├── generated/          # Checked-in JavaScript/TypeScript bindings
└── ui/                 # Web frontend
```

<span id="ownership"></span>

## Keep source and outputs separate

Commit the manifest, declaration files, and generated JavaScript/TypeScript contracts. Cargo output, native packages, Vite output, downloaded Distributions, and local machine settings belong in ignored paths. Keep the application in its own repository.
