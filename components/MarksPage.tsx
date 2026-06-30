'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, ChevronDown, ClipboardPaste, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { parseGrades, parsePastedText, type RawRow, type ParsedSubject } from '@/lib/marks/parseGrades';
import { gradePoints, gradeFromTotal } from '@/lib/cgpa/grades';
import { CGPA_TERMS, getSubjectsForTerm } from '@/lib/cgpa/subjects';
import { useBatch } from '@/contexts/BatchContext';

const MOODLE_LOGIN_URL = 'https://moodle.iimb.ac.in/portal/';
const MOODLE_GRADE_URL = 'https://moodle.iimb.ac.in/grade/report/user/index.php?id=6211';

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

// Effective grade points for a subject: prefer the Moodle letter grade,
// otherwise derive from the Total (out of 100).
function pointsFor(s: ParsedSubject): number | null {
    const fromLetter = gradePoints(s.grade);
    if (fromLetter !== null) return fromLetter;
    if (s.total !== null) return gradeFromTotal(s.total).points;
    return null;
}

function effectiveGrade(s: ParsedSubject): string | null {
    if (gradePoints(s.grade) !== null) return (s.grade || '').trim().toUpperCase();
    if (s.total !== null) return gradeFromTotal(s.total).letter;
    return null;
}

// Credit-weighted GPA across the given subjects (null if no graded credits).
function gpaFor(subjects: ParsedSubject[]): { gpa: number | null; credits: number } {
    let weighted = 0;
    let credits = 0;
    for (const s of subjects) {
        const cr = s.match?.credits ?? 0;
        const pts = pointsFor(s);
        if (pts === null || cr === 0) continue;
        weighted += pts * cr;
        credits += cr;
    }
    return { gpa: credits > 0 ? weighted / credits : null, credits };
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

    const parsed = useMemo<ParsedSubject[]>(() => (rows ? parseGrades(rows, selectedBatch) : []), [rows, selectedBatch]);
    const matchedCount = useMemo(() => parsed.filter((p) => p.match).length, [parsed]);

    // Show EVERY curriculum subject for each term; fill in marks where we have
    // them, leave the rest blank. Always renders all terms for the batch.
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

    const cardCls =
        'bg-surface border border-surface-border/60 rounded-xl p-4 sm:p-5';

    return (
        <div className="min-h-screen relative z-[1] text-white">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Marks Import</h1>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Pull your grades from Moodle with a one-time bookmarklet, or just copy &amp; paste your grade page on mobile — no login or password is ever sent to this app.
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
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <h2 className="text-sm font-bold text-slate-100">Step 2 · Your marks</h2>
                        <div className="flex items-center gap-2">
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
                                <button
                                    onClick={clearData}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-light hover:bg-surface border border-surface-border/60 text-slate-400 hover:text-red-400 rounded-lg text-xs font-medium"
                                    type="button"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear
                                </button>
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
    );
}
