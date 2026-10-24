---
title: 'Build & distribute'
description: 'Resolve a matching native runtime, then package your application.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="resolve"></span>

## Resolve the Framework

- `TUFFITE_FRAMEWORK_DIST` selects an exact extracted Distribution and takes precedence. Explicit paths never fall back.
- `TUFFITE_FRAMEWORK_DIR` enables compatible local release output for the requested target and profile.
- Without local output, the resolver checks its versioned cache, then downloads a matching release when enabled.

```sh
tuff doctor
tuff framework verify /path/to/distribution
tuff package --name my-app
```

<span id="identity"></span>

## Keep SDK and runtime compatible

The Distribution contains `tuffite-framework.json`, platform libraries, launchers, and Chromium resources. Resolution checks Framework version, target, ABI compatibility, safe paths, and file hashes. Use a Distribution matching your SDK release.

<span id="resources"></span>

## Bundle explicit resources

`bundle.resources` includes application resources. `app.assets` defines how frontend requests reach packaged files. Run the frontend production build before packaging. Signing, installers, and release publishing remain separate steps from assembling the application package.
