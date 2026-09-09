'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Copy, Check, Megaphone, FileText, Camera, Share2, Bookmark } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import type { Property } from '@/lib/types';
import { generateMandateLaunchPack, type LaunchPackContent } from './mandate-launch-helpers';

interface MandateLaunchPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
}

type TabType = 'portal' | 'flyer' | 'instagram' | 'linkedin' | 'cheatsheet';

export function MandateLaunchPackModal({ isOpen, onClose, property: initialProperty }: MandateLaunchPackModalProps) {
  const { properties } = useNellimoStore();
  const { showToast } = useToast();

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('portal');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentProperty =
    properties.find((p) => p.id === (selectedPropertyId || initialProperty?.id)) ||
    initialProperty ||
    properties[0];

  if (!currentProperty) return null;

  const pack: LaunchPackContent = generateMandateLaunchPack(currentProperty);

  const tabConfig: Record<TabType, { label: string; icon: React.ReactNode; text: string }> = {
    portal: { label: 'Portails ALUR', icon: <FileText className="w-4 h-4" />, text: pack.alurPortalAd },
    flyer: { label: 'Flyer Voisinage', icon: <Megaphone className="w-4 h-4" />, text: pack.neighborhoodFlyer },
    instagram: { label: 'Instagram', icon: <Camera className="w-4 h-4" />, text: pack.socialInstagram },
    linkedin: { label: 'LinkedIn Pro', icon: <Share2 className="w-4 h-4" />, text: pack.socialLinkedIn },
    cheatsheet: { label: 'Aide-Mémoire', icon: <Bookmark className="w-4 h-4" />, text: pack.visitCheatSheet },
  };

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(key);
      showToast('Copié dans le presse-papier !', 'success');
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      showToast('Impossible de copier le contenu', 'error');
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Pack Lancement Mandat en 1 Clic</h3>
                <p className="text-xs text-gray-500">{currentProperty.title} ({currentProperty.city})</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 pt-4">
            {/* Property Switcher if none passed */}
            {!initialProperty && properties.length > 1 && (
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Changer de bien</label>
                <select
                  value={currentProperty.id}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:bg-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.city}) - {p.price_fai.toLocaleString('fr-FR')} €
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tabs Bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 overflow-x-auto text-xs font-bold">
              {(Object.keys(tabConfig) as TabType[]).map((tabKey) => {
                const item = tabConfig[tabKey];
                const isActive = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => setActiveTab(tabKey)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                      isActive ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Content Preview */}
            <div className="relative rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Contenu prêt à diffuser ({tabConfig[activeTab].label})
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeTab, tabConfig[activeTab].text)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#E12B7B] border border-rose-200 rounded-lg text-xs font-bold shadow-2xs hover:bg-rose-50 transition"
                >
                  {copiedTab === activeTab ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTab === activeTab ? 'Copié !' : 'Copier'}
                </button>
              </div>

              <textarea
                readOnly
                rows={9}
                value={tabConfig[activeTab].text}
                className="w-full text-xs font-mono text-gray-800 bg-transparent border-0 resize-none focus:outline-hidden leading-relaxed custom-scrollbar"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const allText = [
                    '=== 1. ANNONCE PORTAILS ALUR ===\n' + pack.alurPortalAd,
                    '=== 2. FLYER VOISINAGE ===\n' + pack.neighborhoodFlyer,
                    '=== 3. INSTAGRAM ===\n' + pack.socialInstagram,
                    '=== 4. LINKEDIN ===\n' + pack.socialLinkedIn,
                    '=== 5. AIDE-MÉMOIRE ===\n' + pack.visitCheatSheet,
                  ].join('\n\n\n');
                  handleCopy('all', allText);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Copier l’Intégralité du Pack
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
