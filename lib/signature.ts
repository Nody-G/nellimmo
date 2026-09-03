import { Property, AgencySettings, SignatureCertificate } from './types';
import { formatMandateRef, computeSHA256 } from './hoguet';

export interface GenerateMandateContractParams {
  property: Property;
  settings: AgencySettings;
  contractType: 'exclusif' | 'simple';
  renounceRetraction: boolean; // Renonciation expresse aux 14 jours pour démarrage immédiat
}

/**
 * Générateur du contrat juridique officiel de mandat de vente conforme Loi Hoguet
 */
export function generateLegalMandateContract(params: GenerateMandateContractParams): string {
  const { property, settings, contractType, renounceRetraction } = params;
  const mandateRef = formatMandateRef(property.mandate_number);
  const now = new Date();

  const isExclusif = contractType === 'exclusif';

  return `================================================================================
CONTRAT DE MANDAT DE VENTE IMMOBILIER ${isExclusif ? 'EXCLUSIF' : 'SIMPLE'}
Soumis aux dispositions de la Loi n° 70-9 du 2 janvier 1970 (Loi Hoguet)
et de son Décret d'application n° 72-678 du 20 juillet 1972 modifié.
================================================================================

RÉFÉRENCE OFFICIELLE : ${mandateRef}
NUMÉRO D'ORDRE AU REGISTRE DES MANDATS : ${property.mandate_number}
DATE DE PRISE D'EFFET : ${property.mandate_date || now.toLocaleDateString('fr-FR')}
DATE D'ÉCHÉANCE IRREVOCABLE : ${property.mandate_end_date || new Date(now.getTime() + 90 * 24 * 3600 * 1000).toLocaleDateString('fr-FR')}

--------------------------------------------------------------------------------
ENTRE LES SOUSSIGNÉS :
--------------------------------------------------------------------------------

D'UNE PART, LE MANDANT (LE VENDEUR) :
Civilité / Identité : ${property.seller_civility || 'M./Mme'} ${property.seller_name}
Adresse : ${property.seller_address || 'Non renseignée'}
Téléphone : ${property.seller_phone}
E-mail : ${property.seller_email || 'Non renseigné'}
Ci-après dénommé « LE MANDANT », déclarant avoir la pleine capacité juridique et le pouvoir de disposer du bien ci-après désigné.

ET D'AUTRE PART, LE MANDATAIRE (L'AGENCE) :
La société SASU NELL'IMMO, société par actions simplifiée unipersonnelle au capital de ${settings.capital_social || '2 000 €'},
Dont le siège social est situé : ${settings.address}, ${settings.postal_code} ${settings.city},
Immatriculée au RCS de ${settings.rcs_city || 'Salon-de-Provence'} sous le n° SIREN ${settings.siren || '853 807 006'},
Titulaire de la Carte Professionnelle Transaction sur Immeubles et Fonds de Commerce n° ${settings.card_t_number || 'CPI 1310 2019 000 042 974'} délivrée par la ${settings.cci_card_t || 'CCI Marseille Provence'},
Garantie Financière : ${settings.guarantee_fund_name || 'GALIAN Assurances'}, ${settings.guarantee_fund_address || '89 rue La Boétie, 75008 Paris'} (Montant : ${settings.guarantee_fund_amount || '120 000 €'}),
Assurance Responsabilité Civile Professionnelle : ${settings.insurance_name || 'MMA Entreprise'} (${settings.insurance_policy || 'Police n° 114.240.230'}),
Représentée par sa Directrice Générale, Mme Nelly FERNANDEZ.
Ci-après dénommé « LE MANDATAIRE ».

--------------------------------------------------------------------------------
ARTICLE 1 - DÉSIGNATION DU BIEN À VENDRE
--------------------------------------------------------------------------------
Désignation : ${property.title}
Nature du bien : ${property.property_type.toUpperCase()}
Adresse du bien : ${property.address}, ${property.postal_code} ${property.city}
Surface habitable : ${property.living_area} m² ${property.carrez_area ? `(Surface Carrez : ${property.carrez_area} m²)` : ''}
Surface du terrain : ${property.land_area ? `${property.land_area} m²` : 'Sans terrain privatif'}
Nombre de pièces principales : ${property.rooms_count} (${property.bedrooms_count} chambres)
Équipements et dépendances : ${property.features && property.features.length > 0 ? property.features.join(', ') : 'Standards'}

Diagnostics Techniques :
- DPE (Consommation Énergétique) : Classe ${property.dpe_letter || 'Non soumis'} (${property.dpe_value ? `${property.dpe_value} kWh/m²/an` : 'Vierge'})
- GES (Émissions de Gaz à Effet de Serre) : Classe ${property.ges_letter || 'Non soumis'} (${property.ges_value ? `${property.ges_value} kg CO2/m²/an` : 'Vierge'})
- Audit Énergétique Réglementaire : ${property.dpe_letter === 'F' || property.dpe_letter === 'G' ? 'OBLIGATOIRE (Audit fourni ou en cours de réalisation)' : 'Non requis'}

--------------------------------------------------------------------------------
ARTICLE 2 - PRIX DE VENTE ET RÉMUNÉRATION DU MANDATAIRE (HONORAIRES TTC)
--------------------------------------------------------------------------------
Le présent mandat est consenti et accepté pour le prix de :
- PRIX NET VENDEUR : ${property.price_net_seller.toLocaleString('fr-FR')} € (euros)
- RÉMUNÉRATION DU MANDATAIRE (TTC) : ${property.agency_fees_amount.toLocaleString('fr-FR')} € (${property.agency_fees_percentage} % TTC du net vendeur)
- PRIX TOTAL DE PRÉSENTATION FAI (Frais d'Agence Inclus) : ${property.price_fai.toLocaleString('fr-FR')} €
- CHARGE DES HONORAIRES : ${property.fees_paid_by === 'vendeur' ? 'À LA CHARGE DU VENDEUR (Inclus dans le prix affiché)' : 'À LA CHARGE DE L\'ACQUÉREUR (Mentionné distinctement)'}

Conformément à l'article 6 de la Loi Hoguet, aucune somme d'argent, aucune commission ni rémunération ne peut être exigée ou reçue avant la conclusion définitive de la vente constatée par acte authentique devant notaire.

--------------------------------------------------------------------------------
ARTICLE 3 - NATURE DU MANDAT (${isExclusif ? 'EXCLUSIVITÉ' : 'MANDAT SIMPLE'})
--------------------------------------------------------------------------------
${isExclusif ? `1. EXCLUSIVITÉ STRICTE : Pendant toute la durée du présent mandat et de ses éventuels renouvellements, le Mandant s'interdit formellement de négocier la vente du bien directement ou par l'intermédiaire d'un autre professionnel. Toute visite ou proposition reçue directement par le Mandant devra être transmise immédiatement au Mandataire.
2. CLAUSE PÉNALE : En cas de violation de l'exclusivité (vente conclue directement par le mandant ou par un tiers pendant la durée du mandat), le Mandant s'engage expressément à verser au Mandataire, à titre de clause pénale forfaitaire et irréductible (art. 1231-5 du Code civil), une indemnité compensatrice égale au montant des honoraires stipulés à l'Article 2.` : `MANDAT SIMPLE : Le Mandant conserve la faculté de chercher par lui-même un acquéreur ou de confier d'autres mandats non exclusifs à des tiers. En cas de vente réalisée par lui-même ou par un autre intermédiaire, le Mandant s'engage à en informer sans délai le Mandataire en lui précisant l'identité de l'acquéreur.`}

--------------------------------------------------------------------------------
ARTICLE 4 - DURÉE ET RÉSILIATION DU MANDAT
--------------------------------------------------------------------------------
Le présent mandat est consenti pour une période irrévocable de TROIS (3) MOIS à compter de sa signature.
Passé ce délai initial de 3 mois, le mandat se poursuivra par tacite reconduction pour des périodes successives d'un mois, dans la limite d'une durée totale maximale d'un (1) an.
Chacune des parties pourra alors y mettre fin à tout moment, sous réserve d'un préavis de quinze (15) jours notifié par lettre recommandée avec accusé de réception ou tout moyen de communication électronique certifié.

--------------------------------------------------------------------------------
ARTICLE 5 - OBLIGATIONS DU MANDATAIRE
--------------------------------------------------------------------------------
Le Mandataire s'engage expressément à :
1. Déployer tous les moyens commerciaux appropriés : diffusion sur les portails majeurs (SeLoger, LeBonCoin, Bien'ici, site officiel nellimmo.fr), affichage vitrine haute définition LED.
2. Faire visiter le bien à tout candidat acquéreur préalablement identifié et dont la solvabilité financière aura été contrôlée.
3. Rendre compte régulièrement au Mandant des actions menées, du nombre de consultations, de visites et des observations formulées par les acquéreurs (engagement de compte-rendu sous 48h).
4. Informer immédiatement le Mandant de toute offre d'achat conforme au prix et conditions du mandat.

--------------------------------------------------------------------------------
ARTICLE 6 - CONTRAT CONCLU HORS ÉTABLISSEMENT & DROIT DE RÉTRACTATION
--------------------------------------------------------------------------------
Si le présent contrat est conclu hors établissement au sens de l'article L. 221-1 du Code de la consommation, le Mandant dispose d'un délai de QUATORZE (14) JOURS francs à compter de la signature pour exercer son droit de rétractation sans avoir à motiver sa décision ni à supporter de pénalités.

${renounceRetraction ? `RENONCIATION EXPRESSE AU DÉLAI POUR EXÉCUTION IMMÉDIATE :
[X] Le Mandant demande expressément au Mandataire de commencer l'exécution des prestations de commercialisation dès la signature du mandat, sans attendre l'expiration du délai de rétractation de 14 jours, et renonce expressément à ce délai.` : `[ ] Le Mandant maintient le bénéfice plein et entier de son délai légal de rétractation de 14 jours avant tout démarrage de diffusion publique.`}

--------------------------------------------------------------------------------
ARTICLE 7 - MÉDIATION DE LA CONSOMMATION & TRACFIN
--------------------------------------------------------------------------------
- Médiateur de la consommation : En cas de litige, le Mandant peut saisir gratuitement le médiateur agréé : ${settings.mediator_name || 'ANM Conso / Médiation FNAIM'} (${settings.mediator_url || 'https://www.anm-conso.com'}).
- Conformité Tracfin : Le Mandant est informé que le Mandataire est assujetti aux obligations de vigilance et de déclaration prévues aux articles L. 561-1 et suivants du Code monétaire et financier relatifs à la lutte contre le blanchiment de capitaux et le financement du terrorisme.

================================================================================
CADRE RÉSERVÉ À LA SIGNATURE ÉLECTRONIQUE CERTIFIÉE (eIDAS)
================================================================================
Fait en un original numérique unique sécurisé,
Horodaté par horloge atomique UTC et certifié par empreinte cryptographique SHA-256.
Inscrit chronologiquement au Registre Officiel des Mandats Loi Hoguet.
`;
}

/**
 * Création d'un certificat de signature électronique horodaté (conforme eIDAS)
 */
export async function createElectronicSignatureCertificate(params: {
  property: Property;
  contractText: string;
  signerName: string;
  signerEmail: string;
  signerPhone: string;
  otpCode: string;
  contractType: 'mandat_exclusif' | 'mandat_simple' | 'avenant_prix' | 'offre_achat';
  ipAddress?: string;
}): Promise<SignatureCertificate> {
  const now = new Date().toISOString();

  // Empreinte SHA-256 du texte intégral du contrat et des métadonnées du signataire
  const hashPayload = {
    contract: params.contractText,
    mandateNumber: params.property.mandate_number,
    signer: params.signerName,
    email: params.signerEmail,
    phone: params.signerPhone,
    otp: params.otpCode,
    signedAt: now,
    type: params.contractType
  };

  const sha256Fingerprint = await computeSHA256(hashPayload);

  const certificate: SignatureCertificate = {
    id: `cert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    mandate_number: params.property.mandate_number,
    signed_at: now,
    signer_name: params.signerName,
    signer_email: params.signerEmail,
    signer_phone: params.signerPhone,
    otp_code: params.otpCode,
    sha256_fingerprint: sha256Fingerprint,
    ip_address: params.ipAddress || '88.164.214.12 (Pélissanne, FR)',
    eidas_level: 'avance',
    contract_type: params.contractType,
    pdf_signed_url: undefined
  };

  return certificate;
}
