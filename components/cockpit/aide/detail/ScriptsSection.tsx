'use client';

import React from 'react';
import { MessageSquare, Check, Copy } from 'lucide-react';
import type { HelpGuide, ReadyToUseScript } from '@/lib/help-content';

interface ScriptsSectionProps {
  scripts: HelpGuide['scripts'];
  copiedScriptId: string | null;
  onCopyScript: (script: ReadyToUseScript) => void;
}

export function ScriptsSection({ scripts, copiedScriptId, onCopyScript }: ScriptsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#E12B7B]" />
        <span>Modèles de Messages & Scripts Prêts à Copier</span>
      </h3>

      <div className="space-y-3">
        {scripts.map((script) => {
          const isCopied = copiedScriptId === script.id;

          return (
            <div
              key={script.id}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    {script.title}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-white border border-gray-200 text-gray-600">
                    {script.channel}
                  </span>
                </div>

                <button
                  onClick={() => onCopyScript(script)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-2xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le texte</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                {script.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
