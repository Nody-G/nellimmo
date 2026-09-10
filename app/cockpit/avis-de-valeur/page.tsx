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
import { useGoogleReviews } from '@/components/cockpit/parametres/google/useGoogleReviews';
import { starRatingToNumber } from '@/lib/google/services/reviews';

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

  const {
    loadReviews,
    isLoading: isLoadingReviews,
    reviews: googleReviews,
    averageRating,
    totalReviewCount,
  } = useGoogleReviews();

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
      <ValuationHeader
        onGenerate={() => setIsDossierGenerated(true)}
        onLoadGoogleReviews={loadReviews}
        isLoadingReviews={isLoadingReviews}
      />

      {googleReviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F3E8EE] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <span className="text-amber-500">★</span>
              Avis Google de l&rsquo;agence
            </h2>
            <span className="text-xs font-semibold text-gray-500">
              {averageRating !== null ? `${averageRating.toFixed(1)}/5` : '—'}
              {totalReviewCount !== null ? ` · ${totalReviewCount} avis` : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {googleReviews.slice(0, 6).map((review, idx) => (
              <div
                key={idx}
                className="border border-gray-100 rounded-xl p-3 space-y-1.5 bg-[#FAF5F8]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131B26]">
                    {review.reviewer?.displayName || 'Client Google'}
                  </span>
                  <span className="text-[11px] text-amber-500">
                    {'★'.repeat(starRatingToNumber(review.starRating))}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
