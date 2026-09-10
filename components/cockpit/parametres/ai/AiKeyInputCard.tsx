'use client';

import React from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Save,
  Trash2,
} from 'lucide-react';
import { useAiKeyManager } from './useAiKeyManager';
import type { AgencySettings } from '@/lib/types';

interface AiKeyInputCardProps {
  formData: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
  serverKeyStatus: { hasKey: boolean; maskedKey: string } | null;
  onServerKeyStatusChange: (status: { hasKey: boolean; maskedKey: string } | null) => void;
}

export function AiKeyInputCard({
  formData,
  onChange,
  serverKeyStatus,
  onServerKeyStatusChange,
}: AiKeyInputCardProps) {
  const {
    apiKeyInput,
    setApiKeyInput,
    showKey,
    setShowKey,
    isTesting,
    isSaving,
    testResult,
    setTestResult,
    handleTestKey,
    handleSaveKey,
    handleDisconnect,
  } = useAiKeyManager({ formData, onChange, onServerKeyStatusChange });

  const isConnected = Boolean(serverKeyStatus?.hasKey || formData.deepseek_api_key);

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-gray-700 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-[#E12B7B]" />
          <span>Clé API Secrète DeepSeek (sk-...)</span>
        </span>
        {serverKeyStatus?.maskedKey && (
          <span className="text-[11px] font-mono text-gray-500 font-normal">
            Enregistrée : {serverKeyStatus.maskedKey}
          </span>
        )}
      </label>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={apiKeyInput}
            onChange={(e) => {
              setApiKeyInput(e.target.value);
              setTestResult(null);
            }}
            className="w-full text-xs font-mono p-2.5 pr-10 rounded-xl border border-gray-200 focus:border-[#E12B7B] focus:ring-1 focus:ring-[#E12B7B] transition bg-white"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
            title={showKey ? 'Masquer la clé' : 'Afficher la clé'}
          >
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleTestKey}
          disabled={isTesting || (!apiKeyInput && !formData.deepseek_api_key)}
          className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E12B7B]" />
              <span>Test...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Tester la Clé</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSaveKey}
          disabled={isSaving}
          className="px-4 py-2.5 rounded-xl bg-[#E12B7B] hover:bg-[#c22066] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Enregistrer</span>
        </button>

        {isConnected && (
          <button
            type="button"
            onClick={handleDisconnect}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
            title="Déconnecter la clé API"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {testResult && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <div className="flex-1">
            <span className="font-bold">{testResult.message}</span>
            {testResult.latencyMs && (
              <span className="ml-2 font-mono text-[11px] opacity-80">
                (Latence : {testResult.latencyMs} ms)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
