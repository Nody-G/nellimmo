'use client';

import React from 'react';
import { KeyBorrowerRole } from '@/lib/types';

interface BorrowerFieldsProps {
  borrowerName: string;
  setBorrowerName: (v: string) => void;
  borrowerPhone: string;
  setBorrowerPhone: (v: string) => void;
  borrowerCompany: string;
  setBorrowerCompany: (v: string) => void;
  borrowerRole: KeyBorrowerRole;
  setBorrowerRole: (v: KeyBorrowerRole) => void;
  loanPurpose: string;
  setLoanPurpose: (v: string) => void;
  expectedReturnDate: string;
  setExpectedReturnDate: (v: string) => void;
}

export const BorrowerFields: React.FC<BorrowerFieldsProps> = ({
  borrowerName,
  setBorrowerName,
  borrowerPhone,
  setBorrowerPhone,
  borrowerCompany,
  setBorrowerCompany,
  borrowerRole,
  setBorrowerRole,
  loanPurpose,
  setLoanPurpose,
  expectedReturnDate,
  setExpectedReturnDate
}) => {
  return (
    <>
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
    </>
  );
};
