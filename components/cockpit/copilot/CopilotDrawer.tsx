'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  Bot,
  User,
  Wand2,
} from 'lucide-react';
import { useCopilotContext } from './useCopilotContext';
import { useCopilotActions } from './useCopilotActions';
import { CopilotActionCard, type CopilotActionStatus } from './CopilotActionCard';
import type { CopilotToolCall, CopilotToolResult } from '@/lib/ai-copilot-tools';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: 'deepseek' | 'local' | 'local_fallback';
  timestamp: string;
  /** Action proposée par le copilote, à confirmer par l'utilisateur. */
  pendingAction?: CopilotToolCall | null;
}

interface ActionState {
  status: CopilotActionStatus;
  result?: CopilotToolResult | null;
}

export function CopilotDrawer({ isOpen, onClose }: CopilotDrawerProps) {
  const context = useCopilotContext();
  const { executeAction } = useCopilotActions();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const handleSend = React.useCallback(async (customPrompt?: string, actionType: string = 'chat') => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || busy) return;

    setError(null);
    setInput('');

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-${now.getTime()}-user`,
      role: 'user',
      content: textToSend,
      timestamp: timeString,
    };

    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          message: textToSend,
          context: {
            pathname: context.pathname,
            property: context.activeProperty,
            buyer: context.activeBuyer,
            visit: context.activeVisit,
            dataSnapshot: context.dataSnapshot,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la réponse du Copilote.');
      }

      const pendingAction: CopilotToolCall | null = data.pendingAction || null;

      const assistantMsg: ChatMessage = {
        id: `msg-${new Date().getTime()}-ai`,
        role: 'assistant',
        content: data.text || 'Réponse reçue sans texte.',
        source: data.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pendingAction,
      };

      if (pendingAction) {
        setActionStates((prev) => ({ ...prev, [pendingAction.id]: { status: 'pending' } }));
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossible de joindre le copilote IA.');
    } finally {
      setBusy(false);
    }
  }, [busy, context, input]);

  const handleConfirmAction = React.useCallback(
    async (call: CopilotToolCall) => {
      setActionStates((prev) => ({ ...prev, [call.id]: { status: 'executing' } }));
      const result = await executeAction(call);
      setActionStates((prev) => ({
        ...prev,
        [call.id]: { status: result.success ? 'done' : 'error', result },
      }));

      const now = new Date();
      const feedbackMsg: ChatMessage = {
        id: `msg-${now.getTime()}-action`,
        role: 'assistant',
        content: result.success
          ? `✅ ${result.message}`
          : `⚠️ ${result.message}`,
        source: 'local',
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, feedbackMsg]);
    },
    [executeAction]
  );

  const handleCancelAction = React.useCallback((call: CopilotToolCall) => {
    setActionStates((prev) => ({ ...prev, [call.id]: { status: 'cancelled' } }));
  }, []);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in print:hidden">
      {/* Backdrop sombre */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full z-10 border-l border-slate-200">
        {/* Header Élégant */}
        <div className="p-4 bg-[#131B26] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E12B7B] to-[#C59A45] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base tracking-wide text-white">
                  Copilote Nell&apos;Immo
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  RGPD Sûr
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Plume de Nelly Fernandez • Assistance contextuelle
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Contexte Actif Détecté */}
        <div className="bg-[#FAF5F8] px-4 py-2.5 border-b border-[#F3E8EE] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#E12B7B] shrink-0 animate-ping" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131B26] truncate">
                {context.contextTitle}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {context.contextSubtitle}
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              title="Nouvelle conversation"
              className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Suggestions d'actions rapides 1-clic */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {context.suggestedPrompts.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(s.prompt, s.action)}
              disabled={busy}
              className="shrink-0 text-[11px] font-semibold px-2.5 py-1 bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-[#E12B7B] border border-gray-200 hover:border-pink-200 rounded-lg transition shadow-2xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <Wand2 className="w-3 h-3 text-[#C59A45]" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Zone de Discussion & Réponses */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#F3E8EE] shadow-sm flex items-center justify-center text-[#E12B7B]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#131B26]">
                  À vos côtés, chère Nelly !
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Je connais vos mandats, vos acquéreurs et votre style rédactionnel. Que souhaitez-vous rédiger, synthétiser ou vérifier ?
                </p>
              </div>

              <div className="w-full pt-2 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Exemples d&apos;instructions rapides :
                </p>
                {context.suggestedPrompts.slice(0, 2).map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(s.prompt, s.action)}
                    className="w-full text-left p-2.5 bg-white border border-gray-200 hover:border-[#E12B7B] rounded-xl text-xs text-gray-700 hover:text-[#E12B7B] shadow-2xs transition"
                  >
                    👉 {s.prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#131B26] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#C59A45]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 shadow-2xs ${msg.role === 'user'
                    ? 'bg-[#131B26] text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.pendingAction && (
                    <CopilotActionCard
                      call={msg.pendingAction}
                      status={actionStates[msg.pendingAction.id]?.status || 'pending'}
                      result={actionStates[msg.pendingAction.id]?.result || null}
                      onConfirm={handleConfirmAction}
                      onCancel={handleCancelAction}
                    />
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100/50 text-[10px] text-gray-400">
                    <span>{msg.timestamp}</span>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] px-1 rounded bg-gray-100 text-gray-500">
                          {msg.source === 'deepseek' ? 'DeepSeek IA' : 'Certifié Local'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copier le texte"
                          className="p-1 hover:text-[#E12B7B] rounded transition cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#E12B7B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {busy && (
            <div className="flex gap-2.5 items-center text-xs text-gray-500 italic p-2 bg-white rounded-xl border border-gray-100 max-w-[70%]">
              <Sparkles className="w-4 h-4 text-[#E12B7B] animate-spin shrink-0" />
              <span>Rédaction à la plume de Nelly en cours...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              ⚠️ {error}
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Zone de Saisie & Envoi */}
        <div className="p-3.5 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2 bg-slate-50 border border-gray-200 rounded-2xl p-2 focus-within:border-[#E12B7B] focus-within:bg-white transition shadow-2xs"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Demandez au Copilote (ex: 'Rédige un WhatsApp vendeur', 'Résume les atouts')..."
              className="flex-1 bg-transparent border-none text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none p-1"
            />

            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="p-2 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-40 text-white rounded-xl transition shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-1.5">
            Entrée pour envoyer • Maj + Entrée pour saut de ligne
          </p>
        </div>
      </div>
    </div>
  );
}
