'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface EstimationSuccessScreenProps {
  firstName: string;
  lastName: string;
  city: string;
}

export function EstimationSuccessScreen({
  firstName,
  lastName,
  city,
}: EstimationSuccessScreenProps) {
  return (
    <div className="py-12 text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="font-serif font-bold text-2xl text-gray-900">
          Demande d’Avis de Valeur Reçue !
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Merci <span className="font-bold text-gray-900">{firstName} {lastName}</span>. Nelly étudie actuellement les données cadastrales et les ventes notariées DVF pour votre bien situé à {city}.
        </p>
        <p className="text-xs text-gray-500">
          Vous recevrez votre dossier patrimonial complet sous 24h ouvrées.
        </p>
      </div>
      <Link
        href="/biens"
        className="inline-block px-6 py-3 bg-[#131B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#E12B7B] transition"
      >
        Découvrir nos biens en vente
      </Link>
    </div>
  );
}
