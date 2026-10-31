'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectByCode } from '@/lib/subjectMapping';
import { Attempt, AttemptMode, deleteAttempt, fetchAllAttempts, formatDuration, pct, pctCls, setLabel } from '@/lib/history';

const chipCls = (active: boolean) =>
  `h-8 px-3 shrink-0 text-xs font-medium border rounded-lg transition-colors ${
    active
      ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
      : 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-700/70 hover:text-white'
  }`;

const subjectName = (code: string) => getSubjectByCode(code)?.name ?? code;

const Tile: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
  <div className="bg-surface border border-surface-border/60 rounded-xl px-3 py-2.5">
    <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    <div className={`text-lg font-bold ${className ?? 'text-white'}`}>{value}</div>
  </div>
);

export default function HistoryPage() {
  const { enabled, user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [subject, setSubject] = useState<string>('all');
  const [mode, setMode] = useState<AttemptMode | 'all'>('all');

  useEffect(() => {
    if (!user) return setAttempts(null);
    let cancelled = false;
    fetchAllAttempts().then(a => !cancelled && setAttempts(a));
    return () => {
      cancelled = true;
    };
  }, [user]);

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
    if (await deleteAttempt(a.id)) setAttempts(prev => prev?.filter(x => x.id !== a.id) ?? null);
  };

  return (
    <div className="min-h-screen text-white relative z-[1]">
      <Header showBackButton />
      <div className="container mx-auto px-3 sm:px-4 py-5 max-w-4xl">
        <div className="mb-5 px-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Quiz History</h1>
          <p className="text-xs text-slate-500 mt-0.5">Every quiz and CBT exam you finished while logged in</p>
        </div>

        {!enabled || !user ? (
          <p className="px-1 py-10 text-center text-sm text-slate-400">Log in (top right) to see your quiz history.</p>
        ) : attempts === null ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        ) : attempts.length === 0 ? (
          <p className="px-1 py-10 text-center text-sm text-slate-400">
            No attempts yet. Finish a quiz from any <Link href="/" className="text-emerald-400 hover:underline">subject</Link> and it shows up here.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2 px-1 scrollbar-none">
              <button className={chipCls(subject === 'all')} onClick={() => setSubject('all')}>All subjects</button>
              {subjects.map(code => (
                <button key={code} className={chipCls(subject === code)} onClick={() => setSubject(code)}>
                  {subjectName(code)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-4 px-1">
              {(['all', 'practice', 'cbt'] as const).map(m => (
                <button key={m} className={chipCls(mode === m)} onClick={() => setMode(m)}>
                  {m === 'all' ? 'All modes' : m === 'cbt' ? 'CBT' : 'Practice'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <Tile label="Attempts" value={String(shown.length)} />
              <Tile label="Accuracy" value={`${accuracy}%`} className={pctCls(accuracy)} />
              <Tile label="Questions answered" value={`${totals.answered}/${totals.total}`} />
              <Tile label="Time spent" value={formatDuration(totals.time)} />
            </div>

            {subject === 'all' && bySubject.length > 1 && (
              <div className="mb-5 bg-surface border border-surface-border/60 rounded-xl p-3">
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

            <div className="space-y-2">
              {shown.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No attempts match these filters.</p>}
              {shown.map(a => {
                const p = pct(a.correct, a.total);
                return (
                  <div key={a.id} className="bg-surface border border-surface-border/60 rounded-xl px-3 py-2.5">
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
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {new Date(a.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                          {formatDuration(a.time_sec)} · {a.wrong} wrong · {a.total - a.correct - a.wrong} unanswered
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`text-sm font-bold ${pctCls(p)}`}>
                          {a.correct}/{a.total} <span className="text-xs font-semibold">({p}%)</span>
                        </div>
                        <button onClick={() => remove(a)} className="p-1 text-slate-500 hover:text-red-300" aria-label="Delete attempt">
                          <Trash2 className="w-3.5 h-3.5" />
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
                          <span key={set} className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700/60 text-[11px]">
                            {setLabel(set)}
                            {mods.length > 0 && <span className="text-slate-500"> ({mods.join(', ')})</span>}:{' '}
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
      </div>
    </div>
  );
}
