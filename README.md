# Tuffite documentation

The bilingual documentation site for [tuffite.org](https://tuffite.org), maintained
as the independent `www/` submodule of the outer workspace. It uses **Astro +
Starlight**, Markdown/MDX articles, and React islands for interactive API references.
Astro builds static HTML; Starlight provides navigation, language switching, table
of contents, code highlighting, theme switching, and Pagefind search.

This is an experimental source release. Production hardening and published SDK
packages are still in progress. Playground is the application example.

Repositories: [Framework](https://github.com/tuffite/tuffite),
[workspace](https://github.com/tuffite/workspace), and
[website](https://github.com/tuffite/www).

## Development

Use the prepared outer workspace, including its pinned Bun, Node.js, and Rust:

```sh
mise run www        # http://127.0.0.1:5190
mise run www:check  # Formatting, Astro/TypeScript checks, documentation tests
mise run www:build  # Static site, generated references, search index, Rustdoc
```

Or, with those tools active, from this submodule:

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun run build
bun run preview
```

The Astro and Starlight versions in `package.json` support the workspace's Node
22.22 toolchain. Upgrade compatible integrations together when updating Astro.
No Cloudflare adapter or server runtime is needed for this static site.

## Writing Markdown and MDX

Content is checked in directly under `docs/`. There is no article
object format or Markdown conversion step at build time:

```text
docs/
├── en/
│   ├── guides/commands.md
│   └── references/javascript.mdx
└── zh/
    ├── guides/commands.md
    └── references/javascript.mdx
```

Use the same relative filename in both languages. Files map to the existing
`/en/guides/.../`, `/zh/guides/.../`, and corresponding reference routes. The root
and language roots redirect to the introduction. Keep existing section anchor
spans when editing migrated pages so old fragment links continue to work.

A normal guide only needs Markdown with YAML frontmatter:

````markdown
---
title: Call Rust from the frontend
description: Declare a Mojom contract and call a typed Rust implementation.
---

## Declare the contract

Save the contract as `shell_api.mojom`.

```mojom
module myapp;
interface Commands {
  Ping@0(string message) => (string result);
};
```
````

Use inline code for filenames, paths, commands, flags, configuration keys, and API
symbols in prose (for example, `x.py`, `tuffite.json`, and
`tuffite::build::framework::Resolver`). Keep ordinary explanatory text unmarked.

Use `.mdx` when a page needs a component. For example:

```mdx
import { JavascriptReference } from '@/components/docs/references/JavascriptReference';

<JavascriptReference locale="en" client:load />
```

React components are rendered into the static HTML and hydrated for filtering
and copying. Ordinary Markdown pages need no React island. `astro.config.mjs`
owns bilingual navigation, branding, redirects, and site metadata;
`src/content.config.ts` loads the root `docs/` directory with Astro's glob loader. Add new pages to
the appropriate sidebar group. Page titles come from translated frontmatter.
React reference UI translations use **i18next + react-i18next**, with typed keys in
`src/locales/en.json` and `src/locales/zh.json`. Components call
`useUiTranslation(locale)` from `src/i18n.ts`; the locale comes from the MDX page.
Bundled resources initialize synchronously, and each language has its own instance
so static rendering and hydration use the same language. Starlight manages the
article translations, language routes, and built-in navigation UI.

Custom styling is in `src/styles.css`; the license footer is
`src/components/Footer.astro`.

See [Starlight authoring](https://starlight.astro.build/guides/authoring-content/)
and [internationalization](https://starlight.astro.build/guides/i18n/).

## Source-derived references and Rustdoc

`scripts/generate-reference.ts` reads `../src/tuffite` by default. Set
`TUFFITE_FRAMEWORK_DIR` if the SDK checkout is elsewhere. It generates:

- Configuration data and the public schema from `schemas/tuffite.schema.json`.
- Framework contracts and canonical permissions from `framework/shell_api/*.mojom`.
- JavaScript declarations from every `types` entry in the SDK package exports.
- Explorer declarations from WebIDL and Rust symbols from the public SDK facade.

Generated JSON, the copied schema, and generated Rustdoc are ignored. Edit the
Framework sources, then run `bun run generate` to refresh the reference data.
Builds index the rendered articles and reference content with Pagefind.

Production builds run Cargo documentation in the Framework checkout and copy the
result into `/api/rust/`. Rustdoc uses an isolated `.cache/rustdoc` target directory,
clearing its old documentation before rebuilding. Shared `CARGO_TARGET_DIR` docs
are never copied into the website; cached dependency compilation is reused.
Rustdoc requires the Rust toolchain and available Cargo dependencies, so builds
run locally or in a prepared CI environment.

## Deploy to Cloudflare Pages from the command line

Cloudflare receives the **contents of `dist/`**. Build and review locally, then
upload with the pinned Wrangler CLI. A `release` Git branch is no longer needed;
preparing a deployment does not change Git refs or publish anything.

All commands below run from `www/`. First authenticate and find the project:

```sh
bunx --no-install wrangler login
bunx --no-install wrangler pages project list
```

If this is a new Pages project, create it once. Replace `YOUR_PROJECT` with your
chosen project name; the example uses `main` as its production branch:

```sh
bunx --no-install wrangler pages project create YOUR_PROJECT --production-branch main
```

For an existing project, use its actual name and configured production branch.
For example, a project previously published from `release` should use
`--branch release` for production. A different branch creates a preview deployment.

Prepare and inspect the site:

```sh
bun run deploy:prepare
bun run preview
```

`deploy:prepare` runs checks and the full build. The build validates required
artifacts, Pages asset limits, and writes `/release.json` with website/Framework
commit IDs and dirty flags. For reproducibility, commit source changes and select
the desired Framework revision before preparing. It never uploads assets.

After reviewing both languages, API filters, search, and `/api/rust/tuffite/`,
stop the preview server and deploy:

```sh
bun run deploy --project-name YOUR_PROJECT --branch main
```

`deploy` validates the existing `dist/` and invokes `wrangler pages deploy dist`.
It does not rebuild it; rebuild first if source files changed. Wrangler prints the
deployment URL. To create a preview instead:

```sh
bun run deploy --project-name YOUR_PROJECT --branch docs-preview
```

An existing Git-integrated Pages project can also receive Wrangler deployments.
If switching entirely to CLI uploads, disable automatic production and preview
Git deployments in that project's build settings. A new Direct Upload project
cannot later be converted to Git integration without creating a new project.
Custom domains such as `tuffite.org` remain configured on the Pages project.

For CI, provide `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages → Edit) and
`CLOUDFLARE_ACCOUNT_ID` as CI secrets, then run:

```sh
bun install --frozen-lockfile
bun run deploy:prepare
bun run deploy --project-name YOUR_PROJECT --branch main
```

The CI checkout must include the matching Framework and Rust toolchain for
Rustdoc. Keep tokens out of Git. Local `.env*` and `.wrangler/` are ignored.

Official references: [Wrangler Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
[CI credentials and deployment](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/),
[existing Git-integrated projects](https://developers.cloudflare.com/pages/configuration/git-integration/).

## Formatting, icons, and licenses

```sh
bun run format        # Prettier for Markdown, MDX, Astro, TypeScript, CSS, JSON
bun run format:check
bun run icons         # Regenerate the shared geometric logo and icon variants
```

Generated references, icon assets, Rustdoc, build output, and the Bun lockfile are
excluded from formatting. Production output includes `/LICENSE.txt`,
`/THIRD_PARTY_NOTICES.txt`, and `/THIRD_PARTY_LICENSES.md` for bundled dependencies.
Website-owned source uses [MIT OR Apache-2.0](LICENSE). Generated Rustdoc retains
its own third-party notices.

Before making repository refs public, inspect the exact refs with the Framework's
`scripts/audit_public_refs.py`. See
[public release preparation](../src/tuffite/docs/public-release.md) in the workspace.
