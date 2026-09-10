'use client';

import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { CockpitUser } from '@/lib/users';

interface SidebarFooterProps {
  currentUser: CockpitUser | null;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ currentUser }) => {
  const initials = currentUser
    ? `${currentUser.first_name.charAt(0).toUpperCase()}${currentUser.last_name.charAt(0).toUpperCase()}`
    : 'NF';

  const displayName = currentUser
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : 'Nelly Fernandez';

  const roleLabel = currentUser
    ? currentUser.role === 'admin'
      ? 'Gérante & Fondatrice'
      : 'Négociatrice'
    : 'Nell’Immo Pélissanne';

  return (
    <div className="p-3 border-t border-gray-800 bg-[#0E141D] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
          {initials}
        </div>
        <div className="overflow-hidden">
          <span className="text-xs font-semibold text-white block truncate">
            {displayName}
          </span>
          <span className="text-[10px] text-[#C59A45] block truncate font-medium">
            {roleLabel}
          </span>
        </div>
      </div>

      <Link
        href="/cockpit/parametres"
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
        title="Paramètres de l’agence & Clé IA"
      >
        <Settings className="w-4 h-4" />
      </Link>
    </div>
  );
};
