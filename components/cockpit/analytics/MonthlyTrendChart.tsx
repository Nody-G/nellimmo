'use client';

import { Activity } from 'lucide-react';
import type { MonthlyPoint } from '@/lib/analytics';

interface MonthlyTrendChartProps {
    monthly: MonthlyPoint[];
}

const SERIES = [
    { key: 'mandates', label: 'Mandats signés', color: '#E12B7B' },
    { key: 'closed', label: 'Ventes conclues', color: '#3D4E41' },
    { key: 'visits', label: 'Visites', color: '#C59A45' },
    { key: 'leads', label: 'Leads entrants', color: '#8B5CF6' },
] as const;

export function MonthlyTrendChart({ monthly }: MonthlyTrendChartProps) {
    const maxValue = Math.max(1, ...monthly.flatMap((m) => [m.mandates, m.closed, m.visits, m.leads]));
    const chartHeight = 180;
    const chartWidth = 640;
    const padding = { top: 12, right: 8, bottom: 28, left: 8 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const n = monthly.length;
    const groupWidth = n > 0 ? innerWidth / n : innerWidth;
    const barGroupWidth = Math.min(34, groupWidth * 0.6);
    const barWidth = barGroupWidth / SERIES.length;

    const y = (value: number) => padding.top + innerHeight - (value / maxValue) * innerHeight;

    return (
        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#131B26]">Activité Mensuelle</h3>
                        <p className="text-[11px] text-gray-400">Mandats, ventes, visites et leads</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {SERIES.map((s) => (
                        <span key={s.key} className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-600">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                            {s.label}
                        </span>
                    ))}
                </div>
            </div>

            {monthly.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">Aucune donnée sur la période.</p>
            ) : (
                <div className="overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        className="w-full min-w-[560px]"
                        role="img"
                        aria-label="Graphique d'activité mensuelle"
                    >
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                            const gy = padding.top + innerHeight * t;
                            return (
                                <g key={t}>
                                    <line
                                        x1={padding.left}
                                        y1={gy}
                                        x2={chartWidth - padding.right}
                                        y2={gy}
                                        stroke="#F1F0F5"
                                        strokeWidth={1}
                                    />
                                    <text
                                        x={padding.left - 4}
                                        y={gy + 3}
                                        textAnchor="end"
                                        className="fill-gray-300"
                                        fontSize={8}
                                    >
                                        {Math.round(maxValue * (1 - t))}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Bars */}
                        {monthly.map((point, idx) => {
                            const gx = padding.left + idx * groupWidth;
                            const center = gx + groupWidth / 2;
                            const startX = center - barGroupWidth / 2;
                            return (
                                <g key={point.key}>
                                    {SERIES.map((s, si) => {
                                        const value = point[s.key];
                                        const bx = startX + si * barWidth;
                                        const bh = (value / maxValue) * innerHeight;
                                        return (
                                            <rect
                                                key={s.key}
                                                x={bx}
                                                y={y(value)}
                                                width={Math.max(2, barWidth - 1.5)}
                                                height={Math.max(0, bh)}
                                                rx={1.5}
                                                fill={s.color}
                                            >
                                                <title>{`${point.label} — ${s.label} : ${value}`}</title>
                                            </rect>
                                        );
                                    })}
                                    <text
                                        x={center}
                                        y={chartHeight - 10}
                                        textAnchor="middle"
                                        className="fill-gray-400"
                                        fontSize={7.5}
                                    >
                                        {point.label}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            )}
        </div>
    );
}
