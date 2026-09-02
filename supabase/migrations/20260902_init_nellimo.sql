-- ============================================================================
-- NELLIMO COCKPIT - SCHÉMA DE BASE DE DONNÉES POSTGRESQL / SUPABASE
-- Conforme Loi Hoguet (Décret 72-678), Loi ALUR, Loi Climat & Résilience
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLE DES PROFILS AGENTS
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    professional_card_number TEXT DEFAULT 'CPI 1310 2026 000 012 345', -- Carte T obligatoire
    role TEXT DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE DES MANDATS & BIENS (CONFORMITÉ LOI HOGUET & ALUR)
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Numérotation séquentielle Loi Hoguet (Inviolable)
    mandate_number SERIAL UNIQUE,
    mandate_type TEXT NOT NULL CHECK (mandate_type IN ('exclusif', 'simple', 'semi-exclusif')),
    mandate_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mandate_end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'actif' CHECK (status IN ('brouillon', 'actif', 'sous_compromis', 'vendu', 'archive', 'resilie')),

    -- Vendeur / Mandant principal
    seller_civility TEXT CHECK (seller_civility IN ('M', 'Mme', 'M_Mme', 'SCI', 'Societe')),
    seller_name TEXT NOT NULL,
    seller_email TEXT,
    seller_phone TEXT NOT NULL,
    seller_address TEXT NOT NULL,

    -- Localisation & Référencement
    title TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('maison', 'appartement', 'terrain', 'immeuble', 'local_commercial')),
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    display_exact_address BOOLEAN DEFAULT false,

    -- Données Financières (Conformité Loi ALUR)
    price_fai NUMERIC(12, 2) NOT NULL, -- Prix Frais d'Agence Inclus
    price_net_seller NUMERIC(12, 2) NOT NULL,
    agency_fees_amount NUMERIC(10, 2) NOT NULL,
    agency_fees_percentage NUMERIC(5, 2) NOT NULL,
    fees_paid_by TEXT NOT NULL CHECK (fees_paid_by IN ('acquereur', 'vendeur')),

    -- Métriques & Espaces
    living_area NUMERIC(8, 2) NOT NULL,
    carrez_area NUMERIC(8, 2),
    land_area NUMERIC(10, 2),
    rooms_count INT NOT NULL,
    bedrooms_count INT NOT NULL,
    bathrooms_count INT DEFAULT 1,
    floor_number INT,
    total_floors INT,
    has_elevator BOOLEAN DEFAULT false,

    -- Diagnostics & Performance Énergétique (DPE / GES)
    dpe_value NUMERIC(6, 1),
    dpe_letter TEXT CHECK (dpe_letter IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
    ges_value NUMERIC(6, 1),
    ges_letter TEXT CHECK (ges_letter IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
    dpe_date DATE,
    dpe_reference_year TEXT DEFAULT '2024',
    energy_cost_min NUMERIC(8, 2),
    energy_cost_max NUMERIC(8, 2),

    -- Descriptif & Attributs
    description TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb, -- ['piscine', 'garage', 'climatisation', 'terrasse', 'vue_degagee']

    -- Canaux de Multidiffusion Active
    publish_website BOOLEAN DEFAULT true,
    publish_seloger BOOLEAN DEFAULT false,
    publish_leboncoin BOOLEAN DEFAULT false,
    publish_bienici BOOLEAN DEFAULT false,

    -- Traçabilité
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_fai);
CREATE INDEX IF NOT EXISTS idx_properties_mandate_number ON properties(mandate_number);

-- 3. TABLE DES PHOTOS DU BIEN (AVEC ORDRE D'AFFICHAGE)
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id, display_order);

-- 4. TABLE DES CONTACTS ACQUÉREURS & CRITÈRES DE RAPPROCHEMENT
CREATE TABLE IF NOT EXISTS buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'actif' CHECK (status IN ('actif', 'en_pause', 'projet_abouti', 'archive')),

    -- Critères de recherche pour le moteur de matching
    budget_max NUMERIC(12, 2) NOT NULL,
    min_surface NUMERIC(8, 2),
    min_rooms INT,
    min_bedrooms INT,
    target_property_types JSONB DEFAULT '["maison", "appartement"]'::jsonb,
    target_cities JSONB DEFAULT '[]'::jsonb,
    must_have_garden BOOLEAN DEFAULT false,
    must_have_garage BOOLEAN DEFAULT false,

    -- Financement
    financing_status TEXT CHECK (financing_status IN ('comptant', 'accord_bancaire_valide', 'etude_courtier', 'en_attente')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES BONS DE VISITE NUMÉRIQUES
CREATE TABLE IF NOT EXISTS visit_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE RESTRICT,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    agent_id UUID REFERENCES profiles(id),
    signature_data_url TEXT NOT NULL, -- Signature tactile vectorisée base64/svg
    ip_address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE DU REGISTRE D'AUDIT SCELLÉ (CONFORMITÉ DGCCRF)
CREATE TABLE IF NOT EXISTS mandate_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    mandate_number INT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('creation', 'modification_prix', 'changement_statut', 'resiliation')),
    previous_state JSONB,
    new_state JSONB NOT NULL,
    performed_by UUID REFERENCES profiles(id),
    signature_sha256 TEXT NOT NULL, -- Empreinte cryptographique
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLE DES DEMANDES DE CONTACT & VISITES
CREATE TABLE IF NOT EXISTS contact_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    subject TEXT DEFAULT 'achat',
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    property_title TEXT,
    status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'traite', 'archive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLE DES DEMANDES D'ESTIMATION DVF EN LIGNE
CREATE TABLE IF NOT EXISTS estimation_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('maison', 'appartement', 'terrain', 'immeuble', 'local_commercial')),
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    living_area NUMERIC(8, 2) NOT NULL,
    land_area NUMERIC(10, 2),
    rooms_count INT,
    has_pool BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'avis_envoye', 'archive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLE DES PARAMÈTRES DE L'AGENCE
CREATE TABLE IF NOT EXISTS agency_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    agency_name TEXT NOT NULL DEFAULT 'Nell''Immo',
    agent_name TEXT NOT NULL DEFAULT 'Nelly Fernandez',
    card_t_number TEXT NOT NULL DEFAULT 'CPI 1310 2019 000 042 974 (CCI Marseille Provence)',
    phone TEXT NOT NULL DEFAULT '07 55 68 61 09',
    email TEXT NOT NULL DEFAULT 'nellimmo.acte@gmail.com',
    address TEXT NOT NULL DEFAULT '26 Avenue des Enjouvènes',
    city TEXT NOT NULL DEFAULT 'Pélissanne',
    postal_code TEXT NOT NULL DEFAULT '13330',
    seloger_agency_code TEXT NOT NULL DEFAULT 'NEL13',
    seloger_sftp_host TEXT NOT NULL DEFAULT 'sftp.seloger.com',
    seloger_sftp_user TEXT NOT NULL DEFAULT 'seloger_nel13',
    leboncoin_sftp_host TEXT NOT NULL DEFAULT 'sftp.leboncoin.fr',
    leboncoin_sftp_user TEXT NOT NULL DEFAULT 'lbc_nel13',
    bienici_feed_token TEXT NOT NULL DEFAULT 'nel_secure_token_2026_provence',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mandate_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimation_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DO $$
BEGIN
    DROP POLICY IF EXISTS "Agents ont acces total aux mandats" ON properties;
    CREATE POLICY "Agents ont acces total aux mandats" ON properties FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Agents gerent les photos" ON property_images;
    CREATE POLICY "Agents gerent les photos" ON property_images FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Agents gerent les acquereurs" ON buyers;
    CREATE POLICY "Agents gerent les acquereurs" ON buyers FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Agents gerent les visites" ON visit_sheets;
    CREATE POLICY "Agents gerent les visites" ON visit_sheets FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Audit consultable par les agents" ON mandate_audit_logs;
    CREATE POLICY "Audit consultable par les agents" ON mandate_audit_logs FOR SELECT TO authenticated USING (true);

    DROP POLICY IF EXISTS "Agents gerent les contacts" ON contact_leads;
    CREATE POLICY "Agents gerent les contacts" ON contact_leads FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Agents gerent les estimations" ON estimation_leads;
    CREATE POLICY "Agents gerent les estimations" ON estimation_leads FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Agents gerent les parametres" ON agency_settings;
    CREATE POLICY "Agents gerent les parametres" ON agency_settings FOR ALL TO authenticated USING (true);

    DROP POLICY IF EXISTS "Public lit uniquement les mandats actifs du site" ON properties;
    CREATE POLICY "Public lit uniquement les mandats actifs du site" ON properties FOR SELECT TO anon
        USING (status = 'actif' AND publish_website = true);

    DROP POLICY IF EXISTS "Public lit les photos des mandats actifs" ON property_images;
    CREATE POLICY "Public lit les photos des mandats actifs" ON property_images FOR SELECT TO anon
        USING (EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_images.property_id 
            AND properties.status = 'actif' 
            AND properties.publish_website = true
        ));

    DROP POLICY IF EXISTS "Public peut envoyer un message de contact" ON contact_leads;
    CREATE POLICY "Public peut envoyer un message de contact" ON contact_leads FOR INSERT TO anon WITH CHECK (true);

    DROP POLICY IF EXISTS "Public peut demander une estimation" ON estimation_leads;
    CREATE POLICY "Public peut demander une estimation" ON estimation_leads FOR INSERT TO anon WITH CHECK (true);

    DROP POLICY IF EXISTS "Public lit les parametres agence" ON agency_settings;
    CREATE POLICY "Public lit les parametres agence" ON agency_settings FOR SELECT TO anon USING (true);
END
$$;

-- 11. ACTIVATION TEMPS RÉEL SUPABASE (REALTIME POSTGRES CHANGES)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE properties;
    ALTER PUBLICATION supabase_realtime ADD TABLE buyers;
    ALTER PUBLICATION supabase_realtime ADD TABLE visit_sheets;
    ALTER PUBLICATION supabase_realtime ADD TABLE contact_leads;
    ALTER PUBLICATION supabase_realtime ADD TABLE estimation_leads;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

