'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useNellimo } from '@/lib/store';
import type { Property, Buyer, VisitSheet } from '@/lib/types';

export interface CopilotContextData {
  pathname: string;
  contextTitle: string;
  contextSubtitle: string;
  activeProperty: Property | null;
  activeBuyer: Buyer | null;
  activeVisit: VisitSheet | null;
  suggestedPrompts: { label: string; action: string; prompt: string }[];
}

export function useCopilotContext(): CopilotContextData {
  const pathname = usePathname() || '';
  const { properties, buyers, visits } = useNellimo();

  return useMemo(() => {
    let contextTitle = 'Espace Général Cockpit';
    let contextSubtitle = 'Gestion globale de votre agence';
    let activeProperty: Property | null = null;
    const activeBuyer: Buyer | null = null;
    const activeVisit: VisitSheet | null = null;
    let suggestedPrompts = [
      {
        label: '✨ Réécrire à ma plume',
        action: 'rewrite_nelly',
        prompt: 'Peux-tu reformuler ce texte pour lui donner mon ton chaleureux, bienveillant et provençal ?',
      },
      {
        label: '💬 Préparer un SMS client',
        action: 'chat',
        prompt: 'Rédige-moi un SMS court et chaleureux pour prendre des nouvelles d’un client.',
      },
      {
        label: '📸 Idée de post Instagram',
        action: 'social_post',
        prompt: 'Donne-moi une idée de post Instagram engageant pour valoriser l’art de vivre en Provence.',
      },
    ];

    // Détection de la page Mandats
    if (pathname.includes('/mandats')) {
      const match = pathname.match(/\/mandats\/([^/]+)/);
      const mandateId = match ? match[1] : null;

      if (mandateId && mandateId !== 'nouveau') {
        activeProperty = properties.find((p) => p.id === mandateId) || null;
      }

      if (activeProperty) {
        contextTitle = `Mandat #${activeProperty.mandate_number} — ${activeProperty.title}`;
        contextSubtitle = `${activeProperty.city} • ${activeProperty.price_fai.toLocaleString('fr-FR')} € FAI • ${activeProperty.living_area} m²`;
        suggestedPrompts = [
          {
            label: '💬 Message WhatsApp Vendeur',
            action: 'vendor_debrief',
            prompt: `Rédige un point de situation WhatsApp bienveillant pour ${activeProperty.seller_name || 'le propriétaire'} sur l’intérêt suscité par ce bien.`,
          },
          {
            label: '📸 Post Instagram du Bien',
            action: 'social_post',
            prompt: `Génère le post Instagram complet avec accroche et hashtags pour cette maison à ${activeProperty.city}.`,
          },
          {
            label: '🎯 3 Acquéreurs potentiels',
            action: 'chat',
            prompt: `Quels critères clés devrais-je mettre en avant auprès des acquéreurs en recherche sur ${activeProperty.city} ?`,
          },
          {
            label: '✨ Reformuler l’annonce',
            action: 'rewrite_nelly',
            prompt: `Propose une accroche percutante et émotionnelle pour l’annonce de ce bien.`,
          },
        ];
      } else {
        contextTitle = 'Portefeuille de Mandats';
        contextSubtitle = `${properties.length} biens sous mandat actifs`;
        suggestedPrompts = [
          {
            label: '⚡ Saisie Express d’un Mandat',
            action: 'smart_form_parse',
            prompt: 'Je colle ici le texte d’un bien reçu pour que tu m’en extraies toutes les caractéristiques.',
          },
          {
            label: '📊 Synthèse du Portefeuille',
            action: 'chat',
            prompt: 'Donne-moi 3 idées d’actions prioritaires pour accélérer la vente des mandats en portefeuille.',
          },
        ];
      }
    }

    // Détection de la page Visites
    else if (pathname.includes('/visites')) {
      contextTitle = 'Visites & Retours Acquéreurs';
      contextSubtitle = `${visits.length} visites enregistrées`;
      suggestedPrompts = [
        {
          label: '🎤 Débriefing Visite Vendeur',
          action: 'vendor_debrief',
          prompt: 'Aide-moi à formuler le débriefing WhatsApp pour le propriétaire après ma dernière visite.',
        },
        {
          label: '💌 Relance post-visite acquéreur',
          action: 'relance_boost',
          prompt: 'Rédige un SMS chaleureux pour demander leur avis aux visiteurs d’hier sans leur mettre la pression.',
        },
      ];
    }

    // Détection de la page Acquéreurs
    else if (pathname.includes('/acquereurs')) {
      contextTitle = 'Fichiers Acquéreurs & Projets';
      contextSubtitle = `${buyers.length} profils acquéreurs suivis`;
      suggestedPrompts = [
        {
          label: '💌 Email Coup de Cœur',
          action: 'buyer_pitch',
          prompt: 'Rédige un email personnalisé "J’ai pensé à vous" pour proposer une opportunité à un acquéreur.',
        },
        {
          label: '🔍 Qualifier un nouveau projet',
          action: 'chat',
          prompt: 'Quelles questions clés dois-je poser pour vérifier la solidité du financement d’un acquéreur ?',
        },
      ];
    }

    // Détection de la page Relances
    else if (pathname.includes('/relances')) {
      contextTitle = 'Centre de Relances & Suivi';
      contextSubtitle = 'Nurturing et maintien du lien client';
      suggestedPrompts = [
        {
          label: '⚡ Optimiser les relances du jour',
          action: 'relance_boost',
          prompt: 'Peux-tu me suggérer des formulations naturelles et délicates pour les relances en attente ?',
        },
      ];
    }

    return {
      pathname,
      contextTitle,
      contextSubtitle,
      activeProperty,
      activeBuyer,
      activeVisit,
      suggestedPrompts,
    };
  }, [pathname, properties, buyers, visits]);
}
