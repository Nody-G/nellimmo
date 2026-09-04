'use client';

import Image from 'next/image';
import { Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import type { Property } from '@/lib/types';

interface FlyerGalleryProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    availableImages: NonNullable<Property['images']>;
    activeSlot: number;
    onAssignPhoto: (photoIndex: number, slot: number) => void;
}

export function FlyerGallery({ isOpen, setIsOpen, availableImages, activeSlot, onAssignPhoto }: FlyerGalleryProps) {
    return (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F3E8EE] shadow-2xs print:hidden transition-all">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-sm text-[#131B26] group-hover:text-[#E12B7B] transition flex items-center gap-2">
                            <span>Galerie Complète des Photos du Bien</span>
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                {availableImages.length} photos
                            </span>
                        </h3>
                        <p className="text-xs text-gray-500">
                            {isOpen ? `Affectation en cours sur l'Emplacement #${activeSlot + 1}` : "Dérouler pour changer les photos de l'affiche"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#E12B7B]">
                    <span>{isOpen ? 'Masquer' : 'Dérouler la galerie'}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[320px] overflow-y-auto pr-1">
                        {availableImages.map((img, idx) => (
                            <div
                                key={img.id || idx}
                                onClick={() => onAssignPhoto(idx, activeSlot)}
                                className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#E12B7B] transition cursor-pointer group bg-gray-100"
                            >
                                <Image src={img.image_url} alt="" fill sizes="(max-width: 768px) 25vw, 120px" className="object-cover" />
                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                                    #{idx + 1}
                                </span>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-white bg-[#E12B7B] px-1.5 py-0.5 rounded">
                                        Affecter à #{activeSlot + 1}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
