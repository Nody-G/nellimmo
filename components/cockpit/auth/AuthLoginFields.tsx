'use client';

import React from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';

interface AuthLoginFieldsProps {
  mode: 'login' | 'legacy';
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
}

export function AuthLoginFields({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  show,
  setShow,
}: AuthLoginFieldsProps) {
  const isLogin = mode === 'login';

  return (
    <>
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
            autoFocus={!isLogin}
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
    </>
  );
}
