'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, ChevronDown, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { parseGrades, type RawRow, type ParsedSubject } from '@/lib/marks/parseGrades';
import { gradePoints, gradeFromTotal } from '@/lib/cgpa/grades';
import { CGPA_TERMS } from '@/lib/cgpa/subjects';
import { useBatch } from '@/contexts/BatchContext';

const MOODLE_LOGIN_URL = 'https://moodle.iimb.ac.in/portal/';
const MOODLE_GRADE_URL = 'https://moodle.iimb.ac.in/grade/report/user/index.php';

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

    // Group matched subjects by term (sorted), keep unmatched separate.
    const termGroups = useMemo(() => {
        const byTerm = new Map<number, ParsedSubject[]>();
        for (const s of parsed) {
            if (!s.match) continue;
            const t = s.match.term;
            if (!byTerm.has(t)) byTerm.set(t, []);
            byTerm.get(t)!.push(s);
        }
        return CGPA_TERMS
            .filter((t) => byTerm.has(t))
            .map((term) => ({ term, subjects: byTerm.get(term)!, ...gpaFor(byTerm.get(term)!) }));
    }, [parsed]);

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
        if (typeof window !== 'undefined') {
            history.replaceState(null, '', window.location.pathname);
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
                        Pull your grades straight from Moodle using a one-time bookmarklet — no login or password is ever sent to this app.
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
                            <p className="text-xs">No data imported yet. Click the bookmarklet on your Moodle grade page.</p>
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
                                                {group.subjects.map((s, i) => (
                                                    <tr key={i} className="border-t border-surface-border/30">
                                                        <td className="px-3 py-1.5 text-slate-300">
                                                            {s.match?.name || s.name}
                                                            {s.hasRetake && <span className="ml-1.5 text-[9px] text-amber-500/70">(retake)</span>}
                                                        </td>
                                                        <td className="px-2 py-1.5 text-slate-400 text-right tabular-nums">{s.match?.credits ?? '—'}</td>
                                                        <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums">{fmt(s.cla)}</td>
                                                        <td className="px-2 py-1.5 text-slate-200 text-right tabular-nums">{fmt(s.final)}</td>
                                                        <td className="px-2 py-1.5 text-slate-100 text-right tabular-nums font-semibold">{fmt(s.total)}</td>
                                                        <td className="px-2 py-1.5 text-center font-bold text-slate-200">{effectiveGrade(s) || '—'}</td>
                                                    </tr>
                                                ))}
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
