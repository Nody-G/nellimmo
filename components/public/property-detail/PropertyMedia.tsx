'use client';

import React from 'react';
import { ExternalLink, PlayCircle, Video } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyMediaProps {
    property: Property;
}

/**
 * Bloc médias : visite vidéo (YouTube / Vimeo / MP4) et visite virtuelle 360°.
 */
export function PropertyMedia({ property }: PropertyMediaProps) {
    if (!property.video_url && !property.virtual_tour_url) return null;

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                        Médias
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#131B26] flex items-center gap-2 mt-0.5">
                        <Video className="w-5 h-5 text-[#E12B7B]" />
                        Visite Vidéo & 360°
                    </h3>
                </div>
            </div>

            {property.video_url && (
                <div className="space-y-2">
                    <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black shadow-lg border border-gray-800">
                        {property.video_url.includes('youtube') || property.video_url.includes('youtu.be') ? (
                            <iframe
                                src={
                                    property.video_url.includes('watch?v=')
                                        ? property.video_url.replace('watch?v=', 'embed/')
                                        : property.video_url.replace('youtu.be/', 'www.youtube.com/embed/')
                                }
                                title="Visite Vidéo du Bien"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : property.video_url.includes('vimeo') ? (
                            <iframe
                                src={property.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                                title="Visite Vidéo du Bien"
                                className="w-full h-full border-0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video src={property.video_url} controls className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                            <PlayCircle className="w-4 h-4 text-[#E12B7B]" />
                            Vidéo de visite guidée
                        </span>
                        <a
                            href={property.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E12B7B] font-bold flex items-center gap-1 hover:underline text-[11px]"
                        >
                            Ouvrir en plein écran
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            )}

            {property.virtual_tour_url && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-gray-900 block">Visite Virtuelle 360°</span>
                        <span className="text-[11px] text-gray-500">Navigation interactive pièce par pièce</span>
                    </div>
                    <a
                        href={property.virtual_tour_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
                    >
                        <span>Lancer la visite 360°</span>
                        <ExternalLink className="w-3 h-3 text-[#C59A45]" />
                    </a>
                </div>
            )}
        </div>
    );
}
