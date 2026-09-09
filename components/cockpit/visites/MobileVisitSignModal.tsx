'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, X, Check, ShieldCheck } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import { SignatureCanvas } from './SignatureCanvas';
import { captureCanvasSignature } from './visites-types';

interface MobileVisitSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPropertyId?: string;
}

export function MobileVisitSignModal({
  isOpen,
  onClose,
  initialPropertyId,
}: MobileVisitSignModalProps) {
  const { properties, buyers, createVisitSheet } = useNellimoStore();
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeProperties = properties.filter((p) => p.status === 'actif');
  const [propertyId, setPropertyId] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const effectivePropertyId = propertyId || initialPropertyId || activeProperties[0]?.id || '';
  const currentProperty = properties.find((p) => p.id === effectivePropertyId) || activeProperties[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      showToast('Veuillez renseigner le nom de l’acquéreur.', 'error');
      return;
    }
    const signatureDataUrl = captureCanvasSignature(canvasRef.current);
    if (!signatureDataUrl) {
      showToast('Veuillez faire signer l’acquéreur sur l’écran.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const matchingBuyer = buyers.find((b) =>
        `${b.first_name} ${b.last_name}`.toLowerCase().includes(visitorName.trim().toLowerCase())
      );

      await createVisitSheet({
        property_id: effectivePropertyId,
        buyer_id: matchingBuyer?.id || buyers[0]?.id || '',
        signature_data_url: signatureDataUrl,
        visit_date: new Date().toISOString(),
        notes: `[Bon Mobile Tactile] Acquéreur : ${visitorName.trim()} | Tél : ${visitorPhone.trim() || 'N/C'} | Scellé Loi Hoguet`,
      });
      showToast('Bon de visite signé et scellé avec succès !', 'success');
      onClose();
    } catch {
      showToast('Erreur lors de l’enregistrement du bon de visite.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Bon de Visite Émargé</h3>
                <p className="text-xs text-gray-500">
                  {currentProperty ? `${currentProperty.title} (${currentProperty.city})` : 'Signature immédiate sur smartphone'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="py-3 space-y-3">
            {/* Property select */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Bien présenté</label>
              <select
                value={effectivePropertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:bg-white"
              >
                {activeProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.city}) - {p.price_fai.toLocaleString('fr-FR')} €
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nom & Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sophie & Marc Roux"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Téléphone portable</label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2 bg-gray-50"
                />
              </div>
            </div>

            {/* Signature Canvas */}
            <SignatureCanvas canvasRef={canvasRef} />

            {/* Legal Notice */}
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2 text-[10px] text-gray-500 leading-snug">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                L’acquéreur certifie avoir visité le bien désigné ce jour par l’entremise de l’agence Nell’Immo et s’interdit toute négociation directe avec le propriétaire vendeur (Loi n°70-9 du 2 janv. 1970).
              </span>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? 'Scellement...' : 'Valider & Sceller le Bon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
