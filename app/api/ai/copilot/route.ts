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
import {
  formatSnapshotForPrompt,
  type AgencyDataSnapshot,
} from '@/lib/ai-data-snapshot';

import { resolveDeepSeekApiKey, executeDeepSeekCall } from '@/lib/deepseek/server';

export async function POST(req: NextRequest) {
  try {
    const body: CopilotPayload = await req.json();
    const { action = 'chat', message = '', context = {} } = body;

    const apiKey = resolveDeepSeekApiKey(req);

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

    // 1bis. Instantané des données de l'agence (déjà anonymisé côté client).
    //       On re-caviarde défensivement les champs texte libres côté serveur.
    let snapshotBlock = '';
    if (context.dataSnapshot) {
      const snap = context.dataSnapshot as AgencyDataSnapshot;
      const safeSnapshot: AgencyDataSnapshot = {
        ...snap,
        properties: (snap.properties || []).map((p) => ({
          ...p,
          title: sanitizeTextForLlm(p.title),
        })),
        relances: (snap.relances || []).map((r) => ({
          ...r,
          title: sanitizeTextForLlm(r.title),
          message: sanitizeTextForLlm(r.message),
        })),
        leads: (snap.leads || []).map((l) => ({
          ...l,
          title: sanitizeTextForLlm(l.title),
        })),
        transactions: (snap.transactions || []).map((t) => ({
          ...t,
          property: sanitizeTextForLlm(t.property),
        })),
        visits: (snap.visits || []).map((v) => ({
          ...v,
          property: sanitizeTextForLlm(v.property),
          feedback: sanitizeTextForLlm(v.feedback),
        })),
      };
      snapshotBlock = formatSnapshotForPrompt(safeSnapshot);
    }

    // 2. Si aucune clé n'est configurée, retour immédiat via le moteur local certifié
    if (!apiKey) {
      const fallbackText = generateLocalCopilotFallback({
        action,
        message: sanitizedUserMessage,
        context: sanitizedContext as unknown as CopilotPayload['context'],
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

    // 3bis. Injection de l'instantané des données de l'agence (localStorage).
    //       Le copilote peut ainsi répondre sur le portefeuille réel, les
    //       acquéreurs, les contacts et les relances en attente.
    if (snapshotBlock) {
      promptContent = `${snapshotBlock}

${promptContent}

CONSIGNE : Appuie-toi sur l'INSTANTANÉ DES DONNÉES DE L'AGENCE ci-dessus pour répondre de façon concrète et chiffrée (cite les références de mandat, les villes, les budgets, les échéances de relance). Si une information demandée n'y figure pas, indique-le honnêtement sans l'inventer.`;
    }

    // 4. Appel unifié officiel DeepSeek V4 Flash
    const result = await executeDeepSeekCall({
      feature: 'copilot',
      featureLabel: `Copilote action ${action}`,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptContent },
      ],
      model: 'deepseek-chat',
      temperature: action === 'smart_form_parse' ? 0.1 : 0.7,
      maxTokens: 1500,
      req,
    });

    if (!result.success || !result.content) {
      console.warn('DeepSeek V4 Flash Copilot fallback:', result.error);
      const fallbackText = generateLocalCopilotFallback({
        action,
        message: sanitizedUserMessage,
        context: sanitizedContext as unknown as CopilotPayload['context'],
      });

      return NextResponse.json({
        success: true,
        text: fallbackText,
        source: 'local_fallback',
        log: result.log,
        message: 'Réponse fournie par le moteur local certifié.',
      });
    }

    const rawAiResponse = result.content;
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
      log: result.log,
      message: 'Généré avec succès via DeepSeek V4 Flash à la plume de Nelly Fernandez.',
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
