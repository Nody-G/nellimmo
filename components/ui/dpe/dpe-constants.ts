import { DpeLetter, GesLetter } from '@/lib/types';

export const DPE_COLORS: Record<DpeLetter, { bg: string; text: string; label: string; range: string }> = {
  A: { bg: '#009E52', text: '#FFFFFF', label: '≤ 70', range: 'A' },
  B: { bg: '#33B85B', text: '#FFFFFF', label: '71 à 110', range: 'B' },
  C: { bg: '#99D25F', text: '#1C232B', label: '111 à 180', range: 'C' },
  D: { bg: '#FFE833', text: '#1C232B', label: '181 à 250', range: 'D' },
  E: { bg: '#F8B633', text: '#1C232B', label: '251 à 330', range: 'E' },
  F: { bg: '#EC6A33', text: '#FFFFFF', label: '331 à 420', range: 'F' },
  G: { bg: '#DF1A22', text: '#FFFFFF', label: '> 420', range: 'G' },
};

export const GES_COLORS: Record<GesLetter, { bg: string; text: string; label: string; range: string }> = {
  A: { bg: '#A6CDE2', text: '#1C232B', label: '≤ 6', range: 'A' },
  B: { bg: '#86B5D8', text: '#FFFFFF', label: '7 à 11', range: 'B' },
  C: { bg: '#6A92C5', text: '#FFFFFF', label: '12 à 30', range: 'C' },
  D: { bg: '#546EA8', text: '#FFFFFF', label: '31 à 50', range: 'D' },
  E: { bg: '#48508F', text: '#FFFFFF', label: '51 à 70', range: 'E' },
  F: { bg: '#3B3673', text: '#FFFFFF', label: '71 à 100', range: 'F' },
  G: { bg: '#292153', text: '#FFFFFF', label: '> 100', range: 'G' },
};

export const DPE_LETTERS: DpeLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
