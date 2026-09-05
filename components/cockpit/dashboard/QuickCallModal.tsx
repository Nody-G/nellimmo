'use client';

import React, { useState, useMemo } from 'react';
import { PhoneCall, X, UserPlus, Send, Sparkles } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import type { PropertyType } from '@/lib/types';

interface QuickCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCallModal({ isOpen, onClose }: QuickCallModalProps) {
  const { properties, createBuyer, addContactLead } = useNellimoStore();
  const { showToast } = useToast();

  const [callType, setCallType] = useState<'acquereur' | 'vendeur' | 'autre'>('acquereur');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [city, setCity] = useState('Pélissanne');
  const [propType, setPropType] = useState<PropertyType>('maison');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Matching en temps réel
  const matchedProperties = useMemo(() => {
    if (callType !== 'acquereur') return [];
    const maxBudget = parseFloat(budget) || 0;
    return properties
      .filter((p) => p.status === 'actif')
      .filter((p) => {
        const matchesType = !propType || p.property_type === propType;
        const matchesCity = !city || p.city.toLowerCase().includes(city.toLowerCase());
        const matchesBudget = maxBudget <= 0 || p.price_fai <= maxBudget * 1.15;
        return matchesType && (matchesCity || matchesBudget);
      })
      .slice(0, 3);
  }, [properties, callType, budget, city, propType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Veuillez indiquer au moins le nom et le téléphone.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (callType === 'acquereur') {
        const [firstName, ...lastParts] = name.trim().split(' ');
        await createBuyer({
          first_name: firstName || 'Inconnu',
          last_name: lastParts.join(' ') || 'Prospect',
          phone: phone.trim(),
          email: email.trim() || undefined,
          budget_max: parseFloat(budget) || 350000,
          status: 'actif',
          target_property_types: [propType],
          target_cities: city ? [city] : ['Pélissanne'],
          must_have_garden: true,
          must_have_garage: false,
          financing_status: 'en_attente',
          notes: notes ? `[Appel Téléphonique] ${notes}` : '[Appel Téléphonique]',
        });
      }

      await addContactLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || 'appel@nellimmo.fr',
        message: `Appel ${callType.toUpperCase()} : ${notes || 'Prise de contact rapide'} | Recherche : ${propType} ${city} ${budget ? budget + '€' : ''}`,
        subject: `Appel entrant — ${callType === 'acquereur' ? 'Acquéreur' : 'Vendeur'}`,
      });

      showToast(`Appel de ${name} enregistré avec succès !`, 'success');
      onClose();
      // Reset
      setName('');
      setPhone('');
      setEmail('');
      setBudget('');
      setNotes('');
    } catch {
      showToast("Erreur lors de l'enregistrement de l'appel", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">
                Prise d&apos;Appel Entrant (15 secondes)
              </h3>
              <p className="text-[11px] text-gray-500">
                Notez l&apos;appel en direct : crée le contact et propose le matching immédiat
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type d'appel */}
        <div className="grid grid-cols-3 gap-2">
          {(['acquereur', 'vendeur', 'autre'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCallType(t)}
              className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition ${
                callType === t
                  ? 'bg-[#131B26] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t === 'acquereur' ? '🔑 Acquéreur' : t === 'vendeur' ? '🏡 Vendeur' : 'Autre appel'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Nom & Prénom *</label>
              <input
                type="text"
                required
                placeholder="ex. Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E12B7B] focus:ring-1 focus:ring-[#E12B7B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Téléphone *</label>
              <input
                type="tel"
                required
                placeholder="06 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E12B7B] focus:ring-1 focus:ring-[#E12B7B]"
              />
            </div>
          </div>

          {callType === 'acquereur' && (
            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-1">Budget Max (€)</label>
                <input
                  type="number"
                  placeholder="ex. 450000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-1">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-1">Type</label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value as PropertyType)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200"
                >
                  <option value="maison">Maison</option>
                  <option value="appartement">Appartement</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Notes rapides / Projet</label>
            <input
              type="text"
              placeholder="ex. Veut visiter ce samedi, financement accordé Crédit Agricole"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          {/* Matching en direct pour acquéreur */}
          {callType === 'acquereur' && matchedProperties.length > 0 && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-900 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C59A45]" />
                {matchedProperties.length} Mandat(s) correspondant(s) au catalogue :
              </span>
              <div className="space-y-1.5">
                {matchedProperties.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 bg-white rounded-xl border border-amber-100 text-xs"
                  >
                    <div>
                      <span className="font-bold text-gray-900">{p.title}</span>
                      <span className="text-gray-500 block text-[10px]">
                        {p.city} • {p.price_fai.toLocaleString('fr-FR')} € • Mandat #{p.mandate_number}
                      </span>
                    </div>
                    {phone && (
                      <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Bonjour ${name}, suite à notre échange téléphonique, voici le bien qui correspond à votre recherche : https://nellimmo.fr/biens/${p.id} (${p.title} à ${p.city} - ${p.price_fai.toLocaleString('fr-FR')} €). Nelly Fernandez - Nell'Immo`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-700"
                      >
                        <Send className="w-3 h-3" />
                        Partager
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              {isSubmitting ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Enregistrer l&apos;Appel & Créer la Fiche</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
