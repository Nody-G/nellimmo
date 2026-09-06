'use client';

import React, { useState, useMemo } from 'react';
import { Search, Eye, EyeOff, ArrowUpDown, Edit3, Check, X } from 'lucide-react';
import { CustomFieldDefinition, getEntityCustomValues, saveEntityCustomValues } from '@/lib/custom-fields';
import { sanitizeDatasetForExport } from '@/lib/database-security';

interface UniversalDataGridProps {
  collectionKey: string;
  records: Array<Record<string, unknown>>;
  customFields: CustomFieldDefinition[];
  onRefresh?: () => void;
}

export function UniversalDataGrid({
  collectionKey,
  records,
  customFields,
  onRefresh,
}: UniversalDataGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maskPii, setMaskPii] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortAsc, setSortAsc] = useState(true);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  // Filtrage et assainissement PII
  const displayedRecords = useMemo(() => {
    let list = records;
    if (maskPii) {
      list = sanitizeDatasetForExport(list, false);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((r) =>
        Object.values(r).some((v) =>
          typeof v === 'string'
            ? v.toLowerCase().includes(q)
            : typeof v === 'number'
            ? String(v).includes(q)
            : false
        )
      );
    }
    if (sortField) {
      list = [...list].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        const res = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        return sortAsc ? res : -res;
      });
    }
    return list;
  }, [records, maskPii, searchTerm, sortField, sortAsc]);

  // Détection automatique des clés principales à afficher
  const defaultKeys = useMemo(() => {
    if (records.length === 0) return ['id'];
    const sample = records[0];
    const excluded = ['description', 'images', 'documents', 'electronic_signature', 'url'];
    return Object.keys(sample)
      .filter((k) => !excluded.includes(k) && typeof sample[k] !== 'object')
      .slice(0, 6);
  }, [records]);

  const handleStartEdit = (rowId: string) => {
    const existing = getEntityCustomValues(collectionKey, rowId);
    const mapped: Record<string, string> = {};
    customFields.forEach((cf) => {
      mapped[cf.key] = String(existing[cf.key] ?? '');
    });
    setEditValues(mapped);
    setEditingRowId(rowId);
  };

  const handleSaveEdit = (rowId: string) => {
    saveEntityCustomValues(collectionKey, rowId, editValues);
    setEditingRowId(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans cette table..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E12B7B]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMaskPii(!maskPii)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              maskPii
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {maskPii ? <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> : <Eye className="w-3.5 h-3.5" />}
            {maskPii ? 'RGPD Actif (Données Masquées)' : 'Masquage PII'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[480px] custom-scrollbar border border-gray-100 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 sticky top-0">
            <tr>
              {defaultKeys.map((key) => (
                <th
                  key={key}
                  onClick={() => {
                    if (sortField === key) setSortAsc(!sortAsc);
                    else {
                      setSortField(key);
                      setSortAsc(true);
                    }
                  }}
                  className="py-2.5 px-3 whitespace-nowrap cursor-pointer hover:text-gray-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{key}</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
              ))}

              {customFields.map((cf) => (
                <th key={cf.key} className="py-2.5 px-3 whitespace-nowrap bg-pink-50/50 text-[#E12B7B]">
                  {cf.label} (Custom)
                </th>
              ))}

              <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedRecords.map((row, idx) => {
              const rowId = String(row.id || idx);
              const customVals = getEntityCustomValues(collectionKey, rowId);
              const isEditing = editingRowId === rowId;

              return (
                <tr key={rowId} className="hover:bg-gray-50/60 transition">
                  {defaultKeys.map((k) => (
                    <td key={k} className="py-2 px-3 text-gray-700 max-w-[200px] truncate">
                      {String(row[k] ?? '-')}
                    </td>
                  ))}

                  {customFields.map((cf) => (
                    <td key={cf.key} className="py-2 px-3 text-gray-900 bg-pink-50/20">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues[cf.key] ?? ''}
                          onChange={(e) =>
                            setEditValues({ ...editValues, [cf.key]: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs border border-pink-300 rounded bg-white"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">
                          {String(customVals[cf.key] || '-')}
                        </span>
                      )}
                    </td>
                  ))}

                  <td className="py-2 px-3 text-right whitespace-nowrap">
                    {customFields.length > 0 && (
                      isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(rowId)}
                            className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            title="Sauvegarder"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingRowId(null)}
                            className="p-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                            title="Annuler"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(rowId)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                          title="Éditer les champs personnalisés"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
