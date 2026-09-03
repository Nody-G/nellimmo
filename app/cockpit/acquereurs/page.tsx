'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { FinancingStatus, Buyer } from '@/lib/types';
import { calculateMatchingScore, formatMandateRef } from '@/lib/hoguet';
import {
  Users,
  PlusCircle,
  Search,
  Phone,
  MessageCircle,
  X,
  Calculator,
  Send,
  Sparkles,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Check,
  Filter,
  Layers,
  ChevronRight,
  Euro,
  Coins
} from 'lucide-react';
import { NotaryFinanceCalculator } from '@/components/cockpit/NotaryFinanceCalculator';

export default function BuyersCrmPage() {
  const { buyers, properties, createBuyer } = useNellimoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoanSimulatorOpen, setIsLoanSimulatorOpen] = useState(false);
  const [isNotaryCalcOpen, setIsNotaryCalcOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // New buyer form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budgetMax, setBudgetMax] = useState<number>(550000);
  const [minSurface, setMinSurface] = useState<number>(120);
  const [minRooms, setMinRooms] = useState<number>(4);
  const [minBedrooms, setMinBedrooms] = useState<number>(3);
  const [targetCities, setTargetCities] = useState('Pélissanne, Lambesc');
  const [mustHaveGarden, setMustHaveGarden] = useState(true);
  const [mustHaveGarage, setMustHaveGarage] = useState(false);
  const [financingStatus, setFinancingStatus] = useState<FinancingStatus>('accord_bancaire_valide');
  const [notes, setNotes] = useState('');

  // Loan simulator state
  const [simPurchasePrice, setSimPurchasePrice] = useState<number>(450000);
  const [simDownPayment, setSimDownPayment] = useState<number>(60000);
  const [simDurationYears, setSimDurationYears] = useState<number>(25);
  const [simInterestRate, setSimInterestRate] = useState<number>(3.5);
  const [simInsuranceRate, setSimInsuranceRate] = useState<number>(0.34);

  // Broadcast campaign state
  const [broadcastPropertyId, setBroadcastPropertyId] = useState<string>(properties[0]?.id || '');

  const activeProperties = properties.filter((p) => p.status === 'actif');

  // Loan Calculation Engine
  const notaryFees = Math.round(simPurchasePrice * 0.075);
  const totalCost = simPurchasePrice + notaryFees;
  const loanAmount = Math.max(0, totalCost - simDownPayment);
  const monthlyInterestRate = simInterestRate / 100 / 12;
  const totalMonths = simDurationYears * 12;
  const baseMonthlyPayment = monthlyInterestRate > 0
    ? Math.round((loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalMonths)))
    : Math.round(loanAmount / totalMonths);
  const monthlyInsurance = Math.round((loanAmount * (simInsuranceRate / 100)) / 12);
  const totalMonthlyPayment = baseMonthlyPayment + monthlyInsurance;
  const totalLoanCost = Math.round(totalMonthlyPayment * totalMonths - loanAmount);
  // HCSF 35% max debt-to-income threshold
  const minRequiredHouseholdIncome = Math.round(totalMonthlyPayment / 0.35);

  const filteredBuyers = buyers.filter((b) => {
    const matchesSearch =
      b.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.target_cities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.financing_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    const citiesList = targetCities.split(',').map((c) => c.trim()).filter(Boolean);

    createBuyer({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      status: 'actif',
      budget_max: budgetMax,
      min_surface: minSurface,
      min_rooms: minRooms,
      min_bedrooms: minBedrooms,
      target_property_types: ['maison'],
      target_cities: citiesList,
      must_have_garden: mustHaveGarden,
      must_have_garage: mustHaveGarage,
      financing_status: financingStatus,
      notes,
    });

    setIsNewModalOpen(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  const broadcastProperty = properties.find((p) => p.id === broadcastPropertyId) || properties[0];
  const rankedBuyersForBroadcast = broadcastProperty
    ? [...buyers]
        .map((b) => ({ buyer: b, score: calculateMatchingScore(broadcastProperty, b).score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Users className="w-4 h-4" />
            <span>CRM Acquéreurs & Intelligence Financière</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Fichier Acquéreurs Qualifiés & Matching
          </h1>
          <p className="text-xs text-gray-500">
            {buyers.length} contacts en portefeuille, stress-test financier HCSF et campagnes de diffusion instantanées.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setIsNotaryCalcOpen(!isNotaryCalcOpen);
              if (!isNotaryCalcOpen) setIsLoanSimulatorOpen(false);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-xs ${
              isNotaryCalcOpen
                ? 'bg-[#131B26] text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Coins className="w-4 h-4 text-[#C59A45]" />
            <span>Frais de Notaire & Plus-Value</span>
          </button>

          <button
            onClick={() => {
              setIsLoanSimulatorOpen(!isLoanSimulatorOpen);
              if (!isLoanSimulatorOpen) setIsNotaryCalcOpen(false);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-xs ${
              isLoanSimulatorOpen
                ? 'bg-[#131B26] text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#C59A45]" />
            <span>Simulateur Crédit & HCSF</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4 text-[#E12B7B]" />
            <span>Campagne WhatsApp Ciblée</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvel Acquéreur</span>
          </button>
        </div>
      </div>

      {/* Loan Simulator Drawer / Card */}
      {isLoanSimulatorOpen && (
        <div className="bg-gradient-to-r from-[#FAF6EE] to-white rounded-3xl p-6 sm:p-8 border border-[#E9DFD3] shadow-md space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#E9DFD3] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C59A45]" />
              Simulateur de Financement & Règle HCSF (Endettement max 35%)
            </h3>
            <button onClick={() => setIsLoanSimulatorOpen(false)} className="text-xs text-gray-400 hover:text-gray-800">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Prix Achat Visé (€)</label>
              <input
                type="number"
                value={simPurchasePrice}
                onChange={(e) => setSimPurchasePrice(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Apport Personnel (€)</label>
              <input
                type="number"
                value={simDownPayment}
                onChange={(e) => setSimDownPayment(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Durée (Années)</label>
              <select
                value={simDurationYears}
                onChange={(e) => setSimDurationYears(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
              >
                <option value={15}>15 ans (180 mois)</option>
                <option value={20}>20 ans (240 mois)</option>
                <option value={25}>25 ans (300 mois)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Taux Nominal Annuel (%)</label>
              <input
                type="number"
                step="0.05"
                value={simInterestRate}
                onChange={(e) => setSimInterestRate(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Assurance (%)</label>
              <input
                type="number"
                step="0.01"
                value={simInsuranceRate}
                onChange={(e) => setSimInsuranceRate(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          {/* Results 4 pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Frais Notaire (~7.5%)</span>
              <span className="text-base font-black text-gray-900">{notaryFees.toLocaleString('fr-FR')} €</span>
              <span className="text-[9px] text-gray-400 block">Total: {totalCost.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Montant Prêté</span>
              <span className="text-base font-black text-gray-900">{loanAmount.toLocaleString('fr-FR')} €</span>
              <span className="text-[9px] text-gray-400 block">Coût crédit: {totalLoanCost.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="p-3 bg-[#FDF2F8] rounded-2xl border border-[#F3E8EE] shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-[#E12B7B] block">Mensualité Totale</span>
              <span className="text-xl font-black text-[#E12B7B]">{totalMonthlyPayment.toLocaleString('fr-FR')} €/m</span>
              <span className="text-[9px] text-gray-500 block">Assurance comprise</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Revenus Nets Exigés</span>
              <span className="text-xl font-black text-emerald-700">{minRequiredHouseholdIncome.toLocaleString('fr-FR')} €/m</span>
              <span className="text-[9px] text-emerald-800/80 block">Seuil 35% HCSF strict</span>
            </div>
          </div>
        </div>
      )}

      {/* Notary & Capital Gains Calculator Component */}
      {isNotaryCalcOpen && (
        <div className="animate-fade-in">
          <NotaryFinanceCalculator />
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F3E8EE] shadow-2xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, commune recherchée (ex: Lambesc, Salon)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B] w-full sm:w-auto"
          >
            <option value="all">Tous les profils financiers</option>
            <option value="accord_bancaire_valide">Accord bancaire validé</option>
            <option value="courtier_en_cours">Courtier en cours</option>
            <option value="fonds_propres_comptant">Paiement comptant</option>
            <option value="a_verifier">Financement à vérifier</option>
          </select>
        </div>
      </div>

      {/* Buyers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuyers.map((b) => {
          const matchingProperties = activeProperties
            .map((p) => ({ property: p, score: calculateMatchingScore(p, b).score }))
            .filter((m) => m.score >= 50)
            .sort((a, b) => b.score - a.score);

          return (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#131B26]">
                      {b.first_name} {b.last_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-[#E12B7B]" />
                        {b.phone}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    b.financing_status === 'accord_bancaire_valide' || b.financing_status === 'comptant'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.financing_status === 'etude_courtier'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.financing_status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Criteria highlights */}
                <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F3E8EE] text-xs space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget max :</span>
                    <span className="font-bold text-[#E12B7B]">{b.budget_max.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Surface min :</span>
                    <span className="font-bold text-gray-900">{b.min_surface} m² ({b.min_rooms}p / {b.min_bedrooms}ch)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Secteurs :</span>
                    <span className="font-bold text-gray-900">{b.target_cities.join(', ')}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] font-bold text-gray-600 pt-1">
                    {b.must_have_garden && <span className="bg-white px-2 py-0.5 rounded border border-gray-200">🌳 Jardin exigé</span>}
                    {b.must_have_garage && <span className="bg-white px-2 py-0.5 rounded border border-gray-200">🚗 Garage exigé</span>}
                  </div>
                </div>

                {/* Mandate Matches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase text-gray-400 block flex items-center justify-between">
                    <span>Biens Correspondants</span>
                    <span className="text-[#E12B7B]">{matchingProperties.length} match(s)</span>
                  </span>

                  {matchingProperties.length > 0 ? (
                    <div className="space-y-1">
                      {matchingProperties.slice(0, 2).map(({ property: p, score }) => (
                        <div
                          key={p.id}
                          className="p-2 bg-gray-50 hover:bg-[#FDF2F8] rounded-xl text-xs flex items-center justify-between transition border border-gray-100"
                        >
                          <Link href={`/cockpit/mandats/${p.id}`} className="font-semibold text-gray-900 truncate hover:text-[#E12B7B]">
                            {formatMandateRef(p.mandate_number)} - {p.title}
                          </Link>
                          <span className="text-[10px] font-black text-white bg-[#E12B7B] px-1.5 py-0.5 rounded ml-2 shrink-0">
                            {score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">Aucun mandat actif ne correspond à 100% actuellement.</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <a
                  href={`tel:${b.phone}`}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${b.phone.replace(/\s+/g, '').replace(/^0/, '33')}?text=${encodeURIComponent(`Bonjour ${b.first_name}, c'est Nelly de l'agence Nell'Immo. J'espère que vos recherches immobilières avancent bien !`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CAMPAGNE WHATSAPP CIBLÉE */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#E12B7B]" />
                <h3 className="font-serif font-bold text-lg text-[#131B26]">
                  Campagne WhatsApp Ciblée : Diffusion Nouveauté
                </h3>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-gray-400 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Sélectionner le Mandat à Proposer</label>
              <select
                value={broadcastPropertyId}
                onChange={(e) => setBroadcastPropertyId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
              >
                {activeProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatMandateRef(p.mandate_number)} - {p.title} ({p.city}) - {p.price_fai.toLocaleString('fr-FR')} €
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-gray-700 block">
                Top 5 Acquéreurs Pertinents Détectés :
              </span>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {rankedBuyersForBroadcast.map(({ buyer: b, score }) => {
                  const message = encodeURIComponent(
                    `Bonjour ${b.first_name}, c'est Nelly de l'agence Nell'Immo ! Je viens de rentrer un bien en exclusivité qui coche vos critères à ${broadcastProperty.city} (${broadcastProperty.living_area} m², ${broadcastProperty.price_fai.toLocaleString('fr-FR')} € FAI). Je vous le propose en avant-première avant diffusion officielle. Souhaitez-vous que je vous envoie la fiche et qu'on prévoie une visite ? Belle journée !`
                  );
                  const cleanPhone = b.phone.replace(/\s+/g, '').replace(/^0/, '33');

                  return (
                    <div key={b.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{b.first_name} {b.last_name}</span>
                          <span className="text-[10px] font-black text-white bg-[#E12B7B] px-1.5 py-0.2 rounded">
                            {score}% match
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500">Budget {b.budget_max.toLocaleString('fr-FR')} € • {b.phone}</span>
                      </div>

                      <a
                        href={`https://wa.me/${cleanPhone}?text=${message}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-2xs shrink-0"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Envoyer
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOUVEL ACQUÉREUR */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Enregistrer un Nouvel Acquéreur en Portefeuille
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-gray-400 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBuyer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone Portable</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Budget Max FAI (€)</label>
                  <input
                    type="number"
                    required
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Surface Min (m²)</label>
                  <input
                    type="number"
                    value={minSurface}
                    onChange={(e) => setMinSurface(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Chambres Min</label>
                  <input
                    type="number"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Secteurs Ciblés (Séparés par virgules)</label>
                <input
                  type="text"
                  value={targetCities}
                  onChange={(e) => setTargetCities(e.target.value)}
                  placeholder="Pélissanne, Lambesc, Salon-de-Provence..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Statut Financier</label>
                <select
                  value={financingStatus}
                  onChange={(e) => setFinancingStatus(e.target.value as FinancingStatus)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  <option value="accord_bancaire_valide">Accord bancaire / Simulation récente validée</option>
                  <option value="courtier_en_cours">Dossier en cours chez un courtier</option>
                  <option value="fonds_propres_comptant">Achat comptant (Fonds propres)</option>
                  <option value="a_verifier">À vérifier avant signature</option>
                </select>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={mustHaveGarden}
                    onChange={(e) => setMustHaveGarden(e.target.checked)}
                    className="accent-[#E12B7B]"
                  />
                  <span>Jardin / Extérieur obligatoire</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={mustHaveGarage}
                    onChange={(e) => setMustHaveGarage(e.target.checked)}
                    className="accent-[#E12B7B]"
                  />
                  <span>Garage obligatoire</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                Créer l&apos;Acquéreur & Calculer le Matching
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Campagne d'Alerte Rapprochement Automatique */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#E12B7B]" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#131B26]">
                    Campagne d&apos;Alerte Rapprochement Automatique
                  </h3>
                  <span className="text-[10px] text-gray-400 block">
                    Diffusion ciblée en 1 clic aux acquéreurs solvables en portefeuille
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Property Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700 block">
                Sélectionner le Bien à Rapprocher :
              </label>
              <select
                value={broadcastPropertyId}
                onChange={(e) => setBroadcastPropertyId(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-[#E12B7B]"
              >
                {activeProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{formatMandateRef(p.mandate_number)}] {p.title} — {p.city} ({p.price_fai.toLocaleString('fr-FR')} € FAI)
                  </option>
                ))}
              </select>
            </div>

            {/* Matched Buyers List */}
            {(() => {
              const targetProp = properties.find((p) => p.id === broadcastPropertyId) || activeProperties[0];
              if (!targetProp) return null;

              const matched = buyers
                .map((b) => ({ buyer: b, ...calculateMatchingScore(targetProp, b) }))
                .filter((m) => m.score >= 50)
                .sort((a, b) => b.score - a.score);

              const highMatches = matched.filter((m) => m.score >= 70);

              const teaserText = `Bonjour [Prénom], en exclusivité chez Nell'Immo : une nouvelle opportunité correspond précisément à vos critères à ${targetProp.city} (${targetProp.living_area} m², ${targetProp.rooms_count} pièces, ${targetProp.price_fai.toLocaleString('fr-FR')} € FAI).\nConsultez la fiche complète : https://nellimmo.fr/biens/${targetProp.id}\nSouhaitez-vous organiser une visite privée cette semaine ?\nNelly Fernandez (07 55 68 61 09).`;

              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#131B26] block text-sm">
                        {matched.length} Acquéreurs Compatibles Détectés
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        dont <strong className="text-emerald-700">{highMatches.length} acquéreurs chauds</strong> (matching ≥ 70%)
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Ciblage Actif
                    </span>
                  </div>

                  {/* Buyers Items */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {matched.map(({ buyer, score }) => (
                      <div
                        key={buyer.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {buyer.first_name} {buyer.last_name} ({buyer.phone})
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Budget max : {buyer.budget_max.toLocaleString('fr-FR')} € • {buyer.target_cities.join(', ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            score >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : score >= 70
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {score}% Match
                          </span>

                          <a
                            href={`https://wa.me/${buyer.phone.replace(/\s+/g, '').replace(/^0/, '33')}?text=${encodeURIComponent(
                              teaserText.replace('[Prénom]', buyer.first_name)
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                            title="Envoyer le message WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Preview */}
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 font-mono text-[11px]">
                    <span className="font-bold uppercase text-gray-500 block text-[10px]">
                      Message Type Personnalisé :
                    </span>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {teaserText}
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
