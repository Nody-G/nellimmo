import { NextRequest, NextResponse } from 'next/server';
import {
  AmenityItem,
  buildNeighborhoodSummary,
  classifyOsmElement,
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

/**
 * Résout l'adresse officielle réelle depuis la Base Adresse Nationale (data.gouv.fr / IGN)
 * Permet de garantir qu'aucune adresse n'est inventée et qu'elle correspond fidèlement à Google Maps.
 */
async function resolveRealAddressFromBan(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lat=${lat}&lon=${lon}`, {
      signal: AbortSignal.timeout(1800),
    });
    if (res.ok) {
      const data = await res.json();
      const feat = data.features?.[0]?.properties;
      if (feat?.label) {
        return feat.label;
      }
    }
  } catch {
    // Timeout ignoré, conserve le fallback de commune
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

    // Adresse précise du bien pour forcer le départ des itinéraires Google Maps depuis le bien
    const street = address.trim();
    const cityAndCode = [postalCode.trim(), city.trim()].filter(Boolean).join(' ');
    const originAddress = street 
      ? [street, cityAndCode].filter(Boolean).join(', ')
      : (cityAndCode ? `${cityAndCode}, France` : undefined);

    const cacheKey = `v4_${centerLat.toFixed(4)}_${centerLon.toFixed(4)}_${originAddress || ''}`;
    const now = Date.now();
    const cached = amenitiesCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, fromCache: true, data: cached.data });
    }

    // Récupération des données réelles OpenStreetMap (nodes & ways)
    const items: AmenityItem[] = [];
    const pendingAddressLookups: { index: number; lat: number; lon: number }[] = [];

    try {
      const radius = 3500; // Rayon de 3.5 km
      const query = `[out:json][timeout:10];
      (
        node["amenity"~"school|kindergarten|college|pharmacy|doctors|hospital|supermarket|marketplace"](around:${radius},${centerLat},${centerLon});
        node["shop"~"supermarket|convenience|bakery"](around:${radius},${centerLat},${centerLon});
        node["leisure"~"sports_centre|fitness_centre|park"](around:${radius},${centerLat},${centerLon});
        node["highway"="bus_stop"](around:${radius},${centerLat},${centerLon});
        way["amenity"~"school|college|supermarket|pharmacy|hospital"](around:${radius},${centerLat},${centerLon});
        way["shop"~"supermarket|convenience|bakery"](around:${radius},${centerLat},${centerLon});
        way["leisure"~"sports_centre|fitness_centre|park"](around:${radius},${centerLat},${centerLon});
      );
      out center 45;`;

      const endpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
      ];

      let overpassRes: Response | null = null;
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: {
              'User-Agent': 'NellimoCockpitRealEstate/2.0 (contact@nellimmo.fr)',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'data=' + encodeURIComponent(query),
            signal: AbortSignal.timeout(8000),
          });
          if (res.ok) {
            overpassRes = res;
            break;
          }
        } catch {
          // Essayer le miroir suivant
        }
      }

      if (overpassRes && overpassRes.ok) {
        const osmData = await overpassRes.json();
        const seenNames = new Set<string>();

        for (const el of osmData.elements || []) {
          const tags = el.tags || {};
          const classification = classifyOsmElement(tags);
          if (!classification) continue;

          // Règle d'or : exclure les entités sans nom réel pour n'afficher que de vrais établissements
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

          // Vérifier si l'adresse exacte est déjà fournie par les tags OSM
          let resolvedAddress: string;
          let isCertified = false;

          if (tags['addr:street']) {
            resolvedAddress = `${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${tags['addr:postcode'] || ''} ${tags['addr:city'] || city}`.replace(/\s+/g, ' ').trim();
            isCertified = true;
          } else {
            // Résolution via la Base Adresse Nationale (BAN)
            resolvedAddress = `${city}, France`;
            pendingAddressLookups.push({ index: items.length, lat: elLat, lon: elLon });
          }

          const googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name}, ${resolvedAddress}`
          )}`;
          const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${elLat},${elLon}`;

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
            address: resolvedAddress,
            googleMapsDirectionsUrl: getDirectionsUrl(centerLat, centerLon, elLat, elLon, name, originAddress),
            googleMapsPlaceUrl,
            streetViewUrl,
            badge: tags.operator || tags.brand || (tags.public ? 'Public' : undefined),
            phone: tags.phone || tags['contact:phone'],
            website: tags.website || tags['contact:website'],
            openingHours: tags.opening_hours,
            isAddressCertified: isCertified,
          });
        }
      }
    } catch {
      // Ignorer erreur réseau Overpass
    }

    // Si Overpass n'a retourné que très peu d'éléments réels (zone rurale ou serveur saturé),
    // interroger Nominatim (OpenStreetMap Search) pour récupérer de vrais établissements réels dans la commune
    if (items.length < 6 && city && city !== 'Provence') {
      const realQueries = [
        { q: `ecole ${city}`, category: 'education' as const, subtype: 'primaire' as const, label: 'École' },
        { q: `pharmacie ${city}`, category: 'sante' as const, subtype: 'pharmacie' as const, label: 'Pharmacie' },
        { q: `boulangerie ${city}`, category: 'commerce' as const, subtype: 'boulangerie' as const, label: 'Boulangerie' },
        { q: `supermarche ${city}`, category: 'commerce' as const, subtype: 'supermarche' as const, label: 'Supermarché' },
        { q: `stade ${city}`, category: 'sport' as const, subtype: 'terrain_sport' as const, label: 'Terrain de sport' },
      ];

      const seenNames = new Set(items.map((i) => i.name.toLowerCase()));

      for (const rq of realQueries) {
        try {
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(rq.q)}&format=json&addressdetails=1&limit=2`,
            {
              headers: { 'User-Agent': 'NellimoCockpitRealEstate/2.0 (contact@nellimmo.fr)' },
              signal: AbortSignal.timeout(2200),
            }
          );
          if (nomRes.ok) {
            const nomList = await nomRes.json();
            for (const nomItem of nomList) {
              const placeName = (nomItem.name || nomItem.display_name?.split(',')[0] || '').trim();
              if (!placeName || seenNames.has(placeName.toLowerCase())) continue;
              seenNames.add(placeName.toLowerCase());

              const elLat = parseFloat(nomItem.lat);
              const elLon = parseFloat(nomItem.lon);
              if (isNaN(elLat) || isNaN(elLon)) continue;

              const distanceMeters = calculateDistanceMeters(centerLon, centerLat, elLon, elLat);
              const walkingMinutes = getWalkingMinutes(distanceMeters);
              const drivingMinutes = getDrivingMinutes(distanceMeters);

              const addrObj = nomItem.address || {};
              const realAddr = [
                addrObj.house_number,
                addrObj.road || addrObj.street,
                addrObj.postcode,
                addrObj.city || addrObj.town || addrObj.village || city,
              ]
                .filter(Boolean)
                .join(' ')
                .trim();

              const hasFullStreet = !!(addrObj.road || addrObj.street);
              const resolvedAddr = realAddr || `${city}, France`;

              if (!addrObj.house_number) {
                pendingAddressLookups.push({ index: items.length, lat: elLat, lon: elLon });
              }

              items.push({
                id: `nom-${nomItem.osm_id || items.length}`,
                name: placeName,
                category: rq.category,
                subtype: rq.subtype,
                subtypeLabel: rq.label,
                lat: elLat,
                lon: elLon,
                distanceMeters,
                walkingMinutes,
                drivingMinutes,
                address: resolvedAddr,
                googleMapsDirectionsUrl: getDirectionsUrl(centerLat, centerLon, elLat, elLon, placeName, originAddress),
                googleMapsPlaceUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, ${resolvedAddr}`)}`,
                streetViewUrl: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${elLat},${elLon}`,
                isAddressCertified: hasFullStreet,
              });
            }
          }
        } catch {
          // Ignorer erreur individuelle
        }
      }
    }

    // 2. Certification des adresses en parallèle via la Base Adresse Nationale (BAN / data.gouv.fr)
    // Résout le numéro de rue et le nom de voie exacts pour toutes les commodités sans adresse explicite
    if (pendingAddressLookups.length > 0) {
      const batchSize = 6;
      for (let i = 0; i < pendingAddressLookups.length; i += batchSize) {
        const batch = pendingAddressLookups.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (lookup) => {
            const item = items[lookup.index];
            if (!item) return;
            const certifiedAddress = await resolveRealAddressFromBan(lookup.lat, lookup.lon);
            if (certifiedAddress) {
              item.address = certifiedAddress;
              item.isAddressCertified = true;
              item.googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${item.name}, ${certifiedAddress}`
              )}`;
            }
          })
        );
      }
    }

    // Règle d'or : strictement AUCUNE donnée synthétique inventée.
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
