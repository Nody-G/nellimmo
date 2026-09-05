import React from 'react';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Users,
  PenTool,
  Printer,
  Radio,
  ShieldCheck,
  Sparkles,
  Settings,
  Landmark,
  Radar,
  FileCheck2,
  KeyRound,
  Calendar,
  BellRing,
  BookUser,
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
      title: 'Activité & Ventes',
      items: [
        { name: 'Tableau de Bord', href: '/cockpit', icon: LayoutDashboard },
        { name: 'Planning & Agenda', href: '/cockpit/agenda', icon: Calendar },
        {
          name: 'Relances Proactives',
          href: '/cockpit/relances',
          icon: BellRing,
          badge: pendingRelancesCount > 0 ? String(pendingRelancesCount) : undefined,
          badgeUrgent: pendingRelancesCount > 0,
        },
        { name: 'Pipeline Notaire & Ventes', href: '/cockpit/transactions', icon: Landmark },
        { name: 'Bons de Visite & Signatures', href: '/cockpit/visites', icon: PenTool },
      ],
    },
    {
      title: 'Portefeuille & Clients',
      items: [
        { name: 'Mandats & Biens', href: '/cockpit/mandats', icon: FileText },
        { name: 'Acquéreurs & Matching', href: '/cockpit/acquereurs', icon: Users },
        { name: 'Carnet de Contacts Pro', href: '/cockpit/contacts', icon: BookUser },
        { name: 'Comptes-Rendus Vendeurs', href: '/cockpit/comptes-rendus', icon: FileCheck2 },
      ],
    },
    {
      title: 'Estimation & Prospection',
      items: [
        { name: 'Pige & Prospection PAP', href: '/cockpit/pige', icon: Radar },
        { name: 'Avis de Valeur DVF', href: '/cockpit/avis-de-valeur', icon: TrendingUp },
      ],
    },
    {
      title: 'Marketing & Diffusion',
      items: [
        { name: 'Studio Rédaction & Stratégie', href: '/cockpit/redacteur', icon: Sparkles },
        { name: 'Fiches Vitrine LED', href: '/cockpit/fiches-vitrine', icon: Printer },
        { name: 'Multidiffusion Portails', href: '/cockpit/diffusion', icon: Radio },
      ],
    },
    {
      title: 'Gestion & Terrain',
      items: [
        { name: 'Registre DGCCRF Mandats', href: '/cockpit/registre-dgccrf', icon: ShieldCheck },
        { name: 'Clés & Panneaux Terrain', href: '/cockpit/cles-panneaux', icon: KeyRound },
        { name: 'Paramètres & Connexions', href: '/cockpit/parametres', icon: Settings },
      ],
    },
  ];
}
