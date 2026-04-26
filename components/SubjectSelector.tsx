'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Youtube,
  ClipboardList,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { getSubjectsByBatch, getTermsForBatch, getDisplayNameForAlias, getIconForCode } from '@/lib/subjectMapping';
import { useBatch } from '@/contexts/BatchContext';
import { useRouter } from 'next/navigation';
import CustomQuizGenerator from './CustomQuizGenerator';

const SubjectSelector: React.FC = () => {
  const router = useRouter();
  const { selectedBatch, setSelectedBatch } = useBatch();
  const availableTerms = getTermsForBatch(selectedBatch);
  const [selectedTerm, setSelectedTerm] = useState<number>(availableTerms[availableTerms.length - 1] ?? 1);

  // When batch changes, clamp selected term to a valid one for that batch
  React.useEffect(() => {
    const terms = getTermsForBatch(selectedBatch);
    if (!terms.includes(selectedTerm)) {
      setSelectedTerm(terms[terms.length - 1] ?? 1);
    }
  }, [selectedBatch]);

  // Persist term selection
  React.useEffect(() => {
    const savedTerm = localStorage.getItem('selectedTerm');
    if (savedTerm) {
      const parsed = parseInt(savedTerm, 10);
      if (availableTerms.includes(parsed)) setSelectedTerm(parsed);
    }
  }, []);

  const handleTermChange = (term: number) => {
    setSelectedTerm(term);
    localStorage.setItem('selectedTerm', term.toString());
  };

  // Subjects for current batch + term
  const subjectsForTerm = getSubjectsByBatch(selectedBatch, selectedTerm);

  const handleSubjectSelect = (code: string) => {
    router.push(`/${code}`);
  };

  // Create YouTube playlist URL from video links
  const createPlaylistUrl = (videoLinks: string[]): string => {
    const videoIds = videoLinks
      .map(link => {
        const match = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    if (videoIds.length === 0) return '';
    return `http://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
  };

  // Get all videos for a subject (fetches on demand)
  const getAllVideosForSubject = async (subjectCode: string): Promise<string> => {
    try {
      const response = await fetch(`/data/Subjects/${subjectCode}/videos.json`);
      if (!response.ok) return '';
      const subjectVideos = await response.json();
      const allVideoLinks: string[] = [];

      Object.keys(subjectVideos).forEach(moduleNum => {
        const moduleVideos = subjectVideos[moduleNum] || [];
        allVideoLinks.push(...moduleVideos);
      });

      return createPlaylistUrl(allVideoLinks);
    } catch {
      return '';
    }
  };

  const handleNotesClick = (e: React.MouseEvent, subjectCode: string) => {
    e.stopPropagation();
    router.push(`/${subjectCode}/notes`);
  };

  const handleYoutubeClick = async (e: React.MouseEvent, subjectCode: string) => {
    e.stopPropagation();
    const playlistUrl = await getAllVideosForSubject(subjectCode);
    if (playlistUrl) {
      window.open(playlistUrl, '_blank');
    }
  };

  const handleQuizClick = (e: React.MouseEvent, subjectCode: string) => {
    e.stopPropagation();
    router.push(`/${subjectCode}`);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 max-w-4xl">
      {/* Term Selector */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex bg-gray-800 border border-gray-700 p-1 gap-1">
          {getTermsForBatch(selectedBatch).map((term) => (
            <button
              key={term}
              onClick={() => handleTermChange(term)}
              className={`px-6 py-2.5 font-semibold text-sm sm:text-base transition-all duration-200 ${selectedTerm === term
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              Term {term}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-6 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-white">
          Term {selectedTerm}
        </h1>
        <p className="text-sm sm:text-lg text-gray-400">
          Ace your BBA-DBE exams with comprehensive notes, compiled playlists, previous year questions, and interactive quizzes.
        </p>
      </div>

      <div className="space-y-3">
        {subjectsForTerm.map(({ subject, alias }) => (
          <div
            key={alias.code}
            className="bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
            onClick={() => handleSubjectSelect(alias.code)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
              {/* Subject Info */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 mb-3 sm:mb-0">
                <div className="bg-indigo-600 p-2 sm:p-3 group-hover:bg-indigo-500 transition-colors shrink-0">
                  {React.createElement(getIconForCode(alias.code), {
                    className: 'w-6 h-6 text-white',
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="text-xs sm:text-sm text-gray-200 bg-gray-700 px-2 py-0.5 sm:py-1 font-semibold w-fit mb-1 sm:mb-0 text-center min-w-[50px]">
                      {alias.code}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {getDisplayNameForAlias(subject, alias)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Action Buttons + Arrow */}
              <div className="flex items-center justify-end mt-2 sm:mt-0 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleNotesClick(e, alias.code)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    title="View Notes"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => handleYoutubeClick(e, alias.code)}
                    className="p-2 bg-red-600 hover:bg-red-500 text-white transition-colors"
                    title="Watch All Videos"
                    disabled={!getAllVideosForSubject(alias.code)}
                  >
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => handleQuizClick(e, alias.code)}
                    className="p-2 bg-green-600 hover:bg-green-500 text-white transition-colors"
                    title="Start Quiz"
                  >
                    <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Quiz Generator */}
      <CustomQuizGenerator />

      {/* Disclaimer Section */}
      <div className="mt-12 py-6 border-t border-gray-800 flex flex-col items-center text-center">
        <p className="text-xs text-gray-500 mb-3 font-bold">
          Disclaimer: Do not rely solely on this for your preparation. Refer official sources for more information.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href="https://apps.iimbx.edu.in/learner-dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Official Website
          </a>
          <a
            href="https://iimblr1-my.sharepoint.com/:f:/g/personal/jayshreeg24_iimb_ac_in/IgB09mAJCjj4SIAg2PiId53ZAedwU6A7su4Jl1zLwtWSxrk?e=CjmlGO"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Academic Cell Repository
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
