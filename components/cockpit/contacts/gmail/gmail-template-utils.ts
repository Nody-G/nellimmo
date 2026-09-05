import type { ContactItem, Property, AgencySettings } from '@/lib/types';
import { EMAIL_TEMPLATES, interpolateEmailTemplate } from '@/lib/gmail';

export function computeTemplateContent(
  tmplId: string,
  propId: string,
  contact: ContactItem | null,
  properties: Property[],
  settings: AgencySettings
) {
  const tmpl = EMAIL_TEMPLATES.find((t) => t.id === tmplId) || EMAIL_TEMPLATES[0];
  if (!tmpl) return { subject: '', body: '' };

  const prop = properties.find((p) => p.id === propId);
  const variables: Record<string, string | number> = {
    contact_name: contact
      ? `${contact.civility ? `${contact.civility} ` : ''}${contact.last_name || contact.first_name}`
      : 'Madame, Monsieur',
    property_title: prop?.title || 'Bien immobilier sous mandat',
    property_address: prop?.address ? `${prop.address}, ${prop.city}` : 'Pélissanne (13330)',
    property_price: prop ? prop.price_fai.toLocaleString('fr-FR') : '450 000',
    property_type: prop?.property_type || 'Maison individuelle',
    seller_name: prop?.seller_name || 'M. & Mme Vendeur',
    seller_phone: prop?.seller_phone || '06 00 00 00 00',
    buyer_name: 'Alexandre Moreau',
    loan_amount: '380 000',
    loan_duration: '20',
    loan_rate: '3.60',
    agency_name: settings.agency_name || "Nell'Immo",
    agent_name: settings.agent_name || 'Nelly',
    agency_phone: settings.phone || '06 12 34 56 78',
    visit_datetime: 'ce jeudi à 14h30',
    renovation_details: 'Rénovation peinture salon, mise aux normes tableau électrique',
  };

  return {
    subject: interpolateEmailTemplate(tmpl.subject, variables),
    body: interpolateEmailTemplate(tmpl.body, variables),
  };
}
