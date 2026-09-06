'use client';

import React, { useState } from 'react';

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
  showOverlays?: boolean;
}

export function ParcelTileOverlaySvg({
  svgPath,
  points,
  midpoints,
  isSatellite,
  surfaceText,
  centerPos,
  scale = 1,
  showOverlays = true,
}: ParcelTileOverlaySvgProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!svgPath || !showOverlays) return null;

  const invScale = 1 / Math.max(scale, 0.1);

  return (
    <svg className="absolute inset-0 w-[768px] h-[768px] pointer-events-none drop-shadow-[0_0_15px_rgba(20,184,166,0.7)]">
      {/* Surface du polygone */}
      <path
        d={svgPath}
        fill="#0D9488"
        fillOpacity={isSatellite ? 0.32 : 0.22}
        stroke="#14B8A6"
        strokeWidth={3 * invScale}
        strokeLinejoin="round"
      />

      {/* Badge central de surface (Taille d'affichage constante) */}
      {surfaceText && centerPos && (
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          <g transform={`scale(${invScale})`}>
            <rect
              x="-46"
              y="-13"
              width="92"
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

      {/* Cotes métriques (Taille d'affichage constante) */}
      {midpoints.map((mid, i) => (
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

      {/* Bornes de propriété B1, B2... (Taille d'affichage constante) */}
      {points.map((p) => (
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
    </svg>
  );
}

