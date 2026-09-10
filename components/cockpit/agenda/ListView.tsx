'use client';

import Link from 'next/link';
import { ExternalLink, MapPin, MessageCircle, Navigation, Calendar } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';
import type { AgendaEvent } from './agenda-types';
import { EventBadge } from './EventBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { createGoogleMapsNavUrl, createGoogleCalendarUrl } from '@/lib/google';

interface ListViewProps {
    events: AgendaEvent[];
    currentTime: number | null;
    onWhatsApp: (event: AgendaEvent) => void;
    highlightEventId?: string;
}

/** Chronological list view of all upcoming & past events. */
export function ListView({ events, currentTime, onWhatsApp, highlightEventId }: ListViewProps) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-bold text-base text-[#131B26]">
                    Chronologie Intégrale des Échéances & Rendez-Vous ({events.length})
                </h3>
                <span className="text-xs text-gray-400">Trié par date croissante</span>
            </div>

            <div className="divide-y divide-gray-100">
                {events.map((ev) => {
                    const eventDate = new Date(`${ev.date}T${ev.time || '10:00'}:00`);
                    const isPast = currentTime !== null && eventDate.getTime() < currentTime;

                    const handleOpenGoogleCalendar = () => {
                        const url = createGoogleCalendarUrl({
                            title: ev.title,
                            location: ev.location,
                            startDate: `${ev.date}T${ev.time || '10:00'}:00`,
                            description: `Contact: ${ev.contactName} (${ev.contactPhone})\nNotes: ${ev.notes || 'Rendez-vous agence Nell\'Immo'}`,
                        });
                        window.open(url, '_blank', 'noopener,noreferrer');
                    };

                    const handleOpenGps = () => {
                        if (!ev.location) return;
                        const url = createGoogleMapsNavUrl(ev.location);
                        window.open(url, '_blank', 'noopener,noreferrer');
                    };

                    return (
                        <div
                            key={ev.id}
                            id={`event-${ev.id}`}
                            className={`py-3.5 px-2 -mx-2 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${highlightEventId === ev.id
                                ? 'bg-[#FDF2F8] ring-2 ring-[#E12B7B]/30'
                                : ''
                                } ${isPast ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-20 shrink-0 text-center bg-gray-50 p-2 rounded-xl border border-gray-200">
                                    <span className="text-xs font-bold text-gray-500 block uppercase">
                                        {eventDate.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                    </span>
                                    <span className="text-base font-black text-gray-900 block">
                                        {eventDate.getDate()} {eventDate.toLocaleDateString('fr-FR', { month: 'short' })}
                                    </span>
                                    <span className="text-[10px] text-[#E12B7B] font-bold block">{ev.time}</span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <EventBadge category={ev.category} className="px-2 py-0.5" />
                                        {ev.mandateNumber && (
                                            <span className="text-[10px] font-mono font-bold text-gray-500">
                                                {formatMandateRef(ev.mandateNumber)}
                                            </span>
                                        )}
                                        {ev.isUrgent && (
                                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                                                Alerte Délais
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="font-serif font-bold text-sm text-[#131B26]">
                                        <EntityLink kind="event" id={ev.id} withIcon title="Voir l'événement dans l'agenda">
                                            {ev.title}
                                        </EntityLink>
                                    </h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{ev.location}</span>
                                        <span>
                                            &bull; Contact :{' '}
                                            {ev.buyerId ? (
                                                <EntityLink kind="buyer" id={ev.buyerId} title="Voir la fiche acquéreur">
                                                    {ev.contactName}
                                                </EntityLink>
                                            ) : (
                                                <EntityLink kind="contact" id={ev.contactId} title="Voir la fiche contact">
                                                    {ev.contactName}
                                                </EntityLink>
                                            )}{' '}
                                            ({ev.contactPhone})
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => onWhatsApp(ev)}
                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>WhatsApp</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleOpenGoogleCalendar}
                                    className="p-1.5 bg-gray-50 hover:bg-gray-100 text-[#E12B7B] rounded-xl transition cursor-pointer"
                                    title="Ajouter dans Google Agenda"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleOpenGps}
                                    className="p-1.5 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-xl transition cursor-pointer"
                                    title="Itinéraire GPS Google Maps"
                                >
                                    <Navigation className="w-3.5 h-3.5" />
                                </button>

                                {ev.propertyId && (
                                    <Link
                                        href={`/cockpit/mandats/${ev.propertyId}`}
                                        className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition"
                                        title="Voir le mandat"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}

                {events.length === 0 && (
                    <div className="p-8 text-center text-gray-400 italic">
                        Aucun événement ne correspond à ce filtre.
                    </div>
                )}
            </div>
        </div>
    );
}
