'use client';

import React from 'react';
import Image from 'next/image';
import type { PhotoArrangement } from './flyer-types';

interface PhotoArrangementBlockProps {
  arrangement: PhotoArrangement;
  getPhotoUrl: (slotIndex: number) => string;
}

export function PhotoArrangementBlock({
  arrangement,
  getPhotoUrl
}: PhotoArrangementBlockProps) {
  if (arrangement === 'hero_only') {
    return (
      <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
        <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 100vw, 780px" className="object-cover" priority />
      </div>
    );
  }

  if (arrangement === 'split_2') {
    return (
      <div className="grid grid-cols-2 gap-3 aspect-16/9 w-full">
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
          <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" priority />
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
          <Image src={getPhotoUrl(1)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" />
        </div>
      </div>
    );
  }

  if (arrangement === 'standard_3') {
    return (
      <div className="grid grid-cols-3 gap-3 aspect-16/9 w-full">
        <div className="relative col-span-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
          <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 66vw, 500px" className="object-cover" priority />
        </div>
        <div className="space-y-3 flex flex-col justify-between">
          <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <Image src={getPhotoUrl(1)} alt="" fill sizes="(max-width: 780px) 33vw, 250px" className="object-cover" />
          </div>
          <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <Image src={getPhotoUrl(2)} alt="" fill sizes="(max-width: 780px) 33vw, 250px" className="object-cover" />
          </div>
        </div>
      </div>
    );
  }

  if (arrangement === 'grid_4') {
    return (
      <div className="grid grid-cols-2 gap-3 aspect-16/9 w-full">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <Image src={getPhotoUrl(i)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" priority={i === 0} />
          </div>
        ))}
      </div>
    );
  }

  // mosaic_5
  return (
    <div className="grid grid-cols-4 gap-2.5 aspect-16/9 w-full">
      <div className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        <Image src={getPhotoUrl(0)} alt="" fill sizes="(max-width: 780px) 50vw, 380px" className="object-cover" priority />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <Image src={getPhotoUrl(i)} alt="" fill sizes="(max-width: 780px) 25vw, 190px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
