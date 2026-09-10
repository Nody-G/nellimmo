'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import type { AgencySettings } from '@/lib/types';

interface UseAiKeyManagerProps {
  formData: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
  onServerKeyStatusChange: (status: { hasKey: boolean; maskedKey: string } | null) => void;
}

export function useAiKeyManager({
  formData,
  onChange,
  onServerKeyStatusChange,
}: UseAiKeyManagerProps) {
  const { showToast } = useToast();
  const [apiKeyInput, setApiKeyInput] = useState<string>(formData.deepseek_api_key || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [prevPropKey, setPrevPropKey] = useState(formData.deepseek_api_key);
  if (formData.deepseek_api_key !== prevPropKey) {
    setPrevPropKey(formData.deepseek_api_key);
    if (formData.deepseek_api_key && !apiKeyInput) {
      setApiKeyInput(formData.deepseek_api_key);
    }
  }

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim() || formData.deepseek_api_key?.trim();
    if (!keyToTest) {
      showToast('Veuillez saisir votre clé API DeepSeek (sk-...) avant de tester.', 'warning');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/settings/ai-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: 'Connexion DeepSeek V4.1 Flash établie avec succès !',
          latencyMs: data.latencyMs,
        });
        onServerKeyStatusChange({ hasKey: true, maskedKey: data.maskedKey });
        onChange({ deepseek_api_key: keyToTest });
        showToast(`Clé validée (${data.latencyMs} ms) !`, 'success');
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Clé API invalide ou non reconnue par DeepSeek.',
        });
        showToast(data.error || 'Échec du test de clé DeepSeek.', 'error');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur réseau';
      setTestResult({ success: false, message: `Impossible de contacter DeepSeek : ${msg}` });
      showToast('Erreur de connexion au serveur DeepSeek.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = async () => {
    const trimmed = apiKeyInput.trim();
    setIsSaving(true);
    try {
      if (trimmed) {
        const res = await fetch('/api/settings/ai-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: trimmed }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          onChange({ deepseek_api_key: trimmed });
          onServerKeyStatusChange({ hasKey: true, maskedKey: data.maskedKey });
          showToast('Clé API DeepSeek V4.1 Flash enregistrée et active !', 'success');
        } else {
          showToast(data.error || 'Erreur lors de l’enregistrement de la clé.', 'error');
        }
      } else {
        await fetch('/api/settings/ai-key', { method: 'DELETE' });
        onChange({ deepseek_api_key: '' });
        onServerKeyStatusChange({ hasKey: false, maskedKey: '' });
        showToast('Clé déconnectée.', 'info');
      }
    } catch {
      showToast('Erreur de sauvegarde de la clé API.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/settings/ai-key', { method: 'DELETE' });
      onChange({ deepseek_api_key: '' });
      setApiKeyInput('');
      onServerKeyStatusChange({ hasKey: false, maskedKey: '' });
      setTestResult(null);
      showToast('Clé DeepSeek déconnectée.', 'info');
    } catch {
      showToast('Erreur lors de la déconnexion.', 'error');
    }
  };

  return {
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
  };
}
