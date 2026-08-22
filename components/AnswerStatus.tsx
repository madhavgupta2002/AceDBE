'use client';

import React from 'react';

interface AnswerStatusProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: (string[] | null)[];
  correctAnswers: string[][];
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
    const userAnswer = answeredQuestions[index];
    if (userAnswer === null) {
      return 'bg-slate-700/60 text-slate-300 border border-slate-600/40 rounded-lg';
    }

    const correctAnswer = correctAnswers[index];

    // Subjective questions (no correct answer) stay neutral once viewed
    if (correctAnswer.length === 0 || userAnswer[0] === 'SUBJECTIVE_ACKNOWLEDGED') {
      return 'bg-indigo-700/60 text-white border border-indigo-500/50 rounded-lg';
    }

    // Check if arrays are equal
    const isCorrect = userAnswer.length === correctAnswer.length &&
      userAnswer.every(ans => correctAnswer.includes(ans));

    if (isCorrect) {
      return 'bg-emerald-700/70 text-white border border-emerald-600/50 rounded-lg';
    }
    return 'bg-red-700/70 text-white border border-red-600/50 rounded-lg';
  };

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">
        Answer Status
      </h3>
      <div className="grid grid-cols-8 sm:grid-cols-6 gap-1 sm:gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <button
            key={index}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-semibold text-xs sm:text-sm ${getStatusColor(
              index
            )} ${index === currentQuestionIndex
              ? 'ring-2 ring-emerald-400'
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
