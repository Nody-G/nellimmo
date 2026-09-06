'use client';

import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface SortableColumnHeaderProps {
  label: string;
  active: boolean;
  direction?: 'asc' | 'desc';
  onClick: () => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
  title?: string;
}

export function SortableColumnHeader({
  label,
  active,
  direction = 'asc',
  onClick,
  align = 'left',
  className = '',
  title,
}: SortableColumnHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || `Trier par ${label} (${active ? (direction === 'asc' ? 'croissant — cliquer pour inverser' : 'décroissant — cliquer pour inverser') : 'cliquer pour trier'})`}
      className={`group inline-flex items-center gap-1.5 transition select-none cursor-pointer focus:outline-none ${
        align === 'right' ? 'justify-end w-full' : align === 'center' ? 'justify-center w-full' : 'justify-start'
      } ${
        active
          ? 'text-teal-700 dark:text-teal-400 font-black'
          : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold'
      } ${className}`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`shrink-0 inline-flex items-center justify-center p-0.5 rounded transition ${
          active
            ? 'opacity-100 bg-teal-50 dark:bg-teal-900/30'
            : 'opacity-0 group-hover:opacity-60'
        }`}
      >
        {active ? (
          direction === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-gray-400" />
        )}
      </span>
    </button>
  );
}
