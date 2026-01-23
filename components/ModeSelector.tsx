'use client';

import React, { useState } from 'react';
import { PracticeMode, QuestionOrder } from '@/lib/types';

interface ModeSelectorProps {
  onSelectMode: (mode: PracticeMode) => void;
  onSelectOrder: (order: QuestionOrder) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode, onSelectOrder }) => {
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<QuestionOrder | null>(null);

  const handleModeSelect = (mode: PracticeMode) => {
    setSelectedMode(mode);
    onSelectMode(mode);
  };

  const handleOrderSelect = (order: QuestionOrder) => {
    setSelectedOrder(order);
    onSelectOrder(order);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Select Practice Mode
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <button
            onClick={() => handleModeSelect('bank')}
            className={`px-6 py-3 text-white font-semibold transition duration-200 border ${selectedMode === 'bank'
                ? 'bg-indigo-700 border-indigo-600'
                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }`}
          >
            Modulewise Practice
          </button>
          <button
            onClick={() => handleModeSelect('full')}
            className={`px-6 py-3 text-white font-semibold transition duration-200 border ${selectedMode === 'full'
                ? 'bg-indigo-700 border-indigo-600'
                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }`}
          >
            Full Practice
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-300">
            Question Order
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleOrderSelect('random')}
              className={`px-6 py-3 text-white font-semibold transition duration-200 border ${selectedOrder === 'random'
                  ? 'bg-purple-700 border-purple-600'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                }`}
            >
              Random
            </button>
            <button
              onClick={() => handleOrderSelect('inOrder')}
              className={`px-6 py-3 text-white font-semibold transition duration-200 border ${selectedOrder === 'inOrder'
                  ? 'bg-purple-700 border-purple-600'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                }`}
            >
              In Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
