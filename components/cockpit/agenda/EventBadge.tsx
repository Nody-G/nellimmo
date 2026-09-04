'use client';

import { Calendar as CalendarIcon, KeyRound, Landmark, PenTool, TrendingUp } from 'lucide-react';
import type { EventCategory } from './agenda-types';

interface EventBadgeProps {
    category: EventCategory;
    className?: string;
}

/** Renders a colored category badge for an agenda event. */
export function EventBadge({ category, className = '' }: EventBadgeProps) {
    let label = 'Rendez-vous';
    let bg = 'bg-gray-100 text-gray-800 border-gray-200';
    let Icon = CalendarIcon;

    switch (category) {
        case 'visite':
            label = 'Visite';
            bg = 'bg-rose-50 text-[#E12B7B] border-[#F3E8EE]';
            Icon = PenTool;
            break;
        case 'notaire':
            label = 'Notaire';
            bg = 'bg-purple-50 text-purple-700 border-purple-200';
            Icon = Landmark;
            break;
        case 'estimation':
            label = 'Estimation';
            bg = 'bg-amber-50 text-amber-800 border-amber-200';
            Icon = TrendingUp;
            break;
        case 'panneau_cle':
            label = 'Clés & Panneaux';
            bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            Icon = KeyRound;
            break;
    }

    return (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1 ${bg} ${className}`}>
            <Icon className="w-3 h-3" />
            <span>{label}</span>
        </span>
    );
}
