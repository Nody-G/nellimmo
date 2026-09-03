'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/lib/types';
import {
  Euro,
  Home,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DpeBadge } from '@/components/ui/DpeBadge';

interface MandateOverviewTabProps {
  property: Property;
}

export const MandateOverviewTab: React.FC<MandateOverviewTabProps> = ({ property }) => {
  return (
    <div className="space-y-6">
      {/* Financials & Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Prix & Honoraires */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">
              Prix Public FAI
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#131B26]">
              {property.price_fai.toLocaleString('fr-FR')} €
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 text-xs space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Prix net vendeur :</span>
              <strong className="text-gray-900">
                {property.price_net_seller.toLocaleString('fr-FR')} €
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Honoraires agence :</span>
              <strong className="text-[#E12B7B]">
                {property.agency_fees_amount.toLocaleString('fr-FR')} € ({property.agency_fees_percentage}%)
              </strong>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Charge honoraires :</span>
              <span className="capitalize">{property.fees_paid_by}</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Surfaces & Pièces */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">
              Surfaces & Espaces
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#131B26]">
              {property.living_area} m²
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 text-xs space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Surface Carrez :</span>
              <strong className="text-gray-900">{property.carrez_area || property.living_area} m²</strong>
            </div>
            <div className="flex justify-between">
              <span>Terrain :</span>
              <strong className="text-gray-900">{property.land_area ? `${property.land_area} m²` : 'N/A'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Pièces / Chambres :</span>
              <strong className="text-gray-900">
                {property.rooms_count} p. ({property.bedrooms_count} ch.)
              </strong>
            </div>
          </div>
        </Card>

        {/* Card 3: Mandant / Vendeur */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">
              Vendeur Mandant
            </span>
            <div className="text-lg font-bold text-[#131B26] truncate">
              {property.seller_name}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
            <p className="flex items-center gap-1.5 text-gray-700">
              <Phone className="w-3.5 h-3.5 text-[#E12B7B]" />
              <a href={`tel:${property.seller_phone}`} className="hover:underline font-bold">
                {property.seller_phone}
              </a>
            </p>
            {property.seller_email && (
              <p className="flex items-center gap-1.5 text-gray-700 truncate">
                <Mail className="w-3.5 h-3.5 text-[#C59A45]" />
                <a href={`mailto:${property.seller_email}`} className="hover:underline">
                  {property.seller_email}
                </a>
              </p>
            )}
            <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{property.seller_address}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* DPE & Diagnostic preview */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#131B26]">Diagnostic de Performance Énergétique (DPE)</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Consommation primaire et estimation des dépenses énergétiques annuelles
            </p>
          </div>
          <DpeBadge
            dpeLetter={property.dpe_letter}
            dpeValue={property.dpe_value}
            gesLetter={property.ges_letter}
            gesValue={property.ges_value}
            energyCostMin={property.energy_cost_min}
            energyCostMax={property.energy_cost_max}
            compact={false}
          />
        </div>
      </Card>

      {/* Description & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#131B26] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E12B7B]" />
              <span>Descriptif de l&apos;Annonce</span>
            </h3>
            <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
              {property.description}
            </div>
          </Card>

          {/* Photo Gallery */}
          {property.images && property.images.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-bold text-[#131B26] mb-3">
                Galerie Photos ({property.images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl overflow-hidden border border-gray-200 aspect-4/3 group"
                  >
                    <Image
                      src={img.image_url}
                      alt={`Photo ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {img.is_cover && (
                      <span className="absolute top-1.5 left-1.5 bg-[#E12B7B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                        Couverture
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Features Sidebar */}
        <div>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#131B26] mb-3">Prestations Clés</h3>
            <div className="flex flex-wrap gap-1.5">
              {property.features.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#E12B7B]" />
                  {f}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
