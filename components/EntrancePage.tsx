'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, FileText, Loader2, MonitorPlay, PlayCircle } from 'lucide-react';
import type { ExamPaperInfo } from '@/lib/pyqService';
import { useRouter } from 'next/navigation';
import CbtExam from './CbtExam';
import { stashCbtReview, toReviewData } from '@/lib/cbtReview';

const ENTRANCE = { code: 'ENTRANCE', name: 'BBA-DBE Entrance Test' };

export default function EntrancePage() {
  const router = useRouter();
  const [papers, setPapers] = useState<ExamPaperInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cbtPaper, setCbtPaper] = useState<ExamPaperInfo | null>(null);

  useEffect(() => {
    fetch('/api/entrance')
      .then(r => (r.ok ? r.json() : []))
      .then(setPapers)
      .catch(() => setPapers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">BBA-DBE entrance test papers</h1>

      {loading ? (
        <div className="flex justify-center py-10 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {papers.map(paper => (
            <div key={paper.filename} className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 flex flex-col gap-2.5">
              <div>
                <h2 className="text-base font-bold text-white">{paper.displayDate}</h2>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{paper.questionCount} questions</span>
                  {paper.cbt && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paper.cbt.durationMin} min</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/ENTRANCE?exam=${encodeURIComponent(paper.bankName)}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-700/50 text-emerald-200 hover:text-white text-xs font-bold transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" /> Practice
                </Link>
                <button
                  type="button"
                  disabled={!paper.cbt}
                  onClick={() => setCbtPaper(paper)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-violet-950/50 hover:bg-violet-600 border border-violet-700/50 text-violet-200 hover:text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MonitorPlay className="w-3.5 h-3.5" /> CBT Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cbtPaper && (
        <CbtExam
          subject={ENTRANCE}
          paper={cbtPaper}
          onResult={(result) => {
            stashCbtReview(toReviewData(cbtPaper.bankName, result));
            router.push(`/${ENTRANCE.code}?exam=${encodeURIComponent(cbtPaper.bankName)}&review=cbt`);
          }}
          onClose={() => setCbtPaper(null)}
        />
      )}
    </main>
  );
}
