'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShieldCheck, AlertTriangle, AlertCircle, Edit3, CheckCircle2 } from 'lucide-react';
import type { Property } from '@/lib/types';
import { auditPropertyCompliance } from '@/lib/compliance';

interface ComplianceAuditModalProps {
  property: Property;
  onClose: () => void;
}

export function ComplianceAuditModal({ property, onClose }: ComplianceAuditModalProps) {
  const report = auditPropertyCompliance(property);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F3E8EE] space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E12B7B]">
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Pré-Vol Portails & ALUR</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-[#131B26] mt-1">
            Mandat #{property.mandate_number} — {property.city}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">{property.title}</p>
        </div>

        {/* Score Card */}
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            report.status === 'compliant'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : report.status === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div>
            <div className="text-2xl font-black">{report.score} %</div>
            <span className="text-xs font-bold">
              {report.status === 'compliant'
                ? 'Conformité Portails Optimale'
                : report.status === 'warning'
                ? 'Acceptable avec Avertissements'
                : 'Rejet Prévisible par les Portails'}
            </span>
          </div>
          <div className="text-right text-[11px] font-medium opacity-80">
            {report.readyForPortals ? (
              <span className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prêt pour diffusion</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-rose-700">
                <AlertCircle className="w-4 h-4" />
                <span>Bloquant détecté</span>
              </span>
            )}
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Points de Contrôle ({report.issues.length} élément(s))
          </h4>

          {report.issues.length === 0 ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Félicitations ! Ce mandat respecte 100% des critères ALUR et des règles de SeLoger,
                LeBonCoin et Bien’ici.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {report.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                    issue.severity === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {issue.severity === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block uppercase text-[10px] tracking-wider">
                      {issue.field}
                    </span>
                    <span>{issue.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            Fermer
          </button>
          <Link
            href={`/cockpit/mandats/${property.id}/edit`}
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Corriger la fiche mandat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
