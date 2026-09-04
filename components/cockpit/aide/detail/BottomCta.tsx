'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

interface BottomCtaProps {
  guide: HelpGuide;
}

export function BottomCta({ guide }: BottomCtaProps) {
  return (
    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs text-gray-500">
        Besoin d’aide supplémentaire ? Contactez Niels ou ouvrez le{' '}
        <strong>Nell’IA Infinite Lab</strong>.
      </div>
      <Link
        href={guide.toolRoute}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
      >
        <span>Lancer : {guide.toolLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
