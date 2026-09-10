'use client';

import React, { useState, useEffect } from 'react';
import { ScanText, X, PhoneCall, Copy, Check, PlusCircle } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import { computePigeDvfGap } from './pige-import';
import { generatePigePitch } from './pige-scanner-helpers';

interface PigeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PigeScannerModal({ isOpen, onClose }: PigeScannerModalProps) {
  const { createProspectingLead } = useNellimoStore();
  const { showToast } = useToast();

  const [inputContent, setInputContent] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('420000');
  const [surface, setSurface] = useState('115');
  const [city, setCity] = useState('Pélissanne');
  const sellerName = 'Propriétaire Particulier';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const numPrice = parseInt(price, 10) || 0;
  const numSurface = parseInt(surface, 10) || 1;
  const gap = computePigeDvfGap(numPrice, numSurface, city);
  const askingM2 = gap?.askingM2 ?? Math.round(numPrice / numSurface);
  const medianM2 = gap?.medianM2 ?? 3200;
  const gapPct = gap?.gapPct ?? 0;
  const phonePitch = generatePigePitch({ sellerName, surface, city, numPrice, gap });

  const handleCopyPitch = async () => {
    try {
      await navigator.clipboard.writeText(phonePitch);
      setCopied(true);
      showToast('Script de pige copié !', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Presse-papier inaccessible', 'error');
    }
  };

  const handleSaveLead = async () => {
    await createProspectingLead({
      title: `Maison ${numSurface} m² à ${city}`,
      source: 'pap',
      source_url: inputContent.startsWith('http') ? inputContent : '',
      property_type: 'maison',
      city,
      postal_code: city === 'Salon-de-Provence' ? '13300' : '13330',
      price_asked: numPrice,
      price_drops_count: 0,
      living_area: numSurface,
      rooms_count: 4,
      description: `Maison ${numSurface} m² à ${city}.`,
      photos_urls: [],
      seller_name: sellerName,
      seller_phone: phone || '06 00 00 00 00',
      status: 'nouveau',
      call_attempts_count: 0,
      days_online: 1,
      notes: `Scanner Pige : ${gapPct > 0 ? `+${gapPct}%` : `${gapPct}%`} vs DVF (${medianM2} €/m²).`,
    });
    showToast('Prospect de pige enregistré !', 'success');
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <ScanText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Scanner Pige & Argumentaire DVF</h3>
                <p className="text-xs text-gray-500">Collez une annonce PAP / LeBonCoin ou note terrain</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-3 space-y-3">
            <textarea
              rows={2}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Ex: https://www.leboncoin.fr/... ou 'Panneau À Vendre rue des Romarins'"
              className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:bg-white"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Prix (€)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Surface (m²)</label>
                <input
                  type="number"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Commune</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2 bg-gray-50"
                >
                  <option value="Pélissanne">Pélissanne</option>
                  <option value="Salon-de-Provence">Salon-de-Provence</option>
                  <option value="Lambesc">Lambesc</option>
                  <option value="Lançon-Provence">Lançon</option>
                  <option value="Aurons">Aurons</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Téléphone</label>
                <input
                  type="text"
                  placeholder="06..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2 bg-gray-50"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-900 block">{askingM2.toLocaleString('fr-FR')} €/m²</span>
                <span className="text-[10px] text-amber-700">DVF secteur : {medianM2.toLocaleString('fr-FR')} €/m²</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${gapPct > 10 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {gapPct > 0 ? `+${gapPct}%` : `${gapPct}%`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#E12B7B]" />
                  Script Téléphone 30s Anti-Rejet
                </span>
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  className="flex items-center gap-1 px-2 py-0.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-[10px] font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
              <p className="text-[11px] text-gray-700 italic leading-relaxed whitespace-pre-line bg-white/80 p-2 rounded-xl border border-gray-100">
                {phonePitch}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveLead}
                className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                Enregistrer en Pige Active
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
