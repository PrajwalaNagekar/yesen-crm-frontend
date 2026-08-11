const VARIANTS = {
  primary:
    'bg-brand-gradient text-white shadow-sm shadow-brand-500/20 hover:brightness-110 hover:shadow-md hover:shadow-brand-500/25 active:brightness-95 focus-visible:ring-brand-200 disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-sm',
  secondary:
    'bg-white text-brand-900 border border-border shadow-soft hover:bg-slate-50 hover:border-border-strong focus-visible:ring-brand-100 disabled:opacity-50',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-brand-900 focus-visible:ring-slate-100 disabled:opacity-50',
  danger:
    'bg-white text-red-600 border border-red-200 shadow-soft hover:bg-red-50 hover:border-red-300 focus-visible:ring-red-100 disabled:opacity-50',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
