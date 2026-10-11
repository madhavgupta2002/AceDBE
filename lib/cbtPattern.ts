// Resolves the pattern a CBT exam runs with. Papers with an official `exam_pattern` use it; every other
// Exam bank gets a generic one built from its objective questions, so any exam can be taken as a CBT.
import type { ExamPattern, QuestionFile } from './types';

const isObjective = (q: QuestionFile['questions'][number]) =>
  q.question_type !== 'SUBJECTIVE' && !!q.correct_option_label && Object.values(q.options ?? {}).some(Boolean);

/** Generic pattern: one global-timer section with every objective question, 1 mark each, no negative marking. */
export function defaultExamPattern(file: QuestionFile): ExamPattern | undefined {
  const ids = file.questions.filter(isObjective).map((q) => String(q.question_id));
  if (ids.length === 0) return undefined;
  const multi = file.questions.some((q) => isObjective(q) && (q.correct_option_label ?? '').includes(','));
  return {
    exam_name: `${file.exam_metadata?.subject_name ?? 'Practice'} (practice pattern)`,
    duration_min: Math.max(15, Math.ceil(ids.length * 1.5)),
    total_marks: ids.length,
    total_questions: ids.length,
    negative_marking: false,
    calculator: 'standard',
    timing_mode: 'global',
    reference_materials: [],
    instructions: ['No official exam pattern is recorded for this paper, so a standard practice pattern is used: 1 mark per question, no negative marking.'],
    sections: [
      {
        name: 'Section 1',
        question_type: multi ? 'MCQ_MSQ' : 'MCQ',
        num_questions: ids.length,
        marks_per_question: 1,
        question_ids: ids,
      },
    ],
  };
}

export function resolveExamPattern(file: QuestionFile): { pattern: ExamPattern; official: boolean } | undefined {
  const official = file.exam_metadata?.exam_pattern;
  if (official && official.sections?.some((s) => (s.question_ids?.length ?? 0) > 0)) return { pattern: official, official: true };
  const pattern = defaultExamPattern(file);
  return pattern ? { pattern, official: false } : undefined;
}
