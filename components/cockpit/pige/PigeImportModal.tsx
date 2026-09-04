'use client';

import { useRef, useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import type { ParsedPigeLead } from './pige-import';
import { parsePigeCsv } from './pige-import';

interface PigeImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (leads: ParsedPigeLead[]) => Promise<void>;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]';

/** Modal to bulk-import prospecting leads from a CSV file or pasted text. */
export function PigeImportModal({ isOpen, onClose, onImport }: PigeImportModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [csvText, setCsvText] = useState('');
    const [parsed, setParsed] = useState<ParsedPigeLead[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    if (!isOpen) return null;

    const handleParse = (text: string) => {
        setCsvText(text);
        const result = parsePigeCsv(text);
        setParsed(result.leads);
        setErrors(result.errors);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const content = String(evt.target?.result ?? '');
            handleParse(content);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleRemoveRow = (index: number) => {
        setParsed((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImport = async () => {
        if (parsed.length === 0) return;
        setIsImporting(true);
        try {
            await onImport(parsed);
            setParsed([]);
            setCsvText('');
            setErrors([]);
        } finally {
            setIsImporting(false);
        }
    };

    const handleClose = () => {
        setParsed([]);
        setCsvText('');
        setErrors([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-[#131B26]">
                            Import CSV de Pige (Annonces de Particuliers)
                        </h3>
                        <p className="text-[11px] text-gray-500">
                            Colonnes reconnues : titre, vendeur, téléphone, prix, surface, ville, source, lien, notes.
                        </p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Input area */}
                <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                        >
                            <Upload className="w-4 h-4 text-[#C59A45]" />
                            Choisir un fichier .csv
                        </button>
                        <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <FileSpreadsheet className="w-3.5 h-3.5" /> ou collez le contenu ci-dessous
                        </span>
                    </div>

                    <textarea
                        rows={5}
                        placeholder={'titre;vendeur;telephone;prix;surface;ville;source;lien;notes\nVilla 120m² Pélissanne;M. Bernard;0612345678;420000;120;Pélissanne;leboncoin;https://...;Vente cause mutation'}
                        value={csvText}
                        onChange={(e) => handleParse(e.target.value)}
                        className={inputClass}
                    />
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1 max-h-28 overflow-y-auto">
                        {errors.map((err, i) => (
                            <p key={i} className="flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                {err}
                            </p>
                        ))}
                    </div>
                )}

                {/* Preview */}
                {parsed.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-[#131B26] uppercase tracking-wider">
                                Aperçu — {parsed.length} annonce{parsed.length > 1 ? 's' : ''} prête{parsed.length > 1 ? 's' : ''} à importer
                            </h4>
                        </div>
                        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                            <table className="w-full text-left text-[11px]">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px]">
                                        <th className="p-2.5">Titre</th>
                                        <th className="p-2.5">Vendeur</th>
                                        <th className="p-2.5">Tél.</th>
                                        <th className="p-2.5">Prix</th>
                                        <th className="p-2.5">Surf.</th>
                                        <th className="p-2.5">Ville</th>
                                        <th className="p-2.5">Source</th>
                                        <th className="p-2.5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {parsed.map((lead, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/70">
                                            <td className="p-2.5 font-semibold text-gray-900 max-w-[180px] truncate">{lead.title}</td>
                                            <td className="p-2.5 text-gray-600">{lead.sellerName}</td>
                                            <td className="p-2.5 text-gray-600 font-mono">{lead.phone}</td>
                                            <td className="p-2.5 font-bold text-[#E12B7B]">{lead.price.toLocaleString('fr-FR')} €</td>
                                            <td className="p-2.5 text-gray-600">{lead.surface} m²</td>
                                            <td className="p-2.5 text-gray-600">{lead.city}</td>
                                            <td className="p-2.5 text-gray-600 uppercase">{lead.source}</td>
                                            <td className="p-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRow(idx)}
                                                    className="text-gray-300 hover:text-red-500 transition cursor-pointer"
                                                    title="Retirer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleImport}
                        disabled={parsed.length === 0 || isImporting}
                        className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {isImporting ? 'Import en cours…' : `Importer ${parsed.length} annonce${parsed.length > 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
