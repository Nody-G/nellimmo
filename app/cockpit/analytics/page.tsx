'use client';

import React from 'react';
import { useNellimoStore } from '@/lib/store';
import { computeAnalytics, type AnalyticsPeriod } from '@/lib/analytics';
import { AnalyticsHeader } from '@/components/cockpit/analytics/AnalyticsHeader';
import { AnalyticsKpisGrid } from '@/components/cockpit/analytics/AnalyticsKpisGrid';
import { PipelineFunnel } from '@/components/cockpit/analytics/PipelineFunnel';
import { PortfolioDistribution } from '@/components/cockpit/analytics/PortfolioDistribution';
import { MonthlyTrendChart } from '@/components/cockpit/analytics/MonthlyTrendChart';
import { PerformancePanel } from '@/components/cockpit/analytics/PerformancePanel';

export default function AnalyticsPage() {
    const {
        properties,
        buyers,
        visits,
        transactions,
        contactLeads,
        estimationLeads,
        prospectingLeads,
        proposals,
    } = useNellimoStore();

    const [period, setPeriod] = React.useState<AnalyticsPeriod>('all');

    const result = React.useMemo(
        () =>
            computeAnalytics(
                {
                    properties,
                    buyers,
                    visits,
                    transactions,
                    contactLeads,
                    estimationLeads,
                    prospectingLeads,
                    proposals,
                },
                period
            ),
        [properties, buyers, visits, transactions, contactLeads, estimationLeads, prospectingLeads, proposals, period]
    );

    return (
        <div className="space-y-6 animate-fade-in pb-16">
            <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

            <AnalyticsKpisGrid kpis={result.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    <PipelineFunnel stages={result.pipeline} />
                </div>
                <div className="lg:col-span-2">
                    <MonthlyTrendChart monthly={result.monthly} />
                </div>
            </div>

            <PortfolioDistribution
                byType={result.byType}
                byCity={result.byCity}
                byMandateType={result.byMandateType}
            />

            <PerformancePanel topVisited={result.topVisited} topProposed={result.topProposed} />
        </div>
    );
}
