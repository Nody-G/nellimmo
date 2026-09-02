# Doctrine & Mémoire Opérationnelle — Cockpit Nell'Immo

Ce document constitue la référence centrale pour tout agent ou développeur intervenant sur le projet **Nell'Immo Cockpit**.

---

## 1. Identité & Contexte Métier
- **Client & Entité** : SASU NELL'IMMO (Nelly Fernandez), Agence Immobilière Indépendante.
- **Titres & Terminologie** : Ne **JAMAIS** qualifier Nelly Fernandez de "Négociatrice" ou "Négociateur". Employer exclusivement : *Agent Immobilier Indépendant*, *Présidente de la SASU NELL'IMMO* ou *Fondatrice*.
- **Zone Géographique** : Pélissanne (13330), Salon-de-Provence, Lambesc, Pays Salonais & Provence.
- **Titulaire Carte Pro** : CPI 1310 2019 000 042 974 (CCI Marseille Provence).
- **Mission Prioritaire** : Système d'exploitation transactionnel autonome et souverain, visant le **remplacement total et prioritaire d'Hektor** pour la saisie quotidienne des mandats, la diffusion automatisée des annonces et la gestion des vidéos, afin d'éliminer définitivement les frais d'abonnement logiciel récurrents.
- **Vidéos Immoliers** : Nelly réalise elle-même ses vidéos de biens. Le système doit intégrer nativement les liens vidéo (YouTube, Vimeo, visites virtuelles) dans les fiches publiques et les flux de multidiffusion.
- **Rôles & Utilisateurs** : Rôle principal pour Nelly Fernandez + compte Administrateur technique, avec architecture prête pour l'accueil futur d'un agent commercial additionnel.

---

## 2. Piliers Réglementaires & Juridiques (Non-Négociables)
1. **Loi Hoguet (Décret 72-678)** :
   - Registre légal des mandats à numérotation chronologique continue stricte, inaltérable.
   - Scellement cryptographique systématique par empreinte **SHA-256** de chaque état et modification de mandat.
2. **Loi ALUR** :
   - Transparence totale des honoraires d'agence (Prix FAI, Prix Net Vendeur, montant TTC et débiteur honoraires).
   - Mentions légales automatiques sur tous les supports (fiches, annonces, exports).
3. **Loi Climat & Résilience (DPE & GES)** :
   - **Règle d'Affichage** : Le DPE ne doit **JAMAIS** apparaître sous forme de badge graphique ou étiquette visuelle colorée. Il doit figurer **exclusivement sous forme textuelle au sein du descriptif du bien** ou des mentions réglementaires.
   - Alerte bloquante sur l'obligation d'**Audit Énergétique** pour les passoires thermiques (classes F et G).
4. **Conservation & Archivage DGCCRF** :
   - Registre et logs exportables sous format certifié DGCCRF pour audit ou contrôle administratif.
   - Archivage légal 10 ans avec export JSON complet (coffre-fort).

---

## 3. Architecture Technique & Intégrations IA
- **Framework** : Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Moteur IA & LLM (DeepSeek)** : Intégration de l'API DeepSeek (`deepseek-chat`) avec Few-Shot Prompting alimenté par la base réelle des annonces rédigées par Nelly Fernandez pour reproduire fidèlement sa plume authentique, chaleureuse et immersive.
- **Automatisation SFTP (Cron / Serverless)** : Script de dépôt SFTP automatique planifié (endpoint `/api/cron/sync-sftp`) pour transmission directe vers SeLoger et LeBonCoin, et endpoint XML direct pour Bien'ici.
- **Iconographie & Graphisme** : Lucide React, Charte graphique Nell'Immo (Bordeaux/Rose `#E12B7B`, Or Provençal `#C59A45`, Fond Sombre `#131B26`).
- **Génération & Export** : jsPDF, html2canvas, Archiver (ZIP).
- **Stockage Hybride Réactif** :
  - *Mode local par défaut* : `localStorage` avec persistance instantanée et jeux de données de démonstration complets.
  - *Mode Cloud Supabase* : Connexion automatique dès détection de `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`, synchronisation PostgreSQL et réactivité temps réel par abonnements WebSocket (`postgres_changes`).

---

## 4. Modules Fonctionnels Clés
- **Cockpit Dashboard** : Supervision globale, valorisation du portefeuille FAI, honoraires potentiels, alertes DPE et mandats à renouveler, gestion unifiée des leads (contacts & demandes d'estimations).
- **Gestion des Mandats** : Cycle de vie complet (brouillon, actif, sous compromis, vendu, archivé, résilié), ventilation financière ALUR, géolocalisation, médias photos et vidéos intégrés.
- **Studio Rédaction IA DeepSeek** : Génération d'annonces sur-mesure via DeepSeek et templates, calibré sur les écrits de Nelly (Signature provençale, Prestige, Portails ALUR, Pitch WhatsApp, Réseaux Sociaux).
- **Avis de Valeur DVF Notaires** : Exploitation des données notariales DGFiP dans un rayon de 500m, estimation au m² et génération de dossiers 8 pages.
- **Acquéreurs & Matching CRM** : Base d'acquéreurs avec scoring de compatibilité automatique (0 à 100%) et actions rapides (WhatsApp / SMS).
- **Bons de Visite Électroniques** : Émargement tactile sur canvas, génération immédiate et archivage horodaté.
- **Fiches Vitrine LED** : Formats A4 Paysage, A4 Portrait, A3 avec QR Codes dynamiques et mentions légales conformes.
- **Multidiffusion Portails Automatisée** : Génération de l'archive Poliris 4.08 (`annonces.csv`, `photos.cfg`, `config.txt`) et dépôt SFTP automatique planifié vers SeLoger / LeBonCoin + flux XML Bien'ici.
- **Site Vitrine Public** : Pages publiques prêtes pour les acquéreurs et vendeurs (catalogue avec vidéos, estimation en ligne, avis clients, contact, présentation de l'agence).

---

## 5. Sobriété & Clarté des Libellés UI (Règle Anti-Surcharge)
- **Proscription du Jargon Pompoux** : Ne **JAMAIS** surcharger les boutons, titres, cartes et badges avec des mentions juridico-techniques lourdes ou anxiogènes (ex : proscrire *"Loi Hoguet Conforme (Registre Scellé)"*, *"Scellement DGCCRF"*, *"Moteur d'Estimation Open Data Notaires (DVF)"*, *"Clé API DeepSeek"*, *"Générer avec DeepSeek IA"*).
- **Règle de Rédaction UI** : Préférer des intitulés courts, humains, sobres et clairs :
  - *"Clé API"* (au lieu de *"Clé API DeepSeek"*).
  - *"Générer l'annonce"* (au lieu de *"Générer avec DeepSeek IA"*).
  - *"Nouveau Mandat"* (au lieu de *"Nouveau Mandat Loi Hoguet"*).
  - *"Studio Rédaction"* (au lieu de *"Studio de Rédaction IA & DeepSeek 2026"*).
  - *"Multidiffusion Portails"* (au lieu de *"Passerelle & Multidiffusion Portails Automatisée SFTP"*).
  - *"Système connecté"* (au lieu de *"Loi Hoguet Conforme (Registre Scellé)"*).

---

## 6. Règle d'Apprentissage & de Mémorisation Continue (/learn)
- À chaque nouvelle directive métier, choix d'architecture ou retour utilisateur :
  1. Évaluer la pertinence durable de l'information (exclure l'éphémère ou le superflu).
  2. Mettre à jour ce document `.agents/rules/project_memory.md` pour ancrer la règle.
  3. Purger les instructions devenues obsolètes ou contradictoires.

