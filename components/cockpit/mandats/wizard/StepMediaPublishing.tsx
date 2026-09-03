'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PropertyImage } from '@/lib/types';
import {
  FileText,
  Sparkles,
  Wand2,
  Upload,
  Plus,
  Trash2,
  Globe,
  Radio
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StepMediaPublishingProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  onGenerateAiDescription: (mode: 'portail' | 'luxe' | 'social' | 'bullet') => void;
  isAiGenerating: boolean;
  images: PropertyImage[];
  onAddImageByUrl: (url: string) => void;
  onUploadFiles: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onSetCoverImage: (index: number) => void;
  videoUrl: string;
  onVideoUrlChange: (val: string) => void;
  virtualTourUrl: string;
  onVirtualTourUrlChange: (val: string) => void;
  publishWebsite: boolean;
  onPublishWebsiteChange: (val: boolean) => void;
  publishSeloger: boolean;
  onPublishSelogerChange: (val: boolean) => void;
  publishLeboncoin: boolean;
  onPublishLeboncoinChange: (val: boolean) => void;
  publishBienici: boolean;
  onPublishBieniciChange: (val: boolean) => void;
}

export const StepMediaPublishing: React.FC<StepMediaPublishingProps> = ({
  description,
  onDescriptionChange,
  onGenerateAiDescription,
  isAiGenerating,
  images,
  onAddImageByUrl,
  onUploadFiles,
  onRemoveImage,
  onSetCoverImage,
  videoUrl,
  onVideoUrlChange,
  virtualTourUrl,
  onVirtualTourUrlChange,
  publishWebsite,
  onPublishWebsiteChange,
  publishSeloger,
  onPublishSelogerChange,
  publishLeboncoin,
  onPublishLeboncoinChange,
  publishBienici,
  onPublishBieniciChange
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleUrlAdd = () => {
    if (!newImageUrl.trim()) return;
    onAddImageByUrl(newImageUrl);
    setNewImageUrl('');
  };

  return (
    <Card id="step-media">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#E12B7B]" />
          <span>6. Descriptif, Photos & Passerelles de Diffusion</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Description & AI */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold text-gray-700">
              Texte de présentation de l&apos;annonce *
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Générateur IA :
              </span>
              {[
                { id: 'portail', label: 'Portails', icon: <FileText className="w-3 h-3" /> },
                { id: 'luxe', label: 'Prestige', icon: <Sparkles className="w-3 h-3" /> },
                { id: 'social', label: 'Réseaux', icon: <Globe className="w-3 h-3" /> },
                { id: 'bullet', label: 'Synthèse', icon: <Wand2 className="w-3 h-3" /> }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  disabled={isAiGenerating}
                  onClick={() => onGenerateAiDescription(m.id as 'portail' | 'luxe' | 'social' | 'bullet')}
                  className="px-2.5 py-1 bg-[#FAF5F8] hover:bg-[#FDF2F8] border border-[#F3E8EE] hover:border-[#E12B7B]/40 text-[#131B26] hover:text-[#E12B7B] rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={6}
            required
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B] leading-relaxed"
          />
        </div>

        {/* Photos Management */}
        <div className="pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block mb-2">
            Photographies Haute Définition ({images.length})
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Coller l'URL d'une photo..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
            <button
              type="button"
              onClick={handleUrlAdd}
              className="px-3 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter URL</span>
            </button>

            <label className="px-3 py-2 bg-[#FAF5F8] hover:bg-[#FDF2F8] border border-[#F3E8EE] text-[#E12B7B] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Téléverser</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && onUploadFiles(e.target.files)}
                className="hidden"
              />
            </label>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-4/3"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.image_url}
                    alt={`Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
                {img.is_cover && (
                  <span className="absolute top-1 left-1 bg-[#E12B7B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                    Couverture
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 z-20">
                  {!img.is_cover && (
                    <button
                      type="button"
                      onClick={() => onSetCoverImage(idx)}
                      className="p-1 bg-white text-gray-800 rounded text-[10px] font-bold hover:bg-[#E12B7B] hover:text-white"
                      title="Définir en photo principale"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(idx)}
                    className="p-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                    title="Supprimer la photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video & Virtual Tour */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 block mb-1">
              Lien Vidéo (YouTube / Vimeo)
            </label>
            <input
              type="url"
              placeholder="https://youtu.be/..."
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 block mb-1">
              Visite Virtuelle 360° (Matterport / Nodalview)
            </label>
            <input
              type="url"
              placeholder="https://my.matterport.com/show/..."
              value={virtualTourUrl}
              onChange={(e) => onVirtualTourUrlChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        {/* Channels Toggles */}
        <div className="pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block mb-2">
            Canaux de Diffusion Multicast Immédiate
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'site', label: 'Site Nell\'Immo', active: publishWebsite, toggle: onPublishWebsiteChange },
              { id: 'seloger', label: 'SeLoger (Poliris)', active: publishSeloger, toggle: onPublishSelogerChange },
              { id: 'lbc', label: 'LeBonCoin (Passerelle)', active: publishLeboncoin, toggle: onPublishLeboncoinChange },
              { id: 'bienici', label: 'Bien\'Ici (Flux XML)', active: publishBienici, toggle: onPublishBieniciChange }
            ].map((c) => (
              <label
                key={c.id}
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  c.active
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={c.active}
                  onChange={(e) => c.toggle(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold">{c.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
