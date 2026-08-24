'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, ChevronDown, ClipboardPaste, Copy, Printer, RefreshCw, Trash2 } from 'lucide-react';
import { parseGrades, parsePastedText, detectBatchFromText, type RawRow, type ParsedSubject } from '@/lib/marks/parseGrades';
import { gradePoints, gradeFromTotal } from '@/lib/cgpa/grades';
import { CGPA_TERMS, getSubjectsForTerm } from '@/lib/cgpa/subjects';
import { useBatch } from '@/contexts/BatchContext';

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

/**
 * Builds the bookmarklet source. It runs ON the Moodle grade page (so it uses the
 * student's existing SSO session — no CORS, no credentials), scrapes the gradebook
 * table, base64-encodes the rows, and opens this app's /marks page with the data.
 */
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

function effectiveGrade(s: ParsedSubject): string | null {
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).letter;
    }
    if (gradePoints(s.grade) !== null) return (s.grade || '').trim().toUpperCase();
    if (s.total !== null) return gradeFromTotal(s.total).letter;
    return null;
}

// Credit-weighted GPA across the given subjects (null if no graded credits).
function gpaFor(subjects: ParsedSubject[]): { gpa: number | null; credits: number; totalPoints: number } {
    let weighted = 0;
    let credits = 0;
    for (const s of subjects) {
        const cr = s.match?.credits ?? 0;
        const pts = pointsFor(s);
        if (pts === null || cr === 0) continue;
        weighted += pts * cr;
        credits += cr;
    }
    return { gpa: credits > 0 ? weighted / credits : null, credits, totalPoints: weighted };
}

export default function MarksPage() {
    const { selectedBatch, setSelectedBatch } = useBatch();
    const [origin, setOrigin] = useState('');
    const [rows, setRows] = useState<RawRow[] | null>(null);
    const [showRaw, setShowRaw] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const [pasteError, setPasteError] = useState(false);
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
                            <h2 className="text-sm font-bold text-slate-100">Step 2 · Your marks</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex bg-surface-dark/60 border border-surface-border/60 p-0.5 gap-0.5 rounded-lg">
                                    {[1, 2].map((b) => (
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
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                                            type="button"
                                            title="Print or Save PDF Marksheet"
                                        >
                                            <Printer className="w-3.5 h-3.5" />
                                            Print Marksheet
                                        </button>
                                        <button
                                            onClick={clearData}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-400 hover:text-red-400 rounded-lg text-xs font-medium"
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
                        ) : (
                            <div className="space-y-4">
                                {/* Overall GPA */}
                                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                                    <div>
                                        <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80">Overall GPA</div>
                                        <div className="text-3xl font-extrabold tabular-nums text-emerald-300">
                                            {overall.gpa === null ? '—' : overall.gpa.toFixed(2)}
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
                                                                    {r.subject.name}
                                                                    {d?.hasRetake && <span className="ml-1.5 text-[9px] text-amber-500/70">(retake)</span>}
                                                                </td>
                                                                <td className="px-2 py-1.5 text-slate-400 text-right tabular-nums">{r.subject.credits}</td>
                                                                <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums">{fmt(d?.cla ?? null)}</td>
                                                                <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums">{fmt(d?.final ?? null)}</td>
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
                                                                {s.name}
                                                                {s.hasRetake && <span className="ml-1.5 text-[9px] text-amber-500/70">(retake)</span>}
                                                            </td>
                                                            <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums w-14">{fmt(s.cla)}</td>
                                                            <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums w-14">{fmt(s.final)}</td>
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
                PRINTABLE MARKSHEET (A4 Landscape Clean White Document, fits 1 page)
            ═══════════════════════════════════════════════════════════════════ */}
            {rows && (
                <div className="hidden print:block bg-white text-slate-900 font-sans p-1 max-w-[285mm] mx-auto text-xs leading-tight">
                    {/* Header */}
                    <div className="border-b border-slate-800 pb-1 mb-1 text-center flex items-center justify-between">
                        <div className="text-[13px] font-black tracking-wide uppercase text-slate-900">
                            AceDBE · Academic Performance Report
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 tracking-wide">
                            BBA-DBE Marksheet &amp; Cumulative GPA Summary
                        </div>
                    </div>

                    {/* Single-row 6-column Metadata Banner */}
                    <div className="grid grid-cols-6 gap-x-2 bg-slate-50 border border-slate-300 rounded px-2 py-1 mb-1.5 text-[8.5px]">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-500 text-[7.5px] uppercase">Student Name</span>
                            <span className="font-extrabold text-slate-900 truncate">{studentName || 'Student'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-500 text-[7.5px] uppercase">Program / Batch</span>
                            <span className="font-semibold text-slate-900 truncate">
                                BBA-DBE {selectedBatch === 1 ? 'Batch 1 (2024–27)' : 'Batch 2 (2025–28)'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-500 text-[7.5px] uppercase">Date Generated</span>
                            <span className="font-semibold text-slate-900">
                                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-500 text-[7.5px] uppercase">Cumulative GPA</span>
                            <span className="font-extrabold text-emerald-800 text-[11px]">
                                {overall.gpa === null ? '—' : overall.gpa.toFixed(2)} <span className="text-[8px] text-slate-500 font-normal">/ 10.00</span>
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-500 text-[7.5px] uppercase">Credits Earned</span>
                            <span className="font-bold text-slate-900">{overall.credits} Credits</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-500 text-[7.5px] uppercase">Graded Courses</span>
                            <span className="font-semibold text-slate-900">{matchedCount} Subjects</span>
                        </div>
                    </div>

                    {/* Term-by-Term Marksheet Tables: Year 1 (1,2,3), Year 2 (4,5,6), Year 3 (7,8,9) */}
                    <div className="space-y-1.5">
                        {[
                            { num: 1, label: 'Year 1 (Terms 1, 2, 3)', terms: [1, 2, 3] },
                            { num: 2, label: 'Year 2 (Terms 4, 5, 6)', terms: [4, 5, 6] },
                            { num: 3, label: 'Year 3 (Terms 7, 8, 9)', terms: [7, 8, 9] },
                        ].map((year) => {
                            const groupsForYear = termGroups.filter((g) => year.terms.includes(g.term));
                            const hasData = groupsForYear.some((g) => g.rows.some((r) => r.data !== null));
                            if (!hasData) return null;

                            return (
                                <div key={year.num} className="space-y-0.5">
                                    {/* Year Line Separator */}
                                    <div className="flex items-center gap-2 pt-0.5">
                                        <div className="h-[1px] bg-slate-300 flex-1"></div>
                                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">
                                            {year.label}
                                        </span>
                                        <div className="h-[1px] bg-slate-300 flex-1"></div>
                                    </div>

                                    {/* 3 Terms in Row (grid-cols-3) */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {groupsForYear.map((group) => {
                                            return (
                                                <div key={group.term} className="border border-slate-300 rounded overflow-hidden flex flex-col justify-between bg-white shadow-none">
                                                    <div>
                                                        {/* Term Header */}
                                                        <div className="flex items-center justify-between bg-slate-100 px-1.5 py-0.5 border-b border-slate-300 text-[8px]">
                                                            <span className="font-extrabold text-slate-900 uppercase">
                                                                Term {group.term}
                                                            </span>
                                                            <span className="font-semibold text-slate-700 text-[7.5px]">
                                                                {group.credits} cr
                                                                <span className="mx-1 text-slate-400">|</span>
                                                                GPA: <span className="font-bold text-emerald-800 text-[8.5px]">{group.gpa === null ? '—' : group.gpa.toFixed(2)}</span>
                                                            </span>
                                                        </div>

                                                        {/* Mark Table */}
                                                        <table className="w-full text-left border-collapse text-[7.5px] leading-tight table-auto">
                                                            <thead>
                                                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[7px]">
                                                                    <th className="py-0.5 px-1 w-8 whitespace-nowrap">Code</th>
                                                                    <th className="py-0.5 px-1">Course Title</th>
                                                                    <th className="py-0.5 px-0.5 text-center w-4">Cr</th>
                                                                    <th className="py-0.5 px-0.5 text-right w-6">CLA</th>
                                                                    <th className="py-0.5 px-0.5 text-right w-6">Final</th>
                                                                    <th className="py-0.5 px-0.5 text-right w-7">Total</th>
                                                                    <th className="py-0.5 px-0.5 text-center w-4">Gr</th>
                                                                    <th className="py-0.5 px-0.5 text-center w-4">GP</th>
                                                                    <th className="py-0.5 px-1 text-right w-7">Pts</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {group.rows.map((r, i) => {
                                                                    const d = r.data;
                                                                    const gp = d ? pointsFor(d) : null;
                                                                    const cr = r.subject.credits;
                                                                    const pts = gp !== null ? gp * cr : null;

                                                                    return (
                                                                        <tr key={i} className={d ? 'text-slate-900' : 'text-slate-400 italic'}>
                                                                            <td className="py-0.5 px-1 font-mono text-[7px] text-slate-500 whitespace-nowrap">
                                                                                {r.subject.code || '—'}
                                                                            </td>
                                                                            <td className="py-0.5 px-1 font-medium leading-[1.15]">
                                                                                {r.subject.name}
                                                                                {d?.hasRetake && <span className="ml-0.5 text-[6.5px] text-amber-700 font-bold">*</span>}
                                                                            </td>
                                                                            <td className="py-0.5 px-0.5 text-center tabular-nums">{cr}</td>
                                                                            <td className="py-0.5 px-0.5 text-right tabular-nums">{fmt(d?.cla ?? null)}</td>
                                                                            <td className="py-0.5 px-0.5 text-right tabular-nums">{fmt(d?.final ?? null)}</td>
                                                                            <td className="py-0.5 px-0.5 text-right tabular-nums font-bold">{fmt(d?.total ?? null)}</td>
                                                                            <td className="py-0.5 px-0.5 text-center font-bold">{(d && effectiveGrade(d)) || '—'}</td>
                                                                            <td className="py-0.5 px-0.5 text-center tabular-nums">{gp !== null ? gp.toFixed(1) : '—'}</td>
                                                                            <td className="py-0.5 px-1 text-right tabular-nums font-semibold">{pts !== null ? pts.toFixed(1) : '—'}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Subtotal footer */}
                                                    <div className="bg-slate-50 border-t border-slate-200 px-1.5 py-0.5 flex items-center justify-between text-[7px] font-bold text-slate-700">
                                                        <span>Subtotal ({group.credits} cr):</span>
                                                        <span className="text-emerald-800 font-extrabold text-[7.5px]">
                                                            GPA {group.gpa?.toFixed(2) ?? '—'} · {group.totalPoints?.toFixed(1) ?? '—'} pts
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-1.5 pt-0.5 border-t border-slate-300 flex items-center justify-between text-[7px] text-slate-500">
                        <span>* Unofficial marksheet summary compiled for student reference and GPA tracking.</span>
                        <span>Generated via AceDBE</span>
                    </div>
                </div>
            )}
        </>
    );
}
