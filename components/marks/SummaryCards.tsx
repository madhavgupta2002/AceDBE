// Overall CGPA / percentage / credits / marks tiles plus the "N of M graded" progress line.
import React from 'react';
import type { GpaStats } from './utils';

type SummaryCardsProps = {
    overall: GpaStats;
    totalCurriculumCredits: number;
    overallMarksStats: { earned: number; max: number };
    filledCount: number;
    totalSubjects: number;
    unmatchedCount: number;
};

export default function SummaryCards({ overall, totalCurriculumCredits, overallMarksStats, filledCount, totalSubjects, unmatchedCount }: SummaryCardsProps) {
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" aria-live="polite">
                {[
                    { label: 'CGPA', value: overall.gpa === null ? '—' : overall.gpa.toFixed(2), accent: true },
                    { label: 'Percentage', value: overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%` },
                    { label: 'Credits earned', value: String(overall.earnedCredits), of: totalCurriculumCredits },
                    { label: 'Total marks', value: overallMarksStats.max > 0 ? String(overallMarksStats.earned) : '—', of: overallMarksStats.max || undefined },
                ].map((t) => (
                    <div
                        key={t.label}
                        className={`rounded-lg border px-3 py-2.5 ${t.accent ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-surface-border/60 bg-surface-dark/40'}`}
                    >
                        <div className={`text-[11px] ${t.accent ? 'text-emerald-400/90' : 'text-slate-400'}`}>{t.label}</div>
                        <div className={`mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums ${t.accent ? 'text-emerald-300' : 'text-slate-100'}`}>
                            {t.value}
                            {t.of !== undefined && <span className="ml-1 text-xs font-normal text-slate-400">/ {t.of}</span>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                <div className="h-1 w-24 rounded-full bg-surface-dark overflow-hidden">
                    <div
                        className="h-full bg-emerald-500/70"
                        style={{ width: `${totalSubjects ? (filledCount / totalSubjects) * 100 : 0}%` }}
                    />
                </div>
                <span>
                    {filledCount} of {totalSubjects} subjects graded
                </span>
                {unmatchedCount > 0 && <span className="text-amber-400">· {unmatchedCount} unmatched, excluded from CGPA</span>}
            </div>
        </>
    );
}
