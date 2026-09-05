export interface HelpStep {
  number: number;
  title: string;
  description: string;
  tips?: string;
  proTip?: string;
}

export interface ConcreteExample {
  title: string;
  location: string;
  context: string;
  solution: string;
  outcome: string;
  keyFigures?: { label: string; value: string }[];
}

export interface LegalAlert {
  type: 'danger' | 'warning' | 'info';
  title: string;
  lawReference?: string;
  content: string;
}

export interface ReadyToUseScript {
  id: string;
  title: string;
  channel: 'WhatsApp' | 'SMS' | 'Email' | 'Téléphone';
  recipient: string;
  text: string;
}

export interface QuickFaq {
  question: string;
  answer: string;
}

export interface HelpGuide {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: 'mandats' | 'dvf' | 'pige' | 'acquereurs' | 'visites' | 'vendeurs' | 'transactions' | 'vitrine' | 'redacteur' | 'diffusion' | 'organisation' | 'hektor';
  categoryLabel: string;
  badge?: string;
  readTimeMinutes: number;
  toolRoute: string;
  toolLabel: string;
  summary: string;
  objective: string;
  prerequisites: string[];
  steps: HelpStep[];
  concreteExample: ConcreteExample;
  legalAlerts: LegalAlert[];
  scripts: ReadyToUseScript[];
  faqs: QuickFaq[];
  tags: string[];
}

export const HELP_CATEGORIES = [
  { id: 'all', label: 'Tous les guides' },
  { id: 'mandats', label: 'Mandats & Juridique' },
  { id: 'dvf', label: 'Avis de Valeur DVF' },
  { id: 'pige', label: 'Pige & Prospection' },
  { id: 'acquereurs', label: 'Acquéreurs & Matching' },
  { id: 'visites', label: 'Visites & Émargement' },
  { id: 'vendeurs', label: 'Comptes-Rendus Vendeurs' },
  { id: 'transactions', label: 'Pipeline Notaires & Ventes' },
  { id: 'vitrine', label: 'Affiches Vitrine LED' },
  { id: 'redacteur', label: 'Studio Rédaction IA' },
  { id: 'diffusion', label: 'Multidiffusion Portails' },
  { id: 'organisation', label: 'Clés, Panneaux & Bourse' },
  { id: 'hektor', label: 'Import & Migration Hektor' },
] as const;

export const HELP_GUIDES: HelpGuide[] = [
  // -------------------------------------------------------------
  // GUIDE 1 : MANDATS & REGISTRE DGCCRF
  // -------------------------------------------------------------
  {
    id: 'guide-mandats',
    slug: 'creer-mandat-loi-hoguet-registre-dgccrf',
    title: 'Créer un Mandat Conforme Loi Hoguet & Scellement Cryptographique',
    shortTitle: 'Mandats & Registre DGCCRF',
    category: 'mandats',
    categoryLabel: 'Mandats & Juridique',
    badge: 'Légal & Vital',
    readTimeMinutes: 7,
    toolRoute: '/cockpit/mandats/nouveau',
    toolLabel: 'Créer un Mandat',
    summary: 'Procédure complète pour saisir un mandat sans erreur, générer le numéro d\'ordre officiel séquentiel, calculer les honoraires selon le barème de la SASU Nell\'Immo et sceller l\'empreinte SHA-256 au Registre DGCCRF.',
    objective: 'Garantir la validité juridique absolue du mandat de vente face aux tribunaux et lors d\'un contrôle DGCCRF, tout en évitant toute contestation d\'honoraires par l\'acquéreur ou le vendeur.',
    prerequisites: [
      'Titre de propriété ou attestation notariée de propriété',
      'Pièce d\'identité en cours de validité de tous les propriétaires mandants (ou Kbis si SCI)',
      'Dossier de Diagnostics Techniques (DDT) incluant le DPE avec date de validité',
      'Taxe foncière de l\'année précédente (pour vérifier le montant exact à communiquer)',
      'Livret de famille ou jugement de divorce si séparation en cours'
    ],
    steps: [
      {
        number: 1,
        title: 'Ouvrir le formulaire de Saisie Express Intelligente',
        description: 'Rendez-vous sur "Nouveau Mandat". Vous pouvez soit saisir les champs un à un, soit coller un descriptif brut dans le champ d\'analyse intelligente : le moteur détecte automatiquement la surface, le nombre de pièces, le prix et les équipements.',
        tips: 'Vérifiez toujours que l\'adresse correspond exactement à celle figurant sur l\'acte de propriété (numéro de parcelle cadastrale si disponible).'
      },
      {
        number: 2,
        title: 'Déterminer le type de mandat (Exclusif vs Simple)',
        description: 'Sélectionnez "Mandat Exclusif" (recommandé pour concentrer vos efforts marketing) ou "Mandat Simple". Précisez la date de début et la durée irrévocable (3 mois par défaut).',
        proTip: 'Pour un mandat hors établissement (signé au domicile du vendeur ou par signature électronique), cochez impérativement la clause de renonciation expresse au délai de rétractation de 14 jours si le vendeur exige une parution immédiate de l\'annonce.'
      },
      {
        number: 3,
        title: 'Calculer le prix FAI et les honoraires selon le barème officiel',
        description: 'Indiquez le net vendeur. Cockpit calcule automatiquement les honoraires TTC selon le barème affiché de l\'agence (SASU Nell\'Immo). Spécifiez qui a la charge des honoraires (Acquéreur ou Vendeur).',
        tips: 'Mentionner la charge acquéreur permet à l\'acheteur de payer des frais de notaire réduits calculés uniquement sur le net vendeur.'
      },
      {
        number: 4,
        title: 'Renseigner le DPE & la classe climat (Loi Climat 2024)',
        description: 'Saisissez la lettre DPE (A à G), la lettre GES et les montants d\'estimation des coûts annuels d\'énergie. Ne laissez JAMAIS le DPE vierge : depuis 2021, la mention "DPE vierge" est strictement interdite sur les annonces.',
        proTip: 'Si le bien est classé F ou G (passoire thermique), un Audit Énergétique Réglementaire est obligatoire avant toute signature de promesse de vente.'
      },
      {
        number: 5,
        title: 'Valider et sceller au Registre Numérique DGCCRF',
        description: 'Cliquez sur "Enregistrer le Mandat". Le système lui attribue immédiatement le numéro d\'ordre chronologique suivant (ex: NEL-2026-042), calcule l\'empreinte cryptographique SHA-256 et consigne l\'entrée dans le registre scellé inviolable.',
        tips: 'Consultez la section "Registre DGCCRF" pour visualiser la preuve d\'intégrité mathématique.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Villa contemporaine aux Enjouvènes à Pélissanne',
      location: 'Pélissanne (13330) — Quartier des Enjouvènes',
      context: 'M. et Mme Martinez vendent leur villa T5 de 135 m² sur 650 m² de terrain arboré avec piscine. Ils souhaitent 450 000 € net vendeur et acceptent de confier l\'exclusivité à Nelly sous condition d\'un plan marketing de prestige (photos HD, visite vidéo, diffusion LeBonCoin/SeLoger en tête de liste).',
      solution: 'Nelly ouvre le Cockpit, crée le mandat exclusif avec honoraires de 15 000 € TTC charge acquéreur (Prix FAI : 465 000 € soit 3,33% d\'honoraires). Elle intègre le DPE B (consommation 85 kWh/m²/an) et génère le numéro officiel NEL-2026-018. Les vendeurs signent le mandat sur tablette au salon avec renonciation aux 14 jours de rétractation.',
      outcome: 'Le mandat est scellé au registre à 18h42. À 19h00, la fiche vitrine et l\'annonce sont prêtes, le bien est diffusé sur SeLoger le soir même sans risque légal.',
      keyFigures: [
        { label: 'Prix Net Vendeur', value: '450 000 €' },
        { label: 'Honoraires TTC', value: '15 000 €' },
        { label: 'Prix FAI Affiché', value: '465 000 €' },
        { label: 'Mandat n°', value: 'NEL-2026-018' }
      ]
    },
    legalAlerts: [
      {
        type: 'danger',
        title: 'Nullité absolue du mandat sans numéro préalable',
        lawReference: 'Loi Hoguet n° 70-9 du 2 janvier 1970 — Art. 6 / Décret n° 72-678 Art. 65',
        content: 'Un mandat signé sans que le numéro du registre des mandats n\'y soit préalablement reporté est frappé de nullité absolue. L\'agence perd définitivement son droit à honoraires, même si l\'acquéreur a été trouvé par ses soins !'
      },
      {
        type: 'warning',
        title: 'Démarchage à domicile & Rétractation 14 jours',
        lawReference: 'Code de la consommation — Art. L. 221-18 et suivants',
        content: 'Si vous signez le mandat au domicile du vendeur (mandat hors établissement), le vendeur bénéficie de 14 jours de rétractation. Pour pouvoir commercialiser le bien dès le lendemain, faites impérativement cocher la case : « Je renonce expressément au délai de rétractation pour que la commercialisation démarre sans délai ».'
      }
    ],
    scripts: [
      {
        id: 'script-mandat-exclusif',
        title: 'Pitch d\'exclusivité rassurant pour le vendeur',
        channel: 'Téléphone',
        recipient: 'Propriétaire vendeur hésitant entre simple et exclusif',
        text: `« M. Martinez, je comprends tout à fait votre hésitation. On pense souvent qu'en confiant son bien à 3 agences, on multiplie par 3 ses chances de vendre. En réalité, sur SeLoger, votre maison apparaît 3 fois avec des prix différents, des photos de qualités inégales, et les acheteurs se disent : "Ce bien ne se vend pas, on va pouvoir le négocier fortement". 
Avec mon mandat exclusif Nell'Immo, vous avez une interlocutrice unique et dédiée, un plan marketing de premier ordre (photos HD, affiche vitrine LED grand format, mise en avant portails) et je protège votre prix de vente. Accordez-moi 60 jours d'exclusivité : si vous n'êtes pas pleinement satisfait de mon travail, vous reprenez votre entière liberté. »`
      },
      {
        id: 'script-sms-signature-mandat',
        title: 'SMS confirmation après signature du mandat',
        channel: 'WhatsApp',
        recipient: 'Vendeurs mandants',
        text: `Bonjour M. et Mme Martinez, c'est Nelly de l'agence Nell'Immo. Un grand merci pour votre confiance ce matin ! Votre mandat n° NEL-2026-018 est officiellement enregistré. Notre photographe et la préparation de l'annonce sont déjà lancés. Vous pouvez suivre chaque étape en temps réel sur votre espace vendeur dédié : [Lien Espace Vendeur]. À très vite pour le lancement !`
      }
    ],
    faqs: [
      {
        question: 'Puis-je modifier le prix du mandat sans refaire un contrat ?',
        answer: 'Non, vous ne devez jamais raturer le mandat original. Dans le Cockpit, utilisez le bouton "Créer un Avenant de Baisse de Prix" sur la fiche du bien. Cet avenant reçoit un sous-numéro officiel (ex: NEL-2026-018-AV1) et doit être signé par les deux parties.'
      },
      {
        question: 'Que faire si l\'un des deux conjoints est absent lors de la signature ?',
        answer: 'Si le bien est le logement de la famille (même s\'il appartient à un seul des époux) ou s\'il est en indivision, la signature des deux conjoints est obligatoire sous peine de nullité. Envoyez-lui le lien de signature électronique par SMS via le module "Signatures".'
      }
    ],
    tags: ['Loi Hoguet', 'Registre DGCCRF', 'Mandat Exclusif', 'Honoraires', 'SHA-256', 'DPE', 'ALUR']
  },

  // -------------------------------------------------------------
  // GUIDE 2 : AVIS DE VALEUR & DVF NOTAIRES
  // -------------------------------------------------------------
  {
    id: 'guide-dvf',
    slug: 'realiser-avis-de-valeur-dvf-notaires',
    title: 'Réaliser un Avis de Valeur Incontestable avec DVF Notaires',
    shortTitle: 'Avis de Valeur DVF',
    category: 'dvf',
    categoryLabel: 'Avis de Valeur DVF',
    badge: 'Expertise & Mandats',
    readTimeMinutes: 6,
    toolRoute: '/cockpit/avis-de-valeur',
    toolLabel: 'Avis de Valeur DVF',
    summary: 'Méthodologie pour extraire les transactions notariées réelles DGFiP à moins de 500m, neutraliser les biens atypiques, appliquer la grille de pondération provençale et sortir un dossier d\'estimation 8 pages percutant.',
    objective: 'Démontrer au propriétaire avec des actes notariés authentiques la réalité du marché, briser le biais émotionnel de surévaluation et décrocher un mandat exclusif au juste prix.',
    prerequisites: [
      'Adresse précise du bien ou références cadastrales',
      'Surface habitable Carrez ou utile vérifiée',
      'Surface de terrain et dépendances (garage, sous-sol, dépendance)',
      'État général : date des travaux récents, toiture, isolation, menuiseries, piscine'
    ],
    steps: [
      {
        number: 1,
        title: 'Lancer la géolocalisation DVF dans Cockpit',
        description: 'Dans le module "Avis de Valeur DVF", saisissez l\'adresse du bien ou la commune (ex: Pélissanne, Lambesc, Salon-de-Provence). Le Cockpit interroge la base des données de valeurs foncières notariales (DGFiP) et cartographie toutes les ventes réelles des 3 dernières années dans un rayon de 500 mètres.',
        tips: 'Zoomez sur le même quartier ou la même typologie (lotissement vs centre ancien).'
      },
      {
        number: 2,
        title: 'Filtrer et écarter les transactions biaisées',
        description: 'Examinez la liste des comparables. Écartez immédiatement les mutations à prix dérisoire (ventes en famille, viagers) ou les ventes en l\'état de ruine qui fausseraient la moyenne.',
        proTip: 'Conservez 4 à 6 transactions très similaires : même nombre de pièces, surface comparable à +/- 15%, et présence d\'un extérieur.'
      },
      {
        number: 3,
        title: 'Appliquer la grille de pondération provençale',
        description: 'Ajustez le prix au m² moyen selon les atouts et faiblesses du bien :',
        tips: '+8% à +12% pour piscine enterrée maçonnée et jardin arboré sans vis-à-vis ; +5% pour climatisation réversible gainée ; -10% si toiture à refaire ou simple vitrage ; -5% si absence de stationnement privatif en centre-ville.'
      },
      {
        number: 4,
        title: 'Définir la fourchette basse, médiane et haute',
        description: 'Définissez la fourchette d\'estimation (ex : 330 000 € prix d\'attaque coup de poing / 345 000 € prix cible d\'expertise / 360 000 € prix plafond à ne pas dépasser pour ne pas brûler le bien).',
        proTip: 'Présentez toujours la fourchette en expliquant que le prix cible permettra de vendre sous 45 jours, tandis que le prix plafond risque d\'allonger le délai à plus de 6 mois.'
      },
      {
        number: 5,
        title: 'Générer le Dossier d\'Estimation 8 pages PDF',
        description: 'Cliquez sur "Générer le Dossier PDF". Cockpit compile la page de garde aux armoiries de Nell\'Immo, l\'analyse du quartier, la carte satellite des ventes DVF, le tableau comparatif des actes authentiques et vos conclusions chiffrées.',
        tips: 'Imprimez le dossier en couleur avec reliure ou envoyez-le sur tablette au propriétaire après votre rendez-vous R1.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Maison de village rénovée à Lambesc',
      location: 'Lambesc (13410) — Rue du Théâtre',
      context: 'Mme Gauthier hérite d\'une maison de village de 92 m² habitables sur 3 niveaux avec tropézienne de 12 m². Elle a vu des annonces à 330 000 € et espère en tirer 320 000 € net vendeur.',
      solution: 'Nelly lance le module DVF à Lambesc dans un rayon de 300m. Les 5 dernières ventes de maisons similaires sans garage se sont négociées chez le notaire entre 2 750 €/m² et 3 100 €/m² (soit entre 253 000 € et 285 000 €). La tropézienne apporte une plus-value de +15 000 €.',
      outcome: 'Nelly présente le dossier DVF avec les 5 actes réels notariés. Mme Gauthier comprend que le marché plafonne à 290 000 €. Elle signe le mandat exclusif à 289 000 € FAI. Offre au prix reçue en 18 jours !',
      keyFigures: [
        { label: 'Prix espéré vendeur', value: '320 000 €' },
        { label: 'Prix moyen notaires DVF', value: '2 950 €/m²' },
        { label: 'Prix exclusif signé', value: '289 000 € FAI' },
        { label: 'Délai de vente', value: '18 jours' }
      ]
    },
    legalAlerts: [
      {
        type: 'warning',
        title: 'Avis de Valeur vs Expertise Judiciaire',
        lawReference: 'Charte de l\'Expertise en Évaluation Immobilière',
        content: 'Un avis de valeur délivré par un agent immobilier n\'est pas une expertise judiciaire assermentée. Veillez à ce que la mention légale "Avis de valeur vénale commerciale non opposable aux administrations fiscales" apparaisse en bas de chaque page du dossier généré.'
      }
    ],
    scripts: [
      {
        id: 'script-presentation-dvf',
        title: 'Argumentaire DVF face au vendeur qui surestime',
        channel: 'Téléphone',
        recipient: 'Vendeur qui compare avec les annonces internet',
        text: `« Mme Gauthier, je comprends parfaitement que vous ayez vu des annonces sur LeBonCoin à 330 000 €. Mais attention : ce que vous voyez sur internet, ce sont les prix demandés par des vendeurs qui ne vendent pas encore ! 
Dans ce dossier que je vous remets, ce ne sont pas des souhaits, ce sont les actes authentiques réels enregistrés chez les notaires au cours des 12 derniers mois dans votre rue. Vos acheteurs aujourd'hui ont accès à ces données et les banques refusent de prêter au-dessus de la valeur vénale réelle. En nous positionnant à 289 000 €, nous serons le bien le plus attractif du village dès la première semaine. »`
      }
    ],
    faqs: [
      {
        question: 'D\'où proviennent les données DVF dans Cockpit ?',
        answer: 'Elles sont issues de la base officielle des Demandes de Valeurs Foncières (DGFiP / Ministère des Finances), actualisée deux fois par an à partir des enregistrements fiscaux des actes de vente des notaires de France.'
      },
      {
        question: 'Comment justifier les honoraires de l\'agence dans l\'estimation ?',
        answer: 'Montrez au propriétaire que votre estimation DVF intègre la sécurisation du net vendeur : sans agence, les acheteurs négocient en moyenne 8% à 10% plus bas. Vos honoraires sont largement compensés par l\'absence de baisse agressive.'
      }
    ],
    tags: ['Avis de Valeur', 'DVF Notaires', 'Prix au m²', 'Estimation', 'Étude comparative', 'Pélissanne', 'Lambesc']
  },

  // -------------------------------------------------------------
  // GUIDE 3 : RADAR DE PIGE PAP / LEBONCOIN
  // -------------------------------------------------------------
  {
    id: 'guide-pige',
    slug: 'pige-immobiliere-prospection-particuliers-pap-leboncoin',
    title: 'Convertir les Vendeurs PAP & LeBonCoin en Mandats Exclusifs',
    shortTitle: 'Radar Pige & Prospection',
    category: 'pige',
    categoryLabel: 'Pige & Prospection',
    badge: 'Conquête Terrain',
    readTimeMinutes: 8,
    toolRoute: '/cockpit/pige',
    toolLabel: 'Radar de Pige',
    summary: 'Comment détecter les annonces de particuliers du Pays Salonais, identifier les biens en "fatigue commerciale" (baisses de prix répétées, 45+ jours en ligne) et utiliser le sparring-partner d\'objections pour décrocher le RDV d\'estimation.',
    objective: 'Capter 2 à 3 nouveaux mandats exclusifs par mois sans passer pour un démarcheur agressif, en apportant une vraie valeur d\'expertise dès les 60 premières secondes d\'appel.',
    prerequisites: [
      'Numéro de téléphone portable direct du vendeur particulier',
      'Visualisation des photos de son annonce pour repérer les défauts de mise en valeur',
      'Historique DVF des ventes de son quartier sous les yeux dans Cockpit'
    ],
    steps: [
      {
        number: 1,
        title: 'Consulter le Radar de Prospection du Pays Salonais',
        description: 'Ouvrez le module "Radar Pige & Prospection PAP". Filtrez sur votre secteur de prédilection (Pélissanne, Salon-de-Provence, Aurons, Lançon, La Barben, Lambesc).',
        tips: 'Priorisez les annonces avec le badge "Fatigue Marché" (orange ou rouge) : ce sont des particuliers qui ont commencé seuls il y a 30 à 60 jours et qui constatent que les visites n\'aboutissent pas.'
      },
      {
        number: 2,
        title: 'Analyser l\'écart de prix avec les ventes DVF réelles',
        description: 'Sur la fiche prospect, Cockpit calcule instantanément le prix au m² demandé par le particulier et le confronte à la moyenne notariée du quartier. Vous connaissez le talon d\'Achille de son dossier avant même de composer son numéro.',
        proTip: 'Si le particulier a déjà baissé son prix de 15 000 € ou 20 000 €, il est psychologiquement demandeur d\'une solution professionnelle.'
      },
      {
        number: 3,
        title: 'Activer le Sparring-Partner d\'Objections',
        description: 'Avant de téléphoner, cliquez sur "Sparring-Partner". Vous y trouverez les 4 objections reines et les répliques éprouvées de Nelly Fernandez :',
        tips: '1. "Je ne veux pas d\'agence" | 2. "Vos honoraires sont trop élevés" | 3. "J\'ai déjà 3 agences en mandat simple" | 4. "J\'ai le temps, je teste le marché".'
      },
      {
        number: 4,
        title: 'Appeler avec la méthode de l\'Acheteur Potentiel & Sécurisation',
        description: 'Ne tentez JAMAIS de lui faire signer un mandat au téléphone ! L\'unique objectif de l\'appel est d\'obtenir un rendez-vous physique d\'estimation chez lui (« Je passe 15 minutes découvrir votre bien pour voir s\'il correspond à mes 2 clients en recherche active »).',
        proTip: 'Terminez toujours par une alternative fermée : « Seriez-vous plutôt disponible mardi à 17h30 ou mercredi en fin de matinée ? »'
      },
      {
        number: 5,
        title: 'Mettre à jour le statut du prospect dans le carnet',
        description: 'Après l\'appel, classez le prospect en 1 clic : "RDV Pris", "À rappeler dans 15 jours", "Refus", "Mandat Obtenu". Si le RDV est pris, cliquez sur "Convertir en Mandat" pour transférer automatiquement toutes les coordonnées dans le registre.',
        tips: 'Le bouton "WhatsApp de relance" permet d\'envoyer un message courtois en un tap si le vendeur ne répond pas au téléphone.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Maison contemporaine à Aurons en vente depuis 55 jours',
      location: 'Aurons (13121) — Chemin des Costes',
      context: 'M. Roche a mis sa villa 140 m² à 495 000 € sur LeBonCoin en déclarant "Agences s\'abstenir". Après 55 jours, il a eu 12 visites de curieux, une offre orale refusée et aucun dossier bancaire solide.',
      solution: 'Nelly consulte la pige dans Cockpit. Le bien est surévalué d\'environ 35 000 € par rapport aux ventes DVF d\'Aurons. Nelly l\'appelle en utilisant le script d\'objection "Curieux du dimanche vs Acheteurs qualifiés". Elle ne critique pas son prix, mais lui propose de venir avec sa fiche de rapprochement acquéreurs.',
      outcome: 'Rendez-vous fixé le lendemain à 18h. Sur place, Nelly lui montre l\'estimation DVF et les 2 profils d\'acquéreurs finançables de son CRM. M. Roche signe un mandat exclusif à 469 000 € FAI.',
      keyFigures: [
        { label: 'Jours en ligne PAP', value: '55 jours' },
        { label: 'Prix initial LBC', value: '495 000 €' },
        { label: 'Prix mandat exclusif signé', value: '469 000 €' },
        { label: 'Visite qualifiée organisée', value: 'J+3' }
      ]
    },
    legalAlerts: [
      {
        type: 'danger',
        title: 'Interdiction de démarchage Bloctel & Heures légales',
        lawReference: 'Décret n° 2022-1313 du 13 octobre 2022 relatif aux jours et horaires de démarchage',
        content: 'Le démarchage téléphonique professionnel auprès des particuliers n\'est autorisé que du lundi au vendredi, de 10h00 à 13h00 et de 14h00 à 20h00. Il est strictement interdit le samedi, le dimanche et les jours fériés.'
      }
    ],
    scripts: [
      {
        id: 'script-pige-accroche',
        title: 'Accroche téléphonique infaillible de Nelly',
        channel: 'Téléphone',
        recipient: 'Particulier vendeur sur LeBonCoin',
        text: `« Bonjour Monsieur Roche, c'est Nelly Fernandez de l'agence Nell'Immo à Pélissanne. Je vous appelle directement au sujet de votre belle maison à Aurons que j'ai remarquée ce matin.
Rassurez-vous, je ne vous appelle pas pour vous réciter un discours d'agence classique. J'ai actuellement en fichier 2 couples de cadres en recherche active avec accords bancaires préalables validés qui recherchent exactement ce type de maison avec 4 chambres sur Aurons ou Pélissanne.
Avant de leur en parler, je ne veux pas leur décrire votre maison à l'aveugle. Seriez-vous d'accord pour que je passe 15 petites minutes chez vous simplement pour découvrir les lieux ? Êtes-vous plutôt disponible demain à 17h30 ou jeudi matin ? »`
      },
      {
        id: 'script-sms-si-repondeur',
        title: 'SMS doux si le propriétaire ne décroche pas',
        channel: 'SMS',
        recipient: 'Propriétaire qui n\'a pas répondu',
        text: `Bonjour, c'est Nelly Fernandez de l'agence Nell'Immo (Pélissanne). J'ai vu votre annonce pour votre maison à [Ville]. J'ai 2 acquéreurs avec dossier bancaire validé en recherche sur votre secteur. N'hésitez pas à me rappeler au 07 55 68 61 09 si vous acceptez que je leur en touche deux mots. Très belle journée à vous !`
      }
    ],
    faqs: [
      {
        question: 'Que répondre si le vendeur dit "J\'ai dit agences s\'abstenir" ?',
        answer: 'Répondez avec le sourire : « Je le respecte tout à fait, et si j\'étais vendeur particulier, j\'écrirais la même chose pour éviter les 20 appels d\'agences qui n\'ont aucun client ! Ma démarche est différente : j\'ai des acquéreurs solvables en chair et en os qui attendent. Si je viens seule avec un acheteur qualifié, refusez-vous d\'étudier une offre ferme ? »'
      }
    ],
    tags: ['Pige PAP', 'LeBonCoin', 'Prospection', 'Objections', 'Bloctel', 'Téléphone', 'Pays Salonais']
  },

  // -------------------------------------------------------------
  // GUIDE 4 : CRM ACQUÉREURS & MATCHING
  // -------------------------------------------------------------
  {
    id: 'guide-acquereurs',
    slug: 'crm-acquereurs-matching-alertes-whatsapp',
    title: 'Gérer son CRM Acquéreurs & Déclencher le Matching Automatique',
    shortTitle: 'Acquéreurs & Matching',
    category: 'acquereurs',
    categoryLabel: 'Acquéreurs & Matching',
    badge: 'Ventes Rapides',
    readTimeMinutes: 5,
    toolRoute: '/cockpit/acquereurs',
    toolLabel: 'CRM Acquéreurs',
    summary: 'Comment qualifier les acquéreurs (validation du financement, simulation courtier), exploiter l\'algorithme de compatibilité 0-100% avec vos mandats et envoyer des alertes WhatsApp personnalisées d\'un simple clic.',
    objective: 'Vendre vos mandats exclusifs en avant-première "Off-Market" avant même la publication sur SeLoger, et prouver aux vendeurs la puissance de votre portefeuille clients.',
    prerequisites: [
      'Nom, prénom, numéro de téléphone portable et email de l\'acquéreur',
      'Critères de recherche : communes cibles, budget maximal tout compris, surface minimale, nombre de chambres',
      'Attestation de faisabilité financière ou accord de principe de banque / courtier'
    ],
    steps: [
      {
        number: 1,
        title: 'Créer une Fiche Acquéreur ultra-qualifiée',
        description: 'Cliquez sur "Nouvel Acquéreur". Indiquez ses coordonnées, son budget maximum net, ses villes prioritaires (ex: Pélissanne, Lançon, Lambesc, Salon) et ses critères obligatoires (jardin, garage, plain-pied).',
        tips: 'Indiquez impérativement le statut de financement : "Financement Comptant", "Accord Bancaire Validé", "Étude Courtier en cours" ou "En attente". Ne perdez pas de temps à faire visiter des biens à un profil sans plan de financement.'
      },
      {
        number: 2,
        title: 'Consulter le Score de Rapprochement (Matching)',
        description: 'L\'algorithme de Cockpit compare en temps réel chaque acquéreur avec l\'ensemble de vos mandats actifs sur 7 critères fondamentaux (Budget, Surface, Pièces, Type, Ville, Jardin, Garage) et calcule un score de 0 à 100%.',
        proTip: 'Un score supérieur à 85% signifie que le bien correspond à toutes les exigences majeures. Vous avez un coup de cœur potentiel sous les yeux !'
      },
      {
        number: 3,
        title: 'Déclencher l\'Alerte WhatsApp en 1 clic',
        description: 'Depuis la liste de matching, cliquez sur l\'icône WhatsApp à côté du nom de l\'acquéreur. Cockpit pré-remplit instantanément un message WhatsApp personnalisé contenant le prénom du client, les atouts de la maison et le lien vers la fiche de présentation.',
        tips: 'Envoyer les alertes en priorité à vos 3 meilleurs profils 24 heures avant la diffusion grand public sur les portails pour créer un sentiment d\'exclusivité VIP.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Vente Off-Market d\'une villa à Lançon-Provence',
      location: 'Lançon-Provence (13680)',
      context: 'Nelly rentre en mandat exclusif une maison T4 de 105 m² avec garage et jardin au calme à 375 000 €. Avant même de la publier sur SeLoger, elle consulte son module Acquéreurs.',
      solution: 'Le matching ressort en tête M. et Mme Laurent (score 95%) : budget de 390 000 € validé par le Crédit Agricole Salon, recherchent précisément une maison avec 3 chambres à Lançon ou Pélissanne. Nelly clique sur l\'alerte WhatsApp.',
      outcome: 'Visite calée le lendemain à 14h. Coup de cœur immédiat. Offre d\'achat au prix acceptée à 17h, sans avoir dépensé 1 euro de diffusion publicitaire !',
      keyFigures: [
        { label: 'Score Matching', value: '95 %' },
        { label: 'Délai première visite', value: '24 heures' },
        { label: 'Offre au prix FAI', value: '375 000 €' },
        { label: 'Coût de diffusion', value: '0 €' }
      ]
    },
    legalAlerts: [
      {
        type: 'info',
        title: 'Conformité RGPD & Conservation des données',
        lawReference: 'Règlement Général sur la Protection des Données (RGPD)',
        content: 'Les coordonnées et données de recherche des acquéreurs ne doivent être conservées qu\'avec leur accord tacite ou explicite et doivent être anonymisées ou purgées au bout de 3 ans sans contact actif.'
      }
    ],
    scripts: [
      {
        id: 'script-whatsapp-matching',
        title: 'Alerte WhatsApp VIP Avant-Première',
        channel: 'WhatsApp',
        recipient: 'Acquéreur chaud avec score > 85%',
        text: `Bonjour Thomas, c'est Nelly de l'agence Nell'Immo.
Je viens de rentrer en exclusivité une très jolie maison qui coche exactement vos critères de recherche sur [Ville] : [Surface] m², [Chambres] chambres, beau jardin clos et garage, au prix de [Prix] € FAI.
L'annonce n'est pas encore publiée sur SeLoger ni LeBonCoin : je voulais vous en faire profiter en avant-première !
Voici le lien pour découvrir les premières photos : [Lien Fiche].
Êtes-vous disponible demain en fin d'après-midi pour une première visite privilégiée ?`
      }
    ],
    faqs: [
      {
        question: 'Que faire si le client ne dispose pas encore de simulation financière ?',
        answer: 'Invitez-le courtoisement à rencontrer votre partenaire courtier ou sa banque avant la visite : « Pour ne pas risquer de passer à côté d\'un coup de cœur faute de réactivité, validons ensemble votre budget d\'enveloppe avec mon courtier partenaire en 24h ».'
      }
    ],
    tags: ['CRM Acquéreurs', 'Matching', 'Rapprochement', 'WhatsApp', 'Off-Market', 'Financement']
  },

  // -------------------------------------------------------------
  // GUIDE 5 : BONS DE VISITE & ÉMARGEMENT TACTILE
  // -------------------------------------------------------------
  {
    id: 'guide-visites',
    slug: 'bons-de-visite-electroniques-signature-tactile-sentiment',
    title: 'Bons de Visite Électroniques, Émargement Tactile & Débrief Vocal',
    shortTitle: 'Bons de Visite & Sentiment',
    category: 'visites',
    categoryLabel: 'Visites & Émargement',
    badge: 'Sécurité Juridique',
    readTimeMinutes: 6,
    toolRoute: '/cockpit/visites',
    toolLabel: 'Bons de Visite',
    summary: 'Comment faire signer le bon de visite directement sur l\'écran tactile de son smartphone ou de sa tablette avant d\'entrer sur le bien, enregistrer l\'horodatage certifié et dicter le débrief vocal dans la voiture.',
    objective: 'Protéger l\'agence contre le contournement par un acheteur indélicat (jurisprudence constante de la Cour de Cassation) et alimenter en temps réel le compte-rendu du vendeur mandant.',
    prerequisites: [
      'Smartphone ou tablette avec connexion 4G/5G',
      'Mandat de vente actif sélectionné',
      'Fiche acquéreur créée ou saisie rapide du nom et téléphone sur place'
    ],
    steps: [
      {
        number: 1,
        title: 'Créer le bon de visite à l\'arrivée au rendez-vous',
        description: 'Au point de rencontre devant le portail ou sur le parking, ouvrez Cockpit sur votre mobile et rendez-vous dans "Bons de Visite". Cliquez sur "Nouveau Bon de Visite", choisissez le bien et sélectionnez le nom du visiteur.',
        tips: 'Faites TOUJOURS signer le bon de visite AVANT d\'entrer dans la propriété, jamais à la fin ! Si la visite se passe mal ou si le client est pressé, il refusera de signer.'
      },
      {
        number: 2,
        title: 'Faire apposer la signature manuscrite sur l\'écran tactile',
        description: 'Tendez le smartphone ou la tablette à l\'acquéreur. Il trace sa signature directement avec le doigt ou un stylet sur le canevas numérique. Cliquez sur "Valider l\'émargement".',
        proTip: 'Le système horodate instantanément la signature en temps universel UTC, capture l\'empreinte IP et génère un bon de visite PDF scellé.'
      },
      {
        number: 3,
        title: 'Expliquer le rôle protecteur avec naturel',
        description: 'Ne présentez pas le bon de visite comme une marque de méfiance, mais comme une procédure d\'assurance obligatoire :',
        tips: '« C\'est le registre officiel d\'accès que le propriétaire et notre assurance nous imposent pour attester des personnes introduites dans les lieux. Un petit tracé du doigt ici, et nous entrons ! »'
      },
      {
        number: 4,
        title: 'Enregistrer le débrief vocal post-visite en voiture',
        description: 'Dès que le visiteur est parti, installez-vous dans votre voiture et cliquez sur le micro "Débrief Vocal / Dictée". Parlez naturellement pendant 45 secondes pour enregistrer vos ressentis :',
        proTip: '« Visite très positive pour M. et Mme Lefebvre. Coup de cœur pour le séjour cathédrale et le jardin. Point bloquant : les deux chambres d\'enfants sous pente qui paraissent un peu sombres. Ils étudient le coût pour poser deux Velux. Offre possible sous 48h. »'
      },
      {
        number: 5,
        title: 'Déclencher la notification vendeur en 1 tap',
        description: 'Le débrief est automatiquement structuré par le système. Un bouton vous propose d\'envoyer immédiatement un message WhatsApp de débriefing élégant au vendeur mandant.',
        tips: 'Le propriétaire est rassuré 5 minutes après le départ des visiteurs : zéro stress, professionnalisme perçu maximal !'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Tentative de contournement déjouée sur un Mas à La Barben',
      location: 'La Barben (13330)',
      context: 'M. V. visite un mas de 180 m² avec Nelly. Deux semaines plus tard, le propriétaire contacte Nelly pour résilier son mandat, prétendant vouloir vendre à son cousin. En réalité, M. V. a glissé un mot dans sa boîte aux lettres pour acheter sans frais d\'agence.',
      solution: 'Nelly extrait de Cockpit le Bon de Visite électronique signé sur écran tactile par M. V., horodaté à la seconde près avec certificat technique et adresse IP.',
      outcome: 'Nelly transmet le bon au notaire instrumentaire avec copie aux parties. L\'acheteur et le vendeur sont sommés de payer la commission d\'agence intégrale conformément à la clause pénale du mandat.',
      keyFigures: [
        { label: 'Commission préservée', value: '18 000 €' },
        { label: 'Horodatage preuve', value: 'Certifié UTC' },
        { label: 'Issue', value: 'Honoraires réglés chez le notaire' }
      ]
    },
    legalAlerts: [
      {
        type: 'danger',
        title: 'Valeur probante du bon de visite en justice',
        lawReference: 'Cour de Cassation — 1ère Chambre Civile, arrêts constants',
        content: 'Le bon de visite ne remplace pas le mandat, mais il constitue la preuve irréfutable de la mise en relation causale entre l\'acheteur et le bien par l\'intermédiaire de l\'agence. Sans bon signé, en cas de contournement, l\'agence ne peut obtenir aucun dédommagement !'
      }
    ],
    scripts: [
      {
        id: 'script-vendeur-post-visite',
        title: 'Micro-bilan WhatsApp au vendeur post-visite',
        channel: 'WhatsApp',
        recipient: 'Propriétaire vendeur mandant',
        text: `Bonjour M. Laurent, c'est Nelly. Je viens tout juste de terminer la visite avec M. et Mme Lefebvre pour votre maison.
Ils ont eu un vrai coup de cœur pour la luminosité de la pièce de vie et le calme de la terrasse. Ils ont émis une petite réserve sur la taille des chambres mansardées et souhaitent faire chiffrer l'ajout d'une ouverture de toit.
Je refais un point complet avec eux d'ici 48 heures dès qu'ils auront débriefé avec leur courtier.
Je vous tiens immédiatement au courant ! Belle fin de journée.`
      }
    ],
    faqs: [
      {
        question: 'Le client refuse catégoriquement de signer avant d\'entrer, que faire ?',
        answer: 'Restez souriante mais ferme : « Je comprends votre surprise, mais pour des raisons de sécurité imposées par les propriétaires et par mon assurance professionnelle MMA, je n\'ai pas le droit légal d\'ouvrir la porte à une personne non enregistrée. Cela prend 5 secondes avec le doigt ». 99% des clients signent sans difficulté.'
      }
    ],
    tags: ['Bon de Visite', 'Signature Tactile', 'Contournement', 'Débrief Vocal', 'Sentiment', 'La Barben']
  },

  // -------------------------------------------------------------
  // GUIDE 6 : COMPTES-RENDUS VENDEURS & BILANS
  // -------------------------------------------------------------
  {
    id: 'guide-vendeurs',
    slug: 'comptes-rendus-vendeurs-bilan-mensuel-negociation-prix',
    title: 'Comptes-Rendus Vendeurs, Bilan Mensuel & Négociation de Baisse de Prix',
    shortTitle: 'Comptes-Rendus Vendeurs',
    category: 'vendeurs',
    categoryLabel: 'Comptes-Rendus Vendeurs',
    badge: 'Fidélisation Mandant',
    readTimeMinutes: 7,
    toolRoute: '/cockpit/comptes-rendus',
    toolLabel: 'Comptes-Rendus Vendeurs',
    summary: 'Comment maintenir une relation de confiance absolue avec le vendeur, générer le bilan mensuel d\'audience des portails (SeLoger, LBC, Bien\'Ici) et faire accepter un avenant de baisse de prix sans braquer le propriétaire.',
    objective: 'Conserver les mandats exclusifs au-delà des 3 mois, transformer les propriétaires en ambassadeurs de Nell\'Immo et ajuster le prix sur des bases scientifiques indiscutables si le bien ne se vend pas.',
    prerequisites: [
      'Statistiques de diffusion du bien sur les portails',
      'Historique des avis et retours des visiteurs enregistrés dans Cockpit',
      'Mises à jour DVF récentes sur la commune'
    ],
    steps: [
      {
        number: 1,
        title: 'Alimenter les retours après chaque visite',
        description: 'Chaque visite doit être qualifiée dans Cockpit avec l\'appréciation (🟢 Coup de cœur, 🟡 Intéressé mais hésitant, 🔴 Pas de suite) et les verbatims réels des clients.',
        tips: 'Notez précisément les remarques récurrentes (ex: "cuisine à refaire", "route trop passante", "prix estimé trop haut de 25 000 €").'
      },
      {
        number: 2,
        title: 'Générer le Bilan Mensuel de Commercialisation PDF',
        description: 'À J+30 de mandat, ouvrez le module "Comptes-Rendus Vendeurs" et cliquez sur "Générer le Bilan Mensuel".',
        proTip: 'Le document compile automatiquement : le nombre de vues cumulées sur SeLoger, LeBonCoin et Bien\'Ici, le nombre de contacts qualifiés, le camembert statistique des avis de visites et la moyenne des prix au m² vendus récemment.'
      },
      {
        number: 3,
        title: 'Planifier le rendez-vous d\'étape stratégique',
        description: 'N\'envoyez JAMAIS un bilan de baisse de prix par simple email ! Appelez le propriétaire pour caler un rendez-vous physique à son domicile ou à l\'agence :',
        tips: '« Bonjour M. Laurent, voilà 30 jours que nous avons lancé la commercialisation. Je souhaite vous présenter le bilan complet de notre audience et des retours de visites pour adapter notre stratégie du mois prochain. »'
      },
      {
        number: 4,
        title: 'Conduire la négociation de l\'Avenant de Baisse de Prix',
        description: 'Pendant le rendez-vous, montrez les chiffres froids : l\'annonce a été vue 1 400 fois, 8 visites ont eu lieu, mais 6 ont bloqué sur le même argument (le coût des travaux de rénovation énergétique).',
        proTip: 'Ne dites jamais : "Votre maison ne vaut pas ce prix". Dites : "Le marché nous envoie un message clair : les acheteurs actuels déduisent 30 000 € de travaux. Si nous baissons à 425 000 €, nous déclenchons l\'offre d\'achat d\'ici 15 jours".'
      },
      {
        number: 5,
        title: 'Faire signer l\'Avenant de Prix numérique immédiatement',
        description: 'Dans Cockpit, ouvrez la fiche du mandat, cliquez sur "Créer un Avenant", saisissez le nouveau prix FAI et faites signer électroniquement sur tablette. La mise à jour est envoyée automatiquement à tous les portails de diffusion le soir même !',
        tips: 'L\'avenant est numéroté et scellé au registre DGCCRF sans formalité papier supplémentaire.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Villa des Costes à Pélissanne vendue grâce au bilan J+30',
      location: 'Pélissanne (13330) — Quartier des Costes',
      context: 'M. et Mme Boyer voulaient absolument afficher leur maison à 480 000 €. Nelly avait préconisé 445 000 €. Après 30 jours et 7 visites, aucune offre n\'est arrivée : tous les visiteurs ont pointé la fosse septique non conforme et la cuisine d\'origine.',
      solution: 'Nelly édite le Bilan Mensuel Cockpit avec le graphique des retours : 100% des visiteurs ont trouvé le prix excessif au vu des 40 000 € de travaux à prévoir. Elle propose un avenant à 449 000 € FAI.',
      outcome: 'Les vendeurs comprennent la réalité sans se sentir agressés et signent l\'avenant. Deuxième visite d\'un ancien prospect le samedi suivant, offre acceptée à 440 000 € net vendeur.',
      keyFigures: [
        { label: 'Prix de départ', value: '480 000 €' },
        { label: 'Vues portails J+30', value: '1 680 vues' },
        { label: 'Avenant signé', value: '449 000 €' },
        { label: 'Offre reçue après avenant', value: '6 jours' }
      ]
    },
    legalAlerts: [
      {
        type: 'warning',
        title: 'Interdiction de modifier le prix sans avenant formel',
        lawReference: 'Loi Hoguet Art. 6 / Décret 72-678 Art. 72',
        content: 'Il est strictement interdit de modifier le prix d\'affichage sur internet ou en vitrine sans qu\'un avenant écrit et signé par tous les mandants n\'ait été conclu au préalable. En cas de contrôle DGCCRF, la non-conformité entre le prix affiché et le prix au mandat est passible de sanctions administratives sévères.'
      }
    ],
    scripts: [
      {
        id: 'script-prise-rdv-bilan',
        title: 'Accroche pour caler le bilan mensuel d\'étape',
        channel: 'Téléphone',
        recipient: 'Propriétaire à 30 jours de mandat',
        text: `« Bonjour M. Boyer, c'est Nelly Fernandez. 
Cela fait aujourd'hui exactement un mois que nous avons lancé la commercialisation de votre villa. Comme je m'y étais engagée, j'ai préparé votre Bilan Mensuel complet : nous allons analyser ensemble les 1 600 consultations sur SeLoger et LeBonCoin, les 7 visites réalisées et surtout les retours détaillés de chaque acquéreur.
Je préfère vous présenter cela de vive voix plutôt que par simple mail pour que nous ajustions ensemble la meilleure stratégie pour les semaines à venir. Seriez-vous disponible vendredi à 17h chez vous ? »`
      }
    ],
    faqs: [
      {
        question: 'Le propriétaire peut-il consulter ses statistiques en direct sur son mobile ?',
        answer: 'Oui ! Chaque bien dispose d\'un "Espace Vendeur en Ligne" protégé par un lien sécurisé unique que vous pouvez lui envoyer sur WhatsApp. Il peut y consulter en temps réel le nombre de vues, les visites programmées et les comptes-rendus.'
      }
    ],
    tags: ['Comptes-Rendus', 'Bilan Vendeur', 'Avenant de Baisse', 'Négociation', 'Exclusivité', 'Pélissanne']
  },

  // -------------------------------------------------------------
  // GUIDE 7 : PIPELINE NOTAIRE & COMPROMIS
  // -------------------------------------------------------------
  {
    id: 'guide-transactions',
    slug: 'pipeline-notaire-compromis-delais-sru-facturation-honoraires',
    title: 'Du Compromis à l\'Acte Authentique : Jalons Légaux, SRU & Facturation',
    shortTitle: 'Pipeline Notaire & Ventes',
    category: 'transactions',
    categoryLabel: 'Pipeline Notaires & Ventes',
    badge: 'Sécurisation Financière',
    readTimeMinutes: 9,
    toolRoute: '/cockpit/transactions',
    toolLabel: 'Pipeline Notaire',
    summary: 'Comment piloter le cycle de vente en 7 étapes : collecte du dossier notarial complet (ALUR), calcul rigoureux des 10 jours de purge SRU, surveillance des délais d\'accord de prêt (J+45 / J+60) et émission de la note d\'honoraires avec RIB.',
    objective: 'Éliminer tout risque de caducité de compromis, éviter les mauvaises surprises de refus de prêt tardif et s\'assurer d\'être payée de ses honoraires le jour même de la signature authentique.',
    prerequisites: [
      'Offre d\'achat contresignée par les deux parties',
      'Coordonnées des deux notaires (Notaire vendeur et Notaire acquéreur)',
      'Dossier complet des pièces Loi ALUR (Titre, diagnostics, copro si applicable)',
      'Plan de financement de l\'acquéreur (banque, montant emprunté, taux max, nom du courtier)'
    ],
    steps: [
      {
        number: 1,
        title: 'Créer le Deal dans le Pipeline Notaire',
        description: 'Dès l\'acceptation de l\'offre d\'achat, rendez-vous dans "Pipeline Notaire & Ventes" et cliquez sur "Nouvelle Transaction". Sélectionnez le mandat et l\'acquéreur. Indiquez le prix convenu et le montant du séquestre (généralement 5% ou 10%).',
        tips: 'Renseignez l\'étude notariale instrumentaire (ex: Étude Notariale de Me Pélissanne ou Me Salon).'
      },
      {
        number: 2,
        title: 'Vérifier la checklist des 10 pièces obligatoires Loi ALUR',
        description: 'Ouvrez l\'onglet "GED Notaire". Cochez les documents transmis : Titre de propriété, Taxe foncière, Diagnostics techniques à jour, Pièces d\'identité, Justificatifs de domicile, Plan cadastral, Carnet d\'information du logement (CIL), et si copropriété : Règlement de copropriété, 3 derniers PV d\'AG, Pré-état daté.',
        proTip: 'Tant que le dossier ALUR n\'est pas complet, le délai SRU ne commence PAS à courir lors de la notification du compromis !'
      },
      {
        number: 3,
        title: 'Calculer la date de purge du Délai de Rétractation SRU (10 jours)',
        description: 'Une fois le compromis signé et notifié par LRAR électronique (ex: AR24), indiquez la date de notification dans Cockpit. Le système calcule automatiquement la date d\'expiration des 10 jours.',
        tips: 'Attention aux règles de calcul civil : le délai court à compter du LENDEMAIN de la première présentation de la lettre recommandée. Si le 10ème jour expire un samedi, un dimanche ou un jour férié, l\'échéance est reportée au premier jour ouvrable suivant à minuit.'
      },
      {
        number: 4,
        title: 'Suivre le calendrier suspensif de prêt (J+30 et J+60)',
        description: 'Le pipeline affiche deux alertes automatiques cruciales :',
        proTip: 'J+30 : Date limite de dépôt de dossier bancaire (l\'acquéreur doit vous fournir un récépissé de dépôt). J+45 à J+60 : Date limite d\'obtention de l\'offre de prêt. Cockpit active une alerte orange à J-10 pour relancer l\'acquéreur et son courtier.'
      },
      {
        number: 5,
        title: 'Générer la Note d\'Honoraires officielle pour le notaire',
        description: 'Une fois les conditions suspensives levées et la date de signature définitive fixée, cliquez sur "Générer Facture d\'Honoraires".',
        tips: 'Cockpit produit la note d\'honoraires conforme avec mentions SASU Nell\'Immo (RCS, Carte Pro, Garantie GALIAN), numéro de TVA, référence de mandat et RIB de l\'agence. Envoyez-la au notaire instrumentaire 5 jours avant l\'acte pour que les fonds soient virés sur votre compte dès la signature.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Vente d\'un appartement T3 à Salon-de-Provence sauvée à J-5',
      location: 'Salon-de-Provence (13300) — Boulevard de la République',
      context: 'Compromis signé chez Me Notaire à Salon le 12 avril avec condition suspensive d\'obtention de prêt au 12 juin (J+60) pour un montant de 210 000 € au Crédit Mutuel.',
      solution: 'Le 2 juin, l\'alerte Cockpit clignote en orange : "J-10 échéance accord de prêt". Nelly envoie le message de relance WhatsApp pré-formaté à l\'acquéreur. L\'acheteur lui apprend que son banquier est en arrêt maladie et que le dossier est bloqué.',
      outcome: 'Nelly intervient immédiatement auprès du directeur d\'agence bancaire et obtient une prorogation d\'avenant de 10 jours validée par les deux notaires. L\'offre de prêt est émise le 18 juin. Sans cette relance proactive, le vendeur aurait pu déclarer la vente caduque !',
      keyFigures: [
        { label: 'Montant du prêt', value: '210 000 €' },
        { label: 'Délai initial', value: '60 jours' },
        { label: 'Alerte déclenchée', value: 'J-10' },
        { label: 'Honoraires encaissés', value: '11 000 € TTC' }
      ]
    },
    legalAlerts: [
      {
        type: 'danger',
        title: 'Calcul du délai de rétractation SRU : le piège des jours fériés',
        lawReference: 'Code de la construction et de l\'habitation — Art. L. 271-1 / Art. 642 du Code de procédure civile',
        content: 'Le délai de rétractation de 10 jours ne commence à courir que le LENDEMAIN de la notification du compromis accompagné de TOUTES les pièces ALUR. Si le 10e jour tombe un samedi, un dimanche ou un jour férié, le délai est prorogé jusqu\'au premier jour ouvrable suivant à 24h00. Une erreur d\'un seul jour peut permettre à l\'acheteur de se rétracter abusivement !'
      },
      {
        type: 'warning',
        title: 'Condition suspensive de prêt & Justificatif de refus',
        lawReference: 'Code de la consommation — Art. L. 313-41',
        content: 'Pour se prévaloir valablement du refus de prêt et récupérer son séquestre, l\'acquéreur doit obligatoirement présenter un refus bancaire conforme aux caractéristiques stipulées dans le compromis (même montant, même taux maximal, même durée). Un refus pour un montant supérieur ou un taux inférieur n\'est pas valable !'
      }
    ],
    scripts: [
      {
        id: 'script-relance-pret-j10',
        title: 'Relance bienveillante mais ferme accord de prêt J-10',
        channel: 'WhatsApp',
        recipient: 'Acquéreur à 10 jours de l\'échéance bancaire',
        text: `Bonjour Julien, j'espère que vous allez bien.
Je fais un point d'étape sur votre dossier pour la maison de [Ville]. Notre calendrier légal prévoit la fourniture de votre accord de prêt bancaire avant le [Date Échéance].
Avez-vous bien reçu l'accord écrit définitif de votre banque ou de votre courtier ?
Le notaire Me [Nom Notaire] attend ce document pour lancer la rédaction de l'acte authentique et fixer la date définitive de remise des clés.
Tenez-moi au courant rapidement pour que nous soyons parfaitement dans les clous ! Bien à vous, Nelly.`
      },
      {
        id: 'script-mail-notaire-facture',
        title: 'Email formel envoi note d\'honoraires au notaire',
        channel: 'Email',
        recipient: 'Étude Notariale instrumentaire',
        text: `Maître,
Dans le cadre de la réitération par acte authentique de la vente du bien situé à [Adresse], entre M./Mme [Vendeur] et M./Mme [Acquéreur], fixée le [Date Signature], vous trouverez ci-joint notre note d'honoraires n° [Numéro Facture] pour un montant de [Montant] € TTC, ainsi que le RIB de l'agence SASU Nell'Immo.
Je vous remercie de bien vouloir inscrire cette somme à votre état liquidatif de compte et d'en ordonner le virement dès la signature de l'acte.
Restant à votre entière disposition,
Nelly Fernandez — Nell'Immo.`
      }
    ],
    faqs: [
      {
        question: 'Qui doit détenir le séquestre : l\'agence ou le notaire ?',
        answer: 'Par mesure de simplicité et de sécurité, Nell\'Immo fait verser le séquestre directement sur le compte CDC du notaire instrumentaire (ou sur le compte séquestre de notre garantie financière GALIAN). Ne manipulez jamais de chèques au bureau.'
      },
      {
        question: 'À quel moment exact puis-je encaisser mes honoraires d\'agence ?',
        answer: 'Selon la Loi Hoguet (Art. 6), aucun honoraire ne peut être versé ni exigé avant que l\'acte authentique de vente n\'ait été effectivement signé chez le notaire. Le notaire vous vire directement la somme le jour même ou dans les 48 heures.'
      }
    ],
    tags: ['Compromis', 'Notaire', 'Délai SRU', 'Prêt bancaire', 'Conditions suspensives', 'Honoraires', 'Facturation']
  },

  // -------------------------------------------------------------
  // GUIDE 8 : FICHES VITRINE LED & AFFICHES
  // -------------------------------------------------------------
  {
    id: 'guide-vitrine',
    slug: 'fiches-vitrine-led-affiches-visite-haute-definition',
    title: 'Créer des Affiches Vitrine LED & Fiches Visite Haute Définition',
    shortTitle: 'Fiches Vitrine & Affiches',
    category: 'vitrine',
    categoryLabel: 'Affiches Vitrine LED',
    badge: 'Marketing & Image',
    readTimeMinutes: 5,
    toolRoute: '/cockpit/fiches-vitrine',
    toolLabel: 'Studio Fiches Vitrine',
    summary: 'Comment concevoir en 3 clics des affiches vitrine lumineuses grand format (A3 / A4) conformes à la réglementation ALUR (DPE, honoraires, classe énergétique) et prêtes pour vos porte-affiches LED.',
    objective: 'Attirer le regard des passants dans la rue commerçante de Pélissanne avec un graphisme digne des plus grands cabinets immobiliers et distribuer des fiches de visite luxueuses aux acheteurs.',
    prerequisites: [
      'Photos haute définition du bien (au minimum 1 photo d\'accroche extérieure et 2 photos intérieures lumineuses)',
      'Classement DPE et GES renseignés',
      'Prix FAI et pourcentage d\'honoraires de l\'agence'
    ],
    steps: [
      {
        number: 1,
        title: 'Sélectionner le mandat à afficher',
        description: 'Ouvrez le "Studio Fiches Vitrine LED". Sélectionnez le bien dans la liste déroulante : Cockpit charge instantanément toutes les caractéristiques, le prix, la ville et les photos HD associées.',
        tips: 'Vérifiez que le statut est bien "Actif" ou "Exclusivité".'
      },
      {
        number: 2,
        title: 'Choisir le gabarit d\'impression',
        description: 'Sélectionnez le format adapté à votre support :',
        tips: 'A3 Paysage : Idéal pour les grands cadres LED de la vitrine principale de l\'agence. A4 Portrait : Parfait pour le dossier papier remis en main propre aux visiteurs. Carré 1:1 : Optimisé pour vos publications Instagram et Facebook.'
      },
      {
        number: 3,
        title: 'Personnaliser le thème visuel et la photo de une',
        description: 'Basculez entre le thème "Signature Nell\'Immo" (fond nuit ardoise et touches dorées), "Blanc Épuré" ou "Prestige Provence". Cliquez sur les photos miniatures pour choisir celle qui apparaît en grand format d\'accroche.',
        proTip: 'Choisissez toujours une photo ensoleillée de la façade avec terrasse ou piscine en image principale. Évitez les photos de salles de bain ou de couloirs en couverture.'
      },
      {
        number: 4,
        title: 'Sélectionner les 3 atouts phares (Key Highlights)',
        description: 'Cochez 3 badges percutants parmi les suggestions du système (ex: "Piscine sans vis-à-vis", "Plain-pied total", "Vue panoramique Luberon", "Calme absolu", "Suite parentale").',
        tips: 'Les passants ne lisent pas un pavé de texte en marchant : 3 atouts forts suffisent à déclencher l\'arrêt.'
      },
      {
        number: 5,
        title: 'Imprimer en haute résolution ou exporter en PDF',
        description: 'Cliquez sur "Imprimer / Exporter PDF". Le moteur génère un document vectoriel à 300 DPI sans perte de qualité.',
        proTip: 'Pour vos vitrines lumineuses LED, imprimez sur du papier rétroéclairé (papier "Backlit") pour une brillance maximale la nuit.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Affiche A3 LED pour un Mas rénové à Pélissanne',
      location: 'Pélissanne (13330) — Centre-ville',
      context: 'Nelly obtient l\'exclusivité sur un magnifique mas en pierre de 210 m² à 780 000 €. Elle veut un impact visuel immédiat dans la vitrine de l\'agence.',
      solution: 'Nelly ouvre le Studio, choisit le format A3 Paysage, applique le thème "Signature Nuit & Or", sélectionne la photo de la terrasse ombragée sous les platanes et met en avant les 3 badges : "Pierre de Rognes", "Terrain 2 500m²", "Piscine chauffée".',
      outcome: 'Affiche installée le jour même dans le cadre LED. Trois demandes de renseignements enregistrées en vitrine en moins de 48 heures.',
      keyFigures: [
        { label: 'Format choisi', value: 'A3 Paysage LED' },
        { label: 'Résolution', value: '300 DPI Vectoriel' },
        { label: 'Conformité ALUR', value: '100% Automatique' },
        { label: 'Contacts vitrine', value: '3 en 48h' }
      ]
    },
    legalAlerts: [
      {
        type: 'danger',
        title: 'Mentions obligatoires sur les affiches vitrine (Arrêté 10 janv. 2017)',
        lawReference: 'Arrêté du 10 janvier 2017 relatif à l\'information des consommateurs par les professionnels de l\'immobilier',
        content: 'Chaque affiche doit obligatoirement mentionner de façon parfaitement lisible : le prix de vente TTC avec la mention "Honoraires d\'agence inclus" (FAI), qui supporte les honoraires (Vendeur ou Acquéreur), le pourcentage d\'honoraires TTC rapporté au prix net vendeur, et le barème des classes énergétiques DPE et climat GES.'
      }
    ],
    scripts: [],
    faqs: [
      {
        question: 'Puis-je réutiliser l\'affiche vitrine sur mes réseaux sociaux ?',
        answer: 'Oui, choisissez simplement le gabarit "Carré 1:1 Instagram" dans le studio, puis cliquez sur "Télécharger l\'image" pour l\'insérer directement dans votre story ou votre publication Facebook/Instagram.'
      }
    ],
    tags: ['Fiches Vitrine', 'Affiches LED', 'A3 Paysage', 'DPE', 'Loi ALUR', 'Impression', 'Pélissanne']
  },

  // -------------------------------------------------------------
  // GUIDE 9 : STUDIO DE RÉDACTION IA
  // -------------------------------------------------------------
  {
    id: 'guide-redacteur',
    slug: 'studio-redacteur-ia-styles-provencaux-reseaux-sociaux',
    title: 'Rédiger des Annonces d\'Émotion avec le Studio IA Nell\'Immo',
    shortTitle: 'Studio Rédaction IA',
    category: 'redacteur',
    categoryLabel: 'Studio Rédaction IA',
    badge: 'Créativité & SEO',
    readTimeMinutes: 6,
    toolRoute: '/cockpit/redacteur',
    toolLabel: 'Studio Rédaction',
    summary: 'Comment transformer une simple fiche technique en 5 déclinaisons rédactionnelles percutantes : Style Signature Provençale Nelly, Prestige & Émotion, SEO Portails ALUR, Pitch WhatsApp et Réseaux Sociaux Instagram/Facebook.',
    objective: 'Gagner 45 minutes de rédaction par annonce, se démarquer du style froid et robotique des agences classiques et maximiser le taux de clics sur SeLoger et LeBonCoin.',
    prerequisites: [
      'Caractéristiques du bien (surface, pièces, équipements clés)',
      'Environnement et cadre de vie (calme, vue, proximité commerces, écoles)',
      'Orientation et ambiance (luminosité, jardin, coucher de soleil)'
    ],
    steps: [
      {
        number: 1,
        title: 'Sélectionner le mandat ou saisir les points clés',
        description: 'Dans le "Studio de Rédaction & Pitchs", sélectionnez un mandat existant ou saisissez librement les mots-clés de votre nouveau bien.',
        tips: 'Ajoutez une note d\'ambiance spécifique (ex: "Chant des cigales, terrasse sous treille, rénovation soignée avec travertin").'
      },
      {
        number: 2,
        title: 'Choisir le style de plume adapté au bien',
        description: 'Explorez les 5 styles pré-configurés :',
        tips: '1. Signature Nelly Fernandez : Chaleureux, provençal, mettant en valeur l\'art de vivre local. 2. Prestige & Émotion : Vocabulaire raffiné, volumes, lumière et matériaux nobles. 3. Portails SEO & ALUR : Rigoureux, détaillé, balisé pour le référencement naturel. 4. Pitch WhatsApp : Synthétique et direct pour les acheteurs chauds. 5. Réseaux Sociaux : Emojis dosés, accroche visuelle et hashtags ciblés.'
      },
      {
        number: 3,
        title: 'Générer et peaufiner en 1 clic',
        description: 'Cliquez sur "Générer la Rédaction". L\'IA compose l\'annonce complète en quelques secondes avec titre accrocheur, texte de corps émotionnel et mentions légales réglementaires.',
        proTip: 'Relisez toujours et ajustez un ou deux détails personnels (ex: "À 5 minutes à pied du moulin de Pélissanne").'
      },
      {
        number: 4,
        title: 'Appliquer directement au mandat',
        description: 'Cliquez sur "Enregistrer dans la fiche du bien". La nouvelle description remplace automatiquement l\'ancienne et sera exportée lors de la prochaine multidiffusion vers SeLoger et LeBonCoin.',
        tips: 'Utilisez la version "Pitch WhatsApp" pour envoyer directement à vos clients dans le CRM.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Rénovation d\'une annonce terne en coup de cœur à Lambesc',
      location: 'Lambesc (13410)',
      context: 'Un mandat de maison de village avec cour intérieure était en ligne depuis 3 semaines avec une annonce brute ("Maison 4 pièces 110m², cour, séjour, 3 chambres, cuisine équipée, DPE C"). Zéro appel.',
      solution: 'Nelly passe le texte dans le Studio de Rédaction avec le style "Signature Nelly". Le titre devient : « L\'Art de Vivre en Provence : Charme de la Pierre et Cour Intime au Cœur de Lambesc ». Le texte commence par : « Dès le porche franchi, le tumulte du village s\'efface pour laisser place à la quiétude d\'une cour ensoleillée où s\'épanouissent jasmin et olivier... »',
      outcome: 'Publication du nouveau texte le mardi. 4 visites programmées le samedi, offre acceptée dès la semaine suivante.',
      keyFigures: [
        { label: 'Temps de rédaction', value: '45 secondes' },
        { label: 'Ancien taux de clic', value: '1,2 %' },
        { label: 'Nouveau taux de clic', value: '4,8 %' },
        { label: 'Visites déclenchées', value: '4 en 4 jours' }
      ]
    },
    legalAlerts: [
      {
        type: 'warning',
        title: 'Interdiction des mentions discriminatoires ou trompeuses',
        lawReference: 'Code de la consommation Art. L. 121-1 & Loi ALUR',
        content: 'Veillez à ce que l\'annonce ne contienne aucun superlatif mensonger (ex: affirmer "calme absolu" si une voie ferrée passe à 50m) et respecte l\'obligation d\'indiquer les montants des dépenses énergétiques annuelles estimées du DPE.'
      }
    ],
    scripts: [],
    faqs: [
      {
        question: 'Puis-je générer des posts pour ma page Facebook et Instagram ?',
        answer: 'Absolument ! Choisissez le style "Réseaux Sociaux / Instagram" : le studio génère le texte calibré avec les retours à la ligne propres, les emojis élégants et les hashtags locaux (#Pelissanne #PaysSalonais #ImmobilierProvence).'
      }
    ],
    tags: ['Rédaction IA', 'Copywriting', 'SeLoger', 'LeBonCoin', 'Instagram', 'Provence', 'Marketing']
  },

  // -------------------------------------------------------------
  // GUIDE 10 : MULTIDIFFUSION SANS INTERMÉDIAIRE
  // -------------------------------------------------------------
  {
    id: 'guide-diffusion',
    slug: 'multidiffusion-portails-poliris-seloger-leboncoin-bienici',
    title: 'Multidiffusion Poliris & XML Directe Sans Abonnement Tiers',
    shortTitle: 'Multidiffusion Portails',
    category: 'diffusion',
    categoryLabel: 'Multidiffusion Portails',
    badge: 'Indépendance Totale',
    readTimeMinutes: 5,
    toolRoute: '/cockpit/diffusion',
    toolLabel: 'Hub Multidiffusion',
    summary: 'Comment générer vos flux Poliris 4.08 (annonces.csv, photos.cfg) et flux XML Bien\'Ici directement depuis Cockpit pour alimenter SeLoger, LeBonCoin et Bien\'Ici sans payer d\'abonnement Ubiflow ou passerelle tierce.',
    objective: 'Économiser 1 800 € à 3 000 € par an de frais de multidiffusion logicielle tout en maîtrisant à 100% l\'intégrité et la rapidité de parution de vos annonces.',
    prerequisites: [
      'Comptes professionnels actifs auprès de SeLoger, LeBonCoin et Bien\'Ici',
      'Identifiants de dépôt SFTP fournis par chaque portail (hôte, identifiant, mot de passe)',
      'Au moins un mandat actif avec photos et DPE complet'
    ],
    steps: [
      {
        number: 1,
        title: 'Vérifier les canaux de diffusion sur chaque mandat',
        description: 'Sur la fiche de chaque bien, cochez les portails cibles dans la section "Canaux de diffusion" : "Site Web Nell\'Immo", "SeLoger", "LeBonCoin", "Bien\'Ici".',
        tips: 'Si un bien est sous compromis, décochez simplement les portails : il sera retiré des flux à la prochaine mise à jour sans supprimer sa fiche.'
      },
      {
        number: 2,
        title: 'Ouvrir le Hub de Multidiffusion',
        description: 'Rendez-vous dans "Multidiffusion Portails". Le tableau récapitule le nombre de mandats prêts à être exportés vers chaque régie publicitaire.',
        proTip: 'Cockpit effectue un pré-contrôle de conformité : il vous avertit si une annonce manque de photos HD ou si le DPE n\'a pas sa classe GES.'
      },
      {
        number: 3,
        title: 'Générer le package Poliris 4.08 SeLoger / LeBonCoin',
        description: 'Cliquez sur "Générer le Package Poliris ZIP". Le système produit l\'archive contenant :',
        tips: 'annonces.csv : Fichier structuré selon la norme Poliris 4.08 avec 120 colonnes normées. photos.cfg : Fichier de liaison des photos HD. config.txt : Paramètres d\'agence et numéro d\'abonné.'
      },
      {
        number: 4,
        title: 'Générer le flux XML Standardisé pour Bien\'Ici',
        description: 'Pour Bien\'Ici, Cockpit génère le fichier XML certifié avec coordonnées géographiques précises pour le positionnement 3D sur la carte du Pays Salonais.',
        tips: 'Vous pouvez soit télécharger l\'archive pour un dépôt manuel, soit laisser la synchronisation automatique SFTP programmée chaque nuit.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Bascule complète sans rupture de diffusion',
      location: 'Pélissanne (13330)',
      context: 'Nelly configure la passerelle directe pour assurer la diffusion automatisée de ses 14 mandats sur SeLoger et LeBonCoin.',
      solution: 'Nelly configure ses codes d\'accès SFTP SeLoger dans Cockpit. Elle génère le flux Poliris 4.08 direct. Les serveurs de SeLoger ingèrent les 14 annonces avec photos sans aucune interruption pour les acquéreurs.',
      outcome: 'Zéro coupure de parution, synchronisation directe et instantanée.',
      keyFigures: [
        { label: 'Mandats synchronisés', value: '14 mandats' },
        { label: 'Format utilisé', value: 'Poliris 4.08 & XML' },
        { label: 'Délai de mise à jour', value: 'Quotidien' },
        { label: 'Intermédiaire tiers', value: '0 (Direct)' }
      ]
    },
    legalAlerts: [
      {
        type: 'warning',
        title: 'Respect des règles de modération des portails',
        lawReference: 'Conditions Générales d\'Utilisation LeBonCoin & SeLoger',
        content: 'Ne mentionnez jamais de numéro de téléphone ou de lien web externe dans le corps de texte de la description Poliris : les robots de modération de SeLoger et LeBonCoin rejettent automatiquement les annonces contenant des coordonnées en clair.'
      }
    ],
    scripts: [],
    faqs: [
      {
        question: 'À quelle fréquence les portails actualisent-ils les annonces ?',
        answer: 'SeLoger et LeBonCoin mettent à jour leurs serveurs 2 à 4 fois par jour. En règle générale, toute modification envoyée le matin est visible en ligne en début d\'après-midi.'
      }
    ],
    tags: ['Multidiffusion', 'Poliris 4.08', 'SeLoger', 'LeBonCoin', 'BienIci', 'Passerelle', 'Économies']
  },

  // -------------------------------------------------------------
  // GUIDE 11 : CLÉS, PANNEAUX & INTER-AGENCES
  // -------------------------------------------------------------
  {
    id: 'guide-organisation',
    slug: 'registre-cles-panneaux-bourse-inter-agences',
    title: 'Gérer le Registre des Clés, Panneaux de Rue & Bourse Inter-Agences',
    shortTitle: 'Clés, Panneaux & Bourse',
    category: 'organisation',
    categoryLabel: 'Clés, Panneaux & Bourse',
    badge: 'Logistique Agence',
    readTimeMinutes: 5,
    toolRoute: '/cockpit/cles-panneaux',
    toolLabel: 'Clés & Panneaux',
    summary: 'Comment tracer les trousseaux de clés prêtés aux diagnostiqueurs et artisans, suivre les panneaux publicitaires posés en Pays Salonais et déléguer des mandats en inter-agences avec partage d\'honoraires.',
    objective: 'Éviter la perte d\'un trousseau de clés chez un propriétaire mandant, maximiser la visibilité locale grâce aux panneaux "Vendu par Nell\'Immo" et conclure des ventes partagées 50/50 avec des confrères sérieux.',
    prerequisites: [
      'Numéro de trousseau étiqueté à l\'agence',
      'Fiche de mandat associée',
      'Convention de délégation de mandat signée en cas de partage inter-agences'
    ],
    steps: [
      {
        number: 1,
        title: 'Enregistrer un trousseau de clés entrant',
        description: 'Dès la signature du mandat, étiquetez les clés avec le numéro unique du mandat (ex: CLÉ-018) sans JAMAIS inscrire l\'adresse du bien dessus par sécurité ! Enregistrez le nombre de jeux dans le module "Clés & Panneaux".',
        tips: 'Si le trousseau est égaré dans la rue, aucune personne malintentionnée ne peut faire le lien avec l\'adresse.'
      },
      {
        number: 2,
        title: 'Tracer les mouvements d\'emprunt de clés',
        description: 'Lorsqu\'un diagnostiqueur, un artisan ou un confrère vient récupérer les clés, cliquez sur "Prêter les clés". Indiquez son nom, son numéro de téléphone et la date de retour prévue.',
        proTip: 'Cockpit vous alerte si un jeu de clés n\'a pas été restitué au-delà de 48 heures.'
      },
      {
        number: 3,
        title: 'Gérer la pose et le suivi des panneaux publicitaires',
        description: 'Dans l\'onglet "Panneaux", enregistrez les panneaux posés : "À Vendre" ou "Vendu par Nell\'Immo". Indiquez l\'emplacement exact (clôture, balcon, portail) et la date de pose.',
        tips: 'Un panneau "Vendu par Nell\'Immo" laissé 30 jours après l\'accord de vente est votre meilleur levier pour décrocher les mandats des voisins du quartier !'
      },
      {
        number: 4,
        title: 'Publier un mandat sur la Bourse Inter-Agences',
        description: 'Si vous détenez un mandat exclusif difficile et souhaitez l\'ouvrir à des agences partenaires sélectionnées du Pays Salonais, rendez-vous dans "Bourse Inter-Agences".',
        proTip: 'Cockpit génère la convention de délégation officielle précisant le partage des honoraires (ex: 50% Agence Mandataire / 50% Agence Rapprocheur).'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Vente partagée en inter-agences avec un cabinet d\'Aix-en-Provence',
      location: 'Pélissanne (13330)',
      context: 'Nelly a un mandat exclusif sur une propriété de prestige à 950 000 €. Un confrère d\'Aix a des acquéreurs suisses avec budget comptant.',
      solution: 'Nelly active la délégation dans le module Inter-Agences avec partage d\'honoraires 50/50. La convention est signée numériquement.',
      outcome: 'Visite organisée sous 48h, offre au prix acceptée. Les deux cabinets encaissent 20 000 € TTC chacun en toute transparence et parfaite confraternité.',
      keyFigures: [
        { label: 'Prix du bien', value: '950 000 €' },
        { label: 'Honoraires totaux', value: '40 000 €' },
        { label: 'Part Nell\'Immo', value: '20 000 €' },
        { label: 'Conflit juridique', value: 'Zéro (Convention signée)' }
      ]
    },
    legalAlerts: [
      {
        type: 'danger',
        title: 'Interdiction de déléguer sans autorisation expresse au mandat',
        lawReference: 'Loi Hoguet décret 72-678 — Art. 72',
        content: 'Pour proposer un mandat à un confrère ou le déléguer en inter-agences, le mandat original signé avec le vendeur doit expressément comporter la clause : « Le mandant autorise le mandataire à se substituer ou s\'adjoindre tout confrère de son choix pour l\'accomplissement de sa mission ».'
      }
    ],
    scripts: [],
    faqs: [
      {
        question: 'Quelle est la durée maximale d\'affichage d\'un panneau immobilier ?',
        answer: 'Selon le Code de l\'environnement, les panneaux d\'agences ne peuvent être posés que sur le bien concerné pendant la durée effective de sa commercialisation et doivent être retirés au plus tard dans les 3 mois suivant la signature de l\'acte authentique.'
      }
    ],
    tags: ['Clés', 'Panneaux', 'Inter-Agences', 'Délégation', 'Organisation', 'Sécurité']
  },

  // -------------------------------------------------------------
  // GUIDE 12 : IMPORT & MIGRATION HEKTOR
  // -------------------------------------------------------------
  {
    id: 'guide-hektor',
    slug: 'import-donnees-hektor-catalogue',
    title: 'Importation de Données & Catalogue Externe Sans Perte',
    shortTitle: 'Import Hektor',
    category: 'hektor',
    categoryLabel: 'Import & Migration Hektor',
    badge: 'Transition Sereine',
    readTimeMinutes: 5,
    toolRoute: '/cockpit/import-hektor',
    toolLabel: 'Passerelle Hektor',
    summary: 'Procédure pas-à-pas pour exporter vos contacts acquéreurs, vendeurs et mandats depuis le logiciel Hektor et les injecter dans Cockpit Nell\'Immo en quelques secondes sans double saisie.',
    objective: 'Importer et synchroniser facilement vos contacts, acquéreurs et mandats depuis Hektor sans perdre aucune donnée de votre historique commercial.',
    prerequisites: [
      'Accès administrateur à votre compte Hektor (La Boîte Immo)',
      'Exportation des fichiers CSV standard Hektor (biens, contacts, acquéreurs)',
      'Vérification des numéros de téléphone et adresses emails'
    ],
    steps: [
      {
        number: 1,
        title: 'Exporter les données depuis Hektor',
        description: 'Connectez-vous à Hektor. Rendez-vous dans : Paramètres > Outils & Exports > Export des Biens (format CSV complet) et Export des Contacts / Acquéreurs.',
        tips: 'Téléchargez les fichiers .csv sur le bureau de votre ordinateur.'
      },
      {
        number: 2,
        title: 'Ouvrir la Passerelle Import Hektor dans Cockpit',
        description: 'Dans Cockpit Nell\'Immo, ouvrez "Import Hektor". Vous disposez d\'une zone de glisser-déposer sécurisée.',
        proTip: 'Cockpit reconnaît automatiquement la structure des colonnes d\'Hektor (mandate_ref, seller_name, phone, price_fai, dpe, etc.) et effectue le mapping sans configuration manuelle.'
      },
      {
        number: 3,
        title: 'Vérifier la prévisualisation et valider l\'import',
        description: 'Cockpit affiche la liste des biens et acquéreurs détectés. Vérifiez les correspondances et cliquez sur "Importer dans la Base de Données Nell\'Immo".',
        tips: 'Tous les mandats importés conservent leur historique, et les acquéreurs sont immédiatement disponibles pour le matching automatique.'
      }
    ],
    concreteExample: {
      title: 'Exemple Réel : Importation de 42 mandats et 180 acquéreurs en 2 minutes',
      location: 'SASU Nell\'Immo (Pélissanne)',
      context: 'Nelly souhaite intégrer dans Cockpit son historique de 42 fiches de biens et 180 profils d\'acquéreurs au format Hektor.',
      solution: 'Nelly glisse le fichier CSV exporté d\'Hektor dans le module d\'importation Cockpit.',
      outcome: 'En 1 minute 40 secondes, l\'intégralité des 42 mandats et 180 acquéreurs est injectée dans Cockpit. Tous les numéros de téléphone sont cliquables pour les appels et WhatsApp.',
      keyFigures: [
        { label: 'Mandats importés', value: '42' },
        { label: 'Acquéreurs importés', value: '180' },
        { label: 'Temps d\'opération', value: '< 2 minutes' },
        { label: 'Données perdues', value: '0 %' }
      ]
    },
    legalAlerts: [
      {
        type: 'info',
        title: 'Conservation des archives et traçabilité',
        lawReference: 'Loi Hoguet décret 72-678 Art. 65 — Conservation décennale',
        content: 'Les mandats et répertoires doivent être conservés pendant une durée minimale de 10 ans. Conservez toujours une copie de sauvegarde locale de vos exports CSV Hektor dans vos archives numériques sécurisées.'
      }
    ],
    scripts: [],
    faqs: [
      {
        question: 'Mes photos Hektor sont-elles transférées automatiquement ?',
        answer: 'Oui, si votre export CSV contient les URLs publiques des photos hébergées sur les serveurs de La Boîte Immo, Cockpit les récupère et les stocke directement dans votre bibliothèque locale.'
      }
    ],
    tags: ['Hektor', 'La Boite Immo', 'Import CSV', 'Migration', 'Contacts', 'Mandats', 'Autonomie']
  }
];
