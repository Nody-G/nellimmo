'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';

function EspaceVendeurRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties } = useNellimoStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      router.replace(`/espace-vendeur/${token}`);
    } else if (properties.length > 0) {
      // Default to first active property
      router.replace(`/espace-vendeur/${properties[0].id}`);
    } else {
      router.replace('/');
    }
  }, [router, searchParams, properties]);

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
