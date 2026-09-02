'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#131B26] text-white border-t border-gray-800">
      
      {/* Upper Footer with Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-2">
            <span className="text-[#C59A45] font-serif font-bold text-base block">20 Ans d&apos;Expertise</span>
            <p className="text-xs text-gray-400">
              Une connaissance intime du marché immobilier de Pélissanne, Salon-de-Provence et du Pays Salonais.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[#C59A45] font-serif font-bold text-base block">Avis 98% Satisfaits</span>
            <p className="text-xs text-gray-400">
              Contrôlés et certifiés conformes ISO 20252 par Opinion System, organisme indépendant.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[#C59A45] font-serif font-bold text-base block">Honoraires Compétitifs</span>
            <p className="text-xs text-gray-400">
              Barème transparent Loi ALUR sans intermédiaire ni frais superflus.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[#C59A45] font-serif font-bold text-base block">Accompagnement Sur-Mesure</span>
            <p className="text-xs text-gray-400">
              Nelly Fernandez suit personnellement chaque vente de l&apos;estimation à l&apos;acte notarié.
            </p>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 : Agency presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://nellimmo.staticlbi.com/original/images/logoSite.png"
                alt="Nell'Immo"
                className="h-10 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-serif font-black text-2xl text-white tracking-tight">
                  NELL&apos;IMMO
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E12B7B] -mt-1">
                  Actez vos projets sereinement
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Agence immobilière indépendante à Pélissanne dirigée par Nelly Fernandez. Parce qu&apos;un projet immobilier est souvent le projet de toute une vie, nous vous accompagnons dans la concrétisation de tous vos projets en Pays Salonais.
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span>26 Avenue des Enjouvènes, 13330 Pélissanne</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E12B7B] shrink-0" />
                <a href="tel:0755686109" className="hover:text-white font-semibold">
                  07 55 68 61 09
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E12B7B] shrink-0" />
                <a href="mailto:nellimmo.acte@gmail.com" className="hover:text-white">
                  nellimmo.acte@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E12B7B] shrink-0" />
                <span>Du Lundi au Vendredi : 08h00 - 18h00</span>
              </div>
            </div>
          </div>

          {/* Col 2 : Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C59A45]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">Accueil</Link>
              </li>
              <li>
                <Link href="/biens" className="hover:text-white transition">Acquérir un bien</Link>
              </li>
              <li>
                <Link href="/estimation" className="hover:text-white transition">Estimation gratuite</Link>
              </li>
              <li>
                <Link href="/agence" className="hover:text-white transition">L&apos;agence de Nelly</Link>
              </li>
              <li>
                <Link href="/avis-clients" className="hover:text-white transition">Avis clients vérifiés</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Secteurs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C59A45]">
              Secteurs Clés
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/biens?ville=Pelissanne" className="hover:text-white transition">Immobilier Pélissanne</Link>
              </li>
              <li>
                <Link href="/biens?ville=Salon-de-Provence" className="hover:text-white transition">Immobilier Salon-de-Provence</Link>
              </li>
              <li>
                <Link href="/biens?ville=Lambesc" className="hover:text-white transition">Immobilier Lambesc</Link>
              </li>
              <li>
                <Link href="/biens?ville=Aurons" className="hover:text-white transition">Immobilier Aurons / La Barben</Link>
              </li>
              <li>
                <Link href="/biens?ville=Grans" className="hover:text-white transition">Immobilier Grans / Lançon</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 : Espace Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C59A45]">
              Espace Admin
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Accès sécurisé à la suite de pilotage de l&apos;agence et au registre des mandats.
            </p>
            <div className="pt-2">
              <Link
                href="/cockpit"
                className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Accès Espace Admin</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-[#0E141D] py-6 px-4 text-xs text-gray-500 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px]">
          <div>
            © {new Date().getFullYear()} Nell&apos;Immo • Tous droits réservés. Carte Professionnelle CPI 1310 2019 000 042 974 (CCI Marseille Provence).
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <Link href="/agence" className="hover:text-white">Barème d&apos;honoraires</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white">Mentions légales & RGPD</Link>
            <span>•</span>
            <span className="text-gray-500">Conformité Loi Hoguet & Loi ALUR</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
