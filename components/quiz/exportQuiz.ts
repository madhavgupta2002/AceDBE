/**
 * Quiz export helpers: download the current question set as the app's JSON quiz format, or open a
 * print-ready window (with KaTeX auto-render) for paper / PDF.
 */
import type { Question } from '@/lib/types';

/** Downloads `questions` as `<subjectCode>-quiz-<date>.json` in the predefined quiz file format. */
export function downloadQuizJson(questions: Question[], subjectCode: string, subjectName: string) {
  if (questions.length === 0) return;

  const exportData = {
    exam_metadata: {
      subject_name: subjectName,
      exam_date: new Date().toISOString().slice(0, 10),
    },
    questions: questions.flatMap((q, index) => {
      const entries: Record<string, unknown>[] = [];
      // A passage is exported once, as its own entry just before the first question that uses it.
      if (q.passage && !questions.slice(0, index).some(p => p.passage?.id === q.passage!.id)) {
        entries.push({
          question_id: q.passage.id,
          question_text: q.passage.text,
          question_type: 'SUBJECTIVE',
          is_passage: true,
          options: { A: '', B: '', C: '', D: '' },
          correct_option_label: '',
          module: q.module,
        });
      }
      entries.push({
        question_id: q.id || `Q${index + 1}`,
        question_text: q.text,
        ...(q.passage ? { passage_id: q.passage.id } : {}),
        question_type: q.isSubjective ? 'Subjective' : 'MCQ',
        options: q.options || { A: '', B: '', C: '', D: '' },
        correct_option_label: q.correctAnswer.length > 0 ? q.correctAnswer.join(',') : null,
        module: q.module,
        explanation: q.explanation || '',
      });
      return entries;
    }),
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `${subjectCode}-quiz-${new Date().toISOString().slice(0, 10)}.json`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Opens a print window for `questions`, optionally with answers and explanations. */
export function printQuiz(questions: Question[], title: string, withAnswers: boolean) {
  if (questions.length === 0) return;
  const uniqueSources = Array.from(new Set(questions.map(q => q.source).filter(Boolean))) as string[];

  // Helper: escape HTML tags but preserve LaTeX dollar-sign delimiters for KaTeX auto-render
  const escapeHtml = (str: string) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const questionsHtml = questions.map((q, idx) => {
    const optionsHtml = !q.isSubjective && q.options
      ? Object.entries(q.options)
        .filter(([, val]) => val && val.trim() !== '')
        .map(([key, val]) => {
          const isCorrect = withAnswers && q.correctAnswer.includes(key);
          return `<div class="option ${isCorrect ? 'correct' : ''}"><span class="option-label">${key}.</span> ${escapeHtml(val)}</div>`;
        }).join('')
      : '<div class="subjective-space">_______________________________________</div>';

    const answerHtml = withAnswers && q.correctAnswer.length > 0
      ? `<div class="answer">Answer: ${q.correctAnswer.join(', ')}${q.explanation ? ' — ' + escapeHtml(q.explanation) : ''}</div>`
      : '';

    return `
      <div class="question-block">
        ${q.passage && !questions.slice(0, idx).some(p => p.passage?.id === q.passage!.id)
          ? `<div class="passage"><strong>Passage</strong> (Q${idx + 1}${q.passage.total > 1 ? ' onwards' : ''})<br>${escapeHtml(q.passage.text)}</div>`
          : ''}
        <div class="question-text"><strong>Q${idx + 1}.</strong> ${escapeHtml(q.text)}</div>
        <div class="options">${optionsHtml}</div>
        ${answerHtml}
      </div>`;
  }).join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - Quiz</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 1.4; padding: 15mm 12mm; color: #000; background: #fff; }
        h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
        .sources { text-align: center; font-size: 11px; font-weight: 600; color: #333; margin-bottom: 3px; }
        .subtitle { text-align: center; font-size: 10px; color: #555; margin-bottom: 12px; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
        .passage { background: #f3f3f3; border-left: 3px solid #999; padding: 6px 8px; margin: 0 0 6px; font-size: 0.95em; white-space: pre-wrap; }
        .question-block { margin-bottom: 10px; page-break-inside: avoid; }
        .question-text { margin-bottom: 4px; font-size: 11px; }
        .options { margin-left: 16px; margin-bottom: 3px; }
        .option { margin-bottom: 2px; font-size: 10.5px; padding: 1px 4px; border-radius: 2px; }
        .option.correct { background: #d4edda; font-weight: 600; }
        .option-label { font-weight: 600; margin-right: 4px; }
        .answer { font-size: 10px; color: #155724; background: #d4edda; padding: 2px 6px; border-radius: 2px; margin-top: 2px; }
        .subjective-space { margin: 4px 0; color: #999; font-size: 10px; }
        .footer { position: fixed; bottom: 6mm; right: 8mm; font-size: 8px; color: #aaa; }
        /* KaTeX overrides for print */
        .katex { font-size: 1em; }
        .katex-display { margin: 4px 0; overflow-x: auto; }
        @media print {
          body { padding: 10mm 10mm; }
          .question-block { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${uniqueSources.length > 0 ? `<div class="sources">${uniqueSources.join(' &bull; ')}</div>` : ''}
      <div class="subtitle">${questions.length} Questions${withAnswers ? ' (With Answers)' : ''}</div>
      ${questionsHtml}
      <div class="footer">acedbe.in</div>
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"><\/script>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          renderMathInElement(document.body, {
            delimiters: [
              {left: "$$", right: "$$", display: true},
              {left: "$", right: "$", display: false},
              {left: "\\\\(", right: "\\\\)", display: false},
              {left: "\\\\[", right: "\\\\]", display: true}
            ],
            throwOnError: false
          });
        });
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  // Wait longer for KaTeX JS to load and render math before triggering print
  setTimeout(() => printWindow.print(), 1500);
}
