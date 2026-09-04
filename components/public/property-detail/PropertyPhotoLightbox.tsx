'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Property, PropertyImage } from '@/lib/types';

interface PropertyPhotoLightboxProps {
  property: Property;
  images: PropertyImage[];
  selectedPhotoIndex: number;
  currentPhoto: string;
  onSelectPhoto: (index: number) => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  onClose: () => void;
}

export function PropertyPhotoLightbox({
  property,
  images,
  selectedPhotoIndex,
  currentPhoto,
  onSelectPhoto,
  onPrevPhoto,
  onNextPhoto,
  onClose,
}: PropertyPhotoLightboxProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white truncate max-w-xl">
            {property.title}
          </h3>
          <span className="text-xs text-gray-400">
            Photo {selectedPhotoIndex + 1} sur {images.length} • {property.city}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
          aria-label="Fermer le plein écran"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Image Container */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <div className="relative w-full h-full max-h-[75vh] max-w-full">
          <Image
            src={currentPhoto}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain rounded-2xl shadow-2xl transition-transform duration-300"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={onPrevPhoto}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-2xl cursor-pointer"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={onNextPhoto}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-2xl cursor-pointer"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnails */}
      <div className="flex justify-center gap-2 overflow-x-auto py-2">
        {images.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => onSelectPhoto(idx)}
            className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition ${
              selectedPhotoIndex === idx
                ? 'border-[#E12B7B] scale-110'
                : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <Image src={img.image_url} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
