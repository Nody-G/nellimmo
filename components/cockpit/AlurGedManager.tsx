'use client';

import React, { useState } from 'react';
import { Property, PropertyDocument, AlurDocumentCategory, AlurDocumentStatus } from '@/lib/types';
import { formatMandateRef, isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import {
  FileCheck2,
  AlertTriangle,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Printer,
  Sparkles,
  Info,
  Calendar,
  X,
  FileWarning
} from 'lucide-react';

interface AlurGedManagerProps {
  property: Property;
  onUpdateProperty: (id: string, updates: Partial<Property>) => Promise<Property | null>;
}

// Standard ALUR Checklist configuration based on property type
interface ChecklistItemDef {
  key: string;
  name: string;
  category: AlurDocumentCategory;
  description: string;
  mandatory: boolean;
  validityDurationMonths?: number;
  condition?: (property: Property) => boolean;
}

const CHECKLIST_DEFINITIONS: ChecklistItemDef[] = [
  // 1. Titre & Propriété
  {
    key: 'titre_propriete',
    name: 'Titre de Propriété Complet',
    category: 'propriete',
    description: 'Acte notarié d\'acquisition avec origine de propriété trentenaire',
    mandatory: true
  },
  {
    key: 'taxe_fonciere',
    name: 'Dernier Avis de Taxe Foncière',
    category: 'propriete',
    description: 'Avis de taxe foncière de l\'année N ou N-1',
    mandatory: true
  },
  {
    key: 'cadastre_plan',
    name: 'Extrait Cadastral & Plan de Masse',
    category: 'propriete',
    description: 'Plan parcellaire officiel délivré par le cadastre',
    mandatory: false
  },

  // 2. Diagnostics Techniques (DDT)
  {
    key: 'dpe',
    name: 'DPE (Diagnostic de Performance Énergétique)',
    category: 'diagnostics',
    description: 'DPE version 2021-2026 opposable (valable 10 ans)',
    mandatory: true,
    validityDurationMonths: 120
  },
  {
    key: 'audit_energetique',
    name: 'Audit Énergétique Réglementaire',
    category: 'diagnostics',
    description: 'Obligatoire en monopropriété pour les biens classés F ou G',
    mandatory: true,
    validityDurationMonths: 60,
    condition: (p) => isAuditEnergetiqueObligatoire(p.dpe_letter) && p.property_type !== 'appartement'
  },
  {
    key: 'amiante',
    name: 'État d\'Amiante',
    category: 'diagnostics',
    description: 'Obligatoire pour les permis de construire antérieurs au 1er juillet 1997',
    mandatory: true
  },
  {
    key: 'plomb',
    name: 'Constat de Risque d\'Exposition au Plomb (CREP)',
    category: 'diagnostics',
    description: 'Obligatoire pour les logements construits avant le 1er janvier 1949',
    mandatory: false,
    validityDurationMonths: 12
  },
  {
    key: 'electricite',
    name: 'État de l\'Installation Intérieure d\'Électricité',
    category: 'diagnostics',
    description: 'Obligatoire si l\'installation a plus de 15 ans (valable 3 ans pour la vente)',
    mandatory: true,
    validityDurationMonths: 36
  },
  {
    key: 'gaz',
    name: 'État de l\'Installation Intérieure de Gaz',
    category: 'diagnostics',
    description: 'Obligatoire si l\'installation gaz a plus de 15 ans (valable 3 ans)',
    mandatory: false,
    validityDurationMonths: 36
  },
  {
    key: 'termites',
    name: 'État Parasitaire / Termites',
    category: 'diagnostics',
    description: 'Arrêté préfectoral Bouches-du-Rhône (valable 6 mois)',
    mandatory: true,
    validityDurationMonths: 6
  },
  {
    key: 'erp',
    name: 'État des Risques et Pollutions (ERP / Géorisques)',
    category: 'diagnostics',
    description: 'Risques naturels, miniers, technologiques et sismiques (valable 6 mois)',
    mandatory: true,
    validityDurationMonths: 6
  },
  {
    key: 'assainissement',
    name: 'Certificat de Conformité Assainissement',
    category: 'diagnostics',
    description: 'Contrôle SPANC pour assainissement non collectif (valable 3 ans)',
    mandatory: false,
    validityDurationMonths: 36,
    condition: (p) => p.property_type === 'maison'
  },

  // 3. Copropriété (Loi ALUR)
  {
    key: 'pre_etat_date',
    name: 'Pré-état Daté / Informations Financières',
    category: 'copropriete',
    description: 'Charges courantes, impayés et dettes du syndic (Loi ALUR)',
    mandatory: true,
    condition: (p) => p.property_type === 'appartement'
  },
  {
    key: 'pv_ag',
    name: 'Procès-Verbaux des 3 Dernières AG',
    category: 'copropriete',
    description: 'Comptes-rendus des assemblées générales de copropriété',
    mandatory: true,
    condition: (p) => p.property_type === 'appartement'
  },
  {
    key: 'reglement_copro',
    name: 'Règlement de Copropriété & État Descriptif',
    category: 'copropriete',
    description: 'Règlement de copro avec tous ses modificatifs publiés',
    mandatory: true,
    condition: (p) => p.property_type === 'appartement'
  },
  {
    key: 'fiche_synthetique',
    name: 'Fiche Synthétique de la Copropriété',
    category: 'copropriete',
    description: 'Fiche éditée par le syndic issue du registre national d\'immatriculation',
    mandatory: false,
    condition: (p) => p.property_type === 'appartement'
  },

  // 4. Identité & État Civil
  {
    key: 'cni_vendeurs',
    name: 'Pièces d\'Identité des Mandants (CNI / Passeports)',
    category: 'identite',
    description: 'Copie recto/verso en cours de validité de chaque propriétaire',
    mandatory: true
  },
  {
    key: 'livret_famille',
    name: 'Livret de Famille ou Contrat de Mariage / PACS',
    category: 'identite',
    description: 'Justificatif du régime matrimonial pour vérification du pouvoir de disposer',
    mandatory: true
  },
  {
    key: 'rib_vendeur',
    name: 'Relevé d\'Identité Bancaire (RIB) du Vendeur',
    category: 'identite',
    description: 'Pour virement des fonds par l\'étude notariale après réitération',
    mandatory: false
  }
];

export function AlurGedManager({ property, onUpdateProperty }: AlurGedManagerProps) {
  const currentDocuments: PropertyDocument[] = property.documents || [];

  const [activeCategory, setActiveCategory] = useState<AlurDocumentCategory | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocKey, setSelectedDocKey] = useState<string>('');
  const [customDocName, setCustomDocName] = useState('');
  const [customCategory, setCustomCategory] = useState<AlurDocumentCategory>('autre');
  const [customExpiry, setCustomExpiry] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showNotarySlip, setShowNotarySlip] = useState(false);

  // Filter applicable checklist items
  const applicableChecklist = CHECKLIST_DEFINITIONS.filter(
    (item) => !item.condition || item.condition(property)
  );

  const mandatoryItems = applicableChecklist.filter((i) => i.mandatory);

  // Calculate completion
  const validMandatoryCount = mandatoryItems.filter((item) => {
    const existing = currentDocuments.find(
      (d) => d.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 15)) || d.category === item.category && d.name.includes(item.key)
    );
    return existing && existing.status === 'valide';
  }).length;

  const totalMandatory = mandatoryItems.length;
  const completionPercent = Math.round((validMandatoryCount / totalMandatory) * 100);

  // Handle uploading / adding a document
  const handleSaveDocument = async () => {
    if (!uploadedFileName && !customDocName) return;
    setIsSaving(true);

    const docDef = applicableChecklist.find((i) => i.key === selectedDocKey);
    const docName = docDef ? docDef.name : customDocName || 'Document';
    const category = docDef ? docDef.category : customCategory;

    const newDoc: PropertyDocument = {
      id: `doc-${Date.now()}`,
      property_id: property.id,
      category,
      name: docName,
      filename: uploadedFileName || `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      file_size: Math.round(150000 + Math.random() * 850000), // ~150KB - 1MB
      uploaded_at: new Date().toISOString(),
      expires_at: customExpiry || (docDef?.validityDurationMonths ? new Date(Date.now() + docDef.validityDurationMonths * 30 * 24 * 3600 * 1000).toISOString().slice(0, 10) : undefined),
      status: 'valide',
      mandatory: docDef ? docDef.mandatory : false,
      notes: `Ajouté le ${new Date().toLocaleDateString('fr-FR')}`
    };

    const updatedDocuments = [...currentDocuments.filter((d) => d.name !== docName), newDoc];

    await onUpdateProperty(property.id, { documents: updatedDocuments });
    setIsSaving(false);
    setIsUploadModalOpen(false);
    setUploadedFileName('');
    setCustomDocName('');
    setCustomExpiry('');
  };

  // Delete a document
  const handleDeleteDocument = async (docId: string) => {
    const updatedDocuments = currentDocuments.filter((d) => d.id !== docId);
    await onUpdateProperty(property.id, { documents: updatedDocuments });
  };

  // Change status of a document
  const handleChangeStatus = async (docId: string, status: AlurDocumentStatus) => {
    const updatedDocuments = currentDocuments.map((d) =>
      d.id === docId ? { ...d, status } : d
    );
    await onUpdateProperty(property.id, { documents: updatedDocuments });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Completion Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Conformité Loi ALUR & Dossier Notaire
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700">
                {formatMandateRef(property.mandate_number)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
              Dossier de Vente & Diagnostics Techniques
            </h2>
            <p className="text-xs text-gray-500 max-w-xl">
              Centralisation exhaustive des pièces obligatoires pour la mise en vente et la signature du compromis chez le notaire.
            </p>
          </div>

          {/* Gauge & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={completionPercent >= 80 ? 'text-emerald-500' : completionPercent >= 50 ? 'text-amber-500' : 'text-rose-500'}
                    strokeDasharray={`${completionPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-[#131B26]">{completionPercent}%</span>
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-[#131B26] block">
                  {validMandatoryCount} / {totalMandatory} pièces validées
                </span>
                <span className={`text-[11px] font-semibold block ${
                  completionPercent >= 80 ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {completionPercent >= 80 ? '✓ Dossier prêt pour compromis' : '⚠️ Pièces manquantes pour le notaire'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowNotarySlip(true)}
                className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-[#C59A45]" />
                Bordereau Notaire
              </button>

              <button
                onClick={() => {
                  setSelectedDocKey('');
                  setIsUploadModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Ajouter une Pièce
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === 'all'
                ? 'bg-[#131B26] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes les Pièces ({applicableChecklist.length})
          </button>
          <button
            onClick={() => setActiveCategory('propriete')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === 'propriete'
                ? 'bg-[#131B26] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Titre & Propriété
          </button>
          <button
            onClick={() => setActiveCategory('diagnostics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === 'diagnostics'
                ? 'bg-[#131B26] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Diagnostics DDT
          </button>
          {property.property_type === 'appartement' && (
            <button
              onClick={() => setActiveCategory('copropriete')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategory === 'copropriete'
                  ? 'bg-[#131B26] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Copropriété ALUR
            </button>
          )}
          <button
            onClick={() => setActiveCategory('identite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === 'identite'
                ? 'bg-[#131B26] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Identité & Mandants
          </button>
        </div>
      </div>

      {/* Checklist & Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicableChecklist
          .filter((item) => activeCategory === 'all' || item.category === activeCategory)
          .map((item) => {
            const attachedDoc = currentDocuments.find(
              (d) => d.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 15)) || d.category === item.category && d.name.includes(item.key)
            );

            const isPresent = !!attachedDoc;
            const isExpired = attachedDoc?.expires_at && new Date(attachedDoc.expires_at) < new Date();
            const status: AlurDocumentStatus = attachedDoc ? (isExpired ? 'a_renouveler' : attachedDoc.status) : 'manquant';

            return (
              <div
                key={item.key}
                className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  status === 'valide'
                    ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                    : status === 'a_renouveler'
                    ? 'border-amber-300 bg-amber-50/20'
                    : item.mandatory
                    ? 'border-rose-200 bg-rose-50/10'
                    : 'border-gray-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600 block">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#131B26] leading-tight">
                        {item.name}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      status === 'valide'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'a_renouveler'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : item.mandatory
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {status === 'valide'
                        ? '✓ Valide'
                        : status === 'a_renouveler'
                        ? '⚠️ Périmé'
                        : item.mandatory
                        ? 'Obligatoire'
                        : 'Optionnel'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Attached details */}
                  {attachedDoc && (
                    <div className="p-2.5 bg-white/80 rounded-xl border border-gray-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between font-mono text-gray-600">
                        <span className="truncate max-w-[170px] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#E12B7B]" />
                          {attachedDoc.filename}
                        </span>
                        <span>{Math.round((attachedDoc.file_size || 200000) / 1024)} Ko</span>
                      </div>
                      {attachedDoc.expires_at && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>Validité : {new Date(attachedDoc.expires_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {attachedDoc ? (
                    <>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleChangeStatus(attachedDoc.id, attachedDoc.status === 'valide' ? 'a_renouveler' : 'valide')}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Changer statut"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(attachedDoc.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Supprimer la pièce"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <a
                        href={attachedDoc.file_url || '#'}
                        download={attachedDoc.filename}
                        className="px-3 py-1 bg-white hover:bg-gray-50 text-[#131B26] border border-gray-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                      >
                        <Download className="w-3 h-3 text-[#E12B7B]" />
                        Télécharger
                      </a>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedDocKey(item.key);
                        setIsUploadModalOpen(true);
                      }}
                      className="w-full py-1.5 bg-gray-50 hover:bg-[#E12B7B] hover:text-white text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Uploader le document
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                <FileCheck2 className="w-4 h-4" />
                <span>Gestion Documentaire ALUR</span>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Type de Document
                </label>
                <select
                  value={selectedDocKey}
                  onChange={(e) => setSelectedDocKey(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold"
                >
                  <option value="">-- Pièce Personnalisée / Autre --</option>
                  {applicableChecklist.map((item) => (
                    <option key={item.key} value={item.key}>
                      [{item.category.toUpperCase()}] {item.name} {item.mandatory ? '(*)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedDocKey && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nom du Document
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Permis de construire 2022, Déclaration DAACT..."
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Catégorie
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as AlurDocumentCategory)}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                    >
                      <option value="propriete">Titre & Propriété</option>
                      <option value="diagnostics">Diagnostics DDT</option>
                      <option value="copropriete">Copropriété</option>
                      <option value="identite">Identité & Vendeurs</option>
                      <option value="urbanisme">Urbanisme & Travaux</option>
                      <option value="autre">Autre Document</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Date de Fin de Validité (optionnel)
                </label>
                <input
                  type="date"
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              {/* Drag & Drop simulated box */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Fichier PDF ou Image
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-[#E12B7B] rounded-2xl p-6 text-center cursor-pointer transition bg-gray-50/50">
                  <input
                    type="file"
                    id="ged-file-input"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="ged-file-input" className="cursor-pointer space-y-2 block">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-200 mx-auto flex items-center justify-center text-[#E12B7B]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#131B26] block">
                      {uploadedFileName ? uploadedFileName : 'Cliquez pour sélectionner un fichier PDF'}
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      Formats supportés : PDF, PNG, JPG (jusqu&apos;à 25 Mo)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                {isSaving ? 'Enregistrement...' : 'Valider & Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notary Transmission Slip Modal */}
      {showNotarySlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                  Étude Notariale • Dossier de Vente
                </span>
                <h3 className="text-lg font-serif font-bold text-[#131B26]">
                  Bordereau Officiel de Transmission Notaire
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#131B26] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer
                </button>
                <button
                  onClick={() => setShowNotarySlip(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slip Content */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Agence Émettrice</span>
                  <span className="font-bold text-gray-900 block">SASU Nell&apos;Immo (Nelly Fernandez)</span>
                  <span className="text-gray-600">Pélissanne • Carte CPI 1310 2019 000 042 974</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Bien & Mandat</span>
                  <span className="font-bold text-[#E12B7B] block">{formatMandateRef(property.mandate_number)}</span>
                  <span className="text-gray-800 font-semibold">{property.title} ({property.city})</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#131B26] uppercase tracking-wider mb-2">
                  Inventaire des Pièces Justificatives Fournies :
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500">
                      <tr>
                        <th className="p-2.5">Document</th>
                        <th className="p-2.5">Catégorie</th>
                        <th className="p-2.5">Statut</th>
                        <th className="p-2.5">Date Validité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[11px]">
                      {applicableChecklist.map((item) => {
                        const doc = currentDocuments.find(
                          (d) => d.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 15)) || d.category === item.category && d.name.includes(item.key)
                        );
                        return (
                          <tr key={item.key}>
                            <td className="p-2.5 font-semibold text-gray-900">{item.name}</td>
                            <td className="p-2.5 uppercase font-mono text-[10px] text-gray-500">{item.category}</td>
                            <td className="p-2.5">
                              {doc ? (
                                <span className="text-emerald-700 font-bold">✓ Fourni ({doc.filename})</span>
                              ) : (
                                <span className={item.mandatory ? 'text-rose-600 font-bold' : 'text-gray-400'}>
                                  {item.mandatory ? '✗ Manquant' : 'Non requis'}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-gray-600">
                              {doc?.expires_at ? new Date(doc.expires_at).toLocaleDateString('fr-FR') : 'Permanente'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Ce bordereau certifie que les pièces mentionnées ci-dessus ont été collectées et vérifiées par la SASU Nell&apos;Immo conformément aux dispositions de la Loi ALUR n° 2014-366 et du Décret n° 72-678 (Loi Hoguet).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
