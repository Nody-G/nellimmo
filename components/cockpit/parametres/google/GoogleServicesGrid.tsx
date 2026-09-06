'use client';

import React from 'react';
import {
  Calendar,
  Mail,
  Folder,
  Video,
  MapPin,
  Users,
  Star,
  ExternalLink,
} from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { GOOGLE_WORKSPACE_SERVICES, GoogleServiceMeta } from '@/lib/google';

interface GoogleServicesGridProps {
  formData: AgencySettings;
  onToggleService: (serviceKey: keyof NonNullable<AgencySettings['google_services_enabled']>) => void;
}

export function GoogleServicesGrid({ formData, onToggleService }: GoogleServicesGridProps) {
  const enabledMap = formData.google_services_enabled || {};

  const getServiceIcon = (key: GoogleServiceMeta['key']) => {
    switch (key) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'gmail':
        return <Mail className="w-4 h-4 text-red-500" />;
      case 'drive':
        return <Folder className="w-4 h-4 text-emerald-600" />;
      case 'meet':
        return <Video className="w-4 h-4 text-indigo-600" />;
      case 'maps':
        return <MapPin className="w-4 h-4 text-rose-600" />;
      case 'contacts':
        return <Users className="w-4 h-4 text-teal-600" />;
      case 'reviews':
        return <Star className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Services Google Workspace Actifs ({GOOGLE_WORKSPACE_SERVICES.length})
        </h4>
        <span className="text-[11px] text-gray-400">
          Cliquez sur l&apos;icône externe pour ouvrir le service
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GOOGLE_WORKSPACE_SERVICES.map((service) => {
          const isEnabled = enabledMap[service.key] ?? true;

          return (
            <div
              key={service.key}
              className={`p-3.5 rounded-2xl border transition flex flex-col justify-between gap-2.5 ${
                isEnabled
                  ? 'bg-white border-gray-200 hover:border-blue-300 shadow-2xs'
                  : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {getServiceIcon(service.key)}
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-xs text-[#131B26] leading-tight">
                      {service.name}
                    </h5>
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {service.category}
                    </span>
                  </div>
                </div>

                <a
                  href={service.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-blue-600 transition shrink-0"
                  title={`Ouvrir ${service.name}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-[11px] text-gray-500 leading-snug">
                {service.description}
              </p>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {service.badge}
                </span>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[10px] font-semibold text-gray-500">
                    {isEnabled ? 'Actif' : 'Désactivé'}
                  </span>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => onToggleService(service.key)}
                    className="w-3.5 h-3.5 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
