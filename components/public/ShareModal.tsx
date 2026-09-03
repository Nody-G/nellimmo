'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, MessageCircle, Mail, QrCode, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

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
    () => () => {},
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

        {/* QR Code view toggle */}
        {showQr ? (
          <div className="text-center space-y-3 py-2 animate-fade-in">
            <div className="bg-white p-3 inline-block rounded-2xl border border-gray-200 shadow-xs">
              <img
                src={qrCodeImageUrl}
                alt="QR Code du bien"
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-500">Scannez ce QR Code avec votre smartphone pour ouvrir la fiche.</p>
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="text-xs text-[#E12B7B] font-bold underline hover:text-[#C71B62] cursor-pointer"
            >
              Retour aux options de partage
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>Partager sur WhatsApp</span>
              </div>
              <span className="text-[11px] text-emerald-600 group-hover:translate-x-0.5 transition-transform">Envoyer →</span>
            </button>

            {/* Email */}
            <button
              type="button"
              onClick={handleEmailShare}
              className="w-full p-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl flex items-center justify-between text-xs font-bold transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Envoyer par Email</span>
              </div>
              <span className="text-[11px] text-sky-600 group-hover:translate-x-0.5 transition-transform">Ouvrir →</span>
            </button>

            {/* QR Code Display button */}
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-2xl flex items-center justify-between text-xs font-bold transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#131B26] text-white flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span>Afficher le QR Code</span>
              </div>
              <span className="text-[11px] text-gray-500 group-hover:translate-x-0.5 transition-transform">Scanner →</span>
            </button>

            {/* Copy Link field */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">Lien direct</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
