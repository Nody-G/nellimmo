'use client';

import React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  TrendingUp,
  Sparkles,
  Printer,
  KeyRound,
  Users,
  Radio,
  FileCheck2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const QuickActionsGrid: React.FC = () => {
  const actions = [
    {
      label: 'Nouveau Mandat',
      href: '/cockpit/mandats/nouveau',
      desc: 'Saisie Loi Hoguet & ALUR',
      icon: <PlusCircle className="w-5 h-5 text-[#E12B7B]" />,
      bg: 'bg-[#FDF2F8]'
    },
    {
      label: 'Avis de Valeur DVF',
      href: '/cockpit/avis-de-valeur',
      desc: 'Transactions réelles notaires',
      icon: <TrendingUp className="w-5 h-5 text-[#C59A45]" />,
      bg: 'bg-[#FBF6E9]'
    },
    {
      label: 'Studio IA Rédaction',
      href: '/cockpit/redacteur',
      desc: '5 styles de plume signature',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50'
    },
    {
      label: 'Affiches Vitrine LED',
      href: '/cockpit/fiches-vitrine',
      desc: 'Gabarits A4/A3 haute décharge',
      icon: <Printer className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50'
    },
    {
      label: 'Armoire & Clés',
      href: '/cockpit/cles-panneaux',
      desc: 'Émargement tactile prêts',
      icon: <KeyRound className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50'
    },
    {
      label: 'Rapprochement CRM',
      href: '/cockpit/acquereurs',
      desc: 'Scoring & alertes WhatsApp',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50'
    },
    {
      label: 'Passerelle Poliris',
      href: '/cockpit/diffusion',
      desc: 'SeLoger & LeBonCoin flux',
      icon: <Radio className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50'
    },
    {
      label: 'Registre DGCCRF',
      href: '/cockpit/registre-dgccrf',
      desc: 'Scellement SHA-256 officiel',
      icon: <FileCheck2 className="w-5 h-5 text-[#131B26]" />,
      bg: 'bg-gray-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Raccourcis Opérationnels Agence</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((act) => (
            <Link
              key={act.label}
              href={act.href}
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white transition flex flex-col justify-between space-y-2 group"
            >
              <div className={`w-9 h-9 rounded-lg ${act.bg} flex items-center justify-center`}>
                {act.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block group-hover:text-[#E12B7B] transition-colors">
                  {act.label}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{act.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
