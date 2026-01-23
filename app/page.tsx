'use client';

import SubjectSelector from '@/components/SubjectSelector';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <SubjectSelector />
    </div>
  );
}
