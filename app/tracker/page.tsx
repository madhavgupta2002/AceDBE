'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chip from '@/components/Chip';
import PageTitle from '@/components/PageTitle';
import { Loader2 } from 'lucide-react';
import { useBatch } from '@/contexts/BatchContext';
import { getSubjectsByBatch, getDisplayNameForAlias, getTermsForBatch } from '@/lib/subjectMapping';
import { CheckKind, isModuleDone, useModules, useProgress } from '@/lib/progress';
import { useAuth } from '@/contexts/AuthContext';

const Ring: React.FC<{ value: number; size: number }> = ({ value, size }) => {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0 -rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#1e293b" strokeWidth="4" />
      <circle
        cx="18" cy="18" r={r} fill="none" stroke={value === 100 ? '#34d399' : '#10b981'} strokeWidth="4"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} strokeLinecap="round"
        className="transition-[stroke-dashoffset] duration-500"
      />
      {size >= 30 && (
        <text x="18" y="18" transform="rotate(90 18 18)" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="700" fill="#cbd5e1">
          {value}
        </text>
      )}
    </svg>
  );
};

// The table cell itself, split on its diagonal: upper-left = videos (rose), lower-right = questions (sky).
// Both done → whole cell turns emerald with a check.
const ModuleTile: React.FC<{
  label: string;
  video: boolean;
  questions: boolean;
  onToggle: (kind: CheckKind) => void;
  onToggleBoth: () => void;
}> = ({ label, video, questions, onToggle, onToggleBoth }) => {
  const done = video && questions;
  const tri =
    'cursor-pointer transition-[fill,opacity] duration-200 hover:opacity-80 outline-none focus-visible:stroke-white focus-visible:stroke-2';
  const keyToggle = (kind: CheckKind) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(kind);
    }
  };
  return (
    <div className="relative w-full h-full" onDoubleClick={onToggleBoth}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full block select-none">
        <polygon
          points="0,0 100,0 0,100"
          className={tri}
          fill={done ? 'url(#tracker-g-done)' : video ? 'url(#tracker-g-vid)' : 'rgba(30,41,59,0.6)'}
          onClick={() => onToggle('video')}
          onKeyDown={keyToggle('video')}
          tabIndex={0}
          vectorEffect="non-scaling-stroke"
          role="button"
          aria-pressed={video}
          aria-label={`${label} videos`}
        >
          <title>Videos</title>
        </polygon>
        <polygon
          points="100,0 100,100 0,100"
          className={tri}
          fill={done ? 'url(#tracker-g-done)' : questions ? 'url(#tracker-g-q)' : 'rgba(15,23,42,0.6)'}
          onClick={() => onToggle('questions')}
          onKeyDown={keyToggle('questions')}
          tabIndex={0}
          vectorEffect="non-scaling-stroke"
          role="button"
          aria-pressed={questions}
          aria-label={`${label} questions`}
        >
          <title>Questions</title>
        </polygon>
        {!done && (
          <line x1="100" y1="0" x2="0" y2="100" stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {/* Icons as HTML overlays so they don't stretch with the cell */}
      <div className="absolute inset-0 pointer-events-none text-[11px] font-bold">
        {done ? (
          <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto w-5 h-5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 L10 17.5 L19 7.5" />
          </svg>
        ) : (
          <>
            <span className={`absolute top-1 left-1.5 ${video ? 'text-white' : 'text-slate-400'}`}>▶</span>
            <span className={`absolute bottom-1 right-1.5 ${questions ? 'text-white' : 'text-slate-400'}`}>?</span>
          </>
        )}
      </div>
    </div>
  );
};

export default function TrackerPage() {
  const { selectedBatch, selectedTerm, setSelectedTerm } = useBatch();
  const { progress, setChecks, syncStatus, retrySync } = useProgress();
  const { user } = useAuth();

  const terms = getTermsForBatch(selectedBatch);
  const allSubjects = getSubjectsByBatch(selectedBatch);
  const modules = useModules(allSubjects.map(s => s.alias.code));

  const stats = (code: string) => {
    const mods = modules[code] ?? [];
    const p = progress[code] ?? {};
    return {
      total: mods.length,
      done: mods.filter(m => isModuleDone(p[m])).length,
      video: mods.filter(m => p[m]?.video).length,
      questions: mods.filter(m => p[m]?.questions).length,
    };
  };

  const termStats = (term: number) =>
    allSubjects
      .filter(s => s.alias.term === term)
      .reduce(
        (acc, s) => {
          const st = stats(s.alias.code);
          return { done: acc.done + st.done, total: acc.total + st.total };
        },
        { done: 0, total: 0 },
      );

  const subjectsForTerm = allSubjects.filter(s => s.alias.term === selectedTerm);

  // Union of module numbers across the term's subjects
  const rows = Array.from(new Set(subjectsForTerm.flatMap(s => modules[s.alias.code] ?? []))).sort(
    (a, b) => Number(a) - Number(b),
  );

  const loading = allSubjects.some(s => modules[s.alias.code] === undefined);
  const termTotals = termStats(selectedTerm);
  const pct = (d: number, t: number) => (t ? Math.round((d / t) * 100) : 0);

  return (
    <div className="min-h-screen text-white relative z-[1]">
      <Header showBackButton wide />
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="tracker-g-vid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="tracker-g-q" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="tracker-g-done" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
      <main id="main" className="max-w-6xl mx-auto px-3 sm:px-4 py-5">
        {/* Title + term overview */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 px-1">
          <PageTitle
            title="Progress Tracker"
            subtitle={
              <>
                Batch {selectedBatch} ·{' '}
                <span role="status" aria-live="polite">
                  {!user ? 'saved on this device' : syncStatus === 'synced' ? 'synced to your account' : syncStatus === 'error' ? 'sync failed · changes saved on this device' : 'syncing…'}
                </span>
                {user && syncStatus === 'error' && (
                  <button onClick={() => void retrySync()} className="ml-2 font-medium text-red-300 hover:text-red-200 underline underline-offset-2">
                    Retry sync
                  </button>
                )}
              </>
            }
          />
          <div className="flex items-center gap-3">
            <Ring value={pct(termTotals.done, termTotals.total)} size={44} />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Term {selectedTerm}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                {termTotals.done}/{termTotals.total} modules
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-5 px-1 scrollbar-none">
          {terms.map(term => {
            const { done, total } = termStats(term);
            const active = term === selectedTerm;
            return (
              <Chip key={term} active={active} onClick={() => setSelectedTerm(term)} className="gap-2 pl-1.5 pr-3">
                <Ring value={pct(done, total)} size={22} />
                <span className="font-semibold">T{term}</span>
              </Chip>
            );
          })}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center" role="status" aria-label="Loading modules">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-1 py-10 text-center text-sm text-slate-400">
            No modules to track for Term {selectedTerm}. They may not be available yet, or couldn&apos;t be loaded. Try reloading the page.
          </p>
        ) : (
        <div className="flex flex-col items-center gap-2">
          {/* Grid: modules (rows) × subjects (columns) */}
          <div className="max-w-full overflow-x-auto rounded-2xl border border-surface-border/60 bg-surface shadow-lg shadow-black/20">
            <table className="text-xs border-collapse table-fixed" aria-label={`Module progress for term ${selectedTerm}`}>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-[1] bg-surface w-16 min-w-16 border-b border-r border-surface-border" />
                  {subjectsForTerm.map(({ subject, alias }) => {
                    return (
                      <th key={alias.code} scope="col" className="w-16 min-w-16 max-w-16 border-b border-l border-surface-border py-2 font-normal align-top">
                        <Link
                          href={`/${alias.code}`}
                          title={getDisplayNameForAlias(subject, alias)}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <span className="text-[11px] font-bold font-mono text-emerald-300/90">
                            {alias.code.replace(/_B\d$/, '')}
                          </span>
                          <span className="text-[9px] leading-tight font-medium text-slate-300 group-hover:text-emerald-300 line-clamp-3 break-words px-1">
                            {getDisplayNameForAlias(subject, alias)}
                          </span>
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map(m => {
                  return (
                    <tr key={m}>
                      <td
                        title={m}
                        className="sticky left-0 z-[1] bg-surface w-16 min-w-16 max-w-16 h-16 border-r border-b border-surface-border text-center"
                      >
                        <span className="text-[11px] font-semibold text-slate-300 leading-tight">
                          Module {m}
                        </span>
                      </td>
                  {subjectsForTerm.map(({ alias }) => {
                    const code = alias.code;
                    if (!(modules[code] ?? []).includes(m)) {
                      return <td key={code} className="w-16 h-16 border-b border-l border-surface-border bg-[repeating-linear-gradient(45deg,transparent_0_6px,rgba(51,65,85,0.25)_6px_7px)]" />;
                    }
                    const p = progress[code]?.[m];
                    return (
                      <td key={code} className="p-0 border-b border-l border-surface-border w-16 min-w-16 max-w-16 h-16">
                          <ModuleTile
                            label={`${code} ${m}`}
                            video={!!p?.video}
                            questions={!!p?.questions}
                            onToggle={kind => setChecks(code, m, { [kind]: !p?.[kind] })}
                            onToggleBoth={() => {
                              const done = isModuleDone(p);
                              setChecks(code, m, { video: !done, questions: !done });
                            }}
                          />
                      </td>
                    );
                  })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400">
            <span className="text-rose-400">◤</span> Videos · <span className="text-sky-400">◢</span> Questions · double-tap for both
          </p>

        </div>
        )}
      </main>
    </div>
  );
}
