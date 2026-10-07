import { describe, expect, test } from 'bun:test';
import { articles, articlePath, parseRoute } from './content';
import reference from './reference.generated.json';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { inflateSync } from 'node:zlib';
describe('documentation contracts', () => {
  test('TOML examples parse and project licenses are copied into public assets', async () => {
    for (const article of articles) {
      for (const section of article.sections) {
        if (section.language === 'toml' && section.code)
          expect(() => Bun.TOML.parse(section.code!)).not.toThrow();
      }
    }
    for (const [source, asset] of [
      ['LICENSE', 'LICENSE.txt'],
      ['THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.txt'],
    ]) {
      expect(await readFile(resolve(import.meta.dir, '../public', asset), 'utf8')).toBe(
        await readFile(resolve(import.meta.dir, '..', source), 'utf8'),
      );
    }
  });

  test('every page and section has both translations and a stable route', () => {
    const paths = new Set<string>();
    for (const article of articles) {
      expect(article.sections.length).toBeGreaterThan(1);
      expect(new Set(article.sections.map((s) => s.id)).size).toBe(article.sections.length);
      for (const locale of ['en', 'zh'] as const) {
        expect(article.title[locale].length).toBeGreaterThan(0);
        expect(article.description[locale].length).toBeGreaterThan(0);
        const path = articlePath(article, locale);
        expect(paths.has(path)).toBe(false);
        paths.add(path);
        expect(parseRoute(path)).toEqual({ article, locale });
        for (const section of article.sections) {
          expect(section.title[locale].length).toBeGreaterThan(0);
          for (const text of [...(section.paragraphs ?? []), ...(section.bullets ?? [])])
            expect(text[locale].length).toBeGreaterThan(0);
        }
      }
    }
  });
  test('the configuration reference equals the source schema', async () => {
    const root = resolve(
      process.env.TUFFITE_FRAMEWORK_DIR ?? resolve(import.meta.dir, '../../src/tuffite'),
    );
    expect(reference.schema).toEqual(
      JSON.parse(await readFile(resolve(root, 'schemas/tuffite.schema.json'), 'utf8')),
    );
  });
  test('generated native reference includes actual window methods and Rust exports', () => {
    expect(
      reference.modules.find((m) => m.name === 'window')?.methods.some((m) => m.name === 'current'),
    ).toBe(true);
    expect(reference.rustSymbols).toContain('Browser');
    expect(reference.rustSymbols).toContain('BrowserContext');
    expect(reference.cliCommands).toContain('dev');
    expect(reference.cliCommands).not.toContain('generate');
    expect(reference.cliCommands).not.toContain('download');
  });
  test('Explorer interfaces match the Framework WebIDL', async () => {
    const root = resolve(
      process.env.TUFFITE_FRAMEWORK_DIR ?? resolve(import.meta.dir, '../../src/tuffite'),
    );
    expect(reference.explorer.map((value) => value.name)).toContain('HTMLExplorerElement');
    expect(reference.explorer.map((value) => value.name)).toContain('ExplorerTransfer');
    for (const value of reference.explorer) {
      const source = (
        await readFile(resolve(root, 'components/explorer/renderer/blink', value.file), 'utf8')
      )
        .replace(/^\/\/.*\n/gm, '')
        .trim();
      expect(value.source).toBe(source);
    }
  });
  test('icon assets cover browser, touch, and maskable contexts', async () => {
    const publicDirectory = resolve(import.meta.dir, '../public');
    for (const variant of ['rounded', 'square'])
      for (const size of [16, 32, 48, 64, 128, 180, 192, 256, 512]) {
        const png = await readFile(
          resolve(publicDirectory, `icons/tuffite-${variant}-${size}.png`),
        );
        expect(png.readUInt32BE(16)).toBe(size);
        expect(png.readUInt32BE(20)).toBe(size);
        // The first pixel must remain opaque for square/system-masked assets.
        const compressed = [];
        let offset = 8;
        while (offset < png.length) {
          const length = png.readUInt32BE(offset);
          if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT')
            compressed.push(png.subarray(offset + 8, offset + 8 + length));
          offset += length + 12;
        }
        const pixels = inflateSync(Buffer.concat(compressed));
        expect(pixels[4]).toBe(variant === 'square' ? 255 : 0);
      }
    const manifest = JSON.parse(
      await readFile(resolve(publicDirectory, 'site.webmanifest'), 'utf8'),
    );
    expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual([
      '192x192',
      '512x512',
    ]);
    for (const icon of manifest.icons) expect(icon.purpose).toBe('any maskable');
    const ico = await readFile(resolve(publicDirectory, 'favicon.ico'));
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(3);
  });

  test('JavaScript package exports include the complete native bridge declarations', async () => {
    const root = resolve(
      process.env.TUFFITE_FRAMEWORK_DIR ?? resolve(import.meta.dir, '../../src/tuffite'),
    );
    const pkg = JSON.parse(await readFile(resolve(root, 'packages/tuffite/package.json'), 'utf8'));
    expect(reference.javascriptExports.length).toBe(Object.keys(pkg.exports).length);
    for (const entry of reference.javascriptExports)
      expect(entry.source).toBe(
        await readFile(resolve(root, 'packages/tuffite', entry.file), 'utf8'),
      );
    const runtime = reference.javascriptExports.find((entry) => entry.name === 'tuffite/runtime')!;
    expect(runtime.source).toContain('addEventListener(');
    expect(runtime.source).toContain('removeEventListener(');
    expect(runtime.source).toContain('interface NativeBridge');
  });
});
