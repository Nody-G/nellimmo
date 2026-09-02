'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { calculateFinancials, getDpeLetterFromValue, getGesLetterFromValue, isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import { MandateType, PropertyType, SellerCivility, FeesPaidBy, PropertyImage } from '@/lib/types';
import {
  User,
  Home,
  Zap,
  Euro,
  Image as ImageIcon,
  Radio,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Wand2,
  FileText,
  Upload,
  CheckCircle2,
  Copy,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export default function NewMandatePage() {
  const router = useRouter();
  const { createProperty, properties } = useNellimoStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fast-Fill & AI Helper
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [autoFillText, setAutoFillText] = useState('');
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<'portail' | 'luxe' | 'social' | 'bullet'>('portail');

  // Next Mandate Number calculation
  const nextMandateNumber = properties.length > 0
    ? Math.max(...properties.map(p => p.mandate_number || 0)) + 1
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
  const [featuresInput, setFeaturesInput] = useState('Piscine, Climatisation réversible, Garage, Terrasse, Jardin arboré');

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

  // Images & Médias state
  const [videoUrl, setVideoUrl] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [images, setImages] = useState<PropertyImage[]>([
    {
      id: 'img-new-1',
      property_id: '',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      display_order: 1,
      is_cover: true,
      created_at: new Date().toISOString()
    }
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Calculations
  const financials = calculateFinancials({
    priceNetSeller,
    agencyFeesPercentage,
    agencyFeesAmount,
    feesPaidBy
  });

  const dpeLetter = getDpeLetterFromValue(dpeValue);
  const gesLetter = getGesLetterFromValue(gesValue);
  const isPassoireThermique = isAuditEnergetiqueObligatoire(dpeLetter);

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

  // Smart Auto-Fill Parser
  const handleRunAutoFill = () => {
    if (!autoFillText.trim()) return;

    const text = autoFillText;
    const textLower = text.toLowerCase();

    // Detect price
    const priceMatch = text.match(/([\d\s\xa0]{4,})\s*€/);
    if (priceMatch) {
      const p = parseInt(priceMatch[1].replace(/\s+/g, '').replace(/\xa0/g, ''), 10);
      if (!isNaN(p) && p > 10000) {
        const fees = Math.round(p * 0.04);
        setPriceNetSeller(p - fees);
        setAgencyFeesAmount(fees);
      }
    }

    // Detect surface
    const surfMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2|mètres)/i);
    if (surfMatch) {
      const s = parseFloat(surfMatch[1].replace(',', '.'));
      if (!isNaN(s)) {
        setLivingArea(s);
        setCarrezArea(s);
      }
    }

    // Detect terrain
    const terrainMatch = text.match(/(?:terrain|parcelle)\s*(?:de)?\s*(\d+(?:[.,]\d+)?)\s*(?:m²|m2)/i);
    if (terrainMatch) {
      const t = parseFloat(terrainMatch[1].replace(',', '.'));
      if (!isNaN(t)) setLandArea(t);
    }

    // Detect rooms
    const roomsMatch = text.match(/(\d+)\s*(?:pièces|pieces|piece|pièce|T(\d+))/i);
    if (roomsMatch) {
      const r = parseInt(roomsMatch[1] || roomsMatch[2], 10);
      if (!isNaN(r)) setRoomsCount(r);
    }

    // Detect bedrooms
    const bedMatch = text.match(/(\d+)\s*(?:chambres|chambre|chb)/i);
    if (bedMatch) {
      const b = parseInt(bedMatch[1], 10);
      if (!isNaN(b)) setBedroomsCount(b);
    }

    // Detect city
    if (textLower.includes('salon')) { setCity('Salon-de-Provence'); setPostalCode('13300'); }
    else if (textLower.includes('pélissanne') || textLower.includes('pelissanne')) { setCity('Pélissanne'); setPostalCode('13330'); }
    else if (textLower.includes('lançon') || textLower.includes('lancon')) { setCity('Lançon-Provence'); setPostalCode('13680'); }
    else if (textLower.includes('éguilles') || textLower.includes('eguilles')) { setCity('Éguilles'); setPostalCode('13510'); }
    else if (textLower.includes('sénas') || textLower.includes('senas')) { setCity('Sénas'); setPostalCode('13560'); }
    else if (textLower.includes('la fare')) { setCity('La Fare-les-Oliviers'); setPostalCode('13580'); }

    // Detect property type
    if (textLower.includes('appartement') || textLower.includes('studio')) setPropertyType('appartement');
    else if (textLower.includes('terrain')) setPropertyType('terrain');
    else if (textLower.includes('immeuble')) setPropertyType('immeuble');
    else if (textLower.includes('commercial') || textLower.includes('bureau')) setPropertyType('local_commercial');
    else setPropertyType('maison');

    // Title & Description
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
    setAiMode(mode);

    setTimeout(() => {
      let generated = '';
      const typeLabel = propertyType === 'maison' ? 'Villa / Maison' : propertyType === 'appartement' ? 'Appartement' : 'Bien immobilier';

      if (mode === 'portail') {
        generated = `NELL'IMMO vous présente en EXCLUSIVITÉ cette superbe ${typeLabel.toLowerCase()} de ${livingArea}m² idéalement située sur la commune prisée de ${city} (${postalCode}).\n\n` +
          `Ce bien de ${roomsCount} pièces (${bedroomsCount} chambres) se compose d'une lumineuse pièce de vie avec cuisine équipée ouverte, bénéficiant d'une exposition idéale.\n\n` +
          `À l'extérieur, vous profiterez d'un agréable terrain de ${landArea}m² ${featuresInput.toLowerCase().includes('piscine') ? 'avec piscine et espace détente,' : ''} parfait pour vos moments de convivialité en famille.\n\n` +
          `Prestations complémentaires : ${featuresInput}.\n` +
          `DPE : ${dpeLetter} (${dpeValue} kWh/m²/an) - GES : ${gesLetter}.\n\n` +
          `Pour toute information ou pour organiser une visite, contactez Nelly FERNANDEZ au 07 55 68 61 09 ou par email à nellimmo.acte@gmail.com. Mandat n°${nextMandateNumber}.`;
      } else if (mode === 'luxe') {
        generated = `L'agence NELL'IMMO a le privilège de vous dévoiler cette demeure d'exception nichée dans l'un des cadres les plus recherchés de ${city}.\n\n` +
          `Déployant ${livingArea}m² d'élégance et de volumes généreux, cette propriété sublime l'art de vivre provençal. Les espaces de réception baignés de lumière s'ouvrent harmonieusement sur un parc paysager de ${landArea}m² ${featuresInput.toLowerCase().includes('piscine') ? 'agrémenté d\'un superbe espace piscine.' : '.'}\n\n` +
          `L'espace nuit offre ${bedroomsCount} suites raffinées alliant confort absolu et sérénité. Matériaux nobles, finitions haut de gamme (${featuresInput}) et performance énergétique exemplaire font de cette adresse une opportunité rare sur le Pays Salonais.\n\n` +
          `Dossier complet et visites privées sur demande auprès de Nelly Fernandez (07 55 68 61 09).`;
      } else if (mode === 'social') {
        generated = `🔥 NOUVEAUTÉ NELL'IMMO À ${city.toUpperCase()} ! 🔥\n\n` +
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
        generated = `Fiche synthétique - Mandat #${nextMandateNumber} - ${city} :\n` +
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

  // Image handlers
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const urls = newImageUrl.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
    const newItems: PropertyImage[] = urls.map((u, i) => ({
      id: `img-${Date.now()}-${i}`,
      property_id: '',
      image_url: u,
      display_order: images.length + i + 1,
      is_cover: images.length === 0 && i === 0,
      created_at: new Date().toISOString()
    }));
    setImages([...images, ...newItems]);
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

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
          setImages(prev => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(img => img.is_cover)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const featuresList = featuresInput
      .split(',')
      .map(f => f.trim())
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
        title: title || `${propertyType === 'maison' ? 'Villa' : 'Appartement'} ${roomsCount} pièces à ${city}`,
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

      router.push(`/cockpit/mandats/${created.id}`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création du mandat');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/cockpit/mandats"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#E12B7B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au registre des mandats
        </Link>

        {/* Smart Fast-Fill Trigger */}
        <button
          type="button"
          onClick={() => setShowAutoFillModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#E12B7B] to-[#C59A45] hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          Remplissage Express / Import Texte
        </button>
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
          <span className="text-xs font-bold text-gray-700">Régistre Loi Hoguet Prêt</span>
        </div>
      </div>

      {/* AUTO-FILL MODAL */}
      {showAutoFillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FDF2F8] text-[#E12B7B] rounded-xl">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#131B26]">
                    Remplissage Express Intelligent
                  </h3>
                  <p className="text-xs text-gray-500">
                    Collez le texte d&apos;une annonce, un email ou des notes de visite.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAutoFillModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={6}
              value={autoFillText}
              onChange={(e) => setAutoFillText(e.target.value)}
              placeholder="Ex: Villa contemporaine T5 de 140m2 à Salon-de-Provence avec piscine sur 800m2 de terrain. Prix 485000 euros FAI. DPE C. 4 chambres, garage..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-[#E12B7B]"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-400">
                Extraction auto : prix, surfaces, pièces, ville, DPE, équipements.
              </span>
              <button
                type="button"
                onClick={handleRunAutoFill}
                disabled={!autoFillText.trim()}
                className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#c42068] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {autoFillSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {autoFillSuccess ? 'Injecté !' : 'Extraire & Remplir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. INFORMATIONS JURIDIQUES & VENDEUR */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <User className="w-5 h-5 text-[#E12B7B]" />
            <span>1. Vendeur (Mandant) & Modalités Juridiques</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type de mandat</label>
              <select
                value={mandateType}
                onChange={(e) => setMandateType(e.target.value as MandateType)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E12B7B] focus:outline-[#E12B7B]"
              >
                <option value="exclusif">Mandat Exclusif (Recommandé)</option>
                <option value="simple">Mandat Simple</option>
                <option value="semi-exclusif">Mandat Semi-Exclusif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Date d&apos;effet</label>
              <input
                type="date"
                required
                value={mandateDate}
                onChange={(e) => setMandateDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Date d&apos;échéance</label>
              <input
                type="date"
                required
                value={mandateEndDate}
                onChange={(e) => setMandateEndDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Civilité</label>
              <select
                value={sellerCivility}
                onChange={(e) => setSellerCivility(e.target.value as SellerCivility)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                <option value="M_Mme">M. et Mme</option>
                <option value="M">Monsieur</option>
                <option value="Mme">Madame</option>
                <option value="SCI">SCI</option>
                <option value="Societe">Société / Autre</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom complet du vendeur / SCI</label>
              <input
                type="text"
                required
                placeholder="Ex: Jean et Claire Dupont"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone du vendeur</label>
              <input
                type="tel"
                required
                placeholder="06 12 34 56 78"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">E-mail du vendeur</label>
              <input
                type="email"
                placeholder="vendeur@email.fr"
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse personnelle du vendeur</label>
            <input
              type="text"
              placeholder="Ex: 12 Chemin des Costes, 13330 Pélissanne"
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        {/* 2. CARACTÉRISTIQUES DU BIEN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Home className="w-5 h-5 text-[#E12B7B]" />
            <span>2. Caractéristiques & Localisation</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Titre commercial de l&apos;annonce</label>
            <input
              type="text"
              required
              placeholder="Ex: Superbe Villa Contemporaine de Plain-Pied avec Piscine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type de bien</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                <option value="maison">Maison / Villa</option>
                <option value="appartement">Appartement</option>
                <option value="terrain">Terrain</option>
                <option value="immeuble">Immeuble</option>
                <option value="local_commercial">Local Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Commune</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Code Postal</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse exacte du bien</label>
            <input
              type="text"
              placeholder="Ex: 145 Chemin des Oliviers"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          {/* Surfaces & Pièces */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Habitable (m²)</label>
              <input
                type="number"
                step="0.1"
                required
                value={livingArea}
                onChange={(e) => setLivingArea(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Carrez (m²)</label>
              <input
                type="number"
                step="0.1"
                value={carrezArea}
                onChange={(e) => setCarrezArea(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Terrain (m²)</label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nombre de pièces</label>
              <input
                type="number"
                required
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nombre de chambres</label>
              <input
                type="number"
                required
                value={bedroomsCount}
                onChange={(e) => setBedroomsCount(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Salles de bains / eau</label>
              <input
                type="number"
                value={bathroomsCount}
                onChange={(e) => setBathroomsCount(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Équipements clés</label>
              <input
                type="text"
                placeholder="Piscine, Climatisation, Garage..."
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          {/* AI Description Studio */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase text-gray-700">Descriptif de l&apos;annonce</label>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400 uppercase mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E12B7B]" />
                  Générer IA :
                </span>
                <button
                  type="button"
                  onClick={() => handleGenerateAiDescription('portail')}
                  disabled={isAiGenerating}
                  className="px-2.5 py-1 bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#E12B7B] rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  🚀 Portails
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateAiDescription('luxe')}
                  disabled={isAiGenerating}
                  className="px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#F4EBD7] text-[#C59A45] rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  ✨ Luxe
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateAiDescription('social')}
                  disabled={isAiGenerating}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  📱 Réseaux
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateAiDescription('bullet')}
                  disabled={isAiGenerating}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  📋 Synthèse
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>Zone d&apos;écriture étendue (supporte les longs textes sans forcer le scroll)</span>
              <span className="font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-0.5 rounded-full">
                {description.split('\n').length} ligne(s) • {description.length} car.
              </span>
            </div>

            <textarea
              rows={26}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rédigez ou collez ici le texte complet de votre annonce (paragraphes, détails des pièces, extérieur, environnement, mentions légales)..."
              className="w-full min-h-[500px] p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-sans font-normal text-gray-800 focus:outline-[#E12B7B] leading-relaxed resize-y shadow-inner"
            />
          </div>
        </div>

        {/* 3. DIAGNOSTICS ÉNERGÉTIQUES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
            <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#131B26]">
              <Zap className="w-5 h-5 text-[#E12B7B]" />
              <span>3. Diagnostics Énergétiques (DPE / GES)</span>
            </div>
            {isPassoireThermique && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Audit Énergétique Obligatoire
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                DPE (kWh/m²/an)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={dpeValue}
                  onChange={(e) => setDpeValue(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
                <span className={`px-3 py-2 rounded-xl font-black text-sm ${
                  ['A', 'B'].includes(dpeLetter || '') ? 'bg-emerald-100 text-emerald-800' :
                  ['C', 'D'].includes(dpeLetter || '') ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {dpeLetter || '-'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                GES (kg CO₂/m²/an)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gesValue}
                  onChange={(e) => setGesValue(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
                <span className="px-3 py-2 bg-blue-50 text-blue-800 rounded-xl font-black text-sm">
                  {gesLetter || '-'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Coûts Min (€/an)</label>
              <input
                type="number"
                value={energyCostMin}
                onChange={(e) => setEnergyCostMin(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Coûts Max (€/an)</label>
              <input
                type="number"
                value={energyCostMax}
                onChange={(e) => setEnergyCostMax(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>
        </div>

        {/* 4. DONNÉES FINANCIÈRES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Euro className="w-5 h-5 text-[#E12B7B]" />
            <span>4. Prix & Honoraires (Loi ALUR)</span>
          </div>

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
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Honoraires TTC (%)</label>
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
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Charge des Honoraires</label>
              <select
                value={feesPaidBy}
                onChange={(e) => setFeesPaidBy(e.target.value as FeesPaidBy)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                <option value="vendeur">Charge Vendeur (Standard Nell&apos;Immo)</option>
                <option value="acquereur">Charge Acquéreur</option>
              </select>
            </div>
          </div>

          {/* Financial summary */}
          <div className="bg-[#FCFAF7] rounded-2xl p-6 border border-[#F3E8EE] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400">Prix Net Vendeur</span>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {priceNetSeller.toLocaleString('fr-FR')} €
              </div>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400">Honoraires TTC ({agencyFeesPercentage}%)</span>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {financials.agencyFeesAmount.toLocaleString('fr-FR')} €
              </div>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-[#E12B7B]">Prix Public Affiché (FAI)</span>
              <div className="text-2xl font-black text-[#E12B7B] mt-0.5">
                {financials.priceFai.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>
        </div>

        {/* 5. PHOTOS & MÉDIAS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
            <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#131B26]">
              <ImageIcon className="w-5 h-5 text-[#E12B7B]" />
              <span>5. Photos HD & Visite Virtuelle</span>
            </div>
            <span className="text-xs font-bold text-gray-500">{images.length} photo(s)</span>
          </div>

          {/* Photo Upload & URL adder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="p-4 border-2 border-dashed border-gray-300 hover:border-[#E12B7B] bg-gray-50 hover:bg-[#FDF2F8]/30 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center">
              <Upload className="w-5 h-5 text-[#E12B7B]" />
              <span className="text-xs font-bold text-gray-800">
                Glisser ou Parcourir vos photos
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, WebP (Multi-sélection)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex flex-col gap-2">
              <textarea
                rows={2}
                placeholder="Ou coller des URLs d'images (séparées par une virgule)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#131B26] hover:bg-[#E12B7B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Ajouter ces photos
              </button>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className={`relative group rounded-2xl overflow-hidden aspect-4/3 border-2 transition-all ${
                  img.is_cover ? 'border-[#E12B7B] shadow-md' : 'border-gray-200'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        img.is_cover ? 'bg-[#E12B7B] text-white' : 'bg-white text-gray-800'
                      }`}
                    >
                      {img.is_cover ? '★ Couverture' : 'Mettre couv.'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-white font-mono">Photo #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Video & Virtual Tour URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Lien Vidéo (YouTube / Vimeo / MP4)
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B]"
              />
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
            </div>
          </div>
        </div>

        {/* 6. DIFFUSION PORTAILS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Radio className="w-5 h-5 text-[#E12B7B]" />
            <span>6. Passerelles de Diffusion Portails</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={publishWebsite}
                onChange={(e) => setPublishWebsite(e.target.checked)}
                className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
              />
              <span>Site nellimmo.fr</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={publishSeloger}
                onChange={(e) => setPublishSeloger(e.target.checked)}
                className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
              />
              <span>SeLoger / Logic-Immo</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={publishLeboncoin}
                onChange={(e) => setPublishLeboncoin(e.target.checked)}
                className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
              />
              <span>LeBonCoin</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={publishBienici}
                onChange={(e) => setPublishBienici(e.target.checked)}
                className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
              />
              <span>Bien&apos;ici</span>
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 flex items-center justify-between">
          <Link
            href="/cockpit/mandats"
            className="px-6 py-3 border border-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-[#E12B7B] hover:bg-[#c42068] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Création & Enregistrement...' : 'Enregistrer le Mandat & Publier'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
