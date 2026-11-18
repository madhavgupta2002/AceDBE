import type { Question } from './types';

/** Resolve wording only; identity, correct answers and scoring always belong to the parent. */
export function resolveQuestionVariant(question: Question, variantId: string): Question {
  const variant = question.variants?.find(item => item.id === variantId);
  if (!variant) return question;
  return {
    ...question,
    text: variant.text,
    options: variant.options ?? question.options,
    explanation: variant.explanation ?? question.explanation,
  };
}
