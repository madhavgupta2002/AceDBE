'use client';

import React, { useState, useEffect } from 'react';
import { SetWithModules, getSetsWithModules } from '@/lib/questionLoader';
import { Shuffle, Check, MonitorPlay } from 'lucide-react';

interface UnifiedQuizSelectorProps {
  subjectCode: string;
  onStartQuiz: (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }>;
    randomOrder: boolean;
  }) => void;
  onStartRevise: (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }>;
    randomOrder: boolean;
  }) => void;
  /** Take a single Exam paper as a CBT exam (exam-centre interface). */
  onStartCbt?: (bankName: string, date: string) => void;
}

type SelectionMap = Map<string, Set<string | number>>;

const UnifiedQuizSelector: React.FC<UnifiedQuizSelectorProps> = ({ subjectCode, onStartQuiz, onStartRevise, onStartCbt }) => {
  const [claSets, setClaSets] = useState<SetWithModules[]>([]);
  const [examSets, setExamSets] = useState<SetWithModules[]>([]);
  const [customSets, setCustomSets] = useState<SetWithModules[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<SelectionMap>(new Map());
  const [randomOrder, setRandomOrder] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // Derived state for unique module numbers across all sets
  const allModules = Array.from(new Set(
    [...claSets, ...examSets].flatMap(set => set.modules)
  )).sort((a, b) => {
    const na = typeof a === 'number' ? a : parseInt(a.toString()) || 0;
    const nb = typeof b === 'number' ? b : parseInt(b.toString()) || 0;
    return na - nb;
  });

  useEffect(() => {
    const loadSets = async () => {
      setLoading(true);
      try {
        const { cla, exam, custom } = await getSetsWithModules(subjectCode);
        setClaSets(cla);
        setExamSets(exam);
        setCustomSets(custom);
      } catch (error) {
        console.error('Error loading sets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSets();
  }, [subjectCode]);

  const getSetKey = (bankName: string, bankType: 'CLA' | 'Exam' | 'Custom') => `${bankType}:${bankName}`;

  const isModuleSelected = (bankName: string, bankType: 'CLA' | 'Exam' | 'Custom', module: string | number): boolean => {
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

  const toggleModule = (bankName: string, bankType: 'CLA' | 'Exam' | 'Custom', module: string | number) => {
    setSelections((prev) => {
      const newSelections = new Map();
      const key = getSetKey(bankName, bankType);

      // Mutually exclusive: If selecting a Custom quiz, clear others. If selecting CLA/Exam, clear Custom.
      if (bankType === 'Custom') {
        // Find existing custom selections (though we'll probably only allow one for simplicity as per "independently")
        // But let's just clear everything else first if we were in CLA/Exam mode
        const hasNonCustom = Array.from(prev.keys()).some(k => !k.startsWith('Custom:'));
        if (hasNonCustom) {
          // Keep only current custom key if it was already selected, or start fresh
        } else {
          // If already in custom mode, we can either allow multiple custom or keep it single.
          // The user said "independently", let's allow only ONE custom selection at a time for maximum clarity.
          newSelections.clear();
        }
      } else {
        // Selecting CLA or Exam -> Clear all custom selections
        prev.forEach((val, k) => {
          if (!k.startsWith('Custom:')) {
            newSelections.set(k, val);
          }
        });
      }

      // Get existing selection or create new Set
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
      let newSelections = new Map(prev);

      // Mutual exclusivity logic
      if (set.bankType === 'Custom') {
        // If selecting a custom set, clear everything else
        if (!isFullySelected) {
          newSelections = new Map();
        }
      } else {
        // If selecting CLA/Exam, clear custom sets
        const hasCustom = Array.from(newSelections.keys()).some(k => k.startsWith('Custom:'));
        if (hasCustom) {
          const filtered = new Map();
          newSelections.forEach((v, k) => {
            if (!k.startsWith('Custom:')) filtered.set(k, v);
          });
          newSelections = filtered;
        }
      }

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

  const toggleModuleAcrossAllSets = (moduleNum: string | number) => {
    // Determine if this module is currently selected in ALL sets that contain it
    const relevantSets = [...claSets, ...examSets].filter(set => set.modules.includes(moduleNum));

    if (relevantSets.length === 0) return;

    const isFullySelectedAcrossAll = relevantSets.every(set =>
      isModuleSelected(set.bankName, set.bankType, moduleNum)
    );

    setSelections((prev) => {
      // Preserve existing CLA/Exam selections; drop any custom selection
      // (custom quizzes remain mutually exclusive with CLA/Exam picks)
      const newSelections = new Map();
      prev.forEach((val, k) => {
        if (!k.startsWith('Custom:')) newSelections.set(k, val);
      });

      relevantSets.forEach(set => {
        const key = getSetKey(set.bankName, set.bankType);
        const currentSet = newSetFromMap(newSelections, key);

        if (isFullySelectedAcrossAll) {
          // Deselect in all
          currentSet.delete(moduleNum);
        } else {
          // Select in all
          currentSet.add(moduleNum);
          currentSet.delete('__ALL__');
        }

        if (currentSet.size === 0) {
          newSelections.delete(key);
        } else {
          newSelections.set(key, currentSet);
        }
      });

      return newSelections;
    });
  };

  // Helper to get a new set from map or return a new empty set
  const newSetFromMap = (map: SelectionMap, key: string): Set<string | number> => {
    const existing = map.get(key);
    return existing ? new Set(existing) : new Set<string | number>();
  };

  const isModuleSelectedInAllRelevantSets = (moduleNum: string | number): boolean => {
    const relevantSets = [...claSets, ...examSets].filter(set => set.modules.includes(moduleNum));
    if (relevantSets.length === 0) return false;
    return relevantSets.every(set => isModuleSelected(set.bankName, set.bankType, moduleNum));
  };

  const selectAll = () => {
    setSelections((prev) => {
      const newSelections = new Map(); // Start fresh to clear custom

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
    const selectedSets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }> = [];

    selections.forEach((modules, key) => {
      const parts = key.split(':');
      const bankType = parts[0];
      const bankName = parts.slice(1).join(':');
      if (modules.size > 0) {
        // Filter out the special marker and convert to array
        const moduleArray = Array.from(modules).filter(m => m !== '__ALL__') as (string | number)[];

        selectedSets.push({
          bankName,
          bankType: bankType as 'CLA' | 'Exam' | 'Custom',
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

  const handleStartRevise = () => {
    const selectedSets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }> = [];

    selections.forEach((modules, key) => {
      const parts = key.split(':');
      const bankType = parts[0];
      const bankName = parts.slice(1).join(':');
      if (modules.size > 0) {
        // Filter out the special marker and convert to array
        const moduleArray = Array.from(modules).filter(m => m !== '__ALL__') as (string | number)[];

        selectedSets.push({
          bankName,
          bankType: bankType as 'CLA' | 'Exam' | 'Custom',
          modules: moduleArray.length > 0 ? moduleArray : [],
        });
      }
    });

    if (selectedSets.length === 0) {
      alert('Please select at least one set or module to start revision.');
      return;
    }

    onStartRevise({
      sets: selectedSets,
      randomOrder: randomOrder,
    });
  };

  const renderSet = (set: SetWithModules) => {
    const isFullySelected = isSetFullySelected(set);
    const isPartiallySelected = isSetPartiallySelected(set);

    return (
      <div key={getSetKey(set.bankName, set.bankType)} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-surface-dark/40 border border-surface-border/40 rounded-xl">
        <button
          onClick={() => toggleSet(set)}
          className={`w-full text-left mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${isFullySelected ? 'text-emerald-400' : isPartiallySelected ? 'text-yellow-400' : 'text-white'
            } font-semibold hover:text-emerald-300 transition-colors`}
        >
          {/* Circle that becomes a tick when selected */}
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isFullySelected
            ? 'bg-emerald-600 border-emerald-500'
            : isPartiallySelected
              ? 'bg-yellow-600 border-yellow-500'
              : 'bg-slate-800 border-slate-600'
            }`}>
            {isFullySelected && <Check className="w-3 h-3 text-white" />}
            {isPartiallySelected && <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>}
          </div>
          <span className="truncate">{set.displayName}</span>
        </button>

        {set.bankType === 'Exam' && onStartCbt && (
          <button
            type="button"
            onClick={() => onStartCbt(set.bankName, set.exam_date || set.displayName)}
            className="mb-2 sm:mb-3 ml-4 sm:ml-6 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/50 hover:bg-violet-600 border border-violet-700/50 text-violet-200 hover:text-white text-xs font-bold transition-colors"
          >
            <MonitorPlay className="w-3.5 h-3.5" /> CBT Exam
          </button>
        )}

        {set.modules.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-4 sm:ml-6">
            {set.modules.map((module) => {
              const selected = isModuleSelected(set.bankName, set.bankType, module);
              return (
                <button
                  key={module}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModule(set.bankName, set.bankType, module);
                  }}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 border rounded-lg ${selected
                    ? 'bg-emerald-600/80 text-white border-emerald-500/50'
                    : 'bg-slate-700/60 text-slate-300 border-slate-600/40 hover:bg-slate-600 hover:border-emerald-500/40'
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
        <p className="text-slate-400">Loading question sets...</p>
      </div>
    );
  }

  const allSelected = isAllSelected();

  return (
    <div className="w-full">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-xs text-slate-500 hidden sm:block">
          Click set name to select all questions
        </p>
        <div className="flex-1 sm:hidden"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={allSelected ? deselectAll : selectAll}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 font-semibold transition-all duration-200 border text-xs sm:text-sm rounded-lg ${allSelected
              ? 'bg-slate-700/60 text-white border-slate-600/40 hover:bg-slate-600'
              : 'bg-purple-600/80 text-white border-purple-500/40 hover:bg-purple-500'
              }`}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>

          <button
            onClick={() => setRandomOrder(!randomOrder)}
            className={`p-1.5 sm:p-2 transition-all duration-200 border rounded-lg ${randomOrder
              ? 'bg-purple-600/80 text-white border-purple-500/40'
              : 'bg-slate-800/60 text-slate-300 border-slate-700/40 hover:bg-slate-700'
              }`}
            title="Random Order"
          >
            <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {customSets.length > 0 && (
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 font-semibold transition-all duration-200 border text-xs sm:text-sm rounded-lg ${showCustom
                ? 'bg-purple-600/80 text-white border-purple-500/40 hover:bg-purple-500'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/40 hover:bg-slate-700'
                }`}
            >
              {showCustom ? 'Hide Custom' : 'Show Custom Quizzes'}
            </button>
          )}
        </div>
      </div>

      {/* Custom Quizzes Selection (MUTUALLY EXCLUSIVE) */}
      {showCustom && customSets.length > 0 && (
        <div className="mb-6 p-4 bg-surface border-2 border-purple-800/30 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center justify-between">
            <span></span>
            <span className="text-xs font-normal text-purple-400">Selected independently (clears other selections)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customSets.map(set => (
              <button
                key={getSetKey(set.bankName, 'Custom')}
                onClick={() => toggleSet(set)}
                className={`text-left p-3 border transition-all duration-200 flex items-center gap-2 text-sm rounded-lg ${isSetFullySelected(set)
                  ? 'bg-purple-900/30 border-purple-500/50 text-white'
                  : 'bg-surface-dark/40 border-slate-700/40 text-slate-400 hover:border-purple-500/40'
                  }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSetFullySelected(set)
                  ? 'bg-purple-600 border-purple-500'
                  : 'bg-slate-800 border-slate-600'
                  }`}>
                  {isSetFullySelected(set) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{set.displayName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select By Module - Bulk Selection */}
      {allModules.length > 0 && (
        <div className="mb-6 p-4 bg-surface border border-surface-border/60 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center justify-between">
            <span>Select By Module</span>
            <span className="text-xs font-normal text-slate-500">Selects across all CLA & Exams</span>
          </h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {allModules.map((module) => {
              const isActive = isModuleSelectedInAllRelevantSets(module);
              return (
                <button
                  key={`bulk-${module}`}
                  onClick={() => toggleModuleAcrossAllSets(module)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border rounded-lg ${isActive
                    ? 'bg-emerald-600/80 text-white border-emerald-500/50 shadow-glow-emerald'
                    : 'bg-slate-700/60 text-slate-300 border-slate-600/40 hover:bg-slate-600 hover:border-emerald-500/40'
                    }`}
                >
                  M{module}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CLA and Exam Sets Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* CLA Sets */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white border-b border-slate-700/40 pb-2">
            CLA
          </h2>
          {claSets.length === 0 ? (
            <p className="text-slate-500 text-sm">No CLA sets available</p>
          ) : (
            claSets.map(renderSet)
          )}
        </div>

        {/* Exam Sets */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white border-b border-slate-700/40 pb-2">
            Exam
          </h2>
          {examSets.length === 0 ? (
            <p className="text-slate-500 text-sm">No Exam sets available</p>
          ) : (
            examSets.map(renderSet)
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3">
        <button
          onClick={handleStartQuiz}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white border border-emerald-700/35 font-semibold text-base sm:text-lg hover:from-emerald-800 hover:to-emerald-700 transition-all duration-200 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          ▶ Start Quiz
        </button>
        <button
          onClick={handleStartRevise}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white border border-blue-700/35 font-semibold text-base sm:text-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-200 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          ✏️ Revise
        </button>
      </div>
    </div>
  );
};

export default UnifiedQuizSelector;
