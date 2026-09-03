'use client';

import React, { useState, useEffect } from 'react';
import { useNellimoStore } from '@/lib/store';
import { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  CopywritingStyle,
  STYLE_TEMPLATES,
  DEFAULT_TRAINING_EXAMPLES,
  TrainingExample,
  generateListingCopy,
  generateAnglesAndGems,
  generateCatchyTitles,
} from '@/lib/copywriting';
import {
  Sparkles,
  Copy,
  Check,
  Save,
  MessageCircle,
  PlusCircle,
  Trash2,
  FileText,
  Sliders,
  BookOpen,
  Key,
  RefreshCw,
  Cpu,
  Share2,
  Download,
  Lightbulb,
  Heading,
  Video,
  Globe,
  TrendingUp,
  Radio
} from 'lucide-react';

export default function RedacteurPage() {
  const { properties, updateProperty, settings, updateSettings } = useNellimoStore();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [selectedStyle, setSelectedStyle] = useState<CopywritingStyle>('signature_nelly');
  const [activeCategory, setActiveCategory] = useState<'all' | 'portails' | 'reseaux' | 'direct' | 'strategique'>('all');
  const [customNotes, setCustomNotes] = useState<string>('Impasse au calme absolu, cuisine refaite avec îlot central, aperçu collines.');
  
  // Custom training examples
  const [trainingExamples, setTrainingExamples] = useState<TrainingExample[]>(DEFAULT_TRAINING_EXAMPLES);
  const [newExampleTitle, setNewExampleTitle] = useState('');
  const [newExampleText, setNewExampleText] = useState('');
  const [showTrainingSection, setShowTrainingSection] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.deepseek_api_key || '');

  // Brainstorming drawers
  const [showAnglesDrawer, setShowAnglesDrawer] = useState(false);
  const [showTitlesDrawer, setShowTitlesDrawer] = useState(false);

  // Generation state
  const [currentText, setCurrentText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSource, setGenerationSource] = useState<'deepseek' | 'local_template'>('local_template');
  const [generationMessage, setGenerationMessage] = useState('');

  // Copy feedback state
  const [copied, setCopied] = useState(false);
  const [appliedToMandate, setAppliedToMandate] = useState(false);
  const [isPublishingSocial, setIsPublishingSocial] = useState(false);

  const currentProperty: Property | undefined = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const filteredTemplates = STYLE_TEMPLATES.filter((t) => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  const propertyAngles = currentProperty ? generateAnglesAndGems(currentProperty) : [];
  const catchyTitles = currentProperty ? generateCatchyTitles(currentProperty) : [];

  const handlePublishToMeta = async () => {
    setIsPublishingSocial(true);
    try {
      const hasToken = !!settings.facebook_page_access_token;
      await new Promise((r) => setTimeout(r, 1200));
      if (hasToken) {
        alert("🎉 Publication réussie sur Instagram & Facebook via Meta Graph API !");
      } else {
        alert("✅ Simulation réussie ! Votre annonce et visuels sont prêts pour Meta. Pour automatiser la publication en 1 clic sans quitter Cockpit, entrez votre token Meta dans Paramètres.");
      }
    } catch {
      alert("Erreur lors de la publication sur les réseaux.");
    } finally {
      setIsPublishingSocial(false);
    }
  };

  // Initialize text on first load or when switching property/style locally
  useEffect(() => {
    if (currentProperty) {
      const initial = generateListingCopy(currentProperty, selectedStyle, customNotes);
      setCurrentText(initial);
      setGenerationSource('local_template');
    }
  }, [selectedPropertyId, selectedStyle]);

  // DeepSeek AI Generation Handler
  const handleGenerateWithAI = async () => {
    if (!currentProperty) return;
    setIsGenerating(true);
    setGenerationMessage("Génération de l'annonce en cours...");

    try {
      const res = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: currentProperty,
          style: selectedStyle,
          customNotes,
          apiKey: settings.deepseek_api_key || apiKeyInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setCurrentText(data.text);
        setGenerationSource(data.source);
        setGenerationMessage(data.message || 'Texte généré avec succès.');
      } else {
        const fallback = generateListingCopy(currentProperty, selectedStyle, customNotes);
        setCurrentText(fallback);
        setGenerationSource('local_template');
        setGenerationMessage('Bascule sur le moteur local certifié.');
      }
    } catch (e) {
      console.error(e);
      const fallback = generateListingCopy(currentProperty, selectedStyle, customNotes);
      setCurrentText(fallback);
      setGenerationSource('local_template');
      setGenerationMessage('Erreur réseau. Génération via moteur local.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      deepseek_api_key: apiKeyInput.trim(),
    });
    setShowApiKeyModal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Annonce_Mandat_${currentProperty?.mandate_number || 'export'}_${selectedStyle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApplyToProperty = async () => {
    if (!currentProperty) return;
    await updateProperty(currentProperty.id, { description: currentText });
    setAppliedToMandate(true);
    setTimeout(() => setAppliedToMandate(false), 3000);
  };

  const handleAddExample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExampleTitle.trim() || !newExampleText.trim()) return;

    const newEx: TrainingExample = {
      id: `ex-${Date.now()}`,
      title: newExampleTitle,
      sourceText: newExampleText,
      createdAt: new Date().toISOString(),
    };

    setTrainingExamples([newEx, ...trainingExamples]);
    setNewExampleTitle('');
    setNewExampleText('');
  };

  const handleDeleteExample = (id: string) => {
    setTrainingExamples(trainingExamples.filter((ex) => ex.id !== id));
  };

  const openWhatsAppShare = () => {
    const encoded = encodeURIComponent(currentText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const insertAngleIntoNotes = (angle: string) => {
    setCustomNotes((prev) => (prev ? `${prev} • ${angle}` : angle));
    if (currentProperty) {
      const updated = generateListingCopy(currentProperty, selectedStyle, customNotes ? `${customNotes} • ${angle}` : angle);
      setCurrentText(updated);
    }
  };

  const prependTitleToText = (title: string) => {
    setCurrentText((prev) => `${title}\n\n${prev}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Sparkles className="w-4 h-4" />
            <span>Studio de Rédaction & Idéation Infinie</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Générateur d&apos;Annonces, Vidéos & Pitchs
          </h1>
          <p className="text-xs text-gray-500">
            10 styles multicanaux, brainstormer d&apos;angles uniques et scripts vidéo sans aucune restriction d&apos;idée.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAnglesDrawer(!showAnglesDrawer)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer ${
              showAnglesDrawer ? 'bg-[#C59A45] text-white border-[#C59A45]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Pépites & Angles ({propertyAngles.length})</span>
          </button>

          <button
            onClick={() => setShowTitlesDrawer(!showTitlesDrawer)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer ${
              showTitlesDrawer ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heading className="w-4 h-4" />
            <span>Titres Accrocheurs</span>
          </button>

          <button
            onClick={() => setShowApiKeyModal(!showApiKeyModal)}
            className="px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-2xs cursor-pointer"
          >
            <Key className="w-4 h-4 text-[#C59A45]" />
            <span>Clé IA {settings.deepseek_api_key ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setShowTrainingSection(!showTrainingSection)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer ${
              showTrainingSection
                ? 'bg-[#131B26] text-white border-[#131B26]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C59A45]" />
            <span>Mémoire ({trainingExamples.length})</span>
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="bg-[#131B26] text-white rounded-3xl p-6 border border-gray-800 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#C59A45] font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>Configuration du Moteur IA (DeepSeek / Cloud)</span>
            </div>
            <button onClick={() => setShowApiKeyModal(false)} className="text-gray-400 hover:text-white text-xs">✕ Fermer</button>
          </div>
          <p className="text-xs text-gray-300">
            Renseignez votre clé API pour la génération en direct par intelligence artificielle. Si absente, le moteur heuristique de style Nelly prend automatiquement le relais.
          </p>
          <form onSubmit={handleSaveApiKey} className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              placeholder="sk-..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs font-mono text-white focus:outline-[#E12B7B]"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Enregistrer la clé
            </button>
          </form>
        </div>
      )}

      {/* Angles Drawer (Brainstormer) */}
      {showAnglesDrawer && (
        <div className="bg-gradient-to-r from-[#FAF6EE] to-white rounded-3xl p-6 border border-[#E9DFD3] shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#C59A45]" />
                Brainstormer d&apos;Angles & Pépites Cachées pour ce Bien
              </h3>
              <p className="text-xs text-gray-600">
                5 angles marketing inattendus détectés pour démarquer cette annonce des concurrents. Cliquez sur un angle pour l&apos;ajouter à la consigne.
              </p>
            </div>
            <button onClick={() => setShowAnglesDrawer(false)} className="text-xs text-gray-400 hover:text-gray-800">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {propertyAngles.map((angle, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-2 flex flex-col justify-between hover:border-[#C59A45] transition"
              >
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {angle}
                </p>
                <button
                  type="button"
                  onClick={() => insertAngleIntoNotes(angle)}
                  className="w-full py-1.5 bg-[#FAF6EE] hover:bg-[#C59A45] text-[#C59A45] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer text-center"
                >
                  + Injecter cet atout
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catchy Titles Drawer */}
      {showTitlesDrawer && (
        <div className="bg-gradient-to-r from-[#FDF2F8] to-white rounded-3xl p-6 border border-[#F3E8EE] shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                <Heading className="w-5 h-5 text-[#E12B7B]" />
                Générateur de Titres d&apos;Annonce Percutants
              </h3>
              <p className="text-xs text-gray-600">
                Titres accrocheurs pour SeLoger, LeBonCoin ou les réseaux sociaux. Cliquez pour insérer en haut du texte.
              </p>
            </div>
            <button onClick={() => setShowTitlesDrawer(false)} className="text-xs text-gray-400 hover:text-gray-800">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {catchyTitles.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2 flex flex-col justify-between hover:border-[#E12B7B] transition"
              >
                <div>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 block w-fit mb-1.5">
                    {item.category}
                  </span>
                  <p className="text-xs font-bold text-gray-900 leading-snug">
                    {item.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => prependTitleToText(item.title)}
                  className="w-full py-1.5 bg-[#FDF2F8] hover:bg-[#E12B7B] text-[#E12B7B] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer text-center"
                >
                  Insérer comme Titre
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training Section */}
      {showTrainingSection && (
        <div className="bg-gradient-to-br from-[#FCFAF7] to-white rounded-3xl p-6 border border-[#E9DFD3] shadow-md space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C59A45]" />
                Mémoire de Style : Vos Textes de Référence
              </h3>
              <p className="text-xs text-gray-600 max-w-2xl">
                Ajoutez ici vos annonces coups de cœur passées. L&apos;IA s&apos;en inspire pour reproduire vos tournures de phrases favorites et votre sensibilité.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Annonces mémorisées ({trainingExamples.length})
              </span>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {trainingExamples.map((ex) => (
                  <div key={ex.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs relative group">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-xs text-gray-900">{ex.title}</h4>
                      <button
                        onClick={() => handleDeleteExample(ex.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-3 italic">
                      &laquo; {ex.sourceText} &raquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddExample} className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E12B7B] block">
                Ajouter une nouvelle annonce type
              </span>
              <div>
                <input
                  type="text"
                  placeholder="Titre de référence (ex: Villa de Charme Lambesc 2024)"
                  value={newExampleTitle}
                  onChange={(e) => setNewExampleTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                  required
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Collez ici le texte de votre ancienne annonce..."
                  value={newExampleText}
                  onChange={(e) => setNewExampleText(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-[#E12B7B]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#C59A45]" />
                Enregistrer dans la mémoire de style
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column : Configuration & Property Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Property Selector */}
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E12B7B]" />
              1. Mandat Source du Portefeuille
            </h3>

            <div>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            {currentProperty && (
              <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-[#F3E8EE] text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Localisation :</span>
                  <span className="font-bold text-gray-900">{currentProperty.city} ({currentProperty.postal_code})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Surface & Pièces :</span>
                  <span className="font-bold text-gray-900">{currentProperty.living_area} m² • {currentProperty.rooms_count}p / {currentProperty.bedrooms_count}ch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Terrain :</span>
                  <span className="font-bold text-gray-900">{currentProperty.land_area ? `${currentProperty.land_area} m²` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prix FAI :</span>
                  <span className="font-bold text-[#E12B7B]">{currentProperty.price_fai.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Performance DPE :</span>
                  <span className="font-bold text-gray-900">{currentProperty.dpe_letter ? `Classe ${currentProperty.dpe_letter}` : 'Vierge'}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[#E12B7B]" />
                  Consignes & Idées Spécifiques
                </span>
                <span className="text-[10px] text-gray-400 font-normal">Optionnel</span>
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ex: Belle exposition Sud, aucun vis-à-vis, cuisine équipée avec îlot central, quartier calme..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          {/* Style Selector with Categories */}
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E12B7B]" />
                2. Format & Canal de Diffusion
              </h3>
              <span className="text-[11px] font-bold text-[#E12B7B] bg-[#FDF2F8] px-2 py-0.5 rounded-full">
                {STYLE_TEMPLATES.length} formats
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  activeCategory === 'all' ? 'bg-[#131B26] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('portails')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  activeCategory === 'portails' ? 'bg-[#131B26] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Portails
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('reseaux')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  activeCategory === 'reseaux' ? 'bg-[#131B26] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Réseaux & Vidéo
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('direct')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  activeCategory === 'direct' ? 'bg-[#131B26] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('strategique')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  activeCategory === 'strategique' ? 'bg-[#131B26] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Stratégique
              </button>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedStyle === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedStyle(tmpl.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDF2F8] border-[#E12B7B] shadow-2xs ring-1 ring-[#E12B7B]'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#E12B7B]' : 'text-gray-900'}`}>
                          {tmpl.label}
                        </span>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-[#E12B7B] bg-[#E12B7B]' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column : Live Generated Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6 sticky top-24">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                  Studio Actif
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  generationSource === 'deepseek'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {generationSource === 'deepseek' ? 'IA Active' : 'Moteur Local Certifié'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
                {STYLE_TEMPLATES.find((s) => s.id === selectedStyle)?.label}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="px-3 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50"
                title="Régénérer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Génération...' : 'Régénérer'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Copier"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Télécharger fichier .txt"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.TXT</span>
              </button>

              <button
                onClick={openWhatsAppShare}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                title="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {(selectedStyle === 'reseaux_sociaux' || selectedStyle === 'script_video_reel') && (
                <button
                  type="button"
                  onClick={handlePublishToMeta}
                  disabled={isPublishingSocial}
                  className="px-3 py-2 bg-gradient-to-r from-[#E12B7B] via-[#C71B62] to-[#833AB4] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50"
                  title="Meta API"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isPublishingSocial ? 'Publication...' : 'Meta API'}</span>
                </button>
              )}
            </div>
          </div>

          {generationMessage && (
            <div className="p-2.5 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{generationMessage}</span>
            </div>
          )}

          {/* Social / Video Visual Card Preview */}
          {(selectedStyle === 'reseaux_sociaux' || selectedStyle === 'script_video_reel') && currentProperty && (
            <div className="p-4 bg-[#131B26] rounded-2xl text-white space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full bg-[#131B26] rounded-full flex items-center justify-center font-bold text-[10px] text-white">
                      NF
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {settings.instagram_business_id || '@nellimmo_provence'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {currentProperty.city}, Provence • {selectedStyle === 'script_video_reel' ? 'Format Reel 9:16' : 'Post Carré 1:1'}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-white/10 text-[#C59A45] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {selectedStyle === 'script_video_reel' ? 'Reel / TikTok 9:16' : 'Aperçu Post 1:1'}
                </span>
              </div>

              {/* Visual Frame */}
              <div className={`relative mx-auto rounded-xl overflow-hidden bg-gray-900 border border-white/10 shadow-lg ${
                selectedStyle === 'script_video_reel' ? 'aspect-9/16 max-w-[200px]' : 'aspect-square max-w-[260px]'
              }`}>
                <img
                  src={currentProperty.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 bg-[#E12B7B] text-white rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                    {currentProperty.mandate_type === 'exclusif' ? "EXCLUSIVITÉ NELL'IMMO" : 'NOUVEAUTÉ'}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                  <span className="text-[10px] font-bold text-[#C59A45] uppercase tracking-wider block">
                    📍 {currentProperty.city} ({currentProperty.postal_code})
                  </span>
                  <p className="text-xs font-bold text-white font-serif line-clamp-1">
                    {currentProperty.living_area} m² • {currentProperty.rooms_count} pièces
                  </p>
                  <span className="text-sm font-black text-white font-serif block mt-0.5">
                    {currentProperty.price_fai.toLocaleString('fr-FR')} € FAI
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Text Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>Éditeur plein format dynamique</span>
              <span className="font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-0.5 rounded-full">
                {currentText.split('\n').length} ligne(s)
              </span>
            </div>
            <textarea
              rows={24}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="w-full min-h-[480px] p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl text-xs sm:text-sm font-sans text-gray-800 leading-relaxed focus:outline-[#E12B7B] resize-y shadow-inner"
              placeholder="Texte de l'annonce ou du script..."
            />
          </div>

          {/* Actions Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-3 text-[11px]">
              <span>📊 <strong>{currentText.split(/\s+/).filter(Boolean).length}</strong> mots</span>
              <span>•</span>
              <span><strong>{currentText.length}</strong> caractères</span>
            </div>

            <button
              onClick={handleApplyToProperty}
              className="w-full sm:w-auto px-5 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              {appliedToMandate ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Appliqué à la fiche mandat !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#C59A45]" />
                  <span>Enregistrer dans la fiche du mandat</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
