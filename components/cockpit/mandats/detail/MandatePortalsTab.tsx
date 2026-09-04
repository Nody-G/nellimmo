'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property, AgencySettings } from '@/lib/types';
import { generatePolirisAnnoncesCsv } from '@/lib/poliris';
import {
  ExternalLink,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MandatePortalsTabProps {
  property: Property;
  settings: AgencySettings;
}

export const MandatePortalsTab: React.FC<MandatePortalsTabProps> = ({ property, settings }) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const vendorLink = typeof window !== 'undefined'
    ? `${window.location.origin}/espace-vendeur/${property.seller_token || 'demo-token'}`
    : `/espace-vendeur/${property.seller_token || 'demo-token'}`;

  const polirisPayload = generatePolirisAnnoncesCsv([property], settings.seloger_agency_code || 'NEL13');

  const handleCopyVendorLink = () => {
    navigator.clipboard.writeText(vendorLink);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(polirisPayload);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Portals Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card SeLoger Poliris */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                SL
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">SeLoger / Logic-Immo</h4>
                <p className="text-[11px] text-gray-500">Norme Passerelle Poliris 4.08</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${property.publish_seloger ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
              {property.publish_seloger ? 'Diffusé' : 'Désactivé'}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Code Agence :</span>
              <strong className="font-mono">{settings.seloger_agency_code || 'NEL13'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Fichiers export :</span>
              <span className="font-mono text-[11px]">annonces.csv, photos.cfg</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCsv}
            className="w-full"
            leftIcon={copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedCsv ? 'Ligne Poliris copiée !' : 'Copier payload Poliris'}
          </Button>
        </Card>

        {/* Card LeBonCoin */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                LBC
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">LeBonCoin Immo Pro</h4>
                <p className="text-[11px] text-gray-500">Passerelle API / SFTP Vendeur Pro</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${property.publish_leboncoin ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
              {property.publish_leboncoin ? 'Diffusé' : 'Désactivé'}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Hôte SFTP :</span>
              <span className="font-mono text-[11px]">{settings.leboncoin_sftp_host || 'sftp.leboncoin.fr'}</span>
            </div>
            <div className="flex justify-between">
              <span>Dernière synchro :</span>
              <span>Automatique toutes les 6h</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Espace Vendeur Section */}
      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#131B26] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#E12B7B]" />
              <span>Espace Vendeur Privilège en Ligne</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Lien direct sécurisé sans mot de passe à transmettre à vos propriétaires mandants pour
              le suivi des visites, comptes-rendus et statistiques d&apos;audience en direct.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <input
            type="text"
            readOnly
            value={vendorLink}
            className="w-full bg-transparent text-xs font-mono text-gray-700 outline-none select-all"
          />
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="xs"
              onClick={handleCopyVendorLink}
              leftIcon={copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedToken ? 'Copié !' : 'Copier'}
            </Button>
            <Link
              href={vendorLink}
              target="_blank"
              className="px-3 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tester</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
