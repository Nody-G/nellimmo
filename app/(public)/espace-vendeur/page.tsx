'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, MessageCircle, Phone, Sparkles, KeyRound } from 'lucide-react';
import { useNellimoStore } from '@/lib/public-store';

function EspaceVendeurPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useNellimoStore();

  const [inputToken, setInputToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-redirect if token is already in URL query
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      router.replace(`/espace-vendeur/${encodeURIComponent(token)}`);
    }
  }, [router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputToken.trim();
    if (!clean) {
      setErrorMsg('Veuillez saisir votre code d’accès ou référence mandat.');
      return;
    }
    router.push(`/espace-vendeur/${encodeURIComponent(clean)}`);
  };

  const whatsappUrl = `https://wa.me/33755686109?text=${encodeURIComponent(
    "Bonjour Nelly, je souhaiterais recevoir le lien sécurisé pour accéder à mon Espace Propriétaire Nell'Immo."
  )}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#F3E8EE] shadow-2xl space-y-8 animate-fade-in">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCFAF7] text-[#C59A45] border border-[#C59A45]/30 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accès Sécurisé Propriétaire</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Espace Vendeur Nell&apos;Immo
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            Consultez en direct les statistiques de diffusion, les comptes-rendus de visite et le positionnement marché notarié de votre bien.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Code d&apos;accès ou référence du mandat
            </label>
            <input
              type="text"
              value={inputToken}
              onChange={(e) => {
                setInputToken(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Ex: token_dupont_2024 ou MANDAT-242"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-[#E12B7B] focus:bg-white transition"
            />
            {errorMsg && (
              <span className="text-[11px] text-rose-600 font-medium block mt-1">
                {errorMsg}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Consulter mon suivi en direct</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Support & Missing Token Helper */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block text-center">
            Vous n&apos;avez pas reçu votre lien d&apos;accès ?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border border-emerald-200/60"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Recevoir par WhatsApp</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border border-gray-200"
            >
              <Phone className="w-4 h-4 text-[#E12B7B]" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>

        {/* Demo Token Tip */}
        <div className="p-3.5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex items-center gap-3 text-xs text-gray-600">
          <Sparkles className="w-4 h-4 text-[#C59A45] shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold text-gray-900 block">Espace de démonstration :</span>
            <span>Accédez à un dossier type avec le code <strong className="text-[#E12B7B] cursor-pointer hover:underline" onClick={() => setInputToken('token_dupont_2024')}>token_dupont_2024</strong>.</span>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-[#E12B7B] transition"
          >
            ← Retour au site Nell&apos;Immo
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function EspaceVendeurIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E12B7B]" />
        </div>
      }
    >
      <EspaceVendeurPortal />
    </Suspense>
  );
}
