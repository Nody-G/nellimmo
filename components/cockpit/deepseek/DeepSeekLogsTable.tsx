'use client';

import React, { useState } from 'react';
import { Download, Trash2, Search, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { DeepSeekCallLog } from '@/lib/deepseek/telemetry';
import { downloadDataset } from '@/lib/database-security';

interface DeepSeekLogsTableProps {
  logs: DeepSeekCallLog[];
  onClearLogs: () => void;
}

export function DeepSeekLogsTable({ logs, onClearLogs }: DeepSeekLogsTableProps) {
  const [filterText, setFilterText] = useState('');

  const filtered = logs.filter((log) => {
    if (!filterText) return true;
    const query = filterText.toLowerCase();
    return (
      log.featureLabel.toLowerCase().includes(query) ||
      log.model.toLowerCase().includes(query) ||
      log.status.toLowerCase().includes(query)
    );
  });

  const handleExport = (format: 'json' | 'csv') => {
    const filename = `deepseek-telemetry-logs-${new Date().toISOString().slice(0, 10)}.${format}`;
    downloadDataset(filename, logs as unknown as Array<Record<string, unknown>>, format);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Journal Télémétrique des Requêtes DeepSeek V4
          </h3>
          <p className="text-xs text-gray-500">
            {logs.length} appel{logs.length > 1 ? 's' : ''} tracé{logs.length > 1 ? 's' : ''} (500 max en mémoire locale)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrer les appels..."
              className="pl-8 pr-3 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E12B7B]"
            />
          </div>

          <button
            onClick={() => handleExport('csv')}
            title="Exporter en CSV"
            className="p-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              title="Vider le journal"
              className="p-1.5 text-xs text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            Aucun appel DeepSeek enregistré pour l’instant.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Date & Heure</th>
                <th className="py-2.5 px-3">Action & Module</th>
                <th className="py-2.5 px-3">Modèle</th>
                <th className="py-2.5 px-3">Tokens (Hit / Miss / Out)</th>
                <th className="py-2.5 px-3">Latence</th>
                <th className="py-2.5 px-3">Coût Réel</th>
                <th className="py-2.5 px-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((log) => {
                const date = new Date(log.timestamp);
                const timeStr = `${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

                return (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-2 px-3 text-gray-600 font-mono whitespace-nowrap">
                      {timeStr}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-900 truncate max-w-[200px]">
                      {log.featureLabel}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-mono text-[11px] text-gray-700">
                        {log.model}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">
                      <span className="text-emerald-600 font-bold">{log.promptCacheHitTokens}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-blue-600">{log.promptCacheMissTokens}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-[#E12B7B]">{log.completionTokens}</span>
                    </td>
                    <td className="py-2 px-3 font-mono text-gray-600 whitespace-nowrap">
                      {log.latencyMs} ms
                    </td>
                    <td className="py-2 px-3 font-semibold text-gray-900 whitespace-nowrap">
                      {log.cost?.costEur ? `${log.cost.costEur.toFixed(4)} €` : '0.0000 €'}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      {log.status === 'success' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      )}
                      {log.status === 'fallback' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Secours
                        </span>
                      )}
                      {log.status === 'error' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Erreur
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
