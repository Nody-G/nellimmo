'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function detectStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true
    );
}

function detectIos(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

/**
 * Bouton « Installer l'application ».
 *  - Android/Chrome : capture l'événement beforeinstallprompt et déclenche l'installation.
 *  - iOS (Safari) : n'expose pas beforeinstallprompt → affiche des instructions
 *    (Partager → Ajouter à l'écran d'accueil).
 *  - Si déjà installé (standalone) : masque le bouton.
 */
export function InstallAppButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone] = useState<boolean>(detectStandalone);
    const [isIos] = useState<boolean>(detectIos);
    const [showIosHelp, setShowIosHelp] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        const onAppInstalled = () => {
            setInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onAppInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
            window.removeEventListener('appinstalled', onAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
            setInstalled(true);
        }
        setDeferredPrompt(null);
    };

    // Si déjà installé ou déjà installé à l'instant → ne rien afficher.
    if (isStandalone || installed) {
        return null;
    }

    // iOS : bouton qui ouvre les instructions.
    if (isIos) {
        return (
            <>
                <button
                    onClick={() => setShowIosHelp(true)}
                    title="Installer l'application"
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Installer</span>
                </button>

                {showIosHelp && (
                    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#E12B7B] flex items-center justify-center text-white">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-serif font-bold text-gray-900">Installer sur iPhone</h3>
                                </div>
                                <button
                                    onClick={() => setShowIosHelp(false)}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    aria-label="Fermer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <ol className="space-y-3 text-sm text-gray-700">
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#F3E8EE] text-[#E12B7B] font-bold flex items-center justify-center text-xs">1</span>
                                    <span>
                                        Touchez le bouton <strong>Partager</strong>{' '}
                                        <Share className="inline w-4 h-4 text-[#E12B7B]" /> dans la barre Safari.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#F3E8EE] text-[#E12B7B] font-bold flex items-center justify-center text-xs">2</span>
                                    <span>
                                        Choisissez <strong>{'« Ajouter à l\u2019écran d\u2019accueil »'}</strong>.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#F3E8EE] text-[#E12B7B] font-bold flex items-center justify-center text-xs">3</span>
                                    <span>
                                        Touchez <strong>{'« Ajouter »'}</strong> en haut à droite. Le cockpit{' '}
                                        {'s\u2019ouvrira comme une application, même hors-ligne.'}
                                    </span>
                                </li>
                            </ol>

                            <button
                                onClick={() => setShowIosHelp(false)}
                                className="w-full py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-sm font-bold transition cursor-pointer"
                            >
                                Compris
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Android/Chrome : bouton d'installation directe.
    if (!deferredPrompt) {
        return null;
    }

    return (
        <button
            onClick={handleInstall}
            title="Installer l'application"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Installer</span>
        </button>
    );
}
