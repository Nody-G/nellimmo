'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

import { PublicEstimationFormData } from './estimation-types';

interface EstimationStepContactProps {
  formData: PublicEstimationFormData;
  onChange: <K extends keyof PublicEstimationFormData>(field: K, value: PublicEstimationFormData[K]) => void;
  onBack: () => void;
}

export function EstimationStepContact({
  formData,
  onChange,
  onBack,
}: EstimationStepContactProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            required
            placeholder="Jean"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            required
            placeholder="Dupont"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
          Téléphone de contact *
        </label>
        <input
          type="tel"
          required
          placeholder="06 12 34 56 78"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
          Adresse E-mail *
        </label>
        <input
          type="email"
          required
          placeholder="jean.dupont@email.fr"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
        >
          Retour
        </button>
        <button
          type="submit"
          className="w-2/3 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          Recevoir mon avis d’expert
        </button>
      </div>
    </div>
  );
}
