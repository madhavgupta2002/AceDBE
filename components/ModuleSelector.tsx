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
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 justify-center">
        <button
          onClick={() => onSelect('all')}
          className={`px-2.5 py-1 text-xs font-medium transition-all duration-200 border rounded-lg ${selectedModule === 'all'
            ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
            : 'bg-slate-700/60 text-slate-300 border-slate-600/40 hover:bg-slate-600 hover:border-emerald-500/40'
            }`}
        >
          All
        </button>
        {modules.map((module) => (
          <button
            key={module}
            onClick={() => onSelect(module)}
            className={`px-2.5 py-1 text-xs font-medium transition-all duration-200 border rounded-lg ${selectedModule === module
              ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
              : 'bg-slate-700/60 text-slate-300 border-slate-600/40 hover:bg-slate-600 hover:border-emerald-500/40'
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
