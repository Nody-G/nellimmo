import type { ContactItem, ContactRole } from './types';

export interface EmailComposeOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
}

/**
 * Construit l'URL officielle de composition de message dans Gmail Web.
 * Ouvre directement l'interface Gmail en ligne avec le destinataire, objet et corps pré-remplis.
 */
export function createGmailComposeUrl({ to, cc, bcc, subject, body }: EmailComposeOptions): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to || '',
  });

  if (cc) params.append('cc', cc);
  if (bcc) params.append('bcc', bcc);
  if (subject) params.append('su', subject);
  if (body) params.append('body', body);

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Construit un lien mailto: universel (client de messagerie par défaut du système).
 */
export function createMailtoUrl({ to, cc, bcc, subject, body }: EmailComposeOptions): string {
  const params = new URLSearchParams();
  if (cc) params.append('cc', cc);
  if (bcc) params.append('bcc', bcc);
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);

  const query = params.toString();
  return `mailto:${encodeURIComponent(to)}${query ? `?${query}` : ''}`;
}

/**
 * Modèle d'email professionnel immobilier.
 */
export interface EmailTemplate {
  id: string;
  role: ContactRole | 'tous';
  name: string;
  subject: string;
  body: string;
  description: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // NOTAIRES
  {
    id: 'notaire-demande-compromis',
    role: 'notaire',
    name: 'Demande de rédaction de compromis',
    subject: 'Dossier de vente — {property_title} — Demande de rédaction de compromis',
    description: 'Transmission des pièces ALUR et mandat pour la rédaction du compromis de vente.',
    body: `Maître, cher(ère) confrère,

Dans le cadre de la vente du bien situé au {property_address} ({property_title}), confié à notre agence {agency_name}, nous avons le plaisir de vous transmettre les éléments en vue de la rédaction du compromis de vente.

Les parties se sont accordées aux conditions suivantes :
- Vendeur : {seller_name}
- Acquéreur : {buyer_name}
- Prix de vente convenu : {property_price} € FAI (Honoraires d’agence inclus à la charge de l'acquéreur)
- Condition suspensive d'obtention de prêt : montant de {loan_amount} € sur {loan_duration} ans au taux max de {loan_rate} %.

Nous tenons à votre entière disposition l'ensemble des pièces du dossier ALUR (titre de propriété, DDT complet, taxe foncière, pré-état daté).

Pourriez-vous nous indiquer vos disponibilités prévisionnelles pour la signature ou nous confirmer la prise en charge du dossier ?

Restant à votre entière écoute,
Bien confraternellement,

{agent_name}
{agency_name} — {agency_phone}`,
  },
  {
    id: 'notaire-relance-pret',
    role: 'notaire',
    name: 'Suivi condition suspensive de prêt',
    subject: 'Suivi de dossier — {property_title} — Condition suspensive de financement',
    description: 'Point d’étape sur l’accord de prêt avant la date butoir fixée au compromis.',
    body: `Maître,

Je me permets de vous contacter au sujet du dossier de vente {property_title}, pour lequel la date butoir de la condition suspensive d’obtention de prêt approche.

Nous avons sollicité l'acquéreur ainsi que son courtier afin d'obtenir l'attestation de dépôt ou l'offre de prêt émise. Nous vous transmettrons l'accord dès réception.

Avez-vous de votre côté reçu un retour de l’organisme prêteur ou des éléments complémentaires ?

Bien à vous,

{agent_name}
{agency_name} — {agency_phone}`,
  },
  {
    id: 'notaire-convocation-acte',
    role: 'notaire',
    name: 'Demande de projet d’acte & décompte financier',
    subject: 'Dossier {property_title} — Projet d’acte authentique et décompte acquéreur',
    description: 'Demande du projet d’acte et décompte financier avant réitération par acte authentique.',
    body: `Maître,

En prévision de la signature de l'acte authentique de vente pour le bien situé {property_address}, fixée prochainement, pourriez-vous nous faire parvenir :

1. Le projet d'acte authentique pour relecture préalable avec nos clients.
2. Le décompte financier acquéreur (frais d'acte, solde du prix et honoraires d'agence) pour leur permettre d'effectuer le virement bancaire dans les délais requis.

Notre facture d'honoraires vous a été transmise pour règlement par la comptabilité de l'office le jour de la signature.

Dans l'attente de votre retour,
Bien dévoué(e),

{agent_name}
{agency_name}`,
  },

  // DIAGNOSTIQUEURS
  {
    id: 'diag-ordre-mission',
    role: 'diagnostiqueur',
    name: 'Ordre de mission diagnostics DDT complet',
    subject: 'Ordre de mission diagnostics complets — {property_title}',
    description: 'Demande d’intervention pour la réalisation du dossier de diagnostics techniques (DPE, etc.).',
    body: `Bonjour,

Nous venons de rentrer un nouveau mandat de vente pour le bien suivant :
- Adresse : {property_address}
- Type de bien : {property_type}
- Propriétaire mandant : {seller_name} ({seller_phone})

Pourriez-vous intervenir pour la réalisation du dossier de diagnostic technique (DDT) comprenant :
- DPE avec rapport détaillé et audit énergétique si requis (classe F ou G)
- Amiante, Plomb, Gaz, Électricité
- Mesurage Loi Carrez / Surface habitable
- État des risques et pollutions (ERP) et Termites

Le propriétaire a été prévenu et attend votre appel pour convenir du rendez-vous d'accès au bien.

Merci de nous confirmer votre prise en charge et de nous adresser votre devis ou date d'intervention.

Cordialement,

{agent_name}
{agency_name} — {agency_phone}`,
  },

  // COURTIERS & BANQUES
  {
    id: 'courtier-attestation-faisabilite',
    role: 'courtier',
    name: 'Demande d’attestation de faisabilité financière',
    subject: 'Demande d’attestation de capacité financière — Dossier {buyer_name}',
    description: 'Vérification de la solvabilité de l’acquéreur avant validation d’offre.',
    body: `Bonjour,

Notre client {buyer_name} se positionne actuellement sur l’acquisition d’un bien sur notre secteur ({property_title}) pour un montant global de {property_price} € FAI.

Il nous a indiqué avoir confié l'étude de son plan de financement à votre cabinet. Afin de sécuriser son offre d’achat auprès de nos propriétaires vendeurs, pourriez-vous nous établir une attestation de confort financier / faisabilité budgétaire confirmant l’adéquation de son profil avec cette opération ?

Nous vous remercions pour votre réactivité habituelle sur ce dossier.

Bien cordialement,

{agent_name}
{agency_name} — {agency_phone}`,
  },

  // VENDEURS
  {
    id: 'vendeur-compte-rendu-visite',
    role: 'vendeur',
    name: 'Compte-rendu de visite personnalisé',
    subject: 'Compte-rendu de visite — Votre bien {property_title}',
    description: 'Synthèse d’une visite effectuée avec les remarques et l’intérêt des acquéreurs.',
    body: `Cher(ère) {contact_name},

Comme convenu, voici le retour détaillé de la visite effectuée aujourd'hui sur votre bien situé au {property_address} avec nos acquéreurs qualifiés.

Points très appréciés lors de la visite :
- La luminosité naturelle et la vue dégagée.
- La disposition des pièces et l'état général soigné.

Remarques et questions soulevées :
- Évaluation des travaux éventuels de personnalisation.
- Vérification de la compatibilité avec leur enveloppe budgétaire globale.

Nous restons en contact étroit avec ces visiteurs dans les prochaines 48 heures pour recueillir leur décision définitive. Je reste à votre entière disposition pour tout échange téléphonique.

Bien chaleureusement,

{agent_name}
{agency_name} — {agency_phone}`,
  },
  {
    id: 'vendeur-offre-achat',
    role: 'vendeur',
    name: 'Transmission d’une offre d’achat formelle',
    subject: 'Excellente nouvelle — Offre d’achat reçue pour {property_title}',
    description: 'Annonce et transmission d’une offre écrite d’achat.',
    body: `Cher(ère) {contact_name},

Nous avons le plaisir de vous informer qu'à la suite des visites menées par l'agence, nous venons de recevoir une offre d’achat écrite et formalisée pour votre bien {property_title}.

Montant de l'offre : {property_price} € FAI.
Le plan de financement a été préalablement vérifié et validé par notre partenaire courtier.

Je vous invite à me contacter sans attendre au {agency_phone} afin de passer en revue ensemble les termes de l'offre et les modalités de signature de l'acceptation.

Avec toute notre satisfaction,

{agent_name}
{agency_name}`,
  },

  // ACQUÉREURS
  {
    id: 'acquereur-nouveaute-exclu',
    role: 'acquereur',
    name: 'Nouveauté coup de cœur en avant-première',
    subject: 'Sélection coup de cœur pour votre recherche — {property_title}',
    description: 'Proposition d’un bien correspondant aux critères de recherche de l’acheteur.',
    body: `Bonjour {contact_name},

Dans le cadre de votre projet d'achat immobilier sur notre secteur, nous venons de rentrer en avant-première un nouveau bien qui correspond parfaitement à vos critères de recherche :

- {property_title}
- Localisation : {property_address}
- Prix de présentation : {property_price} € FAI

Ce bien dispose de tous les atouts que vous recherchez. Compte tenu de la forte attractivité du marché, nous vous proposons de convenir d'une visite prioritaire avant le lancement de la diffusion publique.

Indiquez-moi vos créneaux de disponibilité cette semaine afin que je vous organise un créneau exclusif.

À très bientôt,

{agent_name}
{agency_name} — {agency_phone}`,
  },
  {
    id: 'acquereur-confirmation-visite',
    role: 'acquereur',
    name: 'Confirmation de rendez-vous de visite',
    subject: 'Confirmation de visite — {property_title}',
    description: 'Confirmation d’un rendez-vous avec adresse exacte et coordonnées.',
    body: `Bonjour {contact_name},

Je vous confirme notre rendez-vous de visite fixé pour la découverte du bien suivant :
- Date et heure : {visit_datetime}
- Adresse du rendez-vous : {property_address}

Je vous attendrai sur place devant l'entrée principale. N'hésitez pas à me joindre directement au {agency_phone} si vous avez le moindre retard ou besoin d'indications d'accès.

Dans l'attente du plaisir de vous faire découvrir ce lieu,
Bien cordialement,

{agent_name}
{agency_name}`,
  },

  // ARTISANS & BTP
  {
    id: 'artisan-demande-devis',
    role: 'artisan',
    name: 'Demande de devis estimatif rénovation',
    subject: 'Demande de devis estimatif — Projet {property_title}',
    description: 'Demande de chiffrage de travaux pour accompagner un projet de vente ou d’achat.',
    body: `Bonjour {contact_name},

Dans le cadre de la mise en vente d’un bien sur notre secteur ({property_address}), nos clients acquéreurs souhaitent faire chiffrer des travaux d'aménagement :
- Nature des travaux : {renovation_details}
- Date limite de remise de prix souhaitée : sous 10 jours.

Seriez-vous disponible pour une visite technique sur place ? Les clés sont disponibles à l'agence {agency_name} pour faciliter votre passage à votre convenance.

Merci par avance pour votre disponibilité.

Bien cordialement,

{agent_name}
{agency_name} — {agency_phone}`,
  },
];

/**
 * Remplace les variables dans le texte du modèle.
 */
export function interpolateEmailTemplate(
  text: string,
  variables: Record<string, string | number | undefined | null>
): string {
  let result = text;
  for (const [key, val] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    const replacement = val !== undefined && val !== null ? String(val) : '';
    result = result.replaceAll(placeholder, replacement);
  }
  return result;
}

/**
 * Génère le contenu d'un fichier vCard 3.0 universel (RFC 2426).
 */
export function generateVCard(contact: ContactItem): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${contact.last_name};${contact.first_name};;;`,
    `FN:${contact.first_name} ${contact.last_name}`.trim(),
  ];

  if (contact.company) {
    lines.push(`ORG:${contact.company}`);
  }
  if (contact.specialty) {
    lines.push(`TITLE:${contact.specialty}`);
  }
  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${contact.email}`);
  }
  if (contact.secondary_email) {
    lines.push(`EMAIL;TYPE=INTERNET:${contact.secondary_email}`);
  }
  if (contact.phone) {
    lines.push(`TEL;TYPE=CELL,PREF:${contact.phone}`);
  }
  if (contact.secondary_phone) {
    lines.push(`TEL;TYPE=WORK:${contact.secondary_phone}`);
  }
  if (contact.address || contact.city || contact.postal_code) {
    const street = contact.address || '';
    const city = contact.city || '';
    const postal = contact.postal_code || '';
    lines.push(`ADR;TYPE=WORK:;;${street};${city};;${postal};France`);
  }
  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }
  if (contact.notes) {
    const cleanNote = contact.notes.replace(/\r?\n/g, '\\n');
    lines.push(`NOTE:${cleanNote}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Déclenche le téléchargement d'une vCard dans le navigateur.
 */
export function downloadVCard(contact: ContactItem): void {
  if (typeof window === 'undefined') return;
  const vcard = generateVCard(contact);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = `${contact.first_name}_${contact.last_name}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `contact_${safeName}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Exporte une liste de contacts au format CSV officiel Google Contacts.
 * Prêt pour l'import dans https://contacts.google.com
 */
export function exportGoogleContactsCsv(contacts: ContactItem[]): void {
  if (typeof window === 'undefined') return;

  const headers = [
    'Name',
    'Given Name',
    'Family Name',
    'E-mail 1 - Type',
    'E-mail 1 - Value',
    'Phone 1 - Type',
    'Phone 1 - Value',
    'Phone 2 - Type',
    'Phone 2 - Value',
    'Organization 1 - Name',
    'Organization 1 - Title',
    'Address 1 - Formatted',
    'Notes',
  ];

  const escapeCsv = (val?: string) => {
    if (!val) return '""';
    return `"${val.replace(/"/g, '""')}"`;
  };

  const rows = contacts.map((c) => {
    const fullName = `${c.first_name} ${c.last_name}`.trim();
    const formattedAddress = [c.address, c.postal_code, c.city].filter(Boolean).join(', ');
    return [
      escapeCsv(fullName),
      escapeCsv(c.first_name),
      escapeCsv(c.last_name),
      escapeCsv('Work'),
      escapeCsv(c.email),
      escapeCsv('Mobile'),
      escapeCsv(c.phone),
      escapeCsv('Work'),
      escapeCsv(c.secondary_phone),
      escapeCsv(c.company),
      escapeCsv(c.specialty),
      escapeCsv(formattedAddress),
      escapeCsv(c.notes),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `google_contacts_nellimmo_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Parseur de fichier CSV simple ou Google Contacts.
 */
export function parseContactsCsv(csvText: string): Partial<ContactItem>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

  const nameIdx = headers.findIndex((h) => h.includes('name') && !h.includes('given') && !h.includes('family'));
  const givenIdx = headers.findIndex((h) => h.includes('given') || h.includes('prenom') || h.includes('prénom'));
  const familyIdx = headers.findIndex((h) => h.includes('family') || h.includes('nom'));
  const emailIdx = headers.findIndex((h) => h.includes('e-mail 1 - value') || h.includes('email') || h.includes('courriel'));
  const phoneIdx = headers.findIndex((h) => h.includes('phone 1 - value') || h.includes('phone') || h.includes('telephone') || h.includes('téléphone'));
  const orgIdx = headers.findIndex((h) => h.includes('organization 1 - name') || h.includes('société') || h.includes('entreprise'));
  const titleIdx = headers.findIndex((h) => h.includes('organization 1 - title') || h.includes('titre') || h.includes('poste') || h.includes('rôle'));
  const addressIdx = headers.findIndex((h) => h.includes('address') || h.includes('adresse'));
  const notesIdx = headers.findIndex((h) => h.includes('notes') || h.includes('remarques'));

  const parsed: Partial<ContactItem>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Regex pour découper les CSV avec guillemets
    const matches = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
    const cleanCells = matches.map((c) => c.replace(/^["']|["']$/g, '').trim());

    let firstName = givenIdx >= 0 ? cleanCells[givenIdx] : '';
    let lastName = familyIdx >= 0 ? cleanCells[familyIdx] : '';
    const email = emailIdx >= 0 ? cleanCells[emailIdx] : '';
    const phone = phoneIdx >= 0 ? cleanCells[phoneIdx] : '';
    const company = orgIdx >= 0 ? cleanCells[orgIdx] : '';
    const specialty = titleIdx >= 0 ? cleanCells[titleIdx] : '';
    const address = addressIdx >= 0 ? cleanCells[addressIdx] : '';
    const notes = notesIdx >= 0 ? cleanCells[notesIdx] : '';

    if (!firstName && !lastName && nameIdx >= 0 && cleanCells[nameIdx]) {
      const parts = cleanCells[nameIdx].split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    if (firstName || lastName || email || phone) {
      parsed.push({
        first_name: firstName || 'Contact',
        last_name: lastName || '',
        email: email || '',
        phone: phone || '',
        company,
        specialty,
        address,
        notes,
        role: 'autre',
        status: 'actif',
      });
    }
  }

  return parsed;
}
