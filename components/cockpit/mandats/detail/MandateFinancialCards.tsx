'use client';

import React from 'react';
import type { Property } from '@/lib/types';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface MandateFinancialCardsProps {
  property: Property;
}

export function MandateFinancialCards({ property }: MandateFinancialCardsProps) {
  return (
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
  );
}
