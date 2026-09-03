import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROPERTIES, INITIAL_BUYERS, INITIAL_VISIT_SHEETS, INITIAL_TRANSACTIONS } from '@/lib/mock-data';
import { formatMandateRef } from '@/lib/hoguet';
import { getCalendarFeedToken, isValidFeedToken } from '@/lib/feed-tokens';

function formatIcalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcalText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  // Sécurité : le flux calendrier expose des données de visites (téléphones,
  // adresses). L'accès est strictement réservé aux détenteurs du token.
  if (!isValidFeedToken(token, getCalendarFeedToken())) {
    return new NextResponse('Accès non autorisé', { status: 401 });
  }

  const now = new Date();
  const dtstamp = formatIcalDate(now);

  const icalEvents: string[] = [];

  // 1. Export Visits
  INITIAL_VISIT_SHEETS.forEach((visit) => {
    const prop = INITIAL_PROPERTIES.find((p) => p.id === visit.property_id) || INITIAL_PROPERTIES[0];
    const buyer = INITIAL_BUYERS.find((b) => b.id === visit.buyer_id) || INITIAL_BUYERS[0];

    const startDate = visit.visit_date ? new Date(visit.visit_date) : new Date(now.getTime() + 24 * 3600 * 1000);
    const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 minutes

    const summary = `Visite Immo : ${prop.title} - ${buyer.first_name} ${buyer.last_name}`;
    const description = `Acquéreur : ${buyer.first_name} ${buyer.last_name}\\nTéléphone : ${buyer.phone}\\nFinancement : ${buyer.financing_status}\\nBudget : ${buyer.budget_max.toLocaleString('fr-FR')} €\\nBien : ${prop.title} (${formatMandateRef(prop.mandate_number)})\\nPrix FAI : ${prop.price_fai.toLocaleString('fr-FR')} €\\nNotes : ${visit.notes || 'Aucune'}`;
    const location = `${prop.address}, ${prop.postal_code} ${prop.city}`;

    icalEvents.push(`BEGIN:VEVENT
UID:visit-${visit.id}@nellimmo.fr
DTSTAMP:${dtstamp}
DTSTART:${formatIcalDate(startDate)}
DTEND:${formatIcalDate(endDate)}
SUMMARY:${escapeIcalText(summary)}
DESCRIPTION:${escapeIcalText(description)}
LOCATION:${escapeIcalText(location)}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT60M
ACTION:DISPLAY
DESCRIPTION:Rappel Visite Nell'Immo dans 1 heure
END:VALARM
END:VEVENT`);
  });

  // 2. Export Critical Transaction Deadlines (Prêt J+60, Délais SRU, Actes Authentiques)
  INITIAL_TRANSACTIONS.forEach((deal) => {
    const prop = INITIAL_PROPERTIES.find((p) => p.id === deal.property_id);
    const propTitle = prop ? prop.title : 'Bien en vente';

    // Jalon : Échéance Dépôt de Prêt
    if (deal.loan_application_deadline) {
      const targetDate = new Date(deal.loan_application_deadline);
      const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);
      icalEvents.push(`BEGIN:VEVENT
UID:deal-loan-app-${deal.id}@nellimmo.fr
DTSTAMP:${dtstamp}
DTSTART:${formatIcalDate(targetDate)}
DTEND:${formatIcalDate(endDate)}
SUMMARY:⚠️ Échéance Dépôt Dossier Prêt : ${deal.buyer_name} (${propTitle})
DESCRIPTION:Date butoir légale pour justificatif de dépôt de demande de prêt bancaire chez le notaire (${deal.seller_notary_name}).
STATUS:CONFIRMED
END:VEVENT`);
    }

    // Jalon : Obtention Accord de Prêt (J+60)
    if (deal.loan_approval_deadline) {
      const targetDate = new Date(deal.loan_approval_deadline);
      const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);
      icalEvents.push(`BEGIN:VEVENT
UID:deal-loan-appr-${deal.id}@nellimmo.fr
DTSTAMP:${dtstamp}
DTSTART:${formatIcalDate(targetDate)}
DTEND:${formatIcalDate(endDate)}
SUMMARY:🚨 Butoir Condition Suspensives Prêt : ${deal.buyer_name}
DESCRIPTION:Date limite d'obtention de l'offre de prêt. Relancer l'acquéreur ou la banque pour éviter la caducité du compromis.
STATUS:CONFIRMED
END:VEVENT`);
    }

    // Jalon : Signature Acte Authentique
    if (deal.final_deed_target_date) {
      const targetDate = new Date(deal.final_deed_target_date);
      const endDate = new Date(targetDate.getTime() + 2 * 3600 * 1000);
      icalEvents.push(`BEGIN:VEVENT
UID:deal-deed-${deal.id}@nellimmo.fr
DTSTAMP:${dtstamp}
DTSTART:${formatIcalDate(targetDate)}
DTEND:${formatIcalDate(endDate)}
SUMMARY:🏆 Signature Acte Authentique : ${propTitle}
DESCRIPTION:Rendez-vous de signature réitération notaire chez ${deal.seller_notary_name} (${deal.seller_notary_office}). Encaisser la note d'honoraires de ${deal.agency_fees_amount.toLocaleString('fr-FR')} €.
STATUS:CONFIRMED
END:VEVENT`);
    }
  });

  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nell\'Immo//Cockpit v2.0//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Nell\'Immo • Visites & Notaires',
    'X-WR-TIMEZONE:Europe/Paris',
    'X-WR-CALDESC:Flux de synchronisation des visites et jalons notariés pour smartphone',
    ...icalEvents,
    'END:VCALENDAR'
  ].join('\r\n');

  return new NextResponse(icalContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="nellimmo-agenda.ics"',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    },
  });
}
