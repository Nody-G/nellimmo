'use client';

import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function ContactInfoCards() {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-sm font-bold text-gray-900 block">Téléphone Direct</strong>
          <a
            href="tel:0755686109"
            className="text-lg font-black text-[#E12B7B] hover:underline block mt-0.5"
          >
            07 55 68 61 09
          </a>
          <span className="text-xs text-gray-500">Appel & WhatsApp direct avec Nelly</span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-sm font-bold text-gray-900 block">Courrier Électronique</strong>
          <a
            href="mailto:nellimmo.acte@gmail.com"
            className="text-sm font-bold text-gray-800 hover:text-[#E12B7B] transition block mt-0.5"
          >
            nellimmo.acte@gmail.com
          </a>
          <span className="text-xs text-gray-500">Réponse sous 24h ouvrées</span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-sm font-bold text-gray-900 block">Adresse de l’Agence</strong>
          <span className="text-xs text-gray-700 block mt-0.5">
            26 Avenue des Enjouvènes<br />13330 Pélissanne
          </span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-sm font-bold text-gray-900 block">Horaires de Disponibilité</strong>
          <span className="text-xs text-gray-700 block mt-0.5">
            Du Lundi au Vendredi : 08h00 - 18h00<br />Le Samedi sur rendez-vous
          </span>
        </div>
      </div>
    </div>
  );
}
