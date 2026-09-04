'use client';

import React, { useMemo } from 'react';
import { Property, TransactionDeal, AgencyKey, AgencySignboard } from '@/lib/types';
import { isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import { useNellimoStore, useRelances } from '@/lib/store';
import { computeRelances } from '@/lib/relances';
import {
  AlertTriangle,
  Zap,
  Clock,
  KeyRound,
  Building,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AlertCard, RelancePriorityBanner } from './alerts';

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

  const { visits, buyers, settings } = useNellimoStore();
  const { relanceStatuses } = useRelances();

  const pendingRelances = useMemo(() => {
    try {
      const actions = computeRelances({ properties, visits, transactions, buyers, settings });
      return actions.filter((a) => {
        const status = relanceStatuses[a.id];
        return status !== 'faite' && status !== 'ignoree';
      });
    } catch {
      return [];
    }
  }, [properties, visits, transactions, buyers, settings, relanceStatuses]);

  const totalUrgentAlerts =
    energyAuditProperties.length +
    expiringProperties.length +
    borrowedKeysList.length +
    signboardsToRemove.length +
    loanPendingDeals.length +
    sruPendingDeals.length +
    pendingRelances.length;

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
        <RelancePriorityBanner pendingCount={pendingRelances.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {energyAuditProperties.length > 0 && (
            <AlertCard
              icon={<Zap className="w-4 h-4 text-rose-600" />}
              title={`${energyAuditProperties.length} Mandat(s) Passoire Énergétique`}
              description="Classe F ou G : Audit énergétique obligatoire avant signature du compromis."
              actionHref="/cockpit/mandats"
              actionText="Voir les mandats concernés"
              borderColor="border-rose-200"
              titleColor="text-rose-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {expiringProperties.length > 0 && (
            <AlertCard
              icon={<Clock className="w-4 h-4 text-amber-600" />}
              title={`${expiringProperties.length} Mandat(s) Expirant sous 60 jours`}
              description="Prévoir un compte-rendu d'activité vendeur et un avenant de prorogation."
              actionHref="/cockpit/mandats"
              actionText="Gérer les renouvellements"
              borderColor="border-amber-200"
              titleColor="text-amber-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {borrowedKeysList.length > 0 && (
            <AlertCard
              icon={<KeyRound className="w-4 h-4 text-amber-600" />}
              title={`${borrowedKeysList.length} Trousseau(x) actuellement sorti(s)`}
              description="Artisans ou diagnostiqueurs avec engagement de restitution sous décharge."
              actionHref="/cockpit/cles-panneaux"
              actionText="Consulter l'armoire à clés"
              borderColor="border-amber-200"
              titleColor="text-amber-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {signboardsToRemove.length > 0 && (
            <AlertCard
              icon={<Building className="w-4 h-4 text-rose-600" />}
              title={`${signboardsToRemove.length} Panneau(x) à Déposer d'Urgence`}
              description='Loi Grenelle II : Délai maximal de 3 mois dépassé pour panneau "Vendu".'
              actionHref="/cockpit/cles-panneaux"
              actionText="Planifier la dépose"
              borderColor="border-rose-200"
              titleColor="text-rose-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {sruPendingDeals.length > 0 && (
            <AlertCard
              icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
              title={`${sruPendingDeals.length} Vente(s) sous Délai de Rétractation SRU`}
              description="Suivi de la notification recommandée AR (J+10 jours légaux)."
              actionHref="/cockpit/transactions"
              actionText="Suivre les délais SRU"
              borderColor="border-blue-200"
              titleColor="text-blue-900"
              actionColor="text-blue-700"
            />
          )}

          {loanPendingDeals.length > 0 && (
            <AlertCard
              icon={<Landmark className="w-4 h-4 text-purple-600" />}
              title={`${loanPendingDeals.length} Financement(s) en Attente d'Accord`}
              description="Condition suspensive de prêt : relancer courtiers et banques partenaires."
              actionHref="/cockpit/transactions"
              actionText="Ouvrir le pipeline notaire"
              borderColor="border-purple-200"
              titleColor="text-purple-900"
              actionColor="text-purple-700"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
