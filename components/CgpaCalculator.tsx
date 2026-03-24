'use client';

import React, { useMemo, useState } from 'react';
import { gradeFromTotal, isValidTotal, parseNumberOrNull, type LetterGrade } from '@/lib/cgpa/grades';
import { CGPA_TERMS, getAllSubjects, type CgpaSubject } from '@/lib/cgpa/subjects';
import { Award, Trash2 } from 'lucide-react';

type MarksInput = {
  total: string;
  internal: string;
  final: string;
  gradeOverride: '' | LetterGrade;
};

type ComputedMark = {
  isCounted: boolean;
  usedMode: 'total' | 'internalFinal' | null;
  computedTotal: number | null;
  gradeLetter: string | null;
  gradePoints: number | null;
  inputError: string | null;
  isOverride: boolean;
};

const emptyMarks: MarksInput = { total: '', internal: '', final: '', gradeOverride: '' };

function computeForSubject(subject: CgpaSubject, input: MarksInput | undefined): ComputedMark {
  const marks = input || emptyMarks;
  const totalVal = parseNumberOrNull(marks.total);

  if (marks.gradeOverride) {
    const letter = marks.gradeOverride;
    const points = gradeFromTotal(
      letter === 'O' ? 91 : letter === 'A' ? 81 : letter === 'B' ? 71 :
        letter === 'C' ? 61 : letter === 'D' ? 51 : letter === 'E' ? 41 : 0
    ).points;
    return {
      isCounted: true,
      usedMode: totalVal !== null ? 'total' : (parseNumberOrNull(marks.internal) !== null || parseNumberOrNull(marks.final) !== null ? 'internalFinal' : null),
      computedTotal: null,
      gradeLetter: letter,
      gradePoints: points,
      inputError: null,
      isOverride: true,
    };
  }

  if (totalVal !== null) {
    if (!isValidTotal(totalVal)) {
      return { isCounted: false, usedMode: 'total', computedTotal: null, gradeLetter: null, gradePoints: null, inputError: 'Total must be 0–100.', isOverride: false };
    }
    const grade = gradeFromTotal(totalVal);
    return { isCounted: true, usedMode: 'total', computedTotal: totalVal, gradeLetter: grade.letter, gradePoints: grade.points, inputError: null, isOverride: false };
  }

  const internalVal = parseNumberOrNull(marks.internal);
  const finalVal = parseNumberOrNull(marks.final);

  if (internalVal === null && finalVal === null) {
    return { isCounted: false, usedMode: null, computedTotal: null, gradeLetter: null, gradePoints: null, inputError: null, isOverride: false };
  }

  if (internalVal === null || finalVal === null) {
    return { isCounted: false, usedMode: 'internalFinal', computedTotal: null, gradeLetter: null, gradePoints: null, inputError: 'Enter both Internal and Final (or use Total).', isOverride: false };
  }

  const sum = internalVal + finalVal;
  if (!isValidTotal(sum)) {
    return { isCounted: false, usedMode: 'internalFinal', computedTotal: null, gradeLetter: null, gradePoints: null, inputError: 'I + F must sum to 0–100.', isOverride: false };
  }

  const grade = gradeFromTotal(sum);
  return { isCounted: true, usedMode: 'internalFinal', computedTotal: sum, gradeLetter: grade.letter, gradePoints: grade.points, inputError: null, isOverride: false };
}

function fmt(value: number | null, fractionDigits = 2) {
  if (value === null) return '—';
  return value.toFixed(fractionDigits);
}

function clampLabel(value: string, max = 52) {
  const v = value.trim();
  if (v.length <= max) return v;
  return `${v.slice(0, max - 1)}…`;
}

function yearTerms(year: 1 | 2 | 3): number[] {
  if (year === 1) return [1, 2, 3];
  if (year === 2) return [4, 5, 6];
  return [7, 8, 9];
}

const GRADE_BADGE: Record<string, string> = {
  O: 'border-emerald-700/60 bg-emerald-900/20 text-emerald-300',
  A: 'border-sky-700/60 bg-sky-900/20 text-sky-300',
  B: 'border-violet-700/60 bg-violet-900/20 text-violet-300',
  C: 'border-amber-700/60 bg-amber-900/20 text-amber-300',
  D: 'border-orange-700/60 bg-orange-900/20 text-orange-300',
  E: 'border-red-700/60 bg-red-900/20 text-red-300',
  F: 'border-red-600 bg-red-950 text-red-400',
};

export default function CgpaCalculator() {
  const [marksById, setMarksById] = useState<Record<string, MarksInput>>({});
  const allSubjects = useMemo(() => getAllSubjects(), []);

  // Per-term stats
  const termStatsMap = useMemo(() => {
    const map = new Map<number, { credits: number; qp: number }>();
    for (const term of CGPA_TERMS) map.set(term, { credits: 0, qp: 0 });
    for (const subject of allSubjects) {
      const c = computeForSubject(subject, marksById[subject.id]);
      if (!c.isCounted || c.gradePoints === null) continue;
      const acc = map.get(subject.term)!;
      acc.credits += subject.credits;
      acc.qp += c.gradePoints * subject.credits;
    }
    return map;
  }, [allSubjects, marksById]);

  const termStats = useMemo(() =>
    CGPA_TERMS.map(term => {
      const acc = termStatsMap.get(term)!;
      return { term, credits: acc.credits, sgpa: acc.credits > 0 ? acc.qp / acc.credits : null };
    }), [termStatsMap]);

  const overallStats = useMemo(() => {
    let credits = 0, qp = 0;
    for (const subject of allSubjects) {
      const c = computeForSubject(subject, marksById[subject.id]);
      if (!c.isCounted || c.gradePoints === null) continue;
      credits += subject.credits;
      qp += c.gradePoints * subject.credits;
    }
    return { credits, cgpa: credits > 0 ? qp / credits : null };
  }, [allSubjects, marksById]);

  const updateMarks = (subjectId: string, patch: Partial<MarksInput>) => {
    setMarksById(prev => ({
      ...prev,
      [subjectId]: { ...(prev[subjectId] || emptyMarks), ...patch },
    }));
  };

  const clearAll = () => {
    if (window.confirm('Clear all CGPA inputs?')) setMarksById({});
  };

  const inputCls = 'bg-gray-900 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/70 focus:border-indigo-500/70 text-gray-100 rounded px-2 py-1 text-xs tabular-nums placeholder:text-gray-600 transition-colors w-full';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">CGPA Calculator</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Enter <span className="text-gray-300 font-medium">Internal + Final</span>, or fill <span className="text-gray-300 font-medium">Total</span> directly. Grade dropdown overrides auto-calc.
            </p>
          </div>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-red-800/60 text-gray-400 hover:text-red-400 rounded transition-all text-xs font-medium self-start sm:self-auto"
            type="button"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>

        {/* ── Summary bar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5 mb-4">
          {/* CGPA tile */}
          <div className="lg:col-span-1 bg-gray-800/70 border border-gray-700/70 rounded-lg p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Overall CGPA
            </div>
            <div className={`mt-1 text-3xl font-extrabold tabular-nums tracking-tight ${overallStats.cgpa !== null ? 'text-white' : 'text-gray-600'}`}>
              {fmt(overallStats.cgpa)}
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">{overallStats.credits} credits counted</div>
          </div>

          {/* Term SGPA grid */}
          <div className="lg:col-span-3 bg-gray-800/70 border border-gray-700/70 rounded-lg p-3">
            <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Term-wise SGPA</div>
            <div className="grid grid-cols-9 gap-1.5">
              {termStats.map(({ term, sgpa }) => (
                <div key={term} className="bg-gray-900/60 border border-gray-700/60 rounded text-center py-1.5 px-1">
                  <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">T{term}</div>
                  <div className={`text-xs font-bold tabular-nums mt-0.5 ${sgpa !== null ? 'text-gray-100' : 'text-gray-700'}`}>
                    {fmt(sgpa)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Year sections ── */}
        <div className="space-y-3 pb-8">
          {([1, 2, 3] as const).map((year) => {
            const terms = yearTerms(year);

            // Year-level GPA
            let yearCredits = 0, yearQP = 0;
            allSubjects.filter(s => terms.includes(s.term)).forEach(s => {
              const c = computeForSubject(s, marksById[s.id]);
              if (c.isCounted && c.gradePoints !== null) { yearCredits += s.credits; yearQP += c.gradePoints * s.credits; }
            });
            const yearGPA = yearCredits > 0 ? yearQP / yearCredits : null;

            return (
              <section key={year} className="bg-gray-800/50 border border-gray-700/60 rounded-lg overflow-hidden">

                {/* Year header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50 bg-gray-800/80">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-sm font-extrabold text-gray-100">Year {year}</h2>
                    <span className="text-[10px] text-gray-600">Terms {terms[0]}–{terms[2]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span>Year GPA</span>
                    <span className={`font-bold tabular-nums text-xs ${yearGPA !== null ? 'text-indigo-300' : 'text-gray-700'}`}>
                      {fmt(yearGPA)}
                    </span>
                    {yearCredits > 0 && <span className="text-gray-700">· {yearCredits} cr</span>}
                  </div>
                </div>

                {/* Column header row */}
                <div className="grid gap-0 bg-gray-900/30 border-b border-gray-700/40"
                  style={{ gridTemplateColumns: '5rem 1fr 2rem 1fr 12rem' }}>
                  {['Code · Subject', '', 'Cr', 'Marks (Internal + Final = Total or Direct)', 'Grade'].map((h, i) => (
                    <div key={i} className="px-3 py-1.5 text-[9px] font-bold text-gray-600 uppercase tracking-widest"
                      style={i === 1 ? { gridColumn: 'span 1' } : {}}>
                      {h}
                    </div>
                  ))}
                </div>

                {/* Terms within year */}
                {terms.map(term => {
                  const termSubs = allSubjects.filter(s => s.term === term);
                  const tStat = termStatsMap.get(term)!;
                  const termSGPA = tStat.credits > 0 ? tStat.qp / tStat.credits : null;

                  return (
                    <div key={term}>
                      {/* Term sub-header */}
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 border-b border-gray-700/30">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest shrink-0">Term {term}</span>
                        <div className="flex-1 h-px bg-gray-700/30" />
                        {termSGPA !== null && (
                          <span className="text-[9px] font-semibold text-indigo-400/80 bg-indigo-950/40 border border-indigo-900/50 rounded-full px-2 py-0.5 tabular-nums">
                            SGPA {fmt(termSGPA)}
                          </span>
                        )}
                        {tStat.credits > 0 && (
                          <span className="text-[9px] text-gray-700 tabular-nums shrink-0">{tStat.credits} cr</span>
                        )}
                      </div>

                      {/* Subject rows */}
                      {termSubs.map((subject, idx) => {
                        const input = marksById[subject.id] || emptyMarks;
                        const computed = computeForSubject(subject, input);
                        const iVal = parseNumberOrNull(input.internal);
                        const fVal = parseNumberOrNull(input.final);
                        const autoSum = iVal !== null && fVal !== null ? iVal + fVal : null;
                        const totalVal = parseNumberOrNull(input.total);
                        const shownTotal = totalVal !== null ? totalVal : autoSum;
                        const isLast = idx === termSubs.length - 1;

                        return (
                          <div
                            key={subject.id}
                            className={`grid items-center hover:bg-gray-900/30 transition-colors ${!isLast ? 'border-b border-gray-700/25' : ''}`}
                            style={{ gridTemplateColumns: '5rem 1fr 2rem 1fr 12rem' }}
                          >
                            {/* Code */}
                            <div className="px-3 py-1.5 text-[10px] font-mono text-gray-500 truncate" title={subject.code}>
                              {subject.code || '—'}
                            </div>

                            {/* Subject name */}
                            <div className="px-1 py-1.5 text-xs text-gray-300 truncate" title={subject.name}>
                              {clampLabel(subject.name)}
                            </div>

                            {/* Credits */}
                            <div className="px-1 py-1.5 text-[10px] text-gray-600 text-center tabular-nums">
                              {subject.credits}
                            </div>

                            {/* Marks inputs */}
                            <div className="px-2 py-1.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-16">
                                  <input
                                    type="number" inputMode="decimal" min={0} max={100} step={0.01}
                                    value={input.internal}
                                    onChange={e => updateMarks(subject.id, { internal: e.target.value })}
                                    className={inputCls}
                                    placeholder="Int"
                                    aria-label={`${subject.name} internal marks`}
                                  />
                                </div>
                                <span className="text-gray-700 text-xs select-none">+</span>
                                <div className="w-16">
                                  <input
                                    type="number" inputMode="decimal" min={0} max={100} step={0.01}
                                    value={input.final}
                                    onChange={e => updateMarks(subject.id, { final: e.target.value })}
                                    className={inputCls}
                                    placeholder="Fin"
                                    aria-label={`${subject.name} final marks`}
                                  />
                                </div>
                                <span className="text-gray-700 text-xs select-none">=</span>
                                <div className="w-8 text-xs font-semibold text-gray-300 tabular-nums text-right">
                                  {shownTotal !== null ? shownTotal.toFixed(0) : <span className="text-gray-700">—</span>}
                                </div>
                                <span className="text-[10px] text-gray-700 select-none">/100</span>
                                <span className="text-[9px] text-gray-700 uppercase tracking-widest mx-1 select-none">or</span>
                                <div className="w-16">
                                  <input
                                    type="number" inputMode="decimal" min={0} max={100} step={0.01}
                                    value={input.total}
                                    onChange={e => updateMarks(subject.id, { total: e.target.value })}
                                    className={inputCls}
                                    placeholder="Total"
                                    aria-label={`${subject.name} total marks`}
                                  />
                                </div>
                                {computed.inputError && (
                                  <span className="text-[9px] text-red-400 shrink-0" role="alert">{computed.inputError}</span>
                                )}
                              </div>
                            </div>

                            {/* Grade */}
                            <div className="px-2 py-1.5 flex items-center">
                              <div className="flex gap-0.5 items-center">
                                {(['O', 'A', 'B', 'C', 'D', 'E', 'F'] as LetterGrade[]).map(g => {
                                  const isSelected = input.gradeOverride === g;
                                  const isComputedGrade = !input.gradeOverride && computed.gradeLetter === g;
                                  return (
                                    <button
                                      key={g}
                                      onClick={() => updateMarks(subject.id, { gradeOverride: isSelected ? '' : g })}
                                      className={`w-[18px] h-[18px] flex items-center justify-center rounded-full border text-[8px] font-bold transition-all ${
                                        isSelected
                                          ? 'border-indigo-500 bg-indigo-500/30 text-indigo-300'
                                          : isComputedGrade
                                          ? 'border-gray-600 bg-gray-700/30 text-gray-400'
                                          : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500 hover:bg-gray-800'
                                      }`}
                                      aria-label={`Set ${subject.name} grade to ${g}`}
                                      type="button"
                                      title={g}
                                    >
                                      {g}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}