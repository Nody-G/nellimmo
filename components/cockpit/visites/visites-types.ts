/**
 * Pure logic & types for the Bons de Visite Électroniques page.
 * No React, no JSX — only types, constants and pure functions.
 */

export type VisitorSentiment = 'coup_de_coeur' | 'interesse' | 'neutre' | 'refus';

export interface SentimentOption {
    id: VisitorSentiment;
    label: string;
    activeClass: string;
}

export const SENTIMENT_OPTIONS: SentimentOption[] = [
    { id: 'coup_de_coeur', label: '😍 Coup de cœur', activeClass: 'bg-emerald-600 text-white ring-2 ring-emerald-300' },
    { id: 'interesse', label: '🤔 Très intéressé', activeClass: 'bg-blue-600 text-white ring-2 ring-blue-300' },
    { id: 'neutre', label: '😐 Hésitant', activeClass: 'bg-amber-600 text-white ring-2 ring-amber-300' },
    { id: 'refus', label: '❌ Pas de suite', activeClass: 'bg-gray-800 text-white ring-2 ring-gray-400' }
];

export const STRENGTH_OPTIONS = [
    'Luminosité',
    'Jardin / Extérieur',
    'Piscine',
    'Calme absolu',
    'Cuisine équipée',
    'Volumes'
];

export const WEAKNESS_OPTIONS = [
    'Travaux à prévoir',
    'Chambres trop petites',
    'Prix jugé élevé',
    'Cuisine à refaire',
    'Vis-à-vis'
];

export const PRICE_FEEDBACK_OPTIONS = [
    'Au prix du marché',
    'Légèrement au-dessus',
    'Trop élevé pour le secteur',
    'Très attractif'
];

export interface VisitFeedback {
    sentiment: VisitorSentiment;
    strengths: string[];
    weaknesses: string[];
    priceFeedback: string;
    notes: string;
}

/**
 * Compile the structured feedback + free notes into a single archival string.
 */
export function compileVisitNotes(feedback: VisitFeedback): string {
    return [
        `Sentiment : ${feedback.sentiment.toUpperCase()}`,
        feedback.strengths.length > 0 ? `Points forts : ${feedback.strengths.join(', ')}` : '',
        feedback.weaknesses.length > 0 ? `Points faibles : ${feedback.weaknesses.join(', ')}` : '',
        `Avis prix : ${feedback.priceFeedback}`,
        feedback.notes ? `Remarques : ${feedback.notes}` : ''
    ]
        .filter(Boolean)
        .join(' | ');
}

/**
 * Generate a pseudo-certified hash label for the printable visit sheet.
 */
export function generateVisitHash(): string {
    return 'sha256-bv-' + Math.random().toString(36).substring(2, 10) + '-certifie';
}

/**
 * Toggle a value in a string list (used for strengths / weaknesses chips).
 */
export function toggleInList(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/* ------------------------------------------------------------------ */
/* Canvas drawing helpers (signature tactile)                          */
/* ------------------------------------------------------------------ */

export function setupCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#131B26';
    return ctx;
}

type PointerEventLike =
    | React.MouseEvent<HTMLCanvasElement>
    | React.TouchEvent<HTMLCanvasElement>;

function pointerPosition(e: PointerEventLike, canvas: HTMLCanvasElement): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
        const touch = e.touches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function beginStroke(
    canvas: HTMLCanvasElement,
    e: PointerEventLike,
    onStart: () => void
): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = pointerPosition(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    onStart();
}

export function continueStroke(canvas: HTMLCanvasElement, e: PointerEventLike): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = pointerPosition(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
}

export function clearCanvasDrawing(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function captureCanvasSignature(canvas: HTMLCanvasElement | null): string {
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
}
