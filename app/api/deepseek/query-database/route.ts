import { NextRequest, NextResponse } from 'next/server';
import { executeDeepSeekCall } from '@/lib/deepseek/server';

const DATABASE_COLLECTION_DEFINITIONS = `
1. "properties": Mandats de vente et biens immobiliers (mandate_number, mandate_type ['exclusif', 'simple', 'semi-exclusif'], price_fai, price_net_seller, city, postal_code, property_type ['maison', 'appartement', 'terrain', 'immeuble'], rooms_count, bedrooms_count, living_area, land_area, dpe_letter ['A','B','C','D','E','F','G'], status ['brouillon', 'actif', 'sous_compromis', 'vendu', 'archive']).
2. "buyers": Acquéreurs en recherche active (first_name, last_name, budget_max, target_cities, target_property_types, min_surface, min_rooms, financing_status ['comptant', 'accord_bancaire_valide', 'etude_courtier', 'en_attente'], status ['actif', 'en_pause', 'projet_abouti', 'archive']).
3. "visits": Bons de visite effectués (visit_date, property_id, buyer_id, notes).
4. "transactions": Dossiers de vente notaires / compromis / actes (deal_ref, status, sale_price, notary_name, compromise_date, deed_date).
5. "prospectingLeads": Pige immobilière et prospection PAP (source, seller_name, phone, price_asked, living_area, city, dvf_gap_percentage, status).
6. "contacts": Carnet d'adresses unifié 360° (first_name, last_name, role ['notaire', 'courtier', 'diagnostiqueur', 'artisan', 'acquereur', 'vendeur'], company, city, phone, email).
7. "keys": Trousseaux de clés d'agence (key_number, property_title, status ['disponible', 'empruntee', 'perdue']).
8. "signboards": Panneaux publicitaires sur le terrain (sign_number, location_address, sign_type, status).
9. "avenants": Avenants aux mandats (mandate_number, type, old_value, new_value, status).
10. "proposals": Offres d'achat reçues (amount, status, buyer_name, conditions).
11. "vendorReports": Comptes-rendus hebdomadaires aux vendeurs (property_title, period_start, views_count, visits_count).
12. "auditLogs": Registre des modifications réglementaires Loi ALUR (mandate_number, action_type, logged_at).
`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Requête vide' },
        { status: 400 }
      );
    }

    const systemPrompt = `Tu es l'analyste de base de données ultra-sécurisé du CRM immobilier Cockpit Nellimo.
Ta mission : convertir la demande en langage naturel de Nelly en un plan de filtrage structuré en JSON STRICT.

Voici les 12 collections principales disponibles dans la base :
${DATABASE_COLLECTION_DEFINITIONS}

DIRECTIVES :
1. Identifie la collection principale concernée ("targetCollection").
2. Détermine les filtres à appliquer sous forme d'un tableau "filters" d'objets :
   - "field": nom du champ (ex: "price_fai", "city", "dpe_letter", "budget_max", "financing_status", etc.)
   - "operator": "equals" | "contains" | "greater_than" | "less_than" | "in"
   - "value": valeur cible (nombre, texte ou tableau)
3. "summary": Résumé en une phrase élégante en français de ce que le filtre recherche.
4. "suggestedKeywords": Mots-clés pertinents pour une recherche textuelle directe si applicable.

Réponds UNIQUEMENT avec un JSON valide :
{
  "targetCollection": "properties" | "buyers" | "visits" | "transactions" | "prospectingLeads" | "contacts" | "keys" | "signboards" | "avenants" | "proposals" | "vendorReports" | "auditLogs",
  "filters": [
    { "field": string, "operator": "equals" | "contains" | "greater_than" | "less_than" | "in", "value": any }
  ],
  "summary": string,
  "suggestedKeywords": string
}`;

    const dsResult = await executeDeepSeekCall({
      feature: 'database_query',
      featureLabel: `Requête base : "${query.slice(0, 40)}..."`,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      model: 'deepseek-v4-flash',
      temperature: 0.2,
      maxTokens: 1000,
      responseFormat: { type: 'json_object' },
      req,
    });

    if (!dsResult.success || !dsResult.content) {
      return NextResponse.json({
        success: false,
        fallback: true,
        log: dsResult.log,
        message: 'Impossible de joindre DeepSeek V4 Flash. Utilisez les filtres manuels.',
      });
    }

    let parsed = null;
    try {
      parsed = JSON.parse(dsResult.content);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Format de réponse non conforme',
        log: dsResult.log,
      });
    }

    return NextResponse.json({
      success: true,
      queryPlan: parsed,
      log: dsResult.log,
    });
  } catch (err) {
    console.error('Error in query-database route:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
