import type { TransactionDeal, TransactionStatus } from '@/lib/types';

export const STATUS_COLUMNS: { id: TransactionStatus; label: string; color: string; badgeBg: string }[] = [
    { id: 'offre_acceptee', label: 'Offres Validées', color: 'border-amber-400 text-amber-800', badgeBg: 'bg-amber-50' },
    { id: 'compromis_signe', label: 'Compromis & SRU (10j)', color: 'border-blue-400 text-blue-800', badgeBg: 'bg-blue-50' },
    { id: 'attente_pret', label: 'Financement (J+60)', color: 'border-purple-400 text-purple-800', badgeBg: 'bg-purple-50' },
    { id: 'acte_planifie', label: 'Acte Planifié', color: 'border-indigo-400 text-indigo-800', badgeBg: 'bg-indigo-50' },
    { id: 'acte_signe', label: 'Ventes Clôturées', color: 'border-emerald-500 text-emerald-800', badgeBg: 'bg-emerald-50' },
];

export interface UrgentAlert {
    deal: TransactionDeal;
    label: string;
    days: number;
    type: 'warning' | 'urgent';
}

export function getDaysRemaining(targetDateStr?: string): number | null {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function computeUrgentAlert(activeDeals: TransactionDeal[]): UrgentAlert | null {
    let urgentAlert: UrgentAlert | null = null;
    const now = new Date().getTime();

    for (const deal of activeDeals) {
        const sruDate = deal.sru_expiry_date;
        if (sruDate && deal.status !== 'acte_signe') {
            const sruTime = new Date(sruDate).getTime();
            const diffDays = Math.ceil((sruTime - now) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && (!urgentAlert || diffDays < urgentAlert.days)) {
                urgentAlert = {
                    deal,
                    label: `Fin délai SRU (10j) sous ${diffDays}j`,
                    days: diffDays,
                    type: diffDays <= 3 ? 'urgent' : 'warning'
                };
            }
        }
        if (deal.loan_approval_deadline && deal.status !== 'acte_signe') {
            const loanTime = new Date(deal.loan_approval_deadline).getTime();
            const diffDays = Math.ceil((loanTime - now) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && (!urgentAlert || diffDays < urgentAlert.days)) {
                urgentAlert = {
                    deal,
                    label: `Accord de prêt sous ${diffDays}j`,
                    days: diffDays,
                    type: diffDays <= 15 ? 'urgent' : 'warning'
                };
            }
        }
        if (deal.final_deed_target_date && deal.status !== 'acte_signe') {
            const deedTime = new Date(deal.final_deed_target_date).getTime();
            const diffDays = Math.ceil((deedTime - now) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && (!urgentAlert || diffDays < urgentAlert.days)) {
                urgentAlert = {
                    deal,
                    label: `Acte notarié sous ${diffDays}j`,
                    days: diffDays,
                    type: diffDays <= 7 ? 'urgent' : 'warning'
                };
            }
        }
    }

    return urgentAlert;
}
