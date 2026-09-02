'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { FinancingStatus } from '@/lib/types';
import { calculateMatchingScore, formatMandateRef } from '@/lib/hoguet';
import {
  Users,
  PlusCircle,
  Search,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';

export default function BuyersCrmPage() {
  const { buyers, properties, createBuyer } = useNellimoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New buyer form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budgetMax, setBudgetMax] = useState<number>(550000);
  const [minSurface, setMinSurface] = useState<number>(120);
  const [minRooms] = useState<number>(4);
  const [minBedrooms, setMinBedrooms] = useState<number>(3);
  const [targetCities, setTargetCities] = useState('Pélissanne, Lambesc');
  const [mustHaveGarden] = useState(true);
  const [mustHaveGarage] = useState(false);
  const [financingStatus, setFinancingStatus] = useState<FinancingStatus>('accord_bancaire_valide');
  const [notes, setNotes] = useState('');

  const activeProperties = properties.filter((p) => p.status === 'actif');

  const filteredBuyers = buyers.filter((b) =>
    b.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery) ||
    b.target_cities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    const citiesList = targetCities.split(',').map(c => c.trim()).filter(Boolean);

    createBuyer({
      first_name: firstName,
      last_name: lastName,
      email: email || undefined,
      phone: phone,
      budget_max: budgetMax,
      min_surface: minSurface,
      min_rooms: minRooms,
      min_bedrooms: minBedrooms,
      target_cities: citiesList,
      target_property_types: ['maison'],
      must_have_garden: mustHaveGarden,
      must_have_garage: mustHaveGarage,
      financing_status: financingStatus,
      notes: notes,
      status: 'actif'
    });

    setIsNewModalOpen(false);
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Users className="w-4 h-4" />
            <span>CRM Acquéreurs & Rapprochement Automatique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Fichier Acheteurs & Alertes WhatsApp
          </h1>
          <p className="text-xs text-gray-500">
            Rapprochement intelligent 0-100% entre vos mandats exclusifs et vos acquéreurs qualifiés.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Nouvel Acquéreur
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, commune recherchée..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold hidden sm:block">
          {filteredBuyers.length} contact(s) qualifié(s)
        </span>
      </div>

      {/* Main Grid : Buyers List with Live Matching against Current Mandates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBuyers.map((buyer) => {
          // Calculate best matches
          const propertyMatches = activeProperties.map((p) => ({
            property: p,
            ...calculateMatchingScore(p, buyer),
          })).sort((a, b) => b.score - a.score);

          const bestMatches = propertyMatches.filter((m) => m.score >= 60);

          return (
            <div
              key={buyer.id}
              className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4 hover:shadow-md transition"
            >
              {/* Buyer Top Info */}
              <div className="flex items-start justify-between border-b border-[#FAF5F8] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-[#131B26]">
                      {buyer.first_name} {buyer.last_name}
                    </h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      buyer.financing_status === 'accord_bancaire_valide' || buyer.financing_status === 'comptant'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {buyer.financing_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {buyer.phone}
                    </span>
                    {buyer.email && <span>{buyer.email}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Budget Max</span>
                  <span className="text-sm font-black text-[#E12B7B]">
                    {buyer.budget_max.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>

              {/* Criteria Pills */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-semibold">
                  Min. {buyer.min_surface} m²
                </span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-semibold">
                  {buyer.min_bedrooms} ch. min
                </span>
                {buyer.target_cities.map((city) => (
                  <span key={city} className="px-2 py-0.5 bg-[#FDF2F8] text-[#E12B7B] rounded font-semibold">
                    {city}
                  </span>
                ))}
                {buyer.must_have_garden && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">
                    Jardin exigé
                  </span>
                )}
              </div>

              {buyer.notes && (
                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  « {buyer.notes} »
                </p>
              )}

              {/* Matching Mandates Section */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-gray-500">
                  <span>Mandats Correspondants ({bestMatches.length})</span>
                  <span className="text-[10px] text-[#E12B7B] font-bold">Rapprochement direct</span>
                </div>

                {bestMatches.length > 0 ? (
                  <div className="space-y-2">
                    {bestMatches.slice(0, 2).map(({ property, score }) => (
                      <div
                        key={property.id}
                        className="p-2.5 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] flex items-center justify-between text-xs hover:bg-[#FDF2F8]/40 transition"
                      >
                        <Link
                          href={`/cockpit/mandats/${property.id}`}
                          className="group block overflow-hidden"
                        >
                          <span className="font-bold text-gray-900 group-hover:text-[#E12B7B] transition truncate block max-w-[200px]">
                            {formatMandateRef(property.mandate_number)} - {property.title}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {property.city} • {property.price_fai.toLocaleString('fr-FR')} €
                          </span>
                        </Link>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-lg font-black text-xs ${
                            score >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {score}% Match
                          </span>

                          <a
                            href={`https://wa.me/${buyer.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${buyer.first_name},%20Nelly%20de%20l'agence%20Nellimo.%20J'ai%20un%20nouveau%20bien%20en%20exclusivite%20qui%20correspond%20a%20votre%20recherche%20a%20${property.city}%20(${property.price_fai.toLocaleString('fr-FR')}€).%20Souhaitez-vous%20recevoir%20la%20fiche%20?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                            title="Envoyer alerte WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic block">
                    Aucun mandat en portefeuille ne correspond actuellement à 60%+.
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* New Buyer Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Nouvelle Fiche Acquéreur (CRM)
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBuyer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Budget Max (€)</label>
                  <input
                    type="number"
                    required
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Financement</label>
                  <select
                    value={financingStatus}
                    onChange={(e) => setFinancingStatus(e.target.value as FinancingStatus)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                  >
                    <option value="accord_bancaire_valide">Accord bancaire validé</option>
                    <option value="comptant">Paiement comptant</option>
                    <option value="etude_courtier">Étude courtier en cours</option>
                    <option value="en_attente">En attente de validation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Min (m²)</label>
                  <input
                    type="number"
                    value={minSurface}
                    onChange={(e) => setMinSurface(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Chambres min.</label>
                  <input
                    type="number"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Communes cibles</label>
                  <input
                    type="text"
                    value={targetCities}
                    onChange={(e) => setTargetCities(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Remarques / Critères spécifiques</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Recherche impérative plain-pied, pas de vis-à-vis..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold uppercase text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E12B7B] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Enregistrer l&apos;Acquéreur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
