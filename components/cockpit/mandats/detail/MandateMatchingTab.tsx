'use client';

import React from 'react';
import { Property, Buyer, ProposalHistory, ProposalStatus } from '@/lib/types';
import {
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  MessageCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MandateMatchingTabProps {
  property: Property;
  matchedBuyers: Array<{
    buyer: Buyer;
    score: number;
    criteriaMatches: {
      budget: boolean;
      surface: boolean;
      rooms: boolean;
      propertyType: boolean;
      city: boolean;
      garden: boolean;
      garage: boolean;
    };
  }>;
  proposals: ProposalHistory[];
  onCreateProposal: (buyerId: string, channel: 'whatsapp' | 'email') => Promise<void>;
  onUpdateProposalStatus: (proposalId: string, status: ProposalStatus) => Promise<void>;
}

export const MandateMatchingTab: React.FC<MandateMatchingTabProps> = ({
  property,
  matchedBuyers,
  proposals,
  onCreateProposal,
  onUpdateProposalStatus
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#131B26] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E12B7B]" />
            <span>Moteur de Rapprochement Acquéreurs & Scoring de Matching</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Calcul en temps réel de compatibilité multi-critères sur la base des profils de recherche actifs.
          </p>
        </div>
        <span className="text-xs font-bold text-[#E12B7B] bg-[#FDF2F8] px-3 py-1 rounded-full">
          {matchedBuyers.length} acquéreurs qualifiés
        </span>
      </div>

      <div className="space-y-3">
        {matchedBuyers.length === 0 ? (
          <Card className="p-8 text-center text-xs text-gray-400 italic">
            Aucun acquéreur enregistré ne correspond actuellement aux critères de ce bien.
          </Card>
        ) : (
          matchedBuyers.map(({ buyer, score, criteriaMatches }) => {
            const existingProp = proposals.find(
              (p) => p.property_id === property.id && p.buyer_id === buyer.id
            );

            return (
              <Card key={buyer.id} className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs ${
                        score >= 80
                          ? 'bg-emerald-500 text-white'
                          : score >= 50
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {score}%
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        {buyer.first_name} {buyer.last_name}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1 font-bold text-gray-700">
                          Budget : {buyer.budget_max.toLocaleString('fr-FR')} €
                        </span>
                        <span>•</span>
                        <span>{buyer.target_cities.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Proposal */}
                  <div className="flex items-center gap-2">
                    {buyer.phone && (
                      <a
                        href={`https://wa.me/${buyer.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(
                          `Bonjour ${buyer.first_name}, Nelly Fernandez de l'agence Nell'Immo. J'ai le plaisir de vous proposer en avant-première ce bien qui correspond à 100% à votre recherche : ${property.title} à ${property.city} (${property.price_fai.toLocaleString('fr-FR')} € FAI). Découvrir la fiche : ${typeof window !== 'undefined' ? window.location.origin : ''}/biens/${property.id}`
                        )}`}
                        target="_blank"
                        onClick={() => onCreateProposal(buyer.id, 'whatsapp')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {buyer.email && (
                      <a
                        href={`mailto:${buyer.email}?subject=${encodeURIComponent(
                          `Opportunité Immobilière Nell'Immo - ${property.title}`
                        )}`}
                        onClick={() => onCreateProposal(buyer.id, 'email')}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                        title="Envoyer par email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Criteria Match Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-semibold ${criteriaMatches.budget ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    Budget {criteriaMatches.budget ? '✓' : '✗'}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-semibold ${criteriaMatches.city ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    Commune {criteriaMatches.city ? '✓' : '✗'}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-semibold ${criteriaMatches.surface ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    Surface {criteriaMatches.surface ? '✓' : '✗'}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-semibold ${criteriaMatches.rooms ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    Pièces {criteriaMatches.rooms ? '✓' : '✗'}
                  </span>
                </div>

                {/* Proposal Status if already proposed */}
                {existingProp && (
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-900 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Pack proposé le {new Date(existingProp.proposed_at).toLocaleDateString('fr-FR')} via {existingProp.channel.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Statut :</span>
                      <select
                        value={existingProp.status}
                        onChange={(e) => onUpdateProposalStatus(existingProp.id, e.target.value as ProposalStatus)}
                        className="p-1 bg-white border border-emerald-300 rounded font-bold text-emerald-900 text-xs focus:outline-none"
                      >
                        <option value="propose">Proposé (en attente)</option>
                        <option value="interesse">Intéressé / Séduit</option>
                        <option value="visite_programmee">Visite programmée</option>
                        <option value="refuse">Pas intéressé</option>
                      </select>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
