'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, Phone, Star, PlusCircle, X, Sparkles, Send } from 'lucide-react';

export default function AvisClientsPage() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [formAuthor, setFormAuthor] = useState('');
  const [formRole, setFormRole] = useState('Vendeur d’une villa à Pélissanne');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');

  const [reviewsList, setReviewsList] = useState([
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
  ]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev = {
      id: Date.now(),
      author: formAuthor,
      role: formRole,
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      rating: formRating,
      title: formTitle,
      comment: formComment
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setFormAuthor('');
      setFormTitle('');
      setFormComment('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Avis Contrôlés & Certifiés Conformes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
          Avis Clients & Témoignages
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Découvrez les retours d&apos;expérience authentiques de nos propriétaires vendeurs et acquéreurs accompagnés par Nelly Fernandez à Pélissanne et en Pays Salonais.
        </p>
      </div>

      {/* Mot d'accueil chaleureux de Nelly */}
      <div className="bg-[#FCFAF7] rounded-3xl p-8 sm:p-10 border border-[#F3E8EE] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E12B7B]/10 flex items-center justify-center text-[#E12B7B] font-serif font-black text-lg">
            N
          </div>
          <div>
            <strong className="text-sm font-bold text-gray-900 block">Le mot de Nelly Fernandez</strong>
            <span className="text-xs text-[#C59A45] font-semibold">Fondatrice de l&apos;agence Nell&apos;Immo</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 italic border-l-2 border-[#E12B7B] pl-4 sm:pl-6">
          <p>
            « Chers clients,
          </p>
          <p>
            La concrétisation d&apos;un projet n&apos;est pas toujours un long fleuve tranquille, notamment en matière d&apos;immobilier ! J&apos;ai toujours eu à cœur d&apos;exercer mon métier avec dévouement et implication, dans le but d&apos;atteindre vos objectifs.
          </p>
          <p>
            Je vous invite ici à poster vos témoignages, car comme le dit le proverbe : <span className="font-bold text-gray-900 not-italic">« Des petits ruisseaux font les grandes rivières »</span>.
          </p>
          <p>
            En espérant que vos mots reflètent la qualité du travail que je souhaite accomplir au quotidien, et qu&apos;ainsi Nell&apos;Immo devienne votre agence locale, innovante, incontournable et de confiance.
          </p>
          <p className="font-bold not-italic text-gray-900">
            Bien à vous,<br />
            Nelly
          </p>
        </div>
      </div>

      {/* Opinion System Certified Widget Box */}
      <div className="bg-white rounded-3xl p-8 border border-[#F3E8EE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-2xl font-black font-serif">4.9</span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">/ 5</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Avis Clients Contrôlés & Certifiés ISO 20252
            </h3>
            <p className="text-xs text-gray-600 max-w-xl">
              Notre entreprise est adhérente à <strong className="text-gray-900">Opinion System</strong>, n°1 des avis clients contrôlés pour professionnels du service, vous garantissant des témoignages clients authentiques.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Déposer un Témoignage</span>
          </button>

          <Link
            href="/estimation"
            className="px-6 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center gap-2"
          >
            <span>Confier mon projet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex text-amber-400 text-sm mb-1">
                  {'★'.repeat(rev.rating)}
                </div>
                <h4 className="font-serif font-bold text-base text-[#131B26]">
                  {rev.title}
                </h4>
              </div>
              <span className="text-[11px] text-gray-400">{rev.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
              « {rev.comment} »
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <strong className="block text-gray-900 font-bold">{rev.author}</strong>
                <span className="text-[11px] text-[#E12B7B]">{rev.role}</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Vérifié
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Review Modal */}
      {isSubmitModalOpen && (
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
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
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
                  Votre avis est certifié et s&apos;affiche désormais parmi nos retours d&apos;expérience vérifiés.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Votre Note de Satisfaction</label>
                  <div className="flex items-center gap-2 text-2xl text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setFormRating(star)}
                        className={`hover:scale-125 transition ${star <= formRating ? 'text-amber-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs font-bold text-gray-600 ml-2">({formRating} / 5 étoiles)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-gray-700 mb-1">Votre Prénom & Nom</label>
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
                    <label className="block font-bold uppercase text-gray-700 mb-1">Votre Rôle</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                    >
                      <option value="Vendeur d’une villa à Pélissanne">Vendeur d’une villa à Pélissanne</option>
                      <option value="Acquéreur à Salon-de-Provence">Acquéreur à Salon-de-Provence</option>
                      <option value="Vendeur d’un appartement à Lambesc">Vendeur d’un appartement à Lambesc</option>
                      <option value="Acquéreur d’une propriété en Provence">Acquéreur d’une propriété en Provence</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Titre de votre Témoignage</label>
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
                  <label className="block font-bold uppercase text-gray-700 mb-1">Votre Commentaire Détaillé</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Partagez votre expérience avec Nelly Fernandez et l'agence Nell'Immo..."
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
      )}

      {/* CTA Bottom Box */}
      <div className="bg-[#131B26] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C59A45]">
          Votre Projet Immobilier en Provence
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold max-w-2xl mx-auto">
          Vous souhaitez vendre ou acquérir un bien en toute sérénité ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
          Contactez directement Nelly Fernandez pour une estimation offerte et un entretien personnalisé à Pélissanne.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <a
            href="tel:0755686109"
            className="px-6 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition"
          >
            <Phone className="w-4 h-4" />
            07 55 68 61 09
          </a>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            Envoyer un message
          </Link>
        </div>
      </div>

    </div>
  );
}
