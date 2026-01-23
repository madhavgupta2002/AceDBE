'use client';

import React from 'react';
import { Question } from '@/lib/types';
import { CheckCircle, XCircle, Check } from 'lucide-react';

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

  const handleOptionClick = (option: string) => {
    if (showResult) return;

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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        {isMultipleAnswer && (
          <span className="px-3 py-1.5 bg-amber-900/50 text-amber-300 border border-amber-800 text-xs font-semibold rounded">
            Multiple Correct
          </span>
        )}
        {question.module && (
          <span className="px-3 py-1.5 bg-indigo-900/50 text-indigo-300 border border-indigo-800 text-xs font-semibold rounded">
            Module {question.module}
          </span>
        )}
        {question.source && (
          <span className="px-3 py-1.5 bg-purple-900/50 text-purple-300 border border-purple-800 text-xs font-semibold rounded">
            {question.source}
          </span>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-6 whitespace-pre-line text-white">
        {formatText(question.text)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionClick(key)}
            className={getButtonClass(key)}
            disabled={showResult}
          >
            <span className="flex items-center justify-between">
              <span className="flex items-center flex-1">
                <span className={`w-8 h-8 flex items-center justify-center mr-3 ${isSelected(key) && !showResult
                    ? 'bg-indigo-900 text-white'
                    : 'bg-gray-700 text-gray-200'
                  }`}>
                  {isMultipleAnswer && isSelected(key) && !showResult ? (
                    <Check size={16} />
                  ) : (
                    key
                  )}
                </span>
                <span className="whitespace-pre-line">{formatText(value)}</span>
              </span>
              {showResult && question.correctAnswer.includes(key) && (
                <CheckCircle className="inline-block ml-2 text-green-400 flex-shrink-0" size={24} />
              )}
              {showResult &&
                isSelected(key) &&
                !question.correctAnswer.includes(key) && (
                  <XCircle className="inline-block ml-2 text-red-400 flex-shrink-0" size={24} />
                )}
            </span>
          </button>
        ))}
      </div>
      {showResult && selectedAnswer && question.explanation && (
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-gray-200 whitespace-pre-line">{formatText(question.explanation)}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
