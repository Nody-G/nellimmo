'use client';

import { Sliders } from 'lucide-react';
import type { Property } from '@/lib/types';
import type { BadgePreset } from './flyer-types';

interface FlyerCustomizerDrawerProps {
    show: boolean;
    onClose: () => void;
    property: Property | undefined;
    badgePreset: BadgePreset;
    setBadgePreset: (v: BadgePreset) => void;
    customBadgeText: string;
    setCustomBadgeText: (v: string) => void;
    customBadgeColor: string;
    setCustomBadgeColor: (v: string) => void;
    customTitle: string;
    setCustomTitle: (v: string) => void;
    customSubtitle: string;
    setCustomSubtitle: (v: string) => void;
}

export function FlyerCustomizerDrawer({
    show,
    onClose,
    property,
    badgePreset,
    setBadgePreset,
    customBadgeText,
    setCustomBadgeText,
    customBadgeColor,
    setCustomBadgeColor,
    customTitle,
    setCustomTitle,
    customSubtitle,
    setCustomSubtitle
}: FlyerCustomizerDrawerProps) {
    if (!show) return null;

    return (
        <div className="bg-gradient-to-r from-[#FCFAF7] to-white rounded-3xl p-6 border border-[#E9DFD3] shadow-md space-y-4 animate-fade-in print:hidden">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#E12B7B]" />
                    Personnalisation Poussée du Contenu de l’Affiche
                </h3>
                <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-800">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title Override */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Titre d’Accroche Vitrine (Optionnel)
                    </label>
                    <input
                        type="text"
                        placeholder={property?.title || 'Titre du bien'}
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    />
                </div>

                {/* Subtitle Override */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Sous-Titre / Localisation (Optionnel)
                    </label>
                    <input
                        type="text"
                        placeholder={`${property?.city} (${property?.postal_code}) • ${property?.property_type.toUpperCase()}`}
                        value={customSubtitle}
                        onChange={(e) => setCustomSubtitle(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    />
                </div>

                {/* Badge Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Type de Badge Vitrine
                    </label>
                    <select
                        value={badgePreset}
                        onChange={(e) => setBadgePreset(e.target.value as BadgePreset)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    >
                        <option value="auto">Automatique selon Mandat</option>
                        <option value="exclusif">★ EXCLUSIVITÉ NELL’IMMO</option>
                        <option value="coup_de_coeur">❤️ COUP DE CŒUR</option>
                        <option value="baisse_prix">📉 BAISSE DE PRIX</option>
                        <option value="sous_compromis">🔒 SOUS COMPROMIS</option>
                        <option value="offre_en_cours">📝 OFFRE EN COURS</option>
                        <option value="vendu">🎉 VENDU PAR NELL’IMMO</option>
                        <option value="dpe_a">🌱 DPE A • ÉCO-PERFORMANT</option>
                        <option value="custom">Badge Texte Libre Personnalisé</option>
                    </select>
                </div>
            </div>

            {badgePreset === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-xs font-bold uppercase text-[#E12B7B] mb-1">
                            Texte Libre du Badge
                        </label>
                        <input
                            type="text"
                            value={customBadgeText}
                            onChange={(e) => setCustomBadgeText(e.target.value)}
                            placeholder="Ex: VUE SAINTE-VICTOIRE, TERRAIN PISCINABLE..."
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-[#E12B7B] mb-1">
                            Couleur du Badge
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={customBadgeColor}
                                onChange={(e) => setCustomBadgeColor(e.target.value)}
                                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={customBadgeColor}
                                onChange={(e) => setCustomBadgeColor(e.target.value)}
                                className="w-28 p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold"
                            />
                            <span className="text-xs text-gray-500">Aperçu :</span>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-black text-white"
                                style={{ backgroundColor: customBadgeColor }}
                            >
                                {customBadgeText || 'VOTRE BADGE'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
