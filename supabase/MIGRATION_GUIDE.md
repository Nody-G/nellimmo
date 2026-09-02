# Guide de Migration Supabase Clé-en-Main (Temps Réel & PostgreSQL)

Ce guide décrit la procédure simple en **3 étapes** pour basculer l'ensemble de **Nell'Immo Cockpit** sur Supabase (PostgreSQL managé, abonnements temps réel WebSocket, et stockage médias).

---

## Architecture Prête à l'Emploi

L'application intègre désormais une architecture **hybride et réactive** :
- **Sans Supabase configuré** : L'application fonctionne instantanément sur `localStorage` avec persistance locale et scellement SHA-256 (mode actuel).
- **Dès que Supabase est renseigné** : L'application se connecte automatiquement à PostgreSQL, synchronise toutes les données et écoute les événements en **temps réel** (WebSocket `postgres_changes`). Toute mise à jour effectuée sur un appareil (ou message envoyé par un client sur le site vitrine) est immédiatement répercutée sur tous les écrans connectés **sans rechargement**.

---

## Étape 1 : Créer le projet Supabase

1. Rendez-vous sur [supabase.com](https://supabase.com) et créez un nouveau projet (ex: `nellimo-cockpit-db`).
2. Choisissez la région la plus proche de la Provence (**EU West - Paris / Frankfurt**).
3. Définissez votre mot de passe de base de données.

---

## Étape 2 : Exécuter le Schéma & les Données de Test

1. Dans votre tableau de bord Supabase, ouvrez l'onglet **SQL Editor** dans le menu de gauche.
2. Ouvrez le fichier local [`supabase/migrations/20260902_init_nellimo.sql`](file:///c:/Users/Niels/Documents/Projects%20Antigravity/Cockpit%20Nellimo/supabase/migrations/20260902_init_nellimo.sql), copiez son contenu complet et collez-le dans le SQL Editor.
3. Cliquez sur **Run** (Création des tables, des index, des politiques RLS et de la publication Realtime).
4. *(Optionnel)* Ouvrez le fichier [`supabase/seed.sql`](file:///c:/Users/Niels/Documents/Projects%20Antigravity/Cockpit%20Nellimo/supabase/seed.sql), collez-le et cliquez sur **Run** pour injecter le jeu de données initial certifié de Nelly Fernandez.

---

## Étape 3 : Renseigner les Variables d'Environnement

1. Dans Supabase, allez dans **Project Settings > API**.
2. Copiez l'**URL du projet** et la **clé publique `anon`**.
3. Dans votre projet local, créez ou éditez le fichier `.env.local` :

```env
# URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-id-projet.supabase.co

# Clé API Publique (Anon Key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Relancez l'application (`npm run dev` ou `npm run build`).

**C'est tout !** L'application détectera automatiquement la configuration et basculera immédiatement en mode PostgreSQL Cloud + Realtime.
