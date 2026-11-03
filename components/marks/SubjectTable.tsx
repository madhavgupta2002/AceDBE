'use client';
// Interactive marks tables: a collapsible card per term with editable SubjectRows, plus the unmatched-subjects list.
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ParsedSubject } from '@/lib/marks/parseGrades';
import type { CgpaSubject } from '@/lib/cgpa/subjects';
import SubjectRow from './SubjectRow';
import { effectiveGrade, fmt, type TermGroup } from './utils';

type SubjectTableProps = {
    termGroups: TermGroup[];
    unmatched: ParsedSubject[];
    filledCount: number;
    onUpdateField: (subject: CgpaSubject, field: 'cla' | 'project' | 'final' | 'total', val: number | null, text?: string | null) => void;
    onUpdateGrade: (subjectId: string, grade: string | null) => void;
    onToggleRetake: (subjectId: string) => void;
    onResetRow: (subjectId: string) => void;
};

export default function SubjectTable({ termGroups, unmatched, filledCount, onUpdateField, onUpdateGrade, onToggleRetake, onResetRow }: SubjectTableProps) {
    const [termOpen, setTermOpen] = useState<Record<number, boolean>>({});

    return (
        <div className="space-y-2">
            {termGroups.map((group) => {
                const hasProjectCol =
                    group.term === 5 ||
                    group.rows.some((r) => r.data?.project !== null && r.data?.project !== undefined);
                const gradedCount = group.rows.filter((r) => r.data !== null).length;
                const termTotalCredits = group.rows.reduce((sum, r) => sum + (r.subject.credits || 0), 0);
                const scoredRows = group.rows.filter((r) => r.data?.total !== null && r.data?.total !== undefined);
                const termMarksScored = Math.round(scoredRows.reduce((sum, r) => sum + (r.data?.total ?? 0), 0) * 100) / 100;
                // Terms with marks start open; if nothing is graded yet, show every term for manual entry
                const isOpen = termOpen[group.term] ?? (gradedCount > 0 || filledCount === 0);

                return (
                    <div key={group.term} className="rounded-lg border border-surface-border/50 overflow-hidden bg-surface-dark/20">
                        <button
                            type="button"
                            onClick={() => setTermOpen((prev) => ({ ...prev, [group.term]: !isOpen }))}
                            aria-expanded={isOpen}
                            className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2.5 text-left hover:bg-surface-dark/40 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                                <span className="text-sm font-semibold text-slate-100">Term {group.term}</span>
                                <span className="text-[11px] text-slate-400">
                                    {gradedCount}/{group.rows.length} graded
                                </span>
                            </span>
                            <span aria-live="polite" className="flex items-baseline gap-3 text-[11px] text-slate-400 font-mono tabular-nums">
                                {group.percentage !== null && <span>{group.percentage.toFixed(2)}%</span>}
                                <span>
                                    {group.earnedCredits}/{termTotalCredits} cr
                                </span>
                                {scoredRows.length > 0 && (
                                    <span className="hidden sm:inline">
                                        {termMarksScored}/{scoredRows.length * 100}
                                    </span>
                                )}
                                <span className="text-slate-400">
                                    GPA{' '}
                                    <span className={`text-sm font-bold ${group.gpa === null ? 'text-slate-400' : 'text-emerald-300'}`}>
                                        {group.gpa === null ? '—' : group.gpa.toFixed(2)}
                                    </span>
                                </span>
                            </span>
                        </button>

                        {isOpen && (
                            <div className="overflow-x-auto border-t border-surface-border/40">
                                <table className="w-full text-xs min-w-[540px]">
                                    <caption className="sr-only">Term {group.term} subjects and marks</caption>
                                    <thead>
                                        <tr className="text-[10px] text-slate-400">
                                            <th scope="col" className="pl-3 pr-2 py-1.5 text-left font-medium">Subject</th>
                                            <th scope="col" className="px-2 py-1.5 text-right font-medium">Cr</th>
                                            <th scope="col" className="px-2 py-1.5 text-right font-medium">
                                                CLA <span className="text-slate-400">/25</span>
                                            </th>
                                            {hasProjectCol && (
                                                <th scope="col" className="px-2 py-1.5 text-right font-medium">
                                                    Proj <span className="text-slate-400">/25</span>
                                                </th>
                                            )}
                                            <th scope="col" className="px-2 py-1.5 text-right font-medium">
                                                Final <span className="text-slate-400">/75</span>
                                            </th>
                                            <th scope="col" className="px-2 py-1.5 text-right font-medium">
                                                Total <span className="text-slate-400">/100</span>
                                            </th>
                                            <th scope="col" className="pl-1 pr-3 py-1.5 text-center font-medium">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.rows.map((r) => (
                                            <SubjectRow
                                                key={r.subject.id}
                                                subject={r.subject}
                                                data={r.data}
                                                hasManualOverride={r.hasManualOverride}
                                                hasProjectCol={hasProjectCol}
                                                onUpdateField={(field, val, text) => onUpdateField(r.subject, field, val, text)}
                                                onUpdateGrade={(grade) => onUpdateGrade(r.subject.id, grade)}
                                                onToggleRetake={() => onToggleRetake(r.subject.id)}
                                                onResetRow={() => onResetRow(r.subject.id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Unmatched Subjects Section (from Scraping) */}
            {unmatched.length > 0 && (
                <div className="rounded-lg border border-amber-500/30 overflow-hidden">
                    <div className="bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
                        Unmatched Subjects ({unmatched.length}) · not part of standard curriculum
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[420px]">
                                <caption className="sr-only">Unmatched subjects</caption>
                            <tbody>
                                {unmatched.map((s, i) => (
                                    <tr key={i} className="border-t border-surface-border/30">
                                        <td className="px-3 py-1.5 text-slate-300">
                                            {s.hasRetake ? `*${s.name}` : s.name}
                                            {s.hasRetake && <span className="ml-1.5 text-[9px] text-amber-500/70">(retake)</span>}
                                        </td>
                                        <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums w-14">{fmt(s.cla)}</td>
                                        <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums w-14">{s.finalText || fmt(s.final)}</td>
                                        <td className="px-2 py-1.5 text-slate-100 text-right tabular-nums font-semibold w-14">{fmt(s.total)}</td>
                                        <td className="px-2 py-1.5 text-center font-bold text-slate-200 w-10">{effectiveGrade(s) || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
