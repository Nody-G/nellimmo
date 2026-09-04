'use client';

import React from 'react';
import { Lock, UserPlus } from 'lucide-react';
import { AuthMode } from './auth-session';

interface AuthHeaderProps {
  mode: AuthMode;
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  const isSetup = mode === 'setup';
  const isLogin = mode === 'login';

  const title = isSetup
    ? 'Créez votre compte administrateur'
    : isLogin
      ? 'Espace sécurisé'
      : 'Connexion Cockpit';

  const subtitle = isSetup
    ? 'Configurez le premier compte admin ou connectez-vous directement avec votre code.'
    : isLogin
      ? 'Connectez-vous avec votre email et mot de passe pour accéder au cockpit.'
      : 'Saisissez votre code d’accès pour déverrouiller immédiatement le cockpit.';

  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-[#E12B7B] flex items-center justify-center text-white">
        {isSetup ? <UserPlus className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
      </div>
      <div>
        <h1 className="text-xl font-serif font-bold text-[#131B26]">{title}</h1>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
