'use client';

import React from 'react';
import Link from 'next/link';
import { Property, PropertyStatus } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Printer,
  FileSignature,
  FileCheck2,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MandateDetailHeaderProps {
  property: Property;
  onStatusChange: (status: PropertyStatus) => void;
  onOpenSignatureModal: () => void;
  onOpenAvenantModal: () => void;
  onOpenContractModal: () => void;
}

export const MandateDetailHeader: React.FC<MandateDetailHeaderProps> = ({
  property,
  onStatusChange,
  onOpenSignatureModal,
  onOpenAvenantModal,
  onOpenContractModal
}) => {
  const mandateRef = formatMandateRef(property.mandate_number);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
      <div className="flex items-center gap-3">
        <Link
          href="/cockpit/mandats"
          className="p-2 bg-white rounded-xl border border-[#F3E8EE] text-gray-600 hover:text-[#E12B7B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-[#E12B7B]">{mandateRef}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                property.mandate_type === 'exclusif'
                  ? 'bg-[#FDF2F8] text-[#E12B7B]'
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
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
            {property.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={property.status}
          onChange={(e) => onStatusChange(e.target.value as PropertyStatus)}
          className="p-2 bg-white border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
        >
          <option value="actif">Statut : Actif en vente</option>
          <option value="sous_compromis">Statut : Sous compromis</option>
          <option value="vendu">Statut : Vendu</option>
          <option value="archive">Statut : Archivé</option>
          <option value="resilie">Statut : Résilié</option>
        </select>

        <Link
          href={`/biens/${property.id}`}
          target="_blank"
          className="p-2 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          title="Voir sur le site vitrine"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Vitrine</span>
        </Link>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onOpenContractModal}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
        >
          Contrat Mandat A4
        </Button>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onOpenSignatureModal}
          leftIcon={<FileSignature className="w-3.5 h-3.5" />}
        >
          Signer Mandat
        </Button>

        <Button
          type="button"
          variant="gold"
          size="sm"
          onClick={onOpenAvenantModal}
          leftIcon={<TrendingDown className="w-3.5 h-3.5" />}
        >
          Avenant Prix
        </Button>

        <Link
          href={`/cockpit/mandats/${property.id}/edit`}
          className="p-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Modifier</span>
        </Link>
      </div>
    </div>
  );
};
