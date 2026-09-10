'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property, PropertyStatus } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  ArrowLeft,
  FileSignature,
  FileBarChart,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MandateHeaderToolsMenu } from './MandateHeaderToolsMenu';

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
  onCreateDriveTree?: () => void;
  isCreatingDriveTree?: boolean;
}

export const MandateDetailHeader: React.FC<MandateDetailHeaderProps> = ({
  property,
  onStatusChange,
  onOpenSignatureModal,
  onOpenAvenantModal,
  onOpenContractModal,
  onOpenShareModal,
  onOpenWeeklyDigestModal,
  onOpenLaunchPackModal = () => { },
  onOpenMonthlyReportModal = () => { },
  onCreateDriveTree,
  isCreatingDriveTree = false,
}) => {
  const mandateRef = formatMandateRef(property.mandate_number);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Link
          href="/cockpit/mandats"
          className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition shadow-2xs shrink-0 mt-0.5"
          title="Retour aux mandats"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
              {mandateRef}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${property.mandate_type === 'exclusif'
                ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                : 'bg-gray-100 text-gray-700'
                }`}
            >
              {property.mandate_type}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${property.status === 'actif'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                : 'bg-gray-100 text-gray-700'
                }`}
            >
              {property.status}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-serif font-bold text-[#131B26] tracking-tight mt-1 leading-snug break-words">
            {property.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <select
          value={property.status}
          onChange={(e) => onStatusChange(e.target.value as PropertyStatus)}
          aria-label="Statut du mandat"
          className="py-2 px-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-[#E12B7B] shadow-2xs cursor-pointer"
        >
          <option value="actif">Statut : Actif en vente</option>
          <option value="sous_compromis">Statut : Sous compromis</option>
          <option value="vendu">Statut : Vendu</option>
          <option value="archive">Statut : Archivé</option>
          <option value="resilie">Statut : Résilié</option>
        </select>

        {/* Action 1 : Pack Lancement */}
        <button
          type="button"
          onClick={onOpenLaunchPackModal}
          className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
          <span>Pack Lancement</span>
        </button>

        {/* Action 2 : Bilan Vendeur */}
        <button
          type="button"
          onClick={onOpenMonthlyReportModal}
          className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <FileBarChart className="w-3.5 h-3.5 text-gray-500" />
          <span>Bilan Vendeur</span>
        </button>

        {/* Action 3 : Signer le Mandat (Primary CTA) */}
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
            className="p-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-xs font-bold flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Options supplémentaires et documents"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {toolsOpen && (
            <MandateHeaderToolsMenu
              property={property}
              onClose={() => setToolsOpen(false)}
              onOpenContractModal={onOpenContractModal}
              onOpenAvenantModal={onOpenAvenantModal}
              onOpenShareModal={onOpenShareModal}
              onOpenWeeklyDigestModal={onOpenWeeklyDigestModal}
              onCreateDriveTree={onCreateDriveTree}
              isCreatingDriveTree={isCreatingDriveTree}
            />
          )}
        </div>
      </div>
    </div>
  );
};
