import { Question } from './types';

interface PrintExamOptions {
  title: string;
  subjectCode: string;
  subjectName: string;
  examDate: string;
  questions: Question[];
  withAnswers: boolean;
}

export function printExamPaper({
  title,
  subjectCode,
  subjectName,
  examDate,
  questions,
  withAnswers,
}: PrintExamOptions) {
  if (questions.length === 0) {
    alert('No questions found to print.');
    return;
  }

  // Escape HTML tags while preserving LaTeX dollar delimiters for KaTeX auto-render
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const questionsHtml = questions
    .map((q, idx) => {
      const optionsHtml =
        !q.isSubjective && q.options
          ? Object.entries(q.options)
              .filter(([, val]) => val && val.trim() !== '')
              .map(([key, val]) => {
                const isCorrect = withAnswers && q.correctAnswer.includes(key);
                return `<div class="option ${isCorrect ? 'correct' : ''}"><span class="option-label">${key}.</span> ${escapeHtml(val)}</div>`;
              })
              .join('')
          : '<div class="subjective-space">_______________________________________</div>';

      const answerHtml =
        withAnswers && q.correctAnswer.length > 0
          ? `<div class="answer"><strong>Answer:</strong> ${q.correctAnswer.join(', ')}${
              q.explanation ? ' &mdash; ' + escapeHtml(q.explanation) : ''
            }</div>`
          : '';

      return `
        <div class="question-block">
          <div class="question-header">
            <span class="q-num">Q${idx + 1}.</span>
            <div class="q-content">${escapeHtml(q.text)}</div>
          </div>
          <div class="options">${optionsHtml}</div>
          ${answerHtml}
        </div>`;
    })
    .join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the question paper.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${subjectCode} (${examDate})</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
          font-size: 11px;
          line-height: 1.45;
          padding: 15mm 14mm;
          color: #111;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #222;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .header h1 {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-bottom: 3px;
        }
        .header .meta {
          font-size: 11px;
          font-weight: 600;
          color: #333;
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 2px;
        }
        .header .subtext {
          font-size: 9.5px;
          color: #555;
          margin-top: 4px;
        }
        .question-block {
          margin-bottom: 11px;
          page-break-inside: avoid;
        }
        .question-header {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 4px;
        }
        .q-num {
          font-weight: 700;
          font-size: 11px;
          color: #111;
          min-width: 24px;
        }
        .q-content {
          font-size: 11px;
          color: #111;
          flex: 1;
        }
        .options {
          margin-left: 28px;
          margin-bottom: 4px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2px;
        }
        .option {
          font-size: 10.5px;
          padding: 1px 4px;
          border-radius: 2px;
        }
        .option.correct {
          background: #d1fae5;
          color: #065f46;
          font-weight: 600;
        }
        .option-label {
          font-weight: 700;
          margin-right: 4px;
          display: inline-block;
          min-width: 14px;
        }
        .answer {
          margin-left: 28px;
          font-size: 10px;
          color: #065f46;
          background: #ecfdf5;
          border-left: 3px solid #10b981;
          padding: 3px 8px;
          border-radius: 0 4px 4px 0;
          margin-top: 3px;
        }
        .subjective-space {
          margin: 6px 0 6px 28px;
          color: #999;
          font-size: 10px;
        }
        .footer {
          position: fixed;
          bottom: 6mm;
          left: 14mm;
          right: 14mm;
          display: flex;
          justify-content: space-between;
          font-size: 8.5px;
          color: #777;
          border-top: 1px solid #ddd;
          padding-top: 3px;
        }
        /* KaTeX overrides for print */
        .katex { font-size: 1.05em; }
        .katex-display { margin: 4px 0; overflow-x: auto; }
        @media print {
          body { padding: 10mm 12mm; }
          .question-block { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${subjectName}</h1>
        <div class="meta">
          <span><strong>Course:</strong> ${subjectCode}</span>
          <span><strong>Exam Date:</strong> ${examDate}</span>
          <span><strong>Total Questions:</strong> ${questions.length}</span>
        </div>
        <div class="subtext">${withAnswers ? 'Question Paper &amp; Solutions' : 'Question Paper'}</div>
      </div>
      ${questionsHtml}
      <div class="footer">
        <span>AceDBE &bull; acedbe.in</span>
        <span>${subjectCode} - ${examDate}</span>
      </div>
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
  setTimeout(() => printWindow.print(), 1200);
}
