'use client';

import React, { useState } from 'react';
import { AmenityItem, CATEGORY_CONFIG, AmenitySubtype } from '@/lib/amenities';
import {
  Star,
  MapPin,
  Navigation,
  ExternalLink,
  Camera,
  Copy,
  Check,
  X,
  Clock,
  Sparkles,
  Map as MapIcon,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Phone,
  Globe,
} from 'lucide-react';

interface GooglePlaceSheetProps {
  item: AmenityItem;
  propertyAddress?: string;
  onClose: () => void;
}

interface SubtypePreset {
  photoUrl: string;
  features: string[];
  visitPitch: string;
}

const SUBTYPE_PRESETS: Record<AmenitySubtype, SubtypePreset> = {
  maternelle: {
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    features: ['Cantine municipale bio', 'Garderie périscolaire 7h30 – 18h30', 'Accueil dès 3 ans', 'Cour végétalisée'],
    visitPitch: 'Trajet scolaire ultra-sécurisé à pied. Atout majeur pour séduire les jeunes familles avec enfants !',
  },
  primaire: {
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    features: ['Étude surveillée le soir', 'Restauration scolaire locale', 'Activités sportives', 'Sectorisation officielle'],
    visitPitch: 'Les enfants peuvent se rendre à l’école à pied en totale autonomie sans embouteillage matinal.',
  },
  college: {
    photoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
    features: ['Sections bilangues & options', 'CDI & association sportive', 'Restauration collective', 'Bus scolaires directs'],
    visitPitch: 'Collège de secteur d’excellent niveau, desservi facilement sans contrainte logistique pour les parents.',
  },
  lycee: {
    photoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    features: ['Filières générales & technologiques', 'Classes prépas & BTS', 'Installations sportives', 'Accès direct transport'],
    visitPitch: 'Proximité du lycée : gage de valorisation du bien à la revente et d’autonomie pour les grands adolescents.',
  },
  creche: {
    photoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
    features: ['Places réservables', 'Alimentation bio & circuits courts', 'Personnel diplômé petite enfance', 'Jardin clos'],
    visitPitch: 'Solution de garde à quelques pas du domicile : argument coup de cœur pour les futurs parents.',
  },
  boulangerie: {
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    features: ['Pain artisanal au levain', 'Viennoiseries pur beurre faites maison', 'Pâtisseries fines', 'Paiement sans contact'],
    visitPitch: 'Le plaisir du pain frais et des croissants chauds le matin à pied sans toucher à la voiture !',
  },
  supermarche: {
    photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
    features: ['Grand parking gratuit', 'Service Drive & Click & Collect', 'Rayon boucherie traditionnelle', 'Station carburant 24/24'],
    visitPitch: 'Toutes les courses de la semaine à portée de main en quelques minutes, sans perte de temps.',
  },
  superette: {
    photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    features: ['Ouvert 7 jours sur 7', 'Rayon bio & produits frais', 'Relais colis commerçant', 'Courses de dépannage express'],
    visitPitch: 'Supérette de quartier ouverte tous les jours : idéal pour les courses d’appoint en rentrant du travail.',
  },
  marche: {
    photoUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80',
    features: ['Producteurs provençaux locaux', 'Fruits, légumes & fromages', 'Ambiance village typique', 'Circuits courts'],
    visitPitch: 'La véritable douceur de vivre provençale : marché hebdomadaire à pied pour des produits frais de saison.',
  },
  terrain_sport: {
    photoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    features: ['Terrains multisports éclairés', 'Piste d’athlétisme', 'Accès libre et associatif', 'Vestiaires'],
    visitPitch: 'Activités sportives faciles pour toute la famille : les ados peuvent y aller sans accompagnement voiture.',
  },
  complexe_sportif: {
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    features: ['Courts de tennis & padel', 'Gymnase couvert', 'Clubs municipaux', 'Parking réservé'],
    visitPitch: 'Complexe complet pour le tennis, le fitness ou les sports collectifs à proximité immédiate.',
  },
  gymnase: {
    photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80',
    features: ['Plateau musculation & cardio', 'Cours collectifs', 'Accès par badge', 'Climatisation'],
    visitPitch: 'Salle de sport moderne à quelques minutes : maintien d’une routine forme sans contrainte d’agenda.',
  },
  parc: {
    photoUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
    features: ['Aire de jeux enfants sécurisée', 'Allées ombragées & bancs', 'Espace canin autorisé', 'Arbres centenaires'],
    visitPitch: 'Véritable poumon vert du quartier : idéal pour la promenade des enfants, du chien ou la lecture au calme.',
  },
  pharmacie: {
    photoUrl: 'https://images.unsplash.com/photo-1586015555751-63c25b87f8aa?w=600&auto=format&fit=crop&q=80',
    features: ['Accès personnes à mobilité réduite (PMR)', 'Conseils santé & orthopédie', 'Permanence de garde', 'Tiers payant'],
    visitPitch: 'Sérénité médicale absolue : pharmacie accessible à pied pour les besoins de santé du quotidien.',
  },
  medecin: {
    photoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    features: ['Médecins généralistes & spécialistes', 'Téléconsultation possible', 'Cabinet accessible PMR', 'Prise RDV Doctolib'],
    visitPitch: 'Pôle médical de proximité : un critère de réassurance fondamental, particulièrement prisé des seniors.',
  },
  hopital: {
    photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    features: ['Service d’urgences 24/7', 'Plateau technique complet', 'Maternité & pédiatrie', 'Parking visiteurs'],
    visitPitch: 'Centre hospitalier accessible rapidement en cas d’urgence, tout en restant à distance du calme du bien.',
  },
  bus: {
    photoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
    features: ['Liaison directe centre-ville & gare', 'Abribus couvert & banc', 'Accessibilité PMR', 'Bornes horaires temps réel'],
    visitPitch: 'Mobilité facilitée vers les pôles d’emploi et lycées sans contrainte de stationnement.',
  },
  gare: {
    photoUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
    features: ['Liaisons TER directes métropole', 'Parking relais gratuit', 'Guichet & bornes billetterie', 'Correspondances bus'],
    visitPitch: 'Connexion ferroviaire rapide pour travailler en métropole tout en profitant du calme provençal au quotidien.',
  },
};

export function GooglePlaceSheet({
  item,
  propertyAddress,
  onClose,
}: GooglePlaceSheetProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'map'>('profile');
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const preset = SUBTYPE_PRESETS[item.subtype] || SUBTYPE_PRESETS.supermarche;
  const config = CATEGORY_CONFIG[item.category];

  // URL Google Maps de recherche du lieu (pour ouvrir la fiche dans Google Maps officiel)
  const googleMapsPlaceUrl = item.googleMapsPlaceUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${item.name}, ${item.address || ''}`
  )}`;

  // URL Street View 360°
  const streetViewUrl = item.streetViewUrl || `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${item.lat},${item.lon}`;

  // URL iframe Google Maps embed
  const embedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${item.name}, ${item.address || ''}`
  )}&hl=fr&z=17&output=embed`;

  // Copier la fiche pour un client WhatsApp / Email avec données 100% réelles
  const handleCopy = async () => {
    const text = [
      `📍 *${item.name}* (${item.subtypeLabel})`,
      item.address ? `🏢 Adresse certifiée : ${item.address}` : null,
      `📏 Distance du bien : ${item.distanceMeters < 1000 ? `${item.distanceMeters} m` : `${(item.distanceMeters / 1000).toFixed(1)} km`}`,
      `🚶 À pied : ${item.walkingMinutes} min • 🚗 En voiture : ${item.drivingMinutes} min`,
      item.openingHours ? `🕒 Horaires déclarés : ${item.openingHours}` : null,
      item.phone ? `📞 Téléphone : ${item.phone}` : null,
      `💡 Atout pour l’acquéreur : ${preset.visitPitch}`,
      `🗺️ Itinéraire depuis le bien : ${item.googleMapsDirectionsUrl}`,
      `⭐ Fiche Google Maps officielle : ${googleMapsPlaceUrl}`,
    ]
      .filter(Boolean)
      .join('\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Affichage compact réduit en bas de carte si minimisé
  if (isMinimized) {
    return (
      <div
        data-no-drag
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[380px] z-50 bg-white/95 dark:bg-[#131B26]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-3 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 text-xs animate-in fade-in"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0 p-1 rounded-lg bg-gray-100 dark:bg-white/10">{config.emoji}</span>
          <div className="min-w-0">
            <h5 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h5>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <span className="text-teal-700 dark:text-teal-400 font-bold">
                {item.distanceMeters < 1000 ? `${item.distanceMeters}m` : `${(item.distanceMeters / 1000).toFixed(1)}km`}
              </span>
              <span>•</span>
              <span>🚶 {item.walkingMinutes} min</span>
              {item.isAddressCertified && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">Adresse certifiée</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="px-2.5 py-1.5 rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fiche Google</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 flex items-center justify-center transition cursor-pointer"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-no-drag
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="absolute top-2 bottom-2 left-2 right-2 sm:right-auto sm:w-[380px] md:w-[410px] z-50 bg-white dark:bg-[#131B26] rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-3 duration-200"
    >
      {/* 1. Header Google Maps Bar */}
      <div className="px-3.5 py-2.5 bg-gray-50/90 dark:bg-[#1A2433] border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Google 4-Color Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-[#131B26] border border-gray-200 dark:border-white/10 shadow-2xs">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Fiche Google Maps
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-gray-200/70 dark:bg-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-2.5 py-1 rounded-md transition text-[11px] cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-[#131B26] text-[#1A73E8] dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Fiche
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-2.5 py-1 rounded-md transition text-[11px] flex items-center gap-1 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-[#131B26] text-[#1A73E8] dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <MapIcon className="w-3 h-3" />
              <span>Carte</span>
            </button>
          </div>
        </div>

        {/* Action Controls: Minimize & Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-7 h-7 rounded-full bg-gray-200/70 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 flex items-center justify-center transition cursor-pointer"
            title="Réduire la fiche"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-200/70 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 flex items-center justify-center transition cursor-pointer"
            title="Fermer la fiche"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: Interactive Embedded Google Maps */}
      {activeTab === 'map' && (
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-[#0B132B] relative">
          <iframe
            title={`Carte Google Maps - ${item.name}`}
            src={embedMapsUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="p-2.5 bg-white/95 dark:bg-[#131B26]/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 flex items-center justify-between gap-2">
            <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium truncate">
              📍 {item.name}
            </span>
            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#1A73E8] hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
            >
              <span>Agrandir Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: Detailed Google Place Profile Sheet */}
      {activeTab === 'profile' && (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
          {/* Hero Visual Cover */}
          <div className="relative h-36 w-full overflow-hidden bg-gradient-to-tr from-gray-800 to-gray-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preset.photoUrl}
              alt={item.name}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imgLoaded ? 'opacity-90' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Category Pill Over Image */}
            <div className="absolute top-2.5 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-bold">
              <span>{config.emoji}</span>
              <span>{item.subtypeLabel}</span>
            </div>

            {/* Google Verified Checkmark */}
            <div className="absolute top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1A73E8]/90 text-white text-[10px] font-bold shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>Vérifié</span>
            </div>

            {/* Title Over Photo Bottom */}
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <h4 className="font-bold text-base leading-tight drop-shadow-md line-clamp-1">
                {item.name}
              </h4>
            </div>
          </div>

          {/* Identity & Reviews Bar */}
          <div className="p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-xs text-gray-900 dark:text-white">
                  Fiche Google Maps vérifiée
                </span>
                <a
                  href={googleMapsPlaceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#1A73E8] dark:text-blue-400 hover:underline flex items-center gap-0.5 ml-1"
                >
                  <span>Avis en direct</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Distance & Travel Times from Property (Highlight) */}
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-teal-900 dark:text-teal-200">
                    {item.distanceMeters < 1000
                      ? `${item.distanceMeters} m du bien`
                      : `${(item.distanceMeters / 1000).toFixed(1)} km du bien`}
                  </div>
                  {propertyAddress && (
                    <div className="text-[10px] text-teal-800/80 dark:text-teal-300/80 truncate max-w-[210px]">
                      Départ : {propertyAddress}
                    </div>
                  )}
                  <div className="text-[11px] text-teal-700 dark:text-teal-300 flex items-center gap-2 mt-0.5">
                    <span>🚶 <strong>{item.walkingMinutes} min</strong> à pied</span>
                    <span>•</span>
                    <span>🚗 <strong>{item.drivingMinutes} min</strong> auto</span>
                  </div>
                </div>
              </div>

              <span className="px-2 py-1 rounded-lg bg-white dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold text-[10px] shadow-2xs whitespace-nowrap">
                Proximité
              </span>
            </div>
          </div>

          {/* Google Action Buttons (Iconic Google Pill Layout) */}
          <div className="p-3 grid grid-cols-4 gap-2">
            {/* 1. Itinéraire depuis le bien (Primary Blue Button) */}
            <a
              href={item.googleMapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              title="Calculer l'itinéraire au départ de l'adresse du bien"
              className="col-span-2 py-2 px-3 rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition shadow-sm font-bold text-xs cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 fill-white" />
              <span>Itinéraire</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>

            {/* 2. Ouvrir sur Google Maps */}
            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noreferrer"
              title="Ouvrir la fiche sur Google Maps"
              className="py-2 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-white flex flex-col items-center justify-center text-[10px] font-bold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1A73E8] dark:text-blue-400 mb-0.5" />
              <span>Maps</span>
            </a>

            {/* 3. Street View 360° */}
            <a
              href={streetViewUrl}
              target="_blank"
              rel="noreferrer"
              title="Explorer en Google Street View 360°"
              className="py-2 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-white flex flex-col items-center justify-center text-[10px] font-bold transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
              <span>Street View</span>
            </a>
          </div>

          {/* Place Information & Status Section */}
          <div className="p-3.5 space-y-3 text-xs">
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-gray-900 dark:text-white text-xs">
                    {item.address || `${item.distanceMeters}m du bien`}
                  </span>
                  {item.isAddressCertified && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Certifiée BAN & Maps</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Adresse cadastrale officielle issue de la Base Adresse Nationale
                </span>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                {item.openingHours ? (
                  <div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                      Horaires déclarés : {item.openingHours}
                    </div>
                    <span className="text-[10px] text-gray-400">Données issues des relevés publics</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs block">
                        Horaires d&apos;ouverture
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Consulter les horaires en temps réel
                      </span>
                    </div>
                    <a
                      href={googleMapsPlaceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 text-[#1A73E8] dark:text-blue-400 text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
                    >
                      <span>Voir sur Google</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details (Phone & Website) */}
            {(item.phone || item.website) && (
              <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-2 text-xs">
                {item.phone && (
                  <a
                    href={`tel:${item.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 text-[11px] font-semibold transition"
                  >
                    <Phone className="w-3 h-3 text-teal-600" />
                    <span>{item.phone}</span>
                  </a>
                )}
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 text-[#1A73E8] dark:text-blue-400 text-[11px] font-semibold transition"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Site internet</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                )}
              </div>
            )}

            {/* Key Features / Verified Badges */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Services &amp; Caractéristiques vérifiées
              </span>
              <div className="flex flex-wrap gap-1.5">
                {preset.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[10px] font-medium"
                  >
                    <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visite Real Estate Pitch Card */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border-t border-amber-200/60 dark:border-amber-800/30">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Argumentaire de visite (Cockpit Nell’Immo)</span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed italic">
              « {preset.visitPitch} »
            </p>
          </div>

          {/* Footer Action Bar */}
          <div className="p-3 bg-gray-50/90 dark:bg-[#1A2433] flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-[#131B26] border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copié pour le client !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copier la fiche WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
