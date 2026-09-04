'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Eye } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface FavoriteItemCardProps {
  property: Property;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export const FavoriteItemCard: React.FC<FavoriteItemCardProps> = ({
  property,
  onClose,
  onRemove
}) => {
  const coverImage =
    property.images?.find((img) => img.is_cover)?.image_url ||
    property.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
  const mandateRef = formatMandateRef(property.mandate_number);

  return (
    <div className="p-3 bg-white rounded-2xl border border-[#F3E8EE] hover:border-[#E12B7B]/40 shadow-xs hover:shadow-md transition-all group flex gap-3.5 items-center relative">
      {/* Property Image Thumbnail */}
      <Link
        href={`/biens/${property.id}`}
        onClick={onClose}
        className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 relative bg-gray-100 block"
      >
        <Image
          src={coverImage}
          alt={property.title}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-108 transition-transform duration-300"
        />
      </Link>

      {/* Property Summary */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
            Réf. {mandateRef}
          </span>
          <button
            type="button"
            onClick={() => onRemove(property.id)}
            className="text-gray-400 hover:text-rose-600 transition p-1 rounded-full hover:bg-rose-50 cursor-pointer"
            title="Retirer ce bien des favoris"
            aria-label={`Retirer ${property.title} des favoris`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Link
          href={`/biens/${property.id}`}
          onClick={onClose}
          className="block font-bold text-xs sm:text-sm text-[#131B26] hover:text-[#E12B7B] transition truncate leading-snug"
        >
          {property.title}
        </Link>

        <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
          <span>{property.living_area} m²</span>
          <span>•</span>
          <span>{property.bedrooms_count} ch.</span>
          <span>•</span>
          <span className="font-semibold text-gray-700">{property.city}</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="font-serif font-black text-xs sm:text-sm text-[#E12B7B]">
            {property.price_fai.toLocaleString('fr-FR')} € <span className="text-[9px] font-sans font-normal text-gray-400">FAI</span>
          </div>
          <Link
            href={`/biens/${property.id}`}
            onClick={onClose}
            className="text-[11px] font-bold text-gray-600 hover:text-[#E12B7B] flex items-center gap-0.5 transition"
          >
            <Eye className="w-3 h-3" />
            <span>Voir</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
