import React from 'react';

/** Filter / picker chip. Active state is emerald everywhere. */
export default function Chip({
  active,
  className = 'px-3',
  ...props
}: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...props}
      className={`h-8 shrink-0 inline-flex items-center justify-center text-xs font-medium border rounded-lg transition-colors ${
        active
          ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
          : 'bg-surface-light/60 text-slate-300 border-surface-border hover:bg-surface-light hover:text-white'
      } ${className}`}
    />
  );
}
