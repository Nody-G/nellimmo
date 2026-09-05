'use client';

import React from 'react';
import { TransactionDeal } from '@/lib/types';

interface DealAlurChecklistProps {
  dealId: string;
  checklistDocuments: TransactionDeal['checklist_documents'];
  onUpdateChecklist: (id: string, docs: TransactionDeal['checklist_documents']) => void;
}

const ALUR_LABELS: Record<string, string> = {
  titre_propriete: 'Titre de Propriété',
  taxe_fonciere: 'Avis Taxe Foncière',
  dossier_diagnostics: 'Dossier Diagnostics (DDT)',
  audit_energetique: 'Audit Énergétique',
  pre_etat_date: 'Pré-état Daté (Copro)',
  reglement_copro: 'Règlement de Copropriété',
  cni_vendeur: 'CNI / Passeport Vendeur',
  cni_acquereur: 'CNI / Passeport Acquéreur',
  justificatif_domicile: 'Justificatif Domicile (< 3 mois)',
  simulation_pret: 'Attestation / Accord de Prêt',
  offre_achat_signee: "Offre d’Achat Contresignée",
};

export const DealAlurChecklist: React.FC<DealAlurChecklistProps> = ({
  dealId,
  checklistDocuments,
  onUpdateChecklist
}) => {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-gray-800 tracking-wider block">
          Checklist des Pièces du Dossier de Vente (Loi ALUR)
        </span>
        <span className="text-[11px] text-gray-400">
          Toutes les pièces requises pour purger les délais
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {Object.entries(checklistDocuments).map(([key, val]) => (
          <label
            key={key}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <input
              type="checkbox"
              checked={val}
              onChange={(e) => {
                const updatedDocs = {
                  ...checklistDocuments,
                  [key]: e.target.checked
                };
                onUpdateChecklist(dealId, updatedDocs);
              }}
              className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
            />
            <span className="text-gray-700 font-medium">
              {ALUR_LABELS[key] || key.replace(/_/g, ' ')}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
