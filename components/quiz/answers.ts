/** Pure helpers shared by the quiz screens: question identity, answer grading, search and shuffling. */
import type { Question } from '@/lib/types';

/** Stable identity of a question across filtered and unfiltered lists. */
export const questionKey = (q: Pick<Question, 'text' | 'source' | 'id'>): string => `${q.text}-${q.source || ''}-${q.id}`;

/** True when `answer` is exactly the set of correct options. */
export const isAnswerCorrect = (answer: string[], q: Pick<Question, 'correctAnswer'>): boolean =>
  answer.length === q.correctAnswer.length && answer.every(a => q.correctAnswer.includes(a));

/** Case-insensitive match of `query` against a question's text or any option; an empty query matches all. */
export const matchesSearch = (q: Question, query: string): boolean => {
  if (!query) return true;
  const needle = query.toLowerCase();
  return (
    q.text.toLowerCase().includes(needle) ||
    !!(q.options && Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(needle)))
  );
};

/** Questions matching the module/source filters, with the learner's answers, score and incorrect list recomputed for them. */
export function applyQuestionFilters(
  allQuestions: Question[],
  masterAnswers: (string[] | null)[],
  module: string | number | 'all',
  source: string | 'all',
) {
  const questions = allQuestions.filter(q => {
    const moduleMatch = module === 'all' || q.module === module || q.module?.toString() === module.toString();
    const sourceMatch = source === 'all' || q.source === source;
    return moduleMatch && sourceMatch;
  });
  const keys = allQuestions.map(questionKey);
  const answers = questions.map(q => {
    const masterIndex = keys.indexOf(questionKey(q));
    return masterIndex !== -1 ? masterAnswers[masterIndex] : null;
  });
  let score = 0;
  const incorrect: Question[] = [];
  questions.forEach((q, index) => {
    const answer = answers[index];
    if (answer && answer.length > 0) {
      if (isAnswerCorrect(answer, q)) score++;
      else incorrect.push({ ...q, selectedAnswer: answer });
    }
  });
  return { questions, answers, score, incorrect };
}

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
