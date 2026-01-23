'use client';

import React, { useState, useEffect } from 'react';
import { SetWithModules, getSetsWithModules } from '@/lib/questionLoader';
import { Shuffle, Check } from 'lucide-react';

interface UnifiedQuizSelectorProps {
  subjectCode: string;
  onStartQuiz: (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam'; modules: (string | number)[] }>;
    randomOrder: boolean;
  }) => void;
}

type SelectionMap = Map<string, Set<string | number>>;

const UnifiedQuizSelector: React.FC<UnifiedQuizSelectorProps> = ({ subjectCode, onStartQuiz }) => {
  const [claSets, setClaSets] = useState<SetWithModules[]>([]);
  const [examSets, setExamSets] = useState<SetWithModules[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<SelectionMap>(new Map());
  const [randomOrder, setRandomOrder] = useState(false);

  useEffect(() => {
    const loadSets = async () => {
      setLoading(true);
      try {
        const { cla, exam } = await getSetsWithModules(subjectCode);
        setClaSets(cla);
        setExamSets(exam);
      } catch (error) {
        console.error('Error loading sets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSets();
  }, [subjectCode]);

  const getSetKey = (bankName: string, bankType: 'CLA' | 'Exam') => `${bankType}:${bankName}`;

  const isModuleSelected = (bankName: string, bankType: 'CLA' | 'Exam', module: string | number): boolean => {
    const key = getSetKey(bankName, bankType);
    const moduleSet = selections.get(key);
    // Check if module is in the set (ignore __ALL__ marker)
    return moduleSet?.has(module) || false;
  };

  const isSetFullySelected = (set: SetWithModules): boolean => {
    const key = getSetKey(set.bankName, set.bankType);
    const selectedModules = selections.get(key);

    // For sets without modules, check if the set is selected (marked with special empty array marker)
    if (set.modules.length === 0) {
      // Use a special marker to indicate "all questions from this set"
      return selectedModules?.has('__ALL__') || false;
    }

    return selectedModules?.size === set.modules.length;
  };

  const isSetPartiallySelected = (set: SetWithModules): boolean => {
    const key = getSetKey(set.bankName, set.bankType);
    const selectedModules = selections.get(key);

    // Sets without modules can't be partially selected
    if (set.modules.length === 0) return false;

    return (selectedModules?.size || 0) > 0 && (selectedModules?.size || 0) < set.modules.length;
  };

  const toggleModule = (bankName: string, bankType: 'CLA' | 'Exam', module: string | number) => {
    setSelections((prev) => {
      const newSelections = new Map(prev);
      const key = getSetKey(bankName, bankType);
      // Get existing selection or create new Set - IMPORTANT: create a new Set to ensure React detects the change
      const existingSet = newSelections.get(key);
      const moduleSet = existingSet ? new Set(existingSet) : new Set<string | number>();

      // Remove __ALL__ marker if present (we're selecting individual modules now)
      moduleSet.delete('__ALL__');

      // Toggle the module: if selected, deselect it; if not selected, select it
      // This allows deselecting individual modules even when the entire set is selected
      if (moduleSet.has(module)) {
        moduleSet.delete(module);
      } else {
        moduleSet.add(module);
      }

      // If no modules are selected, remove the key from the map
      if (moduleSet.size === 0) {
        newSelections.delete(key);
      } else {
        // Update with the new Set (keeps other selected modules intact)
        newSelections.set(key, moduleSet);
      }

      return newSelections;
    });
  };

  const toggleSet = (set: SetWithModules) => {
    const key = getSetKey(set.bankName, set.bankType);
    const isFullySelected = isSetFullySelected(set);

    setSelections((prev) => {
      const newSelections = new Map(prev);

      if (isFullySelected) {
        // Deselect all modules
        newSelections.delete(key);
      } else {
        // Select all modules
        if (set.modules.length === 0) {
          // For sets without modules, use a special marker to indicate "select all"
          newSelections.set(key, new Set(['__ALL__']));
        } else {
          newSelections.set(key, new Set(set.modules));
        }
      }

      return newSelections;
    });
  };

  const selectAll = () => {
    setSelections((prev) => {
      const newSelections = new Map(prev);

      [...claSets, ...examSets].forEach((set) => {
        const key = getSetKey(set.bankName, set.bankType);
        if (set.modules.length > 0) {
          newSelections.set(key, new Set(set.modules));
        } else {
          // For sets without modules, use special marker
          newSelections.set(key, new Set(['__ALL__']));
        }
      });

      return newSelections;
    });
  };

  const deselectAll = () => {
    setSelections(new Map());
  };

  const isAllSelected = () => {
    const allSets = [...claSets, ...examSets];
    if (allSets.length === 0) return false;

    return allSets.every((set) => {
      const key = getSetKey(set.bankName, set.bankType);
      const selectedModules = selections.get(key);

      if (set.modules.length === 0) {
        // For sets without modules, check for special marker
        return selectedModules?.has('__ALL__') || false;
      }

      return selectedModules?.size === set.modules.length;
    });
  };

  const handleStartQuiz = () => {
    const selectedSets: Array<{ bankName: string; bankType: 'CLA' | 'Exam'; modules: (string | number)[] }> = [];

    selections.forEach((modules, key) => {
      const [bankType, bankName] = key.split(':');
      if (modules.size > 0) {
        // Filter out the special marker and convert to array
        const moduleArray = Array.from(modules).filter(m => m !== '__ALL__') as (string | number)[];

        selectedSets.push({
          bankName,
          bankType: bankType as 'CLA' | 'Exam',
          // If modules array is empty after filtering __ALL__, it means select all questions from this set
          // We'll pass empty array to indicate "all questions" in the quiz loader
          modules: moduleArray.length > 0 ? moduleArray : [],
        });
      }
    });

    if (selectedSets.length === 0) {
      alert('Please select at least one set or module to start the quiz.');
      return;
    }

    onStartQuiz({
      sets: selectedSets,
      randomOrder: randomOrder,
    });
  };

  const renderSet = (set: SetWithModules) => {
    const isFullySelected = isSetFullySelected(set);
    const isPartiallySelected = isSetPartiallySelected(set);

    return (
      <div key={getSetKey(set.bankName, set.bankType)} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded">
        <button
          onClick={() => toggleSet(set)}
          className={`w-full text-left mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${isFullySelected ? 'text-indigo-400' : isPartiallySelected ? 'text-yellow-400' : 'text-white'
            } font-semibold hover:text-indigo-300 transition-colors`}
        >
          {/* Circle that becomes a tick when selected */}
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isFullySelected
              ? 'bg-indigo-700 border-indigo-600'
              : isPartiallySelected
                ? 'bg-yellow-700 border-yellow-600'
                : 'bg-gray-800 border-gray-600'
            }`}>
            {isFullySelected && <Check className="w-3 h-3 text-white" />}
            {isPartiallySelected && <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>}
          </div>
          <span className="truncate">{set.displayName}</span>
        </button>

        {set.modules.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-4 sm:ml-6">
            {set.modules.map((module) => {
              const selected = isModuleSelected(set.bankName, set.bankType, module);
              return (
                <button
                  key={module}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering set toggle
                    toggleModule(set.bankName, set.bankType, module);
                  }}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition duration-200 border rounded ${selected
                      ? 'bg-indigo-700 text-white border-indigo-600'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-indigo-500'
                    }`}
                >
                  M{module}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300">Loading question sets...</p>
      </div>
    );
  }

  const allSelected = isAllSelected();

  return (
    <div className="w-full">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <button
          onClick={allSelected ? deselectAll : selectAll}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition duration-200 border text-sm sm:text-base ${allSelected
            ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
            : 'bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-600'
            }`}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>

        <p className="text-xs text-gray-400 text-center hidden sm:block">
          Click set name to select all questions
        </p>

        <button
          onClick={() => setRandomOrder(!randomOrder)}
          className={`p-2.5 sm:p-3 transition duration-200 border rounded self-end sm:self-auto ${randomOrder
            ? 'bg-purple-700 text-white border-purple-600'
            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          title="Random Order"
        >
          <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* CLA and Exam Sets Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* CLA Sets */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white border-b border-gray-700 pb-2">
            CLA
          </h2>
          {claSets.length === 0 ? (
            <p className="text-gray-400 text-sm">No CLA sets available</p>
          ) : (
            claSets.map(renderSet)
          )}
        </div>

        {/* Exam Sets */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white border-b border-gray-700 pb-2">
            Exam
          </h2>
          {examSets.length === 0 ? (
            <p className="text-gray-400 text-sm">No Exam sets available</p>
          ) : (
            examSets.map(renderSet)
          )}
        </div>
      </div>

      {/* Start Quiz Button */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <button
          onClick={handleStartQuiz}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-700 text-white border border-green-600 font-semibold text-base sm:text-lg hover:bg-green-600 transition duration-200"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default UnifiedQuizSelector;
