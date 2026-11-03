'use client';

import React, { useState } from 'react';
import {
  Youtube,
  ClipboardList,
  ExternalLink,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { getSubjectsByBatch, getDisplayNameForAlias, getIconForCode } from '@/lib/subjectMapping';
import { useBatch } from '@/contexts/BatchContext';
import Link from 'next/link';

const SubjectSelector: React.FC<{ selectedTerm?: number }> = ({ selectedTerm: propTerm }) => {
  const { selectedBatch, selectedTerm: contextTerm } = useBatch();
  const selectedTerm = propTerm ?? contextTerm;

  // Academic Cell Repository links per term
  const academicCellRepoLinks: Record<number, string> = {
    1: 'https://iimblr1-my.sharepoint.com/:f:/g/personal/jayshreeg24_iimb_ac_in/IgB09mAJCjj4SIAg2PiId53ZAedwU6A7su4Jl1zLwtWSxrk?e=CjmlGO',
    2: 'https://iimblr1-my.sharepoint.com/:f:/g/personal/bbadbeac_iimb_ac_in/IgAwna_E8k72Spx0EObS-U1PASIQro2JVHaoKmrb9EBjO-U?e=DAckNj',
  };

  // Playlist fetch state for the subject whose YouTube button was last clicked.
  const [yt, setYt] = useState<{ code: string; status: 'loading' | 'error'; message?: string; url?: string } | null>(null);

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
    return `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
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

  const handleYoutubeClick = async (subjectCode: string) => {
    if (yt?.status === 'loading') return;
    setYt({ code: subjectCode, status: 'loading' });
    const playlistUrl = await getAllVideosForSubject(subjectCode);
    if (!playlistUrl) {
      setYt({ code: subjectCode, status: 'error', message: "Couldn't load the video list. Please try again." });
      return;
    }
    const win = window.open(playlistUrl, '_blank');
    if (win) {
      win.opener = null;
      setYt(null);
    } else {
      // Popup blocked (the click is long gone after the fetch): offer a link instead of failing silently.
      setYt({ code: subjectCode, status: 'error', message: 'Your browser blocked the new tab.', url: playlistUrl });
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
      className={`rounded-xl border px-3 py-2.5 sm:px-4 transition-colors group ${
        noExam
          ? 'bg-amber-950/20 border-amber-800/25 hover:border-amber-500/40'
          : 'bg-surface border-surface-border/60 hover:border-emerald-500/30'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <Link href={`/${alias.code}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
          {React.createElement(getIconForCode(alias.code), { className: 'w-5 h-5' })}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-[15px] font-semibold text-slate-100 leading-snug group-hover:text-white">
            {getDisplayNameForAlias(subject, alias)}
          </h3>
          <div className="text-[11px] text-slate-400 font-mono">
            {alias.code}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-1.5 shrink-0 pl-12 sm:pl-0">
        <Link
          href={`/${alias.code}/notes`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/30 text-indigo-300/90 hover:text-indigo-200 hover:bg-indigo-500/10 hover:border-indigo-400/60 transition-colors"
          title="Notes"
          aria-label="Notes"
        >
          <BookOpen className="w-4 h-4" />
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); handleYoutubeClick(alias.code); }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 text-red-400/90 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400/60 transition-colors disabled:opacity-60"
          title="Watch all videos"
          aria-label="Watch all videos"
          disabled={yt?.status === 'loading'}
          aria-busy={yt?.code === alias.code && yt.status === 'loading'}
        >
          {yt?.code === alias.code && yt.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4" />}
        </button>
        <Link
          href={`/${alias.code}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400/60 transition-colors"
          title="Practice quiz"
          aria-label="Practice quiz"
        >
          <ClipboardList className="w-4 h-4" />
        </Link>
      </div>
      </div>
      {yt?.code === alias.code && yt.status === 'error' && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {yt.message}
          {yt.url && (
            <>
              {' '}
              <a href={yt.url} target="_blank" rel="noopener noreferrer" className="underline text-red-200 hover:text-white">
                Open playlist
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-4 relative z-[1]">
      {/* Term heading */}
      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 px-1">Term {selectedTerm}</h2>

      <div className="space-y-2">
        {examSubjects.map((item) => renderSubjectCard(item, false))}
      </div>

      {noExamSubjects.length > 0 && (
        <div className="mt-6 space-y-2">
          {noExamSubjects.map((item) => renderSubjectCard(item, true))}
        </div>
      )}

      {/* Disclaimer Section */}
      <div className="mt-14 py-6 border-t border-surface-border flex flex-col items-center text-center">
        <p className="text-xs text-slate-400 mb-3 font-medium">
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
