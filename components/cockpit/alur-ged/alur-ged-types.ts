import type {
    Property,
    PropertyDocument,
    AlurDocumentCategory,
    AlurDocumentStatus,
} from '@/lib/types';
import { isAuditEnergetiqueObligatoire } from '@/lib/hoguet';

/** Definition of a required/optional document in the ALUR checklist. */
export interface ChecklistItemDef {
    key: string;
    name: string;
    category: AlurDocumentCategory;
    description: string;
    mandatory: boolean;
    validityDurationMonths?: number;
    condition?: (property: Property) => boolean;
}

/** Standard ALUR checklist configuration based on property type. */
export const CHECKLIST_DEFINITIONS: ChecklistItemDef[] = [
    // 1. Titre & Propriété
    {
        key: 'titre_propriete',
        name: 'Titre de Propriété Complet',
        category: 'propriete',
        description: 'Acte notarié d\u2019acquisition avec origine de propriété trentenaire',
        mandatory: true,
    },
    {
        key: 'taxe_fonciere',
        name: 'Dernier Avis de Taxe Foncière',
        category: 'propriete',
        description: 'Avis de taxe foncière de l\u2019année N ou N-1',
        mandatory: true,
    },
    {
        key: 'cadastre_plan',
        name: 'Extrait Cadastral & Plan de Masse',
        category: 'propriete',
        description: 'Plan parcellaire officiel délivré par le cadastre',
        mandatory: false,
    },

    // 2. Diagnostics Techniques (DDT)
    {
        key: 'dpe',
        name: 'DPE (Diagnostic de Performance Énergétique)',
        category: 'diagnostics',
        description: 'DPE version 2021-2026 opposable (valable 10 ans)',
        mandatory: true,
        validityDurationMonths: 120,
    },
    {
        key: 'audit_energetique',
        name: 'Audit Énergétique Réglementaire',
        category: 'diagnostics',
        description: 'Obligatoire en monopropriété pour les biens classés F ou G',
        mandatory: true,
        validityDurationMonths: 60,
        condition: (p) => isAuditEnergetiqueObligatoire(p.dpe_letter) && p.property_type !== 'appartement',
    },
    {
        key: 'amiante',
        name: 'État d\u2019Amiante',
        category: 'diagnostics',
        description: 'Obligatoire pour les permis de construire antérieurs au 1er juillet 1997',
        mandatory: true,
    },
    {
        key: 'plomb',
        name: 'Constat de Risque d\u2019Exposition au Plomb (CREP)',
        category: 'diagnostics',
        description: 'Obligatoire pour les logements construits avant le 1er janvier 1949',
        mandatory: false,
        validityDurationMonths: 12,
    },
    {
        key: 'electricite',
        name: 'État de l\u2019Installation Intérieure d\u2019Électricité',
        category: 'diagnostics',
        description: 'Obligatoire si l\u2019installation a plus de 15 ans (valable 3 ans pour la vente)',
        mandatory: true,
        validityDurationMonths: 36,
    },
    {
        key: 'gaz',
        name: 'État de l\u2019Installation Intérieure de Gaz',
        category: 'diagnostics',
        description: 'Obligatoire si l\u2019installation gaz a plus de 15 ans (valable 3 ans)',
        mandatory: false,
        validityDurationMonths: 36,
    },
    {
        key: 'termites',
        name: 'État Parasitaire / Termites',
        category: 'diagnostics',
        description: 'Arrêté préfectoral Bouches-du-Rhône (valable 6 mois)',
        mandatory: true,
        validityDurationMonths: 6,
    },
    {
        key: 'erp',
        name: 'État des Risques et Pollutions (ERP / Géorisques)',
        category: 'diagnostics',
        description: 'Risques naturels, miniers, technologiques et sismiques (valable 6 mois)',
        mandatory: true,
        validityDurationMonths: 6,
    },
    {
        key: 'assainissement',
        name: 'Certificat de Conformité Assainissement',
        category: 'diagnostics',
        description: 'Contrôle SPANC pour assainissement non collectif (valable 3 ans)',
        mandatory: false,
        validityDurationMonths: 36,
        condition: (p) => p.property_type === 'maison',
    },
    {
        key: 'carrez',
        name: 'Attestation de Superficie Loi Carrez',
        category: 'diagnostics',
        description: 'Obligatoire pour tout lot de copropriété (valable sans limitation sauf travaux)',
        mandatory: true,
        condition: (p) => p.property_type === 'appartement',
    },

    // 3. Copropriété (Loi ALUR)
    {
        key: 'pre_etat_date',
        name: 'Pré-état Daté / Informations Financières',
        category: 'copropriete',
        description: 'Charges courantes, impayés et dettes du syndic (Loi ALUR)',
        mandatory: true,
        condition: (p) => p.property_type === 'appartement',
    },
    {
        key: 'pv_ag',
        name: 'Procès-Verbaux des 3 Dernières AG',
        category: 'copropriete',
        description: 'Comptes-rendus des assemblées générales de copropriété',
        mandatory: true,
        condition: (p) => p.property_type === 'appartement',
    },
    {
        key: 'reglement_copro',
        name: 'Règlement de Copropriété & État Descriptif',
        category: 'copropriete',
        description: 'Règlement de copro avec tous ses modificatifs publiés',
        mandatory: true,
        condition: (p) => p.property_type === 'appartement',
    },
    {
        key: 'fiche_synthetique',
        name: 'Fiche Synthétique de la Copropriété',
        category: 'copropriete',
        description: 'Fiche éditée par le syndic issue du registre national d\u2019immatriculation',
        mandatory: false,
        condition: (p) => p.property_type === 'appartement',
    },
    {
        key: 'carnet_entretien',
        name: 'Carnet d\u2019Entretien de l\u2019Immeuble',
        category: 'copropriete',
        description: 'Tenue obligatoire par le syndic (Loi ALUR art. L. 721-2 CCH)',
        mandatory: true,
        condition: (p) => p.property_type === 'appartement',
    },
    {
        key: 'pppt',
        name: 'Projet de Plan Pluriannuel de Travaux (PPPT / DTG)',
        category: 'copropriete',
        description: 'Obligatoire en copropriété de plus de 15 ans (Loi Climat & Résilience 2024-2025)',
        mandatory: false,
        condition: (p) => p.property_type === 'appartement',
    },

    // 4. Identité & État Civil
    {
        key: 'cni_vendeurs',
        name: 'Pièces d\u2019Identité des Mandants (CNI / Passeports)',
        category: 'identite',
        description: 'Copie recto/verso en cours de validité de chaque propriétaire',
        mandatory: true,
    },
    {
        key: 'livret_famille',
        name: 'Livret de Famille ou Contrat de Mariage / PACS',
        category: 'identite',
        description: 'Justificatif du régime matrimonial pour vérification du pouvoir de disposer',
        mandatory: true,
    },
    {
        key: 'rib_vendeur',
        name: 'Relevé d\u2019Identité Bancaire (RIB) du Vendeur',
        category: 'identite',
        description: 'Pour virement des fonds par l\u2019étude notariale après réitération',
        mandatory: false,
    },
];

/** Creates a new PropertyDocument record. */
export function createPropertyDocument(params: {
    propertyId: string;
    category: AlurDocumentCategory;
    docName: string;
    filename: string;
    validityDurationMonths?: number;
    customExpiry?: string;
    mandatory: boolean;
}): PropertyDocument {
    const now = Date.now();
    const expiresAt =
        params.customExpiry ||
        (params.validityDurationMonths
            ? new Date(now + params.validityDurationMonths * 30 * 24 * 3600 * 1000)
                .toISOString()
                .slice(0, 10)
            : undefined);
    return {
        id: `doc-${now}`,
        property_id: params.propertyId,
        category: params.category,
        name: params.docName,
        filename: params.filename,
        file_size: Math.round(150000 + Math.random() * 850000),
        uploaded_at: new Date(now).toISOString(),
        expires_at: expiresAt,
        status: 'valide',
        mandatory: params.mandatory,
        notes: `Ajouté le ${new Date(now).toLocaleDateString('fr-FR')}`,
    };
}

/** Finds the document attached to a given checklist item (by name or key). */
export function findAttachedDocument(
    documents: PropertyDocument[],
    item: ChecklistItemDef
): PropertyDocument | undefined {
    return documents.find(
        (d) =>
            d.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 15)) ||
            (d.category === item.category && d.name.includes(item.key))
    );
}

/** Computes the effective ALUR status of a checklist item. */
export function computeDocumentStatus(
    attachedDoc: PropertyDocument | undefined
): AlurDocumentStatus {
    if (!attachedDoc) return 'manquant';
    const isExpired = attachedDoc.expires_at && new Date(attachedDoc.expires_at) < new Date();
    return isExpired ? 'a_renouveler' : attachedDoc.status;
}

/** Builds the WhatsApp reminder message for the seller. */
export function buildWhatsappReminderMessage(
    property: Property,
    missingNames: string[],
    singleItemName?: string
): string {
    const seller = property.seller_name || 'Monsieur/Madame';
    if (singleItemName) {
        return `Bonjour ${seller}, pour finaliser la constitution du dossier notaire conforme Loi ALUR pour votre bien "${property.title}", pourriez-vous nous transmettre le document suivant : *${singleItemName}* ?\nMerci d\u2019avance !\nNelly Fernandez - Nell\u2019Immo Pélissanne (07 55 68 61 09)`;
    }
    const itemsList = missingNames.map((m) => `• ${m}`).join('\n');
    return `Bonjour ${seller},\n\nAfin de sécuriser le dossier de vente notaire (Loi ALUR) de votre bien "${property.title}", merci de nous faire parvenir les pièces suivantes :\n${itemsList}\n\nBien cordialement,\nNelly Fernandez - Nell\u2019Immo (07 55 68 61 09)`;
}

/** Opens a WhatsApp chat to the seller with the given message. */
export function openWhatsappReminder(property: Property, message: string): void {
    const cleanPhone = (property.seller_phone || '').replace(/\D/g, '');
    const phoneWithPrefix = cleanPhone.startsWith('0') ? '33' + cleanPhone.slice(1) : cleanPhone;
    const url = `https://wa.me/${phoneWithPrefix}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
