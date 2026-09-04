import type { AgencySettings } from '@/lib/types';

/** Merges a partial patch into the current settings form state. */
export type SettingsChange = (patch: Partial<AgencySettings>) => void;

/** Builds and downloads the master JSON backup from localStorage + current form. */
export function exportMasterBackup(formData: AgencySettings): void {
    const backupData = {
        version: '2.5.0',
        exported_at: new Date().toISOString(),
        agency: formData.agency_name,
        data: {
            properties: JSON.parse(localStorage.getItem('nellimo_properties_v5') || '[]'),
            buyers: JSON.parse(localStorage.getItem('nellimo_buyers_v4') || '[]'),
            visits: JSON.parse(localStorage.getItem('nellimo_visits_v4') || '[]'),
            auditLogs: JSON.parse(localStorage.getItem('nellimo_audit_v4') || '[]'),
            transactions: JSON.parse(localStorage.getItem('nellimo_transactions_v1') || '[]'),
            settings: formData,
            contactLeads: JSON.parse(localStorage.getItem('nellimo_contact_leads_v4') || '[]'),
            estimationLeads: JSON.parse(localStorage.getItem('nellimo_estimation_leads_v4') || '[]'),
        },
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
                if (json.data) {
                    if (json.data.properties) localStorage.setItem('nellimo_properties_v5', JSON.stringify(json.data.properties));
                    if (json.data.buyers) localStorage.setItem('nellimo_buyers_v4', JSON.stringify(json.data.buyers));
                    if (json.data.visits) localStorage.setItem('nellimo_visits_v4', JSON.stringify(json.data.visits));
                    if (json.data.auditLogs) localStorage.setItem('nellimo_audit_v4', JSON.stringify(json.data.auditLogs));
                    if (json.data.transactions) localStorage.setItem('nellimo_transactions_v1', JSON.stringify(json.data.transactions));
                    if (json.data.settings) localStorage.setItem('nellimo_settings_v4', JSON.stringify(json.data.settings));
                    if (json.data.contactLeads) localStorage.setItem('nellimo_contact_leads_v4', JSON.stringify(json.data.contactLeads));
                    if (json.data.estimationLeads) localStorage.setItem('nellimo_estimation_leads_v4', JSON.stringify(json.data.estimationLeads));
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
