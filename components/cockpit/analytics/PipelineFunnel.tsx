'use client';

import { Filter } from 'lucide-react';
import type { PipelineStage } from '@/lib/analytics';
import { formatEuro } from '@/lib/analytics';

interface PipelineFunnelProps {
    stages: PipelineStage[];
}

const STAGE_COLORS = [
    'bg-amber-400',
    'bg-blue-400',
    'bg-sky-400',
    'bg-purple-400',
    'bg-violet-400',
    'bg-indigo-400',
    'bg-indigo-500',
];

export function PipelineFunnel({ stages }: PipelineFunnelProps) {
    const maxCount = stages.length > 0 ? Math.max(...stages.map((s) => s.count)) : 0;

    return (
        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Filter className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-[#131B26]">Pipeline des Ventes</h3>
                    <p className="text-[11px] text-gray-400">Dossiers en cours par étape</p>
                </div>
            </div>

            {stages.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                    Aucun dossier en cours dans le pipeline.
                </p>
            ) : (
                <div className="space-y-2.5">
                    {stages.map((stage, idx) => {
                        const width = maxCount > 0 ? Math.max(12, (stage.count / maxCount) * 100) : 0;
                        return (
                            <div key={stage.status} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-gray-700">{stage.label}</span>
                                    <span className="text-gray-500">
                                        <span className="font-black text-[#131B26]">{stage.count}</span>
                                        {' · '}
                                        {formatEuro(stage.fees)}
                                    </span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${STAGE_COLORS[idx % STAGE_COLORS.length]}`}
                                        style={{ width: `${width}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
