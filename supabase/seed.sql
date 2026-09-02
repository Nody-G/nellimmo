-- ============================================================================
-- NELLIMO COCKPIT - JEU DE DONNÉES INITIAL (SEED PROVENCE 2026)
-- Conforme Loi Hoguet, ALUR et DPE
-- ============================================================================

-- 1. PARAMÈTRES DE L'AGENCE
INSERT INTO agency_settings (id, agency_name, agent_name, card_t_number, phone, email, address, city, postal_code, seloger_agency_code, seloger_sftp_host, seloger_sftp_user, leboncoin_sftp_host, leboncoin_sftp_user, bienici_feed_token)
VALUES (
    'default',
    'Nell''Immo',
    'Nelly Fernandez',
    'CPI 1310 2019 000 042 974 (CCI Marseille Provence)',
    '07 55 68 61 09',
    'nellimmo.acte@gmail.com',
    '26 Avenue des Enjouvènes',
    'Pélissanne',
    '13330',
    'NEL13',
    'sftp.seloger.com',
    'seloger_nel13',
    'sftp.leboncoin.fr',
    'lbc_nel13',
    'nel_secure_token_2026_provence'
) ON CONFLICT (id) DO NOTHING;

-- 2. MANDATS IMMOBILIERS CERTIFIÉS
INSERT INTO properties (
    id, mandate_number, mandate_type, mandate_date, mandate_end_date, status,
    seller_civility, seller_name, seller_email, seller_phone, seller_address,
    title, property_type, address, postal_code, city, latitude, longitude, display_exact_address,
    price_fai, price_net_seller, agency_fees_amount, agency_fees_percentage, fees_paid_by,
    living_area, carrez_area, land_area, rooms_count, bedrooms_count, bathrooms_count, floor_number, total_floors, has_elevator,
    dpe_value, dpe_letter, ges_value, ges_letter, dpe_date, dpe_reference_year, energy_cost_min, energy_cost_max,
    description, features, publish_website, publish_seloger, publish_leboncoin, publish_bienici, created_at, updated_at
) VALUES 
(
    'e1a0b1c2-0244-4000-8000-000000000244',
    244,
    'simple',
    '2026-01-10',
    '2026-04-10',
    'actif',
    'M_Mme',
    'M. et Mme Laurent',
    'famille.laurent13@gmail.com',
    '06 12 34 56 78',
    'Impasse des Oliviers, 13300 Salon-de-Provence',
    'Maison contemporaine avec piscine et vue dominante',
    'maison',
    'Impasse des Oliviers',
    '13300',
    'Salon-de-Provence',
    43.6402,
    5.0975,
    false,
    585000,
    563000,
    22000,
    3.91,
    'vendeur',
    148,
    148,
    1100,
    5,
    4,
    2,
    null,
    2,
    false,
    95,
    'B',
    3,
    'A',
    '2024-06-15',
    '2024',
    650,
    920,
    'Découvrez ce bijou d''architecture, pensée pour votre famille grâce à ses aménagements fonctionnels, au calme absolu et baignée d''une divine lumière. Située au bout d''une paisible impasse, à 800m du centre-ville, elle bénéficie d''une vue dominante et d''une piscine traditionnelle.',
    '["Piscine traditionnelle", "Climatisation réversible gainée", "Vue dominante", "Garage double", "Cuisine équipée îlot central", "Suite parentale plain-pied"]'::jsonb,
    true,
    true,
    true,
    true,
    '2026-01-10T09:00:00Z',
    '2026-02-28T14:30:00Z'
),
(
    'e1a0b1c2-0228-4000-8000-000000000228',
    228,
    'exclusif',
    '2026-01-15',
    '2026-04-15',
    'actif',
    'Mme',
    'Mme Isabelle Bernard',
    'isabelle.bernard13@orange.fr',
    '06 23 45 67 89',
    'Chemin des Costes, 13330 Pélissanne',
    'Villa de plain-pied avec jardin arboré et terrasse couverte',
    'maison',
    'Chemin des Costes',
    '13330',
    'Pélissanne',
    43.6315,
    5.1508,
    false,
    485000,
    466000,
    19000,
    4.08,
    'vendeur',
    125,
    125,
    850,
    4,
    3,
    1,
    null,
    1,
    false,
    142,
    'C',
    18,
    'C',
    '2024-04-20',
    '2024',
    850,
    1180,
    'Coup de cœur assuré pour cette élégante villa de plain-pied située dans un quartier recherché et paisible de Pélissanne. Spacieux séjour traversant avec cheminée, cuisine dinatoire ouvrant sur terrasse abritée.',
    '["Plain-pied total", "Cheminée avec insert", "Jardin clos et arboré", "Terrasse couverte", "Garage fermé", "Arrosage automatique canal de Provence"]'::jsonb,
    true,
    true,
    true,
    true,
    '2026-01-15T11:00:00Z',
    '2026-02-27T16:15:00Z'
);

-- 3. PHOTOS DES BIENS
INSERT INTO property_images (property_id, image_url, display_order, is_cover)
VALUES
(
    'e1a0b1c2-0244-4000-8000-000000000244',
    'https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6763a8a8163f458518e19eeb2190ee85/photo_0cfba4fce793eb129ef993a40ce05f93.jpg',
    1,
    true
),
(
    'e1a0b1c2-0228-4000-8000-000000000228',
    'https://nellimmo.staticlbi.com/1600xauto/images/biens/1/157297e61e05d0ffcdb66b2609eb1281/photo_00684f88e146747209e97ee8964c06f3.jpg',
    1,
    true
);

-- 4. ACQUÉREURS QUALIFIÉS
INSERT INTO buyers (
    id, first_name, last_name, email, phone, status, budget_max, min_surface, min_rooms, min_bedrooms,
    target_property_types, target_cities, must_have_garden, must_have_garage, financing_status, notes
) VALUES
(
    'b1a0b1c2-0001-4000-8000-000000000001',
    'Alexandre',
    'Moreau',
    'alex.moreau@tech-corp.fr',
    '06 11 22 33 44',
    'actif',
    620000,
    130,
    4,
    3,
    '["maison"]'::jsonb,
    '["Pélissanne", "Lambesc", "La Barben", "Aurons"]'::jsonb,
    true,
    true,
    'accord_bancaire_valide',
    'Cadre en télétravail avec 2 enfants. Recherche villa récente avec piscine. Financement validé par le Crédit Agricole Pélissanne.'
),
(
    'b1a0b1c2-0002-4000-8000-000000000002',
    'Sophie & Thomas',
    'Roux',
    'famille.roux13@gmail.com',
    '06 55 66 77 88',
    'actif',
    950000,
    200,
    6,
    4,
    '["maison"]'::jsonb,
    '["Pélissanne", "Grans", "Salon-de-Provence", "Eyguières"]'::jsonb,
    true,
    false,
    'comptant',
    'Achat comptant suite à la vente de leur résidence à Lyon. Recherche mas provençal de charme.'
);

-- 5. LEADS DE CONTACT
INSERT INTO contact_leads (
    name, email, phone, message, subject, status
) VALUES
(
    'M. et Mme Mercier',
    'mercier.famille@wanadoo.fr',
    '06 14 25 36 47',
    'Bonjour Nelly, nous serions ravis de visiter la maison contemporaine samedi matin. Nous vendons actuellement notre appartement sur Aix.',
    'visite',
    'nouveau'
);
