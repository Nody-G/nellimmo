import type { AgencySettings } from '@/lib/types';

/** Merges a partial patch into the current settings form state. */
export type SettingsChange = (patch: Partial<AgencySettings>) => void;

/** Collections incluses dans la sauvegarde intégrale. */
const BACKUP_STORAGE_KEYS = [
    { key: 'properties', storage: 'nellimo_properties_v5' },
    { key: 'buyers', storage: 'nellimo_buyers_v4' },
    { key: 'visits', storage: 'nellimo_visits_v4' },
    { key: 'auditLogs', storage: 'nellimo_audit_v4' },
    { key: 'transactions', storage: 'nellimo_transactions_v1' },
    { key: 'contactLeads', storage: 'nellimo_contact_leads_v4' },
    { key: 'estimationLeads', storage: 'nellimo_estimation_leads_v4' },
    { key: 'prospectingLeads', storage: 'nellimo_prospecting_leads_v1' },
    { key: 'vendorReports', storage: 'nellimo_vendor_reports_v1' },
    { key: 'keys', storage: 'nellimo_agency_keys_v1' },
    { key: 'signboards', storage: 'nellimo_agency_signboards_v1' },
    { key: 'avenants', storage: 'nellimo_mandate_avenants_v1' },
    { key: 'proposals', storage: 'nellimo_buyer_proposals_v1' },
    { key: 'partners', storage: 'nellimo_interagency_partners_v1' },
    { key: 'delegations', storage: 'nellimo_interagency_delegations_v1' },
    { key: 'relances', storage: 'nellimo_relances_v1' },
    { key: 'contacts', storage: 'nellimo_contacts_v1' },
] as const;

/** Builds and downloads the master JSON backup from localStorage + current form. */
export function exportMasterBackup(formData: AgencySettings): void {
    const dataObj: Record<string, unknown> = {
        settings: formData,
    };

    for (const item of BACKUP_STORAGE_KEYS) {
        try {
            dataObj[item.key] = JSON.parse(localStorage.getItem(item.storage) || '[]');
        } catch {
            dataObj[item.key] = [];
        }
    }

    const backupData = {
        version: '2.6.0',
        exported_at: new Date().toISOString(),
        agency: formData.agency_name,
        collections_count: BACKUP_STORAGE_KEYS.length + 1,
        data: dataObj,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nellimmo_master_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

/** Restores a master backup JSON file into localStorage. Returns true on success. */
export function restoreMasterBackup(file: File): Promise<boolean> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.data && typeof json.data === 'object') {
                    if (json.data.settings) {
                        localStorage.setItem('nellimo_settings_v4', JSON.stringify(json.data.settings));
                    }
                    for (const item of BACKUP_STORAGE_KEYS) {
                        if (json.data[item.key] !== undefined) {
                            localStorage.setItem(item.storage, JSON.stringify(json.data[item.key]));
                        }
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch {
                resolve(false);
            }
        };
        reader.readAsText(file);
    });
}

/** Compte les acquéreurs inactifs depuis plus de N années (défaut: 3 ans selon recommandation CNIL). */
export function countInactiveBuyers(cutoffYears: number = 3): number {
    if (typeof window === 'undefined') return 0;
    try {
        const raw = localStorage.getItem('nellimo_buyers_v4');
        if (!raw) return 0;
        const buyers = JSON.parse(raw);
        if (!Array.isArray(buyers)) return 0;
        const cutoffMs = Date.now() - cutoffYears * 365.25 * 24 * 3600 * 1000;
        return buyers.filter((b: { created_at?: string; updated_at?: string }) => {
            const dateStr = b.updated_at || b.created_at;
            if (!dateStr) return false;
            const t = new Date(dateStr).getTime();
            return !isNaN(t) && t < cutoffMs;
        }).length;
    } catch {
        return 0;
    }
}

/** Purge conforme RGPD des acquéreurs inactifs depuis plus de N années. */
export function purgeInactiveBuyers(cutoffYears: number = 3): { purgedCount: number; remainingCount: number } {
    if (typeof window === 'undefined') return { purgedCount: 0, remainingCount: 0 };
    try {
        const raw = localStorage.getItem('nellimo_buyers_v4');
        if (!raw) return { purgedCount: 0, remainingCount: 0 };
        const buyers = JSON.parse(raw);
        if (!Array.isArray(buyers)) return { purgedCount: 0, remainingCount: 0 };
        const cutoffMs = Date.now() - cutoffYears * 365.25 * 24 * 3600 * 1000;
        const activeBuyers = buyers.filter((b: { created_at?: string; updated_at?: string }) => {
            const dateStr = b.updated_at || b.created_at;
            if (!dateStr) return true;
            const t = new Date(dateStr).getTime();
            return isNaN(t) || t >= cutoffMs;
        });
        const purgedCount = buyers.length - activeBuyers.length;
        localStorage.setItem('nellimo_buyers_v4', JSON.stringify(activeBuyers));
        return { purgedCount, remainingCount: activeBuyers.length };
    } catch {
        return { purgedCount: 0, remainingCount: 0 };
    }
}
