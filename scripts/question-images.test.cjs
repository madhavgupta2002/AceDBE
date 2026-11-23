// Question figures are Markdown images with bank-relative file names. Every reference must point at a
// file in the bank's folder, every file there must be used, and the loader must turn names into site paths.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const SUBJECTS = path.join(root, 'public/data/Subjects');
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;

function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: file });
  return exports;
}

const images = load('lib/questionImages.ts');
const loader = load('lib/questionLoader.ts', { './questionImages': images });

function banks() {
  const out = [];
  for (const code of fs.readdirSync(SUBJECTS)) {
    for (const type of ['CLA', 'Exam', 'Custom']) {
      const dir = path.join(SUBJECTS, code, type);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) out.push({ code, type, file: path.join(dir, f) });
    }
  }
  return out;
}

const textsOf = q => [
  q.question_text, q.explanation, q.explaination, ...Object.values(q.options ?? {}),
  ...(q.variants ?? []).flatMap(v => [v.question_text, v.explanation, ...Object.values(v.options ?? {})]),
];

test('no bank uses the old PARSEIMAGE placeholder', () => {
  for (const { file } of banks()) assert.ok(!fs.readFileSync(file, 'utf8').includes('PARSEIMAGE'), file);
});

test('every referenced figure exists and every figure file is referenced', () => {
  let refs = 0;
  for (const { file } of banks()) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const folder = file.replace(/\.json$/, '');
    const used = new Set(data.questions.flatMap(q => textsOf(q).flatMap(t => images.imageFiles(t))));
    for (const name of used) assert.ok(fs.existsSync(path.join(folder, name)), `${path.relative(SUBJECTS, folder)}/${name} is missing`);
    refs += used.size;
    if (fs.existsSync(folder)) {
      for (const name of fs.readdirSync(folder).filter(n => IMAGE_EXT.test(n))) {
        assert.ok(used.has(name), `${path.relative(SUBJECTS, folder)}/${name} is not used by any question`);
      }
    }
  }
  assert.ok(refs >= 20, `expected the migrated figures, found ${refs}`);
});

test('the loader turns file names into site paths for questions and passages', () => {
  const bank = JSON.parse(fs.readFileSync(path.join(SUBJECTS, 'ES21x/Exam/23 May 2026.json'), 'utf8'));
  const qs = loader.convertFileToQuestions(bank, '23 May 2026', 'ES21x', 'Exam');
  const base = '/data/Subjects/ES21x/Exam/23%20May%202026/';
  assert.ok(qs.find(q => q.id === '11').text.includes(`![Figure](${base}PME_Q11_587.jpg)`));
  const q5 = qs.find(q => q.id === '5');
  assert.equal(q5.passage.id, 'Passage_1');
  assert.ok(q5.passage.text.includes(`![Figure](${base}PME_Q5_587.jpg)`));
});

test('absolute and site-relative image URLs are left alone', () => {
  const base = '/data/Subjects/X/CLA/Bank/';
  assert.equal(images.resolveImages('![a](https://e.com/x.png)', base), '![a](https://e.com/x.png)');
  assert.equal(images.resolveImages('![a](/img/x.png)', base), '![a](/img/x.png)');
  assert.equal(images.resolveImages('see ![a](my chart.png)', base), 'see ![a](my chart.png)'); // not a valid Markdown image
  assert.equal(images.resolveImages('![a](<x.png>)', base), `![a](${base}x.png)`);
  assert.equal(images.bankImageBase('DS71x', 'CLA', 'Batch 1 CLA'), '/data/Subjects/DS71x/CLA/Batch%201%20CLA/');
});
