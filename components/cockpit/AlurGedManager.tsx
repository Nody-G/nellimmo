'use client';

import { useState } from 'react';
import type { Property, PropertyDocument, AlurDocumentCategory, AlurDocumentStatus } from '@/lib/types';
import {
  CHECKLIST_DEFINITIONS,
  createPropertyDocument,
  findAttachedDocument,
  computeDocumentStatus,
  buildWhatsappReminderMessage,
  openWhatsappReminder,
} from './alur-ged/alur-ged-types';
import { AlurGedHeader } from './alur-ged/AlurGedHeader';
import { DocumentGrid } from './alur-ged/DocumentGrid';
import { UploadDocumentModal } from './alur-ged/UploadDocumentModal';
import { NotarySlipModal } from './alur-ged/NotarySlipModal';

interface AlurGedManagerProps {
  property: Property;
  onUpdateProperty: (id: string, updates: Partial<Property>) => Promise<Property | null>;
}

/**
 * ALUR / GED document manager shell.
 * Holds state and composes the extracted presentational sub-components.
 */
export function AlurGedManager({ property, onUpdateProperty }: AlurGedManagerProps) {
  const currentDocuments: PropertyDocument[] = property.documents || [];

  const [activeCategory, setActiveCategory] = useState<AlurDocumentCategory | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocKey, setSelectedDocKey] = useState<string>('');
  const [customDocName, setCustomDocName] = useState('');
  const [customCategory, setCustomCategory] = useState<AlurDocumentCategory>('autre');
  const [customExpiry, setCustomExpiry] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showNotarySlip, setShowNotarySlip] = useState(false);

  // Filter applicable checklist items
  const applicableChecklist = CHECKLIST_DEFINITIONS.filter(
    (item) => !item.condition || item.condition(property)
  );

  const mandatoryItems = applicableChecklist.filter((i) => i.mandatory);

  // Calculate completion
  const validMandatoryCount = mandatoryItems.filter((item) => {
    const existing = findAttachedDocument(currentDocuments, item);
    return existing && existing.status === 'valide';
  }).length;

  const totalMandatory = mandatoryItems.length;
  const completionPercent = Math.round((validMandatoryCount / totalMandatory) * 100);

  // Missing items calculation for automated reminders
  const missingMandatoryItems = applicableChecklist.filter((item) => {
    const attachedDoc = findAttachedDocument(currentDocuments, item);
    const status = computeDocumentStatus(attachedDoc);
    return item.mandatory && status !== 'valide';
  });

  // Handle uploading / adding a document
  const handleSaveDocument = async () => {
    if (!uploadedFileName && !customDocName) return;
    setIsSaving(true);

    const docDef = applicableChecklist.find((i) => i.key === selectedDocKey);
    const docName = docDef ? docDef.name : customDocName || 'Document';
    const category = docDef ? docDef.category : customCategory;

    const newDoc = createPropertyDocument({
      propertyId: property.id,
      category,
      docName,
      filename: uploadedFileName || `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      validityDurationMonths: docDef?.validityDurationMonths,
      customExpiry: customExpiry || undefined,
      mandatory: docDef ? docDef.mandatory : false,
    });

    const updatedDocuments = [...currentDocuments.filter((d) => d.name !== docName), newDoc];

    await onUpdateProperty(property.id, { documents: updatedDocuments });
    setIsSaving(false);
    setIsUploadModalOpen(false);
    setUploadedFileName('');
    setCustomDocName('');
    setCustomExpiry('');
  };

  // Delete a document
  const handleDeleteDocument = async (docId: string) => {
    const updatedDocuments = currentDocuments.filter((d) => d.id !== docId);
    await onUpdateProperty(property.id, { documents: updatedDocuments });
  };

  // Change status of a document
  const handleChangeStatus = async (docId: string, status: AlurDocumentStatus) => {
    const updatedDocuments = currentDocuments.map((d) =>
      d.id === docId ? { ...d, status } : d
    );
    await onUpdateProperty(property.id, { documents: updatedDocuments });
  };

  // WhatsApp reminders
  const generateWhatsappReminder = (singleItemName?: string) => {
    const missingNames = missingMandatoryItems.map((m) => m.name);
    const message = buildWhatsappReminderMessage(property, missingNames, singleItemName);
    openWhatsappReminder(property, message);
  };

  const openUploadModal = (docKey = '') => {
    setSelectedDocKey(docKey);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <AlurGedHeader
        property={property}
        applicableCount={applicableChecklist.length}
        validCount={validMandatoryCount}
        totalMandatory={totalMandatory}
        completionPercent={completionPercent}
        missingCount={missingMandatoryItems.length}
        isApartment={property.property_type === 'appartement'}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onOpenNotarySlip={() => setShowNotarySlip(true)}
        onSendReminder={() => generateWhatsappReminder()}
        onAddDocument={() => openUploadModal()}
      />

      <DocumentGrid
        items={applicableChecklist}
        documents={currentDocuments}
        activeCategory={activeCategory}
        onUpload={(key) => openUploadModal(key)}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDeleteDocument}
        onWhatsApp={(itemName) => generateWhatsappReminder(itemName)}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        applicableChecklist={applicableChecklist}
        selectedDocKey={selectedDocKey}
        customDocName={customDocName}
        customCategory={customCategory}
        customExpiry={customExpiry}
        uploadedFileName={uploadedFileName}
        isSaving={isSaving}
        onSelectedDocKeyChange={setSelectedDocKey}
        onCustomDocNameChange={setCustomDocName}
        onCustomCategoryChange={setCustomCategory}
        onCustomExpiryChange={setCustomExpiry}
        onUploadedFileNameChange={setUploadedFileName}
        onSave={handleSaveDocument}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <NotarySlipModal
        isOpen={showNotarySlip}
        property={property}
        applicableChecklist={applicableChecklist}
        documents={currentDocuments}
        onClose={() => setShowNotarySlip(false)}
      />
    </div>
  );
}
