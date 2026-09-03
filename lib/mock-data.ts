import { Property, Buyer, VisitSheet, MandateAuditLog, AgencySettings, DVFTransaction, ContactLead, EstimationLead, TransactionDeal, ProspectingLead, VendorReport } from './types';

export const INITIAL_AGENCY_SETTINGS: AgencySettings = {
  agency_name: "SASU Nell'Immo",
  agent_name: "Nelly FERNANDEZ",
  card_t_number: "CPI 1310 2019 000 042 974",
  phone: "07 55 68 61 09",
  email: "nellimmo.acte@gmail.com",
  address: "26 avenue des Enjouvènes",
  city: "Pélissanne",
  postal_code: "13330",

  // Mentions Légales & Réglementation 2026
  siren: "853 807 006",
  rcs_city: "Salon-de-Provence",
  capital_social: "2 000 €",
  cci_card_t: "CCI Marseille Provence",
  guarantee_fund_name: "GALIAN Assurances",
  guarantee_fund_amount: "120 000 €",
  guarantee_fund_address: "89 rue La Boétie, 75008 Paris",
  insurance_name: "MMA Entreprise",
  insurance_policy: "Police n° 114.240.230",
  mediator_name: "ANM Conso / Médiation FNAIM",
  mediator_url: "https://www.anm-conso.com",
  bareme_honoraires_url: "/honoraires",
  agency_rib_iban: "FR76 3000 4000 5000 6000 7000 123",
  agency_rib_bic: "BNPAFRPP",

  // Passerelles SFTP Portails
  seloger_agency_code: "NELLIMMO-13330",
  seloger_sftp_host: "sftp.poliris.net",
  seloger_sftp_user: "poliris_nellimmo",
  leboncoin_sftp_host: "sftp.leboncoin.fr",
  leboncoin_sftp_user: "lbc_nellimmo_13",
  sftp_auto_sync_enabled: true,
  sftp_sync_interval_hours: 6,
  last_sftp_sync_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  last_sftp_sync_status: "success",
  bienici_feed_token: "bi_token_nellimmo_live_2026",

  // Intelligence Artificielle
  deepseek_api_key: "",

  // Réseaux Sociaux (Meta & LinkedIn)
  meta_app_id: "948271039847120",
  facebook_page_id: "nellimmo.immobilier",
  facebook_page_access_token: "",
  instagram_business_id: "nellimmo_provence",
  linkedin_client_id: "",
  social_autopost_new_mandate: true,
  social_autopost_price_drop: true,
  social_autopost_sold: true,

  // Écosystème Google
  google_calendar_id: "nellimmo.acte@gmail.com",
  google_maps_api_key: "",
  google_my_business_url: "https://g.page/r/nellimmo/review",
  google_drive_folder_id: "drive_nellimmo_mandates_2026",
  google_contacts_sync_enabled: true
};

export const INITIAL_PROPERTIES: Property[] = [
  
    {
    "id": "prop-227",
    "mandate_number": 244,
    "mandate_type": "simple",
    "mandate_date": "2025-10-05",
    "mandate_end_date": "2026-10-05",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON - LES VIOUGUES: 800m du CENTRE : Maison édifiée en 2023, 170m² Hab. - PISCINE - 4 STATIONNEMENTS",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 786600,
    "price_net_seller": 755136,
    "agency_fees_amount": 31464,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 170.0,
    "carrez_area": 170.0,
    "land_area": 443.0,
    "rooms_count": 7,
    "bedrooms_count": 4,
    "bathrooms_count": 1,
    "dpe_value": 45,
    "dpe_letter": "A",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 630,
    "energy_cost_max": 920,
    "description": "Découvrez ce bijou d'architecture, pensée pour votre famille grâce à ses aménagements fonctionnels, au calme absolu et baignée d'une divine lumière.\nSituée au bout d'une paisible impasse, à 800m du centre ville, de ses écoles privées et publiques et de toutes commodités, elle bénéficie d'une vue dominante sur ses 2 étages..\nSa parcelle de 443m² est parfaitement optimisée. On profitera d'un espace de stationnement de deux véhicules à l'intérieur du terrain clôturé, et deux places privatives devant le portail.\nUn espace dédié à la détente et au farniente, d'une beauté sobre et élégante, à l'abris des regard dans son écrin de verdure, s'anime autour d'une jolie piscine traditionnelle 7mx3m.\nUn convival espace avec cuisine d'été et barbecue, est idéal pour les repas en famille, ainsi qu'un espace salon d'été.\nDès l'entrée, une incroyable lumière vous enveloppe et l'espace de 65m² de cette magnifique pièce à vivre s'ouvre à vous. Il se compose d'une entrée aménagée gracieusement en dressing et bureau de qualité, vastes espaces salon et salle à manger, élégante cuisine aménagée et entièrement équipée, buanderie/cellier et wc viennent compléter le tout. Avec quelques travaux, une suite pourrait être pensée sur ce niveau.\nA l'étage l'espace enfants avec ses 4 chambres entre 12m² et 15m², toutes équipées de dressing ou rangements, superbe salle de bains avec douche et bains, wc indépendant et grand dégagement.\nAu dernier niveau, environ 35m² préservent l'intimité des parents. Ce niveau se compose d'une chambre de 12m², 11m² de dressing avec des aménagements de qualité et 9m² de salle d'eau avec wc.\nUne maison familiale et moderne grâce à ses sols en béton cirés parfaitement exécutés, aux performances énergétiques exceptionnelles notamment grâce à ses climatisations réversibles par pompe à chaleur (1 part niveau suffit), sa parfaite isolation thermique, ses grandes et nombreuses menuiseries aluminium de grande qualité et son cumulus thermodynamiques.\nDPE: A établi le 07 09 2025- Estimation des coûts annuels d'énergie du logement: entre 630 EUR et 920 EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nJe me tiens à votre disposition pour échanger sur votre projet.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette villa vous est proposée au prix de 786 600€ honoraires d'agence de 3.5% inclus à la charge du VENDEUR - MANDAT 244 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Climatisation réversible",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "Vue dominante",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-10-05T09:00:00Z",
    "updated_at": "2026-02-15T11:20:00Z",
    "images": [
      {
        "id": "img-227-1",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_1bd0dca3af4c480e63bb5cdd40e2f8ba.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-2",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_637852feefb7cd8fc404aafcec4c5bf6.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-3",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_b514737fd6029925183303052982162b.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-4",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_5e1e94a27a5feda6eb2955d8c4d926ad.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-5",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_79443bb5aaeb03f616caff22c6c6a57f.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-6",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_98678a9d668f73fd803126b054c88ca0.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-7",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_0d5c4ba1937c8b112211e8322e92512a.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-8",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_9ae07b9abc0b110dd968e907a9ce160b.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-9",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_25f8004ed724782e412bacc45b5b10bb.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-10",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_a4314fa2aefd33534c56c9397f2d8599.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-11",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_13a0b28a6045c2159f39e5761acfb767.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-12",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_39bc85dac7be521d56a0cea226240f23.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-13",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_3b76dd944dc4e49310504b40e7837174.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-14",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_69edbab610d4878d195fa33aaf01dcc7.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-15",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_e03e3a6734ff0c0490262e02192f0f6d.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-16",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_abe9abc27a9744fe7a1fd4904674cf9f.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-17",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_8fbc2bb4ee82676ce038399cca0c6b10.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-18",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_eb6a174c30d93d5c649446c38180937c.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-19",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_542863e84ffc6ea8f2c2e56042bc6066.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-20",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_288a010929dbc46fb0ab5fcf20f58a08.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-21",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_49de1eefef9322a1d97ab4790ab23d95.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-22",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_c2be25e6092500b224bfa4df4d313c75.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-23",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_f2a91398ddae707aa27bc13c2900cf87.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-24",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_57ce31a1f4c5665196bb3f9b1cfd8a4b.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-25",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_cd4c9e1a4dafa54f4e87e0d4c138a89f.jpg",
        "display_order": 25,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-26",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_11786fd01b64aa57d12a1a1a383a2cb4.jpg",
        "display_order": 26,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-27",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_02093eb1388f410582363916a7ded2ff.jpg",
        "display_order": 27,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-28",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_a9323b4271269c351bf67bb1a9a4f9ad.jpg",
        "display_order": 28,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-29",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_d0cbf1f55623afc55ca040a140409912.jpg",
        "display_order": 29,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-30",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_3ca4d8b9a4155e418ca5dfd6e58f873a.jpg",
        "display_order": 30,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-31",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_6a9b6700b1db5fb4a4d92585ca257f4c.jpg",
        "display_order": 31,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-32",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_15b2a2414a3921179064b6e16fd34f91.jpg",
        "display_order": 32,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-33",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_ace918c1d5aed2f16ee41e442137c863.jpg",
        "display_order": 33,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-34",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_3dbdcacd8423c77022a4ec655026ab87.jpg",
        "display_order": 34,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-35",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_d4c9579dec7acaa02dca3258a18446eb.jpg",
        "display_order": 35,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-227-36",
        "property_id": "prop-227",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_971c996d6eb577699144f6b89af6cbd7.jpg",
        "display_order": 36,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-les-viougues-800m-du-centre-maison-edifiee-en-2023-170m-hab-piscine-4-stationnements-prestige/227-maison"
  },
  
    {
    "id": "prop-225",
    "mandate_number": 243,
    "mandate_type": "exclusif",
    "mandate_date": "2025-09-15",
    "mandate_end_date": "2026-09-15",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON 1km CENTRE: APPARTEMENT T1 - PARKING LIBRE FAIBLES CHARGES",
    "property_type": "appartement",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 95000,
    "price_net_seller": 91200,
    "agency_fees_amount": 3800,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 30.27,
    "carrez_area": 30.27,
    "land_area": 0.0,
    "rooms_count": 1,
    "bedrooms_count": 1,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 40,
    "ges_letter": "D",
    "dpe_reference_year": "2024",
    "energy_cost_min": 650,
    "energy_cost_max": 900,
    "description": "A 900m de la dynamique Place Morgan, proche gares ferroviaires et routières et de toutes commodités, découvrez cet appartement de type 1.\nD'une surface habitable de 30,27m², Loi Carrez 27.57m², il bénéficie de nombreuses facilités de stationnement grâce au grand parking en placement libre de sa résidence.\nTraversant NORD/SUD, il est situé en rez de chaussée sur élevé.\nIl se compose d'une entrée avec placard et d'un salon lumineux. Sa cuisine indépendante est aménagée et équipée. Elle dispose d'un placard et d'une buanderie cellier attenante. Une salle d'eau et son wc indépendant viennent compléter le tout.\nCet appartement vient d'être entièrement repeint. Il dispose de menuiseries PVC double vitrage et de volets roulants électriques. Il pourrait être loué enre 520 et 550 euros charges incluses.\nIDEAL INVESTISSEUR OU PRIMO ACCEDANT\nPrès de 6,5% de rentabilité nette.\nLes charges sont très raisonnables compte tenu qu'elles comprennent notamment la consommation en eau de ville et l'entretien des parties communes.\nLa provision sur charges de l'exercice en court est de 61.87€ mensuelle, incluant le fonds travaux Loi Alur. Le dernier exercice clôturé connu s'élevait à 387.49€ pour l'année complète 2024, dont 211.59€ récupérables auprès du locataire.\nCette résidence compte 89 lots principaux et 22 lots annexes soit 111 lots en tout.\nPas de procédure en cour concernant cette copropriété. Des travaux d'isolation par l'extérieur ont étét votés et restent à la charge du propriétaire vendeur.\nDes lignes de bus régulières, la proximité des commerces et écoles, la facilité d'accès aux gares ferroviaires, routières ainsi que l'accès rapide aux entrées autoroute lui confère un emplacement privilégié.\nDPE:D établi le 27 07 2026 - Estimation des coûts annuels d'énergie du logement: entre 650 EUR et 900EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCet appartement vous est proposé au prix de 95 000€ honoraires d'agence inclus à la charge du VENDEUR en forfait de 4800€ TTC - MANDAT EXCLUSIF 243 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Garage / Parking",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-09-15T09:00:00Z",
    "updated_at": "2026-02-15T11:20:00Z",
    "images": [
      {
        "id": "img-225-1",
        "property_id": "prop-225",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/636f6186849662a95054d23ea3c34f07/photo_69bc5a068743463dd726d0c9c2d50471.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-225-2",
        "property_id": "prop-225",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/636f6186849662a95054d23ea3c34f07/photo_3044cae8a5d303bff6292d32a7234174.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-225-3",
        "property_id": "prop-225",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/636f6186849662a95054d23ea3c34f07/photo_f32ba7cbd548d5af125473dee837d337.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-225-4",
        "property_id": "prop-225",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/636f6186849662a95054d23ea3c34f07/photo_8d84f5b75d7a10563df9c7c3926894e4.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-225-5",
        "property_id": "prop-225",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/636f6186849662a95054d23ea3c34f07/photo_899deb9afa53ee8e253552f8473202ba.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-225-6",
        "property_id": "prop-225",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/636f6186849662a95054d23ea3c34f07/photo_f99ddb8cf9ec0800b16e364fb3a18a7e.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-1km-centre-appartement-t1-parking-libre-faibles-charges/225-appartement"
  },
  
    {
    "id": "prop-224",
    "mandate_number": 242,
    "mandate_type": "simple",
    "mandate_date": "2025-08-20",
    "mandate_end_date": "2026-08-20",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON CENTRE: Maison édifiée en 2024,T4 garage jardin stationnement",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 485000,
    "price_net_seller": 465600,
    "agency_fees_amount": 19400,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 102.83,
    "carrez_area": 102.83,
    "land_area": 650.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 45,
    "dpe_letter": "A",
    "ges_value": 9,
    "ges_letter": "B",
    "dpe_reference_year": "2024",
    "energy_cost_min": 400,
    "energy_cost_max": 570,
    "description": "Aux portes du dynamique centre ville de SALON DE PROVENCE, découvrez cette magnifique maison contemporaine d'inspiration \"ART DECO\".\nDevenir propriétaire d'une des 6 villas de cet harmonieux îlot fermé sécurisé, c'est faire le choix du confort moderne, du calme et de la grâce d'une architecture d'exception aux lignes courbes épurées.\nCette magnifique villa est un chef d'oeuvre d'architecture, disposant d'une surface habitable de 102.83m² avec agréable jardin, 2 places de parking privatives devant la maison et garage attenant accessible, dans une enceinte fermée sécurisée, ne faisant pas partie d'une copropriété.\nSa lumineuse pièce à vivre aux élégantes courbes épurées offre une confortable surface de 45m² ouvrant par de larges baies sur son jardin clos.\nElle offre en rez de chaussée une belle pièce à vivre, un wc indépendant, un accès au garage, deux places de stationnements et un agréable jardin.\nA l'étage, on trouve 1 suite parentale avec salle d'eau privative, 2 spacieuses chambres, une salle de bains et dégagement.\nIci règne la transparence, la fluidité et le jeu de lumière.\nElle se caractérise par ses confortables volumes nimbés de lumière, son performant système de climatisation réversible gainé intégré, ses belles menuiseries aluminium hublots et ses carreaux de ciments, de grès et faïences de qualité.\nLes volets roulants sont électriques centralisés.\nDisponible immédiatement et sous garantie décennale, cette maison n'est pas en copropriété. FRAIS DE NOTAIRE 2,5%\nLes espaces communs sont gérés en ASL Ce bien n'est pas en copropriété.\nIl s'agit d'une des dernières opportunités!\nDPE:A établi le 03 09 2024 - Estimation des coûts annuels d'énergie du logement: entre 400 EUR et 570 EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nJe me tiens à votre disposition pour échanger sur votre projet.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette villa vous est proposée au prix de 485 000€ honoraires d'agence inclus à la charge du VENDEUR - MANDAT 242 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-08-20T09:00:00Z",
    "updated_at": "2026-02-15T11:20:00Z",
    "images": [
      {
        "id": "img-224-1",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_01e985fce7d09022bb76ed1b69920acc.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-2",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_b59427929a656939019b5761096995e6.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-3",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_5d9d12b178def9d564325c6b176e9e0f.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-4",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_15fc547c7f8e0c7dc7cb6bf5a3c78fe6.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-5",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_7f75a35cd17a13724b6b75265095f22e.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-6",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_d6fcce4d99f526642b6323d9df15dc98.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-7",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_6f9b6dcb6d36b739dce43029e8eaa385.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-8",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_5083fe1ace6ca774b4c8f2496ae19325.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-9",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_d4c9579dec7acaa02dca3258a18446eb.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-10",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_27a445a82896deb83a1fcc766d30faf6.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-11",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_9fcbd709c5dad1920f816ef36c46af2c.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-224-12",
        "property_id": "prop-224",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_dc00ecfde7b5b7781a273c66fae2c053.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-centre-maison-edifiee-en-2024-t4-garage-jardin-stationnement/224-maison"
  },
  
    {
    "id": "prop-222",
    "mandate_number": 239,
    "mandate_type": "exclusif",
    "mandate_date": "2025-06-24",
    "mandate_end_date": "2026-06-24",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON DE PROVENCE CENTRE VILLE: SUPERBE MAISON T6 JARDIN ET GARAGE",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 445000,
    "price_net_seller": 427200,
    "agency_fees_amount": 17800,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 130.0,
    "carrez_area": 130.0,
    "land_area": 650.0,
    "rooms_count": 6,
    "bedrooms_count": 4,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Découvrez en exclusivité Nell'immo cette superbe maison de ville développant une surface habitable d'environ 130m², répartie sur 2 niveaux et profitant d'une belle luminosité grâce à son exposition traversante Nord/Sud.\nUn beau jardin privatif au sud, joliment paysagé d'environ 90m², agrémenté d'une terrasse de 20m² sous pergola.\nEnfin une garage de 25m² avec mezzanine de rangement vient compléter le tout.\nFonctionnelle, au calme, idéalement placée à 1km de l'hypercentre de Salon de Provence, proche de toutes les commodités cette propriété est sans commune mesure un petit bijou qui offrira un foyer confortable et chaleureux à toute la famille.\nLa maison se compose d'une entrée avec placard, d'un salon avec cheminée, d'une vaste cuisine aménagée et son coin repas, le tout accessible par la terrasse. De plus un bureau, une salle d'eau avec wc, une buanderie et un atelier viennent compléter ce rez de chaussée.\nA l'étage, 4 chambres dont deux vastes de 15 et 14m², un bureau, une salle de bains avec wc et dégagement. Au dernier étage, un grenier non habitables a été aménagé proprement pour le stockage.\nCette maison parfaitement entretenue bénéficie d'une façade et toiture en excellents état, d'une bonne qualité d'isolation démontrée par sa performance énergétique classe C, des menuiseries en double vitrage, de beaux éléments d'architectures et notamment cet escalier au coeur de la maison majestueux. \nLe système de chauffage central au gaz de ville avec chaudière récente ne présente aucune anomalie et de nombreuses climatisation réversibles ont été installées dans le bien.\nDPE:C établi le 05 06 2026 - Estimation des coûts annuels d'énergie du logement: entre 1620EUR et 2280 EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette jolie propriété vous est proposée au prix de 445 000€ honoraires d'agence inclus à la charge du VENDEUR de 3.80%TTC - MANDAT 239 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-06-24T10:00:00Z",
    "updated_at": "2025-11-20T16:00:00Z",
    "images": [
      {
        "id": "img-222-1",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_dc00ecfde7b5b7781a273c66fae2c053.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-2",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_9903ec79dd11199a2f25eb5e2d2274dc.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-3",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_8290f63bf8be9f6c2304ce5b6bfa522b.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-4",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_f389b946d2b1aa2c17bb7138203e4a3c.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-5",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_96f7d1cc319ad7761a27893085347893.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-6",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_57ec7c4f2b6c9521b109320d0655c6a7.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-7",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_3bf418515eb18c17b76779f64752b91a.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-8",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_1193bec3fdb5bc3cc3026d8c17457632.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-9",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_4ed8de4b07165aeaed1e1f4b99aebce5.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-10",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_7ad2552ae5b273ce6e67533279d73707.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-11",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_ef622742e65f5c4b3f6096ee8a07139e.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-12",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_b340f061d2d018ad98e0730d638e7d92.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-13",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_0698d38e879dcfcee99f97521171e48c.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-14",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_397ef132160edc61ef8e4dd47c884950.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-15",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_13b94736290561baace4518d615e464f.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-16",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_d6e95f1e5c1c7ae8915c47c297ac6e2b.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-17",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_1fdb88d6cb82c5de1ddd936550f63515.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-18",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_579a2149fd46e60f5b625e588cba1ade.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-19",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_043818a16e12b4f649d6c8092f3531c4.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-20",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_61cc3548b86f43e7ab4b8c841d3f7450.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-21",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_b7118e3cb9360958efd8a90b319d5336.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-22",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_a88bd735ea18f6e32708330e0b7a5acb.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-23",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_332cc4e47a5b9a6c2114380f4e5f1df6.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-24",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_dcfb5edde9a8babdf519a3cee5056b46.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-25",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_c6d4570ac3867d1b7d98bb1a7705023c.jpg",
        "display_order": 25,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-26",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_c5e3e7da7595561072762caecec9d33e.jpg",
        "display_order": 26,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-27",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_f1b358cd30763761618530f7ed9f6b84.jpg",
        "display_order": 27,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-28",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_85832501db1a32fb2da7fd34b8e7291a.jpg",
        "display_order": 28,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-29",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_44af8abdfe38604b92dbe4e0a0c6e617.jpg",
        "display_order": 29,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-30",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_27a445a82896deb83a1fcc766d30faf6.jpg",
        "display_order": 30,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-222-31",
        "property_id": "prop-222",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_01e985fce7d09022bb76ed1b69920acc.jpg",
        "display_order": 31,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-de-provence-centre-ville-superbe-maison-t6-jardin-et-garage/222-maison"
  },
  
    {
    "id": "prop-219",
    "mandate_number": 237,
    "mandate_type": "exclusif",
    "mandate_date": "2025-06-22",
    "mandate_end_date": "2026-06-22",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "PELISSANNE: MAISON DU XIXEME T6 RENOVEE AU CALME, PISCINE",
    "property_type": "maison",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 569000,
    "price_net_seller": 546240,
    "agency_fees_amount": 22760,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 149.0,
    "carrez_area": 149.0,
    "land_area": 650.0,
    "rooms_count": 6,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Découvrez en exclusivité NELL'IMMO cette charmante maison offrant 149m² habitables, située au calme d'une impasse privée, nichée sur 660m² de parcelle, agrémentée d'une vaste piscine 4m x 9m.\nAu pied du magnifique massif des Costes, elle fera le bonheur d'une famille désireuse d'une vie paisible et pratique, à 1km du cœur du dynamique village, typiquement provençal, de PELISSANNE.\nBaignée de lumière, elle se compose d'une entrée avec placard, près de 50m² de séjour avec cheminée et climatisation réversible gainée, une vaste cuisine avec coin repas de 19m² aménagée et équipée, wc et buanderie. A l'étage, une vaste suite parentale de 21m² avec salle d'eau privative rénovée récemment, 2 chambres de belles tailles, bureau ou petite chambre d'appoint, salle de bains avec baignoire et douche, WC indépendant et mezzanine ouverte, idéale pour un espace bureau supplémentaire.\nL'ensemble des chambres sont climatisées par pompe à chaleur.\nLa toiture a fait l'objet d'une réfection en novembre 2025, sous garantie décennale. Le bien est raccordé au tout à l'égout et à l'eau par forage, 50m de profondeur environ.\nLa maison est idéalement implantée sur cette jolie parcelle agrémentée d'une vaste piscine coque 9m x 4m au chlore, parfaitement entretenue, d'un bain à remous pour se détendre, d'une plage de piscine d'environ 100m², d'une terrasse sur les espace de vie de 32m². Côté stationnement, 4 places sur espace de stationnement dans l'enceinte fermée de la parcelle. Un garage à moto vélo ou atelier de 13m² et un local technique et de rangement de 20m² viennent compléter le tout.\nLa parcelle est entièrement clôturée, disposant d'une double fermeture par portails automatiques et interphone.\nPELISSANNE, magnifique village, réputé pour son cadre de vie agréable, entre les collines du sublime Massif des Costes et les champs d'oliviers. Le cœur de village est dynamique avec une multitude de commerces de proximité (boulangeries, épiceries, restaurants) et un marché dominical réputé localement, assurant un accès facile à toutes les commodités. La commune dispose également de services publics et d'écoles, crèches, primaires, collège et même une école de musique !\nEmplacement stratégique, Salon de Provence à 10min, Aix en Provence à environ 30min, Aéroport gare TGV à environ 25min en voiture\nUn réseau de bus conséquent permet l’accès aisément, notamment à SALON DE PROVENCE, AIX EN PROVENCE, et pour les employés d’AIBUS HELICOPTER.\nTAXE FONCIERE 2025: 1853€\nDPE:D établi le 30 04 2026 - Estimation des coûts annuels d'énergie du logement: entre 2400EUR et 3320 EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette jolie propriété vous est proposée au prix de 569 000€ honoraires d'agence inclus à la charge du VENDEUR de 3.80%TTC - MANDAT 237 avenant 240 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-06-22T10:00:00Z",
    "updated_at": "2025-11-20T16:00:00Z",
    "images": [
      {
        "id": "img-219-1",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_9fcbd709c5dad1920f816ef36c46af2c.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-2",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_ee98f8a25d6bbe6d50cacda5e3cb8c45.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-3",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_7f3bc7a46fd52c6abea05d296c287e77.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-4",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_194f45609c736a61c63a49341dedd531.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-5",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_21001238ce7de835ff72e72198a64027.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-6",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_2d6b6f54028c0a7c9cf38ea64fcbae1d.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-7",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_026968bb7eead9ba0c01b5ef7b59eb11.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-8",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_f4dda2bb692d072794aed3888988189b.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-9",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_e975ca4c501ea9bfe19c644df40fb357.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-10",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_9477ff6c86cc949ae1d4b90157af05b7.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-11",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_71adb42d8088f31767c2205641b1095a.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-12",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_e075a1484fa6ea2bc24e575b2589a357.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-13",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_607f3423e4bd850dae58f4c996a9e154.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-14",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_40851c4f78f3c9ad285bbd97e351d843.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-15",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_00470b7896978009a9dcae38a48db339.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-16",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_3be1742a7f8ca0436249795d1092029d.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-17",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_3f2d78ccd55d7a728e2b2a722c1e4a77.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-18",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_c399ccc6bd89b25f1a80afb4162f5cba.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-19",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_49edef4c7335513c28e169fd7333b4ce.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-20",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_0a8272116337bba2efaec5c35c9f6b12.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-21",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_7b16392061dc427b00b3292bbb68a38d.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-22",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_c36fb1bc6f943dfd5740881d3f1b5415.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-23",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_280258b0b4530f0e514b9a2e10b0834f.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-24",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_d4c9579dec7acaa02dca3258a18446eb.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-25",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_971c996d6eb577699144f6b89af6cbd7.jpg",
        "display_order": 25,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-26",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_27a445a82896deb83a1fcc766d30faf6.jpg",
        "display_order": 26,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-219-27",
        "property_id": "prop-219",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_dc00ecfde7b5b7781a273c66fae2c053.jpg",
        "display_order": 27,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/pelissanne-maison-du-xixeme-t6-renovee-au-calme-piscine/219-maison"
  },
  
    {
    "id": "prop-218",
    "mandate_number": 236,
    "mandate_type": "exclusif",
    "mandate_date": "2025-06-21",
    "mandate_end_date": "2026-06-21",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "EXCLUSIVITE DEJA SOUS PROMESSE DE VENTE SALON AU CALME: SUPERBE APPARTEMENT T6 119M² HAB, TERRASSE ET PARKING",
    "property_type": "appartement",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 219000,
    "price_net_seller": 210240,
    "agency_fees_amount": 8760,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 119.0,
    "carrez_area": 119.0,
    "land_area": 0.0,
    "rooms_count": 6,
    "bedrooms_count": 5,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 40,
    "ges_letter": "D",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE DEJA SOUS PROMESSE DE VENTE NELL IMMO\nDans une résidence recherchée réputée pour son calme, à proximité immédiate de toutes commodité, découvrez ce magnifique appartement de type 6, d'une surface habitable de 119m², entièrement rénové avec goût. Il dispose d'une jolie vue dégagée de sa terrasse, sur d'agréables espaces verts.\nIl se compose d'une vaste pièce à vivre de 50m² comprenant salon, séjour et une magnifique cuisine aménagée et équipée et son cellier attenant. Pour plus de confort, l'appartement est équipé d'une climatisation réversible, d'un système de chauffage collectif performant et de volets roulants électriques.\nL'espace nuit se compose de 4 belles chambres de 9 à 14m². La plus grande chambre est un peu à l'écart, idéal pour l'intimité des parents. De plus, dressing, dégagement avec placards, une magnifique salle de bains refaite à neuf, ainsi que le WC indépendant et petit espace buanderie très pratique.\nLe bien est situé au 2ème étage sur 4 et dispose d'un ascenseur. Pour plus de praticité, un grand espace de stationnement pour véhicule au pied de la résidence et l'ascenseur sont à disposition.\nLes charges sont raisonnables compte tenu qu'elles comprennent notamment la consommation en chauffage, eau de ville chaude et froide, l'ascenseur, l'entretien des espaces verts et des parties communes, l'électricité commune ainsi que les assurances notamment.\nLa provision sur charges de l'exercice en court est de 428€ mensuelle, incluant le fonds travaux Loi Alur. Le dernier exercice clôturé connu s'élevait à 4 876,10€ pour l'année complète 2025.\nCette résidence compte 132 lots principaux.\nPas de procédure en cour concernant cette copropriété.\nCe magnifique appartement est idéal pour une vie de famille paisible, en toute serénité.\nDes lignes de bus régulières, la proximité des commerces et écoles, la facilité d'accès aux gares ferroviaires, routières ainsi que l'accès rapide aux entrées autoroute lui confère un emplacement privilégié.\nDPE:C établi le 31 10 2022 - Estimation des coûts annuels d'énergie du logement: entre 750 EUR et 1060 EUR par an (Prix moyens des énergies indexés sur les années 2021 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCe superbe appartement vous est proposé au prix de 219 000€ honoraires d'agence inclus à la charge du VENDEUR de 4%TTC - MANDAT EXCLUSIF 236 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Environnement calme",
      "Vue dominante",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-06-21T10:00:00Z",
    "updated_at": "2025-11-20T16:00:00Z",
    "images": [
      {
        "id": "img-218-1",
        "property_id": "prop-218",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ac40efd89a752e475a274036b0a6fb0d/photo_d855fe93a9745b49e0cf02638b157ec6.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-218-2",
        "property_id": "prop-218",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ac40efd89a752e475a274036b0a6fb0d/photo_737048f3ffaecfe4ac1c17e07923b920.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-218-3",
        "property_id": "prop-218",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ac40efd89a752e475a274036b0a6fb0d/photo_8fe13f1056966a38394fe8215ad6c91e.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-218-4",
        "property_id": "prop-218",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/addf4f0e21f3cb6defcd2218fa1bca92/photo_3fd983d48638528ae38d52ab3c922df2.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-218-5",
        "property_id": "prop-218",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_44af6f635bb6a90c55a819becf5ce10d.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-218-6",
        "property_id": "prop-218",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2344c4964449a9abce89f5d84d2fad02/photo_809577f516430f326a01e06446a58aa4.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/exclusivite-deja-sous-promesse-de-vente-salon-au-calme-superbe-appartement-t6-119m-hab-terrasse-et-parking/218-appartement"
  },
  
    {
    "id": "prop-217",
    "mandate_number": 235,
    "mandate_type": "simple",
    "mandate_date": "2025-06-20",
    "mandate_end_date": "2026-06-20",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "PELISSANNE CENTRE: Superbe Maison de charme, 216m² hab, garage 45m²,vastes terrasses et piscine",
    "property_type": "maison",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 549000,
    "price_net_seller": 527040,
    "agency_fees_amount": 21960,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 216.0,
    "carrez_area": 216.0,
    "land_area": 650.0,
    "rooms_count": 8,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Superbe maison familiale, pour majeure partie en pierre datant du XIXème siècle.\nRénovée et parfaitement entretenue, vous serez séduits par ses éléments architecturaux uniques, ses volumes généreux ainsi que par la beauté des matériaux d'antan parfaitement conservés et subtilement mises en valeur... Poutres, plafonds à la française, parefeuilles en parfait état, piles en pierre, carreaux de ciment authentiques font de cette maison un véritable bijou d'esthétisme.\nElle est située au cœur du magnifique village typiquement provençal de Pélissanne, réputé pour son cadre de vie agréable, entre les collines du sublime Massif des Costes et les champs d'oliviers. Le cœur de village est dynamique avec une multitude de commerces de proximité (boulangeries, épiceries, restaurants) et un marché dominical réputé localement, assurant un accès facile à toutes les commodités. La commune dispose également de services publics et d'écoles, notamment crèches, primaires, collège et même une école de musique !\nCette propriété de charme se compose en rez de chaussée d'une belle entrée, d'une suite parentale 20m² avec salle d'eau et wc, salle de jeux, terrasse et piscine chauffée traditionnelle atypique aux allures de bain romain.\nAu 1er étage vaste pièce à vivre de 60m² comprenant superbe cuisine aménagée et équipée d'un piano de cuisson, salon séjour avec poêle à bois, le tout accédant à une vaste terrasse dominante de 25m². On y trouve une suite parentale avec salle d'eau privative et dressing, puis un wc et dégagement.\nAu 2ème étage 3 chambres dont 2 avec placards, 1 bureau, vaste salle de bains rénovée avec des matériaux de qualité et son wc, puis un large pallier.\nAu dernier étage , une salle de jeux avec placards de 9m² habitable (15m² au sol) donne sur une immense terrasse de caractère, profitant d'une vue incroyable, d'une surface de 32m².\nDes éléments d'équipements modernes apportent beaucoup de confort à cette maison idéale pour une vie de famille: menuiseries récentes en double vitrage bois pour conserver le caractère des lieux, pompe à chaleur pour la piscine, plancher chauffant par pompe à chaleur sur les 60m² de pièce à vivre, adoucisseur, cumulus solaire de 2021 de 330L, porte automatique du garage. De plus la façade a été ravalée il y a un peu plus de 10 ans, la toiture à été rénovée pour partie il y a moins de 20 ans, traitement anti remontée d'humidité sur les murs du rez de chaussée par injection, traitement par injection de toutes les poutres.\nGrâce à ses 216m² habitables, ses beaux extérieurs notamment son espace piscine et de son vaste garage de 45m², elle offre fonctionnalité, sérénité et confort à toute la famille. Les enfants auront la chance de grandir dans un environnement calme et les parents, la garantie de les voir évoluer dans un bel environnement en toute autonomie. Elle a les clés du bonheur familial!\nA proximité on y retrouve une place de stationnement publique et un réseau de bus conséquent permet l’accès aisément, notamment à SALON DE PROVENCE, AIX EN PROVENCE, et pour les employés d’AIBUS HELICOPTER.\nTAXE FONCIERE 2025: 1253€\nDPE:D établi le 08 12 2025 - Estimation des coûts annuels d'énergie du logement: entre 2790 EUR et 3820 EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette superbe maison vous est proposée au prix de 549 000€ honoraires d'agence inclus à la charge du VENDEUR de 3.58%TTC - MANDAT 235 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-06-20T10:00:00Z",
    "updated_at": "2025-11-20T16:00:00Z",
    "images": [
      {
        "id": "img-217-1",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_27a445a82896deb83a1fcc766d30faf6.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-2",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_a965832a16a982c71680353ce6d90ba6.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-3",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_8bda2c2cd51590a0cca4d768726d9e29.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-4",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_379393483782101e4d45469c132df60f.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-5",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_205428af499d98e3b04ac1b58d1b424a.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-6",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_d2652f78f557c5594f46943736d35054.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-7",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_51851a05dc33787b05b3095de67b6818.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-8",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_e191ede2313a28437cbb2c16964d6b55.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-9",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_aee0d244201b2b4ede08c831a99c7665.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-10",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_c542dda3b449fcfd36066e06d600d830.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-11",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_eb87820bd8258d50e1c6dd6ec2e49f23.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-12",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_ec2a015e48ea4040e6b149a65c61a5f4.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-13",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_01305aeee479e89b118d342aef8aa696.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-14",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_72d391f6f510408b2d0898ba8334e313.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-15",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_87f7713097f5cc11f8e9081dc12e095d.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-16",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_8b84179c1290a12c92257afc49cdd79a.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-17",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_2a9244160f9516336954327560b8ccfc.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-18",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_57876a9faba4c867c5e980eac72f40da.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-19",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_dee2a57aff5c631e88d5ed0fa5708e82.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-20",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_ff64253d7a0347bf498c5fbaf125d629.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-21",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_f96faab9f922141ea99befb6c3ef5d37.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-22",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_fa2fcf720a7de82413ec3a0ffc012452.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-23",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_65852179117fef8266d1843facd7c7cc.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-24",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_fd6a6fbdcce13d2fac247e5b7544a47c.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-25",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_291d20bde3fd7534140c02b69df76896.jpg",
        "display_order": 25,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-26",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_f570c6e762041417dfdc67515e92bdb5.jpg",
        "display_order": 26,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-27",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_c3f76a685345f4a53109cc850df0e88c.jpg",
        "display_order": 27,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-28",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_bf449997662806482200eebb5fbc377c.jpg",
        "display_order": 28,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-29",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_96cb396fd2bae1976460b5943cc39b25.jpg",
        "display_order": 29,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-30",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_cbc69ce0f6c2793499ec840bab337f7c.jpg",
        "display_order": 30,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-31",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_1800061f25171d9a60f01e991bb6d55e.jpg",
        "display_order": 31,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-32",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_7ecc72763ed28d2ea4f70403e135e296.jpg",
        "display_order": 32,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-33",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_d4c9579dec7acaa02dca3258a18446eb.jpg",
        "display_order": 33,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-34",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_9fcbd709c5dad1920f816ef36c46af2c.jpg",
        "display_order": 34,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-35",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6be70be348e83c90cc81930ef247d948/photo_dc00ecfde7b5b7781a273c66fae2c053.jpg",
        "display_order": 35,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-217-36",
        "property_id": "prop-217",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_01e985fce7d09022bb76ed1b69920acc.jpg",
        "display_order": 36,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/pelissanne-centre-superbe-maison-de-charme-216m-hab-garage-45m-vastes-terrasses-et-piscine/217-maison"
  },
  
    {
    "id": "prop-216",
    "mandate_number": 234,
    "mandate_type": "exclusif",
    "mandate_date": "2025-05-19",
    "mandate_end_date": "2026-05-19",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "DEJA SOUS PROMESSE DE VENTE: EXCLUSIVITE A SALON CENTRE: BEL APPARTEMENT RENOVE T3 DANS RESIDENCE FERMEE SECUR",
    "property_type": "appartement",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 169900,
    "price_net_seller": 163104,
    "agency_fees_amount": 6796,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 66.0,
    "carrez_area": 66.0,
    "land_area": 0.0,
    "rooms_count": 3,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 40,
    "ges_letter": "D",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "DEJA SOUS PROMESSE DE VENTE: EXCLUSIVITE A SALON CENTRE\nAu coeur du dynamique centre ville de SALON DE PROVENCE, au calme, à proximité immédiate de toutes commodité, découvrez ce magnifique appartement de type 3, d'une surface habitable de 66m², entièrement rénové avec goût. Il est situé dans une résidence fermée avec de nombreuses facilités de stationnement sécurisé au quotidien.\nIl se compose d'une vaste pièce à vivre de 35m² comprenant une magnifique cuisine aménagée et équipée en 2021, parfaitement entretenue. Pour plus de confort, l'appartement est équipé d'une climatisation réversible et de menuiseries double vitrage, oscillo-battantes dans les chambres. De plus, une loggia ouverte de 3m² vous permettra de boire votre petit café ou d'étendre votre linge à l'air libre. Un cellier fermé attenant sera utile pour le rangement.\nL'espace nuit se compose de deux belles chambres de 10 et 12m² avec penderie pour l'une, dégagement avec placard, une magnifique salle d'eau refaite à neuf, ainsi que le WC indépendant.\nLe bien est en rez de chaussée sur élevé, ce qui lui confère une accessibilité pratique.\nLes charges sont très raisonnables compte tenu qu'elles comprennent notamment la consommation en eau de ville, l'entretien des espaces verts et des parties communes, ainsi que la fermeture de la résidence par portails automatiques.\nLa provision sur charges de l'exercice en court est de 106.59€ mensuelle, incluant le fonds travaux Loi Alur. Le dernier exercice clôturé connu s'élevait à 1211.50€ pour l'année complète 2024.\nCette résidence compte135 lots principaux et 19 lots annexes soit 164 lots en tout.\nPas de procédure en cour concernant cette copropriété.\nCe magnifique appartement est un tremplin idéal pour une première acquisition ou y passer une retraite active et paisible.\nDes lignes de bus régulières, la proximité des commerces et écoles, la facilité d'accès aux gares ferroviaires, routières ainsi que l'accès rapide aux entrées autoroute lui confère un emplacement privilégié.\nDPE:C établi le 21 08 2024 - Estimation des coûts annuels d'énergie du logement: entre 905 EUR et 1225EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCe joli bien vous est proposé au prix de 169 900€ honoraires d'agence inclus à la charge du VENDEUR de 4%TTC - MANDAT EXCLUSIF 234 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-05-19T10:00:00Z",
    "updated_at": "2025-11-20T16:00:00Z",
    "images": [
      {
        "id": "img-216-1",
        "property_id": "prop-216",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2344c4964449a9abce89f5d84d2fad02/photo_809577f516430f326a01e06446a58aa4.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-216-2",
        "property_id": "prop-216",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2344c4964449a9abce89f5d84d2fad02/photo_c70acce8b366998c97c7edc5ca448bfd.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-216-3",
        "property_id": "prop-216",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/addf4f0e21f3cb6defcd2218fa1bca92/photo_3fd983d48638528ae38d52ab3c922df2.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/deja-sous-promesse-de-vente-exclusivite-a-salon-centre-bel-appartement-renove-t3-dans-residence-fermee-secur/216-appartement"
  },
  
    {
    "id": "prop-215",
    "mandate_number": 230,
    "mandate_type": "exclusif",
    "mandate_date": "2025-01-15",
    "mandate_end_date": "2026-01-15",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "EXCLUSIVITE SOUS PROMESSE DE VENTE ! SALON DE PROVENCE - VIOUGUES: Maison au calme, 117m² sur 642m² de parcell",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 446500,
    "price_net_seller": 428640,
    "agency_fees_amount": 17860,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "acquereur",
    "living_area": 117.0,
    "carrez_area": 117.0,
    "land_area": 642.0,
    "rooms_count": 6,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE SOUS PROMESSE DE VENTE !\nAu coeur du quartier prisé des Hautes Viougues, découvrez en exclusivité NELL'IMMO cette agréable maison nichée sur 642m² clos et arboré.\nIci règne le calme, à environ 1km du dynamique centre de Salon de Provence et de toutes ses commodités.\nCette agréable maison offre une confortable surface habitable de 117m², répartie sur 2 niveaux.\nElle se compose d'une entrée, d'un salon séjour de 40m², d'une cuisine indépendante aménagée, d'une chambre en rez de chaussée avec salle d'eau, wc indépendant et nombreux rangements. A l'étage, 3 chambres dont deux avec placards allant de 11 à 12m², d'une grande salle de bains, d'un wc indépendant et dégagement avec placard.\nLe terrain de 642m² entièrement clôturé n'attend de belles plantations pour le magnifier! Ses beaux chênes verts et les murs en pierres sèches le bordant lui conférent déjà beaucoup de charme et d'authenticité. Il est agrémenté d'une piscine hors sol empierrée à ses abords, à remettre en état de fonctionnement.\nLe terrain dispose d'une résiduelle d'environ 80m² au besoin. Il serait possible d'envisager une dépendance, pour y loger la famille ou les amis.\nUn carpot de de 26m², deux locaux de 7m² chacun et un auvent seront indispensables pour le rangement et s'abriter du soleil cuisant estival.\nDécouvrez la en vidéo!\nDes lignes de bus régulières desservent le quartier, offrant ainsi beaucoup d'autonomie à ses habitants.\nSALON DE PROVENCE (13300), est une ville d’environ 45 000 habitants, située à 52 km de Marseille, à 35 km d'Aix-en-Provence, au carrefour des autoroutes A7 et A54. Elle dispose d’une gare ferroviaire et routière. La ville est dotée de crèches, d’écoles et de lycées.\nCe bien n'est pas en copropriété.\nDPE:C établi le 21 40 2026 - Estimation des coûts annuels d'énergie du logement: entre 1650 EUR et 2 270EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette belle maison vous est proposée au prix de 446 500€ honoraires d'agence inclus à la charge de l'ACQUEUR de 3.80%TTC SOIT 430 154€ NET VENDEUR- MANDAT 230 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-11-20T16:00:00Z",
    "images": [
      {
        "id": "img-215-1",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/773ae603cb7cfdc37fb0191e5516ad8e/photo_f947bdba5061aa60d1eebceba37d809a.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-215-2",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/773ae603cb7cfdc37fb0191e5516ad8e/photo_fa411a22453bad32cedcc21090b3d981.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-215-3",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/773ae603cb7cfdc37fb0191e5516ad8e/photo_361048079f94a8787e33f77a41c78727.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-215-4",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5a06795be1cd9f1b295c5284b284910c/photo_f149edf4450bc975f605a387517a8b3b.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-215-5",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-215-6",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_222ca6a252211d8c02585b155aaf69f6.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-215-7",
        "property_id": "prop-215",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0330bbfe48961bc4e8925c2ae3c29656/photo_bf73fad313d5e8db7421ec25b9c7dc81.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/exclusivite-sous-promesse-de-vente-salon-de-provence-viougues-maison-au-calme-117m-sur-642m-de-parcell/215-maison"
  },
  
    {
    "id": "prop-212",
    "mandate_number": 228,
    "mandate_type": "simple",
    "mandate_date": "2024-02-15",
    "mandate_end_date": "2025-02-15",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "PELISSANNE: Belle propriété de plain pieds, 210m² hab. sur 1500m² de terrain",
    "property_type": "terrain",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 699000,
    "price_net_seller": 671040,
    "agency_fees_amount": 27960,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 210.0,
    "carrez_area": 210.0,
    "land_area": 0.0,
    "rooms_count": 8,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Découvrez cette magnifique propriété, de plain pieds, nichée entre oliviers, chènes verts et pinède, dans un quartier recherché de PELISSANNE (13330).\nCette maison traditionnelle d'architecte, édifiée en 1992, offre au totale une confortable surface habitable de 208m² répartie comme suit: Sur la maison principale T6: 170m² habitables et 38m² pour le T2 indépendant attenant.\nElle est située au calme d’une impasse hors lotissement, dans un environnement privilégié, à proximité des collines du massif des Costes. Cette jolie maison soignée est dotée d’un jardin paysagé au sud avec vastes terrasses et piscine 8m x 4m, pool house, carport 2 véhicules, grande aire de stationnement au nord et ancien garage aménagé en atelier de 30m².\nLa maison principale se compose d'une vaste entrée avec porche, d'une salon séjour avec cheminée de 43m² et d'une cuisine aménagée et équipée de 16m², soit une surface de pièce à vivre de près de 60m². Ces pièces sont dotées de 3 climatisations réversibles récentes pour un confort optimal. Ensoleillées, elles ont toutes accès à la vaste terrasse bordant la piscine parfaitement entretenue. Côté nuit, une majestueuse suite parentale climatisée de 34m² avec sa grande salle de bains privative et son dressing. Puis, 3 chambres, une salle de bains, deux WC indépendants, une buanderie et un chaufferie viennent compléter le tout.\nSon charme est intemporel grâce à ses mallons de terre cuite de grande qualité au sol, sa belle hauteur sous plafond, ses poutres apparentes. De plus, sa qualité de construction traditionnelle est indéniable, doublage des murs intérieurs en briquette avec isolation, système de plancher chauffant par pompe à chaleur AIR AIR entretenu, vide sanitaire et comble accessible avec dalle béton.\nLe T2 attenant se compose d'une pièce avec cuisine aménagée et équipée, d'une chambre, d'une salle d'eau avec wc et dégagement. L'accès entre la maison principale et cette dépendance pourrait être à nouveau mis en service aisément.\nCes propriété sont rares, n'hésitez pas à me contacter et à consulter la VIDEO de ce bien exceptionnel.\nCe bien n'est pas en copropriété.\nDPE:C établi le 02 12 2024 - Estimation des coûts annuels d'énergie du logement: entre 1790 EUR et 2470EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette propriété vous est proposée au prix de 699 000€ honoraires d'agence inclus à la charge du VENDEUR de 2.72%TTC - MANDAT 228 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-02-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-212-1",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_971c996d6eb577699144f6b89af6cbd7.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-2",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_eabb0014797d66fd265833832ae6b4ed.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-3",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_241b9412049bfbb35239a1de0608441f.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-4",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_d9fdd76c5dcd252e78b5588a1618b34d.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-5",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_609301322c8291f7e8b1d5943bda70bb.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-6",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_e107ef9f20de122713b940cc9dd2da40.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-7",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_36188742ffb17a28152f26b7128cb540.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-8",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_7c9cccfbc134533054ef351bc4d94f05.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-9",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_03f6ada7ad8781d5c4fbc8e7423ac8da.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-10",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_8c23c3186f73ca6f924bc4e8da542ce7.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-11",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_d5074292929b9dac9a62c2ddd2fed186.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-12",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_3ecf363776ff515532867618d01b00c2.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-13",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_638498c4e6d802b9e69da1975016b9c3.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-14",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_775da2ca65c8f8bc209920bc7ae8e5a3.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-15",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_40d5bae1c9f79c69dfb99f16b9de3c04.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-16",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_26ccfa2c7ff63d26a7ea13b145e54bce.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-17",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_ad907c28a51f9e56b7e77b9a35e91093.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-18",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_c8722d0c8ad5342cb056348c945d445a.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-19",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_a01a2ead91a4ecc2971f2f2291613822.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-20",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_50af6d6f0de119b042225274b707bc16.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-21",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_d7e58047f91a374581276d66e5696250.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-22",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_e3c86706ffa922fed92c2f775b9627a1.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-23",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_825e41d6141bb5ea5335ca4211b33e68.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-24",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_845d1df58e5d038ca81c22e59aa89d09.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-25",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_aeb2a201a83d51c17d2f5362aec7df05.jpg",
        "display_order": 25,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-26",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_6b3dc262e54528047a892956f7b14725.jpg",
        "display_order": 26,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-27",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_087a7254a678587ea0c4499c215620f5.jpg",
        "display_order": 27,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-28",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_bc8271806204886be7ca4b1574374a1a.jpg",
        "display_order": 28,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-29",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_1c57bb8cc15102dc000415e9fca7b663.jpg",
        "display_order": 29,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-30",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_26dd657ba6a6fc0764356f3812993756.jpg",
        "display_order": 30,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-31",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_0f4e51555bb40f3c0bd0a3412f314911.jpg",
        "display_order": 31,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-32",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_d4c9579dec7acaa02dca3258a18446eb.jpg",
        "display_order": 32,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-33",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_27a445a82896deb83a1fcc766d30faf6.jpg",
        "display_order": 33,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-34",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_9fcbd709c5dad1920f816ef36c46af2c.jpg",
        "display_order": 34,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-212-35",
        "property_id": "prop-212",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a885bd818cea7a9cb1db7ffa090e608d/photo_1bd0dca3af4c480e63bb5cdd40e2f8ba.jpg",
        "display_order": 35,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/pelissanne-belle-propriete-de-plain-pieds-210m-hab-sur-1500m-de-terrain/212-maison"
  },
  
    {
    "id": "prop-208",
    "mandate_number": 226,
    "mandate_type": "simple",
    "mandate_date": "2024-09-15",
    "mandate_end_date": "2025-09-15",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON DE PROVENCE : DEJA SOUS PROMESSES DE VENTE Maison T5 de plain pieds sur près de 500m² avec piscine et ga",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 363300,
    "price_net_seller": 348768,
    "agency_fees_amount": 14532,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "acquereur",
    "living_area": 500.0,
    "carrez_area": 500.0,
    "land_area": 650.0,
    "rooms_count": 5,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "DEJA SOUS PROMESSE DE VENTE\nJolie maison de plain pieds située à 2km environ du dynamique centre ville de SALON DE PROVENCE.\nNichée sur une parcelle de près de 500m², agrémentée d'une piscine 8mx4m, au calme, elle offre une surface habitable d'environ 90m².\nAvec son garage attenant, elle ne manque pas de praticité. De plus, un sous sol d'environ 100m² pourrait être exploité pour les loisirs et en surface de stockage.\nElle se compose d'une entrée, d'un salon séjour de près de 30m², une cuisine attenante d'environ 12m², 3 chambres avec placards entre 10 et 12m², un bureau, une salle d'eau, un wc indépendant et dégagement avec placard.\nLe séjour dispose d'une climatisation réversible installée en 2025. Les menuiseries sont en double vitrage de qualité. Les volets roulants sont électriques. Les chambres sont équipées de moustiquaires. la cuisine est aménagée mais nécessitera une rénovation. Parquet flottant dans les chambres. Un marge receveur de douche a été installé pour plus de fonctionnalité dans la lumineuse salle d'eau. Elle dispose d'un système de chauffage central au gaz de ville. La chaudière à environ 10 ans. Ell est parfaitement entretenue et fonctionnelle.\nLe terrain est entièrement clôturé et dispose d'un portail automatique et d'un portillon avec interphone. Le jardin peut être arrosé par une réserve d'eau alimentée par un canal d'irrigation. Deux terrasses au Nord et Sud vous permettront de profiter ou de vous abriter de la chaleur estivale.\nDes lignes de bus régulières desservent le quartier, offrant ainsi beaucoup d'autonomie à ses habitants.\nSALON DE PROVENCE (13300), est une ville d’environ 45 000 habitants, située à 52 km de Marseille, à 35 km d'Aix-en-Provence, au carrefour des autoroutes A7 et A54. Elle dispose d’une gare ferroviaire et routière. La ville est dotée de crèches, d’écoles et de lycées.\nCe bien n'est pas en copropriété.\nDPE:D établi le 26 01 2026 - Estimation des coûts annuels d'énergie du logement: entre 2170 EUR et 2990EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette agréable maison vous est proposée au prix de 384 000€ honoraires d'agence inclus à la charge de l'ACQUEREUR de 3.79%TTC soit 370 000 euros hors honoraires de négociation- MANDAT226 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-09-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-208-1",
        "property_id": "prop-208",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0330bbfe48961bc4e8925c2ae3c29656/photo_bf73fad313d5e8db7421ec25b9c7dc81.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-208-2",
        "property_id": "prop-208",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0330bbfe48961bc4e8925c2ae3c29656/photo_7eda8f17d07c01b2b13ede62d13c7c08.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-208-3",
        "property_id": "prop-208",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5a06795be1cd9f1b295c5284b284910c/photo_f149edf4450bc975f605a387517a8b3b.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-208-4",
        "property_id": "prop-208",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-208-5",
        "property_id": "prop-208",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/7f707355aacb215876201347cedd56a0/photo_f005e17950cd69b485b2e0e186817122.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-208-6",
        "property_id": "prop-208",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_222ca6a252211d8c02585b155aaf69f6.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-de-provence-deja-sous-promesses-de-vente-maison-t5-de-plain-pieds-sur-pres-de-500m-avec-piscine-et-ga/208-maison"
  },
  
    {
    "id": "prop-205",
    "mandate_number": 223,
    "mandate_type": "exclusif",
    "mandate_date": "2024-06-15",
    "mandate_end_date": "2025-06-15",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "La Fare-les-Oliviers, Bouches-du-Rhône",
    "title": "DEJA SOUS PROMESSE DE VENTE LA FARE LES OLIVIERS: MAISON A RENOVER SUR ENVIRON 1900M² DE TERRAIN",
    "property_type": "terrain",
    "address": "Secteur La Fare-les-Oliviers",
    "postal_code": "13580",
    "city": "La Fare-les-Oliviers",
    "display_exact_address": false,
    "price_fai": 333000,
    "price_net_seller": 319680,
    "agency_fees_amount": 13320,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "acquereur",
    "living_area": 1900.0,
    "carrez_area": 1900.0,
    "land_area": 0.0,
    "rooms_count": 3,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "DEJA SOUS PROMESSE DE VENTE\nÀ la recherche d'un placement sûr ou d'un premier achat à personnaliser ? Découvrez cette rare opportunité nichée sur près de 1900m² de terrain, dans un environnement rare et recherché.\nConjuguez la douceur de vivre d'un village authentique avec une accessibilité remarquable, vous plaçant aux portes d'Aix-en-Provence et de sa gare TGV en moins de 20 minutes.\nCette maison de plain pieds, d'environ 90m² habitables avec garage attenant de 30m², nécessite des travaux et offre un fort potentiel de valorisation. Elle dispose actuellement d'une pièce à vivre de 44m², de deux chambres de 14m² et 12m², d'un bureau de 7m², d'une salle de bains et d'un wc indépendant.\nL'emprise au sol de 50% de la surface du terrain permet de réaliser des extensions si necessaire. Seule une habitation est autorisée sur cette parcelle. A l'heure actuelle, le morcellement ne sera pas possible pour une seconde habitation.\nLe bien est raccordé à un système d'assainissement non collectif (fosse septique), nécessitant des travaux de mise aux normes conformément aux normes actuelles en vigieur.\nLe bien est raccordé à l'eau de ville et au réseau d'électricité.\nEntre charme provençal et axes majeurs, La Fare-les-Oliviers offre une position stratégique. Parfaitement autonome, la commune facilite le quotidien familial grâce à ses établissements scolaires jusqu’au collège, ses nombreux commerces et un réseau de bus performant desservant les lycées et les pôles urbains alentours.\nCe bien constitue le lot N°2 sur deux lots de copropriété.\nDPE:D établi le 13 12 2025 - Estimation des coûts annuels d'énergie du logement: entre 1610 EUR et 2220 EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette belle opportunité vous est proposée au prix de 333 000€ honoraires d'agence inclus à la charge de L ACQUEREUR de 3.8%TTC , soit 320 809€ hors honoraires de négociation- MANDAT EXCLUSIF 223 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-06-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-205-1",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_a1cfc11590aa2d9e314bffd9254423b2.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-205-2",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_05264fd7bc744ee62585e4dec38c9e7c.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-205-3",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_bfbdf63d099e5d408b5d2947af9415e3.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-205-4",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5a06795be1cd9f1b295c5284b284910c/photo_f149edf4450bc975f605a387517a8b3b.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-205-5",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-205-6",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/7f707355aacb215876201347cedd56a0/photo_f005e17950cd69b485b2e0e186817122.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-205-7",
        "property_id": "prop-205",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_222ca6a252211d8c02585b155aaf69f6.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/18-la-fare-les-oliviers/deja-sous-promesse-de-vente-la-fare-les-oliviers-maison-a-renover-sur-environ-1900m-de-terrain/205-maison"
  },
  
    {
    "id": "prop-194",
    "mandate_number": 222,
    "mandate_type": "simple",
    "mandate_date": "2024-05-15",
    "mandate_end_date": "2025-05-15",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SOUS PROMESSE DE VENTE SALON PROCHE CENTRE: Maison au calme, 140m² hab. avec piscine",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 415000,
    "price_net_seller": 398400,
    "agency_fees_amount": 16600,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 140.0,
    "carrez_area": 140.0,
    "land_area": 650.0,
    "rooms_count": 7,
    "bedrooms_count": 5,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "SOUS PROMESSE DE VENTE\nAu calme et proche toutes commodités, découvrez cette maison familiale offrant 5 chambres et une belle surface habitable de près de 140m², sur 520m² de parcelle.\nElle offre de plain pied une pièce à vivre de près de 50m² agrémentée d'un espace cuisine aménagée et équipée, d'un séjour avec poêle à granulé et climatisation réversible. Attenant et cloisonnée au salon,une chambre de 9m² offre le potentiel d'augmenter d'autant sa surface séjour. De plus 3 spacieuses chambres avec placards et climatisées, entre 12 et 15m², deux salles d'eau avec wc, buanderie cellier attenante à la cuisine et au garage et une cave de 20m².\nA l'étage, une suite de 22m² avec salle d'eau privative et wc, profite d'une terrasse de plus de 20m² et d'un accès indépendant.\nLe terrain dispose de terrasses sud et Est spaceuse, d'un piscine 3.8 x7m et de points d'eau relié au forage.\nElle est équipée de 8 panneaux solaire pour de l'autoconsommation et revente du surplus.\nL'opportunité de vivre une vie familiale paisible, offrant une grande autonomie à vos enfants grâce à la proximité des bus, des gares ferroviaires et routières, des complexes sportifs et culturels, des écoles et commerces.\nCe bien n'est pas en copropriété.\nDPE:D établi le 24 02 2025 - Estimation des coûts annuels d'énergie du logement: entre 2285 EUR et 3092EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette maison familiale vous est proposée au prix de 415 000€ honoraires d'agence inclus à la charge du VENDEUR d'un montant de 14 000€ TTC - MANDAT 222 Apar Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-05-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-194-1",
        "property_id": "prop-194",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_222ca6a252211d8c02585b155aaf69f6.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-194-2",
        "property_id": "prop-194",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_ad22e4e590700c1b3cac217d1a808269.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-194-3",
        "property_id": "prop-194",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5a06795be1cd9f1b295c5284b284910c/photo_f149edf4450bc975f605a387517a8b3b.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-194-4",
        "property_id": "prop-194",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-194-5",
        "property_id": "prop-194",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_a1cfc11590aa2d9e314bffd9254423b2.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-194-6",
        "property_id": "prop-194",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0330bbfe48961bc4e8925c2ae3c29656/photo_bf73fad313d5e8db7421ec25b9c7dc81.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/sous-promesse-de-vente-salon-proche-centre-maison-au-calme-140m-hab-avec-piscine/194-maison"
  },
  
    {
    "id": "prop-221",
    "mandate_number": 221,
    "mandate_type": "exclusif",
    "mandate_date": "2024-04-15",
    "mandate_end_date": "2025-04-15",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "EXCLUSIVITE A SALON CENTRE: BEL APPARTEMENT RENOVE T2 DANS RESIDENCE FERMEE SECURISEE",
    "property_type": "appartement",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 154000,
    "price_net_seller": 147840,
    "agency_fees_amount": 6160,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 52.0,
    "carrez_area": 52.0,
    "land_area": 0.0,
    "rooms_count": 2,
    "bedrooms_count": 1,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 40,
    "ges_letter": "D",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "IDEAL INVESTISSEUR\nPrès de 6% de rentabilité brute\nAu coeur du dynamique centre ville de SALON DE PROVENCE, au calme, à proximité immédiate de toutes commodités, découvrez ce magnifique appartement de type 2, d'une surface habitable de 52m², entièrement rénové avec goût. Il est situé dans une résidence fermée avec de nombreuses facilités de stationnement sécurisé au quotidien.\nTraversant Est/Ouest et situé au 4ème et dernier étage desservit par ascenseur, il est baigné de lumière.\nIl se compose d'une entrée avec rangements, d'un salon climatisé bénéficiant d'un grand balcon avec vue dominante, notamment sur la Collégiale St Laurent. Sa cuisine ouverte parfaitement aménagée et équipée est un bijou d'esthétisme, agrémentée d'une grande buanderie et d'une loggia fermée attenantes. Sa chambre climatiée de 12m² avec rangement a un accès directe sur le balcon grâce à sa porte fenêtre oscillobattante. Une salle d'eau rénovée avec wc vient compléter le tout.\nCet appartement est parfaitement entretenu par sa locataire. Son bail d'habitation non meublé a pris effet le 1er juillet 2024. Son loyer mensuel s'élève à 735€ auxquels s'ajoutent 55€ de provisions sur charges. une rentabilité brute de 5.61% pour un appartement entièrement rénové, avec des prestations recherchées (centre ville, résidence fermée sécurisée avec beaucoup d'emplacements de parking, excellent état, grand balcon, vue dominante, au calme, faibles charges...)\nLes charges sont très raisonnables compte tenu qu'elles comprennent notamment la consommation en eau de ville, l'entretien des espaces verts et des parties communes, ainsi que la fermeture de la résidence par portails automatiques et l'ascenseur.\nLa provision sur charges de l'exercice en court est de 111.57€ mensuelle, incluant le fonds travaux Loi Alur. Le dernier exercice clôturé connu s'élevait à 1303.46€ pour l'année complète 2024, dont 853.23€ récupérables.\nCette résidence compte135 lots principaux et 19 lots annexes soit 154 lots en tout.\nPas de procédure en cour concernant cette copropriété.\nCe magnifique appartement est un idéal pour un placement locatif et y envisager un jour de passer une retraite active et paisible.\nDes lignes de bus régulières, la proximité des commerces et écoles, la facilité d'accès aux gares ferroviaires, routières ainsi que l'accès rapide aux entrées autoroute lui confère un emplacement privilégié.\nDPE:C établi le 19 05 2026 - Estimation des coûts annuels d'énergie du logement: entre 890 EUR et 1290EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCe bel investissement vous est proposé au prix de 154 000€ honoraires d'agence inclus à la charge du VENDEUR de 4%TTC - MANDAT SUCCES 238 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Garage / Parking",
      "Climatisation réversible",
      "Environnement calme",
      "Vue dominante",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-04-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-221-1",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_e5d5752bada707c7f814653bab2705d8.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-2",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_d5fe04e1287f56e1a8d436c085f51f6b.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-3",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_c0a6fd8f6b635acbdd05405089deb3cc.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-4",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_5d0ddda6f7c9b1532fdf5f3678bb1673.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-5",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_28d21f3e38bb80473de1136cc1ff71ff.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-6",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_8e940e901afe6962542acbad33f0de2d.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-7",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_e4689c509b51d5e281ef56aff96224f4.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-8",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_3fde46f86b94eff308ab1728b73a3461.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-221-9",
        "property_id": "prop-221",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d1a5a4ef7fc0dcece6b0c5caef4b17b1/photo_062cf53c6f19e3bc7c12d4aa52c5791c.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/exclusivite-a-salon-centre-bel-appartement-renove-t2-dans-residence-fermee-securisee/221-appartement"
  },
  
    {
    "id": "prop-214",
    "mandate_number": 214,
    "mandate_type": "exclusif",
    "mandate_date": "2024-06-15",
    "mandate_end_date": "2025-06-15",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON DE PROVENCE: SALON DE PROVENCE - EXCLUSIVITE DEJA SOUS PROMESSE DE VENTE : Jolie maison T4 de plain pie",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 469000,
    "price_net_seller": 450240,
    "agency_fees_amount": 18760,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 600.0,
    "carrez_area": 600.0,
    "land_area": 650.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 300,
    "dpe_letter": "E",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE DEJA VENDU A SALON DE PROVENCE : Jolie maison T4 de plain pieds.\nEdifiée en 2001, cette élégante maison au style épuré est située à 2km environ du dynamique centre ville de SALON DE PROVENCE.\nNichée sur une parcelle de près de 600m² au calme, elle offre une surface habitable de 114m²\nQuel bonheur de participer à la concrétisation de vos projets!\nUn grand remerciement à mon client VENDEUR pour m'avoir fait confiance à nouveau ! Ainsi qu'à mes clients acquéreurs heureux propriétaires de cette superbe maison !!!!\nJe vous souhaite à tous beaucoup de bonheur!\nLes avantages NELL'IMMO:\n- Réactivité et dynamisme\n- Honoraires ultras compétitifs entre 3 et 4% TTC à partir de 150 000€\n- Mise en lumière de vos biens par des vidéos de qualités\n- Diffusion de vos biens sur les sites spécialisés les plus consultés.\n- Conseils avisés grâce aux 21 années d'expériences en immobilier de Nelly sur le secteur salonais\n- Contactez moi pour une estimation, elle ne vous coutera qu'un café tout au plus!\nAlors à bientôt!\nTEL : 07 55 68 61 09\nMAIL : nellimmo.acte@gmail.com\nSITE : www.nellimmo.fr\nCette jolie maison a été vendu par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Terrasse",
      "Jardin",
      "Plain-pied",
      "Environnement calme"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-06-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-214-1",
        "property_id": "prop-214",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/21515c6b3eaf04a621c18f275649218d/photo_fa22bb416291a5b78c3e24649d174c6d.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-214-2",
        "property_id": "prop-214",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/77f43f599db60a53f9efb1003ca424ea/photo_039476c39490594cea9fdc3d99483161.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-214-3",
        "property_id": "prop-214",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/1537d3a0cd5e63905d82af5bb53ac613/photo_579ef131abb26fe4ea831b179a45c132.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-214-4",
        "property_id": "prop-214",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/736efe0910fd65a1ff90a242875e6388/photo_cadd58fd8a556f80359394d6a046608e.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-214-5",
        "property_id": "prop-214",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/480be0e29d3d96e1a4c5d3b44e87f757/photo_439ede5141d78c9ad9a2717c7826cde9.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-de-provence-salon-de-provence-exclusivite-deja-sous-promesse-de-vente-jolie-maison-t4-de-plain-pie/214-maison"
  },
  
    {
    "id": "prop-213",
    "mandate_number": 213,
    "mandate_type": "exclusif",
    "mandate_date": "2024-05-15",
    "mandate_end_date": "2025-05-15",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON DE PROVENCE: TERRAIN A BATIR 920M² VIABILISE PERMIS ACCORDE",
    "property_type": "terrain",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 279000,
    "price_net_seller": 267840,
    "agency_fees_amount": 11160,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 920.0,
    "carrez_area": 920.0,
    "land_area": 0.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 45,
    "dpe_letter": "A",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Exceptionnel: Découvrez en exclusivité Nell'Immo ce magnifique terrain à bâtir plat, viabilisé, d'une surface de 920m². \nIl est situé à 2km de l'hyper centre de la dynamique ville de SALON DE PROVENCE, parfaitement desservit par les réseaux de bus.\nLes accès aux gares ferroviaires et routières seront aisés, ainsi que pour rejoindre rapidement, même aux heures de pointes, les axes autoroutiers.\nCette jolie parcelle arborée se situe en zone UD4 soit une emprise au sol autorisée de 60%. Un permis de construire a déjà été obtenu et purgé de tous recours pour y édifier une maison individuellen en R+1, d'une surface habitable de 98.51m². Judicieusement implantée au plus près de la limite nord de la parcelle et disposant d'une belle aire de stationnement, restera 753m² dédié à l'espace jardin verdoyant.\nIl est prévu un vide sanitaire de 60cm partiellement entérré. Le bien est hors lotissement et n'est pas situé en zone inondable.\nCe bien n'est pas en copropriété.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette magnifique parcelle vous est proposée au prix de 279 000€ honoraires d'agence inclus à la charge du VENDEUR de 3.58%TTC - MANDAT EXCLUSIF N° 229par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Garage / Parking",
      "Jardin"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-05-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-213-1",
        "property_id": "prop-213",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a28428320cc393966e490d524089d8ec/photo_9ec2b42db727ffd4aed20d08170a70e3.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-213-2",
        "property_id": "prop-213",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a28428320cc393966e490d524089d8ec/photo_b053012cdcf45ad8220c2904afeffdfb.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-213-3",
        "property_id": "prop-213",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a28428320cc393966e490d524089d8ec/photo_6b4c85b54149b43de4b29bfa785380ee.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-213-4",
        "property_id": "prop-213",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a28428320cc393966e490d524089d8ec/photo_6a6f48c95429055bb7b8f1d9c79227df.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-213-5",
        "property_id": "prop-213",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a28428320cc393966e490d524089d8ec/photo_73fc643e39ad9c8f3bb125c25f44a5bb.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-213-6",
        "property_id": "prop-213",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/9a0b49224ebbb0bf0166c35253d7baee/photo_634fa316ad725988fcab7c6f91589299.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-de-provence-terrain-a-batir-920m-viabilise-permis-accorde/213-terrain-a-batir"
  },
  
    {
    "id": "prop-196",
    "mandate_number": 210,
    "mandate_type": "simple",
    "mandate_date": "2024-02-15",
    "mandate_end_date": "2025-02-15",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SALON CENTRE: Exceptionnelle Maison du XIXème piscine jardin garage",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 599000,
    "price_net_seller": 575040,
    "agency_fees_amount": 23960,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 253.0,
    "carrez_area": 253.0,
    "land_area": 650.0,
    "rooms_count": 8,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 65,
    "ges_letter": "E",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "C'est un bien rare d'une exceptionnelle beauté, typique de l'époque bénie de la fin du XIXème siècle.\nCette maison familiale offre une surface confortable surface habitable de 253m². De plus, elle est dotée d'un garage de 71m², de 2 terrasses de 40m² environ, d'un jardin et d'une piscine.\nAu coeur du centre ville, dans un secteur calme et privilégié, à deux pas des écoles privées, collèges et lycées et biensur de toutes les commodités qu'offre la dynamique ville de SALON DE PROVENCE.\nLes hauteurs sous plafonds sont impresionnantes: près de 5m pour le garage et 3.50 pour le 1er étage. Les tommettes sont parfaitement conservées. Les menuiseries sont en double vitrage. La porte de garage est automatique, impératif en centre ville. Le chauffage central au gaz de ville ne présente aucune anomalie dans le rapport de diagnostique.\nElle se compose d'une jolie entrée, typique de sa belle époque de construction, avec des éléments parfaitement conservés tels que ses carreaux de ciments ou sa superbe montée d'escalier, sous laquelle on trouvera un grand rangement, l'accès à une cave , à l'immense garage de 71m² et à un studio de 40m².\nAu 1er étage, baigné de lumière, un joli palier dessert un salon séjour de près de 40m² doté d'une cheminée, une cuisine ouvrant sur une vaste terrasse de 40m² avec une vue incroyable à l'Est, idéale pour en profiter notamment à la saison estivale. Puis une suite parentale de 22m² avec placard, salle de bains privative et son wc, 2 chambres de 14m² avec placards, une salle de bains, wc et dégagement\nAu 2ème et dernier étage, une chambre mansardée de 25m² habitables (40m² au sol) avec sa douche et 2 jolies chambres d'environ 15m² viennent compléter l'ensemble.\nA l'extérieur, la terrasse du 1er ou par le demi niveau supérieur de l'entrée donnent accès au jardin et sa seconde terrasse de 40m² environ. Vous profiterez d'un joli jardin bucolique avec une vue sur sa piscine 7mx3.5m, rare en centre ville. Une vaste buanderie chaufferie et un cellier complètent ce niveau.\nCette maison au charme typiquement provençale, dans ce secteur calme et recherché offre une incroyable opportunité d'offrir un cadre de vie idéal à votre famille, à offrir une autonomie certaine à vos enfants et ainsi vous dégagez un maximum de temps pour vous et vos proches au quotidien.\nCe bien n'est pas en copropriété.\nDPE:C établi le 22 05 2025 - Estimation des coûts annuels d'énergie du logement: entre 2900 EUR et 3970EUR par an (Prix moyens des énergies indexés sur les années 2021, 2022 et 2023 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCette maison familiale vous est proposée au prix de 599 000€ honoraires d'agence inclus à la charge du VENDEUR de 3.12%TTC - MANDAT 210 AVENANT 217 par Nelly FERNANDEZ, agent immobilier indépendant, porteuse de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2024-02-15T10:00:00Z",
    "updated_at": "2025-05-10T12:00:00Z",
    "images": [
      {
        "id": "img-196-1",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_d4c9579dec7acaa02dca3258a18446eb.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-2",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_ce25a262ae822a803f518e24aa4f2910.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-3",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_35c236db7a9ba03eac4f9abab2379cf6.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-4",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_ab11289b78008ff80de73de3e272543a.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-5",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_363faf9c509bf54c456ee8c492607753.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-6",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_b1fe006d21571e800e3de5a0edce656f.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-7",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_734378705569210d976aad47d918767b.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-8",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_dcaabd56ccee173b0b4fc48abb2c357c.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-9",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_adbbd45635fb350aee321a67346fdd02.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-10",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_efbb9eb684e5ee34192831d091400b99.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-11",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_e2ab12e131ac87c67ffdf69d6509199a.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-12",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_35f93f456cccf1f83e84dfd6d8154f6a.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-13",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_5d46a2e769e7abe4a912f688fff7c624.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-14",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_0ccb138952cac5c895b5c700f1baa7d1.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-15",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_423ea52a779e3c94b2414041ff18a8cb.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-16",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_18fb2ac3fd0c44a9b7038bfdd76c3391.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-17",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_df975b32ea4c705566b2de65dcd526f1.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-18",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_3fb7c8d563a3a473e1423c1eb9a2bd9a.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-19",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_c80928c9229f4506b0365bf717596d99.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-20",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_f78bdc96609a0b69ba557059d594a232.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-21",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_5883a20f594cfc11f13bbf85d94be6fe.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-22",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_349e1a24098a8dc16e99471ab36981fe.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-23",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/8b0a06d102bdaf7f085c08f4c271528f/photo_a24eb7b3392c8cb839b644f56ca6a511.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-24",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/dac4eae96c2413843bf685257adc2238/photo_971c996d6eb577699144f6b89af6cbd7.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-25",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6ab5c3546e064c9c0b3487d419af56f7/photo_27a445a82896deb83a1fcc766d30faf6.jpg",
        "display_order": 25,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-26",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0cddb82a9b7e2d50a1a81b1616c036b4/photo_9fcbd709c5dad1920f816ef36c46af2c.jpg",
        "display_order": 26,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-196-27",
        "property_id": "prop-196",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ad7e5c4971539f6d5b32210ddd8e7cbd/photo_01e985fce7d09022bb76ed1b69920acc.jpg",
        "display_order": 27,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/salon-centre-exceptionnelle-maison-du-xixeme-piscine-jardin-garage/196-maison"
  },
  
    {
    "id": "prop-165",
    "mandate_number": 165,
    "mandate_type": "exclusif",
    "mandate_date": "2023-11-10",
    "mandate_end_date": "2024-11-10",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "SOUS PROMESSE DE VENTE A PELISSANNE: Maison T5 au calme sur 1055m² de parcelle",
    "property_type": "maison",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 300000,
    "price_net_seller": 288000,
    "agency_fees_amount": 12000,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "acquereur",
    "living_area": 1055.0,
    "carrez_area": 1055.0,
    "land_area": 650.0,
    "rooms_count": 5,
    "bedrooms_count": 4,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "SOUS PROMESSE DE VENTE D ACHAT A PELISSANNE\nMaison de plain pieds édifiée en 1958, d'une surface habitable de 98m² sur une belle parcelle au calme arborée.\nElle se compose d'un salon séjour, d'une cuisine séparée par cloison, de 4 chambres de belle tailles, de nombreux rangements, d'une salle d'eau, d'un wc indépendant et dégagement.\nEntre colline et centre, l'école et le collège sont accessibles à pieds pour une vie de famille paisible.\nLa maison nécessite quelques travaux d'amélioration.\nUne belle opportunité de devenir propriétaire dans notre magnifique village.\nSa parcelle dipose d'une emprise au sol résiduelle importante (CES: 30%)\nCe bien n'est pas en copropriété.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nLe prix est fixé à 300 000 € comprenant les honoraires de négociation de 3.8%TTC à la charge de l'ACQUEREUR dans le cadre du mandat de vente NELL'IMMO numéro 184, soit 289 017.35€ net vendeur auxquels s'ajoutent les honoraires de négociation de 3.8% TTC\nCette belle opportunité vous est proposée par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction no1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL'IMMO au capital social de 2000EUR, enregistrée au RCS de SALON DE PCE no 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 - MAIL : nellimmo.acte@gmail.com- SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Plain-pied",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2023-11-10T10:00:00Z",
    "updated_at": "2024-06-20T10:00:00Z",
    "images": [
      {
        "id": "img-165-1",
        "property_id": "prop-165",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/7f707355aacb215876201347cedd56a0/photo_f005e17950cd69b485b2e0e186817122.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-165-2",
        "property_id": "prop-165",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_44af6f635bb6a90c55a819becf5ce10d.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-165-3",
        "property_id": "prop-165",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-165-4",
        "property_id": "prop-165",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_a1cfc11590aa2d9e314bffd9254423b2.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-165-5",
        "property_id": "prop-165",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/0330bbfe48961bc4e8925c2ae3c29656/photo_bf73fad313d5e8db7421ec25b9c7dc81.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/sous-promesse-de-vente-a-pelissanne-maison-t5-au-calme-sur-1055m-de-parcelle/165-maison"
  },
  
    {
    "id": "prop-161",
    "mandate_number": 161,
    "mandate_type": "exclusif",
    "mandate_date": "2023-11-10",
    "mandate_end_date": "2024-11-10",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "PELISSANNE EXCLUSIVITE SOUS OFFRE D ACHAT: TERRAIN A BATIR 1289M² AU CALME",
    "property_type": "terrain",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 269880,
    "price_net_seller": 259085,
    "agency_fees_amount": 10795,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "acquereur",
    "living_area": 1289.0,
    "carrez_area": 1289.0,
    "land_area": 0.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Exclusivité Nell'Immo DEJA SOUS OFFRE D ACHAT ce magnifique terrain à bâtir de 1289m², au calme, en zone UCb.\nIl est situé dans un quartier calme, entre colline et centre ville. Le terrain est arboré d'arbres majestueux et bordé par un canal destiné à l'arrosage.\nCoefficient d'emprise au sol 30%\nEmprise au sol maximale potentielle 386.70m²\nHauteur maximum des bâtiment R+1 soit 7m.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nLe prix est fixé à 269880 € comprenant les honoraires de négociation de 3.8%TTC à la charge de L 'ACQUEREUR dans le cadre du mandat de vente exclusif NELL'IMMO numéro 185 avenant n°219, soit 260 000€ net vendeur auxquelq s'ajoutent les honoraires de négociation d'un montant de 9880€ TTC.\nCe terrain exceptionnel vous est proposé par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction no1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL'IMMO au capital social de 2000EUR, enregistrée au RCS de SALON DE PCE no 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 - MAIL : nellimmo.acte@gmail.com- SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Jardin",
      "Environnement calme"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2023-11-10T10:00:00Z",
    "updated_at": "2024-06-20T10:00:00Z",
    "images": [
      {
        "id": "img-161-1",
        "property_id": "prop-161",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5956e2f39fd3bd9fe251f514a7e0cae4/photo_ab01c6e1a34672414f065bfb7906d0f7.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/pelissanne-exclusivite-sous-offre-d-achat-terrain-a-batir-1289m-au-calme/161-terrain-a-batir"
  },
  
    {
    "id": "prop-159",
    "mandate_number": 159,
    "mandate_type": "exclusif",
    "mandate_date": "2023-11-10",
    "mandate_end_date": "2024-11-10",
    "status": "vendu",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "VENDU AU PRIX! A PELISSANNE: Superbe maison T5 édifiée en 2020 avec piscine et garage",
    "property_type": "maison",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 675000,
    "price_net_seller": 648000,
    "agency_fees_amount": 27000,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "acquereur",
    "living_area": 138.0,
    "carrez_area": 138.0,
    "land_area": 650.0,
    "rooms_count": 5,
    "bedrooms_count": 4,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 530,
    "energy_cost_max": 800,
    "description": "EXCLUSIVITE VENDUE A PELISSANNE QUARTIER DE LA BOULIE: Superbe maison récente sans négociation en 11 jours de visites !\nJe suis comblée d'avoir pu participer à mon échelle à la nouvelle de vie de cet adorable jeune couple!\nC'est avec une grande émotion que j'ai dit au revoir à mes clients vendeur qui m'ont accordé leur confiance pour la 3ème fois dans leurs projets immobiliers.\nMaintenant, il s'en vont dans une autre région où j'irais leur rendre visite!!!\nEncore merci aux vendeurs et acquéreurs pour leurs confiances et leurs sourires!\nLes avantages NELL'IMMO:\n- Réactivité et dynamisme\n- Honoraires ultras compétitifs entre 3 et 4% TTC à partir de 150 000€\n- Mise en lumière de vos biens par des vidéos de qualités\n- Diffusion de vos biens sur les sites spécialisés les plus consultés.\n- Conseils avisés grâce aux 21 années d'expériences en immobilier de Nelly sur le secteur salonais\n- Contactez moi pour une estimation, elle ne vous coutera qu'un café tout au plus!\nAlors à bientôt!\nTEL : 07 55 68 61 09\nMAIL : nellimmo.acte@gmail.com\nSITE : www.nellimmo.fr\nCette magnifique maison récentea été vendue par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2023-11-10T10:00:00Z",
    "updated_at": "2024-06-20T10:00:00Z",
    "images": [
      {
        "id": "img-159-1",
        "property_id": "prop-159",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/6986221466c5587f26e9d4f7dc6460f2/photo_36e9a59d67d039106e4485201f30e265.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-159-2",
        "property_id": "prop-159",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/959d3437114b074a2cfea27ab8240b4a/photo_215b4656af9b766cff86071389bdc770.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-159-3",
        "property_id": "prop-159",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/aa5d522818aeb5ade8fd8e59600e3c43/photo_531c1721f6ed75d40dd24feb3299fa69.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-159-4",
        "property_id": "prop-159",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/1537d3a0cd5e63905d82af5bb53ac613/photo_579ef131abb26fe4ea831b179a45c132.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-159-5",
        "property_id": "prop-159",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/736efe0910fd65a1ff90a242875e6388/photo_cadd58fd8a556f80359394d6a046608e.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/vendu-au-prix-a-pelissanne-superbe-maison-t5-edifiee-en-2020-avec-piscine-et-garage/159-maison"
  },
  
    {
    "id": "prop-153",
    "mandate_number": 153,
    "mandate_type": "exclusif",
    "mandate_date": "2023-11-10",
    "mandate_end_date": "2024-11-10",
    "status": "vendu",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "PELISSANNE EXCLUSIVITE VENDUE : Superbe maison style bastide édifiée en 2012",
    "property_type": "maison",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 645000,
    "price_net_seller": 619200,
    "agency_fees_amount": 25800,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 150.0,
    "carrez_area": 150.0,
    "land_area": 650.0,
    "rooms_count": 5,
    "bedrooms_count": 4,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE VENDUE !\nA un adorable jeune couple et leur joile petite fille! Encore merci aux vendeurs et acquéreurs pour leurs confiances et leurs sourires!\nCette superbe maipropriété a été vendu par Nelly, votre agent immobilier indépendant à PELISSANNE.\nLes avantages NELL'IMMO:\n- Réactivité et dynamisme\n- Honoraires ultras compétitifs entre 3 et 4% TTC à partir de 150 000€\n- Mise en lumière de vos biens par des vidéos de qualités\n- Diffusion de vos biens sur les sites spécialisés les plus consultés.\n- Conseils avisés grâce aux 20 années d'expériences en immobilier de Nelly sur le secteur salonais\n- Contactez moi pour une estimation, elle ne vous coutera qu'un café tout au plus!\nAlors à bientôt!\nTEL : 07 55 68 61 09\nMAIL : nellimmo.acte@gmail.com\nSITE : www.nellimmo.fr\nNelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2023-11-10T10:00:00Z",
    "updated_at": "2024-06-20T10:00:00Z",
    "images": [
      {
        "id": "img-153-1",
        "property_id": "prop-153",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/b6b07856093c52298cb0937421b0323a/photo_efc242cec63a8a5f1c759cfce58db821.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-153-2",
        "property_id": "prop-153",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/959d3437114b074a2cfea27ab8240b4a/photo_215b4656af9b766cff86071389bdc770.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-153-3",
        "property_id": "prop-153",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/aa5d522818aeb5ade8fd8e59600e3c43/photo_531c1721f6ed75d40dd24feb3299fa69.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-153-4",
        "property_id": "prop-153",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/1537d3a0cd5e63905d82af5bb53ac613/photo_579ef131abb26fe4ea831b179a45c132.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-153-5",
        "property_id": "prop-153",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/736efe0910fd65a1ff90a242875e6388/photo_cadd58fd8a556f80359394d6a046608e.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/pelissanne-exclusivite-vendue-superbe-maison-style-bastide-edifiee-en-2012/153-maison"
  },
  
    {
    "id": "prop-152",
    "mandate_number": 152,
    "mandate_type": "exclusif",
    "mandate_date": "2023-11-10",
    "mandate_end_date": "2024-11-10",
    "status": "vendu",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "EXCLUSIVITE VENDUE A SALON DE PROVENCE",
    "property_type": "maison",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 345000,
    "price_net_seller": 331200,
    "agency_fees_amount": 13800,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 97.1,
    "carrez_area": 97.1,
    "land_area": 650.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE VENDUE SANS NEGOCIATION EN 1 SEMAINE PAR UNE ADORABLE FAMILLE! \nEncore merci aux vendeurs et acquéreurs pour leurs confiances et leurs sourires! \nCette jolie maison de lotissement est située au calme.\nLes avantages NELL'IMMO: \n- Réactivité et dynamisme \n- Honoraires ultras compétitifs entre 3 et 4% TTC à partir de 150 000€ \n- Mise en lumière de vos biens par des vidéos de qualités \n- Diffusion de vos biens sur les sites spécialisés les plus consultés. \n- Conseils avisés grâce à plus de 20 années d'expériences en immobilier de Nelly sur le secteur salonais \n- Contactez moi pour une estimation, elle ne vous coutera qu'un café tout au plus! \nAlors à bientôt! \nTEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr \nCette maison a été vendue par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Environnement calme",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2023-11-10T10:00:00Z",
    "updated_at": "2024-06-20T10:00:00Z",
    "images": [
      {
        "id": "img-152-1",
        "property_id": "prop-152",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-152-2",
        "property_id": "prop-152",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5a06795be1cd9f1b295c5284b284910c/photo_f149edf4450bc975f605a387517a8b3b.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-152-3",
        "property_id": "prop-152",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/7f707355aacb215876201347cedd56a0/photo_f005e17950cd69b485b2e0e186817122.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-152-4",
        "property_id": "prop-152",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_222ca6a252211d8c02585b155aaf69f6.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-152-5",
        "property_id": "prop-152",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_a1cfc11590aa2d9e314bffd9254423b2.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/exclusivite-vendue-a-salon-de-provence/152-maison"
  },
  
    {
    "id": "prop-142",
    "mandate_number": 142,
    "mandate_type": "simple",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Éguilles, Bouches-du-Rhône",
    "title": "OPPORTUNITE A EGUILLES: Villa 123m² habitables achevée en 2024",
    "property_type": "maison",
    "address": "Secteur Éguilles",
    "postal_code": "13510",
    "city": "Éguilles",
    "display_exact_address": false,
    "price_fai": 820000,
    "price_net_seller": 787200,
    "agency_fees_amount": 32800,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 123.0,
    "carrez_area": 123.0,
    "land_area": 650.0,
    "rooms_count": 5,
    "bedrooms_count": 4,
    "bathrooms_count": 1,
    "dpe_value": 45,
    "dpe_letter": "A",
    "ges_value": 9,
    "ges_letter": "B",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Vous tomberez sous le charme de cettee jolie maison contemporaine en cours de finition, nichée sur 781m² de parcelle livrée clôturée, piscinable, à l'arrosage intégré.\nAchevée en 2024, elle dispose de garanties décennale et droits d'enregistrement réduits.\nVous serez séduits par sa grande luminosité et ses élégants matériaux de belle qualité.\nSituée dans le réputé et paisible village d'Eguilles (13510), à 10min en voiture du joyaux qu'est la citée d' AIX EN ROVENCE.\nVos enfants seront pleinement autonomes grâce à l'arrêt de bus pour Aix en Provence à deux pas, ainsi qu'une sécurisante piste cyclable toute proche, pour se rendre au centre du village.\nCette belle villa dispose d'une pièce à vivre de 44m², bénéficiant d'une triple exposition, de larges baies dont une à galandage, offrant ainsi une grande fonctionnalité pour accéder sur différents espaces extérieurs. Notamment sa jolie terrasse carrelée exposée Sud Est qui sera dotée d'une pergola où l'on imagine aisément dans son prolongement profiter d'une vue sur l'espace piscine, face à sa cuisine d'été et la suite parentale du rez de chaussée.\nL'implantation de votre future piscine sera souise à l'obtention des autorisations d'urbanisme nécessaires.\nCôté stationnement, un carport pouvant accueillir deux véhicules est prévu. La maison sera livrée avec une parcelle clôturée et son portail.\nAu rez de chaussée, une suite parentale est dotée d'un espace dressing, suivi d'une salle d'eau avec meuble vasque, d'un wc indépendant et de nombreux rangement. Ce niveau est principalement revêtu d'un magnifique carrelage au tons pierre clair, d'un effet très naturel.\nA l'étage : trois autres chambres de belles tailles avec placards, une grande salle de bains équipée d'une baigoire, d'une douche et et son meuble double vasque, ainsi qu'un WC indépendant viennent compléter l'ensemble. Ce niveau est revêtu d'un magnifique carrelage à effet parquet.\nNotez que cette propriété dispose d'un système performant de type plancher chauffant raffraichissant par pompe à chaleur, de menuiseries aluminium haut de gamme avec volets roulants électriques centralisés, ainsi qu'un bel espace dédié au stationnement.\nCette agréable propriété est située à environ 10 minutes en voiture ou bus des collèges ou lycées d'Aix en Provence les plus proches, au cœur d'un village bénéficiant de toutes les commodités (boulangeries, boucherie, pharmacie, médecins, école, ). A découvrir sans tarder!\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nCe bien n'est pas en copropriété.\nLe prix est fixé à 820 000€ comprenant les honoraires de négociation de 2.44% TTC à la charge du VENDEUR dans le cadre du mandat de vente NELL'IMMO REFERENCE 172\nCette villa contemporaine vous est proposée par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction no1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL'IMMO au capital social de 2000EUR, enregistrée au RCS de SALON DE PCE no 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 - MAIL : nellimmo.acte@gmail.com- SITE : www.nellimmo.fr\nA bientôt!",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-142-1",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_62aa658ec878aa099d4ab15d04cf7b0c.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-2",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_b785ce9c4ec22745bee6cf3817df7494.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-3",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_6a2c66009f144a0c444a5891034f50ae.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-4",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_0b5e4c5d18e6fedb8d18d38f2adb3828.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-5",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_d71c51bd5584c2f59dbdea457dcc9da1.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-6",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_9bc43ceaf654327f4862c3b367d1db2b.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-7",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_e8d69fa1f26b1fee914fd364413bee3b.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-8",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_c3b11b5a60f216684a23d518b35ec01e.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-9",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_d527842096a29569d151e75a9f4d6a9c.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-10",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_9409b474ad77133ecb94cd5fb48ef9a9.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-11",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_1850d37d31036475595720f4419f86c9.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-12",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_c778bb9002f0aa18fe4d8433a50d591e.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-13",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_01845584d4da2121c934b48649ca6500.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-14",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_e99f54a3b63b561aa9c55a08e373714d.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-15",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_0bd790b98b40fd1946cebd832c6fea1a.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-142-16",
        "property_id": "prop-142",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a3c2a46b14b0f7801d4db58eb38a1d2a/photo_017f156865a1594d15a727ed7e145da1.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/14-eguilles/opportunite-a-eguilles-villa-123m-habitables-achevee-en-2024/142-maison"
  },
  
    {
    "id": "prop-131",
    "mandate_number": 131,
    "mandate_type": "simple",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Lançon-Provence, Bouches-du-Rhône",
    "title": "LANCON PROVENCE: Spacieuse maison de village T4 avec terrasse 65m², studio et garage à moto",
    "property_type": "maison",
    "address": "Secteur Lançon-Provence",
    "postal_code": "13680",
    "city": "Lançon-Provence",
    "display_exact_address": false,
    "price_fai": 379000,
    "price_net_seller": 363840,
    "agency_fees_amount": 15160,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 65.0,
    "carrez_area": 65.0,
    "land_area": 650.0,
    "rooms_count": 5,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 210,
    "dpe_letter": "D",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Au coeur du centre historique du village typiquement provençal de Lançon Provence, découvrez cette paisible maison du XVIIème siècle dotée d'une grande clarté, d'une vaste terrasse de 65m², d'un garage à moto servant aussi d'abris à bois et d'atelier de plus de 60m² et d'un studio, idéal pour accueillir ami, famille ou son bureau indépendant de la maison principale.\nL'ensemble dispose d'une surface habitable d'environ 135m² et d'une surface au sol intérieure d'environ 170m²\nSon quartier recherché est à proximité des commerces, des écoles, du collège et des arrêts de bus, offrant ainsi un maximum d'autonomie et de sécurité à vos enfants.\nVous serez séduit par sa lumineuse pièce à vivre climatisée, d'environ 50m², sublime par ses poutres apparentes, ses 4m de hauteur sous plafonds et son esthétique et performant poêle à bois.\nLa convivialité règne ici grâce à sa vaste mezzanie idéale pour un bureau ou espace de jeux pour les enfants, et sa cuisine moderne ouverte, entièrement équipée et dotée d'un ilot central.\nSes 65m² de terrasse au calme, offriront à toute la famille des instants conviviaux à l'abris d'une pergola, au coeur de la charmante citée historique.\nUn studio d'environ 26m² sera idéal pour recevoir ami, famille ou profiter de sa quiétude pour télétravailler.\nA l'étage, une vaste chambre d'environ 20m² avec dressing attenant, puis 2 chambres mansardées avec rangement, d'environ 13m² au sol chacune, dont 5m² à + de 1,80m de hauteur. Au même niveau une salle de bains claire, dotée d'une baignoire, douche et double vasque, puis un wc indépendant.\nVous accéderez en moins de 10min à SALON DE PROVENCE et des axes autoroutiers tout azimutes. Bénéficiant d'un emplacement stratégique, Lançon-Provence (13680) se situe à 25min d'Aix en Provence, de l'aéroport et de la gare TGV et à 35min de Marseille et de la côte méditerranéenne.\nSi vous ne l'avez pas déjà vue, une vidéo est à votre disposition sur le site de l'agence notamment.\nLe bien n'est pas en copropriété.\nDPE: D - Estimation des coûts annuels d’énergie du logement: entre 1670 € et 2330 € par an (Prix moyens des énergies indexés au 1er janvier 2021 - abonnements compris)\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nLe prix est fixé à 379 000€ comprenant les honoraires de négociation à la charge du VENDEUR d'un montant de moins de 2.7% TTC dans le cadre du mandat de vente NELL'IMMO n°173.\nVISIBLE EN VIDEO SUR SITE DE L AGENCE NOTAMMENT, cette agréable propriété familiale vous est proposée par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 21 rue de la République 13330 PELISSANNE. TEL : 07 55 68 61 09 – MAIL : nellimmo.acte@gmail.com – SITE : www.nellimmo.fr",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Environnement calme",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-131-1",
        "property_id": "prop-131",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/5a06795be1cd9f1b295c5284b284910c/photo_f149edf4450bc975f605a387517a8b3b.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-131-2",
        "property_id": "prop-131",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2bacaaf5b398c9645816c7988f4b4bc4/photo_90cedb0be09387fbeb3feb9b94575e3f.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-131-3",
        "property_id": "prop-131",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/7f707355aacb215876201347cedd56a0/photo_f005e17950cd69b485b2e0e186817122.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-131-4",
        "property_id": "prop-131",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d5a7f0dabca1f7bd7d8618656f0f70db/photo_222ca6a252211d8c02585b155aaf69f6.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-131-5",
        "property_id": "prop-131",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/d03a5fca5a76e5be9d0e4e68ead61933/photo_a1cfc11590aa2d9e314bffd9254423b2.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/63-lancon-provence/lancon-provence-spacieuse-maison-de-village-t4-avec-terrasse-65m-studio-et-garage-a-moto/131-maison"
  },
  
    {
    "id": "prop-130",
    "mandate_number": 130,
    "mandate_type": "simple",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "vendu",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "VENDU AU TALLAGARD A SALON DE PCE (13300) : Bel appartement T4 - Terrasse - Parking sécurisé",
    "property_type": "appartement",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 228800,
    "price_net_seller": 219648,
    "agency_fees_amount": 9152,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 83.8,
    "carrez_area": 83.8,
    "land_area": 0.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE RESIDENCE LES HAUTS DU TALLAGARD à un adorable couple et leur joli petit bébé !\nHeureuse d'avoir participer à leur projet de vie, ainsi qu'à celui des Vendeurs, dans leur projet de vente....et d'acquisition!\nEncore merci aux vendeurs et acquéreurs pour leurs confiances et leurs sourires!\nCette appartement dans une résidence fermée sécurisée avec garage, de beau standing , est au calme.\nLes avantages NELL'IMMO:\n- Réactivité et dynamisme\n- Honoraires ultras compétitifs entre 3 et 4% TTC à partir de 150 000€\n- Mise en lumière de vos biens par des vidéos de qualités\n- Diffusion de vos biens sur les sites spécialisés les plus consultés.\n- Conseils avisés grâce aux 20 années d'expériences en immobilier de Nelly sur le secteur salonais\n- Contactez moi pour une estimation, elle ne vous coutera qu'un café tout au plus!\nAlors à bientôt!\nTEL : 07 55 68 61 09\nMAIL : nellimmo.acte@gmail.com\nSITE : www.nellimmo.fr\nCette maison de ville à fort potentiel a été vendue par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 26 avenue des Enjouvènes 13330 PELISSANNE. TEL : 07 55 68 61 09 MAIL : nellimmo.acte@gmail.com SITE : www.nellimmo.fr\nTous nos biens sont visibles sur www.nellimmo.fr. A bientôt!",
    "features": [
      "Garage / Parking",
      "Terrasse",
      "Environnement calme",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-130-1",
        "property_id": "prop-130",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_44af6f635bb6a90c55a819becf5ce10d.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-130-2",
        "property_id": "prop-130",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_0f6b6d32ef41bbe262fab4d47f0085b3.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-130-3",
        "property_id": "prop-130",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_416cb4bd747aaca8adbeba2c2362b7d1.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-130-4",
        "property_id": "prop-130",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_24c0eb8149ad81627c4abd4e9687f41c.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-130-5",
        "property_id": "prop-130",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2cdfd295313747ccde1d2f05227a4fa8/photo_17abf1b2723e0585e7748921468fb4a6.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-130-6",
        "property_id": "prop-130",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/ac40efd89a752e475a274036b0a6fb0d/photo_d855fe93a9745b49e0cf02638b157ec6.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/vendu-au-tallagard-a-salon-de-pce-13300-bel-appartement-t4-terrasse-parking-securise/130-appartement"
  },
  
    {
    "id": "prop-118",
    "mandate_number": 118,
    "mandate_type": "exclusif",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "sous_compromis",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Pélissanne, Bouches-du-Rhône",
    "title": "EXCLUSIVITE SOUS PROMESSE DE VENTE PELISSANNE CENTRE: MAISON DE VILLAGE SUR COURS PRINCIPAL",
    "property_type": "maison",
    "address": "Secteur Pélissanne",
    "postal_code": "13330",
    "city": "Pélissanne",
    "display_exact_address": false,
    "price_fai": 165000,
    "price_net_seller": 158400,
    "agency_fees_amount": 6600,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 20.0,
    "carrez_area": 20.0,
    "land_area": 650.0,
    "rooms_count": 3,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "EXCLUSIVITE SOUS PROMESSE DE VENTE\nDécouvrez en exclusivité cette maison idéalement placée sur le cours principal du paisible et dynamique village de PELISSANNE (13330), village réputé pour son marché dominical et la diversité de ses activités sportives et culturelles, vous accéderez en moins de 10min à SALON DE PROVENCE et des axes autoroutiers tout azimutes. Bénéficiant d'un emplacement stratégique au coeur de ce village situé à 25min d'Aix en Provence, de l'aéroport et de la gare TGV et à 35min de Marseille et de la côte méditerranéenne.\n Vous y trouverez au rez de chaussée, un salon de 20m² et  une cuisine de 18m². A l'étage, 2 grandes chambres de 17m² chacune, dégagement et salle de bains avec wc.\nDe multiples projets peuvent potentiellement être exploités avec des travaux et de l'imagination: Investissement locatif, création d'un commerce en rez de chaussée et T2 à l'étage, ou tout simplement s'offrir un agréable cadre de vie en rénovant cette jolie maison à la distribution déjà fonctionnelle.\nFacilités de stationnement avec notamment deux grands parking publics situés à proximité.\nCe bien n'est pas en copropriété. des travaux sont à prévoir.\nDPE: Le présent ouvrage ne tombe pas dans le champ d’application obligatoire du DPE, car il n'y a pas de système de chauffage, selon l’article R.134-1 du décret n°2006-1147 du 14 septembre 2006.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nLe prix est fixé à 179 000€ comprenant les honoraires de négociation à la charge du VENDEUR d'un montant de 4% TTC dans le cadre du mandat de vente exclusif NELL'IMMO n°120.\nCette maison de village au fort potentiel vous est proposée par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 . TEL : 07 55 68 61 09 – MAIL : nellimmo.acte@gmail.com – SITE : www.nellimmo.fr",
    "features": [
      "Garage / Parking",
      "Terrasse",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-118-1",
        "property_id": "prop-118",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/addf4f0e21f3cb6defcd2218fa1bca92/photo_3fd983d48638528ae38d52ab3c922df2.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-118-2",
        "property_id": "prop-118",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/addf4f0e21f3cb6defcd2218fa1bca92/photo_6e09602077be0a3d1db4372874b50ad6.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-118-3",
        "property_id": "prop-118",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/addf4f0e21f3cb6defcd2218fa1bca92/photo_9ff1a91021eb1e1468693d3b25500fb0.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-118-4",
        "property_id": "prop-118",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/2344c4964449a9abce89f5d84d2fad02/photo_809577f516430f326a01e06446a58aa4.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/1-pelissanne/exclusivite-sous-promesse-de-vente-pelissanne-centre-maison-de-village-sur-cours-principal/118-maison-de-village"
  },
  
    {
    "id": "prop-105",
    "mandate_number": 105,
    "mandate_type": "simple",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Sénas, Bouches-du-Rhône",
    "title": "SENAS URBAN VILLAGE: Du T3 au T4 dans immeuble de 9 logements, terrasses exposées Sud et stationnements privat",
    "property_type": "immeuble",
    "address": "Secteur Sénas",
    "postal_code": "13560",
    "city": "Sénas",
    "display_exact_address": false,
    "price_fai": 295500,
    "price_net_seller": 283680,
    "agency_fees_amount": 11820,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 81.84,
    "carrez_area": 81.84,
    "land_area": 0.0,
    "rooms_count": 4,
    "bedrooms_count": 3,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 40,
    "ges_letter": "D",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Niché au coeur du parc Régional des Alpilles, aux portes du Lubéron, Sénas est un village installé dans la plaine fertile de la Durance, entouré de vergers et de terres maraichères.\nProche des plus belles destinations touristiques de la Provence, mais épargné par les grands flux touristiques, Sénas a su conserver son identité provençale et a à coeur de conserver la qualité de vie de ses habitants.\nSon marché provencal, son fameux théâtre, ses expositions culturelles et ses nombreuses fêtes ponctuent le calendrier annuel et sont propices aux joyeuses rencontres!\nJe suis Nelly FERNANDEZ, agent immobilier indépendant local. Je vous invite à dévouvrir ce magnifique projet immobilier au coeur du village dénommé \"Urban Village\".\nDevenez propriétaire dans ce petit immeuble dénommé F, composé de 9 appartements, 20 places de parking privatives extérieures.\nLes 2 étages de cette belle petite copropriété seront desservis par un ascenseur. Coup de projecteur sur ce bel appartement T4, en rez de chaussée, identifié F-02, d'une surface habitable de 81,84m² avec terrasse de 15,89m² agrémentée d'une grande jardinière et ses 2 places de stationnements privatifs, proposé au prix de 295 500€ TTC.\nBesoins de plus ou moins d'espace?, d'autres appartements sont disponibles du T3 au T4, entre 285 600€ et 323 200€ TTC.\nLe programme \"Urban Village\" répond aux normes environnementales RE 2020, pour une éco-conception peu énergivore des logements, remarquables de conforts et de modernités.\nDes matériaux durables et innovants, un soucis d'esthétisme architectural, une intégration végétalisée optimale avec notamment une noue paysagère qui traversera le domaine.\nLes cheminements doux seront privilégiés: piétonne et cyclable, une piste végétalisée vous mènera au centre du village, en toute sécurité.\nLes appartements \"Urban Village\" seront soumis au régime de la copropriété. Les espaces communs du domaine URBAN VILLAGE seront gérés par une Association Syndicale Libre.\nL'ensemble du projet, sera soumis à un cahier des charges, pour respecter une belle harmonie.\nVous recherchez un environnement privilégié et une éco-conception respectueuse de l'environnement et tournée vers l'avenir, contactez moi pour étudier ensemble votre projet et vous présenter toutes les opportunités qu'offre ce magnifique quartier durable \"Urban Village\".\nJ'ai à coeur de découvrir votre projet et de vous accompagner dans toutes les démarches et le suivi d'une acquisition en VEFA.\nSoucieuse de vous accompagner dans la plus grande transparence, j'ai à votre disposition les plans et les notices descriptives des biens\nVous pourrez bénéficier:\n- De l'offre de printemps jusqu'au 21 juin 2023 et bénéficier des frais de notaire offerts et jusqu'à 10 000€ de remise! \n- de frais d'enregistrement (frais de notaire) réduits\n- potentiellement de prêt à taux zéro\n- D'exonération de taxe foncière les 2 premières années\n- de garanties de conformité et décénnale\n- D'un bâtiment respectueux de l'environnement, économe en énergie et éco-responsable.\nCes biens ne sont pas soumis au diagnostique de performance énergétique.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nLes honoraires de négociation sont à la charge du VENDEUR, inclus dans le prix de commercialisation initial, dans le cadre du mandat de vente NELL'IMMO n°106.\nVISIBLE EN VIDEO SUR SITE DE L AGENCE NOTAMMENT, cette opportunité vous est proposée par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 21 rue de la République 13330 PELISSANNE. TEL : 07 55 68 61 09 – MAIL : nellimmo.acte@gmail.com – SITE : www.nellimmo.fr",
    "features": [
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-105-1",
        "property_id": "prop-105",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/778e5c8020a6c25926e8c6cb0f01335b/photo_576a084b1c6bd781863b078e3190b4c9.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-105-2",
        "property_id": "prop-105",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/778e5c8020a6c25926e8c6cb0f01335b/photo_fb5886c8dbeb6418d7c02e892a656181.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-105-3",
        "property_id": "prop-105",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/778e5c8020a6c25926e8c6cb0f01335b/photo_e8f99b0971ff980a5f3e0e58077f80ad.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-105-4",
        "property_id": "prop-105",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/778e5c8020a6c25926e8c6cb0f01335b/photo_d907fccf267ae0135726e60f9ae809d7.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-105-5",
        "property_id": "prop-105",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/02e6ff4326eaddd0f31735417b119c5e/photo_adeffca80bcc1d2dad8537e02ce8375b.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-105-6",
        "property_id": "prop-105",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/7496f777a98fd162ee85fb931775aafc/photo_6941932663c32d92c1aa73748a641498.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/9-senas/senas-urban-village-du-t3-au-t4-dans-immeuble-de-9-logements-terrasses-exposees-sud-et-stationnements-privat/105-appartement"
  },
  
    {
    "id": "prop-101",
    "mandate_number": 101,
    "mandate_type": "simple",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "actif",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Sénas, Bouches-du-Rhône",
    "title": "SENAS PROCHE CENTRE: VILLA CONTEMPORAINE T3 AVEC JARDIN, GARAGE ET PARKING PRIVATIF",
    "property_type": "maison",
    "address": "Secteur Sénas",
    "postal_code": "13560",
    "city": "Sénas",
    "display_exact_address": false,
    "price_fai": 299500,
    "price_net_seller": 287520,
    "agency_fees_amount": 11980,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 77.0,
    "carrez_area": 77.0,
    "land_area": 650.0,
    "rooms_count": 3,
    "bedrooms_count": 2,
    "bathrooms_count": 1,
    "dpe_value": 130,
    "dpe_letter": "C",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Niché au coeur du parc Régional des Alpilles, aux portes du Lubéron, Sénas est un village installé dans la plaine fertile de la Durance, entouré de vergers et de terres maraichères.\nProche des plus belles destinations touristiques de la Provence, mais épargné par les grands flux touristiques, Sénas a su conserver son identité provençale et a à coeur de conserver la qualité de vie de ses habitants.\nSon marché provencal, son fameux théâtre, ses expositions culturelles et ses nombreuses fêtes ponctuent le calendrier annuel et sont propices aux joyeuses rencontres!\nJe suis Nelly FERNANDEZ, agent immobilier indépendant local. Je vous invite à dévouvrir ce magnifique projet immobilier au coeur du village dénommé \"Urban Village\".\nDevenez propriétaire de cette VILLA CONTEMPORAINE identifiée G-12, non mitoyenne, de type 3, d'une surface habitable d'environ 77m² avec terrasse de 16,5m² surmontée d'une pergola metalique,\nfaçade avec bardage bois à claire-voie en partie, garage avec toit végétalisé pour une intégration paysagère optimale et une place de parking sera privative devant la maison.\nSon terrain aura une surface de 217m². Elle vous sera livrée au cours du 1er semestre 2025.\nBesoins de plus d'espace?, d'autres villas sont disponibles du T3 au T5!\nLe programme \"Urban Village\" répond aux normes environnementales RE 2020, pour une éco-conception peu énergivore des logements, remarquables de conforts et de modernités.\nDes matériaux durables et innovants, un soucis d'esthétisme architectural, une intégration végétalisée optimale avec notamment une noue paysagère qui traversera le domaine.\nLes cheminements doux seront privilégiés: piétonne et cyclable, une piste végétalisée vous mènera au centre du village, en toute sécurité.\nLes villas \"Urban Village\" ne seront pas soumisent au régime de la copropriété. Les espaces communs seront gérés par une Association Syndicale Libre.\nL'ensemble du projet, sera soumis à un cahier des charges, pour respecter une belle harmonie.\nVous recherchez un environnement privilégié et une éco-conception respectueuse de l'environnement et tournée vers l'avenir, contactez moi pour étudier ensemble votre projet et vous présenter toutes les opportunités qu'offre ce magnifique quartier durable \"Urban Village\".\nJ'ai à coeur de découvrir votre projet et de vous accompagner dans toutes les démarches et le suivi d'une acquisition en VEFA.\nSoucieuse de vous accompagner dans la plus grande transparence, j'ai à votre disposition les plans et les notices descriptives des biens\nVous pourrez bénéficier:\n- de frais d'enregistrement (frais de notaire) réduits\n- potentiellement de prêt à taux zéro\n- D'exonération de taxe foncière les 2 premières années\n- de garanties de conformité et décénnale\n- D'un bâtiment respectueux de l'environnement, économe en énergie et éco-responsable.\nCes biens ne sont pas soumis au diagnostique de performance énergétique.\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.\nLes honoraires de négociation sont à la charge du VENDEUR, inclus dans le prix de commercialisation initial, dans le cadre du mandat de vente NELL'IMMO n°107.\nVISIBLE EN VIDEO SUR SITE DE L AGENCE NOTAMMENT, cette opportunité vous est proposée par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 du14 Octobre 2019 établie par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 21 rue de la République 13330 PELISSANNE. TEL : 07 55 68 61 09 – MAIL : nellimmo.acte@gmail.com – SITE : www.nellimmo.fr",
    "features": [
      "Garage / Parking",
      "Terrasse",
      "Climatisation réversible",
      "Jardin",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-101-1",
        "property_id": "prop-101",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/9a0b49224ebbb0bf0166c35253d7baee/photo_634fa316ad725988fcab7c6f91589299.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-101-2",
        "property_id": "prop-101",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/9a0b49224ebbb0bf0166c35253d7baee/photo_1348190ec58b2ef7d0af28bf7243b8b6.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-101-3",
        "property_id": "prop-101",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/9a0b49224ebbb0bf0166c35253d7baee/photo_d8fdb0ca46209e155f7dfe194141e039.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-101-4",
        "property_id": "prop-101",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/9a0b49224ebbb0bf0166c35253d7baee/photo_c6a76c0b89ef238f3db783d6433a6291.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-101-5",
        "property_id": "prop-101",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/9a0b49224ebbb0bf0166c35253d7baee/photo_c9458d053a5ac1c534c1fc1aa620a186.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-101-6",
        "property_id": "prop-101",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/a28428320cc393966e490d524089d8ec/photo_9ec2b42db727ffd4aed20d08170a70e3.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/9-senas/senas-proche-centre-villa-contemporaine-t3-avec-jardin-garage-et-parking-privatif/101-villa"
  },
  
    {
    "id": "prop-56",
    "mandate_number": 56,
    "mandate_type": "simple",
    "mandate_date": "2022-09-01",
    "mandate_end_date": "2023-09-01",
    "status": "vendu",
    "seller_civility": "M_Mme",
    "seller_name": "Propriétaire Mandant",
    "seller_email": "contact@nellimmo.fr",
    "seller_phone": "07 55 68 61 09",
    "seller_address": "Salon-de-Provence, Bouches-du-Rhône",
    "title": "SUPERBE MAS VENDU PAR NELL'IMMO A SALON EN CAMPAGNE: 205m² SUR 2400m² DE TERRAIN",
    "property_type": "terrain",
    "address": "Secteur Salon-de-Provence",
    "postal_code": "13300",
    "city": "Salon-de-Provence",
    "display_exact_address": false,
    "price_fai": 860000,
    "price_net_seller": 825600,
    "agency_fees_amount": 34400,
    "agency_fees_percentage": 4.0,
    "fees_paid_by": "vendeur",
    "living_area": 205.0,
    "carrez_area": 205.0,
    "land_area": 0.0,
    "rooms_count": 7,
    "bedrooms_count": 6,
    "bathrooms_count": 1,
    "dpe_value": 45,
    "dpe_letter": "A",
    "ges_value": 4,
    "ges_letter": "A",
    "dpe_reference_year": "2024",
    "energy_cost_min": 850,
    "energy_cost_max": 1250,
    "description": "Situé en campagne à SALON DE PROVENCE, ce superbe mas a été VENDU PAR NELL'IMMO ! à un adorable couple d'acquéreur et leurs 3 enfants. \n3% TTC d'honoraires de négociation sur cette affaire. \nLes avantages NELL'IMMO: \n- Réactivité et dynamisme \n- Honoraires ultras compétitifs entre 3 et 4% TTC à partir de 150 000€ \n- Mise en lumière de vos biens par des vidéos de qualités \n- Diffusion de vos biens sur les sites spécialisés les plus consultés. \n- Conseils avisés grâce aux 20 années d'expériences en immobilier de Nelly sur le secteur salonais \n- Contactez moi pour une estimation, elle ne vous coutera qu'un café tout au plus! \nAlors à bientôt! \nTEL : 07 55 68 61 09 \nMAIL : nellimmo.acte@gmail.com \nSITE : www.nellimmo.fr \nCette magnifique Ppropriété a été vendue par Nelly FERNANDEZ, agent immobilier indépendant porteur de la carte professionnelle transaction n°1310 2019 000 042 974 délivrée le 14 Octobre 2019 par la CCI MARSEILLE PROVENCE, renouvelée depuis. Présidente de la SASU NELL’IMMO au capital social de 2000€, enregistrée au RCS de SALON DE PCE n° 853 807 006 - siège social : 21 rue de la République 13330 PELISSANNE. TEL : 07 55 68 61 09 – MAIL : nellimmo.acte@gmail.com – SITE : www.nellimmo.fr\nLes informations sur les risques auxquels ce bien est exposé sont disponibles sur le site\nGéorisques",
    "features": [
      "Piscine",
      "Garage / Parking",
      "Terrasse",
      "Jardin",
      "État impeccable",
      "Cuisine équipée"
    ],
    "publish_website": true,
    "publish_seloger": true,
    "publish_leboncoin": true,
    "publish_bienici": true,
    "created_at": "2022-09-01T10:00:00Z",
    "updated_at": "2023-04-15T10:00:00Z",
    "images": [
      {
        "id": "img-56-1",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_b12345b72bb9c08fbf819b3060d5b927.jpg",
        "display_order": 1,
        "is_cover": true,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-2",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_457bd9648795b2d2a2f10be510131ff4.jpg",
        "display_order": 2,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-3",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_206aad03bbdb47aec68aa9d50a16c0f4.jpg",
        "display_order": 3,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-4",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_7b090c572ad1d71931cfe49efc9c8d14.jpg",
        "display_order": 4,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-5",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_73007bc7fa9f2f215ebe92d3492c3951.jpg",
        "display_order": 5,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-6",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_8ef546c0e25d3de31cce1c399bbc2cd4.jpg",
        "display_order": 6,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-7",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_fa1ea2efe77081317c50d13831e7b308.jpg",
        "display_order": 7,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-8",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_e0e6763b69ef5bc1587099ca126c90f1.jpg",
        "display_order": 8,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-9",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_c479cd4f0aa03f84867f76506fbc0299.jpg",
        "display_order": 9,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-10",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_3593ae44ba5725ee29a0146420263c87.jpg",
        "display_order": 10,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-11",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_1f02b68c0643d5955b1ff0febf1586f7.jpg",
        "display_order": 11,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-12",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_cc348b43c5e9dd91b8879ca5f3e7ca0d.jpg",
        "display_order": 12,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-13",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_5eb330c31e0ac470c0b857d1eb085320.jpg",
        "display_order": 13,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-14",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_b29104c76291b5395b22ecbc5f153f0a.jpg",
        "display_order": 14,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-15",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_9bcdac304ac4c3d3ab85f50813e2b7d6.jpg",
        "display_order": 15,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-16",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_79ae46902bce7634665409ce456b8b8d.jpg",
        "display_order": 16,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-17",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_987b78602edd2ca6ea72eddd4be4d304.jpg",
        "display_order": 17,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-18",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_a8e416976bd4f061c6741cfa8d050051.jpg",
        "display_order": 18,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-19",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_8a6510b3616e495a470c48fb211b7307.jpg",
        "display_order": 19,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-20",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/3e9dabd400a5f00ed06d4b83437bf050/photo_7418a7036d8f105748d50531f73b3bf8.jpg",
        "display_order": 20,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-21",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/959d3437114b074a2cfea27ab8240b4a/photo_215b4656af9b766cff86071389bdc770.jpg",
        "display_order": 21,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-22",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/aa5d522818aeb5ade8fd8e59600e3c43/photo_531c1721f6ed75d40dd24feb3299fa69.jpg",
        "display_order": 22,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-23",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/839619dd076e27256a16f502655cc29e/photo_609ddd32be58aa05fa5fb8ab8c6ae29b.jpg",
        "display_order": 23,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "img-56-24",
        "property_id": "prop-56",
        "image_url": "https://nellimmo.staticlbi.com/1600xauto/images/biens/1/b6b07856093c52298cb0937421b0323a/photo_efc242cec63a8a5f1c759cfce58db821.jpg",
        "display_order": 24,
        "is_cover": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "url": "https://www.nellimmo.fr/vente/13-bouches-du-rhone/2-salon-de-provence/superbe-mas-vendu-par-nell-immo-a-salon-en-campagne-205m-sur-2400m-de-terrain-prestige/56-mas"
  }
];

export const INITIAL_BUYERS: Buyer[] = [
  {
    id: 'buy-1',
    first_name: 'Alexandre',
    last_name: 'Moreau',
    email: 'a.moreau@example.com',
    phone: '06 12 34 56 78',
    status: 'actif',
    budget_max: 850000,
    min_surface: 140,
    min_rooms: 5,
    min_bedrooms: 4,
    target_property_types: ['maison'],
    target_cities: ['Salon-de-Provence', 'Pélissanne', 'Éguilles'],
    must_have_garden: true,
    must_have_garage: true,
    financing_status: 'accord_bancaire_valide',
    notes: 'Recherche active pour mutation. Coup de cœur pour les maisons récentes ou rénovées avec piscine.',
    created_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'buy-2',
    first_name: 'Céline & Thomas',
    last_name: 'Garnier',
    email: 'garnier.family@example.com',
    phone: '06 98 76 54 32',
    status: 'actif',
    budget_max: 580000,
    min_surface: 110,
    min_rooms: 4,
    min_bedrooms: 3,
    target_property_types: ['maison'],
    target_cities: ['Pélissanne', 'Lançon-Provence', 'La Fare-les-Oliviers'],
    must_have_garden: true,
    must_have_garage: false,
    financing_status: 'accord_bancaire_valide',
    notes: 'Famille avec 2 enfants. Proximité écoles et calme absolu requis.',
    created_at: '2024-02-15T14:30:00Z'
  },
  {
    id: 'buy-3',
    first_name: 'Marc',
    last_name: 'Vidal',
    email: 'm.vidal@invest.fr',
    phone: '06 45 67 89 01',
    status: 'actif',
    budget_max: 180000,
    min_surface: 25,
    min_rooms: 1,
    min_bedrooms: 1,
    target_property_types: ['appartement'],
    target_cities: ['Salon-de-Provence'],
    must_have_garden: false,
    must_have_garage: false,
    financing_status: 'comptant',
    notes: 'Investisseur locatif. Achat comptant sans condition suspensive de prêt.',
    created_at: '2024-03-01T09:15:00Z'
  },
  {
    id: 'buy-4',
    first_name: 'Sophie & Julien',
    last_name: 'Lambert',
    email: 'lambert.sophie@example.com',
    phone: '06 23 45 67 89',
    status: 'actif',
    budget_max: 470000,
    min_surface: 100,
    min_rooms: 4,
    min_bedrooms: 3,
    target_property_types: ['maison'],
    target_cities: ['Salon-de-Provence', 'Pélissanne'],
    must_have_garden: true,
    must_have_garage: true,
    financing_status: 'accord_bancaire_valide',
    notes: 'Recherche villa de plain-pied ou maison contemporaine récente.',
    created_at: '2024-03-05T16:00:00Z'
  },
  {
    id: 'buy-5',
    first_name: 'Laurent',
    last_name: 'Benoit',
    email: 'l.benoit@gmail.com',
    phone: '06 77 88 99 00',
    status: 'actif',
    budget_max: 300000,
    min_surface: 800,
    min_rooms: 0,
    min_bedrooms: 0,
    target_property_types: ['terrain'],
    target_cities: ['Pélissanne', 'Salon-de-Provence', 'Lançon-Provence'],
    must_have_garden: false,
    must_have_garage: false,
    financing_status: 'accord_bancaire_valide',
    notes: 'Recherche terrain à bâtir viabilisé avec permis ou libre constructeur.',
    created_at: '2024-03-10T11:20:00Z'
  }
];

export const INITIAL_VISITS: VisitSheet[] = [
  {
    id: 'vis-1',
    property_id: 'prop-244',
    buyer_id: 'buy-1',
    visit_date: '2024-03-15T14:00:00Z',
    agent_id: 'agent-niels',
    signature_data_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,20 Q30,5 50,25 T90,20" stroke="black" fill="none"/></svg>',
    ip_address: '192.168.1.45',
    notes: 'Client très enthousiaste sur les prestations contemporaines et le secteur des Viougues. Contre-visite prévue.',
    created_at: '2024-03-15T14:45:00Z'
  },
  {
    id: 'vis-2',
    property_id: 'prop-237',
    buyer_id: 'buy-2',
    visit_date: '2024-03-18T10:30:00Z',
    agent_id: 'agent-nelly',
    signature_data_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 Q40,10 60,30 T90,15" stroke="black" fill="none"/></svg>',
    ip_address: '192.168.1.88',
    notes: 'Belle appréciation du charme du XIXème et de la piscine.',
    created_at: '2024-03-18T11:15:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: MandateAuditLog[] = [
  {
    id: 'log-1',
    property_id: 'prop-244',
    mandate_number: 244,
    action_type: 'creation',
    previous_state: null,
    new_state: {
      mandate_number: 244,
      title: 'SALON - LES VIOUGUES: 800m du CENTRE : Maison édifiée en 2023, 170m² Hab.',
      price_fai: 786600,
      status: 'actif'
    },
    performed_by: 'Nelly Fernandez',
    signature_sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    logged_at: '2024-03-01T09:00:00Z'
  },
  {
    id: 'log-2',
    property_id: 'prop-243',
    mandate_number: 243,
    action_type: 'creation',
    previous_state: null,
    new_state: {
      mandate_number: 243,
      title: 'SALON 1km CENTRE: APPARTEMENT T1 - PARKING LIBRE FAIBLES CHARGES',
      price_fai: 95000,
      status: 'actif'
    },
    performed_by: 'Niels Fernandez',
    signature_sha256: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef0',
    logged_at: '2024-03-02T10:15:00Z'
  }
];

export const MOCK_DVF_TRANSACTIONS: DVFTransaction[] = [
  {
    id: 'dvf-1',
    date_mutation: '2024-01-12',
    valeur_fonciere: 750000,
    adresse_numero: '12',
    adresse_nom_voie: 'Chemin des Viougues',
    code_postal: '13300',
    nom_commune: 'Salon-de-Provence',
    type_local: 'Maison',
    surface_reelle_bati: 165,
    nombre_pieces_principales: 6,
    surface_terrain: 450,
    prix_m2: 4545,
    distance_metres: 120
  },
  {
    id: 'dvf-2',
    date_mutation: '2023-11-20',
    valeur_fonciere: 540000,
    adresse_numero: '8',
    adresse_nom_voie: 'Avenue des Enjouvènes',
    code_postal: '13330',
    nom_commune: 'Pélissanne',
    type_local: 'Maison',
    surface_reelle_bati: 195,
    nombre_pieces_principales: 6,
    surface_terrain: 1200,
    prix_m2: 2769,
    distance_metres: 350
  },
  {
    id: 'dvf-3',
    date_mutation: '2023-10-05',
    valeur_fonciere: 150000,
    adresse_numero: '45',
    adresse_nom_voie: 'Boulevard de la République',
    code_postal: '13300',
    nom_commune: 'Salon-de-Provence',
    type_local: 'Appartement',
    surface_reelle_bati: 55,
    nombre_pieces_principales: 2,
    prix_m2: 2727,
    distance_metres: 600
  }
];

export const DEFAULT_AGENCY_SETTINGS = INITIAL_AGENCY_SETTINGS;
export const INITIAL_VISIT_SHEETS = INITIAL_VISITS;

export const INITIAL_CONTACT_LEADS: ContactLead[] = [
  {
    id: 'lead-1',
    name: 'Laurent Mercier',
    email: 'laurent.mercier@orange.fr',
    phone: '06 88 12 34 56',
    message: "Bonjour, je souhaiterais visiter la maison contemporaine aux Viougues (Réf 244) ce samedi si possible. Bien cordialement.",
    subject: "Demande de visite - Réf 244",
    property_id: 'prop-227',
    property_title: 'SALON - LES VIOUGUES: Maison contemporaine 170m²',
    status: 'nouveau',
    created_at: '2024-03-20T14:30:00Z'
  },
  {
    id: 'lead-2',
    name: 'Nathalie Bonnet',
    email: 'n.bonnet13@gmail.com',
    phone: '06 11 22 33 44',
    message: "Bonjour Nelly, nous avons vu la superbe maison de charme au centre de Pélissanne (Réf 235). Pourriez-vous nous transmettre le dossier complet et nous indiquer les disponibilités pour une visite ?",
    subject: "Demande d'information - Réf 235",
    property_id: 'prop-235',
    property_title: 'PÉLISSANNE CENTRE: Superbe Maison de charme 216m²',
    status: 'nouveau',
    created_at: '2024-03-21T09:15:00Z'
  }
];

export const INITIAL_ESTIMATION_LEADS: EstimationLead[] = [
  {
    id: 'est-1',
    first_name: 'Stéphane',
    last_name: 'Dumas',
    email: 's.dumas@bbox.fr',
    phone: '06 55 44 33 22',
    property_type: 'maison',
    city: 'Pélissanne',
    address: 'Chemin des Grands Prés',
    living_area: 145,
    land_area: 900,
    rooms_count: 5,
    has_pool: true,
    status: 'nouveau',
    created_at: '2024-03-19T17:40:00Z'
  },
  {
    id: 'est-2',
    first_name: 'Émilie',
    last_name: 'Roux',
    email: 'emilie.roux@sfr.fr',
    phone: '06 99 88 77 66',
    property_type: 'appartement',
    city: 'Salon-de-Provence',
    address: 'Place Morgan',
    living_area: 68,
    rooms_count: 3,
    has_pool: false,
    status: 'en_cours',
    created_at: '2024-03-18T11:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: TransactionDeal[] = [
  {
    id: 'trans-1',
    property_id: 'prop-227',
    buyer_id: 'buyer-1',
    status: 'attente_pret',
    offer_price_fai: 730000,
    offer_price_net: 700000,
    agency_fees_amount: 30000,
    deposit_amount: 35000,
    deposit_holder: 'Étude Notariale de Pélissanne (Me Bertrand)',
    seller_name: 'Jean-Pierre & Martine DUPONT',
    seller_phone: '06 12 34 56 78',
    seller_email: 'jp.dupont@orange.fr',
    buyer_name: 'Thomas & Sophie LEFEBVRE',
    buyer_phone: '06 88 77 66 55',
    buyer_email: 'thomas.lefebvre@gmail.com',
    seller_notary_name: 'Me Bertrand VIDAL',
    seller_notary_email: 'vidal.notaire@notaires.fr',
    seller_notary_phone: '04 90 55 12 34',
    seller_notary_office: 'Office Notarial de Pélissanne',
    buyer_notary_name: 'Me Caroline MARTIN',
    buyer_notary_email: 'c.martin@notaires.fr',
    buyer_notary_phone: '04 90 56 78 90',
    buyer_notary_office: 'Étude Notariale Salon République',
    offer_date: '2026-01-15',
    compromis_date: '2026-01-28',
    sru_notification_date: '2026-01-29',
    sru_expiry_date: '2026-02-09',
    loan_application_deadline: '2026-02-28',
    loan_approval_deadline: '2026-03-15',
    final_deed_target_date: '2026-04-10',
    loan_amount_requested: 550000,
    loan_interest_rate_max: 3.45,
    loan_duration_years: 25,
    loan_bank_name: 'BNP Paribas Salon-de-Provence',
    broker_name: 'Meilleurtaux Salon',
    checklist_documents: {
      titre_propriete: true,
      taxe_fonciere: true,
      dossier_diagnostics: true,
      audit_energetique: false,
      pre_etat_date: false,
      reglement_copro: false,
      cni_vendeur: true,
      cni_acquereur: true,
      justificatif_domicile: true,
      simulation_pret: true,
      offre_achat_signee: true
    },
    invoice_number: 'FACT-2026-004',
    invoice_date: '2026-04-10',
    invoice_sent_to_notary: false,
    fees_received: false,
    google_review_requested: false,
    notes: 'Alerte J-10 accord de prêt : relancer le courtier Meilleurtaux Salon pour confirmation de validation des offres.',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-15T14:30:00Z'
  },
  {
    id: 'trans-2',
    property_id: 'prop-235',
    buyer_id: 'buyer-2',
    status: 'acte_planifie',
    offer_price_fai: 495000,
    offer_price_net: 475000,
    agency_fees_amount: 20000,
    deposit_amount: 25000,
    deposit_holder: 'Office Notarial de Salon',
    seller_name: 'Mme Valérie BLANCHARD',
    seller_phone: '06 23 45 67 89',
    seller_email: 'v.blanchard@sfr.fr',
    buyer_name: 'Julien & Camille MOREAU',
    buyer_phone: '06 34 56 78 90',
    buyer_email: 'julien.moreau@free.fr',
    seller_notary_name: 'Me Jean-Luc FAURE',
    seller_notary_email: 'faure.notaires@notaires.fr',
    seller_notary_phone: '04 90 56 11 22',
    seller_notary_office: 'Notaires Associés Place Morgan',
    offer_date: '2025-11-10',
    compromis_date: '2025-11-25',
    sru_notification_date: '2025-11-26',
    sru_expiry_date: '2025-12-08',
    loan_application_deadline: '2025-12-24',
    loan_approval_deadline: '2026-01-20',
    final_deed_target_date: '2026-03-12',
    loan_amount_requested: 380000,
    loan_interest_rate_max: 3.60,
    loan_duration_years: 20,
    loan_bank_name: 'Crédit Agricole Pélissanne',
    checklist_documents: {
      titre_propriete: true,
      taxe_fonciere: true,
      dossier_diagnostics: true,
      audit_energetique: true,
      pre_etat_date: false,
      reglement_copro: false,
      cni_vendeur: true,
      cni_acquereur: true,
      justificatif_domicile: true,
      simulation_pret: true,
      offre_achat_signee: true
    },
    invoice_number: 'FACT-2026-003',
    invoice_date: '2026-03-05',
    invoice_sent_to_notary: true,
    fees_received: false,
    google_review_requested: false,
    notes: 'Signature fixée le 12 mars à 15h00. Relecture du projet d’acte effectuée avec Me Faure.',
    created_at: '2025-11-10T14:00:00Z',
    updated_at: '2026-02-20T11:00:00Z'
  },
  {
    id: 'trans-3',
    property_id: 'prop-243',
    status: 'acte_signe',
    offer_price_fai: 95000,
    offer_price_net: 89000,
    agency_fees_amount: 6000,
    deposit_amount: 5000,
    deposit_holder: 'Me Bertrand VIDAL (Pélissanne)',
    seller_name: 'M. Henri GIRAUD',
    seller_phone: '06 99 88 11 22',
    seller_email: 'henri.giraud@wanadoo.fr',
    buyer_name: 'Romain BOURGEOIS (Investisseur)',
    buyer_phone: '06 77 66 55 44',
    buyer_email: 'romain.bourgeois@gmail.com',
    seller_notary_name: 'Me Bertrand VIDAL',
    seller_notary_email: 'vidal.notaire@notaires.fr',
    seller_notary_phone: '04 90 55 12 34',
    seller_notary_office: 'Office Notarial de Pélissanne',
    offer_date: '2025-10-01',
    compromis_date: '2025-10-18',
    sru_notification_date: '2025-10-19',
    sru_expiry_date: '2025-10-30',
    loan_application_deadline: '2025-11-20',
    loan_approval_deadline: '2025-12-15',
    final_deed_target_date: '2026-01-22',
    actual_closing_date: '2026-01-22',
    checklist_documents: {
      titre_propriete: true,
      taxe_fonciere: true,
      dossier_diagnostics: true,
      audit_energetique: false,
      pre_etat_date: true,
      reglement_copro: true,
      cni_vendeur: true,
      cni_acquereur: true,
      justificatif_domicile: true,
      simulation_pret: true,
      offre_achat_signee: true
    },
    invoice_number: 'FACT-2026-001',
    invoice_date: '2026-01-22',
    invoice_sent_to_notary: true,
    fees_received: true,
    google_review_requested: true,
    notes: 'Acte signé le 22/01. Honoraires de 6 000 € encaissés le 24/01. Avis 5 étoiles Google reçu !',
    created_at: '2025-10-01T09:30:00Z',
    updated_at: '2026-01-25T16:00:00Z'
  }
];

export const INITIAL_PROSPECTING_LEADS: ProspectingLead[] = [
  {
    id: 'pige-1',
    source: 'pap',
    source_url: 'https://www.pap.fr/annonces/maison-pelissanne-13330-r44120',
    title: 'Villa provençale 135m² sur 950m² de terrain arboré avec piscine',
    property_type: 'maison',
    city: 'Pélissanne',
    postal_code: '13330',
    price_asked: 460000,
    initial_price: 495000,
    price_drops_count: 1,
    living_area: 135,
    land_area: 950,
    rooms_count: 5,
    bedrooms_count: 3,
    description: 'Particulier vend villa traditionnelle de plain-pied, quartier calme à 1,5km du centre. Séjour lumineux de 42m² avec cheminée, cuisine équipée indépendante, 3 chambres, garage, piscine 8x4m avec terrasse ombragée. Agences s\'abstenir impérativement.',
    photos_urls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    seller_name: 'M. Jean-Luc DUBOIS',
    seller_phone: '06 14 25 36 47',
    seller_email: 'jeanluc.dubois13@gmail.com',
    status: 'a_rappeler',
    call_attempts_count: 2,
    last_contacted_at: '2026-02-28T14:30:00Z',
    next_followup_date: '2026-03-05',
    notes: 'Premier contact le 28/02. A d\'abord refusé par principe, mais a reconnu que depuis sa baisse de 35 000€ il n\'a eu que 2 visites non finançables. D\'accord pour que je lui prépare une estimation comparative DVF de sa rue.',
    estimated_dvf_m2: 3250,
    estimated_dvf_price: 438000,
    days_online: 82,
    created_at: '2025-12-10T10:00:00Z'
  },
  {
    id: 'pige-2',
    source: 'leboncoin',
    source_url: 'https://www.leboncoin.fr/ad/ventes_immobilieres/298412450.htm',
    title: 'Maison contemporaine rénovée 110m² - Quartier Viougues',
    property_type: 'maison',
    city: 'Salon-de-Provence',
    postal_code: '13300',
    price_asked: 365000,
    price_drops_count: 0,
    living_area: 110,
    land_area: 380,
    rooms_count: 4,
    bedrooms_count: 3,
    description: 'En direct propriétaire : maison coup de cœur entièrement rénovée avec goût en 2024. Climatisation réversible, suite parentale en rez-de-chaussée, jardin sans vis-à-vis. DPE classe B.',
    photos_urls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    seller_name: 'Mme Sophie ROUX',
    seller_phone: '06 88 77 44 11',
    seller_email: 'sophie.roux.salon@gmail.com',
    status: 'nouveau',
    call_attempts_count: 0,
    notes: 'Annonce mise en ligne il y a 36 heures. Quartier très recherché par nos acquéreurs famille (budget 350-380k€). Appel prioritaire à passer avec le script d\'accroche Nell\'Immo.',
    estimated_dvf_m2: 3280,
    estimated_dvf_price: 360000,
    days_online: 2,
    created_at: '2026-03-01T08:00:00Z'
  },
  {
    id: 'pige-3',
    source: 'pap',
    source_url: 'https://www.pap.fr/annonces/maison-lambesc-13410-r44199',
    title: 'Propriété de charme avec dépendance et oliveraie 180m²',
    property_type: 'maison',
    city: 'Lambesc',
    postal_code: '13410',
    price_asked: 675000,
    initial_price: 720000,
    price_drops_count: 1,
    living_area: 180,
    land_area: 2500,
    rooms_count: 7,
    bedrooms_count: 4,
    description: 'Vends superbe mas rénové sur terrain de 2500m² avec 30 oliviers centenaires. Grande terrasse, vue sur les collines, piscine chauffée. Pas d\'agences merci.',
    photos_urls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    seller_name: 'Dr. Marc BENOIT',
    seller_phone: '06 50 60 70 80',
    seller_email: 'marc.benoit.med@gmail.com',
    status: 'rdv_pris',
    call_attempts_count: 3,
    last_contacted_at: '2026-03-01T17:00:00Z',
    next_followup_date: '2026-03-06',
    notes: 'RDV d\'estimation fixé le vendredi 6 mars à 14h30. Les propriétaires déménagent en région lyonnaise et sont fatigués de gérer les curieux le week-end.',
    estimated_dvf_m2: 3600,
    estimated_dvf_price: 648000,
    days_online: 74,
    created_at: '2025-12-18T11:00:00Z'
  },
  {
    id: 'pige-4',
    source: 'boitage',
    title: 'Maison traditionnelle quartier Les Costes - Contact Boîtage',
    property_type: 'maison',
    city: 'Pélissanne',
    postal_code: '13330',
    price_asked: 410000,
    price_drops_count: 0,
    living_area: 120,
    land_area: 600,
    rooms_count: 5,
    bedrooms_count: 3,
    description: 'Propriétaire ayant contacté l\'agence suite au flyer déposé dans sa boîte aux lettres. Projet de vente pour départ en retraite d\'ici fin 2026.',
    photos_urls: [],
    seller_name: 'M. et Mme ROUSTAN',
    seller_phone: '04 90 55 89 22',
    status: 'nouveau',
    call_attempts_count: 1,
    last_contacted_at: '2026-02-27T10:00:00Z',
    next_followup_date: '2026-03-04',
    notes: 'Très bon accueil au téléphone. Préfèrent confier l\'exclusivité à une agence locale de Pélissanne plutôt qu\'à un grand réseau national.',
    estimated_dvf_m2: 3300,
    estimated_dvf_price: 396000,
    days_online: 5,
    created_at: '2026-02-25T14:00:00Z'
  }
];

export const INITIAL_VENDOR_REPORTS: VendorReport[] = [
  {
    id: 'rep-1',
    property_id: 'prop-227',
    report_period: 'mensuel',
    generated_at: '2026-02-28T18:00:00Z',
    views_seloger: 1840,
    views_leboncoin: 1250,
    views_bienici: 760,
    views_website: 420,
    total_leads_count: 24,
    visits_count: 11,
    positive_feedbacks_count: 7,
    neutral_feedbacks_count: 3,
    negative_feedbacks_count: 1,
    executive_summary: 'Très forte visibilité de l\'annonce sur l\'ensemble des portails partenaires. L\'agencement des volumes, la luminosité et la piscine sont plébiscités. Le prix de présentation est jugé cohérent avec les prestations exceptionnelles.',
    price_recommendation_text: 'Maintien ferme du prix FAI à 786 600 €. Deux acquéreurs qualifiés préparent actuellement leur validation de financement bancaire.',
    suggested_price_adjustment: 0,
    shared_via_whatsapp: true,
    shared_via_email: true,
    viewed_by_seller_at: '2026-03-01T09:15:00Z',
    created_at: '2026-02-28T18:00:00Z'
  },
  {
    id: 'rep-2',
    property_id: 'prop-228',
    report_period: 'bilan_30_jours',
    generated_at: '2026-02-20T17:00:00Z',
    views_seloger: 1120,
    views_leboncoin: 940,
    views_bienici: 510,
    views_website: 290,
    total_leads_count: 16,
    visits_count: 8,
    positive_feedbacks_count: 5,
    neutral_feedbacks_count: 2,
    negative_feedbacks_count: 1,
    executive_summary: 'Excellente dynamique de visites. Une offre ferme d\'achat a été formulée et acceptée. Le dossier est en cours de transmission à l\'office notarial pour rédaction du compromis.',
    price_recommendation_text: 'Objectif atteint : vente négociée au plus près du mandat exclusif.',
    suggested_price_adjustment: 0,
    shared_via_whatsapp: true,
    shared_via_email: false,
    viewed_by_seller_at: '2026-02-21T11:40:00Z',
    created_at: '2026-02-20T17:00:00Z'
  }
];
