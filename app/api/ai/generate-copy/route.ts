import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/lib/types';
import { generateListingCopy, CopywritingStyle } from '@/lib/copywriting';
import { INITIAL_PROPERTIES } from '@/lib/mock-data';

// Exemples réels authentiques de Nelly Fernandez extraits de la base
const NELLY_FEW_SHOT_CORPUS = INITIAL_PROPERTIES
  .slice(0, 4)
  .map((p, idx) => `[EXEMPLE DE RÉFÉRENCE ${idx + 1} - MANDAT ${p.mandate_number} (${p.city})] :\n${p.description}`)
  .join('\n\n---\n\n');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      property,
      style = 'signature_nelly',
      customNotes = '',
      apiKey = '',
    }: {
      property: Partial<Property>;
      style: CopywritingStyle;
      customNotes?: string;
      apiKey?: string;
    } = body;

    const effectiveApiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';

    // Si aucune clé DeepSeek n'est disponible, bascule automatique sur le moteur local haute fidélité
    if (!effectiveApiKey) {
      const fallbackText = generateListingCopy(property, style, customNotes);
      return NextResponse.json({
        success: true,
        text: fallbackText,
        source: 'local_template',
        message: 'Généré avec le moteur local certifié (renseignez votre clé DeepSeek pour la génération IA neurale directe).',
      });
    }

    // Construction du prompt système avec apprentissage Few-Shot
    const systemPrompt = `Tu es l'assistant de rédaction exclusif de Nelly FERNANDEZ, Agent Immobilier Indépendant et Présidente de la SASU NELL'IMMO, basée à Pélissanne (13330) dans le Pays Salonais (Provence).

DIRECTIVES DE STYLE & PLUME AUTHENTIQUE DE NELLY :
1. Ton chaleureux, bienveillant, enthousiaste et profondément humain. Tu valorises l'émotion, le coup de cœur, la lumière naturelle ("divine lumière", "baignée de clarté"), la sérénité ("calme absolu", "impasse paisible"), et les moments partagés en famille ("espace farniente", "cuisine d'été conviviale").
2. Vocabulaire élégant et précis : décris fidèlement les volumes, matériaux (béton ciré, travertin, aluminium, climatisation réversible, pompe à chaleur), la disposition intérieure et les extérieurs arborés.
3. RÈGLE STRICTE : Ne JAMAIS utiliser le terme "négociatrice" ou "négociateur". Utilise toujours "agent immobilier indépendant" ou "Présidente de la SASU NELL'IMMO".
4. RÈGLE DPE : Le DPE doit être mentionné sous forme textuelle claire au sein de l'annonce (ex: DPE : Classe X (Y kWh/m²/an)), jamais comme un badge.
5. Bloc réglementaire final obligatoire (Loi ALUR, Loi Hoguet & Géorisques) :
   - Mention Géorisques (www.georisques.gouv.fr).
   - Décomposition du prix FAI, du pourcentage d'honoraires TTC et de la charge (Vendeur ou Acquéreur).
   - Référence du mandat (ex: Mandat ${property.mandate_number || 'Exclusif'}).
   - Carte Pro CPI 1310 2019 000 042 974 (CCI Marseille Provence).
   - SASU NELL'IMMO au capital de 2000€, RCS Salon-de-Provence n° 853 807 006, Siège : 26 avenue des Enjouvènes 13330 Pélissanne.
   - Contact : Tél 07 55 68 61 09 | Email nellimmo.acte@gmail.com | Site www.nellimmo.fr.

Voici des exemples réels de rédactions écrites par Nelly Fernandez sur ses mandats vendus :
${NELLY_FEW_SHOT_CORPUS}`;

    const userPrompt = `Rédige une annonce immobilière complète pour le bien suivant :
- Type de bien : ${property.property_type || 'Maison'}
- Titre / Accroche : ${property.title || 'Propriété en Provence'}
- Localisation : ${property.city || 'Pélissanne'} (${property.postal_code || '13330'})
- Surface habitable : ${property.living_area || 0} m² ${property.land_area ? `sur un terrain de ${property.land_area} m²` : ''}
- Nombre de pièces : ${property.rooms_count || 0} pièces (${property.bedrooms_count || 0} chambres)
- Prix FAI : ${property.price_fai ? `${property.price_fai.toLocaleString('fr-FR')} €` : 'Sur demande'}
- Honoraires : ${property.agency_fees_percentage || 3.9}% TTC charge ${property.fees_paid_by || 'vendeur'}
- DPE : Classe ${property.dpe_letter || 'en cours'} (${property.dpe_value || '-'} kWh/m²/an) | GES : Classe ${property.ges_letter || 'en cours'}
- Prestations / Équipements : ${(property.features || []).join(', ') || 'Aucune précision'}
- Particularités & Notes de Nelly : ${customNotes || 'Aucune note supplémentaire'}
- Format / Style demandé : ${style} (si réseaux sociaux ou pitch whatsapp, adapte la longueur tout en conservant les coordonnées de Nelly).`;

    // Appel direct à l'API DeepSeek Chat
    const deepseekRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!deepseekRes.ok) {
      const errText = await deepseekRes.text();
      console.error('DeepSeek API Error:', errText);
      // Fallback local en cas d'erreur de clé ou quota
      const fallbackText = generateListingCopy(property, style, customNotes);
      return NextResponse.json({
        success: true,
        text: fallbackText,
        source: 'local_template',
        message: `Erreur API DeepSeek (${deepseekRes.status}). Annonce générée via le moteur de secours.`,
      });
    }

    const data = await deepseekRes.json();
    const generatedContent = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      text: generatedContent,
      source: 'deepseek',
      message: 'Généré avec succès via DeepSeek AI (Style Nelly Fernandez).',
    });
  } catch (error: unknown) {
    console.error('AI Generation Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur interne lors de la génération IA',
      },
      { status: 500 }
    );
  }
}
