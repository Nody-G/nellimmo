import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  hasDot = false,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium gap-1.5',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5'
  };

  const variantClasses = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    gold: 'bg-amber-500/10 text-amber-900 border-amber-300',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const dotClasses = {
    neutral: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    gold: 'bg-amber-600',
    purple: 'bg-purple-500'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-xs transition-colors duration-150',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {hasDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClasses[variant])} />
      )}
      {children}
    </span>
  );
};
