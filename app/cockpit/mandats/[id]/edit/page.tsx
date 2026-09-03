'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { calculateFinancials, getDpeLetterFromValue, getGesLetterFromValue, formatMandateRef } from '@/lib/hoguet';
import { Property, MandateType, FeesPaidBy, PropertyStatus, PropertyImage } from '@/lib/types';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface EditFormProps {
  property: Property;
  onSave: (updates: Partial<Property>) => Promise<void>;
}

function EditForm({ property, onSave }: EditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(property.title);
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [mandateType, setMandateType] = useState<MandateType>(property.mandate_type);
  const [priceNetSeller, setPriceNetSeller] = useState<number>(property.price_net_seller);
  const [agencyFeesPercentage, setAgencyFeesPercentage] = useState<number>(property.agency_fees_percentage);
  const [agencyFeesAmount, setAgencyFeesAmount] = useState<number>(property.agency_fees_amount);
  const [feesPaidBy, setFeesPaidBy] = useState<FeesPaidBy>(property.fees_paid_by);
  const [livingArea, setLivingArea] = useState<number>(property.living_area);
  const [carrezArea, setCarrezArea] = useState<number>(property.carrez_area || property.living_area);
  const [landArea, setLandArea] = useState<number>(property.land_area || 0);
  const [roomsCount, setRoomsCount] = useState<number>(property.rooms_count);
  const [bedroomsCount, setBedroomsCount] = useState<number>(property.bedrooms_count);
  const [dpeValue, setDpeValue] = useState<number>(property.dpe_value || 0);
  const [gesValue, setGesValue] = useState<number>(property.ges_value || 0);
  const [description, setDescription] = useState(property.description);
  const [featuresInput, setFeaturesInput] = useState(property.features.join(', '));
  const [videoUrl, setVideoUrl] = useState(property.video_url || '');
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtual_tour_url || '');
  const [images] = useState<PropertyImage[]>(property.images || []);

  const financials = calculateFinancials({
    priceNetSeller,
    agencyFeesPercentage,
    agencyFeesAmount,
    feesPaidBy
  });

  const handlePriceNetChange = (val: number) => {
    setPriceNetSeller(val);
    const amount = Math.round((val * agencyFeesPercentage) / 100);
    setAgencyFeesAmount(amount);
  };

  const handleFeesPercentChange = (val: number) => {
    setAgencyFeesPercentage(val);
    const amount = Math.round((priceNetSeller * val) / 100);
    setAgencyFeesAmount(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const featuresList = featuresInput
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    try {
      await onSave({
        title,
        status,
        mandate_type: mandateType,
        price_fai: financials.priceFai,
        price_net_seller: priceNetSeller,
        agency_fees_amount: financials.agencyFeesAmount,
        agency_fees_percentage: financials.agencyFeesPercentage,
        fees_paid_by: feesPaidBy,
        living_area: livingArea,
        carrez_area: carrezArea,
        land_area: landArea,
        rooms_count: roomsCount,
        bedrooms_count: bedroomsCount,
        dpe_value: dpeValue,
        dpe_letter: getDpeLetterFromValue(dpeValue),
        ges_value: gesValue,
        ges_letter: getGesLetterFromValue(gesValue),
        description,
        features: featuresList,
        video_url: videoUrl || undefined,
        virtual_tour_url: virtualTourUrl || undefined,
        images
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Title & Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#131B26]">Général & Statut</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type de mandat</label>
            <select
              value={mandateType}
              onChange={(e) => setMandateType(e.target.value as MandateType)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E12B7B] focus:outline-[#E12B7B]"
            >
              <option value="exclusif">Mandat Exclusif</option>
              <option value="simple">Mandat Simple</option>
              <option value="semi-exclusif">Mandat Semi-Exclusif</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-[#E12B7B]"
            >
              <option value="actif">Actif en vente</option>
              <option value="sous_compromis">Sous compromis</option>
              <option value="vendu">Vendu</option>
              <option value="archive">Archivé</option>
              <option value="resilie">Résilié</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#131B26]">Prix & Honoraires Loi ALUR</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Prix Net Vendeur (€)</label>
            <input
              type="number"
              required
              value={priceNetSeller}
              onChange={(e) => handlePriceNetChange(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Honoraires (%)</label>
            <input
              type="number"
              step="0.05"
              required
              value={agencyFeesPercentage}
              onChange={(e) => handleFeesPercentChange(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Charge</label>
            <select
              value={feesPaidBy}
              onChange={(e) => setFeesPaidBy(e.target.value as FeesPaidBy)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            >
              <option value="acquereur">Charge Acquéreur</option>
              <option value="vendeur">Charge Vendeur</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] text-center">
          <span className="text-xs text-gray-500">Nouveau Prix FAI :</span>
          <div className="text-2xl font-black text-[#E12B7B]">
            {financials.priceFai.toLocaleString('fr-FR')} €
          </div>
        </div>
      </div>

      {/* Specs & Surfaces */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#131B26]">Surfaces & Diagnostics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Hab. (m²)</label>
            <input
              type="number"
              value={livingArea}
              onChange={(e) => setLivingArea(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Carrez (m²)</label>
            <input
              type="number"
              value={carrezArea}
              onChange={(e) => setCarrezArea(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Terrain (m²)</label>
            <input
              type="number"
              value={landArea}
              onChange={(e) => setLandArea(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Pièces</label>
            <input
              type="number"
              value={roomsCount}
              onChange={(e) => setRoomsCount(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Chambres</label>
            <input
              type="number"
              value={bedroomsCount}
              onChange={(e) => setBedroomsCount(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">DPE (kWh/m²/an)</label>
            <input
              type="number"
              value={dpeValue}
              onChange={(e) => setDpeValue(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">GES (kg CO₂/m²/an)</label>
            <input
              type="number"
              value={gesValue}
              onChange={(e) => setGesValue(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">Descriptif & Équipements</h3>
            <p className="text-xs text-gray-500">
              Texte complet de présentation du bien pour les portails, fiches vitrines et le site web.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-[#E12B7B] bg-[#FDF2F8] px-3 py-1 rounded-full">
            {description.split('\n').length} ligne(s) • {description.length} caractères
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
            Texte de l&apos;Annonce (Zone Étendue Haute Capacité)
          </label>
          <textarea
            rows={26}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Rédigez ou collez ici l'intégralité du descriptif du bien..."
            className="w-full min-h-[520px] p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-sans font-normal text-gray-800 focus:outline-[#E12B7B] leading-relaxed resize-y shadow-inner"
          />
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Équipements (séparés par des virgules)</label>
          <input
            type="text"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Ex: Piscine, Climatisation réversible, Vue dégagée, Garage double, Plain-pied..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Lien Vidéo HD (YouTube / Vimeo / MP4)
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B]"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Vidéo tournée et montée par vos soins pour immersion client.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Visite Virtuelle 360° (Matterport / Nodalview)
            </label>
            <input
              type="url"
              placeholder="https://my.matterport.com/show/?m=..."
              value={virtualTourUrl}
              onChange={(e) => setVirtualTourUrl(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B]"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Lien interactif 3D pièce par pièce.
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href={`/cockpit/mandats/${property.id}`}
          className="px-5 py-3 bg-gray-100 rounded-xl text-xs font-bold uppercase text-gray-700 hover:bg-gray-200"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les Modifications'}
        </button>
      </div>

    </form>
  );
}

export default function EditMandatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { properties, updateProperty } = useNellimoStore();
  const { showToast } = useToast();

  const property = properties.find((p) => p.id === resolvedParams.id);

  if (!property) {
    return <div className="p-8 text-center">Mandat introuvable.</div>;
  }

  const handleSave = async (updates: Partial<Property>) => {
    try {
      await updateProperty(property.id, updates);
      showToast('Mandat mis à jour avec succès', 'success');
      router.push(`/cockpit/mandats/${property.id}`);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la mise à jour du mandat', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#F3E8EE] pb-4">
        <Link
          href={`/cockpit/mandats/${property.id}`}
          className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-500 hover:text-[#E12B7B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au mandat {formatMandateRef(property.mandate_number)}
        </Link>
        <span className="text-xs font-mono font-bold text-[#E12B7B]">
          Modification avec scellement d&apos;audit SHA-256
        </span>
      </div>

      <EditForm property={property} onSave={handleSave} />
    </div>
  );
}
