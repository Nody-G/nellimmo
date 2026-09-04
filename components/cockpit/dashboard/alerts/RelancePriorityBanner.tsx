'use client';

import React from 'react';
import Link from 'next/link';
import { BellRing, ChevronRight } from 'lucide-react';

interface RelancePriorityBannerProps {
  pendingCount: number;
}

export const RelancePriorityBanner: React.FC<RelancePriorityBannerProps> = ({ pendingCount }) => {
  if (pendingCount === 0) return null;

  return (
    <div className="p-3.5 bg-gradient-to-r from-[#FDF2F8] to-[#FFF1F2] rounded-2xl border border-[#F472B6]/40 text-xs flex items-start gap-3 shadow-xs mb-3">
      <div className="w-8 h-8 rounded-xl bg-[#E12B7B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <BellRing className="w-4 h-4" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#9F1239]">
            {pendingCount} Relance(s) Prioritaire(s) Aujourd&apos;hui
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E12B7B] text-white font-mono">
            Action Requise
          </span>
        </div>
        <p className="text-[11px] text-[#881337]">
          Rappels de visites J-1, debriefs acquéreurs J+1 et suivi des conditions suspensives de prêt en cours.
        </p>
        <Link
          href="/cockpit/relances"
          className="text-[11px] font-bold text-[#E12B7B] hover:text-[#9F1239] flex items-center gap-1 pt-0.5"
        >
          Ouvrir le centre de relances WhatsApp ({pendingCount}) <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
