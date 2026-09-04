'use client';

import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, Send } from 'lucide-react';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    author: string;
    role: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
  submitSuccess: boolean;
}

export function SubmitReviewModal({
  isOpen,
  onClose,
  onSubmit,
  submitSuccess,
}: SubmitReviewModalProps) {
  const [formAuthor, setFormAuthor] = useState('');
  const [formRole, setFormRole] = useState('Vendeur d’une villa à Pélissanne');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      author: formAuthor,
      role: formRole,
      rating: formRating,
      title: formTitle,
      comment: formComment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Partager votre Témoignage Vérifié
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-serif font-bold text-base text-emerald-950">
              Merci infiniment pour votre témoignage !
            </h4>
            <p className="text-xs text-emerald-800">
              Votre avis est certifié et s’affiche désormais parmi nos retours d’expérience vérifiés.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Votre Note de Satisfaction
              </label>
              <div className="flex items-center gap-2 text-2xl text-amber-400 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className={`hover:scale-125 transition cursor-pointer ${
                      star <= formRating ? 'text-amber-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-600 ml-2">
                  ({formRating} / 5 étoiles)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">
                  Votre Prénom & Nom
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sophie et Marc L."
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">
                  Votre Rôle
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  <option value="Vendeur d’une villa à Pélissanne">
                    Vendeur d’une villa à Pélissanne
                  </option>
                  <option value="Acquéreur à Salon-de-Provence">
                    Acquéreur à Salon-de-Provence
                  </option>
                  <option value="Vendeur d’un appartement à Lambesc">
                    Vendeur d’un appartement à Lambesc
                  </option>
                  <option value="Acquéreur d’une propriété en Provence">
                    Acquéreur d’une propriété en Provence
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Titre de votre Témoignage
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Une accompagnatrice hors pair et des conseils précieux"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Votre Commentaire Détaillé
              </label>
              <textarea
                rows={4}
                required
                placeholder="Partagez votre expérience avec Nelly Fernandez et l’agence Nell’Immo..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-normal leading-relaxed focus:outline-[#E12B7B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Publier mon Avis Vérifié</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
