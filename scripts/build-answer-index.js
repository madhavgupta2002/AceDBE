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
        // Separate index entries let older extensions match every wording too.
        // The website still loads one question; variants share its answer labels.
        const versions = [
          { label: q.variant_label, question_text: q.question_text, options: q.options },
          ...(q.variants || []).map(variant => ({
            ...variant,
            options: variant.options ?? q.options,
          })),
        ];
        for (const version of versions) {
          const options = version.options;
          const labels = String(q.correct_option_label || '').split(/[,\s]+/).filter((l) => options[l]);
          if (!version.question_text || !labels.length || !Object.values(options).some(Boolean)) continue;
          entries.push({
            c: code, n: name, s: `${folder}/${dir}/${file.replace(/\.json$/, '')}`, m: q.module ?? '',
            q: version.question_text, o: options, a: labels.join(','),
            ...(version.label ? { v: version.label } : {}),
          });
        }
      }
    }
  }
}
fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${entries.length} searchable versions, ${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB)`);
