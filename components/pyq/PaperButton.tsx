'use client';
// One paper cell button in the PYQ matrix; look and label depend on the active action mode (quiz / print / CBT).
import React from 'react';
import { Printer, PlayCircle, Loader2, MonitorPlay } from 'lucide-react';
import type { ExamPaperInfo, SubjectPyqInfo } from '@/lib/pyqService';

export type ActionType = 'quiz' | 'print' | 'cbt';

type PaperButtonProps = {
  subject: SubjectPyqInfo;
  paper: ExamPaperInfo;
  actionType: ActionType;
  isPrinting: boolean;
  onClick: () => void;
};

export default function PaperButton({ subject, paper, actionType, isPrinting, onClick }: PaperButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${actionType === 'cbt' ? 'CBT exam' : actionType === 'quiz' ? 'Take quiz' : 'Print paper'}: ${subject.code} ${paper.date}`}
      disabled={isPrinting || (actionType === 'cbt' && !paper.cbt)}
      onClick={onClick}
      className={`w-full max-w-[105px] px-1.5 py-1.5 rounded-md border font-semibold text-[11px] flex items-center justify-center gap-1 transition-all duration-200 group/btn shadow-sm ${
        actionType === 'quiz'
          ? 'bg-emerald-950/50 hover:bg-emerald-600 border-emerald-700/50 text-emerald-200 hover:text-white'
          : actionType === 'cbt'
          ? paper.cbt
            ? 'bg-violet-950/50 hover:bg-violet-600 border-violet-700/50 text-violet-200 hover:text-white'
            : 'bg-surface-dark/40 border-surface-border text-slate-400 cursor-not-allowed'
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
      <span className="truncate">{paper.displayDate}</span>
    </button>
  );
}
