# Tuffite documentation

An experimental source-release documentation site. Published SDK packages and
production hardening are still in progress; the default getting-started path
uses the source workspace and Playground.

The official bilingual site for [tuffite.org](https://tuffite.org), maintained as
an independent Git submodule at the outer workspace's `www/`. The site uses Bun,
React, Vite, shadcn/ui source components, and Tailwind CSS. It covers application
Guides, Framework contributor Guides, Rust/JavaScript API References, the CLI,
and `tuffite.json` configuration. Playground is the application example.

Repositories: [Framework](https://github.com/tuffite/tuffite),
[workspace](https://github.com/tuffite/workspace), and
[website](https://github.com/tuffite/www).

From the prepared outer workspace:

```sh
mise run www        # Development server: http://127.0.0.1:5190
mise run www:check  # Type checks and documentation contracts
mise run www:build  # Static site including full Rustdoc
```

Or from this submodule:

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun run build
bun run preview
```

## Source and generated references

`src/content/pages/` owns English and Simplified Chinese articles, one file per
page. `src/content.ts` defines their display order and route lookup; shared types
and examples live in `src/content/types.ts` and `src/content/examples.ts`.
`src/components/docs/` contains the navigation, search, article renderer, and
API reference components. `src/App.tsx` coordinates route, theme, and menu state. Every article and
section has both translations. Routes are `/<en|zh>/guides/<slug>/` and
`/<en|zh>/references/<slug>/`. Search indexes guides and source-derived reference
content. The UI supports theme switching, keyboard search, responsive navigation,
copyable code, and a page table of contents.

`scripts/generate-reference.ts` reads `../src/tuffite` by default. Set
`TUFFITE_FRAMEWORK_DIR` when the SDK is elsewhere. It generates the configuration
reference from `schemas/tuffite.schema.json`, JavaScript reference from native
`.d.ts` declarations, and the Rust symbol index from the public SDK facade.
Generated reference data and the copied public schema are ignored; the
Framework remains the authority.

Production builds also run Cargo documentation in the Framework checkout and
copy the resulting Rustdoc into `/api/rust/`. Rustdoc generation uses an isolated `.cache/rustdoc` target directory and clears
its documentation before building. Shared `CARGO_TARGET_DIR` output is never
copied into the website; dependency compilation in the dedicated cache is reused.
`prerender.ts` renders every bilingual route into standalone HTML with canonical
and language-alternate metadata, then creates `sitemap.xml` and `robots.txt`.
Serve `dist/` using a static web server with directory index support. No API
server, database, or SPA-only rewrite is required for documentation routes.

## Maintainer publishing

Cloudflare serves the `release` branch directly. That branch contains only the
contents of `dist/`, including generated references and Rustdoc. It needs no Bun,
Rust, Framework checkout, or build command on Cloudflare.

From the website checkout, using a prepared Framework checkout:

```sh
bun install --frozen-lockfile
# Optional when the Framework is outside the outer workspace:
# export TUFFITE_FRAMEWORK_DIR=/path/to/tuffite
bun run release:prepare
bun run preview
```

`release:prepare` runs documentation checks, builds and prerenders the full site, checks
required pages and Pages asset limits, then updates the **local** `release` branch.
It uses a temporary Git index without switching branches or modifying your
staging area. `/release.json` records website and Framework commits and whether
either checkout had local changes. For a reproducible release, commit source
changes first. Use the desired Framework tag or commit before running `release:prepare`.

Inspect the preview (including both languages and `/api/rust/tuffite/`), review
the deployment diff, then publish explicitly:

```sh
git diff --stat release@{1} release # After the first release, compare with the previous deployment
git push origin release
```

Keep the local `release` branch up to date with the remote before preparing a
release on another machine (`git fetch origin release:release`). Publishing uses a
normal push, without force. `bun run build` alone does not update any branch;
`bun run release:prepare` does not push to GitHub.

In Cloudflare **Workers & Pages → Create application → Pages → Connect to Git**:

- Repository: `tuffite/www`; production branch: `release`.
- Framework preset: None; build command: **empty**.
- Root directory: repository root; output directory: `.`.
- Disable preview builds for other branches, which contain source rather than
  published assets.
- Add `tuffite.org` under Custom domains after the first deployment.

Only pushes to `release` publish production updates. Content edits on `main`
remain unpublished until a maintainer prepares and pushes a new release.

## Icon assets

Run `bun run icons` to regenerate all assets from the shared geometric logo.
The generator also runs before reference generation and builds.

- `/favicon.svg` and `/favicon.ico`: rounded browser icons; ICO contains 16, 32, and 48 px frames.
- `/favicon-square.svg` and `/favicon-square.ico`: full square backgrounds without rounded corners.
- `/icons/tuffite-{rounded,square}-{size}.png`: 16, 32, 48, 64, 128, 180, 192, 256, and 512 px.
- `/icons/mark.svg`: transparent logo mark for use on a custom background.
- `/apple-touch-icon.png`: 180 px square icon; iOS applies its own shape.
- `/site.webmanifest`: 192 and 512 px square icons for installable/maskable contexts.

## Formatting

Prettier formats the website's TypeScript, TSX, CSS, HTML, JSON, and Markdown:

```sh
bun run format        # Apply formatting
bun run format:check  # Check without modifying files
```

`bun run check` includes formatting checks. Generated references, icon assets,
Rustdoc, build output, and the Bun lockfile are excluded from formatting.

`release:prepare` describes a local preparation step; publishing remains the
explicit `git push origin release` command after preview and review. The `release`
branch is the website's static publication branch, not a Framework version branch.

## License and release checks

Website-owned source uses [MIT OR Apache-2.0](LICENSE); adapted shadcn/ui components
retain their MIT notice in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Builds include `/LICENSE.txt`, `/THIRD_PARTY_NOTICES.txt`, and Vite-generated
`/THIRD_PARTY_LICENSES.md` for bundled dependencies. Release preparation checks
that these files exist. Generated Rustdoc retains its own third-party notices.

Before making the repository public, inspect the exact refs to publish with the
Framework's `scripts/audit_public_refs.py`. Use explicit branch pushes; do not
mirror local remote-tracking refs, stashes, or legacy Framework tags. See
[public release preparation](../src/tuffite/docs/public-release.md) in the workspace.
