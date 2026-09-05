'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import {
  useContactsState,
  ContactsHeader,
  ContactsFilterBar,
  ContactCard,
  ContactsTable,
  ContactDetailModal,
  ContactFormModal,
  GmailComposeModal,
  GoogleSyncModal,
} from '@/components/cockpit/contacts';

function ContactsPageContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || undefined;

  const { updateContact, deleteContact } = useNellimoStore();

  const {
    contacts,
    filteredContacts,
    roleCounts,
    searchQuery,
    setSearchQuery,
    activeRole,
    setActiveRole,
    onlyFavorites,
    setOnlyFavorites,
    viewMode,
    setViewMode,
    selectedContactForDetail,
    setSelectedContactForDetail,
    contactForEmailCompose,
    setContactForEmailCompose,
    contactForEdit,
    setContactForEdit,
    isNewContactModalOpen,
    setIsNewContactModalOpen,
    isGoogleSyncModalOpen,
    setIsGoogleSyncModalOpen,
  } = useContactsState(initialId);

  const handleToggleFavorite = async (id: string, current: boolean) => {
    await updateContact(id, { is_favorite: !current });
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      await deleteContact(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <ContactsHeader
        totalCount={contacts.length}
        onOpenNewContact={() => setIsNewContactModalOpen(true)}
        onOpenGoogleSync={() => setIsGoogleSyncModalOpen(true)}
        onOpenEmailHub={() => setContactForEmailCompose(contacts[0] || null)}
      />

      {/* Filter bar */}
      <ContactsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        roleCounts={roleCounts}
      />

      {/* Grid or Table display */}
      {viewMode === 'grid' ? (
        filteredContacts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#F3E8EE] p-12 text-center text-gray-400 text-xs">
            Aucun contact ne correspond à votre recherche ou filtre.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onOpenDetail={setSelectedContactForDetail}
                onOpenEmailCompose={setContactForEmailCompose}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )
      ) : (
        <ContactsTable
          contacts={filteredContacts}
          onOpenDetail={setSelectedContactForDetail}
          onOpenEmailCompose={setContactForEmailCompose}
          onEditContact={setContactForEdit}
          onDeleteContact={handleDeleteContact}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Modals */}
      {selectedContactForDetail && (
        <ContactDetailModal
          contact={selectedContactForDetail}
          onClose={() => setSelectedContactForDetail(null)}
          onOpenEmailCompose={(c) => {
            setSelectedContactForDetail(null);
            setContactForEmailCompose(c);
          }}
          onEditContact={(c) => {
            setSelectedContactForDetail(null);
            setContactForEdit(c);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {contactForEmailCompose && (
        <GmailComposeModal
          contact={contactForEmailCompose}
          onClose={() => setContactForEmailCompose(null)}
        />
      )}

      {(isNewContactModalOpen || contactForEdit) && (
        <ContactFormModal
          initialContact={contactForEdit}
          onClose={() => {
            setIsNewContactModalOpen(false);
            setContactForEdit(null);
          }}
        />
      )}

      {isGoogleSyncModalOpen && (
        <GoogleSyncModal
          contacts={contacts}
          onClose={() => setIsGoogleSyncModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-400">Chargement du carnet de contacts...</div>}>
      <ContactsPageContent />
    </Suspense>
  );
}
