'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import {
  Navigation,
  Compass,
  FolderOpen,
  ExternalLink,
  Check,
  Edit2,
  Copy,
} from 'lucide-react';
import {
  createGoogleMapsNavUrl,
  getGoogleDriveUrl,
  generateMandateDriveTreeText,
} from '@/lib/google';
import { formatMandateRef } from '@/lib/hoguet';
import { GoogleMapsNeighborhoodModal } from './GoogleMapsNeighborhoodModal';

interface GoogleTerrainCardProps {
  property: Property;
  onSaveDriveUrl: (url: string) => Promise<void>;
}

export function GoogleTerrainCard({ property, onSaveDriveUrl }: GoogleTerrainCardProps) {
  const [isEditingDrive, setIsEditingDrive] = useState(false);
  const [driveInput, setDriveInput] = useState(property.google_drive_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [copiedTree, setCopiedTree] = useState(false);

  const mandateRef = formatMandateRef(property.mandate_number);
  const mapsUrl = createGoogleMapsNavUrl(property.address, property.city);
  const driveUrl = getGoogleDriveUrl(property.google_drive_url, mandateRef);

  const handleSaveDrive = async () => {
    setIsSaving(true);
    try {
      await onSaveDriveUrl(driveInput.trim());
      setIsEditingDrive(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyDriveTree = async () => {
    const treeText = generateMandateDriveTreeText(mandateRef, property.title);
    await navigator.clipboard.writeText(treeText);
    setCopiedTree(true);
    setTimeout(() => setCopiedTree(false), 2000);
  };

  return (
    <>
      <Card className="p-5 border-blue-100 bg-gradient-to-r from-blue-50/40 via-white to-pink-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-sm font-bold text-[#131B26] uppercase tracking-wider">
                Hub Google Terrain, Maps &amp; Drive
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                Google Workspace Pro
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Guidage GPS, radar des écoles/commerces, temps de trajet et archivage cloud Google Drive
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Radar Quartier & Trajets Google Maps */}
            <button
              type="button"
              onClick={() => setIsNeighborhoodModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer"
              title="Explorer le radar commodités (écoles, transports) et temps de trajet travail"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Radar Quartier &amp; Trajets</span>
            </button>

            {/* 2. Google Maps Navigation */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition"
              title="Lancer le guidage GPS (Google Maps / Waze / CarPlay)"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Itinéraire GPS</span>
            </a>

            {/* 3. Google Drive Dossier */}
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition"
              title="Ouvrir le dossier de photos HD et pièces lourdes sur Google Drive"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Drive</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            {/* 4. Copy ALUR Drive Tree */}
            <button
              type="button"
              onClick={handleCopyDriveTree}
              className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Copier la nomenclature officielle des 6 dossiers ALUR Google Drive"
            >
              {copiedTree ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTree ? 'Copié !' : 'Structure ALUR'}</span>
            </button>

            {/* Edit Drive Link Button */}
            <button
              type="button"
              onClick={() => setIsEditingDrive(!isEditingDrive)}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition cursor-pointer"
              title="Configurer le lien du dossier Google Drive"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inline Drive URL Editor */}
        {isEditingDrive && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="url"
              value={driveInput}
              onChange={(e) => setDriveInput(e.target.value)}
              placeholder="Coller l'URL du dossier Google Drive (ex: https://drive.google.com/drive/folders/...)"
              className="flex-1 w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-blue-500"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDrive}
                disabled={isSaving}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Enregistrement...' : 'Valider'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDrive(false)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </Card>

      <GoogleMapsNeighborhoodModal
        isOpen={isNeighborhoodModalOpen}
        onClose={() => setIsNeighborhoodModalOpen(false)}
        property={property}
      />
    </>
  );
}
