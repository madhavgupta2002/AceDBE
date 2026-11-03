/** Links from the quiz screen to a subject's notes: a full "Study Materials" card on the picker and a compact strip during a quiz. */
import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const LINK_BASE =
  'bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium transition-colors flex items-center justify-center gap-2 rounded-lg';

function NoteLinks({
  subjectCode,
  hasShortNotes,
  opensNewTab,
  linkClass,
  rowClass,
}: {
  subjectCode: string;
  hasShortNotes: boolean;
  opensNewTab: boolean;
  linkClass: string;
  rowClass: string;
}) {
  const target = opensNewTab ? '_blank' : undefined;
  if (!hasShortNotes) {
    return (
      <Link href={`/${subjectCode}/notes`} target={target} className={`w-full ${linkClass}`}>
        <BookOpen className="w-4 h-4 text-emerald-400" aria-hidden />
        View Notes
      </Link>
    );
  }
  return (
    <div className={rowClass}>
      <Link href={`/${subjectCode}/notes?view=short`} target={target} className={`flex-1 ${linkClass}`}>
        <BookOpen className="w-4 h-4 text-amber-400" aria-hidden />
        Short Notes
      </Link>
      <Link href={`/${subjectCode}/notes?view=detailed`} target={target} className={`flex-1 ${linkClass}`}>
        <BookOpen className="w-4 h-4 text-emerald-400" aria-hidden />
        Detailed Notes
      </Link>
    </div>
  );
}

/** Card shown on the quiz picker (links open in the same tab). */
export function StudyMaterials({ subjectCode, hasShortNotes }: { subjectCode: string; hasShortNotes: boolean }) {
  return (
    <div className="mb-6 bg-surface border border-surface-border/60 rounded-xl p-5">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-emerald-400" aria-hidden />
        Study Materials
      </h2>
      <NoteLinks
        subjectCode={subjectCode}
        hasShortNotes={hasShortNotes}
        opensNewTab={false}
        linkClass={`py-2.5 ${LINK_BASE}`}
        rowClass="flex gap-3"
      />
    </div>
  );
}

/** Compact strip shown while a quiz is running (links open in a new tab so the quiz is not lost). */
export function QuizNotesBar({ subjectCode, hasShortNotes }: { subjectCode: string; hasShortNotes: boolean }) {
  return (
    <div className="mb-4">
      <div className="bg-surface border border-surface-border/60 rounded-xl p-2.5">
        <NoteLinks
          subjectCode={subjectCode}
          hasShortNotes={hasShortNotes}
          opensNewTab
          linkClass={`py-2 px-3 text-sm ${LINK_BASE}`}
          rowClass="flex gap-2"
        />
      </div>
    </div>
  );
}
