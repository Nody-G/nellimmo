'use client';

import React, { useState } from 'react';
import { Property, AgencySignboard, SignboardType, SignboardStatus } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface SignboardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onCreateSignboard: (data: Omit<AgencySignboard, 'id' | 'created_at'>) => Promise<void>;
}

export const SignboardFormModal: React.FC<SignboardFormModalProps> = ({
  isOpen,
  onClose,
  properties,
  onCreateSignboard
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const propId = (form.elements.namedItem('property_id') as HTMLSelectElement).value;
    const type = (form.elements.namedItem('signboard_type') as HTMLSelectElement).value as SignboardType;
    const status = (form.elements.namedItem('status') as HTMLSelectElement).value as SignboardStatus;
    const loc = (form.elements.namedItem('location_details') as HTMLInputElement).value;
    const notes = (form.elements.namedItem('notes') as HTMLInputElement).value;

    let removalDeadline: string | undefined = undefined;
    if (type === 'vendu' && status === 'pose') {
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + 3); // 3 mois Loi Grenelle II
      removalDeadline = deadline.toISOString().slice(0, 10);
    }

    try {
      setIsSubmitting(true);
      await onCreateSignboard({
        property_id: propId || undefined,
        signboard_type: type,
        status: status,
        installed_at: status === 'pose' ? new Date().toISOString().slice(0, 10) : undefined,
        removal_deadline: removalDeadline,
        location_details: loc,
        notes
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Ajouter un Panneau au Parc"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">
            Bien Associé (optionnel si en réserve)
          </label>
          <select
            name="property_id"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          >
            <option value="">-- Aucun (Stock réserve agence) --</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                Mandat #{p.mandate_number} — {p.title} ({p.city})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Type de Panneau</label>
            <select
              name="signboard_type"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            >
              <option value="a_vendre">À Vendre</option>
              <option value="exclusivite">Exclusivité</option>
              <option value="vendu">Vendu (Loi Grenelle)</option>
              <option value="nouveau">Nouveau</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Statut Initial</label>
            <select
              name="status"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            >
              <option value="en_stock">En Stock / Réserve</option>
              <option value="pose">Posé sur le bien</option>
              <option value="a_deposer">À déposer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Emplacement de fixation</label>
          <input
            type="text"
            name="location_details"
            placeholder="Ex: Grille d'entrée sur rue, clôture côté sud"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Notes / Format</label>
          <input
            type="text"
            name="notes"
            placeholder="Ex: Akilux 80x60 cm œillets renforcés"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Enregistrer Panneau
          </Button>
        </div>
      </form>
    </Modal>
  );
};
