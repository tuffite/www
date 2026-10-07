import { expect, test } from 'bun:test';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateRustdoc } from './generate-rustdoc';

test('Rustdoc clears stale docs and ignores a shared Cargo target directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tuffite-rustdoc-'));
  const www = join(root, 'www');
  const shared = join(root, 'shared');
  const original = process.env.CARGO_TARGET_DIR;
  try {
    process.env.CARGO_TARGET_DIR = shared;
    const stale = join(www, '.cache/rustdoc/doc/private-project');
    await mkdir(stale, { recursive: true });
    await writeFile(join(stale, 'index.html'), 'stale private artifact');
    await mkdir(join(shared, 'doc/private-project'), { recursive: true });
    await writeFile(join(shared, 'doc/private-project/index.html'), 'shared private artifact');
    await generateRustdoc(www, root, async (args, cwd) => {
      expect(cwd).toBe(root);
      expect(args).toContain('--lib');
      expect(await Bun.file(join(stale, 'index.html')).exists()).toBe(false);
      const target = args[args.indexOf('--target-dir') + 1];
      expect(target).toBe(join(www, '.cache/rustdoc'));
      await mkdir(join(target, 'doc/tuffite'), { recursive: true });
      await writeFile(join(target, 'doc/tuffite/index.html'), 'public SDK');
      return 0;
    });
    expect(await readFile(join(www, 'public/api/rust/tuffite/index.html'), 'utf8')).toBe(
      'public SDK',
    );
    expect(await Bun.file(join(www, 'public/api/rust/private-project/index.html')).exists()).toBe(
      false,
    );
    expect(await readFile(join(shared, 'doc/private-project/index.html'), 'utf8')).toBe(
      'shared private artifact',
    );
  } finally {
    if (original === undefined) delete process.env.CARGO_TARGET_DIR;
    else process.env.CARGO_TARGET_DIR = original;
    await rm(root, { recursive: true, force: true });
  }
});

test('failed Cargo docs do not replace the previous public documentation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tuffite-rustdoc-failure-'));
  try {
    const old = join(root, 'public/api/rust/tuffite');
    await mkdir(old, { recursive: true });
    await writeFile(join(old, 'index.html'), 'previous SDK');
    await expect(generateRustdoc(root, root, () => 1)).rejects.toThrow(
      'Cargo documentation failed',
    );
    expect(await readFile(join(old, 'index.html'), 'utf8')).toBe('previous SDK');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
