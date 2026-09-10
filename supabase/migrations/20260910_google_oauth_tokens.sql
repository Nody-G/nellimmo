-- ============================================================================
-- NELL'IMMO COCKPIT - MIGRATION 20260910 : GOOGLE OAUTH 2.0 TOKENS
-- Stockage chiffré des jetons OAuth Google + purge du client_secret hérité
-- ============================================================================

-- 1. TABLE DES JETONS OAUTH GOOGLE (chiffrés AES-256-GCM en colonne)
CREATE TABLE IF NOT EXISTS google_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    google_email TEXT NOT NULL,
    google_name TEXT,

    -- Jetons chiffrés AES-256-GCM (jamais en clair en base)
    access_token_enc TEXT NOT NULL,
    refresh_token_enc TEXT NOT NULL,
    token_iv TEXT NOT NULL,
    token_auth_tag TEXT NOT NULL,

    expiry TIMESTAMPTZ NOT NULL,
    scope TEXT NOT NULL,
    token_type TEXT NOT NULL DEFAULT 'Bearer',

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE (owner_id, google_email)
);

-- 2. INDEX (recherche du jeton actif par propriétaire)
CREATE INDEX IF NOT EXISTS idx_google_oauth_tokens_owner
    ON google_oauth_tokens(owner_id, updated_at DESC);

-- 3. ROW LEVEL SECURITY
ALTER TABLE google_oauth_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_own_google_tokens" ON google_oauth_tokens;
CREATE POLICY "owner_select_own_google_tokens" ON google_oauth_tokens
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_insert_own_google_tokens" ON google_oauth_tokens;
CREATE POLICY "owner_insert_own_google_tokens" ON google_oauth_tokens
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_update_own_google_tokens" ON google_oauth_tokens;
CREATE POLICY "owner_update_own_google_tokens" ON google_oauth_tokens
    FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_delete_own_google_tokens" ON google_oauth_tokens;
CREATE POLICY "owner_delete_own_google_tokens" ON google_oauth_tokens
    FOR DELETE USING (auth.uid() = owner_id);

-- 4. TRIGGER updated_at
CREATE OR REPLACE FUNCTION set_google_oauth_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_google_oauth_tokens_updated_at ON google_oauth_tokens;
CREATE TRIGGER trg_google_oauth_tokens_updated_at
    BEFORE UPDATE ON google_oauth_tokens
    FOR EACH ROW
    EXECUTE FUNCTION set_google_oauth_tokens_updated_at();

-- 5. PURGE DE SÉCURITÉ : le client_secret OAuth ne doit plus jamais être en base.
--    Il vit exclusivement côté serveur (process.env.GOOGLE_CLIENT_SECRET).
UPDATE agency_settings SET google_client_secret = NULL
    WHERE google_client_secret IS NOT NULL;

-- 6. COLONNE drive_folder_id sur properties (Lot 4 — arborescence Drive par mandat)
ALTER TABLE properties
    ADD COLUMN IF NOT EXISTS drive_folder_id TEXT;

-- 7. COLONNE google_resource_name sur les contacts (Lot 5 — dédup Google Contacts)
--    La table des contacts est stockée en JSONB dans agency_settings en mode local ;
--    côté Supabase, on ajoute la colonne si la table contacts existe.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'contacts'
    ) THEN
        ALTER TABLE contacts ADD COLUMN IF NOT EXISTS google_resource_name TEXT;
    END IF;
END $$;
