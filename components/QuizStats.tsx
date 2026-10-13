'use client';

import React from 'react';

interface QuizStatsProps {
  score: number;
  totalQuestions: number;
  answeredQuestions: (string[] | null)[];
  size?: 'compact' | 'large';
}

const QuizStats: React.FC<QuizStatsProps> = ({
  score,
  totalQuestions,
  answeredQuestions,
  size = 'compact',
}) => {
  const attempted = answeredQuestions.filter((answer) => answer !== null).length;
  const incorrect = attempted - score;
  const unattempted = totalQuestions - attempted;
  const accuracy = attempted > 0 ? (score / attempted) * 100 : 0;
  const completionPercentage = totalQuestions > 0 ? (attempted / totalQuestions) * 100 : 0;
  const pct = (n: number) => (totalQuestions > 0 ? (n / totalQuestions) * 100 : 0);

  // Correct / incorrect segments; the empty remainder is what's left to answer
  const progressBar = (
    <div className="h-1.5 rounded-full bg-surface-dark overflow-hidden flex" aria-hidden>
      <div className="bg-emerald-500/80 transition-all" style={{ width: `${pct(score)}%` }} />
      <div className="bg-red-500/70 transition-all" style={{ width: `${pct(incorrect)}%` }} />
    </div>
  );

  if (size === 'large') {
    const tiles = [
      { label: 'Attempted', value: attempted },
      { label: 'Correct', value: score, cls: 'text-emerald-400' },
      { label: 'Incorrect', value: incorrect, cls: 'text-red-400' },
      { label: 'Completion', value: `${completionPercentage.toFixed(1)}%` },
      { label: 'Accuracy', value: `${accuracy.toFixed(1)}%` },
      { label: 'Remaining', value: unattempted },
    ];
    return (
      <div className="bg-surface border border-surface-border/60 rounded-xl p-4">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {tiles.map((t) => (
            <div key={t.label}>
              <div className="text-xs text-slate-400">{t.label}</div>
              <div className={`text-lg font-semibold tabular-nums ${t.cls ?? 'text-white'}`}>{t.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">{progressBar}</div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-surface-border/60 rounded-xl px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs tabular-nums">
        <span className="text-slate-400">
          <span className="font-semibold text-white">{attempted}</span>/{totalQuestions} answered
          <span className="text-slate-600"> · </span>
          {completionPercentage.toFixed(0)}%
        </span>
        <span className="flex flex-wrap items-center gap-x-3">
          <span className="text-emerald-400">{score} correct</span>
          <span className="text-red-400">{incorrect} wrong</span>
          <span className="text-slate-400">{accuracy.toFixed(1)}% accuracy</span>
          <span className="text-slate-500">{unattempted} left</span>
        </span>
      </div>
      <div className="mt-2">{progressBar}</div>
    </div>
  );
};

export default QuizStats;
