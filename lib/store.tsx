'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Property,
  Buyer,
  VisitSheet,
  MandateAuditLog,
  AgencySettings,
  ContactLead,
  EstimationLead
} from './types';
import {
  INITIAL_PROPERTIES,
  INITIAL_BUYERS,
  INITIAL_VISIT_SHEETS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_AGENCY_SETTINGS,
  INITIAL_CONTACT_LEADS,
  INITIAL_ESTIMATION_LEADS
} from './mock-data';
import { computeSHA256 } from './hoguet';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PROPERTIES: 'nellimo_properties_v5',
  BUYERS: 'nellimo_buyers_v4',
  VISITS: 'nellimo_visits_v4',
  AUDIT: 'nellimo_audit_v4',
  SETTINGS: 'nellimo_settings_v4',
  CONTACT_LEADS: 'nellimo_contact_leads_v4',
  ESTIMATION_LEADS: 'nellimo_estimation_leads_v4',
};

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

interface NellimoContextType {
  properties: Property[];
  buyers: Buyer[];
  visits: VisitSheet[];
  auditLogs: MandateAuditLog[];
  settings: AgencySettings;
  contactLeads: ContactLead[];
  estimationLeads: EstimationLead[];
  isLoaded: boolean;
  isSupabaseActive: boolean;
  createProperty: (propertyData: Omit<Property, 'id' | 'mandate_number' | 'created_at' | 'updated_at'>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<Property | null>;
  deleteProperty: (id: string) => Promise<void>;
  createBuyer: (buyerData: Omit<Buyer, 'id' | 'created_at'>) => Promise<Buyer>;
  updateBuyer: (id: string, updates: Partial<Buyer>) => Promise<void>;
  deleteBuyer: (id: string) => Promise<void>;
  createVisitSheet: (visitData: Omit<VisitSheet, 'id' | 'created_at'>) => Promise<VisitSheet>;
  updateSettings: (newSettings: AgencySettings) => Promise<void>;
  addContactLead: (leadData: Omit<ContactLead, 'id' | 'created_at' | 'status'>) => Promise<ContactLead>;
  updateContactLeadStatus: (id: string, status: ContactLead['status']) => Promise<void>;
  deleteContactLead: (id: string) => Promise<void>;
  addEstimationLead: (leadData: Omit<EstimationLead, 'id' | 'created_at' | 'status'>) => Promise<EstimationLead>;
  updateEstimationLeadStatus: (id: string, status: EstimationLead['status']) => Promise<void>;
  deleteEstimationLead: (id: string) => Promise<void>;
  resetToDemoData: () => void;
}

const NellimoContext = createContext<NellimoContextType | null>(null);

export function NellimoProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => loadFromStorage(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES));
  const [buyers, setBuyers] = useState<Buyer[]>(() => loadFromStorage(STORAGE_KEYS.BUYERS, INITIAL_BUYERS));
  const [visits, setVisits] = useState<VisitSheet[]>(() => loadFromStorage(STORAGE_KEYS.VISITS, INITIAL_VISIT_SHEETS));
  const [auditLogs, setAuditLogs] = useState<MandateAuditLog[]>(() => loadFromStorage(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState<AgencySettings>(() => loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_AGENCY_SETTINGS));
  const [contactLeads, setContactLeads] = useState<ContactLead[]>(() => loadFromStorage(STORAGE_KEYS.CONTACT_LEADS, INITIAL_CONTACT_LEADS));
  const [estimationLeads, setEstimationLeads] = useState<EstimationLead[]>(() => loadFromStorage(STORAGE_KEYS.ESTIMATION_LEADS, INITIAL_ESTIMATION_LEADS));
  const [isLoaded, setIsLoaded] = useState(true);
  const [isSupabaseActive] = useState(() => isSupabaseConfigured());

  const updateProperties = useCallback((newProps: Property[]) => {
    setProperties(newProps);
    saveToStorage(STORAGE_KEYS.PROPERTIES, newProps);
  }, []);

  const updateBuyers = useCallback((newBuyers: Buyer[]) => {
    setBuyers(newBuyers);
    saveToStorage(STORAGE_KEYS.BUYERS, newBuyers);
  }, []);

  const updateVisits = useCallback((newVisits: VisitSheet[]) => {
    setVisits(newVisits);
    saveToStorage(STORAGE_KEYS.VISITS, newVisits);
  }, []);

  const updateAudit = useCallback((newAudit: MandateAuditLog[]) => {
    setAuditLogs(newAudit);
    saveToStorage(STORAGE_KEYS.AUDIT, newAudit);
  }, []);

  const updateSettingsHandler = useCallback((newSettings: AgencySettings) => {
    setSettings(newSettings);
    saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);
  }, []);

  const updateContactLeads = useCallback((newLeads: ContactLead[]) => {
    setContactLeads(newLeads);
    saveToStorage(STORAGE_KEYS.CONTACT_LEADS, newLeads);
  }, []);

  const updateEstimationLeads = useCallback((newLeads: EstimationLead[]) => {
    setEstimationLeads(newLeads);
    saveToStorage(STORAGE_KEYS.ESTIMATION_LEADS, newLeads);
  }, []);

  // --- SUPABASE REALTIME & INITIAL FETCH SYNC ---
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    // 1. Initial Load from Supabase
    async function loadSupabaseData() {
      if (!supabase) return;
      try {
        const [
          { data: propsData },
          { data: buyersData },
          { data: visitsData },
          { data: auditData },
          { data: contactsData },
          { data: estData },
          { data: settingsData },
        ] = await Promise.all([
          supabase.from('properties').select('*, images:property_images(*)').order('mandate_number', { ascending: false }),
          supabase.from('buyers').select('*').order('created_at', { ascending: false }),
          supabase.from('visit_sheets').select('*').order('visit_date', { ascending: false }),
          supabase.from('mandate_audit_logs').select('*').order('logged_at', { ascending: false }),
          supabase.from('contact_leads').select('*').order('created_at', { ascending: false }),
          supabase.from('estimation_leads').select('*').order('created_at', { ascending: false }),
          supabase.from('agency_settings').select('*').single(),
        ]);

        if (propsData && propsData.length > 0) updateProperties(propsData as Property[]);
        if (buyersData && buyersData.length > 0) updateBuyers(buyersData as Buyer[]);
        if (visitsData && visitsData.length > 0) updateVisits(visitsData as VisitSheet[]);
        if (auditData && auditData.length > 0) updateAudit(auditData as MandateAuditLog[]);
        if (contactsData) updateContactLeads(contactsData as ContactLead[]);
        if (estData) updateEstimationLeads(estData as EstimationLead[]);
        if (settingsData) updateSettingsHandler(settingsData as AgencySettings);
      } catch (err) {
        console.warn('Supabase fetch error, fallback to local storage:', err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadSupabaseData();

    // 2. Realtime WebSocket Channel Subscriptions
    const channel = supabase
      .channel('nellimo-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        loadSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buyers' }, () => {
        loadSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visit_sheets' }, () => {
        loadSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_leads' }, () => {
        loadSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'estimation_leads' }, () => {
        loadSupabaseData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateProperties, updateBuyers, updateVisits, updateAudit, updateContactLeads, updateEstimationLeads, updateSettingsHandler]);

  // --- ACTIONS MANDATS HOGUET ---

  const createProperty = async (propertyData: Omit<Property, 'id' | 'mandate_number' | 'created_at' | 'updated_at'>) => {
    const highestNumber = properties.reduce((max, p) => Math.max(max, p.mandate_number || 100), 100);
    const nextMandateNumber = highestNumber + 1;
    const now = new Date().toISOString();
    const newId = `prop-${Date.now()}`;

    const newProperty: Property = {
      ...propertyData,
      id: newId,
      mandate_number: nextMandateNumber,
      created_at: now,
      updated_at: now,
      images: propertyData.images || [],
    };

    const signature = await computeSHA256({
      action: 'creation',
      mandate_number: nextMandateNumber,
      price_fai: newProperty.price_fai,
      seller_name: newProperty.seller_name,
      timestamp: now,
    });

    const newAuditLog: MandateAuditLog = {
      id: `audit-${Date.now()}`,
      property_id: newId,
      mandate_number: nextMandateNumber,
      action_type: 'creation',
      new_state: newProperty,
      signature_sha256: signature,
      logged_at: now,
    };

    const updatedList = [newProperty, ...properties];
    const updatedLogs = [newAuditLog, ...auditLogs];

    updateProperties(updatedList);
    updateAudit(updatedLogs);

    // Supabase push if active
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { images, ...propPayload } = newProperty;
          await supabase.from('properties').insert([propPayload]);
          if (images && images.length > 0) {
            await supabase.from('property_images').insert(
              images.map(img => ({
                property_id: newProperty.id,
                image_url: img.image_url,
                display_order: img.display_order || 1,
                is_cover: Boolean(img.is_cover),
              }))
            );
          }
          await supabase.from('mandate_audit_logs').insert([newAuditLog]);
        } catch (e) {
          console.error('Error inserting into Supabase:', e);
        }
      }
    }

    return newProperty;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const oldProperty = properties.find(p => p.id === id);
    if (!oldProperty) return null;

    const now = new Date().toISOString();
    const updatedProperty: Property = {
      ...oldProperty,
      ...updates,
      updated_at: now,
    };

    let actionType: MandateAuditLog['action_type'] = 'changement_statut';
    if (updates.price_fai && updates.price_fai !== oldProperty.price_fai) {
      actionType = 'modification_prix';
    } else if (updates.status === 'resilie') {
      actionType = 'resiliation';
    }

    const signature = await computeSHA256({
      action: actionType,
      mandate_number: oldProperty.mandate_number,
      previous_price: oldProperty.price_fai,
      new_price: updatedProperty.price_fai,
      previous_status: oldProperty.status,
      new_status: updatedProperty.status,
      timestamp: now,
    });

    const newAuditLog: MandateAuditLog = {
      id: `audit-${Date.now()}`,
      property_id: id,
      mandate_number: oldProperty.mandate_number,
      action_type: actionType,
      previous_state: oldProperty,
      new_state: updatedProperty,
      signature_sha256: signature,
      logged_at: now,
    };

    const updatedList = properties.map(p => p.id === id ? updatedProperty : p);
    const updatedLogs = [newAuditLog, ...auditLogs];

    updateProperties(updatedList);
    updateAudit(updatedLogs);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const propPayload = { ...updatedProperty };
          delete propPayload.images;
          await supabase.from('properties').update(propPayload).eq('id', id);
          await supabase.from('mandate_audit_logs').insert([newAuditLog]);
        } catch (e) {
          console.error('Error updating Supabase property:', e);
        }
      }
    }

    return updatedProperty;
  };

  const deleteProperty = async (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;

    const now = new Date().toISOString();
    const signature = await computeSHA256({
      action: 'resiliation',
      mandate_number: prop.mandate_number,
      timestamp: now,
    });

    const newAuditLog: MandateAuditLog = {
      id: `audit-${Date.now()}`,
      property_id: id,
      mandate_number: prop.mandate_number,
      action_type: 'resiliation',
      previous_state: prop,
      new_state: { ...prop, status: 'resilie' },
      signature_sha256: signature,
      logged_at: now,
    };

    const updatedList = properties.filter(p => p.id !== id);
    const updatedLogs = [newAuditLog, ...auditLogs];

    updateProperties(updatedList);
    updateAudit(updatedLogs);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('properties').delete().eq('id', id);
          await supabase.from('mandate_audit_logs').insert([newAuditLog]);
        } catch (e) {
          console.error('Error deleting property from Supabase:', e);
        }
      }
    }
  };

  // --- ACTIONS CRM ACQUÉREURS ---

  const createBuyer = async (buyerData: Omit<Buyer, 'id' | 'created_at'>) => {
    const newBuyer: Buyer = {
      ...buyerData,
      id: `buyer-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newBuyer, ...buyers];
    updateBuyers(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('buyers').insert([newBuyer]);
        } catch (e) {
          console.error('Error inserting buyer to Supabase:', e);
        }
      }
    }

    return newBuyer;
  };

  const updateBuyer = async (id: string, updates: Partial<Buyer>) => {
    const updated = buyers.map(b => b.id === id ? { ...b, ...updates } : b);
    updateBuyers(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('buyers').update(updates).eq('id', id);
        } catch (e) {
          console.error('Error updating buyer in Supabase:', e);
        }
      }
    }
  };

  const deleteBuyer = async (id: string) => {
    const updated = buyers.filter(b => b.id !== id);
    updateBuyers(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('buyers').delete().eq('id', id);
        } catch (e) {
          console.error('Error deleting buyer from Supabase:', e);
        }
      }
    }
  };

  // --- ACTIONS BONS DE VISITE ---

  const createVisitSheet = async (visitData: Omit<VisitSheet, 'id' | 'created_at'>) => {
    const newVisit: VisitSheet = {
      ...visitData,
      id: `visit-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newVisit, ...visits];
    updateVisits(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('visit_sheets').insert([newVisit]);
        } catch (e) {
          console.error('Error inserting visit sheet to Supabase:', e);
        }
      }
    }

    return newVisit;
  };

  // --- ACTIONS PARAMÈTRES ---

  const updateSettingsAction = async (newSettings: AgencySettings) => {
    updateSettingsHandler(newSettings);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('agency_settings').upsert({ id: 'default', ...newSettings });
        } catch (e) {
          console.error('Error saving settings to Supabase:', e);
        }
      }
    }
  };

  // --- ACTIONS LEADS DE CONTACT ---

  const addContactLead = async (leadData: Omit<ContactLead, 'id' | 'created_at' | 'status'>) => {
    const newLead: ContactLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'nouveau',
      created_at: new Date().toISOString(),
    };
    const updated = [newLead, ...contactLeads];
    updateContactLeads(updated);

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

  const updateContactLeadStatus = async (id: string, status: ContactLead['status']) => {
    const updated = contactLeads.map(l => l.id === id ? { ...l, status } : l);
    updateContactLeads(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('contact_leads').update({ status }).eq('id', id);
        } catch (e) {
          console.error('Error updating contact lead in Supabase:', e);
        }
      }
    }
  };

  const deleteContactLead = async (id: string) => {
    const updated = contactLeads.filter(l => l.id !== id);
    updateContactLeads(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('contact_leads').delete().eq('id', id);
        } catch (e) {
          console.error('Error deleting contact lead from Supabase:', e);
        }
      }
    }
  };

  // --- ACTIONS ESTIMATIONS ---

  const addEstimationLead = async (leadData: Omit<EstimationLead, 'id' | 'created_at' | 'status'>) => {
    const newLead: EstimationLead = {
      ...leadData,
      id: `est-${Date.now()}`,
      status: 'nouveau',
      created_at: new Date().toISOString(),
    };
    const updated = [newLead, ...estimationLeads];
    updateEstimationLeads(updated);

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

  const updateEstimationLeadStatus = async (id: string, status: EstimationLead['status']) => {
    const updated = estimationLeads.map(l => l.id === id ? { ...l, status } : l);
    updateEstimationLeads(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('estimation_leads').update({ status }).eq('id', id);
        } catch (e) {
          console.error('Error updating estimation lead in Supabase:', e);
        }
      }
    }
  };

  const deleteEstimationLead = async (id: string) => {
    const updated = estimationLeads.filter(l => l.id !== id);
    updateEstimationLeads(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('estimation_leads').delete().eq('id', id);
        } catch (e) {
          console.error('Error deleting estimation lead from Supabase:', e);
        }
      }
    }
  };

  // --- RESET DEMO PROVENCE ---

  const resetToDemoData = () => {
    updateProperties(INITIAL_PROPERTIES);
    updateBuyers(INITIAL_BUYERS);
    updateVisits(INITIAL_VISIT_SHEETS);
    updateAudit(INITIAL_AUDIT_LOGS);
    updateSettingsHandler(DEFAULT_AGENCY_SETTINGS);
    updateContactLeads(INITIAL_CONTACT_LEADS);
    updateEstimationLeads(INITIAL_ESTIMATION_LEADS);
  };

  const value: NellimoContextType = {
    properties,
    buyers,
    visits,
    auditLogs,
    settings,
    contactLeads,
    estimationLeads,
    isLoaded,
    isSupabaseActive,
    createProperty,
    updateProperty,
    deleteProperty,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    createVisitSheet,
    updateSettings: updateSettingsAction,
    addContactLead,
    updateContactLeadStatus,
    deleteContactLead,
    addEstimationLead,
    updateEstimationLeadStatus,
    deleteEstimationLead,
    resetToDemoData,
  };

  return <NellimoContext.Provider value={value}>{children}</NellimoContext.Provider>;
}

export function useNellimoStore(): NellimoContextType {
  const context = useContext(NellimoContext);
  if (!context) {
    return {
      properties: INITIAL_PROPERTIES,
      buyers: INITIAL_BUYERS,
      visits: INITIAL_VISIT_SHEETS,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: DEFAULT_AGENCY_SETTINGS,
      contactLeads: INITIAL_CONTACT_LEADS,
      estimationLeads: INITIAL_ESTIMATION_LEADS,
      isLoaded: true,
      isSupabaseActive: false,
      createProperty: async (p) => ({ ...p, id: 'prop-temp', mandate_number: 999, created_at: '', updated_at: '' }),
      updateProperty: async () => null,
      deleteProperty: async () => {},
      createBuyer: async (b) => ({ ...b, id: 'buyer-temp', created_at: '' }),
      updateBuyer: async () => {},
      deleteBuyer: async () => {},
      createVisitSheet: async (v) => ({ ...v, id: 'visit-temp', created_at: '' }),
      updateSettings: async () => {},
      addContactLead: async (l) => ({ ...l, id: 'lead-temp', status: 'nouveau', created_at: '' }),
      updateContactLeadStatus: async () => {},
      deleteContactLead: async () => {},
      addEstimationLead: async (e) => ({ ...e, id: 'est-temp', status: 'nouveau', created_at: '' }),
      updateEstimationLeadStatus: async () => {},
      deleteEstimationLead: async () => {},
      resetToDemoData: () => {},
    };
  }
  return context;
}
