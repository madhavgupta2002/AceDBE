'use client';

import { useState, useEffect } from 'react';
import SubjectSelector from '@/components/SubjectSelector';
import Header from '@/components/Header';
import { useBatch } from '@/contexts/BatchContext';
import { getTermsForBatch } from '@/lib/subjectMapping';

export default function Home() {
  const { selectedBatch, setSelectedBatch } = useBatch();

  const availableTerms = getTermsForBatch(selectedBatch);
  const [selectedTerm, setSelectedTerm] = useState<number>(availableTerms[availableTerms.length - 1] ?? 1);

  useEffect(() => {
    const terms = getTermsForBatch(selectedBatch);
    setSelectedTerm(terms[terms.length - 1] ?? 1);
  }, [selectedBatch]);

  return (
    <div className="min-h-screen text-white relative z-[1]">
      <Header />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3">
        {/* Term Selector - left */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Select Term:</span>
          <div className="inline-flex bg-slate-800/50 border border-slate-700/40 p-1 gap-0.5 rounded-xl">
            {availableTerms.map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`w-8 sm:w-9 py-1.5 font-semibold text-xs sm:text-sm transition-all duration-200 rounded-lg flex items-center justify-center ${
                  selectedTerm === term
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Select Batch:</span>
          <div className="inline-flex bg-slate-800/60 border border-slate-700/50 p-1 gap-1 rounded-xl">
            {[1, 2].map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-4 py-1.5 font-semibold text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                  selectedBatch === batch
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
