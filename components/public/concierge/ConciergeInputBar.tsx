'use client';

import React, { useState } from 'react';
import { Send, PhoneCall, Check } from 'lucide-react';

interface ConciergeInputBarProps {
  onSendMessage: (text: string) => void;
  onSaveLead: (name: string, contact: string, message: string) => boolean;
  disabled?: boolean;
}

export function ConciergeInputBar({ onSendMessage, onSaveLead, disabled }: ConciergeInputBarProps) {
  const [inputText, setInputText] = useState('');
  const [isCallbackMode, setIsCallbackMode] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    const ok = onSaveLead(name, contact, 'Demande de rappel téléphonique immédiat');
    if (ok) {
      setLeadSaved(true);
      setTimeout(() => {
        setIsCallbackMode(false);
        setLeadSaved(false);
        setName('');
        setContact('');
      }, 2000);
    }
  };

  if (isCallbackMode) {
    return (
      <div className="p-3 bg-white border-t border-gray-200 shrink-0 animate-fade-in text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#E12B7B]" />
            Être rappelé(e) par Nelly
          </span>
          <button
            onClick={() => setIsCallbackMode(false)}
            className="text-[11px] text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
          >
            Fermer ✕
          </button>
        </div>

        {leadSaved ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 font-bold text-[11px]">
            <Check className="w-4 h-4 text-emerald-600" />
            Demande enregistrée ! Nelly vous recontacte sous 24h.
          </div>
        ) : (
          <form onSubmit={handleCallbackSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="p-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#E12B7B] outline-hidden"
              />
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Tél ou email *"
                className="p-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#E12B7B] outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Confirmer ma demande de rappel
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 bg-white border-t border-gray-200 shrink-0 space-y-2">
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Posez votre question à Nelly..."
          disabled={disabled}
          className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#E12B7B] focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          aria-label="Envoyer"
          className="p-2.5 bg-[#131B26] hover:bg-[#E12B7B] text-white rounded-2xl transition disabled:opacity-30 disabled:hover:bg-[#131B26] cursor-pointer shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="flex items-center justify-between px-1 text-[10px] text-gray-400">
        <span>Confidentialité garantie • Réponse en direct</span>
        <button
          onClick={() => setIsCallbackMode(true)}
          className="text-[#E12B7B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <PhoneCall className="w-2.5 h-2.5" />
          Rappel téléphonique
        </button>
      </div>
    </div>
  );
}
