'use client';

import SubjectSelector from '@/components/SubjectSelector';
import Header from '@/components/Header';
import { useBatch, AVAILABLE_BATCHES } from '@/contexts/BatchContext';
import { getTermsForBatch } from '@/lib/subjectMapping';

export default function Home() {
  const { selectedBatch, setSelectedBatch, selectedTerm, setSelectedTerm } = useBatch();

  const availableTerms = getTermsForBatch(selectedBatch);

  return (
    <div className="min-h-screen text-white relative z-[1]">
      <Header />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        {/* Term Selector - left */}
        <div className="flex items-center gap-2 min-w-0 flex-1 max-w-full">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">Term:</span>
          <div className="flex items-center bg-slate-800/50 border border-slate-700/40 p-1 gap-0.5 rounded-xl overflow-x-auto max-w-full scrollbar-none custom-scrollbar">
            {availableTerms.map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm?.(term)}
                className={`w-8 sm:w-9 py-1.5 font-semibold text-xs sm:text-sm transition-all duration-200 rounded-lg shrink-0 flex items-center justify-center ${selectedTerm === term
                  ? 'bg-slate-700/80 text-white shadow-md'
                  : 'bg-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-700/40'
                  }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Selector - right */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Batch:</span>
          <div className="inline-flex bg-slate-800/60 border border-slate-700/50 p-1 gap-1 rounded-xl">
            {AVAILABLE_BATCHES.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch?.(batch)}
                className={`px-3 sm:px-4 py-1.5 font-semibold text-xs sm:text-sm transition-all duration-200 rounded-lg ${selectedBatch === batch
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-700/60'
                  }`}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>
      </div>
      <SubjectSelector selectedTerm={selectedTerm} />
    </div>
  );
}
