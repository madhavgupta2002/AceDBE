'use client';

import React from 'react';

interface AnswerStatusProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: (string | null)[];
  correctAnswers: string[];
  onQuestionSelect: (index: number) => void;
}

const AnswerStatus: React.FC<AnswerStatusProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  correctAnswers,
  onQuestionSelect,
}) => {
  const getStatusColor = (index: number) => {
    if (answeredQuestions[index] === null) {
      return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
    if (answeredQuestions[index] === correctAnswers[index]) {
      return 'bg-green-700 text-white border border-green-600';
    }
    return 'bg-red-700 text-white border border-red-600';
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Answer Status
      </h3>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <button
            key={index}
            className={`w-10 h-10 flex items-center justify-center font-semibold ${getStatusColor(
              index
            )} ${
              index === currentQuestionIndex
                ? 'ring-2 ring-indigo-500'
                : ''
            }`}
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnswerStatus;
