'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import {
  listUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  type CockpitUser,
  type CockpitRole,
} from '@/lib/users';
import { SectionCard } from '@/components/cockpit/parametres/SectionCard';
import {
  UserListTable,
  AddUserModal,
  ResetPasswordModal,
  AgencyKeyForm,
} from '@/components/cockpit/parametres/users';

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

  // Modal reset password target
  const [resetTarget, setResetTarget] = useState<CockpitUser | null>(null);

  const refresh = () => setRefreshKey((k) => k + 1);

  if (!isAdmin) {
    return null;
  }

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

  return (
    <SectionCard
      icon={<Users className="w-5 h-5 text-[#E12B7B]" />}
      title="Utilisateurs & accès"
      badge="Admin"
    >
      {/* Liste des utilisateurs */}
      <UserListTable
        users={users}
        currentUserId={currentUser?.id}
        onRoleChange={handleRoleChange}
        onToggleActive={handleToggleActive}
        onOpenResetPassword={setResetTarget}
        onDeleteUser={handleDelete}
      />

      {/* Formulaire / Bouton d'ajout d'utilisateur */}
      <AddUserModal
        onUserCreated={refresh}
        showToast={showToast}
      />

      {/* Clé d'agence partagée */}
      <AgencyKeyForm showToast={showToast} />

      {/* Modal Réinitialisation mot de passe */}
      <ResetPasswordModal
        user={resetTarget}
        onClose={() => setResetTarget(null)}
        showToast={showToast}
      />
    </SectionCard>
  );
}
