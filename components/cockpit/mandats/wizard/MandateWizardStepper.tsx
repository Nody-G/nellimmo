'use client';

import React from 'react';
import {
  User,
  MapPin,
  Euro,
  Home,
  Zap,
  Radio
} from 'lucide-react';

interface MandateWizardStepperProps {
  activeStep?: string;
  onStepClick?: (stepId: string) => void;
}

const STEPS = [
  { id: 'step-seller', label: 'Vendeur', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'step-location', label: 'Localisation', icon: <MapPin className="w-3.5 h-3.5" /> },
  { id: 'step-financials', label: 'Finances', icon: <Euro className="w-3.5 h-3.5" /> },
  { id: 'step-features', label: 'Surfaces', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 'step-dpe', label: 'DPE / Climat', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'step-media', label: 'Diffusion', icon: <Radio className="w-3.5 h-3.5" /> }
];

export const MandateWizardStepper: React.FC<MandateWizardStepperProps> = ({
  onStepClick
}) => {
  const scrollTo = (id: string) => {
    if (onStepClick) {
      onStepClick(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between gap-1 overflow-x-auto">
        {STEPS.map((s, index) => (
          <button
            type="button"
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
              {index + 1}
            </span>
            <span className="hidden sm:inline">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
