/**
 * Results screen body: toolbar (search, view toggles, export/print) and the question list, either every
 * question with the learner's answer marked or only the incorrect ones.
 */
import React from 'react';
import { Search, Check, Download, Eye, EyeOff, XCircle, List } from 'lucide-react';
import type { Question } from '@/lib/types';
import { moduleLabel } from '@/lib/moduleLabel';
import Button from '../Button';
import PassageCard from '../PassageCard';
import Markdown, { inlineParagraphs } from './Markdown';
import PrintMenu from './PrintMenu';
import { isAnswerCorrect, matchesSearch, questionKey } from './answers';

const SEGMENT_BASE = 'flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-semibold transition-colors';
const SEGMENT_ON = 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40';
const SEGMENT_OFF = 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50';

function Segmented({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={title} className="flex items-center bg-surface-light rounded-lg p-1 border border-surface-border gap-0.5" title={title}>
      {children}
    </div>
  );
}

function SegmentButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`${SEGMENT_BASE} ${active ? SEGMENT_ON : SEGMENT_OFF}`}>
      {children}
    </button>
  );
}

export function ReviewToolbar({
  searchQuery,
  onSearchChange,
  reviseMode,
  showAllQuestions,
  onShowAllChange,
  hideWrongOptions,
  onHideWrongOptionsChange,
  globalAnswersVisible,
  onToggleGlobalAnswers,
  onExport,
  onPrint,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  reviseMode: boolean;
  showAllQuestions: boolean;
  onShowAllChange: (all: boolean) => void;
  hideWrongOptions: boolean;
  onHideWrongOptionsChange: (hide: boolean) => void;
  globalAnswersVisible: boolean;
  onToggleGlobalAnswers: () => void;
  onExport: () => void;
  onPrint: (withAnswers: boolean) => void;
}) {
  return (
    <div className="mt-3 mb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" aria-hidden />
        </div>
        <input
          type="text"
          placeholder="Search questions or options..."
          aria-label="Search questions or options"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface-dark/60 border border-surface-border/60 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2 shrink-0">
        {!reviseMode && (
          <Segmented title="Filter which questions to show">
            <SegmentButton active={showAllQuestions} onClick={() => onShowAllChange(true)}>
              <List size={13} aria-hidden /> All
            </SegmentButton>
            <SegmentButton active={!showAllQuestions} onClick={() => onShowAllChange(false)}>
              <XCircle size={13} aria-hidden /> Incorrect Only
            </SegmentButton>
          </Segmented>
        )}

        <Segmented title="Control which answer options are visible">
          <SegmentButton active={!hideWrongOptions} onClick={() => onHideWrongOptionsChange(false)}>
            All Options
          </SegmentButton>
          <SegmentButton active={hideWrongOptions} onClick={() => onHideWrongOptionsChange(true)}>
            Answer Only
          </SegmentButton>
        </Segmented>

        <Button
          variant={globalAnswersVisible ? 'primary' : 'secondary'}
          onClick={onToggleGlobalAnswers}
          aria-pressed={globalAnswersVisible}
          title={globalAnswersVisible ? 'Hide correct answers' : 'Reveal correct answers'}
        >
          {globalAnswersVisible ? <><EyeOff size={14} aria-hidden /> Hide Answers</> : <><Eye size={14} aria-hidden /> Show Answers</>}
        </Button>

        <Button onClick={onExport} title="Export quiz as JSON file">
          <Download size={16} aria-hidden /> Export
        </Button>
        <PrintMenu onPrint={onPrint} placement="below-right" />
      </div>
    </div>
  );
}

const TONE_CLASS = {
  neutral: 'bg-surface-dark/40 border-surface-border/60',
  correct: 'bg-emerald-900/15 border-emerald-800/40',
  incorrect: 'bg-red-900/15 border-red-800/40',
} as const;

const META_CHIP = 'px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 font-medium rounded-md';

function ReviewQuestionCard({
  question: q,
  number,
  userAnswer,
  tone,
  answerVisible,
  hideWrongOptions,
  showPassage,
  onToggleAnswer,
}: {
  question: Question;
  /** 1-based position shown as "Q<number>". */
  number: number;
  userAnswer: string[] | null | undefined;
  tone: keyof typeof TONE_CLASS;
  answerVisible: boolean;
  hideWrongOptions: boolean;
  showPassage: boolean;
  /** When set, a per-question show/hide-answer toggle is rendered. */
  onToggleAnswer?: () => void;
}) {
  return (
    <div className={`mb-4 p-4 border rounded-xl ${TONE_CLASS[tone]}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-700/50 border border-slate-600/40 text-slate-300 font-medium text-xs rounded-md">
            Q{number}
          </span>
          {onToggleAnswer && (
            <button
              type="button"
              onClick={onToggleAnswer}
              className={`p-1.5 border transition-colors rounded-md ${answerVisible
                ? 'bg-emerald-700/80 text-white border-emerald-600/50 hover:bg-emerald-600'
                : 'bg-slate-700/60 text-slate-300 border-slate-600/40 hover:bg-slate-600'
                }`}
              title="Toggle Answer Visibility"
              aria-label="Toggle answer visibility"
              aria-pressed={answerVisible}
            >
              <Check size={12} aria-hidden />
            </button>
          )}
        </div>
        <div className="flex min-w-0 flex-wrap gap-2 text-xs">
          {q.isSubjective && (
            <span className="px-2 py-1 bg-amber-900/40 border border-amber-700/40 text-amber-300 font-medium rounded-md">
              Subjective
            </span>
          )}
          {q.module && <span className={`${META_CHIP} text-slate-300`}>{moduleLabel(q.module)}</span>}
          {q.source && (
            <span className={`${META_CHIP} text-slate-400 min-w-0 truncate max-w-[200px] sm:max-w-none`}>{q.source}</span>
          )}
        </div>
      </div>
      {showPassage && q.passage && <PassageCard question={q} className="mb-3" />}
      <div className="text-white mb-2 text-sm sm:text-base prose prose-invert prose-indigo max-w-none">
        <Markdown>{q.text}</Markdown>
      </div>
      {q.options && Object.keys(q.options).length > 0 && (
        <div className="space-y-1 mb-3">
          {Object.entries(q.options)
            // "Answer Only" mode shows just the correct options
            .filter(([key]) => !hideWrongOptions || q.correctAnswer.includes(key))
            .map(([key, optionValue]) => {
              const isUserAnswer = userAnswer?.includes(key) || false;
              const isCorrectAnswer = q.correctAnswer.includes(key);
              return (
                <div
                  key={key}
                  className={`text-sm flex gap-2 ${answerVisible
                    ? (isCorrectAnswer
                      ? 'font-bold text-green-400'
                      : isUserAnswer
                        ? 'text-red-400'
                        : 'text-gray-400')
                    : 'text-gray-400'
                    }`}
                >
                  <span className="shrink-0">{key}:</span>
                  <span className="prose prose-invert prose-indigo max-w-none prose-p:inline text-current">
                    <Markdown components={inlineParagraphs}>{optionValue || ''}</Markdown>
                    {answerVisible && isCorrectAnswer && ' ✓'}
                    {answerVisible && isUserAnswer && !isCorrectAnswer && ' (Your answer)'}
                  </span>
                </div>
              );
            })}
        </div>
      )}
      {q.explanation && (
        <div className="mt-2 text-xs sm:text-sm text-slate-300 bg-emerald-900/10 p-3 border-l-2 border-emerald-600/50 rounded-r-lg prose prose-invert prose-indigo max-w-none leading-loose">
          <Markdown>{`${q.explanation}`}</Markdown>
        </div>
      )}
    </div>
  );
}

export default function ReviewView({
  questions,
  answeredQuestions,
  incorrectAnswers,
  searchQuery,
  reviseMode,
  showAllQuestions,
  hideWrongOptions,
  globalAnswersVisible,
  individualAnswersVisible,
  onSetIndividualVisible,
}: {
  questions: Question[];
  answeredQuestions: (string[] | null)[];
  incorrectAnswers: Question[];
  searchQuery: string;
  reviseMode: boolean;
  showAllQuestions: boolean;
  hideWrongOptions: boolean;
  globalAnswersVisible: boolean;
  /** Per-question overrides of `globalAnswersVisible`, keyed by index in `questions`. */
  individualAnswersVisible: Record<number, boolean>;
  onSetIndividualVisible: (index: number, visible: boolean) => void;
}) {
  if (showAllQuestions || reviseMode) {
    const visible = questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => matchesSearch(q, searchQuery));
    return (
      <div className="mt-8">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">All Questions:</h3>
        {visible.map(({ q, idx }, visibleIdx) => {
          const userAnswer = answeredQuestions[idx];
          const isCorrect = !q.isSubjective && userAnswer !== null && isAnswerCorrect(userAnswer, q);
          // Subjective, unanswered, and revise-mode cards stay neutral (nothing was graded)
          const isNeutral = q.isSubjective || userAnswer === null || reviseMode;
          const answerVisible = individualAnswersVisible[idx] ?? globalAnswersVisible;
          return (
            <ReviewQuestionCard
              key={idx}
              question={q}
              number={idx + 1}
              userAnswer={userAnswer}
              tone={isNeutral ? 'neutral' : isCorrect ? 'correct' : 'incorrect'}
              answerVisible={answerVisible}
              hideWrongOptions={hideWrongOptions}
              showPassage={visibleIdx === 0 || visible[visibleIdx - 1].q.passage?.id !== q.passage?.id}
              onToggleAnswer={() => onSetIndividualVisible(idx, !answerVisible)}
            />
          );
        })}
        {visible.length === 0 && (
          <p aria-live="polite" className="text-slate-400 text-center py-8">No matching questions found.</p>
        )}
      </div>
    );
  }

  if (incorrectAnswers.length === 0) {
    return <p className="mt-8 text-emerald-300 text-center py-8">All answers correct</p>;
  }

  const visible = incorrectAnswers.filter(q => matchesSearch(q, searchQuery));
  return (
    <div className="mt-8">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">Incorrect Answers:</h3>
      {visible.map((q, index) => {
        const originalIndex = questions.findIndex(mq => questionKey(mq) === questionKey(q));
        return (
          <ReviewQuestionCard
            key={index}
            question={q}
            number={originalIndex + 1}
            userAnswer={q.selectedAnswer}
            tone="incorrect"
            answerVisible={individualAnswersVisible[originalIndex] ?? globalAnswersVisible}
            hideWrongOptions={hideWrongOptions}
            showPassage
          />
        );
      })}
      {visible.length === 0 && (
        <p aria-live="polite" className="text-slate-400 text-center py-8">No matching incorrect questions found.</p>
      )}
    </div>
  );
}
