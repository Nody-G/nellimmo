'use client';

import React from 'react';

interface ContactCoordsFieldsProps {
  phone: string;
  secondaryPhone: string;
  email: string;
  secondaryEmail: string;
  onPhoneChange: (phone: string) => void;
  onSecondaryPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onSecondaryEmailChange: (email: string) => void;
}

export function ContactCoordsFields({
  phone,
  secondaryPhone,
  email,
  secondaryEmail,
  onPhoneChange,
  onSecondaryPhoneChange,
  onEmailChange,
  onSecondaryEmailChange,
}: ContactCoordsFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Téléphone portable principal *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="06 ..."
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-bold text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Téléphone secondaire (bureau/fixe)
          </label>
          <input
            type="tel"
            value={secondaryPhone}
            onChange={(e) => onSecondaryPhoneChange(e.target.value)}
            placeholder="04 ..."
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Email principal
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="contact@exemple.fr"
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Email secondaire / Clerc
          </label>
          <input
            type="email"
            value={secondaryEmail}
            onChange={(e) => onSecondaryEmailChange(e.target.value)}
            placeholder="clerc@notaires.fr"
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
      </div>
    </div>
  );
}
