'use client';

interface VisitNotesProps {
    notes: string;
    onChange: (value: string) => void;
}

export function VisitNotes({ notes, onChange }: VisitNotesProps) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Impressions & Remarques Complémentaires
            </label>
            <textarea
                rows={2}
                value={notes}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ex: Demande de contre-visite samedi avec un artisan pour devis peinture..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
            />
        </div>
    );
}
