'use client';

import React from 'react';
import { Target, Award, XCircle, CheckCircle, HelpCircle, Percent } from 'lucide-react';

interface QuizStatsProps {
  score: number;
  totalQuestions: number;
  answeredQuestions: (string | null)[];
}

const QuizStats: React.FC<QuizStatsProps> = ({
  score,
  totalQuestions,
  answeredQuestions,
}) => {
  const attempted = answeredQuestions.filter((answer) => answer !== null).length;
  const unattempted = totalQuestions - attempted;
  const accuracy = attempted > 0 ? (score / attempted) * 100 : 0;
  const completionPercentage = (attempted / totalQuestions) * 100;

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-white">
        Quiz Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex items-center">
          <Target className="text-indigo-400 mr-3" size={24} />
          <div>
            <p className="text-sm text-gray-400">Accuracy</p>
            <p className="text-lg font-semibold text-white">{accuracy.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <Award className="text-green-400 mr-3" size={24} />
          <div>
            <p className="text-sm text-gray-400">Correct Answers</p>
            <p className="text-lg font-semibold text-white">{score}</p>
          </div>
        </div>
        <div className="flex items-center">
          <XCircle className="text-red-400 mr-3" size={24} />
          <div>
            <p className="text-sm text-gray-400">Incorrect Answers</p>
            <p className="text-lg font-semibold text-white">{attempted - score}</p>
          </div>
        </div>
        <div className="flex items-center">
          <CheckCircle className="text-blue-400 mr-3" size={24} />
          <div>
            <p className="text-sm text-gray-400">Questions Attempted</p>
            <p className="text-lg font-semibold text-white">{attempted}</p>
          </div>
        </div>
        <div className="flex items-center">
          <HelpCircle className="text-yellow-400 mr-3" size={24} />
          <div>
            <p className="text-sm text-gray-400">Questions Remaining</p>
            <p className="text-lg font-semibold text-white">{unattempted}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Percent className="text-purple-400 mr-3" size={24} />
          <div>
            <p className="text-sm text-gray-400">Completion</p>
            <p className="text-lg font-semibold text-white">{completionPercentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStats;
