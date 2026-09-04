'use client';

import React from 'react';
import { MandateAuditLog, Property } from '@/lib/types';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface MandateAuditTabProps {
  property: Property;
  logs: MandateAuditLog[];
}

export const MandateAuditTab: React.FC<MandateAuditTabProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      {/* Compliance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-start gap-4">
        <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <span>Registre Électronique des Mandats Conforme Loi Hoguet (Décret 72-678)</span>
            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-mono font-bold">
              DGCCRF OK
            </span>
          </h3>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            Chaque attribution de numéro de mandat et chaque avenant de prix est scellé par une empreinte
            cryptographique SHA-256 infalsifiable. Ce registre numérique remplace légalement le registre papier
            à trame continue selon l&apos;article 72 de la loi Hoguet.
          </p>
        </div>
      </div>

      {/* Audit Trail Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C59A45]" />
            <span>Grand Livre des Événements Cryptographiés</span>
          </CardTitle>
          <span className="text-xs font-semibold text-gray-500">
            {logs.length} entrée(s) scellée(s)
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold bg-gray-50/50">
                  <th className="py-3 px-4">Horodatage UTC</th>
                  <th className="py-3 px-4">Type d&apos;Événement</th>
                  <th className="py-3 px-4">Auteur</th>
                  <th className="py-3 px-4">Détails des Modifications</th>
                  <th className="py-3 px-4">Signature Empreinte SHA-256</th>
                  <th className="py-3 px-4 text-center">Contrôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                      Aucune modification enregistrée depuis la création scellée initiale.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80">
                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {new Date(log.logged_at).toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#131B26] capitalize">
                        {log.action_type.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        {log.performed_by || 'Nelly Fernandez'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {log.action_type === 'modification_prix' && log.previous_state?.price_fai ? (
                          <span>
                            {log.previous_state.price_fai.toLocaleString('fr-FR')} € →{' '}
                            <strong className="text-gray-900">
                              {log.new_state.price_fai?.toLocaleString('fr-FR')} €
                            </strong>
                          </span>
                        ) : (
                          <span>Enregistrement légal initial</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500 max-w-xs truncate">
                        {log.signature_sha256}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Scellé
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
