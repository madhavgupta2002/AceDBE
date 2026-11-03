'use client';

// Orchestrator for /marks: owns state + localStorage persistence and edit handlers;
// rendering is delegated to components/marks/* (ImportPanel, SummaryCards, SubjectTable, PrintTable).
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Copy, Download, RotateCcw, Trash2, User } from 'lucide-react';
import { parseGrades, parsePastedText, detectBatchFromText, type RawRow, type ParsedSubject } from '@/lib/marks/parseGrades';
import { gradeFromTotal, type LetterGrade } from '@/lib/cgpa/grades';
import type { CgpaSubject } from '@/lib/cgpa/subjects';
import { useBatch, AVAILABLE_BATCHES } from '@/contexts/BatchContext';
import Button from '@/components/Button';
import ImportPanel from '@/components/marks/ImportPanel';
import SubjectTable from '@/components/marks/SubjectTable';
import SummaryCards from '@/components/marks/SummaryCards';
import PrintTable from '@/components/marks/PrintTable';
import {
    STORAGE_KEY_ROWS,
    STORAGE_KEY_MANUAL,
    STORAGE_KEY_NAME,
    buildBookmarklet,
    buildTermGroups,
    decodeImport,
    extractStudentName,
    gpaFor,
    type ManualSubjectMark,
} from '@/components/marks/utils';

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
    const termGroups = useMemo(
        () => buildTermGroups(parsedById, manualMarks, selectedBatch),
        [parsedById, manualMarks, selectedBatch]
    );

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

    // Opens the browser's print dialog; the print-only marksheet below is what gets printed / saved as PDF.
    const handleDownload = () => {
        window.print();
    };

    const cardCls = 'bg-surface border border-surface-border/60 rounded-xl p-4 sm:p-5 shadow-sm';

    return (
        <>
            {/* SCREEN UI (interactive, hidden on print) */}
            <div id="main" role="main" className="min-h-screen relative z-[1] text-white print:hidden">
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
                                aria-label="Student name"
                                onChange={(e) => setCustomStudentName(e.target.value)}
                                placeholder={extractedName || 'Student Name (optional)'}
                                className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-36 sm:w-48"
                                title="Student name for statement of marks"
                            />
                        </div>
                    </div>


                    {/* Step 1 · Moodle Import (collapsible) */}
                    <ImportPanel
                        open={showImporter}
                        onToggle={() => setShowImporter(!showImporter)}
                        rowCount={rows ? rows.length : null}
                        pasteText={pasteText}
                        pasteError={pasteError}
                        bookmarkletHref={bookmarkletHref}
                        onPaste={ingestPaste}
                        onPasteFromClipboard={pasteFromClipboard}
                    />

                    {/* Step 2 · Curriculum skeleton & interactive marks */}
                    <div className={cardCls}>
                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-sm font-bold text-slate-100">Your Marks</h2>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex bg-surface-dark/70 border border-surface-border/60 p-0.5 rounded-lg" role="group" aria-label="Batch">
                                    {AVAILABLE_BATCHES.map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setSelectedBatch(b)}
                                            aria-pressed={selectedBatch === b}
                                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                                                selectedBatch === b ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                                            }`}
                                            type="button"
                                        >
                                            Batch {b}
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleDownload}
                                    title="Download marksheet (choose Save as PDF in the print dialog)"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </Button>

                                {manualMarksCount > 0 && (
                                    <button
                                        onClick={resetAllManualMarks}
                                        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-slate-400 hover:text-sky-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                        type="button"
                                        title="Undo all manual edits, keep imported marks"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Undo edits ({manualMarksCount})
                                    </button>
                                )}

                                {(rows || manualMarksCount > 0) && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Clear all imported marks and edits?')) clearData();
                                        }}
                                        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-slate-400 hover:text-red-400 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                        type="button"
                                        title="Clear all marks"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <SummaryCards
                            overall={overall}
                            totalCurriculumCredits={totalCurriculumCredits}
                            overallMarksStats={overallMarksStats}
                            filledCount={allFilledSubjects.length}
                            totalSubjects={totalCurriculumSubjects}
                            unmatchedCount={unmatched.length}
                        />

                        <SubjectTable
                            termGroups={termGroups}
                            unmatched={unmatched}
                            filledCount={allFilledSubjects.length}
                            onUpdateField={updateSubjectField}
                            onUpdateGrade={updateSubjectGrade}
                            onToggleRetake={toggleSubjectRetake}
                            onResetRow={resetSubjectRow}
                        />

                        {/* Collapsible raw scraped JSON */}
                        {rows && (
                            <details
                                open={showRaw}
                                onToggle={(e) => setShowRaw((e.target as HTMLDetailsElement).open)}
                                className="mt-2 rounded-lg border border-surface-border/50"
                            >
                                <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer text-[10px] font-semibold text-slate-400 uppercase tracking-widest select-none">
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
                                        aria-label="Copy raw JSON"
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
                </div>
            </div>

            {/* PRINTABLE MARKSHEET (3 pages, 1 year = 3 terms per page) */}
            <PrintTable
                termGroups={termGroups}
                studentName={studentName}
                batch={selectedBatch}
                overall={overall}
                totalCurriculumCredits={totalCurriculumCredits}
                overallMarksStats={overallMarksStats}
            />
        </>
    );
}
