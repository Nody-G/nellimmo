'use client';

import React, { useState } from 'react';
import type { ContactItem, ContactInteractionType } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { Portal } from '@/components/ui/Portal';
import { ContactDetailHeader } from './detail/ContactDetailHeader';
import { ContactQuickActionsBar } from './detail/ContactQuickActionsBar';
import { ContactProfileTab } from './detail/ContactProfileTab';
import { ContactPropertiesTab } from './detail/ContactPropertiesTab';
import { ContactTimelineTab } from './detail/ContactTimelineTab';
import { ContactDocumentsTab } from './detail/ContactDocumentsTab';

interface ContactDetailModalProps {
  contact: ContactItem;
  onClose: () => void;
  onOpenEmailCompose: (contact: ContactItem) => void;
  onEditContact: (contact: ContactItem) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function ContactDetailModal({
  contact,
  onClose,
  onOpenEmailCompose,
  onEditContact,
  onToggleFavorite,
}: ContactDetailModalProps) {
  const { properties, addContactInteraction } = useNellimoStore();
  const [activeTab, setActiveTab] = useState<'profil' | 'biens' | 'timeline' | 'docs'>('profil');

  const linkedProps = properties.filter((p) =>
    contact.associated_property_ids?.includes(p.id)
  );

  const handleSaveInteraction = async (
    type: ContactInteractionType,
    title: string,
    desc?: string
  ) => {
    await addContactInteraction(contact.id, {
      type,
      title,
      description: desc,
      author: 'Cockpit Agent',
    });
  };

  // Escape key handler + body scroll lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white rounded-3xl border border-[#F3E8EE] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[88vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ContactDetailHeader
            contact={contact}
            onClose={onClose}
            onEditContact={onEditContact}
            onToggleFavorite={onToggleFavorite}
          />

          {/* Quick Actions */}
          <ContactQuickActionsBar
            contact={contact}
            onOpenEmailCompose={onOpenEmailCompose}
          />

          {/* Tabs Bar */}
          <div className="flex border-b border-gray-100 px-6 bg-white overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'profil'
                  ? 'border-[#E12B7B] text-[#E12B7B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Coordonnées &amp; Fiche
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biens')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'biens'
                  ? 'border-[#E12B7B] text-[#E12B7B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Biens &amp; Dossiers ({linkedProps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-[#E12B7B] text-[#E12B7B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Timeline &amp; Échanges ({contact.interactions?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-[#E12B7B] text-[#E12B7B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Documents &amp; Légal ({contact.documents?.length || 0})
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto min-h-0 flex-1 space-y-6 text-xs">
            {activeTab === 'profil' && <ContactProfileTab contact={contact} />}
            {activeTab === 'biens' && <ContactPropertiesTab linkedProps={linkedProps} />}
            {activeTab === 'timeline' && (
              <ContactTimelineTab
                contact={contact}
                onSaveInteraction={handleSaveInteraction}
              />
            )}
            {activeTab === 'docs' && <ContactDocumentsTab contact={contact} />}
          </div>
        </div>
      </div>
    </Portal>
  );
}
