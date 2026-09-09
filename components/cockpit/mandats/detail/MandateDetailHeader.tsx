'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property, PropertyStatus } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Printer,
  FileSignature,
  TrendingDown,
  FileBarChart,
  Sparkles,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MandateDetailHeaderProps {
  property: Property;
  onStatusChange: (status: PropertyStatus) => void;
  onOpenSignatureModal: () => void;
  onOpenAvenantModal: () => void;
  onOpenContractModal: () => void;
  onOpenShareModal: () => void;
  onOpenWeeklyDigestModal: () => void;
  onOpenLaunchPackModal?: () => void;
  onOpenMonthlyReportModal?: () => void;
}

export const MandateDetailHeader: React.FC<MandateDetailHeaderProps> = ({
  property,
  onStatusChange,
  onOpenSignatureModal,
  onOpenAvenantModal,
  onOpenContractModal,
  onOpenShareModal,
  onOpenWeeklyDigestModal,
  onOpenLaunchPackModal = () => {},
  onOpenMonthlyReportModal = () => {},
}) => {
  const mandateRef = formatMandateRef(property.mandate_number);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <div className="flex items-center gap-3">
        <Link
          href="/cockpit/mandats"
          className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-[#E12B7B] transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-[#E12B7B]">{mandateRef}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                property.mandate_type === 'exclusif'
                  ? 'bg-rose-50 text-[#E12B7B]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {property.mandate_type}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                property.status === 'actif'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {property.status}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] tracking-tight">
            {property.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={property.status}
          onChange={(e) => onStatusChange(e.target.value as PropertyStatus)}
          className="p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
        >
          <option value="actif">Statut : Actif en vente</option>
          <option value="sous_compromis">Statut : Sous compromis</option>
          <option value="vendu">Statut : Vendu</option>
          <option value="archive">Statut : Archivé</option>
          <option value="resilie">Statut : Résilié</option>
        </select>

        {/* Action 1 : Pack Lancement 1 Clic */}
        <button
          type="button"
          onClick={onOpenLaunchPackModal}
          className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Pack Lancement
        </button>

        {/* Action 2 : Bilan Mensuel Vendeur */}
        <button
          type="button"
          onClick={onOpenMonthlyReportModal}
          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <FileBarChart className="w-3.5 h-3.5" />
          Bilan Vendeur
        </button>

        {/* Action 3 : Signer le Mandat */}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onOpenSignatureModal}
          leftIcon={<FileSignature className="w-3.5 h-3.5" />}
        >
          Signer Mandat
        </Button>

        {/* Secondary Tools Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setToolsOpen(!toolsOpen)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Autres options et documents"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {toolsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 space-y-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setToolsOpen(false);
                  onOpenContractModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
              >
                <Printer className="w-3.5 h-3.5 text-gray-500" />
                Contrat A4 Imprimable
              </button>
              <button
                type="button"
                onClick={() => {
                  setToolsOpen(false);
                  onOpenAvenantModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
              >
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                Avenant Baisse de Prix
              </button>
              <button
                type="button"
                onClick={() => {
                  setToolsOpen(false);
                  onOpenShareModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                Partager fiche WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setToolsOpen(false);
                  onOpenWeeklyDigestModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
              >
                <FileBarChart className="w-3.5 h-3.5 text-purple-500" />
                Point Hebdo Vendeur
              </button>
              <div className="border-t border-gray-100 my-1" />
              <Link
                href={`/cockpit/mandats/${property.id}/edit`}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
              >
                <Edit className="w-3.5 h-3.5 text-gray-500" />
                Modifier la fiche
              </Link>
              <Link
                href={`/biens/${property.id}`}
                target="_blank"
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                Voir sur le site vitrine
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
