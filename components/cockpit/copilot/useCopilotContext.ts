'use client';

import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNellimo } from '@/lib/store';
import type { Property, Buyer, VisitSheet } from '@/lib/types';
import { computeRelances } from '@/lib/relances';
import {
  buildAgencyDataSnapshot,
  type AgencyDataSnapshot,
} from '@/lib/ai-data-snapshot';

export interface CopilotContextData {
  pathname: string;
  contextTitle: string;
  contextSubtitle: string;
  activeProperty: Property | null;
  activeBuyer: Buyer | null;
  activeVisit: VisitSheet | null;
  suggestedPrompts: { label: string; action: string; prompt: string }[];
  /** Instantané anonymisé des données de l'agence pour le copilote IA. */
  dataSnapshot: AgencyDataSnapshot;
}

export function useCopilotContext(): CopilotContextData {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const {
    properties,
    buyers,
    visits,
    contacts,
    transactions,
    prospectingLeads,
    settings,
  } = useNellimo();

  // Mode omniscient : si l'agent a explicitement accepté le partage des données
  // réelles (Paramètres → IA), on transmet les noms complets sans pseudonymisation.
  const includeRealData = Boolean(settings?.copilot_share_real_data);

  // Instantané des données de l'agence (mémoïsé sur les données sources).
  const dataSnapshot = useMemo(
    () =>
      buildAgencyDataSnapshot({
        properties,
        buyers,
        contacts,
        relances: computeRelances({
          properties,
          buyers,
          visits,
          transactions,
          settings,
        }),
        transactions,
        leads: prospectingLeads,
        visits,
        includeRealData,
      }),
    [
      properties,
      buyers,
      contacts,
      visits,
      transactions,
      prospectingLeads,
      settings,
      includeRealData,
    ]
  );

  return useMemo(() => {
    let contextTitle = 'Espace Général Cockpit';
    let contextSubtitle = 'Gestion globale de votre agence';
    let activeProperty: Property | null = null;
    let activeBuyer: Buyer | null = null;
    let activeVisit: VisitSheet | null = null;
    const pendingRelances = dataSnapshot.totals.relances_pending;
    const portfolioValue = dataSnapshot.portfolio_value;

    // Détection de l'entité active via le paramètre d'URL ?id=...
    const queryId = searchParams?.get('id') || null;
    if (queryId) {
      if (pathname.includes('/acquereurs')) {
        activeBuyer = buyers.find((b) => b.id === queryId) || null;
      } else if (pathname.includes('/visites')) {
        activeVisit = visits.find((v) => v.id === queryId) || null;
      }
    }

    let suggestedPrompts = [
      {
        label: '📊 Fais le point sur mon agence',
        action: 'chat',
        prompt:
          `Fais-moi une synthèse complète de mon agence : ${dataSnapshot.totals.properties} biens ` +
          `(valeur ${portfolioValue}), ${dataSnapshot.totals.buyers} acquéreurs, ` +
          `${dataSnapshot.totals.contacts} contacts, ${pendingRelances} relances en attente, ` +
          `${dataSnapshot.totals.transactions} transactions et ${dataSnapshot.totals.leads} leads. ` +
          `Quelles sont mes 3 priorités d'action aujourd'hui ?`,
      },
      {
        label: '🔔 Mes relances en attente',
        action: 'chat',
        prompt:
          `Liste-moi les ${pendingRelances} relances en attente et propose pour chacune ` +
          `un message court et chaleureux adapté à son échéance.`,
      },
      {
        label: '✨ Réécrire à ma plume',
        action: 'rewrite_nelly',
        prompt: 'Peux-tu reformuler ce texte pour lui donner mon ton chaleureux, bienveillant et provençal ?',
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
          {
            label: '📁 Créer le dossier Drive du mandat',
            action: 'chat',
            prompt:
              `Crée le dossier Google Drive du mandat ${activeProperty.mandate_number} ` +
              `pour « ${activeProperty.title} » avec son arborescence standard.`,
          },
        ];
      } else {
        contextTitle = 'Portefeuille de Mandats';
        contextSubtitle = `${properties.length} biens sous mandat actifs • ${portfolioValue}`;
        suggestedPrompts = [
          {
            label: '📊 Synthèse du Portefeuille',
            action: 'chat',
            prompt:
              `Analyse mon portefeuille de ${dataSnapshot.totals.properties} biens (valeur ${portfolioValue}) : ` +
              `quels mandats sont les plus anciens ou les plus chers, et quelles actions concrètes ` +
              `pour accélérer leur vente ?`,
          },
          {
            label: '🎯 Biens sans acquéreur',
            action: 'chat',
            prompt:
              `Parmi mes ${dataSnapshot.totals.properties} biens et ${dataSnapshot.totals.buyers} acquéreurs, ` +
              `identifie les biens qui n'ont pas d'acquéreur correspondant et propose des pistes de mise en relation.`,
          },
          {
            label: '⚡ Saisie Express d’un Mandat',
            action: 'smart_form_parse',
            prompt: 'Je colle ici le texte d’un bien reçu pour que tu m’en extraies toutes les caractéristiques.',
          },
        ];
      }
    }

    // Détection de la page Visites
    else if (pathname.includes('/visites')) {
      if (activeVisit) {
        const visitProp = properties.find((p) => p.id === activeVisit?.property_id);
        const visitBuyer = buyers.find((b) => b.id === activeVisit?.buyer_id);
        const buyerName = visitBuyer
          ? `${visitBuyer.first_name || ''} ${visitBuyer.last_name || ''}`.trim()
          : 'acquéreur';
        contextTitle = `Visite — ${visitProp?.title || 'Bien'}`;
        contextSubtitle = `${buyerName} • ${new Date(activeVisit.visit_date).toLocaleDateString('fr-FR')}`;
        suggestedPrompts = [
          {
            label: '🎤 Débriefing Visite Vendeur',
            action: 'vendor_debrief',
            prompt: `Aide-moi à formuler le débriefing WhatsApp pour ${visitProp?.seller_name || 'le propriétaire'} après la visite de ${visitProp?.title || 'ce bien'}.`,
          },
          {
            label: '💌 Relance post-visite acquéreur',
            action: 'relance_boost',
            prompt: `Rédige un SMS chaleureux pour demander son avis à ${buyerName} après sa visite de ${visitProp?.title || 'ce bien'}.`,
          },
          {
            label: '📋 Analyse de la visite',
            action: 'chat',
            prompt: `Analyse la visite de ${visitProp?.title || 'ce bien'} par ${buyerName} et propose les prochaines étapes concrètes.`,
          },
          {
            label: '📅 Ajouter la visite à mon agenda Google',
            action: 'chat',
            prompt:
              `Ajoute la visite de ${visitProp?.title || 'ce bien'} avec ${buyerName} ` +
              `du ${new Date(activeVisit.visit_date).toLocaleDateString('fr-FR')} à mon agenda Google.`,
          },
        ];
      } else {
        contextTitle = 'Visites & Retours Acquéreurs';
        contextSubtitle = `${visits.length} visites enregistrées`;
        suggestedPrompts = [
          {
            label: '📋 Bilan de mes visites',
            action: 'chat',
            prompt:
              `Fais le bilan de mes ${dataSnapshot.totals.visits} visites enregistrées : ` +
              `quels biens suscitent le plus d'intérêt et quels acquéreurs semblent les plus chauds ?`,
          },
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
    }

    // Détection de la page Acquéreurs
    else if (pathname.includes('/acquereurs')) {
      if (activeBuyer) {
        const fullName = `${activeBuyer.first_name || ''} ${activeBuyer.last_name || ''}`.trim();
        contextTitle = `Acquéreur — ${fullName || 'Fiche acquéreur'}`;
        contextSubtitle =
          `Budget ${activeBuyer.budget_max ? `${activeBuyer.budget_max.toLocaleString('fr-FR')} €` : 'n/c'}` +
          ` • ${activeBuyer.target_cities?.join(', ') || 'secteur n/c'}` +
          ` • ${activeBuyer.financing_status || 'financement n/c'}`;
        suggestedPrompts = [
          {
            label: '💌 Email Coup de Cœur',
            action: 'buyer_pitch',
            prompt: `Rédige un email personnalisé "J'ai pensé à vous" pour proposer un bien correspondant au projet de ${fullName || 'cet acquéreur'}.`,
          },
          {
            label: '🎯 Biens à lui proposer',
            action: 'chat',
            prompt:
              `Parmi mes ${dataSnapshot.totals.properties} biens, lesquels correspondent le mieux au projet de ` +
              `${fullName || 'cet acquéreur'} (budget ${activeBuyer.budget_max || 'n/c'} €, ` +
              `${activeBuyer.target_cities?.join(', ') || 'secteur n/c'}) ? Explique pourquoi.`,
          },
          {
            label: '🔍 Vérifier son financement',
            action: 'chat',
            prompt: `Quelles questions clés dois-je poser à ${fullName || 'cet acquéreur'} pour sécuriser son financement ?`,
          },
          {
            label: '✉️ Envoyer un email de relance',
            action: 'chat',
            prompt:
              `Envoie un email de relance chaleureux à ${fullName || 'cet acquéreur'}` +
              `${activeBuyer.email ? ` (${activeBuyer.email})` : ''} pour faire le point sur son projet.`,
          },
        ];
      } else {
        contextTitle = 'Fichiers Acquéreurs & Projets';
        contextSubtitle = `${buyers.length} profils acquéreurs suivis`;
        suggestedPrompts = [
          {
            label: '🎯 Matching biens / acquéreurs',
            action: 'chat',
            prompt:
              `Avec mes ${dataSnapshot.totals.buyers} acquéreurs et ${dataSnapshot.totals.properties} biens, ` +
              `propose-moi les meilleures mises en relation (acquéreur ↔ bien) en expliquant pourquoi.`,
          },
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
    }

    // Détection de la page Relances
    else if (pathname.includes('/relances')) {
      contextTitle = 'Centre de Relances & Suivi';
      contextSubtitle = `${pendingRelances} relances en attente • nurturing client`;
      suggestedPrompts = [
        {
          label: '🔔 Détail de mes relances',
          action: 'chat',
          prompt:
            `Détaille mes ${pendingRelances} relances en attente : classe-les par urgence ` +
            `et indique pour chacune le contact concerné et l'action à mener.`,
        },
        {
          label: '⚡ Optimiser les relances du jour',
          action: 'relance_boost',
          prompt: 'Peux-tu me suggérer des formulations naturelles et délicates pour les relances en attente ?',
        },
        {
          label: '✅ Créer une tâche de suivi',
          action: 'chat',
          prompt:
            'Crée une tâche Google Tasks « Relancer les acquéreurs en attente » ' +
            'avec une échéance à demain et une note de rappel.',
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
      dataSnapshot,
    };
  }, [pathname, searchParams, properties, buyers, visits, dataSnapshot]);
}
