// Builds public/data/answer-index.json: every answerable MCQ from all CLA/ and Exam/ banks in one file,
// used by the QuizFiller extension to match quiz questions. Runs before `next build`.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'data', 'Subjects');
const OUT = path.join(__dirname, '..', 'public', 'data', 'answer-index.json');
const entries = [];

for (const folder of fs.readdirSync(ROOT).sort()) {
  const code = folder.split('_')[0];
  for (const dir of ['CLA', 'Exam']) {
    const dirPath = path.join(ROOT, folder, dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath).filter((f) => f.endsWith('.json')).sort()) {
      let data;
      try { data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8')); } catch { continue; }
      const name = data.exam_metadata?.subject_name || code;
      for (const q of data.questions || []) {
        if (q.is_passage || !q.options || !q.question_text) continue;
        const labels = String(q.correct_option_label || '').split(/[,\s]+/).filter((l) => q.options[l]);
        if (!labels.length || !Object.values(q.options).some(Boolean)) continue;
        entries.push({
          c: code, n: name, s: `${folder}/${dir}/${file.replace(/\.json$/, '')}`, m: q.module ?? '',
          q: q.question_text, o: q.options, a: labels.join(','),
        });
      }
    }
  }
}
fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${entries.length} questions, ${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB)`);
