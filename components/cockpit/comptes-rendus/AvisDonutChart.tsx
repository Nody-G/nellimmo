'use client';

/**
 * Camembert (donut) des avis visiteurs — Bilan de Commercialisation (Module 02).
 *
 * Répartition visuelle des retours post-visite : Coup de cœur (positif),
 * Neutre (hésitant) et Négatif. Rend les compteurs du VendorReport lisibles
 * d'un coup d'œil pour le vendeur.
 */

interface AvisDonutChartProps {
    positive: number;
    neutral: number;
    negative: number;
}

interface Slice {
    label: string;
    value: number;
    color: string;
    textColor: string;
}

const SLICE_META: { label: string; color: string; textColor: string }[] = [
    { label: 'Coup de cœur', color: '#10B981', textColor: 'text-emerald-700' },
    { label: 'Neutre', color: '#F59E0B', textColor: 'text-amber-700' },
    { label: 'Négatif', color: '#EF4444', textColor: 'text-red-700' },
];

/** Convertit un angle en coordonnées cartésiennes sur le cercle de rayon r. */
function polar(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Construit le path SVG d'un arc de donut entre startAngle et endAngle. */
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = polar(cx, cy, r, endAngle);
    const end = polar(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function AvisDonutChart({ positive, neutral, negative }: AvisDonutChartProps) {
    const total = positive + neutral + negative;

    if (total <= 0) {
        return (
            <div className="flex items-center justify-center h-40 text-xs text-gray-400 font-semibold">
                Aucun retour visiteurs enregistré sur cette période.
            </div>
        );
    }

    const slices: Slice[] = [
        { label: SLICE_META[0].label, value: positive, color: SLICE_META[0].color, textColor: SLICE_META[0].textColor },
        { label: SLICE_META[1].label, value: neutral, color: SLICE_META[1].color, textColor: SLICE_META[1].textColor },
        { label: SLICE_META[2].label, value: negative, color: SLICE_META[2].color, textColor: SLICE_META[2].textColor },
    ].filter((s) => s.value > 0);

    const size = 160;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 62;
    const strokeWidth = 26;

    let cumulative = 0;
    const paths = slices.map((slice) => {
        const startAngle = (cumulative / total) * 360;
        cumulative += slice.value;
        const endAngle = (cumulative / total) * 360;
        const path = arcPath(cx, cy, radius, startAngle, endAngle);
        return { ...slice, path, pct: Math.round((slice.value / total) * 100) };
    });

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Donut */}
            <div className="relative shrink-0">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-0">
                    <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F3E8EE" strokeWidth={strokeWidth} />
                    {slices.length === 1 ? (
                        <circle
                            cx={cx}
                            cy={cy}
                            r={radius}
                            fill="none"
                            stroke={slices[0].color}
                            strokeWidth={strokeWidth}
                        />
                    ) : (
                        paths.map((p) => (
                            <path
                                key={p.label}
                                d={p.path}
                                fill="none"
                                stroke={p.color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="butt"
                            />
                        ))
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[#131B26]">{total}</span>
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">avis</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full space-y-2">
                {paths.map((p) => (
                    <div key={p.label} className="flex items-center justify-between gap-3 text-xs">
                        <span className="flex items-center gap-2 text-gray-700 font-semibold">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                            {p.label}
                        </span>
                        <span className={`font-black ${p.textColor}`}>
                            {p.value} <span className="text-[10px] font-bold text-gray-400">({p.pct}%)</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
