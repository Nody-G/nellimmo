'use client';

import React from 'react';
import Image from 'next/image';
import { AgencyKey, Property, AgencySettings, KeyLoanRecord } from '@/lib/types';
import { ShieldCheck, Printer } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DischargePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: {
    key: AgencyKey;
    loan: KeyLoanRecord;
  } | null;
  properties: Property[];
  settings: AgencySettings;
}

export const DischargePrintModal: React.FC<DischargePrintModalProps> = ({
  isOpen,
  onClose,
  selectedRecord,
  properties,
  settings
}) => {
  if (!selectedRecord) return null;

  const { key, loan } = selectedRecord;
  const prop = properties.find((p) => p.id === key.property_id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#E12B7B]" />
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Récépissé de Prêt & Décharge de Clé
          </h3>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full print:hidden">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimer le Récépissé A4
          </Button>
        </div>
      }
    >
      {/* Printable Document A4 */}
      <div
        id="printable-key-discharge"
        className="bg-white p-6 border-2 border-gray-300 rounded-2xl space-y-5 text-xs text-gray-900 font-sans"
      >
        <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3">
          <div>
            <h2 className="text-base font-serif font-black tracking-tight text-[#131B26]">
              SASU NELL&apos;IMMO
            </h2>
            <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">
              Gestion Transactionnelle & Logistique Clés
            </span>
            <span className="text-[9px] text-gray-500 block">
              {settings.address}, {settings.postal_code} {settings.city} • CPI {settings.card_t_number}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-1 rounded">
              DÉCHARGE N° DCL-{key.keyring_number}
            </span>
            <span className="text-[10px] text-gray-500 block mt-1">
              Édité le {new Date(loan.borrowed_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        <div className="text-center py-1 bg-gray-50 rounded-lg">
          <h3 className="font-serif font-bold text-sm text-[#131B26] uppercase tracking-wide">
            ATTESTATION DE REMISE DE CLÉS SOUS DÉCHARGE
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 block">
              Bien Immobilier
            </span>
            <p className="font-bold text-gray-900">{prop?.title || 'Bien non lié'}</p>
            <p className="text-[11px] text-gray-600">
              Trousseau #{key.keyring_number} • {key.keys_count} clés sur anneau
            </p>
            {key.has_alarm_badge && (
              <p className="text-[10px] font-semibold text-purple-700">Comprend badge alarme</p>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 block">
              Emprunteur Réceptionnaire
            </span>
            <p className="font-bold text-gray-900">{loan.borrower_name}</p>
            {loan.borrower_company && (
              <p className="text-[11px] text-gray-700">Société : {loan.borrower_company}</p>
            )}
            <p className="text-[11px] text-gray-700">Qualité : {loan.borrower_role}</p>
            <p className="text-[11px] text-gray-700">Tél : {loan.borrower_phone}</p>
          </div>
        </div>

        <div className="p-3 border border-gray-200 rounded-xl space-y-1">
          <span className="font-bold block">Conditions & Engagements de l&apos;Emprunteur :</span>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            L&apos;emprunteur désigné ci-dessus atteste avoir pris possession des clés désignées
            ce jour dans le cadre strict de sa mission :{' '}
            <span className="font-semibold text-gray-900">&quot;{loan.purpose}&quot;</span>. Il
            s&apos;engage à ne réaliser aucun double, à ne transmettre les clés à aucun tiers et
            à les restituer au plus tard le{' '}
            <span className="font-bold text-gray-900">
              {new Date(loan.expected_return_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            .
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="text-center p-3 border border-gray-200 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">
              Pour l&apos;Agence Nell&apos;Immo
            </span>
            <span className="text-xs font-bold text-gray-800 block">{settings.agent_name}</span>
            <span className="text-[10px] text-gray-500 block">
              Agent Immobilier CPI 1310 2019 000 042 974
            </span>
            <div className="h-14 flex items-center justify-center text-xs text-gray-400 italic">
              Clé remise et vérifiée
            </div>
          </div>

          <div className="text-center p-3 border border-gray-200 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">
              L&apos;Emprunteur (Mention &quot;Bon pour décharge&quot;)
            </span>
            <span className="text-xs font-bold text-gray-800 block">{loan.borrower_name}</span>
            <div className="h-14 flex items-center justify-center">
              {loan.signature_data_url ? (
                <div className="relative h-12 w-48">
                  <Image
                    src={loan.signature_data_url}
                    alt="Signature décharge"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Émargement conforme enregistré</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
