const ta = document.getElementById('json'), log = document.getElementById('log');

async function runInFrames(func, args = []) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const results = await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, func, args });
  return results.flatMap(r => r.result || []);
}

// Auto answers from the AceDBE repo; anything typed in the textbox overrides per question.
document.getElementById('fill').onclick = async () => {
  let override = {};
  if (ta.value.trim()) {
    try { override = JSON.parse(ta.value); } catch (e) { log.textContent = 'Invalid JSON: ' + e.message; return; }
  }
  const answers = { ...auto, ...override };
  if (!Object.keys(answers).length) { log.textContent = 'No detected answers and nothing pasted.'; return; }
  const res = await runInFrames(fillAnswers, [answers]);
  const total = res.reduce((t, r) => t + r.total, 0), done = res.reduce((t, r) => t + r.selected, 0);
  if (!total) { log.textContent = 'No questions found on this page.'; return; }
  const lines = res.flatMap(r => r.lines).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  log.textContent = `${done} of ${total} questions option selected\n\n` + lines.join('\n');
};

document.getElementById('submit').onclick = async () => {
  if (!confirm('Submit ALL questions on this page? This uses your attempts and cannot be undone.')) return;
  log.textContent = 'Submitting…';
  const lines = await runInFrames(submitAll);
  log.textContent = lines.length ? lines.join('\n') + `\nDone — ${lines.length} submitted.` : 'No submit buttons found.';
};

// Clipboard API can fail in popups; fall back to execCommand.
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
}

async function questionsText() {
  const qs = (await runInFrames(extractQuestions)).sort((a, b) => a.n - b.n);
  if (!qs.length) { log.textContent = 'No questions found on this page.'; return null; }
  return { count: qs.length, body: qs.map(q => (q.context ? `[Context for Q${q.n}]\n${q.context}\n\n` : '') + `Q${q.n}. ${q.text}${q.multi ? ' (select ALL that apply)' : ''}\n` +
    q.options.map((o, i) => `  ${String.fromCharCode(97 + i)}) ${o}`).join('\n')).join('\n\n') };
}

document.getElementById('copyq').onclick = async () => {
  const q = await questionsText();
  if (!q) return;
  await copyText(q.body);
  log.textContent = `Copied ${q.count} question(s).`;
};

document.getElementById('copy').onclick = async () => {
  const q = await questionsText();
  if (!q) return;
  await copyText(`You are an expert answering a multiple-choice quiz. For each question below, think carefully step by step, research or recall the relevant concepts, and verify your reasoning before choosing.

After your reasoning, output the final answers as a single JSON object on its own, in exactly this format:
- keys are question numbers as strings
- values are the option letter (e.g. "b"); for "select ALL that apply" questions use an array of letters (e.g. ["a","c"])

Example: {"1":"b","2":"d","3":["a","c"]}

Questions:

${q.body}`);
  log.textContent = `Copied LLM prompt with ${q.count} question(s).`;
};

// ---- Auto-detection: subject from URL, module by best match, answers by string match ----

const REPO = 'https://api.github.com/repos/madhavgupta2002/AceDBE/contents/public/data/Subjects';
const status = document.getElementById('status');
let auto = {};          // { "3": ["b"] } letters refer to the options as ordered on the page

const words = s => String(s).toLowerCase().replace(/[^a-z0-9₹%.]+/g, ' ').split(' ').filter(w => w.length > 1);
function sim(a, b) {   // Dice coefficient over word sets
  const A = new Set(words(a)), B = new Set(words(b));
  if (!A.size || !B.size) return 0;
  let n = 0; A.forEach(w => B.has(w) && n++);
  return 2 * n / (A.size + B.size);
}

async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); }

// Cached for 6h so the GitHub API (60 req/h unauthenticated) isn't hit on every open.
async function loadSubject(code) {
  const key = 'cla_' + code, c = (await chrome.storage.local.get(key))[key];
  if (c && Date.now() - c.t < 6 * 3600e3) return c.data;
  const folders = (await getJSON(REPO)).filter(f => f.type === 'dir' && (f.name === code || f.name.startsWith(code + '_')));
  const data = { name: code, questions: [] };
  for (const f of folders) {
    for (const dir of ['CLA', 'Exam']) {   // CLA/MT-style quizzes also reuse exam questions
      let files = [];
      try { files = await getJSON(`${REPO}/${encodeURIComponent(f.name)}/${dir}`); } catch { continue; }
      for (const file of files.filter(x => /\.json$/i.test(x.name))) {
        const j = await getJSON(file.download_url);
        data.name = j.exam_metadata?.subject_name || data.name;
        (j.questions || []).forEach(q => !q.is_passage && q.options && Object.values(q.options).some(Boolean) && q.correct_option_label &&
          data.questions.push({ ...q, src: `${f.name}/${dir}/${file.name}` }));
      }
    }
  }
  await chrome.storage.local.set({ [key]: { t: Date.now(), data } });
  return data;
}

async function detect() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // The quiz lives in iframe#unit-iframe: its src carries the course id, its title is e.g. "3.8.1 CLA - 3".
    const info = await runInFrames(() => { const f = document.getElementById('unit-iframe'); return [{ href: location.href, src: f?.src, title: f?.title }]; });
    const urls = [...info.map(i => i.src), tab.url, ...info.map(i => i.href)].filter(Boolean).map(u => { try { return decodeURIComponent(u); } catch { return u; } });
    const code = urls.map(u => (u.match(/[+:/]([A-Z]{2}\d{2}x)[+_/]/) || [])[1]).find(Boolean);
    const batch = urls.map(u => (u.match(/\+[^+/]*_B(\d)\b/) || [])[1]).find(Boolean);
    const title = info.map(i => i.title).find(Boolean) || tab.title || '';
    const hintMod = (title.match(/CLA\s*-?\s*(\d+)/i) || [])[1];
    if (!code) { status.textContent = 'No subject code in URL — paste answers manually.'; return; }
    status.textContent = `Detected ${code}, loading answers…`;
    const [subj, qs] = await Promise.all([loadSubject(code), runInFrames(extractQuestions)]);
    if (!subj.questions.length) { status.textContent = `${code}: no CLA answers in repo yet.`; return; }
    if (!qs.length) { status.textContent = `${subj.name} (${code}) — no questions on this page.`; return; }
    const best = (q, pool) => pool.reduce((b, k) => { const s = sim(q.text + ' ' + q.options.join(' '), k.question_text + ' ' + Object.values(k.options).join(' ')); return s > b.s ? { s, k } : b; }, { s: 0 });
    // Module = the one whose questions best match this page as a whole.
    const groups = {};
    subj.questions.forEach(k => (groups[`${k.src}|${k.module}`] ??= []).push(k));
    let cands = Object.entries(groups);
    if (hintMod) { const only = cands.filter(([g]) => g.includes('/CLA/') && g.endsWith('|' + hintMod)); if (only.length) cands = only; }
    const score = ([g, pool]) => qs.reduce((t, q) => t + best(q, pool).s, 0) * (batch && (g.split('/')[0].endsWith('_B' + batch) || g.includes('Batch ' + batch)) ? 1.1 : 1);
    const [gid, pool] = cands.sort((a, b) => score(b) - score(a))[0];
    auto = {}; const lines = [];
    for (const q of qs) {
      const { s, k } = best(q, pool);
      if (!k || s < 0.5) { lines.push(`Q${q.n}: ? no confident match`); continue; }
      const labels = String(k.correct_option_label).split(/[,\s]+/).filter(l => k.options[l]);
      const idx = labels.map(l => q.options.map((o, i) => [sim(o, k.options[l]) + (o.trim() === k.options[l].trim()), i]).sort((a, b) => b[0] - a[0])[0][1]);
      if (!idx.length) { lines.push(`Q${q.n}: ? no answer key`); continue; }
      auto[q.n] = idx.map(i => String.fromCharCode(97 + i));
      lines.push(`Q${q.n}: ${auto[q.n].join(',')}  (${Math.round(s * 100)}% match)`);
    }
    const [src, mod] = gid.split('|');
    status.textContent = `${subj.name} (${code}${batch ? ' B' + batch : ''}) · ${title ? title + ' · ' : ''}Module ${mod} · ${Object.keys(auto).length}/${qs.length} matched\n[${src}]`;
    log.textContent = lines.join('\n');
  } catch (e) { status.textContent = 'Auto-detect failed: ' + e.message; }
}

document.getElementById('hl').onclick = async () => {
  if (!Object.keys(auto).length) { log.textContent = 'Nothing detected to highlight.'; return; }
  const n = (await runInFrames(highlight, [auto])).reduce((a, b) => a + b, 0);
  log.textContent = `Highlighted ${n} option(s). Selection unchanged.`;
};

detect();

// ---- Functions below run inside each page frame (must be self-contained) ----


// Accepts answers keyed by question number; value may be a letter (a-d),
// a 1-based index, (part of) the option text, or an array of these.
function fillAnswers(answers) {
  const norm = s => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const out = []; let selected = 0;
  const problems = [...document.querySelectorAll('.problem, .xblock-student_view-problem')]
    .filter(p => p.querySelector('input[type=radio], input[type=checkbox]'))
    .filter((p, _, all) => !all.some(o => o !== p && p.contains(o)));
  problems.forEach((p, i) => {
    const header = p.closest('.xblock')?.querySelector('h3, .problem-header') || p.querySelector('h3');
    const m = header && header.textContent.match(/Question\s*(\d+)/i);
    const qn = m ? m[1] : String(i + 1);
    const ans = answers[qn] ?? answers['Q' + qn];
    if (ans == null) { out.push(`Q${qn}: — not in JSON`); return; }
    const inputs = [...p.querySelectorAll('input[type=radio], input[type=checkbox]')];
    const labelOf = inp => norm((inp.closest('label') || p.querySelector(`label[for="${inp.id}"]`) || inp.parentElement).textContent);
    const picked = [];
    for (const a of (Array.isArray(ans) ? ans : [ans])) {
      const s = String(a).trim();
      let idx;
      if (/^[a-z]$/i.test(s)) idx = s.toLowerCase().charCodeAt(0) - 97;
      else if (/^\d+$/.test(s)) idx = Number(s) - 1;
      else {
        const t = norm(s);
        idx = inputs.findIndex(inp => labelOf(inp) === t);
        if (idx < 0) idx = inputs.findIndex(inp => labelOf(inp).includes(t));
      }
      const inp = inputs[idx];
      if (!inp) { out.push(`Q${qn}: ✗ no match for "${s}"`); continue; }
      if (!inp.checked) inp.click();   // fires edX change handlers; nothing is submitted
      picked.push(`${String.fromCharCode(97 + idx)}) ${labelOf(inp).slice(0, 60)}`);
    }
    if (picked.length) { selected++; out.push(`Q${qn}: ✓ ${picked.join(' | ')}`); }
  });
  return { total: problems.length, selected, lines: out };
}

function highlight(answers) {
  let n = 0;
  const problems = [...document.querySelectorAll('.problem, .xblock-student_view-problem')]
    .filter(p => p.querySelector('input[type=radio], input[type=checkbox]'))
    .filter((p, _, all) => !all.some(o => o !== p && p.contains(o)));
  problems.forEach((p, i) => {
    const header = p.closest('.xblock')?.querySelector('h3, .problem-header') || p.querySelector('h3');
    const m = header && header.textContent.match(/Question\s*(\d+)/i);
    const inputs = [...p.querySelectorAll('input[type=radio], input[type=checkbox]')];
    const labelEl = inp => inp.closest('label') || p.querySelector(`label[for="${inp.id}"]`) || inp.parentElement;
    inputs.forEach(inp => labelEl(inp).style.removeProperty('outline'));
    for (const l of answers[m ? m[1] : String(i + 1)] || []) {
      const inp = inputs[l.charCodeAt(0) - 97];
      if (!inp) continue;
      Object.assign(labelEl(inp).style, { outline: '3px solid #22c55e', background: 'rgba(34,197,94,.15)', borderRadius: '4px' });
      n++;
    }
  });
  return [n];
}

// Also captures shared context (e.g. a data table in an HTML block placed before
// the question, or inside the problem itself) and renders tables as rows.
function extractQuestions() {
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const textOf = el => {
    const c = el.cloneNode(true);
    c.querySelectorAll('style, script, noscript, template').forEach(e => e.remove());
    const w = document.createTreeWalker(c, NodeFilter.SHOW_COMMENT), cm = [];
    while (w.nextNode()) cm.push(w.currentNode);
    cm.forEach(n => n.remove());
    c.querySelectorAll('table').forEach(t => {
      const rows = [...t.querySelectorAll('tr')].map(r => [...r.querySelectorAll('th,td')].map(x => norm(x.textContent)).join(' | '));
      t.replaceWith(document.createTextNode('\n' + rows.join('\n') + '\n'));
    });
    c.querySelectorAll('p, div, li, br, h1, h2, h3, h4').forEach(e => e.after(document.createTextNode('\n')));
    return c.textContent.replace(/<!--[\s\S]*?-->/g, '').split('\n').map(norm).filter(Boolean).join('\n');
  };
  const isProblem = el => el.querySelector('input[type=radio], input[type=checkbox]');
  // Blocks in document order: problem xblocks and HTML (text) xblocks.
  let blocks = [...document.querySelectorAll('.xblock-student_view-problem, .xblock-student_view-html')]
    .filter((p, _, all) => !all.some(o => o !== p && p.contains(o)));
  if (!blocks.some(isProblem)) // fallback when xblock wrappers are absent
    blocks = [...document.querySelectorAll('.problem')].filter(isProblem);
  const out = []; let context = []; let i = 0;
  for (const blk of blocks) {
    if (!isProblem(blk)) { const t = textOf(blk); if (t) context.push(t); continue; }
    const p = blk.querySelector('.problem') || blk;
    const header = blk.querySelector('h3, .problem-header');
    const m = header && header.textContent.match(/Question\s*(\d+)/i);
    const inputs = [...p.querySelectorAll('input[type=radio], input[type=checkbox]')];
    const options = inputs.map(inp => norm((inp.closest('label') || p.querySelector(`label[for="${inp.id}"]`) || inp.parentElement).textContent));
    const clone = p.cloneNode(true);
    clone.querySelectorAll('.field, .choicegroup label, button, .action, .notification, .problem-progress, .sr, .status').forEach(e => e.remove());
    clone.querySelectorAll('h3, .problem-header').forEach(e => e.remove());
    const text = textOf(clone).replace(/\d+(\.\d+)? points? possible.*$/im, '').trim();
    out.push({ n: m ? m[1] : String(++i), context: context.join('\n'), text, options, multi: inputs[0]?.type === 'checkbox' });
    if (m) i = Number(m[1]);
    context = [];
  }
  return out;
}

// Clicks each problem's enabled Submit button in page order (Q1 first),
// each ~0.5s after the previous plus a random 0-300ms variation.
async function submitAll() {
  const btns = [...document.querySelectorAll('.problem button.submit, .problem .submit-attempt-container button')]
    .filter((b, i, a) => !b.disabled && a.indexOf(b) === i);
  const out = [];
  for (let i = 0; i < btns.length; i++) {
    await new Promise(r => setTimeout(r, 500 + Math.floor(Math.random() * 300)));
    btns[i].click();
    out.push(`Submitted ${i + 1}/${btns.length}`);
  }
  return out;
}
