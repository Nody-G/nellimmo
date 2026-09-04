'use client';

import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

export function AgencePracticalInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
        <MapPin className="w-5 h-5 text-[#E12B7B]" />
        <strong className="text-sm font-bold block text-gray-900">Adresse de l’Agence</strong>
        <span className="text-xs text-gray-600 block">
          26 Avenue des Enjouvènes<br />13330 Pélissanne
        </span>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
        <Clock className="w-5 h-5 text-[#E12B7B]" />
        <strong className="text-sm font-bold block text-gray-900">Horaires d’Ouverture</strong>
        <span className="text-xs text-gray-600 block">
          Du Lundi au Vendredi<br />De 08h00 à 18h00 (et sur RDV le samedi)
        </span>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
        <Phone className="w-5 h-5 text-[#E12B7B]" />
        <strong className="text-sm font-bold block text-gray-900">Contact Direct</strong>
        <span className="text-xs text-gray-600 block">
          Tél : 07 55 68 61 09<br />E-mail : nellimmo.acte@gmail.com
        </span>
      </div>
    </div>
  );
}
