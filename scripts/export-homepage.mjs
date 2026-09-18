// Synchronize only the public homepage into the existing GitHub Pages root.
// Keep recipient pages and their assets intact, including historical chunks.
import { readdir, readFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'out');
const html = await readFile(join(output, 'index.html'), 'utf8');
if (!html.includes('id="hero-title"')) throw new Error('Build the SaveCases public homepage first.');
const files = new Set([
  'index.html', 'index.txt', 'robots.txt', 'sitemap.xml',
  ...(await readdir(output)).filter(name => name.startsWith('__next.') && name.endsWith('.txt')),
  ...[...html.matchAll(/\/_next\/[^"\\\s<>]+/g)].map(match => match[0].slice(1)),
  ...(await readdir(join(output, 'marketing'))).map(name => `marketing/${name}`),
]);
for (const relative of files) {
  const destination = join(root, relative);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(output, relative), destination);
}
console.log(JSON.stringify([...files].sort(), null, 2));
