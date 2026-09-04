'use client';

import { MandateWizardStepper } from '@/components/cockpit/mandats/wizard/MandateWizardStepper';
import { StepSeller } from '@/components/cockpit/mandats/wizard/StepSeller';
import { StepLocation } from '@/components/cockpit/mandats/wizard/StepLocation';
import { StepFinancials } from '@/components/cockpit/mandats/wizard/StepFinancials';
import { StepFeatures } from '@/components/cockpit/mandats/wizard/StepFeatures';
import { StepDpe } from '@/components/cockpit/mandats/wizard/StepDpe';
import { StepMediaPublishing } from '@/components/cockpit/mandats/wizard/StepMediaPublishing';
import { FastFillModal } from '@/components/cockpit/mandats/wizard/FastFillModal';
import { NewMandateHeader } from '@/components/cockpit/mandats/nouveau/NewMandateHeader';
import { NewMandateSubmitBar } from '@/components/cockpit/mandats/nouveau/NewMandateSubmitBar';
import { useNewMandateForm } from '@/components/cockpit/mandats/nouveau/useNewMandateForm';

export default function NewMandatePage() {
  const form = useNewMandateForm();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      <NewMandateHeader
        nextMandateNumber={form.nextMandateNumber}
        onOpenAutoFill={() => form.setShowAutoFillModal(true)}
      />

      {/* Stepper navigation bar */}
      <MandateWizardStepper />

      {/* Main Form */}
      <form onSubmit={form.handleSubmit} className="space-y-6">
        <StepSeller
          mandateType={form.mandateType}
          onMandateTypeChange={form.setMandateType}
          mandateDate={form.mandateDate}
          onMandateDateChange={form.setMandateDate}
          mandateEndDate={form.mandateEndDate}
          onMandateEndDateChange={form.setMandateEndDate}
          sellerCivility={form.sellerCivility}
          onSellerCivilityChange={form.setSellerCivility}
          sellerName={form.sellerName}
          onSellerNameChange={form.setSellerName}
          sellerEmail={form.sellerEmail}
          onSellerEmailChange={form.setSellerEmail}
          sellerPhone={form.sellerPhone}
          onSellerPhoneChange={form.setSellerPhone}
          sellerAddress={form.sellerAddress}
          onSellerAddressChange={form.setSellerAddress}
        />

        <StepLocation
          title={form.title}
          onTitleChange={form.setTitle}
          propertyType={form.propertyType}
          onPropertyTypeChange={form.setPropertyType}
          address={form.address}
          onAddressChange={form.setAddress}
          postalCode={form.postalCode}
          onPostalCodeChange={form.setPostalCode}
          city={form.city}
          onCityChange={form.setCity}
        />

        <StepFinancials
          priceNetSeller={form.priceNetSeller}
          onPriceNetSellerChange={form.setPriceNetSeller}
          agencyFeesPercentage={form.agencyFeesPercentage}
          onAgencyFeesPercentageChange={form.setAgencyFeesPercentage}
          agencyFeesAmount={form.agencyFeesAmount}
          onAgencyFeesAmountChange={form.setAgencyFeesAmount}
          feesPaidBy={form.feesPaidBy}
          onFeesPaidByChange={form.setFeesPaidBy}
          financials={form.financials}
        />

        <StepFeatures
          livingArea={form.livingArea}
          onLivingAreaChange={form.setLivingArea}
          carrezArea={form.carrezArea}
          onCarrezAreaChange={form.setCarrezArea}
          landArea={form.landArea}
          onLandAreaChange={form.setLandArea}
          roomsCount={form.roomsCount}
          onRoomsCountChange={form.setRoomsCount}
          bedroomsCount={form.bedroomsCount}
          onBedroomsCountChange={form.setBedroomsCount}
          bathroomsCount={form.bathroomsCount}
          onBathroomsCountChange={form.setBathroomsCount}
          featuresInput={form.featuresInput}
          onFeaturesInputChange={form.setFeaturesInput}
        />

        <StepDpe
          dpeValue={form.dpeValue}
          onDpeValueChange={form.setDpeValue}
          gesValue={form.gesValue}
          onGesValueChange={form.setGesValue}
          energyCostMin={form.energyCostMin}
          onEnergyCostMinChange={form.setEnergyCostMin}
          energyCostMax={form.energyCostMax}
          onEnergyCostMaxChange={form.setEnergyCostMax}
        />

        <StepMediaPublishing
          description={form.description}
          onDescriptionChange={form.setDescription}
          onGenerateAiDescription={form.handleGenerateAiDescription}
          isAiGenerating={form.isAiGenerating}
          images={form.images}
          onAddImageByUrl={form.handleAddImageByUrl}
          onUploadFiles={form.handleUploadFiles}
          onRemoveImage={form.handleRemoveImage}
          onSetCoverImage={form.handleSetCover}
          videoUrl={form.videoUrl}
          onVideoUrlChange={form.setVideoUrl}
          virtualTourUrl={form.virtualTourUrl}
          onVirtualTourUrlChange={form.setVirtualTourUrl}
          publishWebsite={form.publishWebsite}
          onPublishWebsiteChange={form.setPublishWebsite}
          publishSeloger={form.publishSeloger}
          onPublishSelogerChange={form.setPublishSeloger}
          publishLeboncoin={form.publishLeboncoin}
          onPublishLeboncoinChange={form.setPublishLeboncoin}
          publishBienici={form.publishBienici}
          onPublishBieniciChange={form.setPublishBienici}
        />

        <NewMandateSubmitBar
          nextMandateNumber={form.nextMandateNumber}
          isSubmitting={form.isSubmitting}
        />
      </form>

      {/* Auto Fill Modal */}
      <FastFillModal
        isOpen={form.showAutoFillModal}
        onClose={() => form.setShowAutoFillModal(false)}
        onProcessText={form.handleProcessFastFill}
        isSuccess={form.autoFillSuccess}
      />
    </div>
  );
}
