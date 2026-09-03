'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  Search,
  FileText,
  Users,
  TrendingUp,
  PenTool,
  Printer,
  ShieldCheck,
  Radio,
  Settings,
  X,
  ArrowRight,
  Sparkles,
  Command,
  HelpCircle,
  PlusCircle,
  Clock,
  Landmark,
  Radar,
  FileCheck2,
  BrainCircuit
} from 'lucide-react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { properties, buyers, contactLeads, estimationLeads } = useNellimoStore();
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

  interface PaletteItem {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  // Static Cockpit Navigation Items
  const staticNavigation: PaletteItem[] = useMemo(() => [
    { id: 'nav-nouveau', title: 'Nouveau Mandat', subtitle: 'Créer un nouveau mandat Loi Hoguet', category: 'Actions', href: '/cockpit/mandats/nouveau', icon: PlusCircle },
    { id: 'nav-dashboard', title: 'Tableau de Bord Cockpit', subtitle: 'Supervision globale de l\'agence', category: 'Outils', href: '/cockpit', icon: ShieldCheck },
    { id: 'nav-mandats', title: 'Registre des Mandats', subtitle: 'Consulter tous les mandats', category: 'Outils', href: '/cockpit/mandats', icon: FileText },
    { id: 'nav-transactions', title: 'Pipeline Ventes & Notaire', subtitle: 'Suivi des compromis, délais SRU, prêts J+60 et factures', category: 'Outils', href: '/cockpit/transactions', icon: Landmark },
    { id: 'nav-acquereurs', title: 'CRM Acquéreurs & Alertes WhatsApp', subtitle: 'Rapprochement et acquéreurs qualifiés', category: 'Outils', href: '/cockpit/acquereurs', icon: Users },
    { id: 'nav-visites', title: 'Bons de Visite Électroniques', subtitle: 'Signatures tactiles sur tablette/mobile', category: 'Outils', href: '/cockpit/visites', icon: PenTool },
    { id: 'nav-dvf', title: 'Avis de Valeur DVF & Estimations', subtitle: 'Étude de marché et données notariales', category: 'Outils', href: '/cockpit/avis-de-valeur', icon: TrendingUp },
    { id: 'nav-vitrine', title: 'Studio Fiches Vitrine LED & Affiches', subtitle: 'Affiches vitrine A4/A3 haute définition', category: 'Outils', href: '/cockpit/fiches-vitrine', icon: Printer },
    { id: 'nav-redacteur', title: 'Rédacteur IA & Réseaux Sociaux', subtitle: 'Générateur d\'annonces et posts Instagram/Meta', category: 'Outils', href: '/cockpit/redacteur', icon: Sparkles },
    { id: 'nav-diffusion', title: 'Hub Multidiffusion (SeLoger, BienIci, LeBonCoin)', subtitle: 'Passerelles et flux d\'export', category: 'Outils', href: '/cockpit/diffusion', icon: Radio },
    { id: 'nav-pige', title: 'Radar Pige & Prospection PAP / LBC', subtitle: 'Détection vendeurs et sparring-partner d\'objections', category: 'Outils', href: '/cockpit/pige', icon: Radar },
    { id: 'nav-comptes-rendus', title: 'Comptes-Rendus Vendeurs', subtitle: 'Bilans de commercialisation et transmission WhatsApp', category: 'Outils', href: '/cockpit/comptes-rendus', icon: FileCheck2 },
    { id: 'nav-lab', title: 'Nell\'IA Infinite Lab (Idéation & Stratégies)', subtitle: 'Incubateur sans limites, négociations et clauses juridiques', category: 'Outils', href: '/cockpit/lab', icon: BrainCircuit },
    { id: 'nav-dgccrf', title: 'Registre Légal DGCCRF & Loi Hoguet', subtitle: 'Audit scellé SHA-256 et export officiel', category: 'Outils', href: '/cockpit/registre-dgccrf', icon: ShieldCheck },
    { id: 'nav-params', title: 'Paramètres & Connexions API', subtitle: 'Mentions légales, Meta API, Google et sauvegarde', category: 'Outils', href: '/cockpit/parametres', icon: Settings },
  ], []);

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
          href: `/cockpit/acquereurs`,
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
          href: `/cockpit`,
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

    return items;
  }, [search, properties, buyers, contactLeads, estimationLeads, staticNavigation]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  // Keyboard navigation within results
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

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setSearch('');
          setSelectedIndex(0);
          setIsOpen(true);
        }}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold transition"
        title="Recherche globale (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-gray-400">Recherche...</span>
        <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono text-gray-500">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#F3E8EE] overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDownInList}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-[#FCFAF7]">
          <Search className="w-5 h-5 text-[#E12B7B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un mandat, un acquéreur, une estimation, un outil..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-[11px] font-mono text-gray-600 transition"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-gray-50">
          {results.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs space-y-2">
              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-700">Aucun résultat pour &ldquo;{search}&rdquo;</p>
              <p className="text-[11px] text-gray-400">Essayez une référence (ex: NEL-2026-001), une ville ou le nom d&apos;un client.</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon || FileText;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id || item.href}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-[#FDF2F8] text-[#E12B7B]' : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-gray-100 text-gray-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{item.subtitle || item.category}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'translate-x-1 opacity-100 text-[#E12B7B]' : 'opacity-0'
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-[9px]">↑↓</kbd> Naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-[9px]">↵</kbd> Ouvrir
            </span>
          </div>
          <span>Cockpit Nell&apos;Immo</span>
        </div>

      </div>
    </div>
  );
}
