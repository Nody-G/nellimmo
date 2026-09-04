'use client';

import React, { useState } from 'react';
import { KeyRound, Loader2, X } from 'lucide-react';
import { changeUserPassword, type CockpitUser } from '@/lib/users';

interface ResetPasswordModalProps {
  user: CockpitUser | null;
  onClose: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function ResetPasswordModal({ user, onClose, showToast }: ResetPasswordModalProps) {
  const [resetPwd, setResetPwd] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (resetPwd.length < 6) {
        showToast('Le mot de passe doit contenir au moins 6 caractères.', 'error');
        setBusy(false);
        return;
      }
      await changeUserPassword(user.id, resetPwd);
      showToast(`Mot de passe réinitialisé pour ${user.first_name} ${user.last_name}.`, 'success');
      setResetPwd('');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-4 animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-base text-[#131B26]">
              Changer le mot de passe
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Définissez un nouveau mot de passe pour{' '}
          <strong className="text-gray-900">
            {user.first_name} {user.last_name}
          </strong>{' '}
          ({user.email}).
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              autoFocus
              value={resetPwd}
              onChange={(e) => setResetPwd(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 rounded-xl transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={busy || !resetPwd}
              className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
