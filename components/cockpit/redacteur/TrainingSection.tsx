'use client';

import { BookOpen, PlusCircle, Trash2 } from 'lucide-react';
import type { TrainingExample } from '@/lib/copywriting';

interface TrainingSectionProps {
    examples: TrainingExample[];
    newTitle: string;
    newText: string;
    onTitleChange: (value: string) => void;
    onTextChange: (value: string) => void;
    onAdd: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

/** Memory of style: reference listings that inspire the AI copywriting. */
export function TrainingSection({
    examples,
    newTitle,
    newText,
    onTitleChange,
    onTextChange,
    onAdd,
    onDelete,
}: TrainingSectionProps) {
    return (
        <div className="bg-gradient-to-br from-[#FCFAF7] to-white rounded-3xl p-6 border border-[#E9DFD3] shadow-md space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#C59A45]" />
                        Mémoire de Style : Vos Textes de Référence
                    </h3>
                    <p className="text-xs text-gray-600 max-w-2xl">
                        Ajoutez ici vos annonces coups de cœur passées. L{"\u2019"}IA s{"\u2019"}en
                        inspire pour reproduire vos tournures de phrases favorites et votre
                        sensibilité.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                        Annonces mémorisées ({examples.length})
                    </span>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {examples.map((ex) => (
                            <div
                                key={ex.id}
                                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs relative group"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <h4 className="font-bold text-xs text-gray-900">{ex.title}</h4>
                                    <button
                                        onClick={() => onDelete(ex.id)}
                                        className="text-gray-400 hover:text-red-600 transition p-1 cursor-pointer"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-600 line-clamp-3 italic">
                                    &laquo; {ex.sourceText} &raquo;
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <form
                    onSubmit={onAdd}
                    className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 shadow-2xs"
                >
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E12B7B] block">
                        Ajouter une nouvelle annonce type
                    </span>
                    <div>
                        <input
                            type="text"
                            placeholder="Titre de référence (ex: Villa de Charme Lambesc 2024)"
                            value={newTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            rows={4}
                            placeholder="Collez ici le texte de votre ancienne annonce..."
                            value={newText}
                            onChange={(e) => onTextChange(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-[#E12B7B]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                        <PlusCircle className="w-4 h-4 text-[#C59A45]" />
                        Enregistrer dans la mémoire de style
                    </button>
                </form>
            </div>
        </div>
    );
}
