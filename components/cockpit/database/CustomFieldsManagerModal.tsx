'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Sliders, Check } from 'lucide-react';
import {
  CustomFieldDefinition,
  CustomFieldType,
  saveCustomFieldDefinition,
  deleteCustomFieldDefinition,
} from '@/lib/custom-fields';

interface CustomFieldsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionKey: string;
  collectionName: string;
  fields: CustomFieldDefinition[];
  onFieldsChanged: () => void;
}

const FIELD_TYPES: Array<{ value: CustomFieldType; label: string }> = [
  { value: 'text', label: 'Texte Court' },
  { value: 'textarea', label: 'Texte Long / Notes' },
  { value: 'number', label: 'Nombre' },
  { value: 'currency', label: 'Montant (€)' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Oui / Non' },
  { value: 'select', label: 'Liste de Choix' },
  { value: 'tags', label: 'Étiquettes / Tags' },
];

export function CustomFieldsManagerModal({
  isOpen,
  onClose,
  collectionKey,
  collectionName,
  fields,
  onFieldsChanged,
}: CustomFieldsManagerModalProps) {
  const [label, setLabel] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState<CustomFieldType>('text');
  const [optionsStr, setOptionsStr] = useState('');

  if (!isOpen) return null;

  const handleLabelChange = (val: string) => {
    setLabel(val);
    if (!key) {
      setKey(val.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 24));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !key.trim()) return;

    const options = (type === 'select' || type === 'tags')
      ? optionsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    saveCustomFieldDefinition({
      collection: collectionKey,
      key: key.trim(),
      label: label.trim(),
      type,
      options,
    });

    setLabel('');
    setKey('');
    setOptionsStr('');
    onFieldsChanged();
  };

  const handleDelete = (id: string) => {
    deleteCustomFieldDefinition(id);
    onFieldsChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-bold text-gray-900 text-sm">
              Champs Personnalisés : {collectionName}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste des champs existants */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Champs Actifs ({fields.length})
          </div>
          {fields.length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              Aucun champ personnalisé défini pour cette collection.
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-xl p-2">
              {fields.map((f) => (
                <div key={f.id} className="py-1.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-gray-900">{f.label}</span>
                    <span className="text-gray-400 font-mono text-[11px] ml-1.5">({f.key})</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600">
                      {f.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulaire d'ajout */}
        <form onSubmit={handleAdd} className="space-y-3 pt-2 border-t border-gray-100 text-xs">
          <div className="font-bold text-gray-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#E12B7B]" />
            Créer un Nouvel Attribut Dynamique
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nom / Libellé</label>
              <input
                type="text"
                placeholder="Ex : Code Portail"
                value={label}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#E12B7B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Identifiant Clé</label>
              <input
                type="text"
                placeholder="code_portail"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-[#E12B7B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Type de Donnée</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CustomFieldType)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#E12B7B] focus:outline-none"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {(type === 'select' || type === 'tags') && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Options (séparées par des virgules)</label>
                <input
                  type="text"
                  placeholder="Option 1, Option 2, Option 3"
                  value={optionsStr}
                  onChange={(e) => setOptionsStr(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#E12B7B] focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Fermer
            </button>
            <button
              type="submit"
              disabled={!label.trim() || !key.trim()}
              className="px-4 py-1.5 bg-[#E12B7B] text-white font-semibold rounded-lg hover:bg-[#c22066] disabled:opacity-50 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Ajouter au Schéma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
