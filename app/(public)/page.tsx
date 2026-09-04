'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/public-store';
import {
  HeroSearchSection,
  FeaturedPropertiesSection,
  AgencyValuePropsSection,
  SellerCallToActionSection,
  ReviewsHighlightSection,
} from '@/components/public/home';

export default function HomePage() {
  const router = useRouter();
  const { properties } = useNellimoStore();

  // Search state
  const [propertyType, setPropertyType] = useState('tous');
  const [city, setCity] = useState('tous');
  const [budgetMax, setBudgetMax] = useState('1000000');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType !== 'tous') params.append('type', propertyType);
    if (city !== 'tous') params.append('ville', city);
    if (budgetMax) params.append('budget', budgetMax);
    router.push(`/biens?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20 animate-fade-in">
      {/* 1. Hero Search */}
      <HeroSearchSection
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        city={city}
        onCityChange={setCity}
        budgetMax={budgetMax}
        onBudgetMaxChange={setBudgetMax}
        onSubmit={handleSearch}
      />

      {/* 2. Featured Properties */}
      <FeaturedPropertiesSection properties={properties} />

      {/* 3. Agency Value Props & Storytelling */}
      <AgencyValuePropsSection />

      {/* 4. Seller Call to Action */}
      <SellerCallToActionSection />

      {/* 5. Verified Reviews */}
      <ReviewsHighlightSection />
    </div>
  );
}
