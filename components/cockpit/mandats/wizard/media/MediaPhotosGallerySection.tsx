'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PropertyImage } from '@/lib/types';
import { Plus, Upload, Trash2 } from 'lucide-react';

interface MediaPhotosGallerySectionProps {
  images: PropertyImage[];
  onAddImageByUrl: (url: string) => void;
  onUploadFiles: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onSetCoverImage: (index: number) => void;
}

export const MediaPhotosGallerySection: React.FC<MediaPhotosGallerySectionProps> = ({
  images,
  onAddImageByUrl,
  onUploadFiles,
  onRemoveImage,
  onSetCoverImage
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleUrlAdd = () => {
    if (!newImageUrl.trim()) return;
    onAddImageByUrl(newImageUrl);
    setNewImageUrl('');
  };

  return (
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
                  className="p-1 bg-white text-gray-800 rounded text-[10px] font-bold hover:bg-[#E12B7B] hover:text-white cursor-pointer"
                  title="Définir en photo principale"
                >
                  ★
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemoveImage(idx)}
                className="p-1 bg-rose-600 text-white rounded hover:bg-rose-700 cursor-pointer"
                title="Supprimer la photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
