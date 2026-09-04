'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Send } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyVisitFormProps {
    property: Property;
    mandateRef: string;
    addContactLead: (leadData: {
        name: string;
        phone: string;
        email: string;
        subject: string;
        property_id: string;
        property_title: string;
        message: string;
    }) => Promise<unknown>;
}

/**
 * Formulaire « Demander une Visite Privée » autonome. Gère son propre état de
 * champs et l'écran de confirmation après envoi du lead de contact.
 */
export function PropertyVisitForm({ property, mandateRef, addContactLead }: PropertyVisitFormProps) {
    const [contactSent, setContactSent] = useState(false);
    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [visitorEmail, setVisitorEmail] = useState('');
    const [visitorMessage, setVisitorMessage] = useState('');
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const availableSlots = [
        'Semaine (matin)',
        'Semaine (après-midi)',
        'Fin de journée (> 18h)',
        'Le samedi',
    ];

    const toggleSlot = (slot: string) => {
        setSelectedSlots((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const baseMsg = visitorMessage || `Bonjour Nelly, je souhaiterais organiser une visite pour cette ${property.property_type} à ${property.city} (Réf. ${mandateRef}).`;
        const slotsSuffix = selectedSlots.length > 0
            ? `\n\n[Créneaux préférés : ${selectedSlots.join(', ')}]`
            : '';

        addContactLead({
            name: visitorName,
            phone: visitorPhone,
            email: visitorEmail,
            subject: 'visite',
            property_id: property.id,
            property_title: `${property.title} (${property.city})`,
            message: `${baseMsg}${slotsSuffix}`,
        });
        setContactSent(true);
    };

    return (
        <div className="border-t border-[#FAF5F8] pt-4 space-y-4" id="visite-form">
            <h4 className="font-serif font-bold text-sm text-[#131B26] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#E12B7B]" />
                Demander une Visite Privée
            </h4>

            {contactSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1 animate-fade-in">
                    <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Demande transmise à Nelly !
                    </p>
                    <p className="text-[11px] text-emerald-700">
                        Nelly Fernandez vous recontactera sous 2 heures pour convenir d’un créneau.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                        <input
                            type="text"
                            required
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                            placeholder="Votre Nom & Prénom"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            required
                            value={visitorPhone}
                            onChange={(e) => setVisitorPhone(e.target.value)}
                            placeholder="Votre Numéro de Téléphone"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            required
                            value={visitorEmail}
                            onChange={(e) => setVisitorEmail(e.target.value)}
                            placeholder="Votre E-mail"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                        />
                    </div>

                    <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-bold text-gray-600 block">
                            Vos disponibilités idéales pour visiter :
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {availableSlots.map((slot) => {
                                const isSelected = selectedSlots.includes(slot);
                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => toggleSlot(slot)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#E12B7B] text-white shadow-xs font-semibold'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {isSelected ? '✓ ' : '+ '}{slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <textarea
                            rows={3}
                            value={visitorMessage}
                            onChange={(e) => setVisitorMessage(e.target.value)}
                            placeholder={`Bonjour Nelly, je souhaiterais organiser une visite pour cette ${property.property_type} à ${property.city} (Réf. ${mandateRef}).`}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Send className="w-3.5 h-3.5" />
                        Transmettre ma demande
                    </button>
                </form>
            )}
        </div>
    );
}
