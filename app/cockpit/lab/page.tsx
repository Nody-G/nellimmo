'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  Lightbulb,
  Sparkles,
  Bot,
  BrainCircuit,
  FileSignature,
  PartyPopper,
  Copy,
  Check,
  RefreshCw,
  Flame
} from 'lucide-react';

type LabMode = 'ideation' | 'negotiation' | 'legal_clauses' | 'vip_events';

const LAB_PRESETS = [
  {
    mode: 'ideation' as LabMode,
    title: '5 Idées Innovantes pour Réveiller un Mandat Endormi (>60j)',
    prompt: 'Propose 5 actions marketing percutantes et non conventionnelles pour relancer un mandat de maison provençale sans baisser le prix brutalement.'
  },
  {
    mode: 'ideation' as LabMode,
    title: 'Opération Chasseur Foncier : Détection de Parcelles Piscines & Divisions',
    prompt: 'Comment aborder les propriétaires de grandes parcelles de 1500m²+ à Pélissanne pour leur proposer une division parcellaire créatrice de valeur ?'
  },
  {
    mode: 'negotiation' as LabMode,
    title: 'Contre-Attaque Face à une Offre Agressive à -10%',
    prompt: 'Un acheteur formule une offre écrite à 430 000 € sur un bien affiché à 475 000 €. Rédige la réponse psychologique pour ramener l\'acheteur à 462 000 € sans froisser le vendeur.'
  },
  {
    mode: 'legal_clauses' as LabMode,
    title: 'Clause Suspensive de Division Parcellaire Sécurisée',
    prompt: 'Rédige une clause suspensive rédigée avec rigueur juridique notariale pour conditionner un compromis à l\'obtention d\'une déclaration préalable de division sans recours des tiers.'
  },
  {
    mode: 'vip_events' as LabMode,
    title: 'Organisation d\'une Soirée VIP Nocturne "Aperitivo & Visite"',
    prompt: 'Génère le déroulé opérationnel complet et le texte d\'invitation WhatsApp pour une visite nocturne exclusive avec dégustation de vin des Coteaux d\'Aix.'
  }
];

export default function InfiniteLabPage() {
  const { properties } = useNellimoStore();

  const [activeMode, setActiveMode] = useState<LabMode>('ideation');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [userPrompt, setUserPrompt] = useState<string>(LAB_PRESETS[0].prompt);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const handleApplyPreset = (preset: typeof LAB_PRESETS[0]) => {
    setActiveMode(preset.mode);
    setUserPrompt(preset.prompt);
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    setGeneratedOutput('');

    try {
      // La clé DeepSeek est gérée côté serveur (env DEEPSEEK_API_KEY).
      // On tente toujours l'appel cloud ; le serveur bascule sur le moteur
      // local s'il n'a pas de clé configurée.
      const res = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: currentProperty,
          style: 'mode_libre',
          customNotes: `LAB NELL'IMMO - Mode: ${activeMode}. Consigne: ${userPrompt}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setGeneratedOutput(data.text);
        setIsProcessing(false);
        return;
      }

      // Local heuristic simulation engine if API key not set
      await new Promise((r) => setTimeout(r, 800));

      if (activeMode === 'ideation') {
        setGeneratedOutput(`💡 PLAN D'ACTION STRATÉGIQUE & IDÉES DISRUPTIVES — NELL'IMMO
Bien ciblé : ${currentProperty?.title} (${currentProperty?.city})

1. Vente Privée en Nocturne "Lumières & Saveurs de Provence"
Organiser une visite sur invitation exclusive à l'heure dorée (19h-21h) avec mise en lumière du jardin, bougies au bord de la piscine et dégustation de produits du terroir salonais. L'ambiance olfactive et visuelle désinhibe la négociation.

2. Démarcheur "Voisins Ambassadeurs"
Envoyer un courrier haut de gamme et un flyer soigné aux 40 voisins les plus proches : « Vous aimez votre quartier ? Choisissez vous-même votre futur voisin ! ». 15% des acquéreurs proviennent de la recommandation de l'entourage immédiat.

3. Projection Architecturale 3D "Potentiel Révélé"
Si le bien nécessite un rafraîchissement, fournir un devis chiffré par un artisan local partenaire de confiance et 2 plans 3D avant/après. L'acheteur n'achète plus des doutes, mais un projet clés en main.

4. Vidéo Teaser "Immersion dans les Collines"
Tournage d'un Reel dynamique de 45 secondes axé sur le style de vie (bruit des cigales, marché du dimanche à Pélissanne à pied, apéritif sous la tonnelle) plutôt qu'un simple inventaire de pièces.

5. Campagne Ciblée Cadres TGV Aix / Marseille
Cibler les acquéreurs en télétravail quittant les métropoles saturées pour la quiétude provençale, avec mise en avant du temps de trajet Gare TGV d'Aix (30 min) et de la fibre optique installée.`);
      } else if (activeMode === 'negotiation') {
        setGeneratedOutput(`🛡️ PROTOCOLE DE NÉGOCIATION & CONTRE-OFFRE TACTIQUE
Bien : ${currentProperty?.title} (${currentProperty?.city}) — Prix affiché : ${currentProperty?.price_fai.toLocaleString('fr-FR')} €

ANALYSE PSYCHOLOGIQUE :
L'acheteur teste la fermeté du vendeur. Accepter immédiatement dévalue le bien ; refuser sèchement brise le lien.

STRATÉGIE RETENUE : LA CONCESSION SYMBOLIQUE FERME (+ ARGUMENTAIRE DVF)

Argumentaire téléphonique pour l'acquéreur :
« Bonjour Monsieur l'acquéreur, j'ai présenté votre offre à mes mandants. Ils apprécient la qualité de votre profil mais ne peuvent donner une suite favorable en l'état : le prix a été calé rigoureusement sur les transactions réelles DVF enregistrées par les notaires dans le quartier.
Néanmoins, pour vous témoigner de leur bienveillance et concrétiser avec vous, ils sont prêts à faire un geste d'équité en vous accordant une remise technique de 2.5%, à la condition expresse que le compromis soit signé sous 8 jours avec validation définitive de votre plan de financement. »

Script de recadrage écrit pour le vendeur :
« Chers vendeurs, nous avons la main. Cette première offre prouve que le bien intéresse. En contre-proposant fermement, nous forçons l'acheteur à remonter sur le bon palier sans perdre notre exclusivité. »`);
      } else if (activeMode === 'legal_clauses') {
        setGeneratedOutput(`⚖️ CLAUSE CONTRACTUELLE SUR-MESURE (CODE CIVIL & HOGUET)

INTITULÉ : CONDITION SUSPENSIVE PARTICULIÈRE DE DIVISION PARCELLAIRE

« La présente convention est expressément soumise à la condition suspensive de l'obtention, par le BENEFICIAIRE ou par le PROMETTANT, d'une décision de non-opposition à Déclaration Préalable de division délivrée par la Mairie de ${currentProperty?.city || 'la commune concernée'}, autorisant le détachement d'un lot à bâtir d'une superficie approximative de [Surface] m², conformément au plan de bornage dressé par géomètre-expert.

Cette décision devra être exempte de tout recours gracieux ou contentieux émanant de tiers ou de l'autorité préfectorale, le constat de non-recours étant attesté soit par certificat administratif, soit par huissier de justice après écoulement du délai de deux mois d'affichage continu sur le terrain.

En cas de refus définitif ou de recours non purgé à l'expiration du délai de [Nombre] mois à compter de ce jour, les présentes seront réputées nulles et non avenues, chaque partie reprenant sa pleine liberté sans indemnité de part ni d'autre. »`);
      } else {
        setGeneratedOutput(`🎉 KIT DE LANCEMENT D'ÉVÉNEMENT IMMOBILIER VIP
Concept : Vente Privée en Avant-Première — Résidence & Charme

INVITATION WHATSAPP / SMS VENDEURS & ACQUÉREURS SÉLECTIONNÉS :
« Bonsoir [Prénom], vous faites partie de nos acquéreurs privilégiés.
Ce jeudi à 18h30, l'agence Nell'Immo vous ouvre les portes en exclusivité d'une propriété d'exception à ${currentProperty?.city || 'Pélissanne'} avant toute diffusion publique sur les portails.
Au programme : visite libre au crépuscule, échange convivial autour d'une dégustation de vins du Domaine local, et découverte du dossier technique complet.
Nombre de places limité à 6 foyers. Merci de me confirmer votre présence par retour de message avant mardi soir. Nelly Fernandez (07 55 68 61 09). »

CHECKLIST DU JOUR J :
□ 17h00 : Arrivée sur place, aération, allumage des éclairages d'ambiance et piscine
□ 17h30 : Mise en place du buffet provençal (fougasses, tapenade, verres à pied)
□ 18h00 : Fiches vitrines HD et plans imprimés à disposition sur la table du salon
□ 18h30 : Accueil échelonné, remise du bon de visite et visite libre guidée
□ 20h00 : Débriefing à chaud et recueil des intentions d'offre d'achat.`);
      }
    } catch (e) {
      console.error(e);
      setGeneratedOutput("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <BrainCircuit className="w-4 h-4" />
            <span>Incubateur d&apos;Idées & Intelligence Augmentée</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Nell&apos;IA Infinite Lab
          </h1>
          <p className="text-xs text-gray-500">
            L&apos;atelier sans aucune limite : brainstorming d&apos;angles novateurs, simulations de négociation, clauses juridiques et événements VIP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FCFAF7] border border-[#E9DFD3] text-[#C59A45] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Potentiel 100% Illimité</span>
          </span>
        </div>
      </div>

      {/* Workshop Mode Selector (4 Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveMode('ideation');
            setUserPrompt(LAB_PRESETS[0].prompt);
          }}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${activeMode === 'ideation'
            ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            }`}
        >
          <Lightbulb className="w-5 h-5 text-[#C59A45]" />
          <h3 className="font-serif font-bold text-sm">1. Idéation & Brainstorming</h3>
          <p className="text-[11px] opacity-75 leading-tight">Relancer des mandats, concepts marketing, partenariats locaux.</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('negotiation');
            setUserPrompt(LAB_PRESETS[2].prompt);
          }}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${activeMode === 'negotiation'
            ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            }`}
        >
          <Bot className="w-5 h-5 text-[#E12B7B]" />
          <h3 className="font-serif font-bold text-sm">2. Sparring Négociation</h3>
          <p className="text-[11px] opacity-75 leading-tight">Contre-offres chirurgicales, gestion des refus, psychologie d&apos;achat.</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('legal_clauses');
            setUserPrompt(LAB_PRESETS[3].prompt);
          }}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${activeMode === 'legal_clauses'
            ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            }`}
        >
          <FileSignature className="w-5 h-5 text-[#C59A45]" />
          <h3 className="font-serif font-bold text-sm">3. Clauses & Juridique</h3>
          <p className="text-[11px] opacity-75 leading-tight">Divisions, servitudes, purges d&apos;urbanisme, rédactions complexes.</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('vip_events');
            setUserPrompt(LAB_PRESETS[4].prompt);
          }}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${activeMode === 'vip_events'
            ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            }`}
        >
          <PartyPopper className="w-5 h-5 text-[#E12B7B]" />
          <h3 className="font-serif font-bold text-sm">4. Événements & Ventes VIP</h3>
          <p className="text-[11px] opacity-75 leading-tight">Soirées nocturnes, invitations personnalisées, check-lists terrain.</p>
        </button>
      </div>

      {/* Quick Inspiration Presets Bar */}
      <div className="bg-gradient-to-r from-[#FCFAF7] to-white rounded-3xl p-5 border border-[#E9DFD3] space-y-2">
        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
          Suggestions d&apos;inspiration rapide :
        </span>
        <div className="flex flex-wrap gap-2">
          {LAB_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-800 border border-gray-200 transition cursor-pointer shadow-2xs text-left"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Bien de Référence du Portefeuille
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center justify-between">
              <span>Consigne Libre / Sujet du Laboratoire</span>
              <span className="text-[10px] text-[#E12B7B] font-bold">Zéro limite d&apos;idée</span>
            </label>
            <textarea
              rows={6}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Exprimez librement votre besoin : stratégie d'approche, objection complexe d'un acquéreur, clause d'urbanisme spécifique..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs leading-relaxed focus:outline-[#E12B7B]"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Exploration en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Lancer le Laboratoire d&apos;Idéation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-4 min-h-[480px] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-0.5 rounded-full">
                  Résultat Laboratoire
                </span>
                <span className="text-xs text-gray-400">
                  {activeMode.toUpperCase()}
                </span>
              </div>

              {generatedOutput && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              )}
            </div>

            {generatedOutput ? (
              <pre className="text-xs font-sans text-gray-800 whitespace-pre-wrap leading-relaxed bg-[#FCFAF7] p-5 rounded-2xl border border-[#F3E8EE] shadow-inner max-h-[500px] overflow-y-auto">
                {generatedOutput}
              </pre>
            ) : (
              <div className="p-12 text-center text-gray-400 text-xs space-y-2 my-auto">
                <BrainCircuit className="w-8 h-8 text-gray-300 mx-auto" />
                <p>Choisissez un mode ou saisissez votre idée à gauche, puis cliquez sur &laquo; Lancer le Laboratoire &raquo;.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Nell&apos;IA Engine • Pensé pour débloquer toutes les situations immobilières</span>
            <span className="font-bold text-[#C59A45]">SASU Nell&apos;Immo</span>
          </div>
        </div>

      </div>

    </div>
  );
}
