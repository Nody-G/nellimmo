# MASTER CAHIER DES CHARGES & SPÉCIFICATIONS FONCTIONNELLES
## COCKPIT NELL'IMMO — SYSTÈME D'EXPLOITATION TRANSACTIONNEL IMMOBILIER (2026-2030)
**Destiné à :** Nelly & Niels FERNANDEZ — SASU Nell'Immo (Pélissanne & Pays Salonais)  
**Objectif :** Remplacement total, autonome, sans abonnement tiers d'Hektor (La Boîte Immo), intégrant IA générative, conformité Loi Hoguet/ALUR, multidiffusion et pipeline notarié.

---

## 1. VISION STRATÉGIQUE & DOCTRINE DE CONCEPTION

### 1.1. Les 4 Piliers Fondamentaux
1. **Épure & Vitesse Absolue (Zéro friction)** :
   - Temps de chargement < 100ms sur toutes les interfaces grâce à Next.js 16 (Turbopack) et Tailwind CSS v4.
   - Suppression totale des popups encombrantes, formulaires à tiroirs infinis et temps d'attente d'Hektor.
   - Saisie intelligente : Remplissage Express par collage de texte, détection automatique des surfaces, prix, DPE et équipements.
2. **Qualité Visuelle & Valorisation de Marque** :
   - Fiches vitrines LED haute définition (A4 paysage, A4 portrait, A3 grand format vitrine, carré 1:1 Instagram) avec sélection visuelle des photos et grands aperçus HD.
   - Rédaction d'annonces par IA avec style signature Nelly Fernandez (4 modes : Portails SeLoger/LBC, Luxe Émotionnel, Réseaux Sociaux, Fiche Négociation).
3. **Conformité Juridique Inviolable (Loi Hoguet / ALUR / DGCCRF)** :
   - Registre numérique infalsifiable horodaté avec empreinte cryptographique SHA-256.
   - Calcul temps réel des honoraires TTC, mentions légales obligatoires, barème d'honoraires et contrôle du DPE 2024 (audit énergétique obligatoire pour F et G).
4. **Indépendance Technologique & Économique** :
   - Économie de 2 000 € à 4 500 € par an de licences logicielles (Hektor, Ubiflow, plateformes de pige).
   - Propriété intégrale de la base de données, des flux de diffusion (Poliris XML 4.0 / SeLoger, LeBonCoin, Bien'Ici) et de l'historique des transactions.

---

## 2. SOMMAIRE DU CAHIER DES CHARGES DÉTAILLÉ

L'architecture fonctionnelle et technique est découpée en **6 modules spécialisés** consultables dans le dossier `docs/` :

```
docs/
├── 00_MASTER_CAHIER_DES_CHARGES.md          <- Vue d'ensemble, doctrine et matrice générale
├── 01_PIPELINE_NOTAIRE_ET_TRANSACTIONS.md   <- Du compromis à l'acte authentique, délais SRU & prêt
├── 02_ESPACE_VENDEUR_ET_COMPTE_RENDU.md    <- Bilan commercialisation, retours visites & renégociation
├── 03_CONTRATS_ET_SIGNATURE_ELECTRONIQUE.md <- Génération mandats PDF Hoguet & signature certifiée eIDAS
├── 04_AGENDA_VISITES_ET_RELANCES_AUTO.md    <- Calendrier synchronisé, rappels WhatsApp J-1 & post-visite
├── 05_MODULE_PIGE_ET_PROSPECTION.md         <- Veille PAP/LBC, détection des baisses de prix & prospection
└── 06_ARCHITECTURE_TECHNIQUE_ET_SECURITE.md <- Next.js 16, Supabase, SFTP Poliris, Sécurité & RGPD
```

---

## 3. MATRICE COMPARATIVE GLOBALE COCKPIT NELL'IMMO VS HEKTOR

| Fonctionnalité | Hektor (La Boîte Immo) | Cockpit Nell'Immo (Objectif Final) | Statut Actuel |
| :--- | :--- | :--- | :--- |
| **Gestion Mandats & Biens** | Standard, formulaires lourds | Saisie Express IA + Détection auto des données | ✅ Opérationnel |
| **Passerelles Portails (Poliris)** | Payant via passerelle | Flux natif Poliris XML/CSV (SeLoger, LBC, Bien'Ici) | ✅ Opérationnel |
| **Studio Fiches Vitrines LED** | Modèles PDF rigides | Studio interactif 4 formats + 4 thèmes + Zoom HD | ✅ Opérationnel |
| **Rédaction Annonces IA** | Modèles statiques | IA DeepSeek fine-tunée sur le style Nelly | ✅ Opérationnel |
| **Avis de Valeur & Estimation** | Module payant | Connexion temps réel DVF Notaires géolocalisée | ✅ Opérationnel |
| **Registre Numérique DGCCRF** | Basique | Scellement SHA-256 inviolable conforme Loi Hoguet | ✅ Opérationnel |
| **Suivi Notaire & Compromis** | Pipeline rigide | Suivi dynamique des conditions suspensives & prêt | 📋 Spécifié (Doc 01) |
| **Bilan Vendeur en 1 Clic** | Extranet basique | Compte-rendu WhatsApp/PDF avec stats et avis | 📋 Spécifié (Doc 02) |
| **Génération PDF Mandat Légal** | Module payant | Générateur de mandats officiels avec signature | 📋 Spécifié (Doc 03) |
| **Agenda & Relances SMS/WhatsApp**| Envoi SMS payant | Relances WhatsApp gratuites automatisées | 📋 Spécifié (Doc 04) |
| **Pige Particuliers (PAP / LBC)** | Option 100€/mois | Veille ciblée Pays Salonais avec historique DVF | 📋 Spécifié (Doc 05) |

---

## 4. PLANNING DE DÉPLOIEMENT CONSEILLÉ

### Phase 1 : Cœur Métier & Suivi Notarial (Mois 1)
- Déploiement du **Pipeline Transactionnel Notaire** (Doc 01) pour suivre les compromis, les délais de prêt et facturer les honoraires.
- Activation du **Générateur de Bilans Vendeurs** (Doc 02) pour automatiser la relation propriétaire.

### Phase 2 : Automatisation & Mobilité (Mois 2)
- Mise en place de l'**Agenda des Visites & Relances WhatsApp** (Doc 04).
- Intégration du module de **Signature Électronique Certifiée** (Doc 03).

### Phase 3 : Conquête & Prospection (Mois 3)
- Lancement de la **Pige Particuliers Pays Salonais** (Doc 05) pour capter de nouveaux mandats exclusifs.
