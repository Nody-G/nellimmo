/**
 * Service Google Drive (Lot 4).
 *
 * Crée et gère l'arborescence de dossiers d'un mandat dans Google Drive,
 * ainsi que l'upload de fichiers (diagnostics, photos, pièces d'état civil…).
 *
 * Scope utilisé : `drive.file` — l'application ne voit QUE les fichiers
 * qu'elle a créés ou ouverts explicitement (principe du moindre privilège).
 *
 * Aucun appel direct : tout passe par le proxy `/api/google/proxy`.
 */

import { callGoogleProxy } from '../proxy-client';

/** Type MIME d'un dossier Google Drive. */
export const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';

/** Fichier/dossier Drive. */
export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink?: string;
    webContentLink?: string;
    parents?: string[];
    createdTime?: string;
    modifiedTime?: string;
    size?: string;
}

/** Réponse de `drive:files.list`. */
export interface GoogleDriveFileList {
    files?: GoogleDriveFile[];
    nextPageToken?: string;
}

/** Sous-dossiers standard d'un mandat Nellimmo. */
export const MANDATE_FOLDER_TREE: string[] = [
    '01_Mandat_Signe_Hoguet',
    '02_Titre_Propriete_Cadastre',
    '03_Diagnostics_DDT_DPE_Audit',
    '04_Copropriete_PV_AG_PreEtatDate',
    '05_Photos_HD_Visite_Virtuelle',
    '06_Offres_Achat_Compromis_Notaire',
];

/** Nom du dossier racine d'un mandat. */
export function mandateFolderName(mandateRef: string, propertyTitle: string): string {
    return `Nell'Immo — Mandat ${mandateRef} (${propertyTitle})`;
}

/** Crée un dossier Drive. */
export async function createDriveFolder(
    name: string,
    parentId?: string
): Promise<GoogleDriveFile> {
    const payload: Record<string, unknown> = {
        name,
        mimeType: DRIVE_FOLDER_MIME,
    };
    if (parentId) payload.parents = [parentId];

    return callGoogleProxy<GoogleDriveFile>({
        service: 'drive',
        action: 'files.create',
        payload,
        query: { fields: 'id,name,mimeType,webViewLink,parents' },
    });
}

/**
 * Crée l'arborescence complète d'un mandat.
 * @returns le dossier racine et la liste des sous-dossiers créés.
 */
export async function createMandateFolderTree(
    mandateRef: string,
    propertyTitle: string,
    parentId?: string
): Promise<{ root: GoogleDriveFile; children: GoogleDriveFile[] }> {
    const root = await createDriveFolder(
        mandateFolderName(mandateRef, propertyTitle),
        parentId
    );

    const children: GoogleDriveFile[] = [];
    for (const folderName of MANDATE_FOLDER_TREE) {
        const child = await createDriveFolder(folderName, root.id);
        children.push(child);
    }

    return { root, children };
}

/** Liste les fichiers/dossiers correspondant à une requête Drive. */
export async function listDriveFiles(
    query?: string,
    pageSize = 50
): Promise<GoogleDriveFile[]> {
    const q: Record<string, string> = {
        pageSize: String(pageSize),
        fields: 'files(id,name,mimeType,webViewLink,parents,modifiedTime,size)',
    };
    if (query) q.q = query;
    const data = await callGoogleProxy<GoogleDriveFileList>({
        service: 'drive',
        action: 'files.list',
        query: q,
    });
    return data.files ?? [];
}

/** Récupère les métadonnées d'un fichier Drive. */
export async function getDriveFile(fileId: string): Promise<GoogleDriveFile> {
    return callGoogleProxy<GoogleDriveFile>({
        service: 'drive',
        action: 'files.get',
        pathParams: { fileId },
        query: { fields: 'id,name,mimeType,webViewLink,parents,modifiedTime,size' },
    });
}

/** Supprime (met à la corbeille) un fichier Drive. */
export async function deleteDriveFile(fileId: string): Promise<void> {
    await callGoogleProxy<unknown>({
        service: 'drive',
        action: 'files.delete',
        pathParams: { fileId },
    });
}

/**
 * Upload un fichier dans un dossier Drive.
 *
 * ⚠️ L'API Drive attend un `multipart/related` pour les uploads avec
 * métadonnées. Le proxy transmet le corps tel quel ; on construit donc ici
 * un corps multipart encodé en base64 via `FormData`-like manuel.
 *
 * @param name nom du fichier.
 * @param mimeType type MIME du fichier.
 * @param contentBase64 contenu encodé en base64.
 * @param parentId identifiant du dossier parent.
 */
export async function uploadDriveFile(
    name: string,
    mimeType: string,
    contentBase64: string,
    parentId?: string
): Promise<GoogleDriveFile> {
    const metadata: Record<string, unknown> = { name };
    if (parentId) metadata.parents = [parentId];

    return callGoogleProxy<GoogleDriveFile>({
        service: 'drive',
        action: 'files.upload',
        payload: {
            metadata,
            mimeType,
            contentBase64,
        },
        query: { uploadType: 'multipart', fields: 'id,name,mimeType,webViewLink' },
    });
}

/** Construit une requête Drive pour lister les enfants d'un dossier. */
export function buildChildrenQuery(folderId: string): string {
    return `'${folderId}' in parents and trashed = false`;
}
