// QuizFiller matching: real bank questions are found with shuffled options mapped correctly, and
// questions that are not in the bank (same subject, overlapping vocabulary) are rejected, not guessed.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { matchQuestion } = require('../tools/extensions/QuizFiller/match.js');
const index = require('../public/data/answer-index.json');

const ctx = { code: 'DS71x', batch: '1' };

test('a bank question with shuffled options maps answers to the page order', () => {
  const e = index.find(x => x.c === 'DS71x' && Object.keys(x.o).length >= 4 && x.a.includes(','))
    || index.find(x => x.c === 'DS71x' && Object.keys(x.o).length >= 4);
  const labels = Object.keys(e.o);
  const shuffled = [...labels].reverse();
  const r = matchQuestion({ text: e.q, options: shuffled.map(l => e.o[l]) }, index, ctx);
  assert.ok(r.entry, 'expected a match');
  const want = e.a.split(',').map(l => String.fromCharCode(97 + shuffled.indexOf(l.trim()))).sort();
  assert.deepEqual(r.letters, want);
});

test('answers never repeat a letter', () => {
  for (const e of index.filter(x => x.c === 'DS71x').slice(0, 40)) {
    const labels = Object.keys(e.o);
    const r = matchQuestion({ text: e.q, options: labels.map(l => e.o[l]) }, index, ctx);
    if (r.entry) assert.equal(new Set(r.letters).size, r.letters.length, e.q);
  }
});

test('questions missing from the bank are not matched to lookalikes from the same subject', () => {
  // Drop the DS71x Module 4 bank to recreate the original report: these were matched to mid-term questions.
  const without = index.filter(e => !(e.c === 'DS71x' && String(e.m) === '4'));
  const unseen = [
    { text: 'Which of the following business-question-to-chart pairings match correctly?',
      options: ['Relationship between net sales and profitability across subcategories → scatter', 'How the mix of customer segments changes over the years → 100% stacked area', 'Compare total profit across four regions, one of which made a loss → pie chart', 'How each region’s share of total sales has moved over five years → donut chart', 'Show whether the current month’s profit is on track against its monthly target → KPI card'] },
    { text: 'In the following scatter plot, bubble size shows Net Sales of each sub-category. Blue dotted line shows the Profitability target of 13%. Which of the following interpretations are supported by the chart?',
      options: ['Supplies get a lower discount and make a small profit.', 'Machines get heavy discounts and end up making losses.', 'Labels contribute the most to Net Sales and profitability.', 'Labels contribute the most to Net Sales and profitability.', 'Copiers earn well above the 13% Profitability target at a moderate discount'] },
    { text: 'Which of the following statements about time-based measures are true?',
      options: ['SAMEPERIODLASTYEAR shifts the dates back one year', 'CALCULATE (Year – 1) gets last year’s sales', 'TOTALYTD adds up values from 1 January to the date in view', 'Last year’s sales can be calculated with SUM on the Net Sales column alone', 'Time intelligence functions require a continuous Date table to work properly'] },
    { text: 'Which of the following practices improve a one-page report for senior leaders?',
      options: ['Align and evenly distribute visuals on a grid', 'Use red only for adverse values, consistently across pages', 'Include several different chart types to show variety', 'Add a short subtitle or note explaining any color or new feature', 'Use a different color palette on each page for interest'] },
  ];
  for (const q of unseen) assert.equal(matchQuestion(q, without, ctx).entry, null, q.text);
  // With the Module 4 bank present they match their own entries and the stored answers.
  const want = [['a', 'b', 'e'], ['b', 'e'], ['a', 'c', 'e'], ['a', 'b', 'd']];
  unseen.forEach((q, i) => {
    const r = matchQuestion(q, index, ctx);
    assert.equal(r.entry?.m, 4, q.text);
    assert.deepEqual(r.letters, want[i], q.text);
  });
});
