'use client';

import { Clock, MapPin, MessageCircle, Navigation } from 'lucide-react';
import type { AgendaEvent, WeekDay } from './agenda-types';
import { EventBadge } from './EventBadge';

interface WeekViewProps {
    weekDays: WeekDay[];
    events: AgendaEvent[];
    onWhatsApp: (event: AgendaEvent) => void;
}

export function WeekView({ weekDays, events, onWhatsApp }: WeekViewProps) {
    const todayStr = new Date().toISOString().slice(0, 10);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map((col) => {
                const isColToday = col.dateStr === todayStr;
                const dayEvents = events.filter((e) => e.date === col.dateStr);

                return (
                    <div
                        key={col.dateStr}
                        className={`flex flex-col rounded-3xl p-3 border min-h-[480px] transition ${isColToday
                                ? 'bg-gradient-to-b from-[#FDF2F8]/60 to-white border-[#E12B7B]/30 shadow-sm'
                                : 'bg-white border-[#F3E8EE]'
                            }`}
                    >
                        {/* Column Day Header */}
                        <div className="border-b border-gray-100 pb-2.5 mb-2.5 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                                    {col.dayName}
                                </span>
                                <span
                                    className={`text-lg font-serif font-black ${isColToday ? 'text-[#E12B7B]' : 'text-[#131B26]'
                                        }`}
                                >
                                    {col.dayNum}
                                </span>
                            </div>

                            {isColToday && (
                                <span className="px-1.5 py-0.5 rounded bg-[#E12B7B] text-white text-[9px] font-black uppercase tracking-wider">
                                    Aujourd&rsquo;hui
                                </span>
                            )}
                        </div>

                        {/* Events list for this day */}
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {dayEvents.length === 0 ? (
                                <div className="h-full flex items-center justify-center p-4 text-center">
                                    <span className="text-[11px] text-gray-300 italic">Aucun RDV</span>
                                </div>
                            ) : (
                                dayEvents.map((ev) => (
                                    <div
                                        key={ev.id}
                                        className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition text-left space-y-2 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <EventBadge category={ev.category} />
                                            <span className="text-[11px] font-black text-gray-900 flex items-center gap-0.5">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                {ev.time}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-xs text-[#131B26] line-clamp-2 leading-tight">
                                                {ev.title}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 truncate">
                                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                                <span className="truncate">{ev.location}</span>
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                                            <span className="font-semibold text-gray-700 truncate max-w-[90px]">
                                                {ev.contactName}
                                            </span>

                                            <div className="flex items-center gap-1">
                                                {ev.contactPhone && (
                                                    <button
                                                        onClick={() => onWhatsApp(ev)}
                                                        className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition cursor-pointer"
                                                        title="Envoyer confirmation WhatsApp"
                                                    >
                                                        <MessageCircle className="w-3 h-3" />
                                                    </button>
                                                )}
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition"
                                                    title="Itinéraire GPS Google Maps"
                                                >
                                                    <Navigation className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
