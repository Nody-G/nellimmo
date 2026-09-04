'use client';

import React, { useState } from 'react';

interface PolirisInspectorProps {
  csvContent: string;
  photosCfgContent: string;
  configTxtContent: string;
  activePropertiesCount: number;
}

export function PolirisInspector({
  csvContent,
  photosCfgContent,
  configTxtContent,
  activePropertiesCount,
}: PolirisInspectorProps) {
  const [activeFileTab, setActiveFileTab] = useState<'csv' | 'photos' | 'config'>('csv');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Inspecteur de Fichiers Poliris (Archive ZIP)
          </h3>
          <p className="text-xs text-gray-500">
            Contenu textuel brut généré en temps réel pour validation technique.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveFileTab('csv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFileTab === 'csv' ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            annonces.csv ({activePropertiesCount} lignes)
          </button>
          <button
            type="button"
            onClick={() => setActiveFileTab('photos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFileTab === 'photos' ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            photos.cfg
          </button>
          <button
            type="button"
            onClick={() => setActiveFileTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFileTab === 'config' ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            config.txt
          </button>
        </div>
      </div>

      {/* File Content Area */}
      <div className="bg-[#0E141D] text-gray-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 whitespace-pre leading-relaxed">
        {activeFileTab === 'csv' && csvContent}
        {activeFileTab === 'photos' && photosCfgContent}
        {activeFileTab === 'config' && configTxtContent}
      </div>
    </div>
  );
}
