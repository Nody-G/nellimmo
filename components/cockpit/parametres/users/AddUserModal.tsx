'use client';

import React, { useState } from 'react';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { createUser, type CockpitRole } from '@/lib/users';

interface AddUserModalProps {
  onUserCreated: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AddUserModal({ onUserCreated, showToast }: AddUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<CockpitRole>('agent');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

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
      setIsOpen(false);
      onUserCreated();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur lors de la création.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-2.5 border-2 border-dashed border-[#E12B7B]/30 text-[#C71B62] hover:bg-[#E12B7B]/5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <UserPlus className="w-4 h-4" /> Ajouter un utilisateur
      </button>
    );
  }

  return (
    <form onSubmit={handleAdd} className="space-y-3 p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            required
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
            required
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
            required
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
            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30 cursor-pointer"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
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
  );
}
