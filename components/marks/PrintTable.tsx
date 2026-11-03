'use client';
// Print-only marksheet: one A4 page per year, each term rendered as a plain black-on-white table.
import React from 'react';
import { effectiveGrade, formatDisplayMark, YEARS, type GpaStats, type TermGroup } from './utils';

function TermPrintTable({ group }: { group: TermGroup }) {
    const hasProjectCol =
        group.term === 5 ||
        group.rows.some((r) => r.data?.project !== null && r.data?.project !== undefined);

    const termTotalCredits = group.rows.reduce((sum, r) => sum + (r.subject.credits || 0), 0);
    const termEarnedCredits = group.earnedCredits;
    const scoredRows = group.rows.filter((r) => r.data?.total !== null && r.data?.total !== undefined);
    const termMarksScored = Math.round(scoredRows.reduce((sum, r) => sum + (r.data?.total ?? 0), 0) * 100) / 100;
    const termMarksMax = scoredRows.length * 100;

    return (
        <div className="w-full text-black">
            <table className="w-full border-collapse border border-black text-[11px] leading-tight bg-white">
            <caption className="sr-only">Term {group.term} marks</caption>
                <thead>
                    <tr className="border-b border-black">
                        <th
                            colSpan={hasProjectCol ? 6 : 5}
                            className="border border-black py-1 px-2 font-bold text-[11px] uppercase tracking-wider bg-white text-black"
                        >
                            <div className="flex items-center justify-between px-1">
                                <span>TERM-{group.term}</span>
                                <div className="flex items-center gap-2.5 text-[10px] normal-case font-normal text-neutral-800">
                                    <span>
                                        GPA: <strong className="font-bold font-mono text-black">{group.gpa === null ? '—' : group.gpa.toFixed(2)}</strong>
                                    </span>
                                    <span className="text-neutral-300">|</span>
                                    <span>
                                        Percentage: <strong className="font-bold font-mono text-black">{group.percentage === null ? '—' : `${group.percentage.toFixed(2)}%`}</strong>
                                    </span>
                                    <span className="text-neutral-300">|</span>
                                    <span>
                                        Credits: <strong className="font-bold font-mono text-black">{termEarnedCredits} / {termTotalCredits}</strong>
                                    </span>
                                    {scoredRows.length > 0 && (
                                        <>
                                            <span className="text-neutral-300">|</span>
                                            <span>
                                                Marks: <strong className="font-bold font-mono text-black">{termMarksScored} / {termMarksMax}</strong>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr className="border-b border-black font-bold text-center bg-white text-black text-[11px]">
                        <th className="border border-black py-1.5 px-3 text-left font-bold w-[45%]">Subject</th>
                        <th className="border border-black py-1.5 px-2 text-center font-bold w-[12%] whitespace-nowrap">CLA (25)</th>
                        {hasProjectCol && (
                            <th className="border border-black py-1.5 px-2 text-center font-bold w-[12%] whitespace-nowrap">Project (25)</th>
                        )}
                        <th className="border border-black py-1.5 px-2 text-center font-bold w-[15%] whitespace-nowrap">Final Exam (75)</th>
                        <th className="border border-black py-1.5 px-2 text-center font-bold w-[14%] whitespace-nowrap">Total (100)</th>
                        <th className="border border-black py-1.5 px-2 text-center font-bold w-[10%] whitespace-nowrap">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {group.rows.map((r, i) => {
                        const d = r.data;
                        const isProjectBasedSingleMark =
                            !hasProjectCol &&
                            (d?.cla === null || d?.cla === undefined) &&
                            (d?.final !== null || d?.total !== null) &&
                            /project based/i.test(r.subject.name);

                        const subjectDisplayName = d?.hasRetake ? `${r.subject.name}*` : r.subject.name;

                        return (
                            <tr key={i} className="border-b border-black text-black">
                                <td className="border border-black py-1.5 px-3 text-left font-normal">
                                    {subjectDisplayName}
                                </td>

                                {isProjectBasedSingleMark ? (
                                    <td colSpan={2} className="border border-black py-1.5 px-2 text-center font-normal">
                                        {formatDisplayMark(d?.final ?? d?.total)}
                                    </td>
                                ) : (
                                    <>
                                        <td className="border border-black py-1.5 px-2 text-center font-normal">
                                            {d?.cla !== null && d?.cla !== undefined ? formatDisplayMark(d?.cla) : ''}
                                        </td>

                                        {hasProjectCol && (
                                            <td className="border border-black py-1.5 px-2 text-center font-normal">
                                                {d?.project !== null && d?.project !== undefined ? formatDisplayMark(d?.project) : '-'}
                                            </td>
                                        )}

                                        <td className="border border-black py-1.5 px-2 text-center font-normal">
                                            {d?.finalText || (d?.final !== null && d?.final !== undefined ? formatDisplayMark(d?.final) : '')}
                                        </td>
                                    </>
                                )}

                                <td className="border border-black py-1.5 px-2 text-center font-normal">
                                    {d?.total !== null && d?.total !== undefined ? formatDisplayMark(d?.total) : ''}
                                </td>

                                <td className="border border-black py-1.5 px-2 text-center font-normal">
                                    {d ? effectiveGrade(d) : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

type PrintTableProps = {
    termGroups: TermGroup[];
    studentName: string;
    batch: string | number;
    overall: GpaStats;
    totalCurriculumCredits: number;
    overallMarksStats: { earned: number; max: number };
};

export default function PrintTable({ termGroups, studentName, batch, overall, totalCurriculumCredits, overallMarksStats }: PrintTableProps) {
    return (
        <div className="hidden print:block bg-white text-black font-sans w-full">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm 14mm 12mm 14mm;
                    }
                    html, body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print-page-year {
                        page-break-after: always;
                        break-after: page;
                        page-break-inside: avoid;
                        break-inside: avoid;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        min-height: 260mm;
                        box-sizing: border-box;
                        padding-bottom: 5mm;
                    }
                    .print-page-year:last-child {
                        page-break-after: auto;
                        break-after: auto;
                    }
                }
            `}} />

            {YEARS.map((year) => {
                const groupsForYear = termGroups.filter((g) => year.terms.includes(g.term));

                return (
                    <div key={year.year} className="print-page-year space-y-6">
                        {/* Top Header on Print */}
                        <div className="border-b-2 border-black pb-2 mb-2 flex items-center justify-between text-black">
                            <div>
                                <div className="text-sm font-bold tracking-wider uppercase">Statement of Marks</div>
                                <div className="text-[10px] text-neutral-700 font-medium">
                                    {studentName ? `${studentName} · ` : ''}Batch {batch} · {year.label}
                                </div>
                            </div>
                            <div className="flex items-center gap-5 text-right">
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">CGPA</span>
                                    <span className="text-sm font-extrabold font-mono text-black">
                                        {overall.gpa === null ? '—' : overall.gpa.toFixed(2)}
                                    </span>
                                </div>
                                <div className="h-6 w-px bg-neutral-300" />
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Percentage (WAM)</span>
                                    <span className="text-sm font-extrabold font-mono text-black">
                                        {overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%`}
                                    </span>
                                </div>
                                <div className="h-6 w-px bg-neutral-300" />
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Total Credits</span>
                                    <span className="text-sm font-extrabold font-mono text-black">
                                        {overall.earnedCredits} <span className="text-[10px] text-neutral-600 font-normal">/ {totalCurriculumCredits}</span>
                                    </span>
                                </div>
                                <div className="h-6 w-px bg-neutral-300" />
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Total Marks</span>
                                    <span className="text-sm font-extrabold font-mono text-black">
                                        {overallMarksStats.max > 0 ? (
                                            <span>
                                                {overallMarksStats.earned}{' '}
                                                <span className="text-[10px] text-neutral-600 font-normal">/ {overallMarksStats.max}</span>
                                            </span>
                                        ) : (
                                            '—'
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {groupsForYear.map((group) => <TermPrintTable key={group.term} group={group} />)}
                        </div>

                        <div className="mt-auto pt-3 text-[10px] text-slate-800 flex items-center justify-between">
                            <span>* Denotes Retake</span>
                            <span>Page {year.year} of 3</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
