'use client';

import React from 'react';
import { Property, TransactionDeal, Buyer, VisitSheet } from '@/lib/types';
import {
  FileText,
  TrendingUp,
  Landmark,
  Users,
  PenTool
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface DashboardKpisProps {
  properties: Property[];
  transactions: TransactionDeal[];
  buyers: Buyer[];
  visits: VisitSheet[];
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({
  properties,
  transactions,
  buyers,
  visits
}) => {
  const activeProperties = properties.filter((p) => p.status === 'actif');
  const totalFai = activeProperties.reduce((sum, p) => sum + p.price_fai, 0);
  const totalFees = activeProperties.reduce((sum, p) => sum + p.agency_fees_amount, 0);
  const exclusiveCount = activeProperties.filter((p) => p.mandate_type === 'exclusif').length;

  const activeTransactions = transactions.filter(
    (t) => t.status !== 'acte_signe' && t.status !== 'annule'
  );
  const pendingClosingFees = activeTransactions.reduce(
    (sum, t) => sum + (t.agency_fees_amount || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Card 1 : Portefeuille Actif */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-gray-500">Portefeuille Actif</span>
          <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[#131B26]">
            {totalFai.toLocaleString('fr-FR')} €
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
            <span className="font-bold text-[#E12B7B]">{activeProperties.length} mandats</span>
            <span>• dont {exclusiveCount} exclusifs</span>
          </div>
        </div>
      </Card>

      {/* Card 2 : Honoraires Attendus */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-gray-500">Honoraires Attendus</span>
          <div className="w-8 h-8 rounded-lg bg-[#EEF3EF] text-[#3D4E41] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[#3D4E41]">
            {totalFees.toLocaleString('fr-FR')} €
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Sur l&apos;ensemble du stock en vente
          </div>
        </div>
      </Card>

      {/* Card 3 : Ventes Sous Compromis */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-gray-500">Pipeline Notaires</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-blue-900">
            {pendingClosingFees.toLocaleString('fr-FR')} €
          </div>
          <div className="text-xs text-blue-700 font-semibold mt-1">
            {activeTransactions.length} dossiers en cours d&apos;acte
          </div>
        </div>
      </Card>

      {/* Card 4 : Acquéreurs Actifs */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-gray-500">CRM Acquéreurs</span>
          <div className="w-8 h-8 rounded-lg bg-[#FBF6E9] text-[#C59A45] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[#131B26]">
            {buyers.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Recherches qualifiées actives
          </div>
        </div>
      </Card>

      {/* Card 5 : Visites Réalisées */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-gray-500">Visites Réalisées</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[#131B26]">
            {visits.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Bons émargés et scellés
          </div>
        </div>
      </Card>
    </div>
  );
};
