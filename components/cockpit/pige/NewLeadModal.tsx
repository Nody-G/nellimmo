'use client';

import { useState, useMemo } from 'react';
import { X, Wand2, Sparkles } from 'lucide-react';
import { SOURCE_OPTIONS } from './pige-types';
import type { NewLeadFormState } from './pige-types';
import { parseListingText, computePigeDvfGap } from './pige-import';

interface NewLeadModalProps {
    isOpen: boolean;
    form: NewLeadFormState;
    onChange: (patch: Partial<NewLeadFormState>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]';

/** Modal to add a new private-seller listing to the pigeon radar (assisted entry). */
export function NewLeadModal({ isOpen, form, onChange, onSubmit, onClose }: NewLeadModalProps) {
    const [pastedText, setPastedText] = useState('');
    const [assistMessage, setAssistMessage] = useState<string | null>(null);

    const dvfGap = useMemo(() => {
        return computePigeDvfGap(form.price, form.surface, form.city);
    }, [form.price, form.surface, form.city]);

    if (!isOpen) return null;

    const handleAssistFill = () => {
        if (!pastedText.trim()) {
            setAssistMessage('Collez d\u2019abord le texte ou le lien de l\u2019annonce.');
            return;
        }
        const patch = parseListingText(pastedText);
        onChange(patch);
        setAssistMessage('Formulaire pré-rempli automatiquement — vérifiez puis complétez si besoin.');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#131B26]">
                        Ajouter une Annonce de Particulier (Pige)
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Assisted entry */}
                <div className="p-3.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl space-y-2">
                    <label className="block font-bold uppercase text-gray-700 text-[11px]">
                        Saisie assistée — coller l{"\u2019"}annonce (texte ou URL)
                    </label>
                    <textarea
                        rows={2}
                        placeholder={'Ex: "Villa 120m² à Pélissanne, 420 000 €, M. Bernard 06 12 34 56 78, https://www.leboncoin.fr/..."'}
                        value={pastedText}
                        onChange={(e) => {
                            setPastedText(e.target.value);
                            setAssistMessage(null);
                        }}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                    />
                    <div className="flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={handleAssistFill}
                            className="px-3 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                            <Wand2 className="w-3.5 h-3.5 text-[#C59A45]" />
                            Remplir automatiquement
                        </button>
                        {assistMessage && <span className="text-[10px] text-emerald-700">{assistMessage}</span>}
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-bold uppercase text-gray-700 mb-1">Titre de l{"\u2019"}Annonce</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Villa contemporaine 120m² Pélissanne"
                            value={form.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Nom du Vendeur</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: M. Bernard"
                                value={form.sellerName}
                                onChange={(e) => onChange({ sellerName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                            <input
                                type="tel"
                                required
                                placeholder="06..."
                                value={form.phone}
                                onChange={(e) => onChange({ phone: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Prix Vendeur (€)</label>
                            <input
                                type="number"
                                required
                                value={form.price}
                                onChange={(e) => onChange({ price: Number(e.target.value) })}
                                className={`${inputClass} font-bold`}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Surface (m²)</label>
                            <input
                                type="number"
                                required
                                value={form.surface}
                                onChange={(e) => onChange({ surface: Number(e.target.value) })}
                                className={`${inputClass} font-bold`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Commune</label>
                            <input
                                type="text"
                                required
                                value={form.city}
                                onChange={(e) => onChange({ city: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">
                                Quartier / Secteur Terrain
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Les Enjouvènes, Viougues..."
                                value={form.neighborhood || ''}
                                onChange={(e) => onChange({ neighborhood: e.target.value })}
                                className={inputClass}
                            />
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                {['Enjouvènes', 'Viougues', 'Costes', 'Centre', 'Colline'].map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => onChange({ neighborhood: q })}
                                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 hover:bg-[#E12B7B]/10 hover:text-[#E12B7B] text-gray-600 transition cursor-pointer"
                                    >
                                        +{q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Diagnostic DVF temps réel & Argumentaire immédiat */}
                    {dvfGap && (
                        <div
                            className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                                dvfGap.isOverpriced
                                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            }`}
                        >
                            <div className="flex items-center justify-between font-bold">
                                <span className="flex items-center gap-1.5 text-xs">
                                    <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
                                    <span>Prix demandé : {dvfGap.askingM2.toLocaleString('fr-FR')} €/m²</span>
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                        dvfGap.isOverpriced
                                            ? 'bg-amber-200 text-amber-900'
                                            : 'bg-emerald-200 text-emerald-900'
                                    }`}
                                >
                                    {dvfGap.gapPct > 0 ? `+${dvfGap.gapPct}%` : `${dvfGap.gapPct}%`} vs marché notarié
                                </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-gray-700">
                                {dvfGap.argumentPitch}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Source de l{"\u2019"}Annonce</label>
                            <select
                                value={form.source}
                                onChange={(e) => onChange({ source: e.target.value as NewLeadFormState['source'] })}
                                className={inputClass}
                            >
                                {SOURCE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Lien Web de l{"\u2019"}Annonce</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={form.url}
                                onChange={(e) => onChange({ url: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold uppercase text-gray-700 mb-1">Notes & Contexte</label>
                        <textarea
                            rows={2}
                            placeholder="Ex: Vente cause mutation, annonce en ligne depuis 3 semaines..."
                            value={form.notes}
                            onChange={(e) => onChange({ notes: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
                    >
                        Enregistrer dans le Radar de Pige
                    </button>
                </form>
            </div>
        </div>
    );
}
