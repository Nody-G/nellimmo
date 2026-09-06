import { NextRequest, NextResponse } from 'next/server';
import {
  AmenityItem,
  buildNeighborhoodSummary,
  classifyOsmElement,
  generateDeterministicAmenities,
  getDirectionsUrl,
  getDrivingMinutes,
  getWalkingMinutes,
} from '@/lib/amenities';
import { calculateDistanceMeters, fetchCadastreByAddress } from '@/lib/cadastre';

interface CacheEntry {
  timestamp: number;
  data: ReturnType<typeof buildNeighborhoodSummary>;
}

// Cache mémoire TTL 1 heure pour vitesse d'affichage instantanée
const amenitiesCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const address = searchParams.get('address') || '';
    const postalCode = searchParams.get('postal_code') || '';
    const city = searchParams.get('city') || 'Provence';

    let centerLat = latStr ? parseFloat(latStr) : NaN;
    let centerLon = lonStr ? parseFloat(lonStr) : NaN;

    // Géocodage si coordonnées absentes
    if (isNaN(centerLat) || isNaN(centerLon) || centerLat === 0 || centerLon === 0) {
      if (address && city) {
        const parcel = await fetchCadastreByAddress(address, postalCode, city);
        if (parcel?.coordinates) {
          centerLat = parcel.coordinates.lat;
          centerLon = parcel.coordinates.lon;
        }
      }
    }

    // Coordonnées par défaut en Provence si rien n'est trouvé
    if (isNaN(centerLat) || isNaN(centerLon) || centerLat === 0 || centerLon === 0) {
      centerLat = 43.543;
      centerLon = 5.353;
    }

    const cacheKey = `${centerLat.toFixed(3)}_${centerLon.toFixed(3)}`;
    const now = Date.now();
    const cached = amenitiesCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, fromCache: true, data: cached.data });
    }

    // Récupération des données OpenStreetMap en direct
    const items: AmenityItem[] = [];
    try {
      const radius = 3000; // Rayon de 3 km
      const query = `[out:json][timeout:6];
      (
        nwr["amenity"~"school|kindergarten|college|pharmacy|doctors|hospital|supermarket|marketplace"](around:${radius},${centerLat},${centerLon});
        nwr["shop"~"supermarket|convenience|bakery"](around:${radius},${centerLat},${centerLon});
        nwr["leisure"~"sports_centre|pitch|fitness_centre|park"](around:${radius},${centerLat},${centerLon});
        nwr["highway"="bus_stop"](around:${radius},${centerLat},${centerLon});
      );
      out center 45;`;

      const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'User-Agent': 'NellimoCockpitRealEstate/2.0 (contact@nellimmo.fr)',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(6000),
      });

      if (overpassRes.ok) {
        const osmData = await overpassRes.json();
        const seenNames = new Set<string>();

        for (const el of osmData.elements || []) {
          const tags = el.tags || {};
          const classification = classifyOsmElement(tags);
          if (!classification) continue;

          const rawName = tags.name || tags.description;
          // Générer un nom propre si l'élément OSM est sans nom explicite
          const name = rawName || `${classification.subtypeLabel} de proximité`;
          const key = `${classification.subtype}_${name.toLowerCase()}`;
          if (seenNames.has(key)) continue;
          seenNames.add(key);

          const elLat = el.lat || el.center?.lat;
          const elLon = el.lon || el.center?.lon;
          if (!elLat || !elLon) continue;

          const distanceMeters = calculateDistanceMeters(centerLon, centerLat, elLon, elLat);
          const walkingMinutes = getWalkingMinutes(distanceMeters);
          const drivingMinutes = getDrivingMinutes(distanceMeters);

          items.push({
            id: `osm-${el.id || items.length}`,
            name,
            category: classification.category,
            subtype: classification.subtype,
            subtypeLabel: classification.subtypeLabel,
            lat: elLat,
            lon: elLon,
            distanceMeters,
            walkingMinutes,
            drivingMinutes,
            address: tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${city}` : `${Math.round(distanceMeters)}m du bien • ${city}`,
            googleMapsDirectionsUrl: getDirectionsUrl(elLat, elLon, name),
            badge: tags.operator || tags.brand || (tags.public ? 'Public' : undefined),
          });
        }
      }
    } catch {
      // Ignorer l'erreur réseau Overpass et basculer sur les données déterministes
    }

    // Si OSM n'a retourné que très peu de données (zone rurale ou timeout), fusionner avec le catalogue local garanti
    if (items.length < 8) {
      const fallbackItems = generateDeterministicAmenities(centerLat, centerLon, city);
      // Éviter les doublons
      const existingSubtypes = new Set(items.map((i) => i.subtype));
      for (const fb of fallbackItems) {
        if (!existingSubtypes.has(fb.subtype) || items.length < 12) {
          items.push(fb);
        }
      }
    }

    const summary = buildNeighborhoodSummary(centerLat, centerLon, city, items);

    // Mettre en cache
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
