import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const www = resolve(import.meta.dir, '..');
const root = resolve(process.env.TUFFITE_FRAMEWORK_DIR ?? resolve(www, '../src/tuffite'));
for (const [source, destination] of [
  ['LICENSE', 'LICENSE.txt'],
  ['THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.txt'],
]) {
  await writeFile(resolve(www, 'public', destination), await readFile(resolve(www, source)));
}
const schema = JSON.parse(await readFile(resolve(root, 'schemas/tuffite.schema.json'), 'utf8'));
await mkdir(resolve(www, 'public/schema/v2'), { recursive: true });
await writeFile(
  resolve(www, 'public/schema/v2/tuffite.schema.json'),
  JSON.stringify(schema, null, 2) + '\n',
);
const modules = [];
for (const name of (await readdir(resolve(root, 'framework/shell_api')))
  .filter((n) => n.endsWith('.d.ts'))
  .sort()) {
  const source = await readFile(resolve(root, 'framework/shell_api', name), 'utf8');
  modules.push({
    name: name.replace('.d.ts', ''),
    source,
    methods: [...source.matchAll(/export function (\w+)\(([^;]*);/g)].map((m) => ({
      name: m[1],
      signature: `${m[1]}(${m[2]};`,
    })),
  });
}
const facade = await readFile(resolve(root, 'crates/tuffite/src/lib.rs'), 'utf8');
const rustSymbols = [
  ...new Set(
    [...facade.matchAll(/pub use tuffite_runtime::\{([^}]+)\}/g)].flatMap((m) =>
      m[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ),
].sort();
const cli = await readFile(resolve(root, 'crates/tuffite/src/cli.rs'), 'utf8');
const cliCommands = [...cli.matchAll(/^    ([A-Z]\w+)\s*[({]/gm)].map((m) => m[1].toLowerCase());
const explorer = [];
const explorerDirectory = resolve(root, 'components/explorer/renderer/blink');
for (const name of (await readdir(explorerDirectory))
  .filter((name) => name.endsWith('.idl'))
  .sort()) {
  const source = (await readFile(resolve(explorerDirectory, name), 'utf8'))
    .replace(/^\/\/.*\n/gm, '')
    .trim();
  const symbol = source.match(/(?:interface|dictionary)\s+(\w+)/)?.[1];
  if (symbol) explorer.push({ name: symbol, file: name, source });
}
const javascriptPackage = JSON.parse(
  await readFile(resolve(root, 'packages/tuffite/package.json'), 'utf8'),
);
const javascriptExports = [];
for (const [path, entry] of Object.entries(javascriptPackage.exports) as [
  string,
  { types: string },
][]) {
  const name = path === '.' ? 'tuffite' : `tuffite${path.slice(1)}`;
  const file = entry.types.replace(/^\.\//, '');
  const source = await readFile(resolve(root, 'packages/tuffite', file), 'utf8');
  javascriptExports.push({ name, file, source });
}
const data = { schema, modules, rustSymbols, cliCommands, explorer, javascriptExports };
await writeFile(resolve(www, 'src/reference.generated.json'), JSON.stringify(data, null, 2) + '\n');
console.log(
  `Reference: ${Object.keys(schema.$defs).length} configuration types, ${modules.length} JS modules, ${rustSymbols.length} Rust symbols`,
);
