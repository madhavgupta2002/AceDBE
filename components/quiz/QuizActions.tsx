/** In-quiz action controls: the sticky Previous/Next bar and the sidebar Finish / Clear / Export / Print group. */
import React from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Download } from 'lucide-react';
import Button from '../Button';
import PrintMenu from './PrintMenu';

/** Fixed bottom bar aligned with the question column. */
export function QuizNavBar({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
  onFinish,
}: {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <nav
      aria-label="Question navigation"
      className="fixed bottom-0 left-0 right-0 bg-page/95 backdrop-blur-xl border-t border-surface-border px-3 sm:px-6 lg:px-8 py-3 sm:py-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-[calc(1rem+env(safe-area-inset-bottom))] z-40"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              {currentIndex > 0 ? (
                <Button size="lg" onClick={onPrev}>
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden /> Previous
                </Button>
              ) : (
                <div className="invisible" aria-hidden />
              )}

              {currentIndex < totalQuestions - 1 ? (
                <Button variant="primary" size="lg" onClick={onNext}>
                  Next <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={onFinish}>
                  Finish Quiz <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                </Button>
              )}
            </div>
          </div>
          <div className="lg:col-span-3"></div>
        </div>
      </div>
    </nav>
  );
}

/** Sidebar buttons shown under the answer grid while a quiz is running. */
export function QuizSidebarActions({
  onFinish,
  onClearAll,
  onExport,
  onPrint,
}: {
  onFinish: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onPrint: (withAnswers: boolean) => void;
}) {
  return (
    <>
      <Button variant="primary" size="lg" className="w-full mt-4" onClick={onFinish}>
        Finish Quiz <RefreshCw size={16} aria-hidden />
      </Button>
      <Button variant="ghost" className="w-full mt-2 text-slate-400" onClick={onClearAll}>
        Clear All Responses
      </Button>
      <div className="flex gap-2 mt-2">
        <Button className="w-1/2" onClick={onExport} title="Export quiz as JSON file">
          <Download size={14} aria-hidden /> Export
        </Button>
        <PrintMenu onPrint={onPrint} placement="above" className="w-1/2" buttonClassName="w-full" iconSize={14} />
      </div>
    </>
  );
}
