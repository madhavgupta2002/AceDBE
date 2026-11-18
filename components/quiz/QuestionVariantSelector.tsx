'use client';

import React, { useState } from 'react';
import type { Question } from '@/lib/types';
import { resolveQuestionVariant } from '@/lib/questionVariants';

/** Keep wording choices separate from the canonical questions used for grading and history. */
export function useQuestionVariant(question: Question) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const key = JSON.stringify([question.subjectCode, question.bankType, question.source, question.id, question.text]);
  const selectedVariantId = selections[key] ?? '';
  return {
    displayedQuestion: resolveQuestionVariant(question, selectedVariantId),
    selectedVariantId,
    onSelectVariant: (id: string) => setSelections(previous => ({ ...previous, [key]: id })),
  };
}

export default function QuestionVariantSelector({
  question,
  selectedVariantId,
  onSelectVariant,
}: {
  question: Question;
  selectedVariantId: string;
  onSelectVariant: (id: string) => void;
}) {
  if (!question.variants?.length) return null;
  const versions = [
    { id: '', label: question.variantLabel || 'Original' },
    ...question.variants,
  ];
  return (
    <div role="group" aria-label="Question version" className="flex flex-wrap items-center gap-1 rounded-lg border border-surface-border bg-surface-dark p-1">
      {versions.map(version => (
        <button
          key={version.id}
          type="button"
          aria-pressed={selectedVariantId === version.id}
          onClick={() => onSelectVariant(version.id)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            selectedVariantId === version.id
              ? 'bg-emerald-500/15 text-emerald-200'
              : 'text-slate-400 hover:bg-surface-light hover:text-white'
          }`}
        >
          {version.label}
        </button>
      ))}
    </div>
  );
}
