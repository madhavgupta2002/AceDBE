const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { randomUUID } = require('node:crypto');

// Execute the actual TypeScript modules with an isolated browser and database.
function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require: name => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    }, console: { error() {} }, ...globals,
  }, { filename: file });
  return exports;
}
const plain = value => JSON.parse(JSON.stringify(value));
function progressHarness(storage = new Map(), rows = []) {
  const state = { rows, writes: [], fetchError: false, saveError: false, timers: new Map(), status: 'local' };
  let hookIndex = 0;
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const supabase = { from: () => ({
    select: () => ({ eq: async (_, userId) => ({
      data: plain(state.rows.filter(row => row.user_id === userId)),
      error: state.fetchError ? new Error('offline') : null,
    }) }),
    upsert: async row => {
      state.writes.push(plain(row));
      if (state.beforeSave) await state.beforeSave(row);
      if (state.saveError) return { error: new Error('offline') };
      const index = state.rows.findIndex(r => r.user_id === row.user_id && r.subject_code === row.subject_code && r.module === row.module);
      if (index === -1) state.rows.push(plain(row)); else state.rows[index] = plain(row);
      return { error: null };
    },
  }) };
  const module = load('lib/progress.ts', {
    './supabase': { supabase },
    react: {
      useCallback: callback => callback,
      useState: initial => { const index = hookIndex++; return [initial, value => { if (index === 1) state.status = value; }]; },
      useEffect: callback => callback(),
    },
  }, {
    localStorage, window: new EventTarget(), Event, crypto: { randomUUID },
    setTimeout: callback => { const id = randomUUID(); state.timers.set(id, callback); return id; },
    clearTimeout: id => state.timers.delete(id),
  });
  return { module, hook: module.useProgress(), state, storage };
}
const row = (video = false, questions = false, user_id = 'alice') => ({ user_id, subject_code: 'S', module: '1', video, questions });
const cache = (storage, user = 'alice') => JSON.parse(storage.get(`ace_dbe_module_progress:${user}`));

test('cloud unchecks win over stale device and legacy guest checks', async () => {
  const stale = JSON.stringify({ S: { 1: { video: true, questions: true } } });
  const storage = new Map([['ace_dbe_module_progress', stale], ['ace_dbe_module_progress:alice', stale]]);
  const h = progressHarness(storage, [row()]);
  await h.module.setProgressUser('alice');
  assert.deepEqual(cache(storage), { S: { 1: { video: false, questions: false } } });
  assert.equal(h.state.writes.length, 0);
  assert.equal(h.state.status, 'synced');
});

test('guest progress for a new module is imported', async () => {
  const storage = new Map([['ace_dbe_module_progress', JSON.stringify({ S: { 1: { video: true } } })]]);
  const h = progressHarness(storage);
  await h.module.setProgressUser('alice');
  assert.equal(h.state.rows[0].video, true);
  assert.equal(h.state.rows[0].user_id, 'alice');
});

test('failed fetch exposes error and retries successfully', async () => {
  const h = progressHarness(new Map(), [row(true)]);
  h.state.fetchError = true;
  await h.module.setProgressUser('alice');
  assert.equal(h.state.status, 'error');
  assert.equal(h.state.timers.size, 1);
  h.state.fetchError = false;
  await h.hook.retrySync();
  assert.equal(h.state.status, 'synced');
  assert.equal(cache(h.storage).S[1].video, true);
  assert.equal(h.state.timers.size, 0);
});

test('failed uncheck survives reload and preserves the other cloud checkbox', async () => {
  const h = progressHarness(new Map(), [row(true, true)]);
  await h.module.setProgressUser('alice');
  h.state.saveError = true;
  h.hook.setChecks('S', '1', { video: false });
  await h.hook.retrySync();
  assert.equal(h.state.status, 'error');
  const reloaded = progressHarness(h.storage, h.state.rows);
  await reloaded.module.setProgressUser('alice');
  assert.equal(reloaded.state.rows[0].video, false);
  assert.equal(reloaded.state.rows[0].questions, true);
  assert.equal(reloaded.state.status, 'synced');
});

test('an edit during an in-flight save is not dropped', async () => {
  const h = progressHarness(new Map(), [row()]);
  await h.module.setProgressUser('alice');
  let release, started;
  const gate = new Promise(resolve => { release = resolve; });
  const saving = new Promise(resolve => { started = resolve; });
  h.state.beforeSave = async () => { started(); await gate; };
  h.hook.setChecks('S', '1', { video: true });
  await saving;
  h.hook.setChecks('S', '1', { video: false });
  release();
  await h.hook.retrySync();
  assert.equal(h.state.rows[0].video, false);
  assert.equal(h.state.writes.length, 2);
  assert.equal(h.state.status, 'synced');
});

test('switching accounts keeps pending edits scoped to their owner', async () => {
  const h = progressHarness(new Map(), [row(true), row(false, true, 'bob')]);
  await h.module.setProgressUser('alice');
  h.state.saveError = true;
  h.hook.setChecks('S', '1', { video: false });
  await h.hook.retrySync();
  h.state.saveError = false;
  await h.module.setProgressUser('bob');
  assert.equal(cache(h.storage, 'bob').S[1].questions, true);
  assert.equal(h.state.rows.find(r => r.user_id === 'alice').video, true);
  await h.module.setProgressUser('alice');
  assert.equal(h.state.rows.find(r => r.user_id === 'alice').video, false);
});

function historyHarness() {
  const inserts = [];
  const history = load('lib/history.ts', { './supabase': { supabase: {
    auth: { getSession: async () => ({ data: { session: { user: { id: 'alice' } } } }) },
    from: () => ({ insert: async value => { inserts.push(plain(value)); return { error: null }; } }),
  } } });
  const loader = load('lib/questionLoader.ts');
  const questions = loader.convertFileToQuestions({ questions: [
    { question_id: '1', question_text: 'Q', question_type: 'MCQ', options: { A: 'Yes' }, correct_option_label: 'A', module: 1 },
    { question_id: '2', question_text: 'Q2', question_type: 'MCQ', options: { A: 'Yes' }, correct_option_label: 'A', module: 2 },
  ] }, 'Paper', 'S', 'Exam');
  return { history, inserts, questions };
}
test('fresh questions loaded for CBT/revision retries retain history set attribution', async () => {
  const h = historyHarness();
  await h.history.saveAttempt({ subjectCode: 'S', mode: 'practice', questions: h.questions, answers: [['A'], null], timeSec: 12 });
  assert.deepEqual(h.inserts[0].set_keys, ['Exam|Paper']);
  assert.equal(h.inserts[0].correct, 1);
  assert.equal(h.inserts[0].total, 2);
});

test('all-unanswered practice and CBT submissions are recorded', async () => {
  const h = historyHarness();
  for (const mode of ['practice', 'cbt']) {
    await h.history.saveAttempt({ subjectCode: 'S', mode, questions: h.questions, answers: [null, null], timeSec: 60 });
  }
  assert.equal(h.inserts.length, 2);
  for (const attempt of h.inserts) {
    assert.equal(attempt.correct, 0);
    assert.equal(attempt.wrong, 0);
    assert.equal(attempt.total, 2);
    assert.equal(attempt.units.reduce((n, unit) => n + unit.unanswered, 0), 2);
  }
});

test('empty module/source filters retain controls and recover the quiz without losing answers', async () => {
  const React = require('react');
  const states = [];
  let cursor = 0;
  const hooks = {
    ...React,
    useEffect() {},
    useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
    },
    useRef(initial) { const index = cursor++; return states[index] ?? (states[index] = { current: initial }); },
  };
  const questionLoader = {
    compareModules: (a, b) => a - b,
    loadQuestions: async (_type, _code, source) => [{
      id: source, text: source, module: source === 'CLA' ? 1 : 5, source, bankType: 'CLA',
      correctAnswer: ['A'], options: { A: 'yes' },
    }],
  };
  // Pure helpers and hooks under components/quiz run for real; presentational pieces are named stubs.
  const quiz = {};
  const loadQuiz = (name, deps = {}) => quiz[name] ??= load(`components/quiz/${name}.ts`, { react: hooks, ...deps });
  const answers = loadQuiz('answers');
  const stubs = ['QuizQuestion', 'QuizStats', 'AnswerStatus', 'UnifiedQuizSelector', 'Header', 'CbtExam', 'Button'];
  const dependencies = {
    react: hooks,
    'next/navigation': { useRouter: () => ({ push() {} }) },
    '@/lib/subjectMapping': { getSubjectByCode: () => ({ name: 'Test subject' }) },
    '@/lib/questionLoader': questionLoader,
    '@/lib/history': { saveAttempt() {}, setKey: (type, bank) => `${type}|${bank}` },
    '@/lib/cbtReview': {},
    'lucide-react': new Proxy({}, { get: (_, name) => String(name) }),
    './quiz/StudyMaterials': { StudyMaterials: 'StudyMaterials', QuizNotesBar: 'QuizNotesBar' },
    './quiz/VideoPlaylists': 'VideoPlaylists',
    './quiz/ReviewView': { __esModule: true, default: 'ReviewView', ReviewToolbar: 'ReviewToolbar' },
    './quiz/QuizActions': { QuizNavBar: 'QuizNavBar', QuizSidebarActions: 'QuizSidebarActions' },
    './quiz/exportQuiz': { downloadQuizJson() {}, printQuiz() {} },
    './quiz/answers': answers,
    './quiz/loadSelection': loadQuiz('loadSelection', { '@/lib/questionLoader': questionLoader, './answers': answers }),
    './quiz/useQuizTimer': loadQuiz('useQuizTimer'),
    './quiz/useQuizShortcuts': loadQuiz('useQuizShortcuts'),
    './quiz/useSubjectResources': loadQuiz('useSubjectResources'),
    // QuizFilters is rendered through so the real ModuleSelector / SourceSelector props can be reached
    './quiz/QuizFilters': load('components/quiz/QuizFilters.tsx', { react: hooks, '../ModuleSelector': 'ModuleSelector', '../SourceSelector': 'SourceSelector' }),
  };
  for (const name of stubs) dependencies[`./${name}`] = name;
  const { default: QuizApp } = load('components/QuizApp.tsx', dependencies);
  const render = () => { cursor = 0; return QuizApp({ subjectCode: 'S' }); };
  const nodes = tree => {
    if (!tree || typeof tree !== 'object') return [];
    const rendered = typeof tree.type === 'function' ? [tree.type(tree.props)] : React.Children.toArray(tree.props?.children);
    return [tree, ...rendered.flatMap(nodes)];
  };
  const find = (tree, type) => nodes(tree).find(node => node.type === type);
  let tree = render();
  await find(tree, 'UnifiedQuizSelector').props.onStartQuiz({
    sets: [{ bankType: 'CLA', bankName: 'CLA', modules: [] }, { bankType: 'CLA', bankName: 'Practice', modules: [] }],
    randomOrder: false,
  });
  tree = render();
  find(tree, 'QuizQuestion').props.onAnswer(['A']);
  tree = render();
  find(tree, 'ModuleSelector').props.onSelect(5);
  tree = render();
  find(tree, 'SourceSelector').props.onSelect('CLA');
  tree = render();
  assert.ok(find(tree, 'ModuleSelector'));
  assert.ok(find(tree, 'SourceSelector'));
  assert.equal(find(tree, 'QuizQuestion'), undefined);
  assert.equal(find(tree, 'UnifiedQuizSelector'), undefined);
  const clear = nodes(tree).find(node => node.type === 'button' && node.props.children === 'Clear filters');
  assert.ok(clear);
  clear.props.onClick();
  tree = render();
  assert.equal(find(tree, 'QuizQuestion').props.totalQuestions, 2);
  assert.deepEqual(plain(find(tree, 'QuizQuestion').props.selectedAnswer), ['A']);
});
