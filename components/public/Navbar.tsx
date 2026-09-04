'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Compass, Home, Award, Calculator, Mail, Menu, X, Star, Heart } from 'lucide-react';
import { useFavorites } from '@/lib/useFavorites';
import { FavoritesDrawer } from '@/components/public/FavoritesDrawer';

export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/biens', label: 'Acquérir', icon: Compass },
    { href: '/estimation', label: 'Estimation Gratuite', icon: Calculator, highlight: true },
    { href: '/agence', label: "L'Agence de Nelly", icon: Award },
    { href: '/avis-clients', label: 'Avis Clients', icon: Star },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F3E8EE] transition-all">
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo Nell'Immo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Nell'Immo Agence Immobilière Pélissanne"
              width={665}
              height={182}
              className="h-12 w-auto object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tight text-[#131B26] group-hover:text-[#E12B7B] transition-colors">
                NELL&apos;IMMO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E12B7B] -mt-1">
                Actez vos projets sereinement
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E12B7B] text-white hover:bg-[#C71B62] shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${isActive
                      ? 'text-[#E12B7B] bg-[#FDF2F8]'
                      : 'text-gray-700 hover:text-[#E12B7B] hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  {link.label}
                </Link>
              );
            })}

            {/* Favorites Drawer Button */}
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="ml-2 p-2.5 rounded-full bg-gray-50 hover:bg-[#FDF2F8] text-gray-700 hover:text-[#E12B7B] border border-gray-200 hover:border-[#E12B7B]/30 transition relative group cursor-pointer"
              title="Voir mes favoris"
              aria-label="Favoris"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-[#E12B7B] text-[#E12B7B]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E12B7B] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:text-[#E12B7B] border border-gray-200 relative"
              aria-label="Favoris"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#E12B7B] text-[#E12B7B]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E12B7B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#E12B7B] hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F3E8EE] px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between ${link.highlight
                    ? 'bg-[#E12B7B] text-white font-bold'
                    : isActive
                      ? 'bg-[#FDF2F8] text-[#E12B7B]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
