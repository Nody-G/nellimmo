'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { Property, PropertyImage } from '@/lib/types';
import { PropertyPhotoLightbox } from './PropertyPhotoLightbox';

interface PropertyPhotoGalleryProps {
    property: Property;
    images: PropertyImage[];
    selectedPhotoIndex: number;
    onSelectPhoto: (index: number) => void;
    isLightboxOpen: boolean;
    onToggleLightbox: (open: boolean) => void;
}

/**
 * Galerie photos du bien : vue principale, vignettes, navigation clavier et
 * lightbox plein écran. L'index de photo sélectionné est contrôlé par le parent
 * (afin que la barre de contact flottante affiche la même photo courante).
 */
export function PropertyPhotoGallery({
    property,
    images,
    selectedPhotoIndex,
    onSelectPhoto,
    isLightboxOpen,
    onToggleLightbox,
}: PropertyPhotoGalleryProps) {
    const currentPhoto = images[selectedPhotoIndex]?.image_url || images[0].image_url;

    const handleNextPhoto = useCallback(() => {
        onSelectPhoto((selectedPhotoIndex + 1) % images.length);
    }, [selectedPhotoIndex, images.length, onSelectPhoto]);

    const handlePrevPhoto = useCallback(() => {
        onSelectPhoto((selectedPhotoIndex - 1 + images.length) % images.length);
    }, [selectedPhotoIndex, images.length, onSelectPhoto]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'ArrowRight') handleNextPhoto();
            if (e.key === 'ArrowLeft') handlePrevPhoto();
            if (e.key === 'Escape') onToggleLightbox(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, handleNextPhoto, handlePrevPhoto, onToggleLightbox]);

    return (
        <div className="space-y-4">
            {/* Main Photo Viewport */}
            <div
                className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden bg-gray-950 shadow-2xl group cursor-pointer"
                onClick={() => onToggleLightbox(true)}
            >
                <Image
                    src={currentPhoto}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                    priority
                />

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Prev / Next buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevPhoto();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center backdrop-blur-md shadow-xl transition opacity-90 group-hover:opacity-100 cursor-pointer"
                            aria-label="Photo précédente"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNextPhoto();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center backdrop-blur-md shadow-xl transition opacity-90 group-hover:opacity-100 cursor-pointer"
                            aria-label="Photo suivante"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Lightbox Trigger Button bottom left */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLightbox(true);
                    }}
                    className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 transition shadow-lg cursor-pointer"
                >
                    <Expand className="w-3.5 h-3.5" />
                    <span>Plein Écran ({images.length} photos)</span>
                </button>

                {/* Photo Counter bottom right */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                    {selectedPhotoIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails Tray */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                        <button
                            key={img.id || idx}
                            onClick={() => onSelectPhoto(idx)}
                            className={`relative w-24 sm:w-28 h-16 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${selectedPhotoIndex === idx
                                ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30 scale-102 shadow-md'
                                : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image src={img.image_url} alt="" fill sizes="112px" className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Immersive Lightbox Modal */}
            {isLightboxOpen && (
                <PropertyPhotoLightbox
                    property={property}
                    images={images}
                    selectedPhotoIndex={selectedPhotoIndex}
                    currentPhoto={currentPhoto}
                    onSelectPhoto={onSelectPhoto}
                    onPrevPhoto={handlePrevPhoto}
                    onNextPhoto={handleNextPhoto}
                    onClose={() => onToggleLightbox(false)}
                />
            )}
        </div>
    );
}
