'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    isAuthenticated,
    hasPassword,
    setupPassword,
    verifyPassword,
    createSession,
} from '@/lib/auth';
import { Lock, KeyRound, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { unlockVault, lockVault } from '@/lib/vault';
import { useNellimoStore } from '@/lib/store';

/**
 * Garde d'authentification locale du cockpit.
 * - Premier accès : création d'un mot de passe.
 * - Accès suivants : saisie du mot de passe.
 * Tant que l'utilisateur n'est pas authentifié, le contenu du cockpit est masqué.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [authed, setAuthed] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);
    const [mode, setMode] = useState<'setup' | 'login'>('login');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { hydrateSettingsSecrets } = useNellimoStore();

    useEffect(() => {
        if (isAuthenticated()) {
            // Session encore valide (rechargement) : on restaure la clé du coffre
            // depuis le sessionStorage puis on recharge les secrets chiffrés.
            setAuthed(true);
            hydrateSettingsSecrets().catch(() => { });
        } else {
            setMode(hasPassword() ? 'login' : 'setup');
        }
        setChecking(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            if (mode === 'setup') {
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
                await setupPassword(password);
                createSession();
                await unlockVault(password);
                await hydrateSettingsSecrets();
                setAuthed(true);
            } else {
                const ok = await verifyPassword(password);
                if (!ok) {
                    setError('Mot de passe incorrect.');
                    setBusy(false);
                    return;
                }
                createSession();
                await unlockVault(password);
                await hydrateSettingsSecrets();
                setAuthed(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
            setBusy(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#FAF5F8] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#E12B7B] animate-spin" />
            </div>
        );
    }

    if (authed) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#FAF5F8] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xl p-8 space-y-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#E12B7B] flex items-center justify-center text-white">
                            {mode === 'setup' ? <KeyRound className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-[#131B26]">
                                {mode === 'setup' ? 'Sécurisez votre Cockpit' : 'Espace sécurisé'}
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">
                                {mode === 'setup'
                                    ? 'Créez un mot de passe pour protéger l’accès à vos données professionnelles.'
                                    : 'Saisissez votre mot de passe pour accéder au cockpit Nell’Immo.'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={show ? 'Masquer' : 'Afficher'}
                                >
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {mode === 'setup' && (
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {error && (
                            <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={busy || !password}
                            className="w-full py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                            {busy ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : mode === 'setup' ? (
                                <ShieldCheck className="w-4 h-4" />
                            ) : (
                                <Lock className="w-4 h-4" />
                            )}
                            {mode === 'setup' ? 'Activer la protection' : 'Se connecter'}
                        </button>
                    </form>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                        Protection locale en attendant la synchronisation sécurisée Supabase.
                        {pathname && pathname.includes('parametres') ? '' : ''}
                    </p>
                </div>
            </div>
        </div>
    );
}
