import React from 'react';
import {
  User,
  Landmark,
  ShieldCheck,
  Calculator,
  Hammer,
  Building2,
  Handshake,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
} from 'lucide-react';
import type { ContactRole, ContactStatus, ContactInteractionType } from '@/lib/types';

export interface RoleConfig {
  label: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const ROLE_CONFIGS: Record<ContactRole, RoleConfig> = {
  notaire: {
    label: 'Notaire & Clerc',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    borderClass: 'border-purple-300',
    bgLightClass: 'bg-purple-50/50',
    icon: Landmark,
    description: 'Offices notariaux, clercs de notaires, compromis & actes authentiques',
  },
  diagnostiqueur: {
    label: 'Diagnostiqueur',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    borderClass: 'border-amber-300',
    bgLightClass: 'bg-amber-50/50',
    icon: ShieldCheck,
    description: 'DPE, audit énergétique, amiante, plomb, gaz, électricité, Carrez',
  },
  courtier: {
    label: 'Courtier & Banque',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderClass: 'border-emerald-300',
    bgLightClass: 'bg-emerald-50/50',
    icon: Calculator,
    description: 'Courtiers en crédits, directeurs d’agences bancaires, accords de prêt',
  },
  artisan: {
    label: 'Artisan & BTP',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    borderClass: 'border-orange-300',
    bgLightClass: 'bg-orange-50/50',
    icon: Hammer,
    description: 'Rénovation générale, plomberie, électricité, peintures, devis',
  },
  syndic: {
    label: 'Syndic & Géomètre',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    borderClass: 'border-blue-300',
    bgLightClass: 'bg-blue-50/50',
    icon: Building2,
    description: 'Gestionnaires de copropriété, pré-états datés, géomètres experts',
  },
  vendeur: {
    label: 'Vendeur / Propriétaire',
    badgeClass: 'bg-rose-100 text-[#E12B7B] border-rose-200',
    borderClass: 'border-rose-300',
    bgLightClass: 'bg-rose-50/50',
    icon: User,
    description: 'Mandants, propriétaires vendeurs sous contrat avec l’agence',
  },
  acquereur: {
    label: 'Acquéreur qualifié',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    borderClass: 'border-sky-300',
    bgLightClass: 'bg-sky-50/50',
    icon: User,
    description: 'Acheteurs actifs avec critères, budget validé et alertes',
  },
  confrere: {
    label: 'Confrère / Partenaire',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderClass: 'border-indigo-300',
    bgLightClass: 'bg-indigo-50/50',
    icon: Handshake,
    description: 'Agences partenaires, délégations de mandats, bourse partagée',
  },
  autre: {
    label: 'Autre professionnel',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
    borderClass: 'border-gray-300',
    bgLightClass: 'bg-gray-50/50',
    icon: User,
    description: 'Avocats, apporteurs d’affaires, photographes, concierges',
  },
};

export const STATUS_CONFIGS: Record<ContactStatus, { label: string; badgeClass: string }> = {
  actif: { label: 'Actif', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  vip: { label: 'Partenaire VIP', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  en_veille: { label: 'En veille', badgeClass: 'bg-gray-50 text-gray-600 border-gray-200' },
  archive: { label: 'Archivé', badgeClass: 'bg-slate-50 text-slate-400 border-slate-200' },
};

export const INTERACTION_TYPE_CONFIGS: Record<
  ContactInteractionType,
  { label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string }
> = {
  email_gmail: { label: 'Email Gmail', icon: Mail, colorClass: 'text-red-600 bg-red-50' },
  appel: { label: 'Appel téléphonique', icon: Phone, colorClass: 'text-emerald-600 bg-emerald-50' },
  whatsapp: { label: 'Message WhatsApp', icon: MessageSquare, colorClass: 'text-green-600 bg-green-50' },
  rdv: { label: 'Rendez-vous / Visite', icon: Calendar, colorClass: 'text-purple-600 bg-purple-50' },
  note: { label: 'Note interne', icon: FileText, colorClass: 'text-amber-600 bg-amber-50' },
  document: { label: 'Document partagé', icon: FileText, colorClass: 'text-blue-600 bg-blue-50' },
};
