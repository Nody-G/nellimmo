'use client';

import React, { useState, useCallback } from 'react';
import {
  ChatMessage,
  INITIAL_MESSAGES,
  QUICK_PROMPTS,
  getLocalConciergeAnswer,
  saveConciergeLead,
} from './concierge-types';
import { ConciergeTriggerButton } from './ConciergeTriggerButton';
import { ConciergeHeader } from './ConciergeHeader';
import { ConciergeMessagesList } from './ConciergeMessagesList';
import { ConciergeInputBar } from './ConciergeInputBar';

export function ConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Tenter une qualification intelligente via /api/ai/assistant
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'contact',
          message: userText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.result?.draft_response) {
          const assistantMsg: ChatMessage = {
            id: `a-${Date.now()}`,
            sender: 'assistant',
            text: data.result.draft_response,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Repli local transparent
    }

    // Réponse locale intelligente
    const localAnswer = getLocalConciergeAnswer(userText);
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      sender: 'assistant',
      text: localAnswer.text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      actionLink: localAnswer.actionLink,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  }, []);

  return (
    <>
      <ConciergeTriggerButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-96 h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#F3E8EE] flex flex-col overflow-hidden animate-fade-in">
          <ConciergeHeader onClose={() => setIsOpen(false)} />

          <ConciergeMessagesList
            messages={messages}
            quickPrompts={QUICK_PROMPTS}
            isTyping={isTyping}
            onSelectPrompt={handleSendMessage}
            onClose={() => setIsOpen(false)}
          />

          <ConciergeInputBar
            onSendMessage={handleSendMessage}
            onSaveLead={saveConciergeLead}
            disabled={isTyping}
          />
        </div>
      )}
    </>
  );
}
