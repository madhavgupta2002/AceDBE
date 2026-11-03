import React from 'react';

/** Standard page heading: h1 with an optional icon and a muted subtitle. */
export default function PageTitle({
  title,
  subtitle,
  icon,
  className = '',
}: {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
        {icon}
        {title}
      </h1>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
