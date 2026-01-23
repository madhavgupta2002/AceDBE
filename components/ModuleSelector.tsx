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
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect('all')}
          className={`px-4 py-2 text-sm font-semibold transition duration-200 border ${
            selectedModule === 'all'
              ? 'bg-indigo-700 text-white border-indigo-600'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-indigo-500'
          }`}
        >
          All Modules
        </button>
        {modules.map((module) => (
          <button
            key={module}
            onClick={() => onSelect(module)}
            className={`px-4 py-2 text-sm font-semibold transition duration-200 border ${
              selectedModule === module
                ? 'bg-indigo-700 text-white border-indigo-600'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-indigo-500'
            }`}
          >
            Module {module}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;
