'use client';

import Image from 'next/image';
import {
    Check,
    Copy,
    Download,
    MessageCircle,
    RefreshCw,
    Save,
    Share2,
    Sparkles,
} from 'lucide-react';
import type { Property } from '@/lib/types';
import type { AgencySettings } from '@/lib/types';
import { getStyleLabel } from './redacteur-types';

interface StudioPreviewProps {
    currentText: string;
    currentProperty: Property | undefined;
    selectedStyle: string;
    generationSource: 'deepseek' | 'local_template';
    generationMessage: string;
    isGenerating: boolean;
    copied: boolean;
    appliedToMandate: boolean;
    isPublishingSocial: boolean;
    settings: AgencySettings;
    onRegenerate: () => void;
    onCopy: () => void;
    onDownload: () => void;
    onWhatsApp: () => void;
    onPublishMeta: () => void;
    onTextChange: (value: string) => void;
    onApplyToProperty: () => void;
}

/** Right column: live generated preview with action buttons and text editor. */
export function StudioPreview({
    currentText,
    currentProperty,
    selectedStyle,
    generationSource,
    generationMessage,
    isGenerating,
    copied,
    appliedToMandate,
    isPublishingSocial,
    settings,
    onRegenerate,
    onCopy,
    onDownload,
    onWhatsApp,
    onPublishMeta,
    onTextChange,
    onApplyToProperty,
}: StudioPreviewProps) {
    const isSocialStyle =
        selectedStyle === 'reseaux_sociaux' || selectedStyle === 'script_video_reel';

    return (
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6 sticky top-24">
            <StudioHeader
                selectedStyle={selectedStyle}
                generationSource={generationSource}
                isGenerating={isGenerating}
                copied={copied}
                isPublishingSocial={isPublishingSocial}
                isSocialStyle={isSocialStyle}
                onRegenerate={onRegenerate}
                onCopy={onCopy}
                onDownload={onDownload}
                onWhatsApp={onWhatsApp}
                onPublishMeta={onPublishMeta}
            />

            {generationMessage && (
                <div className="p-2.5 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-200 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{generationMessage}</span>
                </div>
            )}

            {isSocialStyle && currentProperty && (
                <SocialVisualCard property={currentProperty} settings={settings} style={selectedStyle} />
            )}

            {/* Text Editor */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span>Éditeur plein format dynamique</span>
                    <span className="font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-0.5 rounded-full">
                        {currentText.split('\n').length} ligne(s)
                    </span>
                </div>
                <textarea
                    rows={24}
                    value={currentText}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="w-full min-h-[480px] p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl text-xs sm:text-sm font-sans text-gray-800 leading-relaxed focus:outline-[#E12B7B] resize-y shadow-inner"
                    placeholder="Texte de l'annonce ou du script..."
                />
            </div>

            {/* Actions Bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-3 text-[11px]">
                    <span>
                        📊{' '}
                        <strong>{currentText.split(/\s+/).filter(Boolean).length}</strong> mots
                    </span>
                    <span>•</span>
                    <span>
                        <strong>{currentText.length}</strong> caractères
                    </span>
                </div>

                <button
                    onClick={onApplyToProperty}
                    className="w-full sm:w-auto px-5 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                    {appliedToMandate ? (
                        <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Appliqué à la fiche mandat !</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 text-[#C59A45]" />
                            <span>Enregistrer dans la fiche du mandat</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

interface StudioHeaderProps {
    selectedStyle: string;
    generationSource: 'deepseek' | 'local_template';
    isGenerating: boolean;
    copied: boolean;
    isPublishingSocial: boolean;
    isSocialStyle: boolean;
    onRegenerate: () => void;
    onCopy: () => void;
    onDownload: () => void;
    onWhatsApp: () => void;
    onPublishMeta: () => void;
}

function StudioHeader({
    selectedStyle,
    generationSource,
    isGenerating,
    copied,
    isPublishingSocial,
    isSocialStyle,
    onRegenerate,
    onCopy,
    onDownload,
    onWhatsApp,
    onPublishMeta,
}: StudioHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                        Studio Actif
                    </span>
                    <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${generationSource === 'deepseek'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {generationSource === 'deepseek'
                            ? 'IA Active'
                            : 'Moteur Local Certifié'}
                    </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
                    {getStyleLabel(selectedStyle)}
                </h3>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
                <button
                    onClick={onRegenerate}
                    disabled={isGenerating}
                    className="px-3 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50"
                    title="Régénérer"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Génération...' : 'Régénérer'}</span>
                </button>

                <button
                    onClick={onCopy}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Copier"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                    onClick={onDownload}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Télécharger fichier .txt"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>.TXT</span>
                </button>

                <button
                    onClick={onWhatsApp}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    title="WhatsApp"
                >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                </button>

                {isSocialStyle && (
                    <button
                        type="button"
                        onClick={onPublishMeta}
                        disabled={isPublishingSocial}
                        className="px-3 py-2 bg-gradient-to-r from-[#E12B7B] via-[#C71B62] to-[#833AB4] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50"
                        title="Meta API"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{isPublishingSocial ? 'Publication...' : 'Meta API'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}

interface SocialVisualCardProps {
    property: Property;
    settings: AgencySettings;
    style: string;
}

function SocialVisualCard({ property, settings, style }: SocialVisualCardProps) {
    const isReel = style === 'script_video_reel';

    return (
        <div className="p-4 bg-[#131B26] rounded-2xl text-white space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full bg-[#131B26] rounded-full flex items-center justify-center font-bold text-[10px] text-white">
                            NF
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-white block leading-tight">
                            {settings.instagram_business_id || '@nellimmo_provence'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                            {property.city}, Provence •{' '}
                            {isReel ? 'Format Reel 9:16' : 'Post Carré 1:1'}
                        </span>
                    </div>
                </div>
                <span className="px-2.5 py-1 bg-white/10 text-[#C59A45] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {isReel ? 'Reel / TikTok 9:16' : 'Aperçu Post 1:1'}
                </span>
            </div>

            {/* Visual Frame */}
            <div
                className={`relative mx-auto rounded-xl overflow-hidden bg-gray-900 border border-white/10 shadow-lg ${isReel ? 'aspect-9/16 max-w-[200px]' : 'aspect-square max-w-[260px]'
                    }`}
            >
                <Image
                    src={
                        property.images?.[0]?.image_url ||
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={property.title}
                    fill
                    sizes="260px"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 bg-[#E12B7B] text-white rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                        {property.mandate_type === 'exclusif'
                            ? "EXCLUSIVITÉ NELL'IMMO"
                            : 'NOUVEAUTÉ'}
                    </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                    <span className="text-[10px] font-bold text-[#C59A45] uppercase tracking-wider block">
                        📍 {property.city} ({property.postal_code})
                    </span>
                    <p className="text-xs font-bold text-white font-serif line-clamp-1">
                        {property.living_area} m² • {property.rooms_count} pièces
                    </p>
                    <span className="text-sm font-black text-white font-serif block mt-0.5">
                        {property.price_fai.toLocaleString('fr-FR')} € FAI
                    </span>
                </div>
            </div>
        </div>
    );
}
