'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { addContactLead } = useNellimoStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'achat',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });
    setIsSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
          Écoute & Proximité • Pélissanne & Pays Salonais
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
          Contactez l&apos;Agence Nell&apos;Immo
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Un projet d&apos;achat, une mise en vente ou une question sur le marché provençal ? Nelly Fernandez vous répond avec réactivité.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-900 block">Téléphone Direct</strong>
              <a href="tel:0755686109" className="text-lg font-black text-[#E12B7B] hover:underline block mt-0.5">
                07 55 68 61 09
              </a>
              <span className="text-xs text-gray-500">Appel & WhatsApp direct avec Nelly</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-900 block">Courrier Électronique</strong>
              <a href="mailto:nellimmo.acte@gmail.com" className="text-sm font-bold text-gray-800 hover:text-[#E12B7B] transition block mt-0.5">
                nellimmo.acte@gmail.com
              </a>
              <span className="text-xs text-gray-500">Réponse sous 24h ouvrées</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-900 block">Adresse de l&apos;Agence</strong>
              <span className="text-xs text-gray-700 block mt-0.5">
                26 Avenue des Enjouvènes<br />13330 Pélissanne
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-900 block">Horaires de Disponibilité</strong>
              <span className="text-xs text-gray-700 block mt-0.5">
                Du Lundi au Vendredi : 08h00 - 18h00<br />Le Samedi sur rendez-vous
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="space-y-1 border-b border-[#FAF5F8] pb-4">
            <h2 className="font-serif font-bold text-xl text-[#131B26]">
              Envoyez un message à Nelly
            </h2>
            <p className="text-xs text-gray-500">
              Remplissez le formulaire ci-dessous pour être recontacté(e) dans les meilleurs délais.
            </p>
          </div>

          {isSent ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-emerald-900">
                Merci ! Votre message a bien été transmis à Nelly
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Nous avons bien reçu votre demande et vous recontacterons très prochainement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom & Prénom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Claire Martin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="votre.email@exemple.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Objet de votre demande</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
                  >
                    <option value="estimation">Demande d&apos;estimation de mon bien</option>
                    <option value="vente">Mettre en vente un bien</option>
                    <option value="achat">Projet d&apos;acquisition / Recherche</option>
                    <option value="autre">Autre question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Votre Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez votre projet immobilier à Pélissanne, Salon-de-Provence ou dans les environs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Envoyer ma demande à Nelly
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
