/**
 * Registre des outils (tools) du Copilote Nell'Immo — Chantier B
 *
 * Le copilote peut PROPOSER des actions concrètes dans Google Workspace
 * (agenda, Gmail, tâches, Drive). Aucune action n'est jamais exécutée côté
 * serveur : le LLM émet une demande structurée (`CopilotToolCall`), l'UI
 * affiche une carte de confirmation, et l'exécution n'a lieu qu'après
 * validation explicite de l'agent (principe « human-in-the-loop »).
 *
 * Ce module est volontairement PUR (aucun import React / réseau) afin de
 * pouvoir être utilisé aussi bien côté serveur (prompt système) que côté
 * client (validation + exécution).
 */

export type CopilotToolName =
    | 'calendar.createEvent'
    | 'gmail.sendEmail'
    | 'tasks.createTask'
    | 'drive.createMandateFolder';

export interface CopilotToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    description: string;
}

export interface CopilotToolDefinition {
    name: CopilotToolName;
    label: string;
    description: string;
    /** Service Google requis pour exécuter l'outil. */
    service: 'calendar' | 'gmail' | 'tasks' | 'drive';
    parameters: CopilotToolParameter[];
}

/**
 * Catalogue des outils exposés au copilote.
 * Les descriptions sont rédigées pour être injectées telles quelles dans le
 * prompt système du LLM.
 */
export const COPILOT_TOOLS: CopilotToolDefinition[] = [
    {
        name: 'calendar.createEvent',
        label: 'Créer un événement Google Agenda',
        description:
            "Crée un rendez-vous dans l'agenda Google de Nelly (visite, estimation, signature, rappel).",
        service: 'calendar',
        parameters: [
            { name: 'title', type: 'string', required: true, description: "Titre de l'événement." },
            {
                name: 'date',
                type: 'string',
                required: true,
                description: 'Date au format YYYY-MM-DD.',
            },
            {
                name: 'time',
                type: 'string',
                required: true,
                description: 'Heure de début au format HH:MM (24h).',
            },
            {
                name: 'durationMinutes',
                type: 'number',
                required: false,
                description: "Durée en minutes (défaut : 60).",
            },
            {
                name: 'location',
                type: 'string',
                required: false,
                description: "Adresse ou lieu du rendez-vous.",
            },
            {
                name: 'description',
                type: 'string',
                required: false,
                description: "Notes ou ordre du jour de l'événement.",
            },
        ],
    },
    {
        name: 'gmail.sendEmail',
        label: 'Envoyer un email via Gmail',
        description:
            "Rédige et envoie un email depuis la boîte Gmail connectée de Nelly (relance, envoi de dossier, réponse client).",
        service: 'gmail',
        parameters: [
            {
                name: 'to',
                type: 'string',
                required: true,
                description: "Adresse email du destinataire.",
            },
            { name: 'subject', type: 'string', required: true, description: "Objet de l'email." },
            { name: 'body', type: 'string', required: true, description: 'Corps du message (texte).' },
        ],
    },
    {
        name: 'tasks.createTask',
        label: 'Créer une tâche Google Tasks',
        description:
            "Ajoute une tâche de suivi dans Google Tasks (relance téléphonique, envoi de document, rappel d'échéance).",
        service: 'tasks',
        parameters: [
            { name: 'title', type: 'string', required: true, description: 'Intitulé de la tâche.' },
            {
                name: 'due',
                type: 'string',
                required: false,
                description: 'Échéance au format YYYY-MM-DD.',
            },
            {
                name: 'notes',
                type: 'string',
                required: false,
                description: 'Notes complémentaires.',
            },
        ],
    },
    {
        name: 'drive.createMandateFolder',
        label: 'Créer un dossier Drive de mandat',
        description:
            "Crée l'arborescence de dossiers Google Drive standard pour un nouveau mandat (photos, diagnostics, pièces administratives).",
        service: 'drive',
        parameters: [
            {
                name: 'mandateRef',
                type: 'string',
                required: true,
                description: 'Référence du mandat (ex. M-2024-001).',
            },
            {
                name: 'propertyTitle',
                type: 'string',
                required: true,
                description: 'Titre ou description courte du bien.',
            },
        ],
    },
];

/** Retourne la définition d'un outil par son nom, ou null. */
export function getCopilotTool(name: string): CopilotToolDefinition | null {
    return COPILOT_TOOLS.find((t) => t.name === name) || null;
}

/**
 * Demande d'action émise par le LLM (jamais exécutée automatiquement).
 */
export interface CopilotToolCall {
    /** Identifiant unique de la demande (généré côté serveur). */
    id: string;
    tool: CopilotToolName;
    /** Arguments validés et normalisés. */
    args: Record<string, string | number | boolean>;
    /** Résumé lisible affiché dans la carte de confirmation. */
    summary: string;
}

/** Résultat d'exécution d'une action confirmée par l'agent. */
export interface CopilotToolResult {
    id: string;
    tool: CopilotToolName;
    success: boolean;
    message: string;
    /** Lien éventuel vers la ressource créée (événement, message, tâche, dossier). */
    href?: string;
}

/**
 * Valide et normalise les arguments bruts d'un appel d'outil.
 * Retourne `{ ok: true, args }` ou `{ ok: false, error }`.
 */
export function validateToolArgs(
    tool: CopilotToolName,
    rawArgs: unknown
): { ok: true; args: Record<string, string | number | boolean> } | { ok: false; error: string } {
    const def = getCopilotTool(tool);
    if (!def) {
        return { ok: false, error: `Outil inconnu : ${tool}` };
    }
    if (!rawArgs || typeof rawArgs !== 'object') {
        return { ok: false, error: 'Arguments manquants ou invalides.' };
    }

    const source = rawArgs as Record<string, unknown>;
    const args: Record<string, string | number | boolean> = {};

    for (const param of def.parameters) {
        const value = source[param.name];

        if (value === undefined || value === null || value === '') {
            if (param.required) {
                return { ok: false, error: `Paramètre requis manquant : ${param.name}` };
            }
            continue;
        }

        if (param.type === 'number') {
            const num = typeof value === 'number' ? value : Number(value);
            if (Number.isNaN(num)) {
                return { ok: false, error: `Paramètre ${param.name} doit être un nombre.` };
            }
            args[param.name] = num;
        } else if (param.type === 'boolean') {
            args[param.name] = value === true || value === 'true';
        } else {
            args[param.name] = String(value).trim();
        }
    }

    return { ok: true, args };
}

/**
 * Construit un résumé lisible (français) d'un appel d'outil pour la carte
 * de confirmation affichée à l'agent.
 */
export function summarizeToolCall(
    tool: CopilotToolName,
    args: Record<string, string | number | boolean>
): string {
    const str = (key: string): string => String(args[key] ?? '').trim();

    switch (tool) {
        case 'calendar.createEvent': {
            const duration = args.durationMinutes ? ` (${args.durationMinutes} min)` : '';
            const location = str('location') ? ` — ${str('location')}` : '';
            return `📅 Créer l'événement « ${str('title')} » le ${str('date')} à ${str('time')}${duration}${location}`;
        }
        case 'gmail.sendEmail':
            return `✉️ Envoyer un email à ${str('to')} — objet : « ${str('subject')} »`;
        case 'tasks.createTask': {
            const due = str('due') ? ` (échéance ${str('due')})` : '';
            return `✅ Créer la tâche « ${str('title')} »${due}`;
        }
        case 'drive.createMandateFolder':
            return `📁 Créer le dossier Drive du mandat ${str('mandateRef')} — ${str('propertyTitle')}`;
        default:
            return `Action ${tool}`;
    }
}

/**
 * Décrit les outils disponibles sous forme de bloc texte pour le prompt système.
 */
export function describeToolsForPrompt(): string {
    const lines = COPILOT_TOOLS.map((tool) => {
        const params = tool.parameters
            .map(
                (p) =>
                    `      - ${p.name} (${p.type}${p.required ? ', requis' : ', optionnel'}) : ${p.description}`
            )
            .join('\n');
        return `  • ${tool.name} — ${tool.description}\n${params}`;
    }).join('\n');

    return `OUTILS DISPONIBLES (Google Workspace) :
${lines}

PROTOCOLE DE DEMANDE D'ACTION :
Lorsque Nelly te demande explicitement d'effectuer une action (créer un rendez-vous, envoyer un email, créer une tâche, créer un dossier), tu NE l'exécutes PAS toi-même. À la place, tu réponds en texte normal puis tu ajoutes, sur une nouvelle ligne, un bloc JSON unique délimité ainsi :

<tool_call>
{"tool":"calendar.createEvent","args":{"title":"...","date":"YYYY-MM-DD","time":"HH:MM"}}
</tool_call>

RÈGLES STRICTES :
- Un seul bloc <tool_call> par réponse, et uniquement si Nelly a demandé une action concrète.
- Les arguments doivent respecter exactement les noms et types listés ci-dessus.
- Ne jamais inventer de données : utilise les informations réelles de l'instantané.
- Si une information indispensable manque (date, destinataire…), demande-la en texte et n'émets PAS de bloc <tool_call>.
- Pour une simple question ou une rédaction de message, n'émets aucun bloc <tool_call>.`;
}

/**
 * Extrait un éventuel appel d'outil encodé dans la réponse du LLM.
 * Retourne le texte nettoyé et l'appel validé (ou null).
 */
export function extractToolCallFromResponse(
    rawResponse: string
): { text: string; call: CopilotToolCall | null } {
    const match = rawResponse.match(/<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/i);
    if (!match) {
        return { text: rawResponse.trim(), call: null };
    }

    const text = rawResponse.replace(match[0], '').trim();

    try {
        const parsed = JSON.parse(match[1]) as { tool?: string; args?: unknown };
        const tool = parsed.tool as CopilotToolName | undefined;
        if (!tool) {
            return { text, call: null };
        }

        const validation = validateToolArgs(tool, parsed.args);
        if (!validation.ok) {
            return { text, call: null };
        }

        const call: CopilotToolCall = {
            id: `tool_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            tool,
            args: validation.args,
            summary: summarizeToolCall(tool, validation.args),
        };

        return { text, call };
    } catch {
        return { text, call: null };
    }
}
