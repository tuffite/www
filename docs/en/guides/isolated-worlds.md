---
title: Isolated UI worlds
description: Host extension Web Components with separate JavaScript realms and scoped registries.
---

`tuffite.isolated` lets an application host extension UI in Blink isolated worlds.
Each world has its own JavaScript globals, DOM wrappers and custom-element registry,
while sharing the document, layout, renderer thread and process with the application.
Use it for installed, trusted UI code such as onboarding forms, message parts,
settings panels and file editors. Keep extension identity separate from the UI
transport: generated interactive HTML can use an independent, main-world-owned
sandbox iframe contribution without creating an isolated world.

## Register a package snapshot

The native application validates a package, reads its self-contained classic-script
bundle and registers an immutable source snapshot. Keep the host from `Browser::new`
and register in `Browser::initialize`, before opening UI that needs the world:

```rust
let host = context.isolated();
// Later, in initialize or another asynchronous application operation:
host.register(
    tuffite::isolated::WorldDefinition::new("io.example.extension", source)
        .allow_origin("example://main"),
    |result| {
        // Enable the UI only after this callback succeeds.
        let registration = result.expect("UI registration failed");
        // Retain registration for replace/unregister.
    },
)?;
```

`Host::is_available()` detects native support. Registration uses the optional
`TUFFITE_CAPABILITY_ISOLATED` ABI capability independently of ShellAPI.
An older Framework without the capability reports `Unavailable`.
There is no renderer registration API and no requirement to edit `tuffite.json`
when installing a package. The optional `app.isolatedWorlds` manifest mapping is
startup shorthand for application-owned bundled components.

Compile UI to a self-contained classic script, for example with Bun `format: "iife"`.
The Framework does not load ESM imports or resolve an extension's module graph.
Bundle libraries and CSS into the snapshot; install CSS inside the mounted shadow tree.
Keep background/Utility extension entries separate from UI entries.

## Define and mount a component

Inside the isolated script:

```javascript
class SetupCard extends HTMLElement {
  set state(value) {
    this.textContent = value.label;
  }
  connectedCallback() {
    this.addEventListener('click', async () => {
      const context = tuffite.isolated.context(this);
      await context.request('setup.start', { provider: 'example' });
    });
  }
}
tuffite.isolated.customElements.define('setup-card', SetupCard);
```

In the application's main world:

```javascript
const world = await tuffite.isolated.createWorld({ name: 'io.example.extension' });
const view = await world.mount(container, {
  tag: 'setup-card',
  properties: { state: { label: 'Connect account' } },
  async onRequest({ method, params, signal }) {
    if (method !== 'setup.start') throw new Error('Unsupported request');
    // Bind identity and permitted actions to this mounted contribution.
    // Validate params and pass signal to cancellable host work.
    return startSetup(params, signal);
  },
});
await view.update({ state: { label: 'Connected' } });
// When the surface closes:
await view.dispose();
await world.dispose();
```

`IsolatedWorldHandle` extends `EventTarget`; its `name`, `mount` and `dispose`
are host-side controls. Inside the world, `tuffite.isolated` exposes `name`,
`customElements`, `signal` and `context(element)`; the context exposes `signal`
and `request(method, params, {signal})`. The renderer API is available on
`globalThis.tuffite` without importing an SDK module.

A mount creates a closed shadow tree using that world's registry. Different worlds
can define the same tag. Constructors, custom callbacks and property setters run
in their owning realm. Use `tuffite.isolated.customElements`, rather than the
page's `window.customElements`, for these definitions.

`update` applies a top-level property patch. Values and request responses must be
JSON: no functions, DOM nodes, typed arrays, promises or `undefined`. Nesting is
limited to 64 levels; encoded payloads to 256 Ki UTF-16 code units. Convert file
bytes to arrays and send bounded chunks, rather than large base64 or array payloads.
Host operations belong in explicit request handlers, rather than DOM event details
or methods attached to elements across worlds.

## Contribution lifetimes

For onboarding, let the extension own its form markup and interaction. Pass public
status as properties and expose bounded setup operations through request handlers.
Keep credential entry local to the form until submission; pass submitted values
only to the authorized native setup operation. Never return stored credentials.
For message parts, send JSON data, streaming state and language; expose only the
part's actions and compose operation. For editors, transfer file bytes in bounded
chunks and authorize export/save against the file selected by the host.

One world per mounted surface makes ownership straightforward. A host may share
a world between views when it explicitly manages their common lifecycle.
View disposal aborts its context and outstanding requests. World disposal revokes
all its views before extension cleanup runs. Cancel native work separately when
its API does not support cancellation.

`replace(&registration, definition, callback)` requires the exact current generation
and the same name. `unregister(&registration, callback)` denies future loads.
Neither operation terminates already evaluated worlds: dispose mounted handles and
revoke application capabilities when disabling an extension. An in-flight source
load accepted before unregister may still finish. Registrations are in-memory and
scoped to a BrowserContext; reconstruct them from the installed inventory on startup.

## Boundaries and budgets

Worlds prevent accidental global/prototype collisions, keep JavaScript expandos and
scoped tag names separate, and provide explicit JSON request boundaries. They do
**not** restrict access to the shared DOM, stop CPU loops,
or isolate renderer crashes. Its CSP restricts some script and network operations,
but does not provide a general extension permission sandbox. Closed shadow roots are encapsulation, not a security
boundary. Do not treat an isolated world as a sandbox for hostile extensions or
model-generated scripts. Use restricted iframes for generated interactive HTML and
Utility/process isolation for privileged background work. Worlds carry a restrictive
CSP; applications can provide a narrowly scoped host-owned iframe mounting request
for generated HTML without relaxing that world policy.

The browser checks the primary main frame, browser-owned App or Explorer policy,
and the world's committed-origin grant before supplying
source. ShellAPI is not exposed inside managed isolated worlds. Package trust,
installation, manifests and permission policy remain application responsibilities.
Never select extension identity or grant arbitrary host methods from request params.

Source budgets are 8 MiB per snapshot, 32 MiB aggregate and 32 definitions per
BrowserContext, including bundled entries. These bound browser-side storage,
transport and parsing costs; they do not bound execution-time memory or CPU.
Dynamic registrations allow 1–32 exact origins, without wildcards. Names start
with an ASCII letter and contain up to 128 letters, digits, `_`, `-` or `.`.
Authenticated development entry overrides inherit the packaged origin's grant.
