'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    Property,
    AgencySettings,
    VisitSheet,
    VendorReport,
    ContactLead,
    EstimationLead,
    Buyer,
} from './types';
import {
    INITIAL_PROPERTIES,
    DEFAULT_AGENCY_SETTINGS,
    INITIAL_VISIT_SHEETS,
    INITIAL_VENDOR_REPORTS,
} from './mock-data-public';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

/**
 * PUBLIC DATA STORE
 * -----------------
 * Lean, public-facing data provider mounted ONLY in the public route group.
 *
 * It deliberately imports from `./mock-data-public` (never `./mock-data-cockpit`),
 * so cockpit-only datasets (buyers, transactions, keys, signboards, audit logs,
 * prospecting, avenants, proposals, internal leads) are NEVER bundled or shipped
 * to public visitors.
 *
 * It reads/writes the SAME localStorage keys as the cockpit store, so property
 * edits made in the cockpit are reflected on the public site (and vice-versa).
 *
 * This mirrors the future Supabase RLS split: public pages will query a public
 * read-only view / anon key, while the cockpit queries owner-scoped data.
 */

const PUBLIC_STORAGE_KEYS = {
    PROPERTIES: 'nellimo_properties_v5',
    SETTINGS: 'nellimo_settings_v4',
    VISITS: 'nellimo_visits_v4',
    VENDOR_REPORTS: 'nellimo_vendor_reports_v1',
    CONTACT_LEADS: 'nellimo_contact_leads_v4',
    ESTIMATION_LEADS: 'nellimo_estimation_leads_v4',
} as const;

function loadFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error(`Error loading key ${key}:`, e);
        return defaultValue;
    }
}

function saveToStorage<T>(key: string, value: T) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error saving key ${key}:`, e);
    }
}

/**
 * Public-safe projection of a visit.
 *
 * The seller portal (Espace Vendeur) only needs the buyer's first name and last
 * initial for display. The full `VisitSheet.buyer` relation embeds the complete
 * Buyer record (phone, email, budget, target cities, financing status, ...) which
 * is cockpit PII. We therefore strip the buyer down to a display-only subset so
 * that no contact PII is ever shipped to / rendered by public visitors.
 */
function sanitizeVisits(visits: VisitSheet[]): VisitSheet[] {
    return visits.map((visit) => {
        if (!visit.buyer) return visit;
        const buyer: Buyer = {
            ...visit.buyer,
            email: undefined,
            phone: '',
            status: visit.buyer.status,
            budget_max: 0,
            min_surface: undefined,
            min_rooms: undefined,
            min_bedrooms: undefined,
            target_property_types: [],
            target_cities: [],
            must_have_garden: false,
            must_have_garage: false,
            financing_status: visit.buyer.financing_status,
            notes: undefined,
            // Keep only the first letter of the surname for display.
            last_name: visit.buyer.last_name?.slice(0, 1) ?? '',
        };
        return { ...visit, buyer };
    });
}

export interface PublicStoreContextType {
    properties: Property[];
    settings: AgencySettings;
    visits: VisitSheet[];
    vendorReports: VendorReport[];
    addContactLead: (leadData: Omit<ContactLead, 'id' | 'created_at' | 'status'>) => Promise<ContactLead>;
    addEstimationLead: (leadData: Omit<EstimationLead, 'id' | 'created_at' | 'status'>) => Promise<EstimationLead>;
}

const PublicStoreContext = createContext<PublicStoreContextType | null>(null);

export function PublicNellimoProvider({ children }: { children: ReactNode }) {
    const [properties, setProperties] = useState<Property[]>(() =>
        loadFromStorage(PUBLIC_STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES)
    );
    const [settings, setSettings] = useState<AgencySettings>(() =>
        loadFromStorage(PUBLIC_STORAGE_KEYS.SETTINGS, DEFAULT_AGENCY_SETTINGS)
    );
    const [visits, setVisits] = useState<VisitSheet[]>(() =>
        sanitizeVisits(loadFromStorage<VisitSheet[]>(PUBLIC_STORAGE_KEYS.VISITS, INITIAL_VISIT_SHEETS))
    );
    const [vendorReports, setVendorReports] = useState<VendorReport[]>(() =>
        loadFromStorage(PUBLIC_STORAGE_KEYS.VENDOR_REPORTS, INITIAL_VENDOR_REPORTS)
    );
    const [contactLeads, setContactLeads] = useState<ContactLead[]>(() =>
        loadFromStorage<ContactLead[]>(PUBLIC_STORAGE_KEYS.CONTACT_LEADS, [])
    );
    const [estimationLeads, setEstimationLeads] = useState<EstimationLead[]>(() =>
        loadFromStorage<EstimationLead[]>(PUBLIC_STORAGE_KEYS.ESTIMATION_LEADS, [])
    );

    // Keep public property list in sync with cockpit edits across tabs.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === PUBLIC_STORAGE_KEYS.PROPERTIES && e.newValue) {
                try {
                    setProperties(JSON.parse(e.newValue));
                } catch {
                    /* ignore malformed */
                }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const addContactLead = async (leadData: Omit<ContactLead, 'id' | 'created_at' | 'status'>) => {
        const newLead: ContactLead = {
            ...leadData,
            id: `lead-${Date.now()}`,
            status: 'nouveau',
            created_at: new Date().toISOString(),
        };
        const updated = [newLead, ...contactLeads];
        setContactLeads(updated);
        saveToStorage(PUBLIC_STORAGE_KEYS.CONTACT_LEADS, updated);

        if (isSupabaseConfigured()) {
            const supabase = getSupabaseClient();
            if (supabase) {
                try {
                    await supabase.from('contact_leads').insert([newLead]);
                } catch (e) {
                    console.error('Error inserting contact lead to Supabase:', e);
                }
            }
        }
        return newLead;
    };

    const addEstimationLead = async (leadData: Omit<EstimationLead, 'id' | 'created_at' | 'status'>) => {
        const newLead: EstimationLead = {
            ...leadData,
            id: `est-${Date.now()}`,
            status: 'nouveau',
            created_at: new Date().toISOString(),
        };
        const updated = [newLead, ...estimationLeads];
        setEstimationLeads(updated);
        saveToStorage(PUBLIC_STORAGE_KEYS.ESTIMATION_LEADS, updated);

        if (isSupabaseConfigured()) {
            const supabase = getSupabaseClient();
            if (supabase) {
                try {
                    await supabase.from('estimation_leads').insert([newLead]);
                } catch (e) {
                    console.error('Error inserting estimation lead to Supabase:', e);
                }
            }
        }
        return newLead;
    };

    const value: PublicStoreContextType = {
        properties,
        settings,
        visits,
        vendorReports,
        addContactLead,
        addEstimationLead,
    };

    return <PublicStoreContext.Provider value={value}>{children}</PublicStoreContext.Provider>;
}

/**
 * Public-facing hook. Public pages import `useNellimoStore` from this module so
 * they never pull the cockpit store (and its cockpit-only datasets) into the
 * public bundle. The hook name is kept identical to the cockpit one to minimise
 * churn in page code.
 */
export function useNellimoStore(): PublicStoreContextType {
    const context = useContext(PublicStoreContext);
    if (!context) {
        return {
            properties: INITIAL_PROPERTIES,
            settings: DEFAULT_AGENCY_SETTINGS,
            visits: sanitizeVisits(INITIAL_VISIT_SHEETS),
            vendorReports: INITIAL_VENDOR_REPORTS,
            addContactLead: async (l) => ({ ...l, id: 'lead-temp', status: 'nouveau', created_at: '' }),
            addEstimationLead: async (e) => ({ ...e, id: 'est-temp', status: 'nouveau', created_at: '' }),
        };
    }
    return context;
}
