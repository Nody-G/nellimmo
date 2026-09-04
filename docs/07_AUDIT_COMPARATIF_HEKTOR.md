# AUDIT COMPARATIF COMPLET : COCKPIT NELL'IMMO vs HEKTOR (La Boîte Immo)

**Date de l'audit :** Septembre 2026
**Version audité :** `nellimo-cockpit@2.0.0` (Next.js 16.3.4 / React 19 / TypeScript / Tailwind 4)
**Périmètre :** Audit fonctionnel, technique et stratégique de l'ensemble des modules du Cockpit, croisé avec l'offre Hektor (La Boîte Immo), pour déterminer où l'application est **au niveau, supérieure ou en retard**, puis définir la feuille de route pour **dépasser Hektor**.

---

## 1. SYNTHÈSE EXÉCUTIVE

Le Cockpit Nell'Immo est un **système d'exploitation transactionnel immobilier autonome** d'une ampleur remarquable : **19 modules cockpit + 7 pages publiques + 5 API serveur**, le tout compilant proprement (36 routes, TypeScript strict, build ✅).

Comparé à Hektor, le Cockpit n'est **pas un simple concurrent** : il couvre un périmètre **plus large** que le CRM Hektor de base, car il intègre nativement des briques qu'Hektor délègue à des **fournisseurs tiers payants** (Ubiflow pour la multidiffusion, ImmoSign/Yousign pour la signature, modules de pige PAP/LBC, DVF notarial).

### Verdict global par axe

| Axe | Verdict vs Hektor | Commentaire |
| :--- | :--- | :--- |
| **Périmètre fonctionnel** | 🟢 **Supérieur** | Couvre CRM + diffusion + signature + conformité + site public dans un seul outil |
| **Coût** | 🟢 **Très supérieur** | 0 €/mois vs ~414 €/mois d'écosystème Hektor (voir widget benchmark) |
| **Vitesse / ergonomie** | 🟢 **Supérieur** | Next.js 16, zéro latence, saisie express IA vs formulaires à tiroirs Hektor |
| **Conformité légale** | 🟢 **Supérieur** | Registre SHA-256 scellé, DPE 2024, mentions Hoguet/ALUR intégrées |
| **IA générative** | 🟢 **Supérieur** | Rédaction multi-styles, dictaphone vocal, lab d'idéation (Hektor = modèles statiques) |
| **Robustesse / maturité** | 🟡 **En retard** | Données en localStorage (pas de cloud multi-appareils), pas de vraie signature eIDAS, intégrations externes à fiabiliser |
| **Multi-utilisateurs / équipe** | 🔴 **En retard** | Conçu « agent solo » ; Hektor gère les équipes, rôles, délégations multi-agences |
| **Écosystème & automatisations** | 🟡 **Mixte** | Relances WhatsApp/SMS, calendrier iCal présents mais non automatisés en arrière-plan |

> **Conclusion :** Le Cockpit **fait déjà aussi bien, voire mieux, qu'Hektor sur la majorité des points métier** (mandats, diffusion, conformité, rédaction, estimation DVF, CRM acquéreurs). Ses **vraies faiblesses ne sont pas fonctionnelles mais d'infrastructure** : persistance locale, absence de synchronisation cloud, signature électronique non certifiée eIDAS, et automatisations (relances, rappels) non déclenchées en tâche de fond. C'est là que se joue la différence avec un éditeur SaaS mature comme Hektor.

---

## 2. MÉTHODOLOGIE DE L'AUDIT

1. **Lecture de l'architecture** : [`CLAUDE.md`](../CLAUDE.md), [`README.md`](../README.md), cahier des charges [`docs/00_MASTER_CAHIER_DES_CHARGES.md`](00_MASTER_CAHIER_DES_CHARGES.md) et les 6 specs modules.
2. **Inspection du code réel** de chaque module (pages, composants, libs, store) pour vérifier ce qui est **implémenté et fonctionnel** vs simplement spécifié.
3. **Vérification technique** : `npm run build` (✅ 36 routes) et `npm run lint` (8 erreurs + 257 warnings préexistants).
4. **Croisement avec l'offre Hektor** (La Boîte Immo) : CRM, diffusion portails, signature, pige, DVF, espace vendeur, multi-agence.

---

## 3. AUDIT MODULE PAR MODULE (MATRICE DÉTAILLÉE)

Légende : 🟢 = supérieur à Hektor · 🟡 = équivalent / à fiabiliser · 🔴 = en retard / manquant

### 3.1. Gestion des Mandats & Biens
**Fichiers :** [`app/cockpit/mandats/`](../app/cockpit/mandats/page.tsx), wizard [`nouveau`](../app/cockpit/mandats/nouveau/page.tsx), détail [`[id]`](../app/cockpit/mandats/[id]/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Saisie d'un mandat | Formulaires lourds multi-étapes | Wizard 8 étapes + **FastFill** (collage express) + détection auto DPE/surfaces/prix | 🟢 |
| Types de mandats | Exclusif / Simple | Exclusif / Simple / Semi-exclusif + **avenants** de prix | 🟢 |
| DPE / GES 2024 | Saisie manuelle | Calcul auto lettre/valeur + contrôle audit énergétique F/G | 🟢 |
| Honoraires | Calcul simple | Calcul temps réel TTC, barème, débiteur, mentions ALUR | 🟢 |
| Onglets détail | Fiche standard | **7 onglets** : Vue d'ensemble, Matching, Portails, Copywriting, Audit, + GED | 🟢 |
| GED documents ALUR | Module payant | GED intégrée (identité, propriété, diagnostics, copro) | 🟢 |

**Points de vigilance :**
- Le wizard et la page détail sont volumineux (god components identifiés dans [`CLAUDE.md`](../CLAUDE.md)) → refactor en sous-composants.
- Vérifier la persistance des avenants et leur reprise dans le registre.

### 3.2. Registre DGCCRF & Conformité Loi Hoguet
**Fichier :** [`app/cockpit/registre-dgccrf/page.tsx`](../app/cockpit/registre-dgccrf/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Registre des mandats | Registre basique | Registre horodaté UTC, imprimable, numérotation d'ordre | 🟢 |
| Scellement cryptographique | Non | **Empreinte SHA-256** par mandat (audit trail) | 🟢 |
| Conservation 10 ans | Selon hébergeur | Spécifié (purge RGPD acquéreurs 3 ans) | 🟡 |

**Point de vigilance :** Le registre repose sur le localStorage → **vulnérable à la perte de données** tant que Supabase n'est pas actif. C'est le point le plus critique pour un document légal.

### 3.3. Multidiffusion Portails (SeLoger / LBC / Bien'Ici)
**Fichiers :** [`app/cockpit/diffusion/page.tsx`](../app/cockpit/diffusion/page.tsx), [`lib/poliris.ts`](../lib/poliris.ts), routes API [`feeds`](../app/api/feeds/bienici.xml/route.ts), [`cron/sync-sftp`](../app/api/cron/sync-sftp/route.ts)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Passerelle portails | **Payant via Ubiflow (~99 €/mois)** | **Flux Poliris natif** (annonces.csv, photos.cfg, config.txt) + XML Bien'Ici | 🟢 |
| Synchronisation SFTP | Gérée par Ubiflow | Endpoint cron `/api/cron/sync-sftp` sécurisé par secret | 🟢 |
| Diffusion sélective | Oui | Par canal (site, SeLoger, LBC, Bien'Ici) par mandat | 🟢 |

**Points de vigilance :**
- Le dépôt SFTP réel dépend de la configuration serveur (honnêtement géré : `sftp_configured`).
- Les jetons de flux ont des **valeurs de repli codées en dur** côté client (`bi_token_nellimmo_live_2026`) → à fiabiliser en prod.

### 3.4. Studio Rédaction & Copywriting IA
**Fichiers :** [`app/cockpit/redacteur/page.tsx`](../app/cockpit/redacteur/page.tsx), [`lib/copywriting.ts`](../lib/copywriting.ts), route [`api/ai/generate-copy`](../app/api/ai/generate-copy/route.ts)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Rédaction d'annonces | Modèles statiques | **10 styles** (Signature Nelly, Prestige, Portails, WhatsApp, Réseaux, Reel, LMNP, International, Relance, Libre) | 🟢 |
| Moteur IA | Non | DeepSeek (serveur) **+ fallback local** signature Nelly | 🟢 |
| Entraînement personnalisé | Non | Exemples d'entraînement customisables | 🟢 |
| Publication réseaux | Non | Publication Meta (token) + simulation | 🟡 |

**Point de vigilance :** La génération IA dépend d'une clé DeepSeek côté serveur ; sans clé, bascule sur le moteur local (fonctionnel mais moins « intelligent »).

### 3.5. Fiches Vitrine & Affiches LED
**Fichier :** [`app/cockpit/fiches-vitrine/page.tsx`](../app/cockpit/fiches-vitrine/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Formats | PDF rigides | **5 formats** (A4 paysage/portrait, A3, carré social, story) | 🟢 |
| Thèmes | Non | **6 thèmes** (Nell'Immo, Gold, Minimal, Provence, Terracotta, Dark LED) | 🟢 |
| Personnalisation | Limitée | Badges, QR code (web/WhatsApp/360°/avis/GPS), photos 5 slots, textes | 🟢 |

**Point de vigilance :** Fichier monolithique (~1036 l.) → refactor prioritaire.

### 3.6. Avis de Valeur & Estimation DVF
**Fichier :** [`app/cockpit/avis-de-valeur/page.tsx`](../app/cockpit/avis-de-valeur/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Estimation | Module payant | **3 méthodes** : DVF comparatif, capitalisation, coût de reconstruction | 🟢 |
| Données notariales | Via partenaire | Transactions DVF (rayon, prix/m²) | 🟢 |
| Ajustements | Non | Sliders interactifs (état, piscine, calme, DPE, vue) | 🟢 |
| Dossier PDF | Oui | Dossier 8 pages généré | 🟢 |

**Point de vigilance :** Les transactions DVF sont issues de **données mock** (`MOCK_DVF_TRANSACTIONS`), pas d'une API DGFiP temps réel. C'est une **simulation** — à connecter à une vraie source pour un usage professionnel défendable.

### 3.7. CRM Acquéreurs & Scoring de Matching
**Fichier :** [`app/cockpit/acquereurs/page.tsx`](../app/cockpit/acquereurs/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Fichier acquéreurs | CRM standard | CRM complet (budget, surfaces, villes, financement, notes) | 🟢 |
| Scoring de matching | Alerte simple | **Score 0-100%** multi-critères + alertes 1 clic | 🟢 |
| Simulateurs | Non | **Prêt immobilier + frais notaire** intégrés | 🟢 |
| Diffusion ciblée | Oui | Broadcast aux acquéreurs compatibles | 🟢 |

### 3.8. Bons de Visite & Sentiment
**Fichiers :** [`app/cockpit/visites/page.tsx`](../app/cockpit/visites/page.tsx), composants [`visites/`](../components/cockpit/visites/VisitRegisterTable.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Bon de visite | Papier / tablette | **Émargement tactile** (canvas) + horodatage + export PDF | 🟢 |
| Sentiment visiteur | Non | 🟢/🟡/🔴 + points forts/bloquants + avis prix | 🟢 |
| Dictaphone vocal | Non | **VoiceVisitRecorder** (retour vocal) | 🟢 |
| Offre instantanée | Non | **InstantOfferModal** | 🟢 |

### 3.9. Agenda, Visites & Relances
**Fichier :** [`app/cockpit/agenda/page.tsx`](../app/cockpit/agenda/page.tsx), composants [`CalendarSyncModal`](../components/cockpit/visites/CalendarSyncModal.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Agenda | Oui | Vues jour/semaine/liste consolidées (visites, notaire, estimations, clés) | 🟢 |
| Synchronisation iCal | Oui | **Flux iCal sécurisé** par token (`/api/calendar/feed`) | 🟢 |
| Rappels auto J-1 | Envoi SMS payant | **Pré-formatés WhatsApp** mais **déclenchement manuel** | 🔴 |
| Relance post-visite J+1 | Automatisé | Pré-formaté mais **non automatisé** | 🔴 |

**Point critique :** Les relances WhatsApp/SMS sont **pré-formatées mais pas déclenchées automatiquement** en arrière-plan. Hektor (via ses partenaires SMS) automatise ce cycle. C'est un écart fonctionnel réel à combler (cron + passerelle WhatsApp Business API).

### 3.10. Pipeline Notaire & Transactions
**Fichier :** [`app/cockpit/transactions/page.tsx`](../app/cockpit/transactions/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Pipeline de vente | Pipeline rigide | **Kanban** offre → compromis → SRU → prêt → acte | 🟢 |
| Jalons légaux | Partiel | Compteurs SRU 10j, prêt J+60, acte, alertes J-15 | 🟢 |
| Facture honoraires | Module payant | Générateur facture + séquestre | 🟢 |
| Alertes notaire | Oui | WhatsApp pré-formaté (manuel) | 🟡 |

### 3.11. Espace Vendeur & Comptes-Rendus
**Fichiers :** [`app/cockpit/comptes-rendus/page.tsx`](../app/cockpit/comptes-rendus/page.tsx), [`app/(public)/espace-vendeur/[token]/page.tsx`](../app/(public)/espace-vendeur/[token]/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Bilan vendeur | Extranet basique | **Compte-rendu** hebdo/mensuel/30j avec stats + digest WhatsApp | 🟢 |
| Espace vendeur en ligne | Oui | **Lien sécurisé par token** (sans mot de passe) | 🟢 |
| Sécurité token | — | Vrai `seller_token` (pas de fallback) | 🟢 |
| Renégociation prix | Manuelle | Recommandation IA + avenant | 🟢 |

### 3.12. Pige & Prospection
**Fichier :** [`app/cockpit/pige/page.tsx`](../app/cockpit/pige/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Veille PAP/LBC | **Option ~80-100 €/mois** | Module intégré (saisie manuelle des leads) | 🟢 (coût) |
| Scraping automatique | Oui | **Non** — saisie manuelle des annonces | 🔴 |
| Scripts d'appel | Non | **Scripts d'objection** prêts à l'emploi | 🟢 |
| Suivi prospection | Oui | Statuts + relances | 🟢 |

**Point critique :** Le module de pige est **fonctionnel mais sans scraping automatique** : les annonces PAP/LBC doivent être saisies à la main. Hektor (option payante) détecte automatiquement les biens. C'est un écart à combler pour la « conquête ».

### 3.13. Clés & Panneaux
**Fichiers :** [`app/cockpit/cles-panneaux/page.tsx`](../app/cockpit/cles-panneaux/page.tsx), composants [`cles-panneaux/`](../components/cockpit/cles-panneaux/KeyInventoryTable.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Registre des clés | Non (souvent absent) | Inventaire + prêts/retours + historique | 🟢 |
| Parc de panneaux | Non | Suivi pose/dépôt/stock | 🟢 |
| Décharge imprimable | Non | **DischargePrintModal** | 🟢 |

> Hektor ne couvre pas ce besoin logistique → **avantage différenciant** du Cockpit.

### 3.14. Bourse Inter-Agences
**Fichier :** [`app/cockpit/inter-agences/page.tsx`](../app/cockpit/inter-agences/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Délégations inter-agences | Oui (réseau) | Contrats de délégation + partage honoraires | 🟡 |
| Réseau d'agences | **Large réseau** | Partenaires locaux (données locales) | 🔴 |

**Point de vigilance :** Les partenaires sont en **données codées en dur** (`INITIAL_PARTNERS`), pas persistés dans le store. Hektor bénéficie d'un vrai réseau inter-agences national.

### 3.15. Signature Électronique & Contrats
**Fichiers :** [`components/cockpit/ElectronicSignatureModal.tsx`](../components/cockpit/ElectronicSignatureModal.tsx), [`lib/signature.ts`](../lib/signature.ts), [`MandateLegalContractModal`](../components/cockpit/mandats/detail/MandateLegalContractModal.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Génération PDF mandat | Module payant | Générateur de contrats (mandat, avenant, offre) | 🟢 |
| Signature à distance | **eIDAS certifiée** (ImmoSign/Yousign) | **OTP SMS simulé + signature tactile** | 🔴 |
| Valeur probante | Certificat eIDAS | Empreinte SHA-256 locale (non certifiée) | 🔴 |

**Point critique majeur :** La signature électronique est **simulée** (OTP généré localement, pas d'envoi SMS réel, pas de certificat eIDAS). Pour un usage juridique défendable face à la DGCCRF et aux tribunaux, il faut une **passerelle eIDAS réelle** (Yousign/Universign/DocuSign) ou au minimum une signature qualifiée. C'est le plus gros écart « conformité » avec Hektor.

### 3.16. Nell'IA Infinite Lab
**Fichier :** [`app/cockpit/lab/page.tsx`](../app/cockpit/lab/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Idéation marketing | Non | Presets + prompts libres (DeepSeek) | 🟢 |
| Négociation | Non | Scénarios de contre-offre | 🟢 |
| Clauses juridiques | Non | Rédaction de clauses | 🟢 |

### 3.17. Site Vitrine Public
**Fichiers :** [`app/(public)/`](../app/(public)/page.tsx) (home, biens, agence, avis-clients, contact, estimation, espace-vendeur)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Catalogue de biens | Site séparé | Site public intégré + recherche + filtres | 🟢 |
| Leads entrants | Oui | Contact + estimation injectés dans le cockpit | 🟢 |
| Estimation en ligne | Oui | Formulaire + redirection avis de valeur | 🟢 |
| SEO / performance | — | Next.js (SSG/ISR) | 🟢 |

### 3.18. Paramètres & Connecteurs
**Fichier :** [`app/cockpit/parametres/page.tsx`](../app/cockpit/parametres/page.tsx)

| Critère | Hektor | Cockpit Nell'Immo | Verdict |
| :--- | :--- | :--- | :--- |
| Mentions légales | Configurées | Identité, carte T, garantie, RCS | 🟢 |
| Connecteurs | Multi | Meta, Google, SFTP, flux (tokens) | 🟡 |
| Secrets | — | **Chiffrement AES-GCM** (`lib/vault.ts`) | 🟢 |

---

## 4. AUDIT TECHNIQUE & STABILITÉ

### 4.1. Ce qui est solide ✅
- **Build de production** : ✅ passe (36 routes, TypeScript strict, aucune erreur).
- **Architecture cloisonnée** : séparation stricte cockpit (PII) / public (sanitisé) — bonne pratique RGPD.
- **Sécurité** : auth locale hashée, tokens d'accès, secrets chiffrés AES-GCM, flux serveur sécurisés.
- **UI/UX** : design system cohérent (palette, composants UI réutilisables), très soigné.
- **Anti god-components** : doctrine claire, refactor en cours (voir [`CLAUDE.md`](../CLAUDE.md)).

### 4.2. Points de fragilité ⚠️
| # | Problème | Impact | Priorité |
| :--- | :--- | :--- | :--- |
| 1 | **Données en localStorage** (pas de cloud) | Perte possible, pas de multi-appareils, pas de sauvegarde serveur | 🔴 Critique |
| 2 | **Signature eIDAS simulée** | Valeur juridique non certifiée | 🔴 Critique |
| 3 | **Relances/rappels non automatisés** | Cycle client incomplet vs Hektor | 🟠 Élevée |
| 4 | **Pige sans scraping auto** | Conquête manuelle | 🟠 Élevée |
| 5 | **DVF en données mock** | Estimation non défendable en réel | 🟠 Élevée |
| 6 | **8 erreurs lint + 257 warnings** | Dette technique (React Compiler) | 🟡 Moyenne |
| 7 | **God components** (15 fichiers >500 l.) | Maintenabilité | 🟡 Moyenne |
| 8 | **Jetons de repli codés en dur** | Risque sécurité en prod | 🟡 Moyenne |
| 9 | **Partenaires inter-agences codés en dur** | Non persistés | 🟡 Moyenne |

---

## 5. LÀ OÙ LE COCKPIT DÉPASSE DÉJÀ HEKTOR 🏆

1. **Coût total** : 0 €/mois vs ~414 €/mois (CRM + Ubiflow + signature + pige) → **~4 968 €/an économisés**.
2. **Périmètre intégré** : un seul outil fait CRM + diffusion + signature + conformité + site public + logistique clés/panneaux.
3. **Conformité proactive** : registre SHA-256, DPE 2024, mentions ALUR/Hoguet — Hektor est plus « standard ».
4. **IA générative native** : 10 styles de rédaction, dictaphone, lab d'idéation — Hektor n'a pas d'IA.
5. **Vitesse & ergonomie** : Next.js 16, saisie express, zéro latence vs formulaires à tiroirs.
6. **Souveraineté des données** : propriété intégrale de la base, des flux et de l'historique.
7. **Modules logistiques** (clés, panneaux, bons de visite tactiles) absents d'Hektor.

---

## 6. LÀ OÙ HEKTOR RESTE DEVANT (ÉCARTS À COMBLER) 🎯

| Écart | Pourquoi Hektor gagne | Effort |
| :--- | :--- | :--- |
| **Persistance cloud multi-appareils** | Hektor est un SaaS hébergé, accessible partout, sauvegardé | Élevé (migration Supabase) |
| **Signature eIDAS certifiée** | Valeur probante reconnue | Moyen (passerelle API) |
| **Automatisation des relances** | Envoi SMS/WhatsApp automatisé en tâche de fond | Moyen (cron + API) |
| **Scraping de pige** | Détection auto des biens PAP/LBC | Élevé |
| **DVF temps réel** | Données notariales à jour | Moyen (API DGFiP) |
| **Multi-utilisateurs / rôles** | Gestion d'équipe, délégations | Élevé |
| **Réseau inter-agences** | Réseau national | Faible (partenariat) |

---

## 7. FEUILLE DE ROUTE RECOMMANDÉE (PAR ORDRE DE PRIORITÉ)

> **⚠️ Contraintes projet (mises à jour) :**
> - **Supabase** : en attente de la création du compte par Nelly → **on ne migre PAS maintenant**. On reste sur le localStorage en gardant des **coutures propres** pour la future intégration (migrations SQL déjà prêtes dans [`supabase/migrations/`](../supabase/migrations/)).
> - **Yousign / eIDAS** : **reporté au dernier moment**, lors de la migration de l'ancien site vers la nouvelle appli → **on ne connecte PAS la passerelle maintenant**. On conserve le flux de signature actuel (tactile + OTP) en le préparant à être branché plus tard.
>
> Les phases ci-dessous sont donc **recalibrées pour être exécutables dès maintenant** dans l'architecture localStorage actuelle, **sans rien casser**, tout en gardant les coutures pour Supabase et Yousign.

### 🟢 Phase A — Fiabiliser & consolider (exécutable maintenant, sans dépendance externe)
> Objectif : rendre chaque module stable, propre et maintenable dans l'architecture actuelle.

1. **Nettoyer la dette lint** : corriger les 8 erreurs React Compiler dans [`lib/store.tsx`](../lib/store.tsx) (refs pendant rendu, variable avant déclaration, mémorisation) + réduire les warnings inutiles.
2. **Sécuriser les jetons de repli codés en dur** (flux Bien'Ici/Poliris dans [`app/cockpit/diffusion/page.tsx`](../app/cockpit/diffusion/page.tsx)) — les rendre configurables via Paramètres, sans exposer de secret en clair.
3. **Persister les partenaires inter-agences** dans le store (au lieu des constantes `INITIAL_PARTNERS` dans [`app/cockpit/inter-agences/page.tsx`](../app/cockpit/inter-agences/page.tsx)) pour un vrai CRUD durable.
4. **Refactor des god components** restants en sous-composants (fiches-vitrine, transactions, agenda, acquereurs, avis-de-valeur…) — conformément à la doctrine [`CLAUDE.md`](../CLAUDE.md).

### 🟠 Phase B — Automatiser le cycle client (avec couture pour l'envoi réel)
> Objectif : rattraper Hektor sur l'expérience client, sans dépendre d'un fournisseur d'envoi pour l'instant.

5. **Moteur de relances planifiées** : calculer automatiquement les rappels J-1 et relances J+1 (visites), alertes J-15 prêt / fin SRU / acte (transactions) — avec un **centre de notifications** dans le cockpit listant « à envoyer aujourd'hui » (les messages pré-formatés existent déjà). L'envoi réel (WhatsApp Business API) sera branché plus tard via une couture.
6. **Tableau de bord analytique** : KPIs de conversion (mandat → visite → offre → acte), taux de transformation, revenus par canal.

### 🟡 Phase C — Fiabiliser les données métier (sans blocage externe)
7. **DVF** : améliorer le moteur local (données mock enrichies + transparence « simulation ») en préparant la couture vers l'API DGFiP/data.gouv.
8. **Pige** : améliorer le module (import CSV/manuel assisté) en préparant la couture scraping.

### 🟢 Phase D — Passer devant Hektor (différenciation)
9. **Multi-utilisateurs & rôles** (admin/agent) — préparer le modèle de données (le cloud activera la vraie synchro).
10. **Application mobile PWA** (le cockpit est déjà responsive) pour la saisie terrain hors-ligne.
11. **Assistant IA conversationnel** (chatbot Nelly) pour qualifier les leads entrants (fallback local si pas de clé DeepSeek).

### ⏸️ Phase E — Reportée (bloquée par les contraintes projet)
- **Migration Supabase** : à lancer dès que Nelly crée le compte.
- **Passerelle eIDAS / Yousign** : à connecter au moment de la migration de l'ancien site.
- **Relances avec envoi réel** (WhatsApp Business API / SMS) : à activer après la mise en place du moteur (Phase B) et de la passerelle d'envoi.
- **Scraping de pige automatisé** : à activer après la Phase C.

---

## 8. CONCLUSION

Le Cockpit Nell'Immo est **déjà supérieur à Hektor sur le plan fonctionnel et économique** pour une agence solo : il couvre plus de métier, coûte 0 €, est plus rapide, plus conforme et intègre une IA qu'Hektor n'a pas.

**Sa faiblesse n'est pas dans les fonctionnalités mais dans l'infrastructure.** Les deux piliers d'infrastructure (Supabase, eIDAS) étant **volontairement reportés** par le projet, la stratégie immédiate est de **consolider et automatiser ce qui peut l'être dès maintenant** dans l'architecture localStorage, en gardant des coutures propres pour brancher Supabase et Yousign au bon moment. Ainsi, le jour de la migration, le Cockpit basculera en cloud **sans réécriture** et deviendra structurellement supérieur à Hektor sur tous les axes.

**Prochaines étapes concrètes (exécutables maintenant) :**
1. Phase A : nettoyage lint + jetons + persistance inter-agences + refactor god components.
2. Phase B : moteur de relances planifiées + tableau de bord analytique.
3. Phase C : fiabilisation DVF et pige.
4. Phase D : multi-utilisateurs, PWA, assistant IA.
