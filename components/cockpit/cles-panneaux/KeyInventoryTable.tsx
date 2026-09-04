'use client';

import React from 'react';
import { AgencyKey, Property } from '@/lib/types';
import { KeyFilterSearchBar } from './KeyFilterSearchBar';
import { KeyCardItem } from './KeyCardItem';

interface KeyInventoryTableProps {
  keys: AgencyKey[];
  properties: Property[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onBorrowKey: (key: AgencyKey) => void;
  onReturnKey: (key: AgencyKey) => void;
  onPrintDischarge: (key: AgencyKey) => void;
}

export const KeyInventoryTable: React.FC<KeyInventoryTableProps> = ({
  keys,
  properties,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onBorrowKey,
  onReturnKey,
  onPrintDischarge
}) => {
  const filteredKeys = keys.filter((k) => {
    const prop = properties.find((p) => p.id === k.property_id);
    const searchStr = `${k.keyring_number} ${k.cabinet_location} ${prop?.title || ''} ${prop?.city || ''} ${k.current_borrower?.borrower_name || ''}`.toLowerCase();
    const matchSearch = searchStr.includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'tous' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <KeyFilterSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />

      {/* Key Cabinet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKeys.map((key) => {
          const prop = properties.find((p) => p.id === key.property_id);
          return (
            <KeyCardItem
              key={key.id}
              keyItem={key}
              property={prop}
              onBorrowKey={onBorrowKey}
              onReturnKey={onReturnKey}
              onPrintDischarge={onPrintDischarge}
            />
          );
        })}
      </div>
    </div>
  );
};
