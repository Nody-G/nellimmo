'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Save,
  Check,
  RefreshCw,
  Sparkles,
  Copy,
  ExternalLink,
  GraduationCap,
  ShoppingCart,
  HeartPulse,
  Bus,
  CheckCircle2,
  Navigation,
  MapPin,
} from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel } from '@/lib/cadastre';
import {
  AmenityCategory,
  AmenityItem,
  ClientProfileKey,
  NeighborhoodSummary,
  CATEGORY_CONFIG,
} from '@/lib/amenities';
import { InteractiveParcelMap } from './InteractiveParcelMap';
import { ParcelSpecsGrid } from './ParcelSpecsGrid';

interface MandateUnifiedStudioSectionProps {
  property: Property;
  onSaveCadastre: (section: string, numero: string, surface: number, idu: string) => Promise<void>;
}

export function MandateUnifiedStudioSection({
  property,
  onSaveCadastre,
}: MandateUnifiedStudioSectionProps) {
  // Cadastre state
  const [parcel, setParcel] = useState<CadastreParcel | null>(null);
  const [loadingCadastre, setLoadingCadastre] = useState(true);
  const [savedCadastre, setSavedCadastre] = useState(false);

  // Amenities state
  const [summary, setSummary] = useState<NeighborhoodSummary | null>(null);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<ClientProfileKey>('famille');
  const [selectedCategory, setSelectedCategory] = useState<'all' | AmenityCategory>('all');
  const [selectedAmenityId, setSelectedAmenityId] = useState<string | null>(null);
  const [showAmenitiesOnMap, setShowAmenitiesOnMap] = useState(true);

  // Copy states
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedSynthesis, setCopiedSynthesis] = useState(false);

  // 1. Charger les données du Cadastre officiel
  useEffect(() => {
    let isMounted = true;
    async function loadCadastre() {
      setLoadingCadastre(true);
      try {
        const params = new URLSearchParams();
        if (property.latitude && property.longitude) {
          params.set('lat', String(property.latitude));
          params.set('lon', String(property.longitude));
        }
        params.set('address', property.address || '');
        params.set('postal_code', property.postal_code || '');
        params.set('city', property.city || '');

        const res = await fetch(`/api/cadastre?${params.toString()}`);
        const data = await res.json();
        if (isMounted && data.success && data.parcel) {
          setParcel(data.parcel);
        }
      } catch (err) {
        console.error('Erreur chargement cadastre:', err);
      } finally {
        if (isMounted) setLoadingCadastre(false);
      }
    }

    loadCadastre();
    return () => {
      isMounted = false;
    };
  }, [property.address, property.postal_code, property.city, property.latitude, property.longitude]);

  // 2. Charger les commodités réelles vérifiées
  useEffect(() => {
    let isMounted = true;
    async function loadAmenities() {
      setLoadingAmenities(true);
      try {
        const params = new URLSearchParams();
        if (property.latitude && property.longitude) {
          params.set('lat', String(property.latitude));
          params.set('lon', String(property.longitude));
        }
        params.set('address', property.address || '');
        params.set('postal_code', property.postal_code || '');
        params.set('city', property.city || 'Provence');

        const res = await fetch(`/api/amenities?${params.toString()}`);
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setSummary(json.data);
          // Par défaut, sélectionner la première école primaire ou premier commerce
          if (json.data.minDistances?.primaire) {
            setSelectedAmenityId(json.data.minDistances.primaire.id);
          } else if (json.data.amenities?.length > 0) {
            setSelectedAmenityId(json.data.amenities[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement commodités:', err);
      } finally {
        if (isMounted) setLoadingAmenities(false);
      }
    }

    loadAmenities();
    return () => {
      isMounted = false;
    };
  }, [property.latitude, property.longitude, property.address, property.postal_code, property.city]);

  const handleSaveCadastreClick = async () => {
    if (!parcel) return;
    await onSaveCadastre(parcel.section, parcel.numero, parcel.contenance, parcel.idu);
    setSavedCadastre(true);
    setTimeout(() => setSavedCadastre(false), 2500);
  };

  const currentProfile = summary ? summary.profiles[selectedProfile] : null;

  // Filtrer les commodités selon la catégorie sélectionnée
  const filteredAmenities = summary
    ? selectedCategory === 'all'
      ? summary.amenities
      : summary.byCategory[selectedCategory] || []
    : [];

  const handleCopyPitch = async () => {
    if (!currentProfile) return;
    await navigator.clipboard.writeText(currentProfile.pitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleCopySynthesis = async () => {
    if (!summary || !currentProfile) return;
    const lines = [
      `📍 *FICHE SYNTHÈSE QUARTIER & COMMODITÉS*`,
      `Bien : ${property.title} (${property.city})`,
      `Score de commodités : ${summary.walkabilityScore}/100 (${summary.scoreLabel})`,
      ``,
      `🎒 *Scolarité :*`,
      summary.minDistances.maternelle ? `• Maternelle : ${summary.minDistances.maternelle.name} à ${summary.minDistances.maternelle.distanceMeters}m (${summary.minDistances.maternelle.walkingMinutes} min à pied)` : null,
      summary.minDistances.primaire ? `• Primaire : ${summary.minDistances.primaire.name} à ${summary.minDistances.primaire.distanceMeters}m (${summary.minDistances.primaire.walkingMinutes} min à pied)` : null,
      summary.minDistances.college ? `• Collège : ${summary.minDistances.college.name} à ${(summary.minDistances.college.distanceMeters / 1000).toFixed(1)} km (${summary.minDistances.college.drivingMinutes} min)` : null,
      ``,
      `🛒 *Commerces :*`,
      summary.minDistances.boulangerie ? `• Boulangerie : ${summary.minDistances.boulangerie.name} à ${summary.minDistances.boulangerie.distanceMeters}m` : null,
      summary.minDistances.superette ? `• Supérette : ${summary.minDistances.superette.name} à ${summary.minDistances.superette.distanceMeters}m` : null,
      summary.minDistances.supermarche ? `• Supermarché : ${summary.minDistances.supermarche.name} à ${(summary.minDistances.supermarche.distanceMeters / 1000).toFixed(1)} km` : null,
      ``,
      `⚽ *Sport & Santé :*`,
      summary.minDistances.sport ? `• Sport : ${summary.minDistances.sport.name} à ${summary.minDistances.sport.distanceMeters}m` : null,
      summary.minDistances.pharmacie ? `• Pharmacie : ${summary.minDistances.pharmacie.name} à ${summary.minDistances.pharmacie.distanceMeters}m` : null,
      ``,
      `💡 *Conseil de l'agent :*`,
      currentProfile.pitch,
    ]
      .filter(Boolean)
      .join('\n');

    await navigator.clipboard.writeText(lines);
    setCopiedSynthesis(true);
    setTimeout(() => setCopiedSynthesis(false), 2500);
  };

  const handleSelectKeyAmenity = (item?: AmenityItem) => {
    if (!item) return;
    setShowAmenitiesOnMap(true);
    setSelectedAmenityId(item.id);
  };

  const propertyFullAddress = property.address
    ? `${property.address}, ${property.postal_code || ''} ${property.city || ''}`.trim()
    : undefined;

  const isLoading = loadingCadastre && loadingAmenities;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#2A374A] shadow-xs space-y-6">
      {/* 1. Master Header: Cadastre, Score & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Studio Cartographique &amp; Quartier Unifié
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                IGN Live + Commodités
              </span>
              <button
                type="button"
                onClick={() => setShowAmenitiesOnMap((cur) => !cur)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  showAmenitiesOnMap
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-black shadow-2xs'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-500'
                }`}
                title="Afficher ou masquer les commodités (écoles, commerces, transports) sur la carte"
              >
                <span>🎒</span>
                <span>Commodités : {showAmenitiesOnMap ? 'Affichées (ON)' : 'Masquées (OFF)'}</span>
              </button>
              {parcel && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-gray-700">
                  Sec. {parcel.section} N°{parcel.numero} • {parcel.contenance} m²
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Parcelle cadastrale exacte, ensoleillement réel, bornes cotées et radar vivant des écoles &amp; commerces sur une seule carte
            </p>
          </div>
        </div>

        {/* Right side: Walkability Score Badge & Save Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {summary && (
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-teal-50 via-emerald-50 to-white px-3.5 py-2 rounded-2xl border border-teal-100 shadow-2xs">
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-teal-700 tracking-wider block">
                  Praticité Quartier
                </span>
                <span className="text-xs font-bold text-emerald-950">{summary.scoreLabel}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-mono font-black text-base shadow-sm">
                {summary.walkabilityScore}
              </div>
            </div>
          )}

          {parcel && (
            <button
              type="button"
              onClick={handleSaveCadastreClick}
              className="px-3.5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              {savedCadastre ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cadastre Enregistré !</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>Lier au Mandat</span>
                </>
              )}
            </button>
          )}

          {isLoading && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Chargement...</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. THE SINGLE UNIFIED MASTER MAP (680px Height) */}
      {parcel ? (
        <div className="relative">
          <InteractiveParcelMap
            parcel={parcel}
            height={680}
            amenities={summary?.amenities}
            selectedAmenityId={selectedAmenityId}
            onSelectAmenity={(item) => setSelectedAmenityId(item ? item.id : null)}
            propertyAddress={propertyFullAddress}
            showAmenitiesLayer={showAmenitiesOnMap}
            onToggleAmenitiesLayer={setShowAmenitiesOnMap}
          />
        </div>
      ) : (
        <div className="w-full h-[380px] bg-[#070D1B] rounded-3xl flex flex-col items-center justify-center text-gray-400 border border-[#E2E8F0] space-y-3">
          <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Recherche de la parcelle cadastrale et des commodités IGN en cours...</p>
        </div>
      )}

      {/* 3. Client Profiles Pitch Box & WhatsApp Generator */}
      {summary && currentProfile && (
        <div className="bg-gradient-to-br from-[#0B132B] via-[#131B26] to-[#1F293D] p-5 rounded-3xl text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Argumentaire de Visite selon le Profil Acquéreur
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/10">
              {(['famille', 'actif', 'senior', 'investisseur'] as ClientProfileKey[]).map((key) => {
                const prof = summary.profiles[key];
                const isSelected = selectedProfile === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedProfile(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500 text-white shadow-md font-black'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{prof.emoji}</span>
                    <span>{prof.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
            <p className="text-xs text-amber-100 font-serif italic leading-relaxed">
              {currentProfile.pitch}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px]">
              <span className="text-gray-400">
                🎯 <strong>Cible :</strong> {currentProfile.targetDescription}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Copier pour vos notes de visite"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? 'Pitch copié !' : 'Copier le pitch'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySynthesis}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  title="Générer un résumé WhatsApp/SMS pour l'acquéreur"
                >
                  {copiedSynthesis ? <Check className="w-3.5 h-3.5 text-white" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>{copiedSynthesis ? 'Synthèse copiée !' : 'Fiche WhatsApp / Client'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 8 Key Distances Quick Cards (Click to focus on Master Map & open Google Place sheet) */}
      {summary && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Distances Clés Immédiates</span>
            <span className="text-[10px] text-gray-400 normal-case font-normal">(Cliquez pour afficher sur la carte ci-dessus)</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {/* 1. Supermarché */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.supermarche)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.supermarche?.id
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-amber-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">🛒</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Supermarché</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.supermarche
                    ? summary.minDistances.supermarche.distanceMeters < 1000
                      ? `${summary.minDistances.supermarche.distanceMeters} m`
                      : `${(summary.minDistances.supermarche.distanceMeters / 1000).toFixed(1)} km`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.supermarche?.drivingMinutes ? `${summary.minDistances.supermarche.drivingMinutes} min auto` : ''}
                </span>
              </div>
            </button>

            {/* 2. Supérette */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.superette)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.superette?.id
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-amber-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">🏪</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Supérette</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.superette
                    ? `${summary.minDistances.superette.distanceMeters} m`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.superette?.walkingMinutes ? `${summary.minDistances.superette.walkingMinutes} min à pied` : ''}
                </span>
              </div>
            </button>

            {/* 3. Boulangerie */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.boulangerie)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.boulangerie?.id
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-amber-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">🥖</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Boulangerie</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.boulangerie
                    ? `${summary.minDistances.boulangerie.distanceMeters} m`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.boulangerie?.walkingMinutes ? `${summary.minDistances.boulangerie.walkingMinutes} min à pied` : ''}
                </span>
              </div>
            </button>

            {/* 4. Maternelle */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.maternelle)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.maternelle?.id
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-indigo-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">🧸</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Maternelle</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.maternelle
                    ? `${summary.minDistances.maternelle.distanceMeters} m`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.maternelle?.walkingMinutes ? `${summary.minDistances.maternelle.walkingMinutes} min à pied` : ''}
                </span>
              </div>
            </button>

            {/* 5. Primaire */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.primaire)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.primaire?.id
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-indigo-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">🎒</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Primaire</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.primaire
                    ? `${summary.minDistances.primaire.distanceMeters} m`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.primaire?.walkingMinutes ? `${summary.minDistances.primaire.walkingMinutes} min à pied` : ''}
                </span>
              </div>
            </button>

            {/* 6. Collège */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.college)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.college?.id
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-indigo-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">🎓</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Collège</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.college
                    ? `${(summary.minDistances.college.distanceMeters / 1000).toFixed(1)} km`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.college?.drivingMinutes ? `${summary.minDistances.college.drivingMinutes} min` : ''}
                </span>
              </div>
            </button>

            {/* 7. Sport */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.sport)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.sport?.id
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-emerald-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">⚽</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Sports</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.sport
                    ? `${summary.minDistances.sport.distanceMeters} m`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.sport?.walkingMinutes ? `${summary.minDistances.sport.walkingMinutes} min` : ''}
                </span>
              </div>
            </button>

            {/* 8. Pharmacie */}
            <button
              type="button"
              onClick={() => handleSelectKeyAmenity(summary.minDistances.pharmacie)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedAmenityId === summary.minDistances.pharmacie?.id
                  ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                  : 'bg-gray-50/80 hover:bg-rose-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs">💊</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">Pharmacie</span>
                <span className="text-xs font-bold text-[#131B26] block">
                  {summary.minDistances.pharmacie
                    ? `${summary.minDistances.pharmacie.distanceMeters} m`
                    : 'N/A'}
                </span>
                <span className="text-[9px] text-gray-500">
                  {summary.minDistances.pharmacie?.walkingMinutes ? `${summary.minDistances.pharmacie.walkingMinutes} min` : ''}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 5. Lower Two-Column Section: Category List of Amenities (Left) + Parcel Technical Specs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2 border-t border-gray-100">
        {/* Left Column (col-span-7): Filterable List of Amenities */}
        <div className="lg:col-span-7 space-y-3">
          {summary && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Tous ({summary.totalCount})
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('education')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    selectedCategory === 'education'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Écoles ({summary.byCategory.education.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('commerce')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    selectedCategory === 'commerce'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Commerces ({summary.byCategory.commerce.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('sport')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    selectedCategory === 'sport'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <span>⚽</span>
                  <span>Sports ({summary.byCategory.sport.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('sante')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    selectedCategory === 'sante'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Santé ({summary.byCategory.sante.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('transport')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    selectedCategory === 'transport'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>Transports ({summary.byCategory.transport.length})</span>
                </button>
              </div>

              <span className="text-[11px] text-gray-400">
                {filteredAmenities.length} commodité{filteredAmenities.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredAmenities.map((item) => {
              const isSelected = item.id === selectedAmenityId;
              const config = CATEGORY_CONFIG[item.category];

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setShowAmenitiesOnMap(true);
                    setSelectedAmenityId(item.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                      : 'bg-gray-50/50 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl p-1.5 rounded-xl bg-white shadow-2xs border border-gray-100">
                        {config.emoji}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.bgBadge}`}>
                            {item.subtypeLabel}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs text-[#131B26] mt-1">{item.name}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[11px] text-gray-500">{item.address}</p>
                          {item.isAddressCertified && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0"
                              title="Adresse officielle certifiée Base Adresse Nationale (BAN)"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Certifiée BAN</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Distance Badge */}
                    <div className="text-right whitespace-nowrap">
                      <span className="text-xs font-mono font-black text-[#131B26] block">
                        {item.distanceMeters < 1000
                          ? `${item.distanceMeters} m`
                          : `${(item.distanceMeters / 1000).toFixed(1)} km`}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        {item.walkingMinutes} min à pied
                      </span>
                      <span className="text-[9px] text-gray-400 block">
                        {item.drivingMinutes} min auto
                      </span>
                    </div>
                  </div>

                  {/* Footer when Selected */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between gap-2 text-xs">
                      <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Centré sur la carte ci-dessus</span>
                      </span>

                      <a
                        href={
                          item.googleMapsDirectionsUrl ||
                          `https://www.google.com/maps/dir/?api=1&origin=${summary?.center.lat},${summary?.center.lon}&destination=${item.lat},${item.lon}&travelmode=${item.distanceMeters <= 1200 ? 'walking' : 'driving'}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Itinéraire Google Maps au départ de l'adresse du bien"
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#131B26] hover:bg-gray-800 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                      >
                        <Navigation className="w-3 h-3 text-teal-400" />
                        <span>Itinéraire depuis le bien</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (col-span-5): Technical Parcel Specs Grid */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-gray-200 rounded-3xl p-4 bg-gray-50/50 space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-200/60 pb-2">
              <Compass className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#131B26]">
                Caractéristiques Foncières &amp; Cadastrales
              </h4>
            </div>

            {parcel ? (
              <ParcelSpecsGrid property={property} parcel={parcel} />
            ) : (
              <div className="text-xs text-gray-400 p-4 text-center">
                Chargement des données parcellaires...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
