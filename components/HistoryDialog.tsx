'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X } from 'lucide-react';
import { Attempt, fetchSetHistory, formatDuration, pct, pctCls } from '@/lib/history';
import Link from 'next/link';

/** Past attempts that included one question set, showing only that set's part of each attempt. */
export default function HistoryDialog({
  subjectCode,
  set,
  title,
  onClose,
}: {
  subjectCode: string;
  set: string;
  title: string;
  onClose: () => void;
}) {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSetHistory(subjectCode, set).then(a => !cancelled && setAttempts(a));
    return () => {
      cancelled = true;
    };
  }, [subjectCode, set]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 p-3 overflow-y-auto" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-200"
      >
        <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Your history</div>
            <h2 className="text-base font-bold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {attempts === null && (
            <div className="py-6 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            </div>
          )}
          {attempts?.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No attempts yet.</p>}
          {attempts?.map(a => {
            const units = a.units.filter(u => u.set === set);
            const correct = units.reduce((n, u) => n + u.correct, 0);
            const total = units.reduce((n, u) => n + u.total, 0);
            const wrong = units.reduce((n, u) => n + u.wrong, 0);
            const p = pct(correct, total);
            const moduleUnits = units.filter(u => u.module !== '');
            return (
              <div key={a.id} className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.mode === 'cbt' ? 'bg-violet-900/60 text-violet-200' : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {a.mode === 'cbt' ? 'CBT' : 'Practice'}
                    </span>
                    {new Date(a.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    <span>· {formatDuration(a.time_sec)}</span>
                  </div>
                  <div className={`text-sm font-bold ${pctCls(p)}`}>
                    {correct}/{total} <span className="text-xs font-semibold">({p}%)</span>
                  </div>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {wrong} wrong · {total - correct - wrong} unanswered
                  {a.set_keys.length > 1 && ' · part of a combined quiz'}
                </div>
                {moduleUnits.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {moduleUnits.map(u => (
                      <span key={u.key} className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700/60 text-[11px]">
                        M{u.module}: <span className={pctCls(pct(u.correct, u.total))}>{u.correct}/{u.total}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-4 py-2.5 border-t border-slate-700 text-right">
          <Link href="/history" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            All quiz history →
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
