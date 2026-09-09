'use client';

import React, { useState, useEffect } from 'react';
import type { Property } from '@/lib/types';
import {
  AmenityCategory,
  AmenityItem,
  NeighborhoodSummary,
  CATEGORY_CONFIG,
} from '@/lib/amenities';
import { NeighborhoodAmenitiesMap } from './NeighborhoodAmenitiesMap';
import {
  MapPin,
  Navigation,
  ExternalLink,
  GraduationCap,
  ShoppingCart,
  HeartPulse,
  Compass,
  Bus,
  CheckCircle2,
} from 'lucide-react';

interface NeighborhoodAmenitiesAssistantProps {
  property: Property;
}

export function NeighborhoodAmenitiesAssistant({ property }: NeighborhoodAmenitiesAssistantProps) {
  const [summary, setSummary] = useState<NeighborhoodSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | AmenityCategory>('all');
  const [selectedAmenityId, setSelectedAmenityId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAmenities() {
      setLoading(true);
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
          // Sélectionner par défaut la première école ou le premier commerce
          if (json.data.minDistances?.primaire) {
            setSelectedAmenityId(json.data.minDistances.primaire.id);
          } else if (json.data.amenities?.length > 0) {
            setSelectedAmenityId(json.data.amenities[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement commodités:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAmenities();
    return () => {
      isMounted = false;
    };
  }, [property.latitude, property.longitude, property.address, property.postal_code, property.city]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <h4 className="text-sm font-bold text-[#131B26]">Analyse du Quartier &amp; des Commodités en cours...</h4>
          <p className="text-xs text-gray-500 mt-1">
            Calcul des distances réelles vers les écoles, commerces, terrains de sport et transports
          </p>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  // Filtrer les commodités selon la catégorie sélectionnée
  const filteredAmenities =
    selectedCategory === 'all'
      ? summary.amenities
      : summary.byCategory[selectedCategory] || [];

  // Clic sur une des cartes de synthèse rapide
  const handleSelectKeyAmenity = (item?: AmenityItem) => {
    if (!item) return;
    setSelectedAmenityId(item.id);
    setSelectedCategory('all');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#2A374A] shadow-xs space-y-6">
      {/* 1. Header & Score Global */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Assistant Quartier &amp; Commodités
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Radar Vivant
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Distances minimales exactes, trajets à pied et argumentaires croisés selon vos acquéreurs
            </p>
          </div>
        </div>

        {/* Walkability Score Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 via-emerald-50 to-white px-4 py-2.5 rounded-2xl border border-teal-100 shadow-2xs">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
              Praticité Quartier
            </span>
            <span className="text-xs font-bold text-emerald-950">{summary.scoreLabel}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-mono font-black text-lg shadow-md">
            {summary.walkabilityScore}
          </div>
        </div>
      </div>



      {/* 3. Synthèse des Distances Minimales Clés (8 Blocs Rapides) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
          <span>⚡</span>
          <span>Distances Minimales aux Commodités Indispensables</span>
          <span className="text-[10px] text-gray-400 normal-case font-normal">(Cliquez pour localiser)</span>
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

      {/* 4. Vue Croisée: Liste Complète + Carte Interactive Synchronisée */}
      <div className="space-y-3 pt-2">
        {/* Category Tabs */}
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
              <span>Sports &amp; Parcs ({summary.byCategory.sport.length})</span>
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
            {filteredAmenities.length} commodité{filteredAmenities.length > 1 ? 's' : ''} affichée{filteredAmenities.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Two-column layout: List (Left) + Interactive Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* List Column */}
          <div className="lg:col-span-6 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredAmenities.map((item) => {
              const isSelected = item.id === selectedAmenityId;
              const config = CATEGORY_CONFIG[item.category];

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAmenityId(item.id)}
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

                  {/* Actions Footer if Selected */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between gap-2 text-xs">
                      <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Centré sur la carte</span>
                      </span>

                      <a
                        href={
                          item.googleMapsDirectionsUrl ||
                          `https://www.google.com/maps/dir/?api=1&origin=${summary.center.lat},${summary.center.lon}&destination=${item.lat},${item.lon}&travelmode=${item.distanceMeters <= 1200 ? 'walking' : 'driving'}`
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

          {/* Synchronized Map Column */}
          <div className="lg:col-span-6 sticky top-4">
            <NeighborhoodAmenitiesMap
              centerLat={summary.center.lat}
              centerLon={summary.center.lon}
              amenities={filteredAmenities}
              selectedAmenityId={selectedAmenityId}
              onSelectAmenity={(item) => setSelectedAmenityId(item ? item.id : null)}
              propertyAddress={
                property.address
                  ? `${property.address}, ${property.postal_code || ''} ${property.city || ''}`.trim()
                  : undefined
              }
              height={560}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
