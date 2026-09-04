'use client';

import Image from 'next/image';
import { Home, Palette, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
    THEME_STYLES,
    type ColorTheme,
    type LayoutFormat,
    type PhotoArrangement,
    type QrDestination
} from './flyer-types';

interface FlyerControlPanelProps {
    properties: Property[];
    selectedPropertyId: string;
    onSelectProperty: (id: string) => void;
    flyerFormat: LayoutFormat;
    setFlyerFormat: (v: LayoutFormat) => void;
    photoArrangement: PhotoArrangement;
    setPhotoArrangement: (v: PhotoArrangement) => void;
    colorTheme: ColorTheme;
    setColorTheme: (v: ColorTheme) => void;
    showQrCode: boolean;
    setShowQrCode: (v: boolean) => void;
    qrDestination: QrDestination;
    setQrDestination: (v: QrDestination) => void;
    availableImages: NonNullable<Property['images']>;
    activeSlot: number;
    setActiveSlot: (v: number) => void;
    isGalleryOpen: boolean;
    setIsGalleryOpen: (v: boolean) => void;
    getPhotoUrl: (slotIndex: number) => string;
}

const FORMAT_OPTIONS: { key: LayoutFormat; label: string; icon: string; iconClass: string }[] = [
    { key: 'A4_landscape', label: 'A4 Paysage', icon: 'LED', iconClass: 'w-5 h-3.5' },
    { key: 'A4_portrait', label: 'A4 Portrait', icon: 'A4', iconClass: 'w-3.5 h-5' },
    { key: 'A3_landscape', label: 'A3 Grand Vitrine', icon: 'A3', iconClass: 'w-6 h-4' },
    { key: 'social_square', label: 'Carré Post 1:1', icon: '1:1', iconClass: 'w-4 h-4' },
    { key: 'story_vertical', label: 'Story Insta 9:16', icon: '9:16', iconClass: 'w-3 h-5' }
];

const ARRANGEMENT_OPTIONS: { key: PhotoArrangement; label: string; colSpan?: string }[] = [
    { key: 'hero_only', label: '1 Solo Hero' },
    { key: 'split_2', label: '2 Photos Split' },
    { key: 'standard_3', label: '3 Photos Classique' },
    { key: 'grid_4', label: '4 Photos Grille' },
    { key: 'mosaic_5', label: '5 Photos Mosaïque Prestige', colSpan: 'col-span-2' }
];

const THEME_OPTIONS: { key: ColorTheme; label: string; dot: string; activeClass: string }[] = [
    { key: 'nellimo', label: "Nell'Immo Rose", dot: 'bg-[#E12B7B]', activeClass: 'border-[#E12B7B] bg-[#FDF2F8] text-[#E12B7B]' },
    { key: 'gold', label: 'Or Prestige', dot: 'bg-[#C59A45]', activeClass: 'border-[#C59A45] bg-[#FAF6EE] text-[#C59A45]' },
    { key: 'minimal', label: 'Noir Minimal', dot: 'bg-zinc-900', activeClass: 'border-zinc-900 bg-zinc-100 text-zinc-900' },
    { key: 'provence', label: 'Bleu Azur', dot: 'bg-[#0284C7]', activeClass: 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7]' },
    { key: 'terracotta', label: 'Terracotta', dot: 'bg-[#C05621]', activeClass: 'border-[#C05621] bg-[#FFFAF0] text-[#C05621]' },
    { key: 'dark_led', label: 'Nuit LED Sombre', dot: 'bg-[#F43F5E]', activeClass: 'border-[#F43F5E] bg-gray-900 text-white' }
];

export function FlyerControlPanel({
    properties,
    selectedPropertyId,
    onSelectProperty,
    flyerFormat,
    setFlyerFormat,
    photoArrangement,
    setPhotoArrangement,
    colorTheme,
    setColorTheme,
    showQrCode,
    setShowQrCode,
    qrDestination,
    setQrDestination,
    availableImages,
    activeSlot,
    setActiveSlot,
    isGalleryOpen,
    setIsGalleryOpen,
    getPhotoUrl
}: FlyerControlPanelProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
            {/* 1. Property, Format & Layout */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
                        Choisir le Bien ({properties.length} disponibles)
                    </label>
                    <select
                        value={selectedPropertyId}
                        onChange={(e) => onSelectProperty(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    >
                        {properties.map((p) => (
                            <option key={p.id} value={p.id}>
                                {formatMandateRef(p.mandate_number)} - {p.title} ({p.city}) - {p.price_fai.toLocaleString('fr-FR')} €
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                        Format d’Affichage
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {FORMAT_OPTIONS.map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setFlyerFormat(opt.key)}
                                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${flyerFormat === opt.key
                                    ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <div className={`${opt.iconClass} border border-current rounded-2xs flex items-center justify-center shrink-0`}>
                                    <span className="text-[6px]">{opt.icon}</span>
                                </div>
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                        Agencement Photos
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                        {ARRANGEMENT_OPTIONS.map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setPhotoArrangement(opt.key)}
                                className={`p-2 rounded-xl border text-center transition cursor-pointer ${opt.colSpan || ''} ${photoArrangement === opt.key ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Color Themes & QR Code Destination */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-[#E12B7B]" />
                    Ambiance Graphique ({Object.keys(THEME_STYLES).length} Thèmes)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {THEME_OPTIONS.map((opt) => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setColorTheme(opt.key)}
                            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${colorTheme === opt.key ? opt.activeClass : 'border-gray-200 bg-gray-50 text-gray-700'
                                }`}
                        >
                            <span className={`w-3.5 h-3.5 rounded-full ${opt.dot}`} />
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="pt-2 space-y-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showQrCode}
                                onChange={(e) => setShowQrCode(e.target.checked)}
                                className="rounded text-[#E12B7B] accent-[#E12B7B]"
                            />
                            <span>Activer QR Code</span>
                        </label>

                        <span className="text-[10px] uppercase font-bold text-gray-400">Destination</span>
                    </div>

                    {showQrCode && (
                        <select
                            value={qrDestination}
                            onChange={(e) => setQrDestination(e.target.value as QrDestination)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                        >
                            <option value="web">🌐 Fiche Web Publique Nell’Immo</option>
                            <option value="whatsapp">💬 WhatsApp Direct Nelly (avec message)</option>
                            <option value="visite360">🕶️ Visite Virtuelle 360° / Vidéo</option>
                            <option value="google_review">⭐ Déposer un Avis Google</option>
                            <option value="gps">📍 Itinéraire Google Maps</option>
                        </select>
                    )}
                </div>
            </div>

            {/* 3. Slot Photo Manager */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-[#E12B7B]" />
                        Emplacements Photos (Actif: #{activeSlot + 1})
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                        className="text-xs font-bold text-[#E12B7B] hover:text-[#C71B62] transition flex items-center gap-1 cursor-pointer"
                    >
                        {isGalleryOpen ? 'Replier' : `Dérouler (${availableImages.length})`}
                        {isGalleryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4].map((slot) => {
                        const url = getPhotoUrl(slot);
                        const isActive = activeSlot === slot;

                        return (
                            <div
                                key={slot}
                                onClick={() => {
                                    setActiveSlot(slot);
                                    setIsGalleryOpen(true);
                                }}
                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer group bg-gray-100 ${isActive ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Image src={url} alt="" fill sizes="(max-width: 768px) 33vw, 120px" className="object-cover" />
                                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] font-bold py-0.5 text-center truncate">
                                    #{slot + 1}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <p className="text-[11px] text-gray-500 bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
                    Cliquez sur un emplacement ci-dessus puis sur une photo de la galerie pour l’affecter.
                </p>
            </div>
        </div>
    );
}
