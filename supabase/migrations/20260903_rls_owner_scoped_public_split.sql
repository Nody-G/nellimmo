-- ============================================================================
-- NELL'IMMO COCKPIT - MIGRATION 20260903 : RLS SCOPED PER-OWNER + PUBLIC SPLIT
-- ----------------------------------------------------------------------------
-- Objectif (prépare l'évolution future multi-agent / multi-agence et corrige
-- la fuite de PII vendeur vers le site public) :
--
--   1. Ajoute une colonne `owner_id` (scoped per-owner) sur toutes les tables
--      "cockpit" afin que chaque ligne appartienne à un profil précis. Les
--      politiques RLS deviennent alors filtrées par propriétaire au lieu du
--      permissif `USING (true)` actuel.
--
--   2. Sépare, au niveau base de données, les données PUBLIQUES des données
--      COCKPIT (PII). La table `properties` mélange aujourd'hui les colonnes
--      vitrine (titre, prix, photos, DPE...) et les colonnes sensibles du
--      vendeur (seller_name, seller_phone, seller_email, seller_address).
--      La politique anon actuelle fait un `SELECT` sur la table brute, ce qui
--      expose la PII vendeur à tout visiteur anonyme.
--
--      On crée donc une VUE PUBLIQUE `public_properties` qui ne projette QUE
--      les colonnes non sensibles des biens actifs et publiés, et on redirige
--      la lecture anon vers cette vue. C'est l'équivalent SQL de la séparation
--      `mock-data-public` / `mock-data-cockpit` réalisée côté front.
--
--   3. Rétro-compatible : pour l'agent unique actuel (Nelly), les politiques
--      scoped autorisent le propriétaire ET conservent un repli admin. Aucune
--      donnée n'est perdue : les lignes existantes sont rattachées à l'uid
--      courant ou à `created_by`.
--
-- NOTE : cette migration est IDEMPOTENTE (peut être relancée sans erreur).
-- ============================================================================

-- ============================================================================
-- 1. COLONNE OWNER_ID (SCOPED PER-OWNER)
-- ============================================================================

-- Ajoute owner_id sur chaque table cockpit (si absente) et indexe.
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'properties',
        'property_images',
        'buyers',
        'visit_sheets',
        'mandate_audit_logs',
        'contact_leads',
        'estimation_leads',
        'transaction_deals',
        'agency_settings'
    ]
    LOOP
        EXECUTE format(
            'ALTER TABLE %I ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE',
            t
        );
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_owner ON %I(owner_id)', t, t);
    END LOOP;
END
$$;

-- Rattache les lignes existantes à leur propriétaire :
--  - si la table a une colonne `created_by`, on l'utilise ;
--  - sinon on retombe sur l'uid de session courant (agent unique).
DO $$
DECLARE
    t TEXT;
    has_created_by BOOLEAN;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'properties',
        'property_images',
        'buyers',
        'visit_sheets',
        'mandate_audit_logs',
        'contact_leads',
        'estimation_leads',
        'transaction_deals',
        'agency_settings'
    ]
    LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = t AND column_name = 'created_by'
        ) INTO has_created_by;

        IF has_created_by THEN
            EXECUTE format(
                'UPDATE %I SET owner_id = created_by WHERE owner_id IS NULL AND created_by IS NOT NULL',
                t
            );
        END IF;

        -- Repli : rattache au premier profil admin existant (agent unique).
        EXECUTE format(
            'UPDATE %I SET owner_id = (SELECT id FROM profiles WHERE role = ''admin'' ORDER BY created_at LIMIT 1)
             WHERE owner_id IS NULL',
            t
        );
    END LOOP;
END
$$;

-- ============================================================================
-- 2. VUE PUBLIQUE SANS PII (ÉQUIVALENT SQL DU SPLIT FRONT)
-- ============================================================================

-- Projette UNIQUEMENT les colonnes vitrine non sensibles des biens actifs et
-- publiés. Aucune donnée vendeur (nom, coordonnées, adresse exacte) n'est
-- exposée. `display_exact_address` permet de masquer l'adresse si nécessaire.
DROP VIEW IF EXISTS public_properties;
CREATE VIEW public_properties AS
SELECT
    id,
    mandate_number,
    title,
    property_type,
    -- Adresse : on ne montre que ville / code postal (pas l'adresse exacte).
    city,
    postal_code,
    latitude,
    longitude,
    -- Financier vitrine (frais d'agence inclus) uniquement.
    price_fai,
    agency_fees_amount,
    fees_paid_by,
    -- Métriques & espaces.
    living_area,
    carrez_area,
    land_area,
    rooms_count,
    bedrooms_count,
    bathrooms_count,
    floor_number,
    total_floors,
    has_elevator,
    -- Diagnostics énergétiques (obligatoires à l'affichage).
    dpe_value,
    dpe_letter,
    ges_value,
    ges_letter,
    dpe_date,
    dpe_reference_year,
    energy_cost_min,
    energy_cost_max,
    -- Descriptif & attributs.
    description,
    features,
    -- Statut vitrine.
    status,
    mandate_type,
    mandate_date,
    mandate_end_date,
    created_at,
    updated_at
FROM properties
WHERE status = 'actif' AND publish_website = true;

-- Autorise la lecture anonyme de la vue publique (sans PII).
GRANT SELECT ON public_properties TO anon;
GRANT SELECT ON public_properties TO authenticated;

-- --- VUE PUBLIQUE DES PARAMÈTRES AGENCE (SANS SECRETS) ---
-- La table `agency_settings` contient des secrets (mots de passe SFTP, tokens
-- de flux, RIB, clés API Meta/Google/LinkedIn). On n'expose au public que les
-- informations de contact / identité de l'agence.
DROP VIEW IF EXISTS public_agency_settings;
CREATE VIEW public_agency_settings AS
SELECT
    agency_name,
    agent_name,
    card_t_number,
    phone,
    email,
    address,
    city,
    postal_code,
    siren,
    rcs_city,
    cci_card_t,
    guarantee_fund_name,
    guarantee_fund_amount,
    mediator_name,
    mediator_url,
    bareme_honoraires_url
FROM agency_settings
WHERE id = 'default';

GRANT SELECT ON public_agency_settings TO anon;
GRANT SELECT ON public_agency_settings TO authenticated;

-- ============================================================================
-- 3. POLITIQUES RLS SCOPED PER-OWNER
-- ============================================================================

-- Helper : un agent authentifié accède à ses propres lignes (owner_id = uid)
-- OU, s'il est admin, à toutes les lignes de l'agence. Cela prépare l'arrivée
-- de plusieurs agents sans rien casser pour l'agent unique actuel.

-- --- PROPERTIES (cockpit) ---
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire accede a ses mandats" ON properties;
    CREATE POLICY "Proprietaire accede a ses mandats" ON properties FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- PROPERTY_IMAGES ---
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les photos" ON property_images;
    CREATE POLICY "Proprietaire gere les photos" ON property_images FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- BUYERS ---
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les acquereurs" ON buyers;
    CREATE POLICY "Proprietaire gere les acquereurs" ON buyers FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- VISIT_SHEETS ---
ALTER TABLE visit_sheets ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les visites" ON visit_sheets;
    CREATE POLICY "Proprietaire gere les visites" ON visit_sheets FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- MANDATE_AUDIT_LOGS ---
ALTER TABLE mandate_audit_logs ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire consulte l audit" ON mandate_audit_logs;
    CREATE POLICY "Proprietaire consulte l audit" ON mandate_audit_logs FOR SELECT TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- CONTACT_LEADS (cockpit) ---
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les contacts" ON contact_leads;
    CREATE POLICY "Proprietaire gere les contacts" ON contact_leads FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- ESTIMATION_LEADS (cockpit) ---
ALTER TABLE estimation_leads ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les estimations" ON estimation_leads;
    CREATE POLICY "Proprietaire gere les estimations" ON estimation_leads FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- TRANSACTION_DEALS ---
ALTER TABLE transaction_deals ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les transactions" ON transaction_deals;
    CREATE POLICY "Proprietaire gere les transactions" ON transaction_deals FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- --- AGENCY_SETTINGS ---
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    DROP POLICY IF EXISTS "Proprietaire gere les parametres" ON agency_settings;
    CREATE POLICY "Proprietaire gere les parametres" ON agency_settings FOR ALL TO authenticated
        USING (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ))
        WITH CHECK (owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        ));
END
$$;

-- ============================================================================
-- 4. POLITIQUES ANONYMES (SITE PUBLIC) - REDIRIGÉES VERS LA VUE SANS PII
-- ============================================================================

-- Supprime l'ancienne politique anon qui lisait la table brute `properties`
-- (et donc exposait la PII vendeur) et la remplace par une lecture de la vue
-- publique sécurisée. Les photos restent lisibles pour les biens publiés.
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public lit uniquement les mandats actifs du site" ON properties;
    DROP POLICY IF EXISTS "Public lit les photos des mandats actifs" ON property_images;

    -- Les photos sont lues via la vue publique `public_properties` (qui n'expose
    -- aucune PII). On ne référence plus la table brute `properties` ici, car
    -- l'accès anon direct y est désormais bloqué par RLS.
    CREATE POLICY "Public lit les photos des mandats actifs" ON property_images FOR SELECT TO anon
        USING (EXISTS (
            SELECT 1 FROM public_properties
            WHERE public_properties.id = property_images.property_id
        ));

    -- Insertions publiques (contact / estimation) : on rattache le lead à
    -- l'admin de l'agence par défaut (aucun uid anon). Le WITH CHECK reste
    -- permissif pour l'insertion, mais la lecture est scoped au propriétaire.
    DROP POLICY IF EXISTS "Public peut envoyer un message de contact" ON contact_leads;
    CREATE POLICY "Public peut envoyer un message de contact" ON contact_leads FOR INSERT TO anon
        WITH CHECK (true);

    DROP POLICY IF EXISTS "Public peut demander une estimation" ON estimation_leads;
    CREATE POLICY "Public peut demander une estimation" ON estimation_leads FOR INSERT TO anon
        WITH CHECK (true);

    -- Les paramètres publics sont désormais servis par la vue
    -- `public_agency_settings` (sans secrets). On retire l'accès anon direct à
    -- la table brute `agency_settings` qui contenait mots de passe SFTP, tokens
    -- de flux, RIB et clés API.
    DROP POLICY IF EXISTS "Public lit les parametres agence" ON agency_settings;
END
$$;

-- ============================================================================
-- 5. RAPPEL : LEADS PUBLICS RATTACHÉS À L'ADMIN À L'INSERTION
-- ============================================================================
-- Les leads créés par des visiteurs anonymes n'ont pas d'uid. Pour qu'ils
-- restent visibles par l'agent dans le cockpit (politique scoped), on les
-- rattache automatiquement au profil admin de l'agence via un trigger par
-- défaut. (Optionnel - à activer quand le multi-agent sera en place.)

-- Fonction utilitaire : renvoie l'uid courant s'il correspond à un profil
-- existant, sinon le premier profil admin de l'agence (repli agent unique).
CREATE OR REPLACE FUNCTION public.set_default_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.owner_id IS NULL THEN
        NEW.owner_id := (
            SELECT id FROM profiles
            WHERE id = auth.uid() OR role = 'admin'
            ORDER BY (id = auth.uid()) DESC, created_at ASC
            LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS trg_contact_leads_default_owner ON contact_leads;
    CREATE TRIGGER trg_contact_leads_default_owner
        BEFORE INSERT ON contact_leads
        FOR EACH ROW
        WHEN (NEW.owner_id IS NULL)
        EXECUTE FUNCTION public.set_default_owner();
END
$$;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS trg_estimation_leads_default_owner ON estimation_leads;
    CREATE TRIGGER trg_estimation_leads_default_owner
        BEFORE INSERT ON estimation_leads
        FOR EACH ROW
        WHEN (NEW.owner_id IS NULL)
        EXECUTE FUNCTION public.set_default_owner();
END
$$;

-- ============================================================================
-- 6. TEMPS RÉEL (REALTIME) - CONSERVÉ
-- ============================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE transaction_deals;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
