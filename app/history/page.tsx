'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Chip from '@/components/Chip';
import Button from '@/components/Button';
import PageTitle from '@/components/PageTitle';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectByCode } from '@/lib/subjectMapping';
import { Attempt, AttemptMode, deleteAttempt, fetchAllAttempts, formatDuration, pct, pctCls, setLabel } from '@/lib/history';

const subjectName = (code: string) => getSubjectByCode(code)?.name ?? code;

const Tile: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
  <div className="bg-surface border border-surface-border rounded-xl px-3 py-2.5">
    <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    <div className={`text-lg font-bold ${className ?? 'text-white'}`}>{value}</div>
  </div>
);

export default function HistoryPage() {
  const { enabled, authReady, user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [subject, setSubject] = useState<string>('all');
  const [mode, setMode] = useState<AttemptMode | 'all'>('all');
  const [loadFailed, setLoadFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    setAttempts(null);
    setLoadFailed(false);
    if (!userId) return;
    let cancelled = false;
    fetchAllAttempts()
      .then(a => {
        if (cancelled) return;
        if (a) setAttempts(a);
        else setLoadFailed(true);
      })
      .catch(() => !cancelled && setLoadFailed(true));
    return () => {
      cancelled = true;
    };
  }, [userId, reload]);

  const subjects = useMemo(() => Array.from(new Set((attempts ?? []).map(a => a.subject_code))).sort(), [attempts]);
  const shown = (attempts ?? []).filter(
    a => (subject === 'all' || a.subject_code === subject) && (mode === 'all' || a.mode === mode),
  );

  const totals = shown.reduce(
    (t, a) => ({ correct: t.correct + a.correct, answered: t.answered + a.correct + a.wrong, total: t.total + a.total, time: t.time + a.time_sec }),
    { correct: 0, answered: 0, total: 0, time: 0 },
  );
  const accuracy = pct(totals.correct, totals.answered);

  // Per-subject summary for the "All subjects" view
  const bySubject = subjects.map(code => {
    const list = shown.filter(a => a.subject_code === code);
    const correct = list.reduce((n, a) => n + a.correct, 0);
    const answered = list.reduce((n, a) => n + a.correct + a.wrong, 0);
    return { code, count: list.length, accuracy: pct(correct, answered) };
  }).filter(s => s.count > 0);

  const remove = async (a: Attempt) => {
    if (!window.confirm('Delete this attempt from your history?')) return;
    setDeleteError(null);
    let ok = false;
    try {
      ok = await deleteAttempt(a.id);
    } catch {
      ok = false;
    }
    if (ok) setAttempts(prev => prev?.filter(x => x.id !== a.id) ?? null);
    else setDeleteError("Couldn't delete that attempt. Please try again.");
  };

  return (
    <div className="min-h-screen text-white relative z-[1]">
      <Header showBackButton />
      <main id="main" className="max-w-4xl mx-auto px-3 sm:px-4 py-5">
        <PageTitle
          className="mb-5 px-1"
          title="Quiz History"
          subtitle="Every quiz and CBT exam you finished while logged in"
        />

        {!authReady ? (
          <div className="py-10 flex justify-center" role="status" aria-label="Loading">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        ) : !enabled || !user ? (
          <p className="px-1 py-10 text-center text-sm text-slate-400">Log in (top right) to see your quiz history.</p>
        ) : loadFailed ? (
          <div className="px-1 py-10 text-center text-sm" role="alert">
            <p className="text-red-300">Couldn&apos;t load history.</p>
            <Button variant="primary" size="sm" onClick={() => setReload(n => n + 1)} className="mt-2">
              Retry
            </Button>
          </div>
        ) : attempts === null ? (
          <div className="py-10 flex justify-center" role="status" aria-label="Loading history">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        ) : attempts.length === 0 ? (
          <p className="px-1 py-10 text-center text-sm text-slate-400">
            No attempts yet. Finish a quiz from any <Link href="/" className="text-emerald-400 hover:underline">subject</Link> and it shows up here.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2 px-1 scrollbar-none">
              <Chip active={subject === 'all'} onClick={() => setSubject('all')}>All subjects</Chip>
              {subjects.map(code => (
                <Chip key={code} active={subject === code} onClick={() => setSubject(code)}>
                  {subjectName(code)}
                </Chip>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-4 px-1">
              {(['all', 'practice', 'cbt'] as const).map(m => (
                <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
                  {m === 'all' ? 'All modes' : m === 'cbt' ? 'CBT' : 'Practice'}
                </Chip>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <Tile label="Attempts" value={String(shown.length)} />
              <Tile label="Accuracy" value={`${accuracy}%`} className={pctCls(accuracy)} />
              <Tile label="Questions answered" value={`${totals.answered}/${totals.total}`} />
              <Tile label="Time spent" value={formatDuration(totals.time)} />
            </div>

            {subject === 'all' && bySubject.length > 1 && (
              <div className="mb-5 bg-surface border border-surface-border rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">By subject</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {bySubject.map(s => (
                    <button
                      key={s.code}
                      onClick={() => setSubject(s.code)}
                      className="flex items-center justify-between text-sm hover:text-emerald-300 text-left"
                    >
                      <span className="truncate">{subjectName(s.code)}</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {s.count} {s.count === 1 ? 'attempt' : 'attempts'} · <span className={pctCls(s.accuracy)}>{s.accuracy}%</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2" role="list" aria-label="Quiz attempts">
              {deleteError && (
                <p role="alert" className="px-1 text-xs text-red-300">
                  {deleteError}
                </p>
              )}
              {shown.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No attempts match these filters.</p>}
              {shown.map(a => {
                const p = pct(a.correct, a.total);
                return (
                  <div key={a.id} role="listitem" className="bg-surface border border-surface-border rounded-xl px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                          <Link href={`/${a.subject_code}`} className="truncate hover:text-emerald-300">
                            {subjectName(a.subject_code)}
                          </Link>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              a.mode === 'cbt' ? 'bg-violet-900/60 text-violet-200' : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {a.mode === 'cbt' ? 'CBT' : 'Practice'}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {new Date(a.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                          {formatDuration(a.time_sec)} · {a.wrong} wrong · {a.total - a.correct - a.wrong} unanswered
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`text-sm font-bold ${pctCls(p)}`}>
                          {a.correct}/{a.total} <span className="text-xs font-semibold">({p}%)</span>
                        </div>
                        <button onClick={() => remove(a)} className="p-2 -m-1 text-slate-400 hover:text-red-300" aria-label="Delete attempt">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {a.set_keys.map(set => {
                        const units = a.units.filter(u => u.set === set);
                        const correct = units.reduce((n, u) => n + u.correct, 0);
                        const total = units.reduce((n, u) => n + u.total, 0);
                        const mods = units.filter(u => u.module !== '').map(u => `M${u.module}`);
                        return (
                          <span key={set} className="px-2 py-0.5 rounded-md bg-surface-dark border border-surface-border text-[11px]">
                            {setLabel(set)}
                            {mods.length > 0 && <span className="text-slate-400"> ({mods.join(', ')})</span>}:{' '}
                            <span className={pctCls(pct(correct, total))}>{correct}/{total}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
