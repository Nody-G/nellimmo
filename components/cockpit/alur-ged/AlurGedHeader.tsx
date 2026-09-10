'use client';

import React from 'react';
import {
  FileCheck2,
  Mail,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import type { Property, AlurDocumentCategory } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { getGoogleDriveUrl } from '@/lib/google';

interface AlurGedHeaderProps {
  property: Property;
  applicableCount: number;
  validCount: number;
  totalMandatory: number;
  completionPercent: number;
  missingCount: number;
  isApartment: boolean;
  activeCategory: AlurDocumentCategory | 'all';
  onCategoryChange: (category: AlurDocumentCategory | 'all') => void;
  onOpenNotarySlip: () => void;
  onSendReminder: () => void;
  onSendEmailReminder?: () => void;
  onAddDocument: () => void;
}

/** Top completion banner with gauge, clean actions toolbar and category filter bar. */
export function AlurGedHeader({
  property,
  applicableCount,
  validCount,
  totalMandatory,
  completionPercent,
  missingCount,
  isApartment,
  activeCategory,
  onCategoryChange,
  onOpenNotarySlip,
  onSendReminder,
  onSendEmailReminder,
  onAddDocument,
}: AlurGedHeaderProps) {
  const categoryButton = (category: AlurDocumentCategory | 'all', label: string, show = true) =>
    show ? (
      <button
        type="button"
        onClick={() => onCategoryChange(category)}
        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
          activeCategory === category
            ? 'bg-gray-900 text-white font-semibold shadow-2xs'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-medium'
        }`}
      >
        {label}
      </button>
    ) : null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-2xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Titre & Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Dossier ALUR &amp; Diagnostics
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono font-medium text-gray-500 bg-gray-100">
              {formatMandateRef(property.mandate_number)}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#131B26]">
            Constitution des Pièces de Vente
          </h2>
          <p className="text-xs text-gray-500 max-w-lg">
            Suivi exhaustif des documents obligatoires pour la mise en vente et la signature du compromis notarié.
          </p>
        </div>

        {/* Jauge de Complétion & Barre d'Actions Harmonieuse */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
          {/* Widget Progression */}
          <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/70 flex items-center gap-3.5 shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={completionPercent >= 80 ? 'text-emerald-500' : completionPercent >= 50 ? 'text-amber-500' : 'text-rose-500'}
                  strokeDasharray={`${completionPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-gray-900">{completionPercent}%</span>
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="font-semibold text-gray-900">
                {validCount} / {totalMandatory} validées
              </div>
              <div className={`text-[11px] font-medium ${completionPercent >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {completionPercent >= 80 ? '✓ Prêt pour compromis' : `${missingCount} pièce${missingCount > 1 ? 's' : ''} à recueillir`}
              </div>
            </div>
          </div>

          {/* Toolbar d'actions unifiée */}
          <div className="flex flex-col gap-1.5 min-w-[260px]">
            <button
              onClick={onAddDocument}
              className="w-full px-3.5 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C59A45]" />
              <span>Ajouter un document</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={onOpenNotarySlip}
                className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-gray-500" />
                <span>Bordereau</span>
              </button>

              <a
                href={getGoogleDriveUrl(property.google_drive_url, formatMandateRef(property.mandate_number))}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition"
                title="Ouvrir le dossier Google Drive pour ce mandat"
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Drive</span>
              </a>
            </div>

            {missingCount > 0 && (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={onSendReminder}
                  className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                  title="Envoyer un rappel WhatsApp au vendeur"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp ({missingCount})</span>
                </button>

                {onSendEmailReminder && (
                  <button
                    type="button"
                    onClick={onSendEmailReminder}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-900 border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                    title="Envoyer un rappel officiel par Gmail au vendeur"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email ({missingCount})</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de Filtres par Catégorie */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-gray-100 no-scrollbar">
        {categoryButton('all', `Toutes (${applicableCount})`)}
        {categoryButton('propriete', 'Titre & Propriété')}
        {categoryButton('diagnostics', 'Diagnostics DDT')}
        {categoryButton('copropriete', 'Copropriété ALUR', isApartment)}
        {categoryButton('identite', 'Identité & Mandants')}
      </div>
    </div>
  );
}
