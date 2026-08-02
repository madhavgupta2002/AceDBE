'use client';

import React from 'react';
import {
  ArrowRight,
  MessageSquare,
  Youtube,
  ClipboardList,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { getSubjectsByBatch, getDisplayNameForAlias, getIconForCode } from '@/lib/subjectMapping';
import { useBatch } from '@/contexts/BatchContext';
import Link from 'next/link';
import CustomQuizGenerator from './CustomQuizGenerator';

const SubjectSelector: React.FC<{ selectedTerm?: number }> = ({ selectedTerm: propTerm }) => {
  const { selectedBatch, selectedTerm: contextTerm } = useBatch();
  const selectedTerm = propTerm ?? contextTerm;

  // Academic Cell Repository links per term
  const academicCellRepoLinks: Record<number, string> = {
    1: 'https://iimblr1-my.sharepoint.com/:f:/g/personal/jayshreeg24_iimb_ac_in/IgB09mAJCjj4SIAg2PiId53ZAedwU6A7su4Jl1zLwtWSxrk?e=CjmlGO',
    2: 'https://iimblr1-my.sharepoint.com/:f:/g/personal/bbadbeac_iimb_ac_in/IgAwna_E8k72Spx0EObS-U1PASIQro2JVHaoKmrb9EBjO-U?e=DAckNj',
  };

  // Subjects for current batch + term
  const subjectsForTerm = getSubjectsByBatch(selectedBatch, selectedTerm);

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

  const handleYoutubeClick = async (e: React.MouseEvent, subjectCode: string) => {
    const playlistUrl = await getAllVideosForSubject(subjectCode);
    if (playlistUrl) {
      window.open(playlistUrl, '_blank');
    }
  };

  // Split subjects: those with a final exam first, then those without
  const examSubjects = subjectsForTerm.filter(({ subject }) => subject.finalExam !== false);
  const noExamSubjects = subjectsForTerm.filter(({ subject }) => subject.finalExam === false);

  const renderSubjectCard = (
    { subject, alias }: { subject: typeof subjectsForTerm[number]['subject']; alias: typeof subjectsForTerm[number]['alias'] },
    noExam: boolean,
  ) => (
    <div
      key={alias.code}
      className={`block border rounded-xl transition-all duration-200 group shadow-card hover:shadow-card-hover ${
        noExam
          ? 'bg-amber-950/20 border-amber-800/25 hover:border-amber-500/40'
          : 'bg-surface border-surface-border/60 hover:border-emerald-500/40'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-3.5">
        {/* Subject Info */}
        <Link
          href={`/${alias.code}`}
          className="flex items-center space-x-3 sm:space-x-4 flex-1 mb-3 sm:mb-0 min-w-0"
        >
          <div className="bg-emerald-600/90 p-2.5 sm:p-3 rounded-xl group-hover:bg-emerald-500 transition-colors shrink-0 shadow-glow-emerald">
            {React.createElement(getIconForCode(alias.code), {
              className: 'w-5 h-5 sm:w-6 sm:h-6 text-white',
            })}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <span className="text-[11px] sm:text-xs text-slate-300 bg-slate-700/60 px-2 py-0.5 sm:py-1 font-semibold w-fit mb-1 sm:mb-0 text-center min-w-[50px] rounded-md border border-slate-600/30">
                {alias.code}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {getDisplayNameForAlias(subject, alias)}
              </h3>
            </div>
          </div>
        </Link>

        {/* Action Buttons + Arrow */}
        <div className="flex items-center justify-end mt-2 sm:mt-0 gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${alias.code}/notes`}
              className="p-2 bg-indigo-600/90 hover:bg-indigo-500 text-white transition-all rounded-lg border border-indigo-500/35"
              title="View Notes"
            >
              <BookOpen className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); handleYoutubeClick(e, alias.code); }}
              className="p-2 bg-red-600/80 hover:bg-red-500 text-white transition-all rounded-lg border border-red-500/30"
              title="Watch All Videos"
            >
              <Youtube className="w-4 h-4" />
            </button>
            <Link
              href={`/${alias.code}`}
              className="p-2 bg-emerald-700/85 hover:bg-emerald-600 text-white transition-all rounded-lg border border-emerald-600/35"
              title="Start Quiz"
            >
              <ClipboardList className="w-4 h-4" />
            </Link>
          </div>
          <Link href={`/${alias.code}`}>
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 max-w-4xl relative z-[1]">
      {/* Term heading */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-4 sm:mb-6 px-1 text-center">
        Term {selectedTerm}
      </h2>



      <div className="space-y-3">
        {examSubjects.map((item) => renderSubjectCard(item, false))}
      </div>

      {noExamSubjects.length > 0 && (
        <div className="mt-7 space-y-3">
          {noExamSubjects.map((item) => renderSubjectCard(item, true))}
        </div>
      )}

      {/* Custom Quiz Generator */}
      <CustomQuizGenerator />

      {/* Disclaimer Section */}
      <div className="mt-14 py-6 border-t border-slate-800/60 flex flex-col items-center text-center">
        <p className="text-xs text-slate-500 mb-3 font-medium">
          Disclaimer: Do not rely solely on this for your preparation. Refer official sources for more information.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href="https://apps.iimbx.edu.in/learner-dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Official Website
          </a>
          {academicCellRepoLinks[selectedTerm] && (
            <a
              href={academicCellRepoLinks[selectedTerm]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Academic Cell Repository (Term {selectedTerm})
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
