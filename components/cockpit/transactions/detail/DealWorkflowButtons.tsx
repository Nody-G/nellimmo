'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { TransactionDeal } from '@/lib/types';
import { STATUS_COLUMNS } from '../transactions-types';

interface DealWorkflowButtonsProps {
  dealId: string;
  currentStatus: TransactionDeal['status'];
  onUpdateStatus: (id: string, status: TransactionDeal['status']) => void;
}

export const DealWorkflowButtons: React.FC<DealWorkflowButtonsProps> = ({
  dealId,
  currentStatus,
  onUpdateStatus
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
      <span className="text-xs font-bold uppercase text-gray-700 block tracking-wider">
        Avancement de l’Étape Notariale
      </span>
      <div className="flex flex-wrap gap-2">
        {STATUS_COLUMNS.map((col) => {
          const isActive = currentStatus === col.id;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onUpdateStatus(dealId, col.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#E12B7B] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isActive && <Check className="w-3.5 h-3.5" />}
              <span>{col.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
