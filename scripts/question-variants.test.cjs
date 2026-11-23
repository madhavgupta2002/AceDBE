const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');

const root = path.join(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'public/data/Subjects/OM41x/CLA/Sub Sectional Quiz.json'), 'utf8'));
const plain = value => JSON.parse(JSON.stringify(value));

function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    ...globals,
  }, { filename: file });
  return exports;
}

const loader = load('lib/questionLoader.ts', { './questionImages': load('lib/questionImages.ts') });
const variants = load('lib/questionVariants.ts');
const answers = load('components/quiz/answers.ts');
const questions = loader.convertFileToQuestions(bank, 'Sub Sectional Quiz', 'OM41x', 'CLA');
const question = id => questions.find(q => q.id === id);

test('wording variants remain one graded question and retain both sets of options', () => {
  assert.equal(questions.length, bank.questions.filter(q => !q.is_passage).length);
  for (const n of [3, 4, 5, 6]) {
    const q = question(`M1_C_Q${n}`);
    const before = plain(q);
    const alternate = variants.resolveQuestionVariant(q, 'batch-2');
    assert.equal(q.variantLabel, 'Batch 1');
    assert.equal(q.variants[0].label, 'Batch 2');
    assert.equal(alternate.id, q.id);
    assert.equal(alternate.source, q.source);
    assert.deepEqual(plain(alternate.correctAnswer), ['C']);
    assert.equal(answers.isAnswerCorrect(['C'], alternate), true);
    assert.deepEqual(plain(q), before);
    assert.equal(variants.resolveQuestionVariant(q, ''), q);
    assert.equal(variants.resolveQuestionVariant(q, 'missing'), q);
  }
  assert.equal(question('M1_C_Q1').variants, undefined);
  assert.equal(
    variants.resolveQuestionVariant(question('M1_C_Q6'), 'batch-2').options.C,
    'Drying can handle any number of pallets without limiting overall output'
  );
  assert.equal(question('M1_C_Q6').options.C, 'Drying can often handle very large batches simultaneously without restricting the flow of the system');
  assert.deepEqual(plain(question('M1_I_Q1').correctAnswer), ['B']);
});

test('review search finds text and options that exist only in an alternate version', () => {
  assert.equal(answers.matchesSearch(question('M1_C_Q3'), 'section 1.4.5'), true);
  assert.equal(answers.matchesSearch(question('M1_C_Q6'), 'Drying stage uses expensive resources'), true);
  assert.equal(answers.matchesSearch(question('M1_C_Q6'), 'very large batches'), true);
  assert.equal(answers.matchesSearch(question('M1_C_Q6'), 'not present anywhere'), false);
});

test('export and reimport preserve alternate wording, labels, options and explanation overrides', () => {
  let exported;
  const q = {
    ...question('M1_C_Q6'),
    variants: [{ ...question('M1_C_Q6').variants[0], explanation: 'Alternate explanation' }],
  };
  const { downloadQuizJson } = load('components/quiz/exportQuiz.ts', {}, {
    Blob: class { constructor(parts) { exported = JSON.parse(parts.join('')); } },
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    document: { createElement: () => ({ click() {} }), body: { appendChild() {}, removeChild() {} } },
  });
  downloadQuizJson([q], 'OM41x', 'Operations Management');
  const [reimported] = loader.convertFileToQuestions(exported, 'Sub Sectional Quiz', 'OM41x', 'CLA');
  assert.deepEqual(plain(reimported.variants), plain(q.variants));
  assert.equal(reimported.variantLabel, 'Batch 1');
  assert.equal(reimported.id, q.id);
  assert.equal(variants.resolveQuestionVariant(reimported, 'batch-2').explanation, 'Alternate explanation');
});

function viewHarness() {
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
  };
  const selector = load('components/quiz/QuestionVariantSelector.tsx', {
    react: hooks, '@/lib/questionVariants': variants,
  });
  const dependencies = {
    react: hooks,
    '@/lib/moduleLabel': { moduleLabel: value => `Module ${value}` },
    'lucide-react': new Proxy({}, { get: (_, name) => String(name) }),
    './quiz/QuestionVariantSelector': selector,
    './QuestionVariantSelector': selector,
    './StopWatch': 'StopWatch',
    './Button': 'Button',
    '../Button': 'Button',
    './PassageCard': 'PassageCard',
    '../PassageCard': 'PassageCard',
    './quiz/Markdown': { __esModule: true, default: 'Markdown', inlineParagraphs: {} },
    './Markdown': { __esModule: true, default: 'Markdown', inlineParagraphs: {} },
    './quiz/formatText': { formatQuizText: text => text },
    './PrintMenu': 'PrintMenu',
    './answers': answers,
  };
  function nodes(tree) {
    if (!tree || typeof tree !== 'object') return [];
    const children = typeof tree.type === 'function' ? [tree.type(tree.props)] : React.Children.toArray(tree.props?.children);
    return [tree, ...children.flatMap(nodes)];
  }
  return {
    load: file => load(file, dependencies).default,
    render(Component, props) {
      cursor = 0;
      return nodes(Component(props));
    },
  };
}

test('practice switches question and option wording while preserving selected answers and per-question choices', () => {
  const h = viewHarness();
  const QuizQuestion = h.load('components/QuizQuestion.tsx');
  const q = question('M1_C_Q6');
  let response;
  const props = { question: q, onAnswer: value => { response = value; }, selectedAnswer: null, showResult: false };
  let tree = h.render(QuizQuestion, props);
  const button = label => tree.find(node => node.type === 'button' && node.props.children === label);
  button('Batch 2').props.onClick();
  tree = h.render(QuizQuestion, props);
  assert.equal(button('Batch 2').props['aria-pressed'], true);
  assert.ok(tree.some(node => node.type === 'Markdown' && node.props.children === q.variants[0].text));
  assert.ok(tree.some(node => node.type === 'Markdown' && node.props.children === q.variants[0].options.C));
  const optionButtons = tree.filter(node => node.type === 'button' && typeof node.props['aria-pressed'] === 'boolean' && typeof node.props.children !== 'string');
  optionButtons[2].props.onClick();
  assert.deepEqual(plain(response), ['C']);
  props.selectedAnswer = response;
  props.showResult = true;
  tree = h.render(QuizQuestion, props);
  button('Batch 1').props.onClick();
  tree = h.render(QuizQuestion, props);
  const selected = tree.filter(node => node.type === 'button' && node.props.disabled && node.props['aria-pressed']);
  assert.equal(selected.length, 1);
  assert.ok(tree.some(node => node.type === 'Markdown' && node.props.children === q.options.C));
  button('Batch 2').props.onClick();
  props.question = question('M1_C_Q3');
  tree = h.render(QuizQuestion, props);
  assert.equal(button('Batch 1').props['aria-pressed'], true);
  props.question = q;
  tree = h.render(QuizQuestion, props);
  assert.equal(button('Batch 2').props['aria-pressed'], true);
});

test('review exposes both versions without losing correct answer highlighting', () => {
  const h = viewHarness();
  const ReviewView = h.load('components/quiz/ReviewView.tsx');
  const q = question('M1_C_Q6');
  const props = {
    questions: [q], answeredQuestions: [['C']], incorrectAnswers: [], searchQuery: '',
    reviseMode: false, showAllQuestions: true, hideWrongOptions: true,
    globalAnswersVisible: true, individualAnswersVisible: {}, onSetIndividualVisible() {},
  };
  let tree = h.render(ReviewView, props);
  tree.find(node => node.type === 'button' && node.props.children === 'Batch 2').props.onClick();
  tree = h.render(ReviewView, props);
  assert.ok(tree.some(node => node.type === 'Markdown' && node.props.children === q.variants[0].text));
  assert.ok(tree.some(node => node.type === 'Markdown' && node.props.children === q.variants[0].options.C));
  assert.equal(tree.some(node => node.type === 'Markdown' && node.props.children === q.options.C), false);
  assert.ok(tree.some(node => node.type === 'div' && node.props.className?.includes('text-green-400')));
});

test('extension matches both term versions at 100% and remaps answers when options are reordered', async () => {
  const courseQuestions = [
    ['In capacity analysis, why is it important to know the process time for each activity? (Select the most appropriate answer)', ['To estimate the quality of the product', 'To determine the workload and capacity of resources', 'To calculate the marketing budget', 'To analyze customer buying behavior']],
    ['Which of the following is part of the basic information required to start a capacity analysis? (Select the most appropriate answer)', ['Technological and logical constraints', 'Supplier feedback', 'Customer satisfaction scores', 'Market competition analysis']],
    ['Refer to our discussion in Section 1.4.5, what is the total time taken to process one batch of toys from preparation to inspection and packing? (for the first order)', ['45 minutes', '50 minutes', '55 minutes', '60 minutes']],
    ['Refer to our discussion in Section 1.4.6, Which stage in the toy production process takes the longest time and is likely the bottleneck?', ['Preparation', 'Pre-treatment', 'Painting', 'Drying']],
    ['Refer to our discussion in Section 1.4.7, given an 8-hour working day, what is the maximum number of toy pallets that can be produced per day, assuming the bottleneck is in the painting stage?', ['18 pallets per day', '21 pallets per day', '24 pallets per day', '30 pallets per day']],
    ['Refer to our discussion in Section 1.4.7, which of the following statements best explains why the drying stage is not considered a capacity-constrained resource?', ['Drying time is shorter than preparation time', 'Drying stage uses expensive resources', 'Drying can handle any number of pallets without limiting overall output', 'Drying is not required for all types of toys']],
  ];
  const pageQuestions = courseQuestions.map(([text, options], index) => ({ n: String(index + 1), text, options }));
  for (const n of [3, 4, 5, 6]) {
    const q = question(`M1_C_Q${n}`);
    pageQuestions.push({ n: String(pageQuestions.length + 1), text: q.text, options: Object.values(q.options) });
  }
  pageQuestions.push({ n: '11', text: courseQuestions[5][0], options: [...courseQuestions[5][1]].reverse() });

  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', textContent: '' });
    return elements.get(id);
  };
  const index = JSON.parse(fs.readFileSync(path.join(root, 'public/data/answer-index.json'), 'utf8'));
  const context = vm.createContext({
    document: { getElementById: element },
    fetch: async () => ({ ok: true, json: async () => index }),
    chrome: {
      tabs: { query: async () => [{ id: 1, url: 'https://iimbx.edu.in/courses/course-v1:IIMBx+OM41x+BBA_DBE_B1/course', title: 'Capacity analysis' }] },
      scripting: { executeScript: async ({ func }) => [{ result: func.name === 'extractQuestions' ? pageQuestions : [{ href: '', title: 'Capacity analysis' }] }] },
    },
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'tools/extensions/QuizFiller/match.js'), 'utf8'), context); // loaded first, as in popup.html
  const code = fs.readFileSync(path.join(root, 'tools/extensions/QuizFiller/popup.js'), 'utf8');
  await vm.runInContext(code + '\ndetect();', context);
  const lines = element('log').textContent.split('\n');
  assert.equal(lines.length, 11);
  const expected = ['b', 'a', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'b'];
  lines.forEach((line, i) => {
    assert.ok(line.startsWith(`Q${i + 1}: ${expected[i]}  (100% match · OM41x Sub Sectional Quiz M1`), line);
    if (i >= 2 && i <= 5 || i === 10) assert.ok(line.includes('Batch 2'), line);
    if (i >= 6 && i <= 9) assert.ok(line.includes('Batch 1'), line);
  });
});
