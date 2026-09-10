'use client';

import {
    Calendar as CalendarIcon,
    Download,
    PlusCircle,
    Map,
    ExternalLink,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import { createGoogleMapsTourUrl } from '@/lib/google';

interface AgendaHeaderProps {
    onExportICal: () => void;
    onNewEvent: () => void;
    tourStops?: string[];
    onSyncGoogleCalendar?: () => void;
    isSyncingGoogle?: boolean;
}

export function AgendaHeader({
    onExportICal,
    onNewEvent,
    tourStops = [],
    onSyncGoogleCalendar,
    isSyncingGoogle = false,
}: AgendaHeaderProps) {
    const handleOpenTour = () => {
        if (tourStops.length === 0) return;
        const url = createGoogleMapsTourUrl(tourStops);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

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

            <div className="flex flex-wrap items-center gap-2">
                {tourStops.length > 0 && (
                    <button
                        type="button"
                        onClick={handleOpenTour}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                        title={`Lancer la tournée Google Maps de la journée (${tourStops.length} arrêts)`}
                    >
                        <Map className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tournée Maps ({tourStops.length})</span>
                    </button>
                )}

                {onSyncGoogleCalendar && (
                    <button
                        type="button"
                        onClick={onSyncGoogleCalendar}
                        disabled={isSyncingGoogle}
                        className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Pousser les événements de la semaine vers votre Google Agenda"
                    >
                        {isSyncingGoogle ? (
                            <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />
                        ) : (
                            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                        )}
                        <span>{isSyncingGoogle ? 'Sync…' : 'Sync Google'}</span>
                    </button>
                )}

                <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                    title="Ouvrir Google Agenda dans un nouvel onglet"
                >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    <span>Google Agenda</span>
                </a>

                <button
                    type="button"
                    onClick={onExportICal}
                    className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                    title="Exporter vers Apple Calendar, Google Calendar, Outlook"
                >
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                    <span>Export iCal</span>
                </button>

                <button
                    type="button"
                    onClick={onNewEvent}
                    className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Nouveau RDV</span>
                </button>
            </div>
        </div>
    );
}
