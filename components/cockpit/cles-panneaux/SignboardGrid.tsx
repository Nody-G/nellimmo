'use client';

import React from 'react';
import { AgencySignboard, Property } from '@/lib/types';
import { ShieldCheck, Building, Check } from 'lucide-react';

interface SignboardGridProps {
  signboards: AgencySignboard[];
  properties: Property[];
  onUpdateStatus: (id: string, updates: Partial<AgencySignboard>) => Promise<void>;
}

export const SignboardGrid: React.FC<SignboardGridProps> = ({
  signboards,
  properties,
  onUpdateStatus
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold block mb-0.5">
            Réglementation Officielle Loi Grenelle II & Code de l&apos;Environnement (Art. L581-2)
          </span>
          L&apos;affichage d&apos;un panneau &quot;À Vendre&quot; ou &quot;Vendu&quot; est strictement
          encadré. Dès la signature de l&apos;acte authentique de vente, l&apos;agence dispose
          d&apos;un délai maximal de **3 mois** pour retirer définitivement le panneau
          &quot;Vendu&quot;, sous peine d&apos;astreinte administrative légale.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signboards.map((sign) => {
          const prop = properties.find((p) => p.id === sign.property_id);
          const isToDeposit = sign.status === 'a_deposer';

          return (
            <div
              key={sign.id}
              className={`bg-white rounded-2xl p-5 border transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                isToDeposit ? 'border-rose-300 bg-rose-50/30' : 'border-[#F3E8EE]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        sign.signboard_type === 'exclusivite'
                          ? 'bg-[#E12B7B]'
                          : sign.signboard_type === 'vendu'
                          ? 'bg-emerald-600'
                          : 'bg-[#131B26]'
                      }`}
                    >
                      {sign.signboard_type === 'exclusivite'
                        ? 'EXCLU'
                        : sign.signboard_type === 'vendu'
                        ? 'VENDU'
                        : 'VENTE'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block capitalize">
                        Panneau {sign.signboard_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {sign.location_details || 'Emplacement non précisé'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      sign.status === 'pose'
                        ? 'bg-blue-100 text-blue-800'
                        : sign.status === 'a_deposer'
                        ? 'bg-rose-100 text-rose-800 animate-bounce'
                        : sign.status === 'en_stock'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sign.status === 'pose'
                      ? 'Sur Place'
                      : sign.status === 'a_deposer'
                      ? 'À Déposer Urgence'
                      : sign.status === 'en_stock'
                      ? 'En Réserve'
                      : 'Déposé'}
                  </span>
                </div>

                {prop ? (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#E12B7B] uppercase block">
                      Mandat #{prop.mandate_number} • {prop.city}
                    </span>
                    <p className="font-semibold text-gray-800 line-clamp-1">{prop.title}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 italic">
                    Panneau non assigné (disponible en stock agence)
                  </div>
                )}

                {sign.installed_at && (
                  <div className="text-[11px] text-gray-500 flex items-center justify-between">
                    <span>Posé le :</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(sign.installed_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                {sign.removal_deadline && (
                  <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-[11px] flex items-center justify-between">
                    <span className="font-bold text-rose-700">Date limite légale :</span>
                    <span className="font-mono font-bold text-rose-800">
                      {new Date(sign.removal_deadline).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                {sign.notes && (
                  <p className="text-[11px] text-gray-500 italic">{sign.notes}</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                {sign.status === 'pose' && (
                  <button
                    onClick={() => onUpdateStatus(sign.id, { status: 'a_deposer' })}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Demander la dépose
                  </button>
                )}

                {sign.status === 'a_deposer' && (
                  <button
                    onClick={() =>
                      onUpdateStatus(sign.id, {
                        status: 'en_stock',
                        removal_deadline: undefined
                      })
                    }
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirmer Dépose & Stockage
                  </button>
                )}

                {sign.status === 'en_stock' && (
                  <button
                    onClick={() =>
                      onUpdateStatus(sign.id, {
                        status: 'pose',
                        installed_at: new Date().toISOString().slice(0, 10)
                      })
                    }
                    className="w-full py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Building className="w-3.5 h-3.5 text-[#C59A45]" />
                    Déclarer Pose sur Bien
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
