import { NextRequest, NextResponse } from 'next/server';
import {
  CopilotPayload,
  buildSystemPrompt,
  generateLocalCopilotFallback,
} from '@/lib/ai-copilot';
import {
  sanitizeTextForLlm,
  sanitizePropertyForLlm,
  pseudonymizeName,
} from '@/lib/ai-privacy-guard';

export async function POST(req: NextRequest) {
  try {
    const body: CopilotPayload = await req.json();
    const { action = 'chat', message = '', context = {} } = body;

    const apiKey = process.env.DEEPSEEK_API_KEY || '';

    // 1. Assainissement préalable systématique des données (Zéro Fuite RGPD)
    const sanitizedContext: Record<string, unknown> = {
      pathname: context.pathname,
      sentiment: context.sentiment,
      strengths: (context.strengths || []).map((s) => sanitizeTextForLlm(s)),
      weaknesses: (context.weaknesses || []).map((w) => sanitizeTextForLlm(w)),
      customNotes: sanitizeTextForLlm(context.customNotes || ''),
      channel: context.channel,
      rawText: sanitizeTextForLlm(context.rawText || ''),
    };

    if (context.property) {
      sanitizedContext.property = sanitizePropertyForLlm(context.property);
    }

    if (context.buyer) {
      sanitizedContext.buyer = {
        name: pseudonymizeName(
          `${context.buyer.first_name || ''} ${context.buyer.last_name || ''}`.trim()
        ),
        budget_max: context.buyer.budget_max,
        target_cities: context.buyer.target_cities,
        target_property_types: context.buyer.target_property_types,
        min_rooms: context.buyer.min_rooms,
        financing_status: context.buyer.financing_status,
        notes: sanitizeTextForLlm(context.buyer.notes || ''),
      };
    }

    const sanitizedUserMessage = sanitizeTextForLlm(message);

    // 2. Si aucune clé n'est configurée, retour immédiat via le moteur local certifié
    if (!apiKey) {
      const fallbackText = generateLocalCopilotFallback({
        action,
        message: sanitizedUserMessage,
        context: sanitizedContext as any,
      });

      let parsedData = null;
      if (action === 'smart_form_parse') {
        try {
          parsedData = JSON.parse(fallbackText);
        } catch {
          // fallback string
        }
      }

      return NextResponse.json({
        success: true,
        text: fallbackText,
        data: parsedData,
        source: 'local',
        message: 'Généré via le moteur certifié Nell\'Immo (renseignez DEEPSEEK_API_KEY pour l\'IA neurale directe).',
      });
    }

    // 3. Construction des messages pour DeepSeek
    const systemPrompt = buildSystemPrompt(action);

    // Formatage du message utilisateur avec son contexte
    let promptContent = sanitizedUserMessage;
    if (action === 'vendor_debrief') {
      promptContent = `DÉBRIEFING DE VISITE À RÉDIGER :
- Bien : ${JSON.stringify(sanitizedContext.property || {})}
- Acquéreur : ${JSON.stringify(sanitizedContext.buyer || {})}
- Ressenti constaté : ${sanitizedContext.sentiment || 'Non spécifié'}
- Points forts relevés : ${(sanitizedContext.strengths as string[])?.join(', ') || 'Luminosité et calme'}
- Points faibles / hésitations : ${(sanitizedContext.weaknesses as string[])?.join(', ') || 'Aucune objection majeure'}
- Notes complémentaires : ${sanitizedContext.customNotes || 'Aucune'}`;
    } else if (action === 'buyer_pitch') {
      promptContent = `PRÉSENTATION DE BIEN SUR-MESURE :
- Profil acquéreur : ${JSON.stringify(sanitizedContext.buyer || {})}
- Fiche du bien proposé : ${JSON.stringify(sanitizedContext.property || {})}`;
    } else if (action === 'smart_form_parse') {
      promptContent = `Texte brut à parser en JSON strict :
${sanitizedContext.rawText || sanitizedUserMessage}`;
    } else if (action === 'relance_boost') {
      promptContent = `Message de relance à optimiser :
- Canal : ${sanitizedContext.channel || 'whatsapp'}
- Contexte client : ${JSON.stringify(sanitizedContext.buyer || sanitizedContext.property || {})}
- Message initial : ${sanitizedUserMessage || sanitizedContext.rawText || ''}`;
    } else if (context.property || context.buyer) {
      promptContent = `[CONTEXTE DE NAVIGATION ACTIF :
Bien affiché : ${JSON.stringify(sanitizedContext.property || 'aucun')}
Acquéreur sélectionné : ${JSON.stringify(sanitizedContext.buyer || 'aucun')}
Page : ${sanitizedContext.pathname || ''}]

Demande de Nelly : ${sanitizedUserMessage}`;
    }

    // 4. Appel de l'API DeepSeek Chat
    const deepseekRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptContent },
        ],
        temperature: action === 'smart_form_parse' ? 0.1 : 0.7,
        max_tokens: 1500,
      }),
    });

    if (!deepseekRes.ok) {
      const errText = await deepseekRes.text();
      console.error('DeepSeek Copilot API Error:', deepseekRes.status, errText);
      const fallbackText = generateLocalCopilotFallback({
        action,
        message: sanitizedUserMessage,
        context: sanitizedContext as any,
      });

      return NextResponse.json({
        success: true,
        text: fallbackText,
        source: 'local_fallback',
        message: `Erreur API DeepSeek (${deepseekRes.status}). Réponse fournie par le moteur local certifié.`,
      });
    }

    const data = await deepseekRes.json();
    const rawAiResponse = data.choices?.[0]?.message?.content || '';

    let structuredData = null;
    if (action === 'smart_form_parse') {
      try {
        const cleanedJson = rawAiResponse.replace(/```json|```/g, '').trim();
        structuredData = JSON.parse(cleanedJson);
      } catch (err) {
        console.error('Erreur parsing JSON DeepSeek:', err);
      }
    }

    return NextResponse.json({
      success: true,
      text: rawAiResponse,
      data: structuredData,
      source: 'deepseek',
      message: 'Généré avec succès via DeepSeek AI à la plume de Nelly Fernandez.',
    });
  } catch (error) {
    console.error('Erreur interne copilot route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du traitement de la requête par le copilote.',
      },
      { status: 500 }
    );
  }
}
