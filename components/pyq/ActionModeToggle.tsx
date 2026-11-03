'use client';
// Quiz / Print / CBT mode switch, plus the "Questions vs With Answers" sub-toggle shown in print mode.
import React from 'react';
import { Printer, PlayCircle, MonitorPlay } from 'lucide-react';
import type { ActionType } from './PaperButton';

type ActionModeToggleProps = {
  actionType: ActionType;
  onActionTypeChange: (type: ActionType) => void;
  withAnswers: boolean;
  onWithAnswersChange: (value: boolean) => void;
};

const MODES: { type: ActionType; label: string; Icon: typeof Printer; active: string }[] = [
  { type: 'quiz', label: 'Take Quiz', Icon: PlayCircle, active: 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30' },
  { type: 'print', label: 'Print Paper', Icon: Printer, active: 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30' },
  { type: 'cbt', label: 'CBT Exam', Icon: MonitorPlay, active: 'bg-violet-500 text-slate-950 shadow-sm shadow-violet-500/30' },
];

export default function ActionModeToggle({ actionType, onActionTypeChange, withAnswers, onWithAnswersChange }: ActionModeToggleProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-auto sm:min-w-[260px]">
      <div role="group" aria-label="Action mode" className="grid grid-cols-3 p-0.5 bg-surface-light rounded-lg border border-surface-border gap-1">
        {MODES.map(({ type, label, Icon, active }) => (
          <button
            key={type}
            type="button"
            onClick={() => onActionTypeChange(type)}
            aria-pressed={actionType === type}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-bold transition-all duration-200 ${
              actionType === type ? active : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {actionType === 'print' ? (
        <div className="flex items-center justify-between px-1.5 pt-1 border-t border-surface-border text-[10px]">
          <span className="text-slate-400">Include Solutions:</span>
          <div role="group" aria-label="Include solutions" className="flex items-center gap-1 bg-surface-light p-0.5 rounded border border-surface-border">
            <button
              type="button"
              onClick={() => onWithAnswersChange(false)}
              aria-pressed={!withAnswers}
              className={`px-1.5 py-0.5 rounded text-2xs font-semibold transition-colors ${
                !withAnswers ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Questions
            </button>
            <button
              type="button"
              onClick={() => onWithAnswersChange(true)}
              aria-pressed={withAnswers}
              className={`px-1.5 py-0.5 rounded text-2xs font-semibold transition-colors ${
                withAnswers ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              With Answers
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
