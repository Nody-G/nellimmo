/**
 * NELLIMO COCKPIT - IMPORT HEKTOR
 * Module de logique pure : types, constantes et fonctions utilitaires
 * pour le centre de migration & sauvegardes.
 */

import { Property, Buyer, VisitSheet, MandateAuditLog } from '@/lib/types';

export type ImportType = 'mandates' | 'buyers';

export interface FullBackupData {
    agency: string;
    exported_at: string;
    counts: {
        properties: number;
        buyers: number;
        visits: number;
        auditLogs: number;
    };
    properties: Property[];
    buyers: Buyer[];
    visits: VisitSheet[];
    auditLogs: MandateAuditLog[];
}

const MANDATES_SAMPLE_HEADER =
    'Ref;Titre;Type;Ville;CP;Adresse;Prix_FAI;Net_Vendeur;Honoraires_TTC;Surface;Terrain;Pieces;Chambres;SDB;DPE;GES;Vendeur;Tel_Vendeur;Email_Vendeur;Type_Mandat;Statut;Photos;Descriptif;Equipements';

const MANDATES_SAMPLE_ROWS = [
    '245;Superbe Bastide T6 avec piscine;Maison;Pélissanne;13330;Chemin des Oliviers;620000;595000;25000;180;1200;6;4;2;B;A;M. et Mme Dupont;06 12 34 56 78;dupont@orange.fr;Exclusif;Actif;https://images.unsplash.com/photo-1600585154340-be6161a56a0c;Magnifique bastide provençale au calme absolu avec vue panoramique.;Piscine,Climatisation,Garage double,Cuisine équipée',
    '246;Appartement contemporain T3 terrasse;Appartement;Salon-de-Provence;13300;Boulevard de la République;215000;205000;10000;72;0;3;2;1;C;B;Mme Martin;06 98 76 54 32;martin@gmail.com;Simple;Actif;https://images.unsplash.com/photo-1600596542815-ffad4c1539a9;Bel appartement lumineux proche de toutes commodités avec terrasse de 15m2.;Terrasse,Parking privatif,Ascenseur',
];

const BUYERS_SAMPLE_HEADER =
    'Nom;Prenom;Telephone;Email;Budget_Max;Surface_Min;Pieces_Min;Chambres_Min;Villes;Financement;Notes';

const BUYERS_SAMPLE_ROWS = [
    'Lefebvre;Thomas;06 11 22 33 44;thomas.lefebvre@gmail.com;650000;140;5;4;Pélissanne, Lambesc, Aurons;Accord bancaire validé;Recherche maison avec jardin et piscine, secteur calme.',
    'Moreau;Sophie;06 55 44 33 22;sophie.moreau@orange.fr;350000;80;3;2;Salon-de-Provence;Simulation bancaire;Projet premier achat, terrasse indispensable.',
];

/** Télécharge le modèle CSV d'exemple pour le type d'import demandé. */
export function downloadSampleCsv(type: ImportType): void {
    let content = '';
    let filename = '';

    if (type === 'mandates') {
        filename = 'modele_import_mandats_hektor_nellimo.csv';
        content = [MANDATES_SAMPLE_HEADER, ...MANDATES_SAMPLE_ROWS].join('\n');
    } else {
        filename = 'modele_import_acquereurs_hektor_nellimo.csv';
        content = [BUYERS_SAMPLE_HEADER, ...BUYERS_SAMPLE_ROWS].join('\n');
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

/** Exporte une sauvegarde complète JSON (coffre-fort légal). */
export function downloadFullBackup(backup: FullBackupData): void {
    const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
        'download',
        `nellimo_coffrefort_legal_complet_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}
