export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionLink?: {
    href: string;
    label: string;
  };
}

export interface QuickPrompt {
  id: string;
  label: string;
  text: string;
}

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-welcome',
    sender: 'assistant',
    text: "Bonjour et bienvenue chez Nell'Immo ! Je suis l'assistante virtuelle de Nelly Fernandez. Comment puis-je vous accompagner aujourd'hui dans votre projet immobilier ?",
    timestamp: 'À l’instant',
  },
];

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'p-villas',
    label: '🏡 Biens en vente',
    text: 'Quels biens d’exception avez-vous actuellement à la vente sur Pélissanne et alentours ?',
  },
  {
    id: 'p-estimation',
    label: '📊 Estimer mon bien',
    text: 'Je souhaite faire estimer ma maison à Pélissanne ou dans le Pays Salonais.',
  },
  {
    id: 'p-fees',
    label: '💰 Vos honoraires',
    text: 'Quel est votre barème d’honoraires et vos conditions de mandat ?',
  },
  {
    id: 'p-meeting',
    label: '📅 Contacter Nelly',
    text: 'Je souhaite échanger directement avec Nelly Fernandez ou convenir d’un rendez-vous.',
  },
];

/** Réponses intelligentes de l'assistante en mode local haute fidélité. */
export function getLocalConciergeAnswer(userText: string): { text: string; actionLink?: { href: string; label: string } } {
  const lower = userText.toLowerCase();

  if (lower.includes('estim') || lower.includes('valeur') || lower.includes('combien vaut')) {
    return {
      text: "Nous réalisons des avis de valeur précis et certifiés, croisant les transactions DVF des Notaires de France avec la réalité du marché local. Vous pouvez réaliser une première simulation en ligne en 2 minutes ou planifier une visite sur place avec Nelly.",
      actionLink: { href: '/estimation', label: 'Lancer mon estimation en ligne →' },
    };
  }

  if (lower.includes('bien') || lower.includes('villa') || lower.includes('maison') || lower.includes('achat') || lower.includes('vendre') || lower.includes('catalogue')) {
    return {
      text: "Nous proposons une sélection rigoureuse de villas avec piscine, maisons de village de charme et propriétés d'exception à Pélissanne, Salon-de-Provence, Lambesc et alentours.",
      actionLink: { href: '/biens', label: 'Découvrir nos biens disponibles →' },
    };
  }

  if (lower.includes('honoraire') || lower.includes('tarif') || lower.includes('bareme') || lower.includes('barème') || lower.includes('commission') || lower.includes('pourcentage')) {
    return {
      text: "Nos honoraires sont clairs, transparents et strictement encadrés (loi ALUR / DGCCRF). Ils sont calculés au pourcentage TTC du prix de vente FAI et consultables en toute liberté sur notre barème officiel.",
      actionLink: { href: '/agence#bareme', label: 'Consulter le barème officiel →' },
    };
  }

  if (lower.includes('rdv') || lower.includes('rendez-vous') || lower.includes('contacter') || lower.includes('telephone') || lower.includes('téléphone') || lower.includes('nelly') || lower.includes('adresse')) {
    return {
      text: "Nelly Fernandez est à votre écoute au 07 55 68 61 09 ou par message direct. Vous pouvez également nous laisser vos coordonnées ci-dessous pour être rappelé(e) sous 24h.",
      actionLink: { href: '/contact', label: 'Prendre contact avec Nelly →' },
    };
  }

  return {
    text: "C'est bien noté ! Pour vous apporter une réponse personnalisée et confidentielle, vous pouvez consulter notre catalogue, lancer une estimation gratuite ou laisser votre numéro pour que Nelly vous rappelle.",
    actionLink: { href: '/contact', label: 'Échanger avec Nelly Fernandez →' },
  };
}

/** Enregistre le prospect collecté dans les leads du Cockpit. */
export function saveConciergeLead(name: string, contact: string, message: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('nellimo_contact_leads_v4');
    const existing = raw ? JSON.parse(raw) : [];
    const isEmail = contact.includes('@');
    const newLead = {
      id: `lead-concierge-${Date.now()}`,
      name: name.trim() || 'Visiteur Site Web',
      email: isEmail ? contact.trim() : 'non-renseigne@client.fr',
      phone: !isEmail ? contact.trim() : '06 00 00 00 00',
      subject: 'Demande d’information via Concierge Virtuel IA',
      message: `${message}\n\n[Contact fourni : ${contact.trim()}]`,
      status: 'nouveau',
      created_at: new Date().toISOString(),
    };
    existing.unshift(newLead);
    localStorage.setItem('nellimo_contact_leads_v4', JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}
