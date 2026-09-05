'use client';

import React, { useState, useMemo } from 'react';
import { X, FilePlus2, Compass } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import type { PropertyType } from '@/lib/types';
import { SellerDiscoveryDvfCard } from './SellerDiscoveryDvfCard';
import { SellerDiscoverySpecsCard } from './SellerDiscoverySpecsCard';

interface SellerDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerDiscoveryModal({ isOpen, onClose }: SellerDiscoveryModalProps) {
  const { createProperty } = useNellimoStore();
  const { showToast } = useToast();

  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pélissanne');
  const [propertyType, setPropertyType] = useState<PropertyType>('maison');
  const [livingArea, setLivingArea] = useState<number>(120);
  const [landArea, setLandArea] = useState<number>(500);
  const [roomsCount, setRoomsCount] = useState<number>(5);
  const [bedroomsCount, setBedroomsCount] = useState<number>(3);
  const [hasPool, setHasPool] = useState(false);
  const [hasGarage, setHasGarage] = useState(false);
  const [condition, setCondition] = useState<'impeccable' | 'bon_etat' | 'a_renover'>('bon_etat');
  const [desiredPrice, setDesiredPrice] = useState<number>(450000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dvfBenchmark = useMemo(() => {
    const basePricePerM2 = city.toLowerCase().includes('salon') ? 3400 : 3800;
    const conditionMult = condition === 'impeccable' ? 1.1 : condition === 'a_renover' ? 0.85 : 1.0;
    const estimatedValue = Math.round(livingArea * basePricePerM2 * conditionMult + (hasPool ? 25000 : 0) + (hasGarage ? 15000 : 0));
    return { estimatedValue, gap: desiredPrice > 0 ? desiredPrice - estimatedValue : 0 };
  }, [city, livingArea, condition, hasPool, hasGarage, desiredPrice]);

  if (!isOpen) return null;

  const handleCreateDraftMandate = async () => {
    if (!sellerName || !sellerPhone) {
      showToast('Veuillez renseigner au moins le nom et le téléphone du propriétaire.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await createProperty({
        title: `${propertyType === 'maison' ? 'Villa' : propertyType === 'appartement' ? 'Appartement' : 'Bien'} ${livingArea} m² — ${city}`,
        property_type: propertyType,
        description: `Bien découvert en estimation R1 à ${city}. Terrain ${landArea} m², ${roomsCount} pièces (${bedroomsCount} ch.).`,
        status: 'brouillon', mandate_type: 'exclusif',
        mandate_date: new Date().toISOString().split('T')[0],
        mandate_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price_fai: desiredPrice, price_net_seller: Math.round(desiredPrice * 0.95),
        agency_fees_amount: Math.round(desiredPrice * 0.05), agency_fees_percentage: 5, fees_paid_by: 'vendeur',
        living_area: livingArea, land_area: landArea, rooms_count: roomsCount, bedrooms_count: bedroomsCount,
        address: address || 'Adresse à confirmer', city,
        postal_code: city.toLowerCase().includes('salon') ? '13300' : '13330',
        display_exact_address: false, seller_name: sellerName, seller_phone: sellerPhone, seller_address: address || city,
        publish_website: false, publish_seloger: false, publish_leboncoin: false, publish_bienici: false,
        features: [hasPool ? 'Piscine' : '', hasGarage ? 'Garage' : '', condition].filter(Boolean),
      });
      showToast(`Mandat brouillon créé pour ${sellerName} ! Prêt pour le R2.`, 'success');
      onClose();
    } catch {
      showToast('Erreur lors de la création du mandat brouillon.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C59A45]/20 text-[#967026] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">Fiche Découverte Terrain Vendeur (R1)</h3>
              <p className="text-[11px] text-gray-500">Carnet d&apos;estimation en face du propriétaire</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coordonnées */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Nom du Propriétaire *</label>
            <input
              type="text"
              placeholder="ex. M. et Mme Blanc"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Téléphone *</label>
            <input
              type="tel"
              placeholder="06 12 34 56 78"
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200"
            />
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Adresse du bien"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-2 p-2 rounded-lg border border-gray-200"
            />
            <input
              type="text"
              placeholder="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 rounded-lg border border-gray-200"
            />
          </div>
        </div>

        {/* Caractéristiques */}
        <SellerDiscoverySpecsCard
          propertyType={propertyType} onPropertyTypeChange={setPropertyType}
          livingArea={livingArea} onLivingAreaChange={setLivingArea}
          landArea={landArea} onLandAreaChange={setLandArea}
          roomsCount={roomsCount} onRoomsCountChange={setRoomsCount}
          bedroomsCount={bedroomsCount} onBedroomsCountChange={setBedroomsCount}
          hasPool={hasPool} onHasPoolChange={setHasPool}
          hasGarage={hasGarage} onHasGarageChange={setHasGarage}
          condition={condition} onConditionChange={setCondition}
        />

        {/* DVF Benchmark Card */}
        <SellerDiscoveryDvfCard
          city={city}
          estimatedValue={dvfBenchmark.estimatedValue}
          desiredPrice={desiredPrice}
          onDesiredPriceChange={setDesiredPrice}
          gap={dvfBenchmark.gap}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-600">
            Annuler
          </button>
          <button
            type="button"
            onClick={handleCreateDraftMandate}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Enregistrer en Mandat Brouillon</span>
          </button>
        </div>
      </div>
    </div>
  );
}
