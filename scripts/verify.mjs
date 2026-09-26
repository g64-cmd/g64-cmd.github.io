// Run after Jekyll builds. This check needs only Node's standard library.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv.find(arg => arg.startsWith('--site='))?.slice(7) || '_site');
const drafts = process.argv.includes('--drafts');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const errors = [];
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
let checked = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).split(path.sep).join('/');
  const base = new URL(relative, 'https://local.test/');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = decode(match[1]);
    if (/^(?:https?:|mailto:|data:|tel:)/i.test(ref)) continue;
    const url = new URL(ref, base);
    const pathname = decodeURIComponent(url.pathname);
    let target = path.join(root, pathname);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    checked++;
    if (!fs.existsSync(target)) { errors.push(relative + ' -> missing ' + pathname); continue; }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const targetHTML = fs.readFileSync(target, 'utf8');
      const ids = [...targetHTML.matchAll(/id="([^"]+)"/g)].map(item => decode(item[1]));
      if (!ids.includes(id)) errors.push(relative + ' -> missing anchor ' + ref);
    }
  }
}
const cssPath = path.join(root, 'assets/vendor/katex/katex.min.css');
for (const match of fs.readFileSync(cssPath, 'utf8').matchAll(/url\(([^)]+)\)/g)) {
  const ref = match[1].replace(/['"]/g, '');
  if (!fs.existsSync(path.resolve(path.dirname(cssPath), ref))) errors.push('Missing formula font: ' + ref);
}
for (const excluded of ['templates', '_drafts', 'scripts', 'README.md']) {
  assert(!fs.existsSync(path.join(root, excluded)), excluded + ' leaked into output');
}
assert(fs.existsSync(path.join(root, '随笔/2026/09/25/test.html')), 'Legacy article URL missing');
const examplePaths = ['2026/09/22/rigorous-writing', '2026/09/23/weekend-walk', '2026/09/24/learning-first', '2026/09/25/learning-second'];
for (const example of examplePaths) {
  assert.equal(fs.existsSync(path.join(root, example, 'index.html')), drafts, 'Draft publication mismatch: ' + example);
}
const archive = fs.readFileSync(path.join(root, 'articles/index.html'), 'utf8');
assert(archive.includes('这是一个测试文件'), 'Archive must contain server-rendered articles without JS');
assert(archive.includes('role="search" hidden'), 'Progressive enhancement must hide inactive search without JS');
const kinds = new Set(['学习记录', '随笔', '长文']);
const seenOrder = new Set();
for (const folder of ['_posts', '_drafts']) {
  for (const file of walk(folder).filter(file => file.endsWith('.md'))) {
    const source = fs.readFileSync(file, 'utf8');
    const frontMatter = source.split(/^---\s*$/m)[1] || '';
    const kind = frontMatter.match(/^kind:\s*(.+)$/m)?.[1]?.trim();
    if (kind) assert(kinds.has(kind), 'Unknown kind in ' + file);
    const series = frontMatter.match(/^series:\s*(\S+)/m)?.[1];
    if (series) {
      assert(fs.existsSync('_series/' + series + '.md'), 'Unknown series in ' + file);
      const order = frontMatter.match(/^series_order:\s*(\d+)\s*$/m)?.[1];
      assert(order, 'Missing integer series_order in ' + file);
      const key = series + ':' + Number(order);
      assert(!seenOrder.has(key), 'Duplicate series order: ' + key);
      seenOrder.add(key);
    }
  }
}
if (errors.length) throw new Error(errors.join('\n'));
console.log('PASS: ' + htmlFiles.length + ' pages, ' + checked + ' internal links/assets, fonts, metadata, legacy URL and ' + (drafts ? 'draft preview' : 'production exclusions') + '.');

