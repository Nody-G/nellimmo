'use client';

import { FileCheck2, Upload, X } from 'lucide-react';
import type { AlurDocumentCategory } from '@/lib/types';
import type { ChecklistItemDef } from './alur-ged-types';

interface UploadDocumentModalProps {
    isOpen: boolean;
    applicableChecklist: ChecklistItemDef[];
    selectedDocKey: string;
    customDocName: string;
    customCategory: AlurDocumentCategory;
    customExpiry: string;
    uploadedFileName: string;
    isSaving: boolean;
    onSelectedDocKeyChange: (value: string) => void;
    onCustomDocNameChange: (value: string) => void;
    onCustomCategoryChange: (value: AlurDocumentCategory) => void;
    onCustomExpiryChange: (value: string) => void;
    onUploadedFileNameChange: (value: string) => void;
    onSave: () => void;
    onClose: () => void;
}

/** Modal to add / upload a new ALUR document. */
export function UploadDocumentModal({
    isOpen,
    applicableChecklist,
    selectedDocKey,
    customDocName,
    customCategory,
    customExpiry,
    uploadedFileName,
    isSaving,
    onSelectedDocKeyChange,
    onCustomDocNameChange,
    onCustomCategoryChange,
    onCustomExpiryChange,
    onUploadedFileNameChange,
    onSave,
    onClose,
}: UploadDocumentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Gestion Documentaire ALUR</span>
                    </div>
                    <button
                        onClick={onClose}
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
                            onChange={(e) => onSelectedDocKeyChange(e.target.value)}
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
                                    onChange={(e) => onCustomDocNameChange(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    Catégorie
                                </label>
                                <select
                                    value={customCategory}
                                    onChange={(e) => onCustomCategoryChange(e.target.value as AlurDocumentCategory)}
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
                            onChange={(e) => onCustomExpiryChange(e.target.value)}
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
                                        onUploadedFileNameChange(e.target.files[0].name);
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
                                    Formats supportés : PDF, PNG, JPG (jusqu{"\u2019"}à 25 Mo)
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                    >
                        {isSaving ? 'Enregistrement...' : 'Valider & Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
