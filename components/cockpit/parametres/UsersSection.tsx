'use client';

import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    ShieldCheck,
    User as UserIcon,
    Trash2,
    KeyRound,
    Building2,
    Eye,
    EyeOff,
    Loader2,
    Check,
    X,
} from 'lucide-react';
import {
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    getCurrentUser,
    setAgencyKey,
    type CockpitUser,
    type CockpitRole,
} from '@/lib/users';
import { SectionCard } from '@/components/cockpit/parametres/SectionCard';

interface UsersSectionProps {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

/** Gestion des utilisateurs (réservée à l'admin) + clé d'agence. */
export function UsersSection({ showToast }: UsersSectionProps) {
    const currentUser = getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    // Compteur de rafraîchissement : force un re-rendu après chaque mutation.
    const [refreshKey, setRefreshKey] = useState(0);
    void refreshKey;

    // Liste rafraîchie à chaque rendu (store localStorage simple).
    const users = listUsers();

    // Formulaire d'ajout.
    const [adding, setAdding] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState<CockpitRole>('agent');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [busy, setBusy] = useState(false);

    // Changement de mot de passe d'un utilisateur.
    const [resetTarget, setResetTarget] = useState<CockpitUser | null>(null);
    const [resetPwd, setResetPwd] = useState('');

    // Clé d'agence.
    const [agencyKey, setAgencyKeyField] = useState('');
    const [agencyKeyConfirm, setAgencyKeyConfirm] = useState('');
    const [showAgency, setShowAgency] = useState(false);
    const [agencyBusy, setAgencyBusy] = useState(false);

    const refresh = () => setRefreshKey((k) => k + 1);

    if (!isAdmin) {
        return null;
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            if (!firstName.trim() || !lastName.trim()) {
                showToast('Veuillez renseigner le nom et le prénom.', 'error');
                setBusy(false);
                return;
            }
            if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                showToast('Veuillez saisir une adresse email valide.', 'error');
                setBusy(false);
                return;
            }
            if (password.length < 6) {
                showToast('Le mot de passe doit contenir au moins 6 caractères.', 'error');
                setBusy(false);
                return;
            }
            await createUser({
                email: email.trim(),
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim() || undefined,
                role,
                password,
            });
            showToast('Utilisateur créé avec succès.', 'success');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setAdding(false);
            refresh();
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Erreur lors de la création.', 'error');
        } finally {
            setBusy(false);
        }
    };

    const handleToggleActive = (user: CockpitUser) => {
        try {
            updateUser(user.id, { active: !user.active });
            showToast(
                user.active
                    ? `Le compte de ${user.first_name} a été désactivé.`
                    : `Le compte de ${user.first_name} a été réactivé.`,
                'success'
            );
            refresh();
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Action impossible.', 'error');
        }
    };

    const handleRoleChange = (user: CockpitUser, newRole: CockpitRole) => {
        try {
            updateUser(user.id, { role: newRole });
            showToast(`Rôle de ${user.first_name} mis à jour.`, 'success');
            refresh();
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Action impossible.', 'error');
        }
    };

    const handleDelete = (user: CockpitUser) => {
        if (!window.confirm(`Supprimer définitivement le compte de ${user.first_name} ${user.last_name} ?`)) {
            return;
        }
        try {
            deleteUser(user.id);
            showToast('Utilisateur supprimé.', 'success');
            refresh();
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Suppression impossible.', 'error');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetTarget) return;
        setBusy(true);
        try {
            if (resetPwd.length < 6) {
                showToast('Le mot de passe doit contenir au moins 6 caractères.', 'error');
                setBusy(false);
                return;
            }
            await changeUserPassword(resetTarget.id, resetPwd);
            showToast('Mot de passe réinitialisé.', 'success');
            setResetTarget(null);
            setResetPwd('');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Erreur.', 'error');
        } finally {
            setBusy(false);
        }
    };

    const handleAgencyKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setAgencyBusy(true);
        try {
            if (agencyKey.length < 6) {
                showToast('La clé d\u2019agence doit contenir au moins 6 caractères.', 'error');
                setAgencyBusy(false);
                return;
            }
            if (agencyKey !== agencyKeyConfirm) {
                showToast('Les deux clés d\u2019agence ne correspondent pas.', 'error');
                setAgencyBusy(false);
                return;
            }
            setAgencyKey(agencyKey);
            showToast('Clé d\u2019agence mise à jour.', 'success');
            setAgencyKeyField('');
            setAgencyKeyConfirm('');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Erreur.', 'error');
        } finally {
            setAgencyBusy(false);
        }
    };

    const roleBadge = (r: CockpitRole) =>
        r === 'admin' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E12B7B]/10 text-[#C71B62] border border-[#E12B7B]/20">
                <ShieldCheck className="w-3 h-3" /> Admin
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                <UserIcon className="w-3 h-3" /> Agent
            </span>
        );

    return (
        <SectionCard
            icon={<Users className="w-5 h-5 text-[#E12B7B]" />}
            title="Utilisateurs & accès"
            badge="Admin"
        >
            {/* Liste des utilisateurs */}
            <div className="space-y-3">
                {users.map((user) => {
                    const isSelf = currentUser?.id === user.id;
                    return (
                        <div
                            key={user.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-[#131B26] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {user.first_name.charAt(0).toUpperCase()}
                                    {user.last_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-[#131B26]">
                                            {user.first_name} {user.last_name}
                                        </span>
                                        {isSelf && (
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                (vous)
                                            </span>
                                        )}
                                        {!user.active && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-600 border border-rose-200">
                                                Désactivé
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {roleBadge(user.role)}
                                {!isSelf && (
                                    <>
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user, e.target.value as CockpitRole)
                                            }
                                            className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                        >
                                            <option value="agent">Agent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setResetTarget(user);
                                                setResetPwd('');
                                            }}
                                            title="Réinitialiser le mot de passe"
                                            className="p-2 text-gray-500 hover:text-[#131B26] hover:bg-gray-100 rounded-lg transition cursor-pointer"
                                        >
                                            <KeyRound className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(user)}
                                            title={user.active ? 'Désactiver' : 'Réactiver'}
                                            className={`p-2 rounded-lg transition cursor-pointer ${user.active
                                                ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                : 'text-emerald-600 hover:bg-emerald-50'
                                                }`}
                                        >
                                            {user.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(user)}
                                            title="Supprimer"
                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ajout d'un utilisateur */}
            {adding ? (
                <form onSubmit={handleAdd} className="space-y-3 p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Prénom</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                placeholder="Marie"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                placeholder="Dupont"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                placeholder="marie@agence.fr"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                placeholder="06 12 34 56 78"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Rôle</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as CockpitRole)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                            >
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setAdding(false)}
                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 rounded-xl transition cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={busy}
                            className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                        >
                            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                            Créer
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="w-full py-2.5 border-2 border-dashed border-[#E12B7B]/30 text-[#C71B62] hover:bg-[#E12B7B]/5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" /> Ajouter un utilisateur
                </button>
            )}

            {/* Clé d'agence */}
            <div className="pt-4 border-t border-[#F3E8EE]">
                <div className="flex items-center gap-2 text-[#131B26] mb-2">
                    <Building2 className="w-4 h-4 text-[#E12B7B]" />
                    <span className="text-sm font-bold uppercase tracking-wider">Clé {"d\u2019"}agence</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Cette clé déverrouille le coffre-fort partagé (identifiants SFTP, réseaux, Google…)
                    pour tous les utilisateurs authentifiés. Changez-la si elle a été compromise.
                </p>
                <form onSubmit={handleAgencyKey} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                        <input
                            type={showAgency ? 'text' : 'password'}
                            value={agencyKey}
                            onChange={(e) => setAgencyKeyField(e.target.value)}
                            className="w-full p-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                            placeholder={'Nouvelle clé d\u2019agence'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowAgency(!showAgency)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showAgency ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type={showAgency ? 'text' : 'password'}
                            value={agencyKeyConfirm}
                            onChange={(e) => setAgencyKeyConfirm(e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                            placeholder={'Confirmer la clé'}
                        />
                        <button
                            type="submit"
                            disabled={agencyBusy || !agencyKey}
                            className="px-4 py-2 bg-[#131B26] hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shrink-0"
                        >
                            {agencyBusy ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <KeyRound className="w-3.5 h-3.5" />
                            )}
                            Mettre à jour
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal réinitialisation mot de passe */}
            {resetTarget && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleResetPassword}
                        className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 border border-gray-100 shadow-2xl"
                    >
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-[#E12B7B]" />
                            <h3 className="font-serif font-bold text-[#131B26]">
                                Réinitialiser le mot de passe
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500">
                            Nouveau mot de passe pour {resetTarget.first_name} {resetTarget.last_name}.
                        </p>
                        <div className="relative">
                            <input
                                type={showPwd ? 'text' : 'password'}
                                value={resetPwd}
                                onChange={(e) => setResetPwd(e.target.value)}
                                autoFocus
                                className="w-full p-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setResetTarget(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 rounded-xl transition cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                            >
                                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </SectionCard>
    );
}
