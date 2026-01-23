'use client';

import React from 'react';
import { BankType } from '@/lib/types';

interface BankTypeSelectorProps {
  onSelect: (bankType: BankType) => void;
}

const BankTypeSelector: React.FC<BankTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Select Question Type
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onSelect('CLA')}
          className="px-8 py-4 text-white bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 font-semibold transition duration-200"
        >
          <div className="text-xl mb-2">CLA</div>
          <div className="text-sm opacity-90">Continuous Learning Assessment</div>
        </button>
        <button
          onClick={() => onSelect('Exam')}
          className="px-8 py-4 text-white bg-purple-700 hover:bg-purple-600 border border-purple-600 font-semibold transition duration-200"
        >
          <div className="text-xl mb-2">Exam</div>
          <div className="text-sm opacity-90">Examination Question Sets</div>
        </button>
      </div>
    </div>
  );
};

export default BankTypeSelector;
