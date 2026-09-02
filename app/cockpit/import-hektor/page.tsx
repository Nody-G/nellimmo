'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { parseHektorPropertiesCsv, parseHektorBuyersCsv, ParseResult } from '@/lib/hektor';
import { Property, Buyer } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Download,
  AlertTriangle,
  ArrowRight,
  Database,
  Trash2,
  Sparkles,
  FileText,
  Users,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function HektorMigrationPage() {
  const { properties, buyers, visits, auditLogs, createProperty, updateProperty, createBuyer } = useNellimoStore();

  const [importType, setImportType] = useState<'mandates' | 'buyers'>('mandates');
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [updateExisting, setUpdateExisting] = useState(true);

  // Parsing state
  const [isParsing, setIsParsing] = useState(false);
  const [propertyParseResult, setPropertyParseResult] = useState<ParseResult<Property> | null>(null);
  const [buyerParseResult, setBuyerParseResult] = useState<ParseResult<Buyer> | null>(null);

  // Execution state
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionSuccess, setInjectionSuccess] = useState(false);
  const [injectedCount, setInjectedCount] = useState(0);

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setInputText(content);
      executeParse(content, importType);
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  // Handle direct text parse
  const executeParse = (text: string, type: 'mandates' | 'buyers') => {
    if (!text.trim()) {
      setPropertyParseResult(null);
      setBuyerParseResult(null);
      return;
    }

    if (type === 'mandates') {
      const result = parseHektorPropertiesCsv(text);
      setPropertyParseResult(result);
      setBuyerParseResult(null);
    } else {
      const result = parseHektorBuyersCsv(text);
      setBuyerParseResult(result);
      setPropertyParseResult(null);
    }
  };

  const handleRunParse = () => {
    setIsParsing(true);
    executeParse(inputText, importType);
    setIsParsing(false);
  };

  // Inject into real store
  const handleCommitImport = async () => {
    setIsInjecting(true);
    let count = 0;

    try {
      if (importType === 'mandates' && propertyParseResult) {
        for (const prop of propertyParseResult.items) {
          const existing = properties.find((p) => p.mandate_number === prop.mandate_number || p.id === prop.id);
          if (existing && updateExisting) {
            await updateProperty(existing.id, prop);
          } else if (!existing) {
            await createProperty(prop);
          }
          count++;
        }
      } else if (importType === 'buyers' && buyerParseResult) {
        for (const b of buyerParseResult.items) {
          await createBuyer(b);
          count++;
        }
      }

      setInjectedCount(count);
      setInjectionSuccess(true);
      // Reset input
      setInputText('');
      setFileName('');
      setPropertyParseResult(null);
      setBuyerParseResult(null);
    } finally {
      setIsInjecting(false);
    }
  };

  // Download Sample CSV Template
  const handleDownloadSampleCsv = (type: 'mandates' | 'buyers') => {
    let content = '';
    let filename = '';

    if (type === 'mandates') {
      filename = 'modele_import_mandats_hektor_nellimo.csv';
      content = 'Ref;Titre;Type;Ville;CP;Adresse;Prix_FAI;Net_Vendeur;Honoraires_TTC;Surface;Terrain;Pieces;Chambres;SDB;DPE;GES;Vendeur;Tel_Vendeur;Email_Vendeur;Type_Mandat;Statut;Photos;Descriptif;Equipements\n' +
        '245;Superbe Bastide T6 avec piscine;Maison;Pélissanne;13330;Chemin des Oliviers;620000;595000;25000;180;1200;6;4;2;B;A;M. et Mme Dupont;06 12 34 56 78;dupont@orange.fr;Exclusif;Actif;https://images.unsplash.com/photo-1600585154340-be6161a56a0c;Magnifique bastide provençale au calme absolu avec vue panoramique.;Piscine,Climatisation,Garage double,Cuisine équipée\n' +
        '246;Appartement contemporain T3 terrasse;Appartement;Salon-de-Provence;13300;Boulevard de la République;215000;205000;10000;72;0;3;2;1;C;B;Mme Martin;06 98 76 54 32;martin@gmail.com;Simple;Actif;https://images.unsplash.com/photo-1600596542815-ffad4c1539a9;Bel appartement lumineux proche de toutes commodités avec terrasse de 15m2.;Terrasse,Parking privatif,Ascenseur';
    } else {
      filename = 'modele_import_acquereurs_hektor_nellimo.csv';
      content = 'Nom;Prenom;Telephone;Email;Budget_Max;Surface_Min;Pieces_Min;Chambres_Min;Villes;Financement;Notes\n' +
        'Lefebvre;Thomas;06 11 22 33 44;thomas.lefebvre@gmail.com;650000;140;5;4;Pélissanne, Lambesc, Aurons;Accord bancaire validé;Recherche maison avec jardin et piscine, secteur calme.\n' +
        'Moreau;Sophie;06 55 44 33 22;sophie.moreau@orange.fr;350000;80;3;2;Salon-de-Provence;Simulation bancaire;Projet premier achat, terrasse indispensable.';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Full Database Backup Export
  const handleExportFullBackup = () => {
    const fullBackup = {
      agency: "Nell'Immo Immobilier (Pélissanne)",
      exported_at: new Date().toISOString(),
      counts: {
        properties: properties.length,
        buyers: buyers.length,
        visits: visits.length,
        auditLogs: auditLogs.length,
      },
      properties,
      buyers,
      visits,
      auditLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nellimo_coffrefort_legal_complet_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Database className="w-4 h-4" />
            <span>Centre de Migration & Sauvegardes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Importeur Universel Hektor & Données
          </h1>
          <p className="text-xs text-gray-500">
            Importez en quelques clics tous vos fichiers CSV, exports Hektor / La Boîte Immo, et prévisualisez les données avant injection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadSampleCsv(importType)}
            className="px-4 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#E12B7B]" />
            Modèle CSV
          </button>
          <button
            onClick={handleExportFullBackup}
            className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C59A45]" />
            Sauvegarde Complète (JSON)
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {injectionSuccess && (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-start justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-950 text-base">
                Importation terminée avec succès !
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                <strong>{injectedCount} enregistrement(s)</strong> ont été intégrés et synchronisés dans votre registre Cockpit.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href="/cockpit/mandats"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <span>Voir le Registre des Mandats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/cockpit/acquereurs"
                  className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl transition"
                >
                  Voir le Fichier Acquéreurs
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => setInjectionSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN IMPORT WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column : Input Box & File Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-5">
            {/* Step 1 : Choose type */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                1. Type de Données à Importer
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setImportType('mandates');
                    if (inputText) executeParse(inputText, 'mandates');
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    importType === 'mandates'
                      ? 'bg-[#E12B7B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Mandats / Biens</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportType('buyers');
                    if (inputText) executeParse(inputText, 'buyers');
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    importType === 'buyers'
                      ? 'bg-[#E12B7B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Acquéreurs / CRM</span>
                </button>
              </div>
            </div>

            {/* Step 2 : File Drop or Paste */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                2. Déposer un Fichier ou Coller du Texte
              </span>

              <label className="p-6 border-2 border-dashed border-gray-300 hover:border-[#E12B7B] bg-gray-50 hover:bg-[#FDF2F8]/30 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center">
                <Upload className="w-6 h-6 text-[#E12B7B]" />
                <span className="text-xs font-bold text-gray-800">
                  {fileName ? `Fichier chargé : ${fileName}` : 'Glisser votre export Hektor (CSV, TSV, TXT, JSON)'}
                </span>
                <span className="text-[10px] text-gray-400">Cliquez pour parcourir vos dossiers</span>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                  Ou coller directement le contenu textuel / tableau
                </label>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    executeParse(e.target.value, importType);
                  }}
                  placeholder="Collez ici les lignes de votre export CSV ou copiez-collez les colonnes depuis Excel..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono text-gray-800 focus:outline-[#E12B7B] leading-relaxed resize-y"
                />
              </div>

              {/* Conflict resolution */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updateExisting}
                    onChange={(e) => setUpdateExisting(e.target.checked)}
                    className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
                  />
                  <span>Mettre à jour les mandats déjà existants s&apos;ils ont le même numéro</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setFileName('');
                    setPropertyParseResult(null);
                    setBuyerParseResult(null);
                  }}
                  className="text-xs text-gray-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunParse}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin' : ''}`} />
                  <span>Analyser les données</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column : Live Data Preview & Commit (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                  Prévisualisation & Validation
                </span>
                <h3 className="font-serif font-bold text-lg text-[#131B26]">
                  Contrôle des Données Détectées
                </h3>
              </div>

              {((propertyParseResult && propertyParseResult.validCount > 0) || (buyerParseResult && buyerParseResult.validCount > 0)) && (
                <button
                  type="button"
                  onClick={handleCommitImport}
                  disabled={isInjecting}
                  className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isInjecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>
                    {isInjecting
                      ? 'Injection en cours...'
                      : `Valider & Importer (${(propertyParseResult?.validCount || buyerParseResult?.validCount || 0)})`}
                  </span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {!propertyParseResult && !buyerParseResult && (
              <div className="p-12 text-center text-gray-400 space-y-3">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-xs font-medium max-w-md mx-auto">
                  Déposez un fichier CSV d&apos;Hektor ou collez du texte dans la zone de gauche pour voir apparaître la prévisualisation instantanée.
                </p>
              </div>
            )}

            {/* Mandates Preview */}
            {propertyParseResult && (
              <div className="space-y-4">
                
                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Lignes Détectées</span>
                    <span className="font-bold text-gray-900 text-sm">{propertyParseResult.totalParsed}</span>
                  </div>
                  <div>
                    <span className="text-emerald-600 text-[10px] uppercase font-bold block">Mandats Valides</span>
                    <span className="font-black text-emerald-700 text-sm">{propertyParseResult.validCount}</span>
                  </div>
                  <div>
                    <span className="text-amber-600 text-[10px] uppercase font-bold block">Avertissements</span>
                    <span className="font-bold text-amber-700 text-sm">{propertyParseResult.errorCount}</span>
                  </div>
                </div>

                {/* Warnings */}
                {propertyParseResult.warnings.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Remarques de conversion :</span>
                    </div>
                    {propertyParseResult.warnings.slice(0, 3).map((w, i) => (
                      <p key={i} className="text-[11px] text-amber-800">• {w}</p>
                    ))}
                  </div>
                )}

                {/* Table Preview */}
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-2xs">
                      <tr className="text-gray-400 font-bold uppercase text-[10px]">
                        <th className="pb-2">Réf.</th>
                        <th className="pb-2">Titre & Ville</th>
                        <th className="pb-2">Prix FAI</th>
                        <th className="pb-2">Surface</th>
                        <th className="pb-2">Vendeur</th>
                        <th className="pb-2">DPE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {propertyParseResult.items.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-2.5 font-mono font-bold text-[#E12B7B]">
                            {formatMandateRef(p.mandate_number)}
                          </td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <img
                                src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                className="w-8 h-6 rounded object-cover bg-gray-100 shrink-0"
                              />
                              <div className="overflow-hidden">
                                <span className="font-bold text-gray-900 block truncate max-w-[160px]">{p.title}</span>
                                <span className="text-[10px] text-gray-500">{p.city}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 font-bold text-gray-900">
                            {p.price_fai.toLocaleString('fr-FR')} €
                          </td>
                          <td className="py-2.5 text-gray-700">
                            {p.living_area} m² ({p.rooms_count}p)
                          </td>
                          <td className="py-2.5 text-gray-600 truncate max-w-[100px]">
                            {p.seller_name}
                          </td>
                          <td className="py-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 font-bold text-[10px]">
                              {p.dpe_letter || '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Buyers Preview */}
            {buyerParseResult && (
              <div className="space-y-4">
                
                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Lignes Détectées</span>
                    <span className="font-bold text-gray-900 text-sm">{buyerParseResult.totalParsed}</span>
                  </div>
                  <div>
                    <span className="text-emerald-600 text-[10px] uppercase font-bold block">Acquéreurs Valides</span>
                    <span className="font-black text-emerald-700 text-sm">{buyerParseResult.validCount}</span>
                  </div>
                  <div>
                    <span className="text-amber-600 text-[10px] uppercase font-bold block">Avertissements</span>
                    <span className="font-bold text-amber-700 text-sm">{buyerParseResult.errorCount}</span>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-2xs">
                      <tr className="text-gray-400 font-bold uppercase text-[10px]">
                        <th className="pb-2">Nom & Prénom</th>
                        <th className="pb-2">Téléphone</th>
                        <th className="pb-2">Budget Max</th>
                        <th className="pb-2">Surface Min</th>
                        <th className="pb-2">Secteur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {buyerParseResult.items.map((b, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-2.5 font-bold text-gray-900">
                            {b.first_name} {b.last_name}
                          </td>
                          <td className="py-2.5 font-mono text-gray-600">
                            {b.phone}
                          </td>
                          <td className="py-2.5 font-bold text-[#E12B7B]">
                            {b.budget_max.toLocaleString('fr-FR')} €
                          </td>
                          <td className="py-2.5 text-gray-700">
                            {b.min_surface} m² ({b.min_bedrooms} ch.)
                          </td>
                          <td className="py-2.5 text-gray-600 truncate max-w-[140px]">
                            {b.target_cities.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
