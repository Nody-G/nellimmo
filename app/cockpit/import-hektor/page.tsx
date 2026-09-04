'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { parseHektorPropertiesCsv, parseHektorBuyersCsv, ParseResult } from '@/lib/hektor';
import { Property, Buyer } from '@/lib/types';
import { ImportType, downloadSampleCsv, downloadFullBackup, FullBackupData } from '@/components/cockpit/import-hektor/import-hektor-types';
import { ImportHektorHeader } from '@/components/cockpit/import-hektor/ImportHektorHeader';
import { ImportSuccessBanner } from '@/components/cockpit/import-hektor/ImportSuccessBanner';
import { ImportInputPanel } from '@/components/cockpit/import-hektor/ImportInputPanel';
import { ImportPreviewPanel } from '@/components/cockpit/import-hektor/ImportPreviewPanel';

export default function HektorMigrationPage() {
  const { properties, buyers, visits, auditLogs, createProperty, updateProperty, createBuyer } =
    useNellimoStore();

  const [importType, setImportType] = useState<ImportType>('mandates');
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [updateExisting, setUpdateExisting] = useState(true);

  // Parsing state
  const [isParsing, setIsParsing] = useState(false);
  const [propertyParseResult, setPropertyParseResult] = useState<ParseResult<Property> | null>(null);
  const [buyerParseResult, setBuyerParseResult] = useState<ParseResult<Buyer> | null>(null);

  // Execution state
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionSuccess, setInjectionSuccess] = useState(false);
  const [injectedCount, setInjectedCount] = useState(0);

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setInputText(content);
      executeParse(content, importType);
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  // Handle direct text parse
  const executeParse = (text: string, type: ImportType) => {
    if (!text.trim()) {
      setPropertyParseResult(null);
      setBuyerParseResult(null);
      return;
    }

    if (type === 'mandates') {
      const result = parseHektorPropertiesCsv(text);
      setPropertyParseResult(result);
      setBuyerParseResult(null);
    } else {
      const result = parseHektorBuyersCsv(text);
      setBuyerParseResult(result);
      setPropertyParseResult(null);
    }
  };

  const handleSelectType = (type: ImportType) => {
    setImportType(type);
    if (inputText) executeParse(inputText, type);
  };

  const handleRunParse = () => {
    setIsParsing(true);
    executeParse(inputText, importType);
    setIsParsing(false);
  };

  const handleClear = () => {
    setInputText('');
    setFileName('');
    setPropertyParseResult(null);
    setBuyerParseResult(null);
  };

  // Inject into real store
  const handleCommitImport = async () => {
    setIsInjecting(true);
    let count = 0;

    try {
      if (importType === 'mandates' && propertyParseResult) {
        for (const prop of propertyParseResult.items) {
          const existing = properties.find(
            (p) => p.mandate_number === prop.mandate_number || p.id === prop.id
          );
          if (existing && updateExisting) {
            await updateProperty(existing.id, prop);
          } else if (!existing) {
            await createProperty(prop);
          }
          count++;
        }
      } else if (importType === 'buyers' && buyerParseResult) {
        for (const b of buyerParseResult.items) {
          await createBuyer(b);
          count++;
        }
      }

      setInjectedCount(count);
      setInjectionSuccess(true);
      // Reset input
      setInputText('');
      setFileName('');
      setPropertyParseResult(null);
      setBuyerParseResult(null);
    } finally {
      setIsInjecting(false);
    }
  };

  const handleDownloadSample = () => downloadSampleCsv(importType);

  const handleExportFullBackup = () => {
    const fullBackup: FullBackupData = {
      agency: "Nell'Immo Immobilier (Pélissanne)",
      exported_at: new Date().toISOString(),
      counts: {
        properties: properties.length,
        buyers: buyers.length,
        visits: visits.length,
        auditLogs: auditLogs.length,
      },
      properties,
      buyers,
      visits,
      auditLogs,
    };
    downloadFullBackup(fullBackup);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <ImportHektorHeader
        onDownloadSample={handleDownloadSample}
        onExportFullBackup={handleExportFullBackup}
      />

      {/* SUCCESS BANNER */}
      {injectionSuccess && (
        <ImportSuccessBanner
          injectedCount={injectedCount}
          onClose={() => setInjectionSuccess(false)}
        />
      )}

      {/* MAIN IMPORT WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column : Input Box & File Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ImportInputPanel
            importType={importType}
            inputText={inputText}
            fileName={fileName}
            updateExisting={updateExisting}
            isParsing={isParsing}
            onSelectType={handleSelectType}
            onFileUpload={handleFileUpload}
            onTextChange={(text) => {
              setInputText(text);
              executeParse(text, importType);
            }}
            onToggleUpdateExisting={setUpdateExisting}
            onClear={handleClear}
            onRunParse={handleRunParse}
          />
        </div>

        {/* Right Column : Live Data Preview & Commit (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ImportPreviewPanel
            propertyParseResult={propertyParseResult}
            buyerParseResult={buyerParseResult}
            isInjecting={isInjecting}
            onCommitImport={handleCommitImport}
          />
        </div>
      </div>
    </div>
  );
}
