# SPÉCIFICATION MODULE 02 : ESPACE VENDEUR & COMPTES-RENDUS AUTOMATISÉS
## VALORISATION DU MANDAT EXCLUSIF & PILOTAGE DE LA RELATION MANDANT

---

## 1. OBJECTIFS DU MODULE
1. **Transformer le propriétaire en ambassadeur** grâce à une transparence totale sur les actions menées par l'agence.
2. **Justifier le mandat exclusif** : Le propriétaire voit en temps réel la diffusion sur SeLoger, LeBonCoin, Bien'Ici et les retours qualifiés des visiteurs.
3. **Faciliter la renégociation de prix** : Si un bien ne se vend pas après 30 jours, un rapport statistique généré par IA compile objectivement les retours négatifs (« *Prix trop élevé par rapport aux travaux nécessaires* ») pour acter un avenant de baisse de prix sans conflit.

---

## 2. COMPOSANTS FONCTIONNELS CLÉS

### 2.1. Le Compte-Rendu de Visite Immédiat (Micro-bilan post-visite)
- Dès la fin d'une visite, Nelly peut saisir en 30 secondes sur son smartphone :
  - **Nom de l'acquéreur** & statut de financement.
  - **Appréciation globale** : 🟢 Coup de cœur / Offre en préparation | 🟡 Intéressé mais hésitant | 🔴 Pas de suite.
  - **Points forts relevés** : « Lumineux, beau jardin, piscine impeccable ».
  - **Points bloquants** : « Chambres à l'étage un peu petites, cuisine à moderniser ».
  - **Avis sur le prix** : « Prix jugé 20 000 € au-dessus du marché ».
- Un bouton permet d'envoyer instantanément une notification WhatsApp élégante au propriétaire mandant :  
  *« Bonjour M. Laurent, je viens de terminer la visite avec M. Lefebvre pour votre maison. Il a beaucoup apprécié la vue et la terrasse. Je vous fais un point complet dès réception de son retour définitif. Belle fin de journée, Nelly. »*

### 2.2. Le Bilan Mensuel de Commercialisation (Génération PDF / Web)
- Un document PDF haute définition généré en 1 clic regroupant :
  - **Audience & Visibilité de l'annonce** :
    - Nombre de consultations sur SeLoger, LeBonCoin, Bien'Ici et nellimmo.fr.
    - Nombre de contacts et demandes de renseignements générés.
  - **Synthèse des Visites** :
    - Graphique camembert des avis (Coup de cœur / Neutre / Négatif).
    - Verbatim anonymisé des visiteurs.
  - **Positionnement Concurrentiel DVF du Marché** :
    - Liste des biens vendus récemment sur la même commune avec prix au m² réels.
  - **Recommandation Stratégique de l'Agence** :
    - Proposition d'avenant de prix ou relance ciblée sur le fichier d'acquéreurs chauds.

### 2.3. L'Espace Vendeur en Ligne (Lien Sécurisé sans Mot de Passe)
- Le propriétaire reçoit un lien unique protégé par token (`https://www.nellimmo.fr/espace-vendeur?token=...`) consultable sur mobile sans créer de compte.
- Il peut y retrouver :
  - L'état de validité de son mandat et son numéro d'ordre officiel.
  - La galerie photo HD et la visite virtuelle 360°.
  - L'historique complet des visites et offres reçues.
  - Les liens directs vers ses annonces publiées sur SeLoger et LeBonCoin.

---

## 3. MODÈLE DE DONNÉES

```sql
CREATE TABLE vendor_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    report_period VARCHAR(50), -- 'hebdomadaire', 'mensuel', 'bilan_30_jours'
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Statistiques d'audience
    views_seloger INT DEFAULT 0,
    views_leboncoin INT DEFAULT 0,
    views_bienici INT DEFAULT 0,
    views_website INT DEFAULT 0,
    total_leads_count INT DEFAULT 0,
    
    -- Visites
    visits_count INT DEFAULT 0,
    positive_feedbacks_count INT DEFAULT 0,
    neutral_feedbacks_count INT DEFAULT 0,
    negative_feedbacks_count INT DEFAULT 0,
    
    -- Synthèse & Conseil IA
    executive_summary TEXT,
    price_recommendation_text TEXT,
    suggested_price_adjustment NUMERIC,
    
    -- Partage
    shared_via_whatsapp BOOLEAN DEFAULT false,
    shared_via_email BOOLEAN DEFAULT false,
    viewed_by_seller_at TIMESTAMP WITH TIME ZONE
);
```
