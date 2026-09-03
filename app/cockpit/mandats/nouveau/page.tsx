'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { calculateFinancials, getDpeLetterFromValue, getGesLetterFromValue } from '@/lib/hoguet';
import { MandateType, PropertyType, SellerCivility, FeesPaidBy, PropertyImage } from '@/lib/types';
import { ArrowLeft, Wand2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MandateWizardStepper } from '@/components/cockpit/mandats/wizard/MandateWizardStepper';
import { StepSeller } from '@/components/cockpit/mandats/wizard/StepSeller';
import { StepLocation } from '@/components/cockpit/mandats/wizard/StepLocation';
import { StepFinancials } from '@/components/cockpit/mandats/wizard/StepFinancials';
import { StepFeatures } from '@/components/cockpit/mandats/wizard/StepFeatures';
import { StepDpe } from '@/components/cockpit/mandats/wizard/StepDpe';
import { StepMediaPublishing } from '@/components/cockpit/mandats/wizard/StepMediaPublishing';
import { FastFillModal } from '@/components/cockpit/mandats/wizard/FastFillModal';
import { useToast } from '@/components/ui/Toast';

export default function NewMandatePage() {
  const router = useRouter();
  const { createProperty, properties } = useNellimoStore();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fast-Fill & AI Helper
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Next Mandate Number calculation
  const nextMandateNumber =
    properties.length > 0
      ? Math.max(...properties.map((p) => p.mandate_number || 0)) + 1
      : 245;

  // Form State
  const [mandateType, setMandateType] = useState<MandateType>('exclusif');
  const [mandateDate, setMandateDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [mandateEndDate, setMandateEndDate] = useState(
    () => new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Seller
  const [sellerCivility, setSellerCivility] = useState<SellerCivility>('M_Mme');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');

  // Property
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('maison');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('13330');
  const [city, setCity] = useState('Pélissanne');
  const [displayExactAddress] = useState(false);

  // Specs
  const [livingArea, setLivingArea] = useState<number>(120);
  const [carrezArea, setCarrezArea] = useState<number>(120);
  const [landArea, setLandArea] = useState<number>(650);
  const [roomsCount, setRoomsCount] = useState<number>(5);
  const [bedroomsCount, setBedroomsCount] = useState<number>(3);
  const [bathroomsCount, setBathroomsCount] = useState<number>(2);
  const [featuresInput, setFeaturesInput] = useState(
    'Piscine, Climatisation réversible, Garage, Terrasse, Jardin arboré'
  );

  // Diagnostics
  const [dpeValue, setDpeValue] = useState<number>(95);
  const [gesValue, setGesValue] = useState<number>(3);
  const [energyCostMin, setEnergyCostMin] = useState<number>(850);
  const [energyCostMax, setEnergyCostMax] = useState<number>(1200);

  // Financials
  const [priceNetSeller, setPriceNetSeller] = useState<number>(450000);
  const [agencyFeesPercentage, setAgencyFeesPercentage] = useState<number>(4.0);
  const [agencyFeesAmount, setAgencyFeesAmount] = useState<number>(18000);
  const [feesPaidBy, setFeesPaidBy] = useState<FeesPaidBy>('vendeur');

  // Description
  const [description, setDescription] = useState(
    `Exclusivité Nell'Immo Immobilier. Superbe propriété idéalement située dans un secteur recherché de ${city}, offrant de superbes prestations et un cadre de vie privilégié. Pièce de vie lumineuse, cuisine équipée, terrasse et jardin. À visiter sans tarder avec l'agence Nell'Immo.`
  );

  // Channels
  const [publishWebsite, setPublishWebsite] = useState(true);
  const [publishSeloger, setPublishSeloger] = useState(true);
  const [publishLeboncoin, setPublishLeboncoin] = useState(true);
  const [publishBienici, setPublishBienici] = useState(true);

  // Media
  const [videoUrl, setVideoUrl] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [images, setImages] = useState<PropertyImage[]>([
    {
      id: 'img-1',
      property_id: '',
      image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      display_order: 1,
      is_cover: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'img-2',
      property_id: '',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      display_order: 2,
      is_cover: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'img-3',
      property_id: '',
      image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      display_order: 3,
      is_cover: false,
      created_at: new Date().toISOString()
    }
  ]);

  // Derived calculations
  const financials = calculateFinancials({
    priceNetSeller,
    agencyFeesAmount,
    agencyFeesPercentage,
    feesPaidBy
  });
  const dpeLetter = getDpeLetterFromValue(dpeValue);
  const gesLetter = getGesLetterFromValue(gesValue);

  // Smart Fast-Fill text parser
  const handleProcessFastFill = (text: string) => {
    if (!text.trim()) return;
    const textLower = text.toLowerCase();

    // Price
    const priceMatch = text.match(/(?:prix|vendu|montant|fai)?\s*:?\s*(\d[\d\s\xa0]{3,})\s*(?:€|euros)/i);
    if (priceMatch) {
      const p = parseInt(priceMatch[1].replace(/\s+/g, '').replace(/\xa0/g, ''), 10);
      if (!isNaN(p) && p > 10000) {
        const fees = Math.round(p * 0.04);
        setPriceNetSeller(p - fees);
        setAgencyFeesAmount(fees);
      }
    }

    // Surface
    const surfMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2|mètres)/i);
    if (surfMatch) {
      const s = parseFloat(surfMatch[1].replace(',', '.'));
      if (!isNaN(s)) {
        setLivingArea(s);
        setCarrezArea(s);
      }
    }

    // Terrain
    const terrainMatch = text.match(/(?:terrain|parcelle)\s*(?:de)?\s*(\d+(?:[.,]\d+)?)\s*(?:m²|m2)/i);
    if (terrainMatch) {
      const t = parseFloat(terrainMatch[1].replace(',', '.'));
      if (!isNaN(t)) setLandArea(t);
    }

    // Rooms
    const roomsMatch = text.match(/(\d+)\s*(?:pièces|pieces|piece|pièce|T(\d+))/i);
    if (roomsMatch) {
      const r = parseInt(roomsMatch[1] || roomsMatch[2], 10);
      if (!isNaN(r)) setRoomsCount(r);
    }

    // Bedrooms
    const bedMatch = text.match(/(\d+)\s*(?:chambres|chambre|chb)/i);
    if (bedMatch) {
      const b = parseInt(bedMatch[1], 10);
      if (!isNaN(b)) setBedroomsCount(b);
    }

    // City
    if (textLower.includes('salon')) {
      setCity('Salon-de-Provence');
      setPostalCode('13300');
    } else if (textLower.includes('pélissanne') || textLower.includes('pelissanne')) {
      setCity('Pélissanne');
      setPostalCode('13330');
    } else if (textLower.includes('lançon') || textLower.includes('lancon')) {
      setCity('Lançon-Provence');
      setPostalCode('13680');
    } else if (textLower.includes('éguilles') || textLower.includes('eguilles')) {
      setCity('Éguilles');
      setPostalCode('13510');
    } else if (textLower.includes('sénas') || textLower.includes('senas')) {
      setCity('Sénas');
      setPostalCode('13560');
    } else if (textLower.includes('la fare')) {
      setCity('La Fare-les-Oliviers');
      setPostalCode('13580');
    }

    // Property type
    if (textLower.includes('appartement') || textLower.includes('studio')) {
      setPropertyType('appartement');
    } else if (textLower.includes('terrain')) {
      setPropertyType('terrain');
    } else if (textLower.includes('immeuble')) {
      setPropertyType('immeuble');
    } else if (textLower.includes('commercial') || textLower.includes('bureau')) {
      setPropertyType('local_commercial');
    } else {
      setPropertyType('maison');
    }

    // Description & Title
    if (text.length > 50) {
      setDescription(text.trim());
      const firstLine = text.split('\n')[0].replace(/^#+\s*/, '').trim();
      if (firstLine.length > 10 && firstLine.length < 90) {
        setTitle(firstLine);
      }
    }

    setAutoFillSuccess(true);
    setTimeout(() => {
      setShowAutoFillModal(false);
      setAutoFillSuccess(false);
    }, 800);
  };

  // AI Copywriting Generator
  const handleGenerateAiDescription = (mode: 'portail' | 'luxe' | 'social' | 'bullet') => {
    setIsAiGenerating(true);

    setTimeout(() => {
      let generated = '';
      const typeLabel =
        propertyType === 'maison'
          ? 'Villa / Maison'
          : propertyType === 'appartement'
          ? 'Appartement'
          : 'Bien immobilier';

      if (mode === 'portail') {
        generated =
          `NELL'IMMO vous présente en EXCLUSIVITÉ cette superbe ${typeLabel.toLowerCase()} de ${livingArea}m² idéalement située sur la commune prisée de ${city} (${postalCode}).\n\n` +
          `Ce bien de ${roomsCount} pièces (${bedroomsCount} chambres) se compose d'une lumineuse pièce de vie avec cuisine équipée ouverte, bénéficiant d'une exposition idéale.\n\n` +
          `À l'extérieur, vous profiterez d'un agréable terrain de ${landArea}m² ${featuresInput.toLowerCase().includes('piscine') ? 'avec piscine et espace détente,' : ''} parfait pour vos moments de convivialité en famille.\n\n` +
          `Prestations complémentaires : ${featuresInput}.\n` +
          `DPE : ${dpeLetter} (${dpeValue} kWh/m²/an) - GES : ${gesLetter}.\n\n` +
          `Pour toute information ou pour organiser une visite, contactez Nelly FERNANDEZ au 07 55 68 61 09 ou par email à nellimmo.acte@gmail.com. Mandat n°${nextMandateNumber}.`;
      } else if (mode === 'luxe') {
        generated =
          `L'agence NELL'IMMO a le privilège de vous dévoiler cette demeure d'exception nichée dans l'un des cadres les plus recherchés de ${city}.\n\n` +
          `Déployant ${livingArea}m² d'élégance et de volumes généreux, cette propriété sublime l'art de vivre provençal. Les espaces de réception baignés de lumière s'ouvrent harmonieusement sur un parc paysager de ${landArea}m² ${featuresInput.toLowerCase().includes('piscine') ? 'agrémenté d\'un superbe espace piscine.' : '.'}\n\n` +
          `L'espace nuit offre ${bedroomsCount} suites raffinées alliant confort absolu et sérénité. Matériaux nobles, finitions haut de gamme (${featuresInput}) et performance énergétique exemplaire font de cette adresse une opportunité rare sur le Pays Salonais.\n\n` +
          `Dossier complet et visites privées sur demande auprès de Nelly Fernandez (07 55 68 61 09).`;
      } else if (mode === 'social') {
        generated =
          `🔥 NOUVEAUTÉ NELL'IMMO À ${city.toUpperCase()} ! 🔥\n\n` +
          `🏡 Coup de cœur pour cette superbe ${typeLabel.toLowerCase()} de ${livingArea}m² avec terrain de ${landArea}m² !\n\n` +
          `✨ Ce qu'on adore :\n` +
          `✔️ ${roomsCount} pièces spacieuses et lumineuses\n` +
          `✔️ ${bedroomsCount} belles chambres confortables\n` +
          `✔️ ${featuresInput.split(',').slice(0, 3).join(' / ')}\n` +
          `✔️ Emplacement calme et privilégié à ${city}\n\n` +
          `💰 Prix : ${financials.priceFai.toLocaleString('fr-FR')} € FAI\n` +
          `📞 Contactez-nous vite pour visiter : 07 55 68 61 09\n\n` +
          `#Immobilier #${city.replace(/\s+/g, '')} #PaysSalonais #NellImmo #MaisonAVendre #VillaPACA #ProvenceRealEstate #Exclusivite`;
      } else {
        generated =
          `Fiche synthétique - Mandat #${nextMandateNumber} - ${city} :\n` +
          `- Type : ${typeLabel}\n` +
          `- Surface : ${livingArea} m² habitable (Carrez: ${carrezArea} m²)\n` +
          `- Terrain : ${landArea} m²\n` +
          `- Pièces : ${roomsCount} (${bedroomsCount} chambres, ${bathroomsCount} SDB)\n` +
          `- Équipements : ${featuresInput}\n` +
          `- DPE : ${dpeLetter} (${dpeValue}) | GES : ${gesLetter} (${gesValue})\n` +
          `- Prix FAI : ${financials.priceFai.toLocaleString('fr-FR')} € (${feesPaidBy === 'vendeur' ? 'charge vendeur' : 'charge acquéreur'})\n` +
          `- Disponibilité : Immédiate`;
      }

      setDescription(generated);
      setIsAiGenerating(false);
    }, 500);
  };

  // Image helpers
  const handleAddImageByUrl = (url: string) => {
    const urls = url.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
    const newItems: PropertyImage[] = urls.map((u, i) => ({
      id: `img-${Date.now()}-${i}`,
      property_id: '',
      image_url: u,
      display_order: images.length + i + 1,
      is_cover: images.length === 0 && i === 0,
      created_at: new Date().toISOString()
    }));
    setImages([...images, ...newItems]);
  };

  const handleUploadFiles = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg: PropertyImage = {
            id: `img-upload-${Date.now()}-${index}`,
            property_id: '',
            image_url: event.target.result as string,
            display_order: images.length + index + 1,
            is_cover: images.length === 0 && index === 0,
            created_at: new Date().toISOString()
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_cover)) {
      updated[0].is_cover = true;
    }
    setImages(updated);
  };

  const handleSetCover = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_cover: i === index
    }));
    setImages(updated);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const featuresList = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const created = await createProperty({
        mandate_type: mandateType,
        mandate_date: mandateDate,
        mandate_end_date: mandateEndDate,
        status: 'actif',
        seller_civility: sellerCivility,
        seller_name: sellerName || 'Mandant Nell\'Immo',
        seller_email: sellerEmail || 'vendeur@nellimmo.fr',
        seller_phone: sellerPhone || '07 55 68 61 09',
        seller_address: sellerAddress || `${city}, Pays Salonais`,
        title:
          title ||
          `${propertyType === 'maison' ? 'Villa' : 'Appartement'} ${roomsCount} pièces à ${city}`,
        property_type: propertyType,
        address: address || `Secteur ${city}`,
        postal_code: postalCode,
        city: city,
        display_exact_address: displayExactAddress,
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
        bathrooms_count: bathroomsCount,
        dpe_value: dpeValue,
        dpe_letter: dpeLetter,
        ges_value: gesValue,
        ges_letter: gesLetter,
        dpe_reference_year: '2024',
        energy_cost_min: energyCostMin,
        energy_cost_max: energyCostMax,
        description: description,
        features: featuresList,
        publish_website: publishWebsite,
        publish_seloger: publishSeloger,
        publish_leboncoin: publishLeboncoin,
        publish_bienici: publishBienici,
        video_url: videoUrl || undefined,
        virtual_tour_url: virtualTourUrl || undefined,
        images: images
      });

      showToast(`Mandat N°${created.mandate_number} créé avec succès !`, 'success');
      router.push(`/cockpit/mandats/${created.id}`);
    } catch (err) {
      console.error('Erreur lors de la création du mandat :', err);
      showToast('Erreur lors de la création du mandat', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/cockpit/mandats"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#E12B7B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au registre des mandats
        </Link>

        <Button
          type="button"
          variant="gold"
          size="sm"
          onClick={() => setShowAutoFillModal(true)}
          leftIcon={<Wand2 className="w-4 h-4" />}
        >
          Remplissage Express / Import Texte
        </Button>
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#F3E8EE] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Créateur d&apos;Annonce & Mandat
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Nouveau Mandat #{nextMandateNumber}
          </h1>
          <p className="text-xs text-gray-500">
            Conforme Loi Hoguet, Loi ALUR et barème DPE 2024. Prêt pour multidiffusion immédiate.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#FAF5F8] border border-[#F3E8EE] rounded-2xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-700">Registre Loi Hoguet Prêt</span>
        </div>
      </div>

      {/* Stepper navigation bar */}
      <MandateWizardStepper />

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <StepSeller
          mandateType={mandateType}
          onMandateTypeChange={setMandateType}
          mandateDate={mandateDate}
          onMandateDateChange={setMandateDate}
          mandateEndDate={mandateEndDate}
          onMandateEndDateChange={setMandateEndDate}
          sellerCivility={sellerCivility}
          onSellerCivilityChange={setSellerCivility}
          sellerName={sellerName}
          onSellerNameChange={setSellerName}
          sellerEmail={sellerEmail}
          onSellerEmailChange={setSellerEmail}
          sellerPhone={sellerPhone}
          onSellerPhoneChange={setSellerPhone}
          sellerAddress={sellerAddress}
          onSellerAddressChange={setSellerAddress}
        />

        <StepLocation
          title={title}
          onTitleChange={setTitle}
          propertyType={propertyType}
          onPropertyTypeChange={setPropertyType}
          address={address}
          onAddressChange={setAddress}
          postalCode={postalCode}
          onPostalCodeChange={setPostalCode}
          city={city}
          onCityChange={setCity}
        />

        <StepFinancials
          priceNetSeller={priceNetSeller}
          onPriceNetSellerChange={setPriceNetSeller}
          agencyFeesPercentage={agencyFeesPercentage}
          onAgencyFeesPercentageChange={setAgencyFeesPercentage}
          agencyFeesAmount={agencyFeesAmount}
          onAgencyFeesAmountChange={setAgencyFeesAmount}
          feesPaidBy={feesPaidBy}
          onFeesPaidByChange={setFeesPaidBy}
          financials={financials}
        />

        <StepFeatures
          livingArea={livingArea}
          onLivingAreaChange={setLivingArea}
          carrezArea={carrezArea}
          onCarrezAreaChange={setCarrezArea}
          landArea={landArea}
          onLandAreaChange={setLandArea}
          roomsCount={roomsCount}
          onRoomsCountChange={setRoomsCount}
          bedroomsCount={bedroomsCount}
          onBedroomsCountChange={setBedroomsCount}
          bathroomsCount={bathroomsCount}
          onBathroomsCountChange={setBathroomsCount}
          featuresInput={featuresInput}
          onFeaturesInputChange={setFeaturesInput}
        />

        <StepDpe
          dpeValue={dpeValue}
          onDpeValueChange={setDpeValue}
          gesValue={gesValue}
          onGesValueChange={setGesValue}
          energyCostMin={energyCostMin}
          onEnergyCostMinChange={setEnergyCostMin}
          energyCostMax={energyCostMax}
          onEnergyCostMaxChange={setEnergyCostMax}
        />

        <StepMediaPublishing
          description={description}
          onDescriptionChange={setDescription}
          onGenerateAiDescription={handleGenerateAiDescription}
          isAiGenerating={isAiGenerating}
          images={images}
          onAddImageByUrl={handleAddImageByUrl}
          onUploadFiles={handleUploadFiles}
          onRemoveImage={handleRemoveImage}
          onSetCoverImage={handleSetCover}
          videoUrl={videoUrl}
          onVideoUrlChange={setVideoUrl}
          virtualTourUrl={virtualTourUrl}
          onVirtualTourUrlChange={setVirtualTourUrl}
          publishWebsite={publishWebsite}
          onPublishWebsiteChange={setPublishWebsite}
          publishSeloger={publishSeloger}
          onPublishSelogerChange={setPublishSeloger}
          publishLeboncoin={publishLeboncoin}
          onPublishLeboncoinChange={setPublishLeboncoin}
          publishBienici={publishBienici}
          onPublishBieniciChange={setPublishBienici}
        />

        {/* Submit Bar */}
        <div className="pt-4 flex items-center justify-between border-t border-gray-200">
          <Link
            href="/cockpit/mandats"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
          >
            Abandonner
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Créer et Sceller le Mandat #{nextMandateNumber}
          </Button>
        </div>
      </form>

      {/* Auto Fill Modal */}
      <FastFillModal
        isOpen={showAutoFillModal}
        onClose={() => setShowAutoFillModal(false)}
        onProcessText={handleProcessFastFill}
        isSuccess={autoFillSuccess}
      />
    </div>
  );
}
