'use client';

import React from 'react';
import Image from 'next/image';
import { Camera, CheckCircle2 } from 'lucide-react';
import type { Property, AgencySettings } from '@/lib/types';
import { SocialBadge } from './social-types';

interface InstagramGridPreviewProps {
  currentProperty: Property;
  allProperties: Property[];
  settings: AgencySettings;
  activeBadge: SocialBadge;
}

export function InstagramGridPreview({
  currentProperty,
  allProperties,
  settings,
}: InstagramGridPreviewProps) {
  // Grille 3x3 : 1er slot = bien en cours, les 8 suivants = autres biens
  const otherProps = allProperties.filter((p) => p.id !== currentProperty.id);
  const gridProperties = [currentProperty, ...otherProps].slice(0, 9);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
              Harmonie Graphique
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>Grille Feed 3x3 Profil</span>
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
            Aperçu Esthétique du Compte Instagram
          </h3>
          <p className="text-xs text-gray-500">
            Vérifiez l’équilibre visuel de vos publications avant mise en ligne.
          </p>
        </div>
      </div>

      {/* Mock Profile Header */}
      <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shrink-0">
          <div className="w-full h-full bg-[#131B26] rounded-full flex items-center justify-center font-bold text-xs text-white">
            NELL
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-gray-900">
              {settings.instagram_business_id ? `@${settings.instagram_business_id}` : '@nellimmo_provence'}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
          </div>
          <div className="text-[11px] text-gray-600 font-medium">
            <strong>{allProperties.length + 42}</strong> publications • <strong>1 850</strong> abonnés
          </div>
          <p className="text-[10px] text-gray-500 line-clamp-1">
            Immobilier d’exception en Provence • Pélissanne & Pays Salonais
          </p>
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1.5 bg-gray-100 p-2 rounded-2xl border border-gray-200">
        {gridProperties.map((p, idx) => {
          const isCurrent = idx === 0;
          const photo =
            p.images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';

          return (
            <div
              key={p.id + idx}
              className={`relative aspect-square overflow-hidden rounded-lg group ${
                isCurrent ? 'ring-2 ring-[#E12B7B] shadow-md' : ''
              }`}
            >
              <Image
                src={photo}
                alt={p.title}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition" />

              {/* Tag for current */}
              {isCurrent ? (
                <div className="absolute top-1 left-1">
                  <span className="px-1.5 py-0.5 bg-[#E12B7B] text-white rounded text-[8px] font-black uppercase">
                    PROJET
                  </span>
                </div>
              ) : null}

              <div className="absolute bottom-1 left-1 right-1 text-white text-[9px] font-bold truncate">
                {p.city}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
