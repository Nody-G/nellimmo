'use client';

import React from 'react';
import { PropertyImage } from '@/lib/types';
import { Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  MediaDescriptionSection,
  MediaPhotosGallerySection,
  MediaVideoTourSection,
  MediaDiffusionChannelsSection
} from './media';

interface StepMediaPublishingProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  onGenerateAiDescription: (mode: 'portail' | 'luxe' | 'social' | 'bullet') => void;
  isAiGenerating: boolean;
  images: PropertyImage[];
  onAddImageByUrl: (url: string) => void;
  onUploadFiles: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onSetCoverImage: (index: number) => void;
  videoUrl: string;
  onVideoUrlChange: (val: string) => void;
  virtualTourUrl: string;
  onVirtualTourUrlChange: (val: string) => void;
  publishWebsite: boolean;
  onPublishWebsiteChange: (val: boolean) => void;
  publishSeloger: boolean;
  onPublishSelogerChange: (val: boolean) => void;
  publishLeboncoin: boolean;
  onPublishLeboncoinChange: (val: boolean) => void;
  publishBienici: boolean;
  onPublishBieniciChange: (val: boolean) => void;
}

export const StepMediaPublishing: React.FC<StepMediaPublishingProps> = ({
  description,
  onDescriptionChange,
  onGenerateAiDescription,
  isAiGenerating,
  images,
  onAddImageByUrl,
  onUploadFiles,
  onRemoveImage,
  onSetCoverImage,
  videoUrl,
  onVideoUrlChange,
  virtualTourUrl,
  onVirtualTourUrlChange,
  publishWebsite,
  onPublishWebsiteChange,
  publishSeloger,
  onPublishSelogerChange,
  publishLeboncoin,
  onPublishLeboncoinChange,
  publishBienici,
  onPublishBieniciChange
}) => {
  return (
    <Card id="step-media">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#E12B7B]" />
          <span>6. Descriptif, Photos & Passerelles de Diffusion</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <MediaDescriptionSection
          description={description}
          onDescriptionChange={onDescriptionChange}
          onGenerateAiDescription={onGenerateAiDescription}
          isAiGenerating={isAiGenerating}
        />

        <MediaPhotosGallerySection
          images={images}
          onAddImageByUrl={onAddImageByUrl}
          onUploadFiles={onUploadFiles}
          onRemoveImage={onRemoveImage}
          onSetCoverImage={onSetCoverImage}
        />

        <MediaVideoTourSection
          videoUrl={videoUrl}
          onVideoUrlChange={onVideoUrlChange}
          virtualTourUrl={virtualTourUrl}
          onVirtualTourUrlChange={onVirtualTourUrlChange}
        />

        <MediaDiffusionChannelsSection
          publishWebsite={publishWebsite}
          onPublishWebsiteChange={onPublishWebsiteChange}
          publishSeloger={publishSeloger}
          onPublishSelogerChange={onPublishSelogerChange}
          publishLeboncoin={publishLeboncoin}
          onPublishLeboncoinChange={onPublishLeboncoinChange}
          publishBienici={publishBienici}
          onPublishBieniciChange={onPublishBieniciChange}
        />
      </CardContent>
    </Card>
  );
};
