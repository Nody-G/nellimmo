'use client';

import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { EventCategory } from './agenda-types';

interface NewEventModalProps {
    isOpen: boolean;
    title: string;
    category: EventCategory;
    date: string;
    time: string;
    location: string;
    contactName: string;
    contactPhone: string;
    notes: string;
    onTitleChange: (value: string) => void;
    onCategoryChange: (value: EventCategory) => void;
    onDateChange: (value: string) => void;
    onTimeChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onContactNameChange: (value: string) => void;
    onContactPhoneChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

/** Modal form to quickly add a custom agency appointment to the agenda. */
export function NewEventModal({
    isOpen,
    title,
    category,
    date,
    time,
    location,
    contactName,
    contactPhone,
    notes,
    onTitleChange,
    onCategoryChange,
    onDateChange,
    onTimeChange,
    onLocationChange,
    onContactNameChange,
    onContactPhoneChange,
    onNotesChange,
    onSubmit,
    onClose,
}: NewEventModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-[#E12B7B]" />
                        Nouveau Rendez-Vous Agence
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-800 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-bold uppercase text-gray-700 mb-1">
                            Intitulé du Rendez-Vous
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Visite contre-visite M. Bernard, RDV Notaire, Expertise..."
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Catégorie</label>
                            <select
                                value={category}
                                onChange={(e) => onCategoryChange(e.target.value as EventCategory)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                            >
                                <option value="visite">Visite Acquéreur</option>
                                <option value="notaire">Rendez-Vous Notaire</option>
                                <option value="estimation">Rendez-Vous Estimation</option>
                                <option value="panneau_cle">Pose Panneau / Clé</option>
                                <option value="autre">Autre Rendez-Vous</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Lieu / Adresse</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => onLocationChange(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => onDateChange(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Heure</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => onTimeChange(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Nom du Contact</label>
                            <input
                                type="text"
                                placeholder="Ex: Jean Dupont"
                                value={contactName}
                                onChange={(e) => onContactNameChange(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                            <input
                                type="tel"
                                placeholder="06 12 34 56 78"
                                value={contactPhone}
                                onChange={(e) => onContactPhoneChange(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold uppercase text-gray-700 mb-1">Notes / Consignes</label>
                        <textarea
                            rows={2}
                            placeholder="Points de vigilance, code portail, présence des propriétaires..."
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-800 font-bold cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
                        >
                            Enregistrer dans l{"\u2019"}Agenda
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
