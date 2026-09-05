import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
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
  BrainCircuit,
  Handshake,
  KeyRound,
  Calendar,
  BookOpen,
  BellRing,
  Calculator,
  Share2,
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
        { name: 'Bons de Visite & Sentiment', href: '/cockpit/visites', icon: PenTool },
      ],
    },
    {
      title: 'Portefeuille & CRM',
      items: [
        { name: 'Mandats & Biens', href: '/cockpit/mandats', icon: FileText },
        { name: 'Carnet de Contacts Pro', href: '/cockpit/contacts', icon: BookUser },
        { name: 'Acquéreurs & Matching', href: '/cockpit/acquereurs', icon: Users },
        { name: 'Comptes-Rendus Vendeurs', href: '/cockpit/comptes-rendus', icon: FileCheck2 },
        { name: 'Clés & Panneaux', href: '/cockpit/cles-panneaux', icon: KeyRound },
        { name: 'Bourse Inter-Agences', href: '/cockpit/inter-agences', icon: Handshake },
      ],
    },
    {
      title: 'Estimation & Prospection',
      items: [
        { name: 'Pige & Prospection PAP', href: '/cockpit/pige', icon: Radar },
        { name: 'Avis de Valeur DVF', href: '/cockpit/avis-de-valeur', icon: TrendingUp },
        { name: 'Simulateurs Financiers', href: '/cockpit/simulateurs', icon: Calculator },
      ],
    },
    {
      title: 'Marketing & Stratégie',
      items: [
        { name: 'Studio Rédaction IA', href: '/cockpit/redacteur', icon: Sparkles },
        { name: 'Studio Réseaux Sociaux', href: '/cockpit/reseaux-sociaux', icon: Share2 },
        { name: 'Fiches Vitrine LED', href: '/cockpit/fiches-vitrine', icon: Printer },
        { name: 'Multidiffusion Portails', href: '/cockpit/diffusion', icon: Radio },
        { name: 'Négociation & Stratégie', href: '/cockpit/lab', icon: BrainCircuit },
      ],
    },
    {
      title: 'Gestion & Conformité',
      items: [
        { name: 'Registre DGCCRF', href: '/cockpit/registre-dgccrf', icon: ShieldCheck },
        { name: 'Analytics & KPIs', href: '/cockpit/analytics', icon: BarChart3 },
        { name: 'Guides & Academy', href: '/cockpit/aide', icon: BookOpen, badge: 'Academy' },
        { name: 'Paramètres & Connexions', href: '/cockpit/parametres', icon: Settings },
      ],
    },
  ];
}
