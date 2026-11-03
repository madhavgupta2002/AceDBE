'use client';
// Numeric mark cell: keeps the raw typed text while focused, validates (digits / 'ab' for Absent) and re-formats on blur.
import React, { useEffect, useState } from 'react';
import { formatDisplayMark } from './utils';

type MarkInputProps = {
    value: number | null | undefined;
    text?: string | null; // non-numeric display value, e.g. 'Absent'
    label: string;
    bold?: boolean;
    allowAbsent?: boolean;
    onCommit: (val: number | null, text?: string | null) => void;
};

// Numeric cell that keeps the raw typed text while focused and re-formats on blur.
const MarkInput: React.FC<MarkInputProps> = ({ value, text, label, bold, allowAbsent, onCommit }) => {
    const display = text || formatDisplayMark(value);
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState(display);

    useEffect(() => {
        if (!focused) setDraft(display);
    }, [display, focused]);

    return (
        <input
            type="text"
            inputMode="decimal"
            value={draft}
            placeholder="—"
            aria-label={label}
            title={label}
            onFocus={(e) => {
                setFocused(true);
                e.target.select();
            }}
            onBlur={() => {
                setFocused(false);
                setDraft(display);
            }}
            onChange={(e) => {
                const val = e.target.value;
                const isAbsent = allowAbsent && /^ab/i.test(val.trim());
                if (val && !isAbsent && !/^\d*\.?\d*$/.test(val)) return;
                setDraft(val);
                if (!val.trim()) {
                    onCommit(null, null);
                } else if (allowAbsent && val.trim().toLowerCase().startsWith('ab')) {
                    onCommit(null, 'Absent');
                } else {
                    const num = parseFloat(val);
                    if (Number.isFinite(num)) onCommit(num, null);
                }
            }}
            className={`w-full px-1.5 py-1 text-right text-xs font-mono tabular-nums rounded-md bg-transparent border border-transparent hover:border-surface-border focus:border-emerald-500/70 focus:bg-surface-dark placeholder:text-slate-500 focus:outline-none transition-colors ${
                bold ? 'font-semibold text-slate-100' : 'text-slate-300'
            }`}
        />
    );
};

export default MarkInput;
