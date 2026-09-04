import type { HelpGuide } from '@/lib/help-content';

/** Filters guides by search query and selected category. */
export function filterGuides(
    guides: HelpGuide[],
    searchQuery: string,
    selectedCategory: string
): HelpGuide[] {
    const q = searchQuery.trim().toLowerCase();
    return guides.filter((guide) => {
        const matchCategory = selectedCategory === 'all' || guide.category === selectedCategory;
        if (!matchCategory) return false;
        if (!q) return true;

        const inTitle = guide.title.toLowerCase().includes(q);
        const inSummary = guide.summary.toLowerCase().includes(q);
        const inTags = guide.tags.some((t) => t.toLowerCase().includes(q));
        const inExample =
            guide.concreteExample.context.toLowerCase().includes(q) ||
            guide.concreteExample.location.toLowerCase().includes(q);
        const inSteps = guide.steps.some(
            (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );

        return inTitle || inSummary || inTags || inExample || inSteps;
    });
}

/** Computed legal deadline dates from a notification date. */
export interface LegalDates {
    sru: string;
    loanApp: string;
    loanApproval: string;
    finalDeed: string;
}

/** Computes SRU / loan / final deed dates from a compromise notification date. */
export function computeLegalDates(calcDate: string): LegalDates | null {
    if (!calcDate) return null;
    const base = new Date(calcDate);

    // SRU 10 days (starting next day)
    const sruDate = new Date(base);
    sruDate.setDate(sruDate.getDate() + 11);
    // If lands on Sunday, report to Monday
    if (sruDate.getDay() === 0) sruDate.setDate(sruDate.getDate() + 1);
    // If lands on Saturday, report to Monday
    if (sruDate.getDay() === 6) sruDate.setDate(sruDate.getDate() + 2);

    // Loan filing J+30
    const loanAppDate = new Date(base);
    loanAppDate.setDate(loanAppDate.getDate() + 30);

    // Loan approval J+60
    const loanApprovalDate = new Date(base);
    loanApprovalDate.setDate(loanApprovalDate.getDate() + 60);

    // Target final deed J+90
    const finalDeedDate = new Date(base);
    finalDeedDate.setDate(finalDeedDate.getDate() + 90);

    const fmt = (d: Date) =>
        d.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

    return {
        sru: fmt(sruDate),
        loanApp: fmt(loanAppDate),
        loanApproval: fmt(loanApprovalDate),
        finalDeed: fmt(finalDeedDate),
    };
}
