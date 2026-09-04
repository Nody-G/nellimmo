/**
 * NELLIMO COCKPIT - SIGNATURE ÉLECTRONIQUE eIDAS
 * Module de logique pure : types d'étapes, génération/vérification OTP
 * et helpers de dessin sur canvas pour l'émargement tactile.
 */

export type SignatureStep = 'contract' | 'otp_verify' | 'signature_draw' | 'success';

export type ContractKind = 'exclusif' | 'simple';

/** Génère un code OTP à 6 chiffres. */
export function generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Vérifie le code OTP saisi (accepte le code généré ou le code de secours de démo). */
export function isOtpValid(entered: string, generated: string): boolean {
    return entered.trim() === generated || entered.trim() === '123456';
}

/** Convertit le type de mandat UI en type de certificat attendu par lib/signature. */
export function toCertificateContractType(contractType: ContractKind): 'mandat_exclusif' | 'mandat_simple' {
    return contractType === 'exclusif' ? 'mandat_exclusif' : 'mandat_simple';
}

/** Récupère le contexte 2D du canvas, ou null s'il est indisponible. */
export function getCanvasContext(canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null {
    if (!canvas) return null;
    return canvas.getContext('2d');
}

/** Calcule les coordonnées du pointeur (souris ou tactile) relatives au canvas. */
export function getPointerPosition(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    return { x, y };
}

/** Démarre un nouveau tracé au point donné. */
export function beginStroke(
    canvas: HTMLCanvasElement | null,
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
): boolean {
    const ctx = getCanvasContext(canvas);
    if (!ctx || !canvas) return false;
    const { x, y } = getPointerPosition(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    return true;
}

/** Prolonge le tracé courant jusqu'au point donné. */
export function continueStroke(
    canvas: HTMLCanvasElement | null,
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
): boolean {
    const ctx = getCanvasContext(canvas);
    if (!ctx || !canvas) return false;
    const { x, y } = getPointerPosition(e, canvas);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#131B26';
    ctx.lineTo(x, y);
    ctx.stroke();
    return true;
}

/** Efface entièrement le canvas. */
export function clearCanvasDrawing(canvas: HTMLCanvasElement | null): void {
    const ctx = getCanvasContext(canvas);
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
