'use client';

import React from 'react';

export function scoreColor(score: number): string {
  if (score >= 70) return '#E11D48';
  if (score >= 45) return '#D97706';
  return '#3B82F6';
}

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const color = scoreColor(score);
  const circumference = 2 * Math.PI * 26;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#F3E8EE" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-serif font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

interface InfoChipProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

export const InfoChip: React.FC<InfoChipProps> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-[#E12B7B] mt-0.5">{icon}</span>
      <div>
        <span className="text-gray-400 font-bold uppercase text-[10px] block">{label}</span>
        <span className="text-gray-800 font-medium">{value}</span>
      </div>
    </div>
  );
};
