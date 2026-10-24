---
title: 'Capabilities & security'
description: 'Grant each frontend the native operations it actually needs.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="origins"></span>

## Capabilities match origins

Add capability entries under `app.security.capabilities`. Each entry names the allowed origins and ShellAPI methods. The method selector * includes all registered methods for those origins; filesystem, URL, and window scopes still apply. Playground groups `tuffite.Fs.*` and `tuffite.Window.*` while keeping resource reads separate from writable directories. Namespace group scopes apply only to methods that consume resources. Use narrow method permissions and explicit filesystem scopes. The manifest schema validates the shape; `tuff check` also validates semantic restrictions.

```json
{
  "identifier": "main-window",
  "origins": ["myapp://main"],
  "shellApi": ["myapp.Commands.Ping", "tuffite.Window.Current"]
}
```

<span id="csp"></span>

## Configure CSP and asset routes

`app.security.csp` controls the frontend content security policy. `app.assets` maps explicit origins and request paths to packaged files. Asset routes and native permissions are separate contracts: registering a file does not grant a native capability.

<span id="development"></span>

## Authenticated development mode

`tuff dev` refreshes a native development package and launches a loopback web server. A per-run token and readiness probe authenticate the renderer override. A compatible Framework must include the development-mode feature. Do not expose the development server or CDP port publicly.
