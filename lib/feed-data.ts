import { Property, AgencySettings } from './types';
import { isSupabaseConfigured, getSupabaseClient } from './supabase';

/**
 * Résolution honnête des données de multidiffusion portails.
 *
 * ⚠️ INTÉGRITÉ DES DONNÉES : les flux portails (Bien'ici, SeLoger/Poliris,
 * catalogue Meta) ne doivent JAMAIS être générés à partir des données de
 * démonstration (`INITIAL_PROPERTIES` / `DEFAULT_AGENCY_SETTINGS`) comme s'il
 * s'agissait de diffusion réelle. Si une URL de flux était branchée sur un
 * compte portail réel, elle ingérerait des annonces fictives — une faute
 * d'intégrité et de réputation grave.
 *
 * Les générateurs de flux nécessitent des champs "cockpit" complets
 * (`price_net_seller`, drapeaux `publish_*`, images) qui ne sont lisibles que
 * par une session `authenticated` propriétaire (RLS scoped). La clé anon
 * utilisée par les route handlers ne peut lire que la vue `public_properties`
 * (sans PII) qui ne contient PAS ces champs.
 *
 * Conséquence : tant que le backend Supabase n'est pas configuré avec une
 * session authentifiée capable de lire les données cockpit, ces endpoints
 * doivent échouer proprement (fail-closed) plutôt que de servir des données
 * de démonstration comme si elles étaient réelles.
 */

export interface FeedDataSource {
    /** true si des données réelles ont pu être chargées depuis Supabase. */
    live: boolean;
    /** true si Supabase est configuré mais qu'aucune donnée cockpit n'est lisible. */
    configuredButUnavailable: boolean;
    properties: Property[];
    settings: AgencySettings | null;
    reason?: string;
}

/**
 * Tente de charger les biens + paramètres réels depuis Supabase.
 *
 * Retourne `live: false` avec un motif explicite quand les données réelles ne
 * sont pas accessibles (backend non configuré, ou session non authentifiée).
 */
export async function resolveFeedData(): Promise<FeedDataSource> {
    if (!isSupabaseConfigured()) {
        return {
            live: false,
            configuredButUnavailable: false,
            properties: [],
            settings: null,
            reason:
                'Backend Supabase non configuré : les flux portails sont désactivés pour éviter de diffuser des annonces de démonstration. ' +
                'Configurez Supabase et connectez une session authentifiée pour activer la diffusion réelle.',
        };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
        return {
            live: false,
            configuredButUnavailable: true,
            properties: [],
            settings: null,
            reason: 'Client Supabase indisponible.',
        };
    }

    try {
        const [{ data: propsData, error: propsError }, { data: settingsData, error: settingsError }] =
            await Promise.all([
                supabase
                    .from('properties')
                    .select('*, images:property_images(*)')
                    .order('mandate_number', { ascending: false }),
                supabase.from('agency_settings').select('*').single(),
            ]);

        if (propsError || settingsError) {
            return {
                live: false,
                configuredButUnavailable: true,
                properties: [],
                settings: null,
                reason:
                    'Impossible de lire les données cockpit (session non authentifiée ou RLS). ' +
                    'Connectez-vous à Supabase pour activer la diffusion réelle des flux portails.',
            };
        }

        const properties = (propsData as Property[]) || [];
        const settings = (settingsData as AgencySettings) || null;

        if (properties.length === 0 || !settings) {
            return {
                live: true,
                configuredButUnavailable: false,
                properties,
                settings,
                reason: 'Aucune annonce active ou paramètres agence non renseignés.',
            };
        }

        return { live: true, configuredButUnavailable: false, properties, settings };
    } catch (err) {
        return {
            live: false,
            configuredButUnavailable: true,
            properties: [],
            settings: null,
            reason: err instanceof Error ? err.message : 'Erreur lors de la lecture des données Supabase.',
        };
    }
}
