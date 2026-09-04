import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DVF_TRANSACTIONS } from '@/lib/mock-data-cockpit';
import type { DVFTransaction } from '@/lib/types';

/** Table de correspondance des communes clés du Pays Salonais & Provence. */
const KNOWN_CITIES: Record<string, string> = {
  pelissanne: '13330',
  pélissanne: '13330',
  salon: '13300',
  'salon-de-provence': '13300',
  lambesc: '13410',
  lancon: '13680',
  'lançon-provence': '13680',
  aurons: '13121',
  alleins: '13980',
  vernègues: '13116',
  vernegues: '13116',
  senas: '13560',
  sénas: '13560',
  aix: '13100',
  'aix-en-provence': '13100',
  marseille: '13001',
};

function resolvePostalCode(locality?: string, postalCode?: string): string {
  if (postalCode && /^\d{5}$/.test(postalCode.trim())) {
    return postalCode.trim();
  }
  if (!locality) return '13330';

  const fiveDigits = locality.match(/\b\d{5}\b/);
  if (fiveDigits) return fiveDigits[0];

  const norm = locality.trim().toLowerCase();
  for (const [name, code] of Object.entries(KNOWN_CITIES)) {
    if (norm.includes(name)) return code;
  }
  return '13330';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const localityParam = searchParams.get('locality') || undefined;
  const postalCodeParam = searchParams.get('postal_code') || searchParams.get('postalCode') || undefined;
  const propertyTypeParam = searchParams.get('property_type') || searchParams.get('propertyType') || undefined;

  const resolvedPostal = resolvePostalCode(localityParam, postalCodeParam);

  try {
    // Interrogation de l'API ouverte DVF (Christian Quest / Etalab / DGFiP)
    const apiUrl = `https://api.cquest.org/dvf?code_postal=${resolvedPostal}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const features = Array.isArray(data?.features) ? data.features : [];

      if (features.length > 0) {
        interface RawDvfProps {
          id_mutation?: string;
          date_mutation?: string;
          valeur_fonciere?: number | string;
          numero_voie?: string | number;
          type_voie?: string;
          voie?: string;
          adresse_nom_voie?: string;
          code_postal?: string | number;
          commune?: string;
          nom_commune?: string;
          type_local?: string;
          surface_reelle_bati?: number | string;
          nombre_pieces_principales?: number | string;
          surface_terrain?: number | string;
        }

        const parsed: DVFTransaction[] = features
          .filter((f: { properties?: RawDvfProps }) => {
            const p = f.properties;
            if (!p) return false;
            const val = Number(p.valeur_fonciere);
            const surf = Number(p.surface_reelle_bati);
            return val > 10000 && surf >= 15;
          })
          .map((f: { properties?: RawDvfProps; geometry?: { coordinates?: [number, number] } }, idx: number) => {
            const p = f.properties || {};
            const streetParts = [p.numero_voie, p.type_voie, p.voie].filter(Boolean);
            const street = streetParts.length > 0 ? streetParts.join(' ') : p.adresse_nom_voie || 'Secteur communal';
            const coords = f.geometry?.coordinates;
            const surface = Number(p.surface_reelle_bati);
            const value = Number(p.valeur_fonciere);
            const m2 = Math.round(value / surface);

            return {
              id: p.id_mutation || `dvf-live-${resolvedPostal}-${idx}`,
              date_mutation: p.date_mutation || new Date().toISOString().slice(0, 10),
              valeur_fonciere: value,
              adresse_numero: String(p.numero_voie || ''),
              adresse_nom_voie: street,
              code_postal: String(p.code_postal || resolvedPostal),
              nom_commune: String(p.commune || p.nom_commune || localityParam || 'Provence'),
              type_local: String(p.type_local || 'Maison'),
              surface_reelle_bati: surface,
              nombre_pieces_principales: Number(p.nombre_pieces_principales || 4),
              surface_terrain: p.surface_terrain ? Number(p.surface_terrain) : undefined,
              prix_m2: m2,
              longitude: Array.isArray(coords) ? coords[0] : undefined,
              latitude: Array.isArray(coords) ? coords[1] : undefined,
            };
          });

        if (parsed.length > 0) {
          // Filtrer par type si précisé
          let filtered = parsed;
          if (propertyTypeParam) {
            const wanted = propertyTypeParam.trim().toLowerCase().replace(/[^a-z]/g, '');
            const matching = parsed.filter((t) =>
              t.type_local.trim().toLowerCase().replace(/[^a-z]/g, '').includes(wanted)
            );
            if (matching.length > 0) filtered = matching;
          }

          return NextResponse.json({
            success: true,
            source: 'dgfip',
            isOfficial: true,
            sourceLabel: 'Données Officielles DGFiP / data.gouv.fr (Notaires)',
            count: filtered.length,
            postalCode: resolvedPostal,
            transactions: filtered.slice(0, 50),
          });
        }
      }
    }
  } catch {
    // Échec de l'API externe ou timeout : bascule transparente sur le fallback local
  }

  // Repli local gracieux (MOCK_DVF_TRANSACTIONS)
  let localRows = MOCK_DVF_TRANSACTIONS;
  if (resolvedPostal) {
    const filteredByPostal = localRows.filter((t) => t.code_postal === resolvedPostal);
    if (filteredByPostal.length > 0) localRows = filteredByPostal;
  }
  if (propertyTypeParam) {
    const wanted = propertyTypeParam.trim().toLowerCase().replace(/[^a-z]/g, '');
    const matching = localRows.filter((t) =>
      t.type_local.trim().toLowerCase().replace(/[^a-z]/g, '') === wanted
    );
    if (matching.length > 0) localRows = matching;
  }

  return NextResponse.json({
    success: true,
    source: 'local',
    isOfficial: false,
    sourceLabel: 'Données locales de démonstration (Repli hors-ligne)',
    count: localRows.length,
    postalCode: resolvedPostal,
    transactions: localRows,
  });
}
