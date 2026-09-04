'use client';

import React from 'react';
import {
  ShieldCheck,
  User as UserIcon,
  KeyRound,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import type { CockpitUser, CockpitRole } from '@/lib/users';

interface UserListTableProps {
  users: CockpitUser[];
  currentUserId?: string;
  onRoleChange: (user: CockpitUser, newRole: CockpitRole) => void;
  onToggleActive: (user: CockpitUser) => void;
  onOpenResetPassword: (user: CockpitUser) => void;
  onDeleteUser: (user: CockpitUser) => void;
}

export function UserListTable({
  users,
  currentUserId,
  onRoleChange,
  onToggleActive,
  onOpenResetPassword,
  onDeleteUser,
}: UserListTableProps) {
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
    <div className="space-y-3">
      {users.map((user) => {
        const isSelf = currentUserId === user.id;
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
                      onRoleChange(user, e.target.value as CockpitRole)
                    }
                    className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30 cursor-pointer"
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onOpenResetPassword(user)}
                    title="Réinitialiser le mot de passe"
                    className="p-2 text-gray-500 hover:text-[#131B26] hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleActive(user)}
                    title={user.active ? 'Désactiver' : 'Réactiver'}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      user.active
                        ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {user.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteUser(user)}
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
  );
}
