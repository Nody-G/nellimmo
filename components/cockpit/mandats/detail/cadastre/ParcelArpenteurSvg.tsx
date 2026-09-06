'use client';

import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { SvgGeometryResult } from '@/lib/cadastre';

interface ParcelArpenteurSvgProps {
  geom: SvgGeometryResult | null;
}

export function ParcelArpenteurSvg({ geom }: ParcelArpenteurSvgProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!geom?.path) {
    return <div className="text-xs text-gray-400">Tracé géométrique non disponible</div>;
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-radial from-[#152336] to-[#0A1017] p-4 select-none">
      {/* Rose des vents Nord */}
      <div className="absolute bottom-3 right-3 flex flex-col items-center pointer-events-none opacity-80">
        <Compass className="w-5 h-5 text-teal-400 animate-pulse" />
        <span className="text-[9px] font-bold text-teal-300 tracking-wider">NORD</span>
      </div>

      {/* Grille d'arpentage */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <svg viewBox={geom.viewBox} className="w-full h-full max-h-[90%] drop-shadow-[0_0_20px_rgba(13,148,136,0.3)]">
        {/* Corps de la parcelle */}
        <path
          d={geom.path}
          fill="#0D9488"
          fillOpacity="0.22"
          stroke="#14B8A6"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Cotes métriques de chaque segment */}
        {geom.midpoints.map((mid, idx) => (
          <g key={`mid-${idx}`}>
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
              fontFamily="ui-monospace, monospace"
            >
              {mid.label}
            </text>
          </g>
        ))}

        {/* Bornes de propriété (B1, B2, ...) */}
        {geom.points.map((pt) => (
          <g
            key={`pt-${pt.index}`}
            onMouseEnter={() => setHoveredPoint(pt.index)}
            onMouseLeave={() => setHoveredPoint(null)}
            className="cursor-pointer"
          >
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint === pt.index ? '7' : '5'}
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={pt.x}
              y={pt.y - 8}
              fill="#FCD34D"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
            >
              B{pt.index}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
