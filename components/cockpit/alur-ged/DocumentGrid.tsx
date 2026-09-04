'use client';

import type { PropertyDocument, AlurDocumentCategory, AlurDocumentStatus } from '@/lib/types';
import type { ChecklistItemDef } from './alur-ged-types';
import { findAttachedDocument, computeDocumentStatus } from './alur-ged-types';
import { DocumentCard } from './DocumentCard';

interface DocumentGridProps {
    items: ChecklistItemDef[];
    documents: PropertyDocument[];
    activeCategory: AlurDocumentCategory | 'all';
    onUpload: (key: string) => void;
    onChangeStatus: (docId: string, status: AlurDocumentStatus) => void;
    onDelete: (docId: string) => void;
    onWhatsApp: (itemName: string) => void;
}

/** Responsive grid of ALUR checklist document cards. */
export function DocumentGrid({
    items,
    documents,
    activeCategory,
    onUpload,
    onChangeStatus,
    onDelete,
    onWhatsApp,
}: DocumentGridProps) {
    const visibleItems = items.filter(
        (item) => activeCategory === 'all' || item.category === activeCategory
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((item) => {
                const attachedDoc = findAttachedDocument(documents, item);
                const status = computeDocumentStatus(attachedDoc);
                return (
                    <DocumentCard
                        key={item.key}
                        item={item}
                        attachedDoc={attachedDoc}
                        status={status}
                        onUpload={onUpload}
                        onChangeStatus={onChangeStatus}
                        onDelete={onDelete}
                        onWhatsApp={onWhatsApp}
                    />
                );
            })}
        </div>
    );
}
