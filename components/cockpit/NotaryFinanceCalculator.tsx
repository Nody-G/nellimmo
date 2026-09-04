'use client';

import React, { useState, useId, useMemo } from 'react';
import { NotaryHeader } from './notary-finance/NotaryHeader';
import { NotaryTab } from './notary-finance/NotaryTab';
import { CapitalGainsTab } from './notary-finance/CapitalGainsTab';
import {
  computeNotaryResults,
  computeCapitalGainsResults,
  type NotaryTab as NotaryTabType,
  type NotaryInputs,
  type CapitalGainsInputs,
} from './notary-finance/notary-finance-types';

interface NotaryFinanceCalculatorProps {
  initialTab?: NotaryTabType;
}

export function NotaryFinanceCalculator({ initialTab = 'notary' }: NotaryFinanceCalculatorProps = {}) {
  const purchasePriceId = useId();
  const furnitureValueId = useId();
  const propertyStateId = useId();
  const departmentId = useId();
  const isPrincipalResidenceId = useId();
  const salePriceId = useId();
  const initialPurchasePriceId = useId();
  const holdingYearsId = useId();
  const worksOptionId = useId();

  const [activeTab, setActiveTab] = useState<NotaryTabType>(initialTab);

  // Notary fees inputs
  const [notaryInputs, setNotaryInputs] = useState<NotaryInputs>({
    purchasePrice: 450000,
    furnitureValue: 12000,
    propertyState: 'ancien',
    departmentRate: 5.8, // 5.80% Bouches-du-Rhône
  });

  // Capital gains inputs
  const [capitalInputs, setCapitalInputs] = useState<CapitalGainsInputs>({
    salePrice: 520000,
    initialPurchasePrice: 340000,
    holdingYears: 8,
    isPrincipalResidence: false,
    worksOption: 'forfait',
    realWorksAmount: 0,
  });

  const notaryResults = useMemo(() => computeNotaryResults(notaryInputs), [notaryInputs]);
  const capitalResults = useMemo(() => computeCapitalGainsResults(capitalInputs), [capitalInputs]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
      <NotaryHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'notary' && (
        <NotaryTab
          inputs={notaryInputs}
          results={notaryResults}
          ids={{
            purchasePrice: purchasePriceId,
            furnitureValue: furnitureValueId,
            propertyState: propertyStateId,
            department: departmentId,
          }}
          onChange={(patch) => setNotaryInputs((prev) => ({ ...prev, ...patch }))}
        />
      )}

      {activeTab === 'capital_gains' && (
        <CapitalGainsTab
          inputs={capitalInputs}
          results={capitalResults}
          ids={{
            isPrincipalResidence: isPrincipalResidenceId,
            salePrice: salePriceId,
            initialPurchasePrice: initialPurchasePriceId,
            holdingYears: holdingYearsId,
            worksOption: worksOptionId,
          }}
          onChange={(patch) => setCapitalInputs((prev) => ({ ...prev, ...patch }))}
        />
      )}
    </div>
  );
}
