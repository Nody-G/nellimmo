'use client';

import React from 'react';
import { History, Calendar, CheckCircle2 } from 'lucide-react';
import type { VendorReport } from '@/lib/types';

interface ReportsHistoryListProps {
  reports: VendorReport[];
  selectedReportId?: string;
  onSelectReport: (report: VendorReport) => void;
}

export function ReportsHistoryList({
  reports,
  selectedReportId,
  onSelectReport,
}: ReportsHistoryListProps) {
  if (reports.length <= 1) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4 print:hidden">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <History className="w-4 h-4 text-[#C59A45]" />
        <h3 className="font-serif font-bold text-base text-[#131B26]">
          Historique des Bilans Générés pour ce Mandat ({reports.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        {reports.map((report) => {
          const isCurrent = report.id === selectedReportId;
          const totalViews = report.views_seloger + report.views_leboncoin + report.views_bienici + report.views_website;
          const periodLabel = report.report_period === 'hebdomadaire'
            ? 'Hebdo'
            : report.report_period === 'mensuel'
            ? 'Mensuel'
            : '30 Jours';

          return (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelectReport(report)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-2 ${
                isCurrent
                  ? 'border-[#E12B7B] bg-pink-50/30 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#131B26] text-white">
                  {periodLabel}
                </span>
                {report.shared_via_whatsapp && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Envoyé WhatsApp
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>{new Date(report.generated_at).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
                <span className="text-gray-600">{totalViews} vues</span>
                <span className="font-bold text-[#E12B7B]">{report.visits_count} visites</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
