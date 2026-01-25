'use client';

import React from 'react';

interface ModuleSelectorProps {
  modules: (string | number)[];
  selectedModule: string | number | 'all';
  onSelect: (module: string | number | 'all') => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ modules, selectedModule, onSelect }) => {
  if (modules.length <= 1) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Filter by Module
      </label>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        <button
          onClick={() => onSelect('all')}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition duration-200 border rounded ${selectedModule === 'all'
            ? 'bg-indigo-700 text-white border-indigo-600'
            : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-indigo-500'
            }`}
        >
          All
        </button>
        {modules.map((module) => (
          <button
            key={module}
            onClick={() => onSelect(module)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition duration-200 border rounded ${selectedModule === module
              ? 'bg-indigo-700 text-white border-indigo-600'
              : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-indigo-500'
              }`}
          >
            M{module}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;
