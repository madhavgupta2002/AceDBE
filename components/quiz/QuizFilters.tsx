/** Module chips + source dropdown used to narrow a running quiz or its results. Renders nothing when there is nothing to filter. */
import React from 'react';
import ModuleSelector from '../ModuleSelector';
import SourceSelector from '../SourceSelector';

const HEADING = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2';

export default function QuizFilters({
  modules,
  sources,
  selectedModule,
  selectedSource,
  onModuleChange,
  onSourceChange,
  sourceId,
  layout,
  className,
  moduleHeading = 'Module',
  sourceHeading = 'Source',
}: {
  modules: (string | number)[];
  sources: string[];
  selectedModule: string | number | 'all';
  selectedSource: string | 'all';
  onModuleChange: (module: string | number | 'all') => void;
  onSourceChange: (source: string | 'all') => void;
  /** DOM id of the source <select>, so the heading label can point at it. */
  sourceId: string;
  /** "row" lays the two filters side by side from md up; "stack" stacks them. */
  layout: 'row' | 'stack';
  /** Classes for the outer panel. */
  className: string;
  moduleHeading?: string;
  sourceHeading?: string;
}) {
  const hasModules = modules.length > 1;
  const hasSources = sources.length > 1;
  if (!hasModules && !hasSources) return null;

  const moduleField = hasModules && (
    <div className={layout === 'row' ? 'flex-1 w-full' : undefined}>
      <div className={HEADING}>{moduleHeading}</div>
      <ModuleSelector modules={modules} selectedModule={selectedModule} onSelect={onModuleChange} />
    </div>
  );
  const sourceField = hasSources && (
    <div className={layout === 'row' ? 'flex-1 w-full' : hasModules ? 'pt-2 border-t border-slate-700/40' : ''}>
      <label htmlFor={sourceId} className={HEADING}>{sourceHeading}</label>
      <SourceSelector id={sourceId} sources={sources} selectedSource={selectedSource} onSelect={onSourceChange} />
    </div>
  );

  if (layout === 'stack') {
    return (
      <div className={className}>
        {moduleField}
        {sourceField}
      </div>
    );
  }
  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {moduleField}
        {hasModules && hasSources && <div className="hidden md:block w-px h-10 bg-slate-700/50" aria-hidden />}
        {sourceField}
      </div>
    </div>
  );
}
