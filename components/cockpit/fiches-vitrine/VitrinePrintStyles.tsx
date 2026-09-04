'use client';

import React from 'react';
import { LayoutFormat } from './flyer-types';

interface VitrinePrintStylesProps {
  flyerFormat: LayoutFormat;
}

export function VitrinePrintStyles({ flyerFormat }: VitrinePrintStylesProps) {
  const pageSize =
    flyerFormat === 'A4_portrait'
      ? 'A4 portrait'
      : flyerFormat === 'A3_landscape'
        ? 'A3 landscape'
        : flyerFormat === 'social_square'
          ? '210mm 210mm'
          : flyerFormat === 'story_vertical'
            ? '108mm 192mm'
            : 'A4 landscape';

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: ${pageSize};
              margin: 4mm;
            }
            body {
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            body * {
              visibility: hidden;
            }
            .print-flyer-target, .print-flyer-target * {
              visibility: visible;
            }
            .print-flyer-target {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 16px !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `,
      }}
    />
  );
}
