import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const dist = join(root, 'dist');
const framework = resolve(process.env.TUFFITE_FRAMEWORK_DIR || join(root, '../src/tuffite'));
function git(args: string[], cwd = root, env = process.env): string {
  const result = Bun.spawnSync(['git', ...args], { cwd, env, stdout: 'pipe', stderr: 'pipe' });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString().trim());
  return result.stdout.toString().trim();
}

// Validate the complete local build before changing the deployment branch.
for (const file of [
  'index.html',
  'en/guides/quick-start/index.html',
  'zh/guides/quick-start/index.html',
  'api/rust/tuffite/index.html',
  'sitemap.xml',
  'robots.txt',
  'LICENSE.txt',
  'THIRD_PARTY_NOTICES.txt',
  'THIRD_PARTY_LICENSES.md',
]) {
  if (!(await readFile(join(dist, file), 'utf8')).trim())
    throw new Error(`Empty build output: ${file}`);
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

const source = git(['rev-parse', 'HEAD']);
const frameworkCommit = git(['rev-parse', 'HEAD'], framework);
const sourceDirty = Boolean(git(['status', '--porcelain']));
const frameworkDirty = Boolean(git(['status', '--porcelain'], framework));
await writeFile(
  join(dist, 'release.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      website: { repository: 'https://github.com/tuffite/www', commit: source, dirty: sourceDirty },
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

// Use a separate index so the maintainer's checkout and staged files stay intact.
const temporary = await mkdtemp(join(tmpdir(), 'tuffite-release-'));
try {
  const env = { ...process.env, GIT_INDEX_FILE: join(temporary, 'index') };
  const ref = 'refs/heads/release';
  const previousResult = Bun.spawnSync(['git', 'rev-parse', '--verify', ref], {
    cwd: root,
    stderr: 'pipe',
  });
  const previous =
    previousResult.exitCode === 0 ? previousResult.stdout.toString().trim() : undefined;
  // A branch checked out in another worktree must not be moved underneath it.
  if (git(['worktree', 'list', '--porcelain']).split('\n').includes(`branch ${ref}`)) {
    throw new Error(
      'release is checked out in a worktree; switch that worktree to another branch first',
    );
  }
  git(['read-tree', '--empty'], root, env);
  git(
    [
      '--git-dir',
      git(['rev-parse', '--absolute-git-dir']),
      '--work-tree',
      dist,
      'add',
      '--all',
      '--force',
      '--',
      '.',
    ],
    dist,
    env,
  );
  const tree = git(['write-tree'], root, env);
  const commit = git([
    'commit-tree',
    tree,
    ...(previous ? ['-p', previous] : []),
    '-m',
    `Publish website ${source.slice(0, 12)} (framework ${frameworkCommit.slice(0, 12)})`,
  ]);
  git(['update-ref', ref, commit, previous || '0'.repeat(commit.length)]);
  console.log(
    `Prepared local release branch: ${commit}\n${files + 1} static files; no build is needed on Cloudflare.\nReview: git diff --stat ${previous || source} release\nPublish when ready: git push origin release`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
