'use client';

import React from 'react';
import { Calendar, FileCheck } from 'lucide-react';

interface LegalDeadlinesInputsProps {
  compromiseDate: string;
  setCompromiseDate: (val: string) => void;
  notificationType: string;
  setNotificationType: (val: string) => void;
}

export function LegalDeadlinesInputs({
  compromiseDate,
  setCompromiseDate,
  notificationType,
  setNotificationType,
}: LegalDeadlinesInputsProps) {
  return (
    <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C59A45]" />
          Date de notification du compromis :
        </label>
        <input
          type="date"
          value={compromiseDate}
          onChange={(e) => setCompromiseDate(e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20 shadow-2xs"
        />
        <span className="text-[11px] text-gray-400 mt-1.5 block">
          Le délai commence à courir le lendemain de la 1ère présentation du recommandé ou du récépissé électronique.
        </span>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#C59A45]" />
          Mode de notification légal :
        </label>
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20 shadow-2xs"
        >
          <option value="ar24">Lettre Recommandée Électronique (AR24 Notaire certifiée eIDAS)</option>
          <option value="lrar">Lettre Recommandée avec AR Postale (LRAR papier)</option>
          <option value="huissier">Signification par Commissaire de Justice (Huissier)</option>
          <option value="recipisse">Remise en main propre contre récépissé (Art. L271-1)</option>
        </select>
        <span className="text-[11px] text-gray-400 mt-1.5 block">
          AR24 : le délai court dès le lendemain de l’envoi de l’avis de mise à disposition.
        </span>
      </div>
    </div>
  );
}
