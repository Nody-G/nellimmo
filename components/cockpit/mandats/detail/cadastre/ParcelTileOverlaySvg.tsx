'use client';

import React, { useState } from 'react';
import type { ActiveLayers } from './ParcelMapControls';

interface PointInfo {
  x: number;
  y: number;
  lon: number;
  lat: number;
  index: number;
}

interface MidpointInfo {
  x: number;
  y: number;
  dist: number;
  label: string;
}

interface ParcelTileOverlaySvgProps {
  svgPath: string;
  points: PointInfo[];
  midpoints: MidpointInfo[];
  isSatellite: boolean;
  surfaceText?: string;
  centerPos?: { x: number; y: number };
  scale?: number;
  layers?: ActiveLayers;
  measurePoints?: { x: number; y: number }[];
  measureDistance?: number | null;
}

export function ParcelTileOverlaySvg({
  svgPath,
  points,
  midpoints,
  isSatellite,
  surfaceText,
  centerPos,
  scale = 1,
  layers = { lines: true, points: true, texts: true },
  measurePoints = [],
  measureDistance = null,
}: ParcelTileOverlaySvgProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!svgPath) return null;

  const invScale = 1 / Math.max(scale, 0.1);

  // Anti-crowding filter: avoid solid black blobs when vertices are dense on curves
  const filteredPoints = points.filter((p, i, arr) => {
    if (i === 0 || i === arr.length - 1) return true;
    const prev = arr[i - 1];
    const distPx = Math.hypot(p.x - prev.x, p.y - prev.y);
    return distPx >= 16;
  });

  // Filter midpoints to only display cotes on meaningful segments (> 3.5m)
  const filteredMidpoints = midpoints.filter((m) => m.dist >= 3.5);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(20,184,166,0.7)]">
      {/* 1. CALQUE LIGNES & CONTOURS */}
      {layers.lines && (
        <path
          d={svgPath}
          fill="#0D9488"
          fillOpacity={isSatellite ? 0.32 : 0.22}
          stroke="#14B8A6"
          strokeWidth={3 * invScale}
          strokeLinejoin="round"
        />
      )}

      {/* 2. CALQUE TEXTES: Badge central de surface */}
      {layers.texts && surfaceText && centerPos && (
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          <g transform={`scale(${invScale})`}>
            <rect
              x="-48"
              y="-13"
              width="96"
              height="26"
              rx="8"
              fill="#0B132B"
              stroke="#14B8A6"
              strokeWidth="1.5"
              fillOpacity="0.95"
            />
            <text
              y="4"
              fill="#5EEAD4"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {surfaceText}
            </text>
          </g>
        </g>
      )}

      {/* 3. CALQUE TEXTES: Cotes métriques le long des limites */}
      {layers.texts &&
        filteredMidpoints.map((mid, i) => (
          <g key={`m-${i}`} transform={`translate(${mid.x}, ${mid.y})`}>
            <g transform={`scale(${invScale})`}>
              <rect
                x="-24"
                y="-11"
                width="48"
                height="22"
                rx="6"
                fill="#0B132B"
                stroke="#0D9488"
                strokeWidth="1"
                fillOpacity="0.95"
              />
              <text
                y="3.5"
                fill="#5EEAD4"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {mid.label}
              </text>
            </g>
          </g>
        ))}

      {/* 4. CALQUE POINTS: Bornes de propriété B1, B2... (avec anti-chevauchement) */}
      {layers.points &&
        filteredPoints.map((p) => (
          <g
            key={`p-${p.index}`}
            transform={`translate(${p.x}, ${p.y})`}
            onMouseEnter={() => setHoveredPoint(p.index)}
            onMouseLeave={() => setHoveredPoint(null)}
            className="pointer-events-auto cursor-pointer"
          >
            <g transform={`scale(${invScale})`}>
              <circle
                r={hoveredPoint === p.index ? 8 : 6}
                fill="#F59E0B"
                stroke="#FFF"
                strokeWidth="2"
              />
              <text
                y="-10"
                fill="#FCD34D"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                B{p.index}
              </text>
            </g>
          </g>
        ))}

      {/* 5. CALQUE SOLEIL: Course solaire et points cardinaux */}
      {layers.sun && centerPos && (
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          <g transform={`scale(${invScale})`}>
            {/* Arc trajectoire solaire */}
            <path
              d="M -140 0 A 140 140 0 0 0 140 0"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.8"
            />
            {/* Soleil Matin (Est - droite carto) */}
            <g transform="translate(140, 0)">
              <circle r="9" fill="#FBBF24" stroke="#FFF" strokeWidth="2" />
              <text y="18" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">Matin (Est)</text>
            </g>
            {/* Soleil Midi (Sud - bas carto hémisphère nord) */}
            <g transform="translate(0, 140)">
              <circle r="12" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
              <text y="22" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle">Zénith (Sud)</text>
            </g>
            {/* Soleil Soir (Ouest - gauche carto) */}
            <g transform="translate(-140, 0)">
              <circle r="9" fill="#F97316" stroke="#FFF" strokeWidth="2" />
              <text y="18" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">Soir (Ouest)</text>
            </g>
          </g>
        </g>
      )}

      {/* 6. CALQUE RAYONS: Iso-distances 300m et 500m */}
      {layers.radius && centerPos && (
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          <circle r={150 * invScale} fill="none" stroke="#10B981" strokeWidth={1.5 * invScale} strokeDasharray="6 4" opacity="0.75" />
          <text y={-155 * invScale} fill="#34D399" fontSize={10 * invScale} fontWeight="bold" textAnchor="middle">Rayon ~300m (4 min à pied)</text>
          <circle r={250 * invScale} fill="none" stroke="#3B82F6" strokeWidth={1.5 * invScale} strokeDasharray="6 4" opacity="0.6" />
          <text y={-255 * invScale} fill="#60A5FA" fontSize={10 * invScale} fontWeight="bold" textAnchor="middle">Rayon ~500m (7 min à pied)</text>
        </g>
      )}

      {/* 7. OUTIL MESURE / TÉLÉMÈTRE */}
      {measurePoints.length > 0 && (
        <g>
          {measurePoints.map((pt, idx) => (
            <g key={`meas-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
              <g transform={`scale(${invScale})`}>
                <circle r="7" fill="#E11D48" stroke="#FFF" strokeWidth="2" className="animate-pulse" />
                <text y="4" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {idx === 0 ? 'A' : 'B'}
                </text>
              </g>
            </g>
          ))}

          {measurePoints.length === 2 && (
            <>
              <line
                x1={measurePoints[0].x}
                y1={measurePoints[0].y}
                x2={measurePoints[1].x}
                y2={measurePoints[1].y}
                stroke="#E11D48"
                strokeWidth={2.5 * invScale}
                strokeDasharray="6 4"
              />
              <g transform={`translate(${(measurePoints[0].x + measurePoints[1].x) / 2}, ${(measurePoints[0].y + measurePoints[1].y) / 2})`}>
                <g transform={`scale(${invScale})`}>
                  <rect x="-38" y="-12" width="76" height="24" rx="7" fill="#E11D48" stroke="#FFF" strokeWidth="1.5" />
                  <text y="4" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {measureDistance !== null ? `${measureDistance} m` : 'Mesure'}
                  </text>
                </g>
              </g>
            </>
          )}
        </g>
      )}
    </svg>
  );
}


