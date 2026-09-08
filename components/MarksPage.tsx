'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, ChevronDown, ClipboardPaste, Copy, Eye, FileText, Printer, RefreshCw, Trash2 } from 'lucide-react';
import { parseGrades, parsePastedText, detectBatchFromText, type RawRow, type ParsedSubject } from '@/lib/marks/parseGrades';
import { gradePoints, gradeFromTotal } from '@/lib/cgpa/grades';
import { CGPA_TERMS, getSubjectsForTerm } from '@/lib/cgpa/subjects';
import { useBatch, AVAILABLE_BATCHES } from '@/contexts/BatchContext';

const MOODLE_LOGIN_URL = 'https://moodle.iimb.ac.in/portal/';
const MOODLE_GRADE_URL = 'https://moodle.iimb.ac.in/grade/report/user/index.php?id=6211';

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

// Effective grade points for a subject: prefer derived grade if retake exists or initial was F with valid total
function pointsFor(s: ParsedSubject): number | null {
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).points;
    }
    const fromLetter = gradePoints(s.grade);
    if (fromLetter !== null) return fromLetter;
    if (s.total !== null) return gradeFromTotal(s.total).points;
    return null;
}

function effectiveGrade(s: ParsedSubject): string {
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).letter;
    }
    if (s.grade && gradePoints(s.grade) !== null) return s.grade.trim().toUpperCase();
    if (s.total !== null) return gradeFromTotal(s.total).letter;
    return '';
}

// Credit-weighted GPA and Percentage (WAM) across the given subjects.
// WAM Formula: sum(Marks Obtained * Course Credits) / sum(Course Credits)
function gpaFor(subjects: ParsedSubject[]): {
    gpa: number | null;
    percentage: number | null;
    credits: number;
    totalPoints: number;
    wamCredits: number;
} {
    let weightedPoints = 0;
    let credits = 0;
    let weightedMarks = 0;
    let wamCredits = 0;

    for (const s of subjects) {
        const cr = s.match?.credits ?? 0;
        if (cr === 0) continue;

        const pts = pointsFor(s);
        if (pts !== null) {
            weightedPoints += pts * cr;
            credits += cr;
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
        totalPoints: weightedPoints,
        wamCredits,
    };
}

const YEARS = [
    { year: 1, label: 'Year 1 (Terms 1, 2, 3)', terms: [1, 2, 3] },
    { year: 2, label: 'Year 2 (Terms 4, 5, 6)', terms: [4, 5, 6] },
    { year: 3, label: 'Year 3 (Terms 7, 8, 9)', terms: [7, 8, 9] },
];

export default function MarksPage() {
    const { selectedBatch, setSelectedBatch } = useBatch();
    const [origin, setOrigin] = useState('');
    const [rows, setRows] = useState<RawRow[] | null>(null);
    const [showRaw, setShowRaw] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const [pasteError, setPasteError] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'printPreview'>('dashboard');
    const bookmarkletRef = useRef<HTMLAnchorElement>(null);

    // Resolve origin + read imported data on mount.
    useEffect(() => {
        setOrigin(window.location.origin);
        const imported = decodeImport(window.location.hash);
        if (imported) setRows(imported);
    }, []);

    const bookmarkletHref = useMemo(
        () => (origin ? buildBookmarklet(origin) : ''),
        [origin]
    );

    // Set the javascript: href via DOM to avoid React's javascript-URL warning.
    useEffect(() => {
        if (bookmarkletRef.current && bookmarkletHref) {
            bookmarkletRef.current.setAttribute('href', bookmarkletHref);
        }
    }, [bookmarkletHref]);

    const studentName = useMemo(() => extractStudentName(pasteText), [pasteText]);

    const parsed = useMemo<ParsedSubject[]>(() => (rows ? parseGrades(rows, selectedBatch) : []), [rows, selectedBatch]);
    const matchedCount = useMemo(() => parsed.filter((p) => p.match).length, [parsed]);

    // Show EVERY curriculum subject for each term; fill in marks where we have them.
    const termGroups = useMemo(() => {
        const byId = new Map<string, ParsedSubject>();
        for (const s of parsed) {
            if (s.match) byId.set(s.match.id, s);
        }
        return CGPA_TERMS
            .map((term) => {
                const subjects = getSubjectsForTerm(term, selectedBatch);
                const rowsForTerm = subjects.map((subject) => ({
                    subject,
                    data: byId.get(subject.id) ?? null,
                }));
                const filled = rowsForTerm
                    .map((r) => r.data)
                    .filter((d): d is ParsedSubject => d !== null);
                return { term, rows: rowsForTerm, ...gpaFor(filled) };
            })
            .filter((g) => g.rows.length > 0);
    }, [parsed, selectedBatch]);

    const unmatched = useMemo(() => parsed.filter((s) => !s.match), [parsed]);
    const overall = useMemo(() => gpaFor(parsed.filter((s) => s.match)), [parsed]);

    const rawJson = useMemo(() => (rows ? JSON.stringify(rows, null, 2) : ''), [rows]);

    const copyRaw = async () => {
        if (!rawJson) return;
        try {
            await navigator.clipboard.writeText(rawJson);
        } catch {
            /* clipboard may be unavailable */
        }
    };

    const clearData = () => {
        setRows(null);
        setPasteText('');
        setPasteError(false);
        if (typeof window !== 'undefined') {
            history.replaceState(null, '', window.location.pathname);
        }
    };

    // Parse whatever the student copied off their Moodle grade page.
    const ingestPaste = (text: string) => {
        setPasteText(text);
        const detected = detectBatchFromText(text);
        if (detected && detected !== selectedBatch) {
            setSelectedBatch(detected);
        }
        const parsedRows = parsePastedText(text);
        if (parsedRows.length) {
            setRows(parsedRows);
            setPasteError(false);
        } else {
            setPasteError(text.trim().length > 0);
        }
    };

    // One-tap paste for browsers that allow clipboard reads.
    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) ingestPaste(text);
        } catch {
            /* permission denied — the textarea is the fallback */
        }
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const cardCls =
        'bg-surface border border-surface-border/60 rounded-xl p-4 sm:p-5';

    // Helper to render the term table exactly like the official marksheet format
    const renderTermTable = (group: typeof termGroups[0]) => {
        const hasProjectCol = group.term === 5 || group.rows.some((r) => r.data?.project !== null && r.data?.project !== undefined);

        return (
            <div key={group.term} className="w-full text-black">
                <table className="w-full border-collapse border border-black text-[11px] leading-tight bg-white">
                    <thead>
                        {/* Header banner: TERM-X spanning full width */}
                        <tr className="border-b border-black">
                            <th
                                colSpan={hasProjectCol ? 6 : 5}
                                className="border border-black py-1 px-2 text-center font-bold text-[12px] uppercase tracking-wider bg-white text-black"
                            >
                                TERM-{group.term}
                            </th>
                        </tr>
                        {/* Subheaders */}
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
                                d?.cla === null &&
                                (d?.final !== null || d?.total !== null) &&
                                /project based/i.test(r.subject.name);

                            const subjectDisplayName = d?.hasRetake ? `*${r.subject.name}` : r.subject.name;

                            return (
                                <tr key={i} className="border-b border-black text-black">
                                    {/* Subject */}
                                    <td className="border border-black py-1.5 px-3 text-left font-normal">
                                        {subjectDisplayName}
                                    </td>

                                    {/* Project based course with single merged mark */}
                                    {isProjectBasedSingleMark ? (
                                        <td colSpan={2} className="border border-black py-1.5 px-2 text-center font-normal">
                                            {formatDisplayMark(d?.final ?? d?.total)}
                                        </td>
                                    ) : (
                                        <>
                                            {/* CLA */}
                                            <td className="border border-black py-1.5 px-2 text-center font-normal">
                                                {d?.cla !== null ? formatDisplayMark(d?.cla) : ''}
                                            </td>

                                            {/* Project (if term has project column) */}
                                            {hasProjectCol && (
                                                <td className="border border-black py-1.5 px-2 text-center font-normal">
                                                    {d?.project !== null ? formatDisplayMark(d?.project) : '-'}
                                                </td>
                                            )}

                                            {/* Final Exam */}
                                            <td className="border border-black py-1.5 px-2 text-center font-normal">
                                                {d?.finalText || (d?.final !== null ? formatDisplayMark(d?.final) : '')}
                                            </td>
                                        </>
                                    )}

                                    {/* Total */}
                                    <td className="border border-black py-1.5 px-2 text-center font-normal">
                                        {d?.total !== null ? formatDisplayMark(d?.total) : ''}
                                    </td>

                                    {/* Grade */}
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
                SCREEN UI (Interactive Dark-mode interface, hidden on print)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="min-h-screen relative z-[1] text-white print:hidden">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Marks Import &amp; Marksheet</h1>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Pull your grades from Moodle with a one-time bookmarklet or paste your grade report to generate and print your marksheet.
                        </p>
                    </div>

                    {/* ── Setup instructions ── */}
                    <div className={cardCls}>
                        <div className="flex items-center gap-2 mb-3">
                            <Bookmark className="w-4 h-4 text-emerald-400" />
                            <h2 className="text-sm font-bold text-slate-100">Step 1 · Install the bookmarklet</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                            Drag the button below onto your browser&apos;s bookmarks bar (or right-click → add to bookmarks).
                        </p>
                        <a
                            ref={bookmarkletRef}
                            onClick={(e) => e.preventDefault()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-lg border border-emerald-500/30 text-sm font-semibold cursor-grab active:cursor-grabbing select-none"
                        >
                            <Bookmark className="w-4 h-4" />
                            Import IIMB Marks
                        </a>

                        <ol className="mt-4 space-y-1.5 text-xs text-slate-400 list-decimal list-inside">
                            <li>
                                Log into Moodle:{' '}
                                <a href={MOODLE_LOGIN_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline break-all">
                                    {MOODLE_LOGIN_URL}
                                </a>
                            </li>
                            <li>
                                Open your grade report:{' '}
                                <a href={MOODLE_GRADE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline break-all">
                                    {MOODLE_GRADE_URL}
                                </a>
                            </li>
                            <li>While on that page, click the <span className="text-slate-200 font-medium">Import IIMB Marks</span> bookmark.</li>
                            <li>A new tab opens back here with your parsed marks below.</li>
                        </ol>

                        {/* ── Mobile / no-bookmarklet path: copy & paste ── */}
                        <div className="mt-5 pt-4 border-t border-surface-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                <ClipboardPaste className="w-4 h-4 text-sky-400" />
                                <h3 className="text-xs font-bold text-slate-100">On mobile? Copy &amp; paste instead</h3>
                            </div>
                            <ol className="space-y-1.5 text-xs text-slate-400 list-decimal list-inside mb-3">
                                <li>
                                    Open your{' '}
                                    <a href={MOODLE_GRADE_URL} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline break-all">
                                        Moodle grade report
                                    </a>{' '}
                                    (log in if asked).
                                </li>
                                <li>Long-press the page → <span className="text-slate-200 font-medium">Select all</span> → <span className="text-slate-200 font-medium">Copy</span>.</li>
                                <li>Come back here, tap the box and <span className="text-slate-200 font-medium">Paste</span> (or use the button).</li>
                            </ol>
                            <button
                                onClick={pasteFromClipboard}
                                type="button"
                                className="inline-flex items-center gap-2 px-4 py-2 mb-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 rounded-lg border border-sky-500/30 text-sm font-semibold"
                            >
                                <ClipboardPaste className="w-4 h-4" />
                                Paste my marks
                            </button>
                            <textarea
                                value={pasteText}
                                onChange={(e) => ingestPaste(e.target.value)}
                                placeholder="…or tap here and paste your copied Moodle grade page"
                                rows={3}
                                className="w-full rounded-lg bg-surface-dark/60 border border-surface-border/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 resize-y"
                            />
                            {pasteError && (
                                <p className="mt-1.5 text-[11px] text-amber-400">
                                    Couldn&apos;t find any grades in that text. Make sure you copied the whole grade report page.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Parsed data ── */}
                    <div className={cardCls}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-100">Step 2 · Your marks</h2>
                                {rows && (
                                    <div className="inline-flex bg-surface-dark/60 border border-surface-border/60 p-0.5 gap-0.5 rounded-lg ml-2">
                                        <button
                                            onClick={() => setActiveTab('dashboard')}
                                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1 ${activeTab === 'dashboard' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                                                }`}
                                            type="button"
                                        >
                                            <Eye className="w-3 h-3" /> Dashboard
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('printPreview')}
                                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1 ${activeTab === 'printPreview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                                                }`}
                                            type="button"
                                        >
                                            <FileText className="w-3 h-3" /> 3-Page Marksheet Preview
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex bg-surface-dark/60 border border-surface-border/60 p-0.5 gap-0.5 rounded-lg">
                                    {AVAILABLE_BATCHES.map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setSelectedBatch(b)}
                                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${selectedBatch === b ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                                                }`}
                                            type="button"
                                        >
                                            Batch {b}
                                        </button>
                                    ))}
                                </div>
                                {rows && (
                                    <>
                                        <button
                                            onClick={handlePrint}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                            type="button"
                                            title="Print or Save PDF Marksheet"
                                        >
                                            <Printer className="w-3.5 h-3.5" />
                                            Print Marksheet
                                        </button>
                                        <button
                                            onClick={clearData}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-400 hover:text-red-400 rounded-lg text-xs font-medium cursor-pointer"
                                            type="button"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Clear
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {!rows ? (
                            <div className="flex flex-col items-center justify-center text-center py-10 text-slate-600">
                                <RefreshCw className="w-6 h-6 mb-2 opacity-50" />
                                <p className="text-xs">No data yet. Use the bookmarklet on your Moodle grade page, or copy &amp; paste it above.</p>
                            </div>
                        ) : activeTab === 'printPreview' ? (
                            /* ── Live Marksheet Preview (3 Pages exact match) ── */
                            <div className="space-y-6 pt-2">
                                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-300">
                                    <span>
                                        Viewing <strong>3-Page Marksheet Layout</strong> (Page 1: Terms 1-3, Page 2: Terms 4-6, Page 3: Terms 7-9).
                                    </span>
                                    <button
                                        onClick={handlePrint}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                                    >
                                        Print / PDF
                                    </button>
                                </div>

                                {YEARS.map((year) => {
                                    const groupsForYear = termGroups.filter((g) => year.terms.includes(g.term));

                                    return (
                                        <div key={year.year} className="bg-white rounded-lg shadow-lg border border-slate-300 p-6 sm:p-8 space-y-6 text-black">
                                            {/* Marksheet Top Header */}
                                            <div className="border-b-2 border-black pb-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-black">
                                                <div>
                                                    <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-black">Statement of Marks</h2>
                                                    <p className="text-[11px] text-neutral-600">Batch {selectedBatch} · {year.label}</p>
                                                </div>
                                                <div className="flex items-center gap-5 text-right">
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">CGPA</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">{overall.gpa === null ? '—' : overall.gpa.toFixed(2)}</span>
                                                    </div>
                                                    <div className="h-6 w-px bg-neutral-300" />
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Percentage (WAM)</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">{overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%`}</span>
                                                    </div>
                                                    <div className="h-6 w-px bg-neutral-300" />
                                                    <div>
                                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Credits</span>
                                                        <span className="text-sm sm:text-base font-extrabold font-mono text-black">{overall.credits}</span>
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
                            /* ── Interactive Dashboard View ── */
                            <div className="space-y-4">
                                {/* Overall GPA & Percentage (WAM) */}
                                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div>
                                            <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80">Overall GPA</div>
                                            <div className="text-3xl font-extrabold tabular-nums text-emerald-300">
                                                {overall.gpa === null ? '—' : overall.gpa.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="h-10 w-px bg-emerald-500/30 hidden sm:block" />
                                        <div>
                                            <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80">Percentage (WAM)</div>
                                            <div className="text-3xl font-extrabold tabular-nums text-emerald-300">
                                                {overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-[11px] text-slate-400">
                                        <div>{matchedCount} subjects · {overall.credits} credits</div>
                                        {parsed.length - matchedCount > 0 && (
                                            <div className="text-amber-400">{parsed.length - matchedCount} unmatched (excluded)</div>
                                        )}
                                    </div>
                                </div>

                                {/* Term-wise groups */}
                                {termGroups.map((group) => (
                                    <div key={group.term} className="rounded-lg border border-surface-border/50 overflow-hidden">
                                        <div className="flex items-center justify-between gap-2 bg-surface-dark/40 px-3 py-2">
                                            <span className="text-xs font-bold text-slate-200">Term {group.term}</span>
                                            <span className="text-[11px] text-slate-400">
                                                GPA{' '}
                                                <span className="font-bold tabular-nums text-emerald-300">
                                                    {group.gpa === null ? '—' : group.gpa.toFixed(2)}
                                                </span>
                                                {group.percentage !== null && (
                                                    <>
                                                        <span className="text-slate-600"> · </span>
                                                        WAM{' '}
                                                        <span className="font-bold tabular-nums text-emerald-300">
                                                            {group.percentage.toFixed(2)}%
                                                        </span>
                                                    </>
                                                )}
                                                <span className="text-slate-600"> · </span>
                                                {group.credits} cr
                                            </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="text-slate-500 text-left">
                                                        <th className="px-3 py-2 font-semibold uppercase tracking-widest text-[9px]">Subject</th>
                                                        <th className="px-2 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-14">Cr</th>
                                                        <th className="px-2 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-14">CLA<br />/25</th>
                                                        <th className="px-2 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-14">Final<br />/75</th>
                                                        <th className="px-2 py-2 font-semibold uppercase tracking-widest text-[9px] text-right w-14">Total<br />/100</th>
                                                        <th className="px-2 py-2 font-semibold uppercase tracking-widest text-[9px] text-center w-10">Gr</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.rows.map((r, i) => {
                                                        const d = r.data;
                                                        return (
                                                            <tr key={i} className="border-t border-surface-border/30">
                                                                <td className={`px-3 py-1.5 ${d ? 'text-slate-300' : 'text-slate-500'}`}>
                                                                    {d?.hasRetake ? `*${r.subject.name}` : r.subject.name}
                                                                    {d?.hasRetake && <span className="ml-1.5 text-[9px] text-amber-500/70">(retake)</span>}
                                                                </td>
                                                                <td className="px-2 py-1.5 text-slate-400 text-right tabular-nums">{r.subject.credits}</td>
                                                                <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums">{fmt(d?.cla ?? null)}</td>
                                                                <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums">{d?.finalText || fmt(d?.final ?? null)}</td>
                                                                <td className="px-2 py-1.5 text-slate-100 text-right tabular-nums font-semibold">{fmt(d?.total ?? null)}</td>
                                                                <td className="px-2 py-1.5 text-center font-bold text-slate-200">{(d && effectiveGrade(d)) || '—'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}

                                {/* Unmatched subjects */}
                                {unmatched.length > 0 && (
                                    <div className="rounded-lg border border-amber-500/30 overflow-hidden">
                                        <div className="bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
                                            Unmatched ({unmatched.length}) · not counted in GPA
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

                                {/* Raw JSON (collapsible) */}
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                PRINTABLE MARKSHEET (3 Pages, 1 Year = 3 Terms per page)
            ═══════════════════════════════════════════════════════════════════ */}
            {rows && (
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
                                {/* Marksheet Top Header on Print */}
                                <div className="border-b-2 border-black pb-2 mb-2 flex items-center justify-between text-black">
                                    <div>
                                        <div className="text-sm font-bold tracking-wider uppercase">Statement of Marks</div>
                                        <div className="text-[10px] text-neutral-600">Batch {selectedBatch} · {year.label}</div>
                                    </div>
                                    <div className="flex items-center gap-5 text-right">
                                        <div>
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">CGPA</span>
                                            <span className="text-sm font-extrabold font-mono">{overall.gpa === null ? '—' : overall.gpa.toFixed(2)}</span>
                                        </div>
                                        <div className="h-6 w-px bg-neutral-300" />
                                        <div>
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Percentage (WAM)</span>
                                            <span className="text-sm font-extrabold font-mono">{overall.percentage === null ? '—' : `${overall.percentage.toFixed(2)}%`}</span>
                                        </div>
                                        <div className="h-6 w-px bg-neutral-300" />
                                        <div>
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Credits</span>
                                            <span className="text-sm font-extrabold font-mono">{overall.credits}</span>
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
            )}
        </>
    );
}

