'use client';

import React from 'react';

interface MediaVideoTourSectionProps {
  videoUrl: string;
  onVideoUrlChange: (val: string) => void;
  virtualTourUrl: string;
  onVirtualTourUrlChange: (val: string) => void;
}

export const MediaVideoTourSection: React.FC<MediaVideoTourSectionProps> = ({
  videoUrl,
  onVideoUrlChange,
  virtualTourUrl,
  onVirtualTourUrlChange
}) => {
  return (
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
  );
};
