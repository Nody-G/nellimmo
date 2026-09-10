import {
  AmenityItem,
  classifyOsmElement,
  getDirectionsUrl,
  getDrivingMinutes,
  getWalkingMinutes,
} from './amenities';
import { calculateDistanceMeters } from './cadastre';

/**
 * Interroge OpenStreetMap Overpass avec gestion de plusieurs miroirs rapides et timeout strict.
 */
export async function fetchLiveOsmAmenities(
  centerLat: number,
  centerLon: number,
  originAddress?: string,
  radiusMeters = 4000
): Promise<AmenityItem[]> {
  const query = `[out:json][timeout:8];
  (
    nwr["shop"~"supermarket|convenience|bakery"](around:${radiusMeters},${centerLat},${centerLon});
    nwr["amenity"~"school|college|kindergarten|pharmacy|doctors|hospital|marketplace|bus_station"](around:${radiusMeters},${centerLat},${centerLon});
    nwr["leisure"~"sports_centre|fitness_centre|park|pitch|track"](around:${radiusMeters},${centerLat},${centerLon});
    nwr["highway"="bus_stop"](around:2500,${centerLat},${centerLon});
    nwr["railway"~"station|halt"](around:6000,${centerLat},${centerLon});
  );
  out center 150;`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://z.overpass-api.de/api/interpreter',
  ];

interface OsmRawElement {
  id?: number | string;
  type?: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

  let osmData: { elements?: OsmRawElement[] } | null = null;
  try {
    osmData = await Promise.any(
      endpoints.map(async (ep) => {
        const res = await fetch(ep, {
          method: 'POST',
          headers: {
            'User-Agent': 'NellimoCockpitRealEstate/2.0 (contact@nellimmo.fr)',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'data=' + encodeURIComponent(query),
          signal: AbortSignal.timeout(2800),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const text = await res.text();
        if (!text.startsWith('{')) throw new Error('Invalid JSON');
        return JSON.parse(text);
      })
    );
  } catch {
    return [];
  }

  if (!osmData || !Array.isArray(osmData.elements)) return [];

  const items: AmenityItem[] = [];
  const seenNames = new Set<string>();

  for (const el of osmData.elements || []) {
    const tags = el.tags || {};
    const classification = classifyOsmElement(tags);
    if (!classification) continue;

    const rawName = tags.name || tags.brand || tags.operator;
    if (!rawName || rawName.trim().length < 2) continue;

    const name = rawName.trim();
    const key = `${classification.subtype}_${name.toLowerCase()}`;
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    const elLat = el.lat || el.center?.lat;
    const elLon = el.lon || el.center?.lon;
    if (!elLat || !elLon) continue;

    const distanceMeters = calculateDistanceMeters(centerLon, centerLat, elLon, elLat);
    const walkingMinutes = getWalkingMinutes(distanceMeters);
    const drivingMinutes = getDrivingMinutes(distanceMeters);

    let resolvedAddress = '';
    let isCertified = false;
    if (tags['addr:street']) {
      resolvedAddress = `${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${tags['addr:postcode'] || ''} ${tags['addr:city'] || ''}`.replace(/\s+/g, ' ').trim();
      isCertified = true;
    }

    items.push({
      id: `osm-${el.type || 'n'}-${el.id || items.length}`,
      name,
      category: classification.category,
      subtype: classification.subtype,
      subtypeLabel: classification.subtypeLabel,
      lat: elLat,
      lon: elLon,
      distanceMeters,
      walkingMinutes,
      drivingMinutes,
      address: resolvedAddress || undefined,
      googleMapsDirectionsUrl: getDirectionsUrl(centerLat, centerLon, elLat, elLon, name, originAddress),
      googleMapsPlaceUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${name}${resolvedAddress ? `, ${resolvedAddress}` : ''}`
      )}`,
      streetViewUrl: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${elLat},${elLon}`,
      badge: tags.operator || tags.brand || (tags.public ? 'Public' : undefined),
      phone: tags.phone || tags['contact:phone'],
      website: tags.website || tags['contact:website'],
      openingHours: tags.opening_hours,
      isAddressCertified: isCertified,
    });
  }

  return items;
}
