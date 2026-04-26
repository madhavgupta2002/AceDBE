'use client';

import SubjectSelector from '@/components/SubjectSelector';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useBatch } from '@/contexts/BatchContext';

export default function Home() {
  const router = useRouter();
  const { selectedBatch, setSelectedBatch } = useBatch();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-3">
        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Select your batch:</span>
          <div className="inline-flex bg-gray-800 border border-gray-700 p-0.5 gap-0.5 rounded">
            {[1, 2].map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-3 py-1 font-semibold text-xs sm:text-sm transition-all duration-200 ${selectedBatch === batch
                    ? 'bg-amber-600 text-white'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
              >
                Batch {batch}
              </button>
            ))}
          </div>
        </div>
        {/* CGPA Calculator */}
        <button
          onClick={() => router.push('/cgpa')}
          className="px-3 sm:px-4 py-1.5 bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 text-white rounded transition-colors font-semibold text-xs sm:text-sm whitespace-nowrap"
        >
          CGPA
        </button>
      </div>
      <SubjectSelector />
    </div>
  );
}
