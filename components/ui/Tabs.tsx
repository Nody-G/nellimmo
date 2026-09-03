'use client';

import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pill' | 'underline';
}

export const TabsList: React.FC<TabsListProps> = ({
  className,
  variant = 'pill',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center',
        variant === 'pill'
          ? 'p-1 bg-slate-100/90 rounded-xl gap-1 border border-slate-200/60'
          : 'border-b border-slate-200 gap-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  icon,
  badge,
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabTrigger must be used within a Tabs component');
  }

  const isSelected = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none',
        isSelected
          ? 'bg-white text-slate-900 shadow-xs'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
  );
};

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabContent must be used within a Tabs component');
  }

  if (context.value !== value) return null;

  return (
    <div className={cn('mt-4 animate-fadeIn', className)} {...props}>
      {children}
    </div>
  );
};
