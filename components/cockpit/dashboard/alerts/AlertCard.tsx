'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface AlertCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionHref: string;
  actionText: string;
  borderColor?: string;
  titleColor?: string;
  actionColor?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  icon,
  title,
  description,
  actionHref,
  actionText,
  borderColor = 'border-amber-200',
  titleColor = 'text-amber-900',
  actionColor = 'text-[#E12B7B]'
}) => {
  return (
    <div className={`p-3 bg-white rounded-xl border ${borderColor} text-xs flex items-start gap-2.5 shadow-xs`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="space-y-1">
        <span className={`font-bold ${titleColor} block`}>{title}</span>
        <p className="text-[11px] text-gray-600">{description}</p>
        <Link
          href={actionHref}
          className={`text-[10px] font-bold ${actionColor} hover:underline flex items-center gap-0.5 pt-0.5`}
        >
          {actionText} <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
