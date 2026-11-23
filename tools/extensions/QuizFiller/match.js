// Matches a quiz question on the page against the AceDBE answer index.
// Loaded by popup.html before popup.js, and by scripts/quizfiller-match.test.cjs.
// A match is only accepted when the question stem itself is close AND every answer option can be
// found among the page's options; otherwise it reports "no confident match" rather than guessing.
(function (root) {
  const STEM_MIN = 0.72;   // stem similarity needed to accept a bank question
  const OPTION_MIN = 0.6;  // similarity needed to map an answer option to a page option
  const OPTION_COVER = 0.75; // share of page options that must exist in the bank question

  const words = s => String(s).toLowerCase().replace(/[^a-z0-9₹%.]+/g, ' ').split(' ').filter(w => w.length > 1);
  function dice(A, B) {
    if (!A.size || !B.size) return 0;
    let n = 0; A.forEach(w => B.has(w) && n++);
    return 2 * n / (A.size + B.size);
  }
  const norm = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
  // Character trigrams keep word order and short tokens, so "an, the, an" and "the, an, the" differ.
  const grams = s => { const t = ` ${norm(s)} `, g = new Set(); for (let i = 0; i + 3 <= t.length; i++) g.add(t.slice(i, i + 3)); return g; };
  const optSim = (a, b) => (norm(a) === norm(b) ? 2 : (dice(new Set(words(a)), new Set(words(b))) + dice(grams(a), grams(b))) / 2);

  // Best page option for each bank option, each page option used at most once.
  function mapOptions(pageOpts, bankOpts) {
    const pairs = [];
    bankOpts.forEach((bo, bi) => pageOpts.forEach((po, pi) => pairs.push([optSim(po, bo), bi, pi])));
    pairs.sort((a, b) => b[0] - a[0]);
    const byBank = new Map(), usedPage = new Set(); let total = 0;
    for (const [s, bi, pi] of pairs) {
      if (s < OPTION_MIN || byBank.has(bi) || usedPage.has(pi)) continue;
      byBank.set(bi, pi); usedPage.add(pi); total += Math.min(s, 1);
    }
    return { map: byBank, fit: pageOpts.length ? total / pageOpts.length : 0 };
  }

  // q: {text, options[]}; index entries: {c, s, m, q, o:{A:..}, a:"A,C"}; ctx: {code, batch}.
  function matchQuestion(q, index, ctx = {}) {
    const stem = new Set(words(q.text)), stemGrams = grams(q.text);
    const bonus = e => (ctx.code && e.c === ctx.code ? 0.03 : 0) +
      (ctx.batch && (e.s.split('/')[0].endsWith('_B' + ctx.batch) || e.s.includes('Batch ' + ctx.batch)) ? 0.01 : 0);
    const candidates = [];
    let closest = 0;
    for (const e of index) {
      const s = dice(stem, e.qw ??= new Set(words(e.q)));
      if (s > closest) closest = s;
      if (s >= STEM_MIN) candidates.push([s + bonus(e), s, e]);
    }
    // Among close stems, prefer the bank question whose options fit the page best: the same question
    // often appears in several banks with different figures in the options.
    let best = null;
    for (const [withBonus, s, e] of candidates) {
      const labels = Object.keys(e.o);
      const { map, fit } = mapOptions(q.options, labels.map(l => e.o[l]));
      if (map.size < Math.ceil(q.options.length * OPTION_COVER)) continue; // different option set
      const ans = e.a.split(',').map(l => l.trim()).filter(Boolean);
      const picks = ans.map(l => map.get(labels.indexOf(l)));
      if (picks.some(p => p === undefined)) continue;                     // an answer isn't on the page
      const rank = withBonus + fit + dice(stemGrams, grams(e.q)); // trigrams separate "number 1" from "number 2"
      if (!best || rank > best.rank) best = { rank, s, e, picks };
    }
    if (best) {
      const letters = [...new Set(best.picks)].sort((a, b) => a - b).map(i => String.fromCharCode(97 + i));
      return { entry: best.e, letters, score: best.s };
    }
    return { entry: null, letters: [], score: 0, closest };
  }

  const api = { words, dice, matchQuestion, STEM_MIN, OPTION_MIN, OPTION_COVER };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QuizMatch = api;
})(typeof self !== 'undefined' ? self : this);
