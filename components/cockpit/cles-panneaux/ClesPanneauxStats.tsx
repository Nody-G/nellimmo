'use client';

import React from 'react';
import {
  KeyRound,
  ShieldCheck,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface ClesPanneauxStatsProps {
  totalKeys: number;
  availableKeys: number;
  borrowedKeys: number;
  installedSignboards: number;
  inStockSignboards: number;
  toRemoveSignboards: number;
}

export function ClesPanneauxStats({
  totalKeys,
  availableKeys,
  borrowedKeys,
  installedSignboards,
  inStockSignboards,
  toRemoveSignboards,
}: ClesPanneauxStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
            En Armoire à l’Agence
          </span>
          <span className="text-2xl font-serif font-black text-emerald-700 mt-1 block">
            {availableKeys} <span className="text-xs font-sans font-medium text-gray-400">/ {totalKeys} clés</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Prêtes pour visites
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <KeyRound className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
            Trousseaux Sortis (Prêtés)
          </span>
          <span className="text-2xl font-serif font-black text-amber-700 mt-1 block">
            {borrowedKeys}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Artisans & diagnostiqueurs
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <UserCheck className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
            Panneaux Posés
          </span>
          <span className="text-2xl font-serif font-black text-[#131B26] mt-1 block">
            {installedSignboards} <span className="text-xs font-sans font-medium text-gray-400">sur le terrain</span>
          </span>
          <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
            {inStockSignboards} panneaux disponibles en réserve
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold">
          <Building className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
            Déposes Légales Requises
          </span>
          <span className="text-2xl font-serif font-black text-rose-600 mt-1 block">
            {toRemoveSignboards}
          </span>
          <span className="text-[11px] text-rose-500 font-bold mt-0.5 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Loi Grenelle II (3 mois max)
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
