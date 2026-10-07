import { cp, mkdir, rm } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

type CargoDoc = (args: string[], cwd: string) => number | Promise<number>;
export async function generateRustdoc(
  www: string,
  framework: string,
  cargoDoc: CargoDoc = (args, cwd) =>
    Bun.spawnSync(['cargo', ...args], { cwd, stdout: 'inherit', stderr: 'inherit' }).exitCode,
) {
  // Reuse compilation, but never publish a shared or stale documentation tree.
  const target = resolve(www, '.cache/rustdoc');
  await rm(resolve(target, 'doc'), { recursive: true, force: true });
  const status = await cargoDoc(
    ['doc', '--package', 'tuffite', '--lib', '--all-features', '--no-deps', '--target-dir', target],
    framework,
  );
  if (status !== 0) throw new Error(`Cargo documentation failed (${status})`);
  const destination = resolve(www, 'public/api/rust');
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(resolve(target, 'doc'), destination, {
    recursive: true,
    filter: (source) => basename(source) !== '.lock',
  });
}

if (import.meta.main) {
  const www = resolve(import.meta.dir, '..');
  const framework = resolve(process.env.TUFFITE_FRAMEWORK_DIR ?? resolve(www, '../src/tuffite'));
  await generateRustdoc(www, framework);
}
