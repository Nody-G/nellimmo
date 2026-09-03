'use client';

import React from 'react';
import { AgencyKey, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  MapPin,
  Clock,
  User,
  Phone,
  RotateCcw,
  Printer,
  UserCheck,
  Search
} from 'lucide-react';

interface KeyInventoryTableProps {
  keys: AgencyKey[];
  properties: Property[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onBorrowKey: (key: AgencyKey) => void;
  onReturnKey: (key: AgencyKey) => void;
  onPrintDischarge: (key: AgencyKey) => void;
}

export const KeyInventoryTable: React.FC<KeyInventoryTableProps> = ({
  keys,
  properties,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onBorrowKey,
  onReturnKey,
  onPrintDischarge
}) => {
  const filteredKeys = keys.filter((k) => {
    const prop = properties.find((p) => p.id === k.property_id);
    const searchStr = `${k.keyring_number} ${k.cabinet_location} ${prop?.title || ''} ${prop?.city || ''} ${k.current_borrower?.borrower_name || ''}`.toLowerCase();
    const matchSearch = searchStr.includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'tous' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un trousseau, une adresse, un artisan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500">Statut :</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="tous">Tous les trousseaux</option>
            <option value="disponible">En Agence (Disponible)</option>
            <option value="prete">Sorti / Prêté</option>
            <option value="double_proprietaire">Double Propriétaire</option>
          </select>
        </div>
      </div>

      {/* Key Cabinet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKeys.map((key) => {
          const prop = properties.find((p) => p.id === key.property_id);
          const isBorrowed = key.status === 'prete';

          return (
            <div
              key={key.id}
              className={`bg-white rounded-2xl p-5 border transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                isBorrowed
                  ? 'border-amber-200 bg-amber-50/20'
                  : key.status === 'disponible'
                  ? 'border-emerald-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#131B26] text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
                      #{key.keyring_number}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#131B26] block">
                        Trousseau #{key.keyring_number}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500 block">
                        {key.cabinet_location}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      key.status === 'disponible'
                        ? 'bg-emerald-100 text-emerald-800'
                        : key.status === 'prete'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {key.status === 'disponible'
                      ? 'En Agence'
                      : key.status === 'prete'
                      ? 'Prêté'
                      : 'Propriétaire'}
                  </span>
                </div>

                {/* Associated Property */}
                {prop ? (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#C59A45] tracking-wider block">
                      {formatMandateRef(prop.mandate_number)} • {prop.mandate_type}
                    </span>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{prop.city} ({prop.postal_code})</span>
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
                    {key.keys_count} clés sur anneau
                  </span>
                  {key.has_alarm_badge && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">
                      Badge Vigik / Alarme
                    </span>
                  )}
                </div>

                {/* Loan info if borrowed */}
                {isBorrowed && key.current_borrower && (
                  <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {key.current_borrower.borrower_name}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
                        {key.current_borrower.borrower_role}
                      </span>
                    </div>
                    {key.current_borrower.borrower_company && (
                      <p className="text-[11px] text-amber-800 font-medium">
                        Sté : {key.current_borrower.borrower_company}
                      </p>
                    )}
                    <p className="text-[11px] text-amber-800 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${key.current_borrower.borrower_phone}`} className="hover:underline font-semibold">
                        {key.current_borrower.borrower_phone}
                      </a>
                    </p>
                    <p className="text-[10px] text-amber-700 italic">
                      Motif : {key.current_borrower.purpose}
                    </p>
                    <p className="text-[10px] text-amber-900 font-bold flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      Retour prévu : {new Date(key.current_borrower.expected_return_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}

                {key.notes && (
                  <p className="text-[11px] text-gray-500 italic">
                    {key.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                {isBorrowed ? (
                  <>
                    <button
                      onClick={() => onReturnKey(key)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restituer à l&apos;Armoire</span>
                    </button>
                    {key.current_borrower && (
                      <button
                        onClick={() => onPrintDischarge(key)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        title="Imprimer Récépissé de Décharge"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => onBorrowKey(key)}
                    className="w-full py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#C59A45]" />
                    <span>Confier / Prêter le Trousseau</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
