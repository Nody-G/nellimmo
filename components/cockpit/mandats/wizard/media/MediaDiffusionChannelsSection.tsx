'use client';

import React from 'react';

interface MediaDiffusionChannelsSectionProps {
  publishWebsite: boolean;
  onPublishWebsiteChange: (val: boolean) => void;
  publishSeloger: boolean;
  onPublishSelogerChange: (val: boolean) => void;
  publishLeboncoin: boolean;
  onPublishLeboncoinChange: (val: boolean) => void;
  publishBienici: boolean;
  onPublishBieniciChange: (val: boolean) => void;
}

export const MediaDiffusionChannelsSection: React.FC<MediaDiffusionChannelsSectionProps> = ({
  publishWebsite,
  onPublishWebsiteChange,
  publishSeloger,
  onPublishSelogerChange,
  publishLeboncoin,
  onPublishLeboncoinChange,
  publishBienici,
  onPublishBieniciChange
}) => {
  const channels = [
    { id: 'site', label: "Site Nell'Immo", active: publishWebsite, toggle: onPublishWebsiteChange },
    { id: 'seloger', label: 'SeLoger (Poliris)', active: publishSeloger, toggle: onPublishSelogerChange },
    { id: 'lbc', label: 'LeBonCoin (Passerelle)', active: publishLeboncoin, toggle: onPublishLeboncoinChange },
    { id: 'bienici', label: "Bien'Ici (Flux XML)", active: publishBienici, toggle: onPublishBieniciChange }
  ];

  return (
    <div className="pt-2 border-t border-gray-100">
      <label className="text-xs font-bold text-gray-700 block mb-2">
        Canaux de Diffusion Multicast Immédiate
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {channels.map((c) => (
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
  );
};
