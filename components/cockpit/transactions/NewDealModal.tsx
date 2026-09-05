'use client';
import React, { useEffect } from 'react';
import type { Property } from '@/lib/types';
import { Portal } from '@/components/ui/Portal';

interface NewDealModalProps {
    properties: Property[];
    onCreate: (data: {
        property_id: string;
        offer_price_fai: number;
        agency_fees_amount: number;
        buyer_name: string;
        buyer_phone: string;
        seller_notary_name: string;
    }) => void;
    onClose: () => void;
}

export function NewDealModal({ properties, onCreate, onClose }: NewDealModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <Portal>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-[9999] animate-fade-in overflow-hidden"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div
                    className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-serif font-bold text-[#131B26]">
                        Créer un Nouveau Dossier de Vente
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const propId = (form.elements.namedItem('property_id') as HTMLSelectElement).value;
                        const offerPrice = Number((form.elements.namedItem('offer_price_fai') as HTMLInputElement).value);
                        const feesAmount = Number((form.elements.namedItem('agency_fees_amount') as HTMLInputElement).value);
                        const buyerName = (form.elements.namedItem('buyer_name') as HTMLInputElement).value;
                        const buyerPhone = (form.elements.namedItem('buyer_phone') as HTMLInputElement).value;
                        const notaryName = (form.elements.namedItem('seller_notary_name') as HTMLInputElement).value;

                        onCreate({
                            property_id: propId,
                            offer_price_fai: offerPrice,
                            agency_fees_amount: feesAmount,
                            buyer_name: buyerName,
                            buyer_phone: buyerPhone,
                            seller_notary_name: notaryName
                        });
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                            Bien en Vente Associé
                        </label>
                        <select
                            name="property_id"
                            required
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                        >
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>
                                    Réf. {p.mandate_number} — {p.title} ({p.price_fai.toLocaleString('fr-FR')} €)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Prix de l&rsquo;Offre Acceptée FAI (€)
                            </label>
                            <input
                                type="number"
                                name="offer_price_fai"
                                defaultValue={450000}
                                required
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Honoraires d&rsquo;Agence TTC (€)
                            </label>
                            <input
                                type="number"
                                name="agency_fees_amount"
                                defaultValue={18000}
                                required
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#E12B7B]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Nom de l&rsquo;Acquéreur
                            </label>
                            <input
                                type="text"
                                name="buyer_name"
                                placeholder="M. et Mme Dupont"
                                required
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Téléphone Acquéreur
                            </label>
                            <input
                                type="text"
                                name="buyer_phone"
                                placeholder="06 12 34 56 78"
                                required
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                            Nom du Notaire Instrumentaire
                        </label>
                        <input
                            type="text"
                            name="seller_notary_name"
                            placeholder="Me Bertrand VIDAL (Pélissanne)"
                            required
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                        >
                            Créer le Dossier
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </Portal>
    );
}
