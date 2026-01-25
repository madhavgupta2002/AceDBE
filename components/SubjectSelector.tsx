'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  BarChart3,
  Lightbulb,
  Rocket,
  DollarSign,
  TrendingUp,
  Building2,
  BookOpen,
  Youtube,
  ClipboardList
} from 'lucide-react';
import { SUBJECTS, getSubjectsByTermFiltered } from '@/lib/subjectMapping';
import { useRouter } from 'next/navigation';
import videosData from '@/public/data/videos.json';

const AVAILABLE_TERMS = [1, 4]; // Define available terms

const SubjectSelector: React.FC = () => {
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  // Load saved term on mount
  React.useEffect(() => {
    const savedTerm = localStorage.getItem('selectedTerm');
    if (savedTerm) {
      const termNumber = parseInt(savedTerm, 10);
      if (AVAILABLE_TERMS.includes(termNumber)) {
        setSelectedTerm(termNumber);
      }
    }
  }, []);

  const handleTermChange = (term: number) => {
    setSelectedTerm(term);
    localStorage.setItem('selectedTerm', term.toString());
  };

  // Get subjects for selected term (filtered to exclude alternative versions)
  const filteredSubjects = getSubjectsByTermFiltered(selectedTerm);

  const handleSubjectSelect = (code: string) => {
    router.push(`/${code}`);
  };

  // Map subject codes to icons
  const getSubjectIcon = (code: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'AE11x': <MessageSquare className="w-6 h-6 text-white" />,
      'DS11x': <BarChart3 className="w-6 h-6 text-white" />,
      'EP11x': <Lightbulb className="w-6 h-6 text-white" />,
      'EP12x': <Rocket className="w-6 h-6 text-white" />,
      'FA11x': <DollarSign className="w-6 h-6 text-white" />,
      'MK11x': <TrendingUp className="w-6 h-6 text-white" />,
      'ST21x': <Building2 className="w-6 h-6 text-white" />,
      'MD42x': <BookOpen className="w-6 h-6 text-white" />,
      'MK41x': <TrendingUp className="w-6 h-6 text-white" />,
      'OB41x': <MessageSquare className="w-6 h-6 text-white" />,
      'OM41x': <ClipboardList className="w-6 h-6 text-white" />,
      'ST41x': <Building2 className="w-6 h-6 text-white" />,
      'EP41x': <Lightbulb className="w-6 h-6 text-white" />,
      'MD41x': <BarChart3 className="w-6 h-6 text-white" />,
      'DS11x_2024': <BarChart3 className="w-6 h-6 text-white" />,
    };
    return iconMap[code] || <MessageSquare className="w-6 h-6 text-white" />;
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

  // Get all videos for a subject
  const getAllVideosForSubject = (subjectCode: string): string => {
    const subjectVideos = (videosData as any)[subjectCode] || {};
    const allVideoLinks: string[] = [];

    Object.keys(subjectVideos).forEach(moduleNum => {
      const moduleVideos = subjectVideos[moduleNum] || [];
      allVideoLinks.push(...moduleVideos);
    });

    return createPlaylistUrl(allVideoLinks);
  };

  const handleNotesClick = (e: React.MouseEvent, subjectCode: string) => {
    e.stopPropagation();
    router.push(`/${subjectCode}/notes`);
  };

  const handleYoutubeClick = (e: React.MouseEvent, subjectCode: string) => {
    e.stopPropagation();
    const playlistUrl = getAllVideosForSubject(subjectCode);
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
          {AVAILABLE_TERMS.map((term) => (
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
        {filteredSubjects.map((subject, index) => (
          <div
            key={subject.code}
            className="bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
            onClick={() => handleSubjectSelect(subject.code)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
              {/* Subject Info */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 mb-3 sm:mb-0">
                <div className="bg-indigo-600 p-2 sm:p-3 group-hover:bg-indigo-500 transition-colors shrink-0">
                  {getSubjectIcon(subject.code)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="text-xs sm:text-sm text-gray-200 bg-gray-700 px-2 py-0.5 sm:py-1 font-semibold w-fit mb-1 sm:mb-0 text-center min-w-[50px]">
                      {subject.code}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {subject.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Action Buttons + Arrow */}
              <div className="flex items-center justify-end mt-2 sm:mt-0 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleNotesClick(e, subject.code)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    title="View Notes"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => handleYoutubeClick(e, subject.code)}
                    className="p-2 bg-red-600 hover:bg-red-500 text-white transition-colors"
                    title="Watch All Videos"
                    disabled={!getAllVideosForSubject(subject.code)}
                  >
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => handleQuizClick(e, subject.code)}
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
    </div>
  );
};

export default SubjectSelector;
