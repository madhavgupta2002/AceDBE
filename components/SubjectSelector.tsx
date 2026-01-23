'use client';

import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { SUBJECTS } from '@/lib/subjectMapping';
import { useRouter } from 'next/navigation';

const SubjectSelector: React.FC = () => {
  const router = useRouter();

  const handleSubjectSelect = (code: string) => {
    router.push(`/quiz/${code}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Select a Subject
        </h1>
        <p className="text-lg text-gray-400">
          Choose a subject to start practicing
        </p>
      </div>

      <div className="space-y-3">
        {SUBJECTS.map((subject, index) => (
          <div
            key={subject.code}
            className="bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
            onClick={() => handleSubjectSelect(subject.code)}
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-indigo-600 p-3 group-hover:bg-indigo-500 transition-colors">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold text-white">
                      {subject.name}
                    </h3>
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1">
                      {subject.code}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {subject.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
