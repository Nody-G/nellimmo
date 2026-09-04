/**
 * NELLIMO COCKPIT - NOUVEAU MANDAT
 * Module de logique pure : parsing "Remplissage Express", génération IA,
 * et helpers d'images pour l'assistant de création de mandat.
 */

import { PropertyType, FeesPaidBy, PropertyImage, DpeLetter, GesLetter } from '@/lib/types';

export type AiDescriptionMode = 'portail' | 'luxe' | 'social' | 'bullet';

export interface FastFillPatch {
    priceNetSeller?: number;
    agencyFeesAmount?: number;
    livingArea?: number;
    carrezArea?: number;
    landArea?: number;
    roomsCount?: number;
    bedroomsCount?: number;
    city?: string;
    postalCode?: string;
    propertyType?: PropertyType;
    description?: string;
    title?: string;
}

export interface AiDescriptionContext {
    propertyType: PropertyType;
    livingArea: number;
    city: string;
    postalCode: string;
    roomsCount: number;
    bedroomsCount: number;
    bathroomsCount: number;
    landArea: number;
    featuresInput: string;
    dpeLetter: DpeLetter | undefined;
    dpeValue: number;
    gesLetter: GesLetter | undefined;
    gesValue: number;
    carrezArea: number;
    priceFai: number;
    feesPaidBy: FeesPaidBy;
    nextMandateNumber: number;
}

/**
 * Analyse un texte libre (annonce, description, export) et extrait
 * les valeurs détectées pour pré-remplir le formulaire de mandat.
 */
export function parseFastFillText(text: string): FastFillPatch {
    const patch: FastFillPatch = {};
    if (!text.trim()) return patch;
    const textLower = text.toLowerCase();

    // Price
    const priceMatch = text.match(/(?:prix|vendu|montant|fai)?\s*:?\s*(\d[\d\s\xa0]{3,})\s*(?:€|euros)/i);
    if (priceMatch) {
        const p = parseInt(priceMatch[1].replace(/\s+/g, '').replace(/\xa0/g, ''), 10);
        if (!isNaN(p) && p > 10000) {
            const fees = Math.round(p * 0.04);
            patch.priceNetSeller = p - fees;
            patch.agencyFeesAmount = fees;
        }
    }

    // Surface
    const surfMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2|mètres)/i);
    if (surfMatch) {
        const s = parseFloat(surfMatch[1].replace(',', '.'));
        if (!isNaN(s)) {
            patch.livingArea = s;
            patch.carrezArea = s;
        }
    }

    // Terrain
    const terrainMatch = text.match(/(?:terrain|parcelle)\s*(?:de)?\s*(\d+(?:[.,]\d+)?)\s*(?:m²|m2)/i);
    if (terrainMatch) {
        const t = parseFloat(terrainMatch[1].replace(',', '.'));
        if (!isNaN(t)) patch.landArea = t;
    }

    // Rooms
    const roomsMatch = text.match(/(\d+)\s*(?:pièces|pieces|piece|pièce|T(\d+))/i);
    if (roomsMatch) {
        const r = parseInt(roomsMatch[1] || roomsMatch[2], 10);
        if (!isNaN(r)) patch.roomsCount = r;
    }

    // Bedrooms
    const bedMatch = text.match(/(\d+)\s*(?:chambres|chambre|chb)/i);
    if (bedMatch) {
        const b = parseInt(bedMatch[1], 10);
        if (!isNaN(b)) patch.bedroomsCount = b;
    }

    // City
    if (textLower.includes('salon')) {
        patch.city = 'Salon-de-Provence';
        patch.postalCode = '13300';
    } else if (textLower.includes('pélissanne') || textLower.includes('pelissanne')) {
        patch.city = 'Pélissanne';
        patch.postalCode = '13330';
    } else if (textLower.includes('lançon') || textLower.includes('lancon')) {
        patch.city = 'Lançon-Provence';
        patch.postalCode = '13680';
    } else if (textLower.includes('éguilles') || textLower.includes('eguilles')) {
        patch.city = 'Éguilles';
        patch.postalCode = '13510';
    } else if (textLower.includes('sénas') || textLower.includes('senas')) {
        patch.city = 'Sénas';
        patch.postalCode = '13560';
    } else if (textLower.includes('la fare')) {
        patch.city = 'La Fare-les-Oliviers';
        patch.postalCode = '13580';
    }

    // Property type
    if (textLower.includes('appartement') || textLower.includes('studio')) {
        patch.propertyType = 'appartement';
    } else if (textLower.includes('terrain')) {
        patch.propertyType = 'terrain';
    } else if (textLower.includes('immeuble')) {
        patch.propertyType = 'immeuble';
    } else if (textLower.includes('commercial') || textLower.includes('bureau')) {
        patch.propertyType = 'local_commercial';
    } else {
        patch.propertyType = 'maison';
    }

    // Description & Title
    if (text.length > 50) {
        patch.description = text.trim();
        const firstLine = text.split('\n')[0].replace(/^#+\s*/, '').trim();
        if (firstLine.length > 10 && firstLine.length < 90) {
            patch.title = firstLine;
        }
    }

    return patch;
}

function typeLabelOf(propertyType: PropertyType): string {
    if (propertyType === 'maison') return 'Villa / Maison';
    if (propertyType === 'appartement') return 'Appartement';
    return 'Bien immobilier';
}

/**
 * Génère une description de bien selon le mode de rédaction choisi.
 */
export function generateAiDescription(mode: AiDescriptionMode, ctx: AiDescriptionContext): string {
    const typeLabel = typeLabelOf(ctx.propertyType);
    const hasPool = ctx.featuresInput.toLowerCase().includes('piscine');

    if (mode === 'portail') {
        return (
            `NELL'IMMO vous présente en EXCLUSIVITÉ cette superbe ${typeLabel.toLowerCase()} de ${ctx.livingArea}m² idéalement située sur la commune prisée de ${ctx.city} (${ctx.postalCode}).\n\n` +
            `Ce bien de ${ctx.roomsCount} pièces (${ctx.bedroomsCount} chambres) se compose d'une lumineuse pièce de vie avec cuisine équipée ouverte, bénéficiant d'une exposition idéale.\n\n` +
            `À l'extérieur, vous profiterez d'un agréable terrain de ${ctx.landArea}m² ${hasPool ? 'avec piscine et espace détente,' : ''} parfait pour vos moments de convivialité en famille.\n\n` +
            `Prestations complémentaires : ${ctx.featuresInput}.\n` +
            `DPE : ${ctx.dpeLetter} (${ctx.dpeValue} kWh/m²/an) - GES : ${ctx.gesLetter}.\n\n` +
            `Pour toute information ou pour organiser une visite, contactez Nelly FERNANDEZ au 07 55 68 61 09 ou par email à nellimmo.acte@gmail.com. Mandat n°${ctx.nextMandateNumber}.`
        );
    }

    if (mode === 'luxe') {
        return (
            `L'agence NELL'IMMO a le privilège de vous dévoiler cette demeure d'exception nichée dans l'un des cadres les plus recherchés de ${ctx.city}.\n\n` +
            `Déployant ${ctx.livingArea}m² d'élégance et de volumes généreux, cette propriété sublime l'art de vivre provençal. Les espaces de réception baignés de lumière s'ouvrent harmonieusement sur un parc paysager de ${ctx.landArea}m² ${hasPool ? "agrémenté d'un superbe espace piscine." : '.'}\n\n` +
            `L'espace nuit offre ${ctx.bedroomsCount} suites raffinées alliant confort absolu et sérénité. Matériaux nobles, finitions haut de gamme (${ctx.featuresInput}) et performance énergétique exemplaire font de cette adresse une opportunité rare sur le Pays Salonais.\n\n` +
            `Dossier complet et visites privées sur demande auprès de Nelly Fernandez (07 55 68 61 09).`
        );
    }

    if (mode === 'social') {
        return (
            `🔥 NOUVEAUTÉ NELL'IMMO À ${ctx.city.toUpperCase()} ! 🔥\n\n` +
            `🏡 Coup de cœur pour cette superbe ${typeLabel.toLowerCase()} de ${ctx.livingArea}m² avec terrain de ${ctx.landArea}m² !\n\n` +
            `✨ Ce qu'on adore :\n` +
            `✔️ ${ctx.roomsCount} pièces spacieuses et lumineuses\n` +
            `✔️ ${ctx.bedroomsCount} belles chambres confortables\n` +
            `✔️ ${ctx.featuresInput.split(',').slice(0, 3).join(' / ')}\n` +
            `✔️ Emplacement calme et privilégié à ${ctx.city}\n\n` +
            `💰 Prix : ${ctx.priceFai.toLocaleString('fr-FR')} € FAI\n` +
            `📞 Contactez-nous vite pour visiter : 07 55 68 61 09\n\n` +
            `#Immobilier #${ctx.city.replace(/\s+/g, '')} #PaysSalonais #NellImmo #MaisonAVendre #VillaPACA #ProvenceRealEstate #Exclusivite`
        );
    }

    // bullet
    return (
        `Fiche synthétique - Mandat #${ctx.nextMandateNumber} - ${ctx.city} :\n` +
        `- Type : ${typeLabel}\n` +
        `- Surface : ${ctx.livingArea} m² habitable (Carrez: ${ctx.carrezArea} m²)\n` +
        `- Terrain : ${ctx.landArea} m²\n` +
        `- Pièces : ${ctx.roomsCount} (${ctx.bedroomsCount} chambres, ${ctx.bathroomsCount} SDB)\n` +
        `- Équipements : ${ctx.featuresInput}\n` +
        `- DPE : ${ctx.dpeLetter} (${ctx.dpeValue}) | GES : ${ctx.gesLetter} (${ctx.gesValue})\n` +
        `- Prix FAI : ${ctx.priceFai.toLocaleString('fr-FR')} € (${ctx.feesPaidBy === 'vendeur' ? 'charge vendeur' : 'charge acquéreur'})\n` +
        `- Disponibilité : Immédiate`
    );
}

/** Ajoute une ou plusieurs images à partir d'une liste d'URLs (séparées par virgule ou retour ligne). */
export function addImagesByUrl(url: string, images: PropertyImage[]): PropertyImage[] {
    const urls = url
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter(Boolean);
    const newItems: PropertyImage[] = urls.map((u, i) => ({
        id: `img-${Date.now()}-${i}`,
        property_id: '',
        image_url: u,
        display_order: images.length + i + 1,
        is_cover: images.length === 0 && i === 0,
        created_at: new Date().toISOString(),
    }));
    return [...images, ...newItems];
}

/** Supprime une image à l'index donné, en garantissant qu'une image de couverture reste définie. */
export function removeImage(images: PropertyImage[], index: number): PropertyImage[] {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_cover)) {
        updated[0].is_cover = true;
    }
    return updated;
}

/** Définit l'image à l'index donné comme couverture. */
export function setCoverImage(images: PropertyImage[], index: number): PropertyImage[] {
    return images.map((img, i) => ({
        ...img,
        is_cover: i === index,
    }));
}
