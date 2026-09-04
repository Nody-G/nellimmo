'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import { Property } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { EditMandateForm } from '@/components/cockpit/mandats/edit';

export default function EditMandatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { properties, updateProperty } = useNellimoStore();
  const { showToast } = useToast();

  const property = properties.find((p) => p.id === resolvedParams.id);

  if (!property) {
    return <div className="p-8 text-center text-xs text-gray-500">Mandat introuvable.</div>;
  }

  const handleSave = async (updates: Partial<Property>) => {
    try {
      await updateProperty(property.id, updates);
      showToast('Mandat mis à jour avec succès', 'success');
      router.push(`/cockpit/mandats/${property.id}`);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la mise à jour du mandat', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#F3E8EE] pb-4">
        <Link
          href={`/cockpit/mandats/${property.id}`}
          className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-500 hover:text-[#E12B7B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au mandat {formatMandateRef(property.mandate_number)}
        </Link>
        <span className="text-xs font-mono font-bold text-[#E12B7B]">
          Modification avec scellement d&apos;audit SHA-256
        </span>
      </div>

      <EditMandateForm property={property} onSave={handleSave} />
    </div>
  );
}
