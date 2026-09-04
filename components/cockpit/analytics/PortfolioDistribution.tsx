'use client';

import { PieChart, MapPin, Building2 } from 'lucide-react';
import type { DistributionSlice } from '@/lib/analytics';
import { formatCompactEuro } from '@/lib/analytics';

interface PortfolioDistributionProps {
    byType: DistributionSlice[];
    byCity: DistributionSlice[];
    byMandateType: DistributionSlice[];
}

const DONUT_COLORS = ['#E12B7B', '#C59A45', '#3D4E41', '#6B7280'];
const BAR_COLORS = ['#E12B7B', '#C59A45', '#3D4E41', '#6B7280', '#8B5CF6', '#0EA5E9'];

function DonutChart({ slices }: { slices: DistributionSlice[] }) {
    const total = slices.reduce((s, x) => s + x.count, 0);
    if (total === 0) {
        return <p className="text-xs text-gray-400 py-6 text-center">Aucune donnée.</p>;
    }

    const boundaries = slices.reduce<number[]>(
        (acc, slice) => {
            const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
            acc.push(prev + slice.count);
            return acc;
        },
        []
    );
    const segments = slices.map((slice, idx) => {
        const start = ((idx === 0 ? 0 : boundaries[idx - 1]) / total) * 360;
        const end = (boundaries[idx] / total) * 360;
        return { slice, start, end, color: DONUT_COLORS[idx % DONUT_COLORS.length] };
    });

    const polar = (angleDeg: number, radius: number) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
    };

    const arcPath = (start: number, end: number, radius: number) => {
        const largeArc = end - start > 180 ? 1 : 0;
        const p1 = polar(start, radius);
        const p2 = polar(end, radius);
        return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-5">
            <svg viewBox="0 0 100 100" className="w-36 h-36 shrink-0">
                {segments.map((seg, idx) => (
                    <path
                        key={idx}
                        d={`${arcPath(seg.start, seg.end, 40)} L ${polar(seg.end, 28).x} ${polar(seg.end, 28).y} A 28 28 0 ${seg.end - seg.start > 180 ? 1 : 0} 0 ${polar(seg.start, 28).x} ${polar(seg.start, 28).y} Z`}
                        fill={seg.color}
                    />
                ))}
                <circle cx="50" cy="50" r="28" fill="white" />
                <text x="50" y="47" textAnchor="middle" className="fill-[#131B26]" fontSize="11" fontWeight="800">
                    {total}
                </text>
                <text x="50" y="58" textAnchor="middle" className="fill-gray-400" fontSize="5.5">
                    mandats
                </text>
            </svg>
            <div className="space-y-1.5 w-full">
                {segments.map((seg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-gray-700">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                            {seg.slice.label}
                        </span>
                        <span className="font-bold text-[#131B26]">{seg.slice.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HorizontalBars({ slices, colorKey }: { slices: DistributionSlice[]; colorKey: 'type' | 'city' }) {
    const max = slices.length > 0 ? Math.max(...slices.map((s) => s.count)) : 0;
    if (slices.length === 0) {
        return <p className="text-xs text-gray-400 py-6 text-center">Aucune donnée.</p>;
    }
    return (
        <div className="space-y-2.5">
            {slices.map((slice, idx) => {
                const width = max > 0 ? Math.max(8, (slice.count / max) * 100) : 0;
                const color =
                    colorKey === 'type'
                        ? BAR_COLORS[idx % BAR_COLORS.length]
                        : '#131B26';
                return (
                    <div key={slice.key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-700 truncate">{slice.label}</span>
                            <span className="text-gray-500">
                                <span className="font-black text-[#131B26]">{slice.count}</span>
                                {' · '}
                                {formatCompactEuro(slice.value)}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function PortfolioDistribution({ byType, byCity, byMandateType }: PortfolioDistributionProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Mandat type donut */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
                        <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#131B26]">Type de Mandat</h3>
                        <p className="text-[11px] text-gray-400">Stock actif</p>
                    </div>
                </div>
                <DonutChart slices={byMandateType} />
            </div>

            {/* By type */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#131B26]">Type de Bien</h3>
                        <p className="text-[11px] text-gray-400">Stock actif</p>
                    </div>
                </div>
                <HorizontalBars slices={byType} colorKey="type" />
            </div>

            {/* By city */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#131B26]">Répartition par Ville</h3>
                        <p className="text-[11px] text-gray-400">Stock actif</p>
                    </div>
                </div>
                <HorizontalBars slices={byCity} colorKey="city" />
            </div>
        </div>
    );
}
