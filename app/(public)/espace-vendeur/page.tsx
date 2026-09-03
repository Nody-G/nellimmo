'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function EspaceVendeurRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      router.replace(`/espace-vendeur/${token}`);
    } else {
      // Aucun token fourni : l'Espace Vendeur est strictement réservé aux
      // propriétaires disposant du lien sécurisé généré depuis le cockpit.
      // On ne redirige jamais vers un bien arbitraire (un id n'est pas un token).
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E12B7B]" />
    </div>
  );
}

export default function EspaceVendeurIndexPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFAF7]" />}>
      <EspaceVendeurRedirect />
    </Suspense>
  );
}
