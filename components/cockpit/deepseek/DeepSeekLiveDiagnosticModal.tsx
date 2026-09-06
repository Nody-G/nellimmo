'use client';

import React, { useState } from 'react';
import { X, Activity, CheckCircle2, AlertCircle, Loader2, Key } from 'lucide-react';
import { DeepSeekCallLog } from '@/lib/deepseek/telemetry';

interface DeepSeekLiveDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogGenerated?: (log: DeepSeekCallLog) => void;
}

export function DeepSeekLiveDiagnosticModal({
  isOpen,
  onClose,
  onLogGenerated,
}: DeepSeekLiveDiagnosticModalProps) {
  const [customKey, setCustomKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    latencyMs?: number;
    message?: string;
  }>({ status: 'idle' });

  if (!isOpen) return null;

  const handleRunPing = async () => {
    setIsLoading(true);
    setTestResult({ status: 'idle' });

    try {
      const headers: Record<string, string> = {};
      if (customKey.trim()) {
        headers['x-deepseek-key'] = customKey.trim();
      }

      const res = await fetch('/api/deepseek/telemetry?action=ping', {
        headers,
      });

      const data = await res.json();

      if (data.success) {
        setTestResult({
          status: 'success',
          latencyMs: data.latencyMs,
          message: 'Connecté avec succès à l’API officielle DeepSeek V4 Flash !',
        });
        if (data.log && onLogGenerated) {
          onLogGenerated(data.log);
        }
      } else {
        setTestResult({
          status: 'error',
          message: data.error || 'Échec de la connexion. Vérifiez la clé API.',
        });
      }
    } catch {
      setTestResult({
        status: 'error',
        message: 'Erreur réseau lors de la communication avec le serveur local.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm">
              Diagnostic & Ping DeepSeek V4 Flash
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-gray-600">
            Ce test effectue un ping officiel ultra-léger (1 token) vers l’API DeepSeek V4 pour vérifier la validité de la clé et mesurer la latence réseau.
          </p>

          <div>
            <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-gray-400" />
              Clé API Spécifique (facultatif si configurée dans .env.local)
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#E12B7B]"
            />
          </div>

          {testResult.status === 'success' && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Connectivité Parfaite</div>
                <div className="text-[11px]">
                  {testResult.message} (Latence : {testResult.latencyMs} ms)
                </div>
              </div>
            </div>
          )}

          {testResult.status === 'error' && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Erreur de Connexion</div>
                <div className="text-[11px]">{testResult.message}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs"
          >
            Fermer
          </button>
          <button
            onClick={handleRunPing}
            disabled={isLoading}
            className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 text-xs disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Test en cours...
              </>
            ) : (
              'Lancer le Ping Test'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
