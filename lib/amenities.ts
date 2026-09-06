import { calculateDistanceMeters } from './cadastre';

export type AmenityCategory = 'education' | 'commerce' | 'sport' | 'sante' | 'transport';

export type AmenitySubtype =
  | 'maternelle'
  | 'primaire'
  | 'college'
  | 'lycee'
  | 'creche'
  | 'supermarche'
  | 'superette'
  | 'boulangerie'
  | 'marche'
  | 'pharmacie'
  | 'medecin'
  | 'hopital'
  | 'terrain_sport'
  | 'complexe_sportif'
  | 'gymnase'
  | 'parc'
  | 'bus'
  | 'gare';

export interface AmenityItem {
  id: string;
  name: string;
  category: AmenityCategory;
  subtype: AmenitySubtype;
  subtypeLabel: string;
  lat: number;
  lon: number;
  distanceMeters: number;
  walkingMinutes: number;
  drivingMinutes: number;
  address?: string;
  googleMapsDirectionsUrl: string;
  details?: string;
  badge?: string;
}

export type ClientProfileKey = 'famille' | 'actif' | 'senior' | 'investisseur';

export interface ClientProfileData {
  key: ClientProfileKey;
  label: string;
  emoji: string;
  targetDescription: string;
  score: number;
  pitch: string;
  highlightSubtypes: AmenitySubtype[];
}

export interface NeighborhoodSummary {
  center: { lat: number; lon: number; city: string; address?: string };
  walkabilityScore: number;
  scoreLabel: string;
  totalCount: number;
  minDistances: {
    supermarche?: AmenityItem;
    superette?: AmenityItem;
    boulangerie?: AmenityItem;
    maternelle?: AmenityItem;
    primaire?: AmenityItem;
    college?: AmenityItem;
    lycee?: AmenityItem;
    sport?: AmenityItem;
    parc?: AmenityItem;
    pharmacie?: AmenityItem;
    medecin?: AmenityItem;
    bus?: AmenityItem;
    gare?: AmenityItem;
  };
  amenities: AmenityItem[];
  byCategory: Record<AmenityCategory, AmenityItem[]>;
  profiles: Record<ClientProfileKey, ClientProfileData>;
}

export const CATEGORY_CONFIG: Record<
  AmenityCategory,
  { label: string; emoji: string; color: string; bgBadge: string }
> = {
  education: {
    label: 'Éducation & Enfance',
    emoji: '🎒',
    color: '#4F46E5', // Indigo
    bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  commerce: {
    label: 'Commerces & Alimentation',
    emoji: '🛒',
    color: '#D97706', // Amber
    bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  sport: {
    label: 'Sports, Parcs & Loisirs',
    emoji: '⚽',
    color: '#059669', // Emerald
    bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  sante: {
    label: 'Santé & Bien-être',
    emoji: '🩺',
    color: '#E11D48', // Rose
    bgBadge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  transport: {
    label: 'Transports & Mobilité',
    emoji: '🚆',
    color: '#2563EB', // Blue
    bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
};

export const SUBTYPE_LABELS: Record<AmenitySubtype, { label: string; category: AmenityCategory; icon: string }> = {
  maternelle: { label: 'École Maternelle', category: 'education', icon: '🧸' },
  primaire: { label: 'École Primaire / Élémentaire', category: 'education', icon: '🎒' },
  college: { label: 'Collège', category: 'education', icon: '🎓' },
  lycee: { label: 'Lycée', category: 'education', icon: '🏛️' },
  creche: { label: 'Crèche / Halte-garderie', category: 'education', icon: '🍼' },
  supermarche: { label: 'Supermarché', category: 'commerce', icon: '🛒' },
  superette: { label: 'Supérette & Épicerie', category: 'commerce', icon: '🏪' },
  boulangerie: { label: 'Boulangerie Artisanale', category: 'commerce', icon: '🥖' },
  marche: { label: 'Marché Provençal', category: 'commerce', icon: '🧺' },
  pharmacie: { label: 'Pharmacie', category: 'sante', icon: '💊' },
  medecin: { label: 'Cabinet Médical', category: 'sante', icon: '🩺' },
  hopital: { label: 'Hôpital / Clinique', category: 'sante', icon: '🏥' },
  terrain_sport: { label: 'Terrain de Sports / Stade', category: 'sport', icon: '⚽' },
  complexe_sportif: { label: 'Complexe Sportif', category: 'sport', icon: '🏟️' },
  gymnase: { label: 'Gymnase / Salle Fitness', category: 'sport', icon: '🏋️' },
  parc: { label: 'Parc & Espaces Verts', category: 'sport', icon: '🌳' },
  bus: { label: 'Arrêt de Bus', category: 'transport', icon: '🚌' },
  gare: { label: 'Gare TER / TGV', category: 'transport', icon: '🚆' },
};

/**
 * Normalise et classifie une commodité OSM
 */
export function classifyOsmElement(tags: Record<string, string> = {}): {
  category: AmenityCategory;
  subtype: AmenitySubtype;
  subtypeLabel: string;
} | null {
  const amenity = (tags.amenity || '').toLowerCase();
  const shop = (tags.shop || '').toLowerCase();
  const leisure = (tags.leisure || '').toLowerCase();
  const highway = (tags.highway || '').toLowerCase();
  const railway = (tags.railway || '').toLowerCase();
  const name = (tags.name || '').toLowerCase();

  // 1. Éducation
  if (amenity === 'kindergarten' || name.includes('maternelle')) {
    return { category: 'education', subtype: 'maternelle', subtypeLabel: SUBTYPE_LABELS.maternelle.label };
  }
  if (amenity === 'school' || name.includes('primaire') || name.includes('élémentaire') || name.includes('ecole')) {
    if (name.includes('collège') || name.includes('college')) {
      return { category: 'education', subtype: 'college', subtypeLabel: SUBTYPE_LABELS.college.label };
    }
    if (name.includes('lycée') || name.includes('lycee')) {
      return { category: 'education', subtype: 'lycee', subtypeLabel: SUBTYPE_LABELS.lycee.label };
    }
    return { category: 'education', subtype: 'primaire', subtypeLabel: SUBTYPE_LABELS.primaire.label };
  }
  if (amenity === 'college' || name.includes('collège') || name.includes('college')) {
    return { category: 'education', subtype: 'college', subtypeLabel: SUBTYPE_LABELS.college.label };
  }

  // 2. Commerces
  if (shop === 'supermarket' || name.includes('intermarch') || name.includes('carrefour market') || name.includes('super u') || name.includes('leclerc') || name.includes('lidl') || name.includes('aldi')) {
    return { category: 'commerce', subtype: 'supermarche', subtypeLabel: SUBTYPE_LABELS.supermarche.label };
  }
  if (shop === 'convenience' || name.includes('spar') || name.includes('utile') || name.includes('u express') || name.includes('proxi') || name.includes('vival')) {
    return { category: 'commerce', subtype: 'superette', subtypeLabel: SUBTYPE_LABELS.superette.label };
  }
  if (shop === 'bakery' || name.includes('boulanger') || name.includes('pain')) {
    return { category: 'commerce', subtype: 'boulangerie', subtypeLabel: SUBTYPE_LABELS.boulangerie.label };
  }
  if (amenity === 'marketplace' || name.includes('marché') || name.includes('marche')) {
    return { category: 'commerce', subtype: 'marche', subtypeLabel: SUBTYPE_LABELS.marche.label };
  }

  // 3. Santé
  if (amenity === 'pharmacy' || shop === 'chemist' || name.includes('pharmac')) {
    return { category: 'sante', subtype: 'pharmacie', subtypeLabel: SUBTYPE_LABELS.pharmacie.label };
  }
  if (amenity === 'doctors' || amenity === 'clinic' || name.includes('médic') || name.includes('docteur')) {
    return { category: 'sante', subtype: 'medecin', subtypeLabel: SUBTYPE_LABELS.medecin.label };
  }
  if (amenity === 'hospital' || name.includes('hôpital') || name.includes('hopital') || name.includes('clinique')) {
    return { category: 'sante', subtype: 'hopital', subtypeLabel: SUBTYPE_LABELS.hopital.label };
  }

  // 4. Sport & Loisirs
  if (leisure === 'pitch' || leisure === 'track' || name.includes('stade') || name.includes('terrain de foot') || name.includes('terrain de tennis') || name.includes('city stade')) {
    return { category: 'sport', subtype: 'terrain_sport', subtypeLabel: SUBTYPE_LABELS.terrain_sport.label };
  }
  if (leisure === 'sports_centre' || name.includes('complexe sportif') || name.includes('centre sportif')) {
    return { category: 'sport', subtype: 'complexe_sportif', subtypeLabel: SUBTYPE_LABELS.complexe_sportif.label };
  }
  if (leisure === 'fitness_centre' || name.includes('gymnase') || name.includes('fitness') || name.includes('crossfit') || name.includes('keep cool')) {
    return { category: 'sport', subtype: 'gymnase', subtypeLabel: SUBTYPE_LABELS.gymnase.label };
  }
  if (leisure === 'park' || leisure === 'garden' || name.includes('parc') || name.includes('jardin')) {
    return { category: 'sport', subtype: 'parc', subtypeLabel: SUBTYPE_LABELS.parc.label };
  }

  // 5. Transports
  if (highway === 'bus_stop' || amenity === 'bus_station' || name.includes('arrêt') || name.includes('bus')) {
    return { category: 'transport', subtype: 'bus', subtypeLabel: SUBTYPE_LABELS.bus.label };
  }
  if (railway === 'station' || railway === 'halt' || name.includes('gare')) {
    return { category: 'transport', subtype: 'gare', subtypeLabel: SUBTYPE_LABELS.gare.label };
  }

  return null;
}

/**
 * Construit l'URL d'itinéraire Google Maps
 */
export function getDirectionsUrl(destLat: number, destLon: number, destName: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLon}&destination_place_id=${encodeURIComponent(destName)}`;
}

/**
 * Calcule le temps à pied (estimation à 4.5 km/h soit 75m/min)
 */
export function getWalkingMinutes(distanceMeters: number): number {
  return Math.max(1, Math.round(distanceMeters / 75));
}

/**
 * Calcule le temps en voiture (estimation urbaine à 30 km/h soit 500m/min)
 */
export function getDrivingMinutes(distanceMeters: number): number {
  return Math.max(1, Math.round(distanceMeters / 500));
}

/**
 * Construit un ensemble riche de commodités de secours (fallback) pour Provence / France
 * déterministe par rapport aux coordonnées de la propriété.
 */
export function generateDeterministicAmenities(centerLat: number, centerLon: number, city: string = 'Provence'): AmenityItem[] {
  const cityName = city || 'Provence';

  const mockTemplates: {
    name: string;
    category: AmenityCategory;
    subtype: AmenitySubtype;
    dLat: number;
    dLon: number;
    badge?: string;
  }[] = [
    // Écoles & Éducation
    { name: `École Maternelle Les Boutons d'Or`, category: 'education', subtype: 'maternelle', dLat: 0.0032, dLon: 0.0028, badge: 'Public • 5 classes' },
    { name: `École Élémentaire du Centre`, category: 'education', subtype: 'primaire', dLat: 0.0025, dLon: -0.0035, badge: 'Public • Restauration scolaire' },
    { name: `Collège de la Vallée Verte`, category: 'education', subtype: 'college', dLat: 0.0085, dLon: 0.0072, badge: 'Sectorisation collège' },
    { name: `Micro-crèche Les P'tits Loups`, category: 'education', subtype: 'creche', dLat: -0.0031, dLon: 0.0021, badge: 'Accueil 10 berceaux' },

    // Commerces & Alimentation
    { name: `Boulangerie Artisanale Le Fournil de ${cityName}`, category: 'commerce', subtype: 'boulangerie', dLat: 0.0018, dLon: -0.0015, badge: 'Pain au levain & viennoiseries' },
    { name: `Supérette U Express`, category: 'commerce', subtype: 'superette', dLat: 0.0029, dLon: 0.0034, badge: 'Ouvert 7j/7 jusqu’à 20h' },
    { name: `Supermarché Intermarché Contact`, category: 'commerce', subtype: 'supermarche', dLat: -0.0068, dLon: 0.0055, badge: 'Drive & Station service' },
    { name: `Marché Provençal de ${cityName}`, category: 'commerce', subtype: 'marche', dLat: 0.0038, dLon: -0.0022, badge: 'Mardi & Samedi matin' },

    // Sport & Loisirs
    { name: `Complexe Sportif Municipal & Tennis`, category: 'sport', subtype: 'complexe_sportif', dLat: -0.0042, dLon: -0.0048, badge: '4 courts de tennis + gymnase' },
    { name: `Stade & Terrain Multisports`, category: 'sport', subtype: 'terrain_sport', dLat: -0.0038, dLon: 0.0052, badge: 'Football & Piste d’athlétisme' },
    { name: `Parc Public Ombragé & Aire de Jeux`, category: 'sport', subtype: 'parc', dLat: 0.0036, dLon: 0.0012, badge: 'Jeux pour enfants & bancs' },
    { name: `Salle de Fitness & Musculation`, category: 'sport', subtype: 'gymnase', dLat: -0.0055, dLon: 0.0061, badge: 'Accès libre 6h-23h' },

    // Santé
    { name: `Pharmacie Centrale de ${cityName}`, category: 'sante', subtype: 'pharmacie', dLat: 0.0022, dLon: -0.0025, badge: 'Garde & équipement' },
    { name: `Pôle Médical (Généralistes & Kinés)`, category: 'sante', subtype: 'medecin', dLat: 0.0035, dLon: -0.0018, badge: '3 médecins traitants' },

    // Transports
    { name: `Arrêt de Bus Ligne Express (Réseau Métropole)`, category: 'transport', subtype: 'bus', dLat: 0.0015, dLon: 0.0011, badge: 'Toutes les 15 min en pointe' },
    { name: `Gare TER la plus proche`, category: 'transport', subtype: 'gare', dLat: 0.0152, dLon: -0.0125, badge: 'Liaison directe TGV / Métropole' },
  ];

  return mockTemplates.map((tpl, idx) => {
    const lat = centerLat + tpl.dLat;
    const lon = centerLon + tpl.dLon;
    const distanceMeters = calculateDistanceMeters(centerLon, centerLat, lon, lat);
    const walkingMinutes = getWalkingMinutes(distanceMeters);
    const drivingMinutes = getDrivingMinutes(distanceMeters);

    return {
      id: `det-${idx}-${tpl.subtype}`,
      name: tpl.name,
      category: tpl.category,
      subtype: tpl.subtype,
      subtypeLabel: SUBTYPE_LABELS[tpl.subtype]?.label || tpl.subtype,
      lat,
      lon,
      distanceMeters,
      walkingMinutes,
      drivingMinutes,
      address: `${Math.round(distanceMeters)}m du centre • ${cityName}`,
      googleMapsDirectionsUrl: getDirectionsUrl(lat, lon, tpl.name),
      badge: tpl.badge,
    };
  });
}

/**
 * Calcule la synthèse de quartier complète à partir d'une liste de commodités géolocalisées.
 */
export function buildNeighborhoodSummary(
  centerLat: number,
  centerLon: number,
  city: string,
  rawAmenities: AmenityItem[]
): NeighborhoodSummary {
  // Trier les commodités par distance croissante
  const sorted = [...rawAmenities].sort((a, b) => a.distanceMeters - b.distanceMeters);

  // Regrouper par catégorie
  const byCategory: Record<AmenityCategory, AmenityItem[]> = {
    education: sorted.filter((a) => a.category === 'education'),
    commerce: sorted.filter((a) => a.category === 'commerce'),
    sport: sorted.filter((a) => a.category === 'sport'),
    sante: sorted.filter((a) => a.category === 'sante'),
    transport: sorted.filter((a) => a.category === 'transport'),
  };

  // Trouver la distance minimale pour chaque commodité clé
  const findClosest = (subtype: AmenitySubtype) => sorted.find((a) => a.subtype === subtype);

  const minDistances = {
    supermarche: findClosest('supermarche'),
    superette: findClosest('superette'),
    boulangerie: findClosest('boulangerie'),
    maternelle: findClosest('maternelle'),
    primaire: findClosest('primaire'),
    college: findClosest('college'),
    lycee: findClosest('lycee'),
    sport: sorted.find((a) => ['terrain_sport', 'complexe_sportif', 'gymnase'].includes(a.subtype)),
    parc: findClosest('parc'),
    pharmacie: findClosest('pharmacie'),
    medecin: findClosest('medecin'),
    bus: findClosest('bus'),
    gare: findClosest('gare'),
  };

  // Calcul du score de commodité / marchabilité sur 100
  let scorePoints = 100;
  if (!minDistances.boulangerie || minDistances.boulangerie.distanceMeters > 1000) scorePoints -= 8;
  if (!minDistances.superette || minDistances.superette.distanceMeters > 1200) scorePoints -= 8;
  if (!minDistances.primaire || minDistances.primaire.distanceMeters > 1200) scorePoints -= 12;
  if (!minDistances.pharmacie || minDistances.pharmacie.distanceMeters > 1200) scorePoints -= 8;
  if (!minDistances.sport || minDistances.sport.distanceMeters > 1500) scorePoints -= 6;
  if (!minDistances.bus || minDistances.bus.distanceMeters > 600) scorePoints -= 8;
  const walkabilityScore = Math.max(50, Math.min(98, scorePoints));

  let scoreLabel = 'Quartier Pratique';
  if (walkabilityScore >= 90) scoreLabel = 'Quartier Ultra-Pratique (Tout à pied)';
  else if (walkabilityScore >= 80) scoreLabel = 'Quartier Très Bien Desservi';
  else if (walkabilityScore >= 70) scoreLabel = 'Quartier Résidentiel Équilibré';
  else scoreLabel = 'Secteur Paisible & Nature';

  // Profils Clients intelligents avec pitch commercial sur-mesure
  const distText = (item?: AmenityItem) => {
    if (!item) return 'à proximité en voiture';
    if (item.distanceMeters < 900) return `${item.distanceMeters}m (${item.walkingMinutes} min à pied)`;
    return `${(item.distanceMeters / 1000).toFixed(1)} km (${item.drivingMinutes} min en voiture)`;
  };

  const profiles: Record<ClientProfileKey, ClientProfileData> = {
    famille: {
      key: 'famille',
      label: 'Famille avec Enfants',
      emoji: '👨‍👩‍👧',
      targetDescription: 'Accent sur la scolarité à pied, la sécurité des trajets, les parcs et les clubs sportifs.',
      score: Math.min(96, Math.max(65, walkabilityScore + (minDistances.primaire?.distanceMeters && minDistances.primaire.distanceMeters < 600 ? 5 : -5))),
      pitch: `« Pour une famille, c'est l'emplacement idéal : l'école primaire est à seulement ${distText(minDistances.primaire)}${minDistances.maternelle ? ` et la maternelle à ${distText(minDistances.maternelle)}` : ''}, évitant tout stress de bouchons le matin. Les enfants peuvent aussi profiter du ${minDistances.sport?.name || 'terrain de sport'} à ${distText(minDistances.sport)} et du parc à ${distText(minDistances.parc)}. »`,
      highlightSubtypes: ['maternelle', 'primaire', 'college', 'terrain_sport', 'parc'],
    },
    actif: {
      key: 'actif',
      label: 'Jeune Actif / Solo / Couple',
      emoji: '💼',
      targetDescription: 'Priorité à la supérette de dépannage, aux transports rapides, au supermarché et au sport.',
      score: Math.min(95, Math.max(60, walkabilityScore + (minDistances.bus?.distanceMeters && minDistances.bus.distanceMeters < 400 ? 4 : -4))),
      pitch: `« Un quotidien ultra-fluide pour les actifs : supérette et commerces à ${distText(minDistances.superette || minDistances.supermarche)}, arrêt de bus à ${distText(minDistances.bus)} pour rejoindre le pôle d'activités, et salle de sport à ${distText(minDistances.sport)}. Les courses se font en 2 minutes au retour du travail. »`,
      highlightSubtypes: ['superette', 'supermarche', 'boulangerie', 'bus', 'gymnase'],
    },
    senior: {
      key: 'senior',
      label: 'Seniors & Retraités',
      emoji: '👴',
      targetDescription: 'Priorité aux soins de santé (pharmacie, docteurs), au pain frais à pied et au calme.',
      score: Math.min(94, Math.max(65, walkabilityScore + (minDistances.pharmacie?.distanceMeters && minDistances.pharmacie.distanceMeters < 500 ? 5 : -5))),
      pitch: `« Sérénité absolue et autonomie au quotidien : la boulangerie pour le pain frais est à ${distText(minDistances.boulangerie)}, la pharmacie à ${distText(minDistances.pharmacie)} et le cabinet médical à ${distText(minDistances.medecin)}. Tout est accessible sans obligatoirement prendre la voiture. »`,
      highlightSubtypes: ['pharmacie', 'medecin', 'boulangerie', 'superette', 'marche'],
    },
    investisseur: {
      key: 'investisseur',
      label: 'Investisseur Locatif',
      emoji: '📈',
      targetDescription: 'Rentabilité et forte attractivité locative garanties par la proximité des écoles, commerces et transports.',
      score: Math.min(97, Math.max(70, walkabilityScore + 4)),
      pitch: `« Atout majeur pour sécuriser vos loyers et zéro vacance locative : le bien coche l'intégralité du cahier des charges des locataires (écoles à ${distText(minDistances.primaire)}, bus à ${distText(minDistances.bus)}, supermarché à ${distText(minDistances.supermarche)}). Un emplacement facile à louer et à valoriser à la revente. »`,
      highlightSubtypes: ['primaire', 'college', 'supermarche', 'bus', 'gare'],
    },
  };

  return {
    center: { lat: centerLat, lon: centerLon, city },
    walkabilityScore,
    scoreLabel,
    totalCount: sorted.length,
    minDistances,
    amenities: sorted,
    byCategory,
    profiles,
  };
}
