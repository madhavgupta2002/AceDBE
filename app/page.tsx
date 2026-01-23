'use client';

import SubjectSelector from '@/components/SubjectSelector';
import { Brain, Moon } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">
              IIMB Practice Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-300 hover:text-indigo-300 hover:bg-gray-700 transition-all"
              aria-label="Toggle dark mode"
            >
              <Moon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <SubjectSelector />
    </div>
  );
}
