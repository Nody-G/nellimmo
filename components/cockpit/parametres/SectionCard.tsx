'use client';

import { ReactNode } from 'react';

interface SectionCardProps {
    icon: ReactNode;
    title: string;
    badge?: string;
    badgeClassName?: string;
    children: ReactNode;
}

/** Reusable white card wrapper for a settings section with icon, title and optional badge. */
export function SectionCard({
    icon,
    title,
    badge,
    badgeClassName = 'bg-emerald-50 text-emerald-700 border-emerald-200',
    children,
}: SectionCardProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26]">
                    {icon}
                    <span>{title}</span>
                </div>
                {badge && (
                    <span
                        className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase ${badgeClassName}`}
                    >
                        {badge}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}
