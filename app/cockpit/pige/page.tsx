'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { ProspectingLead, ProspectingSource, ProspectingStatus } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import {
  Radar,
  Phone,
  MessageCircle,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  Bot,
  TrendingDown,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  Copy,
  Check,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

const OBJECTION_SCRIPTS = [
  {
    id: 'no_agency',
    title: '« Je ne veux pas d\'agence, je vends très bien par moi-même. »',
    angle: 'Reconnaissance de son autonomie + Sécurité du filtrage acquéreurs',
    pitch: `« Je comprends tout à fait votre démarche, c'est légitime de vouloir tenter par soi-même. D'ailleurs, 70% des vendeurs commencent comme vous entre particuliers. Ma démarche aujourd'hui n'est pas de vous imposer un mandat classique, mais de vous apporter une sécurité : sur les 15 appels que vous allez recevoir, comment filtrez-vous les curieux du dimanche et les dossiers bancaires qui essuieront un refus de prêt dans 3 mois ? J'ai actuellement 2 acquéreurs solvables en portefeuille sur votre secteur. Seriez-vous d'accord pour qu'on en parle 5 minutes ? »`,
    reframeQuestion: '« Si je vous présente un acquéreur sérieux avec accord bancaire sans que cela ne vous coûte le moindre euro en amont, refusez-vous d\'étudier sa proposition ? »'
  },
  {
    id: 'too_expensive',
    title: '« Vos honoraires sont trop chers par rapport aux forfaits en ligne. »',
    angle: 'Défense du prix net vendeur & Négociation agressive subie sans intermédiaire',
    pitch: `« C'est une excellente remarque. Mais la vraie question n'est pas le coût de l'agence, c'est le montant net qui arrive sur votre compte chez le notaire. Un acheteur face à un particulier sait que vous n'avez pas de frais, et va négocier immédiatement 8 à 10% de plus. Mon rôle avec mon expertise notariale locale, c'est de sanctuariser votre prix et de valoriser chaque atout pour vous obtenir le prix le plus élevé possible, net vendeur. »`,
    reframeQuestion: '« Préférez-vous payer 0€ d\'agence et baisser votre maison de 30 000 €, ou confier la vente et encaisser 15 000 € de plus au final ? »'
  },
  {
    id: 'already_simple_mandates',
    title: '« J\'ai déjà 3 agences en mandat simple. »',
    angle: 'Effet vitrine dégradée + Baisse de valeur perçue',
    pitch: `« Je vois. Mais avez-vous remarqué que votre maison apparaît 3 fois sur SeLoger à des prix parfois différents ou avec des photos de qualités inégales ? Pour un acquéreur, un bien partout donne l'impression d'un bien qui ne se vend pas et qui peut être bradé. C'est l'exclusivité qui crée la rareté et le coup de cœur. Donnez-moi 30 jours d'exclusivité avec mon plan marketing renforcé (vidéo, multidiffusion premium) ; si ce n'est pas vendu, vous reprenez votre entière liberté. »`,
    reframeQuestion: '« En 3 semaines avec 3 agences, combien d\'offres fermes avez-vous reçues sur votre table ? »'
  },
  {
    id: 'test_price',
    title: '« J\'ai le temps, je teste le marché à ce prix élevé. »',
    angle: 'La brûlure de l\'annonce & La baisse de prix inévitable',
    pitch: `« Tester le marché est tentant, mais en immobilier, un bien n'a qu'une seule fois l'effet de nouveauté : les 21 premiers jours. Passé ce délai, les acheteurs se demandent quel est le problème caché avec la maison. Ensuite, on est contraint de baisser le prix plus bas que sa valeur réelle pour relancer l'intérêt. Regardons ensemble les ventes notariées DVF réelles de votre rue pour fixer le bon prix d'attaque dès le premier jour. »`,
    reframeQuestion: '« Préférez-vous vendre au vrai prix fort maintenant, ou devoir brader dans 6 mois après avoir usé le bien sur les portails ? »'
  }
];

function computeDefaultMandateDates(durationDays = 90) {
  const now = new Date();
  const start = now.toISOString().split('T')[0];
  const end = new Date(now.getTime() + durationDays * 86400000).toISOString().split('T')[0];
  return { start, end };
}

export default function ProspectingPage() {
  const router = useRouter();
  const { prospectingLeads, createProspectingLead, updateProspectingLead, createProperty } = useNellimoStore();
  const { showToast } = useToast();

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // New Lead Modal
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSellerName, setNewSellerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPrice, setNewPrice] = useState<number>(420000);
  const [newSurface, setNewSurface] = useState<number>(120);
  const [newCity, setNewCity] = useState('Pélissanne');
  const [newSource, setNewSource] = useState<ProspectingSource>('leboncoin');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Sparring partner modal / active script
  const [activeObjectionIndex, setActiveObjectionIndex] = useState<number>(0);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const filteredLeads = prospectingLeads.filter((lead) => {
    const matchesSource = selectedSourceFilter === 'all' || lead.source === selectedSourceFilter;
    const matchesStatus = selectedStatusFilter === 'all' || lead.status === selectedStatusFilter;
    const matchesKeyword =
      lead.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      lead.seller_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      lead.seller_phone.includes(searchKeyword);
    return matchesSource && matchesStatus && matchesKeyword;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    createProspectingLead({
      source: newSource,
      source_url: newUrl,
      title: newTitle,
      property_type: 'maison',
      city: newCity,
      postal_code: newCity === 'Pélissanne' ? '13330' : newCity === 'Salon-de-Provence' ? '13300' : '13410',
      price_asked: newPrice,
      price_drops_count: 0,
      living_area: newSurface,
      rooms_count: 5,
      description: newNotes || newTitle,
      photos_urls: [],
      seller_name: newSellerName,
      seller_phone: newPhone,
      status: 'nouveau',
      call_attempts_count: 0,
      notes: newNotes,
      days_online: 1,
    });

    setIsNewLeadModalOpen(false);
    setNewTitle('');
    setNewSellerName('');
    setNewPhone('');
    setNewUrl('');
    setNewNotes('');
  };

  const handleConvertToMandate = async (lead: ProspectingLead) => {
    try {
      // Create property in portfolio
      const { start: mandateDate, end: mandateEndDate } = computeDefaultMandateDates(90);
      const newProperty = await createProperty({
        mandate_type: 'exclusif',
        mandate_date: mandateDate,
        mandate_end_date: mandateEndDate,
        status: 'brouillon',
        seller_name: lead.seller_name,
        seller_phone: lead.seller_phone,
        seller_email: 'contact@vendeur.fr',
        seller_address: `Quartier ${lead.city}`,
        title: lead.title,
        property_type: 'maison',
        address: `Quartier ${lead.city}`,
        postal_code: lead.postal_code || '13330',
        city: lead.city,
        display_exact_address: false,
        price_fai: lead.price_asked,
        price_net_seller: Math.round(lead.price_asked * 0.95),
        agency_fees_amount: Math.round(lead.price_asked * 0.05),
        agency_fees_percentage: 5,
        fees_paid_by: 'vendeur',
        living_area: lead.living_area,
        rooms_count: lead.rooms_count || 5,
        bedrooms_count: 3,
        description: `Bien issu de la prospection directe. ${lead.notes || ''}`,
        features: ['Jardin', 'Calme'],
        images: [],
        publish_website: true,
        publish_seloger: false,
        publish_leboncoin: false,
        publish_bienici: false,
      });

      // Update lead status
      updateProspectingLead(lead.id, { status: 'mandat_obtenu' });

      showToast(`Mandat N°${newProperty.mandate_number} créé avec succès en mode brouillon ! Redirection...`, 'success');
      router.push(`/cockpit/mandats/${newProperty.id}`);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la création du mandat depuis la pige.', 'error');
    }
  };

  const copyPitchText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Radar className="w-4 h-4" />
            <span>Module 05 • Radar PAP & Prospection Terrain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Pige Immobilière & Détection Vendeurs
          </h1>
          <p className="text-xs text-gray-500">
            Veille Leboncoin/PAP, comparateur DVF en direct, sparring-partner d&apos;objections et conversion en mandat en 1 clic.
          </p>
        </div>

        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajouter une Annonce Pige</span>
        </button>
      </div>

      {/* Sparring Partner Téléphonique Anti-Objections (Drawer Card) */}
      <div className="bg-gradient-to-r from-[#131B26] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C59A45]/20 text-[#C59A45] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Sparring-Partner IA : Désamorçage d&apos;Objections au Téléphone
              </h3>
              <p className="text-[11px] text-gray-300">
                Pige téléphonique à haute valeur ajoutée. Cliquez sur l&apos;objection du vendeur pour afficher la réponse psychologique certifiée.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-white/10 text-[#C59A45] border border-white/10 shrink-0">
            Méthode R1 Exclusivité
          </span>
        </div>

        {/* Objection Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {OBJECTION_SCRIPTS.map((script, idx) => (
            <button
              key={script.id}
              type="button"
              onClick={() => setActiveObjectionIndex(idx)}
              className={`p-3 rounded-2xl text-left text-xs transition border cursor-pointer ${
                activeObjectionIndex === idx
                  ? 'bg-[#E12B7B] text-white border-[#E12B7B] shadow-md'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="font-bold line-clamp-2">{script.title}</span>
            </button>
          ))}
        </div>

        {/* Active Script Card */}
        {OBJECTION_SCRIPTS[activeObjectionIndex] && (
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C59A45] uppercase tracking-wider">
                Angle psychologique : {OBJECTION_SCRIPTS[activeObjectionIndex].angle}
              </span>
              <button
                type="button"
                onClick={() => copyPitchText(OBJECTION_SCRIPTS[activeObjectionIndex].pitch)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copié !' : 'Copier le Pitch'}</span>
              </button>
            </div>

            <p className="text-xs leading-relaxed text-gray-100 font-sans italic bg-black/25 p-3 rounded-xl border border-white/5">
              {OBJECTION_SCRIPTS[activeObjectionIndex].pitch}
            </p>

            <div className="p-3 bg-[#C59A45]/10 rounded-xl border border-[#C59A45]/20 text-xs text-[#FAF6EE]">
              <strong className="text-[#C59A45]">Question de Recadrage Direct :</strong>{' '}
              <span>{OBJECTION_SCRIPTS[activeObjectionIndex].reframeQuestion}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F3E8EE] shadow-2xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une annonce par titre, nom vendeur, ville, téléphone..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="all">Toutes les sources</option>
            <option value="leboncoin">LeBonCoin</option>
            <option value="pap">PAP</option>
            <option value="paruvendu">ParuVendu</option>
            <option value="boitage">Boîtage Terrain</option>
            <option value="recommandation">Recommandation</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="all">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="a_rappeler">À rappeler</option>
            <option value="rdv_pris">RDV pris</option>
            <option value="mandat_obtenu">Mandat obtenu</option>
            <option value="refus_agent">Refus agent</option>
            <option value="deja_vendu">Déjà vendu</option>
          </select>
        </div>
      </div>

      {/* Leads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => {
          const priceM2 = Math.round(lead.price_asked / lead.living_area);
          // Benchmarks DVF Pélissanne ~3250 €/m², Salon ~3000 €/m², Lambesc ~3450 €/m²
          const benchmarkDvf = lead.city === 'Lambesc' ? 3450 : lead.city === 'Salon-de-Provence' ? 3000 : 3250;
          const diffPct = Math.round(((priceM2 - benchmarkDvf) / benchmarkDvf) * 100);

          const whatsappMessage = encodeURIComponent(
            `Bonjour ${lead.seller_name}, j'ai vu votre annonce pour votre bien à ${lead.city}. Je suis Nelly Fernandez, gérante de l'agence Nell'Immo à Pélissanne. Je ne vous démarche pas pour un mandat classique : j'ai actuellement 2 acquéreurs solvables en recherche active dont les critères correspondent à votre bien. Si vous êtes ouvert à une mise en relation qualifiée sans frais préalables, seriez-vous disponible pour un court échange téléphonique ? Belle journée !`
          );
          const cleanPhone = lead.seller_phone.replace(/\s+/g, '').replace(/^0/, '33');

          return (
            <div
              key={lead.id}
              className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {lead.source.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')} • {lead.days_online}j en ligne
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#131B26] mt-1">
                      {lead.title}
                    </h3>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    lead.status === 'mandat_obtenu'
                      ? 'bg-emerald-100 text-emerald-800'
                      : lead.status === 'rdv_pris'
                      ? 'bg-purple-100 text-purple-800'
                      : lead.status === 'a_rappeler'
                      ? 'bg-blue-100 text-blue-800'
                      : lead.status === 'refus_agent' || lead.status === 'deja_vendu'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lead.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Metrics Pill */}
                <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F3E8EE] text-xs space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendeur :</span>
                    <span className="font-bold text-gray-900">{lead.seller_name} ({lead.seller_phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Localisation :</span>
                    <span className="font-bold text-gray-900">{lead.city} • {lead.living_area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prix demandé :</span>
                    <span className="font-bold text-[#E12B7B]">{lead.price_asked.toLocaleString('fr-FR')} € ({priceM2} €/m²)</span>
                  </div>
                </div>

                {/* DVF Gap Analyzer */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                  diffPct > 5
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-bold block text-[11px]">
                      Écart avec le Marché Notaires DVF (~{benchmarkDvf} €/m²)
                    </span>
                    <span className="text-[10px] text-gray-600 block">
                      {diffPct > 0 ? `Surévalué de +${diffPct}% par rapport aux actes réels` : `Prix cohérent avec les ventes réelles`}
                    </span>
                  </div>
                  <div className="text-right font-black text-sm">
                    {diffPct > 0 ? `+${diffPct}%` : `${diffPct}%`}
                  </div>
                </div>

                {lead.notes && (
                  <p className="text-[11px] text-gray-600 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    « {lead.notes} »
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${lead.seller_phone}`}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Appeler
                  </a>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  {lead.source_url && (
                    <a
                      href={lead.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center transition"
                      title="Voir annonce"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* 1-Click Mandate Conversion */}
                {lead.status !== 'mandat_obtenu' && (
                  <button
                    type="button"
                    onClick={() => handleConvertToMandate(lead)}
                    className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
                    <span>Transformer en Mandat Officiel (1 Clic)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NOUVELLE ANNONCE PIGE */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Ajouter une Annonce de Particulier (Pige)
              </h3>
              <button onClick={() => setIsNewLeadModalOpen(false)} className="text-gray-400 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Titre de l&apos;Annonce</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Villa contemporaine 120m² Pélissanne"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Nom du Vendeur</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: M. Bernard"
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    placeholder="06..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Prix Vendeur (€)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Surface (m²)</label>
                  <input
                    type="number"
                    required
                    value={newSurface}
                    onChange={(e) => setNewSurface(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Commune</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Source de l&apos;Annonce</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as ProspectingSource)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  >
                    <option value="leboncoin">LeBonCoin</option>
                    <option value="pap">PAP</option>
                    <option value="paruvendu">ParuVendu</option>
                    <option value="boitage">Boîtage Terrain</option>
                    <option value="recommandation">Recommandation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Lien Web de l&apos;Annonce</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Notes & Contexte</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Vente cause mutation, annonce en ligne depuis 3 semaines..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                Enregistrer dans le Radar de Pige
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
