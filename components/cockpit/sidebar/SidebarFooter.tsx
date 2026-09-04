'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { CockpitUser } from '@/lib/users';

interface SidebarFooterProps {
  currentUser: CockpitUser | null;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ currentUser }) => {
  const initials = currentUser
    ? `${currentUser.first_name.charAt(0).toUpperCase()}${currentUser.last_name.charAt(0).toUpperCase()}`
    : 'N';

  const displayName = currentUser
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : 'Nelly Fernandez';

  const roleLabel = currentUser
    ? currentUser.role === 'admin'
      ? 'Gérante & Fondatrice'
      : 'Négociatrice'
    : 'CPI 1310 2019 000 042 974';

  return (
    <div className="p-3.5 border-t border-gray-800 space-y-2.5 bg-[#0E141D]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
          {initials}
        </div>
        <div className="overflow-hidden">
          <span className="text-xs font-bold text-white block truncate">
            {displayName}
          </span>
          <span className="text-[10px] text-[#C59A45] block truncate font-medium">
            {roleLabel}
          </span>
        </div>
      </div>

      <Link
        href="/"
        target="_blank"
        className="w-full py-1.5 px-2.5 rounded-lg border border-gray-800 hover:border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
      >
        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        <span>Voir Site Vitrine Public</span>
      </Link>
    </div>
  );
};
