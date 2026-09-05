'use client';

import React, { useState } from 'react';
import { X, Save, UserCheck } from 'lucide-react';
import type { ContactItem, ContactRole, ContactStatus } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { ContactRoleStatusFields } from './form/ContactRoleStatusFields';
import { ContactIdentityFields } from './form/ContactIdentityFields';
import { ContactCompanyFields } from './form/ContactCompanyFields';
import { ContactCoordsFields } from './form/ContactCoordsFields';
import { ContactAddressFields } from './form/ContactAddressFields';
import { ContactLinkedPropertiesField } from './form/ContactLinkedPropertiesField';

interface ContactFormModalProps {
  initialContact?: ContactItem | null;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export function ContactFormModal({
  initialContact,
  onClose,
  onSaveSuccess,
}: ContactFormModalProps) {
  const { properties, createContact, updateContact } = useNellimoStore();
  const isEditing = !!initialContact;

  const [role, setRole] = useState<ContactRole>(initialContact?.role || 'autre');
  const [status, setStatus] = useState<ContactStatus>(initialContact?.status || 'actif');
  const [civility, setCivility] = useState<'M' | 'Mme' | 'M_Mme' | 'Societe' | ''>(
    initialContact?.civility || 'M'
  );
  const [firstName, setFirstName] = useState(initialContact?.first_name || '');
  const [lastName, setLastName] = useState(initialContact?.last_name || '');
  const [company, setCompany] = useState(initialContact?.company || '');
  const [specialty, setSpecialty] = useState(initialContact?.specialty || '');
  const [email, setEmail] = useState(initialContact?.email || '');
  const [secondaryEmail, setSecondaryEmail] = useState(initialContact?.secondary_email || '');
  const [phone, setPhone] = useState(initialContact?.phone || '');
  const [secondaryPhone, setSecondaryPhone] = useState(initialContact?.secondary_phone || '');
  const [address, setAddress] = useState(initialContact?.address || '');
  const [postalCode, setPostalCode] = useState(initialContact?.postal_code || '');
  const [city, setCity] = useState(initialContact?.city || '');
  const [siret, setSiret] = useState(initialContact?.siret || '');
  const [website, setWebsite] = useState(initialContact?.website || '');
  const [notes, setNotes] = useState(initialContact?.notes || '');
  const [isFavorite, setIsFavorite] = useState(initialContact?.is_favorite || false);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>(
    initialContact?.associated_property_ids || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !lastName.trim()) return;

    const payload = {
      role,
      status,
      civility: civility || undefined,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      company: company.trim() || undefined,
      specialty: specialty.trim() || undefined,
      email: email.trim(),
      secondary_email: secondaryEmail.trim() || undefined,
      phone: phone.trim(),
      secondary_phone: secondaryPhone.trim() || undefined,
      address: address.trim() || undefined,
      postal_code: postalCode.trim() || undefined,
      city: city.trim() || undefined,
      siret: siret.trim() || undefined,
      website: website.trim() || undefined,
      notes: notes.trim() || undefined,
      is_favorite: isFavorite,
      associated_property_ids: selectedPropertyIds,
    };

    if (isEditing && initialContact) {
      await updateContact(initialContact.id, payload);
    } else {
      await createContact({
        ...payload,
        tags: [],
        interactions: [],
        documents: [],
      });
    }

    onSaveSuccess?.();
    onClose();
  };

  const toggleProperty = (propId: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E12B7B]/10 flex items-center justify-center text-[#E12B7B]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#131B26]">
                {isEditing ? 'Modifier le contact' : 'Nouveau contact'}
              </h2>
              <p className="text-xs text-gray-500">
                Renseignez les coordonnées professionnelles ou personnelles.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <ContactRoleStatusFields
            role={role}
            status={status}
            isFavorite={isFavorite}
            onRoleChange={setRole}
            onStatusChange={setStatus}
            onFavoriteChange={setIsFavorite}
          />

          <ContactIdentityFields
            civility={civility}
            firstName={firstName}
            lastName={lastName}
            onCivilityChange={setCivility}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
          />

          <ContactCompanyFields
            company={company}
            specialty={specialty}
            siret={siret}
            website={website}
            onCompanyChange={setCompany}
            onSpecialtyChange={setSpecialty}
            onSiretChange={setSiret}
            onWebsiteChange={setWebsite}
          />

          <ContactCoordsFields
            phone={phone}
            secondaryPhone={secondaryPhone}
            email={email}
            secondaryEmail={secondaryEmail}
            onPhoneChange={setPhone}
            onSecondaryPhoneChange={setSecondaryPhone}
            onEmailChange={setEmail}
            onSecondaryEmailChange={setSecondaryEmail}
          />

          <ContactAddressFields
            address={address}
            postalCode={postalCode}
            city={city}
            notes={notes}
            onAddressChange={setAddress}
            onPostalCodeChange={setPostalCode}
            onCityChange={setCity}
            onNotesChange={setNotes}
          />

          <ContactLinkedPropertiesField
            properties={properties}
            selectedPropertyIds={selectedPropertyIds}
            onToggleProperty={toggleProperty}
          />

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Enregistrer les modifications' : 'Créer le contact'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
