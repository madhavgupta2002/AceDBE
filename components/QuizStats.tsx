'use client';

import React from 'react';
import { Target, Award, XCircle, CheckCircle, HelpCircle, Percent } from 'lucide-react';

interface QuizStatsProps {
  score: number;
  totalQuestions: number;
  answeredQuestions: (string[] | null)[];
  size?: 'compact' | 'large';
}

const QuizStats: React.FC<QuizStatsProps> = ({
  score,
  totalQuestions,
  answeredQuestions,
  size = 'compact',
}) => {
  const attempted = answeredQuestions.filter((answer) => answer !== null).length;
  const unattempted = totalQuestions - attempted;
  const accuracy = attempted > 0 ? (score / attempted) * 100 : 0;
  const completionPercentage = (attempted / totalQuestions) * 100;

  const isLarge = size === 'large';
  const iconSize = isLarge ? 20 : 14;
  const textSize = isLarge ? 'text-sm' : 'text-xs';
  const padding = isLarge ? 'px-4 py-4' : 'px-3 py-2';
  const gap = isLarge ? 'gap-1' : 'gap-0.5';
  const valueSize = isLarge ? 'text-lg' : '';

  return (
    <div className={`bg-gray-800 border border-gray-700 ${padding}`}>
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 ${textSize}`}>
        <div className={`flex flex-col items-center ${gap}`}>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="text-blue-400 flex-shrink-0" size={iconSize} />
            <span className="text-gray-400">Attempted</span>
          </div>
          <span className={`font-semibold text-white ${valueSize}`}>{attempted}</span>
        </div>
        <div className={`flex flex-col items-center ${gap}`}>
          <div className="flex items-center gap-1.5">
            <Award className="text-green-400 flex-shrink-0" size={iconSize} />
            <span className="text-gray-400">Correct</span>
          </div>
          <span className={`font-semibold text-white ${valueSize}`}>{score}</span>
        </div>
        <div className={`flex flex-col items-center ${gap}`}>
          <div className="flex items-center gap-1.5">
            <XCircle className="text-red-400 flex-shrink-0" size={iconSize} />
            <span className="text-gray-400">Incorrect</span>
          </div>
          <span className={`font-semibold text-white ${valueSize}`}>{attempted - score}</span>
        </div>
        <div className={`flex flex-col items-center ${gap}`}>
          <div className="flex items-center gap-1.5">
            <Percent className="text-purple-400 flex-shrink-0" size={iconSize} />
            <span className="text-gray-400">Completion</span>
          </div>
          <span className={`font-semibold text-white ${valueSize}`}>{completionPercentage.toFixed(1)}%</span>
        </div>
        <div className={`flex flex-col items-center ${gap}`}>
          <div className="flex items-center gap-1.5">
            <Target className="text-indigo-400 flex-shrink-0" size={iconSize} />
            <span className="text-gray-400">Accuracy</span>
          </div>
          <span className={`font-semibold text-white ${valueSize}`}>{accuracy.toFixed(1)}%</span>
        </div>
        <div className={`flex flex-col items-center ${gap}`}>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="text-yellow-400 flex-shrink-0" size={iconSize} />
            <span className="text-gray-400">Remaining</span>
          </div>
          <span className={`font-semibold text-white ${valueSize}`}>{unattempted}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizStats;
