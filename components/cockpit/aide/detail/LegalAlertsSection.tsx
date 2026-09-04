'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

interface LegalAlertsSectionProps {
  alerts: HelpGuide['legalAlerts'];
}

export function LegalAlertsSection({ alerts }: LegalAlertsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4" />
        <span>Points de Vigilance Juridique & Risques Évités</span>
      </h3>

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${
              alert.type === 'danger'
                ? 'bg-red-50/70 border-red-200 text-red-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {alert.type === 'danger' ? (
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm leading-snug">
                    {alert.title}
                  </span>
                  {alert.lawReference && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 font-mono font-bold text-gray-600 border border-gray-200">
                      {alert.lawReference}
                    </span>
                  )}
                </div>
                <p className="leading-relaxed opacity-90">{alert.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
