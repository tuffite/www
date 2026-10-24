import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const dist = join(root, 'dist');
const framework = resolve(process.env.TUFFITE_FRAMEWORK_DIR || join(root, '../src/tuffite'));
function git(args: string[], cwd = root, env = process.env): string {
  const result = Bun.spawnSync(['git', ...args], { cwd, env, stdout: 'pipe', stderr: 'pipe' });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString().trim());
  return result.stdout.toString().trim();
}

// Validate prebuilt assets before any command-line upload.
for (const file of [
  'index.html',
  'en/guides/quick-start/index.html',
  'zh/guides/quick-start/index.html',
  'api/rust/tuffite/index.html',
  'sitemap-index.xml',
  'robots.txt',
  'pagefind/pagefind.js',
  'LICENSE.txt',
  'THIRD_PARTY_NOTICES.txt',
  'THIRD_PARTY_LICENSES.md',
]) {
  if (!(await readFile(join(dist, file), 'utf8')).trim())
    throw new Error(`Empty build output: ${file}`);
}

for (const page of new Bun.Glob('**/*.{md,mdx}').scanSync(join(root, 'docs'))) {
  const route = page.replace(/\.mdx?$/, '/');
  const html = await readFile(join(dist, route, 'index.html'), 'utf8');
  if (!html.includes(`href="https://tuffite.org/${route}"`))
    throw new Error(`Missing canonical URL: ${route}`);
  if (!html.includes('<h1')) throw new Error(`Missing rendered article: ${route}`);
}

let files = 0;
async function validate(directory: string): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (path === join(dist, 'release.json')) continue;
    if (entry.isDirectory()) await validate(path);
    else {
      if (!entry.isFile()) throw new Error(`Unsupported build asset: ${path}`);
      if ((await stat(path)).size > 25 * 1024 * 1024)
        throw new Error(`Asset exceeds Pages' 25 MiB limit: ${path}`);
      files++;
    }
  }
}
await validate(dist);
if (files + 1 > 20_000) throw new Error('Build exceeds Pages Free plan file limit');

if (process.argv.includes('--record')) {
  const source = git(['rev-parse', 'HEAD']);
  const frameworkCommit = git(['rev-parse', 'HEAD'], framework);
  const sourceDirty = Boolean(git(['status', '--porcelain']));
  const frameworkDirty = Boolean(git(['status', '--porcelain'], framework));
  await writeFile(
    join(dist, 'release.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        website: {
          repository: 'https://github.com/tuffite/www',
          commit: source,
          dirty: sourceDirty,
        },
        framework: {
          repository: 'https://github.com/tuffite/tuffite',
          commit: frameworkCommit,
          dirty: frameworkDirty,
        },
      },
      null,
      2,
    ) + '\n',
  );
  if (sourceDirty || frameworkDirty)
    console.warn('Release includes local changes; see release.json for provenance.');
} else {
  // Keep the provenance of the reviewed build when uploading existing artifacts.
  const release = JSON.parse(await readFile(join(dist, 'release.json'), 'utf8'));
  if (!release.website?.commit || !release.framework?.commit)
    throw new Error('Missing build provenance; run bun run deploy:prepare first.');
}

console.log(
  `Validated ${files + 1} static files for Cloudflare Pages; deployment is a separate step.`,
);
