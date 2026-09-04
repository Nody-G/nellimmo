'use client';

import { Eye, Send } from 'lucide-react';

interface TopItem {
    propertyId: string;
    title: string;
    visits?: number;
    proposals?: number;
}

interface PerformancePanelProps {
    topVisited: TopItem[];
    topProposed: TopItem[];
}

function TopList({
    items,
    metricLabel,
    icon,
    accent,
}: {
    items: TopItem[];
    metricLabel: 'visits' | 'proposals';
    icon: React.ReactNode;
    accent: string;
}) {
    if (items.length === 0) {
        return <p className="text-xs text-gray-400 py-4 text-center">Aucune donnée.</p>;
    }
    return (
        <ol className="space-y-2">
            {items.map((item, idx) => {
                const count = metricLabel === 'visits' ? item.visits ?? 0 : item.proposals ?? 0;
                return (
                    <li key={item.propertyId} className="flex items-start gap-3">
                        <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${idx === 0 ? 'bg-[#FBF6E9] text-[#C59A45]' : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#131B26] leading-snug line-clamp-2">
                                {item.title}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {count} {count > 1 ? 'fois' : 'fois'}
                            </p>
                        </div>
                        <span className={`shrink-0 ${accent}`}>{icon}</span>
                    </li>
                );
            })}
        </ol>
    );
}

export function PerformancePanel({ topVisited, topProposed }: PerformancePanelProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#131B26]">Biens les plus visités</h3>
                        <p className="text-[11px] text-gray-400">Top 5 des visites</p>
                    </div>
                </div>
                <TopList
                    items={topVisited}
                    metricLabel="visits"
                    accent="text-rose-500"
                    icon={<Eye className="w-4 h-4" />}
                />
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
                        <Send className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#131B26]">Biens les plus proposés</h3>
                        <p className="text-[11px] text-gray-400">Top 5 des propositions CRM</p>
                    </div>
                </div>
                <TopList
                    items={topProposed}
                    metricLabel="proposals"
                    accent="text-[#E12B7B]"
                    icon={<Send className="w-4 h-4" />}
                />
            </div>
        </div>
    );
}
