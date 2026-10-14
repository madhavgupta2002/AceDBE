// Connector to the Digion exam engine (a separate deployment, default https://digion-engine.vercel.app).
// It turns a PYQ Exam bank + its `exam_metadata.exam_pattern` into the engine's ExamConfig, starts the exam
// through the engine's embed.js SDK, and resolves with the engine's result when the candidate submits.
// Client-side only.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import type { ExamPattern, ExamPatternSection, IIMBQuestion, QuestionFile } from './types';
import { resolveExamPattern } from './cbtPattern';

export const DIGION_ENGINE_URL = (
  process.env.NEXT_PUBLIC_DIGION_ENGINE_URL || 'https://digion-engine.vercel.app'
).replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Engine types (the subset AceDBE needs; full definitions live in the engine's src/types.ts)
// ---------------------------------------------------------------------------

export interface DigionQuestionResult {
  id: string;
  number: number;
  type: 'MCQ' | 'MSQ' | 'TITA';
  status: 'notVisited' | 'notAnswered' | 'answered' | 'marked' | 'answeredMarked';
  response: string[] | string | null;
  evaluated: boolean;
  timeSpentSec: number;
  correct?: boolean | null;
  marksAwarded?: number;
}

export interface DigionScore {
  marks: number;
  maxMarks: number;
  correct: number;
  incorrect: number;
  unattempted: number;
}

export interface DigionSectionResult {
  id: string;
  name: string;
  timeSpentSec: number;
  counts: { total: number; answered: number; notAnswered: number; notVisited: number; marked: number; answeredMarked: number };
  score?: DigionScore;
  questions: DigionQuestionResult[];
}

export interface DigionResult {
  examId: string;
  title: string;
  submitReason: 'manual' | 'timeout' | null;
  totalTimeSpentSec: number;
  score?: DigionScore;
  sections: DigionSectionResult[];
}

interface TcsExamSdk {
  start(options: { config: unknown; mode?: 'popup' | 'iframe'; engineUrl?: string; onProgress?: (r: DigionResult) => void }): Promise<DigionResult>;
  cancel(): void;
}

declare global {
  interface Window {
    TcsExam?: TcsExamSdk;
  }
}

// ---------------------------------------------------------------------------
// Loading the SDK
// ---------------------------------------------------------------------------

let sdkPromise: Promise<TcsExamSdk> | null = null;

/** Injects `<engine>/embed.js` once. Safe to call early (e.g. on mount) to warm up. */
export function loadDigionSdk(): Promise<TcsExamSdk> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Digion SDK is browser-only'));
  if (window.TcsExam) return Promise.resolve(window.TcsExam);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<TcsExamSdk>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = `${DIGION_ENGINE_URL}/embed.js`;
    el.async = true;
    el.onload = () => (window.TcsExam ? resolve(window.TcsExam) : reject(new Error('Exam engine SDK did not initialise')));
    el.onerror = () => {
      sdkPromise = null;
      reject(new Error(`Could not reach the exam engine at ${DIGION_ENGINE_URL}`));
    };
    document.head.appendChild(el);
  });
  return sdkPromise;
}

// ---------------------------------------------------------------------------
// Markdown / LaTeX -> HTML (the engine renders HTML; KaTeX CSS is loaded by the engine page)
// ---------------------------------------------------------------------------

// Same preprocessing as QuizQuestion: literal "\n", and currency "$" must not start a math span.
function prepareMarkdown(text: string): string {
  let processed = text.replace(/\\n/g, '\n');
  const mathBlocks: string[] = [];
  processed = processed.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
    mathBlocks.push(match);
    return `\x00MATH${mathBlocks.length - 1}\x00`;
  });
  processed = processed.replace(/\$\s*(?=[0-9_])/g, '\\$');
  return processed.replace(/\x00MATH(\d+)\x00/g, (_, i) => mathBlocks[parseInt(i, 10)]);
}

const mdProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify);

function markdownToHtml(text: string): string {
  if (!text) return '';
  // The engine runs on another origin, so site-relative image paths (![](/data/...)) must be made absolute.
  return String(mdProcessor.processSync(prepareMarkdown(text))).replace(
    /src="\/(?!\/)/g,
    `src="${window.location.origin}/`
  );
}

const IMG_PLACEHOLDER = 'PARSEIMAGE';

/** Renders text, replacing each PARSEIMAGE placeholder (in order) with an <img> that uses an absolute URL. */
function richHtml(text: string | undefined, images: string[]): string {
  if (!text) return '';
  if (!text.includes(IMG_PLACEHOLDER)) return markdownToHtml(text);
  const parts = text.split(IMG_PLACEHOLDER);
  let html = '';
  parts.forEach((part, i) => {
    if (part.trim()) html += markdownToHtml(part);
    const src = i < parts.length - 1 ? images[i] : undefined;
    if (src) html += `<img src="${window.location.origin}${src}" alt="" style="max-width:100%;height:auto;display:block;margin:8px 0" />`;
  });
  return html;
}

async function fetchImages(subjectCode: string, bankName: string, questionId: string): Promise<string[]> {
  const params = new URLSearchParams({ subjectCode, bankType: 'Exam', bankName, questionId });
  try {
    const res = await fetch(`/api/question-image?${params.toString()}`);
    return res.ok ? ((await res.json()).images ?? []) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Pattern + bank -> engine config
// ---------------------------------------------------------------------------

export interface CbtPaperRef {
  subjectCode: string;
  subjectName: string;
  bankName: string; // file name without .json
  examDate: string;
}

export interface BuiltCbtExam {
  config: Record<string, unknown>;
  pattern: ExamPattern;
}

const questionsOf = (s: ExamPatternSection) => s.question_ids ?? [];

/** Answers given in a finished CBT exam, keyed by question id (option labels). Unanswered questions are left out. */
export function cbtAnswers(result: DigionResult): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const sec of result.sections) {
    for (const q of sec.questions) {
      const r = Array.isArray(q.response) ? q.response : q.response ? [q.response] : [];
      if (r.length) out[q.id] = r;
    }
  }
  return out;
}

function labelsOf(q: IIMBQuestion): string[] {
  return (q.correct_option_label ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function buildCbtExam(paper: CbtPaperRef, file: QuestionFile, candidateName: string): Promise<BuiltCbtExam> {
  const pattern = resolveExamPattern(file)?.pattern;
  if (!pattern) throw new Error('This paper has no objective questions, so it cannot be opened as a CBT exam.');

  const byId = new Map<string, IIMBQuestion>();
  file.questions.forEach((q) => byId.set(String(q.question_id), q));

  const cbtSections = pattern.sections.filter((s) => questionsOf(s).length > 0);
  if (cbtSections.length === 0) throw new Error('This paper has no computer-based questions.');

  // Marks per question when the notice does not state it: spread the total evenly.
  const fallbackMarks = pattern.total_questions > 0 ? pattern.total_marks / pattern.total_questions : 1;
  const sectional = pattern.timing_mode === 'sectional' && cbtSections.every((s) => (s.duration_min ?? 0) > 0);
  const calcType = pattern.calculator === 'scientific' ? 'scientific' : 'standard';

  // Resolve images for all questions that need them, in parallel.
  const needImage = (q: IIMBQuestion) =>
    [q.question_text, q.explanation, q.explaination, ...Object.values(q.options ?? {})].some((t) => t?.includes(IMG_PLACEHOLDER));
  const allIds = cbtSections.flatMap((s) => [
    ...questionsOf(s),
    ...(s.context_blocks ?? []).map((b) => b.context_question_id),
    ...questionsOf(s).map((id) => byId.get(id)?.passage_id ?? ''),
  ]).filter(Boolean);
  const imageMap = new Map<string, string[]>();
  await Promise.all(
    allIds.map(async (id) => {
      const q = byId.get(id);
      if (q && needImage(q)) imageMap.set(id, await fetchImages(paper.subjectCode, paper.bankName, id));
    })
  );

  const sections = cbtSections.map((sec, si) => {
    const marks = sec.marks_per_question ?? fallbackMarks;
    const negative =
      sec.negative_marks_per_question ??
      (pattern.negative_marking && pattern.negative_marks_fraction ? marks * pattern.negative_marks_fraction : 0);

    // Shared passages: a question's `passage_id`, or the pattern's older `context_blocks` link.
    const contextFor = new Map<string, string>(); // question id -> passage entry id
    (sec.context_blocks ?? []).forEach((b) => b.applies_to.forEach((qid) => contextFor.set(qid, b.context_question_id)));
    questionsOf(sec).forEach((qid) => {
      const pid = byId.get(qid)?.passage_id;
      if (pid && byId.has(pid)) contextFor.set(qid, pid);
    });
    const passageIds = Array.from(new Set(contextFor.values()));
    const passages = passageIds.map((ctxId) => {
      const ctx = byId.get(ctxId);
      return { id: `ctx-${ctxId}`, directions: '', html: richHtml(ctx?.question_text?.replace(/([^\n|])\n(?![\n|\-*\d])/g, '$1  \n'), imageMap.get(ctxId) ?? []) };
    });

    const questions = questionsOf(sec).map((id) => {
      const q = byId.get(id);
      if (!q) throw new Error(`Pattern refers to question ${id} which is missing from the bank.`);
      const labels = labelsOf(q);
      const isMsq = sec.question_type === 'MSQ' || labels.length > 1;
      const imgs = imageMap.get(id) ?? [];
      const options = Object.entries(q.options ?? {})
        .filter(([, v]) => v && v.trim() !== '')
        .map(([key, v]) => ({ id: key, html: richHtml(v, imgs) }));

      return {
        id,
        type: isMsq ? 'MSQ' : 'MCQ',
        html: richHtml(q.question_text, imgs),
        options,
        ...(contextFor.has(id) ? { passageId: `ctx-${contextFor.get(id)}` } : {}),
        ...(labels.length ? { answer: isMsq ? labels : labels[0] } : {}),
        ...(sec.max_selections && isMsq ? { maxSelections: sec.max_selections } : {}),
      };
    });

    return {
      id: `s${si + 1}`,
      name: sec.name,
      ...(sectional ? { durationSec: Math.round((sec.duration_min ?? 0) * 60) } : {}),
      marks,
      negativeMarks: negative,
      titaNegativeMarks: 0,
      ...(sec.msq_scoring ? { msqScoring: sec.msq_scoring } : {}),
      ...(pattern.calculator === 'none' ? { calculator: false } : { calculatorType: calcType }),
      ...(passages.length ? { passages } : {}),
      questions,
    };
  });

  const notes = [
    ...pattern.instructions,
    ...(pattern.reference_materials.length ? [`Reference material for this paper: ${pattern.reference_materials.join(', ')}.`] : []),
    ...cbtSections.filter((s) => s.note).map((s) => `${s.name}: ${s.note}`),
    ...(pattern.sections.some((s) => questionsOf(s).length === 0)
      ? ['The written (subjective) part of the original paper is not part of this computer-based practice.']
      : []),
  ];

  const config = {
    id: `acedbe-${paper.subjectCode}-${paper.bankName}-${Date.now()}`.replace(/\s+/g, '_'),
    title: `${paper.subjectName} - ${paper.examDate}`,
    candidate: { name: candidateName || 'AceDBE Student' },
    timing: sectional
      ? { mode: 'sectional' as const }
      : { mode: 'global' as const, totalDurationSec: Math.round(pattern.duration_min * 60) },
    sections,
    features: { calculator: pattern.calculator !== 'none', calculatorType: calcType, showResultSummary: true },
    instructions: { notes },
    output: { postMessage: true, localStorage: false },
  };

  return { config, pattern };
}

/** Starts the exam in a full-screen overlay and resolves with the engine's result when it is submitted. */
export async function startCbtExam(
  built: BuiltCbtExam,
  hooks?: { onProgress?: (r: DigionResult) => void }
): Promise<DigionResult> {
  const sdk = await loadDigionSdk();
  return sdk.start({ config: built.config, mode: 'iframe', engineUrl: DIGION_ENGINE_URL, onProgress: hooks?.onProgress });
}

export function cancelCbtExam() {
  window.TcsExam?.cancel();
}
