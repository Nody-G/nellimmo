'use client';

import React, { useMemo } from 'react';
import { BellRing, MessageCircle, CheckCircle2, Clock } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { computeRelances, type RelanceAction } from '@/lib/relances';

interface ContactRelancesTabProps {
    contact: ContactItem;
}

/**
 * Onglet « Relances » de la fiche contact.
 *
 * Interconnexion (O9) : le moteur de relances global (lib/relances.ts) est
 * filtré pour ne présenter que les actions concernant ce contact. Aucun calcul
 * supplémentaire n'est introduit : on réutilise le moteur pur existant et on
 * restreint le périmètre par nom / téléphone / bien rattaché.
 */
export function ContactRelancesTab({ contact }: ContactRelancesTabProps) {
    const {
        properties,
        visits,
        transactions,
        buyers,
        settings,
        relanceStatuses,
        setRelanceStatus,
    } = useNellimoStore();

    const contactFullName = `${contact.first_name || ''} ${contact.last_name || ''}`
        .trim()
        .toLowerCase();
    const contactPhone = (contact.phone || '').replace(/[^0-9]/g, '');
    const linkedPropertyIds = contact.associated_property_ids || [];

    const relances = useMemo<RelanceAction[]>(() => {
        const all = computeRelances({ properties, visits, transactions, buyers, settings });

        return all.filter((action) => {
            const actionName = (action.contactName || '').trim().toLowerCase();
            const actionPhone = (action.contactPhone || '').replace(/[^0-9]/g, '');

            const sameName = contactFullName.length > 0 && actionName === contactFullName;
            const samePhone = contactPhone.length > 0 && actionPhone === contactPhone;
            const sameProperty = linkedPropertyIds.includes(action.sourceId);

            return sameName || samePhone || sameProperty;
        });
    }, [
        properties,
        visits,
        transactions,
        buyers,
        settings,
        contactFullName,
        contactPhone,
        linkedPropertyIds,
    ]);

    const pending = relances.filter(
        (r) => (relanceStatuses[r.id] || 'a_faire') === 'a_faire'
    );

    const handleWhatsApp = (action: RelanceAction) => {
        const cleanPhone = (action.contactPhone || '').replace(/\s+/g, '').replace(/^0/, '33');
        if (!cleanPhone) return;
        window.open(
            `https://wa.me/${cleanPhone}?text=${encodeURIComponent(action.message)}`,
            '_blank'
        );
    };

    if (relances.length === 0) {
        return (
            <div className="p-8 text-center bg-[#FCFAF7] rounded-2xl border border-dashed border-gray-200">
                <BellRing className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-bold text-gray-600">Aucune relance en cours</p>
                <p className="text-gray-400 mt-1">
                    Les rappels de visite, échéances de mandat et jalons notariaux liés à ce contact
                    apparaîtront ici automatiquement.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">
                    Relances liées à ce contact ({pending.length} à faire)
                </span>
            </div>

            {relances.map((action) => {
                const status = relanceStatuses[action.id] || 'a_faire';
                const isDone = status === 'faite';
                const isIgnored = status === 'ignoree';

                return (
                    <div
                        key={action.id}
                        className={`p-4 rounded-2xl border transition ${isDone
                                ? 'bg-emerald-50/60 border-emerald-100'
                                : isIgnored
                                    ? 'bg-gray-50 border-gray-200 opacity-60'
                                    : 'bg-white border-[#F3E8EE]'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#E12B7B]">
                                        <Clock className="w-3 h-3" />
                                        {action.dueLabel}
                                    </span>
                                </div>
                                <p className="font-bold text-gray-800 mt-1">{action.title}</p>
                                <p className="text-gray-500 mt-0.5">{action.sourceLabel}</p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                {action.contactPhone && (
                                    <button
                                        type="button"
                                        onClick={() => handleWhatsApp(action)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition cursor-pointer"
                                        title="Envoyer le message WhatsApp pré-rempli"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>WhatsApp</span>
                                    </button>
                                )}
                                {!isDone && (
                                    <button
                                        type="button"
                                        onClick={() => setRelanceStatus(action.id, 'faite')}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition cursor-pointer"
                                        title="Marquer comme faite"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
