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

  // Channels
  publish_website: boolean;
  publish_seloger: boolean;
  publish_leboncoin: boolean;
  publish_bienici: boolean;
  url?: string;

  // Meta
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Joined images
  images?: PropertyImage[];
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

export interface AgencySettings {
  agency_name: string;
  agent_name: string;
  card_t_number: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
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
  bienici_feed_token: string;
  deepseek_api_key?: string;
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

