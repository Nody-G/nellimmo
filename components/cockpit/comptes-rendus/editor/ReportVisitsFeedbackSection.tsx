'use client';

import React from 'react';

interface ReportVisitsFeedbackSectionProps {
  leadsCount: number;
  onChangeLeadsCount: (val: number) => void;
  visitsCount: number;
  onChangeVisitsCount: (val: number) => void;
  positiveFeedbacks: number;
  onChangePositiveFeedbacks: (val: number) => void;
  neutralFeedbacks: number;
  onChangeNeutralFeedbacks: (val: number) => void;
  negativeFeedbacks: number;
  onChangeNegativeFeedbacks: (val: number) => void;
}

export const ReportVisitsFeedbackSection: React.FC<ReportVisitsFeedbackSectionProps> = ({
  leadsCount,
  onChangeLeadsCount,
  visitsCount,
  onChangeVisitsCount,
  positiveFeedbacks,
  onChangePositiveFeedbacks,
  neutralFeedbacks,
  onChangeNeutralFeedbacks,
  negativeFeedbacks,
  onChangeNegativeFeedbacks
}) => {
  return (
    <div className="pt-2 border-t border-gray-200 space-y-3">
      <span className="text-[11px] font-bold uppercase text-gray-600 block">
        Retours Visiteurs & Qualification
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <label className="block font-bold text-gray-600 mb-1">Contacts Reçus</label>
          <input
            type="number"
            min={0}
            value={leadsCount}
            onChange={(e) => onChangeLeadsCount(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Visites Réalisées</label>
          <input
            type="number"
            min={0}
            value={visitsCount}
            onChange={(e) => onChangeVisitsCount(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center"
          />
        </div>
        <div>
          <label className="block font-bold text-emerald-700 mb-1">Coup de cœur (Positifs)</label>
          <input
            type="number"
            min={0}
            value={positiveFeedbacks}
            onChange={(e) => onChangePositiveFeedbacks(Number(e.target.value))}
            className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-center text-emerald-800"
          />
        </div>
        <div>
          <label className="block font-bold text-amber-700 mb-1">Hésitants (Neutres)</label>
          <input
            type="number"
            min={0}
            value={neutralFeedbacks}
            onChange={(e) => onChangeNeutralFeedbacks(Number(e.target.value))}
            className="w-full p-2 bg-amber-50 border border-amber-200 rounded-xl font-bold text-center text-amber-800"
          />
        </div>
        <div>
          <label className="block font-bold text-rose-700 mb-1">Réservés (Négatifs)</label>
          <input
            type="number"
            min={0}
            value={negativeFeedbacks}
            onChange={(e) => onChangeNegativeFeedbacks(Number(e.target.value))}
            className="w-full p-2 bg-rose-50 border border-rose-200 rounded-xl font-bold text-center text-rose-800"
          />
        </div>
      </div>
    </div>
  );
};
