'use client';

import { Printer, Check } from 'lucide-react';
import type { Property, AvenantType } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { formatEuro, formatDateFr } from './avenant-types';

interface AvenantPreviewActeProps {
    property: Property;
    avenantType: AvenantType;
    newPriceFai: number;
    newFeesAmount: number;
    newNetSeller: number;
    newFeesPercentage: number;
    newEndDate: string;
    reason: string;
    avenantNumber: number;
    agentName: string;
    onBack: () => void;
    onSave: () => void;
}

export function AvenantPreviewActe({
    property,
    avenantType,
    newPriceFai,
    newFeesAmount,
    newNetSeller,
    newFeesPercentage,
    newEndDate,
    reason,
    avenantNumber,
    agentName,
    onBack,
    onSave,
}: AvenantPreviewActeProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between print:hidden">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-xs text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1"
                >
                    ← Modifier les paramètres de l{"\u2019"}avenant
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer A4</span>
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                        <Check className="w-4 h-4" />
                        <span>Valider & Enregistrer</span>
                    </button>
                </div>
            </div>

            {/* Official Legal Addendum Sheet */}
            <div
                id="printable-mandate-avenant"
                className="bg-white p-8 border-2 border-gray-300 rounded-2xl space-y-5 text-xs text-gray-900 font-sans leading-relaxed"
            >
                {/* Letterhead */}
                <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
                    <div>
                        <h2 className="text-lg font-serif font-black tracking-tight text-[#131B26]">
                            SASU NELL{"\u2019"}IMMO
                        </h2>
                        <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">
                            Agence Immobilière Transactionnelle • Pélissanne & Pays Salonais
                        </span>
                        <span className="text-[9px] text-gray-500 block">
                            Siège social : 26 avenue des Enjouvènes, 13330 Pélissanne • RCS Salon-de-Provence B 853 807 006
                        </span>
                        <span className="text-[9px] text-gray-500 block">
                            Carte Pro Transaction CPI 1310 2019 000 042 974 (CCI Marseille) • Garantie GALIAN 120 000 €
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 block">
                            AVENANT N° {avenantNumber}
                        </span>
                        <span className="text-[10px] text-gray-500 block mt-1">
                            Mandat Réf. : {formatMandateRef(property.mandate_number)}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-serif font-bold text-sm text-[#131B26] uppercase tracking-wider">
                        AVENANT DE MODIFICATION AU MANDAT DE VENTE {property.mandate_type.toUpperCase()}
                    </h3>
                    <span className="text-[10px] text-gray-500">
                        Établi en application du Décret n° 72-678 du 20 juillet 1972 (Loi Hoguet, Article 72)
                    </span>
                </div>

                {/* Parties */}
                <div className="space-y-2">
                    <p>
                        <span className="font-bold">ENTRE LES SOUSSIGNÉS :</span>
                    </p>
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                        <p>
                            <span className="font-bold">Le Mandant : </span> {property.seller_name}
                        </p>
                        <p>
                            <span className="font-bold">Demeurant : </span> {property.seller_address || property.city}
                        </p>
                        <p>
                            <span className="font-bold">Téléphone : </span> {property.seller_phone} • Email :{' '}
                            {property.seller_email || 'Non renseigné'}
                        </p>
                        <p className="text-[10px] text-gray-500 italic">D{"\u2019"}une part,</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                        <p>
                            <span className="font-bold">Et le Mandataire : </span> SASU NELL{"\u2019"}IMMO, représentée par Mme
                            Nelly FERNANDEZ, Présidente.
                        </p>
                        <p className="text-[10px] text-gray-500 italic">D{"\u2019"}autre part,</p>
                    </div>
                </div>

                {/* Preambule */}
                <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500 block">PRÉAMBULE</span>
                    <p className="text-justify text-[11px] text-gray-700">
                        Il est préalablement rappelé que par mandat de vente {property.mandate_type} N° {property.mandate_number}{' '}
                        en date du {formatDateFr(property.mandate_date)}, le Mandant a confié au Mandataire la mission de vendre le
                        bien immobilier situé à : <span className="font-bold">{property.title}</span>, sis {property.address},{' '}
                        {property.postal_code} {property.city}.
                    </p>
                </div>

                {/* Articles */}
                <div className="space-y-3 pt-1">
                    <div className="p-3 border border-gray-200 rounded-xl space-y-1">
                        <span className="font-bold text-gray-900 block">ARTICLE 1 — OBJET DE L{"\u2019"}AVENANT</span>
                        <p className="text-[11px] text-gray-700 leading-relaxed">
                            Les parties conviennent d{"\u2019"}un commun accord d{"\u2019"}apporter la modification suivante au mandat
                            initial :
                        </p>
                        {avenantType === 'baisse_prix' ? (
                            <div className="space-y-1.5 pt-1 text-[11px]">
                                <p>
                                    • <span className="font-bold">Ancien prix de présentation : </span>{' '}
                                    {formatEuro(property.price_fai)} € FAI.
                                </p>
                                <p>
                                    • <span className="font-bold text-[#E12B7B]">Nouveau prix de présentation convenu : </span>{' '}
                                    <span className="text-sm font-bold text-[#131B26]">{formatEuro(newPriceFai)} € FAI</span> (dont net
                                    vendeur : {formatEuro(newNetSeller)} €).
                                </p>
                                <p>
                                    • <span className="font-bold">Honoraires d{"\u2019"}agence modifiés : </span>{' '}
                                    {formatEuro(newFeesAmount)} € TTC (soit {newFeesPercentage}% du prix FAI), à la charge du{' '}
                                    {property.fees_paid_by}.
                                </p>
                                <p className="italic text-gray-500 text-[10px]">Motif : {reason}</p>
                            </div>
                        ) : (
                            <div className="space-y-1 pt-1 text-[11px]">
                                <p>
                                    • <span className="font-bold text-[#E12B7B]">Prorogation de la durée du mandat : </span> Le terme du
                                    mandat initial, prévu le {formatDateFr(property.mandate_end_date)}, est expressément reporté
                                    jusqu{"\u2019"}au{' '}
                                    <span className="font-bold text-gray-900">{formatDateFr(newEndDate)}</span> inclus.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border border-gray-200 rounded-xl space-y-1">
                        <span className="font-bold text-gray-900 block">ARTICLE 2 — MAINTIEN DES AUTRES CLAUSES</span>
                        <p className="text-[10px] text-gray-600 leading-relaxed">
                            Toutes les autres clauses, charges, conditions et obligations stipulées dans le mandat initial N°{' '}
                            {property.mandate_number} non expressément modifiées par le présent avenant demeurent en vigueur et
                            conservent leur plein et entier effet juridique.
                        </p>
                    </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div className="text-center p-3 border border-gray-200 rounded-xl">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Pour le Mandant</span>
                        <span className="text-xs font-bold text-gray-900 block">{property.seller_name}</span>
                        <div className="h-16 flex items-center justify-center text-xs text-gray-400 italic">
                            Mention {'"'}Bon pour avenant{'"'}
                        </div>
                    </div>

                    <div className="text-center p-3 border border-gray-200 rounded-xl">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                            Pour la SASU NELL{"\u2019"}IMMO
                        </span>
                        <span className="text-xs font-bold text-gray-900 block">{agentName}</span>
                        <div className="h-16 flex items-center justify-center text-xs text-gray-400 italic">
                            Présidente • CPI 1310 2019 000 042 974
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
