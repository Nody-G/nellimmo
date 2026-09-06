'use client';

import React, { forwardRef } from 'react';
import type { AmenityItem, NeighborhoodSummary } from '@/lib/amenities';
import { CATEGORY_CONFIG } from '@/lib/amenities';
import type { CadastreParcel } from '@/lib/cadastre';
import type { Property } from '@/lib/types';
import {
    NeighborhoodSheetOptions,
    LAW_REFERENCES,
    METRIC_REFERENCES,
} from '@/lib/neighborhood-sheets';

/**
 * ============================================================================
 * NeighborhoodSheetCanvas
 * ============================================================================
 * Surface de rendu CARRÉE (grande, haute résolution) d'une « Fiche Quartier ».
 * Elle est volontairement autonome (SVG + HTML) : elle ne capture pas les
 * tuiles cartographiques distantes (souvent cross-origin / non reproductibles
 * à l'export), mais dessine une carte vectorielle nette et professionnelle :
 *   • anneaux de distance (rayon en mètres),
 *   • parcelle cadastrale + rose des vents,
 *   • points d'intérêt (POI) positionnés par projection lat/lon,
 *   • en-tête (logo / titre / adresse), métriques, lois & légende.
 *
 * Le composant est capturé en PNG/PDF via html2canvas à une résolution carrée
 * élevée (1600×1600 par défaut) → parfait pour un dossier client.
 * ========================================================================== */

export const SHEET_CANVAS_SIZE = 1600; // px (carré)

interface NeighborhoodSheetCanvasProps {
    property: Property;
    parcel?: CadastreParcel | null;
    summary?: NeighborhoodSummary | null;
    amenities: AmenityItem[];
    options: NeighborhoodSheetOptions;
    /** Taille d'affichage (CSS) — le rendu interne reste proportionnel. */
    displaySize?: number;
}

/** Projection équirectangulaire locale autour du centre (valable sur ~2 km). */
function project(lat: number, lon: number, centerLat: number, centerLon: number, radiusMeters: number, size: number) {
    const R = 6371000;
    const dLat = ((lat - centerLat) * Math.PI) / 180;
    const dLon = ((lon - centerLon) * Math.PI) / 180;
    const x = (dLon * Math.cos((centerLat * Math.PI) / 180) * R) / radiusMeters;
    const y = (dLat * R) / radiusMeters;
    const half = size / 2;
    // Le rayon = ~42% du demi-côté pour laisser la place aux overlays
    const scale = half * 0.78;
    return { x: half + x * scale, y: half - y * scale };
}

export const NeighborhoodSheetCanvas = forwardRef<HTMLDivElement, NeighborhoodSheetCanvasProps>(
    function NeighborhoodSheetCanvas(
        { property, parcel, summary, amenities, options, displaySize = SHEET_CANVAS_SIZE },
        ref
    ) {
        const size = SHEET_CANVAS_SIZE;
        const centerLat = property.latitude ?? parcel?.coordinates?.lat ?? 43.64;
        const centerLon = property.longitude ?? parcel?.coordinates?.lon ?? 5.197;
        const radius = options.radiusMeters || 800;

        const accent = options.accentColor || '#0F766E';

        // POI filtrés par catégories sélectionnées
        const visibleAmenities = amenities.filter((a) => options.poiCategories.includes(a.category));

        // Métriques calculées
        const minDist = summary?.minDistances ?? {};
        const metricItems: Record<string, AmenityItem | undefined> = {
            boulangerie: minDist.boulangerie,
            supermarche: minDist.supermarche || minDist.superette,
            primaire: minDist.primaire,
            maternelle: minDist.maternelle,
            college: minDist.college,
            pharmacie: minDist.pharmacie,
            sport: minDist.sport,
            parc: minDist.parc,
            transport: minDist.bus || minDist.gare,
        };
        const visibleMetrics = METRIC_REFERENCES.filter((m) => options.metricIds.includes(m.id));
        const visibleLaws = LAW_REFERENCES.filter((l) => options.lawIds.includes(l.id));

        const addressLine = options.showAddress
            ? [property.address, `${property.postal_code} ${property.city}`].filter(Boolean).join(' · ')
            : property.city;

        // Anneaux de distance (proportionnels au rayon)
        const rings = [0.25, 0.5, 0.75, 1].map((f) => f * radius);

        const parcelPts = (parcel?.polygon || []).map(([lon, lat]) =>
            project(lat, lon, centerLat, centerLon, radius, size)
        );
        const parcelPath =
            parcelPts.length >= 3
                ? `M ${parcelPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} Z`
                : '';

        const center = project(centerLat, centerLon, centerLat, centerLon, radius, size);

        return (
            <div
                ref={ref}
                style={{ width: displaySize, height: displaySize, backgroundColor: '#0B132B' }}
                className="relative overflow-hidden select-none"
                data-sheet-canvas
            >
                {/* Fond dégradé */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(circle at 50% 42%, #16233b 0%, #0B132B 60%, #070D1B 100%)',
                    }}
                />

                {/* ===== CARTE VECTORIELLE SVG ===== */}
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="absolute inset-0"
                >
                    {/* Anneaux de distance */}
                    {options.showMetrics &&
                        rings.map((r, i) => {
                            const px = (r / radius) * size * 0.39;
                            return (
                                <g key={i}>
                                    <circle
                                        cx={center.x}
                                        cy={center.y}
                                        r={px}
                                        fill="none"
                                        stroke={i === rings.length - 1 ? accent : '#ffffff22'}
                                        strokeWidth={i === rings.length - 1 ? 3 : 1.5}
                                        strokeDasharray={i === rings.length - 1 ? 'none' : '6 8'}
                                    />
                                    <text
                                        x={center.x + px + 8}
                                        y={center.y - 6}
                                        fill="#ffffff88"
                                        fontSize="26"
                                        fontFamily="monospace"
                                    >
                                        {r >= 1000 ? `${r / 1000} km` : `${r} m`}
                                    </text>
                                </g>
                            );
                        })}

                    {/* Lignes cardinales */}
                    <line x1={center.x - size * 0.39} y1={center.y} x2={center.x + size * 0.39} y2={center.y} stroke="#ffffff14" strokeWidth="1.5" />
                    <line x1={center.x} y1={center.y - size * 0.39} x2={center.x} y2={center.y + size * 0.39} stroke="#ffffff14" strokeWidth="1.5" />

                    {/* Rose des vents */}
                    <g transform={`translate(${center.x}, ${center.y - size * 0.39 - 40})`}>
                        <polygon points="0,-26 9,10 0,2 -9,10" fill={accent} />
                        <text y="34" textAnchor="middle" fill="#ffffffcc" fontSize="30" fontWeight="bold" fontFamily="sans-serif">
                            N
                        </text>
                    </g>

                    {/* Parcelle cadastrale */}
                    {options.showParcel && parcelPath && (
                        <path
                            d={parcelPath}
                            fill={accent}
                            fillOpacity="0.18"
                            stroke={accent}
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />
                    )}
                    {/* Point central du bien */}
                    <circle cx={center.x} cy={center.y} r="16" fill="#ffffff" />
                    <circle cx={center.x} cy={center.y} r="26" fill="none" stroke="#ffffff" strokeWidth="4" />
                    <circle cx={center.x} cy={center.y} r="40" fill="none" stroke="#ffffff55" strokeWidth="2" />

                    {/* POI */}
                    {visibleAmenities.map((a) => {
                        const pos = project(a.lat, a.lon, centerLat, centerLon, radius, size);
                        const cfg = CATEGORY_CONFIG[a.category] || { color: '#3B82F6', emoji: '📍' };
                        const inRange =
                            Math.abs(pos.x - center.x) <= size * 0.39 && Math.abs(pos.y - center.y) <= size * 0.39;
                        if (!inRange) return null;
                        return (
                            <g key={a.id}>
                                <circle cx={pos.x} cy={pos.y} r="30" fill={cfg.color} fillOpacity="0.25" />
                                <circle cx={pos.x} cy={pos.y} r="15" fill={cfg.color} stroke="#ffffff" strokeWidth="3" />
                                <text x={pos.x} y={pos.y + 6} textAnchor="middle" fontSize="18">
                                    {cfg.emoji}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* ===== EN-TÊTE ===== */}
                {options.showHeader && (
                    <div className="absolute top-0 left-0 right-0 px-16 pt-12 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl"
                                    style={{ backgroundColor: accent }}
                                >
                                    N
                                </div>
                                <div>
                                    <div className="text-white font-serif font-bold text-5xl leading-none">
                                        {options.agencyName || 'Nellimo Immobilier'}
                                    </div>
                                    {options.agencyTagline && (
                                        <div className="text-white/60 text-2xl mt-2">{options.agencyTagline}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-white">
                            <div className="text-3xl font-bold">{property.title}</div>
                            <div className="text-white/70 text-2xl mt-1">{addressLine}</div>
                            {options.showWalkability && summary && (
                                <div className="mt-3 inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-5 py-2.5">
                                    <span className="text-white/70 text-xl">Praticité</span>
                                    <span className="text-4xl font-black" style={{ color: accent }}>
                                        {summary.walkabilityScore}
                                    </span>
                                    <span className="text-white/60 text-xl">/100</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== LÉGENDE POI (bas gauche) ===== */}
                {options.showLegend && (
                    <div className="absolute bottom-12 left-12 bg-black/40 backdrop-blur rounded-3xl border border-white/10 px-8 py-6">
                        <div className="text-white/60 text-xl font-bold uppercase tracking-wider mb-4">
                            Points d’intérêt
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {options.poiCategories.map((cat) => {
                                const cfg = CATEGORY_CONFIG[cat];
                                const count = amenities.filter((a) => a.category === cat).length;
                                return (
                                    <div key={cat} className="flex items-center gap-3 text-white">
                                        <span
                                            className="w-5 h-5 rounded-full inline-block"
                                            style={{ backgroundColor: cfg.color }}
                                        />
                                        <span className="text-2xl">{cfg.emoji}</span>
                                        <span className="text-2xl">{cfg.label}</span>
                                        <span className="text-white/50 text-xl ml-2">({count})</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===== MÉTRIQUES (bas droite) ===== */}
                {options.showMetrics && (
                    <div className="absolute bottom-12 right-12 bg-black/40 backdrop-blur rounded-3xl border border-white/10 px-8 py-6 max-w-[560px]">
                        <div className="text-white/60 text-xl font-bold uppercase tracking-wider mb-4">
                            Distances depuis le bien
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {visibleMetrics.map((m) => (
                                <div key={m.id} className="flex items-center justify-between gap-6 text-white">
                                    <span className="text-2xl flex items-center gap-2">
                                        <span>{m.icon}</span>
                                        <span className="text-white/80">{m.label}</span>
                                    </span>
                                    <span className="text-2xl font-black" style={{ color: accent }}>
                                        {m.compute(metricItems)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== LOIS & RÈGLES (bandeau bas) ===== */}
                {options.showLaws && visibleLaws.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 px-12 pb-8">
                        <div className="bg-[#0B132B]/85 backdrop-blur rounded-2xl border border-white/10 px-8 py-5">
                            <div className="flex items-center gap-2 text-white/60 text-lg font-bold uppercase tracking-wider mb-3">
                                <span>⚖️</span>
                                <span>Cadre légal & règles en vigueur</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                                {visibleLaws.map((law) => (
                                    <div key={law.id} className="flex items-start gap-2 text-white/85">
                                        <span className="text-xl">{law.icon}</span>
                                        <div>
                                            <span className="font-bold text-white text-xl">{law.code}</span>
                                            <span className="text-white/55 text-lg"> — {law.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mention source */}
                <div className="absolute top-0 right-0 px-8 py-6 text-white/40 text-lg">
                    Document généré par {options.agencyName || 'Nellimo'} — données indicatives
                </div>
            </div>
        );
    }
);
