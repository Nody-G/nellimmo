# SPÉCIFICATION MODULE 04 : AGENDA DES VISITES & RELANCES WHATSAPP
## ZÉRO RENDEZ-VOUS MANQUÉ & EXPÉRIENCE CLIENT FLUIDE

---

## 1. OBJECTIFS DU MODULE
1. **Éliminer les "No-Shows" (lapins)** grâce à un système de confirmation et de rappel automatique la veille du rendez-vous.
2. **Fournir un itinéraire GPS direct** aux acheteurs pour éviter qu'ils ne se perdent dans les ruelles ou les collines du Pays Salonais.
3. **Automatiser le recueil d'avis post-visite** dès le lendemain matin à 10h00 pour alimenter le compte-rendu vendeur sans effort.

---

## 2. CHRONOLOGIE DU CYCLE DE VISITE

```
Prise de Rendez-vous (Cockpit ou Téléphone)
       │
       ▼
[Envoi Instantané] : WhatsApp / SMS de Confirmation + Lien Google Maps + Fiche PDF
       │
       ▼
[J-1 à 18h00] : SMS / WhatsApp de Rappel Automatique (« Êtes-vous toujours disponible demain à 14h ? »)
       │
       ▼
[Jour J - Heure de Visite] : Signature du Bon de Visite numérique sur écran tactile
       │
       ▼
[Jour J+1 à 10h00] : Message de Suivi / Recueil des impressions acquéreur
```

---

## 3. MODÈLE DE MESSAGES WHATSAPP PRÉ-FORMATÉS

### Message 1 : Confirmation Immédiate de Prise de RDV
> *« Bonjour [Prénom Acquéreur], c'est Nelly Fernandez de l'agence Nell'Immo.*  
> *Je vous confirme notre visite pour la [Type de bien] à [Ville] le **[Date] à [Heure]**.*  
> *📍 Point de rendez-vous : [Adresse ou Point GPS Google Maps]*  
> *Vous pouvez consulter la fiche de présentation en cliquant ici : [Lien Fiche]*  
> *À très bientôt ! »*

### Message 2 : Rappel la Veille (J-1 à 18h00)
> *« Bonsoir [Prénom], petit rappel pour notre visite de demain à **[Heure]** pour la propriété à [Ville].*  
> *Merci de me confirmer si le créneau vous convient toujours en répondant à ce message.*  
> *Nelly Fernandez — 07 55 68 61 09. »*

### Message 3 : Recueil de Retour Post-Visite (J+1 à 10h00)
> *« Bonjour [Prénom], j'espère que vous allez bien.*  
> *Avez-vous eu le temps de mûrir votre ressenti suite à notre visite d'hier à [Ville] ?*  
> *Avez-vous des questions complémentaires sur la maison ou le quartier ? Je reste à votre écoute ! »*

---

## 4. SYNCHRONISATION CALENDRIER (iCal / Google Calendar)

- **Flux iCal Sécurisé** : L'agent dispose d'une URL de flux calendrier privé (`https://www.nellimmo.fr/api/calendar/feed?token=...`) à synchroniser dans l'application Calendrier de son iPhone ou Google Agenda.
- Toute nouvelle visite créée dans Cockpit apparaît instantanément sur l'agenda mobile avec le numéro de téléphone cliquable de l'acquéreur et l'itinéraire GPS Waze / Google Maps.

---

## 5. MODÈLE DE DONNÉES

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    
    appointment_type VARCHAR(50) DEFAULT 'visite', -- 'visite', 'contre_visite', 'rdv_estimation', 'signature_compromis', 'visite_notaire'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_point TEXT, -- Adresse exacte ou point de repère
    
    status VARCHAR(50) DEFAULT 'planifie', -- 'planifie', 'confirme_par_client', 'effectue', 'annule', 'absent'
    
    -- Triggers & Notifications
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    followup_sent_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```
