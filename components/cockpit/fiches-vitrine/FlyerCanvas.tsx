'use client';

import Image from 'next/image';
import { MapPin, Check } from 'lucide-react';
import type { Property } from '@/lib/types';
import {
    getBadgeText,
    getQrLabel,
    type LayoutFormat,
    type PhotoArrangement,
    type BadgePreset,
    type QrDestination,
    type FlyerTheme
} from './flyer-types';

interface FlyerCanvasProps {
    property: Property;
    mandateRef: string;
    flyerFormat: LayoutFormat;
    currentTheme: FlyerTheme;
    photoArrangement: PhotoArrangement;
    badgePreset: BadgePreset;
    customBadgeText: string;
    customBadgeColor: string;
    showQrCode: boolean;
    qrDestination: QrDestination;
    qrCodeImageUrl: string;
    displayTitle: string;
    displaySubtitle: string;
    getPhotoUrl: (slotIndex: number) => string;
}

function PhotoArrangementBlock({
    arrangement,
    getPhotoUrl
}: {
    arrangement: PhotoArrangement;
    getPhotoUrl: (slotIndex: number) => string;
}) {
    if (arrangement === 'hero_only') {
        return (
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 100vw, 780px" className="object-cover" priority />
            </div>
        );
    }

    if (arrangement === 'split_2') {
        return (
            <div className="grid grid-cols-2 gap-3 aspect-16/9 w-full">
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                    <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" priority />
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                    <Image src={getPhotoUrl(1)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" />
                </div>
            </div>
        );
    }

    if (arrangement === 'standard_3') {
        return (
            <div className="grid grid-cols-3 gap-3 aspect-16/9 w-full">
                <div className="relative col-span-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                    <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 66vw, 500px" className="object-cover" priority />
                </div>
                <div className="space-y-3 flex flex-col justify-between">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={getPhotoUrl(1)} alt="" fill sizes="(max-width: 780px) 33vw, 250px" className="object-cover" />
                    </div>
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={getPhotoUrl(2)} alt="" fill sizes="(max-width: 780px) 33vw, 250px" className="object-cover" />
                    </div>
                </div>
            </div>
        );
    }

    if (arrangement === 'grid_4') {
        return (
            <div className="grid grid-cols-2 gap-3 aspect-16/9 w-full">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={getPhotoUrl(i)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" priority={i === 0} />
                    </div>
                ))}
            </div>
        );
    }

    // mosaic_5
    return (
        <div className="grid grid-cols-4 gap-2.5 aspect-16/9 w-full">
            <div className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" priority />
            </div>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={getPhotoUrl(i)} alt="" fill sizes="(max-width: 780px) 25vw, 190px" className="object-cover" />
                </div>
            ))}
        </div>
    );
}

export function FlyerCanvas({
    property,
    mandateRef,
    flyerFormat,
    currentTheme,
    photoArrangement,
    badgePreset,
    customBadgeText,
    customBadgeColor,
    showQrCode,
    qrDestination,
    qrCodeImageUrl,
    displayTitle,
    displaySubtitle,
    getPhotoUrl
}: FlyerCanvasProps) {
    const badgeText = getBadgeText(badgePreset, customBadgeText, property);

    const sizeClass =
        flyerFormat === 'A4_portrait'
            ? 'max-w-[780px] min-h-[1020px]'
            : flyerFormat === 'social_square'
                ? 'max-w-[650px] aspect-square'
                : flyerFormat === 'story_vertical'
                    ? 'max-w-[450px] min-h-[780px]'
                    : 'max-w-5xl aspect-[1.414/1]';

    return (
        <div className="flex justify-center">
            <div
                className={`print-flyer-target rounded-3xl p-8 sm:p-10 shadow-2xl w-full border-2 transition-all flex flex-col justify-between ${currentTheme.bgWrapper
                    } ${currentTheme.textColor} ${sizeClass}`}
                style={{ borderColor: currentTheme.primary }}
            >
                {/* Header Brand */}
                <div className="flex items-center justify-between border-b-2 pb-4" style={{ borderColor: currentTheme.primary }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-2xl text-white font-serif font-black text-2xl flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            N
                        </div>
                        <div>
                            <span className="text-xl font-serif font-black tracking-tight block leading-tight">
                                NELL&rsquo;IMMO IMMOBILIER
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest block" style={{ color: currentTheme.primary }}>
                                Pélissanne & Pays Salonais &bull; 07 55 68 61 09 &bull; www.nellimmo.fr
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`text-xs font-mono font-bold ${currentTheme.subText}`}>Réf. {mandateRef}</span>
                        <span
                            className="block text-xs font-black uppercase px-3 py-1 rounded-full text-white mt-1 shadow-xs"
                            style={{ backgroundColor: badgePreset === 'custom' ? customBadgeColor : currentTheme.primary }}
                        >
                            {badgeText}
                        </span>
                    </div>
                </div>

                {/* Dynamic Photo Arrangement */}
                <div className="my-4 flex-1 flex flex-col justify-center">
                    <PhotoArrangementBlock arrangement={photoArrangement} getPhotoUrl={getPhotoUrl} />
                </div>

                {/* Title & Price Header */}
                <div className="flex items-end justify-between gap-4 border-b pb-3 border-gray-200/50">
                    <div className="space-y-0.5 max-w-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{displaySubtitle}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-black leading-tight line-clamp-2">
                            {displayTitle}
                        </h2>
                    </div>

                    <div className="text-right shrink-0">
                        <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight" style={{ color: currentTheme.primary }}>
                            {property.price_fai.toLocaleString('fr-FR')} € FAI
                        </div>
                        <span className={`text-[10px] font-medium block ${currentTheme.subText}`}>
                            Honoraires charge {property.fees_paid_by}
                        </span>
                    </div>
                </div>

                {/* Key Metrics 3 Pillars */}
                <div className="grid grid-cols-3 gap-3 my-3 text-center">
                    <div className={`p-2.5 rounded-2xl ${currentTheme.cardBg}`}>
                        <span className={`text-[9px] font-bold uppercase block ${currentTheme.subText}`}>Surface Habitable</span>
                        <span className="text-base font-black">{property.living_area} m²</span>
                    </div>
                    <div className={`p-2.5 rounded-2xl ${currentTheme.cardBg}`}>
                        <span className={`text-[9px] font-bold uppercase block ${currentTheme.subText}`}>Pièces / Chambres</span>
                        <span className="text-base font-black">{property.rooms_count}p • {property.bedrooms_count}ch</span>
                    </div>
                    <div className={`p-2.5 rounded-2xl ${currentTheme.cardBg}`}>
                        <span className={`text-[9px] font-bold uppercase block ${currentTheme.subText}`}>Terrain / Extérieur</span>
                        <span className="text-base font-black">{property.land_area ? `${property.land_area} m²` : 'Jardin / Cour'}</span>
                    </div>
                </div>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {property.features?.slice(0, 5).map((feat, i) => (
                        <span
                            key={i}
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${currentTheme.cardBg}`}
                        >
                            <Check className="w-3 h-3" style={{ color: currentTheme.primary }} />
                            {feat}
                        </span>
                    ))}
                </div>

                {/* Footer with QR Code */}
                <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200/50">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold block">
                            Conseillère Dédiée : Nelly FERNANDEZ &bull; SASU Nell&rsquo;Immo
                        </span>
                        <div className={`flex items-center gap-3 text-[11px] font-semibold ${currentTheme.subText}`}>
                            <span className="flex items-center gap-1">📞 07 55 68 61 09</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">✉️ nellimmo.acte@gmail.com</span>
                        </div>
                    </div>

                    {showQrCode && (
                        <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-2xs border border-gray-200">
                            <Image src={qrCodeImageUrl} alt="QR Code" width={220} height={220} className="w-9 h-9 rounded" />
                            <div className="text-[8px] font-bold text-gray-700 leading-tight">
                                <span>Scannez pour</span><br />
                                <span style={{ color: currentTheme.primary }}>
                                    {getQrLabel(qrDestination)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
