import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'gold' | 'olive' | 'navy';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  variant = 'default',
  className
}) => {
  const iconVariants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-amber-500/10 text-amber-700',
    olive: 'bg-emerald-500/10 text-emerald-700',
    navy: 'bg-slate-900/10 text-slate-900'
  };

  return (
    <div
      className={cn(
        'p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className={cn('p-2.5 rounded-xl shrink-0', iconVariants[variant])}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'inline-flex items-center text-xs font-bold gap-0.5',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
        {subValue && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{subValue}</p>
        )}
      </div>
    </div>
  );
};
