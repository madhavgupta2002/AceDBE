'use client';
// One editable curriculum row in the interactive marks table (retake toggle, mark inputs, grade override).
import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { ParsedSubject } from '@/lib/marks/parseGrades';
import type { CgpaSubject } from '@/lib/cgpa/subjects';
import MarkInput from './MarkInput';
import { effectiveGrade, GRADE_COLOR_CLASSES } from './utils';

type SubjectRowProps = {
    subject: CgpaSubject;
    data: ParsedSubject | null;
    hasManualOverride: boolean;
    hasProjectCol: boolean;
    onUpdateField: (field: 'cla' | 'project' | 'final' | 'total', val: number | null, text?: string | null) => void;
    onUpdateGrade: (grade: string | null) => void;
    onToggleRetake: () => void;
    onResetRow: () => void;
};

const SubjectRow: React.FC<SubjectRowProps> = ({
    subject,
    data,
    hasManualOverride,
    hasProjectCol,
    onUpdateField,
    onUpdateGrade,
    onToggleRetake,
    onResetRow,
}) => {
    const effGrade = data ? effectiveGrade(data) : '';
    const gradeColor = GRADE_COLOR_CLASSES[effGrade] || 'text-slate-400';
    const locked = !!data?.gradeLocked;

    return (
        <tr
            className={`group border-t border-surface-border/40 transition-colors hover:bg-white/[0.02] ${
                hasManualOverride ? 'shadow-[inset_2px_0_0_rgba(56,189,248,0.6)]' : ''
            }`}
        >
            <td className="pl-3 pr-2 py-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className={data ? 'text-slate-200' : 'text-slate-400'}>{subject.name}</span>
                    {data?.hasRetake ? (
                        <button
                            type="button"
                            onClick={onToggleRetake}
                            title="Retake — click to unmark"
                            className="px-1.5 py-px text-[10px] font-medium rounded bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 cursor-pointer"
                        >
                            Retake
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onToggleRetake}
                            title="Mark as retake"
                            className="px-1.5 py-px text-[10px] rounded border border-dashed border-slate-600 text-slate-400 hover:text-amber-300 hover:border-amber-500/50 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                        >
                            Retake
                        </button>
                    )}
                    {hasManualOverride && (
                        <button
                            type="button"
                            onClick={onResetRow}
                            title="Undo your edits to this subject"
                            aria-label="Undo edits"
                            className="p-0.5 rounded text-sky-400/80 hover:text-sky-300 hover:bg-sky-500/10 cursor-pointer"
                        >
                            <RotateCcw className="w-3 h-3" />
                        </button>
                    )}
                </div>
                {subject.code && <div className="font-mono text-[10px] text-slate-400">{subject.code}</div>}
            </td>

            <td className="px-2 py-1.5 text-right font-mono tabular-nums text-[11px] text-slate-400 w-10">{subject.credits}</td>

            <td className="px-0.5 py-1 w-16">
                <MarkInput value={data?.cla} label="CLA (out of 25)" onCommit={(v) => onUpdateField('cla', v)} />
            </td>
            {hasProjectCol && (
                <td className="px-0.5 py-1 w-16">
                    <MarkInput value={data?.project} label="Project (out of 25)" onCommit={(v) => onUpdateField('project', v)} />
                </td>
            )}
            <td className="px-0.5 py-1 w-16">
                <MarkInput
                    value={data?.final}
                    text={data?.finalText}
                    allowAbsent
                    label="Final exam (out of 75) — type 'ab' for Absent"
                    onCommit={(v, t) => onUpdateField('final', v, t)}
                />
            </td>
            <td className="px-0.5 py-1 w-16">
                <MarkInput
                    value={data?.total}
                    bold
                    label="Total (out of 100) — calculated from the components, or enter directly"
                    onCommit={(v) => onUpdateField('total', v)}
                />
            </td>

            <td className="pl-1 pr-3 py-1 w-14">
                <select
                    value={locked ? data?.grade || '' : ''}
                    onChange={(e) => onUpdateGrade(e.target.value || null)}
                    title={locked ? 'Grade set manually — choose Auto to calculate from total' : 'Calculated from total — pick a letter to override'}
                    aria-label="Grade"
                    className={`w-full appearance-none text-center text-xs font-mono font-bold rounded-md py-1 bg-transparent cursor-pointer focus:outline-none border ${
                        locked ? 'border-sky-500/50' : 'border-transparent hover:border-surface-border'
                    } ${gradeColor}`}
                >
                    <option value="" className="bg-surface-dark text-slate-300">
                        {effGrade || '—'}
                    </option>
                    {(['O', 'A', 'B', 'C', 'D', 'E', 'F'] as const).map((g) => (
                        <option key={g} value={g} className="bg-surface-dark text-slate-200">
                            {g}
                        </option>
                    ))}
                </select>
            </td>
        </tr>
    );
};

export default SubjectRow;
