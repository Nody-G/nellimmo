'use client';

import React from 'react';
import Link from 'next/link';
import { Property, TransactionDeal, AgencyKey, AgencySignboard } from '@/lib/types';
import { isAuditEnergetiqueObligatoire, formatMandateRef } from '@/lib/hoguet';
import {
  AlertTriangle,
  Zap,
  Clock,
  KeyRound,
  Building,
  Landmark,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface UrgentAlertsWidgetProps {
  properties: Property[];
  transactions: TransactionDeal[];
  keys: AgencyKey[];
  signboards: AgencySignboard[];
}

export const UrgentAlertsWidget: React.FC<UrgentAlertsWidgetProps> = ({
  properties,
  transactions,
  keys,
  signboards
}) => {
  const activeProperties = properties.filter((p) => p.status === 'actif');

  const energyAuditProperties = activeProperties.filter((p) =>
    isAuditEnergetiqueObligatoire(p.dpe_letter)
  );

  const expiringProperties = activeProperties.filter((p) => {
    const end = new Date(p.mandate_end_date);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays >= 0;
  });

  const borrowedKeysList = keys.filter((k) => k.status === 'prete');
  const signboardsToRemove = signboards.filter((s) => s.status === 'a_deposer');
  const loanPendingDeals = transactions.filter((t) => t.status === 'attente_pret');
  const sruPendingDeals = transactions.filter(
    (t) => t.status === 'compromis_signe' || t.status === 'delai_sru_en_cours'
  );

  const totalUrgentAlerts =
    energyAuditProperties.length +
    expiringProperties.length +
    borrowedKeysList.length +
    signboardsToRemove.length +
    loanPendingDeals.length +
    sruPendingDeals.length;

  return (
    <Card className="border-amber-200/80 bg-amber-50/20">
      <CardHeader className="bg-amber-50/60 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm">Alertes Réglementaires & Échéances Notaires</CardTitle>
            <p className="text-[11px] text-amber-800">
              {totalUrgentAlerts} point(s) d&apos;attention juridique et logistique requérant votre action
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Alerte 1 : Audit DPE F/G */}
          {energyAuditProperties.length > 0 && (
            <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs flex items-start gap-2.5 shadow-xs">
              <Zap className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-rose-900 block">
                  {energyAuditProperties.length} Mandat(s) Passoire Énergétique
                </span>
                <p className="text-[11px] text-gray-600">
                  Classe F ou G : Audit énergétique obligatoire avant signature du compromis.
                </p>
                <Link
                  href="/cockpit/mandats"
                  className="text-[10px] font-bold text-[#E12B7B] hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  Voir les mandats concernés <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Alerte 2 : Expiration Mandat */}
          {expiringProperties.length > 0 && (
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex items-start gap-2.5 shadow-xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 block">
                  {expiringProperties.length} Mandat(s) Expirant sous 60 jours
                </span>
                <p className="text-[11px] text-gray-600">
                  Prévoir un compte-rendu d&apos;activité vendeur et un avenant de prorogation.
                </p>
                <Link
                  href="/cockpit/mandats"
                  className="text-[10px] font-bold text-[#E12B7B] hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  Gérer les renouvellements <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Alerte 3 : Clés Sorties */}
          {borrowedKeysList.length > 0 && (
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex items-start gap-2.5 shadow-xs">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 block">
                  {borrowedKeysList.length} Trousseau(x) actuellement sorti(s)
                </span>
                <p className="text-[11px] text-gray-600">
                  Artisans ou diagnostiqueurs avec engagement de restitution sous décharge.
                </p>
                <Link
                  href="/cockpit/cles-panneaux"
                  className="text-[10px] font-bold text-[#E12B7B] hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  Consulter l&apos;armoire à clés <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Alerte 4 : Déposes Panneaux Loi Grenelle */}
          {signboardsToRemove.length > 0 && (
            <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs flex items-start gap-2.5 shadow-xs">
              <Building className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-rose-900 block">
                  {signboardsToRemove.length} Panneau(x) à Déposer d&apos;Urgence
                </span>
                <p className="text-[11px] text-gray-600">
                  Loi Grenelle II : Délai maximal de 3 mois dépassé pour panneau &quot;Vendu&quot;.
                </p>
                <Link
                  href="/cockpit/cles-panneaux"
                  className="text-[10px] font-bold text-[#E12B7B] hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  Planifier la dépose <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Alerte 5 : Délai SRU */}
          {sruPendingDeals.length > 0 && (
            <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs flex items-start gap-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-blue-900 block">
                  {sruPendingDeals.length} Vente(s) sous Délai de Rétractation SRU
                </span>
                <p className="text-[11px] text-gray-600">
                  Suivi de la notification recommandée AR (J+10 jours légaux).
                </p>
                <Link
                  href="/cockpit/transactions"
                  className="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  Suivre les délais SRU <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Alerte 6 : Accords de prêt */}
          {loanPendingDeals.length > 0 && (
            <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs flex items-start gap-2.5 shadow-xs">
              <Landmark className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-purple-900 block">
                  {loanPendingDeals.length} Financement(s) en Attente d&apos;Accord
                </span>
                <p className="text-[11px] text-gray-600">
                  Condition suspensive de prêt : relancer courtiers et banques partenaires.
                </p>
                <Link
                  href="/cockpit/transactions"
                  className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  Ouvrir le pipeline notaire <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
