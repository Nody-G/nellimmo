import { NextRequest, NextResponse } from 'next/server';
import {
    LeadContext,
    QualificationResult,
    qualifyLeadLocally,
    buildAssistantSystemPrompt,
} from '@/lib/assistant';

/**
 * Endpoint de l'Assistant IA conversationnel « Nelly ».
 *
 * Reçoit un lead entrant (demande de contact / estimation / prospection) et retourne
 * une qualification structurée + une réponse suggérée à la plume de Nelly.
 *
 * - Si DEEPSEEK_API_KEY est configurée (côté serveur uniquement) : appel DeepSeek.
 * - Sinon : bascule automatique sur le moteur local haute fidélité (lib/assistant.ts).
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const ctx: LeadContext = {
            kind: body.kind || 'contact',
            name: body.name || undefined,
            message: (body.message || '').toString().trim(),
            city: body.city || undefined,
            propertyType: body.propertyType || undefined,
        };

        if (!ctx.message) {
            return NextResponse.json(
                { success: false, error: 'Le message du prospect est requis.' },
                { status: 400 }
            );
        }

        // Sécurité : la clé DeepSeek est exclusivement gérée côté serveur.
        const effectiveApiKey = process.env.DEEPSEEK_API_KEY || '';

        // Fallback local si aucune clé n'est disponible.
        if (!effectiveApiKey) {
            const result = qualifyLeadLocally(ctx);
            return NextResponse.json({ success: true, result });
        }

        // Appel officiel DeepSeek V4 Flash
        const systemPrompt = buildAssistantSystemPrompt();
        const userPrompt = JSON.stringify({
            kind: ctx.kind,
            name: ctx.name || null,
            city: ctx.city || null,
            propertyType: ctx.propertyType || null,
            message: ctx.message,
        });

        const { executeDeepSeekCall } = await import('@/lib/deepseek/server');
        const dsResult = await executeDeepSeekCall({
            feature: 'assistant',
            featureLabel: `Qualification lead (${ctx.kind} - ${ctx.name || 'Anonyme'})`,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: 'deepseek-v4-flash',
            temperature: 0.6,
            maxTokens: 1200,
            responseFormat: { type: 'json_object' },
        });

        if (!dsResult.success || !dsResult.content) {
            console.warn('DeepSeek V4 Flash Assistant fallback:', dsResult.error);
            const result = qualifyLeadLocally(ctx);
            return NextResponse.json({
                success: true,
                result: { ...result, source: 'local' },
                log: dsResult.log,
                message: 'Qualification via le moteur local certifié.',
            });
        }

        const content = dsResult.content;

        // Tenter de parser le JSON retourné par l'IA.
        let parsed: Partial<QualificationResult> = {};
        try {
            parsed = JSON.parse(content);
        } catch {
            // Si l'IA ne renvoie pas du JSON valide, on retombe sur le moteur local.
            const result = qualifyLeadLocally(ctx);
            return NextResponse.json({
                success: true,
                result: { ...result, source: 'local' },
                log: dsResult.log,
                message: 'Réponse IA non structurée. Qualification via le moteur local.',
            });
        }

        const result: QualificationResult = {
            score: typeof parsed.score === 'number' ? parsed.score : 50,
            level: parsed.level || 'tiède',
            intent: parsed.intent || 'Demande générale',
            budget: parsed.budget || undefined,
            timeline: parsed.timeline || undefined,
            motivations: Array.isArray(parsed.motivations) ? parsed.motivations : [],
            concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
            nextAction: parsed.nextAction || 'Relancer le prospect rapidement.',
            suggestedReply: parsed.suggestedReply || qualifyLeadLocally(ctx).suggestedReply,
            source: 'deepseek',
        };

        return NextResponse.json({ success: true, result, log: dsResult.log });
    } catch (error: unknown) {
        console.error('Assistant Route Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur interne lors de la qualification du lead',
            },
            { status: 500 }
        );
    }
}
