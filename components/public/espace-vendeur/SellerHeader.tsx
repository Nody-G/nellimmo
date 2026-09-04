'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { MapPin, Sparkles, Share2, MessageCircle, Check } from 'lucide-react';

interface SellerHeaderProps {
  property: Property;
  mandateRef: string;
  daysRemaining: number;
  copiedLink: boolean;
  onCopyShareLink: () => void;
  whatsappUrl: string;
}

export function SellerHeader({
  property,
  mandateRef,
  daysRemaining,
  copiedLink,
  onCopyShareLink,
  whatsappUrl,
}: SellerHeaderProps) {
  return (
    <>
      {/* Top Banner Agence */}
      <header className="bg-[#131B26] text-white py-4 border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-serif font-black text-lg shadow-xs">
              N
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight block leading-none">
                NELL&apos;IMMO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C59A45]">
                Espace Propriétaire Privé
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onCopyShareLink}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Copier le lien d'accès"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-semibold">Partager</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Nelly</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Mandat & Bien */}
      <section className="bg-white border-b border-[#F3E8EE] pt-8 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FDF2F8] text-[#E12B7B] border border-[#F3E8EE]">
                  {mandateRef}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    property.mandate_type === 'exclusif'
                      ? 'bg-[#FCFAF7] text-[#C59A45] border border-[#C59A45]/30'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  ★ Mandat {property.mandate_type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Commercialisation Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#131B26]">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
                <span>
                  {property.address}, {property.postal_code} {property.city}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-3xl border border-[#F3E8EE] flex items-center gap-6 self-start md:self-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Prix de Présentation FAI
                </span>
                <span className="text-2xl font-serif font-black text-[#131B26]">
                  {property.price_fai.toLocaleString('fr-FR')} €
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Net vendeur : {property.price_net_seller.toLocaleString('fr-FR')} €
                </span>
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Échéance du Mandat
                </span>
                <span className="text-lg font-bold text-[#E12B7B] block">
                  {daysRemaining} jours restants
                </span>
                <span className="text-[10px] text-gray-400 block">
                  Valable jusqu&apos;au {new Date(property.mandate_end_date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div className="md:col-span-2 relative aspect-16/10 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <Image
                src={
                  property.images?.[0]?.image_url ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                }
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
                Photo Principale de Diffusion
              </span>
            </div>

            <div className="grid grid-cols-2 md:col-span-2 gap-3">
              {(property.images?.slice(1, 5) || []).map((img, i) => (
                <div
                  key={img.id || i}
                  className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 shadow-2xs"
                >
                  <Image src={img.image_url} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
