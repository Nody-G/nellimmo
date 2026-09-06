'use client';

import React, { useState } from 'react';
import type { ActiveLayers } from './ParcelMapControls';
import type { SolarPosition, DaySolarSummary } from '@/lib/solar';

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
  solarPosition?: SolarPosition;
  solarSummary?: DaySolarSummary;
  amenityPoints?: { id: string; name: string; category: string; subtypeLabel: string; distanceMeters: number; x: number; y: number }[];
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
  solarPosition,
  solarSummary,
  amenityPoints = [],
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

      {/* 5. CALQUE SOLEIL HAUTE PRÉCISION SUNLOCATOR */}
      {layers.sun && centerPos && solarPosition && solarSummary && (
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          {(() => {
            const R = 220;
            const RAD = Math.PI / 180;
            const sunAngle = (solarPosition.azimuthDeg - 90) * RAD;
            const sunX = Math.cos(sunAngle) * R;
            const sunY = Math.sin(sunAngle) * R;

            const shadowAngle = sunAngle + Math.PI;
            const shadowLen = Math.min(180, Math.max(40, (solarPosition.shadowRatio || 1) * 25));
            const shadowX = Math.cos(shadowAngle) * shadowLen;
            const shadowY = Math.sin(shadowAngle) * shadowLen;

            const riseAngle = (solarSummary.sunriseAzimuthDeg - 90) * RAD;
            const setAngle = (solarSummary.sunsetAzimuthDeg - 90) * RAD;

            return (
              <>
                {/* Arc de la course solaire réelle */}
                {solarSummary.hourlyArc.length > 2 && (
                  <path
                    d={`M ${solarSummary.hourlyArc
                      .map((pt) => {
                        const a = (pt.azimuthDeg - 90) * RAD;
                        return `${(Math.cos(a) * R).toFixed(1)},${(Math.sin(a) * R).toFixed(1)}`;
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                )}

                {/* Points horaires jalons (9h, 12h, 15h, 18h) */}
                {solarSummary.hourlyArc
                  .filter((p) => [9, 12, 15, 18].includes(p.hour))
                  .map((p) => {
                    const a = (p.azimuthDeg - 90) * RAD;
                    const px = Math.cos(a) * R;
                    const py = Math.sin(a) * R;
                    return (
                      <g key={`h-${p.hour}`} transform={`translate(${px}, ${py})`}>
                        <circle r="4" fill="#FBBF24" stroke="#0B132B" strokeWidth="1.5" />
                        <text
                          y={py > 0 ? 14 : -8}
                          fill="#FDE68A"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {p.hour}h
                        </text>
                      </g>
                    );
                  })}

                {/* Rayon Lever de Soleil */}
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos(riseAngle) * (R + 15)}
                  y2={Math.sin(riseAngle) * (R + 15)}
                  stroke="#FBBF24"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.75"
                />
                <g transform={`translate(${Math.cos(riseAngle) * (R + 32)}, ${Math.sin(riseAngle) * (R + 32)})`}>
                  <text fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                    🌅 {solarSummary.sunriseTime}
                  </text>
                </g>

                {/* Rayon Coucher de Soleil */}
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos(setAngle) * (R + 15)}
                  y2={Math.sin(setAngle) * (R + 15)}
                  stroke="#F97316"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.75"
                />
                <g transform={`translate(${Math.cos(setAngle) * (R + 32)}, ${Math.sin(setAngle) * (R + 32)})`}>
                  <text fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                    🌇 {solarSummary.sunsetTime}
                  </text>
                </g>

                {/* Faisceau d'ensoleillement actif vers la propriété */}
                {solarPosition.isDaylight && (
                  <>
                    <line
                      x1={sunX}
                      y1={sunY}
                      x2="0"
                      y2="0"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      opacity="0.9"
                    />

                    {/* Cône d'Ombre Portée Projetée (Opposé au soleil) */}
                    <path
                      d={`M 0 0 L ${shadowX - 16} ${shadowY} L ${shadowX + 16} ${shadowY} Z`}
                      fill="#1E293B"
                      fillOpacity="0.55"
                      stroke="#475569"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <g transform={`translate(${shadowX}, ${shadowY + (shadowY > 0 ? 16 : -10)})`}>
                      <rect x="-42" y="-9" width="84" height="18" rx="5" fill="#0F172A" fillOpacity="0.9" stroke="#64748B" strokeWidth="1" />
                      <text y="3.5" fill="#CBD5E1" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Ombre {solarPosition.shadowRatio}×
                      </text>
                    </g>

                    {/* Soleil Actuel Lumineux */}
                    <g transform={`translate(${sunX}, ${sunY})`}>
                      <circle r="14" fill="#F59E0B" fillOpacity="0.3" className="animate-ping" />
                      <circle r="11" fill="#FBBF24" stroke="#FFF" strokeWidth="2.5" />
                      <circle r="5" fill="#F59E0B" />
                      <g transform="translate(0, -18)">
                        <rect x="-38" y="-10" width="76" height="20" rx="6" fill="#0B132B" stroke="#F59E0B" strokeWidth="1.5" fillOpacity="0.95" />
                        <text y="3.5" fill="#FDE68A" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {solarPosition.elevationDeg}° • {solarPosition.cardinalLabel}
                        </text>
                      </g>
                    </g>
                  </>
                )}
              </>
            );
          })()}
        </g>
      )}

      {/* 6. CALQUE RAYONS: Iso-distances 300m et 500m (Taille fixe HUD constante, stable au zoom) */}
      {layers.radius && centerPos && (
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          <circle r={140} fill="#10B981" fillOpacity="0.04" stroke="#10B981" strokeWidth={1.5} strokeDasharray="6 4" opacity="0.8" />
          <text y={-146} fill="#34D399" fontSize={10} fontWeight="bold" textAnchor="middle">Rayon ~300m (4 min à pied)</text>
          <circle r={230} fill="#3B82F6" fillOpacity="0.03" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="6 4" opacity="0.7" />
          <text y={-236} fill="#60A5FA" fontSize={10} fontWeight="bold" textAnchor="middle">Rayon ~500m (7 min à pied)</text>
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

      {/* 8. CALQUE COMMODITÉS DE PROXIMITÉ */}
      {layers.amenities && amenityPoints && amenityPoints.length > 0 && (
        <g>
          {amenityPoints.map((a) => {
            const isEducation = a.category === 'education';
            const isCommerce = a.category === 'commerce';
            const isSport = a.category === 'sport';
            const isSante = a.category === 'sante';
            const bg = isEducation ? '#4F46E5' : isCommerce ? '#D97706' : isSport ? '#059669' : isSante ? '#E11D48' : '#2563EB';

            return (
              <g key={`amenity-${a.id}`} transform={`translate(${a.x}, ${a.y})`}>
                <g transform={`scale(${invScale})`}>
                  <circle r="12" fill={bg} stroke="#FFF" strokeWidth="2" fillOpacity="0.9" className="drop-shadow-md" />
                  <text y="3.5" fill="#FFF" fontSize="9" fontWeight="black" textAnchor="middle">
                    {isEducation ? '🎒' : isCommerce ? '🛒' : isSport ? '⚽' : isSante ? '💊' : '🚆'}
                  </text>
                  <g transform="translate(0, 20)">
                    <rect x="-40" y="-8" width="80" height="16" rx="5" fill="#0B132B" fillOpacity="0.95" stroke={bg} strokeWidth="1" />
                    <text y="3.5" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {a.distanceMeters < 1000 ? `${a.distanceMeters}m` : `${(a.distanceMeters / 1000).toFixed(1)}km`}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}


