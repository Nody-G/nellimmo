'use client';

import React, { useState, useMemo } from 'react';
import { Scale, Copy, Check } from 'lucide-react';
import { computeLegalDates } from '@/components/cockpit/aide/aide-types';
import { LegalDeadlinesInputs } from './sru/LegalDeadlinesInputs';
import { LegalDeadlinesTimeline } from './sru/LegalDeadlinesTimeline';

export function LegalDeadlinesSimulator() {
  const [compromiseDate, setCompromiseDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notificationType, setNotificationType] = useState<string>('ar24');
  const [copied, setCopied] = useState<boolean>(false);

  const calculatedDates = useMemo(() => {
    return computeLegalDates(compromiseDate);
  }, [compromiseDate]);

  const copyDeadlinesSummary = () => {
    if (!calculatedDates) return;
    const summary = `📅 CALENDRIER DES DÉLAIS LÉGAUX DU COMPROMIS — NELL'IMMO
------------------------------------------------------
• Date de notification (${notificationType.toUpperCase()}) : ${new Date(compromiseDate).toLocaleDateString('fr-FR')}

1. ⚖️ PURGE DU DÉLAI SRU (10 JOURS) :
   Expiration : ${calculatedDates.sru} à 24h00
   (Passé ce délai, le compromis est ferme et définitif pour l'acquéreur)

2. 🏦 DÉPÔT DU DOSSIER DE PRÊT (J+30) :
   Date limite : ${calculatedDates.loanApp}
   (Justificatif de dépôt à fournir à l'agence et au notaire)

3. 📜 ACCORD DE PRÊT DÉFINITIF (J+60) :
   Date limite : ${calculatedDates.loanApproval}
   (Offre de prêt éditée et acceptée après délai Scrivener de 11 jours)

4. ✒️ SIGNATURE DE L'ACTE AUTHENTIQUE (J+90) :
   Date cible chez le Notaire : ${calculatedDates.finalDeed}
   (Remise des clés et paiement du prix net vendeur)

Suivi du dossier assuré par l'agence Nell'Immo (Nelly Fernandez - 07 55 68 61 09).`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Scale className="w-4 h-4" />
            <span>Sécurité Juridique & Calendrier Notarial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
            Calculateur de Délais Légaux & Purge SRU
          </h2>
          <p className="text-xs text-gray-500">
            Calculez instantanément la purge du droit de rétractation SRU (Art. L271-1 CCH) et les échéances suspensives du compromis.
          </p>
        </div>

        <button
          type="button"
          onClick={copyDeadlinesSummary}
          disabled={!calculatedDates}
          className="px-4 py-2.5 bg-gradient-to-r from-[#131B26] to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Calendrier copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#C59A45]" />
              <span>Copier Calendrier Notaire / Clients</span>
            </>
          )}
        </button>
      </div>

      {/* Inputs Bar */}
      <LegalDeadlinesInputs
        compromiseDate={compromiseDate}
        setCompromiseDate={setCompromiseDate}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
      />

      {/* Deadlines Step-by-step display */}
      {calculatedDates ? <LegalDeadlinesTimeline dates={calculatedDates} /> : null}
    </div>
  );
}
