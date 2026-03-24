'use client';

import SubjectSelector from '@/components/SubjectSelector';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 flex justify-end">
        <button
          onClick={() => router.push('/cgpa')}
          className="px-4 sm:px-6 py-2 bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base"
        >
          CGPA Calculator
        </button>
      </div>
      <SubjectSelector />
    </div>
  );
}
