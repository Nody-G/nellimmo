'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { X, Save, Loader2, Check, Image as ImageIcon, FileText } from 'lucide-react';
import type { AmenityItem, NeighborhoodSummary } from '@/lib/amenities';
import { CATEGORY_CONFIG } from '@/lib/amenities';
import type { CadastreParcel } from '@/lib/cadastre';
import type { Property } from '@/lib/types';
import {
    NeighborhoodSheet,
    NeighborhoodSheetOptions,
    LAW_REFERENCES,
    METRIC_REFERENCES,
    defaultSheetOptions,
    upsertSheet,
    generateSheetId,
    slugifySheetTitle,
} from '@/lib/neighborhood-sheets';
import { NeighborhoodSheetCanvas, SHEET_CANVAS_SIZE } from './NeighborhoodSheetCanvas';

interface SheetGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property;
    parcel?: CadastreParcel | null;
    summary?: NeighborhoodSummary | null;
    amenities: AmenityItem[];
    /** Rappel après sauvegarde dans la bibliothèque. */
    onSaved?: (sheet: NeighborhoodSheet) => void;
    /** Options initiales (pour régénérer une fiche existante depuis la bibliothèque). */
    initialOptions?: NeighborhoodSheetOptions | null;
    /** Titre initial (pour régénérer une fiche existante). */
    initialTitle?: string;
    /** Sous-titre initial (pour régénérer une fiche existante). */
    initialSubtitle?: string;
}

const ACCENTS = ['#0F766E', '#1D4ED8', '#7C3AED', '#B45309', '#BE123C', '#0E7490'];

export function SheetGeneratorModal({
    isOpen,
    onClose,
    property,
    parcel,
    summary,
    amenities,
    onSaved,
    initialOptions,
    initialTitle,
    initialSubtitle,
}: SheetGeneratorModalProps) {
    const [options, setOptions] = useState<NeighborhoodSheetOptions>(() =>
        initialOptions ?? defaultSheetOptions(property)
    );
    const [title, setTitle] = useState<string>(
        initialTitle ?? `Fiche Quartier — ${property.city || ''}`.trim()
    );
    const [subtitle, setSubtitle] = useState<string>(
        initialSubtitle ?? 'Argumentaire de visite & environnement'
    );
    const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    const update = (patch: Partial<NeighborhoodSheetOptions>) =>
        setOptions((o) => ({ ...o, ...patch }));

    const toggleInArray = (key: 'poiCategories' | 'lawIds' | 'metricIds', id: string) => {
        setOptions((o) => {
            const arr = o[key] as string[];
            const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
            return { ...o, [key]: next };
        });
    };

    /** Capture la surface carrée en PNG dataURL haute résolution. */
    const capturePng = useCallback(async (): Promise<string> => {
        const el = canvasRef.current;
        if (!el) throw new Error('Canvas non disponible');
        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(el, {
            width: SHEET_CANVAS_SIZE,
            height: SHEET_CANVAS_SIZE,
            scale: 1,
            backgroundColor: '#0B132B',
            useCORS: true,
            logging: false,
        });
        return canvas.toDataURL('image/png');
    }, []);

    const downloadDataUrl = (dataUrl: string, filename: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleExportPng = async () => {
        setExporting('png');
        try {
            const dataUrl = await capturePng();
            downloadDataUrl(dataUrl, `${slugifySheetTitle(title)}.png`);
        } catch (e) {
            console.error('Erreur export PNG', e);
        } finally {
            setExporting(null);
        }
    };

    const handleExportPdf = async () => {
        setExporting('pdf');
        try {
            const dataUrl = await capturePng();
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [SHEET_CANVAS_SIZE, SHEET_CANVAS_SIZE], hotfixes: ['px_scaling'] });
            pdf.addImage(dataUrl, 'PNG', 0, 0, SHEET_CANVAS_SIZE, SHEET_CANVAS_SIZE);
            pdf.save(`${slugifySheetTitle(title)}.pdf`);
        } catch (e) {
            console.error('Erreur export PDF', e);
        } finally {
            setExporting(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const preview = await capturePng();
            const sheet: NeighborhoodSheet = {
                id: generateSheetId(),
                property_id: property.id,
                title: title || 'Fiche Quartier',
                subtitle,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                preview_data_url: preview,
                options,
            };
            upsertSheet(sheet);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            onSaved?.(sheet);
        } catch (e) {
            console.error('Erreur sauvegarde', e);
        } finally {
            setSaving(false);
        }
    };

    const resetOptions = () => setOptions(defaultSheetOptions(property));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            title="Générer une Fiche Quartier"
            description="Fiche carrée haute résolution (1600×1600) — métriques, cadre légal & points d'intérêt personnalisables pour votre dossier client."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ===== Aperçu carré ===== */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 flex items-center justify-center p-3">
                        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ width: '100%', maxWidth: 460 }}>
                            <NeighborhoodSheetCanvas
                                ref={canvasRef}
                                property={property}
                                parcel={parcel}
                                summary={summary}
                                amenities={amenities}
                                options={options}
                                displaySize={460}
                            />
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 text-center">
                        Aperçu — l’export réel est en {SHEET_CANVAS_SIZE}×{SHEET_CANVAS_SIZE} px (carré, très grande résolution)
                    </p>
                </div>

                {/* ===== Panneau de configuration ===== */}
                <div className="lg:col-span-5 space-y-5">
                    {/* Titre & sous-titre */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Titre de la fiche
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Sous-titre"
                        />
                    </div>

                    {/* Agence & accent */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Agence & couleur
                        </label>
                        <input
                            value={options.agencyName}
                            onChange={(e) => update({ agencyName: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="flex items-center gap-2">
                            {ACCENTS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => update({ accentColor: c })}
                                    className={`w-7 h-7 rounded-full transition cursor-pointer border-2 ${options.accentColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Couleur ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Rayon */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Rayon d’affichage : {options.radiusMeters} m
                        </label>
                        <input
                            type="range"
                            min={300}
                            max={2000}
                            step={100}
                            value={options.radiusMeters}
                            onChange={(e) => update({ radiusMeters: Number(e.target.value) })}
                            className="w-full accent-teal-600"
                        />
                    </div>

                    {/* Options d'affichage */}
                    <div className="flex flex-wrap gap-1.5">
                        {(
                            [
                                ['showHeader', 'En-tête'],
                                ['showParcel', 'Parcelle'],
                                ['showWalkability', 'Score'],
                                ['showMetrics', 'Métriques'],
                                ['showLaws', 'Cadre légal'],
                                ['showLegend', 'Légende'],
                            ] as const
                        ).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => update({ [key]: !options[key] } as Partial<NeighborhoodSheetOptions>)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${options[key]
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}
                            >
                                {options[key] ? '✓ ' : ''}{label}
                            </button>
                        ))}
                    </div>

                    {/* Catégories POI */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Points d’intérêt
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(CATEGORY_CONFIG) as (keyof typeof CATEGORY_CONFIG)[]).map((cat) => {
                                const cfg = CATEGORY_CONFIG[cat];
                                const active = options.poiCategories.includes(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleInArray('poiCategories', cat)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${active ? 'text-white border-transparent' : 'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}
                                        style={active ? { backgroundColor: cfg.color } : undefined}
                                    >
                                        {cfg.emoji} {cfg.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Métriques */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Métriques de distance
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {METRIC_REFERENCES.map((m) => {
                                const active = options.metricIds.includes(m.id);
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => toggleInArray('metricIds', m.id)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${active ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}
                                    >
                                        {m.icon} {m.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Lois */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Lois & règles en vigueur
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {LAW_REFERENCES.map((law) => {
                                const active = options.lawIds.includes(law.id);
                                return (
                                    <button
                                        key={law.id}
                                        type="button"
                                        onClick={() => toggleInArray('lawIds', law.id)}
                                        title={law.title}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${active ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}
                                    >
                                        {law.icon} {law.code}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={resetOptions}
                        className="text-[11px] text-slate-400 hover:text-slate-700 underline underline-offset-2 cursor-pointer"
                    >
                        Réinitialiser les options
                    </button>
                </div>
            </div>

            {/* ===== Footer actions ===== */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-100 mt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                    Fermer
                </button>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportPng}
                        disabled={!!exporting}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                    >
                        {exporting === 'png' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        {exporting === 'png' ? 'Génération...' : 'PNG HD'}
                    </button>

                    <button
                        type="button"
                        onClick={handleExportPdf}
                        disabled={!!exporting}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                    >
                        {exporting === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                        {exporting === 'pdf' ? 'Génération...' : 'PDF'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50"
                    >
                        {saved ? <Check className="w-3.5 h-3.5" /> : saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saved ? 'Enregistrée !' : saving ? 'Enregistrement...' : 'Enregistrer dans la bibliothèque'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
