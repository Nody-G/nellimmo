'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ChatMessage, QuickPrompt } from './concierge-types';

interface ConciergeMessagesListProps {
  messages: ChatMessage[];
  quickPrompts: QuickPrompt[];
  isTyping: boolean;
  onSelectPrompt: (text: string) => void;
  onClose: () => void;
}

export function ConciergeMessagesList({
  messages,
  quickPrompts,
  isTyping,
  onSelectPrompt,
  onClose,
}: ConciergeMessagesListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#FCFAF7] to-white text-xs">
      {messages.map((msg) => {
        const isAssistant = msg.sender === 'assistant';

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                isAssistant
                  ? 'bg-white text-gray-800 border border-[#F3E8EE] rounded-tl-xs'
                  : 'bg-[#131B26] text-white rounded-tr-xs'
              }`}
            >
              {isAssistant && (
                <div className="flex items-center gap-1 text-[10px] text-[#E12B7B] font-bold mb-1">
                  <Sparkles className="w-3 h-3" />
                  Nelly Fernandez
                </div>
              )}
              <p className="whitespace-pre-line">{msg.text}</p>

              {msg.actionLink && (
                <div className="mt-2.5 pt-2 border-t border-gray-100">
                  <Link
                    href={msg.actionLink.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FCFAF7] hover:bg-[#F3E8EE] text-[#E12B7B] font-bold text-[11px] rounded-xl transition border border-[#F3E8EE]"
                  >
                    <span>{msg.actionLink.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-center gap-1.5 p-3 bg-white border border-[#F3E8EE] rounded-2xl rounded-tl-xs w-20 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E12B7B] animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-[#C59A45] animate-bounce [animation-delay:0.2s]" />
          <span className="w-2 h-2 rounded-full bg-[#131B26] animate-bounce [animation-delay:0.4s]" />
        </div>
      )}

      {/* Suggestions de questions rapides */}
      {messages.length <= 2 && !isTyping && (
        <div className="pt-2 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
            Questions fréquentes :
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp) => (
              <button
                key={qp.id}
                onClick={() => onSelectPrompt(qp.text)}
                className="px-2.5 py-1.5 bg-white hover:bg-[#F3E8EE] text-gray-700 hover:text-[#E12B7B] border border-gray-200 hover:border-[#E12B7B]/30 rounded-xl text-[11px] font-medium transition cursor-pointer shadow-2xs text-left"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
