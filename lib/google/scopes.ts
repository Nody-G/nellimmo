/**
 * Catalogue des scopes Google OAuth par service.
 *
 * Demande **incrémentale** : on ne demande que les scopes des services
 * effectivement activés dans `google_services_enabled`, afin de limiter
 * l'écran de consentement et le risque de vérification Google.
 *
 * ⚠️ Ce module est isomorphe (client + serveur) : il ne contient que des
 * constantes, aucun secret.
 */

/** Clés de service supportées par le proxy Google. */
export type GoogleServiceKey =
    | 'calendar'
    | 'gmail'
    | 'drive'
    | 'contacts'
    | 'tasks'
    | 'reviews';

/** Métadonnées d'un service Google. */
export interface GoogleScopeMeta {
    key: GoogleServiceKey;
    label: string;
    description: string;
    /** Scopes OAuth requis (peut être vide pour les services sans OAuth). */
    scopes: string[];
    /** Scope sensible nécessitant une vérification Google au-delà du mode test. */
    sensitive: boolean;
    /** Nécessite une approbation d'API spécifique (Business Profile). */
    requiresApiApproval: boolean;
}

/** Identité de base — toujours demandée. */
export const IDENTITY_SCOPES = ['openid', 'email', 'profile'] as const;

export const GOOGLE_SCOPES: Record<GoogleServiceKey, GoogleScopeMeta> = {
    calendar: {
        key: 'calendar',
        label: 'Google Agenda',
        description: 'Créer et lire les rendez-vous (visites, notaire, estimations).',
        scopes: ['https://www.googleapis.com/auth/calendar'],
        sensitive: true,
        requiresApiApproval: false,
    },
    gmail: {
        key: 'gmail',
        label: 'Gmail',
        description: 'Envoyer les emails de relance et comptes-rendus depuis votre boîte.',
        scopes: [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.readonly',
        ],
        sensitive: true,
        requiresApiApproval: false,
    },
    drive: {
        key: 'drive',
        label: 'Google Drive',
        description: 'Créer les dossiers de mandat ALUR et archiver les pièces.',
        scopes: ['https://www.googleapis.com/auth/drive.file'],
        sensitive: true,
        requiresApiApproval: false,
    },
    contacts: {
        key: 'contacts',
        label: 'Google Contacts',
        description: 'Synchroniser vos contacts acquéreurs, vendeurs et partenaires.',
        scopes: ['https://www.googleapis.com/auth/contacts'],
        sensitive: true,
        requiresApiApproval: false,
    },
    tasks: {
        key: 'tasks',
        label: 'Google Tasks',
        description: 'Pousser vos relances dans votre liste de tâches Google.',
        scopes: ['https://www.googleapis.com/auth/tasks'],
        sensitive: true,
        requiresApiApproval: false,
    },
    reviews: {
        key: 'reviews',
        label: 'Avis Google (Business Profile)',
        description: 'Afficher vos avis Google réels dans le cockpit.',
        scopes: ['https://www.googleapis.com/auth/business.manage'],
        sensitive: true,
        requiresApiApproval: true,
    },
};

/** Tous les services dans un ordre d'affichage stable. */
export const GOOGLE_SERVICE_ORDER: GoogleServiceKey[] = [
    'calendar',
    'gmail',
    'drive',
    'contacts',
    'tasks',
    'reviews',
];

/**
 * Construit la liste de scopes à demander pour un ensemble de services activés.
 * L'identité (`openid email profile`) est toujours incluse.
 */
export function buildScopesForServices(enabled: Partial<Record<GoogleServiceKey, boolean>>): string[] {
    const scopes = new Set<string>(IDENTITY_SCOPES);
    for (const key of GOOGLE_SERVICE_ORDER) {
        if (enabled[key]) {
            for (const scope of GOOGLE_SCOPES[key].scopes) scopes.add(scope);
        }
    }
    return Array.from(scopes);
}

/** Scopes par défaut recommandés pour la mise en service (les plus utiles). */
export function defaultServiceSelection(): Record<GoogleServiceKey, boolean> {
    return {
        calendar: true,
        gmail: true,
        drive: true,
        contacts: false,
        tasks: false,
        reviews: false,
    };
}

/** Vérifie qu'un scope accordé couvre bien un service donné. */
export function grantedScopesCoverService(grantedScopes: string, service: GoogleServiceKey): boolean {
    const granted = new Set(grantedScopes.split(/\s+/).filter(Boolean));
    return GOOGLE_SCOPES[service].scopes.every((s) => granted.has(s));
}
