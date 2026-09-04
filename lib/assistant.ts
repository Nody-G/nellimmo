'use client';

/**
 * Assistant IA conversationnel « Nelly » — moteur local de qualification des leads entrants.
 *
 * Ce module est PURE (aucun effet de bord, aucune dépendance React) : il est utilisé
 * à la fois par le composant chatbot (fallback local) et par l'endpoint API serveur
 * (fallback quand aucune clé DeepSeek n'est configurée).
 *
 * Objectif : aider Nelly à qualifier rapidement un lead entrant (demande de contact
 * ou d'estimation reçue via le site) en détectant l'intention, le budget, le délai,
 * la motivation, puis en proposant une réponse personnalisée à sa plume.
 */

export interface AssistantMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface LeadContext {
    /** Type de demande entrante. */
    kind: 'contact' | 'estimation' | 'prospection' | 'autre';
    /** Nom du prospect (si connu). */
    name?: string;
    /** Message brut du prospect. */
    message: string;
    /** Ville / secteur mentionné (optionnel). */
    city?: string;
    /** Type de bien mentionné (optionnel). */
    propertyType?: string;
}

export interface QualificationResult {
    /** Score de qualité du lead sur 100. */
    score: number;
    /** Niveau de qualification. */
    level: 'froid' | 'tiède' | 'chaud';
    /** Intention principale détectée. */
    intent: string;
    /** Budget estimé (texte libre, ex: "350 000 €"). */
    budget?: string;
    /** Délai estimé (texte libre, ex: "3-6 mois"). */
    timeline?: string;
    /** Éléments de motivation détectés. */
    motivations: string[];
    /** Points d'attention / objections à lever. */
    concerns: string[];
    /** Prochaine action recommandée. */
    nextAction: string;
    /** Réponse suggérée à la plume de Nelly. */
    suggestedReply: string;
    /** Source du résultat : moteur local ou IA. */
    source: 'local' | 'deepseek';
}

/* ------------------------------------------------------------------ */
/* Détection d'intention & d'éléments clés (heuristiques locales)      */
/* ------------------------------------------------------------------ */

const INTENT_RULES: { intent: string; keywords: string[] }[] = [
    { intent: 'Vente de mon bien', keywords: ['vendre', 'vente', 'estimation', 'combien vaut', 'mettre en vente', 'céd', 'vendre ma maison', 'vendre mon appartement'] },
    { intent: 'Achat / recherche de bien', keywords: ['acheter', 'achat', 'recherche', 'recherchons', 'visiter', 'visite', 'coup de cœur', 'acquérir', 'projet d\'achat'] },
    { intent: 'Estimation gratuite', keywords: ['estimation', 'évaluation', 'combien vaut', 'prix de mon bien', 'faire estimer'] },
    { intent: 'Location', keywords: ['louer', 'location', 'locataire', 'bail'] },
    { intent: 'Investissement locatif', keywords: ['investir', 'investissement', 'rendement', 'locatif'] },
    { intent: 'Terrain', keywords: ['terrain', 'constructible'] },
];

const BUDGET_PATTERNS: { regex: RegExp; label: string }[] = [
    { regex: /(\d[\d\s.]{2,})\s*(?:k\s*€|keur|k€|mille euros)/i, label: 'budget_k' },
    { regex: /(\d[\d\s.]{2,})\s*(?:€|euros|eur)/i, label: 'budget_euro' },
    { regex: /(?:budget|jusqu\'?à|environ|autour de|max)\s*(\d[\d\s.]{2,})/i, label: 'budget_phrase' },
];

const TIMELINE_PATTERNS: { regex: RegExp; label: string }[] = [
    { regex: /(?:dès que possible|rapidement|au plus vite|urgent|immédiat)/i, label: 'immédiat' },
    { regex: /(?:dans\s+)?(\d+)\s*(?:mois|semaines)/i, label: 'délai' },
    { regex: /(?:cet été|avant l\'été|avant la fin de l\'année|d\'ici la fin)/i, label: 'saisonnier' },
    { regex: /(?:pas pressé|pas urgent|à terme|plus tard|dans quelques mois)/i, label: 'long terme' },
];

const MOTIVATION_KEYWORDS: { label: string; keywords: string[] }[] = [
    { label: 'Coup de cœur / émotion', keywords: ['coup de cœur', 'coup de coeur', 'adore', 'magnifique', 'rêve', 'lumière', 'jardin', 'piscine'] },
    { label: 'Projet familial', keywords: ['famille', 'enfants', 'agrandir', 'maison de famille'] },
    { label: 'Départ en retraite', keywords: ['retraite', 'retraité'] },
    { label: 'Mutation / déménagement', keywords: ['mutation', 'déménagement', 'déménage', 'travail', 'rapprocher'] },
    { label: 'Premier achat', keywords: ['premier achat', 'première acquisition', 'primo'] },
    { label: 'Investissement', keywords: ['investir', 'rendement', 'revenus'] },
];

const CONCERN_KEYWORDS: { label: string; keywords: string[] }[] = [
    { label: 'Financement à sécuriser', keywords: ['prêt', 'crédit', 'financement', 'banque', 'apport'] },
    { label: 'Bien à vendre avant', keywords: ['vendre d\'abord', 'vendre avant', 'vendre mon bien', 'dépend de la vente'] },
    { label: 'Délai contraint', keywords: ['urgence', 'rapidement', 'au plus vite'] },
    { label: 'Prix / négociation', keywords: ['prix', 'négocier', 'trop cher', 'budget serré'] },
];

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function detectIntent(message: string): string {
    const n = normalize(message);
    let best: { intent: string; count: number } | null = null;
    for (const rule of INTENT_RULES) {
        const count = rule.keywords.filter((k) => n.includes(normalize(k))).length;
        if (count > 0 && (!best || count > best.count)) {
            best = { intent: rule.intent, count };
        }
    }
    return best?.intent || 'Demande générale';
}

function extractBudget(message: string): string | undefined {
    const n = normalize(message);
    for (const p of BUDGET_PATTERNS) {
        const m = n.match(p.regex);
        if (m && m[1]) {
            const raw = m[1].replace(/[\s.]/g, '');
            const num = parseInt(raw, 10);
            if (!Number.isNaN(num)) {
                if (p.label === 'budget_k') return `${num} 000 €`;
                if (num < 1000) return `${num * 1000} €`;
                return `${num.toLocaleString('fr-FR')} €`;
            }
        }
    }
    return undefined;
}

function extractTimeline(message: string): string | undefined {
    const n = normalize(message);
    for (const p of TIMELINE_PATTERNS) {
        const m = n.match(p.regex);
        if (m) {
            if (p.label === 'immédiat') return 'Immédiat';
            if (p.label === 'saisonnier') return 'Saisonnier';
            if (p.label === 'long terme') return 'À terme (pas pressé)';
            if (p.label === 'délai' && m[1]) return `Sous ${m[1]} mois`;
        }
    }
    return undefined;
}

function collectMatches(message: string, rules: { label: string; keywords: string[] }[]): string[] {
    const n = normalize(message);
    return rules
        .filter((r) => r.keywords.some((k) => n.includes(normalize(k))))
        .map((r) => r.label);
}

/* ------------------------------------------------------------------ */
/* Moteur de qualification local                                       */
/* ------------------------------------------------------------------ */

function computeScore(ctx: LeadContext, intent: string, motivations: string[], concerns: string[]): number {
    let score = 30; // base neutre
    const msgLen = ctx.message.trim().length;

    // Un message détaillé et personnalisé est plus qualifié qu'un message générique.
    if (msgLen > 200) score += 20;
    else if (msgLen > 100) score += 12;
    else if (msgLen > 40) score += 5;

    // Une intention claire est un bon signal.
    if (intent !== 'Demande générale') score += 10;

    // Des motivations explicites renforcent la qualification.
    score += Math.min(motivations.length * 8, 20);

    // Un budget ou un délai précis est très qualifiant.
    if (ctx.message.match(/\d/)) score += 8;

    // Les points d'attention (financement, vente préalable) réduisent légèrement le score
    // mais restent des leads à traiter.
    score -= Math.min(concerns.length * 4, 12);

    return Math.max(0, Math.min(100, Math.round(score)));
}

function levelOf(score: number): QualificationResult['level'] {
    if (score >= 70) return 'chaud';
    if (score >= 45) return 'tiède';
    return 'froid';
}

function buildNextAction(intent: string, level: QualificationResult['level'], timeline?: string): string {
    if (level === 'chaud') {
        return timeline === 'Immédiat'
            ? 'Proposer un créneau de visite / appel sous 24h.'
            : 'Relancer sous 24-48h et proposer un rendez-vous de cadrage.';
    }
    if (level === 'tiède') {
        return 'Envoyer une réponse personnalisée puis planifier un rappel sous 3-5 jours.';
    }
    return 'Répondre courtoisement, qualifier davantage (budget, délai, secteur) avant de prioriser.';
}

function buildSuggestedReply(ctx: LeadContext, intent: string, motivations: string[], concerns: string[]): string {
    const name = ctx.name ? ` ${ctx.name.split(' ')[0]}` : '';
    const lines: string[] = [];

    lines.push(`Bonjour${name}, merci pour votre message et votre confiance.`);

    if (intent === 'Vente de mon bien' || intent === 'Estimation gratuite') {
        lines.push(
            `Je serais ravie de vous accompagner dans la vente de votre bien sur le secteur de ${ctx.city || 'Pélissanne / Pays Salonais'}.`
        );
        lines.push(
            'Je vous propose une estimation gratuite et sans engagement, basée sur les dernières ventes réelles (DVF) de votre quartier, ainsi qu\'un bilan complet de votre bien.'
        );
    } else if (intent === 'Achat / recherche de bien') {
        lines.push(
            `Je comprends parfaitement votre projet d'achat${ctx.propertyType ? ` (${ctx.propertyType})` : ''} sur ${ctx.city || 'le Pays Salonais'}.`
        );
        lines.push(
            'Je dispose d\'un portefeuille de biens en exclusivité et je peux vous proposer des visites ciblées selon vos critères.'
        );
    } else {
        lines.push('Je prends bonne note de votre demande et je reviens vers vous très rapidement pour en discuter.');
    }

    if (motivations.length > 0) {
        lines.push(`Je perçois bien votre motivation (${motivations.slice(0, 2).join(', ').toLowerCase()}), c'est essentiel pour bien vous accompagner.`);
    }
    if (concerns.some((c) => c.includes('Financement'))) {
        lines.push('Sachez que je travaille avec des partenaires bancaires locaux pour sécuriser votre financement.');
    }

    lines.push(
        'Afin de bien cerner votre projet, pourrions-nous convenir d\'un court échange téléphonique ? Je reste à votre entière disposition.'
    );
    lines.push('Bien chaleureusement, Nelly Fernandez — Nell\'Immo Immobilier, Pélissanne. Tél 07 55 68 61 09.');

    return lines.join('\n\n');
}

/* ------------------------------------------------------------------ */
/* API publique                                                        */
/* ------------------------------------------------------------------ */

/**
 * Qualifie un lead entrant avec le moteur local (fallback sans clé IA).
 * Retourne un résultat structuré + une réponse suggérée.
 */
export function qualifyLeadLocally(ctx: LeadContext): QualificationResult {
    const intent = detectIntent(ctx.message);
    const budget = extractBudget(ctx.message);
    const timeline = extractTimeline(ctx.message);
    const motivations = collectMatches(ctx.message, MOTIVATION_KEYWORDS);
    const concerns = collectMatches(ctx.message, CONCERN_KEYWORDS);
    const score = computeScore(ctx, intent, motivations, concerns);
    const level = levelOf(score);

    return {
        score,
        level,
        intent,
        budget,
        timeline,
        motivations,
        concerns,
        nextAction: buildNextAction(intent, level, timeline),
        suggestedReply: buildSuggestedReply(ctx, intent, motivations, concerns),
        source: 'local',
    };
}

/** Construit le prompt système pour l'IA (DeepSeek) à la plume de Nelly. */
export function buildAssistantSystemPrompt(): string {
    return `Tu es « Nelly », l'assistante conversationnelle de Nelly FERNANDEZ, Agent Immobilier Indépendant et Présidente de la SASU NELL'IMMO, basée à Pélissanne (13330) dans le Pays Salonais (Provence).

TON RÔLE : aider Nelly à qualifier les leads entrants (demandes reçues via le site : contacts, estimations, prospection) et à rédiger des réponses personnalisées à sa plume.

DIRECTIVES DE STYLE :
1. Ton chaleureux, bienveillant, enthousiaste et profondément humain, à l'image de Nelly.
2. RÈGLE STRICTE : Ne JAMAIS utiliser "négociatrice" ou "négociateur". Toujours "agent immobilier indépendant" ou "Présidente de la SASU NELL'IMMO".
3. Réponds en français, de façon concise et actionnable.
4. Quand on te donne un message de prospect, analyse-le et retourne UNIQUEMENT un objet JSON avec cette structure :
{
  "score": <0-100>,
  "level": "froid"|"tiède"|"chaud",
  "intent": "<intention principale>",
  "budget": "<budget estimé ou null>",
  "timeline": "<délai estimé ou null>",
  "motivations": ["<motivation 1>", ...],
  "concerns": ["<point d'attention 1>", ...],
  "nextAction": "<prochaine action recommandée>",
  "suggestedReply": "<réponse complète à la plume de Nelly, avec coordonnées : Tél 07 55 68 61 09 | nellimmo.acte@gmail.com | www.nellimmo.fr>"
}
5. Sois réaliste dans le score : un message détaillé, personnalisé, avec budget/délai/motivation est plus qualifié.
6. Ne renvoie QUE le JSON, sans texte autour.`;
}
