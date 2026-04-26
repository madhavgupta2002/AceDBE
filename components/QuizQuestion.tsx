'use client';

import React from 'react';
import { Question } from '@/lib/types';
import { CheckCircle, XCircle, Check, RotateCcw, Play, Pause } from 'lucide-react';
import StopWatch from './StopWatch';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  onClearResponse?: () => void;
  selectedAnswer: string[] | null;
  showResult: boolean;
  elapsedSeconds?: number;
  isTimerActive?: boolean;
  onToggleTimer?: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  onClearResponse,
  selectedAnswer,
  showResult,
  elapsedSeconds = 0,
  isTimerActive = false,
  onToggleTimer,
}) => {
  const isMultipleAnswer = question.correctAnswer.length > 1;
  const isSubjective = question.isSubjective || Object.keys(question.options).length === 0;

  const handleOptionClick = (option: string) => {
    if (showResult || isSubjective) return;

    if (isMultipleAnswer) {
      // For multiple answer questions, toggle selection
      const currentSelections = selectedAnswer || [];
      if (currentSelections.includes(option)) {
        onAnswer(currentSelections.filter(opt => opt !== option));
      } else {
        onAnswer([...currentSelections, option]);
      }
    } else {
      // For single answer questions, select directly
      onAnswer([option]);
    }
  };

  const handleSubjectiveAcknowledge = () => {
    // Mark subjective question as "viewed/acknowledged"
    onAnswer(['SUBJECTIVE_ACKNOWLEDGED']);
  };

  const isSelected = (option: string) => {
    return selectedAnswer?.includes(option) || false;
  };

  const getButtonClass = (option: string) => {
    let baseClass =
      'w-full p-4 font-semibold text-left transition-all duration-200 border rounded-xl ';

    if (!showResult) {
      if (isSelected(option)) {
        return baseClass + 'bg-indigo-700/70 text-white border-indigo-500/50 shadow-md';
      }
      return (
        baseClass +
        'bg-surface text-slate-100 hover:bg-surface-light border-surface-border/60 hover:border-slate-600'
      );
    }

    if (question.correctAnswer.includes(option)) {
      return baseClass + 'bg-emerald-800/40 text-white border-emerald-600/50';
    }
    if (isSelected(option) && !question.correctAnswer.includes(option)) {
      return baseClass + 'bg-red-800/40 text-white border-red-600/50';
    }
    return baseClass + 'bg-slate-800/40 text-slate-500 border-slate-700/40';
  };

  const formatText = (text: string) => {
    return text.replace(/\\n/g, '\n');
  };

  const mdComponents = {
    p: ({ children }: any) => <span className="inline">{children}</span>,
  };

  // Render subjective question
  if (isSubjective) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-900/30 text-yellow-300 border border-yellow-700/40 text-xs font-semibold rounded-full">
              Subjective
            </span>
            {question.module && (
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-900/30 text-emerald-300 border border-emerald-700/40 text-xs font-semibold rounded-full">
                Mod {question.module}
              </span>
            )}
            {question.source && (
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-900/30 text-purple-300 border border-purple-700/40 text-xs font-semibold rounded-full truncate max-w-[150px] sm:max-w-none">
                {question.source}
              </span>
            )}
            <button
              onClick={onToggleTimer}
              className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-full transition-all ${isTimerActive
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                }`}
              title={isTimerActive ? 'Pause timer' : 'Start timer'}
            >
              <StopWatch elapsedSeconds={elapsedSeconds} isActive={isTimerActive} />
              {isTimerActive ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>

          {onClearResponse && selectedAnswer && (
            <button
              onClick={onClearResponse}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/40 hover:border-slate-500 rounded-lg shadow-sm transition-all active:scale-95"
              title="Clear response"
            >
              <RotateCcw size={12} className="text-slate-500" />
              Clear
            </button>
          )}
        </div>
        <div className="text-lg sm:text-2xl mb-4 sm:mb-6 text-white prose prose-invert prose-indigo max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {formatText(question.text)}
          </ReactMarkdown>
        </div>
        <div className="bg-yellow-900/15 border border-yellow-700/40 rounded-xl p-4 sm:p-6">
          <p className="text-yellow-200/90 mb-3 sm:mb-4 text-sm sm:text-base">
            📝 This is a subjective question that requires a written answer.
            <br />
            Please answer this question on your exam paper or separately.
          </p>
          {!selectedAnswer && !showResult && (
            <button
              onClick={handleSubjectiveAcknowledge}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 font-semibold transition-all duration-200 text-sm sm:text-base rounded-xl"
            >
              View Sample Solution
            </button>
          )}
          {(selectedAnswer || showResult) && (
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle size={18} className="sm:hidden" />
              <CheckCircle size={20} className="hidden sm:block" />
              <span className="font-medium text-sm sm:text-base">Sample solution viewed</span>
            </div>
          )}
        </div>
        {(selectedAnswer || showResult) && question.explanation && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-900/15 border border-emerald-700/30 rounded-xl prose prose-invert prose-indigo max-w-none leading-loose">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 text-sm font-semibold">
              Explanation
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {formatText(question.explanation)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  // Render regular MCQ question
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {isMultipleAnswer && (
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-900/30 text-amber-300 border border-amber-700/40 text-xs font-semibold rounded-full">
              Multiple Correct
            </span>
          )}
          {question.module && (
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-900/30 text-emerald-300 border border-emerald-700/40 text-xs font-semibold rounded-full">
              Mod {question.module}
            </span>
          )}
          {question.source && (
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-900/30 text-purple-300 border border-purple-700/40 text-xs font-semibold rounded-full truncate max-w-[150px] sm:max-w-none">
              {question.source}
            </span>
          )}
          <button
            onClick={onToggleTimer}
            className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-full transition-all ${isTimerActive
              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
              : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
              }`}
            title={isTimerActive ? 'Pause timer' : 'Start timer'}
          >
            <StopWatch elapsedSeconds={elapsedSeconds} isActive={isTimerActive} />
            {isTimerActive ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>

        {onClearResponse && selectedAnswer && (
          <button
            onClick={onClearResponse}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/40 hover:border-slate-500 rounded-lg shadow-sm transition-all active:scale-95"
            title="Clear response"
          >
            <RotateCcw size={12} className="text-slate-500" />
            Clear
          </button>
        )}
      </div>
      <div className="text-lg sm:text-2xl mb-4 sm:mb-6 text-white prose prose-invert prose-indigo max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {formatText(question.text)}
        </ReactMarkdown>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionClick(key)}
            className={getButtonClass(key)}
            disabled={showResult}
          >
            <span className="flex items-center justify-between">
              <span className="flex items-center flex-1">
                <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mr-2.5 sm:mr-3 text-sm sm:text-base rounded-lg ${isSelected(key) && !showResult
                  ? 'bg-indigo-800/80 text-white'
                  : 'bg-slate-700/60 text-slate-300'
                  }`}>
                  {isMultipleAnswer && isSelected(key) && !showResult ? (
                    <Check size={14} className="sm:hidden" />
                  ) : isMultipleAnswer && isSelected(key) && !showResult ? (
                    <Check size={16} />
                  ) : (
                    key
                  )}
                </span>
                <span className="text-sm sm:text-base prose prose-invert prose-indigo max-w-none prose-p:inline flex-1">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={mdComponents}
                  >
                    {formatText(value || '')}
                  </ReactMarkdown>
                </span>
              </span>
              {showResult && question.correctAnswer.includes(key) && (
                <CheckCircle className="inline-block ml-2 text-emerald-400 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
              )}
              {showResult &&
                isSelected(key) &&
                !question.correctAnswer.includes(key) && (
                  <XCircle className="inline-block ml-2 text-red-400 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
                )}
            </span>
          </button>
        ))}
      </div>
      {showResult && selectedAnswer && question.explanation && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-900/15 border border-emerald-700/30 rounded-xl prose prose-invert prose-indigo max-w-none leading-loose">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-sm font-semibold">
            Explanation
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {formatText(question.explanation)}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
