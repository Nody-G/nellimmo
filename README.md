# Nell'Immo Cockpit v2.0 🏡

Système d'exploitation transactionnel et cockpit de gestion immobilière autonome pour l'agence **SASU NELL'IMMO** (Pélissanne & Pays Salonais, Provence).

---

## 🌟 Fonctionnalités Principales

- **Conformité Légale & DGCCRF** : Registre officiel des mandats scellé par empreinte cryptographique SHA-256 (Loi Hoguet décret 72-678, Loi ALUR, Loi Climat & Résilience).
- **Multidiffusion Sans Intermédiaire** : Génération de flux Poliris 4.08 (`annonces.csv`, `photos.cfg`, `config.txt`) pour SeLoger et LeBonCoin, et flux XML standardisé pour Bien'ici.
- **Studio de Rédaction & Copywriting** : 5 styles de rédaction automatique d'annonces (Signature Nelly provençale, Prestige, Portails SEO/ALUR, Pitchs WhatsApp, Réseaux Sociaux).
- **Avis de Valeur & DVF Notaires** : Exploitation des données de transactions notariales DGFiP dans un rayon de 500m et génération de dossiers d'estimation 8 pages.
- **CRM Acquéreurs & Scoring de Matching** : Suivi de recherche avec calcul de compatibilité automatique (0 à 100%) et déclenchement d'alertes en 1 clic.
- **Bons de Visite Électroniques** : Émargement tactile sur tablette/smartphone avec horodatage certifié et export PDF.
- **Affiches Vitrine LED & Fiches Visite** : Moteur de mise en page haute définition (A4 Paysage, A4 Portrait, A3).
- **Site Vitrine Public Intégré** : Catalogue de biens, formulaire d'estimation et contact direct avec injection en temps réel dans le Cockpit.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- npm ou yarn

### Installation & Lancement

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement local
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000) (Site public) et [http://localhost:3000/cockpit](http://localhost:3000/cockpit) (Cockpit d'administration).

---

## 🗄️ Stockage & Base de Données (Hybride)

1. **Mode Local (`localStorage`)** : Actif par défaut sans configuration, persistant dans le navigateur avec jeu de données certifié.
2. **Mode Cloud PostgreSQL (Supabase)** : Activez la synchronisation temps réel WebSocket et le stockage cloud en renseignant `.env.local` (voir le guide complet dans [`supabase/MIGRATION_GUIDE.md`](supabase/MIGRATION_GUIDE.md)).
