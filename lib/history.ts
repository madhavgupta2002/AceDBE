// Quiz attempt history, saved to Supabase for signed-in users (see supabase/schema.sql).
import type { Question } from './types';
import { supabase } from './supabase';

export type AttemptMode = 'practice' | 'cbt';

/** "CLA|<bank>" or "Exam|<bank>": one question set. Each module of a set is one history unit. */
export const setKey = (bankType: string, bankName: string) => `${bankType}|${bankName}`;

export interface AttemptUnit {
  key: string;
  set: string;
  module: string; // '' when the set has no modules
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
}

export interface Attempt {
  id: string;
  mode: AttemptMode;
  set_keys: string[];
  units: AttemptUnit[];
  correct: number;
  wrong: number;
  total: number;
  time_sec: number;
  created_at: string;
}

const isCorrect = (q: Question, a: string[]) =>
  a.length === q.correctAnswer.length && a.every(x => q.correctAnswer.includes(x));

/** Saves a finished quiz when signed in. Subjective questions are left out of the scores. */
export async function saveAttempt(opts: {
  subjectCode: string;
  mode: AttemptMode;
  questions: Question[];
  answers: (string[] | null)[]; // aligned with questions
  setOf: (q: Question) => string | undefined;
  timeSec: number;
}) {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;

  const units = new Map<string, AttemptUnit>();
  const answers: Record<string, string[]> = {};
  let answeredAny = false;

  opts.questions.forEach((q, i) => {
    const set = opts.setOf(q);
    if (!set || q.isSubjective) return;
    const mod = q.module == null ? '' : String(q.module);
    const key = `${set}|${mod}`;
    const unit = units.get(key) ?? { key, set, module: mod, correct: 0, wrong: 0, unanswered: 0, total: 0 };
    units.set(key, unit);
    unit.total++;
    const a = opts.answers[i];
    if (!a?.length) {
      unit.unanswered++;
      return;
    }
    answeredAny = true;
    answers[`${q.source ?? ''}::${q.id}`] = a;
    if (isCorrect(q, a)) unit.correct++;
    else unit.wrong++;
  });

  if (!answeredAny) return;
  const list = Array.from(units.values());
  const { error } = await supabase.from('quiz_attempts').insert({
    subject_code: opts.subjectCode,
    mode: opts.mode,
    set_keys: Array.from(new Set(list.map(u => u.set))),
    units: list,
    correct: list.reduce((n, u) => n + u.correct, 0),
    wrong: list.reduce((n, u) => n + u.wrong, 0),
    total: list.reduce((n, u) => n + u.total, 0),
    time_sec: Math.round(opts.timeSec),
    answers,
  });
  if (error) console.error('Saving quiz attempt failed:', error.message);
}

/** Set keys of this subject that have at least one saved attempt (for showing History buttons). */
export async function fetchSetsWithHistory(subjectCode: string): Promise<Set<string>> {
  if (!supabase) return new Set();
  const { data, error } = await supabase.from('quiz_attempts').select('set_keys').eq('subject_code', subjectCode);
  if (error) return new Set();
  return new Set((data ?? []).flatMap(r => r.set_keys as string[]));
}

/** Attempts that included the given set, newest first. */
export async function fetchSetHistory(subjectCode: string, set: string): Promise<Attempt[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, mode, set_keys, units, correct, wrong, total, time_sec, created_at')
    .eq('subject_code', subjectCode)
    .contains('set_keys', [set])
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Loading quiz history failed:', error.message);
    return [];
  }
  return data as Attempt[];
}
