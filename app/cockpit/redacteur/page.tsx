'use client';

import React from 'react';
import {
  useRedacteurStudio,
  RedacteurHeader,
  AnglesDrawer,
  TitlesDrawer,
  TrainingSection,
  PropertySelector,
  StyleSelector,
  StudioPreview,
  CopywritingStyle,
} from '@/components/cockpit/redacteur';

export default function RedacteurPage() {
  const {
    properties,
    settings,
    selectedPropertyId,
    setSelectedPropertyId,
    selectedStyle,
    setSelectedStyle,
    activeCategory,
    setActiveCategory,
    customNotes,
    setCustomNotes,
    trainingExamples,
    newExampleTitle,
    setNewExampleTitle,
    newExampleText,
    setNewExampleText,
    showTrainingSection,
    setShowTrainingSection,
    showAnglesDrawer,
    setShowAnglesDrawer,
    showTitlesDrawer,
    setShowTitlesDrawer,
    currentProperty,
    currentText,
    setCurrentText,
    isGenerating,
    generationSource,
    generationMessage,
    copied,
    appliedToMandate,
    isPublishingSocial,
    filteredTemplates,
    propertyAngles,
    catchyTitles,
    handlePublishToMeta,
    handleGenerateWithAI,
    handleCopy,
    handleDownloadTxt,
    handleApplyToProperty,
    handleAddExample,
    handleDeleteExample,
    openWhatsAppShare,
    insertAngleIntoNotes,
    prependTitleToText,
  } = useRedacteurStudio();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <RedacteurHeader
        showAnglesDrawer={showAnglesDrawer}
        showTitlesDrawer={showTitlesDrawer}
        showTrainingSection={showTrainingSection}
        anglesCount={propertyAngles.length}
        trainingCount={trainingExamples.length}
        onToggleAngles={() => setShowAnglesDrawer(!showAnglesDrawer)}
        onToggleTitles={() => setShowTitlesDrawer(!showTitlesDrawer)}
        onToggleTraining={() => setShowTrainingSection(!showTrainingSection)}
      />

      {showAnglesDrawer && (
        <AnglesDrawer
          angles={propertyAngles}
          onInject={insertAngleIntoNotes}
          onClose={() => setShowAnglesDrawer(false)}
        />
      )}

      {showTitlesDrawer && (
        <TitlesDrawer
          titles={catchyTitles}
          onInsert={prependTitleToText}
          onClose={() => setShowTitlesDrawer(false)}
        />
      )}

      {showTrainingSection && (
        <TrainingSection
          examples={trainingExamples}
          newTitle={newExampleTitle}
          newText={newExampleText}
          onTitleChange={setNewExampleTitle}
          onTextChange={setNewExampleText}
          onAdd={handleAddExample}
          onDelete={handleDeleteExample}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <PropertySelector
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            currentProperty={currentProperty}
            customNotes={customNotes}
            onPropertyChange={setSelectedPropertyId}
            onNotesChange={setCustomNotes}
          />

          <StyleSelector
            activeCategory={activeCategory}
            selectedStyle={selectedStyle}
            templates={filteredTemplates}
            onCategoryChange={setActiveCategory}
            onStyleChange={(id) => setSelectedStyle(id as CopywritingStyle)}
          />
        </div>

        <StudioPreview
          currentText={currentText}
          currentProperty={currentProperty}
          selectedStyle={selectedStyle}
          generationSource={generationSource}
          generationMessage={generationMessage}
          isGenerating={isGenerating}
          copied={copied}
          appliedToMandate={appliedToMandate}
          isPublishingSocial={isPublishingSocial}
          settings={settings}
          onRegenerate={handleGenerateWithAI}
          onCopy={handleCopy}
          onDownload={handleDownloadTxt}
          onWhatsApp={openWhatsAppShare}
          onPublishMeta={handlePublishToMeta}
          onTextChange={setCurrentText}
          onApplyToProperty={handleApplyToProperty}
        />
      </div>
    </div>
  );
}
