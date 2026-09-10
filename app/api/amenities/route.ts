import { NextRequest, NextResponse } from 'next/server';
import {
  AmenityItem,
  buildNeighborhoodSummary,
} from '@/lib/amenities';
import { calculateDistanceMeters, fetchCadastreByAddress } from '@/lib/cadastre';
import { getCommuneCenter, getLocalVerifiedAmenities } from '@/lib/local-amenities-db';
import { fetchLiveOsmAmenities } from '@/lib/overpass-client';

interface CacheEntry {
  timestamp: number;
  data: ReturnType<typeof buildNeighborhoodSummary>;
}

// Cache mémoire TTL 1 heure pour vitesse d'affichage instantanée
const amenitiesCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Résout l'adresse officielle réelle depuis la Base Adresse Nationale (data.gouv.fr / IGN)
 */
async function resolveRealAddressFromBan(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lat=${lat}&lon=${lon}`, {
      signal: AbortSignal.timeout(1800),
    });
    if (res.ok) {
      const data = await res.json();
      const feat = data.features?.[0]?.properties;
      if (feat?.label) return feat.label;
    }
  } catch {
    // Ignore timeout
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const address = searchParams.get('address') || '';
    const postalCode = searchParams.get('postal_code') || '';
    const city = searchParams.get('city') || 'Salon-de-Provence';

    let centerLat = latStr ? parseFloat(latStr) : NaN;
    let centerLon = lonStr ? parseFloat(lonStr) : NaN;

    // 1. Géocodage si coordonnées absentes ou à zéro
    if (isNaN(centerLat) || isNaN(centerLon) || centerLat === 0 || centerLon === 0) {
      if (address && city) {
        const parcel = await fetchCadastreByAddress(address, postalCode, city);
        if (parcel?.coordinates) {
          centerLat = parcel.coordinates.lat;
          centerLon = parcel.coordinates.lon;
        }
      }
    }

    // 2. Coordonnées précises de commune en Provence si le géocodage n'a pas abouti
    if (isNaN(centerLat) || isNaN(centerLon) || centerLat === 0 || centerLon === 0) {
      const communeCoords = getCommuneCenter(city, postalCode);
      if (communeCoords) {
        centerLat = communeCoords.lat;
        centerLon = communeCoords.lon;
      } else {
        // Défaut : Salon-de-Provence centre
        centerLat = 43.6406;
        centerLon = 5.0972;
      }
    }

    // 3. Adresse précise du bien pour calculer les départs d'itinéraires Google Maps
    const street = address.trim();
    const cityAndCode = [postalCode.trim(), city.trim()].filter(Boolean).join(' ');
    const originAddress = street
      ? [street, cityAndCode].filter(Boolean).join(', ')
      : (cityAndCode ? `${cityAndCode}, France` : undefined);

    const cacheKey = `v5_${centerLat.toFixed(4)}_${centerLon.toFixed(4)}_${originAddress || ''}`;
    const now = Date.now();
    const cached = amenitiesCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, fromCache: true, data: cached.data });
    }

    // 4. Socle garanti : commodités réelles et certifiées du territoire local (Salon, Pélissanne, alentours)
    const localItems = getLocalVerifiedAmenities(centerLat, centerLon, originAddress);

    // 5. Enrichissement dynamique en temps réel via OpenStreetMap Overpass (nwr multi-miroirs)
    let liveOsmItems: AmenityItem[] = [];
    try {
      liveOsmItems = await fetchLiveOsmAmenities(centerLat, centerLon, originAddress);
    } catch {
      // Tolérance aux pannes réseau
    }

    // 6. Fusion et déduplication intelligente (priorité aux commodités locales certifiées)
    const merged: AmenityItem[] = [...localItems];
    const seenNames = new Set(localItems.map((i) => i.name.toLowerCase().trim()));

    for (const osmItem of liveOsmItems) {
      const normalizedName = osmItem.name.toLowerCase().trim();
      if (seenNames.has(normalizedName)) continue;

      // Vérifier si un item très proche (< 65m) de même sous-type existe déjà
      const isDuplicate = merged.some(
        (existing) =>
          existing.subtype === osmItem.subtype &&
          calculateDistanceMeters(existing.lon, existing.lat, osmItem.lon, osmItem.lat) < 65
      );
      if (isDuplicate) continue;

      seenNames.add(normalizedName);
      merged.push(osmItem);
    }

    // 7. Résolution rapide de l'adresse BAN pour les items OSM qui n'en ont pas
    const uncertified = merged.filter((item) => !item.isAddressCertified && !item.address).slice(0, 6);
    if (uncertified.length > 0) {
      await Promise.all(
        uncertified.map(async (item) => {
          const certifiedAddress = await resolveRealAddressFromBan(item.lat, item.lon);
          if (certifiedAddress) {
            item.address = certifiedAddress;
            item.isAddressCertified = true;
          }
        })
      );
    }

    // 8. Synthèse complète du quartier
    const summary = buildNeighborhoodSummary(centerLat, centerLon, city, merged);

    amenitiesCache.set(cacheKey, { timestamp: now, data: summary });

    return NextResponse.json({
      success: true,
      fromCache: false,
      data: summary,
    });
  } catch (error) {
    console.error('Erreur API amenities:', error);
    return NextResponse.json(
      { success: false, error: 'Impossible de calculer les commodités' },
      { status: 500 }
    );
  }
}
