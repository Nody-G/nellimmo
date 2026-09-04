import type {
    Property,
    VisitSheet,
    TransactionDeal,
    AgencyKey,
    AgencySignboard,
    EstimationLead,
    Buyer
} from '@/lib/types';

export type EventCategory = 'visite' | 'notaire' | 'estimation' | 'panneau_cle' | 'autre';

export interface AgendaEvent {
    id: string;
    title: string;
    category: EventCategory;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    durationMinutes: number;
    location: string;
    contactName: string;
    contactPhone: string;
    contactRole?: string;
    mandateNumber?: number;
    propertyId?: string;
    transactionId?: string;
    notes?: string;
    isUrgent?: boolean;
}

export interface WeekDay {
    date: Date;
    dateStr: string;
    dayName: string;
    dayNum: number;
}

export interface CategoryBadge {
    label: string;
    bg: string;
    icon: React.ReactNode;
}

export interface AgendaSourceData {
    properties: Property[];
    buyers: Buyer[];
    visits: VisitSheet[];
    transactions: TransactionDeal[];
    keys: AgencyKey[];
    signboards: AgencySignboard[];
    estimationLeads: EstimationLead[];
}

/**
 * Consolidates all store data (visits, transactions, keys, signboards,
 * estimation leads) plus custom events into a single sorted event list.
 */
export function buildAllEvents(
    customEvents: AgendaEvent[],
    data: AgendaSourceData
): AgendaEvent[] {
    const { properties, buyers, visits, transactions, keys, signboards, estimationLeads } = data;
    const list: AgendaEvent[] = [...customEvents];

    // A. Visits
    visits.forEach((v, idx) => {
        const prop = properties.find((p) => p.id === v.property_id);
        const buyer = buyers.find((b) => b.id === v.buyer_id);
        const vDate = v.visit_date ? v.visit_date.slice(0, 10) : new Date().toISOString().slice(0, 10);
        const vTime = v.visit_date && v.visit_date.includes('T')
            ? v.visit_date.slice(11, 16)
            : `1${4 + (idx % 4)}:00`;

        list.push({
            id: `event-visit-${v.id}`,
            title: `Visite : ${prop?.title || 'Bien immobilier'}`,
            category: 'visite',
            date: vDate,
            time: vTime,
            durationMinutes: 45,
            location: prop ? `${prop.address}, ${prop.postal_code} ${prop.city}` : 'Pélissanne',
            contactName: buyer ? `${buyer.first_name} ${buyer.last_name}` : 'Acquéreur intéressé',
            contactPhone: buyer?.phone || '06 00 00 00 00',
            contactRole: 'Acquéreur',
            mandateNumber: prop?.mandate_number,
            propertyId: prop?.id,
            notes: v.notes || 'Visite qualifiée avec bon de visite dématérialisé',
        });
    });

    // B. Transactions (Notary dates, SRU, Loan, Final deed)
    transactions.forEach((t) => {
        const prop = properties.find((p) => p.id === t.property_id);
        const location = prop ? `${prop.address}, ${prop.city}` : 'Étude Notariale';

        if (t.compromis_date) {
            list.push({
                id: `event-tx-comp-${t.id}`,
                title: `Signature Compromis : ${t.buyer_name} / ${t.seller_name}`,
                category: 'notaire',
                date: t.compromis_date.slice(0, 10),
                time: '10:00',
                durationMinutes: 90,
                location: `${t.seller_notary_office || 'Étude Notariale'}, ${t.seller_notary_name}`,
                contactName: t.seller_notary_name || 'Maître Notaire',
                contactPhone: t.seller_notary_phone || '04 90 00 00 00',
                contactRole: 'Notaire Vendeur',
                mandateNumber: prop?.mandate_number,
                propertyId: prop?.id,
                transactionId: t.id,
                notes: `Signature du compromis de vente avec dépôt séquestre (${t.deposit_amount?.toLocaleString('fr-FR')} €).`,
            });
        }

        if (t.sru_expiry_date) {
            list.push({
                id: `event-tx-sru-${t.id}`,
                title: `Fin de délai SRU 10j : ${t.buyer_name}`,
                category: 'notaire',
                date: t.sru_expiry_date.slice(0, 10),
                time: '18:00',
                durationMinutes: 15,
                location,
                contactName: t.buyer_name,
                contactPhone: t.buyer_phone,
                contactRole: 'Acquéreur sous compromis',
                mandateNumber: prop?.mandate_number,
                propertyId: prop?.id,
                transactionId: t.id,
                notes: 'Expiration légale du délai de rétractation SRU de 10 jours.',
                isUrgent: true,
            });
        }

        if (t.loan_approval_deadline) {
            list.push({
                id: `event-tx-loan-${t.id}`,
                title: `Échéance Prêt (J+60) : ${t.buyer_name}`,
                category: 'notaire',
                date: t.loan_approval_deadline.slice(0, 10),
                time: '12:00',
                durationMinutes: 30,
                location,
                contactName: t.buyer_name,
                contactPhone: t.buyer_phone,
                contactRole: 'Acquéreur (Condition Suspensive)',
                mandateNumber: prop?.mandate_number,
                propertyId: prop?.id,
                transactionId: t.id,
                notes: `Date limite d'obtention de l'offre de prêt bancaire (${t.loan_amount_requested?.toLocaleString('fr-FR') || '300 000'} €).`,
                isUrgent: true,
            });
        }

        if (t.final_deed_target_date) {
            list.push({
                id: `event-tx-deed-${t.id}`,
                title: `Acte Authentique Définitif : ${t.buyer_name}`,
                category: 'notaire',
                date: t.final_deed_target_date.slice(0, 10),
                time: '14:30',
                durationMinutes: 120,
                location: `${t.seller_notary_office || 'Étude Notariale'}, ${t.seller_notary_name}`,
                contactName: t.seller_notary_name,
                contactPhone: t.seller_notary_phone,
                contactRole: 'Notaire Instrumentaire',
                mandateNumber: prop?.mandate_number,
                propertyId: prop?.id,
                transactionId: t.id,
                notes: `Régularisation de la vente et encaissement des honoraires (${t.agency_fees_amount?.toLocaleString('fr-FR')} €).`,
            });
        }
    });

    // C. Keys borrowed
    keys.forEach((k) => {
        if (k.status === 'prete' && k.current_borrower) {
            const prop = properties.find((p) => p.id === k.property_id);
            const returnDate = k.current_borrower.expected_return_at.slice(0, 10);
            list.push({
                id: `event-key-${k.id}`,
                title: `Retour Trousseau Clés #${k.keyring_number}`,
                category: 'panneau_cle',
                date: returnDate,
                time: '17:00',
                durationMinutes: 15,
                location: 'Agence Nell\u2019Immo - Armoire A',
                contactName: k.current_borrower.borrower_name,
                contactPhone: k.current_borrower.borrower_phone,
                contactRole: k.current_borrower.borrower_role.toUpperCase(),
                mandateNumber: prop?.mandate_number,
                propertyId: prop?.id,
                notes: `Trousseau emprunté pour : ${k.current_borrower.purpose}`,
                isUrgent: true,
            });
        }
    });

    // D. Signboards to remove (Grenelle II 3 months limit)
    signboards.forEach((s) => {
        if (s.status === 'a_deposer' || (s.removal_deadline && s.status === 'pose')) {
            const prop = properties.find((p) => p.id === s.property_id);
            const deadline = s.removal_deadline?.slice(0, 10) || new Date().toISOString().slice(0, 10);
            list.push({
                id: `event-sign-${s.id}`,
                title: 'Dépose Panneau "VENDU" (Loi Grenelle II)',
                category: 'panneau_cle',
                date: deadline,
                time: '09:00',
                durationMinutes: 30,
                location: prop ? `${prop.address}, ${prop.city}` : (s.location_details || 'Pélissanne'),
                contactName: prop?.seller_name || 'Propriétaire',
                contactPhone: prop?.seller_phone || '06 00 00 00 00',
                contactRole: 'Lieu d\u2019implantation',
                mandateNumber: prop?.mandate_number,
                propertyId: prop?.id,
                notes: 'Dépose légale obligatoire dans les 3 mois sous peine d\u2019astreinte administrative.',
                isUrgent: true,
            });
        }
    });

    // E. Estimation leads
    estimationLeads.forEach((lead) => {
        if (lead.status === 'nouveau' || lead.status === 'en_cours') {
            const leadDate = lead.created_at.slice(0, 10);
            list.push({
                id: `event-lead-${lead.id}`,
                title: `RDV Estimation : ${lead.first_name} ${lead.last_name}`,
                category: 'estimation',
                date: leadDate,
                time: '11:00',
                durationMinutes: 60,
                location: `${lead.address || 'Adresse à confirmer'}, ${lead.city}`,
                contactName: `${lead.first_name} ${lead.last_name}`,
                contactPhone: lead.phone,
                contactRole: 'Propriétaire Vendeur Prospect',
                notes: `Projet de vente : ${lead.property_type} de ${lead.living_area} m². Estimation DVF à présenter.`,
            });
        }
    });

    return list.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}:00`).getTime();
        const dateB = new Date(`${b.date}T${b.time}:00`).getTime();
        return dateA - dateB;
    });
}

/** Filters events by category. */
export function filterEventsByCategory(events: AgendaEvent[], categoryFilter: string): AgendaEvent[] {
    return events.filter((ev) => {
        if (categoryFilter !== 'all' && ev.category !== categoryFilter) return false;
        return true;
    });
}

/** Computes the 7 days of the week (Mon-Sun) containing the given date. */
export function computeWeekDays(selectedDate: Date): WeekDay[] {
    const curr = new Date(selectedDate);
    const day = curr.getDay(); // 0 is Sun, 1 is Mon
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diffToMonday));

    const week: WeekDay[] = [];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(monday);
        nextDate.setDate(monday.getDate() + i);
        week.push({
            date: nextDate,
            dateStr: nextDate.toISOString().slice(0, 10),
            dayName: dayNames[i],
            dayNum: nextDate.getDate(),
        });
    }
    return week;
}

/** Builds the WhatsApp confirmation message for an event. */
export function buildWhatsAppMessage(event: AgendaEvent): string {
    const dateFormatted = new Date(`${event.date}T00:00:00`).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    if (event.category === 'visite') {
        const mapsLink = event.location
            ? `\n📍 Itinéraire GPS : https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
            : '';
        return `Bonjour ${event.contactName.split(' ')[0]}, c'est Nelly Fernandez de Nell'Immo. Je vous confirme notre visite prévue le ${dateFormatted} à ${event.time} au ${event.location}.${mapsLink}\nPensez à vous munir d'une pièce d'identité pour le bon de visite légal. Au plaisir de vous faire découvrir ce bien !`;
    }

    return `Bonjour ${event.contactName.split(' ')[0]}, c'est Nelly Fernandez de l'agence Nell'Immo. Je vous confirme notre rendez-vous du ${dateFormatted} à ${event.time} concernant ${event.title} (${event.location}). En cas de retard ou d'imprévu, n'hésitez pas à me joindre directement. Très bonne journée à vous.`;
}

/** Opens a WhatsApp chat with the event contact. */
export function openWhatsAppConfirmation(event: AgendaEvent): void {
    const message = buildWhatsAppMessage(event);
    const cleanPhone = event.contactPhone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
}

/** Generates and downloads an .ics calendar file (RFC 5545). */
export function downloadICalendar(events: AgendaEvent[]): void {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SASU NellImmo//Cockpit Agenda//FR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:NellImmo Agenda Professionnel',
        'X-WR-TIMEZONE:Europe/Paris',
    ];

    events.forEach((ev) => {
        const dtStart = ev.date.replace(/-/g, '') + 'T' + ev.time.replace(':', '') + '00';
        const startObj = new Date(`${ev.date}T${ev.time}:00`);
        const endObj = new Date(startObj.getTime() + ev.durationMinutes * 60 * 1000);
        const dtEnd =
            endObj.toISOString().slice(0, 10).replace(/-/g, '') +
            'T' +
            endObj.toTimeString().slice(0, 5).replace(':', '') +
            '00';

        icsContent.push(
            'BEGIN:VEVENT',
            `UID:${ev.id}@nellimmo.fr`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            `SUMMARY:${ev.title.replace(/[,;]/g, ' ')}`,
            `DESCRIPTION:${(ev.notes || '').replace(/[,;]/g, ' ')} - Contact: ${ev.contactName} (${ev.contactPhone})`,
            `LOCATION:${ev.location.replace(/[,;]/g, ' ')}`,
            'STATUS:CONFIRMED',
            'END:VEVENT'
        );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `agenda_nellimmo_${new Date().toISOString().slice(0, 10)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
