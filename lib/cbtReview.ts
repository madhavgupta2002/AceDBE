// Hand-off of a finished CBT exam to the regular quiz review (QuizApp's completed view).
import type { DigionResult } from './digionConnector';
import { cbtAnswers } from './digionConnector';

const KEY = 'acedbe-cbt-review';

export interface CbtReviewData {
  bankName: string;
  answers: Record<string, string[]>; // question id -> chosen option labels
  timeSec: number;
}

export function toReviewData(bankName: string, result: DigionResult): CbtReviewData {
  return { bankName, answers: cbtAnswers(result), timeSec: Math.round(result.totalTimeSpentSec) };
}

export function stashCbtReview(data: CbtReviewData) {
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

/** Reads (and clears) a stashed review for this bank, if any. */
export function takeCbtReview(bankName: string): CbtReviewData | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const data = JSON.parse(raw) as CbtReviewData;
    return data.bankName === bankName ? data : null;
  } catch {
    return null;
  }
}
