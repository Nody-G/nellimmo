'use client';

import { CheckCircle2, Phone, MapPin, Clock } from 'lucide-react';

export default function AgencyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
          L&apos;Agence de Nelly • Pélissanne & Pays Salonais
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
          Une vision humaine, sur-mesure et indépendante
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Fondée et dirigée par Nelly Fernandez, spécialiste reconnue de la transaction immobilière avec près de 20 ans d&apos;expérience sur le secteur.
        </p>
      </div>

      {/* Story & Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-[#F3E8EE] bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
            alt="L'agence Nell'Immo à Pélissanne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end p-8">
            <div className="text-white space-y-1">
              <span className="font-serif font-bold text-xl block">Nelly Fernandez</span>
              <span className="text-xs text-[#C59A45] font-semibold block">Fondatrice & Négociatrice Immobilière • Pélissanne</span>
              <span className="text-[11px] text-gray-300 block">26 Avenue des Enjouvènes, 13330 Pélissanne</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
              <span>Actez vos projets sereinement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
              Le Concept de l&apos;Agence Nell&apos;Immo
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Le concept de l&apos;agence <strong>Nell&apos;Immo</strong> est né aux pieds du magnifique <strong>Massif des Costes à Pélissanne</strong>.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Forte de plus de <strong>15 années d&apos;exercice</strong> en qualité de négociatrice immobilier sur le <strong>Pays Salonais</strong>, sa créatrice <strong>Nelly Fernandez</strong> est à votre écoute du lundi au samedi, par mail ou téléphone.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Avec le concept Nell&apos;Immo, vous bénéficiez :
            </h3>

            <ul className="space-y-2.5 text-xs text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>Des conseils d&apos;un agent immobilier local expérimenté</strong>, mobile et à votre écoute</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>De barèmes d&apos;honoraires parmi les plus bas du marché</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>D&apos;une diffusion de vos biens</strong> sur des sites web d&apos;annonces immobilières à forte audience</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>D&apos;un accompagnement suivi de votre projet</strong>, avec une visibilité à tout instant grâce à notre espace client</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>D&apos;outils web de pointe</strong> tels que la diffusion de vidéo mettant en valeur vos biens, pour faire la différence !</span>
              </li>
            </ul>
          </div>

          {/* Citation Personnelle de Nelly */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border-l-4 border-[#E12B7B] border-y border-r border-[#F3E8EE] space-y-2">
            <p className="text-xs text-gray-800 italic leading-relaxed">
              « Attentive, dévouée, créative et dynamique, je saurai être votre agent immobilier de confiance... pour que vos rêves d&apos;immobilier aboutissent. Alors à bientôt ! »
            </p>
            <span className="text-[11px] font-bold text-[#E12B7B] block">— Nelly Fernandez</span>
          </div>
        </div>
      </div>

      {/* Prestations & Accompagnement Sur-Mesure */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F3E8EE] shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
            Nos Prestations & Engagements
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Un Accompagnement Immobilier Complet & Sur-Mesure
          </h2>
          <p className="text-xs text-gray-500">
            Chaque projet est unique : bénéficiez d&apos;un suivi rigoureux et personnalisé de l&apos;estimation initiale jusqu&apos;à la signature chez le notaire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-sm text-[#131B26]">Estimation & Mise en Valeur</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Étude comparative de marché approfondie, reportage photographique soigné et valorisation de votre bien.
            </p>
          </div>

          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-sm text-[#131B26]">Multidiffusion Ciblée</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Présence sur les plus grands portails immobiliers et diffusion auprès de notre fichier d&apos;acquéreurs qualifiés.
            </p>
          </div>

          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-sm text-[#131B26]">Visites & Négociation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sélection rigoureuse des candidats, vérification de solvabilité et comptes-rendus systématiques après chaque visite.
            </p>
          </div>

          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-sm text-[#131B26]">Suivi Notarial Sécurisé</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Constitution complète du dossier Loi ALUR, interface directe avec l&apos;étude notariale et accompagnement jusqu&apos;à l&apos;acte authentique.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Honoraires adaptés et compétitifs définis lors du mandat • Barème complet disponible sur simple demande et à l&apos;agence.
          </p>
        </div>
      </div>

      {/* Practical Info & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
          <MapPin className="w-5 h-5 text-[#E12B7B]" />
          <strong className="text-sm font-bold block text-gray-900">Adresse de l&apos;Agence</strong>
          <span className="text-xs text-gray-600 block">
            26 Avenue des Enjouvènes<br />13330 Pélissanne
          </span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
          <Clock className="w-5 h-5 text-[#E12B7B]" />
          <strong className="text-sm font-bold block text-gray-900">Horaires d&apos;Ouverture</strong>
          <span className="text-xs text-gray-600 block">
            Du Lundi au Vendredi<br />De 08h00 à 18h00 (et sur RDV le samedi)
          </span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
          <Phone className="w-5 h-5 text-[#E12B7B]" />
          <strong className="text-sm font-bold block text-gray-900">Contact Direct</strong>
          <span className="text-xs text-gray-600 block">
            Tél : 07 55 68 61 09<br />E-mail : nellimmo.acte@gmail.com
          </span>
        </div>
      </div>

    </div>
  );
}
