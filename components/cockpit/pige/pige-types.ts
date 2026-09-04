import type { ProspectingLead, ProspectingSource, ProspectingStatus } from '@/lib/types';

/** A single anti-objection script used by the sparring-partner panel. */
export interface ObjectionScript {
    id: string;
    title: string;
    angle: string;
    pitch: string;
    reframeQuestion: string;
}

/** All pre-written anti-objection telephone scripts. */
export const OBJECTION_SCRIPTS: ObjectionScript[] = [
    {
        id: 'no_agency',
        title: '« Je ne veux pas d\u2019agence, je vends très bien par moi-même. »',
        angle: 'Reconnaissance de son autonomie + Sécurité du filtrage acquéreurs',
        pitch: `« Je comprends tout à fait votre démarche, c'est légitime de vouloir tenter par soi-même. D'ailleurs, 70% des vendeurs commencent comme vous entre particuliers. Ma démarche aujourd'hui n'est pas de vous imposer un mandat classique, mais de vous apporter une sécurité : sur les 15 appels que vous allez recevoir, comment filtrez-vous les curieux du dimanche et les dossiers bancaires qui essuieront un refus de prêt dans 3 mois ? J'ai actuellement 2 acquéreurs solvables en portefeuille sur votre secteur. Seriez-vous d'accord pour qu'on en parle 5 minutes ? »`,
        reframeQuestion: '« Si je vous présente un acquéreur sérieux avec accord bancaire sans que cela ne vous coûte le moindre euro en amont, refusez-vous d\u2019étudier sa proposition ? »',
    },
    {
        id: 'too_expensive',
        title: '« Vos honoraires sont trop chers par rapport aux forfaits en ligne. »',
        angle: 'Défense du prix net vendeur & Négociation agressive subie sans intermédiaire',
        pitch: `« C'est une excellente remarque. Mais la vraie question n'est pas le coût de l'agence, c'est le montant net qui arrive sur votre compte chez le notaire. Un acheteur face à un particulier sait que vous n'avez pas de frais, et va négocier immédiatement 8 à 10% de plus. Mon rôle avec mon expertise notariale locale, c'est de sanctuariser votre prix et de valoriser chaque atout pour vous obtenir le prix le plus élevé possible, net vendeur. »`,
        reframeQuestion: '« Préférez-vous payer 0€ d\u2019agence et baisser votre maison de 30 000 €, ou confier la vente et encaisser 15 000 € de plus au final ? »',
    },
    {
        id: 'already_simple_mandates',
        title: '« J\u2019ai déjà 3 agences en mandat simple. »',
        angle: 'Effet vitrine dégradée + Baisse de valeur perçue',
        pitch: `« Je vois. Mais avez-vous remarqué que votre maison apparaît 3 fois sur SeLoger à des prix parfois différents ou avec des photos de qualités inégales ? Pour un acquéreur, un bien partout donne l'impression d'un bien qui ne se vend pas et qui peut être bradé. C'est l'exclusivité qui crée la rareté et le coup de cœur. Donnez-moi 30 jours d'exclusivité avec mon plan marketing renforcé (vidéo, multidiffusion premium) ; si ce n'est pas vendu, vous reprenez votre entière liberté. »`,
        reframeQuestion: '« En 3 semaines avec 3 agences, combien d\u2019offres fermes avez-vous reçues sur votre table ? »',
    },
    {
        id: 'test_price',
        title: '« J\u2019ai le temps, je teste le marché à ce prix élevé. »',
        angle: 'La brûlure de l\u2019annonce & La baisse de prix inévitable',
        pitch: `« Tester le marché est tentant, mais en immobilier, un bien n'a qu'une seule fois l'effet de nouveauté : les 21 premiers jours. Passé ce délai, les acheteurs se demandent quel est le problème caché avec la maison. Ensuite, on est contraint de baisser le prix plus bas que sa valeur réelle pour relancer l'intérêt. Regardons ensemble les ventes notariées DVF réelles de votre rue pour fixer le bon prix d'attaque dès le premier jour. »`,
        reframeQuestion: '« Préférez-vous vendre au vrai prix fort maintenant, ou devoir brader dans 6 mois après avoir usé le bien sur les portails ? »',
    },
];

/** Available source filter options. */
export const SOURCE_OPTIONS: { value: string; label: string }[] = [
    { value: 'leboncoin', label: 'LeBonCoin' },
    { value: 'pap', label: 'PAP' },
    { value: 'paruvendu', label: 'ParuVendu' },
    { value: 'boitage', label: 'Boîtage Terrain' },
    { value: 'porte_a_porte', label: 'Porte-à-porte Terrain' },
    { value: 'recommandation', label: 'Recommandation' },
];

/** Available status filter options. */
export const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'nouveau', label: 'Nouveau' },
    { value: 'a_rappeler', label: 'À rappeler' },
    { value: 'rdv_pris', label: 'RDV pris' },
    { value: 'mandat_obtenu', label: 'Mandat obtenu' },
    { value: 'refus_agent', label: 'Refus agent' },
    { value: 'deja_vendu', label: 'Déjà vendu' },
];

/** Computes default mandate start/end dates (ISO yyyy-mm-dd). */
export function computeDefaultMandateDates(durationDays = 90): { start: string; end: string } {
    const now = new Date();
    const start = now.toISOString().split('T')[0];
    const end = new Date(now.getTime() + durationDays * 86400000).toISOString().split('T')[0];
    return { start, end };
}

/** Filters the prospecting leads by source, status and free-text keyword. */
export function filterLeads(
    leads: ProspectingLead[],
    sourceFilter: string,
    statusFilter: string,
    keyword: string
): ProspectingLead[] {
    const kw = keyword.toLowerCase();
    return leads.filter((lead) => {
        const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesKeyword =
            lead.title.toLowerCase().includes(kw) ||
            lead.seller_name.toLowerCase().includes(kw) ||
            lead.city.toLowerCase().includes(kw) ||
            (lead.neighborhood ? lead.neighborhood.toLowerCase().includes(kw) : false) ||
            lead.seller_phone.includes(keyword);
        return matchesSource && matchesStatus && matchesKeyword;
    });
}

/** Computes the DVF benchmark gap for a lead (returns price m², benchmark, diff %). */
export function computeDvfGap(lead: ProspectingLead): { priceM2: number; benchmarkDvf: number; diffPct: number } {
    const priceM2 = Math.round(lead.price_asked / lead.living_area);
    // Benchmarks DVF Pélissanne ~3250 €/m², Salon ~3000 €/m², Lambesc ~3450 €/m²
    const benchmarkDvf = lead.city === 'Lambesc' ? 3450 : lead.city === 'Salon-de-Provence' ? 3000 : 3250;
    const diffPct = Math.round(((priceM2 - benchmarkDvf) / benchmarkDvf) * 100);
    return { priceM2, benchmarkDvf, diffPct };
}

/** Builds the WhatsApp outreach message for a lead. */
export function buildWhatsAppMessage(lead: ProspectingLead): string {
    return encodeURIComponent(
        `Bonjour ${lead.seller_name}, j'ai vu votre annonce pour votre bien à ${lead.city}. Je suis Nelly Fernandez, gérante de l'agence Nell'Immo à Pélissanne. Je ne vous démarche pas pour un mandat classique : j'ai actuellement 2 acquéreurs solvables en recherche active dont les critères correspondent à votre bien. Si vous êtes ouvert à une mise en relation qualifiée sans frais préalables, seriez-vous disponible pour un court échange téléphonique ? Belle journée !`
    );
}

/** Normalizes a French phone number to international WhatsApp format. */
export function cleanPhone(phone: string): string {
    return phone.replace(/\s+/g, '').replace(/^0/, '33');
}

/** Maps a status to its Tailwind badge classes. */
export function statusBadgeClass(status: ProspectingStatus): string {
    switch (status) {
        case 'mandat_obtenu':
            return 'bg-emerald-100 text-emerald-800';
        case 'rdv_pris':
            return 'bg-purple-100 text-purple-800';
        case 'a_rappeler':
            return 'bg-blue-100 text-blue-800';
        case 'refus_agent':
        case 'deja_vendu':
            return 'bg-gray-100 text-gray-500';
        default:
            return 'bg-amber-100 text-amber-800';
    }
}

/** Form state for creating a new prospecting lead. */
export interface NewLeadFormState {
    title: string;
    sellerName: string;
    phone: string;
    price: number;
    surface: number;
    city: string;
    neighborhood?: string;
    source: ProspectingSource;
    url: string;
    notes: string;
}

/** Default values for the new-lead form. */
export const DEFAULT_NEW_LEAD: NewLeadFormState = {
    title: '',
    sellerName: '',
    phone: '',
    price: 420000,
    surface: 120,
    city: 'Pélissanne',
    neighborhood: '',
    source: 'leboncoin',
    url: '',
    notes: '',
};
