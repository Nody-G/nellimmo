'use client';

import { Calendar as CalendarIcon, Download, PlusCircle } from 'lucide-react';

interface AgendaHeaderProps {
    onExportICal: () => void;
    onNewEvent: () => void;
}

export function AgendaHeader({ onExportICal, onNewEvent }: AgendaHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Pilotage Opérationnel de l&rsquo;Agence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
                    Planning & Agenda Professionnel
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Centralisation temps réel des visites, signatures d&rsquo;actes, délais SRU/prêts et échéances de terrain
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onExportICal}
                    className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                    title="Exporter vers Apple Calendar, Google Calendar, Outlook"
                >
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                    <span>Exporter iCal (.ics)</span>
                </button>

                <button
                    onClick={onNewEvent}
                    className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Nouveau Rendez-Vous</span>
                </button>
            </div>
        </div>
    );
}
