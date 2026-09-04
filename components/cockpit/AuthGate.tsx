'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import {
  AuthHeader,
  AuthSetupFields,
  AuthLoginFields,
  useAuthGate,
} from './auth';

/**
 * Garde d'authentification locale du cockpit (multi-utilisateurs).
 *
 * Modes :
 * - setup  : aucun compte ni mot de passe historique → création du 1er admin + clé d'agence.
 * - legacy : mot de passe historique présent → vérification puis migration vers admin.
 * - login  : des comptes existent → connexion email + mot de passe, déverrouillage du coffre.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    authed,
    mode,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    agencyKey,
    setAgencyKey,
    agencyKeyConfirm,
    setAgencyKeyConfirm,
    show,
    setShow,
    error,
    busy,
    handleSubmit,
  } = useAuthGate();

  if (authed) {
    return <>{children}</>;
  }

  const isSetup = mode === 'setup';

  return (
    <div className="min-h-screen bg-[#FAF5F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xl p-8 space-y-6">
          <AuthHeader mode={mode} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSetup ? (
              <AuthSetupFields
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirm={confirm}
                setConfirm={setConfirm}
                agencyKey={agencyKey}
                setAgencyKey={setAgencyKey}
                agencyKeyConfirm={agencyKeyConfirm}
                setAgencyKeyConfirm={setAgencyKeyConfirm}
                show={show}
                setShow={setShow}
              />
            ) : (
              <AuthLoginFields
                mode={mode}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                show={show}
                setShow={setShow}
              />
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
