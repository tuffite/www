---
title: 'Chromium patch boundaries'
description: 'Keep downstream changes narrow, guarded, and replayable.'
---

:::caution[Experimental source release]
Production hardening and published SDK packages are still in progress.
:::

<span id="guards"></span>

## Guard Chromium-owned additions

Prefer Framework-owned implementation under `src/tuffite`. In Chromium files, use `tuffite_in_chromium` in GN and `BUILDFLAG(TUFFITE_IN_CHROMIUM)` in C++. When syntax requires an unconditional change, enclose the smallest practical region with matching `TUFFITE_BEGIN` / `TUFFITE_END` comments.

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

## Import component integration lists

Do not list Framework source files or target labels directly in Chromium-owned `BUILD.gn`. Define `tuffite_`-prefixed variables in the owning integration directory’s `tuffite_in_chromium.gni` and import that file directly. Source labels must be absolute, such as `//tuffite/components/...`; imported relative strings resolve from the consuming target.

<span id="export"></span>

## Export deliberately selected changes

Framework files are committed in their own repository. Chromium edits become Chromium commits and are exported to `patches/chromium`. Never include `tuffite/` files in a Chromium patch commit. Export reads committed `HEAD` and does not commit your working changes.

```sh
cargo spo new chromium --message "area: change" --paths path/to/file --export
cargo spo export --all --verify-apply
cargo spo check --all --strict
```
