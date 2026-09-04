'use client';

import { useState } from 'react';
import { Printer, Mail } from 'lucide-react';
import type { Property, TransactionDeal, AgencySettings } from '@/lib/types';

interface InvoicePrintModalProps {
    deal: TransactionDeal;
    properties: Property[];
    settings: AgencySettings;
    documentType: 'facture' | 'sequestre';
    onSetDocumentType: (t: 'facture' | 'sequestre') => void;
    onClose: () => void;
    /** Appelé après l'ouverture du mailto de la facture au notaire (marque la facture comme envoyée). */
    onInvoiceSent?: (dealId: string) => void;
}

export function InvoicePrintModal({
    deal,
    properties,
    settings,
    documentType,
    onSetDocumentType,
    onClose,
    onInvoiceSent
}: InvoicePrintModalProps) {
    const prop = properties.find(p => p.id === deal.property_id);
    const [emailNotice, setEmailNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

    // B1 — Envoi email de la facture au notaire (couture mailto, sans backend).
    // Ouvre le client mail pré-formaté vers l'étude notariale avec le RIB en corps
    // de message, afin que le notaire dispose des coordonnées bancaires pour le
    // virement des honoraires lors de la réitération par acte authentique.
    const handleEmailToNotary = () => {
        const notaryEmail = deal.seller_notary_email || deal.buyer_notary_email;
        if (!notaryEmail) {
            setEmailNotice({
                type: 'error',
                message: 'Aucune adresse email notariale renseignée pour cette transaction. Veuillez renseigner le notaire dans la fiche transaction.',
            });
            return;
        }
        const feesTTC = deal.agency_fees_amount || 0;
        const invoiceNo = deal.invoice_number || 'FACT-2026-004';
        const subject = `Facture d'honoraires ${invoiceNo} — ${prop?.title || ''} (${prop?.city || ''})`;
        const body = [
            `Bonjour Maître,`,
            ``,
            `Veuillez trouver ci-dessous les coordonnées bancaires de la SASU Nell'Immo pour le règlement de nos honoraires de transaction, à prévoir lors de la réitération par acte authentique.`,
            ``,
            `— FACTURE N° ${invoiceNo} —`,
            `Bien : ${prop?.title || ''} (${prop?.city || ''})`,
            `Vendeur(s) : ${deal.seller_name}`,
            `Acquéreur(s) : ${deal.buyer_name}`,
            `Montant TTC : ${feesTTC.toLocaleString('fr-FR')} €`,
            ``,
            `— COORDONNÉES BANCAIRES (RIB) —`,
            `Titulaire : SASU NELL'IMMO`,
            `IBAN : ${settings.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}`,
            `BIC : ${settings.agency_rib_bic || 'BNPAFRPP'}`,
            ``,
            `Merci de votre retour.`,
            `Bien cordialement,`,
            `${settings.agent_name || 'Nelly Fernandez'} — ${settings.agency_name || "SASU NELL'IMMO"}`,
        ].join('\n');
        window.location.href = `mailto:${notaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setEmailNotice({
            type: 'success',
            message: `Client email ouvert vers ${notaryEmail}. Pensez à enregistrer le PDF pour le joindre à votre message.`,
        });
        onInvoiceSent?.(deal.id);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-8 space-y-6 shadow-2xl border border-gray-200 print:p-0 print:border-none">
                {/* Notice message */}
                {emailNotice && (
                    <div
                        className={`p-3.5 rounded-2xl text-xs flex items-center justify-between border print:hidden ${
                            emailNotice.type === 'error'
                                ? 'bg-amber-50 border-amber-200 text-amber-900'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                    >
                        <span>{emailNotice.message}</span>
                        <button
                            onClick={() => setEmailNotice(null)}
                            className="text-xs font-black ml-2 px-1.5 py-0.5 rounded hover:bg-black/5 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}
                {/* Top Bar print/close with Document Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 print:hidden">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onSetDocumentType('facture')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${documentType === 'facture'
                                ? 'bg-[#E12B7B] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Facture d&rsquo;Honoraires (Acte)
                        </button>
                        <button
                            onClick={() => onSetDocumentType('sequestre')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${documentType === 'sequestre'
                                ? 'bg-[#131B26] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Appel de Fonds Séquestre Notaire
                        </button>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            onClick={handleEmailToNotary}
                            className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Mail className="w-4 h-4" />
                            Envoyer au Notaire (Email)
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Printer className="w-4 h-4" />
                            Imprimer Format A4 Officiel
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Official Document Body */}
                <div className="border border-gray-300 p-8 rounded-2xl bg-white space-y-6 text-gray-900 font-sans print:border-none print:p-0">
                    {/* Agency Header */}
                    <div className="flex justify-between items-start border-b-2 border-[#131B26] pb-4">
                        <div>
                            <h1 className="text-xl font-serif font-black tracking-tight text-[#131B26]">
                                {settings.agency_name || "SASU NELL'IMMO"}
                            </h1>
                            <p className="text-xs text-gray-600 mt-1">{settings.address || '26 avenue des Enjouvènes'}</p>
                            <p className="text-xs text-gray-600">{settings.postal_code} {settings.city}</p>
                            <p className="text-xs text-gray-600">Tél : {settings.phone} | {settings.email}</p>
                            <p className="text-[10px] text-gray-500 mt-2">
                                SIREN : {settings.siren || '853 807 006'} RCS {settings.rcs_city || 'Salon-de-Provence'} — Capital : {settings.capital_social || '2 000 €'}
                            </p>
                            <p className="text-[10px] text-gray-500">
                                Carte Professionnelle CPI : {settings.card_t_number} ({settings.cci_card_t || 'CCI Marseille Provence'})
                            </p>
                            <p className="text-[10px] text-gray-500">
                                Garantie Financière : {settings.guarantee_fund_name || 'GALIAN Assurances (120 000 €)'} — Sans maniement de fonds
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-right max-w-xs">
                                <span className="text-[10px] font-bold uppercase text-gray-500 block">Étude Notariale Instrumentaire</span>
                                <p className="text-xs font-bold text-gray-900 mt-0.5">{deal.seller_notary_name}</p>
                                <p className="text-xs text-gray-700">{deal.seller_notary_office}</p>
                                <p className="text-[11px] text-gray-500">{deal.seller_notary_email}</p>
                            </div>
                        </div>
                    </div>

                    {/* MODE 1: FACTURE D'HONORAIRES */}
                    {documentType === 'facture' && (
                        <>
                            {/* Invoice Meta */}
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Type d&rsquo;acte</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        FACTURE D&rsquo;HONORAIRES N° {deal.invoice_number || 'FACT-2026-004'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Date d&rsquo;Émission</span>
                                    <span className="text-xs font-bold text-gray-900">
                                        {deal.invoice_date || new Date().toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>

                            {/* Transaction Target Description */}
                            <div className="space-y-1.5 text-xs bg-[#FAF5F8]/40 p-4 rounded-xl border border-[#F3E8EE]">
                                <span className="text-[11px] font-bold uppercase text-[#E12B7B] block">Objet de la Transaction</span>
                                <p className="font-bold text-gray-900 text-sm">
                                    {prop?.title}
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-gray-700 mt-2">
                                    <p><span className="font-semibold">Mandat N° :</span> {prop?.mandate_number} (Loi Hoguet)</p>
                                    <p><span className="font-semibold">Date de compromis :</span> {deal.compromis_date || 'En cours'}</p>
                                    <p><span className="font-semibold">Vendeur(s) :</span> {deal.seller_name}</p>
                                    <p><span className="font-semibold">Acquéreur(s) :</span> {deal.buyer_name}</p>
                                </div>
                            </div>

                            {/* Line Items Table with VAT 20% Breakdown */}
                            {(() => {
                                const feesTTC = deal.agency_fees_amount || 0;
                                const feesHT = Math.round(feesTTC / 1.20);
                                const tva20 = feesTTC - feesHT;

                                return (
                                    <div className="space-y-3">
                                        <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
                                            <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                                                <tr>
                                                    <th className="p-3 text-left">Désignation des Prestations</th>
                                                    <th className="p-3 text-right">Base HT</th>
                                                    <th className="p-3 text-right">Taux TVA</th>
                                                    <th className="p-3 text-right">Montant TVA</th>
                                                    <th className="p-3 text-right">Total TTC</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <tr>
                                                    <td className="p-3">
                                                        <span className="font-bold text-gray-900 block">Honoraires de négociation et transaction immobilière</span>
                                                        <span className="text-[11px] text-gray-500">
                                                            Conformément au mandat de vente et au barème d&rsquo;honoraires de l&rsquo;agence.
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right font-mono">{feesHT.toLocaleString('fr-FR')} €</td>
                                                    <td className="p-3 text-right font-mono">20,00 %</td>
                                                    <td className="p-3 text-right font-mono">{tva20.toLocaleString('fr-FR')} €</td>
                                                    <td className="p-3 text-right font-black text-[#E12B7B] text-sm">{feesTTC.toLocaleString('fr-FR')} €</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Total & Bank Details */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1.5 flex-1">
                                                <span className="font-bold text-gray-800 block text-[11px]">Coordonnées Bancaires pour Virement Notarié :</span>
                                                <p className="font-mono text-[11px] text-gray-800">Titulaire : SASU NELL&rsquo;IMMO</p>
                                                <p className="font-mono text-[11px] text-gray-800">IBAN : {settings.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}</p>
                                                <p className="font-mono text-[11px] text-gray-800">BIC : {settings.agency_rib_bic || 'BNPAFRPP'}</p>
                                                <p className="text-[10px] text-gray-500 italic mt-1">
                                                    Conformément à l&rsquo;article 6 de la Loi Hoguet (loi n° 70-9 du 2 janvier 1970), aucun versement ne peut être exigé avant la réitération effective par acte authentique de vente.
                                                </p>
                                            </div>

                                            <div className="text-right p-4 bg-[#FAF5F8] border border-[#F3E8EE] rounded-xl shrink-0 min-w-[220px] space-y-1">
                                                <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Net à Verser</span>
                                                <span className="text-2xl font-serif font-black text-[#E12B7B] block">
                                                    {feesTTC.toLocaleString('fr-FR')} €
                                                </span>
                                                <span className="text-[10px] text-gray-600 block">Dont TVA 20% : {tva20.toLocaleString('fr-FR')} €</span>
                                                {deal.fees_received && (
                                                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] uppercase">
                                                        ✓ Honoraires Acquittés
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </>
                    )}

                    {/* MODE 2: APPEL DE FONDS SÉQUESTRE NOTAIRE */}
                    {documentType === 'sequestre' && (
                        <>
                            <div className="flex justify-between items-center bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Fiche de Liaison Notariale</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        APPEL DE FONDS SÉQUESTRE & DÉPÔT DE GARANTIE
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Date de la Demande</span>
                                    <span className="text-xs font-bold text-gray-900">
                                        {new Date().toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs leading-relaxed">
                                <p>
                                    Maître, faisant suite à la signature de l&rsquo;avant-contrat de vente sous seing privé portant sur le bien situé à <strong>{prop?.city}</strong>, nous vous prions de bien vouloir appeler auprès de l&rsquo;acquéreur le versement du dépôt de garantie (séquestre) ci-après désigné :
                                </p>

                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                                    <div className="flex justify-between border-b border-gray-200 pb-1.5">
                                        <span className="text-gray-600">Acquéreur Débiteur :</span>
                                        <span className="font-bold text-gray-900">{deal.buyer_name} ({deal.buyer_phone})</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-1.5">
                                        <span className="text-gray-600">Vendeur Bénéficiaire :</span>
                                        <span className="font-bold text-gray-900">{deal.seller_name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-1.5">
                                        <span className="text-gray-600">Prix de Vente Convenu :</span>
                                        <span className="font-bold text-gray-900">{deal.offer_price_net?.toLocaleString('fr-FR')} € Net Vendeur</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-gray-800 font-bold">Montant du Dépôt de Garantie à Consigner :</span>
                                        <span className="text-base font-black text-blue-900 font-mono">
                                            {deal.deposit_amount?.toLocaleString('fr-FR') || '15 000'} € ({deal.deposit_percentage || 5}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                                    <strong className="block font-bold">Mention Déontologique & Loi Hoguet (Art. 55) :</strong>
                                    <p>
                                        La SASU Nell&rsquo;Immo ne détenant pas de compte séquestre pour maniement direct de fonds, le dépôt de garantie ci-dessus doit être versé exclusivement par virement bancaire sur le compte de l&rsquo;étude notariale instrumentaire ou de la Caisse des Dépôts et Consignations (CDC).
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Signature Block */}
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                        <div className="text-[10px] text-gray-500 max-w-sm">
                            <p>Membre d&rsquo;une association agréée par l&rsquo;administration fiscale acceptant le règlement des honoraires par virement bancaire.</p>
                        </div>

                        <div className="text-center">
                            <span className="text-xs font-bold text-gray-900 block">{settings.agent_name || 'Nelly Fernandez'}</span>
                            <span className="text-[10px] text-gray-500 block">Présidente SASU Nell&rsquo;Immo</span>
                            <div className="h-8 flex items-center justify-center italic text-gray-400 text-xs mt-1">
                                Pour valoir ce que de droit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
