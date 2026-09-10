'use client';

import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { Portal } from '@/components/ui/Portal';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import { EMAIL_TEMPLATES, createGmailComposeUrl } from '@/lib/gmail';
import { GmailTemplateBar } from './gmail/GmailTemplateBar';
import { GmailAiCopilotBar } from './gmail/GmailAiCopilotBar';
import { GmailSendActions } from './gmail/GmailSendActions';
import { computeTemplateContent } from './gmail/gmail-template-utils';
import { useGmailSender } from './useGmailSender';

interface GmailComposeModalProps {
  contact: ContactItem | null;
  onClose: () => void;
}

export function GmailComposeModal({ contact, onClose }: GmailComposeModalProps) {
  const { properties, settings, addContactInteraction } = useNellimoStore();
  const { send, isSending } = useGmailSender();

  // Verrou de défilement du body (compté, sûr en cas d'empilement de modales)
  useBodyScrollLock(true);

  // Fermeture via la touche Échap
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const initialPropId = contact?.associated_property_ids?.[0] || properties[0]?.id || '';
  const initialTmpl = EMAIL_TEMPLATES.find((t) => t.role === contact?.role) || EMAIL_TEMPLATES[0];
  const initialContent = computeTemplateContent(
    initialTmpl?.id || '',
    initialPropId,
    contact,
    properties,
    settings
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTmpl?.id || '');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(initialPropId);
  const [recipientEmail, setRecipientEmail] = useState(contact?.email || '');
  const [subject, setSubject] = useState(initialContent.subject);
  const [body, setBody] = useState(initialContent.body);
  const [copied, setCopied] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const selectedProp = properties.find((p) => p.id === selectedPropertyId);

  const applyTemplate = (tmplId: string, propId: string) => {
    const updated = computeTemplateContent(tmplId, propId, contact, properties, settings);
    setSubject(updated.subject);
    setBody(updated.body);
  };

  const logInteraction = async (channel: string) => {
    if (!contact) return;
    await addContactInteraction(contact.id, {
      type: 'email_gmail',
      title: `Email envoyé via ${channel} : ${subject.slice(0, 45)}...`,
      description: body.slice(0, 180) + '...',
      author: settings.agent_name || 'Nelly',
    });
  };

  /** Envoi réel via l'API Gmail (repli automatique vers Gmail Web si non connecté). */
  const handleSendViaGmail = async () => {
    if (!recipientEmail.trim()) return;
    const result = await send({
      to: recipientEmail,
      subject,
      body,
      fromName: settings.agent_name || undefined,
    });
    await logInteraction('Gmail');
    onClose();
    return result;
  };

  /** Repli : ouvre Gmail Web en composition. */
  const handleOpenGmail = async () => {
    const url = createGmailComposeUrl({ to: recipientEmail, subject, body });
    await logInteraction('Gmail Web');
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAi = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setTimeout(() => {
      const generated = `Bonjour ${contact?.first_name || ''},\n\nSuite à notre échange, je vous confirme que le bien ${selectedProp ? `"${selectedProp.title}" à ${selectedProp.city}` : 'visité'} correspond parfaitement à vos critères.\n\n${aiPrompt}\n\nRestant à votre entière disposition,\n\nBien cordialement,\n${settings.agent_name || 'Nelly Fernandez'}\nAgence Nell'Immo — Salon-de-Provence\n${settings.phone || '07 55 68 61 09'}`;
      setBody(generated);
      setIsGeneratingAi(false);
    }, 600);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight">Rédiger un Email (Intégration Gmail)</h3>
                <p className="text-xs text-red-100">
                  {contact ? `Destinataire : ${contact.first_name} ${contact.last_name}` : 'Nouveau message'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition cursor-pointer text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Form */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            <GmailTemplateBar
              selectedTemplateId={selectedTemplateId}
              selectedPropertyId={selectedPropertyId}
              properties={properties}
              onTemplateChange={(newId) => {
                setSelectedTemplateId(newId);
                applyTemplate(newId, selectedPropertyId);
              }}
              onPropertyChange={(newPropId) => {
                setSelectedPropertyId(newPropId);
                applyTemplate(selectedTemplateId, newPropId);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Destinataire (Email)</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="email@domaine.fr"
                  className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-semibold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Objet de l’email</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-bold text-gray-900"
                />
              </div>
            </div>

            <GmailAiCopilotBar
              aiPrompt={aiPrompt}
              isGeneratingAi={isGeneratingAi}
              onPromptChange={setAiPrompt}
              onGenerate={handleGenerateAi}
            />

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Corps du message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-3 bg-[#FCFAF7] border border-gray-200 rounded-xl font-sans text-xs text-gray-800 resize-none h-44 focus:bg-white focus:outline-[#E12B7B] transition leading-relaxed"
              />
            </div>

            <GmailSendActions
              copied={copied}
              recipientEmail={recipientEmail}
              subject={subject}
              body={body}
              isSending={isSending}
              onCopy={handleCopyText}
              onClose={onClose}
              onOpenGmail={handleOpenGmail}
              onSendViaGmail={handleSendViaGmail}
            />
          </div>
        </div>
      </div>
    </Portal>
  );
}
