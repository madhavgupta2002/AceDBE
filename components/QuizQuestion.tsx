'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { CheckCircle, XCircle, Check, RotateCcw, Play, Pause } from 'lucide-react';
import StopWatch from './StopWatch';
import PassageCard from './PassageCard';
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
  questionNumber?: number;
  totalQuestions?: number;
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
  questionNumber,
  totalQuestions,
}) => {
  const isMultipleAnswer = question.correctAnswer.length > 1;
  const isSubjective = question.isSubjective || Object.keys(question.options).length === 0;

  // Images referenced via the "PARSEIMAGE" placeholder are resolved from a folder
  // named like the question bank, matching files by question number (e.g. PME_Q5_587.png).
  const [questionImages, setQuestionImages] = useState<string[]>([]);

  const hasPlaceholder = (s?: string) => !!s && s.includes('PARSEIMAGE');
  const textNeedsImage = hasPlaceholder(question.text);
  const explanationNeedsImage = hasPlaceholder(question.explanation);
  const optionsNeedImage = Object.values(question.options || {}).some((v) => hasPlaceholder(v));

  useEffect(() => {
    const needsImage = textNeedsImage || explanationNeedsImage || optionsNeedImage;

    if (
      !needsImage ||
      !question.subjectCode ||
      !question.bankType ||
      !question.source
    ) {
      setQuestionImages([]);
      return;
    }

    let cancelled = false;
    const params = new URLSearchParams({
      subjectCode: question.subjectCode,
      bankType: question.bankType,
      bankName: question.source,
      questionId: question.id,
    });

    fetch(`/api/question-image?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { images: [] }))
      .then((data) => {
        if (!cancelled) setQuestionImages(data.images || []);
      })
      .catch(() => {
        if (!cancelled) setQuestionImages([]);
      });

    return () => {
      cancelled = true;
    };
  }, [
    question.id,
    question.subjectCode,
    question.bankType,
    question.source,
    textNeedsImage,
    explanationNeedsImage,
    optionsNeedImage,
  ]);

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
      'w-full p-3 sm:p-4 text-left transition-all duration-200 border rounded-xl ';

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
    let processed = text.replace(/\\n/g, '\n');

    // Protect $$...$$ display math blocks so currency escaping doesn't touch them
    const mathBlocks: string[] = [];
    processed = processed.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
      mathBlocks.push(match);
      return `\x00MATH${mathBlocks.length - 1}\x00`;
    });

    // Escape currency dollar signs: $ optionally followed by whitespace then a digit or underscore
    // Patterns: $30, $ 2,500, $113,750, $___, etc.
    // This leaves inline math like $\times$ untouched (backslash follows $, not whitespace+digit)
    processed = processed.replace(/\$\s*(?=[0-9_])/g, '\\$');

    // Restore display math blocks
    processed = processed.replace(/\x00MATH(\d+)\x00/g, (_, i) => mathBlocks[parseInt(i)]);

    return processed;
  };

  const mdComponents = {
    p: ({ children }: any) => <span className="inline">{children}</span>,
  };

  // Render markdown text, replacing each "PARSEIMAGE" placeholder with the matching
  // resolved image (in order of appearance). Missing images are skipped silently.
  const renderRich = (text: string, components?: any): React.ReactNode => {
    if (!text) return null;
    if (!text.includes('PARSEIMAGE')) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={components}
        >
          {formatText(text)}
        </ReactMarkdown>
      );
    }

    const parts = text.split('PARSEIMAGE');
    const nodes: React.ReactNode[] = [];
    let imgIdx = 0;

    parts.forEach((part, i) => {
      if (part.trim()) {
        nodes.push(
          <ReactMarkdown
            key={`text-${i}`}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={components}
          >
            {formatText(part)}
          </ReactMarkdown>
        );
      }

      if (i < parts.length - 1) {
        const src = questionImages[imgIdx];
        imgIdx++;
        if (src) {
          nodes.push(
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`img-${i}`}
              src={src}
              alt={`Question figure ${imgIdx}`}
              className="my-4 mx-auto max-w-full rounded-lg border border-surface-border/60 bg-white"
            />
          );
        }
      }
    });

    return nodes;
  };

  // Render subjective question
  if (isSubjective) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {questionNumber !== undefined && totalQuestions !== undefined && (
            <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 text-[11px] font-medium rounded-md text-white tabular-nums">
              Q{questionNumber} / {totalQuestions}
            </span>
          )}
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium rounded-md">
            Subjective
          </span>
          {onClearResponse && selectedAnswer && (
              <button
                onClick={onClearResponse}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/70 border border-slate-700/60 hover:border-slate-500 rounded-md transition-colors"
                title="Clear response"
              >
                <RotateCcw size={11} />
                Clear
              </button>
          )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 ml-auto">
            {question.module && (
              <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 text-[11px] font-medium rounded-md text-slate-300">
                Mod {question.module}
              </span>
            )}
            {question.source && (
              <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 text-[11px] font-medium rounded-md text-slate-400 truncate max-w-[150px] sm:max-w-none">
                {question.source}
              </span>
            )}
            <button
              onClick={onToggleTimer}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-700/60 bg-slate-800/70 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              title={isTimerActive ? 'Pause timer' : 'Start timer'}
            >
              <StopWatch elapsedSeconds={elapsedSeconds} isActive={isTimerActive} />
              {isTimerActive ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>
        </div>
        {question.passage && <PassageCard question={question} className="mb-4" />}
        <div className="text-base sm:text-lg mb-4 sm:mb-6 text-slate-50 prose prose-invert prose-indigo max-w-none quiz-text">
          {renderRich(question.text)}
        </div>
        <div className="bg-yellow-900/15 border border-yellow-700/40 rounded-xl p-4 sm:p-6">
          <p className="text-yellow-200/90 mb-3 sm:mb-4 text-sm sm:text-base">
            Subjective question — write your answer on paper, then check the sample solution.
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
            {renderRich(question.explanation)}
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
          {questionNumber !== undefined && totalQuestions !== undefined && (
            <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 text-[11px] font-medium rounded-md text-white tabular-nums">
              Q{questionNumber} / {totalQuestions}
            </span>
          )}
          {isMultipleAnswer && (
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium rounded-md">
              Multiple Correct
            </span>
          )}
          {onClearResponse && selectedAnswer && (
            <button
              onClick={onClearResponse}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/70 border border-slate-700/60 hover:border-slate-500 rounded-md transition-colors"
              title="Clear response"
            >
              <RotateCcw size={11} />
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 ml-auto">
          {question.module && (
            <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 text-[11px] font-medium rounded-md text-slate-300">
              Mod {question.module}
            </span>
          )}
          {question.source && (
            <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 text-[11px] font-medium rounded-md text-slate-400 truncate max-w-[150px] sm:max-w-none">
              {question.source}
            </span>
          )}
          <button
            onClick={onToggleTimer}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-700/60 bg-slate-800/70 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            title={isTimerActive ? 'Pause timer' : 'Start timer'}
          >
            <StopWatch elapsedSeconds={elapsedSeconds} isActive={isTimerActive} />
            {isTimerActive ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>
      {question.passage && <PassageCard question={question} className="mb-4" />}
      <div className="text-base sm:text-lg mb-4 sm:mb-6 text-slate-50 prose prose-invert prose-indigo max-w-none quiz-text">
        {renderRich(question.text)}
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
                <span className="text-sm sm:text-[15px] prose prose-invert prose-indigo max-w-none prose-p:inline flex-1 quiz-text">
                  {renderRich(value || '', mdComponents)}
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
          {renderRich(question.explanation)}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
