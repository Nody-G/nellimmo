import React from 'react';
import {
  ContactHeader,
  ContactInfoCards,
  ContactForm,
} from '@/components/public/contact';

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      <ContactHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ContactInfoCards />
        <ContactForm />
      </div>
    </div>
  );
}
