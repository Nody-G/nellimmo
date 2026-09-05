'use client';

import React from 'react';
import { Calendar, MapPin, PenTool, Navigation } from 'lucide-react';
import Link from 'next/link';
import type { VisitSheet, Property, Buyer } from '@/lib/types';

interface BriefingDayVisitsProps {
  visits: VisitSheet[];
  properties: Property[];
  buyers: Buyer[];
}

export function BriefingDayVisits({ visits, properties, buyers }: BriefingDayVisitsProps) {
  // Affiche les 3 visites les plus récentes ou planifiées
  const upcomingVisits = visits.slice(0, 3);

  if (upcomingVisits.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          Aucune visite enregistrée aujourd&apos;hui — propice aux estimations et relances acquéreurs.
        </span>
        <Link href="/cockpit/visites" className="text-blue-700 font-bold hover:underline">
          Nouveau bon →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          Tournée & Visites Terrain Récentes ({upcomingVisits.length})
        </span>
        <Link href="/cockpit/agenda" className="text-[11px] text-blue-600 font-bold hover:underline">
          Agenda complet →
        </Link>
      </div>

      <div className="space-y-2">
        {upcomingVisits.map((v) => {
          const prop = properties.find((p) => p.id === v.property_id);
          const buyer = buyers.find((b) => b.id === v.buyer_id);
          const buyerName = buyer ? `${buyer.first_name} ${buyer.last_name}` : 'Acquéreur';
          const fullAddress = prop ? `${prop.address}, ${prop.postal_code} ${prop.city}` : 'Pélissanne';
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

          const visitDateStr = v.visit_date
            ? new Date(v.visit_date).toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : "Aujourd'hui";

          return (
            <div
              key={v.id}
              className="p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{buyerName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 font-medium">{prop?.title || 'Bien'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate max-w-xs">{fullAddress}</span>
                  <span className="text-blue-600 font-bold ml-1">({visitDateStr})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition"
                  title="Ouvrir dans Google Maps ou Waze"
                >
                  <Navigation className="w-3 h-3 text-blue-600" />
                  Itinéraire GPS
                </a>
                <Link
                  href={`/cockpit/visites?propertyId=${v.property_id}`}
                  className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <PenTool className="w-3 h-3 text-gray-500" />
                  Bon de visite
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
