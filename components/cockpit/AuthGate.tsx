'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    isAuthenticated,
    hasPassword,
    hasUsers,
    setupFirstAdmin,
    loginUser,
    verifyPassword,
    unlockVaultWithAgencyKey,
} from '@/lib/auth';
import {
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    Loader2,
    UserPlus,
    Mail,
    Building2,
} from 'lucide-react';
import { unlockVault } from '@/lib/vault';
import { useNellimoStore } from '@/lib/store';

// --- Mini store externe d'authentification (sessionStorage / localStorage) ---
// L'état d'authentification est lu pendant le rendu via useSyncExternalStore au
// lieu d'un setState synchrone dans un effet (règle react-hooks/set-state-in-effect).
const authListeners = new Set<() => void>();
function subscribeAuth(cb: () => void): () => void {
    authListeners.add(cb);
    return () => {
        authListeners.delete(cb);
    };
}
function getAuthSnapshot(): boolean {
    return isAuthenticated();
}
function getAuthServerSnapshot(): boolean {
    return false;
}
function getHasUsersSnapshot(): boolean {
    return hasUsers();
}
function getHasUsersServerSnapshot(): boolean {
    return false;
}
function notifyAuthChanged(): void {
    authListeners.forEach((cb) => cb());
}

type AuthMode = 'setup' | 'legacy' | 'login';

/**
 * Garde d'authentification locale du cockpit (multi-utilisateurs).
 *
 * Modes :
 * - setup  : aucun compte ni mot de passe historique → création du 1er admin
 *            (nom, email, mot de passe) + définition de la clé d'agence.
 * - legacy : aucun compte mais un mot de passe historique existe (installation
 *            antérieure au multi-utilisateurs) → vérification du mot de passe
 *            puis migration vers un compte admin + clé d'agence.
 * - login  : des comptes existent → connexion par email + mot de passe, puis
 *            déverrouillage automatique du coffre-fort avec la clé d'agence.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Session valide ? (rechargement) — lu pendant le rendu, sans effet.
    const authed = React.useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
    // Des comptes utilisateurs existent-ils ?
    const hasUsersFlag = React.useSyncExternalStore(
        subscribeAuth,
        getHasUsersSnapshot,
        getHasUsersServerSnapshot
    );

    // Détermine le mode d'affichage initial.
    const [mode, setMode] = useState<AuthMode>(() => {
        if (hasUsersFlag) return 'login';
        if (hasPassword()) return 'legacy';
        return 'setup';
    });

    // Champs communs.
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

    // Une fois authentifié (session restaurée au rechargement), on recharge les
    // secrets chiffrés du coffre pour que l'UI les retrouve.
    useEffect(() => {
        if (authed) {
            hydrateSettingsSecrets().catch(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            if (mode === 'setup') {
                // Création du premier compte admin + clé d'agence.
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
                    setError('La clé d\u2019agence doit contenir au moins 6 caractères.');
                    setBusy(false);
                    return;
                }
                if (agencyKey !== agencyKeyConfirm) {
                    setError('Les deux clés d\u2019agence ne correspondent pas.');
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
                // Vérifie le mot de passe historique avant de migrer.
                const ok = await verifyPassword(password);
                if (!ok) {
                    setError('Mot de passe incorrect.');
                    setBusy(false);
                    return;
                }
                // Passe à l'étape de création du compte admin (migration).
                setMode('setup');
                setPassword('');
                setConfirm('');
                setBusy(false);
            } else {
                // Connexion par email + mot de passe.
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

    if (authed) {
        return <>{children}</>;
    }

    const isSetup = mode === 'setup';
    const isLogin = mode === 'login';
    const title = isSetup
        ? 'Créez votre compte administrateur'
        : isLogin
            ? 'Espace sécurisé'
            : 'Migration vers les comptes';
    const subtitle = isSetup
        ? 'Configurez le premier compte admin et la clé d\u2019agence qui protège vos données.'
        : isLogin
            ? 'Connectez-vous avec votre email et mot de passe pour accéder au cockpit.'
            : 'Votre cockpit utilise encore un mot de passe unique. Créez votre compte admin pour activer les comptes utilisateurs.';

    return (
        <div className="min-h-screen bg-[#FAF5F8] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xl p-8 space-y-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#E12B7B] flex items-center justify-center text-white">
                            {isSetup ? <UserPlus className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-[#131B26]">{title}</h1>
                            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSetup && (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            autoFocus
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                            placeholder="Marie"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                            placeholder="Dupont"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                            placeholder="marie@agence.fr"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {isLogin && (
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                        className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                        placeholder="marie@agence.fr"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus={!isSetup}
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

                        {isSetup && (
                            <>
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

                                <div className="bg-[#FAF5F8] border border-[#F3E8EE] rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-[#131B26]">
                                        <Building2 className="w-4 h-4 text-[#E12B7B]" />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Clé {"d\u2019"}agence
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        Cette clé (indépendante des mots de passe) déverrouille le
                                        coffre-fort partagé pour tous les utilisateurs authentifiés.
                                        Conservez-la précieusement.
                                    </p>
                                    <div>
                                        <input
                                            type={show ? 'text' : 'password'}
                                            value={agencyKey}
                                            onChange={(e) => setAgencyKey(e.target.value)}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                            placeholder={'Clé d\u2019agence'}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type={show ? 'text' : 'password'}
                                            value={agencyKeyConfirm}
                                            onChange={(e) => setAgencyKeyConfirm(e.target.value)}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                            placeholder={'Confirmer la clé d\u2019agence'}
                                        />
                                    </div>
                                </div>
                            </>
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
                            ) : isSetup ? (
                                <ShieldCheck className="w-4 h-4" />
                            ) : (
                                <Lock className="w-4 h-4" />
                            )}
                            {isSetup
                                ? 'Créer le compte et activer'
                                : mode === 'legacy'
                                    ? 'Vérifier et continuer'
                                    : 'Se connecter'}
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
