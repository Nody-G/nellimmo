'use client';

import React from 'react';
import { Property, AgencyKey, AgencySignboard } from '@/lib/types';
import { isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import {
  Zap,
  Clock,
  KeyRound,
  Building,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AlertCard } from './alerts';

interface UrgentAlertsWidgetProps {
  properties: Property[];
  keys: AgencyKey[];
  signboards: AgencySignboard[];
}

export const UrgentAlertsWidget: React.FC<UrgentAlertsWidgetProps> = ({
  properties,
  keys,
  signboards,
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

  const totalLogisticalAlerts =
    energyAuditProperties.length +
    expiringProperties.length +
    borrowedKeysList.length +
    signboardsToRemove.length;

  if (totalLogisticalAlerts === 0) return null;

  return (
    <Card className="border-amber-200/80 bg-amber-50/20">
      <CardHeader className="bg-amber-50/60 border-b border-amber-100 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm">Alertes Réglementaires, Mandats & Logistique</CardTitle>
            <p className="text-[11px] text-amber-800">
              {totalLogisticalAlerts} point(s) de vigilance matérielle et contractuelle requérant votre attention
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {energyAuditProperties.length > 0 && (
            <AlertCard
              icon={<Zap className="w-4 h-4 text-rose-600" />}
              title={`${energyAuditProperties.length} Mandat(s) Passoire F/G`}
              description="Audit énergétique obligatoire avant signature du compromis."
              actionHref="/cockpit/mandats"
              actionText="Voir les mandats"
              borderColor="border-rose-200"
              titleColor="text-rose-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {expiringProperties.length > 0 && (
            <AlertCard
              icon={<Clock className="w-4 h-4 text-amber-600" />}
              title={`${expiringProperties.length} Mandat(s) Expirant (<60j)`}
              description="Prévoir un point vendeur et un avenant de prorogation."
              actionHref="/cockpit/mandats"
              actionText="Gérer les mandats"
              borderColor="border-amber-200"
              titleColor="text-amber-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {borrowedKeysList.length > 0 && (
            <AlertCard
              icon={<KeyRound className="w-4 h-4 text-amber-600" />}
              title={`${borrowedKeysList.length} Clé(s) sortie(s)`}
              description="Artisans ou diagnostiqueurs sous décharge d'émargement."
              actionHref="/cockpit/cles-panneaux"
              actionText="Armoire à clés"
              borderColor="border-amber-200"
              titleColor="text-amber-900"
              actionColor="text-[#E12B7B]"
            />
          )}

          {signboardsToRemove.length > 0 && (
            <AlertCard
              icon={<Building className="w-4 h-4 text-rose-600" />}
              title={`${signboardsToRemove.length} Panneau(x) à Déposer`}
              description='Loi Grenelle II : Délai maximal de 3 mois dépassé pour "Vendu".'
              actionHref="/cockpit/cles-panneaux"
              actionText="Planifier dépose"
              borderColor="border-rose-200"
              titleColor="text-rose-900"
              actionColor="text-[#E12B7B]"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
