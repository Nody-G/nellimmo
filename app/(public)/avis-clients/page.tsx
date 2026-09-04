'use client';

import React, { useState } from 'react';
import {
  ClientReview,
  ReviewsHeader,
  ReviewsScoreCard,
  ReviewsList,
  SubmitReviewModal,
  ReviewsCtaBox,
} from '@/components/public/reviews';

const INITIAL_REVIEWS: ClientReview[] = [
  {
    id: 1,
    author: 'Michel et Marie-Hélène D.',
    role: 'Vendeurs d’une villa à Pélissanne',
    date: 'Janvier 2026',
    rating: 5,
    title: 'Un accompagnement d’un professionnalisme exceptionnel',
    comment:
      'Nelly a été d’une efficacité et d’une bienveillance remarquables pour la vente de notre maison. Estimation DVF au juste prix, photos et vidéo de grande qualité, et vente réalisée en moins de 3 semaines au prix net vendeur convenu. Nous recommandons Nell’Immo les yeux fermés !',
  },
  {
    id: 2,
    author: 'Thomas et Sophie V.',
    role: 'Acquéreurs à Salon-de-Provence',
    date: 'Décembre 2025',
    rating: 5,
    title: 'Une écoute rare et un suivi irréprochable',
    comment:
      'Après des mois de recherche infructueuse, Nelly a su cerner nos attentes dès la première visite. Son expertise du Pays Salonais, ses conseils sur les diagnostics et sa présence jusqu’à la signature chez le notaire nous ont totalement rassurés.',
  },
  {
    id: 3,
    author: 'Claire B.',
    role: 'Vendeuse d’un appartement à Lambesc',
    date: 'Novembre 2025',
    rating: 5,
    title: 'Honoraires très justes et transparence totale',
    comment:
      'La différence avec les grands réseaux est immense : ici, Nelly gère personnellement chaque étape avec rigueur et réactivité. Mandat exclusif scrupuleusement respecté et compte-rendu après chaque visite. Merci infiniment Nelly !',
  },
  {
    id: 4,
    author: 'Gilles F.',
    role: 'Acquéreur d’un terrain à Aurons',
    date: 'Octobre 2025',
    rating: 5,
    title: 'Maîtrise parfaite du marché local',
    comment:
      'Près de 20 ans d’expérience sur le secteur, ça se ressent immédiatement. Nelly connaît chaque quartier, chaque réglementation et défend les intérêts des deux parties avec une grande équité.',
  },
];

export default function AvisClientsPage() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState<ClientReview[]>(INITIAL_REVIEWS);

  const handleAddReview = (reviewData: {
    author: string;
    role: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const newRev: ClientReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      <ReviewsHeader />

      <ReviewsScoreCard onOpenModal={() => setIsSubmitModalOpen(true)} />

      <ReviewsList reviews={reviewsList} />

      <SubmitReviewModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddReview}
        submitSuccess={submitSuccess}
      />

      <ReviewsCtaBox />
    </div>
  );
}
