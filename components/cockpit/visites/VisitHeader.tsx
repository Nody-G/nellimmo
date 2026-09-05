import { Calendar, FileSignature, Navigation, Map } from 'lucide-react';
import { createGoogleMapsNavUrl, createGoogleMapsTourUrl } from '@/lib/google';

interface VisitHeaderProps {
    onOpenOffer: () => void;
    onOpenCalendar: () => void;
    propertyAddress?: string;
    propertyCity?: string;
    tourStops?: string[];
}

export function VisitHeader({
    onOpenOffer,
    onOpenCalendar,
    propertyAddress,
    propertyCity,
    tourStops = [],
}: VisitHeaderProps) {
    const handleOpenGps = () => {
        if (!propertyAddress && !propertyCity) return;
        const url = createGoogleMapsNavUrl(propertyAddress || '', propertyCity || 'Pélissanne');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleOpenTour = () => {
        if (tourStops.length === 0) return;
        const url = createGoogleMapsTourUrl(tourStops);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    Émargement Tactile & Horodatage
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Bons de Visite Électroniques
                </h1>
                <p className="text-xs text-gray-500">
                    Conforme Loi Hoguet Art. 73 et Code Civil Art. 1366. Signature probante avec reconnaissance
                    d{"\u2019"}honoraires.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {tourStops.length > 0 && (
                    <button
                        type="button"
                        onClick={handleOpenTour}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                        title={`Lancer la tournée Google Maps (${tourStops.length} visites)`}
                    >
                        <Map className="w-4 h-4 text-blue-600" />
                        <span>Tournée Maps ({tourStops.length})</span>
                    </button>
                )}

                {(propertyAddress || propertyCity) && (
                    <button
                        type="button"
                        onClick={handleOpenGps}
                        className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                        title="Ouvrir l'itinéraire GPS dans Google Maps / Waze"
                    >
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <span>GPS Bien</span>
                    </button>
                )}

                <button
                    type="button"
                    onClick={onOpenOffer}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                    <FileSignature className="w-4 h-4 text-emerald-600" />
                    <span>Formuler Offre d{"\u2019"}Achat</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenCalendar}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-[#F3E8EE] text-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                    <Calendar className="w-4 h-4 text-[#E12B7B]" />
                    <span>Synchro iCal / Agenda</span>
                </button>
            </div>
        </div>
    );
}
