'use client';

import React from 'react';
import { Question } from '@/lib/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  showResult,
}) => {
  const getButtonClass = (option: string) => {
    let baseClass =
      'w-full p-4 font-semibold text-left transition duration-200 border ';
    if (!showResult) {
      return (
        baseClass +
        'bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700'
      );
    }
    if (option === question.correctAnswer) {
      return baseClass + 'bg-green-800 text-white border-green-700';
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
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
            onClick={() => !showResult && onAnswer(key)}
            className={getButtonClass(key)}
            disabled={showResult}
          >
            <span className="flex items-center">
              <span className="w-8 h-8 bg-gray-700 flex items-center justify-center mr-3 text-gray-200">
                {key}
              </span>
              <span className="whitespace-pre-line">{formatText(value)}</span>
            </span>
            {showResult && key === question.correctAnswer && (
              <CheckCircle className="inline-block ml-2 text-green-400" size={24} />
            )}
            {showResult &&
              key === selectedAnswer &&
              key !== question.correctAnswer && (
                <XCircle className="inline-block ml-2 text-red-400" size={24} />
              )}
          </button>
        ))}
      </div>
      {showResult && selectedAnswer && question.explanation && (
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          {/* <h3 className="text-lg font-semibold text-blue-300 mb-2">Explanation</h3> */}
          <p className="text-gray-200 whitespace-pre-line">{formatText(question.explanation)}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
