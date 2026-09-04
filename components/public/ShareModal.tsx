'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ShareQrView, ShareChannelsList } from './share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  price?: number;
  city?: string;
  mandateRef?: string;
}

export function ShareModal({ isOpen, onClose, title, url, price, city, mandateRef }: ShareModalProps) {
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `Découvrez ce bien d'exception à ${city || 'Pélissanne'} proposé par Nell'Immo : ${title}${price ? ` (${price.toLocaleString('fr-FR')} €)` : ''}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Lien copié dans le presse-papier !', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleEmailShare = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(`Bien immobilier : ${title}`)}&body=${encodeURIComponent(`${shareText}\n\nConsulter la fiche complète : ${currentUrl}\n\nAgence Nell'Immo - Nelly Fernandez`)}`;
    window.location.href = mailto;
  };

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&color=13-27-38&bgcolor=255-255-255`;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-overlay transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F3E8EE] space-y-5 z-10 animate-fade-in my-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#131B26]">Partager ce bien</h3>
              {mandateRef && <span className="text-[10px] font-mono text-gray-400">Réf. {mandateRef}</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Summary */}
        <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 font-medium">
          <p className="line-clamp-2 text-gray-800 font-bold">{title}</p>
          {price && <p className="text-[#E12B7B] font-bold mt-1">{price.toLocaleString('fr-FR')} €</p>}
        </div>

        {/* Dynamic View : QR Code or Share Channels */}
        {showQr ? (
          <ShareQrView
            qrCodeImageUrl={qrCodeImageUrl}
            onBackToOptions={() => setShowQr(false)}
          />
        ) : (
          <ShareChannelsList
            currentUrl={currentUrl}
            copied={copied}
            onCopyLink={handleCopyLink}
            onWhatsAppShare={handleWhatsAppShare}
            onEmailShare={handleEmailShare}
            onShowQr={() => setShowQr(true)}
          />
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
