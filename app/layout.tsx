import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { NellimoProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Nell'Immo Immobilier — Pélissanne & Pays Salonais",
    template: "%s | Nell'Immo Immobilier",
  },
  description:
    "Agence immobilière indépendante à Pélissanne, Salon-de-Provence et Lambesc. Vente de villas, maisons de village et propriétés de prestige en Provence. Par Nelly Fernandez.",
  keywords: [
    'immobilier Pelissanne',
    'agence immobiliere Salon de Provence',
    'villa Lambesc',
    'maison a vendre Provence',
    'estimation immobiliere DVF',
    'Nelly Fernandez Nellimmo',
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FCFAF7] text-gray-900 selection:bg-[#E12B7B] selection:text-white">
        <NellimoProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </NellimoProvider>
      </body>
    </html>
  );
}

