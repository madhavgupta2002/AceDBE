'use client';

// Previous-year-papers page: loads papers, owns filter/mode state and the print/quiz/CBT click handler.
// Pieces live in components/pyq/*.
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { TermPyqGroup, ExamPaperInfo, SubjectPyqInfo } from '@/lib/pyqService';
import { convertFileToQuestions } from '@/lib/questionLoader';
import { printExamPaper } from '@/lib/printExam';
import CbtExam from './CbtExam';
import Chip from './Chip';
import PaperButton, { type ActionType } from './pyq/PaperButton';
import ActionModeToggle from './pyq/ActionModeToggle';
import PyqNotes from './pyq/PyqNotes';
import { stashCbtReview, toReviewData } from '@/lib/cbtReview';

const ENTRANCE: SubjectPyqInfo = {
  code: 'ENTRANCE',
  name: 'BBA-DBE Entrance Test',
  term: 0,
  hasFinalExam: false,
  papersByCycle: {},
  totalAvailable: 0,
  totalExpected: 0,
};

const entranceYear = (p: ExamPaperInfo) => p.date.match(/\d{4}/)?.[0] ?? p.date;
// "10 August 2024" → "10 Aug"; a bare year has no day, so call it a paper
const shortEntranceDate = (p: ExamPaperInfo) => {
  const m = p.date.match(/^(\d{1,2})\s+([A-Za-z]{3})/);
  return m ? `${m[1]} ${m[2]}` : 'Paper';
};

export default function PyqPage() {
  const router = useRouter();

  const [termGroups, setTermGroups] = useState<TermPyqGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<number | 'all' | 'entrance'>('all');
  const [actionType, setActionType] = useState<ActionType>('quiz');
  const [cbtTarget, setCbtTarget] = useState<{ subject: SubjectPyqInfo; paper: ExamPaperInfo } | null>(null);
  const [withAnswers, setWithAnswers] = useState(false);
  const [printingPaperKey, setPrintingPaperKey] = useState<string | null>(null);
  const [entrancePapers, setEntrancePapers] = useState<ExamPaperInfo[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [res, entranceRes] = await Promise.all([fetch('/api/pyqs'), fetch('/api/entrance')]);
        if (res.ok) {
          const data: TermPyqGroup[] = await res.json();
          setTermGroups(data);
        }
        if (entranceRes.ok) setEntrancePapers(await entranceRes.json());
      } catch (err) {
        console.error('Failed to load PYQ data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle clicking a paper
  const handlePaperClick = async (
    subject: SubjectPyqInfo,
    paper: ExamPaperInfo
  ) => {
    if (actionType === 'cbt') {
      if (paper.cbt) setCbtTarget({ subject, paper });
      return;
    }

    if (actionType === 'quiz') {
      router.push(`/${subject.code}?exam=${encodeURIComponent(paper.bankName)}`);
      return;
    }

    // Print Action
    const key = `${subject.code}-${paper.filename}`;
    setPrintingPaperKey(key);

    try {
      const res = await fetch(
        `/api/questions?bankType=Exam&subjectCode=${subject.code}&bankName=${encodeURIComponent(
          paper.bankName
        )}`
      );

      if (!res.ok) {
        throw new Error('Failed to load paper questions');
      }

      const fileData = await res.json();
      const questions = convertFileToQuestions(fileData, paper.bankName, subject.code, 'Exam');

      printExamPaper({
        title: 'IIM Bangalore BBA-DBE Examination',
        subjectCode: subject.code,
        subjectName: subject.name,
        examDate: paper.date,
        questions,
        withAnswers,
      });
    } catch (err) {
      console.error('Print paper error:', err);
      alert('Could not prepare the print sheet. Please try again.');
    } finally {
      setPrintingPaperKey(null);
    }
  };

  const renderPaperButton = (subject: SubjectPyqInfo, paper: ExamPaperInfo) => (
    <PaperButton
      key={paper.filename}
      subject={subject}
      paper={paper}
      actionType={actionType}
      isPrinting={printingPaperKey === `${subject.code}-${paper.filename}`}
      onClick={() => handlePaperClick(subject, paper)}
    />
  );

  const entranceYears = Array.from(new Set(entrancePapers.map(entranceYear))).sort();

  const displayedGroups =
    selectedTerm === 'entrance'
      ? []
      : selectedTerm === 'all'
      ? termGroups
      : termGroups.filter(g => g.term === selectedTerm);

  return (
    <main id="main" className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
      {/* Header */}
      <div className="rounded-xl bg-surface border border-surface-border/60 p-3.5 sm:p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Previous year papers</h1>
          </div>

          <ActionModeToggle
            actionType={actionType}
            onActionTypeChange={setActionType}
            withAnswers={withAnswers}
            onWithAnswersChange={setWithAnswers}
          />
        </div>

        {/* Term Selector Bar */}
        <div className="mt-3 pt-3 border-t border-surface-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap mr-1">
              Term:
            </span>
            <Chip active={selectedTerm === 'all'} onClick={() => setSelectedTerm('all')}>
              All ({termGroups.length})
            </Chip>
            {entrancePapers.length > 0 && (
              <Chip active={selectedTerm === 'entrance'} onClick={() => setSelectedTerm('entrance')}>
                Entrance
              </Chip>
            )}
            {termGroups.map(group => {
              const groupPapers = group.subjects.reduce(
                (sum, s) =>
                  sum +
                  Object.values(s.papersByCycle).reduce(
                    (pSum, p) => pSum + p.length,
                    0
                  ),
                0
              );
              return (
                <Chip
                  key={group.term}
                  active={selectedTerm === group.term}
                  onClick={() => setSelectedTerm(group.term)}
                  className="px-2.5 gap-1.5"
                >
                  <span>T{group.term}</span>
                  <span
                    className={`text-2xs px-1 py-0.5 rounded-full ${
                      selectedTerm === group.term
                        ? 'bg-emerald-800 text-emerald-200'
                        : 'bg-slate-700/80 text-slate-300'
                    }`}
                  >
                    {groupPapers}
                  </span>
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div role="status" className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <p className="text-xs font-medium">Loading previous year papers...</p>
        </div>
      ) : (
        /* Term Groups Tables */
        <div className="space-y-4 sm:space-y-5">
          {(selectedTerm === 'all' || selectedTerm === 'entrance') && entranceYears.length > 0 && (
            <div className="bg-surface border border-surface-border/60 rounded-xl overflow-hidden shadow-md">
              <div className="px-3.5 sm:px-4 py-2 bg-surface-light border-b border-surface-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/30">
                    EN
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Admission Entrance Test</h2>
                </div>
                <span className="text-[11px] text-slate-400">
                  {entrancePapers[0].questionCount} questions
                  {entrancePapers[0].cbt && <> · {entrancePapers[0].cbt.durationMin} min</>}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <caption className="sr-only">Admission entrance test papers by year</caption>
                  <thead>
                    <tr className="border-b border-surface-border bg-surface-dark text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th scope="col" className="py-2 px-3 sm:px-4 w-[160px] sm:w-[240px] sticky left-0 z-[1] bg-surface-dark">Exam</th>
                      {entranceYears.map(y => (
                        <th scope="col" key={y} className="py-2 px-2 text-center min-w-[90px]">
                          <div className="text-slate-300 font-semibold">{y}</div>
                        </th>
                      ))}
                      <th scope="col" className="py-2 px-2.5 text-center w-[75px]">Papers</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-1.5 px-3 sm:px-4 sticky left-0 z-[1] bg-surface">
                        <div className="font-mono font-bold text-xs text-amber-400">ENTRANCE</div>
                        <span className="text-slate-300 font-medium text-[11px]">BBA-DBE Entrance Test</span>
                      </td>
                      {entranceYears.map(y => (
                        <td key={y} className="py-1 px-1.5 text-center align-middle">
                          <div className="flex flex-col gap-1 items-center justify-center">
                            {entrancePapers
                              .filter(p => entranceYear(p) === y)
                              .map(p => renderPaperButton(ENTRANCE, { ...p, displayDate: shortEntranceDate(p) }))}
                          </div>
                        </td>
                      ))}
                      <td className="py-1 px-2.5 text-center">
                        <span className="inline-flex items-center px-1.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {entrancePapers.length}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {displayedGroups.map(group => (
            <div
              key={group.term}
              className="bg-surface border border-surface-border/60 rounded-xl overflow-hidden shadow-md"
            >
              {/* Group Title Header */}
              <div className="px-3.5 sm:px-4 py-2 bg-surface-light border-b border-surface-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/30">
                    T{group.term}
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span>{group.title} Subjects</span>
                      <span className="text-[11px] font-normal text-slate-400 font-mono">
                        (XX{group.term}XX)
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>
                    Initial: <strong className="text-slate-300">{group.initialCycle}</strong>
                  </span>
                  <span>
                    Expected: <strong className="text-white">{group.cycles.length}</strong>
                  </span>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <caption className="sr-only">Term {group.term} previous year papers by subject and exam cycle</caption>
                  <thead>
                    <tr className="border-b border-surface-border bg-surface-dark text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th scope="col" className="py-2 px-3 sm:px-4 w-[160px] sm:w-[240px] sticky left-0 z-[1] bg-surface-dark">Subject</th>
                      {group.cycles.map(cycle => (
                        <th scope="col"
                          key={cycle.id}
                          className="py-2 px-2 text-center min-w-[90px]"
                        >
                          <div className="text-slate-300 font-semibold">{cycle.label}</div>
                        </th>
                      ))}
                      <th scope="col" className="py-2 px-2.5 text-center w-[75px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/60 text-xs">
                    {group.subjects.map(subject => {
                      return (
                        <tr
                          key={subject.code}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          {/* Subject Info */}
                          <td className="py-1.5 px-3 sm:px-4 sticky left-0 z-[1] bg-surface">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/${subject.code}`}
                                  className="font-mono font-bold text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                                  title="Go to subject practice"
                                >
                                  {subject.code}
                                </Link>
                              </div>
                              <span className="text-slate-300 font-medium text-[11px] line-clamp-1">
                                {subject.name}
                              </span>
                            </div>
                          </td>

                          {/* Cycle Cells */}
                          {group.cycles.map(cycle => {
                            const papers = subject.papersByCycle[cycle.id] || [];
                            const hasPaper = papers.length > 0;

                            return (
                              <td
                                key={cycle.id}
                                className="py-1 px-1.5 text-center align-middle"
                              >
                                {hasPaper ? (
                                  <div className="flex flex-col gap-1 items-center justify-center">
                                    {papers.map(paper => renderPaperButton(subject, paper))}
                                  </div>
                                ) : (
                                  <span
                                    className="text-slate-400 font-semibold select-none text-xs"
                                    title="Paper not yet available"
                                    aria-label="Paper not yet available"
                                  >
                                    &mdash;
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          {/* Status Pill */}
                          <td className="py-1 px-2.5 text-center">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                subject.totalAvailable === subject.totalExpected
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : subject.totalAvailable > 0
                                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                                  : 'bg-surface-light text-slate-400 border border-surface-border'
                              }`}
                            >
                              {subject.totalAvailable} / {subject.totalExpected}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {cbtTarget && (
        <CbtExam
          subject={cbtTarget.subject}
          paper={cbtTarget.paper}
          onResult={(result) => {
            stashCbtReview(toReviewData(cbtTarget.paper.bankName, result));
            router.push(`/${cbtTarget.subject.code}?exam=${encodeURIComponent(cbtTarget.paper.bankName)}&review=cbt`);
          }}
          onClose={() => setCbtTarget(null)}
        />
      )}

      <PyqNotes />
    </main>
  );
}
