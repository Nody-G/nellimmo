'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  hasPassword,
  setupFirstAdmin,
  loginUser,
  verifyPassword,
  unlockVaultWithAgencyKey,
} from '@/lib/auth';
import { unlockVault } from '@/lib/vault';
import { useNellimoStore } from '@/lib/store';
import {
  AuthMode,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
  getHasUsersSnapshot,
  getHasUsersServerSnapshot,
  notifyAuthChanged,
} from './auth-session';

export function useAuthGate() {
  const authed = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const hasUsersFlag = useSyncExternalStore(
    subscribeAuth,
    getHasUsersSnapshot,
    getHasUsersServerSnapshot
  );

  const [mode, setMode] = useState<AuthMode>(() => {
    if (hasUsersFlag) return 'login';
    if (hasPassword()) return 'legacy';
    return 'setup';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agencyKey, setAgencyKey] = useState('');
  const [agencyKeyConfirm, setAgencyKeyConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { hydrateSettingsSecrets } = useNellimoStore();

  useEffect(() => {
    if (authed) {
      hydrateSettingsSecrets().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'setup') {
        if (!firstName.trim() || !lastName.trim()) {
          setError('Veuillez renseigner votre nom et prénom.');
          setBusy(false);
          return;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setError('Veuillez saisir une adresse email valide.');
          setBusy(false);
          return;
        }
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.');
          setBusy(false);
          return;
        }
        if (password !== confirm) {
          setError('Les deux mots de passe ne correspondent pas.');
          setBusy(false);
          return;
        }
        if (agencyKey.length < 6) {
          setError('La clé d’agence doit contenir au moins 6 caractères.');
          setBusy(false);
          return;
        }
        if (agencyKey !== agencyKeyConfirm) {
          setError('Les deux clés d’agence ne correspondent pas.');
          setBusy(false);
          return;
        }
        await setupFirstAdmin(
          {
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password,
          },
          agencyKey
        );
        await unlockVaultWithAgencyKey(unlockVault);
        await hydrateSettingsSecrets();
        notifyAuthChanged();
      } else if (mode === 'legacy') {
        const ok = await verifyPassword(password);
        if (!ok) {
          setError('Mot de passe incorrect.');
          setBusy(false);
          return;
        }
        setMode('setup');
        setPassword('');
        setConfirm('');
        setBusy(false);
      } else {
        const user = await loginUser(email.trim(), password);
        if (!user) {
          setError('Identifiants incorrects ou compte inactif.');
          setBusy(false);
          return;
        }
        await unlockVaultWithAgencyKey(unlockVault);
        await hydrateSettingsSecrets();
        notifyAuthChanged();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setBusy(false);
    }
  };

  return {
    authed,
    mode,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    agencyKey,
    setAgencyKey,
    agencyKeyConfirm,
    setAgencyKeyConfirm,
    show,
    setShow,
    error,
    busy,
    handleSubmit,
  };
}
