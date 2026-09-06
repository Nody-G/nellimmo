export interface ParcelSegment {
  index: number;
  from: [number, number];
  to: [number, number];
  lengthMeters: number;
  bearingDeg: number;
  cardinalLabel: string;
}

export interface CadastreParcel {
  idu: string;
  section: string;
  numero: string;
  contenance: number; // Surface en m²
  nom_com: string;
  code_insee: string;
  code_dep: string;
  coordinates: { lat: number; lon: number };
  polygon?: [number, number][];
  geoportailUrl: string;
  cadastreGouvUrl: string;
  perimeter?: number;
  dimensions?: { width: number; depth: number };
  exposure?: string;
  segments?: ParcelSegment[];
}

export interface SvgGeometryResult {
  path: string;
  points: { x: number; y: number; index: number; lon: number; lat: number }[];
  midpoints: {
    x: number;
    y: number;
    lengthMeters: number;
    label: string;
  }[];
  viewBox: string;
}

/**
 * Calcule la distance en mètres entre 2 coordonnées GPS via la formule Haversine.
 */
export function calculateDistanceMeters(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
): number {
  const R = 6371000; // Rayon moyen de la Terre en m
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calcule le cap / azimut en degrés (0° = Nord, 90° = Est).
 */
export function calculateBearing(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360;
}

export function getCompassDirection(bearingDeg: number): string {
  if (bearingDeg >= 337.5 || bearingDeg < 22.5) return 'Nord';
  if (bearingDeg >= 22.5 && bearingDeg < 67.5) return 'Nord-Est';
  if (bearingDeg >= 67.5 && bearingDeg < 112.5) return 'Est';
  if (bearingDeg >= 112.5 && bearingDeg < 157.5) return 'Sud-Est';
  if (bearingDeg >= 157.5 && bearingDeg < 202.5) return 'Sud';
  if (bearingDeg >= 202.5 && bearingDeg < 247.5) return 'Sud-Ouest';
  if (bearingDeg >= 247.5 && bearingDeg < 292.5) return 'Ouest';
  return 'Nord-Ouest';
}

export function calculateSegmentDetails(polygon: [number, number][]): ParcelSegment[] {
  if (!polygon || polygon.length < 2) return [];
  const pts = [...polygon];
  if (pts.length > 2) {
    const first = pts[0];
    const last = pts[pts.length - 1];
    if (Math.abs(first[0] - last[0]) < 1e-7 && Math.abs(first[1] - last[1]) < 1e-7) {
      pts.pop();
    }
  }

  const segments: ParcelSegment[] = [];
  for (let i = 0; i < pts.length; i++) {
    const nextIdx = (i + 1) % pts.length;
    const p1 = pts[i];
    const p2 = pts[nextIdx];
    const dist = calculateDistanceMeters(p1[0], p1[1], p2[0], p2[1]);
    const bearing = calculateBearing(p1[0], p1[1], p2[0], p2[1]);
    const dir = getCompassDirection(bearing);
    segments.push({
      index: i + 1,
      from: p1,
      to: p2,
      lengthMeters: dist,
      bearingDeg: Math.round(bearing),
      cardinalLabel: `Côté ${dir}`,
    });
  }
  return segments;
}

export function calculatePolygonPerimeter(polygon: [number, number][]): number {
  const segs = calculateSegmentDetails(polygon);
  const total = segs.reduce((sum, s) => sum + s.lengthMeters, 0);
  return Math.round(total * 10) / 10;
}

export function calculateBoundingDimensions(polygon: [number, number][]): {
  width: number;
  depth: number;
} {
  if (!polygon || polygon.length < 2) return { width: 0, depth: 0 };
  let minLon = Infinity;
  let maxX = -Infinity;
  let minLat = Infinity;
  let maxY = -Infinity;
  for (const [lon, lat] of polygon) {
    if (lon < minLon) minLon = lon;
    if (lon > maxX) maxX = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxY) maxY = lat;
  }
  const midLat = (minLat + maxY) / 2;
  const width = calculateDistanceMeters(minLon, midLat, maxX, midLat);
  const midLon = (minLon + maxX) / 2;
  const depth = calculateDistanceMeters(midLon, minLat, midLon, maxY);
  return { width: Math.round(width * 10) / 10, depth: Math.round(depth * 10) / 10 };
}

export function estimateSolarExposure(polygon: [number, number][]): string {
  if (!polygon || polygon.length < 3) return 'Plein Sud (Optimal)';
  const dims = calculateBoundingDimensions(polygon);
  if (dims.width >= dims.depth * 1.2) {
    return 'Sud / Sud-Ouest (Grande façade ensoleillée)';
  }
  return 'Sud / Traversant (Luminosité naturelle continue)';
}

export function getGeoportailEmbedUrl(lon: number, lat: number): string {
  return `https://www.geoportail.gouv.fr/embed/visu.html?c=${lon},${lat}&z=19&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=CADASTRALPARCELS.PARCELLAIRE_EXPRESS::GEOPORTAIL:OGC:WMTS(0.8)&permalink=yes`;
}

/**
 * Convertit les coordonnées GPS d'un polygone de parcelle en chemin SVG normalisé
 */
export function generateSvgParcelPath(
  polygon: [number, number][],
  viewWidth: number = 240,
  viewHeight: number = 180,
  padding: number = 20
): string {
  if (!polygon || polygon.length < 3) return '';
  const geom = generateSvgGeometryWithPoints(polygon, viewWidth, viewHeight, padding);
  return geom.path;
}

/**
 * Génère la géométrie vectorielle complète avec sommets, cotes métriques et boîte d'affichage.
 */
export function generateSvgGeometryWithPoints(
  polygon: [number, number][],
  viewWidth: number = 320,
  viewHeight: number = 240,
  padding: number = 28
): SvgGeometryResult {
  if (!polygon || polygon.length < 3) {
    return { path: '', points: [], midpoints: [], viewBox: `0 0 ${viewWidth} ${viewHeight}` };
  }

  const pts = [...polygon];
  if (pts.length > 2) {
    const f = pts[0];
    const l = pts[pts.length - 1];
    if (Math.abs(f[0] - l[0]) < 1e-7 && Math.abs(f[1] - l[1]) < 1e-7) {
      pts.pop();
    }
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  pts.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  const rangeX = maxX - minX || 0.0001;
  const rangeY = maxY - minY || 0.0001;
  const drawableW = viewWidth - padding * 2;
  const drawableH = viewHeight - padding * 2;

  const svgCoords = pts.map(([lon, lat], idx) => {
    const normX = (lon - minX) / rangeX;
    const normY = 1 - (lat - minY) / rangeY;
    const x = padding + normX * drawableW;
    const y = padding + normY * drawableH;
    return { x, y, index: idx + 1, lon, lat };
  });

  const path = `M ${svgCoords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} Z`;

  const midpoints = svgCoords.map((p1, i) => {
    const p2 = svgCoords[(i + 1) % svgCoords.length];
    const dist = calculateDistanceMeters(p1.lon, p1.lat, p2.lon, p2.lat);
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    return {
      x: mx,
      y: my,
      lengthMeters: dist,
      label: `${dist} m`,
    };
  });

  return {
    path,
    points: svgCoords,
    midpoints,
    viewBox: `0 0 ${viewWidth} ${viewHeight}`,
  };
}

/**
 * Interroge l'API Carto IGN Cadastre pour récupérer la parcelle foncière
 * correspondant à un point GPS géographique (WGS84).
 */
export async function fetchCadastreByCoordinates(
  lat: number,
  lon: number
): Promise<CadastreParcel | null> {
  try {
    const geom = JSON.stringify({ type: 'Point', coordinates: [lon, lat] });
    const url = `https://apicarto.ign.fr/api/cadastre/parcelle?geom=${encodeURIComponent(geom)}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    });

    if (!res.ok) return null;

    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature || !feature.properties) return null;

    const props = feature.properties;
    const geometry = feature.geometry;

    let polygon: [number, number][] | undefined;
    if (geometry?.type === 'Polygon' && geometry.coordinates?.[0]) {
      polygon = geometry.coordinates[0];
    } else if (geometry?.type === 'MultiPolygon' && geometry.coordinates?.[0]?.[0]) {
      polygon = geometry.coordinates[0][0];
    }

    const section = props.section || 'AB';
    const numero = props.numero || '0001';
    const nomCom = props.nom_com || '';
    const contenance = Number(props.contenance) || 0;
    const idu = props.idu || `${props.code_insee || '13000'}${section}${numero}`;

    const geoportailUrl = `https://www.geoportail.gouv.fr/carte?c=${lon},${lat}&z=19&l0=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2::GEOPORTAIL:OGC:WMTS(1)&l1=CADASTRALPARCELS.PARCELLAIRE_EXPRESS::GEOPORTAIL:OGC:WMTS(0.8)&permalink=yes`;
    const cadastreGouvUrl = `https://cadastre.gouv.fr/scpc/rechercherParReferenceCadastrale.do?codeInsee=${props.code_insee || ''}&section=${section}&numero=${numero}`;

    const perimeter = polygon ? calculatePolygonPerimeter(polygon) : undefined;
    const dimensions = polygon ? calculateBoundingDimensions(polygon) : undefined;
    const exposure = polygon ? estimateSolarExposure(polygon) : undefined;
    const segments = polygon ? calculateSegmentDetails(polygon) : undefined;

    return {
      idu,
      section,
      numero,
      contenance,
      nom_com: nomCom,
      code_insee: props.code_insee || '',
      code_dep: props.code_dep || '13',
      coordinates: { lat, lon },
      polygon,
      geoportailUrl,
      cadastreGouvUrl,
      perimeter,
      dimensions,
      exposure,
      segments,
    };
  } catch (error) {
    console.error('Erreur API Cadastre Carto IGN:', error);
    return null;
  }
}

/**
 * Géolocalise une adresse postale française via l'API Adresse Nationale (data.gouv.fr)
 * puis interroge l'API Cadastre IGN.
 */
export async function fetchCadastreByAddress(
  address: string,
  postalCode: string,
  city: string
): Promise<CadastreParcel | null> {
  try {
    const query = `${address} ${postalCode} ${city}`;
    const geocodeUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`;

    const geoRes = await fetch(geocodeUrl);
    if (!geoRes.ok) return null;

    const geoData = await geoRes.json();
    const feature = geoData.features?.[0];
    if (!feature?.geometry?.coordinates) return null;

    const [lon, lat] = feature.geometry.coordinates;
    return await fetchCadastreByCoordinates(lat, lon);
  } catch (error) {
    console.error('Erreur Géolocalisation Adresse pour Cadastre:', error);
    return null;
  }
}
