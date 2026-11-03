'use client';

import React from 'react';
import { moduleLabel } from '@/lib/moduleLabel';
import Chip from './Chip';

interface ModuleSelectorProps {
  modules: (string | number)[];
  selectedModule: string | number | 'all';
  onSelect: (module: string | number | 'all') => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ modules, selectedModule, onSelect }) => {
  if (modules.length <= 1) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 justify-center" role="group" aria-label="Filter by module">
        <Chip active={selectedModule === 'all'} onClick={() => onSelect('all')} className="px-2.5">
          All
        </Chip>
        {modules.map((module) => (
          <Chip key={module} active={selectedModule === module} onClick={() => onSelect(module)} className="px-2.5">
            {moduleLabel(module)}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;
