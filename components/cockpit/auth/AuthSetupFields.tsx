'use client';

import React from 'react';
import { Mail, Building2, Eye, EyeOff } from 'lucide-react';

interface AuthSetupFieldsProps {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
  agencyKey: string;
  setAgencyKey: (v: string) => void;
  agencyKeyConfirm: string;
  setAgencyKeyConfirm: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
}

export function AuthSetupFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirm,
  setConfirm,
  agencyKey,
  setAgencyKey,
  agencyKeyConfirm,
  setAgencyKeyConfirm,
  show,
  setShow,
}: AuthSetupFieldsProps) {
  return (
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

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30 pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={show ? 'Masquer' : 'Afficher'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

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
            Clé d’agence
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
            placeholder="Clé d’agence"
          />
        </div>
        <div>
          <input
            type={show ? 'text' : 'password'}
            value={agencyKeyConfirm}
            onChange={(e) => setAgencyKeyConfirm(e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
            placeholder="Confirmer la clé d’agence"
          />
        </div>
      </div>
    </>
  );
}
