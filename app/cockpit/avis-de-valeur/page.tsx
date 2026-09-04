'use client';

import React, { useState, Suspense, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchDvfTransactions, getActiveDvfSourceLabel, isDvfSourceOfficial } from '@/lib/dvf';
import type { DVFTransaction } from '@/lib/types';
import type { ValuationInputs, MethodTab } from '@/components/cockpit/avis-de-valeur/avis-de-valeur-types';
import { computeValuationResults, filterComparableTransactions } from '@/components/cockpit/avis-de-valeur/avis-de-valeur-types';
import { ValuationHeader } from '@/components/cockpit/avis-de-valeur/ValuationHeader';
import { PropertyForm } from '@/components/cockpit/avis-de-valeur/PropertyForm';
import { MethodologyPanel } from '@/components/cockpit/avis-de-valeur/MethodologyPanel';
import { TriangulationPanel } from '@/components/cockpit/avis-de-valeur/TriangulationPanel';
import { DvfTransactionsTable } from '@/components/cockpit/avis-de-valeur/DvfTransactionsTable';
import { ExpertiseDossier } from '@/components/cockpit/avis-de-valeur/ExpertiseDossier';

function ValuationDvfContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || 'Pélissanne';
  const initialSurface = Number(searchParams.get('surface')) || 148;
  const initialOwner = searchParams.get('owner') || 'M. et Mme Dupont';
  const initialAddress = searchParams.get('address');

  const [inputs, setInputs] = useState<ValuationInputs>(() => ({
    addressSearch: initialAddress
      ? `${initialAddress}, ${initialCity}`
      : `145 Chemin des Oliviers, 13330 ${initialCity}`,
    propertyType: 'Maison',
    surfaceInput: initialSurface,
    landInput: 1100,
    roomsInput: 5,
    ownerName: initialOwner,
    stateAdjustment: 5,
    poolAdjustment: 6,
    quietAdjustment: 4,
    dpeAdjustment: 2,
    viewAdjustment: 3,
    estimatedMonthlyRent: 1850,
    targetCapRate: 5.2,
    landValueM2: 180,
    buildCostM2: 2100,
    depreciationPct: 15,
  }));

  const [transactions, setTransactions] = useState<DVFTransaction[]>([]);
  const [isDossierGenerated, setIsDossierGenerated] = useState(false);
  const [activeMethodTab, setActiveMethodTab] = useState<MethodTab>('dvf');

  // Load DVF references through the provider seam (currently the local simulation source).
  useEffect(() => {
    let active = true;
    fetchDvfTransactions({
      locality: initialCity,
      postalCode: initialCity === 'Pélissanne' ? '13330' : undefined,
      propertyType: inputs.propertyType,
    })
      .then((rows) => {
        if (active) setTransactions(rows);
      })
      .catch(() => {
        if (active) setTransactions([]);
      });
    return () => {
      active = false;
    };
  }, [initialCity, inputs.propertyType]);

  const results = useMemo(() => computeValuationResults(inputs, transactions), [inputs, transactions]);

  // References actually used by the engine: only the comparable property type.
  const comparableTransactions = useMemo(
    () => filterComparableTransactions(transactions, inputs.propertyType),
    [transactions, inputs.propertyType]
  );

  const handleFieldChange = useCallback((patch: Partial<ValuationInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDossierGenerated(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <ValuationHeader onGenerate={() => setIsDossierGenerated(true)} />

      <PropertyForm inputs={inputs} onChange={handleFieldChange} onSubmit={handleSearch} />

      <MethodologyPanel
        inputs={inputs}
        results={results}
        activeMethodTab={activeMethodTab}
        onChange={handleFieldChange}
        onTabChange={setActiveMethodTab}
      />

      <TriangulationPanel inputs={inputs} results={results} />

      <DvfTransactionsTable
        transactions={comparableTransactions}
        propertyType={inputs.propertyType}
        sourceLabel={getActiveDvfSourceLabel()}
        isOfficial={isDvfSourceOfficial()}
      />

      {isDossierGenerated && (
        <ExpertiseDossier
          ownerName={inputs.ownerName}
          addressSearch={inputs.addressSearch}
          surfaceInput={inputs.surfaceInput}
          landInput={inputs.landInput}
          roomsInput={inputs.roomsInput}
          transactions={comparableTransactions}
          baseDvfM2={results.baseDvfM2}
          priceTarget={results.priceTarget}
          initialCity={initialCity}
        />
      )}
    </div>
  );
}

export default function ValuationDvfPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-gray-500">Chargement du laboratoire d{"\u2019"}estimation…</div>}>
      <ValuationDvfContent />
    </Suspense>
  );
}
