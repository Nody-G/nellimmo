import React from 'react';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Users,
  PenTool,
  Radio,
  Settings,
  Landmark,
  Radar,
  Calendar,
  BellRing,
  BookUser,
  Calculator,
  ClipboardList,
  Share2,
  FileSpreadsheet,
  ScrollText,
  Network,
  KeyRound,
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

/**
 * Arborescence unique du cockpit.
 * Chaque page conservée est exposée ici : aucune route orpheline.
 */
export function getNavSections(pendingRelancesCount: number): NavSection[] {
  return [
    {
      title: 'Mon Quotidien',
      items: [
        { name: 'Tableau de bord', href: '/cockpit', icon: LayoutDashboard },
        { name: 'Planning & Agenda', href: '/cockpit/agenda', icon: Calendar },
        {
          name: 'Relances & Alertes',
          href: '/cockpit/relances',
          icon: BellRing,
          badge: pendingRelancesCount > 0 ? String(pendingRelancesCount) : undefined,
          badgeUrgent: pendingRelancesCount > 0,
        },
        { name: 'Comptes-rendus vendeurs', href: '/cockpit/comptes-rendus', icon: ClipboardList },
      ],
    },
    {
      title: 'Mes Affaires',
      items: [
        { name: 'Mandats & Biens', href: '/cockpit/mandats', icon: FileText },
        { name: 'Acquéreurs', href: '/cockpit/acquereurs', icon: Users },
        { name: 'Bons de Visite', href: '/cockpit/visites', icon: PenTool },
        { name: 'Ventes & Notaire', href: '/cockpit/transactions', icon: Landmark },
      ],
    },
    {
      title: 'Développement',
      items: [
        { name: 'Pige Immobilière', href: '/cockpit/pige', icon: Radar },
        { name: 'Avis de Valeur DVF', href: '/cockpit/avis-de-valeur', icon: TrendingUp },
        { name: 'Partenaires & Réseau', href: '/cockpit/contacts', icon: BookUser },
        { name: 'Inter-agences', href: '/cockpit/inter-agences', icon: Network },
      ],
    },
    {
      title: 'Marketing & Diffusion',
      items: [
        { name: 'Rédacteur IA', href: '/cockpit/redacteur', icon: Radio },
        { name: 'Fiches Vitrine', href: '/cockpit/fiches-vitrine', icon: Share2 },
        { name: 'Diffusion Portails', href: '/cockpit/diffusion', icon: Share2 },
      ],
    },
    {
      title: 'Gestion & Conformité',
      items: [
        { name: 'Clés & Panneaux', href: '/cockpit/cles-panneaux', icon: KeyRound },
        { name: 'Registre DGCCRF', href: '/cockpit/registre-dgccrf', icon: ScrollText },
        { name: 'Simulateurs & Outils', href: '/cockpit/simulateurs', icon: Calculator },
        { name: 'Import Hektor', href: '/cockpit/import-hektor', icon: FileSpreadsheet },
        { name: 'Paramètres Agence', href: '/cockpit/parametres', icon: Settings },
      ],
    },
  ];
}
