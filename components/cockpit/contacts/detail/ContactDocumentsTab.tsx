'use client';

import React from 'react';
import { Shield, FileText } from 'lucide-react';
import type { ContactItem } from '@/lib/types';

interface ContactDocumentsTabProps {
  contact: ContactItem;
}

export function ContactDocumentsTab({ contact }: ContactDocumentsTabProps) {
  return (
    <div className="space-y-3">
      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 flex items-center gap-3">
        <Shield className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="text-xs text-blue-900 font-medium">
          Les pièces légales des partenaires (assurance décennale, Kbis, carte pro) sont archivées dans la GED du Cockpit.
        </div>
      </div>

      {!contact.documents || contact.documents.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-xs">
          Aucun document rattaché pour l’instant.
        </div>
      ) : (
        contact.documents.map((doc) => (
          <div
            key={doc.id}
            className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-bold text-gray-900">{doc.name}</div>
                <div className="text-[10px] text-gray-400">Catégorie : {doc.category}</div>
              </div>
            </div>
            <span className="text-[10px] text-gray-400">Ajouté le {doc.uploaded_at}</span>
          </div>
        ))
      )}
    </div>
  );
}
