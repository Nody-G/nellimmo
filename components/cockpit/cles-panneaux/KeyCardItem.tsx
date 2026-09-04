'use client';

import React from 'react';
import { AgencyKey, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { MapPin, Clock, User, Phone, RotateCcw, Printer, UserCheck } from 'lucide-react';

interface KeyCardItemProps {
  keyItem: AgencyKey;
  property?: Property;
  onBorrowKey: (key: AgencyKey) => void;
  onReturnKey: (key: AgencyKey) => void;
  onPrintDischarge: (key: AgencyKey) => void;
}

export const KeyCardItem: React.FC<KeyCardItemProps> = ({
  keyItem,
  property,
  onBorrowKey,
  onReturnKey,
  onPrintDischarge
}) => {
  const isBorrowed = keyItem.status === 'prete';

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
        isBorrowed
          ? 'border-amber-200 bg-amber-50/20'
          : keyItem.status === 'disponible'
          ? 'border-emerald-200'
          : 'border-gray-200'
      }`}
    >
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#131B26] text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
              #{keyItem.keyring_number}
            </div>
            <div>
              <span className="text-xs font-bold text-[#131B26] block">
                Trousseau #{keyItem.keyring_number}
              </span>
              <span className="text-[10px] font-semibold text-gray-500 block">
                {keyItem.cabinet_location}
              </span>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              keyItem.status === 'disponible'
                ? 'bg-emerald-100 text-emerald-800'
                : keyItem.status === 'prete'
                ? 'bg-amber-100 text-amber-800 animate-pulse'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {keyItem.status === 'disponible'
              ? 'En Agence'
              : keyItem.status === 'prete'
              ? 'Prêté'
              : 'Propriétaire'}
          </span>
        </div>

        {/* Associated Property */}
        {property ? (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#C59A45] tracking-wider block">
              {formatMandateRef(property.mandate_number)} • {property.mandate_type}
            </span>
            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{property.title}</h4>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>
                {property.city} ({property.postal_code})
              </span>
            </p>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 italic">
            Aucun mandat rattaché
          </div>
        )}

        {/* Specs / Badge */}
        <div className="flex items-center gap-2 text-[11px] text-gray-600">
          <span className="px-2 py-0.5 bg-gray-100 rounded font-semibold">
            {keyItem.keys_count} clés sur anneau
          </span>
          {keyItem.has_alarm_badge && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">
              Badge Vigik / Alarme
            </span>
          )}
        </div>

        {/* Loan info if borrowed */}
        {isBorrowed && keyItem.current_borrower && (
          <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {keyItem.current_borrower.borrower_name}
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
                {keyItem.current_borrower.borrower_role}
              </span>
            </div>
            {keyItem.current_borrower.borrower_company && (
              <p className="text-[11px] text-amber-800 font-medium">
                Sté : {keyItem.current_borrower.borrower_company}
              </p>
            )}
            <p className="text-[11px] text-amber-800 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <a href={`tel:${keyItem.current_borrower.borrower_phone}`} className="hover:underline font-semibold">
                {keyItem.current_borrower.borrower_phone}
              </a>
            </p>
            <p className="text-[10px] text-amber-700 italic">
              Motif : {keyItem.current_borrower.purpose}
            </p>
            <p className="text-[10px] text-amber-900 font-bold flex items-center gap-1 pt-0.5">
              <Clock className="w-3 h-3" />
              Retour prévu :{' '}
              {new Date(keyItem.current_borrower.expected_return_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        {keyItem.notes && (
          <p className="text-[11px] text-gray-500 italic">{keyItem.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        {isBorrowed ? (
          <>
            <button
              onClick={() => onReturnKey(keyItem)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restituer à l&apos;Armoire</span>
            </button>
            {keyItem.current_borrower && (
              <button
                onClick={() => onPrintDischarge(keyItem)}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                title="Imprimer Récépissé de Décharge"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={() => onBorrowKey(keyItem)}
            className="w-full py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#C59A45]" />
            <span>Confier / Prêter le Trousseau</span>
          </button>
        )}
      </div>
    </div>
  );
};
