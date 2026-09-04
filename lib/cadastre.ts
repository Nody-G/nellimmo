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

    // Extraction des coordonnées du polygone pour le tracé SVG
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

/**
 * Convertit les coordonnées GPS d'un polygone de parcelle en chemin SVG normalisé
 * prêt à être rendu dans une vue vectorielle interactive.
 */
export function generateSvgParcelPath(
  polygon: [number, number][],
  viewWidth: number = 240,
  viewHeight: number = 180,
  padding: number = 20
): string {
  if (!polygon || polygon.length < 3) {
    return '';
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  polygon.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  const rangeX = maxX - minX || 0.0001;
  const rangeY = maxY - minY || 0.0001;

  const drawableW = viewWidth - padding * 2;
  const drawableH = viewHeight - padding * 2;

  // Conversion en coordonnées SVG (inversion de l'axe Y car latitude vers le haut)
  const points = polygon.map(([lon, lat]) => {
    const normalizedX = (lon - minX) / rangeX;
    const normalizedY = 1 - (lat - minY) / rangeY;

    const svgX = padding + normalizedX * drawableW;
    const svgY = padding + normalizedY * drawableH;

    return `${svgX.toFixed(1)},${svgY.toFixed(1)}`;
  });

  return `M ${points.join(' L ')} Z`;
}
