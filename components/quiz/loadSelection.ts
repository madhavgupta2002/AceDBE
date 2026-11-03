/** Loads the questions for a quiz-picker selection (sets x modules, optionally shuffled) and derives filter options. */
import type { Question } from '@/lib/types';
import { loadQuestions, compareModules } from '@/lib/questionLoader';
import { shuffleArray } from './answers';

export interface QuizSelection {
  sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }>;
  randomOrder: boolean;
}

/** Returns the flattened questions, or null when the selection matched nothing. */
export async function loadSelectedQuestions(subjectCode: string, selection: QuizSelection): Promise<Question[] | null> {
  const loadedSets = await Promise.all(
    selection.sets.map(set => loadQuestions(set.bankType, subjectCode, set.bankName))
  );
  const questionsBySet: Question[][] = [];

  selection.sets.forEach((set, i) => {
    // An empty modules array means "every question of this set"
    const filtered = set.modules.length === 0
      ? loadedSets[i]
      : loadedSets[i].filter(q => set.modules.includes(q.module || ''));
    if (filtered.length > 0) questionsBySet.push(filtered);
  });

  if (questionsBySet.length === 0) return null;
  if (!selection.randomOrder) return questionsBySet.flat();
  // Shuffle the order of sets, then the questions inside each set
  return shuffleArray(questionsBySet).map(setQuestions => shuffleArray(setQuestions)).flat();
}

export const listModules = (questions: Question[]): (string | number)[] =>
  (Array.from(new Set(questions.map(q => q.module).filter(Boolean))) as (string | number)[]).sort(compareModules);

export const listSources = (questions: Question[], sorted = true): string[] => {
  const sources = Array.from(new Set(questions.map(q => q.source).filter(Boolean))) as string[];
  return sorted ? sources.sort() : sources;
};
