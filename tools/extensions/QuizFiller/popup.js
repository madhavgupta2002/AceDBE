const ta = document.getElementById('json'), log = document.getElementById('log');

async function runInFrames(func, args = []) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const results = await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, func, args });
  return results.flatMap(r => r.result || []);
}

document.getElementById('fill').onclick = async () => {
  let answers;
  try { answers = JSON.parse(ta.value); } catch (e) { log.textContent = 'Invalid JSON: ' + e.message; return; }
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
  try { await copyText(text); }
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
