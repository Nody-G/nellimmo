'use client';

import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface ConciergeTriggerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function ConciergeTriggerButton({ isOpen, onToggle, unreadCount }: ConciergeTriggerButtonProps) {
  if (isOpen) return null;

  return (
    <button
      onClick={onToggle}
      aria-label="Discuter avec Nelly IA"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#131B26] hover:bg-[#1E293B] text-white rounded-full shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 group cursor-pointer"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E12B7B] to-[#C59A45] flex items-center justify-center text-white font-bold text-xs shadow-sm">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#131B26]" />
      </div>

      <div className="text-left hidden sm:block">
        <span className="text-[10px] uppercase font-bold text-[#E12B7B] tracking-wider block">
          Concierge IA 24/7
        </span>
        <span className="text-xs font-semibold text-gray-200">
          Une question ? Échangez ici
        </span>
      </div>

      <div className="sm:hidden">
        <MessageCircle className="w-5 h-5 text-white" />
      </div>

      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="w-5 h-5 bg-[#E12B7B] text-white text-[10px] font-black rounded-full flex items-center justify-center -ml-1">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
