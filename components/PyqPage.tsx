'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Printer,
  PlayCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  HelpCircle,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  MonitorPlay,
} from 'lucide-react';
import { TermPyqGroup, ExamPaperInfo, SubjectPyqInfo } from '@/lib/pyqService';
import { convertFileToQuestions } from '@/lib/questionLoader';
import { printExamPaper } from '@/lib/printExam';
import CbtExam from './CbtExam';
import { stashCbtReview, toReviewData } from '@/lib/cbtReview';

export default function PyqPage() {
  const router = useRouter();

  const [termGroups, setTermGroups] = useState<TermPyqGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<number | 'all'>('all');
  const [actionType, setActionType] = useState<'quiz' | 'print' | 'cbt'>('quiz');
  const [cbtTarget, setCbtTarget] = useState<{ subject: SubjectPyqInfo; paper: ExamPaperInfo } | null>(null);
  const [withAnswers, setWithAnswers] = useState(false);
  const [printingPaperKey, setPrintingPaperKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/pyqs');
        if (res.ok) {
          const data: TermPyqGroup[] = await res.json();
          setTermGroups(data);
        }
      } catch (err) {
        console.error('Failed to load PYQ data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute total statistics
  const totalPapers = termGroups.reduce((acc, group) => {
    return (
      acc +
      group.subjects.reduce((sAcc, subj) => {
        return (
          sAcc +
          Object.values(subj.papersByCycle).reduce(
            (pAcc, pList) => pAcc + pList.length,
            0
          )
        );
      }, 0)
    );
  }, 0);

  const totalQuestions = termGroups.reduce((acc, group) => {
    return (
      acc +
      group.subjects.reduce((sAcc, subj) => {
        return (
          sAcc +
          Object.values(subj.papersByCycle).reduce(
            (pAcc, pList) =>
              pAcc +
              pList.reduce((qAcc, paper) => qAcc + paper.questionCount, 0),
            0
          )
        );
      }, 0)
    );
  }, 0);

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

  const displayedGroups =
    selectedTerm === 'all'
      ? termGroups
      : termGroups.filter(g => g.term === selectedTerm);

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-900/90 via-[#0d1527]/80 to-[#0b1120] border border-slate-700/50 p-3.5 sm:p-4 mb-4 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-[11px] font-semibold mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Official Past Papers Checklist</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Previous Year Questions{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                (PYQs)
              </span>
            </h1>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
              Browse exam papers across trimesters. Click any available paper to
              launch a live timed quiz or print the full question sheet.
            </p>

            {/* Quick Metrics */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-bold">{totalPapers}</span> Papers Available
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-bold">
                  {totalQuestions.toLocaleString()}
                </span> Questions
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>3 Trimesters / Year</span>
              </div>
            </div>
          </div>

          {/* Action Mode Toggle Card */}
          <div className="bg-slate-900/90 border border-slate-700/70 p-2.5 rounded-xl shadow-lg flex flex-col gap-2 min-w-[240px] sm:min-w-[260px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-emerald-400" />
              Click Action Mode
            </span>

            {/* Main Toggle: Quiz vs Print */}
            <div className="grid grid-cols-3 p-0.5 bg-slate-800/90 rounded-lg border border-slate-700/60 gap-1">
              <button
                type="button"
                onClick={() => setActionType('quiz')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-bold transition-all duration-200 ${
                  actionType === 'quiz'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Take Quiz
              </button>
              <button
                type="button"
                onClick={() => setActionType('print')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-bold transition-all duration-200 ${
                  actionType === 'print'
                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                Print Paper
              </button>
              <button
                type="button"
                onClick={() => setActionType('cbt')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-bold transition-all duration-200 ${
                  actionType === 'cbt'
                    ? 'bg-violet-500 text-slate-950 shadow-sm shadow-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                CBT Exam
              </button>
            </div>

            {/* Print Sub-options when Print mode is active */}
            {actionType === 'print' ? (
              <div className="flex items-center justify-between px-1.5 pt-1 border-t border-slate-800 text-[10px]">
                <span className="text-slate-400">Include Solutions:</span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded border border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setWithAnswers(false)}
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold transition-colors ${
                      !withAnswers
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Questions
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithAnswers(true)}
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold transition-colors ${
                      withAnswers
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    With Answers
                  </button>
                </div>
              </div>
            ) : actionType === 'cbt' ? (
              <p className="text-[10px] text-slate-400 px-0.5">
                Timed exam in the real exam-centre interface, using the official pattern (or a standard practice pattern when none is recorded).
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 px-0.5">
                Clicking any paper opens an interactive practice quiz.
              </p>
            )}
          </div>
        </div>

        {/* Term Selector Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap mr-1">
              Term:
            </span>
            <button
              onClick={() => setSelectedTerm('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all duration-200 shrink-0 ${
                selectedTerm === 'all'
                  ? 'bg-slate-700 text-white shadow-sm border border-slate-600'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All ({termGroups.length})
            </button>
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
                <button
                  key={group.term}
                  onClick={() => setSelectedTerm(group.term)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                    selectedTerm === group.term
                      ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>T{group.term}</span>
                  <span
                    className={`text-[9.5px] px-1 py-0.2 rounded-full ${
                      selectedTerm === group.term
                        ? 'bg-emerald-800 text-emerald-200'
                        : 'bg-slate-700/80 text-slate-300'
                    }`}
                  >
                    {groupPapers}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <p className="text-xs font-medium">Loading previous year papers...</p>
        </div>
      ) : (
        /* Term Groups Tables */
        <div className="space-y-4 sm:space-y-5">
          {displayedGroups.map(group => (
            <div
              key={group.term}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-md backdrop-blur-sm"
            >
              {/* Group Title Header */}
              <div className="px-3.5 sm:px-4 py-2 bg-slate-800/50 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
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
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-900/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2 px-3 sm:px-4 w-[240px]">Subject</th>
                      {group.cycles.map(cycle => (
                        <th
                          key={cycle.id}
                          className="py-2 px-2 text-center min-w-[90px]"
                        >
                          <div className="text-slate-300 font-semibold">{cycle.label}</div>
                        </th>
                      ))}
                      <th className="py-2 px-2.5 text-center w-[75px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {group.subjects.map(subject => {
                      return (
                        <tr
                          key={subject.code}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          {/* Subject Info */}
                          <td className="py-1.5 px-3 sm:px-4">
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
                                    {papers.map(paper => {
                                      const key = `${subject.code}-${paper.filename}`;
                                      const isPrinting =
                                        printingPaperKey === key;

                                      return (
                                        <button
                                          key={paper.filename}
                                          type="button"
                                          disabled={isPrinting || (actionType === 'cbt' && !paper.cbt)}
                                          onClick={() =>
                                            handlePaperClick(subject, paper)
                                          }
                                          className={`w-full max-w-[105px] px-1.5 py-1 rounded-md border font-semibold text-[10.5px] flex items-center justify-center gap-1 transition-all duration-200 group/btn shadow-sm ${
                                            actionType === 'quiz'
                                              ? 'bg-emerald-950/50 hover:bg-emerald-600 border-emerald-700/50 text-emerald-200 hover:text-white'
                                              : actionType === 'cbt'
                                              ? paper.cbt
                                                ? 'bg-violet-950/50 hover:bg-violet-600 border-violet-700/50 text-violet-200 hover:text-white'
                                                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                                              : 'bg-sky-950/50 hover:bg-sky-600 border-sky-700/50 text-sky-200 hover:text-white'
                                          }`}
                                          title={
                                            actionType === 'cbt'
                                              ? paper.cbt
                                                ? `CBT Exam: ${subject.code} (${paper.date}) - ${paper.cbt.durationMin} min, ${paper.cbt.questionCount} questions`
                                                : 'This paper has no objective questions'
                                              : `${actionType === 'quiz' ? 'Take Quiz' : 'Print Paper'}: ${subject.code} (${paper.date})`
                                          }
                                        >
                                          {isPrinting ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                          ) : actionType === 'cbt' ? (
                                            <MonitorPlay className="w-3 h-3 shrink-0 opacity-70 group-hover/btn:opacity-100" />
                                          ) : actionType === 'quiz' ? (
                                            <PlayCircle className="w-3 h-3 shrink-0 opacity-70 group-hover/btn:opacity-100" />
                                          ) : (
                                            <Printer className="w-3 h-3 shrink-0 opacity-70 group-hover/btn:opacity-100" />
                                          )}
                                          <span className="truncate">
                                            {paper.displayDate}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span
                                    className="text-slate-600 font-semibold select-none text-xs"
                                    title="Paper not yet available"
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
                              className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                subject.totalAvailable === subject.totalExpected
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : subject.totalAvailable > 0
                                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
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

      {/* Guidance Notes Footer */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
        <h3 className="font-bold text-xs text-slate-200 mb-1.5 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          About Previous Year Exam Papers &amp; Retakes
        </h3>
        <ul className="list-disc list-inside space-y-0.5 text-slate-400">
          <li>
            <strong>Trimester Structure:</strong> Regular end-term exams occur 3 times a year (January, May, and September/October).
          </li>
          <li>
            <strong>Retake Cycles:</strong> After a course’s initial term, official re-sit examinations are held in each following exam cycle.
          </li>
          <li>
            <strong>CBT Exam:</strong> Every paper with objective questions can be taken (with its official pattern of sections, marks, negative marking, duration and calculator when one is recorded, otherwise a standard practice pattern) in the exam-centre interface. Only objective questions are included; written sections are skipped.
          </li>
          <li>
            <strong>Abridged Papers Excluded:</strong> All transitional abridged papers have been excluded.
          </li>
          <li>
            <strong>Exam-Only Courses:</strong> Continuous evaluation and project-based subjects without written final exams are excluded from this list.
          </li>
        </ul>
      </div>
    </main>
  );
}
