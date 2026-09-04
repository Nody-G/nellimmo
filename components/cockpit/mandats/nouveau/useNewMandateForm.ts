'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { calculateFinancials, getDpeLetterFromValue, getGesLetterFromValue } from '@/lib/hoguet';
import { MandateType, PropertyType, SellerCivility, FeesPaidBy, PropertyImage } from '@/lib/types';
import {
    parseFastFillText,
    generateAiDescription,
    addImagesByUrl,
    removeImage,
    setCoverImage,
    AiDescriptionMode
} from '@/components/cockpit/mandats/nouveau/mandats-nouveau-types';
import { useToast } from '@/components/ui/Toast';

const DEFAULT_IMAGES: PropertyImage[] = [
    {
        id: 'img-1',
        property_id: '',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_cover: true,
        created_at: new Date().toISOString()
    },
    {
        id: 'img-2',
        property_id: '',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        display_order: 2,
        is_cover: false,
        created_at: new Date().toISOString()
    },
    {
        id: 'img-3',
        property_id: '',
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        display_order: 3,
        is_cover: false,
        created_at: new Date().toISOString()
    }
];

/**
 * Hook d'orchestration du formulaire « Nouveau Mandat ».
 * Encapsule tout l'état du formulaire (vendeur, bien, specs, diagnostics,
 * financier, description, canaux, médias), les valeurs dérivées (calculs
 * financiers, lettres DPE/GES, prochain n° de mandat) et les handlers
 * (Remplissage Express, génération IA, gestion d'images, soumission).
 *
 * La page reste une « coquille » qui compose les sous-composants du wizard
 * en leur passant les valeurs/setters exposés ici.
 */
export function useNewMandateForm() {
    const router = useRouter();
    const { createProperty, properties } = useNellimoStore();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fast-Fill & AI Helper
    const [showAutoFillModal, setShowAutoFillModal] = useState(false);
    const [autoFillSuccess, setAutoFillSuccess] = useState(false);
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    // Next Mandate Number calculation
    const nextMandateNumber =
        properties.length > 0
            ? Math.max(...properties.map((p) => p.mandate_number || 0)) + 1
            : 245;

    // Form State
    const [mandateType, setMandateType] = useState<MandateType>('exclusif');
    const [mandateDate, setMandateDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [mandateEndDate, setMandateEndDate] = useState(
        () => new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    );

    // Seller
    const [sellerCivility, setSellerCivility] = useState<SellerCivility>('M_Mme');
    const [sellerName, setSellerName] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [sellerPhone, setSellerPhone] = useState('');
    const [sellerAddress, setSellerAddress] = useState('');

    // Property
    const [title, setTitle] = useState('');
    const [propertyType, setPropertyType] = useState<PropertyType>('maison');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('13330');
    const [city, setCity] = useState('Pélissanne');
    const [displayExactAddress] = useState(false);

    // Specs
    const [livingArea, setLivingArea] = useState<number>(120);
    const [carrezArea, setCarrezArea] = useState<number>(120);
    const [landArea, setLandArea] = useState<number>(650);
    const [roomsCount, setRoomsCount] = useState<number>(5);
    const [bedroomsCount, setBedroomsCount] = useState<number>(3);
    const [bathroomsCount, setBathroomsCount] = useState<number>(2);
    const [featuresInput, setFeaturesInput] = useState(
        'Piscine, Climatisation réversible, Garage, Terrasse, Jardin arboré'
    );

    // Diagnostics
    const [dpeValue, setDpeValue] = useState<number>(95);
    const [gesValue, setGesValue] = useState<number>(3);
    const [energyCostMin, setEnergyCostMin] = useState<number>(850);
    const [energyCostMax, setEnergyCostMax] = useState<number>(1200);

    // Financials
    const [priceNetSeller, setPriceNetSeller] = useState<number>(450000);
    const [agencyFeesPercentage, setAgencyFeesPercentage] = useState<number>(4.0);
    const [agencyFeesAmount, setAgencyFeesAmount] = useState<number>(18000);
    const [feesPaidBy, setFeesPaidBy] = useState<FeesPaidBy>('vendeur');

    // Description
    const [description, setDescription] = useState(
        `Exclusivité Nell'Immo Immobilier. Superbe propriété idéalement située dans un secteur recherché de ${city}, offrant de superbes prestations et un cadre de vie privilégié. Pièce de vie lumineuse, cuisine équipée, terrasse et jardin. À visiter sans tarder avec l'agence Nell'Immo.`
    );

    // Channels
    const [publishWebsite, setPublishWebsite] = useState(true);
    const [publishSeloger, setPublishSeloger] = useState(true);
    const [publishLeboncoin, setPublishLeboncoin] = useState(true);
    const [publishBienici, setPublishBienici] = useState(true);

    // Media
    const [videoUrl, setVideoUrl] = useState('');
    const [virtualTourUrl, setVirtualTourUrl] = useState('');
    const [images, setImages] = useState<PropertyImage[]>(DEFAULT_IMAGES);

    // Derived calculations
    const financials = calculateFinancials({
        priceNetSeller,
        agencyFeesAmount,
        agencyFeesPercentage,
        feesPaidBy
    });
    const dpeLetter = getDpeLetterFromValue(dpeValue);
    const gesLetter = getGesLetterFromValue(gesValue);

    // Smart Fast-Fill text parser
    const handleProcessFastFill = (text: string) => {
        if (!text.trim()) return;
        const patch = parseFastFillText(text);

        if (patch.priceNetSeller !== undefined) setPriceNetSeller(patch.priceNetSeller);
        if (patch.agencyFeesAmount !== undefined) setAgencyFeesAmount(patch.agencyFeesAmount);
        if (patch.livingArea !== undefined) setLivingArea(patch.livingArea);
        if (patch.carrezArea !== undefined) setCarrezArea(patch.carrezArea);
        if (patch.landArea !== undefined) setLandArea(patch.landArea);
        if (patch.roomsCount !== undefined) setRoomsCount(patch.roomsCount);
        if (patch.bedroomsCount !== undefined) setBedroomsCount(patch.bedroomsCount);
        if (patch.city !== undefined) setCity(patch.city);
        if (patch.postalCode !== undefined) setPostalCode(patch.postalCode);
        if (patch.propertyType !== undefined) setPropertyType(patch.propertyType);
        if (patch.description !== undefined) setDescription(patch.description);
        if (patch.title !== undefined) setTitle(patch.title);

        setAutoFillSuccess(true);
        setTimeout(() => {
            setShowAutoFillModal(false);
            setAutoFillSuccess(false);
        }, 800);
    };

    // AI Copywriting Generator
    const handleGenerateAiDescription = (mode: AiDescriptionMode) => {
        setIsAiGenerating(true);

        setTimeout(() => {
            const generated = generateAiDescription(mode, {
                propertyType,
                livingArea,
                city,
                postalCode,
                roomsCount,
                bedroomsCount,
                bathroomsCount,
                landArea,
                featuresInput,
                dpeLetter,
                dpeValue,
                gesLetter,
                gesValue,
                carrezArea,
                priceFai: financials.priceFai,
                feesPaidBy,
                nextMandateNumber
            });

            setDescription(generated);
            setIsAiGenerating(false);
        }, 500);
    };

    // Image helpers
    const handleAddImageByUrl = (url: string) => {
        setImages(addImagesByUrl(url, images));
    };

    const handleUploadFiles = (files: FileList) => {
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newImg: PropertyImage = {
                        id: `img-upload-${Date.now()}-${index}`,
                        property_id: '',
                        image_url: event.target.result as string,
                        display_order: images.length + index + 1,
                        is_cover: images.length === 0 && index === 0,
                        created_at: new Date().toISOString()
                    };
                    setImages((prev) => [...prev, newImg]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        setImages(removeImage(images, index));
    };

    const handleSetCover = (index: number) => {
        setImages(setCoverImage(images, index));
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const featuresList = featuresInput
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean);

        try {
            const created = await createProperty({
                mandate_type: mandateType,
                mandate_date: mandateDate,
                mandate_end_date: mandateEndDate,
                status: 'actif',
                seller_civility: sellerCivility,
                seller_name: sellerName || 'Mandant Nell\'Immo',
                seller_email: sellerEmail || 'vendeur@nellimmo.fr',
                seller_phone: sellerPhone || '07 55 68 61 09',
                seller_address: sellerAddress || `${city}, Pays Salonais`,
                title:
                    title ||
                    `${propertyType === 'maison' ? 'Villa' : 'Appartement'} ${roomsCount} pièces à ${city}`,
                property_type: propertyType,
                address: address || `Secteur ${city}`,
                postal_code: postalCode,
                city: city,
                display_exact_address: displayExactAddress,
                price_fai: financials.priceFai,
                price_net_seller: priceNetSeller,
                agency_fees_amount: financials.agencyFeesAmount,
                agency_fees_percentage: financials.agencyFeesPercentage,
                fees_paid_by: feesPaidBy,
                living_area: livingArea,
                carrez_area: carrezArea,
                land_area: landArea,
                rooms_count: roomsCount,
                bedrooms_count: bedroomsCount,
                bathrooms_count: bathroomsCount,
                dpe_value: dpeValue,
                dpe_letter: dpeLetter,
                ges_value: gesValue,
                ges_letter: gesLetter,
                dpe_reference_year: '2024',
                energy_cost_min: energyCostMin,
                energy_cost_max: energyCostMax,
                description: description,
                features: featuresList,
                publish_website: publishWebsite,
                publish_seloger: publishSeloger,
                publish_leboncoin: publishLeboncoin,
                publish_bienici: publishBienici,
                video_url: videoUrl || undefined,
                virtual_tour_url: virtualTourUrl || undefined,
                images: images
            });

            showToast(`Mandat N°${created.mandate_number} créé avec succès !`, 'success');
            router.push(`/cockpit/mandats/${created.id}`);
        } catch (err) {
            console.error('Erreur lors de la création du mandat :', err);
            showToast('Erreur lors de la création du mandat', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Derived
        nextMandateNumber,
        financials,
        dpeLetter,
        gesLetter,
        // Modal / async state
        showAutoFillModal,
        setShowAutoFillModal,
        autoFillSuccess,
        isAiGenerating,
        isSubmitting,
        // Mandate
        mandateType,
        setMandateType,
        mandateDate,
        setMandateDate,
        mandateEndDate,
        setMandateEndDate,
        // Seller
        sellerCivility,
        setSellerCivility,
        sellerName,
        setSellerName,
        sellerEmail,
        setSellerEmail,
        sellerPhone,
        setSellerPhone,
        sellerAddress,
        setSellerAddress,
        // Property
        title,
        setTitle,
        propertyType,
        setPropertyType,
        address,
        setAddress,
        postalCode,
        setPostalCode,
        city,
        setCity,
        // Specs
        livingArea,
        setLivingArea,
        carrezArea,
        setCarrezArea,
        landArea,
        setLandArea,
        roomsCount,
        setRoomsCount,
        bedroomsCount,
        setBedroomsCount,
        bathroomsCount,
        setBathroomsCount,
        featuresInput,
        setFeaturesInput,
        // Diagnostics
        dpeValue,
        setDpeValue,
        gesValue,
        setGesValue,
        energyCostMin,
        setEnergyCostMin,
        energyCostMax,
        setEnergyCostMax,
        // Financials
        priceNetSeller,
        setPriceNetSeller,
        agencyFeesPercentage,
        setAgencyFeesPercentage,
        agencyFeesAmount,
        setAgencyFeesAmount,
        feesPaidBy,
        setFeesPaidBy,
        // Description
        description,
        setDescription,
        // Channels
        publishWebsite,
        setPublishWebsite,
        publishSeloger,
        setPublishSeloger,
        publishLeboncoin,
        setPublishLeboncoin,
        publishBienici,
        setPublishBienici,
        // Media
        videoUrl,
        setVideoUrl,
        virtualTourUrl,
        setVirtualTourUrl,
        images,
        // Handlers
        handleProcessFastFill,
        handleGenerateAiDescription,
        handleAddImageByUrl,
        handleUploadFiles,
        handleRemoveImage,
        handleSetCover,
        handleSubmit
    };
}
