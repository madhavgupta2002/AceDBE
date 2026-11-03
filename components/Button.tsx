import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/25 hover:text-white',
  secondary: 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-700/70 hover:text-white',
  ghost: 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/70 hover:text-white',
  danger: 'bg-red-500/15 text-red-200 border-red-500/40 hover:bg-red-500/25 hover:text-white',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

/** The one button style for the app: pick a variant and size instead of hand-rolling classes. */
const Button = React.forwardRef<
  HTMLButtonElement,
  { variant?: Variant; size?: Size } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ variant = 'secondary', size = 'md', className = '', type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
  />
));
Button.displayName = 'Button';

export default Button;
