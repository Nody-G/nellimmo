'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

export type ThemeId = 'signature' | 'notarial' | 'provence' | 'riviera' | 'minimal' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  darkColor: string;
  bgColor: string;
  badge?: string;
  description: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'signature',
    name: "Signature Nell'Immo",
    tagline: 'Rose Rubis & Or Luberon historique',
    primaryColor: '#E12B7B',
    accentColor: '#C59A45',
    darkColor: '#131B26',
    bgColor: '#FCFAF7',
    badge: 'Défaut',
    description: "L'identité fondatrice de l'agence Nell'Immo : rose rubis haute joaillerie, pierre du Luberon et ardoise provençale."
  },
  {
    id: 'notarial',
    name: 'Bleu Notarial & Or Prestige',
    tagline: 'Luxe institutionnel & solennité des actes',
    primaryColor: '#1E3A8A',
    accentColor: '#D4AF37',
    darkColor: '#0B132B',
    bgColor: '#F8FAFC',
    badge: 'Prestige',
    description: "Inspiré des offices notariaux et du protocole républicain : bleu marine royal, or impérial 24 carats et fond albâtre."
  },
  {
    id: 'provence',
    name: 'Terre de Provence & Oliviers',
    tagline: 'Tomette cuite, sauge & lin ensoleillé',
    primaryColor: '#C25E38',
    accentColor: '#D9822B',
    darkColor: '#1F1A16',
    bgColor: '#FAF7F2',
    badge: 'Authentique',
    description: "L'atmosphère chaleureuse des mas et bastides des Alpilles : tomette salonaise, sauge noble et fond lin chaud."
  },
  {
    id: 'riviera',
    name: 'Émeraude Riviera & Sable Fin',
    tagline: 'Villas d’exception & bord de mer azuréen',
    primaryColor: '#0F766E',
    accentColor: '#C7A75B',
    darkColor: '#062423',
    bgColor: '#FAF9F5',
    badge: 'Exclusif',
    description: "L'élégance balnéaire des propriétés d'exception : vert émeraude Riviera, pin maritime et or champagne."
  },
  {
    id: 'minimal',
    name: 'Graphite Platine & Tech Minimal',
    tagline: 'Épure contemporaine & précision Hektor',
    primaryColor: '#18181B',
    accentColor: '#2563EB',
    darkColor: '#09090B',
    bgColor: '#F8F9FA',
    badge: 'Moderne',
    description: "Clarté maximale et contraste chirurgical : carbone titane, cobalt haute fréquence et surface platine épurée."
  },
  {
    id: 'dark',
    name: 'Dark Ébène & Or Impérial',
    tagline: 'Cockpit nocturne velours sans fatigue oculaire',
    primaryColor: '#F43F85',
    accentColor: '#F59E0B',
    darkColor: '#0A0E15',
    bgColor: '#0F141C',
    badge: 'Mode Nuit',
    description: "Idéal pour travailler en soirée : fond ébène profond reposant, contrastes calibrés et touches rubis néon."
  }
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: ThemeConfig[];
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'signature',
  setTheme: () => {},
  themes: THEMES,
  currentTheme: THEMES[0]
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nellimo_theme') as ThemeId;
        if (saved && THEMES.some((t) => t.id === saved)) {
          return saved;
        }
      } catch {
        // Ignorer si storage restreint
      }
    }
    return 'signature';
  });
  const [, startTransition] = useTransition();

  // Synchronisation externe vers le DOM
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      // Ignorer si SSR
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeId) => {
    startTransition(() => {
      setThemeState(newTheme);
      try {
        localStorage.setItem('nellimo_theme', newTheme);
      } catch {
        // Ignorer si storage indisponible
      }
    });
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
