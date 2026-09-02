import React from 'react';
import { PublicNavbar } from '@/components/public/Navbar';
import { PublicFooter } from '@/components/public/Footer';
import { ScrollToTop } from '@/components/public/ScrollToTop';

export const metadata = {
  title: "Nell'Immo | Agence Immobilière de Référence à Pélissanne & Provence",
  description: "Découvrez nos villas d'exception, maisons de village et appartements à Pélissanne, Salon-de-Provence, Lambesc et alentours. Estimation immobilière certifiée DVF avec Nelly Fernandez.",
  keywords: 'immobilier pelissanne, agence immobiliere salon de provence, vente maison lambesc, villa avec piscine provence, avis de valeur dvf, nellimmo',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
