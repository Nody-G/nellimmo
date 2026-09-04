'use client';

import React, { useState } from 'react';
import { Building2, X, PlusCircle } from 'lucide-react';
import type { PartnerAgency } from '@/lib/types';

interface NewPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPartner: (partner: Omit<PartnerAgency, 'id'>) => Promise<PartnerAgency>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function NewPartnerModal({
  isOpen,
  onClose,
  onAddPartner,
  showToast,
}: NewPartnerModalProps) {
  const [agencyName, setAgencyName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [cpiNumber, setCpiNumber] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [financialGuarantee, setFinancialGuarantee] = useState('GALIAN (120 000 €)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim() || !directorName.trim() || !city.trim() || !phone.trim()) {
      showToast('Veuillez renseigner tous les champs obligatoires.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddPartner({
        agency_name: agencyName.trim(),
        director_name: directorName.trim(),
        cpi_number: cpiNumber.trim() || 'CPI en cours de vérification',
        city: city.trim(),
        phone: phone.trim(),
        email: email.trim() || 'contact@agence-partenaire.fr',
        financial_guarantee: financialGuarantee.trim() || 'GALIAN',
      });
      showToast(`Agence ${agencyName} ajoutée au réseau partenaire !`, 'success');
      onClose();
      // Reset form
      setAgencyName('');
      setDirectorName('');
      setCpiNumber('');
      setCity('');
      setPhone('');
      setEmail('');
    } catch {
      showToast('Erreur lors de l’ajout du confrère.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-5 animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Agréer une Agence Confrère
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Raison Sociale de l’Agence *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Immobilière du Luberon"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Dirigeant / Négociateur *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Marc Lambert"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Ville d’Implantation *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Lambesc"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Téléphone de Contact *
              </label>
              <input
                type="tel"
                required
                placeholder="Ex : 04 42 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Adresse E-mail
              </label>
              <input
                type="email"
                placeholder="contact@agence.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                N° Carte CPI (Loi Hoguet)
              </label>
              <input
                type="text"
                placeholder="CPI 1310 2020 000 000 000"
                value={cpiNumber}
                onChange={(e) => setCpiNumber(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">
              Garantie Financière
            </label>
            <input
              type="text"
              placeholder="Ex : GALIAN (120 000 €)"
              value={financialGuarantee}
              onChange={(e) => setFinancialGuarantee(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enregistrer dans le Réseau Partenaire</span>
          </button>
        </form>
      </div>
    </div>
  );
}
