'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Bookmark,
    ChevronDown,
    ClipboardPaste,
    Copy,
    Pencil,
    Printer,
    RotateCcw,
    Trash2,
    User,
} from 'lucide-react';
import { parseGrades, parsePastedText, detectBatchFromText, type RawRow, type ParsedSubject } from '@/lib/marks/parseGrades';
import { gradePoints, gradeFromTotal, type LetterGrade } from '@/lib/cgpa/grades';
import { CGPA_TERMS, getSubjectsForTerm, type CgpaSubject } from '@/lib/cgpa/subjects';
import { useBatch, AVAILABLE_BATCHES } from '@/contexts/BatchContext';

const MOODLE_LOGIN_URL = 'https://moodle.iimb.ac.in/portal/';
const MOODLE_GRADE_URL = 'https://moodle.iimb.ac.in/grade/report/user/index.php?id=6211';

const STORAGE_KEY_ROWS = 'ace_dbe_moodle_rows_v1';
const STORAGE_KEY_MANUAL = 'ace_dbe_manual_marks_v1';
const STORAGE_KEY_NAME = 'ace_dbe_student_name_v1';

export type ManualSubjectMark = {
    cla?: number | null;
    project?: number | null;
    final?: number | null;
    finalText?: string | null;
    total?: number | null;
    grade?: string | null;
    hasRetake?: boolean;
    manualGradeLock?: boolean;
};

function extractStudentName(text: string): string | null {
    if (!text) return null;
    const m = text.match(/(?:[A-Z]{2}\r?\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    if (m) return m[1].trim();
    const m2 = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\r?\n[A-Z]{2}/);
    if (m2) return m2[1].trim();
    return null;
}

function buildBookmarklet(origin: string): string {
    const src = `(function(){try{var rows=document.querySelectorAll('table.user-grade tr,#user-grade tr,.user-grade tr');var out=[];rows.forEach(function(tr){var nameEl=tr.querySelector('.column-itemname,th.column-itemname,.gradeitemheader,th.item');var gradeEl=tr.querySelector('.column-grade,td.column-grade');var name=nameEl?nameEl.textContent.replace(/\\s+/g,' ').trim():'';var grade=gradeEl?gradeEl.textContent.replace(/\\s+/g,' ').trim():'';if(name)out.push({n:name,g:grade});});if(!out.length){alert('No grade rows found. Open your Moodle \"User report\" grade page first, then click this bookmark.');return;}var d=btoa(unescape(encodeURIComponent(JSON.stringify(out))));window.open('${origin}/marks#import='+d,'_blank');}catch(e){alert('Marks import failed: '+e.message);}})();`;
    return `javascript:${src}`;
}

function decodeImport(hash: string): RawRow[] | null {
    const match = hash.match(/import=([^&]+)/);
    if (!match) return null;
    try {
        const json = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) return parsed as RawRow[];
        return null;
    } catch {
        return null;
    }
}

const fmt = (v: number | null) => (v === null ? '—' : v.toFixed(2));

function formatDisplayMark(val: number | null | undefined): string {
    if (val === null || val === undefined) return '';
    if (Number.isNaN(val)) return '';
    if (Number.isInteger(val)) return String(val);
    const rounded = Math.round(val * 100) / 100;
    return String(rounded);
}

// Effective grade points for a subject: a manually picked grade always wins; otherwise
// prefer derived grade if retake exists or initial was F with valid total
function pointsFor(s: ParsedSubject): number | null {
    if (s.gradeLocked && gradePoints(s.grade) !== null) return gradePoints(s.grade);
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).points;
    }
    const fromLetter = gradePoints(s.grade);
    if (fromLetter !== null) return fromLetter;
    if (s.total !== null) return gradeFromTotal(s.total).points;
    return null;
}

function effectiveGrade(s: ParsedSubject): string {
    if (s.gradeLocked && s.grade && gradePoints(s.grade) !== null) return s.grade.trim().toUpperCase();
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).letter;
    }
    if (s.grade && gradePoints(s.grade) !== null) return s.grade.trim().toUpperCase();
    if (s.total !== null) return gradeFromTotal(s.total).letter;
    return '';
}

// Credit-weighted GPA and Percentage (WAM) across the given subjects.
function gpaFor(subjects: ParsedSubject[]): {
    gpa: number | null;
    percentage: number | null;
    credits: number;
    earnedCredits: number; // credits from passed (non-F) subjects only
    totalPoints: number;
    wamCredits: number;
} {
    let weightedPoints = 0;
    let credits = 0;
    let earnedCredits = 0;
    let weightedMarks = 0;
    let wamCredits = 0;

    for (const s of subjects) {
        const cr = s.match?.credits ?? 0;
        if (cr === 0) continue;

        const pts = pointsFor(s);
        if (pts !== null) {
            weightedPoints += pts * cr;
            credits += cr;
            if (pts > 0) earnedCredits += cr;
        }

        if (s.total !== null && !Number.isNaN(s.total)) {
            weightedMarks += s.total * cr;
            wamCredits += cr;
        }
    }

    return {
        gpa: credits > 0 ? weightedPoints / credits : null,
        percentage: wamCredits > 0 ? weightedMarks / wamCredits : null,
        credits: credits > 0 ? credits : wamCredits,
        earnedCredits,
        totalPoints: weightedPoints,
        wamCredits,
    };
}

const YEARS = [
    { year: 1, label: 'Year 1 (Terms 1, 2, 3)', terms: [1, 2, 3] },
    { year: 2, label: 'Year 2 (Terms 4, 5, 6)', terms: [4, 5, 6] },
    { year: 3, label: 'Year 3 (Terms 7, 8, 9)', terms: [7, 8, 9] },
];

const GRADE_COLOR_CLASSES: Record<string, string> = {
    O: 'text-emerald-400 font-bold',
    A: 'text-sky-400 font-bold',
    B: 'text-indigo-300 font-bold',
    C: 'text-amber-300 font-bold',
    D: 'text-orange-400 font-bold',
    E: 'text-rose-400 font-bold',
    F: 'text-red-500 font-bold',
};

// ── Interactive Editable Subject Row Component ─────────────────────────────
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
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [claText, setClaText] = useState<string>(formatDisplayMark(data?.cla));
    const [projectText, setProjectText] = useState<string>(formatDisplayMark(data?.project));
    const [finalText, setFinalText] = useState<string>(data?.finalText || formatDisplayMark(data?.final));
    const [totalText, setTotalText] = useState<string>(formatDisplayMark(data?.total));

    useEffect(() => {
        if (focusedField !== 'cla') setClaText(formatDisplayMark(data?.cla));
    }, [data?.cla, focusedField]);

    useEffect(() => {
        if (focusedField !== 'project') setProjectText(formatDisplayMark(data?.project));
    }, [data?.project, focusedField]);

    useEffect(() => {
        if (focusedField !== 'final') setFinalText(data?.finalText || formatDisplayMark(data?.final));
    }, [data?.final, data?.finalText, focusedField]);

    useEffect(() => {
        if (focusedField !== 'total') setTotalText(formatDisplayMark(data?.total));
    }, [data?.total, focusedField]);

    const effGrade = data ? effectiveGrade(data) : '';
    const gradeColor = GRADE_COLOR_CLASSES[effGrade] || 'text-slate-400';

    return (
        <tr className={`border-t border-surface-border/30 transition-colors group hover:bg-surface-dark/30 ${hasManualOverride ? 'bg-sky-950/10' : ''}`}>
            {/* Subject Name & Details */}
            <td className="px-3 py-2 text-left">
                <div className="flex flex-wrap items-center gap-1.5">
                    {subject.code && (
                        <span className="font-mono text-[10px] text-slate-400 bg-surface-dark/80 px-1.5 py-0.5 rounded border border-surface-border/50 select-none">
                            {subject.code}
                        </span>
                    )}
                    <span className={`font-medium ${data ? 'text-slate-200' : 'text-slate-400'}`}>
                        {data?.hasRetake ? `*${subject.name}` : subject.name}
                    </span>

                    {/* Retake Badge / Button */}
                    {data?.hasRetake ? (
                        <button
                            type="button"
                            onClick={onToggleRetake}
                            title="Click to remove retake status"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors cursor-pointer"
                        >
                            * Retake
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onToggleRetake}
                            title="Mark as retake"
                            className="opacity-0 group-hover:opacity-100 px-1 py-0.5 text-[9px] font-medium rounded text-slate-500 hover:text-amber-300 hover:bg-amber-500/10 transition-all cursor-pointer"
                        >
                            + Retake
                        </button>
                    )}

                    {/* Reset row button if manually modified */}
                    {hasManualOverride && (
                        <button
                            type="button"
                            onClick={onResetRow}
                            title="Reset manual changes for this subject"
                            className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[9px] rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span className="text-[8px] uppercase tracking-wider">Reset</span>
                        </button>
                    )}
                </div>
            </td>

            {/* Credits */}
            <td className="px-2 py-2 text-slate-400 text-right tabular-nums font-mono text-[11px] w-12">
                {subject.credits}
            </td>

            {/* CLA (/25) */}
            <td className="px-1.5 py-1 text-right w-16">
                <input
                    type="text"
                    inputMode="decimal"
                    value={claText}
                    placeholder="—"
                    onFocus={() => setFocusedField('cla')}
                    onBlur={() => {
                        setFocusedField(null);
                        setClaText(formatDisplayMark(data?.cla));
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        setClaText(val);
                        if (!val.trim()) {
                            onUpdateField('cla', null);
                        } else {
                            const num = parseFloat(val);
                            if (Number.isFinite(num)) onUpdateField('cla', num);
                        }
                    }}
                    className="w-full px-1.5 py-1 text-right text-xs font-mono tabular-nums rounded bg-surface-dark/50 hover:bg-surface-dark/80 focus:bg-surface-dark border border-surface-border/40 focus:border-sky-500/80 text-slate-200 focus:text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                    title="Continuous Learning Assessment (out of 25)"
                />
            </td>

            {/* Project (/25) - if applicable */}
            {hasProjectCol && (
                <td className="px-1.5 py-1 text-right w-16">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={projectText}
                        placeholder="—"
                        onFocus={() => setFocusedField('project')}
                        onBlur={() => {
                            setFocusedField(null);
                            setProjectText(formatDisplayMark(data?.project));
                        }}
                        onChange={(e) => {
                            const val = e.target.value;
                            setProjectText(val);
                            if (!val.trim()) {
                                onUpdateField('project', null);
                            } else {
                                const num = parseFloat(val);
                                if (Number.isFinite(num)) onUpdateField('project', num);
                            }
                        }}
                        className="w-full px-1.5 py-1 text-right text-xs font-mono tabular-nums rounded bg-surface-dark/50 hover:bg-surface-dark/80 focus:bg-surface-dark border border-surface-border/40 focus:border-sky-500/80 text-slate-200 focus:text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                        title="Course Project (out of 25)"
                    />
                </td>
            )}

            {/* Final Exam (/75) */}
            <td className="px-1.5 py-1 text-right w-16">
                <input
                    type="text"
                    inputMode="decimal"
                    value={finalText}
                    placeholder="—"
                    onFocus={() => setFocusedField('final')}
                    onBlur={() => {
                        setFocusedField(null);
                        setFinalText(data?.finalText || formatDisplayMark(data?.final));
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFinalText(val);
                        if (!val.trim()) {
                            onUpdateField('final', null, null);
                        } else if (val.trim().toLowerCase().includes('absent')) {
                            onUpdateField('final', null, 'Absent');
                        } else {
                            const num = parseFloat(val);
                            if (Number.isFinite(num)) onUpdateField('final', num, null);
                        }
                    }}
                    className="w-full px-1.5 py-1 text-right text-xs font-mono tabular-nums rounded bg-surface-dark/50 hover:bg-surface-dark/80 focus:bg-surface-dark border border-surface-border/40 focus:border-sky-500/80 text-slate-200 focus:text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                    title="Final Exam (out of 75)"
                />
            </td>

            {/* Total (/100) */}
            <td className="px-1.5 py-1 text-right w-18">
                <input
                    type="text"
                    inputMode="decimal"
                    value={totalText}
                    placeholder="—"
                    onFocus={() => setFocusedField('total')}
                    onBlur={() => {
                        setFocusedField(null);
                        setTotalText(formatDisplayMark(data?.total));
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        setTotalText(val);
                        if (!val.trim()) {
                            onUpdateField('total', null);
                        } else {
                            const num = parseFloat(val);
                            if (Number.isFinite(num)) onUpdateField('total', num);
                        }
                    }}
                    className="w-full px-1.5 py-1 text-right text-xs font-mono tabular-nums font-semibold rounded bg-surface-dark/50 hover:bg-surface-dark/80 focus:bg-surface-dark border border-surface-border/40 focus:border-sky-500/80 text-slate-100 focus:text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                    title="Total Marks (out of 100) — Auto-calculated from CLA + Final, or manually enterable"
                />
            </td>

            {/* Grade */}
            <td className="px-1.5 py-1 text-center w-14">
                <select
                    value={data?.grade || ''}
                    onChange={(e) => onUpdateGrade(e.target.value || null)}
                    className={`w-full px-1 py-1 text-center text-xs font-mono tabular-nums rounded bg-surface-dark/60 hover:bg-surface-dark/90 focus:bg-surface-dark border border-surface-border/40 focus:border-sky-500/80 focus:outline-none cursor-pointer transition-colors ${gradeColor}`}
                    title="Letter Grade — Auto-mapped from Total or manually selectable"
                >
                    <option value="" className="bg-slate-900 text-slate-400">
                        {effGrade ? `${effGrade} (Auto)` : '—'}
                    </option>
                    <option value="O" className="bg-slate-900 text-emerald-400 font-bold">O (10)</option>
                    <option value="A" className="bg-slate-900 text-sky-400 font-bold">A (9)</option>
                    <option value="B" className="bg-slate-900 text-indigo-300 font-bold">B (8)</option>
                    <option value="C" className="bg-slate-900 text-amber-300 font-bold">C (7)</option>
                    <option value="D" className="bg-slate-900 text-orange-400 font-bold">D (6)</option>
                    <option value="E" className="bg-slate-900 text-rose-400 font-bold">E (5)</option>
                    <option value="F" className="bg-slate-900 text-red-500 font-bold">F (0)</option>
                </select>
            </td>
        </tr>
    );
};

// ── Main Page Component ────────────────────────────────────────────────────
export default function MarksPage() {
    const { selectedBatch, setSelectedBatch } = useBatch();
    const [origin, setOrigin] = useState('');
    const [rows, setRows] = useState<RawRow[] | null>(null);
    const [manualMarks, setManualMarks] = useState<Record<string, ManualSubjectMark>>({});
    const [customStudentName, setCustomStudentName] = useState<string>('');
    const [showRaw, setShowRaw] = useState(false);
    const [showImporter, setShowImporter] = useState(true);
    const [pasteText, setPasteText] = useState('');
    const [pasteError, setPasteError] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'printPreview'>('dashboard');
    const bookmarkletRef = useRef<HTMLAnchorElement>(null);

    // Initial mount hydration: origin, hash import, and localStorage
    useEffect(() => {
        setOrigin(window.location.origin);

        const imported = decodeImport(window.location.hash);
        if (imported) {
            setRows(imported);
            setShowImporter(false);
        } else {
            try {
                const savedRows = localStorage.getItem(STORAGE_KEY_ROWS);
                if (savedRows) {
                    const parsed = JSON.parse(savedRows);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setRows(parsed);
                        setShowImporter(false);
                    }
                }
            } catch {
                /* ignore */
            }
        }

        try {
            const savedManual = localStorage.getItem(STORAGE_KEY_MANUAL);
            if (savedManual) {
                const parsedManual = JSON.parse(savedManual);
                if (parsedManual && typeof parsedManual === 'object') {
                    setManualMarks(parsedManual);
                }
            }
            const savedName = localStorage.getItem(STORAGE_KEY_NAME);
            if (savedName) {
                setCustomStudentName(savedName);
            }
        } catch {
            /* ignore */
        }
    }, []);

    // Persist rows to localStorage
    useEffect(() => {
        try {
            if (rows && rows.length > 0) {
                localStorage.setItem(STORAGE_KEY_ROWS, JSON.stringify(rows));
            } else {
                localStorage.removeItem(STORAGE_KEY_ROWS);
            }
        } catch {
            /* ignore */
        }
    }, [rows]);

    // Persist manualMarks to localStorage
    useEffect(() => {
        try {
            if (manualMarks && Object.keys(manualMarks).length > 0) {
                localStorage.setItem(STORAGE_KEY_MANUAL, JSON.stringify(manualMarks));
            } else {
                localStorage.removeItem(STORAGE_KEY_MANUAL);
            }
        } catch {
            /* ignore */
        }
    }, [manualMarks]);

    // Persist customStudentName to localStorage
    useEffect(() => {
        try {
            if (customStudentName.trim()) {
                localStorage.setItem(STORAGE_KEY_NAME, customStudentName.trim());
            } else {
                localStorage.removeItem(STORAGE_KEY_NAME);
            }
        } catch {
            /* ignore */
        }
    }, [customStudentName]);

    const bookmarkletHref = useMemo(
        () => (origin ? buildBookmarklet(origin) : ''),
        [origin]
    );

    useEffect(() => {
        if (bookmarkletRef.current && bookmarkletHref) {
            bookmarkletRef.current.setAttribute('href', bookmarkletHref);
        }
    }, [bookmarkletHref]);

    const extractedName = useMemo(() => extractStudentName(pasteText), [pasteText]);
    const studentName = customStudentName || extractedName || '';

    // Parsed subjects from Moodle scraped/pasted rows
    const parsed = useMemo<ParsedSubject[]>(
        () => (rows ? parseGrades(rows, selectedBatch) : []),
        [rows, selectedBatch]
    );

    // Imported marks keyed by curriculum subject id
    const parsedById = useMemo(() => {
        const byId = new Map<string, ParsedSubject>();
        for (const s of parsed) {
            if (s.match) byId.set(s.match.id, s);
        }
        return byId;
    }, [parsed]);

    // Show EVERY curriculum subject for each term; fill in marks from parsed and manual overrides
    const termGroups = useMemo(() => {
        const byId = parsedById;

        return CGPA_TERMS
            .map((term) => {
                const subjects = getSubjectsForTerm(term, selectedBatch);
                const rowsForTerm = subjects.map((subject) => {
                    const base = byId.get(subject.id) ?? null;
                    const manual = manualMarks[subject.id];

                    if (!manual && !base) {
                        return { subject, data: null, hasManualOverride: false };
                    }

                    const cla = manual?.cla !== undefined ? manual.cla : (base?.cla ?? null);
                    const project = manual?.project !== undefined ? manual.project : (base?.project ?? null);
                    const final = manual?.final !== undefined ? manual.final : (base?.final ?? null);
                    const finalText = manual?.finalText !== undefined ? manual.finalText : (base?.finalText ?? null);

                    let total: number | null = null;
                    if (manual?.total !== undefined) {
                        total = manual.total;
                    } else if (base?.total !== null && base?.total !== undefined) {
                        total = base.total;
                    } else if (cla !== null || project !== null || final !== null) {
                        const sum = (cla ?? 0) + (project ?? 0) + (final ?? 0);
                        total = Number(sum.toFixed(2));
                    }

                    let grade: string | null = null;
                    if (manual?.grade !== undefined && manual.grade !== null && manual.grade !== '') {
                        grade = manual.grade;
                    } else if (base?.grade) {
                        grade = base.grade;
                    } else if (total !== null) {
                        grade = gradeFromTotal(total).letter;
                    }

                    const hasRetake = manual?.hasRetake !== undefined ? manual.hasRetake : (base?.hasRetake ?? false);

                    const hasAnyData =
                        cla !== null ||
                        project !== null ||
                        final !== null ||
                        finalText !== null ||
                        total !== null ||
                        grade !== null;

                    const data: ParsedSubject | null = hasAnyData
                        ? {
                            name: subject.name,
                            cla,
                            project,
                            final,
                            finalText,
                            total,
                            grade,
                            hasRetake,
                            gradeLocked: !!manual?.manualGradeLock,
                            match: subject,
                            matchScore: 1,
                        }
                        : null;

                    const hasManualOverride = !!manual && Object.keys(manual).length > 0;

                    return { subject, data, hasManualOverride };
                });

                const filled = rowsForTerm
                    .map((r) => r.data)
                    .filter((d): d is ParsedSubject => d !== null);

                return { term, rows: rowsForTerm, ...gpaFor(filled) };
            })
            .filter((g) => g.rows.length > 0);
    }, [parsedById, manualMarks, selectedBatch]);

    // Unmatched subjects (e.g. non-curriculum scraped rows)
    const unmatched = useMemo(() => parsed.filter((s) => !s.match), [parsed]);

    // All active subjects with data
    const allFilledSubjects = useMemo(() => {
        const list: ParsedSubject[] = [];
        for (const g of termGroups) {
            for (const r of g.rows) {
                if (r.data) list.push(r.data);
            }
        }
        return list;
    }, [termGroups]);

    const totalCurriculumSubjects = useMemo(() => {
        return termGroups.reduce((acc, g) => acc + g.rows.length, 0);
    }, [termGroups]);

    const totalCurriculumCredits = useMemo(() => {
        return termGroups.reduce(
            (acc, g) => acc + g.rows.reduce((sum, r) => sum + (r.subject.credits || 0), 0),
            0
        );
    }, [termGroups]);

    const overall = useMemo(() => gpaFor(allFilledSubjects), [allFilledSubjects]);

    const overallMarksStats = useMemo(() => {
        const scored = allFilledSubjects.filter((s) => s.total !== null && s.total !== undefined);
        const earned = Math.round(scored.reduce((sum, s) => sum + (s.total ?? 0), 0) * 100) / 100;
        const max = scored.length * 100;
        return { earned, max };
    }, [allFilledSubjects]);

    const manualMarksCount = useMemo(() => Object.keys(manualMarks).length, [manualMarks]);

    const rawJson = useMemo(() => (rows ? JSON.stringify(rows, null, 2) : ''), [rows]);

    const copyRaw = async () => {
        if (!rawJson) return;
        try {
            await navigator.clipboard.writeText(rawJson);
        } catch {
            /* clipboard unavailable */
        }
    };

    const clearData = () => {
        setRows(null);
        setManualMarks({});
        setPasteText('');
        setPasteError(false);
        try {
            localStorage.removeItem(STORAGE_KEY_ROWS);
            localStorage.removeItem(STORAGE_KEY_MANUAL);
        } catch {
            /* ignore */
        }
        if (typeof window !== 'undefined') {
            history.replaceState(null, '', window.location.pathname);
        }
    };

    const resetAllManualMarks = () => {
        setManualMarks({});
        try {
            localStorage.removeItem(STORAGE_KEY_MANUAL);
        } catch {
            /* ignore */
        }
    };

    // Update an individual subject mark manually
    const updateSubjectField = (
        subject: CgpaSubject,
        field: 'cla' | 'project' | 'final' | 'total',
        rawVal: number | null,
        text?: string | null
    ) => {
        const subjectId = subject.id;
        const base = parsedById.get(subjectId) ?? null;
        // Project-based subjects may carry a single mark out of 100 in the final column
        const maxFor = { cla: 25, project: 25, final: /project based/i.test(subject.name) ? 100 : 75, total: 100 };
        const val = rawVal === null ? null : Math.min(Math.max(rawVal, 0), maxFor[field]);

        setManualMarks((prev) => {
            const current = prev[subjectId] || {};
            const updated: ManualSubjectMark = { ...current };

            if (field === 'final') {
                updated.final = val;
                updated.finalText = text ?? null;
            } else {
                updated[field] = val;
            }

            // If updating CLA, Project, or Final, recompute total from manual edits merged over imported marks
            if (field !== 'total') {
                const cla = updated.cla !== undefined ? updated.cla : (base?.cla ?? null);
                const proj = updated.project !== undefined ? updated.project : (base?.project ?? null);
                const fin = updated.final !== undefined ? updated.final : (base?.final ?? null);

                if (cla !== null || proj !== null || fin !== null) {
                    const sum = (cla ?? 0) + (proj ?? 0) + (fin ?? 0);
                    updated.total = Number(sum.toFixed(2));
                    if (!updated.manualGradeLock) {
                        updated.grade = gradeFromTotal(updated.total).letter;
                    }
                } else {
                    // No components left: drop the derived total/grade so imported values show through
                    delete updated.total;
                    if (!updated.manualGradeLock) delete updated.grade;
                }
            } else if (field === 'total') {
                if (val !== null) {
                    if (!updated.manualGradeLock) {
                        updated.grade = gradeFromTotal(val).letter;
                    }
                } else {
                    if (!updated.manualGradeLock) updated.grade = null;
                }
            }

            return {
                ...prev,
                [subjectId]: updated,
            };
        });
    };

    const updateSubjectGrade = (subjectId: string, gradeStr: string | null) => {
        setManualMarks((prev) => {
            const current = prev[subjectId] || {};
            if (!gradeStr) {
                const copy = { ...current };
                delete copy.grade;
                delete copy.manualGradeLock;
                return { ...prev, [subjectId]: copy };
            }
            return {
                ...prev,
                [subjectId]: {
                    ...current,
                    grade: gradeStr.toUpperCase() as LetterGrade,
                    manualGradeLock: true,
                },
            };
        });
    };

    const toggleSubjectRetake = (subjectId: string) => {
        setManualMarks((prev) => {
            const current = prev[subjectId] || {};
            const nextRetake = !current.hasRetake;
            return {
                ...prev,
                [subjectId]: {
                    ...current,
                    hasRetake: nextRetake,
                },
            };
        });
    };

    const resetSubjectRow = (subjectId: string) => {
        setManualMarks((prev) => {
            const copy = { ...prev };
            delete copy[subjectId];
            return copy;
        });
    };

    // Parse whatever the student copied off their Moodle grade page.
    const ingestPaste = (text: string) => {
        setPasteText(text);
        const detected = detectBatchFromText(text);
        if (detected && detected !== selectedBatch) {
            setSelectedBatch(detected);
        }
        const extracted = extractStudentName(text);
        if (extracted && !customStudentName) {
            setCustomStudentName(extracted);
        }
        const parsedRows = parsePastedText(text);
        if (parsedRows.length) {
            setRows(parsedRows);
            setPasteError(false);
            setShowImporter(false);
        } else {
            setPasteError(text.trim().length > 0);
        }
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) ingestPaste(text);
        } catch {
            /* fallback to textarea */
        }
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const cardCls = 'bg-surface border border-surface-border/60 rounded-xl p-4 sm:p-5 shadow-sm';

    // Helper to render the term table for official marksheet format (preview & print)
    const renderTermTable = (group: typeof termGroups[0]) => {
        const hasProjectCol =
            group.term === 5 ||
            group.rows.some((r) => r.data?.project !== null && r.data?.project !== undefined);

        const termTotalCredits = group.rows.reduce((sum, r) => sum + (r.subject.credits || 0), 0);
        const termEarnedCredits = group.earnedCredits;
        const scoredRows = group.rows.filter((r) => r.data?.total !== null && r.data?.total !== undefined);
        const termMarksScored = Math.round(scoredRows.reduce((sum, r) => sum + (r.data?.total ?? 0), 0) * 100) / 100;
        const termMarksMax = scoredRows.length * 100;

        return (
            <div key={group.term} className="w-full text-black">
                <table className="w-full border-collapse border border-black text-[11px] leading-tight bg-white">
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

                            const subjectDisplayName = d?.hasRetake ? `*${r.subject.name}` : r.subject.name;

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
    };

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════════
                SCREEN UI (Interactive Modern interface, hidden on print)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="min-h-screen relative z-[1] text-white print:hidden">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                                Marksheet
                            </h1>
                        </div>

                        {/* Student Name Display / Input */}
                        <div className="flex items-center gap-1.5 bg-surface-dark/60 border border-surface-border/60 px-2.5 py-1 rounded-lg">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={customStudentName}
                                onChange={(e) => setCustomStudentName(e.target.value)}
                                placeholder={extractedName || 'Student Name (optional)'}
                                className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-36 sm:w-48"
                                title="Student name for statement of marks"
                            />
                        </div>
                    </div>

                    {/* ── Step 1 · Moodle Import (Collapsible) ── */}
                    <div className={cardCls}>
                        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setShowImporter(!showImporter)}>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <ClipboardPaste className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                        <span>Moodle Import</span>
                                        <span className="text-[10px] font-normal text-slate-400">
                                            {rows ? `${rows.length} rows loaded` : ''}
                                        </span>
                                    </h2>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                            >
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showImporter ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                        </div>

                        {showImporter && (
                            <div className="mt-4 pt-4 border-t border-surface-border/50 space-y-3 text-xs text-slate-400">
                                <p>
                                    Open your{' '}
                                    <a href={MOODLE_GRADE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                                        Moodle grade report
                                    </a>
                                    , select all, copy, and paste it here.
                                </p>
                                <textarea
                                    value={pasteText}
                                    onChange={(e) => ingestPaste(e.target.value)}
                                    placeholder="Paste grade report"
                                    rows={3}
                                    className="w-full rounded-lg bg-surface-dark/70 border border-surface-border/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 resize-y font-mono"
                                />
                                {pasteError && (
                                    <p className="text-amber-400">
                                        No grades found. Copy the whole page, or enter marks below.
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    <button
                                        onClick={pasteFromClipboard}
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-200 rounded-md font-medium cursor-pointer"
                                    >
                                        <ClipboardPaste className="w-3.5 h-3.5" />
                                        Paste from clipboard
                                    </button>
                                    <span className="hidden sm:inline text-slate-600">·</span>
                                    <span className="hidden sm:inline-flex items-center gap-1.5">
                                        Or drag
                                        <a
                                            ref={bookmarkletRef}
                                            onClick={(e) => e.preventDefault()}
                                            title="Drag to your bookmarks bar, then click it on the grade report"
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30 font-medium cursor-grab active:cursor-grabbing select-none"
                                        >
                                            <Bookmark className="w-3 h-3" />
                                            Import IIMB Marks
                                        </a>
                                        to your bookmarks bar and click it on the grade report.
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Step 2 · Curriculum Skeleton & Interactive Marks ── */}
                    <div className={cardCls}>
                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                    <span>Your Marks</span>
                                </h2>
                            </div>

                            {/* Batch Selector & Global Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex bg-surface-dark/70 border border-surface-border/60 p-0.5 gap-0.5 rounded-lg">
                                    {AVAILABLE_BATCHES.map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setSelectedBatch(b)}
                                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                                                selectedBatch === b ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                                            }`}
                                            type="button"
                                        >
                                            Batch {b}
                                        </button>
                                    ))}
                                </div>

                                {/* Preview / Edit Toggle and Print Button */}
                                {activeTab === 'dashboard' ? (
                                    <button
                                        onClick={() => setActiveTab('printPreview')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                        type="button"
                                        title="Preview Marksheet for Printing"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>Print</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setActiveTab('dashboard')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-200 hover:text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                            type="button"
                                            title="Back to Edit Marks"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={handlePrint}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                            type="button"
                                            title="Print Marksheet"
                                        >
                                            <Printer className="w-3.5 h-3.5" />
                                            <span>Print</span>
                                        </button>
                                    </>
                                )}

                                {manualMarksCount > 0 && (
                                    <button
                                        onClick={resetAllManualMarks}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-300 hover:text-amber-400 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                        type="button"
                                        title="Reset manual overrides only"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>Reset Edits ({manualMarksCount})</span>
                                    </button>
                                )}

                                {(rows || manualMarksCount > 0) && (
                                    <button
                                        onClick={clearData}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-400 hover:text-red-400 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                        type="button"
                                        title="Clear all marks and reset to skeleton"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Clear All</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Top Summary Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 mb-3">
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                <div>
                                    <div className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/80">Overall CGPA</div>
                                    <div className="text-base sm:text-lg font-bold tabular-nums font-mono text-emerald-300">
                                        {overall.gpa === null ? '—' : overall.gpa.toFixed(2)}
                                    </div>
                                </div>
                                <div className="h-7 w-px bg-emerald-500/30 hidden sm:block" />
                                <div>
                                    <div className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/80">Percentage (WAM)</div>
                                    <div className="text-base sm:text-lg font-bold tabular-nums font-mono text-emerald-300">
                                        {overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%`}
                                    </div>
                                </div>
                                <div className="h-7 w-px bg-emerald-500/30 hidden sm:block" />
                                <div>
                                    <div className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/80">Credits Earned</div>
                                    <div className="text-base sm:text-lg font-bold tabular-nums font-mono text-emerald-300">
                                        {overall.earnedCredits} <span className="text-xs text-emerald-400/70 font-normal">/ {totalCurriculumCredits}</span>
                                    </div>
                                </div>
                                <div className="h-7 w-px bg-emerald-500/30 hidden sm:block" />
                                <div>
                                    <div className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/80">Total Marks</div>
                                    <div className="text-base sm:text-lg font-bold tabular-nums font-mono text-emerald-300">
                                        {overallMarksStats.max > 0 ? (
                                            <span>
                                                {overallMarksStats.earned}{' '}
                                                <span className="text-xs text-emerald-400/70 font-normal">/ {overallMarksStats.max}</span>
                                            </span>
                                        ) : (
                                            '—'
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right text-[10px] text-slate-400 space-y-0.5">
                                <div className="font-medium text-slate-300">
                                    {allFilledSubjects.length} of {totalCurriculumSubjects} subjects graded
                                </div>

                                {unmatched.length > 0 && (
                                    <div className="text-amber-400 text-[9px]">{unmatched.length} unmatched (excluded from GPA)</div>
                                )}
                            </div>
                        </div>



                        {activeTab === 'printPreview' ? (
                            /* ── 3-Page Marksheet Preview (Live Statement of Marks) ── */
                            <div className="space-y-6 pt-1">
                                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-300">
                                    <span>
                                        Viewing <strong>3-Page Official Marksheet Layout</strong> (Page 1: Terms 1-3, Page 2: Terms 4-6, Page 3: Terms 7-9).
                                    </span>
                                    <button
                                        onClick={handlePrint}
                                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer"
                                    >
                                        Print / PDF
                                    </button>
                                </div>

                                {YEARS.map((year) => {
                                    const groupsForYear = termGroups.filter((g) => year.terms.includes(g.term));

                                    return (
                                        <div key={year.year} className="bg-white rounded-lg shadow-lg border border-slate-300 p-6 sm:p-8 space-y-6 text-black">
                                            {/* Top Header */}
                                            <div className="border-b-2 border-black pb-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-black">
                                                <div>
                                                    <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-black">Statement of Marks</h2>
                                                    <p className="text-[11px] text-neutral-700 font-medium">
                                                        {studentName ? `${studentName} · ` : ''}Batch {selectedBatch} · {year.label}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-5 text-right">
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">CGPA</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">
                                                            {overall.gpa === null ? '—' : overall.gpa.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="h-6 w-px bg-neutral-300" />
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Percentage (WAM)</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">
                                                            {overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%`}
                                                        </span>
                                                    </div>
                                                    <div className="h-6 w-px bg-neutral-300" />
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Total Credits</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">
                                                            {overall.earnedCredits} <span className="text-[10px] text-neutral-500 font-normal">/ {totalCurriculumCredits}</span>
                                                        </span>
                                                    </div>
                                                    <div className="h-6 w-px bg-neutral-300" />
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Total Marks</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">
                                                            {overallMarksStats.max > 0 ? (
                                                                <span>
                                                                    {overallMarksStats.earned}{' '}
                                                                    <span className="text-[10px] text-neutral-500 font-normal">/ {overallMarksStats.max}</span>
                                                                </span>
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {groupsForYear.map((group) => renderTermTable(group))}

                                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                                                <span>* Denotes Retake</span>
                                                <span>Page {year.year} of 3</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* ── Interactive Dashboard View (Terms 1 to 9 with Inline Inputs) ── */
                            <div className="space-y-4">
                                {termGroups.map((group) => {
                                    const hasProjectCol =
                                        group.term === 5 ||
                                        group.rows.some((r) => r.data?.project !== null && r.data?.project !== undefined);

                                    return (
                                        <div key={group.term} className="rounded-lg border border-surface-border/50 overflow-hidden bg-surface-dark/20">
                                            {/* Term Header */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-dark/50 px-3 py-2 border-b border-surface-border/40">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-200">Term {group.term}</span>
                                                    <span className="text-[10px] text-slate-500">
                                                        ({group.rows.filter((r) => r.data !== null).length}/{group.rows.length} subjects)
                                                    </span>
                                                </div>
                                                {(() => {
                                                    const termTotalCredits = group.rows.reduce((sum, r) => sum + (r.subject.credits || 0), 0);
                                                    const scoredRows = group.rows.filter((r) => r.data?.total !== null && r.data?.total !== undefined);
                                                    const termMarksScored = Math.round(scoredRows.reduce((sum, r) => sum + (r.data?.total ?? 0), 0) * 100) / 100;
                                                    const termMarksMax = scoredRows.length * 100;

                                                    return (
                                                        <div className="text-[11px] text-slate-400">
                                                            GPA{' '}
                                                            <span className="font-bold tabular-nums font-mono text-emerald-300">
                                                                {group.gpa === null ? '—' : group.gpa.toFixed(2)}
                                                            </span>
                                                            <span className="text-slate-600"> · </span>
                                                            Percentage{' '}
                                                            <span className="font-bold tabular-nums font-mono text-emerald-300">
                                                                {group.percentage === null ? '—' : `${group.percentage.toFixed(2)}%`}
                                                            </span>
                                                            <span className="text-slate-600"> · </span>
                                                            <span className="tabular-nums font-mono text-slate-300">
                                                                Credits {group.earnedCredits} / {termTotalCredits}
                                                            </span>
                                                            {scoredRows.length > 0 && (
                                                                <>
                                                                    <span className="text-slate-600"> · </span>
                                                                    <span className="tabular-nums font-mono text-slate-300">
                                                                        Marks {termMarksScored}/{termMarksMax}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Term Subjects Table with Inline Editing */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs min-w-[560px]">
                                                    <thead>
                                                        <tr className="text-slate-500 text-left bg-surface-dark/10">
                                                            <th className="px-3 py-2 font-semibold uppercase tracking-widest text-[9px]">Subject</th>
                                                            <th className="px-2 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-12">Cr</th>
                                                            <th className="px-1.5 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-16">
                                                                CLA<br />/25
                                                            </th>
                                                            {hasProjectCol && (
                                                                <th className="px-1.5 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-16">
                                                                    Proj<br />/25
                                                                </th>
                                                            )}
                                                            <th className="px-1.5 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-16">
                                                                Final<br />/75
                                                            </th>
                                                            <th className="px-1.5 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-18">
                                                                Total<br />/100
                                                            </th>
                                                            <th className="px-1.5 py-2 font-semibold uppercase tracking-widest text-[9px] text-center w-14">
                                                                Gr
                                                            </th>
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
                                                                onUpdateField={(field, val, text) => updateSubjectField(r.subject, field, val, text)}
                                                                onUpdateGrade={(grade) => updateSubjectGrade(r.subject.id, grade)}
                                                                onToggleRetake={() => toggleSubjectRetake(r.subject.id)}
                                                                onResetRow={() => resetSubjectRow(r.subject.id)}
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
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
                                            <table className="w-full text-xs">
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

                                {/* Collapsible Raw Scraped JSON */}
                                {rows && (
                                    <details
                                        open={showRaw}
                                        onToggle={(e) => setShowRaw((e.target as HTMLDetailsElement).open)}
                                        className="rounded-lg border border-surface-border/50"
                                    >
                                        <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer text-[10px] font-semibold text-slate-500 uppercase tracking-widest select-none">
                                            <span className="flex items-center gap-1.5">
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRaw ? 'rotate-0' : '-rotate-90'}`} />
                                                Raw JSON ({rows.length} rows)
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyRaw();
                                                }}
                                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-300 rounded text-[10px] font-medium normal-case"
                                                type="button"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Copy
                                            </button>
                                        </summary>
                                        <pre className="bg-surface-dark/60 border-t border-surface-border/50 p-3 text-[10px] text-slate-400 overflow-x-auto max-h-80">
                                            {rawJson}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                PRINTABLE MARKSHEET (3 Pages, 1 Year = 3 Terms per page)
            ═══════════════════════════════════════════════════════════════════ */}
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
                                        {studentName ? `${studentName} · ` : ''}Batch {selectedBatch} · {year.label}
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
                                {groupsForYear.map((group) => renderTermTable(group))}
                            </div>

                            <div className="mt-auto pt-3 text-[10px] text-slate-800 flex items-center justify-between">
                                <span>* Denotes Retake</span>
                                <span>Page {year.year} of 3</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
