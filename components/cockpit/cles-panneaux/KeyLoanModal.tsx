'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AgencyKey, Property, KeyBorrowerRole } from '@/lib/types';
import { UserCheck, Check, FileSignature } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface KeyLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKey: AgencyKey | null;
  properties: Property[];
  onConfirmBorrow: (data: {
    borrowerName: string;
    borrowerPhone: string;
    borrowerCompany?: string;
    borrowerRole: KeyBorrowerRole;
    loanPurpose: string;
    expectedReturnDate: string;
    signatureUrl?: string;
  }) => Promise<void>;
}

export const KeyLoanModal: React.FC<KeyLoanModalProps> = ({
  isOpen,
  onClose,
  selectedKey,
  properties,
  onConfirmBorrow
}) => {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('');
  const [borrowerCompany, setBorrowerCompany] = useState('');
  const [borrowerRole, setBorrowerRole] = useState<KeyBorrowerRole>('artisan');
  const [loanPurpose, setLoanPurpose] = useState('Visite technique & devis');
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4);
    return d.toISOString().slice(0, 16);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#131B26';
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName || !borrowerPhone) return;

    let signatureUrl = '';
    if (canvasRef.current && hasSignature) {
      signatureUrl = canvasRef.current.toDataURL('image/png');
    }

    try {
      setIsSubmitting(true);
      await onConfirmBorrow({
        borrowerName,
        borrowerPhone,
        borrowerCompany: borrowerCompany || undefined,
        borrowerRole,
        loanPurpose,
        expectedReturnDate,
        signatureUrl: signatureUrl || undefined
      });
      // Reset form
      setBorrowerName('');
      setBorrowerPhone('');
      setBorrowerCompany('');
      clearSignature();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedKey) return null;

  const prop = properties.find((p) => p.id === selectedKey.property_id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#E12B7B]" />
          <h3 className="text-lg font-serif font-bold text-[#131B26]">
            Prêt du Trousseau #{selectedKey.keyring_number}
          </h3>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-gray-50 rounded-xl space-y-1">
          <span className="font-bold text-gray-700 block">Bien concerné :</span>
          <p className="text-gray-900 font-semibold">{prop?.title || 'Bien non lié'}</p>
          <p className="text-[11px] text-gray-500">
            {selectedKey.keys_count} clés sur anneau • Emplacement : {selectedKey.cabinet_location}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Nom du réceptionnaire *</label>
            <input
              type="text"
              required
              placeholder="Ex: David Martin"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Téléphone portable *</label>
            <input
              type="tel"
              required
              placeholder="06 12 34 56 78"
              value={borrowerPhone}
              onChange={(e) => setBorrowerPhone(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Société / Entreprise</label>
            <input
              type="text"
              placeholder="Ex: Peinture Pro Provence"
              value={borrowerCompany}
              onChange={(e) => setBorrowerCompany(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Qualité de l&apos;emprunteur</label>
            <select
              value={borrowerRole}
              onChange={(e) => setBorrowerRole(e.target.value as KeyBorrowerRole)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            >
              <option value="artisan">Artisan / Prestataire travaux</option>
              <option value="diagnostiqueur">Diagnostiqueur immobilier</option>
              <option value="confrere">Confrère agence (Délégation)</option>
              <option value="acquereur">Futur acquéreur (Métrage devis)</option>
              <option value="proprietaire">Propriétaire mandant</option>
              <option value="autre">Autre intervenant</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Motif du prêt & interventions prévues</label>
          <input
            type="text"
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Date & heure de restitution promise</label>
          <input
            type="datetime-local"
            value={expectedReturnDate}
            onChange={(e) => setExpectedReturnDate(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        {/* Signature Canvas */}
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-gray-700 flex items-center gap-1.5">
              <FileSignature className="w-3.5 h-3.5 text-[#E12B7B]" />
              Émargement tactile du réceptionnaire (Décharge de responsabilité) :
            </label>
            {hasSignature && (
              <button
                type="button"
                onClick={clearSignature}
                className="text-[10px] text-rose-600 hover:underline font-bold"
              >
                Effacer
              </button>
            )}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-[#FAF5F8]/30 overflow-hidden relative">
            <canvas
              ref={canvasRef}
              width={480}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-28 touch-none cursor-crosshair"
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-xs italic">
                Signez ici au doigt ou stylet pour décharge légale
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl text-[10px] text-gray-500 leading-relaxed">
          Par son émargement, l&apos;emprunteur reconnaît avoir reçu ce jour les clés désignées sous sa responsabilité exclusive, s&apos;interdit formellement toute reproduction et s&apos;engage à les restituer dans le délai convenu.
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Valider & Enregistrer le Prêt
          </Button>
        </div>
      </form>
    </Modal>
  );
};
