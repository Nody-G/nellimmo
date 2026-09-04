'use client';

import React from 'react';
import { User, MapPin, Home, Send, Loader2 } from 'lucide-react';

interface QualificationFormProps {
  name: string;
  setName: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  propertyType: string;
  setPropertyType: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  busy: boolean;
  resultSource?: 'deepseek' | 'local' | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const QualificationForm: React.FC<QualificationFormProps> = ({
  name,
  setName,
  city,
  setCity,
  propertyType,
  setPropertyType,
  message,
  setMessage,
  busy,
  resultSource,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <User className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du prospect"
            className="w-full pl-8 pr-3 py-2 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Secteur (ex: Pélissanne)"
            className="w-full pl-8 pr-3 py-2 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
          />
        </div>
        <div className="relative">
          <Home className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            placeholder="Type de bien (ex: villa)"
            className="w-full pl-8 pr-3 py-2 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
          />
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder='Collez ici le message du prospect (ex: "Bonjour, je souhaite vendre ma villa à Pélissanne, environ 350 000 €, nous ne sommes pas pressés...")'
        className="w-full px-3 py-2.5 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30 resize-y"
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {resultSource === 'deepseek' ? 'Analyse IA (DeepSeek)' : 'Analyse locale (hors-ligne)'}
        </span>
        <button
          type="submit"
          disabled={busy || !message.trim()}
          className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          {busy ? 'Analyse...' : 'Qualifier le lead'}
        </button>
      </div>
    </form>
  );
};
