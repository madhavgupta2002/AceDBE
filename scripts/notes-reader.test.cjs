const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, require: name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  } }, { filename: file });
  return exports;
}
const dependencies = Promise.all(['unified', 'remark-parse', 'remark-gfm', 'remark-math', 'react-markdown', 'rehype-raw', 'rehype-katex'].map(async name => [name, { __esModule: true, ...await import(name) }]))
  .then(entries => Object.fromEntries(entries));
const reader = dependencies.then(deps => load('lib/notesReader.ts', deps));
const renderer = Promise.all([dependencies, reader]).then(([deps, helpers]) => load('components/NotesMarkdown.tsx', {
  ...deps,
  react: React,
  'lucide-react': require('lucide-react'),
  '@/lib/notesReader': helpers,
  './MermaidBlock': () => React.createElement('div', null, 'Diagram'),
}));
const plain = value => JSON.parse(JSON.stringify(value));

test('contents ignore fenced headings and link repeated/formatted headings uniquely', async () => {
  const helpers = await reader;
  const outline = helpers.getNotesOutline('# **First idea**\n\n```md\n## Not a topic\n```\n\n## Review\n## Review\n## Review 2\n## $\\alpha$');
  assert.equal(outline.length, 5);
  assert.equal(outline[0].title, 'First idea');
  assert.equal(new Set(outline.map(item => item.id)).size, 5);
  const { default: NotesMarkdown } = await renderer;
  const html = renderToStaticMarkup(React.createElement(NotesMarkdown, {
    markdown: '# **First idea**\n\n## Review\n## Review\n## Review 2\n## $\\alpha$', outline,
  }));
  for (const heading of outline) assert.ok(html.includes(`id="${heading.id}"`), heading.id);
  assert.equal(html.includes('<h1'), false);
  assert.ok(html.includes('<h2'));
  assert.ok(html.includes('class="katex"'));
});

test('existing heading links still navigate inside the notes', async () => {
  const helpers = await reader;
  const { default: NotesMarkdown } = await renderer;
  const markdown = '# First idea\n\n[Review this](#first-idea)';
  const html = renderToStaticMarkup(React.createElement(NotesMarkdown, { markdown, outline: helpers.getNotesOutline(markdown) }));
  assert.ok(html.includes('href="#notes-first-idea"'));
});

test('practice answers can be revealed while normal lists stay visible', async () => {
  const helpers = await reader;
  const { default: NotesMarkdown } = await renderer;
  const markdown = '> **CLA:** What is the answer?\n> - **Option A** ✓\n\n> **Example:** An ordinary example\n> - Always visible';
  const html = renderToStaticMarkup(React.createElement(NotesMarkdown, { markdown, outline: helpers.getNotesOutline(markdown) }));
  assert.equal((html.match(/<details/g) ?? []).length, 1);
  assert.ok(html.includes('<summary>Reveal answer</summary>'));
  assert.ok(html.includes('Option A'));
  assert.ok(html.includes('Always visible'));
  assert.equal(html.includes('<details class="notes-answer" open'), false);
});

test('reading preferences accept valid settings and recover from corrupt storage', async () => {
  const helpers = await reader;
  assert.deepEqual(plain(helpers.parseReaderSettings('{bad')), plain(helpers.DEFAULT_READER_SETTINGS));
  assert.deepEqual(plain(helpers.parseReaderSettings('null')), plain(helpers.DEFAULT_READER_SETTINGS));
  assert.deepEqual(plain(helpers.parseReaderSettings(JSON.stringify({ font: 'lora', size: 22, tone: 'paper' }))), { font: 'lora', size: 22, tone: 'paper' });
  const invalid = helpers.parseReaderSettings(JSON.stringify({ font: 'unknown', size: 999, tone: 'invalid', focus: 'yes' }));
  assert.equal(invalid.size, 26);
  assert.equal(invalid.font, 'inter');
  assert.equal(invalid.tone, 'night');
});
