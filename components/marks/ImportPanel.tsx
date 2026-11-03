'use client';
// Collapsible "Moodle Import" card: paste box, clipboard button and drag-to-bookmarks import bookmarklet.
import React, { useEffect, useRef } from 'react';
import { Bookmark, ChevronDown, ClipboardPaste } from 'lucide-react';
import { MOODLE_GRADE_URL } from './utils';

type ImportPanelProps = {
    open: boolean;
    onToggle: () => void;
    rowCount: number | null;
    pasteText: string;
    pasteError: boolean;
    bookmarkletHref: string;
    onPaste: (text: string) => void;
    onPasteFromClipboard: () => void;
};

export default function ImportPanel({ open, onToggle, rowCount, pasteText, pasteError, bookmarkletHref, onPaste, onPasteFromClipboard }: ImportPanelProps) {
    const bookmarkletRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (bookmarkletRef.current && bookmarkletHref) {
            bookmarkletRef.current.setAttribute('href', bookmarkletHref);
        }
    }, [bookmarkletHref]);

    return (
        <div className="bg-surface border border-surface-border/60 rounded-xl p-4 sm:p-5 shadow-sm">
            <button
                type="button"
                className="w-full flex items-center justify-between cursor-pointer select-none text-left"
                aria-expanded={open}
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <ClipboardPaste className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                            <span>Moodle Import</span>
                            <span className="text-[10px] font-normal text-slate-400">
                                {rowCount !== null ? `${rowCount} rows loaded` : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <span className="text-slate-400 hover:text-white p-1 rounded transition-colors">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
                </span>
            </button>
        
            {open && (
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
                        aria-label="Paste Moodle grade report"
                        onChange={(e) => onPaste(e.target.value)}
                        placeholder="Paste grade report"
                        rows={3}
                        className="w-full rounded-lg bg-surface-dark/70 border border-surface-border/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-y font-mono"
                    />
                    {pasteError && (
                        <p className="text-amber-400">
                            No grades found. Copy the whole page, or enter marks below.
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <button
                            onClick={onPasteFromClipboard}
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
    );
}
