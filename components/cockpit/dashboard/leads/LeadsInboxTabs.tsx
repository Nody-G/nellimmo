'use client';

import React from 'react';

interface LeadsInboxTabsProps {
  activeTab: 'contacts' | 'estimations';
  onTabChange: (tab: 'contacts' | 'estimations') => void;
  contactsCount: number;
  newContactsCount: number;
  estimationsCount: number;
  newEstimationsCount: number;
}

export const LeadsInboxTabs: React.FC<LeadsInboxTabsProps> = ({
  activeTab,
  onTabChange,
  contactsCount,
  newContactsCount,
  estimationsCount,
  newEstimationsCount
}) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
      <button
        type="button"
        onClick={() => onTabChange('contacts')}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
          activeTab === 'contacts'
            ? 'bg-white text-gray-900 shadow-xs'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <span>Contacts ({contactsCount})</span>
        {newContactsCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-[#E12B7B] animate-ping" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onTabChange('estimations')}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
          activeTab === 'estimations'
            ? 'bg-white text-gray-900 shadow-xs'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <span>Estimations ({estimationsCount})</span>
        {newEstimationsCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-[#C59A45] animate-ping" />
        )}
      </button>
    </div>
  );
};
