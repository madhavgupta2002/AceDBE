'use client';

import React, { useState, useEffect } from 'react';
import { SetWithModules, getSetsWithModules } from '@/lib/questionLoader';
import { Shuffle, Check, MonitorPlay, Play, BookOpenCheck, History, Loader2 } from 'lucide-react';
import { moduleLabel } from '@/lib/moduleLabel';
import { useAuth } from '@/contexts/AuthContext';
import { fetchSetsWithHistory, setKey } from '@/lib/history';
import HistoryDialog from './HistoryDialog';
import Button from './Button';
import Chip from './Chip';

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
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selections, setSelections] = useState<SelectionMap>(new Map());
  const [randomOrder, setRandomOrder] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const { user } = useAuth();
  const [setsWithHistory, setSetsWithHistory] = useState<Set<string>>(new Set());
  const [historyFor, setHistoryFor] = useState<SetWithModules | null>(null);

  useEffect(() => {
    if (!user) {
      setSetsWithHistory(new Set());
      return;
    }
    let cancelled = false;
    fetchSetsWithHistory(subjectCode).then(s => !cancelled && setSetsWithHistory(s));
    return () => {
      cancelled = true;
    };
  }, [subjectCode, user]);

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
      setLoadError(false);
      try {
        const { cla, exam, custom } = await getSetsWithModules(subjectCode);
        setClaSets(cla);
        setExamSets(exam);
        setCustomSets(custom);
      } catch (error) {
        console.error('Error loading sets:', error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadSets();
  }, [subjectCode, reloadKey]);

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
    setSelections(() => {
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

  const buildSelectedSets = () => {
    const selectedSets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }> = [];

    selections.forEach((modules, key) => {
      const parts = key.split(':');
      const bankType = parts[0];
      const bankName = parts.slice(1).join(':');
      if (modules.size > 0) {
        // Filter out the special marker; an empty module list means "all questions" in the quiz loader
        const moduleArray = Array.from(modules).filter(m => m !== '__ALL__') as (string | number)[];
        selectedSets.push({
          bankName,
          bankType: bankType as 'CLA' | 'Exam' | 'Custom',
          modules: moduleArray,
        });
      }
    });

    return selectedSets;
  };

  const hasSelection = Array.from(selections.values()).some(m => m.size > 0);

  const handleStartQuiz = () => {
    const sets = buildSelectedSets();
    if (sets.length === 0) return;
    onStartQuiz({ sets, randomOrder });
  };

  const handleStartRevise = () => {
    const sets = buildSelectedSets();
    if (sets.length === 0) return;
    onStartRevise({ sets, randomOrder });
  };

  const renderSet = (set: SetWithModules) => {
    const isFullySelected = isSetFullySelected(set);
    const isPartiallySelected = isSetPartiallySelected(set);
    const hasHistory = set.bankType !== 'Custom' && setsWithHistory.has(setKey(set.bankType, set.bankName));

    return (
      <div key={getSetKey(set.bankName, set.bankType)} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-surface-dark/40 border border-surface-border/40 rounded-xl">
        <button
          onClick={() => toggleSet(set)}
          aria-pressed={isFullySelected}
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

        {((set.bankType === 'Exam' && onStartCbt) || hasHistory) && (
          <div className="mb-2 sm:mb-3 ml-4 sm:ml-6 flex flex-wrap gap-1.5">
            {set.bankType === 'Exam' && onStartCbt && (
              <button
                type="button"
                onClick={() => onStartCbt(set.bankName, set.exam_date || set.displayName)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/50 hover:bg-violet-600 border border-violet-700/50 text-violet-200 hover:text-white text-xs font-bold transition-colors"
              >
                <MonitorPlay className="w-3.5 h-3.5" /> CBT Exam
              </button>
            )}
            {hasHistory && (
              <button
                type="button"
                onClick={() => setHistoryFor(set)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-600/60 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                <History className="w-3.5 h-3.5" /> See history
              </button>
            )}
          </div>
        )}

        {set.modules.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-4 sm:ml-6">
            {set.modules.map((module) => {
              const selected = isModuleSelected(set.bankName, set.bankType, module);
              return (
                <Chip
                  key={module}
                  active={selected}
                  onClick={() => toggleModule(set.bankName, set.bankType, module)}
                  className="px-2 sm:px-3"
                >
                  {moduleLabel(module)}
                </Chip>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div role="status" className="flex flex-col items-center gap-2 py-12 text-sm text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        Loading question sets...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-300 text-sm mb-3">Could not load question sets.</p>
        <Button variant="primary" onClick={() => setReloadKey(k => k + 1)}>
          Retry
        </Button>
      </div>
    );
  }

  const allSelected = isAllSelected();

  return (
    <div className="w-full">
      {/* Toolbar: module shortcuts on the left, whole-bank actions on the right */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {allModules.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Modules</span>
            {allModules.map((module) => {
              const isActive = isModuleSelectedInAllRelevantSets(module);
              return (
                <Chip
                  key={`bulk-${module}`}
                  active={isActive}
                  onClick={() => toggleModuleAcrossAllSets(module)}
                  title={`Select module ${module} in every CLA and exam set`}
                >
                  {moduleLabel(module)}
                </Chip>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          <Chip active={allSelected} onClick={allSelected ? deselectAll : selectAll}>
            {allSelected ? 'Deselect all' : 'Select all'}
          </Chip>
          <Chip
            active={randomOrder}
            onClick={() => setRandomOrder(!randomOrder)}
            className="w-8"
            title={randomOrder ? 'Random order: on' : 'Random order: off'}
            aria-label="Random order"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </Chip>
          {customSets.length > 0 && (
            <Chip active={showCustom} onClick={() => setShowCustom(!showCustom)}>
              {showCustom ? 'Hide custom' : 'Custom quizzes'}
            </Chip>
          )}
        </div>
      </div>
      <p className="mt-2 mb-5 text-[11px] text-slate-400">
        Pick a module to select it in every set, or click a set name to select that whole set.
      </p>

      {/* Custom Quizzes Selection (MUTUALLY EXCLUSIVE) */}
      {showCustom && customSets.length > 0 && (
        <div className="mb-6 p-4 bg-surface border-2 border-purple-800/30 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center justify-between">
            <span>Custom quizzes</span>
            <span className="text-xs font-normal text-purple-400">Selected independently (clears other selections)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customSets.map(set => (
              <button
                key={getSetKey(set.bankName, 'Custom')}
                onClick={() => toggleSet(set)}
                aria-pressed={isSetFullySelected(set)}
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

      {/* CLA and Exam Sets Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* CLA Sets */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white border-b border-slate-700/40 pb-2">
            CLA
          </h2>
          {claSets.length === 0 ? (
            <p className="text-slate-400 text-sm">No CLA sets available</p>
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
            <p className="text-slate-400 text-sm">No Exam sets available</p>
          ) : (
            examSets.map(renderSet)
          )}
        </div>
      </div>

      {historyFor && (
        <HistoryDialog
          subjectCode={subjectCode}
          set={setKey(historyFor.bankType, historyFor.bankName)}
          title={historyFor.displayName}
          onClose={() => setHistoryFor(null)}
        />
      )}

      {/* Action Buttons */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3">
        <Button variant="primary" size="lg" onClick={handleStartQuiz} disabled={!hasSelection}>
          <Play className="w-4 h-4" />
          Start Quiz
        </Button>
        <Button size="lg" onClick={handleStartRevise} disabled={!hasSelection}>
          <BookOpenCheck className="w-4 h-4" />
          Revise
        </Button>
      </div>
    </div>
  );
};

export default UnifiedQuizSelector;
