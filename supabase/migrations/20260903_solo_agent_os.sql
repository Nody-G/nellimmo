-- ============================================================================
-- NELL'IMMO COCKPIT - MIGRATION 20260903 : SOLO AGENT OPERATING SYSTEM
-- Ajout du Pipeline Transactionnel Notaire, Connexions Réseaux Sociaux & Google Hub
-- ============================================================================

-- 1. TABLE DU PIPELINE NOTARIAL & TRANSACTIONS (DOC 01)
CREATE TABLE IF NOT EXISTS transaction_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL,
    
    -- Statut du cycle de vente
    status VARCHAR(50) DEFAULT 'offre_acceptee' CHECK (status IN (
        'offre_acceptee', 
        'dossier_notaire_en_cours', 
        'compromis_signe', 
        'delai_sru_en_cours', 
        'sru_purgee', 
        'attente_pret', 
        'pret_accorde', 
        'acte_planifie', 
        'acte_signe', 
        'annule'
    )),
    
    -- Montants financiers (Loi ALUR & Loi Hoguet)
    offer_price_fai NUMERIC NOT NULL,
    offer_price_net NUMERIC NOT NULL,
    agency_fees_amount NUMERIC NOT NULL,
    deposit_amount NUMERIC DEFAULT 0,
    deposit_holder VARCHAR(100) DEFAULT 'Notaire Vendeur',
    
    -- Parties
    seller_name VARCHAR(255) NOT NULL,
    seller_phone VARCHAR(50) NOT NULL,
    seller_email VARCHAR(255),
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(50) NOT NULL,
    buyer_email VARCHAR(255),
    
    -- Études Notariales
    seller_notary_name VARCHAR(255) NOT NULL,
    seller_notary_email VARCHAR(255) NOT NULL,
    seller_notary_phone VARCHAR(50) NOT NULL,
    seller_notary_office VARCHAR(255) NOT NULL,
    
    buyer_notary_name VARCHAR(255),
    buyer_notary_email VARCHAR(255),
    buyer_notary_phone VARCHAR(50),
    buyer_notary_office VARCHAR(255),
    
    -- Calendrier légal & Jalons
    offer_date DATE NOT NULL,
    compromis_date DATE,
    sru_notification_date DATE,
    sru_expiry_date DATE, -- Notification + 10 jours
    loan_application_deadline DATE, -- Dépôt dossier J+30
    loan_approval_deadline DATE, -- Obtention prêt J+45 ou J+60
    final_deed_target_date DATE, -- Date prévisionnelle signature acte
    actual_closing_date DATE, -- Date réelle
    
    -- Financement
    loan_amount_requested NUMERIC,
    loan_interest_rate_max NUMERIC(4,2),
    loan_duration_years INT,
    loan_bank_name VARCHAR(255),
    broker_name VARCHAR(255),
    
    -- Checklist des pièces Loi ALUR & Diagnostics
    checklist_documents JSONB DEFAULT '{
        "titre_propriete": false,
        "taxe_fonciere": false,
        "dossier_diagnostics": false,
        "audit_energetique": false,
        "pre_etat_date": false,
        "reglement_copro": false,
        "cni_vendeur": false,
        "cni_acquereur": false,
        "justificatif_domicile": false,
        "simulation_pret": false,
        "offre_achat_signee": false
    }'::jsonb,
    
    -- Facturation Notaire (Loi Hoguet Art. 6)
    invoice_number VARCHAR(50),
    invoice_date DATE,
    invoice_sent_to_notary BOOLEAN DEFAULT false,
    fees_received BOOLEAN DEFAULT false,
    
    -- Google My Business Review Trigger
    google_review_requested BOOLEAN DEFAULT false,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transaction_deals_status ON transaction_deals(status);
CREATE INDEX IF NOT EXISTS idx_transaction_deals_property ON transaction_deals(property_id);
CREATE INDEX IF NOT EXISTS idx_transaction_deals_loan_deadline ON transaction_deals(loan_approval_deadline);

-- 2. ENRICHISSEMENT DE LA TABLE DES PARAMÈTRES (AGENCY_SETTINGS)
ALTER TABLE agency_settings 
    ADD COLUMN IF NOT EXISTS siren TEXT DEFAULT '853 807 006',
    ADD COLUMN IF NOT EXISTS rcs_city TEXT DEFAULT 'Salon-de-Provence',
    ADD COLUMN IF NOT EXISTS capital_social TEXT DEFAULT '2 000 €',
    ADD COLUMN IF NOT EXISTS cci_card_t TEXT DEFAULT 'CCI Marseille Provence',
    ADD COLUMN IF NOT EXISTS guarantee_fund_name TEXT DEFAULT 'GALIAN Assurances',
    ADD COLUMN IF NOT EXISTS guarantee_fund_amount TEXT DEFAULT '120 000 €',
    ADD COLUMN IF NOT EXISTS guarantee_fund_address TEXT DEFAULT '89 rue La Boétie, 75008 Paris',
    ADD COLUMN IF NOT EXISTS insurance_name TEXT DEFAULT 'MMA Entreprise',
    ADD COLUMN IF NOT EXISTS insurance_policy TEXT DEFAULT 'Police n° 114.240.230',
    ADD COLUMN IF NOT EXISTS mediator_name TEXT DEFAULT 'ANM Conso / Médiation FNAIM',
    ADD COLUMN IF NOT EXISTS mediator_url TEXT DEFAULT 'https://www.anm-conso.com',
    ADD COLUMN IF NOT EXISTS bareme_honoraires_url TEXT DEFAULT '/honoraires',
    ADD COLUMN IF NOT EXISTS agency_rib_iban TEXT DEFAULT 'FR76 3000 4000 5000 6000 7000 123',
    ADD COLUMN IF NOT EXISTS agency_rib_bic TEXT DEFAULT 'BNPAFRPP',
    
    -- Meta Graph API & LinkedIn
    ADD COLUMN IF NOT EXISTS meta_app_id TEXT,
    ADD COLUMN IF NOT EXISTS meta_app_secret TEXT,
    ADD COLUMN IF NOT EXISTS facebook_page_id TEXT DEFAULT 'nellimmo.immobilier',
    ADD COLUMN IF NOT EXISTS facebook_page_access_token TEXT,
    ADD COLUMN IF NOT EXISTS instagram_business_id TEXT DEFAULT 'nellimmo_provence',
    ADD COLUMN IF NOT EXISTS linkedin_client_id TEXT,
    ADD COLUMN IF NOT EXISTS linkedin_client_secret TEXT,
    ADD COLUMN IF NOT EXISTS social_autopost_new_mandate BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS social_autopost_price_drop BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS social_autopost_sold BOOLEAN DEFAULT true,
    
    -- Écosystème Google
    ADD COLUMN IF NOT EXISTS google_client_id TEXT,
    ADD COLUMN IF NOT EXISTS google_client_secret TEXT,
    ADD COLUMN IF NOT EXISTS google_calendar_id TEXT DEFAULT 'nellimmo.acte@gmail.com',
    ADD COLUMN IF NOT EXISTS google_maps_api_key TEXT,
    ADD COLUMN IF NOT EXISTS google_my_business_url TEXT DEFAULT 'https://g.page/r/nellimmo/review',
    ADD COLUMN IF NOT EXISTS google_drive_folder_id TEXT DEFAULT 'drive_nellimmo_mandates_2026',
    ADD COLUMN IF NOT EXISTS google_contacts_sync_enabled BOOLEAN DEFAULT true;

-- 3. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE transaction_deals ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Agents ont acces total aux transactions" ON transaction_deals;
    CREATE POLICY "Agents ont acces total aux transactions" ON transaction_deals FOR ALL TO authenticated USING (true);
END
$$;

-- 4. REALTIME NOTIFICATION POUR TRANSACTIONS
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE transaction_deals;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
