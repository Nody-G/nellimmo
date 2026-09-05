# MASTER CAHIER DES CHARGES & SPÉCIFICATIONS FONCTIONNELLES
## COCKPIT NELL'IMMO — SYSTÈME D'EXPLOITATION TRANSACTIONNEL IMMOBILIER (2026-2030)
**Destiné à :** Nelly & Niels FERNANDEZ — SASU Nell'Immo (Pélissanne & Pays Salonais)  
**Objectif :** Système d'exploitation transactionnel immobilier autonome, intégrant IA générative, conformité Loi Hoguet/ALUR, multidiffusion et pipeline notarié.

---

## 1. VISION STRATÉGIQUE & DOCTRINE DE CONCEPTION

### 1.1. Les 4 Piliers Fondamentaux
1. **Épure & Vitesse Absolue (Zéro friction)** :
   - Temps de chargement < 100ms sur toutes les interfaces grâce à Next.js 16 (Turbopack) et Tailwind CSS v4.
   - Suppression des interfaces surchargées, zéro temps d'attente et expérience fluide au quotidien.
   - Saisie intelligente : Remplissage Express par collage de texte, détection automatique des surfaces, prix, DPE et équipements.
2. **Qualité Visuelle & Valorisation de Marque** :
   - Fiches vitrines LED haute définition (A4 paysage, A4 portrait, A3 grand format vitrine, carré 1:1 Instagram) avec sélection visuelle des photos et grands aperçus HD.
   - Rédaction d'annonces par IA avec style signature Nelly Fernandez (10 styles de plume).
3. **Conformité Juridique Inviolable (Loi Hoguet / ALUR / DGCCRF)** :
   - Registre numérique infalsifiable horodaté avec empreinte cryptographique SHA-256.
   - Calcul temps réel des honoraires TTC, mentions légales obligatoires, barème d'honoraires et contrôle du DPE 2024 (audit énergétique obligatoire pour F et G).
4. **Indépendance Technologique & Économique** :
   - Maîtrise complète des outils numériques et des coûts d'exploitation de l'agence.
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

## 3. MATRICE FONCTIONNELLE DU COCKPIT NELL'IMMO

| Fonctionnalité | Solution Cockpit Nell'Immo | Statut Actuel |
| :--- | :--- | :--- |
| **Gestion Mandats & Biens** | Saisie Express IA + Détection auto des données | ✅ Opérationnel |
| **Passerelles Portails (Poliris)** | Flux natif Poliris XML/CSV (SeLoger, LBC, Bien'Ici) | ✅ Opérationnel |
| **Studio Fiches Vitrines LED** | Studio interactif 4 formats + 4 thèmes + Zoom HD | ✅ Opérationnel |
| **Rédaction Annonces IA** | IA fine-tunée sur le style et la plume Nelly | ✅ Opérationnel |
| **Avis de Valeur & Estimation** | Connexion temps réel DVF Notaires géolocalisée | ✅ Opérationnel |
| **Registre Numérique DGCCRF** | Scellement SHA-256 inviolable conforme Loi Hoguet | ✅ Opérationnel |
| **Suivi Notaire & Compromis** | Suivi dynamique des conditions suspensives & prêt | ✅ Opérationnel |
| **Bilan Vendeur en 1 Clic** | Compte-rendu WhatsApp/PDF avec stats et avis | ✅ Opérationnel |
| **Génération PDF Mandat Légal** | Générateur de mandats officiels avec signature | ✅ Opérationnel |
| **Agenda & Relances SMS/WhatsApp**| Relances WhatsApp directes et suivis clients | ✅ Opérationnel |
| **Pige Particuliers (PAP / LBC)** | Veille ciblée Pays Salonais avec historique DVF | ✅ Opérationnel |

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
