import React from 'react';
import { PublicNavbar } from '@/components/public/Navbar';
import { PublicFooter } from '@/components/public/Footer';
import { ScrollToTop } from '@/components/public/ScrollToTop';
import { ConciergeChat } from '@/components/public/concierge';
import { PublicNellimoProvider } from '@/lib/public-store';

export const metadata = {
  title: "Nell'Immo | Agence Immobilière de Référence à Pélissanne & Provence",
  description: "Découvrez nos villas d'exception, maisons de village et appartements à Pélissanne, Salon-de-Provence, Lambesc et alentours. Estimation immobilière certifiée DVF avec Nelly Fernandez.",
  keywords: 'immobilier pelissanne, agence immobiliere salon de provence, vente maison lambesc, villa avec piscine provence, avis de valeur dvf, nellimmo',
};

const realEstateAgentJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: "Nell'Immo",
  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  description: "Agence immobilière indépendante et humaine à Pélissanne et dans le Pays Salonais, dirigée par Nelly Fernandez.",
  founder: {
    '@type': 'Person',
    name: 'Nelly Fernandez',
    jobTitle: 'Fondatrice & Négociatrice Immobilière',
  },
  telephone: '+33755686109',
  email: 'nellimmo.acte@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '26 Avenue des Enjouvènes',
    addressLocality: 'Pélissanne',
    postalCode: '13330',
    addressRegion: 'Bouches-du-Rhône',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.6318,
    longitude: 5.1506,
  },
  url: 'https://nellimmo.fr',
  priceRange: '€€€',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: [
    'Pélissanne',
    'Salon-de-Provence',
    'Lambesc',
    'Aurons',
    'La Barben',
    'Lançon-Provence',
  ],
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicNellimoProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
        <PublicNavbar />
        <main className="flex-1">
          {children}
        </main>
        <PublicFooter />
        <ScrollToTop />
        <ConciergeChat />
      </div>
    </PublicNellimoProvider>
  );
}
