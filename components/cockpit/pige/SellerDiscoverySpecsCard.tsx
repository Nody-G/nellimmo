'use client';

import React from 'react';
import type { PropertyType } from '@/lib/types';

interface SellerDiscoverySpecsCardProps {
  propertyType: PropertyType;
  onPropertyTypeChange: (type: PropertyType) => void;
  livingArea: number;
  onLivingAreaChange: (val: number) => void;
  landArea: number;
  onLandAreaChange: (val: number) => void;
  roomsCount: number;
  onRoomsCountChange: (val: number) => void;
  bedroomsCount: number;
  onBedroomsCountChange: (val: number) => void;
  hasPool: boolean;
  onHasPoolChange: (val: boolean) => void;
  hasGarage: boolean;
  onHasGarageChange: (val: boolean) => void;
  condition: 'impeccable' | 'bon_etat' | 'a_renover';
  onConditionChange: (val: 'impeccable' | 'bon_etat' | 'a_renover') => void;
}

export function SellerDiscoverySpecsCard({
  propertyType,
  onPropertyTypeChange,
  livingArea,
  onLivingAreaChange,
  landArea,
  onLandAreaChange,
  roomsCount,
  onRoomsCountChange,
  bedroomsCount,
  onBedroomsCountChange,
  hasPool,
  onHasPoolChange,
  hasGarage,
  onHasGarageChange,
  condition,
  onConditionChange,
}: SellerDiscoverySpecsCardProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-2 text-xs">
      <div className="flex items-center justify-between pb-1 border-b border-gray-200">
        <span className="font-bold text-gray-700">Type de bien :</span>
        <select
          value={propertyType}
          onChange={(e) => onPropertyTypeChange(e.target.value as PropertyType)}
          className="p-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-800"
        >
          <option value="maison">Maison / Villa</option>
          <option value="appartement">Appartement</option>
          <option value="terrain">Terrain à bâtir</option>
          <option value="immeuble">Immeuble de rapport</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div>
          <span className="text-[10px] text-gray-500 block">Surface Hab.</span>
          <input
            type="number"
            value={livingArea}
            onChange={(e) => onLivingAreaChange(parseFloat(e.target.value) || 0)}
            className="w-full font-bold p-1.5 bg-white border border-gray-200 rounded"
          />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block">Terrain (m²)</span>
          <input
            type="number"
            value={landArea}
            onChange={(e) => onLandAreaChange(parseFloat(e.target.value) || 0)}
            className="w-full font-bold p-1.5 bg-white border border-gray-200 rounded"
          />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block">Pièces</span>
          <input
            type="number"
            value={roomsCount}
            onChange={(e) => onRoomsCountChange(parseInt(e.target.value) || 1)}
            className="w-full font-bold p-1.5 bg-white border border-gray-200 rounded"
          />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block">Chambres</span>
          <input
            type="number"
            value={bedroomsCount}
            onChange={(e) => onBedroomsCountChange(parseInt(e.target.value) || 1)}
            className="w-full font-bold p-1.5 bg-white border border-gray-200 rounded"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={hasPool} onChange={(e) => onHasPoolChange(e.target.checked)} />
          <span>🏊 Piscine</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={hasGarage} onChange={(e) => onHasGarageChange(e.target.checked)} />
          <span>🚗 Garage</span>
        </label>
        <select
          value={condition}
          onChange={(e) => onConditionChange(e.target.value as typeof condition)}
          className="p-1 bg-white border border-gray-200 rounded text-xs ml-auto"
        >
          <option value="impeccable">État impeccable</option>
          <option value="bon_etat">Bon état général</option>
          <option value="a_renover">Travaux à prévoir</option>
        </select>
      </div>
    </div>
  );
}
