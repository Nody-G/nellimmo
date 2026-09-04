'use client';

import React, { useState, useRef } from 'react';
import { AgencyKey, Property, KeyBorrowerRole } from '@/lib/types';
import { UserCheck, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SignaturePad, SignaturePadHandle } from './SignaturePad';
import { BorrowerFields } from './BorrowerFields';

interface KeyLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKey: AgencyKey | null;
  properties: Property[];
  onConfirmBorrow: (data: {
    borrowerName: string;
    borrowerPhone: string;
    borrowerCompany?: string;
    borrowerRole: KeyBorrowerRole;
    loanPurpose: string;
    expectedReturnDate: string;
    signatureUrl?: string;
  }) => Promise<void>;
}

export const KeyLoanModal: React.FC<KeyLoanModalProps> = ({
  isOpen,
  onClose,
  selectedKey,
  properties,
  onConfirmBorrow
}) => {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('');
  const [borrowerCompany, setBorrowerCompany] = useState('');
  const [borrowerRole, setBorrowerRole] = useState<KeyBorrowerRole>('artisan');
  const [loanPurpose, setLoanPurpose] = useState('Visite technique & devis');
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4);
    return d.toISOString().slice(0, 16);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signaturePadRef = useRef<SignaturePadHandle | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName || !borrowerPhone) return;

    const signatureUrl = signaturePadRef.current?.toDataURL() || undefined;

    try {
      setIsSubmitting(true);
      await onConfirmBorrow({
        borrowerName,
        borrowerPhone,
        borrowerCompany: borrowerCompany || undefined,
        borrowerRole,
        loanPurpose,
        expectedReturnDate,
        signatureUrl
      });
      // Reset form
      setBorrowerName('');
      setBorrowerPhone('');
      setBorrowerCompany('');
      signaturePadRef.current?.clear();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedKey) return null;

  const prop = properties.find((p) => p.id === selectedKey.property_id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#E12B7B]" />
          <h3 className="text-lg font-serif font-bold text-[#131B26]">
            Prêt du Trousseau #{selectedKey.keyring_number}
          </h3>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-gray-50 rounded-xl space-y-1">
          <span className="font-bold text-gray-700 block">Bien concerné :</span>
          <p className="text-gray-900 font-semibold">{prop?.title || 'Bien non lié'}</p>
          <p className="text-[11px] text-gray-500">
            {selectedKey.keys_count} clés sur anneau • Emplacement : {selectedKey.cabinet_location}
          </p>
        </div>

        <BorrowerFields
          borrowerName={borrowerName}
          setBorrowerName={setBorrowerName}
          borrowerPhone={borrowerPhone}
          setBorrowerPhone={setBorrowerPhone}
          borrowerCompany={borrowerCompany}
          setBorrowerCompany={setBorrowerCompany}
          borrowerRole={borrowerRole}
          setBorrowerRole={setBorrowerRole}
          loanPurpose={loanPurpose}
          setLoanPurpose={setLoanPurpose}
          expectedReturnDate={expectedReturnDate}
          setExpectedReturnDate={setExpectedReturnDate}
        />

        <SignaturePad ref={signaturePadRef} />

        <div className="p-3 bg-gray-50 rounded-xl text-[10px] text-gray-500 leading-relaxed">
          Par son émargement, l&apos;emprunteur reconnaît avoir reçu ce jour les clés désignées sous sa responsabilité exclusive, s&apos;interdit formellement toute reproduction et s&apos;engage à les restituer dans le délai convenu.
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Valider & Enregistrer le Prêt
          </Button>
        </div>
      </form>
    </Modal>
  );
};
