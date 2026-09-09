import React from 'react';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Users,
  PenTool,
  Printer,
  Radio,
  Sparkles,
  Settings,
  Landmark,
  Radar,
  FileCheck2,
  KeyRound,
  Calendar,
  BellRing,
  BookUser,
  Database,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeUrgent?: boolean;
  highlight?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export function getNavSections(pendingRelancesCount: number): NavSection[] {
  return [
    {
      title: 'Activité',
      items: [
        { name: 'Tableau de bord', href: '/cockpit', icon: LayoutDashboard },
        { name: 'Planning & Agenda', href: '/cockpit/agenda', icon: Calendar },
        {
          name: 'Relances',
          href: '/cockpit/relances',
          icon: BellRing,
          badge: pendingRelancesCount > 0 ? String(pendingRelancesCount) : undefined,
          badgeUrgent: pendingRelancesCount > 0,
        },
      ],
    },
    {
      title: 'Métier & Ventes',
      items: [
        { name: 'Mandats', href: '/cockpit/mandats', icon: FileText },
        { name: 'Acquéreurs', href: '/cockpit/acquereurs', icon: Users },
        { name: 'Visites', href: '/cockpit/visites', icon: PenTool },
        { name: 'Ventes & Notaire', href: '/cockpit/transactions', icon: Landmark },
      ],
    },
    {
      title: 'Prospection & Réseau',
      items: [
        { name: 'Pige immobilière', href: '/cockpit/pige', icon: Radar },
        { name: 'Avis de valeur DVF', href: '/cockpit/avis-de-valeur', icon: TrendingUp },
        { name: 'Contacts', href: '/cockpit/contacts', icon: BookUser },
        { name: 'Comptes-rendus', href: '/cockpit/comptes-rendus', icon: FileCheck2 },
      ],
    },
    {
      title: 'Studio & Agence',
      items: [
        { name: 'Studio Marketing', href: '/cockpit/redacteur', icon: Sparkles },
        { name: 'Fiches Vitrine', href: '/cockpit/fiches-vitrine', icon: Printer },
        { name: 'Multidiffusion', href: '/cockpit/diffusion', icon: Radio },
        { name: 'Clés & Panneaux', href: '/cockpit/cles-panneaux', icon: KeyRound },
        { name: 'Base de données', href: '/cockpit/base-de-donnees', icon: Database },
        { name: 'Paramètres', href: '/cockpit/parametres', icon: Settings },
      ],
    },
  ];
}
