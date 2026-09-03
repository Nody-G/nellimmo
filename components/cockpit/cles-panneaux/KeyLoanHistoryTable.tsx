'use client';

import React from 'react';
import { AgencyKey, Property, KeyLoanRecord } from '@/lib/types';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KeyLoanHistoryTableProps {
  keys: AgencyKey[];
  properties: Property[];
  onPrintDischarge: (key: AgencyKey, loan: KeyLoanRecord) => void;
}

export const KeyLoanHistoryTable: React.FC<KeyLoanHistoryTableProps> = ({
  keys,
  properties,
  onPrintDischarge
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#F3E8EE] shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-serif font-bold text-base text-[#131B26]">
            Grand Livre des Décharges et Mouvements de Clés
          </h3>
          <p className="text-xs text-gray-500">
            Traçabilité juridique complète pour la responsabilité civile professionnelle (Loi Hoguet & Assurances).
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
        >
          Imprimer Registre
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
              <th className="py-2.5 px-3">Trousseau</th>
              <th className="py-2.5 px-3">Bien Rattaché</th>
              <th className="py-2.5 px-3">Emprunteur</th>
              <th className="py-2.5 px-3">Date Sortie</th>
              <th className="py-2.5 px-3">Date Restitution</th>
              <th className="py-2.5 px-3">Motif & Mission</th>
              <th className="py-2.5 px-3 text-right">Récépissé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {keys.flatMap((k) =>
              (k.loan_history || []).map((loan) => {
                const prop = properties.find((p) => p.id === k.property_id);
                return (
                  <tr key={loan.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-[#131B26]">
                      #{k.keyring_number}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-800 block">
                        {prop?.title || 'Bien non spécifié'}
                      </span>
                      <span className="text-[10px] text-gray-500">{prop?.city}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900 block">{loan.borrower_name}</span>
                      <span className="text-[10px] text-gray-500">
                        {loan.borrower_company || loan.borrower_role} • {loan.borrower_phone}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {new Date(loan.borrowed_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      {loan.returned_at ? (
                        <span className="text-emerald-700 font-semibold">
                          {new Date(loan.returned_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          En cours de prêt
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-600 italic">{loan.purpose}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onPrintDischarge(k, loan)}
                        className="p-1.5 bg-gray-100 hover:bg-[#E12B7B] hover:text-white rounded-lg text-gray-700 transition"
                        title="Imprimer l'attestation signée"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
