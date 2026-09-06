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
}

export function ParcelTileOverlaySvg({
  svgPath,
  points,
  midpoints,
  isSatellite,
  surfaceText,
  centerPos,
}: ParcelTileOverlaySvgProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!svgPath) return null;

  return (
    <svg className="absolute inset-0 w-[768px] h-[768px] pointer-events-none drop-shadow-[0_0_15px_rgba(20,184,166,0.7)]">
      {/* Surface du polygone */}
      <path
        d={svgPath}
        fill="#0D9488"
        fillOpacity={isSatellite ? 0.35 : 0.25}
        stroke="#14B8A6"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Badge central de surface */}
      {surfaceText && centerPos && (
        <g>
          <rect
            x={centerPos.x - 42}
            y={centerPos.y - 12}
            width="84"
            height="24"
            rx="8"
            fill="#0B132B"
            stroke="#14B8A6"
            strokeWidth="1.5"
            fillOpacity="0.92"
          />
          <text
            x={centerPos.x}
            y={centerPos.y + 4}
            fill="#5EEAD4"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {surfaceText}
          </text>
        </g>
      )}

      {/* Cotes métriques le long de chaque bord */}
      {midpoints.map((mid, i) => (
        <g key={`m-${i}`}>
          <rect
            x={mid.x - 22}
            y={mid.y - 10}
            width="44"
            height="20"
            rx="6"
            fill="#131B26"
            stroke="#0D9488"
            strokeWidth="1"
            fillOpacity="0.95"
          />
          <text
            x={mid.x}
            y={mid.y + 3.5}
            fill="#5EEAD4"
            fontSize="9.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {mid.label}
          </text>
        </g>
      ))}

      {/* Bornes de propriété B1, B2... */}
      {points.map((p) => (
        <g
          key={`p-${p.index}`}
          onMouseEnter={() => setHoveredPoint(p.index)}
          onMouseLeave={() => setHoveredPoint(null)}
          className="pointer-events-auto cursor-pointer"
        >
          <circle
            cx={p.x}
            cy={p.y}
            r={hoveredPoint === p.index ? 7 : 5}
            fill="#F59E0B"
            stroke="#FFF"
            strokeWidth="2"
          />
          <text
            x={p.x}
            y={p.y - 8}
            fill="#FCD34D"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
          >
            B{p.index}
          </text>
        </g>
      ))}
    </svg>
  );
}
