export type MandateType = 'exclusif' | 'simple' | 'semi-exclusif';
export type PropertyStatus = 'brouillon' | 'actif' | 'sous_compromis' | 'vendu' | 'archive' | 'resilie';
export type PropertyType = 'maison' | 'appartement' | 'terrain' | 'immeuble' | 'local_commercial';
export type SellerCivility = 'M' | 'Mme' | 'M_Mme' | 'SCI' | 'Societe';
export type FeesPaidBy = 'acquereur' | 'vendeur';
export type DpeLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type GesLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type FinancingStatus = 'comptant' | 'accord_bancaire_valide' | 'etude_courtier' | 'en_attente';
export type BuyerStatus = 'actif' | 'en_pause' | 'projet_abouti' | 'archive';

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  mandate_number: number;
  mandate_type: MandateType;
  mandate_date: string;
  mandate_end_date: string;
  status: PropertyStatus;

  // Seller info
  seller_civility?: SellerCivility;
  seller_name: string;
  seller_email?: string;
  seller_phone: string;
  seller_address: string;

  // Location & Title
  title: string;
  property_type: PropertyType;
  address: string;
  postal_code: string;
  city: string;
  latitude?: number;
  longitude?: number;
  display_exact_address: boolean;

  // Financials (Loi ALUR)
  price_fai: number;
  price_net_seller: number;
  agency_fees_amount: number;
  agency_fees_percentage: number;
  fees_paid_by: FeesPaidBy;

  // Specs
  living_area: number;
  carrez_area?: number;
  land_area?: number;
  rooms_count: number;
  bedrooms_count: number;
  bathrooms_count?: number;
  floor_number?: number;
  total_floors?: number;
  has_elevator?: boolean;

  // Energy & Climate (DPE / GES)
  dpe_value?: number;
  dpe_letter?: DpeLetter;
  ges_value?: number;
  ges_letter?: GesLetter;
  dpe_date?: string;
  dpe_reference_year?: string;
  energy_cost_min?: number;
  energy_cost_max?: number;

  // Description & Features
  description: string;
  features: string[]; // e.g. 'Piscine', 'Climatisation', 'Garage', 'Terrasse', 'Vue dégagée', 'Plain-pied'
  video_url?: string; // YouTube, Vimeo, MP4 direct
  virtual_tour_url?: string; // Matterport, Nodalview, etc.

  // Channels (Multidiffusion Portails)
  publish_website: boolean;
  publish_seloger: boolean;
  publish_leboncoin: boolean;
  publish_bienici: boolean;
  publish_figaro?: boolean;
  publish_greenacres?: boolean;
  publish_facebook?: boolean;
  url?: string;

  // Cadastre & Références Foncières Officielles
  cadastral_section?: string;
  cadastral_number?: string;
  cadastral_surface?: number;
  cadastral_id?: string;

  // Meta
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Seller Space & Security
  seller_token?: string; // Token d'accès unique pour l'Espace Vendeur en ligne

  // GED & Documents ALUR
  documents?: PropertyDocument[];

  // Signature Électronique
  electronic_signature?: SignatureCertificate;

  // Joined images
  images?: PropertyImage[];
}

export type AlurDocumentCategory = 'identite' | 'propriete' | 'diagnostics' | 'copropriete' | 'urbanisme' | 'autre';
export type AlurDocumentStatus = 'valide' | 'a_renouveler' | 'manquant' | 'en_attente';

export interface PropertyDocument {
  id: string;
  property_id: string;
  category: AlurDocumentCategory;
  name: string;
  filename?: string;
  file_url?: string;
  file_size?: number;
  uploaded_at: string;
  expires_at?: string;
  status: AlurDocumentStatus;
  mandatory: boolean;
  notes?: string;
}

export interface SignatureCertificate {
  id: string;
  mandate_number: number;
  signed_at: string;
  signer_name: string;
  signer_email: string;
  signer_phone: string;
  otp_code: string;
  sha256_fingerprint: string;
  ip_address: string;
  eidas_level: 'simple' | 'avance' | 'qualifie';
  contract_type: 'mandat_exclusif' | 'mandat_simple' | 'avenant_prix' | 'offre_achat';
  pdf_signed_url?: string;
}

export interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  status: BuyerStatus;
  budget_max: number;
  min_surface?: number;
  min_rooms?: number;
  min_bedrooms?: number;
  target_property_types: PropertyType[];
  target_cities: string[];
  must_have_garden: boolean;
  must_have_garage: boolean;
  financing_status: FinancingStatus;
  notes?: string;
  created_at: string;
}

export interface VisitSheet {
  id: string;
  property_id: string;
  buyer_id: string;
  visit_date: string;
  agent_id?: string;
  signature_data_url: string; // Base64 Canvas Drawing
  ip_address?: string;
  notes?: string;
  created_at: string;

  // Relations for display
  property?: Property;
  buyer?: Buyer;
}

export interface MandateAuditLog {
  id: string;
  property_id: string;
  mandate_number: number;
  action_type: 'creation' | 'modification_prix' | 'changement_statut' | 'resiliation';
  previous_state?: Partial<Property> | null;
  new_state: Partial<Property>;
  performed_by?: string;
  signature_sha256: string;
  logged_at: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  professional_card_number: string;
  role: 'admin' | 'agent';
  created_at: string;
}

export interface DVFTransaction {
  id: string;
  date_mutation: string;
  valeur_fonciere: number;
  adresse_numero: string;
  adresse_nom_voie: string;
  code_postal: string;
  nom_commune: string;
  type_local: string;
  surface_reelle_bati: number;
  nombre_pieces_principales: number;
  surface_terrain?: number;
  prix_m2: number;
  distance_metres?: number;
  latitude?: number;
  longitude?: number;
}

export interface MatchingResult {
  buyer: Buyer;
  score: number; // 0 to 100
  criteriaMatches: {
    budget: boolean;
    surface: boolean;
    rooms: boolean;
    propertyType: boolean;
    city: boolean;
    garden: boolean;
    garage: boolean;
  };
}

export type TransactionStatus =
  | 'offre_acceptee'
  | 'dossier_notaire_en_cours'
  | 'compromis_signe'
  | 'delai_sru_en_cours'
  | 'sru_purgee'
  | 'attente_pret'
  | 'pret_accorde'
  | 'acte_planifie'
  | 'acte_signe'
  | 'annule';

export interface TransactionDeal {
  id: string;
  property_id: string;
  buyer_id?: string;
  status: TransactionStatus;

  // Financials
  offer_price_fai: number;
  offer_price_net: number;
  agency_fees_amount: number;
  deposit_amount: number;
  deposit_percentage?: number;
  deposit_holder: string; // 'Notaire Vendeur', 'Notaire Acquéreur'

  // Parties & Notaires
  seller_name: string;
  seller_phone: string;
  seller_email?: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string;

  seller_notary_name: string;
  seller_notary_email: string;
  seller_notary_phone: string;
  seller_notary_office: string;

  buyer_notary_name?: string;
  buyer_notary_email?: string;
  buyer_notary_phone?: string;
  buyer_notary_office?: string;

  // Deadlines & Dates
  offer_date: string;
  compromis_date?: string;
  sru_notification_date?: string;
  sru_expiry_date?: string; // J+10
  loan_application_deadline?: string; // J+30
  loan_approval_deadline?: string; // J+45 ou J+60
  final_deed_target_date?: string;
  actual_closing_date?: string;

  // Financing
  loan_amount_requested?: number;
  loan_interest_rate_max?: number;
  loan_duration_years?: number;
  loan_bank_name?: string;
  broker_name?: string;

  // ALUR Checklist
  checklist_documents: {
    titre_propriete: boolean;
    taxe_fonciere: boolean;
    dossier_diagnostics: boolean;
    audit_energetique: boolean;
    pre_etat_date: boolean;
    reglement_copro: boolean;
    cni_vendeur: boolean;
    cni_acquereur: boolean;
    justificatif_domicile: boolean;
    simulation_pret: boolean;
    offre_achat_signee: boolean;
  };

  // Facturation & Honoraires
  invoice_number?: string;
  invoice_date?: string;
  invoice_sent_to_notary: boolean;
  fees_received: boolean;

  // Google Review
  google_review_requested?: boolean;

  notes?: string;
  created_at: string;
  updated_at: string;

  // Relations
  property?: Property;
  buyer?: Buyer;
}

export interface AgencySettings {
  agency_name: string;
  agent_name: string;
  card_t_number: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;

  // Mentions Légales & Inviolabilité
  siren?: string;
  rcs_city?: string;
  capital_social?: string;
  cci_card_t?: string;
  guarantee_fund_name?: string;
  guarantee_fund_amount?: string;
  guarantee_fund_address?: string;
  insurance_name?: string;
  insurance_policy?: string;
  mediator_name?: string;
  mediator_url?: string;
  bareme_honoraires_url?: string;
  agency_rib_iban?: string;
  agency_rib_bic?: string;

  // Passerelles SFTP Portails
  seloger_agency_code: string;
  seloger_sftp_host: string;
  seloger_sftp_user: string;
  leboncoin_sftp_host: string;
  leboncoin_sftp_user: string;
  sftp_password?: string;
  sftp_auto_sync_enabled?: boolean;
  sftp_sync_interval_hours?: number;
  last_sftp_sync_at?: string;
  last_sftp_sync_status?: 'success' | 'error' | 'idle';

  // Quotas Portails (Multi-diffusion)
  portal_quotas?: PortalQuotaConfig;

  // Réseaux Sociaux (Meta & LinkedIn)
  meta_app_id?: string;
  meta_app_secret?: string;
  facebook_page_id?: string;
  facebook_page_access_token?: string;
  instagram_business_id?: string;
  linkedin_client_id?: string;
  linkedin_client_secret?: string;
  social_autopost_new_mandate?: boolean;
  social_autopost_price_drop?: boolean;
  social_autopost_sold?: boolean;

  // Écosystème Google
  google_client_id?: string;
  google_client_secret?: string;
  google_calendar_id?: string;
  google_maps_api_key?: string;
  google_my_business_url?: string;
  google_drive_folder_id?: string;
  google_contacts_sync_enabled?: boolean;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  property_id?: string;
  property_title?: string;
  status: 'nouveau' | 'traite' | 'archive';
  created_at: string;
}

export interface EstimationLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_type: PropertyType;
  city: string;
  address: string;
  living_area: number;
  land_area?: number;
  rooms_count?: number;
  has_pool: boolean;
  status: 'nouveau' | 'en_cours' | 'avis_envoye' | 'archive';
  created_at: string;
}

export type ProspectingSource = 'leboncoin' | 'pap' | 'paruvendu' | 'boitage' | 'porte_a_porte' | 'recommandation';
export type ProspectingStatus = 'nouveau' | 'a_rappeler' | 'rdv_pris' | 'refus_agent' | 'deja_vendu' | 'mandat_obtenu';

export interface ProspectingLead {
  id: string;
  source: ProspectingSource;
  source_url?: string;
  title: string;
  property_type: PropertyType;
  city: string;
  postal_code: string;
  neighborhood?: string; // Quartier de prospection (ex: 'Enjouvènes', 'Les Viougues', 'Les Costes')
  price_asked: number;
  initial_price?: number;
  price_drops_count: number;
  living_area: number;
  land_area?: number;
  rooms_count: number;
  bedrooms_count?: number;
  description: string;
  photos_urls: string[];
  seller_name: string;
  seller_phone: string;
  seller_email?: string;
  status: ProspectingStatus;
  call_attempts_count: number;
  last_contacted_at?: string;
  next_followup_date?: string;
  notes?: string;
  estimated_dvf_m2?: number;
  estimated_dvf_price?: number;
  days_online: number;
  created_at: string;
}

export interface VendorReport {
  id: string;
  property_id: string;
  report_period: 'hebdomadaire' | 'mensuel' | 'bilan_30_jours';
  generated_at: string;
  views_seloger: number;
  views_leboncoin: number;
  views_bienici: number;
  views_website: number;
  total_leads_count: number;
  visits_count: number;
  positive_feedbacks_count: number;
  neutral_feedbacks_count: number;
  negative_feedbacks_count: number;
  executive_summary: string;
  price_recommendation_text: string;
  suggested_price_adjustment: number;
  /** Verbatim anonymisés des visiteurs (retours libres, sans identité). */
  anonymized_verbatims?: string[];
  shared_via_whatsapp: boolean;
  shared_via_email: boolean;
  viewed_by_seller_at?: string;
  created_at: string;
}

// ----------------------------------------------------
// REGISTRE DES CLÉS & PARC DE PANNEAUX D'AGENCE
// ----------------------------------------------------

export type KeyStatus = 'disponible' | 'prete' | 'double_proprietaire' | 'perdu';
export type KeyBorrowerRole = 'artisan' | 'diagnostiqueur' | 'confrere' | 'acquereur' | 'proprietaire' | 'autre';

export interface KeyLoanRecord {
  id: string;
  key_id: string;
  borrower_name: string;
  borrower_phone: string;
  borrower_company?: string;
  borrower_role: KeyBorrowerRole;
  borrowed_at: string;
  expected_return_at: string;
  returned_at?: string;
  purpose: string;
  signature_data_url?: string;
  discharged: boolean;
}

export interface AgencyKey {
  id: string;
  property_id: string;
  keyring_number: number;
  cabinet_location: string;
  keys_count: number;
  has_alarm_badge: boolean;
  status: KeyStatus;
  current_borrower?: KeyLoanRecord;
  loan_history?: KeyLoanRecord[];
  notes?: string;
  created_at: string;
  property?: Property;
}

export type SignboardType = 'a_vendre' | 'vendu' | 'exclusivite' | 'nouveau';
export type SignboardStatus = 'en_stock' | 'pose' | 'a_deposer' | 'depose';

export interface AgencySignboard {
  id: string;
  property_id?: string;
  signboard_type: SignboardType;
  status: SignboardStatus;
  installed_at?: string;
  removal_deadline?: string;
  location_details?: string;
  photo_url?: string;
  notes?: string;
  created_at: string;
  property?: Property;
}

// ----------------------------------------------------
// JURIDIQUE : AVENANTS AU MANDAT (LOI HOGUET ART. 72)
// ----------------------------------------------------

export type AvenantType = 'baisse_prix' | 'prorogation' | 'changement_conditions';

export interface MandateAvenant {
  id: string;
  mandate_number: number;
  property_id: string;
  avenant_number: number;
  avenant_type: AvenantType;
  previous_price_fai: number;
  new_price_fai: number;
  previous_price_net: number;
  new_price_net: number;
  previous_fees_amount: number;
  new_fees_amount: number;
  new_end_date?: string;
  reason: string;
  effective_date: string;
  is_signed: boolean;
  signed_at?: string;
  signature_sha256?: string;
  created_at: string;
}

// ----------------------------------------------------
// CRM : HISTORIQUE DE PROPOSITIONS & MATCHING 360°
// ----------------------------------------------------

export type ProposalChannel = 'whatsapp' | 'email' | 'telephone' | 'rdv_agence';
export type ProposalStatus = 'propose' | 'interesse' | 'visite_programmee' | 'refuse';

export interface ProposalHistory {
  id: string;
  property_id: string;
  buyer_id: string;
  proposed_at: string;
  channel: ProposalChannel;
  status: ProposalStatus;
  feedback?: string;
}

/** Agence confrère partenaire du réseau inter-agences (bourse / délégations). */
export interface PartnerAgency {
  id: string;
  agency_name: string;
  director_name: string;
  cpi_number: string;
  city: string;
  phone: string;
  email: string;
  financial_guarantee: string;
}

export type FeeShareRatio = '50_50' | '60_40' | '70_30';
export type DelegationType = 'co_exclusivite' | 'simple_delegation';
export type DelegationStatus = 'active' | 'en_attente_signature' | 'terminee' | 'vendu_partage';

/** Convention de délégation de mandat entre Nell'Immo et une agence confrère. */
export interface DelegationAgreement {
  id: string;
  property_id: string;
  partner_id: string;
  fee_share_ratio: FeeShareRatio;
  delegation_type: DelegationType;
  start_date: string;
  end_date: string;
  status: DelegationStatus;
  special_clauses?: string;
}

/** Configuration des quotas de publication par portail (pack annonces). */
export interface PortalQuotaConfig {
  seloger: number;
  leboncoin: number;
  bienici: number;
  figaro: number;
  greenacres: number;
  facebook: number;
}

export type SocialChannel = 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
export type SocialFormat = 'square' | 'story' | 'landscape' | 'carousel';
export type SocialBadge = 'exclusivite' | 'nouveau' | 'baisse_prix' | 'sous_compromis' | 'vendu' | 'coup_de_coeur';

/** Publication réseaux sociaux (Studio & Planner). */
export interface SocialPost {
  id: string;
  property_id: string;
  property_title: string;
  channel: SocialChannel;
  format: SocialFormat;
  badge: SocialBadge;
  content: string;
  image_url?: string;
  slide_images?: string[];
  scheduled_at?: string;
  status: 'brouillon' | 'planifie' | 'publie';
  created_at: string;
}
