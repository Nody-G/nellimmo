'use client';

import React, { useState, useMemo } from 'react';
import { useNellimoStore, useRelances } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import {
    computeRelances,
    sortRelances,
    filterRelancesByCategory,
    openRelanceWhatsApp,
    RELANCE_CATEGORY_META,
    RELANCE_CATEGORY_ORDER,
} from '@/lib/relances';
import type { RelanceAction, RelanceCategory } from '@/lib/relances';
import { RelancesHeader } from '@/components/cockpit/relances/RelancesHeader';
import { RelancesSummary } from '@/components/cockpit/relances/RelancesSummary';
import { RelancesList } from '@/components/cockpit/relances/RelancesList';

export default function RelancesPage() {
    const { properties, buyers, visits, transactions, settings } = useNellimoStore();
    const { relanceStatuses, setRelanceStatus, resetRelanceStatuses } = useRelances();
    const { showToast } = useToast();

    const [activeCategory, setActiveCategory] = useState<RelanceCategory | ''>('');

    // Toutes les actions calculées par le moteur (à la date du jour).
    const allActions = useMemo<RelanceAction[]>(() => {
        const computed = computeRelances({ properties, visits, transactions, buyers, settings });
        return sortRelances(computed);
    }, [properties, visits, transactions, buyers, settings]);

    // Actions encore à traiter (non marquées faite / ignorée).
    const pendingActions = useMemo<RelanceAction[]>(() => {
        return allActions.filter((a) => {
            const status = relanceStatuses[a.id];
            return status !== 'faite' && status !== 'ignoree';
        });
    }, [allActions, relanceStatuses]);

    const doneCount = useMemo(() => {
        return allActions.filter((a) => relanceStatuses[a.id] === 'faite').length;
    }, [allActions, relanceStatuses]);

    const filteredActions = useMemo(() => {
        return filterRelancesByCategory(pendingActions, activeCategory);
    }, [pendingActions, activeCategory]);

    const summaryItems = useMemo(() => {
        return RELANCE_CATEGORY_ORDER.map((cat) => ({
            category: cat,
            label: RELANCE_CATEGORY_META[cat].shortLabel,
            count: pendingActions.filter((a) => a.category === cat).length,
        }));
    }, [pendingActions]);

    const handleWhatsApp = (action: RelanceAction) => {
        if (!action.contactPhone) {
            showToast('Num\u00e9ro de t\u00e9l\u00e9phone manquant pour ce contact', 'error');
            return;
        }
        openRelanceWhatsApp(action);
    };

    const handleMarkDone = (action: RelanceAction) => {
        setRelanceStatus(action.id, 'faite');
        showToast('Relance marqu\u00e9e comme trait\u00e9e', 'success');
    };

    const handleIgnore = (action: RelanceAction) => {
        setRelanceStatus(action.id, 'ignoree');
        showToast('Relance ignor\u00e9e', 'info');
    };

    const handleReset = () => {
        resetRelanceStatuses();
        showToast('Historique des relances r\u00e9initialis\u00e9', 'success');
    };

    return (
        <div className="space-y-6 animate-fade-in pb-16">
            <RelancesHeader
                pendingCount={pendingActions.length}
                doneCount={doneCount}
                onReset={handleReset}
            />

            <RelancesSummary
                items={summaryItems}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        {activeCategory
                            ? RELANCE_CATEGORY_META[activeCategory].label
                            : 'Relances \u00e0 envoyer aujourd\u2019hui'}
                    </h2>
                    <span className="text-xs font-semibold text-gray-400">
                        {filteredActions.length} action{filteredActions.length > 1 ? 's' : ''}
                    </span>
                </div>
                <RelancesList
                    actions={filteredActions}
                    onWhatsApp={handleWhatsApp}
                    onMarkDone={handleMarkDone}
                    onIgnore={handleIgnore}
                />
            </div>
        </div>
    );
}
