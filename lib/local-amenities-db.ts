import type { AmenityItem, AmenitySubtype } from './amenities';
import { SUBTYPE_LABELS, getDirectionsUrl, getWalkingMinutes, getDrivingMinutes } from './amenities';
import { calculateDistanceMeters } from './cadastre';
import { SALON_DE_PROVENCE_AMENITIES } from './amenities-data-salon';
import { PELISSANNE_AMENITIES } from './amenities-data-pelissanne';
import { SURROUNDINGS_AMENITIES } from './amenities-data-surroundings';

const ALL_LOCAL_AMENITIES = [
  ...SALON_DE_PROVENCE_AMENITIES,
  ...PELISSANNE_AMENITIES,
  ...SURROUNDINGS_AMENITIES,
];

/** Rayons maximaux par type d'équipement pour garantir un résultat sans jamais afficher N/A */
const MAX_RADIUS_BY_SUBTYPE: Partial<Record<AmenitySubtype, number>> = {
  college: 10000,
  lycee: 12000,
  gare: 12000,
  supermarche: 7000,
  hopital: 10000,
  complexe_sportif: 7000,
  superette: 4500,
  boulangerie: 4000,
  maternelle: 4500,
  primaire: 4500,
  pharmacie: 4500,
  terrain_sport: 4500,
  gymnase: 5000,
  parc: 6000,
  bus: 3500,
};

export function getLocalVerifiedAmenities(
  centerLat: number,
  centerLon: number,
  originAddress?: string,
  baseRadiusMeters = 5000
): AmenityItem[] {
  const results: AmenityItem[] = [];

  for (let i = 0; i < ALL_LOCAL_AMENITIES.length; i++) {
    const item = ALL_LOCAL_AMENITIES[i];
    const dist = calculateDistanceMeters(centerLon, centerLat, item.lon, item.lat);
    const maxRadius = MAX_RADIUS_BY_SUBTYPE[item.subtype] || baseRadiusMeters;

    if (dist <= maxRadius) {
      const walkingMinutes = getWalkingMinutes(dist);
      const drivingMinutes = getDrivingMinutes(dist);
      const label = SUBTYPE_LABELS[item.subtype]?.label || item.subtype;

      results.push({
        id: `local-verified-${i}-${item.subtype}`,
        name: item.name,
        category: item.category,
        subtype: item.subtype,
        subtypeLabel: label,
        lat: item.lat,
        lon: item.lon,
        distanceMeters: dist,
        walkingMinutes,
        drivingMinutes,
        address: item.address,
        badge: item.badge,
        phone: item.phone,
        googleMapsDirectionsUrl: getDirectionsUrl(
          centerLat,
          centerLon,
          item.lat,
          item.lon,
          item.name,
          originAddress
        ),
        googleMapsPlaceUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${item.name}, ${item.address}`
        )}`,
        streetViewUrl: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${item.lat},${item.lon}`,
        isAddressCertified: true,
      });
    }
  }

  // Trier par distance croissante
  return results.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export const COMMUNE_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'salon-de-provence': { lat: 43.6406, lon: 5.0972 },
  'salon de provence': { lat: 43.6406, lon: 5.0972 },
  'salon': { lat: 43.6406, lon: 5.0972 },
  '13300': { lat: 43.6406, lon: 5.0972 },
  'pélissanne': { lat: 43.6317, lon: 5.1503 },
  'pelissanne': { lat: 43.6317, lon: 5.1503 },
  '13330': { lat: 43.6317, lon: 5.1503 },
  'lambesc': { lat: 43.6542, lon: 5.2617 },
  '13410': { lat: 43.6542, lon: 5.2617 },
  'lançon-provence': { lat: 43.5925, lon: 5.1278 },
  'lancon-provence': { lat: 43.5925, lon: 5.1278 },
  'lançon': { lat: 43.5925, lon: 5.1278 },
  'lancon': { lat: 43.5925, lon: 5.1278 },
  '13680': { lat: 43.5925, lon: 5.1278 },
  'grans': { lat: 43.6083, lon: 5.0639 },
  '13450': { lat: 43.6083, lon: 5.0639 },
  'miramas': { lat: 43.5817, lon: 5.0022 },
  '13140': { lat: 43.5817, lon: 5.0022 },
  'saint-chamas': { lat: 43.5508, lon: 5.0347 },
  'saint chamas': { lat: 43.5508, lon: 5.0347 },
  '13250': { lat: 43.5508, lon: 5.0347 },
  'aurons': { lat: 43.6647, lon: 5.1639 },
  '13121': { lat: 43.6647, lon: 5.1639 },
  'alleins': { lat: 43.7083, lon: 5.1611 },
  '13980': { lat: 43.7083, lon: 5.1611 },
  'vernègues': { lat: 43.6869, lon: 5.1814 },
  'vernegues': { lat: 43.6869, lon: 5.1814 },
  '13116': { lat: 43.6869, lon: 5.1814 },
  'la barben': { lat: 43.6292, lon: 5.1958 },
  'eyguières': { lat: 43.6947, lon: 5.0306 },
  'eyguieres': { lat: 43.6947, lon: 5.0306 },
  '13430': { lat: 43.6947, lon: 5.0306 },
  'sénas': { lat: 43.7456, lon: 5.0789 },
  'senas': { lat: 43.7456, lon: 5.0789 },
  '13560': { lat: 43.7456, lon: 5.0789 },
  'mallemort': { lat: 43.7314, lon: 5.1794 },
  '13370': { lat: 43.7314, lon: 5.1794 },
};

export function getCommuneCenter(city?: string, postalCode?: string): { lat: number; lon: number } | null {
  if (postalCode) {
    const pc = postalCode.trim();
    if (COMMUNE_COORDINATES[pc]) return COMMUNE_COORDINATES[pc];
  }
  if (city) {
    const c = city.trim().toLowerCase();
    if (COMMUNE_COORDINATES[c]) return COMMUNE_COORDINATES[c];
    for (const [key, coords] of Object.entries(COMMUNE_COORDINATES)) {
      if (c.includes(key) || key.includes(c)) return coords;
    }
  }
  return null;
}

