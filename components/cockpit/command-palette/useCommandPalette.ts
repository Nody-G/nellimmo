'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  FileText,
  Users,
  TrendingUp,
  PenTool,
  Printer,
  ShieldCheck,
  Radio,
  Settings,
  Sparkles,
  PlusCircle,
  Clock,
  Landmark,
  Radar,
  FileCheck2,
  BrainCircuit,
  BookOpen,
  BookUser,
  Calendar,
  Bell,
  Calculator,
  Share2,
  Key,
  Building2,
  BarChart3,
  ArrowDownToLine,
} from 'lucide-react';
import { HELP_GUIDES } from '@/lib/help-content';
import { PaletteItem } from './command-types';

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { properties, buyers, contactLeads, estimationLeads, contacts } = useNellimoStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setSearch('');
            setSelectedIndex(0);
          }
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Static Cockpit Navigation Items
  const staticNavigation: PaletteItem[] = useMemo(
    () => [
      {
        id: 'nav-aide',
        title: 'Cockpit Academy & Guides Pratiques',
        subtitle: '12 guides et tutoriels complets avec exemples concrets et scripts',
        category: 'Formation & Aide',
        href: '/cockpit/aide',
        icon: BookOpen,
      },
      {
        id: 'nav-nouveau',
        title: 'Nouveau Mandat',
        subtitle: 'Créer un nouveau mandat Loi Hoguet',
        category: 'Actions',
        href: '/cockpit/mandats/nouveau',
        icon: PlusCircle,
      },
      {
        id: 'nav-dashboard',
        title: 'Tableau de Bord Cockpit',
        subtitle: 'Supervision globale de l’agence',
        category: 'Outils',
        href: '/cockpit',
        icon: ShieldCheck,
      },
      {
        id: 'nav-mandats',
        title: 'Registre des Mandats',
        subtitle: 'Consulter tous les mandats',
        category: 'Outils',
        href: '/cockpit/mandats',
        icon: FileText,
      },
      {
        id: 'nav-transactions',
        title: 'Pipeline Ventes & Notaire',
        subtitle: 'Suivi des compromis, délais SRU, prêts J+60 et factures',
        category: 'Outils',
        href: '/cockpit/transactions',
        icon: Landmark,
      },
      {
        id: 'nav-contacts',
        title: 'Carnet de Contacts Pro & Hub Gmail',
        subtitle: 'Annuaire unifié notaires, diagnostiqueurs, artisans, acquéreurs & vendeurs',
        category: 'Outils',
        href: '/cockpit/contacts',
        icon: BookUser,
      },
      {
        id: 'nav-acquereurs',
        title: 'CRM Acquéreurs & Alertes WhatsApp',
        subtitle: 'Rapprochement et acquéreurs qualifiés',
        category: 'Outils',
        href: '/cockpit/acquereurs',
        icon: Users,
      },
      {
        id: 'nav-visites',
        title: 'Bons de Visite Électroniques',
        subtitle: 'Signatures tactiles sur tablette/mobile',
        category: 'Outils',
        href: '/cockpit/visites',
        icon: PenTool,
      },
      {
        id: 'nav-dvf',
        title: 'Avis de Valeur DVF & Estimations',
        subtitle: 'Étude de marché et données notariales',
        category: 'Outils',
        href: '/cockpit/avis-de-valeur',
        icon: TrendingUp,
      },
      {
        id: 'nav-vitrine',
        title: 'Studio Fiches Vitrine LED & Affiches',
        subtitle: 'Affiches vitrine A4/A3 haute définition',
        category: 'Outils',
        href: '/cockpit/fiches-vitrine',
        icon: Printer,
      },
      {
        id: 'nav-redacteur',
        title: 'Rédacteur IA & Réseaux Sociaux',
        subtitle: 'Générateur d’annonces et posts Instagram/Meta',
        category: 'Outils',
        href: '/cockpit/redacteur',
        icon: Sparkles,
      },
      {
        id: 'nav-diffusion',
        title: 'Hub Multidiffusion (SeLoger, BienIci, LeBonCoin)',
        subtitle: 'Passerelles et flux d’export',
        category: 'Outils',
        href: '/cockpit/diffusion',
        icon: Radio,
      },
      {
        id: 'nav-pige',
        title: 'Radar Pige & Prospection PAP / LBC',
        subtitle: 'Détection vendeurs et sparring-partner d’objections',
        category: 'Outils',
        href: '/cockpit/pige',
        icon: Radar,
      },
      {
        id: 'nav-comptes-rendus',
        title: 'Comptes-Rendus Vendeurs',
        subtitle: 'Bilans de commercialisation et transmission WhatsApp',
        category: 'Outils',
        href: '/cockpit/comptes-rendus',
        icon: FileCheck2,
      },
      {
        id: 'nav-lab',
        title: 'Nell’IA Infinite Lab (Idéation & Stratégies)',
        subtitle: 'Incubateur sans limites, négociations et clauses juridiques',
        category: 'Outils',
        href: '/cockpit/lab',
        icon: BrainCircuit,
      },
      {
        id: 'nav-dgccrf',
        title: 'Registre Légal DGCCRF & Loi Hoguet',
        subtitle: 'Audit scellé SHA-256 et export officiel',
        category: 'Outils',
        href: '/cockpit/registre-dgccrf',
        icon: ShieldCheck,
      },
      {
        id: 'nav-agenda',
        title: 'Agenda & Planning Visites',
        subtitle: 'Organisation des rendez-vous et plannings agents',
        category: 'Outils',
        href: '/cockpit/agenda',
        icon: Calendar,
      },
      {
        id: 'nav-relances',
        title: 'Centre de Relances & Suivis',
        subtitle: 'Relances acquéreurs, vendeurs et notaires',
        category: 'Outils',
        href: '/cockpit/relances',
        icon: Bell,
      },
      {
        id: 'nav-simulateurs',
        title: 'Simulateurs Financiers & Juridiques',
        subtitle: 'Rendement locatif LMNP, crédit HCSF 35% et délais SRU',
        category: 'Outils',
        href: '/cockpit/simulateurs',
        icon: Calculator,
      },
      {
        id: 'nav-reseaux-sociaux',
        title: 'Studio Réseaux Sociaux & Visuels',
        subtitle: 'Créateur de posts Instagram, Facebook, LinkedIn et formats HD',
        category: 'Outils',
        href: '/cockpit/reseaux-sociaux',
        icon: Share2,
      },
      {
        id: 'nav-cles-panneaux',
        title: 'Registre Clés & Panneaux',
        subtitle: 'Traçabilité des trousseaux et suivi d’implantation des panneaux',
        category: 'Outils',
        href: '/cockpit/cles-panneaux',
        icon: Key,
      },
      {
        id: 'nav-inter-agences',
        title: 'Bourse Délégation & Inter-Agences',
        subtitle: 'Partage de mandats et collaborations confrères',
        category: 'Outils',
        href: '/cockpit/inter-agences',
        icon: Building2,
      },
      {
        id: 'nav-analytics',
        title: 'Statistiques & Performance Commerciale',
        subtitle: 'KPIs d’activité, taux de transformation et prévisionnel',
        category: 'Outils',
        href: '/cockpit/analytics',
        icon: BarChart3,
      },
      {
        id: 'nav-import-hektor',
        title: 'Passerelle Import Hektor',
        subtitle: 'Synchronisation et migration automatique du catalogue Hektor',
        category: 'Outils',
        href: '/cockpit/import-hektor',
        icon: ArrowDownToLine,
      },
      {
        id: 'nav-params',
        title: 'Paramètres & Connexions API',
        subtitle: 'Mentions légales, Meta API, Google et sauvegarde',
        category: 'Outils',
        href: '/cockpit/parametres',
        icon: Settings,
      },
    ],
    []
  );

  // Filtered results
  const results: PaletteItem[] = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      return staticNavigation.slice(0, 7);
    }

    const items: PaletteItem[] = [];

    // Search properties
    properties.forEach((p) => {
      const mandateRef = formatMandateRef(p.mandate_number);
      if (
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.seller_name.toLowerCase().includes(q) ||
        mandateRef.toLowerCase().includes(q)
      ) {
        items.push({
          id: `prop-${p.id}`,
          title: p.title,
          subtitle: `${mandateRef} • ${p.price_fai.toLocaleString('fr-FR')} € • ${p.city} (${p.seller_name})`,
          category: 'Mandats & Biens',
          href: `/cockpit/mandats/${p.id}`,
          icon: FileText,
          badge: p.status,
        });
      }
    });

    // Search buyers
    buyers.forEach((b) => {
      const fullName = `${b.first_name} ${b.last_name}`;
      if (
        fullName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.target_cities.some((c) => c.toLowerCase().includes(q))
      ) {
        items.push({
          id: `buyer-${b.id}`,
          title: fullName,
          subtitle: `Budget max : ${b.budget_max.toLocaleString('fr-FR')} € • ${b.target_cities.join(', ')} • ${b.phone}`,
          category: 'Acquéreurs CRM',
          href: '/cockpit/acquereurs',
          icon: Users,
          badge: b.status,
        });
      }
    });

    // Search leads
    contactLeads.forEach((l) => {
      if (l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)) {
        items.push({
          id: `lead-contact-${l.id}`,
          title: `Lead Contact : ${l.name}`,
          subtitle: `${l.email} • ${l.phone} • ${l.message}`,
          category: 'Demandes Entrantes',
          href: '/cockpit',
          icon: Clock,
          badge: l.status,
        });
      }
    });

    estimationLeads.forEach((l) => {
      const fullName = `${l.first_name} ${l.last_name}`;
      if (fullName.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)) {
        items.push({
          id: `lead-est-${l.id}`,
          title: `Lead Estimation : ${fullName}`,
          subtitle: `${l.property_type} ${l.living_area}m² à ${l.city} (${l.phone})`,
          category: 'Demandes Entrantes',
          href: `/cockpit/avis-de-valeur?city=${encodeURIComponent(l.city)}&surface=${l.living_area}&owner=${encodeURIComponent(fullName)}`,
          icon: TrendingUp,
          badge: l.status,
        });
      }
    });

    // Search contacts
    contacts.forEach((c) => {
      const fullName = `${c.first_name} ${c.last_name}`;
      if (
        fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.role.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q))
      ) {
        items.push({
          id: `contact-${c.id}`,
          title: `${fullName}${c.company ? ` • ${c.company}` : ''}`,
          subtitle: `${c.role.toUpperCase()} — ${c.phone} — ${c.email}`,
          category: 'Contacts & Répertoire Pro',
          href: `/cockpit/contacts?id=${c.id}`,
          icon: BookUser,
          badge: c.role,
        });
      }
    });

    // Search static nav
    staticNavigation.forEach((nav) => {
      if (nav.title.toLowerCase().includes(q) || nav.category.toLowerCase().includes(q)) {
        items.push({
          id: `nav-${nav.href}`,
          title: nav.title,
          subtitle: `Accéder à la section ${nav.category}`,
          category: 'Navigation Outils',
          href: nav.href,
          icon: nav.icon,
        });
      }
    });

    // Search help guides
    HELP_GUIDES.forEach((guide) => {
      if (
        guide.title.toLowerCase().includes(q) ||
        guide.shortTitle.toLowerCase().includes(q) ||
        guide.tags.some((t) => t.toLowerCase().includes(q)) ||
        'aide'.includes(q) ||
        'tuto'.includes(q) ||
        'guide'.includes(q)
      ) {
        items.push({
          id: `help-${guide.id}`,
          title: `Tuto : ${guide.shortTitle}`,
          subtitle: `${guide.title} (${guide.readTimeMinutes} min)`,
          category: 'Guides & Tutoriels',
          href: `/cockpit/aide?guide=${guide.id}`,
          icon: BookOpen,
          badge: guide.badge,
        });
      }
    });

    return items;
  }, [search, properties, buyers, contactLeads, estimationLeads, contacts, staticNavigation]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].href);
      }
    }
  };

  return {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    selectedIndex,
    setSelectedIndex,
    inputRef,
    results,
    handleSelect,
    handleKeyDownInList,
  };
}
