'use client';

import { MapPin, MessageCircle, Navigation } from 'lucide-react';
import type { AgendaEvent } from './agenda-types';
import { EventBadge } from './EventBadge';

interface DayViewProps {
    selectedDate: Date;
    events: AgendaEvent[];
    onWhatsApp: (event: AgendaEvent) => void;
}

export function DayView({ selectedDate, events, onWhatsApp }: DayViewProps) {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const dayEvents = events.filter((e) => e.date === dateStr);

    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                        Planning Quotidien
                    </span>
                    <h2 className="text-xl font-serif font-bold text-[#131B26]">
                        {selectedDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-[#E12B7B]">
                        {dayEvents.length} engagement(s) prévu(s)
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {dayEvents.map((ev) => (
                    <div
                        key={ev.id}
                        className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-14 text-center shrink-0">
                                <span className="text-base font-black text-[#131B26] block">{ev.time}</span>
                                <span className="text-[10px] text-gray-400 block">{ev.durationMinutes} min</span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <EventBadge category={ev.category} className="px-2 py-0.5" />
                                    {ev.isUrgent && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                                            Priorité Haute
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-serif font-bold text-base text-[#131B26]">{ev.title}</h3>
                                <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{ev.location}</span>
                                </p>
                                {ev.notes && <p className="text-xs text-gray-500 italic mt-1">{ev.notes}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                            <button
                                onClick={() => onWhatsApp(ev)}
                                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Rappel WhatsApp</span>
                            </button>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition"
                                title="Itinéraire Waze / Maps"
                            >
                                <Navigation className="w-4 h-4 text-blue-600" />
                            </a>
                        </div>
                    </div>
                ))}

                {dayEvents.length === 0 && (
                    <div className="p-8 text-center text-gray-400 italic">
                        Aucun événement prévu pour cette date. Vous pouvez ajouter un rendez-vous grâce au bouton ci-dessus.
                    </div>
                )}
            </div>
        </div>
    );
}
