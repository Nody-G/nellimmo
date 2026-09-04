import React from 'react';

export interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}
