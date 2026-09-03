'use client';

import React, { useState } from 'react';
import { Property, AgencyKey } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface KeyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  keys: AgencyKey[];
  onCreateKey: (data: Omit<AgencyKey, 'id' | 'created_at'>) => Promise<void>;
}

export const KeyFormModal: React.FC<KeyFormModalProps> = ({
  isOpen,
  onClose,
  properties,
  keys,
  onCreateKey
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultKeyringNum =
    keys.length > 0 ? Math.max(...keys.map((k) => k.keyring_number)) + 1 : 101;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const propId = (form.elements.namedItem('property_id') as HTMLSelectElement).value;
    const num = Number((form.elements.namedItem('keyring_number') as HTMLInputElement).value);
    const loc = (form.elements.namedItem('cabinet_location') as HTMLInputElement).value;
    const count = Number((form.elements.namedItem('keys_count') as HTMLInputElement).value);
    const badge = (form.elements.namedItem('has_alarm_badge') as HTMLInputElement).checked;
    const notes = (form.elements.namedItem('notes') as HTMLInputElement).value;

    try {
      setIsSubmitting(true);
      await onCreateKey({
        property_id: propId,
        keyring_number: num,
        cabinet_location: loc,
        keys_count: count,
        has_alarm_badge: badge,
        status: 'disponible',
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
      title="Enregistrer un Nouveau Trousseau"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">Bien Rattaché *</label>
          <select
            name="property_id"
            required
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                Mandat #{p.mandate_number} — {p.title} ({p.city})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-700 block mb-1">N° du Trousseau</label>
            <input
              type="number"
              name="keyring_number"
              defaultValue={defaultKeyringNum}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Emplacement Armoire</label>
            <input
              type="text"
              name="cabinet_location"
              defaultValue="Armoire A • Rgt 03"
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Nombre de clés</label>
            <input
              type="number"
              name="keys_count"
              defaultValue={3}
              min={1}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="has_alarm_badge"
              name="has_alarm_badge"
              defaultChecked
              className="w-4 h-4 text-[#E12B7B] rounded"
            />
            <label htmlFor="has_alarm_badge" className="font-bold text-gray-700">
              Badge Vigik / Alarme
            </label>
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Détails des clés</label>
          <input
            type="text"
            name="notes"
            placeholder="Ex: Porte d'entrée, portillon, cave"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
