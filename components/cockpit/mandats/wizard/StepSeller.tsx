'use client';

import React from 'react';
import { MandateType, SellerCivility } from '@/lib/types';
import { User, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StepSellerProps {
  mandateType: MandateType;
  onMandateTypeChange: (val: MandateType) => void;
  mandateDate: string;
  onMandateDateChange: (val: string) => void;
  mandateEndDate: string;
  onMandateEndDateChange: (val: string) => void;
  sellerCivility: SellerCivility;
  onSellerCivilityChange: (val: SellerCivility) => void;
  sellerName: string;
  onSellerNameChange: (val: string) => void;
  sellerEmail: string;
  onSellerEmailChange: (val: string) => void;
  sellerPhone: string;
  onSellerPhoneChange: (val: string) => void;
  sellerAddress: string;
  onSellerAddressChange: (val: string) => void;
}

export const StepSeller: React.FC<StepSellerProps> = ({
  mandateType,
  onMandateTypeChange,
  mandateDate,
  onMandateDateChange,
  mandateEndDate,
  onMandateEndDateChange,
  sellerCivility,
  onSellerCivilityChange,
  sellerName,
  onSellerNameChange,
  sellerEmail,
  onSellerEmailChange,
  sellerPhone,
  onSellerPhoneChange,
  sellerAddress,
  onSellerAddressChange
}) => {
  return (
    <Card id="step-seller">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#E12B7B]" />
          <span>1. Vendeur & Cadre Juridique du Mandat</span>
        </CardTitle>
        <span className="text-[11px] font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Registre Loi Hoguet
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type de Mandat */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-2">
            Type de Mandat *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'exclusif', label: 'Exclusif (Recommandé)', desc: 'Service premium Nell\'Immo' },
              { id: 'simple', label: 'Simple', desc: 'Concurrence inter-agences' },
              { id: 'semi-exclusif', label: 'Semi-Exclusif', desc: 'Vente directe vendeur permise' }
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => onMandateTypeChange(t.id as MandateType)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  mandateType === t.id
                    ? 'border-[#E12B7B] bg-[#FDF2F8]/60 ring-2 ring-[#E12B7B]/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold text-gray-900 block">{t.label}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dates du mandat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Date de prise d&apos;effet du mandat *
            </label>
            <input
              type="date"
              required
              value={mandateDate}
              onChange={(e) => onMandateDateChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Date d&apos;échéance (Loi Hoguet) *
            </label>
            <input
              type="date"
              required
              value={mandateEndDate}
              onChange={(e) => onMandateEndDateChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        {/* Coordonnées vendeur */}
        <div className="pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block mb-2">
            Identité du ou des Mandants (Propriétaires vendeurs)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Civilité
              </label>
              <select
                value={sellerCivility}
                onChange={(e) => onSellerCivilityChange(e.target.value as SellerCivility)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                <option value="M">Monsieur</option>
                <option value="Mme">Madame</option>
                <option value="M_Mme">M. et Mme</option>
                <option value="SCI">SCI / Personne Morale</option>
                <option value="Societe">Société / Indivision</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Nom complet du mandant *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Jean et Sophie Dupont"
                value={sellerName}
                onChange={(e) => onSellerNameChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Téléphone mobile
              </label>
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                value={sellerPhone}
                onChange={(e) => onSellerPhoneChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="vendeur@exemple.fr"
                value={sellerEmail}
                onChange={(e) => onSellerEmailChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Adresse actuelle du vendeur
              </label>
              <input
                type="text"
                placeholder="Ex: 12 Rue des Oliviers, Pélissanne"
                value={sellerAddress}
                onChange={(e) => onSellerAddressChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
