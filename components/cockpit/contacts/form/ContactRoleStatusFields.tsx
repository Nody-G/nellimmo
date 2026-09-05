'use client';

import React from 'react';
import type { ContactRole, ContactStatus } from '@/lib/types';
import { ROLE_CONFIGS, STATUS_CONFIGS } from '../contacts-constants';

interface ContactRoleStatusFieldsProps {
  role: ContactRole;
  status: ContactStatus;
  isFavorite: boolean;
  onRoleChange: (role: ContactRole) => void;
  onStatusChange: (status: ContactStatus) => void;
  onFavoriteChange: (fav: boolean) => void;
}

export function ContactRoleStatusFields({
  role,
  status,
  isFavorite,
  onRoleChange,
  onStatusChange,
  onFavoriteChange,
}: ContactRoleStatusFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Rôle métier *
        </label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value as ContactRole)}
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-bold text-gray-900"
        >
          {Object.entries(ROLE_CONFIGS).map(([k, cfg]) => (
            <option key={k} value={k}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Statut
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ContactStatus)}
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-semibold text-gray-900"
        >
          {Object.entries(STATUS_CONFIGS).map(([k, cfg]) => (
            <option key={k} value={k}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center pt-5">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
          <input
            type="checkbox"
            checked={isFavorite}
            onChange={(e) => onFavoriteChange(e.target.checked)}
            className="rounded text-[#E12B7B] focus:ring-[#E12B7B]"
          />
          <span>Partenaire favori ⭐</span>
        </label>
      </div>
    </div>
  );
}
