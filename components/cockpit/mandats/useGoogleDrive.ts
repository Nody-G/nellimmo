'use client';

/**
 * Hook Google Drive pour les mandats (Lot 4).
 *
 * Permet de créer l'arborescence de dossiers d'un mandat, de lister ses
 * fichiers et d'y uploader des pièces.
 *
 * Garde-fous : aucun polling, appels déclenchés par action utilisateur,
 * erreurs de connexion exposées via `needsConnection`.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { isConnectionError } from '@/lib/google/proxy-client';
import {
    buildChildrenQuery,
    createMandateFolderTree,
    listDriveFiles,
    uploadDriveFile,
    type GoogleDriveFile,
} from '@/lib/google/services/drive';

export interface UseGoogleDriveResult {
    /** Une opération Drive est en cours. */
    isWorking: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si l'erreur indique un compte Google non connecté. */
    needsConnection: boolean;
    /** Crée l'arborescence complète d'un mandat. */
    createMandateTree: (
        mandateRef: string,
        propertyTitle: string,
        parentId?: string
    ) => Promise<GoogleDriveFile | null>;
    /** Liste les fichiers d'un dossier. */
    listFolder: (folderId: string) => Promise<GoogleDriveFile[]>;
    /** Upload un fichier (contenu base64) dans un dossier. */
    uploadFile: (
        name: string,
        mimeType: string,
        contentBase64: string,
        parentId?: string
    ) => Promise<GoogleDriveFile | null>;
}

export function useGoogleDrive(): UseGoogleDriveResult {
    const { showToast } = useToast();
    const [isWorking, setIsWorking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsConnection, setNeedsConnection] = useState(false);

    const run = useCallback(
        async <T,>(fn: () => Promise<T>, successMessage?: string): Promise<T | null> => {
            setIsWorking(true);
            setError(null);
            setNeedsConnection(false);
            try {
                const result = await fn();
                if (successMessage) showToast(successMessage, 'success');
                return result;
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Erreur de synchronisation Drive.';
                setError(message);
                if (isConnectionError(err)) {
                    setNeedsConnection(true);
                    showToast('Connectez votre compte Google pour utiliser Drive.', 'error');
                } else {
                    showToast(message, 'error');
                }
                return null;
            } finally {
                setIsWorking(false);
            }
        },
        [showToast]
    );

    const createMandateTree = useCallback(
        async (
            mandateRef: string,
            propertyTitle: string,
            parentId?: string
        ): Promise<GoogleDriveFile | null> => {
            const result = await run(
                () => createMandateFolderTree(mandateRef, propertyTitle, parentId),
                'Arborescence Drive du mandat créée.'
            );
            return result?.root ?? null;
        },
        [run]
    );

    const listFolder = useCallback(
        async (folderId: string): Promise<GoogleDriveFile[]> => {
            const result = await run(() => listDriveFiles(buildChildrenQuery(folderId)));
            return result ?? [];
        },
        [run]
    );

    const uploadFile = useCallback(
        (
            name: string,
            mimeType: string,
            contentBase64: string,
            parentId?: string
        ): Promise<GoogleDriveFile | null> =>
            run(
                () => uploadDriveFile(name, mimeType, contentBase64, parentId),
                'Fichier envoyé sur Drive.'
            ),
        [run]
    );

    return { isWorking, error, needsConnection, createMandateTree, listFolder, uploadFile };
}
