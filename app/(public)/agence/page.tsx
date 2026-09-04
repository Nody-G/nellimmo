import React from 'react';
import { FeeCalculator } from '@/components/public/FeeCalculator';
import {
  AgenceHeader,
  AgenceStorySection,
  AgenceServicesGrid,
  AgencePracticalInfo,
} from '@/components/public/agence';

export default function AgencyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      <AgenceHeader />
      <AgenceStorySection />
      <AgenceServicesGrid />
      <FeeCalculator />
      <AgencePracticalInfo />
    </div>
  );
}
