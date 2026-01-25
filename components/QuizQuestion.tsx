'use client';

import React from 'react';
import { Question } from '@/lib/types';
import { CheckCircle, XCircle, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  selectedAnswer: string[] | null;
  showResult: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  showResult,
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
      'w-full p-4 font-semibold text-left transition duration-200 border ';

    if (!showResult) {
      if (isSelected(option)) {
        return baseClass + 'bg-indigo-700 text-white border-indigo-600';
      }
      return (
        baseClass +
        'bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700'
      );
    }

    if (question.correctAnswer.includes(option)) {
      return baseClass + 'bg-green-800 text-white border-green-700';
    }
    if (isSelected(option) && !question.correctAnswer.includes(option)) {
      return baseClass + 'bg-red-800 text-white border-red-700';
    }
    return baseClass + 'bg-gray-700 text-gray-400 border-gray-600';
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
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-900/50 text-yellow-300 border border-yellow-800 text-xs font-semibold rounded">
            Subjective
          </span>
          {question.module && (
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-900/50 text-indigo-300 border border-indigo-800 text-xs font-semibold rounded">
              Mod {question.module}
            </span>
          )}
          {question.source && (
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-900/50 text-purple-300 border border-purple-800 text-xs font-semibold rounded truncate max-w-[150px] sm:max-w-none">
              {question.source}
            </span>
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
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 sm:p-6">
          <p className="text-yellow-200 mb-3 sm:mb-4 text-sm sm:text-base">
            📝 This is a subjective question that requires a written answer.
            <br />
            Please answer this question on your exam paper or separately.
          </p>
          {!selectedAnswer && !showResult && (
            <button
              onClick={handleSubjectiveAcknowledge}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 font-semibold transition duration-200 text-sm sm:text-base"
            >
              View Sample Solution
            </button>
          )}
          {(selectedAnswer || showResult) && (
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle size={18} className="sm:hidden" />
              <CheckCircle size={20} className="hidden sm:block" />
              <span className="font-medium text-sm sm:text-base">Sample solution viewed</span>
            </div>
          )}
        </div>
        {/* Show explanation for subjective questions after viewing sample solution */}
        {(selectedAnswer || showResult) && question.explanation && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/30 border border-blue-700 rounded-lg prose prose-invert prose-indigo max-w-none">
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
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {isMultipleAnswer && (
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-900/50 text-amber-300 border border-amber-800 text-xs font-semibold rounded">
            Multiple Correct
          </span>
        )}
        {question.module && (
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-900/50 text-indigo-300 border border-indigo-800 text-xs font-semibold rounded">
            Mod {question.module}
          </span>
        )}
        {question.source && (
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-900/50 text-purple-300 border border-purple-800 text-xs font-semibold rounded truncate max-w-[150px] sm:max-w-none">
            {question.source}
          </span>
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
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionClick(key)}
            className={getButtonClass(key)}
            disabled={showResult}
          >
            <span className="flex items-center justify-between">
              <span className="flex items-center flex-1">
                <span className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 text-sm sm:text-base ${isSelected(key) && !showResult
                  ? 'bg-indigo-900 text-white'
                  : 'bg-gray-700 text-gray-200'
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
                <CheckCircle className="inline-block ml-2 text-green-400 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
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
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/30 border border-blue-700 rounded-lg prose prose-invert prose-indigo max-w-none">
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
