# SPÉCIFICATION MODULE 06 : ARCHITECTURE TECHNIQUE & SÉCURITÉ
## STACK NEXT.JS 16, SUPABASE, FLUX POLIRIS SFTP & CONFORMITÉ RGPD

---

## 1. CARTOGRAPHIE TECHNOLOGIQUE DE RÉFÉRENCE

```
[ FRONTEND & UI ]
Next.js 16 (App Router + Turbopack) + React 19
Tailwind CSS v4 (Zero-runtime, Glassmorphism, Theme Nell'Immo)
Lucide Icons + Command Palette (Ctrl+K)

[ LOGIQUE MÉTIER IMMOBILIÈRE ]
lib/hoguet.ts       -> Moteur légal (Loi ALUR, Loi Hoguet, DPE 2024, DVF)
lib/poliris.ts      -> Générateur officiel de flux SeLoger Poliris XML / CSV
lib/hektor.ts       -> Moteur d'ingestion et de parsing universel Hektor
lib/copywriting.ts  -> Moteur IA DeepSeek + Fallback local signature Nelly

[ PERSISTANCE & SÉCURITÉ ]
Supabase PostgreSQL 15 + Row Level Security (RLS)
Client-side LocalStorage v5 (Mode hors-ligne résilient)
Scellement SHA-256 horodaté pour le registre légal DGCCRF
```

---

## 2. SPÉCIFICATIONS DES FLUX DE MULTIDIFFUSION PORTAILS

### 2.1. Passerelle Poliris XML 3.1 & 4.0 (SeLoger / Logic-Immo)
- **Fichiers obligatoires générés** :
  - `annonces.csv` : Délimité par des points-virgules, encodé en Windows-1252 ou UTF-8 avec BOM, contenant les 38 colonnes standards de la norme Poliris.
  - `photos.cfg` : Table de correspondance entre le numéro de mandat et les URLs d'images haute résolution ordonnées.
  - `config.txt` : Paramètres d'agence (Code agence `NEL13`, version de passerelle `4.00`).
- **Synchronisation SFTP automatisée** :
  - Endpoint `/api/cron/sync-sftp` exécutable automatiquement toutes les 6 heures ou par appel de webhook direct.

### 2.2. Flux XML Bien'Ici & LeBonCoin
- Endpoint `/api/feeds/bienici.xml` conforme au schéma XML normalisé Bien'Ici (avec géocodage à la commune ou à l'adresse, visite virtuelle 360° Matterport et liens vidéo YouTube).

---

## 3. PROTOCOLE DE SCELLEMENT CRYPTOGRAPHIQUE SHA-256

Pour garantir l'inviolabilité du registre des mandats face aux contrôles de la **DGCCRF** :
1. Chaque création ou modification de mandat génère une chaîne canonique :  
   `STRING_TO_HASH = {mandate_number}|{mandate_type}|{mandate_date}|{mandate_end_date}|{price_fai}|{price_net_seller}|{seller_name}|{title}|{timestamp_utc}`
2. L'application calcule le hachage cryptographique **SHA-256** :  
   `HASH = SHA256(STRING_TO_HASH)`
3. Le hash est inscrit de manière immuable dans la table `mandate_audit_logs`.

---

## 4. CONFORMITÉ RGPD & PROTECTION DES DONNÉES PERSONNELLES

1. **Durée de conservation** :
   - Fiches mandats & registres : **10 ans** (Obligation légale décret 72-678).
   - Coordonnées acquéreurs sans contact actif : Purge ou anonymisation automatique après **3 ans**.
2. **Droit d'accès et d'effacement** :
   - Export universel des données client au format JSON en 1 clic.
   - Suppression sécurisée des leads avec purge en cascade.
