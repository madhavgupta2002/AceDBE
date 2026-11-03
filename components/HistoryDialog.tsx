'use client';

import { useEffect, useId, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Attempt, fetchSetHistory, formatDuration, pct, pctCls } from '@/lib/history';
import Link from 'next/link';
import Modal from './Modal';
import Button from './Button';

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
  const [failed, setFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const titleId = useId();

  useEffect(() => {
    let cancelled = false;
    setAttempts(null);
    setFailed(false);
    fetchSetHistory(subjectCode, set)
      .then(a => {
        if (cancelled) return;
        if (a) setAttempts(a);
        else setFailed(true);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [subjectCode, set, reload]);

  return (
    <Modal onClose={onClose} labelledBy={titleId} className="max-w-lg">
      <div>
        <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Your history</div>
            <h2 id={titleId} className="text-base font-bold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 -m-2 text-slate-400 hover:text-white" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {failed && (
            <div className="py-6 text-center text-sm" role="alert">
              <p className="text-red-300">Couldn&apos;t load history.</p>
              <Button variant="primary" size="sm" onClick={() => setReload(n => n + 1)} className="mt-2">
                Retry
              </Button>
            </div>
          )}
          {attempts === null && !failed && (
            <div className="py-6 flex justify-center" role="status" aria-label="Loading history">
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
              <div key={a.id} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2.5">
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
                <div className="mt-1 text-[11px] text-slate-400">
                  {wrong} wrong · {total - correct - wrong} unanswered
                  {a.set_keys.length > 1 && ' · part of a combined quiz'}
                </div>
                {moduleUnits.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {moduleUnits.map(u => (
                      <span key={u.key} className="px-2 py-0.5 rounded-md bg-surface-dark border border-surface-border text-[11px]">
                        M{u.module}: <span className={pctCls(pct(u.correct, u.total))}>{u.correct}/{u.total}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-4 py-2.5 border-t border-surface-border text-right">
          <Link href="/history" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            All quiz history →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
