/**
 * Chiffrement des jetons OAuth Google au repos — AES-256-GCM.
 *
 * ⚠️ Ce module est **serveur uniquement** (`runtime = 'nodejs'`). Il utilise
 * `node:crypto` et ne doit jamais être importé dans un composant client.
 *
 * La clé provient de `process.env.GOOGLE_TOKEN_ENCRYPTION_KEY` (32 octets
 * encodés en base64). Elle n'est jamais persistée en base ni exposée au client.
 *
 * Format de sortie : `iv:authTag:ciphertext`, chaque segment en base64.
 * Le vecteur d'initialisation (IV) est aléatoire à chaque chiffrement, ce qui
 * garantit que deux chiffrements du même jeton produisent des sorties
 * différentes (sémantique IND-CPA).
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits, recommandé pour GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

export class GoogleCryptoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GoogleCryptoError';
    }
}

/**
 * Résout la clé de chiffrement depuis l'environnement.
 *
 * Accepte une clé base64 de 32 octets (recommandé) ou, à défaut, dérive une clé
 * de 32 octets par SHA-256 depuis une passphrase (tolérance de mise en service).
 */
function resolveKey(): Buffer {
    const raw = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
    if (!raw || raw.trim().length === 0) {
        throw new GoogleCryptoError(
            'GOOGLE_TOKEN_ENCRYPTION_KEY manquante. Définissez une clé de 32 octets en base64 dans .env.local.'
        );
    }

    const trimmed = raw.trim();

    // Tentative de décodage base64 strict (32 octets attendus).
    try {
        const decoded = Buffer.from(trimmed, 'base64');
        if (decoded.length === 32) return decoded;
    } catch {
        // ignore, on retombe sur la dérivation
    }

    // Repli : dérivation déterministe SHA-256 (32 octets) depuis la passphrase.
    return createHash('sha256').update(trimmed, 'utf8').digest();
}

/**
 * Chiffre une chaîne en clair.
 * @returns `iv:authTag:ciphertext` (segments base64).
 */
export function encryptSecret(plaintext: string): string {
    if (typeof plaintext !== 'string') {
        throw new GoogleCryptoError('encryptSecret attend une chaîne.');
    }
    const key = resolveKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Déchiffre une chaîne produite par {@link encryptSecret}.
 * Lève {@link GoogleCryptoError} si le format ou l'authentification est invalide.
 */
export function decryptSecret(payload: string): string {
    if (typeof payload !== 'string' || payload.length === 0) {
        throw new GoogleCryptoError('decryptSecret attend une charge chiffrée non vide.');
    }
    const parts = payload.split(':');
    if (parts.length !== 3) {
        throw new GoogleCryptoError('Charge chiffrée malformée (attendu iv:authTag:ciphertext).');
    }
    const [ivB64, tagB64, dataB64] = parts;
    const key = resolveKey();
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
        throw new GoogleCryptoError('IV ou tag d\'authentification de taille invalide.');
    }

    try {
        const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        return decrypted.toString('utf8');
    } catch {
        throw new GoogleCryptoError(
            'Échec du déchiffrement : clé incorrecte ou données altérées.'
        );
    }
}

/** Indique si la clé de chiffrement est présente (sans la révéler). */
export function isCryptoConfigured(): boolean {
    const raw = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
    return Boolean(raw && raw.trim().length > 0);
}
