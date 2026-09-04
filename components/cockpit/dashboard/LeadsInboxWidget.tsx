'use client';

import React, { useState } from 'react';
import { ContactLead, EstimationLead } from '@/lib/types';
import { Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LeadsInboxTabs, ContactLeadCard, EstimationLeadCard } from './leads';

interface LeadsInboxWidgetProps {
  contactLeads: ContactLead[];
  estimationLeads: EstimationLead[];
  onUpdateContactStatus: (id: string, status: ContactLead['status']) => Promise<void>;
  onDeleteContact: (id: string) => Promise<void>;
  onUpdateEstimationStatus: (id: string, status: EstimationLead['status']) => Promise<void>;
  onDeleteEstimation: (id: string) => Promise<void>;
}

export const LeadsInboxWidget: React.FC<LeadsInboxWidgetProps> = ({
  contactLeads,
  estimationLeads,
  onUpdateContactStatus,
  onDeleteContact,
  onUpdateEstimationStatus,
  onDeleteEstimation
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'estimations'>('contacts');

  const newContactsCount = contactLeads.filter((l) => l.status === 'nouveau').length;
  const newEstimationsCount = estimationLeads.filter((l) => l.status === 'nouveau').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#E12B7B]" />
          <CardTitle className="text-sm">Boîte de Réception Demandes Entrantes (Site Web)</CardTitle>
        </div>
        <LeadsInboxTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          contactsCount={contactLeads.length}
          newContactsCount={newContactsCount}
          estimationsCount={estimationLeads.length}
          newEstimationsCount={newEstimationsCount}
        />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {activeTab === 'contacts' ? (
          contactLeads.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              Aucune demande de contact reçue.
            </p>
          ) : (
            <div className="space-y-3">
              {contactLeads.slice(0, 5).map((lead) => (
                <ContactLeadCard
                  key={lead.id}
                  lead={lead}
                  onUpdateStatus={onUpdateContactStatus}
                  onDelete={onDeleteContact}
                />
              ))}
            </div>
          )
        ) : (
          estimationLeads.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              Aucune demande d&apos;estimation en ligne.
            </p>
          ) : (
            <div className="space-y-3">
              {estimationLeads.slice(0, 5).map((lead) => (
                <EstimationLeadCard
                  key={lead.id}
                  lead={lead}
                  onUpdateStatus={onUpdateEstimationStatus}
                  onDelete={onDeleteEstimation}
                />
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
