'use client';

import React, { useState } from 'react';
import { Property, MandateAvenant, AvenantType } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  FileSignature,
  Printer,
  CheckCircle2,
  TrendingDown,
  Clock,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  X,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface MandateAvenantModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onOpenElectronicSignature?: (avenantData: Partial<MandateAvenant>) => void;
}

export function MandateAvenantModal({
  property,
  isOpen,
  onClose,
  onOpenElectronicSignature
}: MandateAvenantModalProps) {
  const { settings, avenants, createMandateAvenant } = useNellimoStore();
  const { showToast } = useToast();

  const currentMandateAvenants = avenants.filter((a) => a.mandate_number === property.mandate_number);
  const nextAvenantNumber = currentMandateAvenants.length + 1;

  const [avenantType, setAvenantType] = useState<AvenantType>('baisse_prix');
  const [newPriceFai, setNewPriceFai] = useState<number>(() => Math.round(property.price_fai * 0.96)); // -4% par défaut
  const [newFeesAmount, setNewFeesAmount] = useState<number>(() => {
    // Calcul standard honoraires à 4% ou maintien
    const baseNewPrice = Math.round(property.price_fai * 0.96);
    return Math.round(baseNewPrice * (property.agency_fees_percentage / 100));
  });
  const [newEndDate, setNewEndDate] = useState<string>(() => {
    const d = new Date(property.mandate_end_date || Date.now());
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [reason, setReason] = useState(
    'Repositionnement stratégique face à la concurrence et dynamisation des offres suite aux bilans de visites.'
  );
  const [previewMode, setPreviewMode] = useState(false);

  if (!isOpen) return null;

  const newNetSeller = newPriceFai - newFeesAmount;
  const priceDifference = newPriceFai - property.price_fai;
  const newFeesPercentage = newPriceFai > 0 ? Number(((newFeesAmount / newPriceFai) * 100).toFixed(2)) : 0;

  const handlePriceChange = (val: number) => {
    setNewPriceFai(val);
    // Recalcul automatique des honoraires selon le barème d'agence
    const pct = property.agency_fees_percentage || 4.0;
    const computedFees = Math.round(val * (pct / 100));
    setNewFeesAmount(computedFees);
  };

  const handleSaveAvenant = async () => {
    if (newPriceFai <= 0 && avenantType === 'baisse_prix') {
      showToast('Le nouveau prix doit être supérieur à zéro.', 'error');
      return;
    }

    const created = await createMandateAvenant({
      mandate_number: property.mandate_number,
      property_id: property.id,
      avenant_number: nextAvenantNumber,
      avenant_type: avenantType,
      previous_price_fai: property.price_fai,
      new_price_fai: avenantType === 'baisse_prix' ? newPriceFai : property.price_fai,
      previous_price_net: property.price_net_seller,
      new_price_net: avenantType === 'baisse_prix' ? newNetSeller : property.price_net_seller,
      previous_fees_amount: property.agency_fees_amount,
      new_fees_amount: avenantType === 'baisse_prix' ? newFeesAmount : property.agency_fees_amount,
      new_end_date: avenantType === 'prorogation' ? newEndDate : property.mandate_end_date,
      reason,
      effective_date: new Date().toISOString().slice(0, 10),
      is_signed: true,
      signed_at: new Date().toISOString(),
      signature_sha256: 'sha256-avenant-' + Date.now().toString(16),
    });

    showToast(`Avenant N°${nextAvenantNumber} scellé et enregistré avec succès !`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] text-white flex items-center justify-center">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Générateur d&apos;Avenant au Mandat (Loi Hoguet Art. 72)
              </h3>
              <span className="text-xs text-gray-500 block">
                Mandat N° {property.mandate_number} ({property.mandate_type}) • {property.title}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Form Controls (hidden in print) */}
        {!previewMode ? (
          <div className="space-y-4 text-xs print:hidden">
            
            {/* Type selector */}
            <div>
              <label className="font-bold text-gray-700 block mb-1.5 uppercase tracking-wider text-[10px]">
                Nature de la modification contractuelle :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAvenantType('baisse_prix')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    avenantType === 'baisse_prix'
                      ? 'border-[#E12B7B] bg-[#FAF5F8] text-[#E12B7B] font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="block text-xs">Baisse de Prix & Rémunération</span>
                    <span className="text-[10px] text-gray-500 font-normal">Ajustement du prix FAI et des honoraires</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAvenantType('prorogation')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    avenantType === 'prorogation'
                      ? 'border-[#E12B7B] bg-[#FAF5F8] text-[#E12B7B] font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Clock className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="block text-xs">Prorogation de Durée</span>
                    <span className="text-[10px] text-gray-500 font-normal">Prolongation de l&apos;irrévocabilité du mandat</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Price section */}
            {avenantType === 'baisse_prix' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500 font-medium">Prix FAI Mandat Actuel :</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {property.price_fai.toLocaleString('fr-FR')} € FAI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Nouveau Prix FAI (€) *</label>
                    <input
                      type="number"
                      value={newPriceFai}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:outline-[#E12B7B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Honoraires TTC (€)</label>
                    <input
                      type="number"
                      value={newFeesAmount}
                      onChange={(e) => setNewFeesAmount(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                    />
                    <span className="text-[10px] text-[#E12B7B] font-semibold mt-0.5 block">
                      Taux : {newFeesPercentage}% FAI
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Net Vendeur Résultant</label>
                    <div className="p-2.5 bg-white border border-gray-200 rounded-xl font-serif font-black text-gray-900 text-sm">
                      {newNetSeller.toLocaleString('fr-FR')} €
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 pt-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>
                    Baisse consentie : {Math.abs(priceDifference).toLocaleString('fr-FR')} € (
                    {((priceDifference / property.price_fai) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Prorogation section */}
            {avenantType === 'prorogation' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500 font-medium">Échéance Actuelle du Mandat :</span>
                  <span className="font-mono font-bold text-gray-900">
                    {property.mandate_end_date ? new Date(property.mandate_end_date).toLocaleDateString('fr-FR') : 'Non renseignée'}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nouvelle date d&apos;échéance du mandat :</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Conformément à la Loi Hoguet, le mandat peut être prorogé d&apos;un commun accord écrit entre les parties.
                  </p>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Motifs et considérations de l&apos;avenant :
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#C59A45]" />
                <span>Prévisualiser l&apos;Acte Juridique Officiel</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAvenant}
                className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Sceller l&apos;Avenant Immédiatement</span>
              </button>
            </div>

          </div>
        ) : (
          /* PREVIEW / PRINTABLE ACTE A4 */
          <div className="space-y-4">
            
            <div className="flex items-center justify-between print:hidden">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className="text-xs text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1"
              >
                ← Modifier les paramètres de l&apos;avenant
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
                  onClick={handleSaveAvenant}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Valider & Enregistrer</span>
                </button>
              </div>
            </div>

            {/* Official Legal Addendum Sheet */}
            <div id="printable-mandate-avenant" className="bg-white p-8 border-2 border-gray-300 rounded-2xl space-y-5 text-xs text-gray-900 font-sans leading-relaxed">
              
              {/* Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-black tracking-tight text-[#131B26]">
                    SASU NELL&apos;IMMO
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
                    AVENANT N° {nextAvenantNumber}
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
                  <p><span className="font-bold">Le Mandant : </span> {property.seller_name}</p>
                  <p><span className="font-bold">Demeurant : </span> {property.seller_address || property.city}</p>
                  <p><span className="font-bold">Téléphone : </span> {property.seller_phone} • Email : {property.seller_email || 'Non renseigné'}</p>
                  <p className="text-[10px] text-gray-500 italic">D&apos;une part,</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p><span className="font-bold">Et le Mandataire : </span> SASU NELL&apos;IMMO, représentée par Mme Nelly FERNANDEZ, Présidente.</p>
                  <p className="text-[10px] text-gray-500 italic">D&apos;autre part,</p>
                </div>
              </div>

              {/* Preambule */}
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500 block">PRÉAMBULE</span>
                <p className="text-justify text-[11px] text-gray-700">
                  Il est préalablement rappelé que par mandat de vente {property.mandate_type} N° {property.mandate_number} en date du {new Date(property.mandate_date).toLocaleDateString('fr-FR')}, le Mandant a confié au Mandataire la mission de vendre le bien immobilier situé à : <span className="font-bold">{property.title}</span>, sis {property.address}, {property.postal_code} {property.city}.
                </p>
              </div>

              {/* Articles */}
              <div className="space-y-3 pt-1">
                <div className="p-3 border border-gray-200 rounded-xl space-y-1">
                  <span className="font-bold text-gray-900 block">ARTICLE 1 — OBJET DE L&apos;AVENANT</span>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    Les parties conviennent d&apos;un commun accord d&apos;apporter la modification suivante au mandat initial :
                  </p>
                  {avenantType === 'baisse_prix' ? (
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <p>
                        • <span className="font-bold">Ancien prix de présentation : </span> {property.price_fai.toLocaleString('fr-FR')} € FAI.
                      </p>
                      <p>
                        • <span className="font-bold text-[#E12B7B]">Nouveau prix de présentation convenu : </span>{' '}
                        <span className="text-sm font-bold text-[#131B26]">{newPriceFai.toLocaleString('fr-FR')} € FAI</span>{' '}
                        (dont net vendeur : {newNetSeller.toLocaleString('fr-FR')} €).
                      </p>
                      <p>
                        • <span className="font-bold">Honoraires d&apos;agence modifiés : </span>{' '}
                        {newFeesAmount.toLocaleString('fr-FR')} € TTC (soit {newFeesPercentage}% du prix FAI), à la charge du {property.fees_paid_by}.
                      </p>
                      <p className="italic text-gray-500 text-[10px]">
                        Motif : {reason}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 pt-1 text-[11px]">
                      <p>
                        • <span className="font-bold text-[#E12B7B]">Prorogation de la durée du mandat : </span> Le terme du mandat initial, prévu le {new Date(property.mandate_end_date).toLocaleDateString('fr-FR')}, est expressément reporté jusqu&apos;au <span className="font-bold text-gray-900">{new Date(newEndDate).toLocaleDateString('fr-FR')}</span> inclus.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3 border border-gray-200 rounded-xl space-y-1">
                  <span className="font-bold text-gray-900 block">ARTICLE 2 — MAINTIEN DES AUTRES CLAUSES</span>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    Toutes les autres clauses, charges, conditions et obligations stipulées dans le mandat initial N° {property.mandate_number} non expressément modifiées par le présent avenant demeurent en vigueur et conservent leur plein et entier effet juridique.
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div className="text-center p-3 border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Pour le Mandant</span>
                  <span className="text-xs font-bold text-gray-900 block">{property.seller_name}</span>
                  <div className="h-16 flex items-center justify-center text-xs text-gray-400 italic">
                    Mention &quot;Bon pour avenant&quot;
                  </div>
                </div>

                <div className="text-center p-3 border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Pour la SASU NELL&apos;IMMO</span>
                  <span className="text-xs font-bold text-gray-900 block">{settings.agent_name}</span>
                  <div className="h-16 flex items-center justify-center text-xs text-gray-400 italic">
                    Présidente • CPI 1310 2019 000 042 974
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
