'use client';

/**
 * Modale d'invitation à connecter Google, affichée au démarrage du cockpit.
 *
 * Composant purement présentationnel : toute la logique vit dans
 * [`useGoogleStartupPrompt`](components/cockpit/google/useGoogleStartupPrompt.ts:1).
 *
 * Non bloquante : bouton « Plus tard » toujours visible, fermeture par Échap
 * et par clic sur le fond. Ne réapparaît plus après un refus.
 */

import React from 'react';
import {
    Calendar,
    Mail,
    FolderOpen,
    Users,
    CheckSquare,
    Star,
    ShieldCheck,
    AlertTriangle,
    ExternalLink,
    Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { GOOGLE_SERVICE_ORDER, GOOGLE_SCOPES, type GoogleServiceKey } from '@/lib/google/scopes';
import { useGoogleStartupPrompt } from './useGoogleStartupPrompt';

/** Icône associée à chaque service Google. */
function ServiceIcon({ service }: { service: GoogleServiceKey }) {
    const className = 'w-4 h-4';
    switch (service) {
        case 'calendar':
            return <Calendar className={className} />;
        case 'gmail':
            return <Mail className={className} />;
        case 'drive':
            return <FolderOpen className={className} />;
        case 'contacts':
            return <Users className={className} />;
        case 'tasks':
            return <CheckSquare className={className} />;
        case 'reviews':
            return <Star className={className} />;
        default:
            return null;
    }
}

export function GoogleStartupModal() {
    const {
        isOpen,
        isLoading,
        error,
        isConfigured,
        dismiss,
        close,
        startConnection,
    } = useGoogleStartupPrompt();

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            size="md"
            closeOnEsc
            closeOnBackdrop
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-serif font-black text-base">
                        G
                    </div>
                    <span className="font-serif font-bold text-base text-[#131B26]">
                        Connectez votre compte Google
                    </span>
                </div>
            }
            description="Synchronisez votre agenda, vos emails, vos dossiers Drive, vos contacts et vos tâches avec Nell'Immo."
            footer={
                <div className="flex items-center justify-between w-full gap-3">
                    <button
                        type="button"
                        onClick={dismiss}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors px-2 py-1.5"
                    >
                        Plus tard
                    </button>
                    {isConfigured ? (
                        <Button
                            type="button"
                            onClick={startConnection}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ExternalLink className="w-4 h-4" />
                            )}
                            Connecter Google
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={dismiss}
                            variant="secondary"
                            className="inline-flex items-center gap-2"
                        >
                            J'ai compris
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-4 text-xs">
                {isLoading ? (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2 text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Vérification de l'état de la connexion…</span>
                    </div>
                ) : !isConfigured ? (
                    /* Configuration serveur incomplète : encart d'aide */
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2.5">
                        <div className="flex items-center gap-2 text-amber-800 font-bold">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Configuration serveur requise</span>
                        </div>
                        <p className="text-amber-800/90 leading-relaxed">
                            La connexion Google nécessite des identifiants OAuth, à créer une seule
                            fois dans la Google Cloud Console. Les variables suivantes sont absentes
                            du fichier <code className="font-mono">.env.local</code> :
                        </p>
                        <ul className="space-y-1 font-mono text-[11px] text-amber-900 bg-amber-100/60 rounded-xl p-2.5">
                            <li>GOOGLE_CLIENT_ID</li>
                            <li>GOOGLE_CLIENT_SECRET</li>
                            <li>GOOGLE_REDIRECT_URI</li>
                            <li>GOOGLE_TOKEN_ENCRYPTION_KEY</li>
                            <li>GOOGLE_OAUTH_STATE_SECRET</li>
                        </ul>
                        <p className="text-amber-800/90 leading-relaxed">
                            Le guide pas à pas est disponible dans{' '}
                            <span className="font-mono">docs/07_CONFIGURATION_GOOGLE_OAUTH.md</span>.
                            Après avoir renseigné ces variables, redémarrez le serveur
                            (<span className="font-mono">npm run dev</span>).
                        </p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-700 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Liste des services synchronisés */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {GOOGLE_SERVICE_ORDER.map((key) => {
                                const meta = GOOGLE_SCOPES[key];
                                return (
                                    <div
                                        key={key}
                                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-[#FCFAF7]"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <ServiceIcon service={key} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#131B26] leading-tight">
                                                {meta.label}
                                            </p>
                                            <p className="text-gray-500 leading-snug mt-0.5">
                                                {meta.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Note de confidentialité */}
                        <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
                            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                                Vos identifiants ne sont jamais stockés dans l'application. Les
                                jetons sont chiffrés (AES-256-GCM) et révocables à tout moment
                                depuis <span className="font-semibold">Paramètres → Google</span>.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
